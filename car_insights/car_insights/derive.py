import json
from bisect import bisect_left, bisect_right
from dataclasses import asdict
from typing import Callable

from . import db, route, series
from .charges import KEYS as CHARGE_KEYS, Charge, find_charges
from .live import FUTURE_SLACK_MS
from .odometer import chain
from .trips import KEYS as TRIP_KEYS, QUIET_MS, Trip, find_trips

ALGO = 5  # bump when trip/charge derivation changes: stored rows of the old version are dropped and rebuilt
ESTIMATE_HOLD_MS = 7 * 86_400_000  # a SoC-estimated charge this recent is re-derived on every update: the car's value may still arrive
_TABLES = ("trips", "charges")
_SATELLITES = {"trips": ("trip_series", "trip_routes"), "charges": ("charge_series",)}  # deleted and inserted exactly with their rows
KEYS = tuple(sorted({*TRIP_KEYS, *CHARGE_KEYS, *series.KEYS}))  # the only sample keys derivation loads
Zones = Callable[[float, float], str | None]


def _trip_wire(t: Trip, zones: Zones, odo: tuple[float | None, float | None]) -> dict:
    d = asdict(t)
    first, last = d.pop("first_fix"), d.pop("last_fix")
    return {**d, "from": zones(*first) if first else None, "to": zones(*last) if last else None, "duration_s": round(t.duration_s),
            "odometer_start_km": odo[0], "odometer_end_km": odo[1]}


def _charge_wire(c: Charge, zones: Zones) -> dict:
    d = asdict(c)
    fix = d.pop("fix")
    return {**d, "place": zones(*fix) if fix else None, "duration_s": round(c.duration_s)}


class Deriver:
    def __init__(self, conn, zones: Zones, capacity: Callable[[str], float] = lambda vid: 60_000.0, rebuild: bool = False):
        self._conn, self._zones, self._capacity = conn, zones, capacity
        self._idle: dict[str, int] = {}  # vehicle -> newest sample t read while nothing was open: the next window starts there
        self._ignition: set[str] = set()  # vehicles known to send an ignition signal (it never goes away)
        self._cloud: set[str] = set()  # vehicles with a cloud source (charging_state samples)
        # a vehicle with any old-version row in either table is rebuilt whole; `rebuild` (the zones changed) rebuilds every vehicle
        stale = {r[0] for t in _TABLES for r in conn.execute(f"SELECT vehicle_id FROM {t} WHERE algo!=? OR ?", (ALGO, rebuild))}
        with db.tx(conn):
            for t in _TABLES:
                conn.executemany(f"DELETE FROM {t} WHERE vehicle_id=?", [(v,) for v in stale])
                for sat in _SATELLITES[t]:
                    conn.executemany(f"DELETE FROM {sat} WHERE vehicle_id=?", [(v,) for v in stale])

    def _newest_end(self, vid: str, below: int | None = None) -> int:
        """newest closed end over both tables (strictly below `below` when given), or -1"""
        cap = "" if below is None else " AND end<?"
        args = (vid,) if below is None else (vid, below)
        return max(self._conn.execute(f"SELECT MAX(end) FROM {t} WHERE vehicle_id=?{cap}", args).fetchone()[0] or -1 for t in _TABLES)

    def update(self, vid: str, min_t: int | None, received_ms: int) -> tuple[list[dict], list[dict], set[tuple[str, int]]]:
        """Re-derive everything after the last closed segment (or before min_t when late data arrived).
        Open segments are stored with a NULL end and replaced on every call. Returns the trips and
        charges that closed or changed since they were last stored, and the (table, start) of those that were already closed before
        (refinements: late data changed them, no new event)."""
        conn = self._conn
        # shortcut: while a trip or charge is open each batch re-reads the samples since its start (a 2 h drive is ~43k
        # samples, ~0.1 s), fine until one runs for many hours; checkpoint open segments if it gets slow. An idle vehicle
        # reads only new samples, except in its first update after a restart (from its newest closed end).
        # shortcut: the first full rebuild (fresh install or ALGO bump) loads all history in one request and find_charges is
        # O(n x sessions); chunk the rebuild by window if it gets slow.
        # shortcut: late data landing after a closed end (inside its P-stop proof window) does not reopen it; senders
        # upload oldest-first, so that needs two car senders interleaving (cloud samples never reach find_trips).
        with db.tx(conn):
            w = max(self._newest_end(vid), self._idle.get(vid, -1))
            if min_t is not None and min_t <= w:  # late data: back to the newest closed end below it
                w = self._newest_end(vid, min_t)
            # a recent SoC-estimated charge is re-derived until the car's own value replaces it; one with no car reading
            # before its start (start_wh null) can never be refined, so it holds nothing
            # shortcut: a held estimate makes every update (each 5 s batch while driving) re-read all samples since its start,
            # up to 7 days; checkpoint it (or release the hold once a car reading exists) if that gets slow.
            held = conn.execute("SELECT MIN(start) FROM charges WHERE vehicle_id=? AND end>=? AND json_extract(json, '$.energy_source')='soc_estimate'"
                                " AND json_extract(json, '$.start_wh') IS NOT NULL", (vid, received_ms - ESTIMATE_HOLD_MS)).fetchone()[0]
            if held is not None:
                w = min(w, held - 1)
            while True:  # a stored segment (open or closed) straddling the window start must be re-derived whole
                starts = [r[0] for t in _TABLES for r in conn.execute(
                    f"SELECT start FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?) AND start<=?", (vid, w, w))]
                if not starts:
                    break
                w = min(starts) - 1
            old = {t: dict(conn.execute(f"SELECT start, json FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w)))
                   for t in _TABLES}
            for t in _TABLES:  # the series and routes first: they are found through the rows they belong to
                for sat in _SATELLITES[t]:
                    conn.execute(f"DELETE FROM {sat} WHERE vehicle_id=? AND start IN "
                                 f"(SELECT start FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?))", (vid, vid, w))
                conn.execute(f"DELETE FROM {t} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w))
            if vid not in self._ignition and db.has_key(conn, vid, "ignition"):
                self._ignition.add(vid)
            if vid not in self._cloud and db.has_key(conn, vid, "charging_state"):
                self._cloud.add(vid)
            # samples stamped far in the future (a bad clock) are no data yet
            samples = db.samples_after(conn, vid, w, received_ms + FUTURE_SLACK_MS, KEYS)
            seed = db.latest_at_or_before(conn, vid, w, KEYS)
            # a trip that started after a plugged/charging_state=True seed means that charge's end was missed (find_charges closed
            # it at the trip start); the stale flag must not open a new session after the trip
            for k in ("plugged", "charging_state"):
                if seed.get(k) is True:
                    last_trip_start = conn.execute("SELECT MAX(start) FROM trips WHERE vehicle_id=?", (vid,)).fetchone()[0] or -1
                    if last_trip_start > (db.latest_t(conn, vid, k, w) or -1):
                        seed[k] = False
            # a cloud report is no proof the car slept: find_trips sees only its own keys
            last = db.car_last_received(conn, vid)
            raw_trips = find_trips([x for x in samples if x.k in TRIP_KEYS], seed, vid in self._ignition,
                                   quiet=last is not None and received_ms - last >= QUIET_MS)
            charges = [_charge_wire(c, self._zones) for c in find_charges(samples, seed, vid in self._cloud, self._capacity(vid))]
            new: dict[str, list[dict]] = {"trips": [], "charges": []}
            refined: set[tuple[str, int]] = set()
            trips: list[dict] = []
            times = [x.t for x in samples]
            for table, rows in (("trips", raw_trips), ("charges", charges)):
                for r in rows:
                    if table == "trips":  # in start order: earlier closed trips are already stored, so chain sees them
                        r = _trip_wire(r, self._zones, chain(conn, vid, r.start, r.distance_m))
                        trips.append(r)
                    js = db.json_dumps(r)
                    conn.execute(f"INSERT INTO {table} VALUES(?,?,?,?,?)", (vid, r["start"], r["end"], ALGO, js))
                    span = samples[bisect_left(times, r["start"]):None if r["end"] is None else bisect_right(times, r["end"])]
                    ser = series.trip(span, r["start_wh"], r["start"]) if table == "trips" else series.charge(span, r["start"], r["end"])
                    conn.execute(f"INSERT INTO {_SATELLITES[table][0]} VALUES(?,?,?)", (vid, r["start"], db.json_dumps(ser)))
                    if table == "trips":
                        conn.execute("INSERT INTO trip_routes VALUES(?,?,?,?)", (vid, r["start"], ALGO, db.json_dumps(route.from_samples(span))))
                    if r["end"] is not None and old[table].get(r["start"]) != js:
                        new[table].append(r)
                        if r["start"] in old[table] and json.loads(old[table][r["start"]])["end"] is not None:
                            refined.add((table, r["start"]))
        # an estimate still within its hold re-reads its window, so no watermark may skip past it
        estimating = any(c["energy_source"] == "soc_estimate" and c["start_wh"] is not None and c["end"] >= received_ms - ESTIMATE_HOLD_MS
                         for c in charges if c["end"] is not None)
        if estimating or any(r["end"] is None for r in trips + charges):
            self._idle.pop(vid, None)
        else:
            self._idle[vid] = samples[-1].t if samples else w
        return new["trips"], new["charges"], refined

    def current_trip(self, vid: str) -> dict | None:
        r = self._conn.execute("SELECT json FROM trips WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone()
        return None if r is None else json.loads(r[0])

    def trip_series(self, vid: str, start: int) -> dict | None:
        return self._series("trip_series", vid, start)

    def charge_series(self, vid: str, start: int) -> dict | None:
        return self._series("charge_series", vid, start)

    def trip_route(self, vid: str, start: int) -> list[list[float]] | None:
        r = self._conn.execute("SELECT points FROM trip_routes WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
        return None if r is None else json.loads(r[0])

    def _series(self, table: str, vid: str, start: int) -> dict | None:
        r = self._conn.execute(f"SELECT json FROM {table} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
        return None if r is None else json.loads(r[0])

    def stored_trips(self, vid: str, limit: int = -1, since: int = 0) -> list[dict]:
        return self._stored("trips", vid, limit, since)

    def stored_charges(self, vid: str, limit: int = -1, since: int = 0) -> list[dict]:
        return self._stored("charges", vid, limit, since)

    def _stored(self, table: str, vid: str, limit: int, since: int) -> list[dict]:
        """Closed rows starting at or after `since`, newest first (limit -1: all)."""
        rows = self._conn.execute(
            f"SELECT json FROM {table} WHERE vehicle_id=? AND end IS NOT NULL AND start>=? ORDER BY start DESC LIMIT ?", (vid, since, limit))
        return [json.loads(r[0]) for r in rows]
