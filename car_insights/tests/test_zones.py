import asyncio

import pytest

from car_insights.zones import Zone, ZoneCache, covers, name_at

HOME = Zone("Home", 52.0, 5.0, 100)
DLAT = 1 / 111_195  # degrees of latitude per metre


def test_name_at_inside_and_outside():
    assert name_at([HOME], 52.0 + 50 * DLAT, 5.0) == "Home"
    assert name_at([HOME], 52.0 + 200 * DLAT, 5.0) is None


def test_name_at_skips_passive_zones_but_covers_does_not():
    quiet = Zone("Quiet", 52.0, 5.0, 100, passive=True)
    inside = (52.0 + 50 * DLAT, 5.0)
    assert name_at([quiet], *inside) is None and name_at([quiet, Zone("Town", 52.0, 5.0, 1000)], *inside) == "Town"
    assert covers([quiet], *inside) and not covers([quiet], 52.0 + 200 * DLAT, 5.0)
    assert not covers([], *inside)


def test_the_cache_covers_what_it_does_not_name():
    cache = ZoneCache(lambda: [Zone("Quiet", 52.0, 5.0, 100, passive=True)])
    cache.refresh()
    assert cache(52.0, 5.0) is None and cache.covers(52.0, 5.0) and not cache.covers(53.0, 5.0)


def test_name_at_nearest_centre_wins():
    big = Zone("Town", 52.0 + 60 * DLAT, 5.0, 1000)
    assert name_at([big, HOME], 52.0 + 10 * DLAT, 5.0) == "Home"
    assert name_at([HOME, big], 52.0 + 50 * DLAT, 5.0) == "Town"


def _source(*lists):
    """a fetch that answers the given lists in turn (an Exception is raised), and counts its calls"""
    calls, it = [], iter(lists)
    def fetch():
        calls.append(1)
        r = next(it)
        if isinstance(r, Exception):
            raise r
        return r
    return fetch, calls


def test_a_lookup_never_fetches_and_never_announces():
    fetch, calls = _source([HOME])
    changes = []
    cache = ZoneCache(fetch, on_change=lambda: changes.append(1))
    assert cache(52.0, 5.0) is None and not cache.loaded  # nothing fetched yet: no zones
    assert calls == [] and changes == []
    cache.refresh()
    assert cache(52.0, 5.0) == "Home" and cache(52.0, 5.0) == "Home"
    assert calls == [1] and changes == [1]


def test_refresh_keeps_the_last_list_on_error():
    fetch, calls = _source([HOME], RuntimeError("down"))
    cache = ZoneCache(fetch)
    cache.refresh()
    cache.refresh()
    assert cache(52.0, 5.0) == "Home" and cache.loaded  # the fetch failed: the last list stays


def test_an_empty_list_is_a_failed_fetch():
    fetch, _ = _source([], [HOME], [])
    changes = []
    cache = ZoneCache(fetch, on_change=lambda: changes.append(1))
    cache.refresh()
    assert not cache.loaded and changes == [] and not cache.covers(52.0, 5.0)  # Home Assistant is still starting
    cache.refresh()
    assert cache.loaded and changes == [1]
    cache.refresh()
    assert cache(52.0, 5.0) == "Home" and cache.loaded and changes == [1]  # the last list stays, nothing is renamed


def test_a_failed_first_fetch_is_not_loaded():
    fetch, _ = _source(RuntimeError("down"), [HOME])
    changes = []
    cache = ZoneCache(fetch, on_change=lambda: changes.append(1))
    cache.refresh()
    assert not cache.loaded and changes == []
    cache.refresh()
    assert cache.loaded and changes == [1]


def test_on_change_only_for_a_new_list():
    work = Zone("Work", 52.1, 5.1, 150)
    fetch, _ = _source([HOME], [HOME], [HOME, work], RuntimeError("down"), [HOME, work])
    changes = []
    cache = ZoneCache(fetch, on_change=lambda: changes.append(1))
    cache.refresh()
    assert changes == [1]  # the first list counts
    cache.refresh()
    assert changes == [1]  # fetched again, the same
    cache.refresh()
    assert changes == [1, 1]
    cache.refresh()
    assert cache(52.0, 5.0) == "Home" and changes == [1, 1]  # a failed fetch keeps the list and relabels nothing
    cache.refresh()
    assert changes == [1, 1]  # back up with the list it had


def test_on_change_runs_with_the_new_list_in_place():
    seen = []
    cache = ZoneCache(lambda: [HOME], on_change=lambda: seen.append(cache(52.0, 5.0)))
    cache.refresh()
    assert seen == ["Home"]  # a relabel asks the cache itself, and gets the list that changed


def test_on_change_can_be_set_after_construction():
    seen = []
    cache = ZoneCache(lambda: [HOME])
    cache.on_change = lambda: seen.append(1)
    cache.refresh()
    assert seen == [1]


def test_a_failing_on_change_is_retried_at_the_next_fetch():
    calls = []
    def on_change():
        calls.append(1)
        if len(calls) == 1:
            raise RuntimeError("busy")
    cache = ZoneCache(lambda: [HOME], on_change=on_change)
    cache.refresh()
    assert cache(52.0, 5.0) == "Home"  # the list is in place whatever on_change did
    cache.refresh()
    cache.refresh()
    assert calls == [1, 1]


def test_run_refreshes_once_per_interval(monkeypatch):
    fetch, calls = _source([HOME], [HOME], [HOME])
    sleeps = []
    async def sleep(s):
        sleeps.append(s)
        if len(sleeps) == 3:
            raise asyncio.CancelledError
    monkeypatch.setattr(asyncio, "sleep", sleep)
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(ZoneCache(fetch, ttl_ms=5000).run())
    assert len(calls) == 3 and sleeps == [5, 5, 5]  # the default interval is the ttl
    sleeps.clear()
    fetch, _ = _source([HOME], [HOME], [HOME])
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(ZoneCache(fetch).run(interval_s=7))
    assert sleeps == [7, 7, 7]
