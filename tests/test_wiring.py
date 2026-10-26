"""The receiver entries and the entity bridge, joined: a real Service, signed batches through the webhook."""
import hashlib
import hmac
import json
import time
from pathlib import Path

import pytest
from homeassistant.config_entries import ConfigEntryState
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights import bridge
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import db, live
from custom_components.car_insights.core.protocol import Sample

SECRET = "invented-secret-0123"


@pytest.fixture(autouse=True)
def env(enable_custom_integrations, hass):
    hass.config.external_url = "https://ci.example.test"


def add_entry(hass, vid, name):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=vid, title=name, data={
        "vehicle_id": vid, "vehicle_name": name, "secret": SECRET, "webhook_id": f"hook_{vid}"})
    entry.add_to_hass(hass)
    return entry


async def setup(hass, entry):
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def post(hass, client, vid, name):
    now = int(time.time() * 1000)
    body = json.dumps({"v": 1, "vehicle_id": vid, "source_id": "car_app-0000abcd", "samples": [
        {"seq": 1, "t": now, "k": "meta", "v": {"vehicle_name": name}}, {"seq": 2, "t": now, "k": "speed", "v": 10.0},
        {"seq": 3, "t": now, "k": "battery_wh", "v": 20000.0}]}).encode()
    sig = "sha256=" + hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()
    resp = await client.post(f"/api/webhook/hook_{vid}", data=body, headers={"X-CI-Vehicle": vid, "X-CI-Signature": sig})
    assert resp.status == 200
    await hass.async_block_till_done()


async def test_entry_setup_creates_vehicle_entities(hass, hass_client_no_auth):
    entry = add_entry(hass, "car1", "Test Car")
    # discovery announced while no entry is loaded yet (a running service with the entry reloading) is waiting in the bridge
    bridge.async_get(hass).publish(live.discovery_messages("car1", "Test Car", "Acme", "T1", {"soc"}))
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge") is None  # no home yet
    await setup(hass, entry)
    assert hass.states.get("sensor.test_car_state_of_charge") is not None  # without waiting for another publish
    await post(hass, await hass_client_no_auth(), "car1", "Test Car")
    assert hass.states.get("sensor.test_car_battery_energy").state == "20.0"
    assert hass.states.get("sensor.test_car_speed").state == "36.0"


async def test_unload_removes_entities_and_keeps_other_vehicle(hass, hass_client_no_auth):
    a, b = add_entry(hass, "car1", "Test Car"), add_entry(hass, "car2", "Other Car")
    await setup(hass, a)  # setting up the domain loads every entry of it
    assert b.state is ConfigEntryState.LOADED
    client = await hass_client_no_auth()
    await post(hass, client, "car1", "Test Car")
    await post(hass, client, "car2", "Other Car")
    assert hass.states.get("sensor.test_car_speed").state == "36.0"
    service = hass.data[DOMAIN]
    assert await hass.config_entries.async_unload(a.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_speed").state == "unavailable"
    assert hass.states.get("sensor.other_car_speed").state == "36.0"
    assert hass.data[DOMAIN] is service
    await hass.config_entries.async_unload(b.entry_id)
    assert DOMAIN not in hass.data


async def test_reload_recreates_entities(hass, hass_client_no_auth):
    entry = add_entry(hass, "car1", "Test Car")
    await setup(hass, entry)
    await post(hass, await hass_client_no_auth(), "car1", "Test Car")
    assert hass.states.get("sensor.test_car_state_of_charge") is not None
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert hass.states.get("sensor.test_car_speed").state == "36.0"  # the retained state came back with the entity
    await hass.config_entries.async_unload(entry.entry_id)


async def test_live_entities_come_back_after_a_restart_without_a_post(hass):
    """Nothing is retained any more: a start announces what the stored samples hold, though the car has not posted."""
    path = Path(hass.config.path("car_insights", "car_insights.db"))
    now = int(time.time() * 1000)

    def seed():
        path.parent.mkdir(exist_ok=True)
        conn = db.connect(str(path))
        db.ingest(conn, "car1", "car_app-0000abcd", [Sample(1, now, "meta", {"vehicle_name": "Test Car"}), Sample(2, now, "speed", 10.0),
                                                       Sample(3, now, "battery_wh", 20000.0), Sample(4, now, "gps", [52.0, 5.0, 8.0])], now)
        conn.close()

    await hass.async_add_executor_job(seed)
    await setup(hass, add_entry(hass, "car1", "Test Car"))
    assert hass.states.get("sensor.test_car_speed").state == "36.0"
    assert hass.states.get("sensor.test_car_battery_energy").state == "20.0"
    tracker = hass.states.get("device_tracker.test_car_location")
    assert tracker is not None and tracker.attributes["latitude"] == 52.0
