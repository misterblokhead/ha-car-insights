import asyncio
import json
import logging
from datetime import datetime
from unittest.mock import patch
from zoneinfo import ZoneInfo

import pytest
from homeassistant.helpers import device_registry as dr, entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights import bridge
from custom_components.car_insights.bridge import PLATFORMS
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import access, db, live
from custom_components.car_insights.core.totals_sensors import TotalsSensors
from custom_components.car_insights.core.trip_sensors import TripSensors

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 23, 12, tzinfo=TZ).timestamp() * 1000)


@pytest.fixture(autouse=True)
def forwarded_platforms(enable_custom_integrations):
    """The receiver setup is not under test: a stand-in that only forwards the platforms."""
    async def setup(hass, entry):
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        return True

    async def unload(hass, entry):
        return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    with patch("custom_components.car_insights.async_setup_entry", setup), patch("custom_components.car_insights.async_unload_entry", unload):
        yield


async def add_entry(hass, vid="car1", name="Test Car"):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=vid, title=name, data={
        "vehicle_id": vid, "vehicle_name": name, "addon_url": "http://addon.invalid", "webhook_id": f"hook-{vid}", "secret": "00"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def publish(hass, messages, retain=True):
    bridge.async_get(hass).publish(messages, retain)
    await hass.async_block_till_done()


def conn_with(*vehicles):
    conn = db.connect(":memory:")
    for vid, name in vehicles:
        conn.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)", (vid, json.dumps({"vehicle_name": name})))
    return conn


def live_config(vid="car1", name="Test Car"):
    return live.discovery_messages(vid, name, "Acme", "T1", set(live.FIELDS))


def trip(start, **kw):
    return {"start": start, "end": start + 600, "from": "A", "to": "B", "distance_m": 1200.0, "net_wh": 500.0, **kw}


async def test_live_fields_become_entities_with_todays_ids(hass):
    entry = await add_entry(hass)
    await publish(hass, live_config())
    for eid in ("sensor.test_car_state_of_charge", "sensor.test_car_speed", "sensor.test_car_last_seen", "binary_sensor.test_car_plugged_in",
                "device_tracker.test_car_location"):
        assert hass.states.get(eid) is not None, eid
    reg = er.async_get(hass)
    assert reg.async_get("sensor.test_car_state_of_charge").unique_id == "car_insights_car1_soc"
    assert reg.async_get("device_tracker.test_car_location").platform == DOMAIN
    device = dr.async_get(hass).async_get_device_by_identifier((DOMAIN, "car_insights_car1"), entry.entry_id)
    assert (device.name, device.manufacturer, device.model) == ("Test Car", "Acme", "T1")
    soc = hass.states.get("sensor.test_car_state_of_charge")
    assert soc.attributes["unit_of_measurement"] == "%" and soc.attributes["device_class"] == "battery" and soc.attributes["state_class"] == "measurement"
    assert hass.states.get("sensor.test_car_status").attributes["options"] == list(live.MODES)
    assert hass.states.get("sensor.test_car_state_of_charge").state == "unknown"


async def test_state_updates_value_and_attributes(hass):
    await add_entry(hass)
    conn = conn_with(("car1", "Test Car"))
    sink = bridge.async_get(hass)
    await publish(hass, live_config())
    await publish(hass, [live.state_message("car1", {"soc": 61.5, "plugged": "ON", "status": "parked", "last_seen": "2026-10-26T10:00:00+00:00"}),
                         live.location_message("car1", {"latitude": 52.1, "longitude": 4.2, "gps_accuracy": 7})])
    assert hass.states.get("sensor.test_car_state_of_charge").state == "61.5"
    assert hass.states.get("binary_sensor.test_car_plugged_in").state == "on"
    assert hass.states.get("sensor.test_car_status").state == "parked"
    assert hass.states.get("sensor.test_car_last_seen").state == "2026-10-26T10:00:00+00:00"  # a datetime, not a string, or HA would reject the timestamp
    here = hass.states.get("device_tracker.test_car_location")
    assert (here.attributes["latitude"], here.attributes["longitude"], here.attributes["gps_accuracy"], here.attributes["source_type"]) == (52.1, 4.2, 7, "gps")
    await publish(hass, [live.state_message("car1", {"plugged": "OFF"})])  # soc absent: unknown again
    assert hass.states.get("sensor.test_car_state_of_charge").state == "unknown"
    assert hass.states.get("binary_sensor.test_car_plugged_in").state == "off"
    TripSensors(conn, sink, lambda vid: 57_000.0).publish("car1", trip(1000), None, [], [])
    await hass.async_block_till_done()
    last = hass.states.get("sensor.test_car_last_trip_distance")
    assert last.state == "1.2" and last.attributes["from"] == "A" and last.attributes["net_kwh"] == 0.5  # the payload is also the attributes
    assert hass.states.get("sensor.test_car_last_trip_consumption").attributes["unit_of_measurement"] == "kWh/100km"
    assert hass.states.get("sensor.test_car_last_charge_added").state == "unknown"  # announced, nothing to show yet
    assert not [s for s in hass.states.async_entity_ids() if "curve" in s]  # the empty removals of curves that never existed did nothing


async def test_trip_ended_event_fires(hass):
    await add_entry(hass)
    conn = conn_with(("car1", "Test Car"))
    sink = bridge.async_get(hass)
    ts = TripSensors(conn, sink, lambda vid: 57_000.0)
    ts.publish("car1", trip(1000), None, [], [])
    await hass.async_block_till_done()
    assert hass.states.get("event.test_car_trip").state == "unknown"
    ts.publish("car1", trip(2000, lat=52.1, lon=4.2, from_lat=52.0, zone="Home"), None, [trip(2000, lat=52.1, lon=4.2, from_lat=52.0, zone="Home")], [])
    await hass.async_block_till_done()
    ev = hass.states.get("event.test_car_trip")
    assert ev.state != "unknown" and ev.attributes["event_type"] == "ended" and ev.attributes["event_types"] == ["ended"]
    assert ev.attributes["from"] == "A" and ev.attributes["distance_m"] == 1200.0 and ev.attributes["cost"] is None
    assert not {"lat", "lon", "from_lat", "zone"} & ev.attributes.keys()
    assert hass.states.get("event.test_car_charge").state == "unknown"


async def test_totals_on_group_device(hass):
    entry = await add_entry(hass)
    conn = conn_with(("car1", "Test Car"))
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, [])
    ts = TotalsSensors(conn, bridge.async_get(hass), TZ, now_ms=lambda: NOW)
    ts.publish_vehicle("car1")
    ts.publish_groups()
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_month_distance").state == "0.0"
    group = hass.states.get("sensor.fleet_month_distance")
    assert group.state == "0.0" and group.attributes["unit_of_measurement"] == "km"
    assert dr.async_get(hass).async_get_device_by_identifier((DOMAIN, f"car_insights_group_{gid}"), entry.entry_id).name == "Fleet"
    assert er.async_get(hass).async_get("sensor.fleet_month_distance").unique_id == f"car_insights_group_{gid}_month_distance"


async def test_empty_config_removes_entity(hass):
    entry = await add_entry(hass)
    conn = conn_with(("car1", "Test Car"))
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, [])
    ts = TotalsSensors(conn, bridge.async_get(hass), TZ, now_ms=lambda: NOW)
    ts.publish_groups()
    await hass.async_block_till_done()
    reg, devs = er.async_get(hass), dr.async_get(hass)
    assert hass.states.get("sensor.fleet_year_energy") is not None
    assert devs.async_get_device_by_identifier((DOMAIN, f"car_insights_group_{gid}"), entry.entry_id)
    access.delete_group(conn, gid)
    ts.publish_groups()
    await hass.async_block_till_done()
    assert hass.states.get("sensor.fleet_year_energy") is None and reg.async_get("sensor.fleet_year_energy") is None
    assert not [e for e in reg.entities.values() if e.unique_id.startswith(f"car_insights_group_{gid}")]
    assert devs.async_get_device_by_identifier((DOMAIN, f"car_insights_group_{gid}"), entry.entry_id) is None  # no empty device left behind
    ts.publish_groups()  # nothing left to remove, nothing to break
    await hass.async_block_till_done()
    await publish(hass, [("homeassistant/sensor/car1_last_trip_curve/config", "")])  # an entity that never existed


async def test_empty_config_before_the_entity_is_added(hass):
    original = bridge.BridgeEntity.async_internal_added_to_hass

    async def slow(self):  # HA's own add steps can suspend; keep the entity half added
        await asyncio.sleep(0)
        await original(self)

    await add_entry(hass)
    msgs = live_config()
    soc = next(m for m in msgs if "car1_soc/" in m[0])
    sink = bridge.async_get(hass)
    sink.publish(msgs)
    sink.publish([(soc[0], "")])  # created and removed before HA finished adding it
    with patch.object(bridge.BridgeEntity, "async_internal_added_to_hass", slow):
        await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge") is None
    assert er.async_get(hass).async_get("sensor.test_car_state_of_charge") is None
    assert hass.states.get("sensor.test_car_speed") is not None


async def test_state_before_config_is_applied(hass):
    await add_entry(hass)
    await publish(hass, [live.state_message("car1", {"soc": 42.0, "plugged": "ON"}), live.location_message("car1", {"latitude": 1.5, "longitude": 2.5, "gps_accuracy": 3})])
    await publish(hass, live_config())
    assert hass.states.get("sensor.test_car_state_of_charge").state == "42.0"
    assert hass.states.get("binary_sensor.test_car_plugged_in").state == "on"
    assert hass.states.get("device_tracker.test_car_location").attributes["latitude"] == 1.5


async def test_non_retained_state_is_not_kept_for_later_entities(hass):
    await add_entry(hass)
    conn = conn_with(("car1", "Test Car"))
    ts = TripSensors(conn, bridge.async_get(hass), lambda vid: 57_000.0)
    bridge.async_get(hass).publish([("car_insights/car1/trip_event", json.dumps({"event_type": "ended", "from": "A"}))], retain=False)
    await hass.async_block_till_done()
    ts.publish("car1", trip(1000), None, [], [])  # announces the entities after the event went by
    await hass.async_block_till_done()
    assert hass.states.get("event.test_car_trip").state == "unknown"


async def test_clash_with_existing_entity_is_warned(hass, caplog):
    await add_entry(hass)
    er.async_get(hass).async_get_or_create("sensor", "other_integration", "theirs", suggested_object_id="test_car_state_of_charge")
    with caplog.at_level(logging.WARNING):
        await publish(hass, live_config())
    warned = [r.getMessage() for r in caplog.records if r.name == bridge.log.name]
    assert len(warned) == 1 and "sensor.test_car_state_of_charge " in warned[0] and "other_integration" in warned[0]
    assert hass.states.get("sensor.test_car_state_of_charge_2") is not None  # created anyway, with a suffix


async def test_same_entity_announced_again_does_not_warn_or_duplicate(hass, caplog):
    await add_entry(hass)
    await publish(hass, live_config())
    with caplog.at_level(logging.WARNING):
        await publish(hass, live_config())
    assert not [r for r in caplog.records if r.name == bridge.log.name] and hass.states.get("sensor.test_car_state_of_charge_2") is None


async def test_publish_from_a_worker_thread(hass):
    await add_entry(hass)
    sink = bridge.async_get(hass)
    await hass.async_add_executor_job(sink.publish, live_config())
    await hass.async_block_till_done()
    await hass.async_add_executor_job(sink.publish, [live.state_message("car1", {"soc": 10.0})])
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge").state == "10.0"


async def test_two_vehicles_route_to_their_own_entry_and_a_group_to_the_first(hass):
    first, second = await add_entry(hass, "car1", "Test Car"), await add_entry(hass, "car2", "Other Car")
    conn = conn_with(("car1", "Test Car"), ("car2", "Other Car"))
    gid = access.create_group(conn, "Fleet")
    await publish(hass, [*live_config("car2", "Other Car"), *live_config("car1", "Test Car")])
    TotalsSensors(conn, bridge.async_get(hass), TZ, now_ms=lambda: NOW).publish_groups()
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get("sensor.test_car_speed").config_entry_id == first.entry_id
    assert reg.async_get("sensor.other_car_speed").config_entry_id == second.entry_id
    assert reg.async_get("sensor.fleet_month_distance").config_entry_id == first.entry_id


async def test_entity_waits_for_its_entry(hass):
    await publish(hass, live_config())
    assert hass.states.get("sensor.test_car_speed") is None
    await add_entry(hass)
    assert hass.states.get("sensor.test_car_speed") is not None


async def test_unload_then_reload_recreates_entities_with_retained_state(hass):
    entry = await add_entry(hass)
    await publish(hass, [*live_config(), live.state_message("car1", {"soc": 77.0})])
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge").state == "unavailable"
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge").state == "77.0"
    assert hass.states.get("device_tracker.test_car_location") is not None


async def test_forget_drops_the_retained_states_of_that_vehicle_only(hass):
    entries = await add_entry(hass), await add_entry(hass, "car10", "Other Car")  # its id starts with car1's
    await publish(hass, [*live_config(), *live_config("car10", "Other Car"),
                         live.state_message("car1", {"soc": 77.0}), live.state_message("car10", {"soc": 33.0})])
    for e in entries:
        assert await hass.config_entries.async_unload(e.entry_id)
    bridge.async_get(hass).forget("car1")
    for e in entries:
        assert await hass.config_entries.async_setup(e.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.test_car_state_of_charge").state == "unknown"
    assert hass.states.get("sensor.other_car_state_of_charge").state == "33.0"


async def test_removing_one_entity_keeps_a_device_that_still_has_others(hass):
    entry = await add_entry(hass)
    msgs = live_config()
    await publish(hass, msgs)
    await publish(hass, [(next(t for t, _ in msgs if "car1_soc/" in t), "")])
    assert hass.states.get("sensor.test_car_state_of_charge") is None and hass.states.get("sensor.test_car_speed") is not None
    assert dr.async_get(hass).async_get_device_by_identifier((DOMAIN, "car_insights_car1"), entry.entry_id)


async def test_groups_move_to_the_next_entry_when_theirs_unloads(hass, caplog):
    first, second = await add_entry(hass, "car1", "Test Car"), await add_entry(hass, "car2", "Other Car")
    conn = conn_with(("car1", "Test Car"), ("car2", "Other Car"))
    access.create_group(conn, "Fleet")
    TotalsSensors(conn, bridge.async_get(hass), TZ, now_ms=lambda: NOW).publish_groups()
    await publish(hass, live_config("car1", "Test Car"))
    reg = er.async_get(hass)
    assert reg.async_get("sensor.fleet_month_distance").config_entry_id == first.entry_id
    with caplog.at_level(logging.ERROR):
        assert await hass.config_entries.async_unload(first.entry_id)
        await hass.async_block_till_done()
    assert reg.async_get("sensor.fleet_month_distance").config_entry_id == second.entry_id
    assert hass.states.get("sensor.fleet_month_distance").state == "0.0"
    assert hass.states.get("sensor.test_car_speed").state == "unavailable"  # a vehicle entity has no other home
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]


async def test_a_bad_config_does_not_stop_the_others(hass, caplog):
    await add_entry(hass)
    bad = [("homeassistant/sensor/car1_nodevice/config", json.dumps({"unique_id": "u1", "name": "Bad", "device": {}})),
           ("homeassistant/sensor/car1_noname/config", json.dumps({"unique_id": "u2", "device": {"identifiers": ["car_insights_car1"], "name": "Test Car"}})),
           ("homeassistant/sensor/car1_list/config", "[1]")]
    with caplog.at_level(logging.WARNING):
        await publish(hass, [*bad, *live_config()])
        await publish(hass, [live.state_message("car1", {"soc": 5.0})])  # a later sync must not trip over the bad ones again
        await publish(hass, [("homeassistant/sensor/car1_other/config", "{}")])
    assert hass.states.get("sensor.test_car_state_of_charge").state == "5.0" and hass.states.get("sensor.test_car_speed") is not None
    assert len([r for r in caplog.records if r.name == bridge.log.name and r.exc_info]) == 3  # each bad config once: later syncs forget it
