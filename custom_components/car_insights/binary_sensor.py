
from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.const import Platform

from . import bridge


class BridgeBinarySensor(bridge.BridgeEntity, BinarySensorEntity):
    def __init__(self, cfg: dict):
        super().__init__(cfg)
        self._attr_device_class = BinarySensorDeviceClass(cfg["device_class"]) if "device_class" in cfg else None
        self._on, self._off = cfg.get("payload_on", "ON"), cfg.get("payload_off", "OFF")

    def on_state(self, data: dict) -> None:
        v = data.get(self.key)
        self._attr_is_on = True if v == self._on else False if v == self._off else None


async_setup_entry = bridge.platform_setup(Platform.BINARY_SENSOR, BridgeBinarySensor)
