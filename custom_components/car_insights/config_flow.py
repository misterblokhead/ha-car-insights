import re
import secrets

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.components import webhook
from homeassistant.data_entry_flow import section
from homeassistant.helpers.selector import SelectSelector, SelectSelectorConfig, SelectSelectorMode
from homeassistant.util import slugify

from .cloud_setup import (
    ENTITY_FILTERS, capacity_default, device_entries, device_schema, entities_schema, to_entity_ids, to_registry_ids)
from .const import DOMAIN
from .core.poller import new_source_id
from .core.presets import capacity_entry, match

_VEHICLE_ID = re.compile(r"[A-Za-z0-9_-]{1,64}")
_PRESET_NAMES = {"renault": "Renault", "stellantis": "Stellantis"}


class _CloudSteps:
    """The steps both flows share: pick the car's HA device, then match its entities to the readings."""

    def __init__(self) -> None:
        super().__init__()
        self._current: dict = {}  # the cloud options of the entry being changed; none for a new car

    def _vehicle_id(self) -> str:
        raise NotImplementedError

    async def _save(self, cloud: dict):
        raise NotImplementedError

    async def async_step_cloud_device(self, user_input=None):
        return await self._pick_device("cloud_device", user_input)

    async def _pick_device(self, step_id: str, user_input):
        if user_input is not None:
            self._device_id = user_input["device_id"]
            self._integration, self._entries = device_entries(self.hass, self._device_id)
            return await self.async_step_cloud_entities()
        current = self._current.get("device_id")
        return self.async_show_form(step_id=step_id, data_schema=self.add_suggested_values_to_schema(
            device_schema(), {"device_id": current} if current else None))

    async def async_step_cloud_entities(self, user_input=None):
        preset, matched = match(self._integration, self._entries)
        same_device = self._current.get("device_id") == self._device_id
        errors = {}
        if user_input is not None:
            picked = {r: user_input[r] for r in ENTITY_FILTERS if r in user_input}
            entities = to_registry_ids(self.hass, picked)
            errors = {r: "entity_not_in_registry" for r in picked if r not in entities}  # one the registry lacks cannot be tracked
            if not errors:
                return await self._save({
                    "preset": preset, "device_id": self._device_id, "entities": entities, "capacity_kwh": user_input["capacity_kwh"],
                    "source_id": self._current.get("source_id") if same_device and self._current.get("source_id")
                    else new_source_id(self._vehicle_id(), self._device_id)})
            values = user_input
        else:
            capacity = capacity_default(self.hass, capacity_entry(self._integration, self._entries), self._current.get("capacity_kwh"))
            values = {**to_entity_ids(self.hass, (self._current.get("entities") or {}) if same_device else matched), "capacity_kwh": capacity}
        return self.async_show_form(
            step_id="cloud_entities", data_schema=self.add_suggested_values_to_schema(entities_schema(), values), errors=errors,
            description_placeholders={"preset": _PRESET_NAMES.get(preset, preset) if preset else "none"})


class CarInsightsConfigFlow(_CloudSteps, config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 2  # 2: the cloud options name a device and registry ids (1: {"mapping", "entity_stem"})

    @staticmethod
    def async_get_options_flow(config_entry):
        return CarInsightsOptionsFlow()

    def _vehicle_id(self) -> str:
        return self._data["vehicle_id"]

    def _app_data(self) -> dict:
        return {**self._data, "webhook_id": webhook.async_generate_id(), "secret": secrets.token_hex(32)}

    async def _save(self, cloud: dict):
        data = self._app_data() if self._source == "both" else self._data
        return self.async_create_entry(title=self._data["vehicle_name"], data=data, options={"cloud": cloud})

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            name = user_input["vehicle_name"].strip()
            typed = user_input["advanced"].get("vehicle_id") or ""
            if re.search(r"[\r\n]", name) or not name:
                errors["vehicle_name"] = "invalid_vehicle_name"
            # an ID that comes from the name is reported on the name: the ID field is collapsed and the user never saw that ID
            vehicle_id, field = (typed, "vehicle_id") if typed else (slugify(name)[:64], "vehicle_name")
            if typed or not errors:
                if not _VEHICLE_ID.fullmatch(vehicle_id):
                    errors[field] = "invalid_vehicle_id" if typed else "vehicle_name_unusable"
                elif await self.async_set_unique_id(vehicle_id, raise_on_progress=False) is not None:
                    errors[field] = f"{field}_taken"
            if not errors:
                self._data, self._source = {"vehicle_id": vehicle_id, "vehicle_name": name}, user_input["source"]
                if self._source == "car_app":
                    return self.async_create_entry(title=name, data=self._app_data())
                return await self.async_step_cloud_device()
        sources = SelectSelector(SelectSelectorConfig(options=["car_app", "cloud", "both"], translation_key="source", mode=SelectSelectorMode.LIST))
        schema = vol.Schema({
            vol.Required("vehicle_name"): str,
            vol.Required("source", default="car_app"): sources,
            vol.Required("advanced"): section(vol.Schema({vol.Optional("vehicle_id"): str}), {"collapsed": True}),
        })
        return self.async_show_form(step_id="user", data_schema=self.add_suggested_values_to_schema(schema, user_input), errors=errors)


class CarInsightsOptionsFlow(_CloudSteps, config_entries.OptionsFlow):
    def _vehicle_id(self) -> str:
        return self.config_entry.data["vehicle_id"]

    async def _save(self, cloud: dict):
        return self.async_create_entry(data={**self.config_entry.options, "cloud": cloud})

    async def async_step_init(self, user_input=None):
        entry = self.config_entry
        cloud = entry.options.get("cloud")
        self._current = cloud if isinstance(cloud, dict) else {}
        if "webhook_id" not in entry.data:  # a cloud-only car has nothing else to change
            return await self.async_step_cloud_device()
        if not self._current:
            return await self.async_step_cloud_add()
        return self.async_show_menu(step_id="init", menu_options=["cloud_device", "remove_cloud"])

    async def async_step_cloud_add(self, user_input=None):
        return await self._pick_device("cloud_add", user_input)

    async def async_step_remove_cloud(self, user_input=None):
        return self.async_create_entry(data={k: v for k, v in self.config_entry.options.items() if k != "cloud"})
