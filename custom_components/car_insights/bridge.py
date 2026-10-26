"""Turns the publishers' MQTT discovery and state messages into Home Assistant entities, without a broker."""
import json
import logging
import re
from collections import defaultdict
from typing import Any, Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import slugify

from .const import DOMAIN
from .core.totals_sensors import GROUP_PREFIX

log = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.DEVICE_TRACKER, Platform.EVENT]
_KEY = re.compile(r"value_json\.(\w+)")  # the only template form the publishers use


class BridgeEntity(Entity):
    """An entity described by a discovery config, fed by the payloads of its state and attributes topics."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, cfg: dict):
        self.cfg = cfg
        self._attr_unique_id, self._attr_name = cfg["unique_id"], cfg["name"]
        d = cfg["device"]
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, i) for i in d["identifiers"]}, name=d["name"],
                                            **{k: d[k] for k in ("manufacturer", "model") if k in d})
        m = _KEY.search(cfg.get("value_template", ""))
        self.key = m[1] if m else None
        self.topics = {cfg[k] for k in ("state_topic", "json_attributes_topic") if k in cfg}
        self.added = self.gone = False

    def apply(self, topic: str, data: Any) -> None:
        if not isinstance(data, dict):
            return
        if topic == self.cfg.get("state_topic"):
            self.on_state(data)
        if topic == self.cfg.get("json_attributes_topic"):
            self.on_attributes(data)
        if self.added:
            self.async_write_ha_state()

    def on_state(self, data: dict) -> None:
        pass

    def on_attributes(self, data: dict) -> None:
        self._attr_extra_state_attributes = data

    async def async_added_to_hass(self) -> None:
        self.added = True
        if self.gone:  # removed while HA was still adding it; the add is not finished until we return
            self.hass.loop.call_soon(self._drop)

    @callback
    def _drop(self) -> None:
        if self.entity_id in er.async_get(self.hass).entities:
            _unregister(self.hass, self.entity_id)
        self.hass.async_create_task(self.async_remove(force_remove=True))

    async def async_will_remove_from_hass(self) -> None:
        self.added = False


def _unregister(hass: HomeAssistant, entity_id: str) -> None:
    """Removes an entity from the registry, and its device once that has no entities left."""
    reg = er.async_get(hass)
    device_id = reg.entities[entity_id].device_id
    reg.async_remove(entity_id)
    if device_id and not er.async_entries_for_device(reg, device_id, include_disabled_entities=True):
        dr.async_get(hass).async_remove_device(device_id)


class Bridge:
    """Implements the publishers' Sink. Configs and retained states are kept; an entity is made once its config
    has a home: the entry of its vehicle, or for a cost group the first entry that set up the platform."""

    def __init__(self, hass: HomeAssistant):
        self._hass = hass
        self._configs: dict[str, dict] = {}  # by config topic
        self._states: dict[str, Any] = {}  # retained payloads by state topic
        self._entities: dict[str, tuple[str, BridgeEntity]] = {}  # by config topic: (entry id, entity)
        self._adders: dict[tuple[str, str], tuple[ConfigEntry, AddEntitiesCallback, Callable[[dict], BridgeEntity]]] = {}  # by (entry id, platform)

    def publish(self, messages: list[tuple[str, str]], retain: bool = True) -> None:
        """Thread-safe: the publishers run in worker threads."""
        self._hass.loop.call_soon_threadsafe(self._handle, list(messages), retain)

    def async_register(self, entry: ConfigEntry, platform: str, add: AddEntitiesCallback, factory: Callable[[dict], BridgeEntity]) -> None:
        self._adders[entry.entry_id, platform] = (entry, add, factory)
        self._sync()

    def async_unregister(self, entry: ConfigEntry, platform: str) -> None:
        """The platform's unload removes the entities; forget them so a reload makes them again."""
        self._adders.pop((entry.entry_id, platform), None)
        self._entities = {t: v for t, v in self._entities.items() if (v[0], t.split("/")[1]) != (entry.entry_id, platform)}
        self._sync()  # the groups that lived on this entry move to the next one

    def _handle(self, messages: list[tuple[str, str]], retain: bool) -> None:
        configs = False
        for topic, payload in messages:
            try:
                if topic.startswith("homeassistant/") and topic.endswith("/config"):
                    configs = True
                    self._config(topic, payload)
                else:
                    self._state(topic, payload, retain)
            except ValueError:
                log.warning("Ignoring a malformed message on %s", topic)
        if configs:
            self._sync()

    def _config(self, topic: str, payload: str) -> None:
        _, comp, objid, _ = topic.split("/")
        if payload:
            if comp in PLATFORMS:
                if not isinstance(cfg := json.loads(payload), dict):
                    raise ValueError("config is no object")
                self._configs[topic] = cfg  # shortcut: a changed config of an existing entity applies at its next creation (reload)
            return
        self._configs.pop(topic, None)
        if ent := self._entities.pop(topic, None):
            ent[1].gone = True
        if eid := er.async_get(self._hass).async_get_entity_id(comp, DOMAIN, f"car_insights_{objid}"):  # the platform drops a live entity on the registry event
            _unregister(self._hass, eid)

    def _state(self, topic: str, payload: str, retain: bool) -> None:
        if not payload:  # the publishers clear a retained state with an empty one
            self._states.pop(topic, None)
            return
        data = json.loads(payload)
        if retain:
            self._states[topic] = data
        for _, ent in list(self._entities.values()):
            if topic in ent.topics:
                ent.apply(topic, data)

    def _home(self, comp: str, key: str) -> tuple[ConfigEntry, AddEntitiesCallback, Callable[[dict], BridgeEntity]] | None:
        homes = [a for (_, plat), a in self._adders.items() if plat == comp]
        return next((a for a in homes if a[0].data["vehicle_id"] == key), homes[0] if homes and key.startswith(GROUP_PREFIX) else None)

    def _sync(self) -> None:
        """Creates every stored config's entity that has a home and no entity yet."""
        new: dict[tuple[str, str], list[BridgeEntity]] = defaultdict(list)
        for topic, cfg in list(self._configs.items()):
            comp = topic.split("/")[1]
            try:
                home = None if topic in self._entities else self._home(comp, cfg["device"]["identifiers"][0].removeprefix("car_insights_"))
                if home is None:
                    continue
                entry, add, factory = home
                ent = factory(cfg)
                self._warn_clash(comp, ent)
                for t in ent.topics & self._states.keys():
                    ent.apply(t, self._states[t])
            except Exception:  # one bad config must not stop the others; forgotten, so the next announce can fix it
                log.exception("Cannot make an entity from the config on %s", topic)
                del self._configs[topic]
                continue
            self._entities[topic] = (entry.entry_id, ent)
            new[entry.entry_id, comp].append(ent)
        for key, ents in new.items():
            self._adders[key][1](ents)

    def _warn_clash(self, comp: str, ent: BridgeEntity) -> None:
        reg = er.async_get(self._hass)
        if reg.async_get_entity_id(comp, DOMAIN, ent.unique_id):
            return
        device = ent.cfg["device"]["name"]
        eid = f"{comp}.{slugify(device + ' ' + ent.cfg['name'])}"
        if (other := reg.async_get(eid)) and other.platform != DOMAIN:
            log.warning("Entity ID %s is already used by %s; Car Insights' entity gets another ID", eid, other.platform)


def async_get(hass: HomeAssistant) -> Bridge:
    if "car_insights_bridge" not in hass.data:
        hass.data["car_insights_bridge"] = Bridge(hass)
    return hass.data["car_insights_bridge"]
