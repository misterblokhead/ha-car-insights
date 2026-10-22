import json

import pytest

from car_insights.live import FIELDS, LiveState, apply, discovery_messages, location, snapshot, state_message, location_message
from car_insights.protocol import Sample


def st(**vals):
    return LiveState(values={k: (1, v) for k, v in vals.items()})


def test_newer_wins():
    s = LiveState()
    apply(s, [Sample(2, 200, "speed", 5.0)], 300)
    apply(s, [Sample(1, 100, "speed", 9.0)], 300)
    assert s.values["speed"] == (200, 5.0)


def test_future_samples_ignored_for_live():
    s = LiveState()
    assert apply(s, [Sample(1, 10**13, "speed", 5.0), Sample(2, 1, "speed", 1.0)], 1_000) == (True, 1)
    assert s.values == {"speed": (1, 1.0)}


def test_meta_and_gap_ignored():
    assert apply(LiveState(), [Sample(1, 1, "meta", {}), Sample(2, 1, "gap", 1)], 10) == (False, 0)


def test_soc_from_capacity():
    assert snapshot(st(battery_wh=33900.0), 60000.0)["soc"] == 56.5


@pytest.mark.parametrize("vals,status", [
    ({"gear": 4, "speed": 0.0, "plugged": False}, "parked"),
    ({"gear": 8}, "driving"),
    ({"speed": -2.0}, "driving"),
    ({"gear": 4, "plugged": True, "power": 7000.0}, "charging"),
    ({"gear": 4, "plugged": True, "power": 0.0}, "parked"),
])
def test_status(vals, status):
    assert snapshot(st(**vals), 60000.0)["status"] == status


def test_mode_overrides_derivation():
    assert snapshot(st(mode="charging", gear=4, plugged=True, power=0.0), 1.0)["status"] == "charging"
    assert snapshot(st(mode="parked", speed=5.0), 1.0)["status"] == "parked"
    assert snapshot(st(mode="driving"), 1.0)["status"] == "driving"


def test_stale_mode_does_not_beat_newer_inputs():
    state = LiveState(values={"mode": (1, "parked"), "gear": (5, 8)})
    assert snapshot(state, 1.0)["status"] == "driving"
    state = LiveState(values={"mode": (9, "charging"), "gear": (5, 4), "plugged": (5, True), "speed": (20, 0.0), "power": (20, 0.0)})
    assert snapshot(state, 1.0)["status"] == "charging"  # high-rate speed newer than mode must not override


def test_invalid_mode_ignored():
    s = LiveState()
    assert apply(s, [Sample(1, 1, "mode", "charging"), Sample(2, 2, "mode", "flying"), Sample(3, 3, "mode", 7)], 10) == (True, 0)
    assert s.values == {"mode": (1, "charging")}
    assert snapshot(st(mode="bogus", gear=8), 1.0)["status"] == "driving"


def test_snapshot_omits_missing_fields():
    snap = snapshot(st(speed=1.0), 60000.0)
    assert "power_kw" not in snap and "soc" not in snap and "last_seen" in snap


def test_non_finite_omitted():
    snap = snapshot(st(power=float("inf"), speed="x", plugged=True), 60000.0)
    assert "power_kw" not in snap and "speed_kmh" not in snap and snap["status"] == "parked"


def test_status_needs_input():
    assert "status" not in snapshot(st(power=1.0), 60000.0)


def test_speed_kmh_abs():
    assert snapshot(st(speed=-10.0), 1.0)["speed_kmh"] == 36.0


def test_location():
    assert location(st(gps=[1.5, 2.5, 8.0, 0, 0, 0])) == {"latitude": 1.5, "longitude": 2.5, "gps_accuracy": 8.0}
    assert location(st(gps=[1.5])) is None and location(st(gps="x")) is None and location(LiveState()) is None


def test_discovery_only_present_fields():
    msgs = discovery_messages("car1", "Test car", "Make", "M", {"speed_kmh", "plugged"})
    assert sorted(m[0] for m in msgs) == ["homeassistant/binary_sensor/car1_plugged/config", "homeassistant/sensor/car1_speed_kmh/config"]
    cfg = json.loads(next(m[1] for m in msgs if "speed_kmh" in m[0]))
    assert cfg["unique_id"] == "car_insights_car1_speed_kmh"
    assert cfg["state_topic"] == "car_insights/car1/state"
    assert cfg["device"]["name"] == "Test car"
    assert cfg["state_class"] == "measurement"
    assert all(len(m) == 2 for m in msgs)
    assert cfg["name"] == "Speed"


def test_discovery_names_and_extras():
    cfgs = {m[0].split("/")[-2].split("_", 1)[1]: json.loads(m[1]) for m in discovery_messages("c", "T", None, None, set(FIELDS))}
    assert {f: c["name"] for f, c in cfgs.items()} == {
        "speed_kmh": "Speed", "soc": "State of charge", "battery_kwh": "Battery energy", "range_km": "Range", "power_kw": "Power",
        "outside_temp": "Outside temperature", "status": "Status", "last_seen": "Last seen", "plugged": "Plugged in", "location": "Location"}
    assert cfgs["status"]["options"] == ["driving", "charging", "parked"] and "state_class" not in cfgs["status"]
    assert "state_class" not in cfgs["last_seen"] and "state_class" not in cfgs["plugged"]
    assert (cfgs["plugged"]["payload_on"], cfgs["plugged"]["payload_off"]) == ("ON", "OFF")
    assert cfgs["soc"]["unit_of_measurement"] == "%" and cfgs["soc"]["device_class"] == "battery"
    assert "state_topic" not in cfgs["location"] and cfgs["location"]["source_type"] == "gps"


def test_tracker_discovery():
    msgs = discovery_messages("car1", "T", None, None, {"location"})
    assert msgs[0][0] == "homeassistant/device_tracker/car1_location/config"
    assert json.loads(msgs[0][1])["json_attributes_topic"] == "car_insights/car1/location"


def test_state_and_location_messages():
    assert state_message("c", {"a": 1}) == ("car_insights/c/state", '{"a": 1}')
    assert location_message("c", {"latitude": 1})[0] == "car_insights/c/location"


def test_device_omits_none_and_template_goes_unknown():
    cfg = json.loads(discovery_messages("c", "T", None, None, {"soc"})[0][1])
    assert "manufacturer" not in cfg["device"] and "model" not in cfg["device"]
    assert cfg["value_template"] == "{{ value_json.soc if 'soc' in value_json else None }}"


def test_soc_needs_finite_capacity():
    assert "soc" not in snapshot(st(battery_wh=1.0), float("inf"))
