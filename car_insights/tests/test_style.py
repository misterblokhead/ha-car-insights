import math

import pytest

from car_insights.style import accel_series, events, score
from conftest import s


def speeds(profile, secs, t0=0):
    """speed samples at 5 Hz over secs seconds; profile(t seconds) -> m/s"""
    return [s(t0 + t, "speed", profile(t / 1000)) for t in range(0, int(secs * 1000) + 1, 200)]


def brake(secs_before=100, secs_after=100, v0=25.0, v1=10.0, ramp=3.0):
    """cruise, a linear ramp from v0 to v1 over `ramp` seconds, cruise"""
    t1 = secs_before + ramp
    return speeds(lambda t: v0 if t <= secs_before else v1 if t >= t1 else v0 + (v1 - v0) * (t - secs_before) / ramp, t1 + secs_after)


def turn(bearings, speed=13.9, acc=5.0):
    """gps fixes at 1 Hz with the given bearings and a constant speed over the same span"""
    gps = [s(i * 1000, "gps", [52.0 + i * 1e-4, 5.0, acc, b, speed, 0.0]) for i, b in enumerate(bearings)]
    return [*speeds(lambda t: speed, len(bearings) - 1), *gps]


def ordered(samples):
    return sorted(samples, key=lambda x: (x.t, x.seq))


def test_steady_drive_no_events():
    samples = ordered(speeds(lambda t: 22.2, 600))
    assert events(samples) == []
    assert score([], 22.2 * 600) == 100


def test_one_hard_brake():
    (kind, _, sev), = events(ordered(brake()))
    assert kind == "brake"
    assert sev == pytest.approx(5 / 3.0, abs=0.15)


def test_one_hard_acceleration():
    (kind, _, sev), = events(ordered(brake(v0=10.0, v1=25.0, ramp=3.0)))
    assert kind == "accel"
    assert sev == pytest.approx(5 / 2.5, abs=0.15)


def step_up(jump):
    """a speed rise of `jump` m/s within 0.3 s at 10 s into a 20 s drive"""
    return ordered(speeds(lambda t: 20.0 if t < 10 else 20.0 + jump * min((t - 10) / 0.3, 1), 20))


def test_short_spike_no_event():
    # a 3 m/s rise in 0.3 s (10 m/s2) is above 2.5 for only ~0.3 s once smoothed
    assert events(step_up(3.0)) == []


def test_longer_spike_is_an_event():
    assert [e[0] for e in events(step_up(4.0))] == ["accel"]


def test_gap_is_no_event():
    samples = ordered([*speeds(lambda t: 20.0, 10), *speeds(lambda t: 30.0, 10, t0=16_000)])
    assert events(samples) == []
    assert all(a == pytest.approx(0, abs=1e-9) for _, a, _ in accel_series(samples))


def test_accel_series_shape():
    samples = ordered(speeds(lambda t: 10.0 + 2 * t, 5))
    series = accel_series(samples)
    assert [t for t, _, _ in series] == [x.t for x in samples]
    assert series[-1][2] == pytest.approx(sum(10 + 2 * t / 1000 for t in range(0, 5000, 200)) * 0.2, rel=0.02)
    assert series[len(series) // 2][1] == pytest.approx(2.0, abs=0.05)


def test_event_km_at_peak():
    samples = ordered(brake())
    series = accel_series(samples)
    _, a, m = min(series, key=lambda p: p[1])
    (_, km, _), = events(samples)
    assert a == pytest.approx(-5, abs=0.2)
    assert km == pytest.approx(m / 1000, abs=0.06)
    assert 2.4 < km < 2.6


@pytest.mark.parametrize("speed, acc, n", [(13.9, 5.0, 1), (3.0, 5.0, 0), (13.9, 20.0, 0), (13.9, 15.0, 0)])
def test_corner_counts_only_fast_and_accurate(speed, acc, n):
    samples = ordered(turn([0, 0, 30, 60, 90, 90, 90], speed, acc))
    assert [e[0] for e in events(samples)] == ["corner"] * n


def test_corner_severity_and_km():
    samples = ordered(turn([0, 0, 30, 60, 90, 90, 90]))
    (_, km, sev), = events(samples)
    assert sev == pytest.approx(13.9 * math.radians(30) / 3.0)
    assert km == pytest.approx(13.9 * 2 / 1000, abs=0.02)  # the speed at the peak pair's later fix (2 s)


def test_corner_pairs_further_apart_than_two_seconds_are_skipped():
    gps = [s(0, "gps", [52.0, 5.0, 5.0, 0.0, 13.9, 0.0]), s(3000, "gps", [52.001, 5.0, 5.0, 90.0, 13.9, 0.0])]
    assert events(ordered([*speeds(lambda t: 13.9, 3), *gps])) == []


def test_corner_fix_without_accuracy_or_bearing_is_unusable():
    base = [0, 0, 30, 60, 90, 90, 90]
    for bad in ([52.0, 5.0], [52.0, 5.0, None, 40.0], [52.0, 5.0, 5.0, None]):
        samples = turn(base)
        samples = [x if not (x.k == "gps" and x.t in (2000, 3000)) else s(x.t, "gps", bad) for x in samples]
        assert events(ordered(samples)) == []


def test_bearing_wraps():
    samples = ordered(turn([359, 1, 359, 1, 359, 1], 20.0))
    assert events(samples) == []  # a 2 degree change per second, not 358


def test_score_formula():
    ev = [("accel", 1.0, 5.0), ("accel", 2.0, 5.0)]  # 10 severity over 10 km: 1.0 per km
    assert score(ev, 10_000) == 93  # (80 + 100 + 100) / 3
    assert score([("brake", 0.0, 100.0)], 10_000) == 67  # that sub-score clamps at 0
    assert score(ev, 1999) is None
    assert score([], 2000) == 100
