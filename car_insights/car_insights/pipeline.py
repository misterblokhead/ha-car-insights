import asyncio
import logging
import sqlite3
import time
from datetime import tzinfo
from typing import Callable

from . import db, route, summary
from .derive import ESTIMATE_HOLD_MS, Deriver
from .protocol import FUTURE_SLACK_MS
from .totals_sensors import TotalsSensors
from .trip_sensors import TripSensors
from .trips import QUIET_MS

log = logging.getLogger(__name__)

EVENT_MAX_AGE_MS = 3_600_000  # a close older than this at arrival (a backlog) updates the sensors but fires no event
REBUILD_STEP_MS = 30 * 86_400_000  # the start-up rebuild derives this much history per update


def refresh(deriver: Deriver, sensors: TripSensors, totals: TotalsSensors, vid: str, min_t: int | None, received: int, tz: tzinfo) -> tuple[dict | None, dict]:
    """After an ingest: re-derive, publish what closed, and return (open trip, summary) for the webhook response."""
    trips, charges, refined = deriver.update(vid, min_t, received)
    last_trips, last_charges = deriver.stored_trips(vid, summary.LIST), deriver.stored_charges(vid, summary.LIST)
    # a refinement (late data changed an already closed row) updates the state sensors but is no new event
    recent = [[w for w in closed if w["end"] >= received - EVENT_MAX_AGE_MS and (table, w["start"]) not in refined]
              for table, closed in (("trips", trips), ("charges", charges))]
    sensors.publish(vid, last_trips[0] if trips else None, last_charges[0] if charges else None, *recent)
    if trips or charges or refined:  # the month and year totals follow every close and every refinement
        totals.publish_vehicle(vid)
        if totals.in_group(vid):
            totals.publish_groups()
    since = summary.week_start_ms(received, tz)
    def routed(t: dict) -> dict:  # the card route rides on the wire row only, never in the stored one
        p = deriver.trip_route(vid, t["start"])
        return {**t, "route": None if p is None else route.card(p)}
    cur = deriver.current_trip(vid)
    return None if cur is None else routed(cur), summary.build(
        [routed(t) for t in last_trips], last_charges, deriver.stored_trips(vid, since=since), deriver.stored_charges(vid, since=since),
        received, tz, deriver.capacity_wh(vid))


def rebuild(deriver: Deriver, sensors: TripSensors, conn: sqlite3.Connection, now_ms: int) -> None:
    """At start-up, before the first totals publish: derive every vehicle again, so rows dropped by an ALGO bump are back before
    its next ingest, then republish its last trip and charge states (a rebuild may have closed one). No events."""
    started = time.monotonic()
    vehicles = conn.execute("SELECT vehicle_id FROM vehicles").fetchall()
    for (vid,) in vehicles:
        try:
            first = conn.execute("SELECT MIN(t) FROM samples WHERE vehicle_id=?", (vid,)).fetchone()[0]
            if first is None:
                continue
            # a vehicle that kept its rows starts at its newest closed end (a normal restart is one update); an emptied one starts at its first sample
            first = max(first, deriver.newest_end(vid))
            # a window is one update at a past `received_ms`: it reads only that month, and the next one resumes from what is still open.
            # A cloud charge ending just before a window's cut-off may be closed there as a SoC estimate, its car reading being beyond
            # the cut-off; each later window re-opens what the one before could have closed that early, like late data would.
            # shortcut: a segment open across windows (a car plugged for weeks, a stuck charging_state) pulls every window back to its
            # start, so those reads grow with it; fine for real sessions, checkpoint if one runs for months.
            cut = None
            for m in [*range(first + REBUILD_STEP_MS, now_ms, REBUILD_STEP_MS), now_ms]:
                deriver.update(vid, None if cut is None else cut - ESTIMATE_HOLD_MS, m)
                cut = m + FUTURE_SLACK_MS
            trips, charges = deriver.stored_trips(vid, 1), deriver.stored_charges(vid, 1)
            sensors.publish(vid, trips[0] if trips else None, charges[0] if charges else None, [], [])
        except Exception:
            log.exception("rebuild of %s failed", vid)
    log.info("rebuild of %d vehicles took %.1f s", len(vehicles), time.monotonic() - started)


def republish(deriver: Deriver, sensors: TripSensors, totals: TotalsSensors, conn: sqlite3.Connection, vids: list[str] | None) -> None:
    """After a price changed: the last trip and charge states and the totals of the vehicles (all when None), and every group's. No events."""
    for vid in vids if vids is not None else [r[0] for r in conn.execute("SELECT vehicle_id FROM vehicles")]:
        try:
            trips, charges = deriver.stored_trips(vid, 1), deriver.stored_charges(vid, 1)
            sensors.publish(vid, trips[0] if trips else None, charges[0] if charges else None, [], [])
            totals.publish_vehicle(vid)
        except Exception:
            log.exception("republish of %s failed", vid)
    try:
        totals.publish_groups()
    except Exception:
        log.exception("republish of the groups failed")


def close_quiet(conn: sqlite3.Connection, summarize: Callable[[str, int | None, int], object], now_ms: int) -> None:
    """Re-derive each vehicle with an open trip whose car went quiet: no batch will arrive to close it (its last one was lost)."""
    # shortcut: a quiet car whose trip tail is not in P stays open and is re-derived every tick until its car returns
    for (vid,) in conn.execute("SELECT DISTINCT vehicle_id FROM trips WHERE end IS NULL").fetchall():
        last = db.car_last_received(conn, vid)
        if last is not None and now_ms - last >= QUIET_MS:
            try:
                summarize(vid, None, now_ms)
            except Exception:
                log.exception("closing the quiet trip of %s failed", vid)


async def run_close_quiet(conn: sqlite3.Connection, summarize: Callable[[str, int | None, int], object], interval_s: float = 60) -> None:
    while True:
        await asyncio.sleep(interval_s)
        close_quiet(conn, summarize, int(time.time() * 1000))
