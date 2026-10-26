"""The two kinds of derived row, so code that treats them alike loops over KINDS instead of branching."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Kind:
    name: str  # the wire name: "trip", "charge"
    table: str
    series_table: str
    has_route: bool
    event: str  # the name of the kind's event entity


TRIP = Kind("trip", "trips", "trip_series", True, "Trip")
CHARGE = Kind("charge", "charges", "charge_series", False, "Charge")
KINDS = (TRIP, CHARGE)
