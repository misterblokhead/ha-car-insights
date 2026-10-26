"""Entry setup: what it tells the owner and what it leaves behind when it fails."""
import time
from pathlib import Path
from unittest.mock import patch

import pytest
from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntryState
from pytest_homeassistant_custom_component.common import MockConfigEntry

import custom_components.car_insights as integration
from custom_components.car_insights import bridge, service
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import db
from custom_components.car_insights.core.protocol import Sample

SECRET = "invented-secret-0123"


@pytest.fixture(autouse=True)
def env(enable_custom_integrations, hass):
    hass.config.external_url = "https://ci.example.test"


@pytest.fixture
def share(tmp_path, monkeypatch):
    path = tmp_path / "share"
    (path / "car_insights").mkdir(parents=True)
    monkeypatch.setattr(service, "SHARE_DIR", path)
    return path


def _entry(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Invented car", data={
        "vehicle_id": "car1", "vehicle_name": "Invented car", "secret": SECRET, "webhook_id": "invented_webhook_id"})
    entry.add_to_hass(hass)
    return entry


async def _setup(hass, entry) -> list[dict]:
    """the notifications the setup created"""
    with patch.object(persistent_notification, "async_create") as create:
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return [{"message": c.args[1], **c.kwargs} for c in create.call_args_list]


@pytest.mark.parametrize("url", [None, "http://plain.example.test"])
async def test_url_problems_are_notified_as_car_insights(hass, url):
    hass.config.external_url = url
    hass.config.internal_url = None
    entry = _entry(hass)
    notes = await _setup(hass, entry)
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert [n["title"] for n in notes] == ["Car Insights"]


async def test_new_conf_notification_asks_for_a_copy(hass, share):
    entry = _entry(hass)
    notes = await _setup(hass, entry)
    assert [n["title"] for n in notes] == ["Car Insights"] and "Copy it to the car USB stick" in notes[0]["message"]
    await hass.config_entries.async_unload(entry.entry_id)


async def test_conf_of_an_upgraded_install_needs_no_new_copy(hass, share):
    (share / "car_insights" / "car1.conf").write_text("webhook.url=https://old.example.test\n")  # the add-on's
    entry = _entry(hass)
    notes = await _setup(hass, entry)
    message = notes[0]["message"]
    assert "Copy it" not in message and "moved" in message and "/car_insights/car1.conf" in message and "no new copy" in message
    await hass.config_entries.async_unload(entry.entry_id)


async def test_failed_setup_unloads_its_platforms_and_the_service(hass):
    path = Path(hass.config.path("car_insights", "car_insights.db"))
    now = int(time.time() * 1000)

    def seed():
        path.parent.mkdir(exist_ok=True)
        conn = db.connect(str(path))
        db.ingest(conn, "car1", "car_app-0000abcd", [Sample(1, now, "meta", {"vehicle_name": "Invented car"}), Sample(2, now, "speed", 10.0)], now)
        conn.close()

    await hass.async_add_executor_job(seed)
    entry = _entry(hass)
    with patch.object(integration.webhook, "async_register", side_effect=RuntimeError("boom")):
        await _setup(hass, entry)
    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert hass.states.get("sensor.invented_car_speed").state == "unavailable"  # the entities were added, then taken away again
    assert bridge.async_get(hass)._adders == {} and DOMAIN not in hass.data


async def test_a_setup_that_fails_after_the_webhook_can_be_retried(hass, share):
    class Unreadable:
        def __fspath__(self):
            raise OSError("share is gone")

    (share / "car_insights").rmdir()
    entry = _entry(hass)
    with patch.object(service, "SHARE_DIR", Unreadable()):
        await _setup(hass, entry)
    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert await hass.config_entries.async_reload(entry.entry_id)
    assert entry.state is ConfigEntryState.LOADED
    await hass.config_entries.async_unload(entry.entry_id)
