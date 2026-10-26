from functools import partial

from homeassistant.components.device_tracker import TrackerEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import bridge


class BridgeTracker(bridge.BridgeEntity, TrackerEntity):
    _attr_entity_category = None  # HA files trackers under diagnostics; the car's location is no diagnostic

    def on_attributes(self, data: dict) -> None:
        self._attr_latitude, self._attr_longitude = data.get("latitude"), data.get("longitude")
        self._attr_location_accuracy = data.get("gps_accuracy") or 0


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    b = bridge.async_get(hass)
    b.async_register(entry, Platform.DEVICE_TRACKER, async_add_entities, BridgeTracker)
    entry.async_on_unload(partial(b.async_unregister, entry, Platform.DEVICE_TRACKER))
