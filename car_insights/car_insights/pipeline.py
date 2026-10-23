import logging
import sqlite3
from datetime import tzinfo

from . import summary
from .derive import Deriver
from .totals_sensors import TotalsSensors
from .trip_sensors import TripSensors

log = logging.getLogger(__name__)

EVENT_MAX_AGE_MS = 3_600_000  # a close older than this at arrival (a backlog) updates the sensors but fires no event


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
    return deriver.current_trip(vid), summary.build(
        last_trips, last_charges, deriver.stored_trips(vid, since=since), deriver.stored_charges(vid, since=since), received, tz)


def rebuild(deriver: Deriver, conn: sqlite3.Connection, now_ms: int) -> None:
    """At start-up, before the first totals publish: derive every vehicle again, so rows dropped by an ALGO bump are back before
    its next ingest. No sensors, no events: the retained states catch up at the next close."""
    for (vid,) in conn.execute("SELECT vehicle_id FROM vehicles").fetchall():
        try:
            deriver.update(vid, None, now_ms)
        except Exception:
            log.exception("rebuild of %s failed", vid)
