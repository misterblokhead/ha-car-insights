import json

import pytest

from car_insights.db import connect, ingest
from car_insights.protocol import Sample
from car_insights.publisher import Publisher
from conftest import FakeMqtt

S = "car_app-0000abcd"


@pytest.fixture
def env():
    conn = connect(":memory:")
    mqtt = FakeMqtt()
    return conn, mqtt, Publisher(conn, mqtt, 60000.0)


def feed(conn, pub, samples, vid="car1", now=1000):
    ingest(conn, vid, S, samples, now)
    pub.on_ingested(vid, samples, now)


def discovery(mqtt):
    return [(t, json.loads(p)) for b in mqtt.batches for t, p in b if t.startswith("homeassistant/")]


def test_discovery_once_per_field_then_state_only(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "speed", 1.0)])
    feed(conn, pub, [Sample(2, 2, "speed", 2.0)])
    topics = mqtt.topics
    assert topics.count("homeassistant/sensor/car1_speed_kmh/config") == 1
    assert topics.count("car_insights/car1/state") == 2
    assert len(mqtt.batches[1]) == 1


def test_new_field_announced_later_and_location_published(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "speed", 1.0)])
    feed(conn, pub, [Sample(2, 2, "gps", [1.0, 2.0, 3.0, 0, 0, 0])])
    assert "homeassistant/device_tracker/car1_location/config" in mqtt.topics
    assert "car_insights/car1/location" in mqtt.topics
    assert mqtt.topics.count("homeassistant/sensor/car1_speed_kmh/config") == 1


def test_device_from_meta_with_vehicle_id_fallback(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "speed", 1.0)])
    assert discovery(mqtt)[0][1]["device"] == {"identifiers": ["car_insights_car1"], "name": "car1"}
    mqtt2 = FakeMqtt()
    pub2 = Publisher(conn, mqtt2, 60000.0)
    meta = {"vehicle_name": "Test car", "make": "Acme", "model": "X1"}
    feed(conn, pub2, [Sample(2, 2, "meta", meta), Sample(3, 3, "speed", 1.0)], vid="car2")
    assert discovery(mqtt2)[0][1]["device"]["name"] == "Test car"
    assert discovery(mqtt2)[0][1]["device"]["manufacturer"] == "Acme"


def test_device_change_reannounces_everything(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "meta", {"vehicle_name": "Old"}), Sample(2, 2, "speed", 1.0), Sample(3, 3, "plugged", True)])
    n = len(discovery(mqtt))
    feed(conn, pub, [Sample(4, 4, "meta", {"vehicle_name": "Old"})])  # unchanged meta: nothing new
    assert len(discovery(mqtt)) == n
    feed(conn, pub, [Sample(5, 5, "meta", {"vehicle_name": "New", "make": "Mk"})])
    renamed = discovery(mqtt)[n:]
    assert len(renamed) == n and all(c["device"]["name"] == "New" for _, c in renamed)


def test_meta_only_before_any_state_publishes_nothing(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "meta", {"vehicle_name": "X"})])
    assert mqtt.batches == []


def test_future_samples_warn_and_publish_nothing(env, caplog):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 10**13, "speed", 1.0)])
    assert mqtt.batches == [] and "more than 1 day ahead" in caplog.text


def last_state(mqtt):
    return json.loads(next(p for b in reversed(mqtt.batches) for t, p in reversed(b) if t == "car_insights/car1/state"))


def test_restart_seeds_state_from_storage(env):
    conn, mqtt, pub = env
    feed(conn, pub, [Sample(1, 1, "mode", "charging"), Sample(2, 1, "plugged", True), Sample(3, 1, "gear", 4),
                     Sample(4, 1, "range_m", 150000.0), Sample(5, 1, "battery_wh", 30000.0), Sample(6, 1, "power", 7000.0)])
    restarted = FakeMqtt()
    feed(conn, Publisher(conn, restarted, 60000.0), [Sample(7, 2, "power", 7000.0), Sample(8, 2, "speed", 0.0)], now=2000)
    snap = last_state(restarted)
    assert snap["status"] == "charging" and snap["range_km"] == 150.0 and snap["plugged"] == "ON" and snap["soc"] == 50.0


def test_seed_skips_future_rows_and_meta(env):
    conn, mqtt, pub = env
    ingest(conn, "car1", S, [Sample(1, 1, "speed", 1.0), Sample(2, 10**13, "speed", 99.0), Sample(3, 10**13, "meta", {"vehicle_name": "X"})], 1000)
    p2 = Publisher(conn, mqtt, 60000.0)
    p2.on_ingested("car1", [Sample(4, 2, "power", 0.0)], 1000)
    assert last_state(mqtt)["speed_kmh"] == 3.6
