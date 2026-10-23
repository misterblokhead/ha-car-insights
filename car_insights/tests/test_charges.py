import pytest

from car_insights.charges import KEYS, find_charges
from conftest import ms, s


def charges(samples, seed=None, **kw):
    samples = sorted(samples, key=lambda x: (x.t, x.seq))
    return find_charges(samples, seed or {}, **kw)


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


# --- cloud source (2026-10-23: the car slept through a 09:13-11:21 AC charge, only the cloud saw it) ---
def at(hms):
    return ms(f"2026-10-23T{hms}+02:00")


def day(*extra):
    """the car's samples around the sleep, the cloud's charging span, and the drive that woke the car"""
    return [s(at("09:09:35"), "battery_wh", 22_500), s(at("09:09:40"), "gear", 4),
            s(at("09:13:32"), "charging_state", True), s(at("09:13:32"), "soc_percent", 40),
            s(at("11:21:29"), "soc_percent", 81), s(at("11:21:29"), "charging_state", False), *extra]


WAKE = [s(at("16:14:43"), "battery_wh", 46_550), s(at("16:15:00"), "gear", 1), s(at("16:15:00"), "speed", 5.0)]


def test_cloud_session_car_asleep():
    [c] = charges(day(*WAKE), cloud=True)
    assert (c.start, c.end) == (at("09:13:32"), at("11:21:29"))
    assert (c.start_wh, c.end_wh, c.added_wh) == (22_500, 46_550, 24_050)
    assert c.energy_source == "car" and c.times_source == "cloud"
    assert round(c.avg_w) == 11_278


def test_estimate_until_car_wakes():
    [c] = charges(day(), cloud=True, capacity_wh=60_000)
    assert c.added_wh == 24_600 and c.end_wh is None and c.start_wh == 22_500 and c.energy_source == "soc_estimate"
    assert round(c.avg_w) == 11_536  # an estimate has a power too


def test_no_cloud_flag_ignores_charging_state():
    assert charges(day(*WAKE)) == []


def test_car_charges_are_car_marked():
    (c,) = charges(session())
    assert (c.times_source, c.energy_source) == ("car", "car")
    assert charges([s(0, "plugged", True), s(3_600_000, "plugged", False)])[0].energy_source is None


def test_car_plug_snaps_bounds():
    car = [s(at("09:10:32"), "plugged", True), s(at("11:19:29"), "plugged", False),
           s(at("11:19:00"), "battery_wh", 46_550), s(at("16:14:43"), "battery_wh", 47_000)]  # car-timed end: not the later reading
    [c] = charges(day(*car), cloud=True)
    assert (c.start, c.end) == (at("09:10:32"), at("11:19:29"))
    assert c.times_source == "car" and c.energy_source == "car" and c.added_wh == 24_050


def test_only_one_car_bound_snapped_stays_cloud_timed():
    car = [s(at("09:10:32"), "plugged", True), s(at("16:14:43"), "battery_wh", 46_550)]
    [c] = charges(day(*car), cloud=True)
    assert (c.start, c.end) == (at("09:10:32"), at("11:21:29"))
    assert c.times_source == "cloud" and c.added_wh == 24_050  # the end is cloud-timed: first reading after it


def test_car_plug_too_early_does_not_snap():
    car = [s(at("09:02:00"), "plugged", True), s(at("09:08:00"), "plugged", False)]  # 11 and 5 min before: out of reach / not overlapping
    cs = charges(day(*car, *WAKE), cloud=True)
    assert [(c.start, c.times_source) for c in cs] == [(at("09:02:00"), "car"), (at("09:13:32"), "cloud")]


def test_car_span_far_from_cloud_stays_separate():
    car = [s(at("06:00:00"), "plugged", True), s(at("06:00:00"), "battery_wh", 10_000),
           s(at("06:30:00"), "battery_wh", 20_000), s(at("06:30:00"), "plugged", False)]
    early, cloud = charges(day(*car, *WAKE), cloud=True)
    assert (early.start, early.end, early.added_wh, early.times_source) == (at("06:00:00"), at("06:30:00"), 10_000, "car")
    assert (cloud.start, cloud.added_wh, cloud.times_source) == (at("09:13:32"), 24_050, "cloud")  # its start reading is the car's latest, 22 500


def two_spans(*between):
    return [s(at("09:09:35"), "battery_wh", 22_500),
            s(at("09:13:32"), "charging_state", True), s(at("09:13:32"), "soc_percent", 40),
            s(at("10:00:00"), "charging_state", False), s(at("10:00:00"), "soc_percent", 60),
            s(at("10:30:00"), "charging_state", True),
            s(at("11:21:29"), "soc_percent", 81), s(at("11:21:29"), "charging_state", False), *between]


def test_two_cloud_spans_without_car_sample_merge():
    [c] = charges(two_spans(*WAKE), cloud=True)
    assert (c.start, c.end, c.added_wh) == (at("09:13:32"), at("11:21:29"), 24_050)  # not 24 050 twice


def test_two_cloud_spans_with_car_sample_between_stay_two():
    a, b = charges(two_spans(s(at("10:15:00"), "battery_wh", 30_000), *WAKE), cloud=True)
    assert (a.end, a.added_wh) == (at("10:00:00"), 7_500)
    assert (b.start, b.added_wh) == (at("10:30:00"), 16_550)


def test_stale_cloud_session_closes_at_trip_start():
    stale = [s(at("09:09:35"), "battery_wh", 22_500), s(at("09:09:40"), "gear", 4),
             s(at("09:13:32"), "charging_state", True), s(at("09:13:32"), "soc_percent", 40),
             s(at("10:00:00"), "soc_percent", 55), s(at("16:15:00"), "gear", 1), s(at("16:15:00"), "speed", 5.0)]
    [c] = charges(stale, cloud=True)  # the cloud never said False; the later False cannot reopen or lengthen it
    assert (c.start, c.end) == (at("09:13:32"), at("16:15:00"))
    assert c.energy_source == "soc_estimate" and c.added_wh == 9_000
    assert charges([*stale, s(at("17:00:00"), "charging_state", False)], cloud=True)[0] == c


def test_cloud_seed_opens_a_span_at_the_first_sample():
    samples = [s(1000, "battery_wh", 30_000), s(3_601_000, "battery_wh", 50_000), s(3_601_000, "charging_state", False)]
    [c] = charges(samples, {"charging_state": True}, cloud=True)
    assert (c.start, c.end, c.added_wh) == (1000, 3_601_000, 20_000)


def test_open_cloud_session():
    [c] = charges([s(0, "charging_state", True), s(0, "battery_wh", 30_000), s(0, "soc_percent", 50),
                   s(600_000, "battery_wh", 35_000)], cloud=True)
    assert c.end is None and c.end_wh == 35_000 and c.added_wh == 5_000 and c.energy_source == "car"


def test_estimate_not_discarded_but_small_car_delta_is():
    small = [s(at("09:09:35"), "battery_wh", 22_500), s(at("09:13:32"), "charging_state", True),
             s(at("11:21:29"), "charging_state", False), s(at("16:14:43"), "battery_wh", 22_550)]
    assert charges(small, cloud=True) == []
    flat = [s(at("09:09:35"), "battery_wh", 22_500), s(at("09:13:32"), "charging_state", True), s(at("09:13:32"), "soc_percent", 40),
            s(at("11:21:29"), "soc_percent", 40), s(at("11:21:29"), "charging_state", False)]  # 0 Wh by SoC: kept, there is no car value
    [c] = charges(flat, cloud=True)
    assert c.added_wh == 0 and c.energy_source == "soc_estimate"


def test_cloud_range_added_follows_car_values_only():
    car = [s(at("09:09:35"), "range_m", 100_000), s(at("16:14:43"), "range_m", 200_000), *WAKE]
    [c] = charges(day(*car), cloud=True)
    assert c.range_added_m == 100_000
    assert charges(day(), cloud=True)[0].range_added_m is None
