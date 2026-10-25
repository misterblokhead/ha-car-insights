import asyncio
import logging
import sqlite3
import time
from dataclasses import dataclass
from datetime import tzinfo
from typing import Callable, Sequence

from . import db, periods, route, store, summary
from .derive import ESTIMATE_HOLD_MS, Deriver
from .kinds import CHARGE, TRIP
from .protocol import FUTURE_SLACK_MS, Sample
from .totals_sensors import TotalsSensors
from .trip_sensors import TripSensors
from .trips import QUIET_MS
from .zones import Zones

log = logging.getLogger(__name__)

EVENT_MAX_AGE_MS = 3_600_000  # a close older than this at arrival (a backlog) updates the sensors but fires no event
LATE_WINDOW_MS = 31 * 86_400_000  # older samples are stored but never trigger a re-derive of the history
REBUILD_STEP_MS = 30 * 86_400_000  # the start-up rebuild derives this much history per update


@dataclass
class App:
    """What the ingest pipeline works on: the database, the derivation, the published sensors and the names of places."""
    conn: sqlite3.Connection
    deriver: Deriver
    sensors: TripSensors
    totals: TotalsSensors
    tz: tzinfo
    capacity: Callable[[str], float]
    zones: Zones
    spots: Zones


def late_min_t(samples: Sequence[Sample], received: int) -> int | None:
    """The oldest sample time worth a re-derive: older samples are stored but never trigger one, nor do future ones (a clock reset)."""
    return min((x.t for x in samples if received - LATE_WINDOW_MS <= x.t <= received + FUTURE_SLACK_MS), default=None)


def ingested(app: App, vid: str, min_t: int | None, received: int) -> None:
    """After an ingest: re-derive and publish what closed."""
    trips, charges, refined = app.deriver.update(vid, min_t, received)
    last_trips, last_charges = store.closed(app.conn, TRIP, vid, 1), store.closed(app.conn, CHARGE, vid, 1)
    # a refinement (late data changed an already closed row) updates the state sensors but is no new event
    recent = [[w for w in closed if w["end"] >= received - EVENT_MAX_AGE_MS and (kind.table, w["start"]) not in refined]
              for kind, closed in ((TRIP, trips), (CHARGE, charges))]
    app.sensors.publish(vid, last_trips[0] if trips else None, last_charges[0] if charges else None, *recent)
    if trips or charges or refined:  # the month and year totals follow every close and every refinement
        app.totals.publish_vehicle(vid)
        if app.totals.in_group(vid):
            app.totals.publish_groups()


def reply(app: App, vid: str, received: int) -> tuple[dict | None, dict]:
    """The car's webhook answer, from the stored rows: (open trip, summary)."""
    conn = app.conn
    since = periods.week_start_ms(received, app.tz)
    def routed(t: dict) -> dict:  # the card route rides on the wire row only, never in the stored one
        p = store.route(conn, vid, t["start"])
        return {**t, "route": None if p is None else route.card(p)}
    cur = store.current_trip(conn, vid)
    return None if cur is None else routed(cur), summary.build(
        [routed(t) for t in store.closed(conn, TRIP, vid, summary.LIST)], store.closed(conn, CHARGE, vid, summary.LIST),
        store.closed(conn, TRIP, vid, since=since), store.closed(conn, CHARGE, vid, since=since), received, app.tz, app.capacity(vid))


def relabel(app: App) -> None:
    """A zone list that changed, or a charge spot: past trips and charges take the new names."""
    store.relabel(app.conn, app.zones, app.spots)


def rebuild(app: App, now_ms: int) -> None:
    """At start-up, before the first totals publish: derive every vehicle again, so rows dropped by an ALGO bump are back before its
    next ingest, then republish its last trip and charge states (a rebuild may have closed one). No events."""
    conn, deriver, sensors = app.conn, app.deriver, app.sensors
    started = time.monotonic()
    deriver.purge_stale()
    vehicles = conn.execute("SELECT vehicle_id FROM vehicles").fetchall()
    for (vid,) in vehicles:
        try:
            first = conn.execute("SELECT MIN(t) FROM samples WHERE vehicle_id=?", (vid,)).fetchone()[0]
            if first is None:
                continue
            # a vehicle that kept its rows starts at its newest closed end (a normal restart is one update); an emptied one starts at its first sample
            first = max(first, store.newest_end(conn, vid))
            # a window is one update at a past `received_ms`: it reads only that month, and the next one resumes from what is still open.
            # A cloud charge ending just before a window's cut-off may be closed there as a SoC estimate, its car reading being beyond
            # the cut-off; each later window re-opens what the one before could have closed that early, like late data would.
            # shortcut: a segment open across windows (a car plugged for weeks, a stuck charging_state) pulls every window back to its
            # start, so those reads grow with it; fine for real sessions, checkpoint if one runs for months.
            cut = None
            for m in [*range(first + REBUILD_STEP_MS, now_ms, REBUILD_STEP_MS), now_ms]:
                deriver.update(vid, None if cut is None else cut - ESTIMATE_HOLD_MS, m)
                cut = m + FUTURE_SLACK_MS
            trips, charges = store.closed(conn, TRIP, vid, 1), store.closed(conn, CHARGE, vid, 1)
            sensors.publish(vid, trips[0] if trips else None, charges[0] if charges else None, [], [])
        except Exception:
            log.exception("rebuild of %s failed", vid)
    log.info("rebuild of %d vehicles took %.1f s", len(vehicles), time.monotonic() - started)


def republish(app: App, vids: list[str] | None) -> None:
    """After a price changed: the last trip and charge states and the totals of the vehicles (all when None), and every group's. No events."""
    conn = app.conn
    for vid in vids if vids is not None else [r[0] for r in conn.execute("SELECT vehicle_id FROM vehicles")]:
        try:
            trips, charges = store.closed(conn, TRIP, vid, 1), store.closed(conn, CHARGE, vid, 1)
            app.sensors.publish(vid, trips[0] if trips else None, charges[0] if charges else None, [], [])
            app.totals.publish_vehicle(vid)
        except Exception:
            log.exception("republish of %s failed", vid)
    try:
        app.totals.publish_groups()
    except Exception:
        log.exception("republish of the groups failed")


def close_quiet(app: App, now_ms: int) -> None:
    """Re-derive each vehicle with an open trip whose car went quiet: no batch will arrive to close it (its last one was lost)."""
    # shortcut: a quiet car whose trip tail is not in P stays open and is re-derived every tick until its car returns
    for vid in store.open_trip_vehicles(app.conn):
        last = db.car_last_received(app.conn, vid)
        if last is not None and now_ms - last >= QUIET_MS:
            try:
                ingested(app, vid, None, now_ms)
            except Exception:
                log.exception("closing the quiet trip of %s failed", vid)


async def run_close_quiet(app: App, interval_s: float = 60) -> None:
    while True:
        await asyncio.sleep(interval_s)
        close_quiet(app, int(time.time() * 1000))
