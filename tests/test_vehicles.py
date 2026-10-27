"""Removing a car from the page and deleting its stored history, through the page's own routes."""
import asyncio
import json
import sqlite3
import time

import pytest
from homeassistant.config_entries import ConfigEntryDisabler, ConfigEntryState
from homeassistant.helpers import device_registry as dr, entity_registry as er, issue_registry as ir
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights import bridge, vehicles
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import pipeline, store
from custom_components.car_insights.core.derive import ALGO
from custom_components.car_insights.core.kinds import TRIP

UI = "/api/car_insights/ui"


@pytest.fixture(autouse=True)
def env(enable_custom_integrations, hass):
    hass.config.external_url = "https://ci.example.test"


@pytest.fixture
async def hass_admin_client(hass, hass_client):
    assert await async_setup_component(hass, "http", {})  # an entry sets it up, but the client is made before the first one
    return await hass_client()


def add_entry(hass, vid):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=vid, title=f"Car {vid}", data={
        "vehicle_id": vid, "vehicle_name": f"Car {vid}", "secret": "invented-secret-0123", "webhook_id": f"hook_{vid}"})
    entry.add_to_hass(hass)
    return entry


def entry_ids(hass):
    return [e.data["vehicle_id"] for e in hass.config_entries.async_entries(DOMAIN)]


async def on_worker(hass, fn, *args):
    return await asyncio.wrap_future(hass.data[DOMAIN].worker.call(fn, *args))


def seed_trip(app, vid):
    """a stored trip, published as the last trip and in the totals (the entities of both exist afterwards)"""
    start = int(time.time() * 1000) - 3_600_000
    store.insert(app.conn, TRIP, vid, {"start": start, "end": start + 600_000, "distance_m": 5_000.0, "net_wh": 800.0}, None, None, ALGO)
    pipeline.republish(app, [vid])


async def add_car(hass, vid):
    """a loaded entry whose car has a stored sample and a trip"""
    entry = add_entry(hass, vid)
    assert await hass.config_entries.async_setup(entry.entry_id)
    now = int(time.time() * 1000)
    body = json.dumps({"v": 1, "vehicle_id": vid, "source_id": "car_app-0000abcd", "samples": [{"seq": 1, "t": now, "k": "battery_wh", "v": 20_000.0}]}).encode()
    assert (await hass.data[DOMAIN].ingest(body, now))[0] == 200
    await on_worker(hass, seed_trip, hass.data[DOMAIN].app, vid)
    await hass.async_block_till_done()
    return entry


def rows(hass, vid):
    """(samples, trips, vehicles) rows of a car, read from the database file with a connection of its own"""
    def read():
        conn = sqlite3.connect(hass.config.path("car_insights", "car_insights.db"))
        try:
            return tuple(conn.execute(f"SELECT COUNT(*) FROM {t} WHERE vehicle_id=?", (vid,)).fetchone()[0] for t in ("samples", "trips", "vehicles"))
        finally:
            conn.close()
    return hass.async_add_executor_job(read)


def car_entities(hass, vid):
    return {e.unique_id for e in er.async_get(hass).entities.values() if e.unique_id.startswith(f"car_insights_{vid}_")}


def car_device(hass, vid):
    return next((d for d in dr.async_get(hass).devices if (DOMAIN, f"car_insights_{vid}") in d.identifiers), None)


async def settings_of(client):
    resp = await client.get(f"{UI}/settings")
    assert resp.status == 200
    return {v["id"]: v for v in (await resp.json())["vehicles"]}


async def test_remove_with_keep_archives_the_car(hass, hass_admin_client):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    assert car_device(hass, "car1") and "car_insights_car1_month_distance" in car_entities(hass, "car1")
    assert "car_insights_car1_last_trip_distance" in car_entities(hass, "car1")
    assert not (await settings_of(hass_admin_client))["car1"]["archived"]

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=keep")

    assert (resp.status, await resp.json()) == (200, {"removed": True, "history_deleted": False})
    await hass.async_block_till_done()
    assert entry_ids(hass) == ["car2"] and car_device(hass, "car1") is None and car_entities(hass, "car1") == set()
    assert car_device(hass, "car2") and car_entities(hass, "car2")
    assert await rows(hass, "car1") == (1, 1, 1)
    seen = await settings_of(hass_admin_client)
    assert seen["car1"]["archived"] is True and seen["car2"]["archived"] is False
    assert vehicles.REMOVING in hass.data and hass.data[vehicles.REMOVING] == set()


async def test_remove_with_delete_removes_entry_and_history(hass, hass_admin_client):
    await add_car(hass, "car1")
    await add_car(hass, "car2")

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=delete")

    assert (resp.status, await resp.json()) == (200, {"removed": True, "history_deleted": True})
    await hass.async_block_till_done()
    assert entry_ids(hass) == ["car2"] and car_device(hass, "car1") is None and car_entities(hass, "car1") == set()
    assert await rows(hass, "car1") == (0, 0, 0) and await rows(hass, "car2") == (1, 1, 1)
    assert list(await settings_of(hass_admin_client)) == ["car2"]


async def test_remove_the_last_car_with_delete_uses_its_own_connection(hass, hass_admin_client):
    await add_car(hass, "car1")

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=delete")

    assert (resp.status, await resp.json()) == (200, {"removed": True, "history_deleted": True})
    assert DOMAIN not in hass.data  # the service stopped with its last car
    assert await rows(hass, "car1") == (0, 0, 0)
    again = await hass_admin_client.delete(f"{UI}/vehicles/car1/history")  # the routes need no running service
    assert (again.status, await again.json()) == (200, {"history_deleted": True})


async def test_failed_removal_deletes_nothing(hass, hass_admin_client, monkeypatch):
    await add_car(hass, "car1")
    await add_car(hass, "car2")

    async def boom(entry_id):
        raise RuntimeError("HA refused")

    monkeypatch.setattr(hass.config_entries, "async_remove", boom)
    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=delete")

    assert (resp.status, await resp.json()) == (500, {"detail": "Could not remove the car"})
    assert sorted(entry_ids(hass)) == ["car1", "car2"] and await rows(hass, "car1") == (1, 1, 1)
    assert hass.data[vehicles.REMOVING] == set()
    assert (await settings_of(hass_admin_client))["car1"]["archived"] is False


async def test_failed_deletion_after_removal_reports_it(hass, hass_admin_client, monkeypatch):
    await add_car(hass, "car1")
    await add_car(hass, "car2")

    def boom(*a):
        raise sqlite3.OperationalError("database is locked")

    monkeypatch.setattr(pipeline, "forget_vehicle", boom)
    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=delete")

    assert (resp.status, await resp.json()) == (200, {"removed": True, "history_deleted": False})
    assert entry_ids(hass) == ["car2"] and await rows(hass, "car1") == (1, 1, 1)
    assert (await settings_of(hass_admin_client))["car1"]["archived"] is True


async def test_second_removal_is_already_removed(hass, hass_admin_client):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history=keep")).status == 200

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1?history=delete")

    assert (resp.status, await resp.json()) == (404, {"detail": "This car was already removed"})
    assert await rows(hass, "car1") == (1, 1, 1)  # the refused request deleted nothing
    assert (await hass_admin_client.delete(f"{UI}/vehicles/nobody?history=keep")).status == 404


async def test_removal_needs_a_history_choice(hass, hass_admin_client):
    await add_car(hass, "car1")
    for query in ("", "?history=", "?history=maybe"):
        resp = await hass_admin_client.delete(f"{UI}/vehicles/car1{query}")
        assert resp.status == 422
    assert entry_ids(hass) == ["car1"]  # nothing was removed on a guess


async def test_delete_history_of_a_car_with_an_entry_is_refused(hass, hass_admin_client):
    await add_car(hass, "car1")

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1/history")

    assert (resp.status, await resp.json()) == (409, {"detail": "Remove the car first"})
    assert await rows(hass, "car1") == (1, 1, 1)


async def test_delete_history_of_an_archived_car_and_of_an_unknown_one(hass, hass_admin_client):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history=keep")).status == 200

    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1/history")

    assert (resp.status, await resp.json()) == (200, {"history_deleted": True})
    assert await rows(hass, "car1") == (0, 0, 0) and await rows(hass, "car2") == (1, 1, 1)
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1/history")).status == 200  # idempotent: nothing left, nothing to refuse
    assert (await hass_admin_client.delete(f"{UI}/vehicles/never_existed/history")).status == 200


async def test_disabled_entry_is_not_archived_and_cannot_lose_history(hass, hass_admin_client):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
    await hass.async_block_till_done()

    assert (await settings_of(hass_admin_client))["car1"]["archived"] is False  # an entry in any state keeps its car active
    resp = await hass_admin_client.delete(f"{UI}/vehicles/car1/history")
    assert (resp.status, await resp.json()) == (409, {"detail": "Remove the car first"})
    assert await rows(hass, "car1") == (1, 1, 1)


async def test_non_admin_gets_403(hass, hass_client, hass_read_only_user):
    await add_car(hass, "car1")
    token = await hass.auth.async_create_refresh_token(hass_read_only_user, "https://ci.example.test")
    client = await hass_client(hass.auth.async_create_access_token(token))

    for url in (f"{UI}/vehicles/car1?history=delete", f"{UI}/vehicles/car1?history=keep", f"{UI}/vehicles/car1/history", f"{UI}/vehicles/nobody/history"):
        resp = await client.delete(url)
        assert (resp.status, await resp.json()) == (403, {"detail": "admin only"})
    assert entry_ids(hass) == ["car1"] and await rows(hass, "car1") == (1, 1, 1)


async def test_readding_after_keep_continues_history_and_after_delete_starts_empty(hass, hass_admin_client, monkeypatch):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    service, announced = hass.data[DOMAIN], []
    sink = bridge.async_get(hass)
    real_publish = sink.publish

    def spy(messages, retain=True):
        announced.extend(t for t, _ in messages)
        real_publish(messages, retain)

    monkeypatch.setattr(sink, "publish", spy)

    async def remove(history):
        assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history={history}")).status == 200
        await hass.async_block_till_done()
        assert car_entities(hass, "car1") == set()
        # what was announced for the car goes with its entry, so the car added again is announced again
        assert "car1" not in service.app.totals._announced and "car1" not in service.app.sensors._announced
        assert "car1" not in service.publisher._announced

    async def add_back():
        assert await hass.config_entries.async_setup(add_entry(hass, "car1").entry_id)
        await hass.async_block_till_done()
        announced.clear()

    def last_trip_state():
        eid = er.async_get(hass).async_get_entity_id("sensor", DOMAIN, "car_insights_car1_last_trip_distance")
        return hass.states.get(eid).state

    async def publish(publish_trip):
        """what a closed trip does: publish the last trip and the totals"""
        await on_worker(hass, publish_trip, service.app, "car1")
        await hass.async_block_till_done()
        assert {"homeassistant/sensor/car1_month_distance/config", "homeassistant/sensor/car1_last_trip_distance/config"} <= set(announced)
        assert {"car_insights_car1_month_distance", "car_insights_car1_last_trip_distance"} <= car_entities(hass, "car1")

    await remove("keep")
    await add_back()
    assert last_trip_state() == "5.0"  # the kept history shows at once
    await publish(lambda app, vid: pipeline.republish(app, [vid]))
    assert await rows(hass, "car1") == (1, 1, 1)  # the history continues

    await remove("delete")
    assert await rows(hass, "car1") == (0, 0, 0)
    assert await rows(hass, "car2") == (1, 1, 1)
    await add_back()
    assert last_trip_state() in ("unknown", "unavailable")  # not the deleted trip's distance, before any new trip
    await publish(seed_trip)  # it starts empty: its first trip is the only one
    assert await rows(hass, "car1") == (0, 1, 1)
    assert last_trip_state() == "5.0"


async def test_a_retrying_entry_is_not_archived(hass, hass_admin_client):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history=keep")).status == 200
    hass.config.external_url = "http://ci.example.test"  # not https: the setup of a car app entry is retried

    entry = add_entry(hass, "car1")  # the car added again, with its history, while car2's service runs
    assert not await hass.config_entries.async_setup(entry.entry_id)
    assert entry.state is ConfigEntryState.SETUP_RETRY

    assert (await settings_of(hass_admin_client))["car1"]["archived"] is False
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1/history")).status == 409
    assert await rows(hass, "car1") == (1, 1, 1)


# --- a removal in Devices & services asks through a repair -------------------------------------------------------------------------------

def issue_of(hass, vid):
    return ir.async_get(hass).async_get_issue(DOMAIN, f"vehicle_removed_{vid}")


@pytest.fixture
async def repairs_client(hass, hass_admin_client):
    assert await async_setup_component(hass, "repairs", {})
    return hass_admin_client


async def answer(client, vid, choice):
    """what the repair dialog does: open the fix flow, check its menu, pick an option"""
    resp = await client.post("/api/repairs/issues/fix", json={"handler": DOMAIN, "issue_id": f"vehicle_removed_{vid}"})
    assert resp.status == 200
    menu = await resp.json()
    assert (menu["type"], menu["step_id"], menu["menu_options"]) == ("menu", "init", ["delete", "keep"])
    resp = await client.post(f"/api/repairs/issues/fix/{menu['flow_id']}", json={"next_step_id": choice})
    assert resp.status == 200
    return await resp.json()


async def test_removal_in_devices_and_services_raises_the_repair(hass):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    issue = issue_of(hass, "car1")
    assert (issue.is_fixable, issue.severity, issue.translation_key) == (True, ir.IssueSeverity.WARNING, "vehicle_removed")
    assert issue.translation_placeholders == {"vehicle": "Car car1"} and issue.data == {"vehicle_id": "car1"}
    assert issue_of(hass, "car2") is None
    assert await rows(hass, "car1") == (1, 1, 1)  # the history is kept until someone answers


async def test_repair_delete_deletes_the_history(hass, repairs_client):
    entry = await add_car(hass, "car1")  # its removal stops the service: the check and the deletion use their own connection
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert DOMAIN not in hass.data and issue_of(hass, "car1") is not None

    result = await answer(repairs_client, "car1", "delete")

    assert result["type"] == "create_entry"
    assert await rows(hass, "car1") == (0, 0, 0) and issue_of(hass, "car1") is None


async def test_repair_delete_with_a_running_service_deletes_through_it(hass, repairs_client):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    assert (await answer(repairs_client, "car1", "delete"))["type"] == "create_entry"

    assert await rows(hass, "car1") == (0, 0, 0) and await rows(hass, "car2") == (1, 1, 1) and issue_of(hass, "car1") is None


async def test_repair_keep_keeps_it(hass, repairs_client):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    result = await answer(repairs_client, "car1", "keep")

    assert result["type"] == "create_entry"
    assert await rows(hass, "car1") == (1, 1, 1) and issue_of(hass, "car1") is None


@pytest.mark.parametrize("history", ["keep", "delete"])
async def test_page_removal_raises_no_repair(hass, hass_admin_client, history):
    await add_car(hass, "car1")
    await add_car(hass, "car2")
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history={history}")).status == 200
    await hass.async_block_till_done()

    assert issue_of(hass, "car1") is None


async def test_page_removal_of_the_last_car_raises_no_repair(hass, hass_admin_client):
    await add_car(hass, "car1")
    assert (await hass_admin_client.delete(f"{UI}/vehicles/car1?history=keep")).status == 200
    await hass.async_block_till_done()

    assert DOMAIN not in hass.data and issue_of(hass, "car1") is None


async def test_readding_clears_the_repair(hass):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert issue_of(hass, "car1") is not None

    assert await hass.config_entries.async_setup(add_entry(hass, "car1").entry_id)
    await hass.async_block_till_done()

    assert issue_of(hass, "car1") is None


async def test_an_open_repair_cannot_delete_a_car_added_again(hass, repairs_client):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    resp = await repairs_client.post("/api/repairs/issues/fix", json={"handler": DOMAIN, "issue_id": "vehicle_removed_car1"})
    flow_id = (await resp.json())["flow_id"]  # the dialog is open ...
    assert await hass.config_entries.async_setup(add_entry(hass, "car1").entry_id)  # ... when the car is added again
    await hass.async_block_till_done()

    resp = await repairs_client.post(f"/api/repairs/issues/fix/{flow_id}", json={"next_step_id": "delete"})

    assert (await resp.json())["type"] == "abort"
    assert await rows(hass, "car1") == (1, 1, 1)


async def test_removed_car_without_data_raises_no_repair(hass):
    entry = await add_car(hass, "car1")
    await add_car(hass, "car2")
    await vehicles.purge(hass, "car1")  # nothing stored for it any more
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    assert issue_of(hass, "car1") is None


async def test_last_removed_car_without_data_raises_no_repair(hass):
    entry = await add_car(hass, "car1")
    await vehicles.purge(hass, "car1")
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    assert DOMAIN not in hass.data and issue_of(hass, "car1") is None
