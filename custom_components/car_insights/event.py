
from homeassistant.components.event import EventEntity
from homeassistant.const import Platform

from . import bridge


class BridgeEvent(bridge.BridgeEntity, EventEntity):
    def __init__(self, cfg: dict):
        super().__init__(cfg)
        self._attr_event_types = cfg["event_types"]

    def on_state(self, data: dict) -> None:
        kind = data.get("event_type")
        if kind in self._attr_event_types:
            self._trigger_event(kind, {k: v for k, v in data.items() if k != "event_type"})


async_setup_entry = bridge.platform_setup(Platform.EVENT, BridgeEvent)
