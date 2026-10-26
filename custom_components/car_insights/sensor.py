from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import Platform
from homeassistant.util import dt as dt_util

from . import bridge


def _timestamp(v: Any) -> datetime | None:
    try:
        d = dt_util.parse_datetime(v)
    except (TypeError, ValueError):
        return None
    return d if d and d.tzinfo else None  # HA rejects a naive timestamp


class BridgeSensor(bridge.BridgeEntity, SensorEntity):
    def __init__(self, cfg: dict):
        super().__init__(cfg)
        self._attr_native_unit_of_measurement = cfg.get("unit_of_measurement")
        self._attr_device_class = SensorDeviceClass(cfg["device_class"]) if "device_class" in cfg else None
        self._attr_state_class = SensorStateClass(cfg["state_class"]) if "state_class" in cfg else None
        self._attr_options = cfg.get("options")

    def on_state(self, data: dict) -> None:
        v = data.get(self.key)
        if self._attr_device_class == SensorDeviceClass.TIMESTAMP:
            v = _timestamp(v)
        elif self._attr_device_class == SensorDeviceClass.ENUM and v not in self._attr_options:
            v = None  # HA raises on a state outside the options
        self._attr_native_value = v


async_setup_entry = bridge.platform_setup(Platform.SENSOR, BridgeSensor)
