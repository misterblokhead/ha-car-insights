import asyncio
import logging
import math
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
    passive: bool = False  # names no place, but its area is still somewhere the add-on knows


def _haversine_m(lat1, lon1, lat2, lon2) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    return 2 * 6_371_000 * math.asin(math.sqrt(a))


def name_at(zones: list[Zone], lat: float, lon: float) -> str | None:
    """Name of the active zone whose centre is nearest among those containing the point."""
    inside = [(d, z.name) for z in zones if not z.passive and (d := _haversine_m(lat, lon, z.lat, z.lon)) <= z.radius_m]
    return min(inside)[1] if inside else None


def covers(zones: list[Zone], lat: float, lon: float) -> bool:
    """Whether any zone, passive ones included, holds the point."""
    return any(_haversine_m(lat, lon, z.lat, z.lon) <= z.radius_m for z in zones)


class ZoneCache:
    """Callable (lat, lon) -> zone name over the last list that got through; a lookup only reads. `run` refetches every `ttl_ms`.
    `on_change` runs after a fetch whose list differs from the last one that got through (the first fetch included), so places can
    be renamed; a failed fetch keeps the list and calls nothing. An empty list is a failed fetch: Home Assistant always has `zone.home`,
    so none means it is still starting.

    shortcut: a refetch blocks the event loop (every ttl_ms, 10 s timeout), move it to a thread if that ever shows.
    """

    def __init__(self, fetch: Callable[[], list[Zone]], ttl_ms: int = 600_000, on_change: Callable[[], None] = lambda: None):
        self._fetch, self._ttl = fetch, ttl_ms
        self.on_change = on_change  # public: the app that renames places is built from this cache, so it is set after
        self._zones: list[Zone] = []
        self._announced: list[Zone] | None = None  # the list on_change last ran for
        self.loaded = False  # a fetch has succeeded: before it, no place may be renamed (an empty list would blank them)

    def refresh(self) -> None:
        """Fetch the list now; run on_change when it differs from the last one announced."""
        try:
            zones = self._fetch()
        except Exception:
            log.exception("zone fetch failed, keeping the last list")
            return
        if not zones:
            log.warning("zone list is empty, keeping the last list")
            return
        self._zones, self.loaded = zones, True
        if zones != self._announced:
            try:
                self.on_change()
                self._announced = zones
            except Exception:  # the next fetch tries again
                log.exception("renaming places after a zone change failed")

    async def run(self, interval_s: float | None = None) -> None:
        while True:
            self.refresh()
            await asyncio.sleep(self._ttl / 1000 if interval_s is None else interval_s)

    def covers(self, lat: float, lon: float) -> bool:
        return covers(self._zones, lat, lon)

    def __call__(self, lat: float, lon: float) -> str | None:
        return name_at(self._zones, lat, lon)
