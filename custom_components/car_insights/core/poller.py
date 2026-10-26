"""Polls the HA history of a mapped car integration (the HA entities source) and ingests it as its own source."""
import asyncio
import hashlib
import logging
import time
from dataclasses import dataclass
from typing import Callable

from . import db
from .protocol import Sample
from .ha_entities import MAPPINGS, REPORT_MAX_AGE_MS, entity_ids, parse_history, to_samples

log = logging.getLogger(__name__)
BACKFILL_MS = 10 * 86_400_000  # HA's default history retention
SETTLE_MS = 10_000  # a metric row and its report-time row come from one HA update: end the window before "now" so both land in one fetch


@dataclass(frozen=True)
class SourceConf:
    vehicle_id: str
    mapping: str
    entity_stem: str


def source_id(conf: SourceConf) -> str:
    return "ha_entities-" + hashlib.sha1(f"{conf.mapping}:{conf.entity_stem}".encode()).hexdigest()[:8]


class Poller:
    def __init__(self, conn, confs: list[SourceConf], fetch: Callable[[list[str], int, int], list[list[dict]]],
                 on_samples: Callable[[str, int, int], None], now_ms: Callable[[], int] = lambda: int(time.time() * 1000)):
        self._conn, self._confs, self._fetch, self._on_samples, self._now = conn, confs, fetch, on_samples, now_ms
        self._until: dict[tuple[str, str], int] = {}  # (vehicle, source) -> `now` of its last successful poll (in memory: a restart starts from the cursor)
        self._missing: set[str] = set()  # entities already reported as absent from HA

    async def poll_once(self) -> None:
        for conf in self._confs:
            try:
                await self._poll(conf)
            except Exception:
                log.exception("polling %s failed, retrying next interval", conf.entity_stem)

    async def _poll(self, conf: SourceConf) -> None:
        vid, sid, mapping = conf.vehicle_id, source_id(conf), MAPPINGS[conf.mapping]
        ids, cursor, now = entity_ids(mapping, conf.entity_stem), db.cursors(self._conn, vid, sid), self._now()
        # the report time may be older than its metric row by REPORT_MAX_AGE_MS, so reach back that far before the oldest cursor
        # once polled, only the last poll counts: the cursor of a parked car's quiet entity can be days old
        key = (vid, sid)
        start = self._until[key] - REPORT_MAX_AGE_MS if key in self._until else min(cursor.values()) - REPORT_MAX_AGE_MS if cursor else now - BACKFILL_MS
        history = parse_history(await asyncio.to_thread(self._fetch, ids, start, now - SETTLE_MS))  # the only work off the loop
        for eid in ids:
            if eid not in history and eid not in self._missing:
                self._missing.add(eid)
                log.warning("entity %s is not in the Home Assistant history; check entity_stem", eid)
        if key in self._until:  # HA answers with each entity's state at `start`, stamped `start`: that is not a new row
            cursor = {**cursor, **{e: max(cursor.get(e, -1), start) for e in ids}}
        found, new_cursor = to_samples(mapping, conf.entity_stem, history, cursor)
        if new_cursor == cursor:
            self._until[key] = now
            return
        first = db.acked_seq(self._conn, vid, sid) + 1
        samples = [Sample(first + i, t, k, v) for i, (t, k, v) in enumerate(found)]
        db.ingest(self._conn, vid, sid, samples, now, after=lambda c: db.save_cursors(c, vid, sid, new_cursor))
        self._until[key] = now
        if samples:
            self._on_samples(vid, min(s.t for s in samples), now)

    async def run(self, interval_s: float = 60) -> None:
        while True:
            await self.poll_once()
            await asyncio.sleep(interval_s)
