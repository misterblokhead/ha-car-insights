from datetime import timezone

import pytest

from car_insights import db
from car_insights.derive import Deriver
from car_insights.pipeline import refresh
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt, s

SRC = "phone-0000abcd"
TZ = timezone.utc


def trip_samples(t0):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), s(t0 + 500, "gps", [52.0, 5.0]),
            *[s(t0 + t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(t0 + 110_000, "ignition", 2.0)]


@pytest.fixture
def env():
    conn = db.connect(":memory:")
    mqtt = FakeMqtt()
    return conn, mqtt, Deriver(conn, lambda la, lo: "Home"), TripSensors(conn, mqtt)


def test_ingest_to_summary_and_sensors(env):
    conn, mqtt, d, sensors = env
    now = 10_000_000
    db.ingest(conn, "car1", SRC, trip_samples(now - 2_000_000), now)
    refresh(d, sensors, "car1", now - 2_000_000, now, TZ)  # the first rebuild of history: state, no event
    assert mqtt.on("car_insights/car1/trip_event") == []
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    out = refresh(d, sensors, "car1", now - 200_000, now, TZ)
    assert out["last_trip"]["from"] == "Home" and out["last_trip"]["distance_m"] == 1000 and len(out["trips"]) == 2
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["distance_km"] == 1.0
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended"]
    n = len(mqtt.msgs)
    assert refresh(d, sensors, "car1", None, now, TZ)["rev"] == out["rev"]
    assert len(mqtt.msgs) == n  # nothing newly closed, nothing published


def test_empty_vehicle(env):
    _, mqtt, d, sensors = env
    out = refresh(d, sensors, "nobody", None, 1000, TZ)
    assert out["last_trip"] is None and out["trips"] == [] and mqtt.msgs == []
