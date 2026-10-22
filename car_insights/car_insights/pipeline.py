from datetime import tzinfo

from . import summary
from .derive import Deriver
from .trip_sensors import TripSensors


def refresh(deriver: Deriver, sensors: TripSensors, vid: str, min_t: int | None, received: int, tz: tzinfo) -> dict:
    """After an ingest: re-derive, publish what closed, and return the summary for the webhook response."""
    trips, charges = deriver.update(vid, min_t, received)
    # shortcut: 500 rows bound the week's totals, a week with more trips undercounts; page by date if that ever shows
    stored_trips, stored_charges = deriver.stored_trips(vid, 500), deriver.stored_charges(vid, 500)
    # a first rebuild of history must not fire an event per old trip
    ended = not deriver.initial_rebuild(vid)
    sensors.publish(vid, stored_trips[0] if trips else None, stored_charges[0] if charges else None,
                    trips if ended else [], charges if ended else [])
    return summary.build(deriver.current_trip(vid), stored_trips, stored_charges, received, tz)
