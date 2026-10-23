from car_insights import db
from car_insights.capacity import MIN_PAIRS, PAIR_MS, WINDOW_MS, learn
from car_insights.db import connect
from car_insights.protocol import Sample

NOW = 100 * 86_400_000


def put(conn, pairs, soc_dt=0):
    """pairs: (t, soc, wh); the soc sample is stamped soc_dt after its battery_wh sample"""
    samples, seq = [], 0
    for t, soc, wh in pairs:
        samples += [Sample(seq + 1, t, "battery_wh", wh), Sample(seq + 2, t + soc_dt, "soc_percent", soc)]
        seq += 2
    db.ingest(conn, "car1", "s", samples, NOW)


def ten(ratio=57_000, **kw):
    return [(NOW - 600_000 * (i + 1), 50, ratio / 2) for i in range(MIN_PAIRS)]


def test_median_of_close_pairs():
    conn = connect(":memory:")
    put(conn, ten() + [(NOW - 5_000, 50, 35_000)])
    assert learn(conn, "car1", NOW) == 57_000


def test_pairs_further_than_two_minutes_ignored():
    conn = connect(":memory:")
    put(conn, ten(), soc_dt=PAIR_MS + 1)
    assert learn(conn, "car1", NOW) is None
    conn = connect(":memory:")
    put(conn, ten(), soc_dt=PAIR_MS)
    assert learn(conn, "car1", NOW) == 57_000


def test_too_few_pairs_is_none():
    conn = connect(":memory:")
    put(conn, ten()[:MIN_PAIRS - 1])
    assert learn(conn, "car1", NOW) is None


def test_soc_zero_or_over_100_ignored():
    conn = connect(":memory:")
    put(conn, ten()[:MIN_PAIRS - 1] + [(NOW - 1000, 0, 100.0), (NOW - 2000, 101, 100.0)])
    assert learn(conn, "car1", NOW) is None


def test_old_pairs_outside_window_ignored():
    conn = connect(":memory:")
    put(conn, [(NOW - WINDOW_MS - 1 - 60_000 * i, 50, 28_500) for i in range(MIN_PAIRS)])
    assert learn(conn, "car1", NOW) is None


def test_capacity_wh_default_until_set():
    conn = connect(":memory:")
    assert db.capacity_wh(conn, "car1", 60_000.0) == 60_000.0
    db.set_capacity_wh(conn, "car1", 57_000.0)
    assert db.capacity_wh(conn, "car1", 60_000.0) == 57_000.0
