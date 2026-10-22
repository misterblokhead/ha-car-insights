import pytest

from car_insights.charges import KEYS, find_charges
from conftest import s


def charges(samples, seed=None):
    samples = sorted(samples, key=lambda x: (x.t, x.seq))
    return find_charges(samples, seed or {})


def session(wh1=50500, end=3_600_000):
    return [s(0, "plugged", True), s(0, "battery_wh", 30000), s(0, "range_m", 150000),
            s(end // 2, "battery_wh", 40000), s(end, "battery_wh", wh1), s(end, "range_m", 250000),
            s(end, "plugged", False)]


def test_session_plugged_true_to_false():
    (c,) = charges(session())
    assert (c.start, c.end) == (0, 3_600_000)
    assert (c.start_wh, c.end_wh, c.added_wh) == (30000, 50500, 20500)
    assert c.avg_w == pytest.approx(20500)
    assert c.range_added_m == 100000
    assert c.duration_s == 3600


def test_small_session_discarded():
    assert charges(session(wh1=30050)) == []


def test_open_session_last():
    samples = [*session(), s(4_000_000, "plugged", True), s(4_000_000, "battery_wh", 50500),
               s(4_600_000, "battery_wh", 51000)]
    closed, open_ = charges(samples)
    assert closed.end == 3_600_000
    assert open_.end is None
    assert (open_.start_wh, open_.end_wh, open_.added_wh) == (50500, 51000, 500)


def test_seed_plugged_true_starts_session_at_first_sample():
    samples = [s(1000, "battery_wh", 30500), s(3_601_000, "battery_wh", 50500), s(3_601_000, "plugged", False)]
    (c,) = charges(samples, {"plugged": True, "battery_wh": 30000})
    assert c.start == 1000
    assert c.start_wh == 30500  # reading at the start instant replaces the seed
    assert c.added_wh == 20000


def test_fix_is_latest_gps_at_start():
    samples = [s(-5, "gps", [1.0, 2.0, 5, 0, 0, 0]), s(-1, "gps", [3.0, 4.0, 5, 0, 0, 0]),
               *session(), s(10, "gps", [9.0, 9.0, 5, 0, 0, 0])]
    (c,) = charges(samples)
    assert c.fix == (3.0, 4.0)


def test_no_battery_gives_null_energy():
    samples = [s(0, "plugged", True), s(3_600_000, "plugged", False)]
    (c,) = charges(samples)
    assert (c.start_wh, c.end_wh, c.added_wh, c.avg_w, c.range_added_m, c.fix) == (None,) * 6
    assert c.duration_s == 3600


def test_no_battery_before_start_gives_null_energy():
    samples = [s(0, "plugged", True), s(1_000_000, "battery_wh", 30000), s(3_600_000, "battery_wh", 50000),
               s(3_600_000, "plugged", False)]
    (c,) = charges(samples)
    assert (c.start_wh, c.end_wh, c.added_wh, c.avg_w) == (None,) * 4


def test_open_charge_ends_when_a_trip_starts():
    samples = [s(0, "plugged", True), s(0, "battery_wh", 30000), s(3_000_000, "battery_wh", 40000),
               s(3_600_000, "gear", 1.0), s(3_601_000, "speed", 10.0), s(3_602_000, "battery_wh", 39900)]  # the unplug was missed
    (c,) = charges(samples)
    assert (c.start, c.end, c.added_wh) == (0, 3_601_000, 10000)
    assert charges([*samples, s(3_700_000, "plugged", False)]) == [c]  # a late unplug changes nothing


def test_charge_not_ended_by_standing_still_or_speed_in_park():
    samples = [s(0, "plugged", True), s(0, "gear", 4.0), s(0, "battery_wh", 30000), s(10_000, "speed", 0.0),
               s(20_000, "speed", 5.0), s(50_000, "battery_wh", 40000)]  # 0 m/s is standing, 5 m/s in P is no trip
    (c,) = charges(samples)
    assert c.end is None and c.added_wh == 10000


def test_seed_gear_decides_whether_speed_starts_a_trip():
    samples = [s(1000, "battery_wh", 30500), s(2000, "battery_wh", 31000), s(2000, "speed", 5.0)]
    assert charges(samples, {"plugged": True, "gear": 4.0})[0].end is None
    assert charges(samples, {"plugged": True, "gear": 1.0})[0].end == 2000


def test_session_ended_at_its_own_start_is_dropped():
    # a stale plugged flag reopens a session at the first sample after a trip; when that sample is the next trip's start
    assert charges([s(2000, "speed", 5.0)], {"plugged": True, "gear": 1.0}) == []


def test_keys_cover_what_the_charge_derivation_reads():
    samples = sorted([*session(), s(5, "gps", [9.0, 9.0, 5, 0, 0, 0]), s(3_000, "gear", 4.0), s(3_000, "speed", 3.0), s(7, "soc", 50.0),
                      s(8, "outside_temp", 7.0), s(9, "ignition", 4.0)], key=lambda x: (x.t, x.seq))
    assert find_charges([x for x in samples if x.k in KEYS], {}) == find_charges(samples, {}) != []
