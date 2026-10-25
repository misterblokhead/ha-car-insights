import json
import logging

import pytest

from car_insights import ha_mqtt
from car_insights.db import connect
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt


def trip(start, **kw):
    w = {"start": start, "end": start + 600, "from": "A", "to": "B", "distance_m": 1200.0, "net_wh": 500.0}
    return {**w, **kw}


@pytest.fixture
def env():
    conn = connect(":memory:")
    mqtt = FakeMqtt()
    return conn, mqtt, TripSensors(conn, mqtt, lambda vid: 57_000.0)


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
    ts = TripSensors(conn, mqtt, lambda vid: 57_000.0, cost=lambda kind, vid, row: 1.234)
    c = {"start": 1000, "end": 4600, "added_wh": 12000.0}
    ts.publish("car1", trip(1000), c, [trip(1000)], [c])
    for leaf in ("last_trip_cost", "last_charge_cost"):
        cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == f"homeassistant/sensor/car1_{leaf}/config"))
        assert cfg["device_class"] == "monetary" and cfg["unit_of_measurement"] == "EUR" and "state_class" not in cfg
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["cost"] == 1.23 and mqtt.on("car_insights/car1/last_charge")[0][0]["cost"] == 1.23
    assert mqtt.on("car_insights/car1/trip_event")[0][0]["cost"] == 1.23 and mqtt.on("car_insights/car1/charge_event")[0][0]["cost"] == 1.23


def test_failing_cost_gives_null_and_still_publishes(env, caplog):
    conn, mqtt, _ = env

    def boom(kind, vid, row):
        raise RuntimeError("no price")
    ts = TripSensors(conn, mqtt, lambda vid: 57_000.0, cost=boom)
    with caplog.at_level(logging.ERROR):
        ts.publish("car1", trip(1000), None, [trip(1000)], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["cost"] is None and mqtt.on("car_insights/car1/trip_event")[0][0]["cost"] is None
    assert "cost of trip car1 at 1000 failed" in caplog.text


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
    c = {"start": 1000, "end": 4600, "place": "Home", "added_wh": 12000.0, "avg_w": 7000.0, "lat": 52.1, "lon": 5.2, "zone": "Work"}
    ts.publish("car1", None, c, [], [c])
    state = mqtt.on("car_insights/car1/last_charge")[0][0]
    assert state["added_kwh"] == 12.0 and state["avg_power_kw"] == 7.0 and state["place"] == "Home"
    ev = mqtt.on("car_insights/car1/charge_event")[0][0]
    assert ev["event_type"] == "ended" and ev["place"] == "Home"
    assert not {"lat", "lon", "zone"} & ev.keys()  # the exact GPS point stays out of the event
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
    devs = [json.loads(p)["device"] for t, p, _ in mqtt.msgs if t.startswith("homeassistant/") and p]
    assert devs and all(d == ha_mqtt.device("car1", "Test car", "Acme", None) for d in devs)


def test_energy_sensors_have_no_state_class(env):
    _, mqtt, ts = env
    ts.publish("car1", trip(1000), None, [trip(1000)], [])
    cfgs = {t: json.loads(p) for t, p, _ in mqtt.msgs if t.startswith("homeassistant/sensor/") and p}
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


def test_curve_sensors_are_removed(env):
    _, mqtt, ts = env
    c = {"start": 1000, "end": 4600, "added_wh": 12000.0}
    ts.publish("car1", trip(1000), c, [], [])
    ts.publish("car1", trip(2000), c, [], [])
    gone = [f"homeassistant/sensor/car1_last_{k}_curve/config" for k in ("trip", "charge")] + [
        f"car_insights/car1/last_{k}_curve{leaf}" for k in ("trip", "charge") for leaf in ("_state", "")]
    for t in gone:
        assert [p for topic, p, _ in mqtt.msgs if topic == t] == [""]  # one empty retained payload, once per vehicle
    assert {r for t, _, r in mqtt.msgs if t in gone} == {True}
