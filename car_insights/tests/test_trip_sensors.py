import json
import logging

import pytest

from car_insights import live
from car_insights.db import connect
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt


def trip(start, **kw):
    w = {"start": start, "end": start + 600, "from": "A", "to": "B", "distance_m": 1200.0, "net_wh": 500.0}
    return {**w, **kw}


SERIES = {"cols": ["t", "km"], "rows": [[1000, 0.0], [2000, 0.5]]}


@pytest.fixture
def env():
    conn = connect(":memory:")
    mqtt = FakeMqtt()
    return conn, mqtt, TripSensors(conn, mqtt, lambda vid: 57_000.0, lambda kind, vid, start: SERIES)


def test_discovery_once_then_state(env):
    conn, mqtt, ts = env
    for s in (1000, 2000):
        ts.publish("car1", trip(s), None, [trip(s)], [])
    cfg_topics = [t for t, _, _ in mqtt.msgs if t.startswith("homeassistant/")]
    assert len(cfg_topics) == len(set(cfg_topics)) and "homeassistant/sensor/car1_last_trip_distance/config" in cfg_topics
    state, retained = mqtt.on("car_insights/car1/last_trip")[-1]
    assert retained and state["distance_km"] == 1.2 and state["net_kwh"] == 0.5 and state["consumption"] == 41.67


def test_cost_sensor_and_event(env):
    conn, mqtt, _ = env
    ts = TripSensors(conn, mqtt, lambda vid: 57_000.0, lambda kind, vid, start: SERIES, cost=lambda kind, vid, row: 1.234)
    c = {"start": 1000, "end": 4600, "added_wh": 12000.0}
    ts.publish("car1", trip(1000), c, [trip(1000)], [c])
    for leaf in ("last_trip_cost", "last_charge_cost"):
        cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == f"homeassistant/sensor/car1_{leaf}/config"))
        assert cfg["device_class"] == "monetary" and cfg["unit_of_measurement"] == "EUR" and "state_class" not in cfg
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["cost"] == 1.23 and mqtt.on("car_insights/car1/last_charge")[0][0]["cost"] == 1.23
    assert mqtt.on("car_insights/car1/trip_event")[0][0]["cost"] == 1.23 and mqtt.on("car_insights/car1/charge_event")[0][0]["cost"] == 1.23


def test_cost_defaults_to_null(env):
    _, mqtt, ts = env
    ts.publish("car1", trip(1000), None, [trip(1000)], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["cost"] is None and mqtt.on("car_insights/car1/trip_event")[0][0]["cost"] is None


def test_event_not_retained_per_trip(env):
    _, mqtt, ts = env
    ended = [trip(1000), trip(3000)]
    ts.publish("car1", ended[-1], None, ended, [])
    ev = mqtt.on("car_insights/car1/trip_event")
    assert len(ev) == 2 and all(not r and e["event_type"] == "ended" for e, r in ev)


def test_null_values_published_as_null(env):
    _, mqtt, ts = env
    t = trip(1000, net_wh=None)
    ts.publish("car1", t, None, [t], [])
    state = mqtt.on("car_insights/car1/last_trip")[0][0]
    assert state["net_kwh"] is None and state["consumption"] is None


def test_short_trip_has_no_consumption(env):
    _, mqtt, ts = env
    t = trip(1000, distance_m=50.0)
    ts.publish("car1", t, None, [t], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["consumption"] is None


def test_charge_state_and_event(env):
    _, mqtt, ts = env
    c = {"start": 1000, "end": 4600, "place": "Home", "added_wh": 12000.0, "avg_w": 7000.0}
    ts.publish("car1", None, c, [], [c])
    state = mqtt.on("car_insights/car1/last_charge")[0][0]
    assert state["added_kwh"] == 12.0 and state["avg_power_kw"] == 7.0 and state["place"] == "Home"
    assert mqtt.on("car_insights/car1/charge_event")[0][0]["event_type"] == "ended"
    assert mqtt.on("car_insights/car1/last_trip") == []


def test_state_is_the_given_newest_events_are_the_ended(env):
    _, mqtt, ts = env
    a, b = trip(1000, distance_m=1000.0), trip(5000, distance_m=2000.0)
    ts.publish("car1", b, None, [a], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 2.0
    assert mqtt.on("car_insights/car1/trip_event")[0][0]["distance_m"] == 1000.0


def test_same_device_as_live(env):
    conn, mqtt, ts = env
    conn.execute("INSERT INTO vehicles(vehicle_id, name, meta_json) VALUES('car1','x',?)", (json.dumps({"vehicle_name": "Test car", "make": "Acme"}),))
    ts.publish("car1", trip(1000), None, [trip(1000)], [])
    devs = [json.loads(p)["device"] for t, p, _ in mqtt.msgs if t.startswith("homeassistant/")]
    assert devs and all(d == live.device("car1", "Test car", "Acme", None) for d in devs)


def test_energy_sensors_have_no_state_class(env):
    _, mqtt, ts = env
    ts.publish("car1", trip(1000), None, [trip(1000)], [])
    cfgs = {t: json.loads(p) for t, p, _ in mqtt.msgs if t.startswith("homeassistant/sensor/")}
    energy = [c for c in cfgs.values() if c.get("device_class") == "energy"]
    assert energy and all("state_class" not in c for c in energy)
    assert cfgs["homeassistant/sensor/car1_last_trip_consumption/config"]["device_class"] == "energy_distance"
    assert cfgs["homeassistant/sensor/car1_last_trip_distance/config"]["state_class"] == "measurement"


def test_discovery_topics_and_templates(env):
    _, mqtt, ts = env
    ts.publish("car1", trip(1000), None, [trip(1000)], [])
    cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == "homeassistant/sensor/car1_last_trip_net/config"))
    assert cfg["unique_id"] == "car_insights_car1_last_trip_net" and cfg["state_topic"] == "car_insights/car1/last_trip"
    assert cfg["json_attributes_topic"] == "car_insights/car1/last_trip" and cfg["value_template"] == "{{ value_json.net_kwh }}"
    ev = json.loads(next(p for t, p, _ in mqtt.msgs if t == "homeassistant/event/car1_trip/config"))
    assert ev["state_topic"] == "car_insights/car1/trip_event" and ev["event_types"] == ["ended"]


def test_nothing_published_for_nothing_closed(env):
    _, mqtt, ts = env
    ts.publish("car1", None, None, [], [])
    assert mqtt.msgs == []


def test_state_without_events_for_old_closes(env):
    _, mqtt, ts = env
    ts.publish("car1", trip(1000), {"start": 5, "end": 9, "added_wh": 1000.0}, [], [])
    assert mqtt.on("car_insights/car1/trip_event") == [] and mqtt.on("car_insights/car1/charge_event") == []
    assert mqtt.on("car_insights/car1/last_trip") and mqtt.on("car_insights/car1/last_charge")


def test_charge_state_carries_source_markers(env):
    _, mqtt, ts = env
    c = {"start": 1000, "end": 4600, "added_wh": 12000.0, "times_source": "cloud", "energy_source": "soc_estimate"}
    ts.publish("car1", None, c, [], [c])
    state = mqtt.on("car_insights/car1/last_charge")[0][0]
    assert state["times_source"] == "cloud" and state["energy_source"] == "soc_estimate"


def test_trip_state_carries_odometer(env):
    _, mqtt, ts = env
    t = trip(1000, odometer_start_km=36979.0, odometer_end_km=36985.5)
    ts.publish("car1", t, None, [t], [])
    state = mqtt.on("car_insights/car1/last_trip")[0][0]
    assert state["odometer_start_km"] == 36979.0 and state["odometer_end_km"] == 36985.5
    ts.publish("car1", trip(2000), None, [], [])
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["odometer_start_km"] is None


def test_curve_published_with_series(env):
    _, mqtt, ts = env
    c = {"start": 1000, "end": 4600, "added_wh": 12000.0}
    ts.publish("car1", trip(1000), c, [], [])
    for kind in ("trip", "charge"):
        assert mqtt.on(f"car_insights/car1/last_{kind}_curve") == [(SERIES, True)]
        assert ("car_insights/car1/last_%s_curve_state" % kind, "1970-01-01T00:00:01+00:00", True) in mqtt.msgs
        cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == f"homeassistant/sensor/car1_last_{kind}_curve/config"))
        assert cfg["device_class"] == "timestamp" and "state_class" not in cfg and "unit_of_measurement" not in cfg
        assert cfg["state_topic"] == f"car_insights/car1/last_{kind}_curve_state"
        assert cfg["json_attributes_topic"] == f"car_insights/car1/last_{kind}_curve"
        assert cfg["unique_id"] == f"car_insights_car1_last_{kind}_curve" and cfg["name"] == f"Last {kind} curve"


def test_curve_over_16kb_publishes_empty_and_warns(caplog):
    conn, mqtt = connect(":memory:"), FakeMqtt()
    big = {"cols": ["t"], "rows": [[i * 1.123456] for i in range(3000)]}
    ts = TripSensors(conn, mqtt, lambda vid: 57_000.0, lambda kind, vid, start: big)
    with caplog.at_level(logging.WARNING):
        ts.publish("car1", trip(1000), None, [], [])
    assert mqtt.on("car_insights/car1/last_trip_curve") == [({}, True)]
    assert [r for r in caplog.records if r.levelno == logging.WARNING and "curve" in r.message] and len(caplog.records) == 1
    assert ("car_insights/car1/last_trip_curve_state", "1970-01-01T00:00:01+00:00", True) in mqtt.msgs  # the state still follows


def test_curve_without_stored_series_is_empty(env):
    conn, mqtt, _ = env
    ts = TripSensors(conn, mqtt, lambda vid: 57_000.0, lambda kind, vid, start: None)
    ts.publish("car1", trip(1000), None, [], [])
    assert mqtt.on("car_insights/car1/last_trip_curve") == [({}, True)]


def test_percent_added_uses_capacity(env):
    _, mqtt, ts = env
    ts.publish("car1", None, {"start": 1000, "end": 4600, "added_wh": 24_050.0}, [], [])
    assert mqtt.on("car_insights/car1/last_charge")[0][0]["added_percent"] == 42.2
    cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == "homeassistant/sensor/car1_last_charge_percent/config"))
    assert cfg["name"] == "Last charge percentage" and cfg["unit_of_measurement"] == "%" and cfg["value_template"] == "{{ value_json.added_percent }}"
    assert cfg["state_topic"] == "car_insights/car1/last_charge" and "device_class" not in cfg


def test_percent_added_null_without_energy(env):
    _, mqtt, ts = env
    ts.publish("car1", None, {"start": 1000, "end": 4600, "added_wh": None}, [], [])
    assert mqtt.on("car_insights/car1/last_charge")[0][0]["added_percent"] is None
