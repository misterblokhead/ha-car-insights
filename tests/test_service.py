import asyncio
import json
import threading
import time
from pathlib import Path

import pytest
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CoreState
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights import bridge, ha_adapters, service
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core.access import Viewer
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


@pytest.fixture(autouse=True)
def sink(enable_custom_integrations, monkeypatch):  # the service reads the manifest's version
    s = ListSink()
    monkeypatch.setattr(bridge, "async_get", lambda hass: s)
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
    assert sink.msgs  # the publishers write to the sink the bridge gave
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


CLOUD = {"preset": "renault", "device_id": None, "entities": {"charge_level": "reg1", "odometer": "reg2"}, "source_id": "ha_entities-1a2b3c4d"}


async def test_poller_confs_from_entry_options(hass):
    svc = await Service.acquire(hass)
    await svc.configure(MockConfigEntry(domain=DOMAIN, title="Car 1", data={"vehicle_id": "car1", "webhook_id": "w"}, options={"cloud": CLOUD}))
    await svc.configure(MockConfigEntry(domain=DOMAIN, title="Car 2", data={"vehicle_id": "car2"}, options={"cloud": CLOUD}))
    await svc.configure(MockConfigEntry(domain=DOMAIN, title="Car 3", data={"vehicle_id": "car3"}, options={}))  # no cloud source
    assert svc.poller._confs == {"car1": SourceConf("car1", "ha_entities-1a2b3c4d", CLOUD["entities"], True),
                                 "car2": SourceConf("car2", "ha_entities-1a2b3c4d", CLOUD["entities"], False)}  # no webhook: no car app
    await svc.unconfigure("car1")
    assert list(svc.poller._confs) == ["car2"]
    await Service.release(hass)


async def test_poller_skips_entry_with_bad_cloud_options(hass, caplog):
    svc = await Service.acquire(hass)
    await svc.configure(MockConfigEntry(domain=DOMAIN, title="Broken car", data={"vehicle_id": "car1"}, options={"cloud": {"bogus": 1}}))
    await svc.configure(MockConfigEntry(domain=DOMAIN, title="Good car", data={"vehicle_id": "car2"}, options={"cloud": CLOUD}))
    assert list(svc.poller._confs) == ["car2"]
    assert "Broken car" in caplog.text
    await Service.release(hass)


async def test_ha_stop_stops_the_service(hass, svc):
    hass.bus.async_fire(EVENT_HOMEASSISTANT_STOP)  # entries are not unloaded at shutdown
    await hass.async_block_till_done()
    assert _threads() == []
    await Service.release(hass)  # a later unload is still safe
    assert DOMAIN not in hass.data


async def test_calls_during_a_start_wait_for_it(hass):
    """After a re-add the service is registered while its worker is still building: a call must not find the half-built state."""
    start = asyncio.create_task(Service.acquire(hass))
    await asyncio.sleep(0)
    svc = hass.data[DOMAIN]
    assert svc.ui_api is None  # still starting
    status, me = await svc.ui("GET", "/me", {}, None, ADMIN)
    assert status == 200 and me["tz"] == hass.config.time_zone
    assert (await svc.ingest(BATCH, 2_000))[0] == 200
    assert await start is svc
    await Service.release(hass)


async def test_calls_during_a_failed_start_fail_with_it(hass, monkeypatch):
    def boom(*a):
        raise RuntimeError("no database")

    monkeypatch.setattr(service.db, "connect", boom)
    start = asyncio.create_task(Service.acquire(hass))
    await asyncio.sleep(0)
    with pytest.raises(RuntimeError):
        await hass.data[DOMAIN].ui("GET", "/me", {}, None, ADMIN)
    with pytest.raises(RuntimeError):
        await start


async def test_the_bridge_is_made_on_the_loop(hass, sink, monkeypatch):
    seen = []

    def spy(h):
        seen.append(threading.current_thread())
        return sink

    monkeypatch.setattr(bridge, "async_get", spy)
    await Service.acquire(hass)
    await Service.release(hass)
    assert seen == [threading.current_thread()]  # the test's thread is the loop's
