import json
import math
from datetime import timezone

import pytest

from car_insights import access, db
from car_insights.derive import Deriver
from car_insights.pipeline import close_quiet, rebuild, refresh
from car_insights.trips import QUIET_MS
from car_insights.totals_sensors import TotalsSensors
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
    d = Deriver(conn, lambda la, lo: "Home", lambda vid: 57_000.0)
    return conn, mqtt, d, TripSensors(conn, mqtt, lambda vid: 57_000.0, lambda kind, vid, start: getattr(d, f"{kind}_series")(vid, start)), TotalsSensors(conn, mqtt, TZ, now_ms=lambda: 10_000_000)


def test_ingest_to_summary_and_sensors(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    cur, out = refresh(d, sensors, totals, "car1", now - 200_000, now, TZ)
    assert cur is None and out["last_trip"]["from"] == "Home" and out["last_trip"]["distance_m"] == 1000 and len(out["trips"]) == 1
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended"]
    n = len(mqtt.msgs)
    assert refresh(d, sensors, totals, "car1", None, now, TZ)[1]["rev"] == out["rev"]
    assert len(mqtt.msgs) == n  # nothing newly closed, nothing published


@pytest.mark.parametrize("age_ms, events", [(3_600_000, 1), (3_600_001, 0), (3 * DAY, 0), (600_000, 1)])
def test_ended_event_only_for_closes_within_an_hour_of_arrival(env, age_ms, events):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, trip_samples(now - age_ms - 110_000), now)  # the trip ended age_ms before arrival
    refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(mqtt.on("car_insights/car1/trip_event")) == events
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0  # the state follows every close


def test_old_charge_publishes_state_but_no_event(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, [s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(3_600_000, "battery_wh", 25_000.0),
                                  s(3_700_000, "plugged", False)], now)
    refresh(d, sensors, totals, "car1", None, now, TZ)
    assert mqtt.on("car_insights/car1/charge_event") == [] and mqtt.on("car_insights/car1/last_charge")[0][0]["added_kwh"] == 5.0


def test_empty_vehicle(env):
    _, mqtt, d, sensors, totals = env
    cur, out = refresh(d, sensors, totals, "nobody", None, 1000, TZ)
    assert cur is None and out["last_trip"] is None and out["trips"] == [] and mqtt.msgs == []


def open_trip_samples(t0, secs):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, 1000)]]


def test_current_trip_comes_with_every_refresh_and_never_moves_the_summary_rev(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, open_trip_samples(now - 300_000, 30), now)
    cur1, sum1 = refresh(d, sensors, totals, "car1", None, now - 270_000, TZ)
    db.ingest(conn, "car1", SRC, [s(now - 300_000 + t, "speed", 10.0) for t in range(31_000, 91_000, 1000)], now)
    cur2, sum2 = refresh(d, sensors, totals, "car1", now - 269_000, now - 200_000, TZ)
    assert cur1["end"] is None and cur2["distance_m"] > cur1["distance_m"]
    assert "current_trip" not in sum1 and sum1["rev"] == sum2["rev"]  # the open trip is not part of the summary
    assert sum1["today"]["distance_m"] == 0 and sum1["trips"] == []


def test_lists_hold_the_newest_20_and_the_week_only_its_own_days(env):
    conn, mqtt, d, sensors, totals = env
    now = 30 * DAY + 43_200_000
    for i in range(22):  # one trip a day, the oldest 22 days before now
        db.ingest(conn, "car1", SRC, trip_samples(now - (i + 1) * DAY + 3_600_000), now)
    _, out = refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(out["trips"]) == 20 and out["trips"][0]["start"] > out["trips"][-1]["start"]
    assert out["last_trip"] == out["trips"][0]
    assert sum(day["distance_m"] for day in out["week"]) == 6 * 1000  # six trips fall in the 7 local days ending today


def test_refined_charge_fires_no_second_event(env):
    conn, mqtt, d, sensors, totals = env
    now = ms("2026-10-23T16:00:00+02:00")
    db.ingest(conn, "car1", SRC, [s(now - 4 * 3_600_000, "battery_wh", 22_500.0), s(now - 4 * 3_600_000, "gear", 4.0)], now)
    db.ingest(conn, "car1", "ha_entities-0000abcd",
              [s(now - 3_600_000 - 1_800_000, "charging_state", True), s(now - 3_600_000 - 1_800_000, "soc_percent", 40.0),
               s(now - 1_800_000, "soc_percent", 81.0), s(now - 1_800_000, "charging_state", False)], now)
    refresh(d, sensors, totals, "car1", None, now, TZ)
    [(ev, _)] = mqtt.on("car_insights/car1/charge_event")
    assert ev["added_wh"] == 23_370 and ev["energy_source"] == "soc_estimate"
    db.ingest(conn, "car1", SRC, [s(now - 600_000, "battery_wh", 46_550.0)], now)
    refresh(d, sensors, totals, "car1", now - 600_000, now, TZ)
    assert len(mqtt.on("car_insights/car1/charge_event")) == 1  # the refinement is no new event
    assert mqtt.on("car_insights/car1/last_charge")[-1][0]["added_kwh"] == 24.05  # but the state follows it


def test_refresh_publishes_group_of_vehicle(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES('car1','x')")
    access.set_vehicle(conn, "car1", gid, [])
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, "car1", now - 200_000, now, TZ)
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert mqtt.on(f"car_insights/group_{gid}/totals")[-1][0]["month_distance"] == 1.0


def test_refresh_without_group_or_change_publishes_no_group_totals(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, "car1", now - 200_000, now, TZ)
    assert mqtt.on("car_insights/car1/totals") and not [t for t in mqtt.topics if "group_" in t]
    n = len(mqtt.msgs)
    refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(mqtt.msgs) == n  # nothing closed or changed: no totals either


def test_rebuild_restores_rows_and_totals_after_an_algo_bump_before_any_ingest(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):  # car2 has nothing to derive
        conn.execute("INSERT INTO vehicles(vehicle_id) VALUES(?)", (vid,))
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, "car1", None, now, TZ)
    conn.execute("UPDATE trips SET algo=algo-1")  # what an install from before the bump holds
    d2 = Deriver(conn, lambda la, lo: "Home")  # the restart: stale rows are dropped
    totals.publish_vehicle("car1")
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 0 and mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 0.0
    rebuild(d2, sensors, conn, now)
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE vehicle_id='car1'").fetchone()[0] == 1
    totals.publish_vehicle("car1")
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # only the original one: a rebuild fires no events


def test_rebuild_survives_one_vehicle_failing(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):
        conn.execute("INSERT INTO vehicles(vehicle_id) VALUES(?)", (vid,))
        db.ingest(conn, vid, SRC, trip_samples(now - 200_000), now)
    class Boom(Deriver):
        def update(self, vid, min_t, received_ms):
            if vid == "car1":
                raise RuntimeError("boom")
            return super().update(vid, min_t, received_ms)
    rebuild(Boom(conn, lambda la, lo: "Home"), sensors, conn, now)
    assert [r[0] for r in conn.execute("SELECT DISTINCT vehicle_id FROM trips")] == ["car2"]


def test_a_quiet_car_closes_its_trip_at_the_first_p_sample_with_an_event(env):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000  # parked, then the ignition-off batch never came
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    db.ingest(conn, "car1", "ha_entities-0000abcd", [], last + QUIET_MS)  # a cloud report proves nothing about the car
    calls = []

    def summarize(vid, min_t, received):
        calls.append(received)
        return refresh(d, sensors, totals, vid, min_t, received, TZ)

    summarize("car1", None, last)
    close_quiet(conn, summarize, last + QUIET_MS - 1)
    assert len(calls) == 1 and d.current_trip("car1")["end"] is None  # not quiet long enough
    close_quiet(conn, summarize, last + QUIET_MS)
    assert d.current_trip("car1") is None and d.stored_trips("car1")[0]["end"] == last
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1
    close_quiet(conn, summarize, last + 2 * QUIET_MS)
    assert len(calls) == 2  # nothing open any more


def test_close_quiet_survives_one_vehicle_failing(env):
    conn, _, d, *_ = env
    for vid in ("car1", "car2"):
        db.ingest(conn, vid, SRC, open_trip_samples(0, 30), 0)
        d.update(vid, None, 0)
    seen = []

    def summarize(vid, min_t, received):
        seen.append(vid)
        if vid == "car1":
            raise RuntimeError("boom")

    close_quiet(conn, summarize, QUIET_MS)
    assert sorted(seen) == ["car1", "car2"]


def test_rebuild_publishes_the_trip_it_closed_but_no_event(env):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    refresh(d, sensors, totals, "car1", None, last, TZ)
    rebuild(Deriver(conn, lambda la, lo: "Home"), sensors, conn, last + QUIET_MS)  # the restart finds the car quiet
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["end"] == last
    assert mqtt.on("car_insights/car1/trip_event") == []


def winding_samples(t0, secs, open_=False):
    """a trip drifting north on a wiggling track: one gps fix a second, so the stored route has far more than 48 points"""
    gps = [s(t0 + 1000 * i, "gps", [52.0 + 0.0001 * i, 5.0 + 0.001 * math.sin(i / 4)]) for i in range(secs)]
    body = open_trip_samples(t0, secs) + gps
    return body if open_ else body + [s(t0 + secs * 1000 + 10_000, "ignition", 2.0)]


def routed_env(env, n_closed=2):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    for i in range(n_closed):
        db.ingest(conn, "car1", SRC, winding_samples(now - (i + 2) * 3_600_000, 80), now)
    db.ingest(conn, "car1", SRC, winding_samples(now - 300_000, 80, open_=True), now)
    return now


def test_summary_trips_and_current_trip_carry_card_routes(env):
    conn, mqtt, d, sensors, totals = env
    now = routed_env(env)
    cur, out = refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(out["trips"]) == 2
    for t in out["trips"]:
        assert 2 <= len(t["route"]) <= 48 and all(len(p) == 2 for p in t["route"])
    assert out["last_trip"]["route"] == out["trips"][0]["route"]
    assert cur["end"] is None and 2 <= len(cur["route"]) <= 48


def test_trip_without_stored_route_gets_null(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, winding_samples(now - 3_600_000, 80), now)
    refresh(d, sensors, totals, "car1", None, now, TZ)  # nothing is open afterwards, so the next refresh derives nothing again
    conn.execute("DELETE FROM trip_routes")
    _, out = refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(out["trips"]) == 1 and out["last_trip"]["route"] is None and out["trips"][0]["route"] is None


def test_summary_carries_capacity(env):
    conn, mqtt, d, sensors, totals = env
    assert refresh(d, sensors, totals, "car1", None, 1000, TZ)[1]["capacity_wh"] == 57_000.0


def test_summary_size_with_20_routed_trips(env):
    conn, mqtt, d, sensors, totals = env
    now = routed_env(env, 20)
    _, out = refresh(d, sensors, totals, "car1", None, now, TZ)
    assert len(out["trips"]) == 20 and len(json.dumps(out)) < 40_000
