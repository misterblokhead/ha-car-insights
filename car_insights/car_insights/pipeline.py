from datetime import tzinfo

from . import summary
from .derive import Deriver
from .trip_sensors import TripSensors

EVENT_MAX_AGE_MS = 3_600_000  # a close older than this at arrival (a backlog) updates the sensors but fires no event


def refresh(deriver: Deriver, sensors: TripSensors, vid: str, min_t: int | None, received: int, tz: tzinfo) -> tuple[dict | None, dict]:
    """After an ingest: re-derive, publish what closed, and return (open trip, summary) for the webhook response."""
    trips, charges, refined = deriver.update(vid, min_t, received)
    last_trips, last_charges = deriver.stored_trips(vid, summary.LIST), deriver.stored_charges(vid, summary.LIST)
    # a refinement (late data changed an already closed row) updates the state sensors but is no new event
    recent = [[w for w in closed if w["end"] >= received - EVENT_MAX_AGE_MS and (table, w["start"]) not in refined]
              for table, closed in (("trips", trips), ("charges", charges))]
    sensors.publish(vid, last_trips[0] if trips else None, last_charges[0] if charges else None, *recent)
    since = summary.week_start_ms(received, tz)
    return deriver.current_trip(vid), summary.build(
        last_trips, last_charges, deriver.stored_trips(vid, since=since), deriver.stored_charges(vid, since=since), received, tz)
