from car_insights.zones import Zone, ZoneCache, name_at, zones_changed

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


def test_zones_changed_compares_with_the_last_start(tmp_path):
    saved = tmp_path / "zones.json"
    assert zones_changed(lambda: [HOME], saved) is False  # first start: nothing to compare with
    assert zones_changed(lambda: [HOME], saved) is False
    assert zones_changed(lambda: [HOME, Zone("Work", 52.1, 5.1, 150)], saved) is True
    assert zones_changed(lambda: [Zone("Work", 52.1, 5.1, 150), HOME], saved) is False  # order does not matter
    def down():
        raise OSError("down")
    assert zones_changed(down, saved) is False and zones_changed(lambda: [HOME], saved) is True  # a failed read keeps the saved list
