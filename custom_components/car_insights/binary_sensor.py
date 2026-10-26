from functools import partial

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import bridge


class BridgeBinarySensor(bridge.BridgeEntity, BinarySensorEntity):
    def __init__(self, cfg: dict):
        super().__init__(cfg)
        self._attr_device_class = BinarySensorDeviceClass(cfg["device_class"]) if "device_class" in cfg else None
        self._on, self._off = cfg.get("payload_on", "ON"), cfg.get("payload_off", "OFF")

    def on_state(self, data: dict) -> None:
        v = data.get(self.key)
        self._attr_is_on = True if v == self._on else False if v == self._off else None


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    b = bridge.async_get(hass)
    b.async_register(entry, Platform.BINARY_SENSOR, async_add_entities, BridgeBinarySensor)
    entry.async_on_unload(partial(b.async_unregister, entry, Platform.BINARY_SENSOR))
