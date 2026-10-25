"""Home Assistant's Supervisor and Core API, for the add-on's token."""
import json
import logging
import time
import urllib.request
from datetime import datetime, timezone, tzinfo
from zoneinfo import ZoneInfo

from .zones import Zone

log = logging.getLogger(__name__)
_SUPERVISOR = "http://supervisor"
HISTORY_TIMEOUT_S = 60


def _call(path: str, token: str, body: dict | None = None, timeout: float = 10) -> bytes:
    """GET (POST when there is a JSON body) http://supervisor<path>; Core's API lives under /core/api."""
    headers = {"Authorization": f"Bearer {token}", **({"Content-Type": "application/json"} if body is not None else {})}
    req = urllib.request.Request(f"{_SUPERVISOR}{path}", data=None if body is None else json.dumps(body).encode(), headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:  # raises HTTPError on non-2xx
        return r.read()


def fetch_tile(token: str, z: int, x: int, y: int) -> bytes:
    return _call(f"/core/api/map_tiles/raster/{z}/{x}/{y}.png", token)


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
    return [Zone(z["name"], z["latitude"], z["longitude"], z["radius"], bool(z.get("passive"))) for z in rows
            if isinstance(z, dict) and isinstance(z.get("name"), str)
            and _is_num(z.get("latitude")) and _is_num(z.get("longitude")) and _is_num(z.get("radius"))]


def fetch_time_zone(token: str, tries: int = 30, wait_s: float = 10) -> tzinfo:
    """HA's configured time zone, retried while Core starts; the host's local zone only once the retries run out."""
    last: Exception | None = None
    for attempt in range(tries):
        try:
            return ZoneInfo(supervisor_get("/core/api/config", token)["time_zone"])
        except Exception as err:
            last = err
            if attempt < tries - 1:
                time.sleep(wait_s)
    log.error("could not read the Home Assistant time zone after %d tries, using the local one", tries, exc_info=last)
    return datetime.now().astimezone().tzinfo


def fetch_language(token: str) -> str:
    """HA's configured language ("nl"), "en" when it cannot be read."""
    try:
        return supervisor_get("/core/api/config", token).get("language") or "en"
    except Exception as err:
        log.warning("could not read the Home Assistant language, using en: %r", err)
        return "en"


def _iso_utc(ms: int) -> str:
    return datetime.fromtimestamp(ms / 1000, timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def fetch_history(token: str, entity_ids: list[str], start_ms: int, end_ms: int) -> list[list[dict]]:
    """State history of the entities between two epoch-ms times, minimal rows (last_changed + state) with every change kept."""
    q = f"filter_entity_id={','.join(entity_ids)}&end_time={_iso_utc(end_ms)}&minimal_response&no_attributes&significant_changes_only=0"
    # the first poll asks for 10 days and HA may need a while: a timeout would repeat the same query forever (it runs in a thread)
    return json.loads(_call(f"/core/api/history/period/{_iso_utc(start_ms)}?{q}", token, timeout=HISTORY_TIMEOUT_S))
