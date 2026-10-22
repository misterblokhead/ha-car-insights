import re
import secrets

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.components import webhook

from .const import DEFAULT_ADDON_URL, DOMAIN

_VEHICLE_ID = re.compile(r"[A-Za-z0-9_-]{1,64}")


class CarInsightsConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            if not _VEHICLE_ID.fullmatch(user_input["vehicle_id"]):
                errors["vehicle_id"] = "invalid_vehicle_id"
            if re.search(r"[\r\n]", user_input["vehicle_name"]):
                errors["vehicle_name"] = "invalid_vehicle_name"
            if not errors:
                await self.async_set_unique_id(user_input["vehicle_id"])
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=user_input["vehicle_name"],
                    data={
                        **user_input,
                        "webhook_id": webhook.async_generate_id(),
                        "secret": secrets.token_hex(32),
                    },
                )
        prev = user_input or {}
        schema = vol.Schema({
            vol.Required("vehicle_id", default=prev.get("vehicle_id", "")): str,
            vol.Required("vehicle_name", default=prev.get("vehicle_name", "")): str,
            vol.Required("addon_url", default=prev.get("addon_url", DEFAULT_ADDON_URL)): str,
        })
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)
