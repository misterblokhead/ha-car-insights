from car_insights import series
from car_insights.trips import distance_steps, energy_steps
from conftest import s


def test_downsample_keeps_first_last_and_count():
    rows = list(range(1000))
    out = series.downsample(rows)
    assert len(out) == series.MAX_POINTS and out[0] == 0 and out[-1] == 999
    assert out == sorted(set(out))


def test_downsample_short_unchanged():
    rows = list(range(200))
    assert series.downsample(rows) == rows
    assert series.downsample([], 5) == [] and series.downsample([1], 5) == [1]


def test_distance_steps_caps_a_long_gap():
    out = list(distance_steps([s(0, "speed", 10.0), s(60_000, "speed", -10.0), s(61_000, "gps", [52.0, 5.0])]))
    assert out == [(0, 0.0, 10.0), (60_000, 50.0, 10.0)]  # 5 s at 10 m/s; reverse speed is absolute


def test_energy_steps_start_instant_reading_is_the_base():
    samples = [s(0, "battery_wh", 50_000.0), s(1000, "battery_wh", 49_900.0), s(2000, "battery_wh", 49_950.0)]
    assert list(energy_steps(samples, 40_000.0, 0)) == [(1000, 100.0, 100.0, 0.0), (2000, 50.0, 100.0, 50.0)]
    assert list(energy_steps(samples[1:], None, 0)) == []  # no base, nothing


def test_trip_series_cumulative():
    samples = [s(0, "speed", 10.0), s(1000, "speed", 10.0), s(1500, "battery_wh", 49_950.0), s(2000, "speed", 10.0)]
    out = series.trip(samples, 50_000.0, 0)
    assert out["cols"] == ["t", "km", "net_kwh", "gross_kwh", "recup_kwh", "speed_kmh"]
    assert [r[0] for r in out["rows"]] == [0, 1000, 1500, 2000]
    assert out["rows"][0] == [0, 0.0, None, None, None, 36.0]
    assert out["rows"][-1] == [2000, 0.02, 0.05, 0.05, 0.0, 36.0]


def test_trip_series_no_battery_has_null_energy():
    out = series.trip([s(0, "speed", 10.0), s(1000, "speed", 10.0)], None, 0)
    assert out["rows"] == [[0, 0.0, None, None, None, 36.0], [1000, 0.01, None, None, None, 36.0]]


def test_trip_series_no_speed_is_energy_only():
    out = series.trip([s(1000, "battery_wh", 49_900.0)], 50_000.0, 0)
    assert out["rows"] == [[1000, None, 0.1, 0.1, 0.0, None]]  # no distance or speed: null, never 0
    assert series.trip([], None, 0)["rows"] == []


def test_trip_series_is_downsampled():
    out = series.trip([s(t * 1000, "speed", 10.0) for t in range(1000)], None, 0)
    assert len(out["rows"]) == series.MAX_POINTS and out["rows"][-1][0] == 999_000


def test_charge_series_cloud_only_has_no_car_points():
    samples = [s(0, "battery_wh", 22_500.0), s(100, "soc_percent", 40.0), s(100, "plug_state", True),
               s(500, "soc_percent", 81.0), s(500, "plug_state", False), s(900, "soc_percent", 90.0)]
    out = series.charge(samples, 100, 500)
    assert out == {"car_kwh": [], "cloud_soc": [[100, 40.0], [500, 81.0]], "cloud_plugged": [[100, 1], [500, 0]]}


def test_charge_series_open_has_no_upper_bound():
    samples = [s(0, "battery_wh", 1000.0), s(100, "battery_wh", 20_000.0), s(10**12, "battery_wh", 30_000.0)]
    assert series.charge(samples, 100, None)["car_kwh"] == [[100, 20.0], [10**12, 30.0]]
    assert series.charge(samples, 100, 200)["car_kwh"] == [[100, 20.0]]



def test_charge_series_drops_battery_flicker():
    """a reading replaced within a second is the car's flicker, not energy: it would draw a +-1000 kW spike"""
    samples = [s(0, "battery_wh", 20_000.0), s(60_000, "battery_wh", 20_200.0), s(60_200, "battery_wh", 20_100.0),
               s(120_000, "battery_wh", 20_300.0)]
    assert series.charge(samples, 0, None)["car_kwh"] == [[0, 20.0], [60_200, 20.1], [120_000, 20.3]]

def test_series_carries_events():
    ramp = lambda t: 25.0 if t <= 100 else 10.0 if t >= 103 else 25.0 - 5 * (t - 100)  # 5 m/s2 for 3 s: one hard brake
    samples = [s(t, "speed", ramp(t / 1000)) for t in range(0, 200_001, 200)]
    out = series.trip(samples, None, 0)
    assert out["events"] == [[2.5, "brake"]]
    assert series.trip([], None, 0)["events"] == []
