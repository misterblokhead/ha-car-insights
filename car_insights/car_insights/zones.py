import json
import logging
import math
import time
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone, tzinfo
from typing import Callable
from zoneinfo import ZoneInfo

log = logging.getLogger(__name__)
_SUPERVISOR = "http://supervisor"


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


def _call(path: str, token: str, body: dict | None = None) -> bytes:
    """GET (POST when there is a JSON body) http://supervisor<path>; Core's API lives under /core/api."""
    headers = {"Authorization": f"Bearer {token}", **({"Content-Type": "application/json"} if body is not None else {})}
    req = urllib.request.Request(f"{_SUPERVISOR}{path}", data=None if body is None else json.dumps(body).encode(), headers=headers)
    with urllib.request.urlopen(req, timeout=10) as r:  # raises HTTPError on non-2xx
        return r.read()


def supervisor_get(path: str, token: str):
    return json.loads(_call(path, token))


# renders just the zones (not every state in the house) as JSON; .get() so a missing attribute is null, not a render error
_ZONES_TEMPLATE = (
    "{% set ns = namespace(z=[]) %}{% for s in states.zone %}"
    "{% set ns.z = ns.z + [{'name': s.name, 'latitude': s.attributes.get('latitude'), 'longitude': s.attributes.get('longitude'),"
    " 'radius': s.attributes.get('radius'), 'passive': s.attributes.get('passive')}] %}{% endfor %}{{ ns.z | tojson }}"
)


def _is_num(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def fetch_zones(token: str) -> list[Zone]:
    rows = json.loads(_call("/core/api/template", token, {"template": _ZONES_TEMPLATE}))
    return [Zone(z["name"], z["latitude"], z["longitude"], z["radius"]) for z in rows
            if isinstance(z, dict) and not z.get("passive") and isinstance(z.get("name"), str)  # passive zones never trigger
            and _is_num(z.get("latitude")) and _is_num(z.get("longitude")) and _is_num(z.get("radius"))]


def fetch_time_zone(token: str) -> tzinfo:
    """HA's configured time zone; the host's local zone (with a warning) when it cannot be read."""
    try:
        return ZoneInfo(supervisor_get("/core/api/config", token)["time_zone"])
    except Exception:
        log.warning("could not read the Home Assistant time zone, using the local one", exc_info=True)
        return datetime.now().astimezone().tzinfo


def _iso_utc(ms: int) -> str:
    return datetime.fromtimestamp(ms / 1000, timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def fetch_history(token: str, entity_ids: list[str], start_ms: int, end_ms: int) -> list[list[dict]]:
    """State history of the entities between two epoch-ms times, minimal rows (last_changed + state) with every change kept."""
    q = f"filter_entity_id={','.join(entity_ids)}&end_time={_iso_utc(end_ms)}&minimal_response&no_attributes&significant_changes_only=0"
    return json.loads(_call(f"/core/api/history/period/{_iso_utc(start_ms)}?{q}", token))


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
