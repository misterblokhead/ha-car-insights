
from homeassistant.components.device_tracker import TrackerEntity
from homeassistant.const import Platform

from . import bridge


class BridgeTracker(bridge.BridgeEntity, TrackerEntity):
    _attr_entity_category = None  # HA files trackers under diagnostics; the car's location is no diagnostic

    def on_attributes(self, data: dict) -> None:
        self._attr_latitude, self._attr_longitude = data.get("latitude"), data.get("longitude")
        self._attr_location_accuracy = data.get("gps_accuracy") or 0


async_setup_entry = bridge.platform_setup(Platform.DEVICE_TRACKER, BridgeTracker)
