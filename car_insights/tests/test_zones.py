import io
import json

from car_insights.zones import Zone, ZoneCache, fetch_history, fetch_zones, name_at, zones_changed

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


def _template_server(monkeypatch, rendered):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, method=req.get_method(), auth=req.get_header("Authorization"), body=json.loads(req.data))
        return io.BytesIO(rendered.encode())

    monkeypatch.setattr("car_insights.zones.urllib.request.urlopen", urlopen)
    return seen


def test_fetch_zones_renders_only_the_zones_through_a_template(monkeypatch):
    seen = _template_server(monkeypatch, json.dumps([{"name": "Home", "latitude": 52.0, "longitude": 5.0, "radius": 100, "passive": False}]))
    assert fetch_zones("tok") == [HOME]
    assert seen["url"] == "http://supervisor/core/api/template" and seen["method"] == "POST" and seen["auth"] == "Bearer tok"
    assert "states.zone" in seen["body"]["template"] and "tojson" in seen["body"]["template"]


def test_fetch_zones_skips_passive_and_unusable_entries(monkeypatch):
    good = {"name": "Home", "latitude": 52.0, "longitude": 5.0, "radius": 100, "passive": False}
    rows = [good, {**good, "name": "Hidden", "passive": True}, {**good, "name": "NoRadius", "radius": None},
            {**good, "name": "Text", "latitude": "52.0"}, {**good, "name": "Bool", "longitude": True}, {**good, "name": 5},
            {**good, "name": "NoPassive", "passive": None}, "junk"]
    _template_server(monkeypatch, json.dumps(rows))
    assert fetch_zones("tok") == [HOME, Zone("NoPassive", 52.0, 5.0, 100)]


def test_fetch_time_zone_falls_back_to_local(monkeypatch):
    import car_insights.zones as z
    def down(*a):
        raise OSError("down")
    monkeypatch.setattr(z, "supervisor_get", down)
    assert z.fetch_time_zone("tok", tries=2, wait_s=0) is not None


def test_fetch_history_asks_for_every_change_of_the_entities_in_the_window(monkeypatch):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, auth=req.get_header("Authorization"))
        return io.BytesIO(b'[[{"entity_id": "sensor.a", "state": "1", "last_changed": "2026-10-23T12:00:00+00:00"}]]')

    monkeypatch.setattr("car_insights.zones.urllib.request.urlopen", urlopen)
    assert fetch_history("tok", ["sensor.a", "sensor.b"], 1_792_756_800_000, 1_792_756_900_500)[0][0]["state"] == "1"
    assert seen["url"] == ("http://supervisor/core/api/history/period/2026-10-23T12:00:00.000Z?filter_entity_id=sensor.a,sensor.b"
                           "&end_time=2026-10-23T12:01:40.500Z&minimal_response&no_attributes&significant_changes_only=0")
    assert seen["auth"] == "Bearer tok"


def test_fetch_history_waits_longer_than_the_default_call_timeout(monkeypatch):
    seen = []

    def urlopen(req, timeout):
        seen.append((req.full_url.split("/core/api/")[1].split("/")[0], timeout))
        return io.BytesIO(b"[]" if "history" in req.full_url else b'{"time_zone": "UTC"}')

    monkeypatch.setattr("car_insights.zones.urllib.request.urlopen", urlopen)
    fetch_history("tok", ["sensor.a"], 1_792_756_800_000, 1_792_756_900_500)
    from car_insights.zones import supervisor_get
    supervisor_get("/core/api/config", "tok")
    assert seen == [("history", 60), ("config", 10)]


def test_zones_changed_compares_with_the_last_start(tmp_path):
    saved = tmp_path / "zones.json"
    assert zones_changed(lambda: [HOME], saved) is False  # first start: nothing to compare with
    assert zones_changed(lambda: [HOME], saved) is False
    assert zones_changed(lambda: [HOME, Zone("Work", 52.1, 5.1, 150)], saved) is True
    assert zones_changed(lambda: [Zone("Work", 52.1, 5.1, 150), HOME], saved) is False  # order does not matter
    def down():
        raise OSError("down")
    assert zones_changed(down, saved) is False and zones_changed(lambda: [HOME], saved) is True  # a failed read keeps the saved list


def test_fetch_time_zone_retries(monkeypatch):
    import car_insights.zones as z
    from zoneinfo import ZoneInfo
    calls = []

    def flaky(*a):
        calls.append(1)
        if len(calls) < 3:
            raise OSError("not ready")
        return {"time_zone": "Europe/Amsterdam"}
    monkeypatch.setattr(z, "supervisor_get", flaky)
    assert z.fetch_time_zone("tok", wait_s=0) == ZoneInfo("Europe/Amsterdam")
    assert len(calls) == 3
