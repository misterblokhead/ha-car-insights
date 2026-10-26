import asyncio

import pytest

from custom_components.car_insights.core import capacity, db
from custom_components.car_insights.core.capacity import MIN_PAIRS, PAIR_MS, WINDOW_MS, learn
from custom_components.car_insights.core.db import connect
from custom_components.car_insights.core.protocol import Sample

NOW = 100 * 86_400_000


def put(conn, pairs, soc_dt=0, vid="car1"):
    """pairs: (t, soc, wh); the soc sample is stamped soc_dt after its battery_wh sample"""
    samples, seq = [], 0
    for t, soc, wh in pairs:
        samples += [Sample(seq + 1, t, "battery_wh", wh), Sample(seq + 2, t + soc_dt, "soc_percent", soc)]
        seq += 2
    db.ingest(conn, vid, "s", samples, NOW)


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


def test_update_stores_learned_capacity():
    conn = connect(":memory:")
    put(conn, ten())
    capacity.update(conn, "car1", NOW, set())
    assert db.capacity_wh(conn, "car1", 1.0) == 57_000.0


@pytest.mark.parametrize("wh", [2_000.0, 150_000.0])  # 4 kWh and 300 kWh learned: outside 10-200 kWh
def test_implausible_learned_capacity_keeps_the_previous_value_and_logs_once(wh, caplog):
    conn = connect(":memory:")
    put(conn, [(t, 50, wh) for t, _, _ in ten()])
    db.set_capacity_wh(conn, "car1", 57_000.0)
    logged: set[str] = set()
    capacity.update(conn, "car1", NOW, logged)
    capacity.update(conn, "car1", NOW, logged)
    assert db.capacity_wh(conn, "car1", 0.0) == 57_000.0
    assert len([r for r in caplog.records if "outside" in r.getMessage()]) == 1


def test_run_learns_every_vehicle(monkeypatch):
    conn = connect(":memory:")
    put(conn, ten(), vid="car1")
    put(conn, ten(ratio=40_000), vid="car2")
    sleeps, learned = [], []

    async def stop(s):
        sleeps.append(s)
        learned.append(db.capacity_wh(conn, "car1", 1.0))
        if len(sleeps) == 2:
            raise asyncio.CancelledError

    monkeypatch.setattr(asyncio, "sleep", stop)
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(capacity.run(conn, now_ms=lambda: NOW))
    assert db.capacity_wh(conn, "car1", 1.0) == 57_000.0 and db.capacity_wh(conn, "car2", 1.0) == 40_000.0
    assert sleeps == [600, 86_400]  # a first wait lets the poller's backfill land; then a pass a day
    assert learned == [1.0, 57_000.0]  # nothing learned before the first wait ended


def test_run_survives_a_failing_pass_and_sleeps(monkeypatch, caplog):
    class Broken:
        def execute(self, *a):
            raise RuntimeError("db down")

    sleeps = []

    async def stop(s):
        sleeps.append(s)
        if len(sleeps) == 2:
            raise asyncio.CancelledError

    monkeypatch.setattr(asyncio, "sleep", stop)
    with pytest.raises(asyncio.CancelledError):  # reached the sleep after the pass: the error did not end the loop
        asyncio.run(capacity.run(Broken(), now_ms=lambda: NOW))
    assert "learning the capacities failed" in caplog.text
