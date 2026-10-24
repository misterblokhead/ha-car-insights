import json

from car_insights import stats
from car_insights.db import connect
from car_insights.derive import ALGO


def put(conn, start, extra, vid="car1", end=None):
    end = start + 1000 if end is None else end
    conn.execute("INSERT INTO trips VALUES(?,?,?,?,?)", (vid, start, end, ALGO, json.dumps({"start": start, "end": end, **extra})))


def trip(start=100_000, **kw):
    return {"start": start, "from": "Home", "to": "Work", **kw}


def test_similar_matches_zones_earlier_only():
    c = connect(":memory:")
    put(c, 1000, {"from": "Home", "to": "Work", "duration_s": 600, "distance_m": 10_000, "net_wh": 2000})
    put(c, 2000, {"from": "Home", "to": "Work", "duration_s": 1000, "distance_m": 10_000, "net_wh": 3000})
    put(c, 3000, {"from": "Home", "to": "Shop", "duration_s": 5, "distance_m": 1, "net_wh": 1})
    put(c, 200_000, {"from": "Home", "to": "Work", "duration_s": 5, "distance_m": 1, "net_wh": 1})
    assert stats.similar_trips(c, "car1", trip()) == {"n": 2, "avg_duration_s": 800, "avg_wh_per_100km": 25_000}


def test_similar_limit_20_newest():
    c = connect(":memory:")
    for i in range(25):
        put(c, 1000 * (i + 1), {"from": "Home", "to": "Work", "duration_s": i, "distance_m": 1000, "net_wh": 100 * i})
    got = stats.similar_trips(c, "car1", trip())
    assert got["n"] == 20 and got["avg_duration_s"] == sum(range(5, 25)) / 20
    assert got["avg_wh_per_100km"] == sum(100 * i for i in range(5, 25)) / 20_000 * 100_000


def test_similar_unknown_zone_none():
    c = connect(":memory:")
    put(c, 1000, {"from": None, "to": None, "duration_s": 5})
    assert stats.similar_trips(c, "car1", trip(**{"from": None, "to": None})) is None
    assert stats.similar_trips(c, "car1", trip(to=None)) is None
    assert stats.similar_trips(c, "car1", trip()) is None  # no earlier match


def test_similar_zero_distance_no_division():
    c = connect(":memory:")
    put(c, 1000, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 0, "net_wh": 0})
    put(c, 2000, {"from": "Home", "to": "Work", "duration_s": 120, "distance_m": 0, "net_wh": None})
    assert stats.similar_trips(c, "car1", trip()) == {"n": 2, "avg_duration_s": 90, "avg_wh_per_100km": None}
