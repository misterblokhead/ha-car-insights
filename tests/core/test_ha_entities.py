from datetime import datetime, timezone

import pytest

from custom_components.car_insights.core.ha_entities import (
    CAR_APP_IGNORED, IGNITION_OFF, IGNITION_ON, LEGACY, READINGS, REPORT_STAMPED, REQUIRED, parse_history, to_samples)
from conftest import ms

T0 = ms("2026-10-23T09:14:14+02:00")


def iso(t: int) -> str:
    return datetime.fromtimestamp(t / 1000, timezone.utc).isoformat()


CHG = "sensor.ss_charge_state"
ACT = "sensor.ss_last_battery_activity"
ENT = {"charging": CHG, "charge_level": "sensor.ss_battery", "odometer": "sensor.ss_mileage",
       "plugged": "sensor.ss_plug_state", "report_time": ACT}
UNITS = {"sensor.ss_battery": "%", "sensor.ss_mileage": "km"}


def rows(*r):
    return [(t, s, None) for t, s in r]


def samples(h, cursor=None, entities=ENT):
    return to_samples(entities, UNITS, h, cursor or {})


def test_tables():
    assert REQUIRED == ("charge_level", "odometer")
    assert REPORT_STAMPED == {"charge_level", "charging"}
    assert "report_time" in READINGS and READINGS["report_time"].key is None
    assert CAR_APP_IGNORED == {"speed", "location", "ignition", "battery_energy", "range"}
    assert LEGACY["renault"]["odometer"] == "sensor.{stem}_mileage"


def test_report_time_replaces_poll_time():
    h = {CHG: rows((ms("2026-10-23T09:14:14.044319+02:00"), "charge_in_progress"),
                    (ms("2026-10-23T11:26:14.066511+02:00"), "charge_ended")),
         ACT: rows((ms("2026-10-23T09:14:14.044618+02:00"), "2026-10-23T07:13:32+00:00"),
                   (ms("2026-10-23T11:26:14.066801+02:00"), "2026-10-23T09:21:29+00:00"))}
    out, cur, bad = samples(h)
    assert out == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", True), (ms("2026-10-23T11:21:29+02:00"), "charging_state", False)]
    assert cur[CHG] == ms("2026-10-23T11:26:14.066511+02:00") and bad == []


def test_soc_uses_report_time_too():
    h = {"sensor.ss_battery": rows((ms("2026-10-23T09:14:14+02:00"), "82")),
         ACT: rows((ms("2026-10-23T09:14:14.5+02:00"), "2026-10-23T07:13:32+00:00"))}
    assert samples(h)[0] == [(ms("2026-10-23T09:13:32+02:00"), "soc_percent", 82.0)]


def test_odometer_is_not_stamped():
    h = {"sensor.ss_mileage": rows((T0, "36979.0")), ACT: rows((T0, "2026-10-23T07:13:32+00:00"))}
    assert samples(h)[0] == [(T0, "odometer_km", 36979.0)]


def test_no_report_time_entity_means_poll_time():
    h = {CHG: rows((T0, "charge_ended")), ACT: rows((T0, "2026-10-23T07:13:32+00:00"))}
    assert samples(h, entities={"charging": CHG})[0] == [(T0, "charging_state", False)]


def test_stale_report_time_falls_back_to_poll_time():
    h = {CHG: rows((T0, "charge_in_progress")), ACT: rows((T0, "2026-10-23T06:34:14+00:00"))}  # 40 min older
    assert samples(h)[0] == [(T0, "charging_state", True)]
    h[ACT] = rows((T0, "2026-10-23T06:44:14+00:00"))  # exactly 30 min: still used
    assert samples(h)[0] == [(T0 - 1_800_000, "charging_state", True)]


def test_report_time_from_the_future_or_missing_falls_back():
    assert samples({CHG: rows((T0, "charge_ended")), ACT: rows((T0, "2026-10-23T07:14:15+00:00"))})[0] == [(T0, "charging_state", False)]
    assert samples({CHG: rows((T0, "charge_ended"))})[0] == [(T0, "charging_state", False)]
    for bad in ("unavailable", "garbage", "2026-10-23T07:13:32"):
        assert samples({CHG: rows((T0, "charge_ended")), ACT: rows((T0, bad))})[0] == [(T0, "charging_state", False)]


def test_report_row_must_be_within_5s_after_the_row():
    rep = "2026-10-23T07:13:32+00:00"
    assert samples({CHG: rows((T0, "charge_ended")), ACT: rows((T0 + 5001, rep))})[0] == [(T0, "charging_state", False)]
    assert samples({CHG: rows((T0, "charge_ended")), ACT: rows((T0 + 5000, rep))})[0] == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", False)]


def test_newest_report_row_not_after_the_cutoff_wins():
    h = {CHG: rows((T0, "charge_ended")),
         ACT: rows((T0 - 60_000, "2026-10-23T07:10:00+00:00"), (T0 + 100, "2026-10-23T07:13:32+00:00"), (T0 + 9_000, "2026-10-23T07:14:00+00:00"))}
    assert samples(h)[0] == [(ms("2026-10-23T09:13:32+02:00"), "charging_state", False)]


def test_unavailable_are_skipped_bad_rows_reported_and_cursor_moves():
    h = {"sensor.ss_battery": rows((1000, "unavailable"), (2000, "abc"), (3000, "unknown"), (4000, ""), (5000, "150"), (6000, "nan")),
         "sensor.ss_mileage": rows((1500, "unavailable")), CHG: rows((2500, "unknown"))}
    out, cur, bad = samples(h)
    assert out == [] and bad == [("sensor.ss_battery", "abc"), ("sensor.ss_battery", "150"), ("sensor.ss_battery", "nan")]
    assert cur["sensor.ss_battery"] == 6000 and cur["sensor.ss_mileage"] == 1500 and cur[CHG] == 2500


def test_rows_at_or_before_cursor_are_dropped():
    h = {"sensor.ss_mileage": rows((1000, "10"), (2000, "20"), (3000, "30"))}
    out, cur, _ = samples(h, {"sensor.ss_mileage": 2000})
    assert out == [(3000, "odometer_km", 30.0)] and cur["sensor.ss_mileage"] == 3000
    out, cur, _ = samples(h, cur)
    assert out == [] and cur["sensor.ss_mileage"] == 3000


def test_cursor_is_kept_for_entities_without_rows():
    assert samples({}, {"sensor.ss_mileage": 7})[1] == {"sensor.ss_mileage": 7}


def test_output_sorted_by_time_across_entities():
    h = {"sensor.ss_mileage": rows((3000, "1")), "sensor.ss_battery": rows((1000, "50"), (2000, "51"))}
    assert [x[0] for x in samples(h)[0]] == [1000, 2000, 3000]


def test_plug_states():
    h = {"sensor.ss_plug_state": rows((1000, "plugged"), (2000, "unplugged"), (3000, "unavailable"), (4000, "plug_error"))}
    out, cur, bad = samples(h)
    assert out == [(1000, "plug_state", True), (2000, "plug_state", False)]
    assert bad == [("sensor.ss_plug_state", "plug_error")] and cur["sensor.ss_plug_state"] == 4000


def test_parse_history_minimal_response():
    payload = [[{"entity_id": "sensor.ss_battery", "state": "80", "last_changed": "2026-10-23T07:13:32.500000+00:00"},
                {"state": "81", "last_changed": "2026-10-23T07:20:00+00:00"}],
               [],
               [{"entity_id": "sensor.ss_mileage", "state": "unavailable", "last_changed": "2026-10-23T07:13:32+00:00"}]]
    assert parse_history(payload) == {
        "sensor.ss_battery": [(ms("2026-10-23T09:13:32.5+02:00"), "80", None), (ms("2026-10-23T09:20:00+02:00"), "81", None)],
        "sensor.ss_mileage": [(ms("2026-10-23T09:13:32+02:00"), "unavailable", None)]}


def test_units_convert_to_sample_units():
    assert READINGS["odometer"].convert("100", "mi", None) == pytest.approx(160.9344)
    assert READINGS["odometer"].convert("2500", "m", None) == 2.5
    assert READINGS["speed"].convert("36", "km/h", None) == pytest.approx(10.0)
    assert READINGS["speed"].convert("10", "mph", None) == pytest.approx(4.4704)
    assert READINGS["battery_energy"].convert("41.5", "kWh", None) == 41500
    assert READINGS["range"].convert("250", "km", None) == 250_000


def test_unknown_unit_and_out_of_range_are_no_reading():
    for r, s, u in [("odometer", "5", "furlong"), ("charge_level", "101", "%"), ("odometer", "-1", "km"), ("speed", "nan", "km/h")]:
        with pytest.raises(ValueError):
            READINGS[r].convert(s, u, None)


def test_binary_and_enum_states():
    assert READINGS["charging"].convert("charge_in_progress", None, None) is True
    assert READINGS["charging"].convert("not_in_charge", None, None) is False
    assert READINGS["plugged"].convert("on", None, None) is True
    with pytest.raises(ValueError):
        READINGS["plugged"].convert("plug_error", None, None)
    assert READINGS["ignition"].convert("on", None, None) == IGNITION_ON == 4
    assert READINGS["ignition"].convert("off", None, None) == IGNITION_OFF == 2


def test_location_from_attributes():
    assert READINGS["location"].convert("not_home", None, {"latitude": 50.1, "longitude": 8.6, "gps_accuracy": 12}) == [50.1, 8.6, 12]
    assert READINGS["location"].convert("home", None, {"latitude": 50.1, "longitude": 8.6}) == [50.1, 8.6, 0]
    with pytest.raises(ValueError):
        READINGS["location"].convert("not_home", None, {"latitude": None, "longitude": 8.6})


def test_attribute_rows_are_timed_by_last_updated():
    payload = [[{"entity_id": "device_tracker.invented", "state": "not_home", "last_changed": iso(T0),
                 "last_updated": iso(T0 + 60_000), "attributes": {"latitude": 50.1, "longitude": 8.6}}]]
    assert parse_history(payload)["device_tracker.invented"][0][0] == T0 + 60_000


def test_to_samples_reports_bad_rows_and_skips_unknown():
    hist = {"sensor.invented_soc": [(T0, "unknown", None), (T0 + 1, "abc", None), (T0 + 2, "55", None)]}
    samples_, cur, bad = to_samples({"charge_level": "sensor.invented_soc"}, {"sensor.invented_soc": "%"}, hist, {})
    assert samples_ == [(T0 + 2, "soc_percent", 55.0)] and bad == [("sensor.invented_soc", "abc")] and cur["sensor.invented_soc"] == T0 + 2
