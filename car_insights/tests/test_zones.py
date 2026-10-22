import io
import json

from car_insights.zones import Zone, ZoneCache, fetch_zones, name_at

HOME = Zone("Home", 52.0, 5.0, 100)
DLAT = 1 / 111_195  # degrees of latitude per metre


def test_name_at_inside_and_outside():
    assert name_at([HOME], 52.0 + 50 * DLAT, 5.0) == "Home"
    assert name_at([HOME], 52.0 + 200 * DLAT, 5.0) is None


def test_name_at_nearest_centre_wins():
    big = Zone("Town", 52.0 + 60 * DLAT, 5.0, 1000)
    assert name_at([big, HOME], 52.0 + 10 * DLAT, 5.0) == "Home"
    assert name_at([HOME, big], 52.0 + 50 * DLAT, 5.0) == "Town"


def test_cache_keeps_last_list_on_error():
    now, results = [0], [[HOME]]
    def fetch():
        r = results[0]
        if isinstance(r, Exception):
            raise r
        return r
    cache = ZoneCache(fetch, ttl_ms=1000, now_ms=lambda: now[0])
    assert cache(52.0, 5.0) == "Home"
    results[0], now[0] = RuntimeError("down"), 5000
    assert cache(52.0, 5.0) == "Home"  # stale but the fetch failed: last list stays
    results[0] = []
    now[0] = 5500  # a failed fetch still counts as an attempt, so no retry before the ttl
    assert cache(52.0, 5.0) == "Home"
    now[0] = 6100
    assert cache(52.0, 5.0) is None


def test_fetch_zones_keeps_only_complete_zone_entities(monkeypatch):
    states = [
        {"entity_id": "zone.home", "attributes": {"latitude": 52.0, "longitude": 5.0, "radius": 100, "friendly_name": "Home"}},
        {"entity_id": "zone.broken", "attributes": {"latitude": 52.0}},
        {"entity_id": "sensor.x", "attributes": {"latitude": 1, "longitude": 1, "radius": 1, "friendly_name": "x"}},
    ]
    seen = {}
    def urlopen(req, timeout):
        seen["url"], seen["auth"] = req.full_url, req.get_header("Authorization")
        return io.BytesIO(json.dumps(states).encode())
    monkeypatch.setattr("car_insights.zones.urllib.request.urlopen", urlopen)
    assert fetch_zones("tok") == [HOME]
    assert seen == {"url": "http://supervisor/core/api/states", "auth": "Bearer tok"}


def test_fetch_time_zone_falls_back_to_local(monkeypatch):
    import car_insights.zones as z
    def down(*a):
        raise OSError("down")
    monkeypatch.setattr(z, "supervisor_get", down)
    assert z.fetch_time_zone("tok") is not None
