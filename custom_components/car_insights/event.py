from functools import partial

from homeassistant.components.event import EventEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import bridge


class BridgeEvent(bridge.BridgeEntity, EventEntity):
    def __init__(self, cfg: dict):
        super().__init__(cfg)
        self._attr_event_types = cfg["event_types"]

    def on_state(self, data: dict) -> None:
        kind = data.get("event_type")
        if kind in self._attr_event_types:
            self._trigger_event(kind, {k: v for k, v in data.items() if k != "event_type"})


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    b = bridge.async_get(hass)
    b.async_register(entry, Platform.EVENT, async_add_entities, BridgeEvent)
    entry.async_on_unload(partial(b.async_unregister, entry, Platform.EVENT))
