import logging
from bisect import bisect_left, bisect_right
from dataclasses import asdict
from typing import Callable

from . import db, route, series, store
from .charges import KEYS as CHARGE_KEYS, Charge, find_charges
from .kinds import CHARGE, KINDS, TRIP
from .odometer import chain
from .protocol import FUTURE_SLACK_MS
from .trips import KEYS as TRIP_KEYS, QUIET_MS, Trip, find_trips

log = logging.getLogger(__name__)
ALGO = 7  # trips keep their start and end points, rows have real columns; bump when trip/charge derivation changes: stored rows of the old version are dropped and rebuilt
ESTIMATE_HOLD_MS = 7 * 86_400_000  # a SoC-estimated charge this recent is re-derived on every update: the car's value may still arrive
KEYS = tuple(sorted({*TRIP_KEYS, *CHARGE_KEYS, *series.KEYS}))  # the only sample keys derivation loads
Zones = Callable[[float, float], str | None]


def _trip_wire(t: Trip, zones: Zones, odo: tuple[float | None, float | None]) -> dict:
    d = asdict(t)
    first, last = d.pop("first_fix"), d.pop("last_fix")
    d.pop("quiet_closed")
    # the points ride in the row for the store's columns only; update strips them (store.public) before a row goes anywhere else
    return {**d, "from": zones(*first) if first else None, "to": zones(*last) if last else None, "duration_s": round(t.duration_s),
            "from_lat": first and first[0], "from_lon": first and first[1], "to_lat": last and last[0], "to_lon": last and last[1],
            "odometer_start_km": odo[0], "odometer_end_km": odo[1]}


def _held(c: dict, received_ms: int) -> bool:
    """A recent SoC-estimated charge is re-derived until the car's own value replaces it; one with no car reading before its start
    (start_wh null) can never be refined, so it holds nothing."""
    return c["end"] is not None and c["end"] >= received_ms - ESTIMATE_HOLD_MS and c["energy_source"] == "soc_estimate" and c["start_wh"] is not None


def _charge_wire(c: Charge, zones: Zones, spots: Zones) -> dict:
    d = asdict(c)
    fix = d.pop("fix")
    zone = zones(*fix) if fix else None
    return {**d, "lat": fix and fix[0], "lon": fix and fix[1], "zone": zone, "place": zone or (spots(*fix) if fix else None),
            "duration_s": round(c.duration_s)}


class Deriver:
    def __init__(self, conn, zones: Zones, capacity: Callable[[str], float] = lambda vid: 60_000.0, spots: Zones = lambda lat, lon: None):
        self._conn, self._zones, self._capacity, self._spots = conn, zones, capacity, spots
        self._idle: dict[str, int] = {}  # vehicle -> newest sample t read while nothing was open: the next window starts there
        self._ignition: set[str] = set()  # vehicles known to send an ignition signal (it never goes away)
        self._cloud: set[str] = set()  # vehicles with a cloud source (charging_state samples)
        # vehicle -> start of its trip closed by the quiet rule alone: once the car is back its backlog may extend that trip;
        # a rejoined trip fires a second ended event (same start) at its real close
        # shortcut: in memory only, a restart between the quiet close and the backlog keeps the split; persist it if that shows up
        self._quiet: dict[str, int] = {}

    def purge_stale(self, rebuild: bool = False) -> None:
        """Delete the rows of every vehicle with a row of another derivation version, so it is derived whole again; `rebuild` (the
        zones changed) deletes every vehicle's."""
        with db.tx(self._conn):
            for vid in store.stale_vehicles(self._conn, ALGO, rebuild):
                for kind in KINDS:
                    store.purge(self._conn, kind, vid)

    def _is_quiet(self, vid: str, received_ms: int) -> bool:
        """The car's own senders have delivered nothing for QUIET_MS, so no backlog is draining."""
        last = db.car_last_received(self._conn, vid)
        return last is not None and received_ms - last >= QUIET_MS

    def _window_start(self, vid: str, min_t: int | None, received_ms: int) -> int:
        """The time after which `update` derives again: samples later than it are read, rows open or ending after it are replaced.
        A car that is back after a quiet close is no longer remembered as quiet."""
        conn = self._conn
        w = max(store.newest_end(conn, vid), self._idle.get(vid, -1))
        if min_t is not None and min_t <= w:  # late data: back to the newest closed end below it
            w = store.newest_end(conn, vid, min_t)
        # shortcut: a held estimate makes every update (each 5 s batch while driving) re-read all samples since its start,
        # up to 7 days; checkpoint it (or release the hold once a car reading exists) if that gets slow.
        held = [c["start"] for c in store.ended(conn, CHARGE, vid, received_ms - ESTIMATE_HOLD_MS) if _held(c, received_ms)]
        if held:
            w = min(w, min(held) - 1)
        if vid in self._quiet and not self._is_quiet(vid, received_ms):  # the car is back: re-derive the trip the quiet rule closed
            w = min(w, self._quiet.pop(vid) - 1)
        while starts := store.straddling(conn, vid, w):  # a stored segment (open or closed) straddling the window start must be re-derived whole
            w = min(starts) - 1
        return w

    def update(self, vid: str, min_t: int | None, received_ms: int) -> tuple[list[dict], list[dict], set[tuple[str, int]]]:
        """Re-derive everything after the last closed segment (or before min_t when late data arrived).
        Open segments are stored with a NULL end and replaced on every call. Returns the trips and
        charges that closed or changed since they were last stored, and the (table, start) of those that were already closed before
        (refinements: late data changed them, no new event)."""
        conn = self._conn
        # shortcut: while a trip or charge is open each batch re-reads the samples since its start (a 2 h drive is ~43k
        # samples, ~0.1 s), fine until one runs for many hours; checkpoint open segments if it gets slow. An idle vehicle
        # reads only new samples, except in its first update after a restart (from its newest closed end).
        # the start-up rebuild runs this in REBUILD_STEP_MS windows (pipeline.rebuild), so the first update of a vehicle never loads all history.
        # shortcut: late data landing after a closed end (inside its P-stop proof window, or after a silence that closed it)
        # does not reopen it; senders upload oldest-first, so that needs two car senders interleaving (cloud samples never
        # reach find_trips). A trip closed only by the quiet rule is the exception: see _quiet.
        with db.tx(conn):
            w = self._window_start(vid, min_t, received_ms)
            quiet = self._is_quiet(vid, received_ms)
            old = {k: store.rows_after(conn, k, vid, w) for k in KINDS}
            for k in KINDS:  # the series and routes go with their rows
                store.drop_after(conn, k, vid, w)
            if vid not in self._ignition and db.has_key(conn, vid, "ignition"):
                self._ignition.add(vid)
            if vid not in self._cloud and db.has_key(conn, vid, "charging_state"):
                self._cloud.add(vid)
            # samples stamped far in the future (a bad clock) are no data yet
            samples = db.samples_after(conn, vid, w, received_ms + FUTURE_SLACK_MS, KEYS)
            seed = db.latest_at_or_before(conn, vid, w, KEYS)
            # a trip that started after a plugged/charging_state=True seed means that charge's end was missed (find_charges closed
            # it at the trip start); the stale flag must not open a new session after the trip. A plugged flag older than the last
            # charge's end is stale too: a cloud charge ended while the car stayed plugged and never sent the plug again.
            # A cloud car may re-send plugged=True (a restart), so its plug is dated by the first True after the last False; the
            # reset seed is marked held so such a repeat opens no car span either.
            for k in ("plugged", "charging_state"):
                if seed.get(k) is True:
                    last_t = db.latest_t(conn, vid, k, w) or -1
                    last_trip_start = store.newest_start(conn, TRIP, vid)
                    last_charge_end = -1
                    plug_t = last_t
                    if k == "plugged":
                        last_charge_end = store.newest_end(conn, vid, kinds=(CHARGE,))
                        if vid in self._cloud:
                            plug_t = db.plug_start(conn, vid, w) or -1
                    if last_trip_start > last_t:  # a True after the trip is a real plug, however often it was re-sent
                        seed[k] = False
                    elif last_charge_end > plug_t:
                        seed[k] = False
                        seed["plugged_held"] = vid in self._cloud
            # a cloud report is no proof the car slept: find_trips sees only its own keys
            raw_trips = find_trips([x for x in samples if x.k in TRIP_KEYS], seed, vid in self._ignition, quiet)
            for trip in raw_trips:
                if trip.quiet_closed:
                    self._quiet[vid] = trip.start
            raw_charges = find_charges(samples, seed, vid in self._cloud, self._capacity(vid))
            # what differs per kind: what was found, how it becomes a row (a trip in start order: earlier closed trips are already
            # stored, so chain sees them) and how its series is cut from its samples
            per_kind = ((TRIP, raw_trips, lambda t: _trip_wire(t, self._zones, chain(conn, vid, t.start, t.distance_m)),
                         lambda r, span: series.trip(span, r["start_wh"], r["start"])),
                        (CHARGE, raw_charges, lambda c: _charge_wire(c, self._zones, self._spots),
                         lambda r, span: series.charge(span, r["start"], r["end"])))
            stored: dict = {k: [] for k in KINDS}
            new: dict[str, list[dict]] = {k.table: [] for k in KINDS}
            refined: set[tuple[str, int]] = set()
            times = [x.t for x in samples]
            seen: set[tuple[str, int]] = set()
            for kind, found, to_row, to_series in per_kind:
                for x in found:
                    if (kind.table, x.start) in seen:  # a repeated start would break the primary key and roll back every update after
                        log.warning("duplicate %s start %s for %s skipped", kind.table, x.start, vid)
                        continue
                    seen.add((kind.table, x.start))
                    r = to_row(x)
                    span = samples[bisect_left(times, r["start"]):None if r["end"] is None else bisect_right(times, r["end"])]
                    store.insert(conn, kind, vid, r, to_series(r, span), route.from_samples(span) if kind.has_route else None, ALGO)
                    r = store.public(r)
                    stored[kind].append(r)
                    if r["end"] is not None and old[kind].get(r["start"]) != r:
                        new[kind.table].append(r)
                        if r["start"] in old[kind] and old[kind][r["start"]]["end"] is not None:
                            refined.add((kind.table, r["start"]))
        # an estimate still within its hold re-reads its window, so no watermark may skip past it
        if any(_held(c, received_ms) for c in stored[CHARGE]) or any(r["end"] is None for k in KINDS for r in stored[k]):
            self._idle.pop(vid, None)
        else:
            self._idle[vid] = samples[-1].t if samples else w
        return new[TRIP.table], new[CHARGE.table], refined
