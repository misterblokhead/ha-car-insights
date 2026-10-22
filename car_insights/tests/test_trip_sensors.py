import json

import pytest

from car_insights import live
from car_insights.db import connect
from car_insights.trip_sensors import TripSensors


class FakeMqtt:
    def __init__(self):
        self.msgs = []  # (topic, payload, retain)

    def publish(self, messages, retain=True):
        self.msgs += [(t, p, retain) for t, p in messages]

    def on(self, topic):
        return [(json.loads(p), r) for t, p, r in self.msgs if t == topic]


def trip(start, **kw):
    w = {"start": start, "end": start + 600, "from": "A", "to": "B", "distance_m": 1200.0, "net_wh": 500.0}
    return {**w, **kw}


def store(conn, table, w, vid="car1"):
    conn.execute(f"INSERT INTO {table}(vehicle_id,start,end,algo,json) VALUES(?,?,?,1,?)", (vid, w["start"], w["end"], json.dumps(w)))


@pytest.fixture
def env():
    conn = connect(":memory:")
    mqtt = FakeMqtt()
    return conn, mqtt, TripSensors(conn, mqtt)


def test_discovery_once_then_state(env):
    conn, mqtt, ts = env
    for s in (1000, 2000):
        store(conn, "trips", trip(s))
        ts.publish_closed("car1", [trip(s)], [])
    cfg_topics = [t for t, _, _ in mqtt.msgs if t.startswith("homeassistant/")]
    assert len(cfg_topics) == len(set(cfg_topics)) and "homeassistant/sensor/car1_last_trip_distance/config" in cfg_topics
    state, retained = mqtt.on("car_insights/car1/last_trip")[-1]
    assert retained and state["distance_km"] == 1.2 and state["net_kwh"] == 0.5 and state["consumption"] == 41.67


def test_event_not_retained_per_trip(env):
    conn, mqtt, ts = env
    ts_ = [trip(1000), trip(3000)]
    for t in ts_:
        store(conn, "trips", t)
    ts.publish_closed("car1", ts_, [])
    ev = mqtt.on("car_insights/car1/trip_event")
    assert len(ev) == 2 and all(not r and e["event_type"] == "ended" for e, r in ev)


def test_null_values_published_as_null(env):
    conn, mqtt, ts = env
    t = trip(1000, net_wh=None)
    store(conn, "trips", t)
    ts.publish_closed("car1", [t], [])
    state = mqtt.on("car_insights/car1/last_trip")[0][0]
    assert state["net_kwh"] is None and state["consumption"] is None


def test_short_trip_has_no_consumption(env):
    conn, mqtt, ts = env
    t = trip(1000, distance_m=50.0)
    store(conn, "trips", t)
    ts.publish_closed("car1", [t], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["consumption"] is None


def test_charge_state_and_event(env):
    conn, mqtt, ts = env
    c = {"start": 1000, "end": 4600, "place": "Home", "added_wh": 12000.0, "avg_w": 7000.0}
    store(conn, "charges", c)
    ts.publish_closed("car1", [], [c])
    state = mqtt.on("car_insights/car1/last_charge")[0][0]
    assert state["added_kwh"] == 12.0 and state["avg_power_kw"] == 7.0 and state["place"] == "Home"
    assert mqtt.on("car_insights/car1/charge_event")[0][0]["event_type"] == "ended"
    assert mqtt.on("car_insights/car1/last_trip") == []


def test_state_is_newest_stored_not_rederived_old_trip(env):
    conn, mqtt, ts = env
    a, b = trip(1000, distance_m=1000.0), trip(5000, distance_m=2000.0)
    store(conn, "trips", a)
    store(conn, "trips", b)
    ts.publish_closed("car1", [a], [])
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 2.0
    assert mqtt.on("car_insights/car1/trip_event")[0][0]["distance_m"] == 1000.0


def test_same_device_as_live(env):
    conn, mqtt, ts = env
    conn.execute("INSERT INTO vehicles(vehicle_id, name, meta_json) VALUES('car1','x',?)", (json.dumps({"vehicle_name": "Test car", "make": "Acme"}),))
    store(conn, "trips", trip(1000))
    ts.publish_closed("car1", [trip(1000)], [])
    devs = [json.loads(p)["device"] for t, p, _ in mqtt.msgs if t.startswith("homeassistant/")]
    assert devs and all(d == live.device("car1", "Test car", "Acme", None) for d in devs)
