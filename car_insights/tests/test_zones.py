from car_insights.zones import Zone, ZoneCache, name_at

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


def test_on_change_only_for_a_new_list():
    now, results, changes = [0], [[HOME]], []
    def fetch():
        r = results[0]
        if isinstance(r, Exception):
            raise r
        return r
    cache = ZoneCache(fetch, ttl_ms=1000, now_ms=lambda: now[0], on_change=lambda: changes.append(1))
    cache(52.0, 5.0)
    assert changes == [1]  # the first list counts
    now[0] = 1000
    cache(52.0, 5.0)
    assert changes == [1]  # fetched again, the same
    results[0], now[0] = [HOME, Zone("Work", 52.1, 5.1, 150)], 2000
    cache(52.0, 5.0)
    assert changes == [1, 1]
    results[0], now[0] = RuntimeError("down"), 3000
    assert cache(52.0, 5.0) == "Home"
    assert changes == [1, 1]  # a failed fetch keeps the list and relabels nothing
    results[0], now[0] = [HOME, Zone("Work", 52.1, 5.1, 150)], 4000
    cache(52.0, 5.0)
    assert changes == [1, 1]  # back up with the list it had


def test_on_change_runs_with_the_new_list_in_place():
    seen = []
    cache = ZoneCache(lambda: [HOME], on_change=lambda: seen.append(cache(52.0, 5.0)))
    cache(52.0, 5.0)
    assert seen == ["Home"]  # a relabel asks the cache itself, and gets the list that changed


def test_a_failing_on_change_is_retried_at_the_next_fetch():
    now, calls = [0], []
    def on_change():
        calls.append(1)
        if len(calls) == 1:
            raise RuntimeError("busy")
    cache = ZoneCache(lambda: [HOME], ttl_ms=1000, now_ms=lambda: now[0], on_change=on_change)
    assert cache(52.0, 5.0) == "Home"  # the lookup itself still works
    now[0] = 1000
    cache(52.0, 5.0)
    now[0] = 2000
    cache(52.0, 5.0)
    assert calls == [1, 1]


def test_refresh_fetches_now_and_announces_a_changed_list():
    results, changes, fetched = [[HOME]], [], []
    def fetch():
        fetched.append(1)
        if isinstance(results[0], Exception):
            raise results[0]
        return results[0]
    cache = ZoneCache(fetch, on_change=lambda: changes.append(1))
    cache.refresh()
    assert changes == [1] and cache(52.0, 5.0) == "Home" and len(fetched) == 1  # the lookup after it uses the list, no second fetch
    cache.refresh()
    assert changes == [1]  # the same list
    results[0] = RuntimeError("down")
    cache.refresh()
    assert changes == [1] and cache(52.0, 5.0) == "Home"  # a failed refresh calls nothing and keeps the list
    results[0] = [Zone("Work", 52.1, 5.1, 150)]
    cache.refresh()
    assert changes == [1, 1] and cache(52.0, 5.0) is None
