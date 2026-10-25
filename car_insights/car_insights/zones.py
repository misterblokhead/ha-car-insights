import logging
import math
import time
from dataclasses import dataclass
from typing import Callable

log = logging.getLogger(__name__)
Zones = Callable[[float, float], str | None]  # (lat, lon) -> the name of the zone (or spot) holding the point


@dataclass(frozen=True)
class Zone:
    name: str
    lat: float
    lon: float
    radius_m: float


def _haversine_m(lat1, lon1, lat2, lon2) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    return 2 * 6_371_000 * math.asin(math.sqrt(a))


def name_at(zones: list[Zone], lat: float, lon: float) -> str | None:
    """Name of the zone whose centre is nearest among those containing the point."""
    inside = [(d, z.name) for z in zones if (d := _haversine_m(lat, lon, z.lat, z.lon)) <= z.radius_m]
    return min(inside)[1] if inside else None


class ZoneCache:
    """Callable (lat, lon) -> zone name, refetching the zone list when it is older than ttl_ms.
    `on_change` runs after a fetch whose list differs from the last one that got through (the first fetch included), so places can
    be renamed; a failed fetch keeps the list and calls nothing.

    shortcut: a refetch blocks the event loop (at most every ttl_ms, 10 s timeout), move it to a thread if that ever shows.
    """

    def __init__(self, fetch: Callable[[], list[Zone]], ttl_ms: int = 600_000, now_ms: Callable[[], int] = lambda: int(time.time() * 1000),
                 on_change: Callable[[], None] = lambda: None):
        self._fetch, self._ttl, self._now, self._on_change = fetch, ttl_ms, now_ms, on_change
        self._zones: list[Zone] = []
        self._announced: list[Zone] | None = None  # the list on_change last ran for
        self._at: int | None = None

    def refresh(self) -> None:
        """Fetch the list now; run on_change when it differs from the last one announced."""
        self._at = self._now()  # a failed fetch counts as an attempt, so a down HA is retried once per ttl, not per lookup
        try:
            zones = self._fetch()
        except Exception:
            log.exception("zone fetch failed, keeping the last list")
            return
        self._zones = zones
        if zones != self._announced:
            # shortcut: a relabel inside an update that later rolls back is undone while the list counts as announced (a restart heals it),
            # and one row mid-build may get its start and end named by different lists; fine while zones change rarely
            try:
                self._on_change()
                self._announced = zones
            except Exception:  # a lookup (maybe mid-derivation) must not fail for it; the next fetch tries again
                log.exception("renaming places after a zone change failed")

    def __call__(self, lat: float, lon: float) -> str | None:
        if self._at is None or self._now() - self._at >= self._ttl:
            self.refresh()
        return name_at(self._zones, lat, lon)
