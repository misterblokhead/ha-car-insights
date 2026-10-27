"""The repair raised when a car is removed in Devices & services: delete its stored history, or keep it."""
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult

from . import vehicles


class VehicleRemovedFlow(RepairsFlow):
    async def async_step_init(self, user_input: dict[str, str] | None = None) -> FlowResult:
        return self.async_show_menu(step_id="init", menu_options=["delete", "keep"])

    async def async_step_delete(self, user_input: dict[str, str] | None = None) -> FlowResult:
        vid = self.data["vehicle_id"]
        if vehicles.has_entry(self.hass, vid):  # added again while this dialog was open: its history is live
            return self.async_abort(reason="car_added_again")
        await vehicles.purge(self.hass, vid)
        return self.async_create_entry(data={})

    async def async_step_keep(self, user_input: dict[str, str] | None = None) -> FlowResult:
        return self.async_create_entry(data={})


async def async_create_fix_flow(hass: HomeAssistant, issue_id: str, data: dict | None) -> RepairsFlow:
    return VehicleRemovedFlow()
