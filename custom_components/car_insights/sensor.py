from datetime import datetime
from functools import partial
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
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


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    b = bridge.async_get(hass)
    b.async_register(entry, Platform.SENSOR, async_add_entities, BridgeSensor)
    entry.async_on_unload(partial(b.async_unregister, entry, Platform.SENSOR))
