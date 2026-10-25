import json
import math
import sqlite3
from datetime import timezone

import pytest

from car_insights import access, costs, db, prices, store
from car_insights.derive import ESTIMATE_HOLD_MS, Deriver
from car_insights.kinds import CHARGE, TRIP
from car_insights import pipeline
from car_insights.pipeline import REBUILD_STEP_MS, close_quiet, refresh, republish
from car_insights.trips import QUIET_MS
from car_insights.totals_sensors import TotalsSensors
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt, ms, s, v6_database

SRC = "phone-0000abcd"
TZ = timezone.utc
CAP = lambda vid: 57_000.0
DAY = 86_400_000


def rebuild(deriver, sensors, conn, now, zones=lambda la, lo: "Home", spots=lambda la, lo: None):
    pipeline.rebuild(deriver, sensors, conn, now, zones, spots)


def trip_samples(t0):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), s(t0 + 500, "gps", [52.0, 5.0]),
            *[s(t0 + t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(t0 + 110_000, "ignition", 2.0)]


@pytest.fixture
def env():
    conn = db.connect(":memory:")
    mqtt = FakeMqtt()
    d = Deriver(conn, lambda la, lo: "Home", CAP)
    return conn, mqtt, d, TripSensors(conn, mqtt, CAP), TotalsSensors(conn, mqtt, TZ, now_ms=lambda: 10_000_000)


def test_ingest_to_summary_and_sensors(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    cur, out = refresh(d, sensors, totals, conn, CAP, "car1", now - 200_000, now, TZ)
    assert cur is None and out["last_trip"]["from"] == "Home" and out["last_trip"]["distance_m"] == 1000 and len(out["trips"]) == 1
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended"]
    n = len(mqtt.msgs)
    assert refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)[1]["rev"] == out["rev"]
    assert len(mqtt.msgs) == n  # nothing newly closed, nothing published


@pytest.mark.parametrize("age_ms, events", [(3_600_000, 1), (3_600_001, 0), (3 * DAY, 0), (600_000, 1)])
def test_ended_event_only_for_closes_within_an_hour_of_arrival(env, age_ms, events):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, trip_samples(now - age_ms - 110_000), now)  # the trip ended age_ms before arrival
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert len(mqtt.on("car_insights/car1/trip_event")) == events
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0  # the state follows every close


def test_old_charge_publishes_state_but_no_event(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, [s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(3_600_000, "battery_wh", 25_000.0),
                                  s(3_700_000, "plugged", False)], now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert mqtt.on("car_insights/car1/charge_event") == [] and mqtt.on("car_insights/car1/last_charge")[0][0]["added_kwh"] == 5.0


def test_empty_vehicle(env):
    conn, mqtt, d, sensors, totals = env
    cur, out = refresh(d, sensors, totals, conn, CAP, "nobody", None, 1000, TZ)
    assert cur is None and out["last_trip"] is None and out["trips"] == [] and mqtt.msgs == []


def open_trip_samples(t0, secs):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, 1000)]]


def test_current_trip_comes_with_every_refresh_and_never_moves_the_summary_rev(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, open_trip_samples(now - 300_000, 30), now)
    cur1, sum1 = refresh(d, sensors, totals, conn, CAP, "car1", None, now - 270_000, TZ)
    db.ingest(conn, "car1", SRC, [s(now - 300_000 + t, "speed", 10.0) for t in range(31_000, 91_000, 1000)], now)
    cur2, sum2 = refresh(d, sensors, totals, conn, CAP, "car1", now - 269_000, now - 200_000, TZ)
    assert cur1["end"] is None and cur2["distance_m"] > cur1["distance_m"]
    assert "current_trip" not in sum1 and sum1["rev"] == sum2["rev"]  # the open trip is not part of the summary
    assert sum1["today"]["distance_m"] == 0 and sum1["trips"] == []


def test_lists_hold_the_newest_20_and_the_week_only_its_own_days(env):
    conn, mqtt, d, sensors, totals = env
    now = 30 * DAY + 43_200_000
    for i in range(22):  # one trip a day, the oldest 22 days before now
        db.ingest(conn, "car1", SRC, trip_samples(now - (i + 1) * DAY + 3_600_000), now)
    _, out = refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
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
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    [(ev, _)] = mqtt.on("car_insights/car1/charge_event")
    assert ev["added_wh"] == 23_370 and ev["energy_source"] == "soc_estimate"
    db.ingest(conn, "car1", SRC, [s(now - 600_000, "battery_wh", 46_550.0)], now)
    refresh(d, sensors, totals, conn, CAP, "car1", now - 600_000, now, TZ)
    assert len(mqtt.on("car_insights/car1/charge_event")) == 1  # the refinement is no new event
    assert mqtt.on("car_insights/car1/last_charge")[-1][0]["added_kwh"] == 24.05  # but the state follows it


def test_refresh_publishes_group_of_vehicle(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES('car1','x')")
    access.set_vehicle(conn, "car1", gid, [])
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", now - 200_000, now, TZ)
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert mqtt.on(f"car_insights/group_{gid}/totals")[-1][0]["month_distance"] == 1.0


def test_refresh_without_group_or_change_publishes_no_group_totals(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", now - 200_000, now, TZ)
    assert mqtt.on("car_insights/car1/totals") and not [t for t in mqtt.topics if "group_" in t]
    n = len(mqtt.msgs)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert len(mqtt.msgs) == n  # nothing closed or changed: no totals either


def test_rebuild_restores_rows_and_totals_after_an_algo_bump_before_any_ingest(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):  # car2 has nothing to derive
        conn.execute("INSERT INTO vehicles(vehicle_id) VALUES(?)", (vid,))
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    conn.execute("UPDATE trips SET algo=algo-1")  # what an install from before the bump holds
    d2 = Deriver(conn, lambda la, lo: "Home")  # the restart
    d2.purge_stale()
    totals.publish_vehicle("car1")
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 0 and mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 0.0
    rebuild(d2, sensors, conn, now)
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE vehicle_id='car1'").fetchone()[0] == 1
    totals.publish_vehicle("car1")
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # only the original one: a rebuild fires no events


def test_rebuild_purges_stale_rows_itself(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    conn.execute("UPDATE trips SET algo=algo-1, distance_m=-1")  # a row the old derivation got wrong
    rebuild(Deriver(conn, lambda la, lo: "Home", CAP), sensors, conn, now)  # the restart
    assert [t["distance_m"] for t in store.closed(conn, TRIP, "car1")] == [1000]


def test_rebuild_ends_with_a_relabel_from_the_stored_points(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    rebuild(Deriver(conn, lambda la, lo: "Work", CAP), sensors, conn, now, zones=lambda la, lo: "Work")  # the zone was renamed while down
    assert store.closed(conn, TRIP, "car1")[0]["from"] == "Work"
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 1  # renamed in place


def test_rebuild_does_not_relabel_with_zones_that_never_loaded(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    class Down:
        loaded = False  # every fetch failed: it would call every place Unknown
        def __call__(self, la, lo):
            return None
    rebuild(d, sensors, conn, now, zones=Down())
    assert store.closed(conn, TRIP, "car1")[0]["from"] == "Home"


def test_rebuild_logs_duration(env, caplog):
    conn, mqtt, d, sensors, totals = env
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    with caplog.at_level("INFO", logger="car_insights.pipeline"):
        rebuild(d, sensors, conn, 10_000_000)
    msgs = [r.getMessage() for r in caplog.records if r.levelname == "INFO"]
    assert len(msgs) == 1 and msgs[0].startswith("rebuild of 1 vehicles took")


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
        return refresh(d, sensors, totals, conn, CAP, vid, min_t, received, TZ)

    summarize("car1", None, last)
    close_quiet(conn, summarize, last + QUIET_MS - 1)
    assert len(calls) == 1 and store.current_trip(conn, "car1")["end"] is None  # not quiet long enough
    close_quiet(conn, summarize, last + QUIET_MS)
    assert store.current_trip(conn, "car1") is None and store.closed(conn, TRIP, "car1")[0]["end"] == last
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
    refresh(d, sensors, totals, conn, CAP, "car1", None, last, TZ)
    rebuild(Deriver(conn, lambda la, lo: "Home"), sensors, conn, last + QUIET_MS)  # the restart finds the car quiet
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["end"] == last
    assert mqtt.on("car_insights/car1/trip_event") == []


def test_republish(env, caplog):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):
        conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES(?,?)", (vid, vid))
        db.ingest(conn, vid, SRC, trip_samples(now - 200_000), now)
        refresh(d, sensors, totals, conn, CAP, vid, now - 200_000, now, TZ)
    mqtt.msgs.clear()
    republish(sensors, totals, conn, ["car1"])
    topics = {t for t, _, _ in mqtt.msgs}
    assert {"car_insights/car1/last_trip", "car_insights/car1/totals"} <= topics
    assert not [t for t in topics if "car2" in t or t.endswith("_event")]
    mqtt.msgs.clear()
    republish(sensors, totals, conn, None)
    assert {"car_insights/car1/last_trip", "car_insights/car2/last_trip", "car_insights/car1/totals", "car_insights/car2/totals"} <= {t for t, _, _ in mqtt.msgs}
    mqtt.msgs.clear()
    real = totals.publish_vehicle
    totals.publish_vehicle = lambda vid: 1 / 0 if vid == "car1" else real(vid)
    republish(sensors, totals, conn, None)  # logged, not raised, and car2 still goes out
    assert "republish of car1 failed" in caplog.text
    assert "car_insights/car2/totals" in {t for t, _, _ in mqtt.msgs}
    totals.publish_groups = lambda: 1 / 0
    republish(sensors, totals, conn, None)
    assert "republish of the groups failed" in caplog.text


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
    cur, out = refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert len(out["trips"]) == 2
    for t in out["trips"]:
        assert 2 <= len(t["route"]) <= 48 and all(len(p) == 2 for p in t["route"])
    assert out["last_trip"]["route"] == out["trips"][0]["route"]
    assert cur["end"] is None and 2 <= len(cur["route"]) <= 48


def test_trip_without_stored_route_gets_null(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, winding_samples(now - 3_600_000, 80), now)
    refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)  # nothing is open afterwards, so the next refresh derives nothing again
    conn.execute("DELETE FROM trip_routes")
    _, out = refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert len(out["trips"]) == 1 and out["last_trip"]["route"] is None and out["trips"][0]["route"] is None


def test_summary_carries_capacity(env):
    conn, mqtt, d, sensors, totals = env
    assert refresh(d, sensors, totals, conn, CAP, "car1", None, 1000, TZ)[1]["capacity_wh"] == 57_000.0


def test_summary_size_with_20_routed_trips(env):
    conn, mqtt, d, sensors, totals = env
    now = routed_env(env, 20)
    _, out = refresh(d, sensors, totals, conn, CAP, "car1", None, now, TZ)
    assert len(out["trips"]) == 20 and len(json.dumps(out)) < 40_000


def test_a_rejoined_quiet_trip_fires_no_second_event_until_it_closes_for_real(env):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    summarize = lambda vid, min_t, received: refresh(d, sensors, totals, conn, CAP, vid, min_t, received, TZ)
    summarize("car1", None, last)
    close_quiet(conn, summarize, last + QUIET_MS)
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # closed by the quiet rule
    back = last + QUIET_MS + 5_000
    db.ingest(conn, "car1", SRC, [s(last + 1000 * i, "gear", 4.0) for i in range(1, 60)] + [s(last + 60_000, "gear", 1.0),
              *[s(last + 60_000 + 1000 * i, "speed", 10.0) for i in range(60)]], back)
    cur, _ = refresh(d, sensors, totals, conn, CAP, "car1", last + 1000, back, TZ)
    assert cur["start"] == t0 and cur["end"] is None
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # the rejoin is no new close
    db.ingest(conn, "car1", SRC, [s(last + 130_000, "ignition", 2.0)], back + 1000)
    assert refresh(d, sensors, totals, conn, CAP, "car1", last + 130_000, back + 1000, TZ)[0] is None
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended", "ended"]  # the real end is a second "ended"


def history_95_days(conn):
    """95 days: a short trip each morning, a charge every 5 days, two charges across a window edge (30 d + 6 h and one day on from it),
    and a trip still open at the end. Returns `now`."""
    base, h = 100 * DAY, 3_600_000
    samples = []
    for day in range(95):
        if day not in (30, 31):  # those mornings hold the charges across the window edge
            samples += trip_samples(base + day * DAY + 6 * h)
        if day % 5 == 0:
            p = base + day * DAY + 20 * h
            samples += [s(p, "plugged", True), s(p, "battery_wh", 20_000.0), s(p + h, "battery_wh", 25_000.0), s(p + h + 100_000, "plugged", False)]
    for p in (base + 30 * DAY + 5 * h + h // 2, base + 31 * DAY + 5 * h + h // 2):  # 30 min before the edge of the 1st window and of its 1-day look-ahead
        samples += [s(p, "plugged", True), s(p, "battery_wh", 20_000.0), s(p + h, "battery_wh", 25_000.0), s(p + h + 100_000, "plugged", False)]
    open_t = base + 95 * DAY + 6 * h
    samples += open_trip_samples(open_t, 30)
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, samples, open_t + 31_000)
    return open_t + 40_000


def assert_rebuilt_like_one_pass(conn, now):
    """rebuild `conn` in windows and a copy in one update: every derived table must be equal"""
    copy = sqlite3.connect(":memory:")
    conn.backup(copy)
    rebuild(Deriver(conn, lambda la, lo: "Home"), TripSensors(conn, FakeMqtt(), lambda vid: 57_000.0), conn, now)
    Deriver(copy, lambda la, lo: "Home").update("car1", None, now)
    for table in ("trips", "charges", "trip_series", "charge_series", "trip_routes"):
        a, b = (c.execute(f"SELECT * FROM {table} ORDER BY start").fetchall() for c in (conn, copy))
        assert a == b, table


def test_rebuild_in_windows_matches_one_pass(env):
    conn, *_ = env
    assert_rebuilt_like_one_pass(conn, history_95_days(conn))
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 94 and conn.execute("SELECT COUNT(*) FROM charges").fetchone()[0] == 21
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE end IS NULL").fetchone()[0] == 1


def test_rebuild_reopens_a_cloud_charge_a_window_closed_before_the_car_reading(env):
    conn, *_ = env
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    edge = 100 * DAY + REBUILD_STEP_MS + DAY  # the first window's look-ahead cut-off
    h = 3_600_000
    car = [s(100 * DAY, "battery_wh", 10_000.0), s(edge - 4 * h, "battery_wh", 22_500.0), s(edge + 3 * h, "battery_wh", 46_550.0)]
    cloud = [s(edge - 3 * h, "charging_state", True), s(edge - 3 * h, "soc_percent", 40.0), s(edge - h, "soc_percent", 81.0), s(edge - h, "charging_state", False)]
    db.ingest(conn, "car1", SRC, car, 0)
    db.ingest(conn, "car1", "ha_entities-0000abcd", cloud, 0)
    assert_rebuilt_like_one_pass(conn, 100 * DAY + 40 * DAY)
    assert conn.execute("SELECT energy_source FROM charges").fetchall() == [("car",)]  # not the SoC estimate the first window made


def test_rebuild_reads_bounded_windows(env, monkeypatch):
    conn, mqtt, d, sensors, totals = env
    now = history_95_days(conn)
    spans, real = [], db.samples_after

    def spy(*args):
        out = real(*args)
        spans.append(out[-1].t - out[0].t if out else 0)
        return out

    monkeypatch.setattr(db, "samples_after", spy)
    rebuild(Deriver(conn, lambda la, lo: "Home"), sensors, conn, now)
    assert len(spans) >= 4 and max(spans) <= REBUILD_STEP_MS + ESTIMATE_HOLD_MS + 2 * DAY  # a window re-opens the 7 days before the last one's cut-off


def test_a_normal_restart_rebuilds_nothing_before_the_newest_closed_end(env, monkeypatch):
    conn, mqtt, d, sensors, totals = env
    now = history_95_days(conn)
    d.update("car1", None, now)  # the live state: everything derived, no ALGO or zone change since
    tables = ("trips", "charges", "trip_series", "charge_series", "trip_routes")
    before = {t: conn.execute(f"SELECT * FROM {t} ORDER BY start").fetchall() for t in tables}
    newest = store.newest_end(conn, "car1")
    assert newest > 100 * DAY + 60 * DAY
    reads, real = [], db.samples_after
    monkeypatch.setattr(db, "samples_after", lambda *args: reads.append(args[2]) or real(*args))
    rebuild(Deriver(conn, lambda la, lo: "Home"), sensors, conn, now)  # the restart
    assert {t: conn.execute(f"SELECT * FROM {t} ORDER BY start").fetchall() for t in tables} == before
    assert reads and min(reads) >= newest  # only what came after the newest closed row was read again


def test_upgrade_keeps_receipt_and_spot(tmp_path):
    path, now = str(tmp_path / "m.db"), 10 * DAY
    old = v6_database(path)  # what the released add-on left: a charge at a saved spot, with a receipt for it
    start = now - 4_000_000
    old.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    old.execute("INSERT INTO charge_spots(spot_id, name, lat, lon, radius_m) VALUES('sp1','Plaza',52.0,5.0,100)")
    old.execute("INSERT INTO charge_receipts VALUES('car1',?,9.5)", (start + 1000,))
    old.execute("INSERT INTO trips VALUES('car1',1,2,6,'{}')")  # a derived row of the old layout
    old.close()
    conn = db.connect(path)  # migrates to 7
    db.ingest(conn, "car1", SRC, [s(start, "battery_wh", 20_000.0), s(start + 500, "gps", [52.0, 5.0]), s(start + 1000, "plugged", True),
                                  s(start + 3_600_000, "battery_wh", 25_000.0), s(start + 3_700_000, "plugged", False)], now)
    spots = lambda la, lo: prices.spot_name_at(conn, la, lo)
    rebuild(Deriver(conn, lambda la, lo: None, CAP, spots=spots), TripSensors(conn, FakeMqtt(), CAP), conn, now, lambda la, lo: None, spots)
    [charge] = store.closed(conn, CHARGE, "car1")
    assert charge["place"] == "Plaza" and charge["zone"] is None
    assert costs.charge_cost(prices.book(conn, "car1"), charge)["basis"] == "receipt"
