from car_insights.source_b import RENAULT, MAPPINGS, entity_ids, parse_history, to_samples
from conftest import ms

CHG = "sensor.ss_charge_state"
ACT = "sensor.ss_last_battery_activity"


def test_report_time_replaces_poll_time():
    h = {"sensor.ss_charge_state": [(ms("2026-10-23T09:14:14.044319+02:00"), "charge_in_progress"),
                                   (ms("2026-10-23T11:26:14.066511+02:00"), "charge_ended")],
         "sensor.ss_last_battery_activity": [(ms("2026-10-23T09:14:14.044618+02:00"), "2026-10-23T07:13:32+00:00"),
                                            (ms("2026-10-23T11:26:14.066801+02:00"), "2026-10-23T09:21:29+00:00")]}
    out, cur = to_samples(RENAULT, "ss", h, {})
    assert out == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", True), (ms("2026-10-23T11:21:29+02:00"), "charging_state", False)]
    assert cur["sensor.ss_charge_state"] == ms("2026-10-23T11:26:14.066511+02:00")


def test_soc_uses_report_time_too():
    h = {"sensor.ss_battery": [(ms("2026-10-23T09:14:14+02:00"), "82")],
         ACT: [(ms("2026-10-23T09:14:14.5+02:00"), "2026-10-23T07:13:32+00:00")]}
    assert to_samples(RENAULT, "ss", h, {})[0] == [(ms("2026-10-23T09:13:32+02:00"), "soc_percent", 82.0)]


def test_stale_report_time_falls_back_to_poll_time():
    t = ms("2026-10-23T09:14:14+02:00")
    h = {CHG: [(t, "charge_in_progress")], ACT: [(t, "2026-10-23T06:34:14+00:00")]}  # 40 min older
    assert to_samples(RENAULT, "ss", h, {})[0] == [(t, "charging_state", True)]
    h[ACT] = [(t, "2026-10-23T06:44:14+00:00")]  # exactly 30 min: still used
    assert to_samples(RENAULT, "ss", h, {})[0] == [(t - 1_800_000, "charging_state", True)]


def test_report_time_from_the_future_or_missing_falls_back():
    t = ms("2026-10-23T09:14:14+02:00")
    assert to_samples(RENAULT, "ss", {CHG: [(t, "charge_ended")], ACT: [(t, "2026-10-23T07:14:15+00:00")]}, {})[0] == [(t, "charging_state", False)]
    assert to_samples(RENAULT, "ss", {CHG: [(t, "charge_ended")]}, {})[0] == [(t, "charging_state", False)]
    # unparseable or unavailable newest report row: no report time
    for bad in ("unavailable", "garbage", "2026-10-23T07:13:32"):
        assert to_samples(RENAULT, "ss", {CHG: [(t, "charge_ended")], ACT: [(t, bad)]}, {})[0] == [(t, "charging_state", False)]


def test_report_row_must_be_within_5s_after_the_row():
    t = ms("2026-10-23T09:14:14+02:00")
    rep = "2026-10-23T07:13:32+00:00"
    late = {CHG: [(t, "charge_ended")], ACT: [(t + 5001, rep)]}
    assert to_samples(RENAULT, "ss", late, {})[0] == [(t, "charging_state", False)]
    ok = {CHG: [(t, "charge_ended")], ACT: [(t + 5000, rep)]}
    assert to_samples(RENAULT, "ss", ok, {})[0] == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", False)]


def test_newest_report_row_not_after_the_cutoff_wins():
    t = ms("2026-10-23T09:14:14+02:00")
    h = {CHG: [(t, "charge_ended")],
         ACT: [(t - 60_000, "2026-10-23T07:10:00+00:00"), (t + 100, "2026-10-23T07:13:32+00:00"), (t + 9_000, "2026-10-23T07:14:00+00:00")]}
    assert to_samples(RENAULT, "ss", h, {})[0] == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", False)]


def test_unavailable_and_non_numeric_are_skipped_but_cursor_moves():
    h = {"sensor.ss_battery": [(1000, "unavailable"), (2000, "abc"), (3000, "unknown"), (4000, ""), (5000, "150"), (6000, "nan")],
         "sensor.ss_mileage": [(1500, "unavailable")], CHG: [(2500, "unknown")]}
    out, cur = to_samples(RENAULT, "ss", h, {})
    assert out == []
    assert cur["sensor.ss_battery"] == 6000 and cur["sensor.ss_mileage"] == 1500 and cur[CHG] == 2500


def test_rows_at_or_before_cursor_are_dropped():
    h = {"sensor.ss_mileage": [(1000, "10"), (2000, "20"), (3000, "30")]}
    out, cur = to_samples(RENAULT, "ss", h, {"sensor.ss_mileage": 2000})
    assert out == [(3000, "odometer_km", 30.0)] and cur["sensor.ss_mileage"] == 3000
    out, cur = to_samples(RENAULT, "ss", h, cur)
    assert out == [] and cur["sensor.ss_mileage"] == 3000


def test_cursor_is_kept_for_entities_without_rows():
    assert to_samples(RENAULT, "ss", {}, {"sensor.ss_mileage": 7})[1] == {"sensor.ss_mileage": 7}


def test_mileage_uses_last_changed():
    t = ms("2026-10-23T09:14:14+02:00")
    h = {"sensor.ss_mileage": [(t, "36979.0")], ACT: [(t, "2026-10-23T07:13:32+00:00")]}
    assert to_samples(RENAULT, "ss", h, {})[0] == [(t, "odometer_km", 36979.0)]


def test_output_sorted_by_time_across_entities():
    h = {"sensor.ss_mileage": [(3000, "1")], "sensor.ss_battery": [(1000, "50"), (2000, "51")]}
    assert [x[0] for x in to_samples(RENAULT, "ss", h, {})[0]] == [1000, 2000, 3000]


def test_parse_history_minimal_response():
    payload = [[{"entity_id": "sensor.ss_battery", "state": "80", "last_changed": "2026-10-23T07:13:32.500000+00:00"},
                {"state": "81", "last_changed": "2026-10-23T07:20:00+00:00"}],
               [],
               [{"entity_id": "sensor.ss_mileage", "state": "unavailable", "last_changed": "2026-10-23T07:13:32+00:00"}]]
    assert parse_history(payload) == {
        "sensor.ss_battery": [(ms("2026-10-23T09:13:32.5+02:00"), "80"), (ms("2026-10-23T09:20:00+02:00"), "81")],
        "sensor.ss_mileage": [(ms("2026-10-23T09:13:32+02:00"), "unavailable")]}


def test_entity_ids_renault():
    assert set(entity_ids(RENAULT, "ss")) == {"sensor.ss_charge_state", "sensor.ss_battery", "sensor.ss_mileage", "sensor.ss_last_battery_activity"}
    assert MAPPINGS["renault"] is RENAULT
