import asyncio
from pathlib import Path

import pytest

from custom_components.car_insights import backup
from custom_components.car_insights.core.access import Viewer
from custom_components.car_insights.service import Service

ADMIN = Viewer("u1", "Tester", True)
BATCH = b'{"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd", "samples": [{"seq": 1, "t": 1000, "k": "speed", "v": 1.0}]}'


@pytest.fixture(autouse=True)
def env(enable_custom_integrations, hass):
    pass


@pytest.fixture
async def svc(hass):
    s = await Service.acquire(hass)
    yield s
    await backup.async_post_backup(hass)  # a test that failed halfway must not leave the worker held
    await Service.release(hass)


def _wal(hass) -> Path:
    return Path(hass.config.path("car_insights", "car_insights.db-wal"))


async def test_pre_backup_empties_the_wal(hass, svc):
    assert (await svc.ingest(BATCH, 2_000))[0] == 200
    assert _wal(hass).stat().st_size > 0
    await backup.async_pre_backup(hass)
    assert _wal(hass).stat().st_size == 0  # everything is in the database file, which is what a backup copies


async def test_a_call_between_pre_and_post_waits_for_post(hass, svc):
    await backup.async_pre_backup(hass)
    call = asyncio.create_task(svc.ui("GET", "/me", {}, None, ADMIN))
    await asyncio.sleep(0.3)
    assert not call.done() and _wal(hass).stat().st_size == 0  # nothing written meanwhile
    await backup.async_post_backup(hass)
    assert (await asyncio.wait_for(call, 5))[0] == 200


async def test_pre_twice_then_post_resumes(hass, svc):
    await backup.async_pre_backup(hass)
    await asyncio.wait_for(backup.async_pre_backup(hass), 5)  # a second hold must not wait for itself
    await backup.async_post_backup(hass)
    assert (await asyncio.wait_for(svc.ui("GET", "/me", {}, None, ADMIN), 5))[0] == 200


async def test_without_a_service_both_are_no_ops(hass):
    await backup.async_pre_backup(hass)
    await backup.async_post_backup(hass)


async def test_post_without_pre_changes_nothing(hass, svc):
    await backup.async_post_backup(hass)
    assert (await asyncio.wait_for(svc.ui("GET", "/me", {}, None, ADMIN), 5))[0] == 200
