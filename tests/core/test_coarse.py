import pytest

from custom_components.car_insights.core.coarse import find_cloud_trips
from conftest import s

MIN = 60_000
T0 = 1_700_000_000_000  # invented
LAT0, LON0 = 45.0, 10.0  # invented open country
KM_LAT = 0.009  # about 1 km of latitude


def ign_trace(on, off, odo=(1000.0, 1012.4), wh=(40_000, 37_600)):
    """the reading before the trip, ignition on and off, a speed in between, the readings a minute after off"""
    return [s(on - MIN, "odometer_km", odo[0]), s(on - MIN, "battery_wh", wh[0]),
            s(on, "ignition", 3), s(on + 5 * MIN, "speed", 25.0), s(off, "ignition", 2),
            s(off + MIN, "odometer_km", odo[1]), s(off + MIN, "battery_wh", wh[1])]


def odo_trace(t0, odos, soc=None):
    """one odometer reading a minute from t0, and a soc_percent reading beside each when given"""
    out = [s(t0 + i * MIN, "odometer_km", v) for i, v in enumerate(odos)]
    return out + [s(t0 + i * MIN, "soc_percent", v) for i, v in enumerate(soc or [])]


def gps(t, i, dlon=0.0):
    """a fix i km north of the start"""
    return s(t, "gps", [LAT0 + i * KM_LAT, LON0 + dlon])


def test_ignition_trip_uses_odometer_distance_and_battery_energy():
    trips = find_cloud_trips(ign_trace(on=T0, off=T0 + 20 * MIN), {}, True, 60_000, T0 + 30 * MIN)
    assert len(trips) == 1 and trips[0].start == T0 and trips[0].end == T0 + 20 * MIN
    assert trips[0].distance_m == pytest.approx(12_400) and trips[0].net_wh == 2400 and trips[0].gross_wh is None
    assert (trips[0].start_wh, trips[0].end_wh, trips[0].recup_wh, trips[0].avg_temp_c) == (40_000, 37_600, None, None)
    assert trips[0].duration_s == 1200 and trips[0].avg_speed_mps == pytest.approx(12_400 / 1200)
    assert trips[0].max_speed_mps == 25.0


def test_ignition_trip_stays_open_until_the_odometer_can_settle():
    assert find_cloud_trips(ign_trace(on=T0, off=T0 + 20 * MIN), {}, True, 60_000, T0 + 21 * MIN)[0].end is None
    assert find_cloud_trips(ign_trace(on=T0, off=T0 + 20 * MIN), {}, True, 60_000, None)[0].end is None
    assert find_cloud_trips(ign_trace(on=T0, off=T0 + 20 * MIN), {}, True, 60_000, T0 + 22 * MIN)[0].end == T0 + 20 * MIN


def test_ignition_trip_without_off_is_open():
    t = find_cloud_trips(ign_trace(on=T0, off=T0 + 20 * MIN)[:4], {}, True, 60_000, T0 + 90 * MIN)[0]
    assert t.start == T0 and t.end is None


def test_motion_trip_ends_after_ten_quiet_minutes():
    trips = find_cloud_trips(odo_trace(T0, [1000, 1001, 1003, 1006] + [1006] * 12), {"odometer_km": 1000}, False, 60_000, T0 + 40 * MIN)
    assert trips[0].start == T0 + 1 * MIN and trips[0].end == T0 + 3 * MIN and trips[0].distance_m == pytest.approx(6000)


def test_motion_trip_stays_open_before_ten_quiet_minutes():
    samples = odo_trace(T0, [1000, 1001, 1003, 1006])
    assert find_cloud_trips(samples, {"odometer_km": 1000}, False, 60_000, T0 + 12 * MIN)[0].end is None
    assert find_cloud_trips(samples, {"odometer_km": 1000}, False, 60_000, T0 + 13 * MIN)[0].end == T0 + 3 * MIN


def test_motion_trip_open_without_horizon():  # HA restarted mid-trip: the first poll has not set the horizon yet
    assert find_cloud_trips(odo_trace(T0, [1000, 1001, 1003]), {"odometer_km": 1000}, False, 60_000, None)[0].end is None


def test_energy_from_soc_and_capacity_without_battery_energy():
    t = find_cloud_trips(odo_trace(T0, [1000, 1004, 1008], soc=[80, 78, 75]), {"odometer_km": 1000, "soc_percent": 80}, False, 50_000, T0 + 30 * MIN)[0]
    assert t.net_wh == pytest.approx(2500) and (t.start_wh, t.end_wh) == (pytest.approx(40_000), pytest.approx(37_500))


def test_no_energy_without_both_ends():
    t = find_cloud_trips(odo_trace(T0, [1000, 1004, 1008]), {"odometer_km": 1000}, False, 50_000, T0 + 30 * MIN)[0]
    assert (t.start_wh, t.end_wh, t.net_wh, t.gross_wh, t.recup_wh) == (None, None, None, None, None)


def test_location_only_trip_uses_route_length():
    samples = [gps(T0 + i * MIN, i) for i in range(4)]  # 1 km a minute, no odometer
    t = find_cloud_trips(samples, {"gps": [LAT0, LON0]}, False, 60_000, T0 + 40 * MIN)[0]
    assert t.start == T0 + MIN and t.end == T0 + 3 * MIN and t.distance_m == pytest.approx(3000, rel=0.01)
    assert t.first_fix == (LAT0, LON0) and t.last_fix == (LAT0 + 3 * KM_LAT, LON0)


def test_negative_odometer_difference_falls_back_to_route_length():
    samples = [*ign_trace(T0, T0 + 20 * MIN, odo=(1010.0, 1005.0)), gps(T0 - MIN, 0), gps(T0 + 10 * MIN, 2), gps(T0 + 20 * MIN, 4)]
    (t,) = find_cloud_trips(sorted(samples, key=lambda x: (x.t, x.seq)), {}, True, 60_000, T0 + 30 * MIN)
    assert t.distance_m == pytest.approx(4000, rel=0.01)


def test_missing_odometer_falls_back_to_route_length_from_the_seed_fix():
    samples = [s(T0, "ignition", 3), gps(T0 + 10 * MIN, 3), s(T0 + 20 * MIN, "ignition", 2)]
    (t,) = find_cloud_trips(samples, {"gps": [LAT0, LON0]}, True, 60_000, T0 + 30 * MIN)
    assert t.distance_m == pytest.approx(3000, rel=0.01) and t.first_fix == (LAT0, LON0)


def test_short_trip_is_noise_and_dropped():
    assert find_cloud_trips(ign_trace(T0, T0 + 5 * MIN, odo=(1000.0, 1000.3)), {}, True, 60_000, T0 + 60 * MIN) == []


def test_short_open_trip_is_kept():
    assert len(find_cloud_trips(ign_trace(T0, T0 + 5 * MIN, odo=(1000.0, 1000.3)), {}, True, 60_000, None)) == 1


def test_parked_gps_jitter_opens_no_trip():
    # 150 m either side of the seed fix: 300 m between neighbours, but never more than MOVE_M from where the car stood
    jitter = [s(T0 + i * MIN, "gps", [LAT0 + (0.00135 if i % 2 else -0.00135), LON0]) for i in range(60)]
    flat = odo_trace(T0, [1000] * 60)
    seed = {"gps": [LAT0, LON0], "odometer_km": 1000}
    for samples in (jitter, sorted(jitter + flat, key=lambda x: (x.t, x.seq))):
        for horizon in (None, T0 + 120 * MIN):
            assert find_cloud_trips(samples, seed, False, 60_000, horizon) == []


def test_ignition_undefined_opens_no_trip():
    assert find_cloud_trips([s(T0, "ignition", 0), s(T0 + MIN, "odometer_km", 1000.0)], {}, True, 60_000, T0 + 60 * MIN) == []


def test_two_trips_with_a_long_stop_between():
    odos = [1000, 1002, 1005] + [1005] * 30 + [1008, 1012] + [1012] * 12
    a, b = find_cloud_trips(odo_trace(T0, odos), {"odometer_km": 1000}, False, 60_000, T0 + 90 * MIN)
    assert (a.start, a.end, b.start, b.end) == (T0 + MIN, T0 + 2 * MIN, T0 + 33 * MIN, T0 + 34 * MIN)
    assert a.distance_m == pytest.approx(5000) and b.distance_m == pytest.approx(7000)
