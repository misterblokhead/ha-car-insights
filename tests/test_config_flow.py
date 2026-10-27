import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from homeassistant.helpers import device_registry as dr, entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights.cloud_setup import ENTITY_FILTERS
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core.ha_entities import READINGS
from custom_components.car_insights.core.poller import new_source_id

COMPONENT = Path(__file__).parent.parent / "custom_components" / "car_insights"
STRINGS, EN = COMPONENT / "strings.json", COMPONENT / "translations" / "en.json"

STELLANTIS = [("sensor", "battery"), ("sensor", "mileage"), ("binary_sensor", "battery_charging"), ("binary_sensor", "battery_plugged"),
              ("sensor", "battery_residual"), ("sensor", "autonomy"), ("device_tracker", "vehicle"), ("sensor", "speed"),
              ("binary_sensor", "engine"), ("sensor", "battery_capacity")]


@pytest.fixture(autouse=True)
def env(enable_custom_integrations, hass):
    with patch("custom_components.car_insights.async_setup_entry", return_value=True):
        yield


def make_car(hass, platform="stellantis_vehicles", keys=STELLANTIS, stem="invented"):
    """An invented car integration: a config entry, a device and its entities (translation key = the key)."""
    cfg = MockConfigEntry(domain=platform)
    cfg.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=cfg.entry_id, identifiers={(platform, stem)})
    reg = er.async_get(hass)
    ents = {key: reg.async_get_or_create(domain, platform, f"{stem}_{key}", suggested_object_id=f"{stem}_{key}", config_entry=cfg,
                                         device_id=device.id, translation_key=key) for domain, key in keys}
    return SimpleNamespace(device=device, ents=ents)


def suggested(result):
    return {str(k): k.description["suggested_value"] for k in result["data_schema"].schema if k.description and "suggested_value" in k.description}


async def begin(hass, source="car_app", name="Invented Car", vehicle_id=None):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    return await hass.config_entries.flow.async_configure(
        result["flow_id"], {"vehicle_name": name, "source": source, "advanced": {"vehicle_id": vehicle_id} if vehicle_id else {}})


async def pick_device(hass, result, car):
    return await hass.config_entries.flow.async_configure(result["flow_id"], {"device_id": car.device.id})


def stellantis_picks(car):
    return {"charge_level": car.ents["battery"].entity_id, "odometer": car.ents["mileage"].entity_id, "range": car.ents["autonomy"].entity_id,
            "battery_energy": car.ents["battery_residual"].entity_id, "location": car.ents["vehicle"].entity_id,
            "charging": car.ents["battery_charging"].entity_id, "plugged": car.ents["battery_plugged"].entity_id,
            "speed": car.ents["speed"].entity_id, "ignition": car.ents["engine"].entity_id}


async def test_flow_has_no_addon_url(hass):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert set(result["data_schema"].schema) == {"vehicle_name", "source", "advanced"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"vehicle_name": "Invented car", "source": "car_app", "advanced": {"vehicle_id": "car1"}})
    assert result["type"] == "create_entry"
    assert set(result["data"]) == {"vehicle_id", "vehicle_name", "webhook_id", "secret"}


async def test_car_app_flow_creates_a_webhook_entry(hass):
    result = await begin(hass, vehicle_id="car1")
    assert result["type"] == "create_entry" and result["title"] == "Invented Car"
    assert result["data"]["vehicle_id"] == "car1" and result["data"]["vehicle_name"] == "Invented Car"
    assert result["data"]["webhook_id"] and len(result["data"]["secret"]) == 64
    assert not result["options"]
    assert hass.config_entries.async_entries(DOMAIN)[0].unique_id == "car1"


async def test_vehicle_id_defaults_to_the_slug_of_the_name(hass):
    result = await begin(hass)
    assert result["data"]["vehicle_id"] == "invented_car"


async def test_taken_vehicle_id_is_an_error_not_an_abort(hass):
    MockConfigEntry(domain=DOMAIN, unique_id="car1", data={"vehicle_id": "car1", "vehicle_name": "Other"}).add_to_hass(hass)
    result = await begin(hass, vehicle_id="car1")
    assert result["type"] == "form" and result["errors"] == {"vehicle_id": "vehicle_id_taken"}
    result = await begin(hass, name="Car1")  # the ID comes from the name: the error is on the name, not on the collapsed ID field
    assert result["type"] == "form" and result["errors"] == {"vehicle_name": "vehicle_name_taken"}


@pytest.mark.parametrize("name, vid, errors", [
    ("Two\nlines", None, {"vehicle_name": "invalid_vehicle_name"}),
    ("   ", "car1", {"vehicle_name": "invalid_vehicle_name"}),
    ("Invented Car", "no spaces", {"vehicle_id": "invalid_vehicle_id"}),
    ("", None, {"vehicle_name": "invalid_vehicle_name"}),
])
async def test_bad_names_and_ids_are_errors(hass, name, vid, errors):
    result = await begin(hass, name=name, vehicle_id=vid)
    assert result["type"] == "form" and result["errors"] == errors


async def test_a_long_name_gives_a_64_character_id_and_the_title_is_stripped(hass):
    result = await begin(hass, name="  " + "Invented " * 10 + "  ")
    assert result["type"] == "create_entry" and result["title"] == result["data"]["vehicle_name"] == ("Invented " * 10).strip()
    assert result["data"]["vehicle_id"] == ("invented_" * 10)[:64]


async def test_a_name_that_gives_no_id_is_an_error_on_the_name(hass, monkeypatch):
    monkeypatch.setattr("custom_components.car_insights.config_flow.slugify", lambda _: "")
    result = await begin(hass)
    assert result["type"] == "form" and result["errors"] == {"vehicle_name": "vehicle_name_unusable"}


async def test_cloud_flow_with_a_stellantis_device_prefills_and_stores_registry_ids(hass):
    car = make_car(hass)
    hass.states.async_set(car.ents["battery_capacity"].entity_id, "50.8", {"unit_of_measurement": "kWh"})
    result = await begin(hass, "cloud")
    assert result["step_id"] == "cloud_device"
    result = await pick_device(hass, result, car)
    assert result["step_id"] == "cloud_entities" and result["description_placeholders"] == {"preset": "Stellantis"}
    assert suggested(result) == stellantis_picks(car) | {"capacity_kwh": 50.8}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], stellantis_picks(car) | {"capacity_kwh": 50.8})
    assert result["type"] == "create_entry"
    assert result["data"] == {"vehicle_id": "invented_car", "vehicle_name": "Invented Car"}
    assert result["options"] == {"cloud": {
        "preset": "stellantis", "device_id": car.device.id, "entities": {r: er.async_get(hass).async_get(e).id for r, e in stellantis_picks(car).items()},
        "source_id": new_source_id("invented_car", car.device.id), "capacity_kwh": 50.8}}


async def test_capacity_in_wh_is_converted_and_an_unusable_state_falls_back(hass):
    car = make_car(hass)
    hass.states.async_set(car.ents["battery_capacity"].entity_id, "50800", {"unit_of_measurement": "Wh"})
    result = await pick_device(hass, await begin(hass, "cloud"), car)
    assert suggested(result)["capacity_kwh"] == 50.8
    hass.states.async_set(car.ents["battery_capacity"].entity_id, "unavailable", {"unit_of_measurement": "kWh"})
    result = await pick_device(hass, await begin(hass, "cloud", vehicle_id="car2"), car)
    assert suggested(result)["capacity_kwh"] == 60


async def test_cloud_flow_with_an_unknown_integration_opens_the_manual_step(hass):
    car = make_car(hass, "invented_brand", [("sensor", "soc"), ("sensor", "odo")])
    result = await pick_device(hass, await begin(hass, "cloud"), car)
    assert result["step_id"] == "cloud_entities" and result["description_placeholders"] == {"preset": "none"}
    assert suggested(result) == {"capacity_kwh": 60}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"charge_level": car.ents["soc"].entity_id, "odometer": car.ents["odo"].entity_id, "capacity_kwh": 40})
    assert result["options"]["cloud"]["preset"] is None and set(result["options"]["cloud"]["entities"]) == {"charge_level", "odometer"}
    assert result["options"]["cloud"]["capacity_kwh"] == 40


async def test_an_entity_the_registry_does_not_know_is_an_error(hass):
    car = make_car(hass, "invented_brand", [("sensor", "soc"), ("sensor", "odo")])
    result = await pick_device(hass, await begin(hass, "cloud"), car)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"charge_level": car.ents["soc"].entity_id, "odometer": "sensor.invented_yaml_only", "capacity_kwh": 40})
    assert result["type"] == "form" and result["errors"] == {"odometer": "entity_not_in_registry"}
    assert suggested(result)["odometer"] == "sensor.invented_yaml_only"  # what was typed stays


async def test_both_creates_webhook_data_and_cloud_options(hass):
    car = make_car(hass)
    result = await pick_device(hass, await begin(hass, "both"), car)
    assert "capacity_kwh" not in {str(k) for k in result["data_schema"].schema}  # the car app learns the capacity
    result = await hass.config_entries.flow.async_configure(result["flow_id"], stellantis_picks(car))
    assert result["type"] == "create_entry"
    assert set(result["data"]) == {"vehicle_id", "vehicle_name", "webhook_id", "secret"}
    assert result["options"]["cloud"]["device_id"] == car.device.id and "capacity_kwh" not in result["options"]["cloud"]


def app_entry(hass, cloud=None):
    entry = MockConfigEntry(domain=DOMAIN, version=2, unique_id="car1", title="Invented Car", options={"cloud": cloud} if cloud else {},
                            data={"vehicle_id": "car1", "vehicle_name": "Invented Car", "webhook_id": "invented_hook", "secret": "invented-secret"})
    entry.add_to_hass(hass)
    return entry


def cloud_only_entry(hass, cloud):
    entry = MockConfigEntry(domain=DOMAIN, version=2, unique_id="car1", title="Invented Car", options={"cloud": cloud},
                            data={"vehicle_id": "car1", "vehicle_name": "Invented Car"})
    entry.add_to_hass(hass)
    return entry


async def test_options_add_cloud_to_a_car_app_entry(hass):
    car = make_car(hass)
    entry = app_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == "form" and result["step_id"] == "cloud_add" and not suggested(result)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": car.device.id})
    assert result["step_id"] == "cloud_entities" and suggested(result)["charge_level"] == car.ents["battery"].entity_id
    assert "capacity_kwh" not in {str(k) for k in result["data_schema"].schema}  # Configure never touches the capacity the car app learned
    result = await hass.config_entries.options.async_configure(result["flow_id"], stellantis_picks(car))
    assert result["type"] == "create_entry"
    cloud = entry.options["cloud"]
    assert cloud["device_id"] == car.device.id and cloud["source_id"] == new_source_id("car1", car.device.id) and "capacity_kwh" not in cloud
    assert "webhook_id" in entry.data


async def test_options_of_a_cloud_only_entry_go_straight_to_the_device_step(hass):
    car = make_car(hass)
    entry = MockConfigEntry(domain=DOMAIN, version=2, unique_id="car1", title="Invented Car", data={"vehicle_id": "car1", "vehicle_name": "Invented Car"},
                            options={"cloud": {"preset": "stellantis", "device_id": car.device.id, "entities": {}, "source_id": "ha_entities-keepme"}})
    entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == "form" and result["step_id"] == "cloud_device" and suggested(result) == {"device_id": car.device.id}


async def test_options_remove_cloud(hass):
    car = make_car(hass)
    entry = app_entry(hass, {"preset": "stellantis", "device_id": car.device.id, "entities": {}, "source_id": "ha_entities-keepme"})
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == "menu" and result["menu_options"] == ["cloud_device", "remove_cloud"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "remove_cloud"})
    assert result["type"] == "create_entry" and "cloud" not in entry.options


async def test_configure_of_a_car_app_entry_with_a_source_has_no_capacity_field_and_stores_none(hass):
    car = make_car(hass)
    entry = app_entry(hass, {"preset": "stellantis", "device_id": car.device.id, "source_id": "ha_entities-keepme", "entities": {}})
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "cloud_device"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": car.device.id})
    assert result["step_id"] == "cloud_entities" and "capacity_kwh" not in {str(k) for k in result["data_schema"].schema}
    assert "capacity_kwh" not in suggested(result)
    await hass.config_entries.options.async_configure(result["flow_id"], stellantis_picks(car))
    assert "capacity_kwh" not in entry.options["cloud"] and entry.options["cloud"]["source_id"] == "ha_entities-keepme"


async def test_options_keep_source_id_when_the_device_is_unchanged(hass):
    car = make_car(hass)
    other = make_car(hass, stem="invented_other")
    cloud = {"preset": "stellantis", "device_id": car.device.id, "source_id": "ha_entities-keepme", "capacity_kwh": 44.4,
             "entities": {"charge_level": car.ents["battery"].id, "odometer": car.ents["mileage"].id}}
    entry = cloud_only_entry(hass, cloud)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert suggested(result) == {"device_id": car.device.id}
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": car.device.id})
    # the current entities, not the preset's, and the capacity of the entry when the car has no capacity entity state
    assert suggested(result) == {"charge_level": car.ents["battery"].entity_id, "odometer": car.ents["mileage"].entity_id, "capacity_kwh": 44.4}
    result = await hass.config_entries.options.async_configure(result["flow_id"], {
        "charge_level": car.ents["battery"].entity_id, "odometer": car.ents["mileage"].entity_id, "capacity_kwh": 45})
    assert entry.options["cloud"]["source_id"] == "ha_entities-keepme" and entry.options["cloud"]["capacity_kwh"] == 45

    result = await hass.config_entries.options.async_init(entry.entry_id)  # another device: a new source and its own cursor
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": other.device.id})
    assert suggested(result)["charge_level"] == other.ents["battery"].entity_id
    await hass.config_entries.options.async_configure(result["flow_id"], stellantis_picks(other) | {"capacity_kwh": 45})
    assert entry.options["cloud"]["source_id"] == new_source_id("car1", other.device.id)


async def test_options_suggest_the_saved_capacity_before_the_integrations(hass):
    car = make_car(hass)
    hass.states.async_set(car.ents["battery_capacity"].entity_id, "50.8", {"unit_of_measurement": "kWh"})
    entry = cloud_only_entry(hass, {"preset": "stellantis", "device_id": car.device.id, "source_id": "ha_entities-keepme", "capacity_kwh": 44.4, "entities": {}})
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": car.device.id})
    assert suggested(result)["capacity_kwh"] == 44.4  # the owner's correction wins over the integration's 50.8
    entry = MockConfigEntry(domain=DOMAIN, version=2, unique_id="car2", data={"vehicle_id": "car2", "vehicle_name": "B"})
    entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"device_id": car.device.id})
    assert suggested(result)["capacity_kwh"] == 50.8


def test_the_ignition_picker_takes_any_binary_sensor():
    assert ENTITY_FILTERS["ignition"] == [{"domain": "binary_sensor"}]  # Stellantis `engine` has no device class


def test_every_reading_has_a_picker():
    assert set(ENTITY_FILTERS) == set(READINGS)  # report_time included: the form must not miss one


def test_reading_labels_in_the_strings_are_the_reading_names():
    strings = json.loads(STRINGS.read_text())
    for flow in ("config", "options"):
        assert {r: strings[flow]["step"]["cloud_entities"]["data"][r] for r in READINGS} == {r: rd.name for r, rd in READINGS.items()}


def test_strings_and_translations_are_identical():
    assert json.loads(STRINGS.read_text()) == json.loads(EN.read_text())
