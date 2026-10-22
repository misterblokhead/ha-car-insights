import itertools

import pytest

from car_insights.protocol import Sample
from car_insights.trips import MERGE_GAP_MS, find_trips

_seq = itertools.count(1)


def s(t, k, v):
    return Sample(next(_seq), t, k, v)


def drive(t0, t1, v=10.0, step=1000):
    return [s(t, "speed", v) for t in range(t0, t1 + 1, step)]


def trips(samples, seed=None, now_ms=None, has_ignition=True):
    samples = sorted(samples, key=lambda x: (x.t, x.seq))
    return find_trips(samples, seed or {}, samples[-1].t if now_ms is None else now_ms, has_ignition)


def test_trip_ends_on_ignition_off():
    samples = [s(0, "gear", 1.0), *drive(0, 120_000, step=200), s(121_000, "gear", 4.0),
               s(0, "ignition", 4.0), s(400_000, "ignition", 2.0),
               s(0, "battery_wh", 33050), s(60_000, "battery_wh", 33000), s(90_000, "battery_wh", 33100), s(300_000, "battery_wh", 32550)]
    (t,) = trips(samples)
    assert (t.start, t.end) == (0, 400_000)
    assert t.duration_s == 400
    assert t.distance_m == pytest.approx(1200, rel=0.01)
    assert (t.gross_wh, t.recup_wh, t.net_wh) == (600, 100, 500)
    assert t.start_wh == 33050 and t.end_wh == 32550 and t.net_wh == t.start_wh - t.end_wh


def test_stop_in_p_with_ignition_on_stays_one_trip():
    samples = [s(0, "gear", 1.0), *drive(0, 60_000), s(60_000, "gear", 4.0),
               *drive(60_000, 330_000, v=0.0, step=30_000),  # samples keep arriving, so the car is not asleep
               s(330_000, "gear", 1.0), *drive(330_000, 390_000), s(400_000, "ignition", 2.0)]
    (t,) = trips(samples)
    assert (t.start, t.end) == (0, 400_000)


def test_without_ignition_p_for_merge_gap_ends_trip():
    samples = [s(0, "gear", 1.0), *drive(0, 60_000), s(60_000, "gear", 4.0), s(300_000, "speed", 0.0)]
    (t,) = trips(samples, has_ignition=False)
    assert t.end == 60_000
    assert t.distance_m == pytest.approx(600)


def test_without_ignition_short_p_stays_one_trip():
    samples = [s(0, "gear", 1.0), *drive(0, 60_000), s(60_000, "gear", 4.0), s(200_000, "gear", 1.0), *drive(200_000, 260_000)]
    (t,) = trips(samples, has_ignition=False, now_ms=270_000)
    assert t.end is None and t.start == 0


def test_car_asleep_ends_trip():
    samples = [s(0, "gear", 1.0), *drive(0, 60_000), s(60_000, "gear", 4.0)]
    (t,) = trips(samples, now_ms=60_000 + MERGE_GAP_MS)
    assert t.end == 60_000
    (t,) = trips(samples, now_ms=60_000 + MERGE_GAP_MS - 1)
    assert t.end is None


def test_open_trip_returned_last():
    first = [s(0, "gear", 1.0), *drive(0, 100_000), s(100_000, "ignition", 2.0)]
    second = drive(500_000, 560_000)
    a, b = trips(first + second)
    assert a.end == 100_000
    assert b.end is None and b.start == 500_000 and b.duration_s == 60


def test_noise_trip_discarded():
    samples = [s(0, "gear", 1.0), *drive(0, 10_000, v=5.0), s(30_000, "ignition", 2.0)]
    assert trips(samples) == []


def test_short_but_long_distance_trip_kept():
    samples = [s(0, "gear", 1.0), *drive(0, 10_000, v=20.0), s(30_000, "ignition", 2.0)]
    (t,) = trips(samples)
    assert t.distance_m == pytest.approx(200)


def test_trip_without_battery_has_null_energy():
    samples = [s(0, "gear", 1.0), *drive(0, 100_000), s(100_000, "ignition", 2.0)]
    (t,) = trips(samples)
    assert t.net_wh is t.gross_wh is t.recup_wh is t.start_wh is t.end_wh is None


def test_avg_speed_uses_moving_time():
    samples = [s(0, "gear", 1.0), *drive(0, 99_000), *drive(100_000, 290_000, v=0.0, step=10_000), s(300_000, "ignition", 2.0)]
    (t,) = trips(samples)
    assert t.avg_speed_mps == pytest.approx(10, rel=0.02)
    assert t.max_speed_mps == 10
    assert t.duration_s == pytest.approx(300)
    assert t.distance_m == pytest.approx(1000, rel=0.01)


def test_seed_supplies_start_battery_and_gear():
    samples = [*drive(0, 100_000), s(50_000, "battery_wh", 39950), s(100_000, "ignition", 2.0)]
    (t,) = trips(samples, seed={"battery_wh": 40000, "gear": 1.0})
    assert t.start_wh == 40000 and t.end_wh == 39950 and t.net_wh == 50 and t.gross_wh == 50 and t.recup_wh == 0


def test_speed_while_in_park_does_not_start_trip():
    assert trips(drive(0, 100_000), seed={"gear": 4.0}) == []


def test_fixes_and_temp():
    samples = [s(0, "gear", 1.0), *drive(0, 100_000),
               s(1_000, "gps", [50.0, 4.0, 5.0, 90.0, 10.0, 12.0]), s(90_000, "gps", [50.1, 4.1, 5.0, 90.0, 10.0, 12.0]),
               s(10_000, "outside_temp", 7.0), s(20_000, "outside_temp", 9.0), s(100_000, "ignition", 2.0)]
    (t,) = trips(samples)
    assert t.first_fix == (50.0, 4.0) and t.last_fix == (50.1, 4.1)
    assert t.avg_temp_c == 8.0
    (t,) = trips(samples, seed={"outside_temp": 5.0})
    assert t.avg_temp_c == pytest.approx(7.0)
