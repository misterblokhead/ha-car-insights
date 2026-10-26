"""The runtime of every Car Insights entry: one worker thread owning the database and everything the add-on's __main__ ran."""
import asyncio
import logging
import time
from functools import partial
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant

from . import ha_adapters
from .const import DOMAIN
from .core import capacity as capacity_learning, costs, db, geocode, pipeline, prices
from .core.access import Viewer
from .core.derive import Deriver
from .core.ha_mqtt import Sink
from .core.ingest import handle_batch
from .core.poller import Poller, SourceConf
from .core.publisher import Publisher
from .core.totals_sensors import TotalsSensors
from .core.trip_sensors import TripSensors
from .core.ui_api import UiApi
from .core.zones import ZoneCache
from .worker import Worker

log = logging.getLogger(__name__)


class _DropSink:
    def publish(self, messages: list[tuple[str, str]], retain: bool = True) -> None:
        log.debug("no entity bridge yet, dropping %d messages", len(messages))


def make_sink(hass: HomeAssistant) -> Sink:
    """Where the publishers send their discovery and state messages."""
    return _DropSink()


def _now_ms() -> int:
    return int(time.time() * 1000)


class Service:
    """Shared by all entries of the domain: `acquire` starts it for the first, `release` stops it after the last."""

    def __init__(self, hass: HomeAssistant):
        self.hass, self.refs = hass, 0
        self.worker = Worker("car-insights")
        self.confs: list[SourceConf] = []  # read when the service starts: an entry added later is polled after the next start
        self._ready: asyncio.Future | None = None
        self._unsub_stop: CALLBACK_TYPE | None = None
        self.conn = self.zones = self.poller = self.publisher = self.app = self.ui_api = None  # set on the worker by _build

    @classmethod
    async def acquire(cls, hass: HomeAssistant) -> "Service":
        service = hass.data.get(DOMAIN)
        if service is None:
            service = hass.data[DOMAIN] = cls(hass)
            service._ready = hass.async_create_task(service._start())
            # entries are not unloaded at shutdown, so the service must hear HA stop itself
            service._unsub_stop = hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, service._on_ha_stop)
        service.refs += 1
        try:
            await asyncio.shield(service._ready)
        except BaseException:
            await cls.release(hass)
            raise
        return service

    @classmethod
    async def release(cls, hass: HomeAssistant) -> None:
        service = hass.data.get(DOMAIN)
        if service is None:
            return
        service.refs -= 1
        if service.refs <= 0:
            del hass.data[DOMAIN]
            if service._unsub_stop is not None:
                service._unsub_stop()
            await service._stop()

    async def _on_ha_stop(self, event: Event) -> None:
        self._unsub_stop = None  # a once-listener is gone after firing
        await self._stop()

    async def _start(self) -> None:
        hass = self.hass
        directory = Path(hass.config.path("car_insights"))
        await hass.async_add_executor_job(partial(directory.mkdir, exist_ok=True))
        self.confs = []
        for e in hass.config_entries.async_entries(DOMAIN):
            if "cloud" in e.options:
                try:
                    self.confs.append(SourceConf(vehicle_id=e.data["vehicle_id"], **e.options["cloud"]))
                except (TypeError, KeyError):
                    log.warning("Skipping the cloud source of %s: its options do not fit", e.title)
        self.worker.start()
        try:
            await asyncio.wrap_future(self.worker.call(self._build, str(directory / "car_insights.db")))
        except BaseException:
            await self._stop()
            raise

    async def _stop(self) -> None:
        # off HA's loop: a job on the worker may be waiting for HA's answer (ha_adapters), and the loop must be free to give it
        await self.hass.async_add_executor_job(self._close)

    def _close(self) -> None:
        self.worker.stop()
        if self.conn is not None:
            self.conn.close()

    def _build(self, db_path: str) -> None:
        """On the worker: what the add-on's __main__ built, then the start-up work and the background jobs."""
        hass = self.hass
        conn = self.conn = db.connect(db_path)
        tz = ZoneInfo(hass.config.time_zone)
        language = ha_adapters.language(hass)
        sink = make_sink(hass)

        def capacity(vid: str) -> float:
            return db.capacity_wh(conn, vid, db.default_capacity_kwh(conn) * 1000)

        zones = self.zones = ZoneCache(lambda: ha_adapters.zones(hass))
        deriver = Deriver(conn, zones, capacity, spots=lambda lat, lon: prices.spot_name_at(conn, lat, lon))
        sensors = TripSensors(conn, sink, capacity,
                              trip_cost=lambda vid, row: costs.trip_cost(conn, vid, row, tz)["total"],
                              charge_cost=lambda vid, row: costs.charge_cost(prices.book(conn, vid), row)["amount"])
        app = self.app = pipeline.App(conn, deriver, sensors, TotalsSensors(conn, sink, tz), tz, capacity, zones, lambda: zones.loaded)
        zones.on_change = partial(pipeline.relabel, app)  # the cache and the app need each other: only now can a fetch rename places
        self.poller = Poller(conn, self.confs, lambda ids, a, b: ha_adapters.history(hass, ids, a, b), partial(pipeline.ingested, app))
        self.publisher = Publisher(conn, sink, capacity)
        self.ui_api = UiApi(conn, zones, tz, capacity, on_settings=app.totals.publish_groups, on_costs=partial(pipeline.republish, app),
                            relabel=partial(pipeline.relabel, app))
        # before the first ingest and run_daily's first publish: an ALGO bump emptied the rows
        zones.refresh()  # a success renames the stored rows through on_change; a failure changes nothing and zones.run retries
        pipeline.rebuild(app, _now_ms())
        for job in (self.poller.run, app.totals.run_daily, partial(capacity_learning.run, conn), zones.run, partial(pipeline.run_close_quiet, app),
                    partial(geocode.run, conn, partial(geocode.fetch, language=language), _now_ms, lambda: zones.loaded,
                            lambda lat, lon: zones.covers(lat, lon) or prices.spot_name_at(conn, lat, lon) is not None)):
            self.worker.spawn(job)

    async def ingest(self, body: bytes, received: int) -> tuple[int, dict]:
        return await asyncio.wrap_future(self.worker.call(handle_batch, self.app, self.publisher, body, received))

    async def ui(self, method: str, path: str, query: dict[str, str], body: Any, viewer: Viewer) -> tuple[int, Any]:
        return await asyncio.wrap_future(self.worker.call(self.ui_api.handle, method, path, query, body, viewer))
