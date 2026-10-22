from datetime import tzinfo

from . import summary
from .derive import Deriver
from .trip_sensors import TripSensors

EVENT_MAX_AGE_MS = 3_600_000  # a close older than this at arrival (a backlog) updates the sensors but fires no event


def refresh(deriver: Deriver, sensors: TripSensors, vid: str, min_t: int | None, received: int, tz: tzinfo) -> dict:
    """After an ingest: re-derive, publish what closed, and return the summary for the webhook response."""
    trips, charges = deriver.update(vid, min_t, received)
    # shortcut: 500 rows bound the week's totals, a week with more trips undercounts; page by date if that ever shows
    stored_trips, stored_charges = deriver.stored_trips(vid, 500), deriver.stored_charges(vid, 500)
    recent = [[w for w in closed if w["end"] >= received - EVENT_MAX_AGE_MS] for closed in (trips, charges)]
    sensors.publish(vid, stored_trips[0] if trips else None, stored_charges[0] if charges else None, *recent)
    return summary.build(deriver.current_trip(vid), stored_trips, stored_charges, received, tz)
