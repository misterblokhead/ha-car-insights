import json
from typing import Callable

from . import db
from .charges import find_charges
from .trips import find_trips

ALGO = 1  # bump when trip/charge derivation changes: stored rows of the old version are dropped and rebuilt
_TABLES = ("trips", "charges")


def _trip_wire(t, zones) -> dict:
    return {
        "start": t.start, "end": t.end,
        "from": zones(*t.first_fix) if t.first_fix else None, "to": zones(*t.last_fix) if t.last_fix else None,
        "distance_m": t.distance_m, "duration_s": round(t.duration_s), "avg_speed_mps": t.avg_speed_mps,
        "max_speed_mps": t.max_speed_mps, "start_wh": t.start_wh, "end_wh": t.end_wh, "net_wh": t.net_wh,
        "gross_wh": t.gross_wh, "recup_wh": t.recup_wh, "avg_temp_c": t.avg_temp_c,
    }


def _charge_wire(c, zones) -> dict:
    return {
        "start": c.start, "end": c.end, "place": zones(*c.fix) if c.fix else None, "start_wh": c.start_wh,
        "end_wh": c.end_wh, "added_wh": c.added_wh, "duration_s": round(c.duration_s),
        "range_added_m": c.range_added_m, "avg_w": c.avg_w,
    }


class Deriver:
    def __init__(self, conn, zones: Callable[[float, float], str | None]):
        self._conn, self._zones = conn, zones
        # a vehicle with any old-version row in either table is rebuilt whole
        stale = {r[0] for t in _TABLES for r in conn.execute(f"SELECT vehicle_id FROM {t} WHERE algo!=?", (ALGO,))}
        for t in _TABLES:
            conn.executemany(f"DELETE FROM {t} WHERE vehicle_id=?", [(v,) for v in stale])

    def _newest_end(self, vid: str, below: int | None = None) -> int:
        """newest closed end over both tables (strictly below `below` when given), or -1"""
        cap = "" if below is None else " AND end<?"
        args = (vid,) if below is None else (vid, below)
        return max(self._conn.execute(f"SELECT MAX(end) FROM {t} WHERE vehicle_id=?{cap}", args).fetchone()[0] or -1 for t in _TABLES)

    def update(self, vid: str, min_t: int | None, now_ms: int) -> tuple[list[dict], list[dict]]:
        """Re-derive everything after the last closed segment (or before min_t when late data arrived).
        Open segments are stored with a NULL end and replaced on every call. Returns the trips and
        charges that closed or changed since they were last stored."""
        conn = self._conn
        # shortcut: re-reads all samples since the last closed segment per batch; fine for hours of driving, index by window if it gets slow
        conn.execute("BEGIN IMMEDIATE")
        try:
            w = self._newest_end(vid)
            if min_t is not None and min_t <= w:
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
            samples, seed = db.samples_after(conn, vid, w), db.latest_at_or_before(conn, vid, w)
            trips = [_trip_wire(t, self._zones) for t in find_trips(samples, seed, now_ms, db.has_key(conn, vid, "ignition"))]
            charges = [_charge_wire(c, self._zones) for c in find_charges(samples, seed, now_ms)]
            new: dict[str, list[dict]] = {"trips": [], "charges": []}
            for table, rows in (("trips", trips), ("charges", charges)):
                for r in rows:
                    js = db._json(r)
                    conn.execute(f"INSERT INTO {table} VALUES(?,?,?,?,?)", (vid, r["start"], r["end"], ALGO, js))
                    if r["end"] is not None and old[table].get(r["start"]) != js:
                        new[table].append(r)
            conn.execute("COMMIT")
        except BaseException:
            if conn.in_transaction:
                conn.execute("ROLLBACK")
            raise
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
