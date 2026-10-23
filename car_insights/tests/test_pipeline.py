from datetime import timezone

import pytest

from car_insights import db
from car_insights.derive import Deriver
from car_insights.pipeline import refresh
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt, ms, s

SRC = "phone-0000abcd"
TZ = timezone.utc
DAY = 86_400_000


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
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    cur, out = refresh(d, sensors, "car1", now - 200_000, now, TZ)
    assert cur is None and out["last_trip"]["from"] == "Home" and out["last_trip"]["distance_m"] == 1000 and len(out["trips"]) == 1
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended"]
    n = len(mqtt.msgs)
    assert refresh(d, sensors, "car1", None, now, TZ)[1]["rev"] == out["rev"]
    assert len(mqtt.msgs) == n  # nothing newly closed, nothing published


@pytest.mark.parametrize("age_ms, events", [(3_600_000, 1), (3_600_001, 0), (3 * DAY, 0), (600_000, 1)])
def test_ended_event_only_for_closes_within_an_hour_of_arrival(env, age_ms, events):
    conn, mqtt, d, sensors = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, trip_samples(now - age_ms - 110_000), now)  # the trip ended age_ms before arrival
    refresh(d, sensors, "car1", None, now, TZ)
    assert len(mqtt.on("car_insights/car1/trip_event")) == events
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0  # the state follows every close


def test_old_charge_publishes_state_but_no_event(env):
    conn, mqtt, d, sensors = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, [s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(3_600_000, "battery_wh", 25_000.0),
                                  s(3_700_000, "plugged", False)], now)
    refresh(d, sensors, "car1", None, now, TZ)
    assert mqtt.on("car_insights/car1/charge_event") == [] and mqtt.on("car_insights/car1/last_charge")[0][0]["added_kwh"] == 5.0


def test_empty_vehicle(env):
    _, mqtt, d, sensors = env
    cur, out = refresh(d, sensors, "nobody", None, 1000, TZ)
    assert cur is None and out["last_trip"] is None and out["trips"] == [] and mqtt.msgs == []


def open_trip_samples(t0, secs):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, 1000)]]


def test_current_trip_comes_with_every_refresh_and_never_moves_the_summary_rev(env):
    conn, mqtt, d, sensors = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, open_trip_samples(now - 300_000, 30), now)
    cur1, sum1 = refresh(d, sensors, "car1", None, now - 270_000, TZ)
    db.ingest(conn, "car1", SRC, [s(now - 300_000 + t, "speed", 10.0) for t in range(31_000, 91_000, 1000)], now)
    cur2, sum2 = refresh(d, sensors, "car1", now - 269_000, now - 200_000, TZ)
    assert cur1["end"] is None and cur2["distance_m"] > cur1["distance_m"]
    assert "current_trip" not in sum1 and sum1["rev"] == sum2["rev"]  # the open trip is not part of the summary
    assert sum1["today"]["distance_m"] == 0 and sum1["trips"] == []


def test_lists_hold_the_newest_20_and_the_week_only_its_own_days(env):
    conn, mqtt, d, sensors = env
    now = 30 * DAY + 43_200_000
    for i in range(22):  # one trip a day, the oldest 22 days before now
        db.ingest(conn, "car1", SRC, trip_samples(now - (i + 1) * DAY + 3_600_000), now)
    _, out = refresh(d, sensors, "car1", None, now, TZ)
    assert len(out["trips"]) == 20 and out["trips"][0]["start"] > out["trips"][-1]["start"]
    assert out["last_trip"] == out["trips"][0]
    assert sum(day["distance_m"] for day in out["week"]) == 6 * 1000  # six trips fall in the 7 local days ending today


def test_refined_charge_fires_no_second_event(env):
    conn, mqtt, d, sensors = env
    now = ms("2026-10-23T16:00:00+02:00")
    db.ingest(conn, "car1", SRC, [s(now - 4 * 3_600_000, "battery_wh", 22_500.0), s(now - 4 * 3_600_000, "gear", 4.0)], now)
    db.ingest(conn, "car1", "ha_entities-0000abcd",
              [s(now - 3_600_000 - 1_800_000, "charging_state", True), s(now - 3_600_000 - 1_800_000, "soc_percent", 40.0),
               s(now - 1_800_000, "soc_percent", 81.0), s(now - 1_800_000, "charging_state", False)], now)
    refresh(d, sensors, "car1", None, now, TZ)
    [(ev, _)] = mqtt.on("car_insights/car1/charge_event")
    assert ev["added_wh"] == 24_600 and ev["energy_source"] == "soc_estimate"
    db.ingest(conn, "car1", SRC, [s(now - 600_000, "battery_wh", 46_550.0)], now)
    refresh(d, sensors, "car1", now - 600_000, now, TZ)
    assert len(mqtt.on("car_insights/car1/charge_event")) == 1  # the refinement is no new event
    assert mqtt.on("car_insights/car1/last_charge")[-1][0]["added_kwh"] == 24.05  # but the state follows it
