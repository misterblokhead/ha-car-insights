"""Entries that read a car's own HA integration: cloud-only entries, the 1.0.0 option conversion and the missing-entity repairs. Invented devices only."""
import asyncio
import json
import time
from datetime import timedelta
from pathlib import Path
from types import SimpleNamespace

import pytest
from homeassistant.components import webhook
from homeassistant.config_entries import ConfigEntryState
from homeassistant.helpers import device_registry as dr, entity_registry as er, issue_registry as ir
from homeassistant.helpers.issue_registry import IssueSeverity
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.car_insights import cloud_setup, ha_adapters
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import db, store
from custom_components.car_insights.core.ha_entities import parse_history
from custom_components.car_insights.core.kinds import TRIP
from custom_components.car_insights.core.poller import SourceConf, legacy_source_id

SECRET = "invented-secret-0123"
SOURCE = "ha_entities-1a2b3c4d"


@pytest.fixture(autouse=True)
def env(recorder_mock, enable_custom_integrations, hass):
    hass.config.external_url = "https://ci.example.test"


def make_zoe(hass, stem="invented_zoe", skip=()):
    """An invented Renault device with the entities the 1.0.0 mapping read."""
    cfg = MockConfigEntry(domain="renault")
    cfg.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=cfg.entry_id, identifiers={("renault", stem)})
    reg = er.async_get(hass)
    zoe = SimpleNamespace(device=device, cfg=cfg, stem=stem)
    for name in ("battery", "mileage", "charge_state", "plug_state", "last_battery_activity"):
        if name not in skip:
            setattr(zoe, name, reg.async_get_or_create("sensor", "renault", f"{stem}-{name}", suggested_object_id=f"{stem}_{name}",
                                                       config_entry=cfg, device_id=device.id))
    return zoe


def put(hass, eid, state, unit=None, ago_s=600, **attrs):
    hass.states.async_set(eid, state, ({"unit_of_measurement": unit} if unit else {}) | attrs, timestamp=time.time() - ago_s)


def cloud_entry(hass, zoe, car_app=False, readings=("charge_level", "odometer"), **extra):
    ids = {"charge_level": zoe.battery, "odometer": zoe.mileage, "charging": zoe.charge_state}
    data = {"vehicle_id": "car1", "vehicle_name": "Test Car"} | ({"secret": SECRET, "webhook_id": "invented_hook"} if car_app else {})
    entry = MockConfigEntry(domain=DOMAIN, unique_id="car1", title="Test Car", data=data, options={"cloud": {
        "preset": "renault", "device_id": zoe.device.id, "entities": {r: ids[r].id for r in readings}, "source_id": SOURCE, **extra}})
    entry.add_to_hass(hass)
    return entry


async def setup(hass, entry):
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def poll(hass):
    svc = hass.data[DOMAIN]
    await asyncio.wrap_future(svc.worker.call(svc.poller.poll_once))
    await hass.async_block_till_done()


async def on_worker(hass, fn):
    svc = hass.data[DOMAIN]
    return await asyncio.wrap_future(svc.worker.call(fn, svc.conn))


def issue(hass, vid="car1"):
    return ir.async_get(hass).async_get_issue(DOMAIN, f"cloud_entity_missing_{vid}")


async def test_migrate_converts_1_0_0_options_and_keeps_the_source_id(hass):
    zoe = make_zoe(hass)
    entry = MockConfigEntry(domain=DOMAIN, version=1, unique_id="car1", title="Test Car", data={
        "vehicle_id": "car1", "vehicle_name": "Test Car", "secret": SECRET, "webhook_id": "invented_hook"},
        options={"cloud": {"mapping": "renault", "entity_stem": "invented_zoe"}})
    entry.add_to_hass(hass)
    await setup(hass, entry)
    cloud = entry.options["cloud"]
    assert entry.version == 2 and entry.state is ConfigEntryState.LOADED
    assert cloud["preset"] == "renault" and cloud["device_id"] == zoe.device.id
    assert cloud["source_id"] == legacy_source_id("renault", "invented_zoe")  # the stored cursor carries on
    assert cloud["entities"] == {"charge_level": zoe.battery.id, "odometer": zoe.mileage.id, "charging": zoe.charge_state.id,
                                 "plugged": zoe.plug_state.id, "report_time": zoe.last_battery_activity.id}
    assert "capacity_kwh" not in cloud
    assert hass.data[DOMAIN].poller._confs["car1"] == SourceConf("car1", legacy_source_id("renault", "invented_zoe"), cloud["entities"], True)
    await poll(hass)
    assert issue(hass) is None
    await hass.config_entries.async_unload(entry.entry_id)


async def test_migrate_with_an_unresolvable_entity_leaves_that_reading_out_and_raises_the_repair(hass):
    zoe = make_zoe(hass, skip=("mileage",))
    entry = MockConfigEntry(domain=DOMAIN, version=1, unique_id="car1", title="Test Car", data={
        "vehicle_id": "car1", "vehicle_name": "Test Car", "secret": SECRET, "webhook_id": "invented_hook"},
        options={"cloud": {"mapping": "renault", "entity_stem": "invented_zoe"}})
    entry.add_to_hass(hass)
    await setup(hass, entry)
    assert entry.options["cloud"]["entities"]["odometer"] == "sensor.invented_zoe_mileage"  # kept by entity id: the poller reports it
    await poll(hass)
    found = issue(hass)  # a required reading is gone: the source pauses
    assert found.severity is IssueSeverity.ERROR and found.translation_key == "cloud_entity_missing_required"
    assert found.translation_placeholders == {"vehicle": "Test Car", "readings": "Odometer"}
    await hass.config_entries.async_unload(entry.entry_id)
    assert issue(hass) is None  # nothing polls the car any more


async def test_migrate_with_an_unresolvable_optional_entity_raises_the_warning_and_heals(hass):
    zoe = make_zoe(hass, skip=("charge_state",))
    entry = MockConfigEntry(domain=DOMAIN, version=1, unique_id="car1", title="Test Car", data={
        "vehicle_id": "car1", "vehicle_name": "Test Car", "secret": SECRET, "webhook_id": "invented_hook"},
        options={"cloud": {"mapping": "renault", "entity_stem": "invented_zoe"}})
    entry.add_to_hass(hass)
    await setup(hass, entry)
    assert entry.options["cloud"]["entities"]["charging"] == "sensor.invented_zoe_charge_state"
    await poll(hass)
    found = issue(hass)
    assert found.severity is IssueSeverity.WARNING and found.translation_key == "cloud_entity_missing"
    assert found.translation_placeholders == {"vehicle": "Test Car", "readings": "Charging"}
    er.async_get(hass).async_get_or_create("sensor", "renault", "invented_zoe-charge_state", suggested_object_id="invented_zoe_charge_state",
                                           config_entry=zoe.cfg, device_id=zoe.device.id)  # the entity comes back
    await poll(hass)
    assert issue(hass) is None
    await hass.config_entries.async_unload(entry.entry_id)


@pytest.mark.parametrize("old", [{"mapping": "renault"}, {"mapping": "kia", "entity_stem": "invented_ev6"}])
async def test_migrate_with_unusable_1_0_0_options_still_loads(hass, caplog, old):
    entry = MockConfigEntry(domain=DOMAIN, version=1, unique_id="car1", title="Test Car", data={
        "vehicle_id": "car1", "vehicle_name": "Test Car", "secret": SECRET, "webhook_id": "invented_hook"}, options={"cloud": old})
    entry.add_to_hass(hass)
    await setup(hass, entry)
    assert entry.version == 2 and entry.state is ConfigEntryState.LOADED and "Test Car" in caplog.text
    assert "car1" not in hass.data[DOMAIN].poller._confs
    await hass.config_entries.async_unload(entry.entry_id)


async def test_unload_drops_the_webhook_before_the_service_is_released(hass, monkeypatch):
    import custom_components.car_insights as integration
    entry = cloud_entry(hass, make_zoe(hass), car_app=True)
    await setup(hass, entry)
    assert "invented_hook" in hass.data[webhook.DOMAIN]
    seen = []
    release = integration._release

    async def spy(h):
        seen.append("invented_hook" in h.data[webhook.DOMAIN])
        await release(h)

    monkeypatch.setattr(integration, "_release", spy)
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert seen == [False] and "invented_hook" not in hass.data[webhook.DOMAIN]


async def test_missing_optional_reading_raises_a_warning(hass):
    zoe = make_zoe(hass)
    entry = cloud_entry(hass, zoe, readings=("charge_level", "odometer", "charging"))
    await setup(hass, entry)
    er.async_get(hass).async_remove(zoe.charge_state.entity_id)
    await poll(hass)
    found = issue(hass)
    assert found.severity is IssueSeverity.WARNING and found.translation_key == "cloud_entity_missing"
    assert found.translation_placeholders == {"vehicle": "Test Car", "readings": "Charging"}
    await hass.config_entries.async_unload(entry.entry_id)


async def test_migrate_with_nothing_resolvable_keeps_the_source_id_and_pauses(hass):
    entry = MockConfigEntry(domain=DOMAIN, version=1, unique_id="car1", title="Test Car", data={
        "vehicle_id": "car1", "vehicle_name": "Test Car", "secret": SECRET, "webhook_id": "invented_hook"},
        options={"cloud": {"mapping": "renault", "entity_stem": "invented_gone"}})
    entry.add_to_hass(hass)
    await setup(hass, entry)
    cloud = entry.options["cloud"]
    assert cloud["device_id"] is None and cloud["source_id"] == legacy_source_id("renault", "invented_gone")
    assert cloud["entities"]["odometer"] == "sensor.invented_gone_mileage" and len(cloud["entities"]) == 5  # kept by entity id
    await poll(hass)
    assert issue(hass).severity is IssueSeverity.ERROR
    await hass.config_entries.async_unload(entry.entry_id)


async def test_cloud_only_entry_sets_up_without_webhook_or_conf(hass):
    hass.config.external_url = hass.config.internal_url = None  # a car app entry would retry for ever
    entry = cloud_entry(hass, make_zoe(hass))
    await setup(hass, entry)
    assert entry.state is ConfigEntryState.LOADED
    assert not Path(hass.config.path("car_insights", "car1.conf")).exists()
    assert not hass.data.get(webhook.DOMAIN)
    assert await on_worker(hass, lambda conn: db.is_cloud_only(conn, "car1")) is True
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.config_entries.async_remove(entry.entry_id)  # no webhook or conf to clean up


async def test_cloud_only_vehicle_polls_and_gets_live_entities(hass):
    zoe = make_zoe(hass)
    put(hass, zoe.battery.entity_id, "80", "%")
    put(hass, zoe.mileage.entity_id, "1000", "km")
    await async_wait_recording_done(hass)
    entry = cloud_entry(hass, zoe)
    await setup(hass, entry)
    await poll(hass)
    assert float(hass.states.get("sensor.test_car_state_of_charge").state) == 80
    await hass.config_entries.async_unload(entry.entry_id)


async def test_tracker_attribute_changes_reach_the_poller(hass):
    start = dt_util.utcnow().replace(microsecond=0) - timedelta(minutes=30)
    tracker, other = "device_tracker.invented_zoe_location", "sensor.invented_zoe_mileage"
    for i, lat in enumerate((52.0, 52.001, 52.002), 1):  # the state stays not_home: only the attributes change
        hass.states.async_set(tracker, "not_home", {"latitude": lat, "longitude": 5.0}, timestamp=(start + timedelta(minutes=5 * i)).timestamp())
    put(hass, other, "1000", "km", ago_s=1500)
    await async_wait_recording_done(hass)
    end = int((dt_util.utcnow() + timedelta(minutes=1)).timestamp() * 1000)
    got = await hass.async_add_executor_job(ha_adapters.history, hass, [tracker, other], int(start.timestamp() * 1000), end, [tracker])
    assert [r[0]["entity_id"] for r in got] == [tracker, other]
    assert len(got[0]) == 3 and all(r["attributes"]["latitude"] for r in got[0])
    assert all(set(r) <= {"entity_id", "state", "last_changed"} for r in got[1])  # the other entities are read as before
    rows = parse_history(got)[tracker]
    assert [a["latitude"] for _, _, a in rows] == [52.0, 52.001, 52.002] and len({t for t, _, _ in rows}) == 3


async def test_resolve_gives_the_entity_id_and_its_current_unit(hass):
    zoe = make_zoe(hass)
    put(hass, zoe.mileage.entity_id, "1000", "km")
    got = await hass.async_add_executor_job(ha_adapters.resolve, hass, [zoe.mileage.id, zoe.battery.id, "nope"])
    assert got == {zoe.mileage.id: (zoe.mileage.entity_id, "km"), zoe.battery.id: (zoe.battery.entity_id, None)}  # no state, no unit; unknown ids are left out


async def test_device_entries_and_id_conversion(hass):
    zoe = make_zoe(hass)
    domain, entries = cloud_setup.device_entries(hass, zoe.device.id)
    assert domain == "renault" and {e.entity_id for e in entries} == {
        f"sensor.invented_zoe_{n}" for n in ("battery", "mileage", "charge_state", "plug_state", "last_battery_activity")}
    assert all(e.domain == "sensor" and e.platform == "renault" for e in entries)
    assert cloud_setup.device_entries(hass, "no-such-device") == (None, [])
    ids = {"odometer": zoe.mileage.entity_id, "charge_level": "sensor.invented_gone"}
    registry_ids = cloud_setup.to_registry_ids(hass, ids)
    assert registry_ids == {"odometer": zoe.mileage.id}  # an entity that is not in the registry is left out
    assert cloud_setup.to_entity_ids(hass, {**registry_ids, "charge_level": "gone"}) == {"odometer": zoe.mileage.entity_id}


async def test_removing_the_cloud_source_stops_polling_and_keeps_samples(hass):
    zoe = make_zoe(hass)
    put(hass, zoe.battery.entity_id, "80", "%")
    put(hass, zoe.mileage.entity_id, "1000", "km")
    await async_wait_recording_done(hass)
    entry = cloud_entry(hass, zoe, car_app=True)
    await setup(hass, entry)
    await poll(hass)
    count = lambda conn: conn.execute("SELECT count(*) FROM samples WHERE vehicle_id='car1'").fetchone()[0]
    before = await on_worker(hass, count)
    assert before > 0 and "car1" in hass.data[DOMAIN].poller._confs
    hass.config_entries.async_update_entry(entry, options={})  # the update listener reloads the entry
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED and "car1" not in hass.data[DOMAIN].poller._confs
    await poll(hass)
    assert await on_worker(hass, count) == before
    await hass.config_entries.async_unload(entry.entry_id)


def _trip_body(t0):
    samples = [(t0, "ignition", 4.0), (t0, "gear", 1.0), (t0 + 500, "gps", [52.0, 5.0]),
               *[(t0 + t, "speed", 10.0) for t in range(0, 100_001, 1000)], (t0 + 110_000, "ignition", 2.0)]
    return json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                       "samples": [{"seq": i, "t": t, "k": k, "v": v} for i, (t, k, v) in enumerate(samples, 1)]}).encode()


async def test_switching_to_cloud_only_rederives_trips(hass):
    zoe = make_zoe(hass)
    entry = cloud_entry(hass, zoe, car_app=True)
    await setup(hass, entry)
    now = int(time.time() * 1000)
    status, _ = await hass.data[DOMAIN].ingest(_trip_body(now - 3 * 86_400_000), now)
    assert status == 200
    trips = await on_worker(hass, lambda conn: store.closed(conn, TRIP, "car1"))
    assert len(trips) == 1 and not trips[0].get("approx")  # the car app's own trip
    hass.config_entries.async_update_entry(entry, data={k: v for k, v in entry.data.items() if k != "webhook_id"})
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED and not hass.data.get(webhook.DOMAIN)
    assert await on_worker(hass, lambda conn: db.is_cloud_only(conn, "car1")) is True
    trips = await on_worker(hass, lambda conn: store.closed(conn, TRIP, "car1"))
    assert all(t.get("approx") for t in trips)  # re-derived from the cloud kinds of reading: never the exact trip
    await hass.config_entries.async_unload(entry.entry_id)


async def test_missing_required_reading_raises_an_error_repair_and_fixing_deletes_it(hass):
    zoe = make_zoe(hass)
    entry = cloud_entry(hass, zoe)
    await setup(hass, entry)
    await poll(hass)
    assert issue(hass) is None
    er.async_get(hass).async_remove(zoe.mileage.entity_id)  # its integration dropped the entity
    await poll(hass)
    found = issue(hass)
    assert found.severity is IssueSeverity.ERROR and found.translation_key == "cloud_entity_missing_required"
    assert found.translation_placeholders == {"vehicle": "Test Car", "readings": "Odometer"} and not found.is_fixable
    new = er.async_get(hass).async_get_or_create("sensor", "renault", "invented_zoe-odo2", suggested_object_id="invented_zoe_odo2",
                                                 config_entry=zoe.cfg, device_id=zoe.device.id)
    hass.config_entries.async_update_entry(entry, options={"cloud": {**entry.options["cloud"], "entities": {
        "charge_level": zoe.battery.id, "odometer": new.id}}})
    await hass.async_block_till_done()  # reloaded: the repair goes with the old source
    await poll(hass)
    assert issue(hass) is None
    await hass.config_entries.async_unload(entry.entry_id)


async def test_capacity_option_is_applied(hass):
    entry = cloud_entry(hass, make_zoe(hass), capacity_kwh=52.0)
    await setup(hass, entry)
    assert await on_worker(hass, lambda conn: db.capacity_wh(conn, "car1", 0)) == 52_000
    await hass.config_entries.async_unload(entry.entry_id)
