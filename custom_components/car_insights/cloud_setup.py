"""Home Assistant's side of a cloud source: a device's registry entries, entity ids as registry ids, the 1.0.0 options, the poller's conf and the flows' schemas."""
import logging
import math

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.selector import (
    DeviceSelector, DeviceSelectorConfig, EntitySelector, EntitySelectorConfig, NumberSelector, NumberSelectorConfig, NumberSelectorMode)

from .core.ha_entities import LEGACY, REQUIRED
from .core.poller import SourceConf, legacy_source_id
from .core.presets import PRESETS, RegEntry

log = logging.getLogger(__name__)

DEFAULT_CAPACITY_KWH = 60.0
# reading -> the entity filters of its picker (any one fits), in the order the form lists them
ENTITY_FILTERS: dict[str, list[dict]] = {
    "charge_level": [{"domain": "sensor", "device_class": "battery"}],
    "odometer": [{"domain": "sensor", "device_class": "distance"}],
    "range": [{"domain": "sensor", "device_class": "distance"}],
    "location": [{"domain": "device_tracker"}],
    "charging": [{"domain": "binary_sensor", "device_class": "battery_charging"}, {"domain": "sensor"}],
    "plugged": [{"domain": "binary_sensor", "device_class": "plug"}, {"domain": "sensor"}],
    "battery_energy": [{"domain": "sensor", "device_class": ["energy_storage", "energy"]}],
    "speed": [{"domain": "sensor", "device_class": "speed"}],
    "ignition": [{"domain": "binary_sensor", "device_class": ["power", "moving", "running"]}],
    "report_time": [{"domain": "sensor", "device_class": "timestamp"}],
}


def has_car_app(entry: ConfigEntry) -> bool:
    """Whether the vehicle has a car app (its webhook): without one, the integration's own entities are all there is."""
    return "webhook_id" in entry.data


def device_entries(hass: HomeAssistant, device_id: str) -> tuple[str | None, list[RegEntry]]:
    """(the integration of a device, its registry entries): the first of its integrations that has a preset, else the first one."""
    device = dr.async_get(hass).async_get(device_id)
    if device is None:
        return None, []
    domains = sorted({e.domain for eid in device.config_entries if (e := hass.config_entries.async_get_entry(eid))})
    domain = next((d for d in domains if d in PRESETS), domains[0] if domains else None)
    return domain, [RegEntry(e.id, e.entity_id, e.entity_id.partition(".")[0], e.platform, e.translation_key, e.unique_id)
                    for e in er.async_entries_for_device(er.async_get(hass), device_id)]


def to_registry_ids(hass: HomeAssistant, entity_ids: dict[str, str]) -> dict[str, str]:
    """reading -> entity id into reading -> registry id; an entity that is not in the registry is left out"""
    reg = er.async_get(hass)
    return {r: e.id for r, eid in entity_ids.items() if (e := reg.async_get(eid)) is not None}


def to_entity_ids(hass: HomeAssistant, registry_ids: dict[str, str]) -> dict[str, str]:
    """reading -> registry id into reading -> entity id; a reading it cannot resolve is left out: a removed entity, or an entity id a converted
    1.0.0 entry could not resolve"""
    reg = er.async_get(hass)
    return {r: e.entity_id for r, rid in registry_ids.items() if (e := reg.async_get(rid)) is not None}


def convert_legacy(hass: HomeAssistant, vehicle_id: str, old: dict) -> dict:
    """The 1.0.0 cloud options ({"mapping", "entity_stem"}) as the cloud options of 1.1.0. The source id stays the old one, so the stored cursor
    carries on. An entity that is not in the registry stays in `entities` as its entity id (the registry takes either): the poller reports
    it as missing, and it is found again when the entity comes back. Raises ValueError for another mapping or a missing stem."""
    legacy = LEGACY.get(old["mapping"])
    if legacy is None:
        raise ValueError(f"no 1.0.0 mapping named {old['mapping']!r}")
    if not isinstance(stem := old.get("entity_stem"), str):
        raise ValueError("no entity_stem")
    wanted = {r: tpl.format(stem=stem) for r, tpl in legacy.items()}
    found = to_registry_ids(hass, wanted)
    entities = {r: found.get(r, eid) for r, eid in wanted.items()}
    reg = er.async_get(hass)
    device_id = next((e.device_id for rid in entities.values() if (e := reg.async_get(rid)) is not None and e.device_id), None)
    return {"preset": old["mapping"], "device_id": device_id, "entities": entities, "source_id": legacy_source_id(old["mapping"], stem)}


def source_conf(entry: ConfigEntry) -> SourceConf | None:
    """The poller's conf from an entry's cloud options; None for an entry without a cloud source or with options that do not fit."""
    cloud = entry.options.get("cloud")
    if not cloud:
        return None
    try:
        return SourceConf(entry.data["vehicle_id"], cloud["source_id"], dict(cloud["entities"]), has_car_app(entry))
    except (KeyError, TypeError, ValueError):
        log.warning("Skipping the cloud source of %s: its options do not fit", entry.title)
        return None


def device_schema() -> vol.Schema:
    """The device picker: devices that have a tracker or a battery sensor."""
    cars = [{"domain": "device_tracker"}, {"domain": "sensor", "device_class": "battery"}]
    return vol.Schema({vol.Required("device_id"): DeviceSelector(DeviceSelectorConfig(entity=cars))})


def entities_schema(capacity: bool) -> vol.Schema:
    """One entity picker per reading, then the battery capacity (a car with the car app has none: the app learns it)."""
    pickers = {(vol.Required if r in REQUIRED else vol.Optional)(r): EntitySelector(EntitySelectorConfig(filter=f)) for r, f in ENTITY_FILTERS.items()}
    kwh = NumberSelector(NumberSelectorConfig(min=5, max=200, step=0.1, unit_of_measurement="kWh", mode=NumberSelectorMode.BOX))
    return vol.Schema({**pickers, **({vol.Required("capacity_kwh"): kwh} if capacity else {})})


def capacity_default(hass: HomeAssistant, entry: RegEntry | None, current: float | None) -> float:
    """kWh: the entry's saved capacity (the owner may have corrected the integration's), else the integration's capacity entity when it has a
    usable number (kWh, or Wh), else 60"""
    if isinstance(current, (int, float)) and 5 <= current <= 200:
        return current
    if entry is not None and (state := hass.states.get(entry.entity_id)) is not None:
        factor = {"kWh": 1, "Wh": 0.001}.get(state.attributes.get("unit_of_measurement"))
        try:
            kwh = round(float(state.state) * factor, 1) if factor else math.nan
        except ValueError:
            kwh = math.nan
        if 5 <= kwh <= 200:
            return kwh
    return DEFAULT_CAPACITY_KWH
