"""Polls the HA history of a car's own integration entities (the HA entities source) and ingests it as its own source."""
import asyncio
import hashlib
import logging
import time
from dataclasses import dataclass
from typing import Callable

from . import db
from .protocol import Sample
from .ha_entities import CAR_APP_IGNORED, REPORT_MAX_AGE_MS, REQUIRED, parse_history, to_samples

log = logging.getLogger(__name__)
BACKFILL_MS = 10 * 86_400_000  # HA's default history retention
SETTLE_MS = 10_000  # a metric row and its report-time row come from one HA update: end the window before "now" so both land in one fetch
BAD_LOG_MS = 3_600_000  # a value that is no reading is logged at most this often per entity


@dataclass(frozen=True)
class SourceConf:
    vehicle_id: str
    source_id: str
    entities: dict[str, str]  # reading -> entity registry id
    car_app: bool


def legacy_source_id(mapping: str, stem: str) -> str:
    return "ha_entities-" + hashlib.sha1(f"{mapping}:{stem}".encode()).hexdigest()[:8]


def new_source_id(vehicle_id: str, device_id: str) -> str:
    return "ha_entities-" + hashlib.sha1(f"{vehicle_id}:{device_id}".encode()).hexdigest()[:8]


class Poller:
    def __init__(self, conn, fetch: Callable[[list[str], int, int, list[str]], list[list[dict]]],
                 resolve: Callable[[list[str]], dict[str, tuple[str, str | None]]],
                 on_polled: Callable[[str, list[Sample], int, int], None], on_missing: Callable[[str, list[str]], None],
                 now_ms: Callable[[], int] = lambda: int(time.time() * 1000)):
        self._conn, self._fetch, self._resolve, self._on_polled, self._on_missing, self._now = conn, fetch, resolve, on_polled, on_missing, now_ms
        self._confs: dict[str, SourceConf] = {}
        self._until: dict[tuple[str, str], int] = {}  # (vehicle, source) -> `now` of its last successful poll (in memory: a restart starts from the cursor)
        self._reported: dict[str, list[str]] = {}  # vehicle -> the missing readings last reported
        self._bad_logged: dict[str, int] = {}  # entity -> when its bad values were last logged

    def set_conf(self, vehicle_id: str, conf: SourceConf | None) -> None:
        """Add, replace or remove a vehicle's source; call it on the worker"""
        self._reported.pop(vehicle_id, None)
        if conf is None:
            self._confs.pop(vehicle_id, None)
        else:
            self._confs[vehicle_id] = conf

    async def poll_once(self) -> None:
        for conf in list(self._confs.values()):
            try:
                await self._poll(conf)
            except Exception:
                log.exception("polling %s failed, retrying next interval", conf.vehicle_id)

    async def _poll(self, conf: SourceConf) -> None:
        vid, sid = conf.vehicle_id, conf.source_id
        wanted = {r: rid for r, rid in conf.entities.items() if not (conf.car_app and r in CAR_APP_IGNORED)}
        found = await asyncio.to_thread(self._resolve, list(wanted.values()))
        missing = sorted({r for r, rid in wanted.items() if rid not in found} | {r for r in REQUIRED if r not in wanted})
        if self._reported.get(vid) != missing:
            self._reported[vid] = missing
            self._on_missing(vid, missing)
        if any(r in missing for r in REQUIRED):
            return  # paused: the cursor stays, so the catch-up after the fix loses nothing
        entities = {r: found[rid][0] for r, rid in wanted.items() if rid in found}
        units = dict(found.values())
        ids, cursor, now = list(entities.values()), db.cursors(self._conn, vid, sid), self._now()
        # the report time may be older than its metric row by REPORT_MAX_AGE_MS, so reach back that far before the oldest cursor
        # once polled, only the last poll counts: the cursor of a parked car's quiet entity can be days old
        key = (vid, sid)
        oldest = min((cursor[e] for e in ids if e in cursor), default=max(cursor.values())) if cursor else None  # a dead entity's cursor must not widen it
        start = self._until[key] - REPORT_MAX_AGE_MS if key in self._until else oldest - REPORT_MAX_AGE_MS if cursor else now - BACKFILL_MS
        attr_ids = [entities["location"]] if "location" in entities else []
        history = parse_history(await asyncio.to_thread(self._fetch, ids, start, now - SETTLE_MS, attr_ids))  # the only work off the loop
        if cursor:  # a renamed (or newly added) entity starts where the source is, not at its whole history
            cursor = {**{e: max(cursor.values()) for e in ids}, **cursor}
        if key in self._until:  # HA answers with each entity's state at `start`, stamped `start`: that is not a new row
            cursor = {**cursor, **{e: max(cursor.get(e, -1), start) for e in ids}}
        found_samples, new_cursor, bad = to_samples(entities, units, history, cursor)
        for eid, state in bad:
            if now - self._bad_logged.get(eid, -BAD_LOG_MS) >= BAD_LOG_MS:
                self._bad_logged[eid] = now
                log.warning("entity %s has a value that is no reading: %r", eid, state)
        samples: list[Sample] = []
        if new_cursor != cursor:
            first = db.acked_seq(self._conn, vid, sid) + 1
            samples = [Sample(first + i, t, k, v) for i, (t, k, v) in enumerate(found_samples)]
            db.ingest(self._conn, vid, sid, samples, now, after=lambda c: db.save_cursors(c, vid, sid, new_cursor))
        self._until[key] = now
        self._on_polled(vid, samples, now, now - SETTLE_MS)

    async def run(self, interval_s: float = 60) -> None:
        while True:
            await self.poll_once()
            await asyncio.sleep(interval_s)
