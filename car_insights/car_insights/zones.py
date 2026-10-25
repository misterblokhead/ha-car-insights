import json
import logging
import math
import time
from dataclasses import astuple, dataclass
from pathlib import Path
from typing import Callable

log = logging.getLogger(__name__)


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


def zones_changed(fetch: Callable[[], list[Zone]], saved: Path) -> bool:
    """True when the zones differ from the list saved at the last start (stored trips name the zones of their day); saves the new list.
    False on the first start (nothing to compare with) and when the zones cannot be read."""
    try:
        key = json.dumps(sorted(astuple(z) for z in fetch()))
    except Exception:
        log.warning("could not read the zones, stored place names stay as they are", exc_info=True)
        return False
    old = saved.read_text() if saved.exists() else None
    saved.write_text(key)
    return old is not None and old != key


class ZoneCache:
    """Callable (lat, lon) -> zone name, refetching the zone list when it is older than ttl_ms.

    shortcut: a refetch blocks the event loop (at most every ttl_ms, 10 s timeout), move it to a thread if that ever shows.
    """

    def __init__(self, fetch: Callable[[], list[Zone]], ttl_ms: int = 600_000, now_ms: Callable[[], int] = lambda: int(time.time() * 1000)):
        self._fetch, self._ttl, self._now = fetch, ttl_ms, now_ms
        self._zones: list[Zone] = []
        self._at: int | None = None

    def __call__(self, lat: float, lon: float) -> str | None:
        now = self._now()
        if self._at is None or now - self._at >= self._ttl:
            self._at = now  # a failed fetch counts as an attempt, so a down HA is retried once per ttl, not per lookup
            try:
                self._zones = self._fetch()
            except Exception:
                log.exception("zone fetch failed, keeping the last list")
        return name_at(self._zones, lat, lon)
