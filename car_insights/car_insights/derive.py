import json
from dataclasses import asdict
from typing import Callable

from . import db
from .charges import Charge, find_charges
from .live import FUTURE_SLACK_MS
from .trips import Trip, find_trips

ALGO = 1  # bump when trip/charge derivation changes: stored rows of the old version are dropped and rebuilt
_TABLES = ("trips", "charges")
Zones = Callable[[float, float], str | None]


def _trip_wire(t: Trip, zones: Zones) -> dict:
    d = asdict(t)
    first, last = d.pop("first_fix"), d.pop("last_fix")
    return {**d, "from": zones(*first) if first else None, "to": zones(*last) if last else None, "duration_s": round(t.duration_s)}


def _charge_wire(c: Charge, zones: Zones) -> dict:
    d = asdict(c)
    fix = d.pop("fix")
    return {**d, "place": zones(*fix) if fix else None, "duration_s": round(c.duration_s)}


class Deriver:
    def __init__(self, conn, zones: Zones):
        self._conn, self._zones = conn, zones
        # a vehicle with any old-version row in either table is rebuilt whole
        stale = {r[0] for t in _TABLES for r in conn.execute(f"SELECT vehicle_id FROM {t} WHERE algo!=?", (ALGO,))}
        with db.tx(conn):
            for t in _TABLES:
                conn.executemany(f"DELETE FROM {t} WHERE vehicle_id=?", [(v,) for v in stale])

    def _newest_end(self, vid: str, below: int | None = None) -> int:
        """newest closed end over both tables (strictly below `below` when given), or -1"""
        cap = "" if below is None else " AND end<?"
        args = (vid,) if below is None else (vid, below)
        return max(self._conn.execute(f"SELECT MAX(end) FROM {t} WHERE vehicle_id=?{cap}", args).fetchone()[0] or -1 for t in _TABLES)

    def update(self, vid: str, min_t: int | None, received_ms: int) -> tuple[list[dict], list[dict]]:
        """Re-derive everything after the last closed segment (or before min_t when late data arrived).
        Open segments are stored with a NULL end and replaced on every call. Returns the trips and
        charges that closed or changed since they were last stored."""
        conn = self._conn
        # shortcut: each batch re-reads the samples since the start of the oldest open/overlapping segment (a 2 h drive is
        # ~43k samples, ~0.1 s), fine until a trip runs for many hours; checkpoint open segments if it gets slow.
        # shortcut: the first full rebuild (fresh install or ALGO bump) loads all history in one request and find_charges is
        # O(n x sessions); chunk the rebuild by window if it gets slow.
        with db.tx(conn):
            w = self._newest_end(vid)
            # shortcut: late data landing after a closed end (inside its P-stop proof window) does not reopen it; senders
            # upload oldest-first, so that needs two sources interleaving.
            if min_t is not None and min_t <= w:  # late data: back to the newest closed end below it
                w = self._newest_end(vid, min_t)
            while True:  # a stored segment (open or closed) straddling the window start must be re-derived whole
                starts = [r[0] for t in _TABLES for r in conn.execute(
                    f"SELECT start FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?) AND start<=?", (vid, w, w))]
                if not starts:
                    break
                w = min(starts) - 1
            old = {t: dict(conn.execute(f"SELECT start, json FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w)))
                   for t in _TABLES}
            for t in _TABLES:
                conn.execute(f"DELETE FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w))
            # samples stamped far in the future (a bad clock) are no data yet
            samples, seed = db.samples_after(conn, vid, w, received_ms + FUTURE_SLACK_MS), db.latest_at_or_before(conn, vid, w)
            trips = [_trip_wire(t, self._zones) for t in find_trips(samples, seed, db.has_key(conn, vid, "ignition"))]
            charges = [_charge_wire(c, self._zones) for c in find_charges(samples, seed)]
            new: dict[str, list[dict]] = {"trips": [], "charges": []}
            for table, rows in (("trips", trips), ("charges", charges)):
                for r in rows:
                    js = db.json_dumps(r)
                    conn.execute(f"INSERT INTO {table} VALUES(?,?,?,?,?)", (vid, r["start"], r["end"], ALGO, js))
                    if r["end"] is not None and old[table].get(r["start"]) != js:
                        new[table].append(r)
        return new["trips"], new["charges"]

    def current_trip(self, vid: str) -> dict | None:
        r = self._conn.execute("SELECT json FROM trips WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone()
        return None if r is None else json.loads(r[0])

    def stored_trips(self, vid: str, limit: int) -> list[dict]:
        return self._stored("trips", vid, limit)

    def stored_charges(self, vid: str, limit: int) -> list[dict]:
        return self._stored("charges", vid, limit)

    def _stored(self, table: str, vid: str, limit: int) -> list[dict]:
        rows = self._conn.execute(f"SELECT json FROM {table} WHERE vehicle_id=? AND end IS NOT NULL ORDER BY start DESC LIMIT ?", (vid, limit))
        return [json.loads(r[0]) for r in rows]
