import json

import pytest
from homeassistant.components import frontend
from pytest_homeassistant_custom_component.common import MockConfigEntry

import custom_components.car_insights as integration
from custom_components.car_insights import service
from custom_components.car_insights.const import DOMAIN

BATCH = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1_000, "k": "speed", "v": 1.0}]}).encode()
UI = "/api/car_insights/ui"


class _Sink:
    def publish(self, messages, retain=True):
        pass


@pytest.fixture
async def entry(enable_custom_integrations, hass, monkeypatch):
    monkeypatch.setattr(service, "make_sink", lambda hass: _Sink())
    hass.config.external_url = "https://ci.example.test"
    e = MockConfigEntry(domain=DOMAIN, title="Invented car", data={
        "vehicle_id": "car1", "vehicle_name": "Invented car", "secret": "invented-secret-0123", "webhook_id": "invented_webhook_id"})
    e.add_to_hass(hass)
    assert await hass.config_entries.async_setup(e.entry_id)
    await hass.data[DOMAIN].ingest(BATCH, 2_000)  # car1 exists, nobody but admins may see it
    yield e
    await hass.config_entries.async_unload(e.entry_id)


async def _client(hass, hass_client, user):
    token = await hass.auth.async_create_refresh_token(user, "https://ci.example.test")
    return await hass_client(hass.auth.async_create_access_token(token))


async def test_me_answers_with_hass_user(hass, entry, hass_client, hass_admin_user):
    resp = await (await hass_client()).get(f"{UI}/me")
    me = await resp.json()
    assert resp.status == 200
    assert me["user_id"] == hass_admin_user.id and me["is_admin"] is True and me["name"] == hass_admin_user.name


async def test_viewer_cannot_see_hidden_vehicle(hass, entry, hass_client, hass_read_only_user):
    c = await _client(hass, hass_client, hass_read_only_user)
    me = await (await c.get(f"{UI}/me")).json()
    assert me["is_admin"] is False
    resp = await c.get(f"{UI}/trips/car1/123")
    assert resp.status == 404 and await resp.json() == {"detail": "not found"}


async def test_viewer_cannot_write(hass, entry, hass_client, hass_read_only_user):
    c = await _client(hass, hass_client, hass_read_only_user)
    assert (await c.post(f"{UI}/groups", json={"name": "Fleet"})).status == 403
    assert (await c.get(f"{UI}/settings")).status == 403


async def test_admin_writes_with_json(hass, entry, hass_client):
    c = await hass_client()
    resp = await c.post(f"{UI}/groups", json={"name": "Fleet"})
    assert resp.status == 200 and "id" in await resp.json()
    gid = (await resp.json())["id"]
    assert (await c.delete(f"{UI}/groups/{gid}")).status in (200, 204)


async def test_unauthenticated_is_401(hass, entry, hass_client_no_auth):
    assert (await (await hass_client_no_auth()).get(f"{UI}/me")).status == 401


@pytest.mark.parametrize("raw", [b"{nope", b'{"name": NaN}', b'{"name": Infinity}', b"\xff\xfe"])
async def test_bad_json_is_400(hass, entry, hass_client, raw):
    resp = await (await hass_client()).post(f"{UI}/groups", data=raw)
    assert resp.status == 400 and await resp.json() == {"detail": "invalid JSON"}


async def test_empty_body_is_none_and_big_body_is_413(hass, entry, hass_client):
    c = await hass_client()
    assert (await c.post(f"{UI}/groups", data=b"")).status == 422  # the page API's own answer for a missing body
    assert (await c.post(f"{UI}/groups", data=b" " * (1024 * 1024 + 1))).status == 413


async def test_no_service_is_503(hass, entry, hass_client):
    c = await hass_client()
    svc = hass.data.pop(DOMAIN)
    try:
        resp = await c.get(f"{UI}/me")
        assert resp.status == 503 and await resp.json() == {"detail": "not ready"}
    finally:
        hass.data[DOMAIN] = svc


async def test_panel_registered_and_removed(hass, entry):
    panel = hass.data[frontend.DATA_PANELS]["car_insights"]
    assert panel.sidebar_title == "Car Insights" and panel.sidebar_icon == "mdi:car-electric" and panel.require_admin is False
    assert hass.data["car_insights_http"] is True
    await hass.config_entries.async_unload(entry.entry_id)
    assert "car_insights" not in hass.data[frontend.DATA_PANELS]
    assert await hass.config_entries.async_setup(entry.entry_id)  # back: the view is not registered twice
    assert "car_insights" in hass.data[frontend.DATA_PANELS]


async def test_second_entry_keeps_panel_until_last_unloads(hass, entry):
    e2 = MockConfigEntry(domain=DOMAIN, title="Other", data={
        "vehicle_id": "car2", "vehicle_name": "Other", "secret": "invented-secret-4567", "webhook_id": "other_webhook_id"})
    e2.add_to_hass(hass)
    assert await hass.config_entries.async_setup(e2.entry_id)
    await hass.config_entries.async_unload(entry.entry_id)
    assert "car_insights" in hass.data[frontend.DATA_PANELS]
    await hass.config_entries.async_unload(e2.entry_id)
    assert "car_insights" not in hass.data[frontend.DATA_PANELS]
    assert await hass.config_entries.async_setup(entry.entry_id)  # the fixture unloads it
