import json
import math
import sqlite3
from datetime import timezone
from functools import partial

import pytest

from custom_components.car_insights.core import access, costs, db, prices, store
from custom_components.car_insights.core.derive import ESTIMATE_HOLD_MS, Deriver
from custom_components.car_insights.core.kinds import CHARGE, TRIP
from custom_components.car_insights.core import pipeline, summary
from custom_components.car_insights.core.publisher import Publisher
from custom_components.car_insights.core.pipeline import REBUILD_STEP_MS, App, close_quiet, ingested, rebuild, reply, republish
from custom_components.car_insights.core.trips import QUIET_MS
from custom_components.car_insights.core.zones import Zone, ZoneCache
from custom_components.car_insights.core.totals_sensors import TotalsSensors
from custom_components.car_insights.core.trip_sensors import TripSensors
from conftest import FakeMqtt, ms, s, v6_database

SRC = "phone-0000abcd"
TZ = timezone.utc
CAP = lambda vid: 57_000.0
DAY = 86_400_000


def trip_samples(t0):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), s(t0 + 500, "gps", [52.0, 5.0]),
            *[s(t0 + t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(t0 + 110_000, "ignition", 2.0)]


def make_app(env, deriver=None):
    conn, _, d, sensors, totals = env
    return App(conn, deriver or d, sensors, totals, TZ, CAP, lambda la, lo: "Home")


def refresh(app, vid, min_t, received):
    """what the webhook does after an ingest"""
    ingested(app, vid, min_t, received)
    return reply(app, vid, received)


@pytest.fixture
def env():
    conn = db.connect(":memory:")
    mqtt = FakeMqtt()
    d = Deriver(conn, lambda la, lo: "Home", CAP)
    return conn, mqtt, d, TripSensors(conn, mqtt, CAP), TotalsSensors(conn, mqtt, TZ, now_ms=lambda: 10_000_000)


def test_close_quiet_builds_no_summary(env, monkeypatch):
    conn, *_ = env
    last = 10 * DAY + 31_000
    db.ingest(conn, "car1", SRC, [*open_trip_samples(10 * DAY, 30), s(last, "gear", 4.0)], last)
    app = make_app(env)
    ingested(app, "car1", None, last)
    built = []
    monkeypatch.setattr(summary, "build", lambda *a, **k: built.append(1))
    close_quiet(app, last + QUIET_MS)
    assert store.current_trip(conn, "car1") is None and built == []  # it closed the trip, and answered nobody


def test_ingest_to_summary_and_sensors(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    cur, out = refresh(make_app(env), "car1", now - 200_000, now)
    assert cur is None and out["last_trip"]["from"] == "Home" and out["last_trip"]["distance_m"] == 1000 and len(out["trips"]) == 1
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car1/trip_event")] == ["ended"]
    n = len(mqtt.msgs)
    assert refresh(make_app(env), "car1", None, now)[1]["rev"] == out["rev"]
    assert len(mqtt.msgs) == n  # nothing newly closed, nothing published


@pytest.mark.parametrize("age_ms, events", [(3_600_000, 1), (3_600_001, 0), (3 * DAY, 0), (600_000, 1)])
def test_ended_event_only_for_closes_within_an_hour_of_arrival(env, age_ms, events):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, trip_samples(now - age_ms - 110_000), now)  # the trip ended age_ms before arrival
    refresh(make_app(env), "car1", None, now)
    assert len(mqtt.on("car_insights/car1/trip_event")) == events
    assert mqtt.on("car_insights/car1/last_trip")[0][0]["distance_km"] == 1.0  # the state follows every close


def test_old_charge_publishes_state_but_no_event(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, [s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(3_600_000, "battery_wh", 25_000.0),
                                  s(3_700_000, "plugged", False)], now)
    refresh(make_app(env), "car1", None, now)
    assert mqtt.on("car_insights/car1/charge_event") == [] and mqtt.on("car_insights/car1/last_charge")[0][0]["added_kwh"] == 5.0


def test_empty_vehicle(env):
    conn, mqtt, d, sensors, totals = env
    cur, out = refresh(make_app(env), "nobody", None, 1000)
    assert cur is None and out["last_trip"] is None and out["trips"] == [] and mqtt.msgs == []


def open_trip_samples(t0, secs):
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, 1000)]]


def test_current_trip_comes_with_every_refresh_and_never_moves_the_summary_rev(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, open_trip_samples(now - 300_000, 30), now)
    cur1, sum1 = refresh(make_app(env), "car1", None, now - 270_000)
    db.ingest(conn, "car1", SRC, [s(now - 300_000 + t, "speed", 10.0) for t in range(31_000, 91_000, 1000)], now)
    cur2, sum2 = refresh(make_app(env), "car1", now - 269_000, now - 200_000)
    assert cur1["end"] is None and cur2["distance_m"] > cur1["distance_m"]
    assert "current_trip" not in sum1 and sum1["rev"] == sum2["rev"]  # the open trip is not part of the summary
    assert sum1["today"]["distance_m"] == 0 and sum1["trips"] == []


def test_lists_hold_the_newest_20_and_the_week_only_its_own_days(env):
    conn, mqtt, d, sensors, totals = env
    now = 30 * DAY + 43_200_000
    for i in range(22):  # one trip a day, the oldest 22 days before now
        db.ingest(conn, "car1", SRC, trip_samples(now - (i + 1) * DAY + 3_600_000), now)
    _, out = refresh(make_app(env), "car1", None, now)
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
    refresh(make_app(env), "car1", None, now)
    [(ev, _)] = mqtt.on("car_insights/car1/charge_event")
    assert ev["added_wh"] == 23_370 and ev["energy_source"] == "soc_estimate"
    db.ingest(conn, "car1", SRC, [s(now - 600_000, "battery_wh", 46_550.0)], now)
    refresh(make_app(env), "car1", now - 600_000, now)
    assert len(mqtt.on("car_insights/car1/charge_event")) == 1  # the refinement is no new event
    assert mqtt.on("car_insights/car1/last_charge")[-1][0]["added_kwh"] == 24.05  # but the state follows it


def test_refresh_publishes_group_of_vehicle(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES('car1','x')")
    access.set_vehicle(conn, "car1", gid, [])
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(make_app(env), "car1", now - 200_000, now)
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert mqtt.on(f"car_insights/group_{gid}/totals")[-1][0]["month_distance"] == 1.0


def test_refresh_without_group_or_change_publishes_no_group_totals(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    gid = access.create_group(conn, "Fleet")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(make_app(env), "car1", now - 200_000, now)
    assert mqtt.on("car_insights/car1/totals") and not [t for t in mqtt.topics if "group_" in t]
    n = len(mqtt.msgs)
    refresh(make_app(env), "car1", None, now)
    assert len(mqtt.msgs) == n  # nothing closed or changed: no totals either


def test_rebuild_restores_rows_and_totals_after_an_algo_bump_before_any_ingest(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):  # car2 has nothing to derive
        conn.execute("INSERT INTO vehicles(vehicle_id) VALUES(?)", (vid,))
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(make_app(env), "car1", None, now)
    conn.execute("UPDATE trips SET algo=algo-1")  # what an install from before the bump holds
    d2 = Deriver(conn, lambda la, lo: "Home")  # the restart
    d2.purge_stale()
    totals.publish_vehicle("car1")
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 0 and mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 0.0
    rebuild(make_app(env, d2), now)
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE vehicle_id='car1'").fetchone()[0] == 1
    totals.publish_vehicle("car1")
    assert mqtt.on("car_insights/car1/totals")[-1][0]["month_distance"] == 1.0
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # only the original one: a rebuild fires no events


def test_rebuild_purges_stale_rows_itself(env):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(make_app(env), "car1", None, now)
    conn.execute("UPDATE trips SET algo=algo-1, distance_m=-1")  # a row the old derivation got wrong
    rebuild(make_app(env, Deriver(conn, lambda la, lo: "Home", CAP)), now)  # the restart
    assert [t["distance_m"] for t in store.closed(conn, TRIP, "car1")] == [1000]


def test_rebuild_logs_duration(env, caplog):
    conn, mqtt, d, sensors, totals = env
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    with caplog.at_level("INFO", logger="custom_components.car_insights.core.pipeline"):
        rebuild(make_app(env, d), 10_000_000)
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
    rebuild(make_app(env, Boom(conn, lambda la, lo: "Home")), now)
    assert [r[0] for r in conn.execute("SELECT DISTINCT vehicle_id FROM trips")] == ["car2"]


def test_a_quiet_car_closes_its_trip_at_the_first_p_sample_with_an_event(env, monkeypatch):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000  # parked, then the ignition-off batch never came
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    db.ingest(conn, "car1", "ha_entities-0000abcd", [], last + QUIET_MS)  # a cloud report proves nothing about the car
    calls, real = [], ingested
    monkeypatch.setattr(pipeline, "ingested", lambda app, vid, min_t, received: calls.append(received) or real(app, vid, min_t, received))
    app = make_app(env)
    pipeline.ingested(app, "car1", None, last)
    close_quiet(app, last + QUIET_MS - 1)
    assert len(calls) == 1 and store.current_trip(conn, "car1")["end"] is None  # not quiet long enough
    close_quiet(app, last + QUIET_MS)
    assert store.current_trip(conn, "car1") is None and store.closed(conn, TRIP, "car1")[0]["end"] == last
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1
    close_quiet(app, last + 2 * QUIET_MS)
    assert len(calls) == 2  # nothing open any more


def test_close_quiet_survives_one_vehicle_failing(env, monkeypatch):
    conn, _, d, *_ = env
    for vid in ("car1", "car2"):
        db.ingest(conn, vid, SRC, open_trip_samples(0, 30), 0)
        d.update(vid, None, 0)
    seen = []

    def boom(app, vid, min_t, received):
        seen.append(vid)
        if vid == "car1":
            raise RuntimeError("boom")

    monkeypatch.setattr(pipeline, "ingested", boom)
    close_quiet(make_app(env), QUIET_MS)
    assert sorted(seen) == ["car1", "car2"]


def test_rebuild_publishes_the_trip_it_closed_but_no_event(env):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000
    conn.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    refresh(make_app(env), "car1", None, last)
    rebuild(make_app(env, Deriver(conn, lambda la, lo: "Home")), last + QUIET_MS)  # the restart finds the car quiet
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["end"] == last
    assert mqtt.on("car_insights/car1/trip_event") == []


def test_republish(env, caplog):
    conn, mqtt, d, sensors, totals = env
    now = 10_000_000
    for vid in ("car1", "car2"):
        conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES(?,?)", (vid, vid))
        db.ingest(conn, vid, SRC, trip_samples(now - 200_000), now)
        refresh(make_app(env), vid, now - 200_000, now)
    mqtt.msgs.clear()
    republish(make_app(env), ["car1"])
    topics = {t for t, _, _ in mqtt.msgs}
    assert {"car_insights/car1/last_trip", "car_insights/car1/totals"} <= topics
    assert not [t for t in topics if "car2" in t or t.endswith("_event")]
    mqtt.msgs.clear()
    republish(make_app(env), None)
    assert {"car_insights/car1/last_trip", "car_insights/car2/last_trip", "car_insights/car1/totals", "car_insights/car2/totals"} <= {t for t, _, _ in mqtt.msgs}
    mqtt.msgs.clear()
    real = totals.publish_vehicle
    totals.publish_vehicle = lambda vid: 1 / 0 if vid == "car1" else real(vid)
    republish(make_app(env), None)  # logged, not raised, and car2 still goes out
    assert "republish of car1 failed" in caplog.text
    assert "car_insights/car2/totals" in {t for t, _, _ in mqtt.msgs}
    totals.publish_groups = lambda: 1 / 0
    republish(make_app(env), None)
    assert "republish of the groups failed" in caplog.text


def zoned_app(env, lists):
    """an app whose zone cache answers `lists` in turn (an Exception is raised); the derivation asks the same cache"""
    conn = env[0]
    it = iter(lists)
    def fetch():
        r = next(it)
        if isinstance(r, Exception):
            raise r
        return r
    cache = ZoneCache(fetch)
    app = App(conn, Deriver(conn, cache, CAP), env[3], env[4], TZ, CAP, cache, lambda: cache.loaded)
    cache.on_change = partial(pipeline.relabel, app)
    return app, cache


def test_a_renamed_zone_republishes_the_last_trip(env):
    conn, mqtt, *_ = env
    now = 10_000_000
    app, zones = zoned_app(env, [[Zone("Home", 52.0, 5.0, 100)], [Zone("Garage", 52.0, 5.0, 100)]])
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES('car1','car1')")
    zones.refresh()
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(app, "car1", now - 200_000, now)
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["from"] == "Home"
    mqtt.msgs.clear()
    zones.refresh()  # the zone is renamed: stored rows follow, and so does the state
    assert store.closed(conn, TRIP, "car1", 1)[0]["from"] == "Garage"
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["from"] == "Garage"
    assert mqtt.on("car_insights/car1/trip_event") == []  # no event for a rename


def test_a_relabel_that_changes_nothing_publishes_nothing(env):
    conn, mqtt, *_ = env
    now = 10_000_000
    app, zones = zoned_app(env, [[Zone("Home", 52.0, 5.0, 100)], [Zone("Home", 52.0, 5.0, 100), Zone("Work", 52.5, 5.5, 100)]])
    zones.refresh()
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(app, "car1", now - 200_000, now)
    mqtt.msgs.clear()
    zones.refresh()  # a new zone no stored point lies in
    assert mqtt.msgs == []


def test_no_relabel_before_a_zone_list_has_loaded(env):
    conn, mqtt, *_ = env
    now = 10_000_000
    db.ingest(conn, "car1", SRC, trip_samples(now - 200_000), now)
    refresh(make_app(env), "car1", now - 200_000, now)  # the trip is named Home
    app, zones = zoned_app(env, [RuntimeError("down"), [Zone("Work", 52.5, 5.5, 100)]])
    zones.refresh()
    pipeline.relabel(app)  # a spot route after a start-up with no zone list
    assert store.closed(conn, TRIP, "car1", 1)[0]["from"] == "Home"
    zones.refresh()  # the list arrives: now every place follows it
    assert store.closed(conn, TRIP, "car1", 1)[0]["from"] is None


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
    cur, out = refresh(make_app(env), "car1", None, now)
    assert len(out["trips"]) == 2
    for t in out["trips"]:
        assert 2 <= len(t["route"]) <= 48 and all(len(p) == 2 for p in t["route"])
    assert out["last_trip"]["route"] == out["trips"][0]["route"]
    assert cur["end"] is None and 2 <= len(cur["route"]) <= 48


def test_trip_without_stored_route_gets_null(env):
    conn, mqtt, d, sensors, totals = env
    now = 10 * DAY
    db.ingest(conn, "car1", SRC, winding_samples(now - 3_600_000, 80), now)
    refresh(make_app(env), "car1", None, now)  # nothing is open afterwards, so the next refresh derives nothing again
    conn.execute("DELETE FROM trip_routes")
    _, out = refresh(make_app(env), "car1", None, now)
    assert len(out["trips"]) == 1 and out["last_trip"]["route"] is None and out["trips"][0]["route"] is None


def test_summary_carries_capacity(env):
    conn, mqtt, d, sensors, totals = env
    assert refresh(make_app(env), "car1", None, 1000)[1]["capacity_wh"] == 57_000.0


def test_summary_size_with_20_routed_trips(env):
    conn, mqtt, d, sensors, totals = env
    now = routed_env(env, 20)
    _, out = refresh(make_app(env), "car1", None, now)
    assert len(out["trips"]) == 20 and len(json.dumps(out)) < 40_000


def test_a_rejoined_quiet_trip_fires_no_second_event_until_it_closes_for_real(env):
    conn, mqtt, d, sensors, totals = env
    t0 = 10 * DAY
    last = t0 + 31_000
    db.ingest(conn, "car1", SRC, [*open_trip_samples(t0, 30), s(last, "gear", 4.0)], last)
    app = make_app(env)
    ingested(app, "car1", None, last)
    close_quiet(app, last + QUIET_MS)
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # closed by the quiet rule
    back = last + QUIET_MS + 5_000
    db.ingest(conn, "car1", SRC, [s(last + 1000 * i, "gear", 4.0) for i in range(1, 60)] + [s(last + 60_000, "gear", 1.0),
              *[s(last + 60_000 + 1000 * i, "speed", 10.0) for i in range(60)]], back)
    cur, _ = refresh(make_app(env), "car1", last + 1000, back)
    assert cur["start"] == t0 and cur["end"] is None
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # the rejoin is no new close
    db.ingest(conn, "car1", SRC, [s(last + 130_000, "ignition", 2.0)], back + 1000)
    assert refresh(make_app(env), "car1", last + 130_000, back + 1000)[0] is None
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
    d = Deriver(conn, lambda la, lo: "Home")
    rebuild(App(conn, d, TripSensors(conn, FakeMqtt(), CAP), TotalsSensors(conn, FakeMqtt(), TZ), TZ, CAP, lambda la, lo: "Home"), now)
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
    rebuild(make_app(env, Deriver(conn, lambda la, lo: "Home")), now)
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
    rebuild(make_app(env, Deriver(conn, lambda la, lo: "Home")), now)  # the restart
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
    deriver = Deriver(conn, lambda la, lo: None, CAP, spots=lambda la, lo: prices.spot_name_at(conn, la, lo))
    rebuild(App(conn, deriver, TripSensors(conn, FakeMqtt(), CAP), TotalsSensors(conn, FakeMqtt(), TZ), TZ, CAP, lambda la, lo: None), now)
    [charge] = store.closed(conn, CHARGE, "car1")
    assert charge["place"] == "Plaza" and charge["zone"] is None
    assert costs.charge_cost(prices.book(conn, "car1"), charge)["basis"] == "receipt"


# --- cloud-only vehicles ---
CLOUD = "ha_entities-0000abcd"
T0 = 1_700_000_000_000  # invented
MIN = 60_000


def cloud_app(env):
    conn, mqtt, _, sensors, totals = env
    deriver = Deriver(conn, lambda la, lo: "Home", CAP, cloud_only=lambda vid: db.is_cloud_only(conn, vid))
    return make_app(env, deriver), Publisher(conn, mqtt, CAP)


def poll(app, pub, vid, samples, received, known_until):
    """what the poller does: store the samples, then report the poll"""
    db.ingest(app.conn, vid, CLOUD, samples, received)
    pipeline.polled(app, pub, vid, samples, received, known_until)


def test_polled_closes_an_open_cloud_trip_without_new_samples_and_fires_one_event(env):
    conn, mqtt, *_ = env
    app, pub = cloud_app(env)
    db.set_vehicle(conn, "car9", "Invented", True)
    poll(app, pub, "car9", [s(T0 + i * MIN, "odometer_km", v) for i, v in enumerate([1000.0, 1001.0, 1003.0, 1006.0])], T0 + 5 * MIN, T0 + 4 * MIN)
    assert store.current_trip(conn, "car9")["end"] is None and mqtt.on("car_insights/car9/trip_event") == []
    pipeline.polled(app, pub, "car9", [], T0 + 10 * MIN, T0 + 9 * MIN)  # nothing new, not yet ten quiet minutes
    assert store.current_trip(conn, "car9")["end"] is None
    pipeline.polled(app, pub, "car9", [], T0 + 16 * MIN, T0 + 15 * MIN)
    assert store.current_trip(conn, "car9") is None and app.deriver.horizon["car9"] == T0 + 15 * MIN
    assert [e["event_type"] for e, _ in mqtt.on("car_insights/car9/trip_event")] == ["ended"]
    pipeline.polled(app, pub, "car9", [], T0 + 17 * MIN, T0 + 16 * MIN)  # nothing open: no work, no second event
    assert len(mqtt.on("car_insights/car9/trip_event")) == 1 and len(mqtt.on("car_insights/car9/last_trip")) == 1


def test_polled_without_samples_derives_nothing_for_a_car_app_vehicle_or_an_idle_one(env, monkeypatch):
    conn, *_ = env
    app, pub = cloud_app(env)
    db.set_vehicle(conn, "car9", "Invented", True)
    db.set_vehicle(conn, "car1", "Meg", False)
    seen = []
    monkeypatch.setattr(pipeline, "ingested", lambda *a: seen.append(a))
    pipeline.polled(app, pub, "car9", [], T0, T0)  # a cloud-only vehicle with no open trip
    conn.execute("INSERT INTO trips(vehicle_id, start, end, algo, json) VALUES('car1', 1, NULL, 11, '{}')")
    pipeline.polled(app, pub, "car1", [], T0, T0)  # a car-app vehicle: its own senders drive its derivation
    assert seen == []


def test_polled_publishes_live_state_for_cloud_samples(env, monkeypatch):
    conn, mqtt, *_ = env
    app, pub = cloud_app(env)
    db.set_vehicle(conn, "car9", "Invented", True)
    seen = []
    real = pipeline.ingested
    monkeypatch.setattr(pipeline, "ingested", lambda app, vid, min_t, received: seen.append((vid, min_t, received)) or real(app, vid, min_t, received))
    poll(app, pub, "car9", [s(T0 + MIN, "battery_wh", 31_000.0), s(T0, "battery_wh", 30_000.0)], T0 + 2 * MIN, T0 + MIN)
    assert seen == [("car9", T0, T0 + 2 * MIN)]  # from the oldest sample
    assert mqtt.on("car_insights/car9/state")[-1][0]["battery_kwh"] == 31.0
    assert any(t.startswith("homeassistant/") and "car9" in t for t in mqtt.topics)
    assert pub._device["car9"][0] == "Invented"  # the device carries the stored name


def test_rebuild_of_one_vehicle_after_a_kind_switch_replaces_its_trips(env):
    conn, mqtt, *_ = env
    app, pub = cloud_app(env)
    now = 10_000_000
    for vid in ("car1", "car2"):  # both are car-app vehicles at first, with an odometer reading around the drive
        db.set_vehicle(conn, vid, vid, False)
        db.ingest(conn, vid, SRC, [*trip_samples(now - 400_000), s(now - 401_000, "odometer_km", 100.0), s(now - 200_000, "odometer_km", 101.0),
                                   s(now + 700_000, "odometer_km", 101.0)], now)  # the last one proves ten quiet minutes: a rebuild has no horizon
        ingested(app, vid, None, now)
    before = {vid: store.closed(conn, TRIP, vid) for vid in ("car1", "car2")}
    assert "approx" not in before["car1"][0] and before["car1"][0]["style"] is not None and len(before["car2"]) == 1
    db.set_vehicle(conn, "car1", "car1", True)  # the owner switched it to a cloud source
    app.deriver.horizon["car1"] = now  # a horizon of its earlier life must not survive
    rebuild(app, now, ["car1"])
    assert "car1" not in app.deriver.horizon
    (trip,) = store.closed(conn, TRIP, "car1")
    assert trip["approx"] is True and trip["style"] is None and trip["distance_m"] == pytest.approx(1000)
    assert store.series(conn, TRIP, "car1", trip["start"]) is None
    assert store.closed(conn, TRIP, "car2") == before["car2"] and store.series(conn, TRIP, "car2", before["car2"][0]["start"]) is not None
    assert mqtt.on("car_insights/car1/last_trip")[-1][0]["distance_km"] == 1.0  # republished
    assert len(mqtt.on("car_insights/car1/trip_event")) == 1  # the original close only


def test_rebuild_of_named_vehicles_leaves_the_others_stale_rows_alone(env):
    conn, *_ = env
    app, _ = cloud_app(env)
    now = 10_000_000
    for vid in ("car1", "car2"):
        db.ingest(conn, vid, SRC, trip_samples(now - 200_000), now)
        ingested(app, vid, None, now)
    conn.execute("UPDATE trips SET algo=algo-1")
    rebuild(app, now, ["car1"])
    assert [r[0] for r in conn.execute("SELECT vehicle_id FROM trips WHERE algo=(SELECT MAX(algo) FROM trips)")] == ["car1"]
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE vehicle_id='car2'").fetchone()[0] == 1  # not purged for nothing


def test_polled_derives_from_the_late_window_only_but_always_publishes(env, monkeypatch):
    conn, mqtt, *_ = env
    app, pub = cloud_app(env)
    db.set_vehicle(conn, "car9", "Invented", True)
    seen = []
    monkeypatch.setattr(pipeline, "ingested", lambda app, vid, min_t, received: seen.append(min_t))
    now = T0 + 100 * DAY
    poll(app, pub, "car9", [s(now - 40 * DAY, "battery_wh", 30_000.0)], now, now)  # older than the late window
    poll(app, pub, "car9", [s(now + 2 * DAY, "battery_wh", 30_000.0)], now, now)  # stamped in the future
    assert seen == [] and len(mqtt.on("car_insights/car9/state")) == 1  # the old sample is published; a future one is no live state
    poll(app, pub, "car9", [s(now - 2 * DAY, "battery_wh", 31_000.0), s(now - 40 * DAY, "battery_wh", 1.0), s(now + 2 * DAY, "battery_wh", 1.0)], now, now)
    assert seen == [now - 2 * DAY]  # the oldest sample inside the window


def test_rebuild_without_a_horizon_derives_every_cloud_trip(env):
    conn, *_ = env
    app, _ = cloud_app(env)
    db.set_vehicle(conn, "car9", "Invented", True)
    drive = lambda on, lo, hi: [s(on - MIN, "odometer_km", lo), s(on, "ignition", 4), s(on + 20 * MIN, "ignition", 2), s(on + 21 * MIN, "odometer_km", hi)]
    db.ingest(conn, "car9", CLOUD, [*drive(T0, 1000.0, 1010.0), *drive(T0 + 3_600_000, 1010.0, 1020.0), s(T0 + 5_000_000, "odometer_km", 1020.0)], T0 + 6_000_000)
    rebuild(app, T0 + 6_000_000, ["car9"])
    assert [t["start"] for t in store.closed(conn, TRIP, "car9")] == [T0 + 3_600_000, T0] and store.current_trip(conn, "car9") is None


def test_polled_publishes_no_live_state_for_a_car_app_vehicle(env):
    conn, mqtt, *_ = env
    app, pub = cloud_app(env)
    db.set_vehicle(conn, "car1", "Meg", False)  # a car app delivers the live state: a cloud report must not move last_seen
    poll(app, pub, "car1", [s(T0, "soc_percent", 50.0)], T0 + MIN, T0 + MIN)
    assert pub._states == {} and mqtt.on("car_insights/car1/state") == []
