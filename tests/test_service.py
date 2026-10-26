import asyncio
import json
import threading
import time
from datetime import timedelta
from pathlib import Path

import pytest
from homeassistant.core import CoreState
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.car_insights import ha_adapters, service
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core.access import Viewer
from custom_components.car_insights.core.ha_entities import parse_history
from custom_components.car_insights.core.poller import SourceConf
from custom_components.car_insights.core.zones import Zone
from custom_components.car_insights.service import Service
from custom_components.car_insights.worker import Worker

ADMIN = Viewer("u1", "Tester", True)
BATCH = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1_000, "k": "speed", "v": 1.0}]}).encode()


class ListSink:
    def __init__(self):
        self.msgs = []

    def publish(self, messages, retain=True):
        self.msgs += messages


@pytest.fixture
def hass_config_dir(hass_tmp_config_dir):
    return hass_tmp_config_dir


@pytest.fixture(autouse=True)
def sink(monkeypatch):
    s = ListSink()
    monkeypatch.setattr(service, "make_sink", lambda hass: s)
    return s


@pytest.fixture
async def svc(hass):
    s = await Service.acquire(hass)
    yield s
    await Service.release(hass)


def _threads():
    return [t.name for t in threading.enumerate() if t.name.startswith("car-insights")]


async def test_service_starts_and_stops(hass):
    svc = await Service.acquire(hass)
    assert hass.data[DOMAIN] is svc
    assert Path(hass.config.path("car_insights"), "car_insights.db").exists()
    assert _threads() == ["car-insights"]
    await Service.release(hass)
    assert DOMAIN not in hass.data and _threads() == []


async def test_unload_keeps_worker_for_other_entry(hass):
    first = await Service.acquire(hass)
    assert await Service.acquire(hass) is first
    await Service.release(hass)
    assert (await first.ingest(b"nope", 0))[0] == 400  # still serving
    await Service.release(hass)
    assert _threads() == []
    again = await Service.acquire(hass)
    assert again is not first
    await Service.release(hass)


async def test_concurrent_acquire_shares_one_service(hass):
    a, b = await asyncio.gather(Service.acquire(hass), Service.acquire(hass))
    assert a is b and _threads() == ["car-insights"]
    await Service.release(hass)
    await Service.release(hass)


async def test_failed_start_leaves_nothing_behind(hass, monkeypatch):
    def boom(*a):
        raise RuntimeError("no database")

    monkeypatch.setattr(service.db, "connect", boom)
    with pytest.raises(RuntimeError):
        await Service.acquire(hass)
    assert DOMAIN not in hass.data and _threads() == []


async def test_ingest_and_ui_run_on_the_worker(hass, svc, sink):
    status, out = await svc.ingest(BATCH, 2_000)
    assert status == 200 and out["acked_seq"] == 1
    assert sink.msgs  # the publishers write to the sink make_sink gave
    status, me = await svc.ui("GET", "/me", {}, None, ADMIN)
    assert status == 200 and me["tz"] == hass.config.time_zone
    assert (await svc.ui("GET", "/settings", {}, None, Viewer("u2", None, False)))[0] == 403


async def test_slow_worker_does_not_block_loop(hass, svc):
    slow = asyncio.wrap_future(svc.worker.call(time.sleep, 1))
    t0 = time.monotonic()
    await hass.async_block_till_done()
    hass.states.async_set("sensor.ping", "1")
    assert time.monotonic() - t0 < 0.5
    await slow


async def test_stop_does_not_block_ha_loop(hass, svc):
    """A worker job waits for HA's loop while HA's loop stops the worker: stop must leave the loop free to answer."""
    answered = []

    async def on_ha():
        await asyncio.sleep(0.2)
        answered.append(True)
        return "ok"

    def job():  # what an adapter does from the worker thread
        return ha_adapters._on_ha(hass, on_ha(), timeout=10)

    pending = svc.worker.call(job)
    await asyncio.sleep(0.05)  # the job is now parked on HA's loop
    t0 = time.monotonic()
    await Service.release(hass)
    assert time.monotonic() - t0 < 5
    assert answered == [True] and pending.result(1) == "ok" and _threads() == []


async def test_adapter_call_raises_when_ha_stops(hass):
    async def never():
        await asyncio.sleep(60)

    hass.set_state(CoreState.stopping)
    with pytest.raises(RuntimeError):
        await hass.async_add_executor_job(lambda: ha_adapters._on_ha(hass, never(), timeout=1))


async def test_adapter_call_times_out(hass):
    async def never():
        await asyncio.sleep(60)

    with pytest.raises(TimeoutError):
        await hass.async_add_executor_job(lambda: ha_adapters._on_ha(hass, never(), timeout=0.2))


async def test_zones_from_states(hass):
    hass.states.async_set("zone.test", "0", {"friendly_name": "Test", "latitude": 52.1, "longitude": 4.2, "radius": 150, "passive": False})
    hass.states.async_set("zone.quiet", "0", {"friendly_name": "Quiet", "latitude": 52.3, "longitude": 4.4, "radius": 50, "passive": True})
    hass.states.async_set("zone.broken", "0", {"friendly_name": "Broken", "latitude": "x", "longitude": 4.4, "radius": 50})
    got = await hass.async_add_executor_job(ha_adapters.zones, hass)
    assert sorted(got, key=lambda z: z.name) == [Zone("Quiet", 52.3, 4.4, 50, True), Zone("Test", 52.1, 4.2, 150, False)]


async def test_service_names_places_from_zones(hass):
    hass.states.async_set("zone.test", "0", {"friendly_name": "Test", "latitude": 52.1, "longitude": 4.2, "radius": 150})
    svc = await Service.acquire(hass)
    assert svc.zones.loaded and svc.zones(52.1, 4.2) == "Test"
    await Service.release(hass)


async def test_language(hass):
    hass.config.language = "nl"
    assert ha_adapters.language(hass) == "nl"
    hass.config.language = ""
    assert ha_adapters.language(hass) == "en"


async def test_history_shape(recorder_mock, hass):
    start = dt_util.utcnow().replace(microsecond=0) - timedelta(minutes=30)
    eid, other = "sensor.invented_battery", "sensor.invented_plug"
    for i, state in enumerate(("50", "50", "55", "60"), 1):  # a repeat is no change; every real change is kept (not only "significant" ones)
        hass.states.async_set(eid, state, {"unit_of_measurement": "%"}, timestamp=(start + timedelta(minutes=5 * i)).timestamp())
    hass.states.async_set(other, "unplugged", timestamp=(start + timedelta(minutes=1)).timestamp())
    await async_wait_recording_done(hass)
    end = int((dt_util.utcnow() + timedelta(minutes=1)).timestamp() * 1000)
    got = await hass.async_add_executor_job(ha_adapters.history, hass, [eid, "sensor.invented_missing", other], int(start.timestamp() * 1000), end)
    assert [r[0]["entity_id"] for r in got] == [eid, other]
    assert all(set(row) <= {"entity_id", "state", "last_changed"} for rows in got for row in rows)
    assert [r["state"] for r in got[0]] == ["50", "55", "60"]
    parsed = parse_history(got)  # what the poller does with it
    assert [s for _, s in parsed[eid]] == ["50", "55", "60"] and [s for _, s in parsed[other]] == ["unplugged"]


async def test_poller_confs_from_entry_options(hass):
    MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car1"}, options={"cloud": {"mapping": "renault", "entity_stem": "invented_zoe"}}).add_to_hass(hass)
    MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car2"}, options={}).add_to_hass(hass)  # no cloud source
    svc = await Service.acquire(hass)
    assert svc.confs == [SourceConf("car1", "renault", "invented_zoe")]
    assert svc.poller._confs == svc.confs
    await Service.release(hass)
