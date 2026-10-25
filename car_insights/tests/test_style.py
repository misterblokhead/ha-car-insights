import math

import pytest

from car_insights.style import _accel_groups, bands, events, measure, score
from car_insights.trips import find_trips
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


def accel(samples):
    """(t, a m/s2, cumulative m) per speed sample, across every stretch"""
    return [p for group in _accel_groups(samples) for p in group]


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
    assert sev == pytest.approx(5 / 3.0, abs=0.15)


@pytest.mark.parametrize("rate, n", [(2.8, 0), (3.2, 1)])
def test_acceleration_threshold_is_3(rate, n):
    samples = ordered(brake(v0=10.0, v1=10.0 + rate * 3, ramp=3.0))
    assert [e[0] for e in events(samples)] == ["accel"] * n
    if n:
        assert events(samples)[0][2] == pytest.approx(rate / 3.0, abs=0.05)


def step_up(jump):
    """a speed rise of `jump` m/s within 0.3 s at 10 s into a 20 s drive"""
    return ordered(speeds(lambda t: 20.0 if t < 10 else 20.0 + jump * min((t - 10) / 0.3, 1), 20))


def test_short_spike_no_event():
    # a 3 m/s rise in 0.3 s (10 m/s2) is above 3.0 for only ~0.3 s once smoothed
    assert events(step_up(3.0)) == []


def test_longer_spike_is_an_event():
    assert [e[0] for e in events(step_up(4.0))] == ["accel"]


def test_two_speed_samples_at_one_instant_are_no_error():
    assert events([s(0, "speed", 10.0), s(0, "speed", 12.0), s(1000, "speed", 12.0)]) == []


def test_gap_is_no_event():
    samples = ordered([*speeds(lambda t: 20.0, 10), *speeds(lambda t: 30.0, 10, t0=16_000)])
    assert events(samples) == []
    assert all(a == pytest.approx(0, abs=1e-9) for _, a, _ in accel(samples))


def test_accel_shape():
    samples = ordered(speeds(lambda t: 10.0 + 2 * t, 5))
    series = accel(samples)
    assert [t for t, _, _ in series] == [x.t for x in samples]
    assert series[-1][2] == pytest.approx(sum(10 + 2 * t / 1000 for t in range(0, 5000, 200)) * 0.2, rel=0.02)
    assert series[len(series) // 2][1] == pytest.approx(2.0, abs=0.05)


def test_event_km_at_peak():
    samples = ordered(brake())
    series = accel(samples)
    _, a, m = min(series, key=lambda p: p[1])
    (_, km, _), = events(samples)
    assert a == pytest.approx(-5, abs=0.2)
    assert km == pytest.approx(m / 1000, abs=0.06)
    assert 2.4 < km < 2.6


@pytest.mark.parametrize("speed, acc, n", [(13.9, 5.0, 1), (13.9, 20.0, 0), (13.9, 15.0, 0)])
def test_corner_counts_only_fast_and_accurate(speed, acc, n):
    samples = ordered(turn([0, 0, 30, 60, 90, 90, 90], speed, acc))
    assert [e[0] for e in events(samples)] == ["corner"] * n


SHARP = [0, 0, 40, 80, 120, 120, 120]  # 40 deg/s: 4.5 m/s2 at 6.5 m/s, 5.0 at 7.2, 9.7 at 13.9


@pytest.mark.parametrize("speed, n", [(13.9, 1), (7.2, 1), (6.5, 0), (5.0, 0)])
def test_corner_needs_25_kmh(speed, n):
    assert [e[0] for e in events(ordered(turn(SHARP, speed)))] == ["corner"] * n


@pytest.mark.parametrize("bearings, n", [([0, 0, 15, 30, 45, 45, 45], 0), ([0, 0, 20, 40, 60, 60, 60], 1)])
def test_corner_threshold_is_4(bearings, n):
    # at 13.9 m/s: 15 deg/s is 3.6 m/s2 (an ordinary turn), 20 deg/s is 4.8
    assert [e[0] for e in events(ordered(turn(bearings)))] == ["corner"] * n


def test_corner_severity_and_km():
    samples = ordered(turn([0, 0, 30, 60, 90, 90, 90]))
    (_, km, sev), = events(samples)
    assert sev == pytest.approx(13.9 * math.radians(30) / 4.0)
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


def test_impossible_corner_is_a_glitch():
    # a fix reporting bearing 0.0 on a straight drive heading 180: ~43 m/s2 both ways, no road car corners above 10
    samples = ordered(turn([180, 180, 180, 0.0, 180, 180, 180]))
    assert events(samples) == []
    m = measure(samples, None, 0, 10_000)
    assert m["corner"] == [0, 0] and m["score"] == 100


def test_impossible_pair_ends_the_corner_group():
    # a glitch fix (270) between two stretches of a steady 30 deg/s turn: its pairs count for nothing and the run is cut in two
    samples = ordered(turn([0, 30, 60, 270, 90, 120, 150]))
    assert [e[0] for e in events(samples)] == ["corner", "corner"]


def test_bearing_wraps():
    samples = ordered(turn([359, 1, 359, 1, 359, 1], 20.0))
    assert events(samples) == []  # a 2 degree change per second, not 358


def test_score_formula():
    ev = [("accel", 1.0, 5.0), ("accel", 2.0, 5.0)]  # 10 severity over 10 km: 1.0 per km
    assert score(ev, 10_000) == 93  # (80 + 100 + 100) / 3
    assert score([("brake", 0.0, 100.0)], 10_000) == 67  # that sub-score clamps at 0
    assert score(ev, 1999) is None
    assert score([], 2000) == 100


def band_trip():
    """60, 90, then 125 km/h for a minute each at 1 Hz; a reading every 10 s: drops, one 150 Wh rise (recuperation), a flicker (replaced after 0.3 s)"""
    kmh = lambda t: 60 if t < 60_000 else 90 if t < 120_000 else 125
    wh = {10_000 * k: 50_000 - 100 * k for k in range(1, 13)} | {130_000: 48_600, 140_000: 48_750, 150_000: 48_550, 155_000: 48_700, 155_300: 48_550,
                                                                  160_000: 48_400, 170_000: 48_300, 180_000: 48_200}
    return ordered([*(s(t, "speed", kmh(t) / 3.6) for t in range(0, 180_001, 1000)), s(0, "battery_wh", 50_000.0), *(s(t, "battery_wh", v) for t, v in wh.items())])


def test_band_energy_sums_to_net():
    samples = band_trip()
    (trip,) = find_trips(samples, {}, True)
    b, standing = bands(samples, None, 0)
    assert trip.net_wh == 1800
    assert standing == 0 and abs(sum(wh for _, wh in b.values()) - trip.net_wh) <= 2.5
    assert b["120+"][1] == 600  # the energy of the 125 km/h stretch's steps (t > 120 s)
    assert (b["50-80"][1], b["80-100"][1], b["0-50"][1], b["100-120"][1]) == (600, 600, 0, 0)
    assert [b[n][0] for n in ("0-50", "50-80", "80-100", "100-120", "120+")] == [0, 1000, 1500, 0, 2083]


def test_step_is_split_by_distance():
    # 72 km/h for 2 s (40 m), then 90 for 1 s (25 m) inside one 130 Wh step: 80 and 50 Wh
    samples = [s(0, "speed", 20.0), s(0, "battery_wh", 50_000.0), s(1000, "speed", 20.0), s(2000, "speed", 25.0), s(3000, "speed", 25.0), s(3000, "battery_wh", 49_870.0)]
    assert bands(samples, None, 0) == ({"0-50": [0, 0], "50-80": [40, 80], "80-100": [25, 50], "100-120": [0, 0], "120+": [0, 0]}, 0)


def test_step_without_movement_is_standing():
    b, standing = bands([s(1000, "speed", 0.0), s(2000, "speed", 0.0), s(2000, "battery_wh", 49_900.0)], 50_000.0, 0)
    assert standing == 100 and b["0-50"] == [0, 0]


def test_stop_with_the_car_on_is_standing_not_a_band():
    # 20 m/s for 1 s, braking to a stop by 1.5 s (30 m, a 100 Wh step), then 2 s standing (a 40 Wh step)
    samples = [s(0, "speed", 20.0), s(0, "battery_wh", 50_000.0), s(1000, "speed", 20.0), s(1500, "speed", 0.0), s(1500, "battery_wh", 49_900.0),
               s(2500, "speed", 0.0), s(3500, "speed", 0.0), s(3500, "battery_wh", 49_860.0)]
    assert bands(samples, None, 0) == ({"0-50": [0, 0], "50-80": [30, 100], "80-100": [0, 0], "100-120": [0, 0], "120+": [0, 0]}, 40)


def test_bands_and_standing_sum_to_net():
    # odd distances over three bands, then a stop with the car on and a recuperating step
    kmh = lambda t: 30 if t < 20_000 else 77 if t < 45_000 else 98 if t < 70_000 else 0
    wh = {10_000: 49_937, 30_000: 49_810, 50_000: 49_581, 70_000: 49_290, 80_000: 49_270, 90_000: 49_241}
    samples = ordered([*(s(t, "speed", kmh(t) / 3.6) for t in range(0, 90_001, 1000)), s(0, "battery_wh", 50_000.0), *(s(t, "battery_wh", v) for t, v in wh.items())])
    m = measure(samples, None, 0, 5000)
    assert m["standing"] == 49  # the two readings after the stop: 20 Wh and 29 Wh into the battery's net
    assert abs(sum(wh for _, wh in m["bands"].values()) + m["standing"] - 759) <= 3


def test_style_without_energy():
    samples = [s(t, "speed", 25.0) for t in range(0, 11_000, 1000)]
    assert bands(samples, None, 0) == ({"0-50": [0, None], "50-80": [0, None], "80-100": [250, None], "100-120": [0, None], "120+": [0, None]}, None)
    assert measure(samples, None, 0, 250)["score"] is None and measure(samples, None, 0, 250)["standing"] is None


def test_measure_shape():
    samples = ordered(brake())
    m = measure(samples, None, 0, 3000)
    assert m["brake"][0] == 1 and m["brake"][1] == round(m["brake"][1], 2) and m["accel"] == [0, 0] and m["corner"] == [0, 0]
    assert m["score"] == score(events(samples), 3000) and set(m["bands"]) == {"0-50", "50-80", "80-100", "100-120", "120+"}
