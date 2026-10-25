import io
import json

import pytest

from car_insights.ha_api import fetch_history, fetch_language, fetch_tile, fetch_zones
from car_insights.zones import Zone

HOME = Zone("Home", 52.0, 5.0, 100)


def _template_server(monkeypatch, rendered):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, method=req.get_method(), auth=req.get_header("Authorization"), body=req.data and json.loads(req.data))
        return io.BytesIO(rendered.encode())

    monkeypatch.setattr("car_insights.ha_api.urllib.request.urlopen", urlopen)
    return seen


def test_fetch_zones_renders_only_the_zones_through_a_template(monkeypatch):
    seen = _template_server(monkeypatch, json.dumps([{"name": "Home", "latitude": 52.0, "longitude": 5.0, "radius": 100, "passive": False}]))
    assert fetch_zones("tok") == [HOME]
    assert seen["url"] == "http://supervisor/core/api/template" and seen["method"] == "POST" and seen["auth"] == "Bearer tok"
    assert "states.zone" in seen["body"]["template"] and "tojson" in seen["body"]["template"]


def test_fetch_zones_keeps_passive_zones_flagged_and_skips_unusable_entries(monkeypatch):
    good = {"name": "Home", "latitude": 52.0, "longitude": 5.0, "radius": 100, "passive": False}
    rows = [good, {**good, "name": "Hidden", "passive": True}, {**good, "name": "NoRadius", "radius": None},
            {**good, "name": "Text", "latitude": "52.0"}, {**good, "name": "Bool", "longitude": True}, {**good, "name": 5},
            {**good, "name": "NoPassive", "passive": None}, "junk"]
    _template_server(monkeypatch, json.dumps(rows))
    assert fetch_zones("tok") == [HOME, Zone("Hidden", 52.0, 5.0, 100, True), Zone("NoPassive", 52.0, 5.0, 100)]


def test_fetch_tile_asks_the_core_tile_proxy_with_the_token(monkeypatch):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, method=req.get_method(), auth=req.get_header("Authorization"))
        return io.BytesIO(b"PNG")

    monkeypatch.setattr("car_insights.ha_api.urllib.request.urlopen", urlopen)
    assert fetch_tile("tok", 3, 4, 5) == b"PNG"
    assert seen == {"url": "http://supervisor/core/api/map_tiles/raster/3/4/5.png", "method": "GET", "auth": "Bearer tok"}


def test_fetch_time_zone_falls_back_to_local(monkeypatch, caplog):
    import car_insights.ha_api as z
    def down(*a):
        raise OSError("down")
    monkeypatch.setattr(z, "supervisor_get", down)
    assert z.fetch_time_zone("tok", tries=2, wait_s=0) is not None
    assert caplog.records[-1].exc_info[0] is OSError


def test_fetch_history_asks_for_every_change_of_the_entities_in_the_window(monkeypatch):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, auth=req.get_header("Authorization"))
        return io.BytesIO(b'[[{"entity_id": "sensor.a", "state": "1", "last_changed": "2026-10-23T12:00:00+00:00"}]]')

    monkeypatch.setattr("car_insights.ha_api.urllib.request.urlopen", urlopen)
    assert fetch_history("tok", ["sensor.a", "sensor.b"], 1_792_756_800_000, 1_792_756_900_500)[0][0]["state"] == "1"
    assert seen["url"] == ("http://supervisor/core/api/history/period/2026-10-23T12:00:00.000Z?filter_entity_id=sensor.a,sensor.b"
                           "&end_time=2026-10-23T12:01:40.500Z&minimal_response&no_attributes&significant_changes_only=0")
    assert seen["auth"] == "Bearer tok"


def test_fetch_history_waits_longer_than_the_default_call_timeout(monkeypatch):
    seen = []

    def urlopen(req, timeout):
        seen.append((req.full_url.split("/core/api/")[1].split("/")[0], timeout))
        return io.BytesIO(b"[]" if "history" in req.full_url else b'{"time_zone": "UTC"}')

    monkeypatch.setattr("car_insights.ha_api.urllib.request.urlopen", urlopen)
    fetch_history("tok", ["sensor.a"], 1_792_756_800_000, 1_792_756_900_500)
    from car_insights.ha_api import supervisor_get
    supervisor_get("/core/api/config", "tok")
    assert seen == [("history", 60), ("config", 10)]


def test_fetch_time_zone_retries(monkeypatch):
    import car_insights.ha_api as z
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


def test_fetch_language_reads_the_config(monkeypatch):
    _template_server(monkeypatch, '{"language": "nl", "time_zone": "UTC"}')
    assert fetch_language("tok") == "nl"


@pytest.mark.parametrize("rendered", ['{"time_zone": "UTC"}', '{"language": ""}', "[]", "not json"])
def test_fetch_language_is_en_without_one(monkeypatch, rendered):
    _template_server(monkeypatch, rendered)
    assert fetch_language("tok") == "en"


def test_fetch_language_is_en_when_home_assistant_is_down(monkeypatch, caplog):
    def down(*a, **k):
        raise OSError("down")
    monkeypatch.setattr("car_insights.ha_api.urllib.request.urlopen", down)
    assert fetch_language("tok") == "en"
    assert caplog.records[-1].levelname == "WARNING"
