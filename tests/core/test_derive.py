import pytest

from custom_components.car_insights.core import db, derive, store
from custom_components.car_insights.core.derive import ALGO, ESTIMATE_HOLD_MS, Deriver
from custom_components.car_insights.core.kinds import CHARGE, TRIP
from custom_components.car_insights.core.trip_sensors import TripSensors
from custom_components.car_insights.core.trips import QUIET_MS
from conftest import FakeMqtt, ms, paused, plugged_then_cloud, s, seed_charge, seed_trip

DAY = 86_400_000
SRC = "phone-0000abcd"
CLOUD = "ha_entities-0000abcd"


def bare(rows):
    """stored rows as derive builds them: without the looked-up addresses the reads add"""
    return [{k: v for k, v in r.items() if k not in ("from_address", "to_address", "address")} for r in rows]


def trip_samples(t0, step=1000, secs=100):
    """ignition on, drive at 10 m/s for secs, ignition off 10 s later; a speed sample stands for at most 5 s"""
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), s(t0, "gps", [52.0, 5.0]),
            *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, step)],
            s(t0 + secs * 1000, "gps", [52.1, 5.1]), s(t0 + secs * 1000 + 10_000, "ignition", 2.0)]


def setup(*batches, received=0):
    conn = db.connect(":memory:")
    for b in batches:
        db.ingest(conn, "car1", SRC, b, received)
    return conn, Deriver(conn, lambda la, lo: "Home")


def test_closed_trip_stored_and_returned_once():
    conn, d = setup(trip_samples(0))
    trips, charges, _ = d.update("car1", None, 10 * DAY)
    assert charges == [] and len(trips) == 1
    assert trips[0]["from"] == "Home" and trips[0]["to"] == "Home" and trips[0]["end"] == 110_000
    assert trips[0]["duration_s"] == 110 and isinstance(trips[0]["duration_s"], int)
    assert d.update("car1", None, 10 * DAY) == ([], [], set())
    stored = bare(store.closed(conn, TRIP, "car1", 10))
    assert len(stored) == 1 and stored[0]["from"] == "Home" and stored[0] == trips[0]
    assert store.current_trip(conn, "car1") is None


def test_trip_row_carries_style():
    (long,) = setup(trip_samples(0, secs=300))[1].update("car1", None, 10 * DAY)[0]  # 3 km: scored
    (short,) = setup(trip_samples(0, secs=150))[1].update("car1", None, 10 * DAY)[0]  # 1.5 km: too short to score
    assert long["style"]["score"] == 100 and short["style"]["score"] is None
    assert long["style"]["bands"]["0-50"] == [3000, None]  # 36 km/h, no battery readings


def test_open_trip_has_style_and_events_are_found_once(monkeypatch):
    found = []
    real = derive.style.events
    monkeypatch.setattr(derive.style, "events", lambda *a, **k: found.append(1) or real(*a, **k))
    ramp = lambda t: 25.0 if t <= 100 else 10.0 if t >= 103 else 25.0 - 5 * (t - 100)  # 5 m/s2 for 3 s: one hard brake
    conn, d = setup([s(0, "gear", 1.0), *[s(t, "speed", ramp(t / 1000)) for t in range(0, 200_001, 200)]])
    d.update("car1", None, 1000)
    cur = store.current_trip(conn, "car1")
    assert cur["end"] is None and cur["style"]["brake"][0] == 1 and len(found) == 1
    assert store.series(conn, TRIP, "car1", cur["start"])["events"] == [[2.5, "brake"]]


def test_open_trip_tail_in_p_closes_once_the_car_is_quiet():
    parked = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)], s(62_000, "gear", 4.0)]
    conn, d = setup(parked)  # ingested at 0
    assert d.update("car1", None, QUIET_MS - 1) == ([], [], set()) and store.current_trip(conn, "car1")["end"] is None
    trips, _, _ = d.update("car1", None, QUIET_MS)
    assert [t["end"] for t in trips] == [62_000] and store.current_trip(conn, "car1") is None


def test_quiet_closed_trip_rejoins_when_backlog_arrives():
    parked = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)], s(62_000, "gear", 4.0)]
    conn, d = setup(parked)  # the car's last batch arrived at 0; the server was down for 12 min
    trips, _, _ = d.update("car1", None, 720_000)
    assert [t["end"] for t in trips] == [62_000] and store.current_trip(conn, "car1") is None
    backlog = [*[s(t, "gear", 4.0) for t in range(63_000, 243_000, 1000)], s(243_000, "gear", 1.0),
               *[s(t, "speed", 10.0) for t in range(243_000, 543_000, 1000)]]
    db.ingest(conn, "car1", SRC, backlog, 730_000)
    assert d.update("car1", 63_000, 730_000) == ([], [], set())  # an open trip again: no close, no refinement
    assert store.closed(conn, TRIP, "car1") == []
    cur = store.current_trip(conn, "car1")
    assert cur["start"] == 0 and cur["end"] is None and "quiet_closed" not in cur
    assert d.update("car1", None, 740_000) == ([], [], set())  # the car is back: not closed again


def test_quiet_closed_trip_stays_closed_while_the_car_is_still_quiet():
    parked = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)], s(62_000, "gear", 4.0)]
    conn, d = setup(parked)
    (trip,), _, _ = d.update("car1", None, 720_000)
    assert "quiet_closed" not in trip and "quiet_closed" not in store.closed(conn, TRIP, "car1")[0]
    db.ingest(conn, "car1", CLOUD, [s(800_000, "charging_state", False)], 900_000)  # a cloud report is not the car
    assert d.update("car1", None, 900_000) == ([], [], set()) and store.current_trip(conn, "car1") is None


def test_open_trip_is_current_not_stored():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    assert d.update("car1", None, 61_000) == ([], [], set())
    cur = store.current_trip(conn, "car1")
    assert cur["start"] == 0 and cur["end"] is None and cur["distance_m"] == 600
    assert store.closed(conn, TRIP, "car1", 10) == []
    assert store.current_trip(conn, "nobody") is None


def test_late_batch_rederives_once():
    a, b = trip_samples(0, step=10_000), trip_samples(DAY, step=10_000)
    conn, d = setup(a, b)
    d.update("car1", None, 10 * DAY)
    before = {t["start"]: t for t in bare(store.closed(conn, TRIP, "car1", 10))}
    assert len(before) == 2
    late = [s(t, "speed", 10.0) for t in range(5_000, 100_000, 10_000)]
    db.ingest(conn, "car1", SRC, late, 0)
    trips, charges, _ = d.update("car1", 5_000, 10 * DAY)
    after = {t["start"]: t for t in bare(store.closed(conn, TRIP, "car1", 10))}
    assert len(after) == 2 and charges == []
    assert after[0]["distance_m"] > before[0]["distance_m"]
    assert after[DAY] == before[DAY]
    assert trips == [after[0]]
    assert d.update("car1", None, 10 * DAY) == ([], [], set())


def test_late_batch_changing_nothing_republishes_nothing():
    conn, d = setup(trip_samples(0), trip_samples(DAY))
    d.update("car1", None, 10 * DAY)
    db.ingest(conn, "car1", SRC, [s(DAY + 500, "speed", 10.0)], 0)
    trips, _, _ = d.update("car1", DAY + 500, 10 * DAY)
    assert [t["start"] for t in store.closed(conn, TRIP, "car1", 10)] == [DAY, 0]  # newest first
    assert trips == []  # the extra sample splits a step without changing the trip


def test_open_trip_rebuilt_after_restart():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    d.update("car1", None, 61_000)
    cur = store.current_trip(conn, "car1")
    d2 = Deriver(conn, lambda la, lo: "Home")
    d2.purge_stale()
    assert store.current_trip(conn, "car1") == cur  # persisted, no update needed
    d2.update("car1", None, 61_000)
    assert store.current_trip(conn, "car1") == cur


def test_algo_change_clears_rows():
    conn, d = setup(trip_samples(0))
    d.update("car1", None, 10 * DAY)
    conn.execute("UPDATE trips SET algo=?", (ALGO - 1,))
    d2 = Deriver(conn, lambda la, lo: "Home")
    d2.purge_stale()
    assert store.closed(conn, TRIP, "car1", 10) == []
    trips, _, _ = d2.update("car1", None, 10 * DAY)
    assert len(trips) == 1 and len(store.closed(conn, TRIP, "car1", 10)) == 1


def test_late_batch_inside_open_trip_keeps_trip_start():
    conn, d = setup([s(200_000, "battery_wh", 20_000.0), s(201_000, "plugged", True),
                     s(500_000, "battery_wh", 25_000.0), s(600_000, "plugged", False)])  # under QUIET_MS apart: the open trip stays open
    d.update("car1", None, DAY)  # a later charge is stored, so the batches below take the late path
    db.ingest(conn, "car1", SRC, [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 51_000, 1000)]], 0)
    d.update("car1", 0, DAY)
    assert store.current_trip(conn, "car1")["start"] == 0
    db.ingest(conn, "car1", SRC, [*[s(t, "speed", 10.0) for t in range(51_000, 100_001, 1000)],
                                   s(100_000, "gear", 4.0), s(110_000, "ignition", 2.0)], 0)
    trips, _, _ = d.update("car1", 51_000, DAY)
    (t,) = bare(store.closed(conn, TRIP, "car1", 10))
    assert t["start"] == 0 and t["distance_m"] == 1000 and trips == [t]
    assert len(store.closed(conn, CHARGE, "car1", 10)) == 1 and store.current_trip(conn, "car1") is None


def _plug_before_ignition_off():
    return [s(0, "ignition", 4.0), s(0, "gear", 1.0), s(0, "battery_wh", 20_000.0),
            *[s(t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(100_000, "gear", 4.0), s(100_000, "gps", [52.0, 5.0]),
            s(120_000, "plugged", True), s(150_000, "ignition", 2.0)]


def _unplug_after_charge():
    return [s(3_600_000, "battery_wh", 30_000.0), s(3_700_000, "plugged", False)]


def test_charge_plugged_before_ignition_off_survives():
    conn, d = setup(_plug_before_ignition_off())
    trips, charges, _ = d.update("car1", None, DAY)
    assert trips[0]["end"] == 150_000 and charges == []
    db.ingest(conn, "car1", SRC, _unplug_after_charge(), 0)
    _, charges, _ = d.update("car1", None, DAY)
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    assert charges == [c] and c["start"] == 120_000 and c["added_wh"] == 10_000 and len(store.closed(conn, TRIP, "car1", 10)) == 1


def test_open_charge_survives_restart():
    conn, d = setup(_plug_before_ignition_off())
    d.update("car1", None, DAY)
    d = Deriver(conn, lambda la, lo: "Home")
    d.purge_stale()
    db.ingest(conn, "car1", SRC, _unplug_after_charge(), 0)
    d.update("car1", None, DAY)
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    assert c["start"] == 120_000 and c["added_wh"] == 10_000


def test_open_trip_row_not_listed_or_newly_closed():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    assert d.update("car1", None, 61_000) == ([], [], set())
    assert d.update("car1", None, 62_000) == ([], [], set())
    assert store.closed(conn, TRIP, "car1", 10) == []
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE end IS NULL").fetchone()[0] == 1
    db.ingest(conn, "car1", SRC, [s(70_000, "ignition", 2.0)], 0)
    trips, _, _ = d.update("car1", None, 70_000)
    assert len(trips) == 1 and store.current_trip(conn, "car1") is None
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 1


def test_stale_algo_in_one_table_rebuilds_both():
    conn, d = setup(_plug_before_ignition_off(), _unplug_after_charge())
    d.update("car1", None, DAY)
    assert len(store.closed(conn, TRIP, "car1", 10)) == 1 and len(store.closed(conn, CHARGE, "car1", 10)) == 1
    conn.execute("UPDATE trips SET algo=?", (ALGO - 1,))
    Deriver(conn, lambda la, lo: "Home").purge_stale()
    assert store.closed(conn, TRIP, "car1", 10) == [] and store.closed(conn, CHARGE, "car1", 10) == []


def test_late_batch_extends_trip_earlier_dropped_as_noise():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 6_000, 1000)], s(20_000, "ignition", 2.0)], trip_samples(DAY))
    d.update("car1", None, 10 * DAY)  # the early 50 m / 20 s trip is noise; the later trip makes the next batch late
    db.ingest(conn, "car1", SRC, [s(t, "speed", 10.0) for t in range(6_000, 16_000, 1000)], 0)
    trips, _, _ = d.update("car1", 6_000, 10 * DAY)
    assert [(t["start"], t["distance_m"]) for t in trips] == [(0, 150)]


def test_charge_stored_with_place():
    conn, d = setup([s(0, "battery_wh", 20_000.0), s(0, "gps", [52.0, 5.0]), s(1000, "plugged", True),
                     s(3_600_000, "battery_wh", 25_000.0), s(3_700_000, "plugged", False)])
    trips, charges, _ = d.update("car1", None, 10 * DAY)
    assert trips == [] and len(charges) == 1
    c = charges[0]
    assert c["place"] == "Home" and c["added_wh"] == 5000 and c["end"] == 3_700_000 and "fix" not in c
    assert bare(store.closed(conn, CHARGE, "car1", 10)) == charges
    assert d.update("car1", None, 10 * DAY) == ([], [], set())


def test_charge_row_keeps_point_zone_and_spot():
    samples = [s(0, "battery_wh", 20_000.0), s(0, "gps", [52.0, 5.0]), s(1000, "plugged", True),
               s(3_600_000, "battery_wh", 25_000.0), s(3_700_000, "plugged", False)]

    def charge(zones, spots, samples=samples):
        conn = db.connect(":memory:")
        db.ingest(conn, "car1", SRC, samples, 0)
        c = Deriver(conn, zones, spots=spots).update("car1", None, 10 * DAY)[1][0]
        return c["lat"], c["lon"], c["zone"], c["place"]

    assert charge(lambda la, lo: None, lambda la, lo: "Plaza") == (52.0, 5.0, None, "Plaza")
    assert charge(lambda la, lo: "Work", lambda la, lo: "Plaza") == (52.0, 5.0, "Work", "Work")
    assert charge(lambda la, lo: "Work", lambda la, lo: "Plaza", [s(0, "battery_wh", 20_000.0), *samples[2:]]) == (None,) * 4


def test_open_charge_not_stored():
    conn, d = setup([s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(60_000, "battery_wh", 21_000.0)])
    assert d.update("car1", None, 10 * DAY) == ([], [], set())
    assert store.closed(conn, CHARGE, "car1", 10) == []
    assert conn.execute("SELECT COUNT(*) FROM charges WHERE end IS NULL").fetchone()[0] == 1


def test_backlog_boundary_in_p_stop_keeps_one_trip():
    now = 3 * DAY  # backlog arrives days later, so the first batch's trailing P stop looks like a closed trip
    b1 = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 60_001, 1000)], s(60_000, "gear", 4.0)]
    conn, d = setup(b1, received=now)
    first, _, _ = d.update("car1", 0, now)
    assert first == [] and store.current_trip(conn, "car1")["start"] == 0  # no later sample proves the stop, and the car is still sending
    b2 = [s(120_000, "gps", [52.0, 5.0]), s(150_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(150_000, 300_001, 1000)],
          s(300_000, "gear", 4.0), s(310_000, "ignition", 2.0)]
    db.ingest(conn, "car1", SRC, b2, now)
    trips, _, _ = d.update("car1", 120_000, now)
    stored = bare(store.closed(conn, TRIP, "car1", 10))
    assert [(t["start"], t["end"]) for t in stored] == [(0, 310_000)] and trips == stored


def test_derive_after_distant_closed_trip_does_not_rederive_it():
    conn, d = setup(trip_samples(0))
    d.update("car1", None, 10 * DAY)
    db.ingest(conn, "car1", SRC, [s(DAY, "speed", 10.0)], 0)
    d.update("car1", DAY, 10 * DAY)
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE end=110000").fetchone()[0] == 1


def test_backlog_boundary_in_long_p_stop_keeps_one_trip():
    now = 3 * DAY  # P with ignition on for 4 min, a gps fix every minute, the batch boundary falls inside the stop
    b1 = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 60_001, 1000)], s(60_000, "gear", 4.0),
          *[s(t, "gps", [52.0, 5.0]) for t in range(120_000, 300_001, 60_000)]]
    conn, d = setup(b1, received=now)
    first, _, _ = d.update("car1", 0, now)
    assert first == []
    b2 = [s(310_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(310_000, 400_001, 1000)],
          s(400_000, "gear", 4.0), s(410_000, "ignition", 2.0)]
    db.ingest(conn, "car1", SRC, b2, now)
    trips, _, _ = d.update("car1", 310_000, now)
    stored = bare(store.closed(conn, TRIP, "car1", 10))
    assert [(t["start"], t["end"]) for t in stored] == [(0, 410_000)] and trips == stored


def test_open_trip_below_the_noise_floor_is_current_but_dropped_once_closed():
    slow = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 1.0) for t in range(0, 20_001, 1000)]]  # 20 m in 20 s
    conn, d = setup(slow)
    assert d.update("car1", None, 20_000) == ([], [], set())
    cur = store.current_trip(conn, "car1")
    assert cur["start"] == 0 and cur["end"] is None and cur["distance_m"] == 20
    db.ingest(conn, "car1", SRC, [s(21_000, "ignition", 2.0)], 0)
    assert d.update("car1", None, 21_000) == ([], [], set())
    assert store.current_trip(conn, "car1") is None and store.closed(conn, TRIP, "car1", 10) == []


def test_open_charge_closed_by_the_next_trip_is_stored():
    conn, d = setup([s(0, "plugged", True), s(0, "battery_wh", 30000.0), s(500_000, "battery_wh", 40000.0),
                     s(600_000, "ignition", 4.0), s(600_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(600_000, 700_001, 1000)]])
    trips, charges, _ = d.update("car1", None, DAY)  # the unplug was never seen
    (c,) = charges
    assert (c["start"], c["end"], c["added_wh"]) == (0, 600_000, 10000) and trips == []
    assert store.current_trip(conn, "car1")["start"] == 600_000 and bare(store.closed(conn, CHARGE, "car1", 10)) == [c]


def test_samples_beyond_the_future_slack_are_ignored():
    received = 1_000_000
    far = trip_samples(received + 2 * DAY)
    conn, d = setup(far, trip_samples(received - 500_000))
    trips, _, _ = d.update("car1", None, received)
    assert [t["start"] for t in trips] == [received - 500_000]
    assert store.current_trip(conn, "car1") is None


def test_stale_row_cleanup_is_atomic():
    conn, _ = setup()
    seed_trip(conn, "car1", 1, 2, algo=ALGO - 1)
    seed_charge(conn, "car1", 1, 2, algo=ALGO - 1)

    class FailOnCharges:
        def __init__(self, c):
            self._c = c

        def __getattr__(self, n):
            return getattr(self._c, n)

        def execute(self, sql, *a):
            if sql.startswith("DELETE FROM charges"):
                raise RuntimeError("boom")
            return self._c.execute(sql, *a)

    with pytest.raises(RuntimeError):
        Deriver(FailOnCharges(conn), lambda la, lo: None).purge_stale()
    assert not conn.in_transaction
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 1  # the trips delete was rolled back


def test_constructor_deletes_nothing():
    conn, _ = setup()
    seed_trip(conn, "car1", 1, 2, series={}, route=[], algo=ALGO - 1)
    seed_charge(conn, "car1", 3, 4, series={}, algo=ALGO - 1)
    Deriver(conn, lambda la, lo: "Home")
    assert [_count(conn, t) for t in ("trips", "trip_series", "trip_routes", "charges", "charge_series")] == [1] * 5


def test_purge_stale_deletes_old_algo_rows():
    conn, d = setup()
    seed_trip(conn, "old", 1, 2, series={}, route=[], algo=ALGO - 1)  # a vehicle with any old row is rebuilt whole,
    seed_charge(conn, "old", 3, 4, series={})  # current ones included
    seed_trip(conn, "cur", 1, 2, series={}, route=[])
    seed_charge(conn, "cur", 3, 4, series={})
    d.purge_stale()
    tables = ("trips", "trip_series", "trip_routes", "charges", "charge_series")
    assert [_count(conn, t, "old") for t in tables] == [0] * 5
    assert [_count(conn, t, "cur") for t in tables] == [1] * 5


def _spy_samples_after(monkeypatch, seen, what):
    real = db.samples_after
    monkeypatch.setattr(db, "samples_after", lambda conn, vid, after_t, max_t, keys: (seen.append(what(after_t, keys)), real(conn, vid, after_t, max_t, keys))[1])


def _spy_window(monkeypatch, seen):
    """records the window start of every update"""
    real = Deriver._window_start
    monkeypatch.setattr(Deriver, "_window_start", lambda self, *a: seen.append(real(self, *a)) or seen[-1])


def test_parked_car_update_reads_only_new_samples(monkeypatch):
    seen = []
    _spy_window(monkeypatch, seen)
    conn, d = setup([s(1000, "gps", [52.0, 5.0]), s(61_000, "gps", [52.0, 5.0])])
    d.update("car1", None, 100_000)
    db.ingest(conn, "car1", SRC, [s(121_000, "gps", [52.0, 5.0])], 0)
    d.update("car1", 121_000, 130_000)
    db.ingest(conn, "car1", SRC, [s(181_000, "gps", [52.0, 5.0])], 0)
    d.update("car1", 181_000, 190_000)
    assert seen == [-1, 61_000, 121_000]  # idle: the window starts at the newest sample already processed


def test_late_data_below_the_idle_watermark_rederives_the_closed_trip():
    conn, d = setup(trip_samples(0), [s(DAY, "gps", [52.0, 5.0])])
    d.update("car1", None, 10 * DAY)
    db.ingest(conn, "car1", SRC, [s(50_500, "speed", 20.0)], 0)  # inside the closed trip, below the watermark
    before = store.closed(conn, TRIP, "car1")[0]["distance_m"]
    trips, _, _ = d.update("car1", 50_500, 10 * DAY)
    assert [t["start"] for t in trips] == [0] and trips[0]["distance_m"] > before


def test_no_watermark_while_a_segment_is_open(monkeypatch):
    seen = []
    _spy_window(monkeypatch, seen)
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    d.update("car1", None, 61_000)
    db.ingest(conn, "car1", SRC, [s(t, "speed", 10.0) for t in range(61_000, 70_000, 1000)], 0)
    d.update("car1", 61_000, 70_000)
    assert seen == [-1, -1]  # the open trip is re-read from its start


def test_derivation_loads_only_the_keys_it_uses(monkeypatch):
    from custom_components.car_insights.core import derive
    seen = []
    _spy_samples_after(monkeypatch, seen, lambda after_t, keys: keys)
    conn, d = setup(trip_samples(0), [s(5000, "soc", 50.0), s(5000, "tire_pressure", 2.5)])
    trips, _, _ = d.update("car1", None, 10 * DAY)
    assert len(trips) == 1 and seen == [derive.KEYS]
    assert {"gear", "ignition", "speed", "battery_wh", "outside_temp", "gps", "plugged", "range_m", "charging_state", "soc_percent", "plug_state",
            "odometer_km"} == set(derive.KEYS)  # odometer_km: the cloud-only trips


def test_has_ignition_is_looked_up_until_it_is_true(monkeypatch):
    calls = []
    real = db.has_key
    monkeypatch.setattr(db, "has_key", lambda *a: (calls.append(a[2]) if a[2] == "ignition" else None, real(*a))[1])
    conn, d = setup([s(0, "gps", [52.0, 5.0])])
    d.update("car1", None, 100_000)
    d.update("car1", None, 100_000)
    assert calls == ["ignition", "ignition"]  # still false: asked again
    db.ingest(conn, "car1", SRC, [s(1000, "ignition", 4.0)], 0)
    d.update("car1", 1000, 100_000)
    d.update("car1", None, 100_000)
    d.update("car1", None, 100_000)
    assert calls == ["ignition"] * 3  # true from now on: remembered


def test_stored_rows_since_a_start_time_newest_first_and_limited():
    conn, d = setup(trip_samples(0), trip_samples(DAY), trip_samples(2 * DAY))
    d.update("car1", None, 10 * DAY)
    assert [t["start"] for t in store.closed(conn, TRIP, "car1")] == [2 * DAY, DAY, 0]
    assert [t["start"] for t in store.closed(conn, TRIP, "car1", since=DAY)] == [2 * DAY, DAY]
    assert [t["start"] for t in store.closed(conn, TRIP, "car1", 1, since=DAY)] == [2 * DAY]


def test_window_start_late_data_goes_back_to_the_newest_end_below_it():
    conn, d = setup()
    seed_trip(conn, "car1", 0, 100)
    seed_trip(conn, "car1", 200, 300)
    assert d._window_start("car1", None, 400) == 300  # the newest closed end
    assert d._window_start("car1", 301, 400) == 300  # data after it needs no going back
    assert d._window_start("car1", 300, 400) == 100 and d._window_start("car1", 150, 400) == 100
    assert d._window_start("car1", 50, 400) == -1  # nothing closed before it: from the start
    d._idle["car1"] = 350  # an idle vehicle resumes at its watermark
    assert d._window_start("car1", None, 400) == 350 and d._window_start("car1", 150, 400) == 100


def test_window_start_holds_a_recent_estimate_and_lets_go_of_an_old_one():
    conn, d = setup()
    seed_charge(conn, "car1", 1000, 5000, energy_source="soc_estimate", start_wh=20_000.0)
    assert d._window_start("car1", None, 6000) == 999  # re-derived from its start
    assert d._window_start("car1", None, 5000 + ESTIMATE_HOLD_MS) == 999
    assert d._window_start("car1", None, 5000 + ESTIMATE_HOLD_MS + 1) == 5000
    conn.execute("DELETE FROM charges")
    seed_charge(conn, "car1", 1000, 5000, energy_source="soc_estimate", start_wh=None)  # no car reading to refine it with
    assert d._window_start("car1", None, 6000) == 5000
    conn.execute("DELETE FROM charges")
    seed_charge(conn, "car1", 1000, 5000, energy_source="car", start_wh=20_000.0)
    assert d._window_start("car1", None, 6000) == 5000


def test_window_start_quiet_closed_trip_rejoins_only_once_the_car_is_back():
    conn, d = setup(trip_samples(0), received=0)  # the car's last batch arrived at 0
    seed_trip(conn, "car1", 0, 100)
    seed_trip(conn, "car1", 3000, 5000)
    d._quiet["car1"] = 3000  # that trip was closed by the quiet rule alone
    assert d._window_start("car1", None, QUIET_MS) == 5000 and d._quiet == {"car1": 3000}  # still quiet
    assert d._window_start("car1", None, QUIET_MS - 1) == 2999 and d._quiet == {}  # back: re-derive it from its start
    assert d._window_start("car1", None, QUIET_MS - 1) == 5000


def test_window_start_never_cuts_a_stored_segment_in_two():
    conn, d = setup()
    seed_trip(conn, "car1", 0, 900)
    seed_charge(conn, "car1", 500, None)  # plugged before the trip ended: open, and begins inside it
    assert d._window_start("car1", None, 1000) == -1  # before the charge's start, which is inside the trip: before the trip's too
    conn.execute("DELETE FROM charges")
    conn.execute("DELETE FROM trips")
    seed_charge(conn, "car1", 1000, 5000, energy_source="soc_estimate", start_wh=20_000.0)  # held: the window goes back to 999
    seed_trip(conn, "car1", 800, 1500)  # ...into this trip
    assert d._window_start("car1", None, 6000) == 799


def test_stale_plugged_seed_after_forced_close_opens_no_session():
    conn, d = setup([s(0, "gear", 4.0), s(0, "ignition", 2.0), s(0, "battery_wh", 20000.0), s(1000, "plugged", True),
                     s(3_600_000, "battery_wh", 30000.0)])
    d.update("car1", 0, DAY)  # a charge is open; the unplug is never seen
    db.ingest(conn, "car1", SRC, [s(4_000_000, "ignition", 4.0), s(4_000_000, "gear", 1.0),
                                  *[s(t, "speed", 10.0) for t in range(4_000_000, 4_100_001, 1000)],
                                  s(4_100_000, "gear", 4.0), s(4_110_000, "ignition", 2.0)], 0)
    d.update("car1", 4_000_000, DAY)  # the trip start closes the charge, the trip ends
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    assert c["end"] == 4_000_000 and len(store.closed(conn, TRIP, "car1", 10)) == 1
    db.ingest(conn, "car1", SRC, [s(t, "speed", 0.0) for t in range(4_200_000, 4_500_000, 60_000)] + [s(4_500_000, "battery_wh", 30150.0)], 0)
    d.update("car1", 4_200_000, DAY)  # parked, +150 Wh: the stale plugged flag must not make that a charge
    db.ingest(conn, "car1", SRC, [s(5_000_000, "ignition", 4.0), s(5_000_000, "gear", 1.0), s(5_001_000, "speed", 10.0)], 0)
    _, charges, _ = d.update("car1", 5_000_000, DAY)
    assert charges == [] and bare(store.closed(conn, CHARGE, "car1", 10)) == [c]


# --- cloud source: a charge the car slept through is estimated from SoC, then refined when the car's value arrives ---
def at(hms):
    return ms(f"2026-10-23T{hms}+02:00")


def _sleep_day():
    """returns (car samples, cloud samples) around a 09:13-11:21 charge the car slept through"""
    return ([s(at("09:09:35"), "battery_wh", 22_500.0), s(at("09:09:40"), "gear", 4.0)],
            [s(at("09:13:32"), "charging_state", True), s(at("09:13:32"), "soc_percent", 40.0),
             s(at("11:21:29"), "soc_percent", 81.0), s(at("11:21:29"), "charging_state", False)])


def _wake_drive():
    return [s(at("16:14:43"), "battery_wh", 46_550.0), s(at("16:15:00"), "gear", 1.0),
            *[s(at("16:15:00") + t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(at("16:16:40"), "gear", 4.0)]


def _cloud_setup():
    car, cloud = _sleep_day()
    conn, d = setup(car)
    db.ingest(conn, "car1", CLOUD, cloud, 0)
    return conn, d


def test_cloud_charge_estimate_then_car_value_refines():
    conn, d = _cloud_setup()
    _, charges, refined = d.update("car1", None, at("11:30:00"))
    (c,) = charges
    assert c["energy_source"] == "soc_estimate" and c["added_wh"] == 24_600 and refined == set()
    db.ingest(conn, "car1", SRC, _wake_drive(), 0)
    _, charges, refined = d.update("car1", at("16:14:43"), at("16:20:00"))
    (c2,) = charges
    assert c2["start"] == c["start"] == at("09:13:32") and c2["added_wh"] == 24_050 and c2["energy_source"] == "car"
    assert refined == {("charges", c["start"])}
    assert bare(store.closed(conn, CHARGE, "car1")) == [c2]
    assert d.update("car1", None, at("16:21:00"))[1:] == ([], set())


def test_held_estimate_is_reread_from_its_start_and_sets_no_idle_watermark(monkeypatch):
    seen = []
    _spy_window(monkeypatch, seen)
    conn, d = _cloud_setup()
    d.update("car1", None, at("11:30:00"))
    d.update("car1", None, at("11:31:00"))
    assert seen == [-1, at("09:13:32") - 1]


def test_estimate_older_than_hold_releases_window():
    conn, d = _cloud_setup()
    late = at("11:21:29") + ESTIMATE_HOLD_MS + 60_000
    _, (c,), _ = d.update("car1", None, late)
    assert c["energy_source"] == "soc_estimate"
    db.ingest(conn, "car1", SRC, _wake_drive(), 0)
    _, charges, refined = d.update("car1", at("16:14:43"), late + 3_600_000)
    assert charges == [] and refined == set()
    assert store.closed(conn, CHARGE, "car1")[0]["energy_source"] == "soc_estimate"


def test_cloud_flag_is_looked_up_until_it_is_true(monkeypatch):
    calls = []
    real = db.has_key
    monkeypatch.setattr(db, "has_key", lambda *a: (calls.append(a[2]), real(*a))[1])
    conn, d = setup([s(0, "gps", [52.0, 5.0])])
    d.update("car1", None, 100_000)
    assert calls == ["ignition", "charging_state"]
    db.ingest(conn, "car1", CLOUD, [s(1000, "charging_state", False)], 0)
    d.update("car1", 1000, 100_000)
    d.update("car1", None, 100_000)
    assert calls == ["ignition", "charging_state"] * 2 + ["ignition"]


def test_capacity_callable_scales_the_estimate():
    car, cloud = _sleep_day()
    conn = db.connect(":memory:")
    db.ingest(conn, "car1", SRC, car, 0)
    db.ingest(conn, "car1", CLOUD, cloud, 0)
    d = Deriver(conn, lambda la, lo: "Home", lambda vid: 100_000.0)
    _, (c,), _ = d.update("car1", None, at("11:30:00"))
    assert c["added_wh"] == 41_000


def test_stale_charging_state_seed_after_trip_ignored():
    conn, d = setup([s(0, "gear", 4.0), s(0, "ignition", 2.0), s(0, "battery_wh", 20000.0)])
    db.ingest(conn, "car1", CLOUD, [s(1000, "charging_state", True), s(1000, "soc_percent", 40.0)], 0)
    db.ingest(conn, "car1", SRC, [s(3_600_000, "battery_wh", 30000.0)], 0)
    d.update("car1", 0, DAY)  # a cloud charge is open; the cloud never says False
    db.ingest(conn, "car1", SRC, [s(4_000_000, "ignition", 4.0), s(4_000_000, "gear", 1.0),
                                  *[s(t, "speed", 10.0) for t in range(4_000_000, 4_100_001, 1000)],
                                  s(4_100_000, "gear", 4.0), s(4_110_000, "ignition", 2.0)], 0)
    d.update("car1", 4_000_000, DAY)  # the trip start closes the charge, the trip ends
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    assert c["end"] == 4_000_000 and len(store.closed(conn, TRIP, "car1", 10)) == 1
    db.ingest(conn, "car1", SRC, [s(t, "speed", 0.0) for t in range(4_200_000, 4_500_000, 60_000)] + [s(4_500_000, "battery_wh", 30150.0)], 0)
    d.update("car1", 4_200_000, DAY)  # parked, +150 Wh: the stale charging_state must not make that a charge
    db.ingest(conn, "car1", SRC, [s(5_000_000, "ignition", 4.0), s(5_000_000, "gear", 1.0), s(5_001_000, "speed", 10.0)], 0)
    _, charges, _ = d.update("car1", 5_000_000, DAY)
    assert charges == [] and bare(store.closed(conn, CHARGE, "car1", 10)) == [c]


def _cloud_charge_while_plugged():
    """car plugged at p, a cloud charge p+1 min to p+60 min, car readings around it; the car never reports the unplug"""
    p, m = at("09:00:00"), 60_000
    conn, d = setup([s(p, "plugged", True), s(p, "battery_wh", 20_000.0), s(p + 61 * m, "battery_wh", 40_000.0)])
    db.ingest(conn, "car1", CLOUD, [s(p + m, "charging_state", True), s(p + 60 * m, "charging_state", False)], 0)
    _, charges, _ = d.update("car1", None, p + 2 * 3_600_000)
    assert len(charges) == 1
    return conn, d, p


def test_plugged_seed_after_closed_cloud_charge_opens_nothing():
    conn, d, p = _cloud_charge_while_plugged()
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    db.ingest(conn, "car1", SRC, [s(p + 3 * 3_600_000, "battery_wh", 40_000.0), s(p + 3 * 3_600_000 + 60_000, "battery_wh", 40_010.0)], 0)
    _, charges, _ = d.update("car1", None, p + 4 * 3_600_000)  # still plugged, no new plug sample: the old flag opens nothing
    assert charges == [] and bare(store.closed(conn, CHARGE, "car1", 10)) == [c] and _count(conn, "charges") == 1


def test_resent_plugged_true_after_a_closed_cloud_charge_opens_nothing():
    conn, d, p = _cloud_charge_while_plugged()
    (c,) = bare(store.closed(conn, CHARGE, "car1", 10))
    h = 3_600_000
    db.ingest(conn, "car1", SRC, [s(p + 3 * h, "plugged", True), s(p + 3 * h + 60_000, "battery_wh", 40_010.0)], 0)  # a restart re-sends the flag
    d.update("car1", None, p + 4 * h)
    assert _count(conn, "charges") == 1  # same window as the re-sent flag
    db.ingest(conn, "car1", SRC, [s(p + 5 * h, "plugged", True), s(p + 5 * h + 60_000, "battery_wh", 40_020.0)], 0)
    d.update("car1", None, p + 6 * h)  # the flag is the window's seed now, and sent again
    assert bare(store.closed(conn, CHARGE, "car1", 10)) == [c] and _count(conn, "charges") == 1


def test_resent_plugged_after_a_missed_unplug_and_trip_opens_nothing_after_the_cloud_charge():
    h, m = 3_600_000, 60_000
    conn, d = setup([s(0, "gear", 4.0), s(0, "ignition", 2.0), s(0, "plugged", True), s(0, "battery_wh", 20_000.0)])  # the unplug is never stored
    db.ingest(conn, "car1", SRC, trip_samples(2 * h), 0)
    db.ingest(conn, "car1", SRC, [s(3 * h, "plugged", True), s(3 * h, "battery_wh", 40_000.0), s(4 * h + m, "battery_wh", 50_000.0)], 0)
    db.ingest(conn, "car1", CLOUD, [s(3 * h + m, "charging_state", True), s(4 * h, "charging_state", False)], 0)
    d.update("car1", None, 5 * h)
    assert _count(conn, "charges") == 1  # the cloud charge (the plug before the trip gained nothing)
    db.ingest(conn, "car1", SRC, [s(6 * h, "plugged", True), s(6 * h + m, "battery_wh", 50_010.0)], 0)  # re-sent while still plugged
    d.update("car1", None, 7 * h)
    assert _count(conn, "charges") == 1  # open rows count: no phantom at 6 h


def test_plugged_again_after_a_closed_cloud_charge_still_opens_a_charge():
    conn, d, p = _cloud_charge_while_plugged()
    q = p + 3 * 3_600_000
    db.ingest(conn, "car1", SRC, [s(q - 60_000, "plugged", False), s(q, "plugged", True), s(q, "battery_wh", 40_000.0),
                                  s(q + 30 * 60_000, "battery_wh", 45_000.0), s(q + 31 * 60_000, "plugged", False)], 0)  # a new plug: newer than the closed charge's end
    _, charges, _ = d.update("car1", None, p + 4 * 3_600_000)
    assert [c["start"] for c in charges] == [q] and [c["start"] for c in store.closed(conn, CHARGE, "car1", 10)] == [q, p]


def test_algo_bump_rebuilds():
    conn, d = _cloud_setup()
    d.update("car1", None, at("11:30:00"))
    conn.execute("UPDATE charges SET algo=1")
    d2 = Deriver(conn, lambda la, lo: "Home")
    d2.purge_stale()
    assert store.closed(conn, CHARGE, "car1") == [] and ALGO == 11
    _, charges, _ = d2.update("car1", None, at("11:30:00"))
    assert len(charges) == 1


def test_cloud_sample_is_not_proof_the_car_slept_in_a_p_stop():
    # a P stop, the car goes offline, a cloud SoC report lands 4 min later, then the drive goes on: one trip, no early close
    drive1 = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(1000 + i * 1000, "speed", 15.0) for i in range(600)],
              s(601_000, "speed", 0.0), s(602_000, "gear", 4.0)]
    conn, d = setup(drive1, received=610_000)  # the car's last batch before it went offline
    d.update("car1", None, 610_000)
    db.ingest(conn, "car1", CLOUD, [s(602_000 + 240_000, "soc_percent", 50.0)], 0)
    trips, _, _ = d.update("car1", 842_000, 842_000 + 120_000)
    assert trips == [] and store.current_trip(conn, "car1") is not None
    db.ingest(conn, "car1", SRC, [s(663_000, "gear", 1.0), *[s(664_000 + i * 1000, "speed", 15.0) for i in range(600)],
                                  s(1_300_000, "ignition", 2.0)], 0)
    d.update("car1", 663_000, 1_400_000)
    (t,) = store.closed(conn, TRIP, "car1")
    assert (t["start"], t["end"]) == (1000, 1_300_000)


def test_estimate_with_no_prior_car_reading_cannot_refine_so_is_not_held(monkeypatch):
    seen = []
    _spy_window(monkeypatch, seen)
    conn, d = setup([s(at("09:09:40"), "gear", 4.0)])  # the car never reported battery_wh before the charge
    db.ingest(conn, "car1", CLOUD, _sleep_day()[1], 0)
    _, (c,), _ = d.update("car1", None, at("11:30:00"))
    assert c["energy_source"] == "soc_estimate" and c["start_wh"] is None
    d.update("car1", None, at("11:31:00"))
    assert seen == [-1, at("11:21:29")]  # the second update reads on from the idle watermark, not from the estimate's start


def test_paused_cloud_charge_derives_and_stores_both():
    conn, d = setup(paused(at("09:00:00")))  # used to share one start: IntegrityError, and every update after
    _, charges, _ = d.update("car1", None, at("12:00:00"))
    assert len(charges) == 2 and _count(conn, "charges") == 2


def test_cloud_charge_after_a_car_charge_derives_and_stores_both():
    conn, d = setup(plugged_then_cloud(at("09:00:00")))
    _, charges, _ = d.update("car1", None, at("12:00:00"))
    assert len(charges) == 2 and _count(conn, "charges") == 2


def test_duplicate_start_is_skipped_not_fatal(monkeypatch, caplog):
    conn, d = setup(paused(at("09:00:00")))
    real = derive.find_charges
    monkeypatch.setattr(derive, "find_charges", lambda *a, **k: [c := real(*a, **k)[0], c])
    _, charges, _ = d.update("car1", None, at("12:00:00"))
    assert len(charges) == 1 and _count(conn, "charges") == 1 and _count(conn, "charge_series") == 1
    assert "duplicate charges start" in caplog.text


# --- series rows live and die with their trip/charge rows ---
def _count(conn, table, vid="car1"):
    return conn.execute(f"SELECT COUNT(*) FROM {table} WHERE vehicle_id=?", (vid,)).fetchone()[0]


def test_derive_stores_series_with_rows():
    conn, d = _cloud_setup()
    db.ingest(conn, "car1", SRC, [*_wake_drive(), s(at("16:18:00"), "ignition", 2.0)], 0)
    d.update("car1", None, at("16:20:00"))
    (c,) = store.closed(conn, CHARGE, "car1")
    (t,) = store.closed(conn, TRIP, "car1")
    cs, ts = store.series(conn, CHARGE, "car1", c["start"]), store.series(conn, TRIP, "car1", t["start"])
    assert cs["car_kwh"] == [] and [p[1] for p in cs["cloud_soc"]] == [40.0, 81.0]  # asleep: only the cloud's points
    assert ts["rows"][-1][:2] == [at("16:16:40"), 1.0]
    assert store.series(conn, TRIP, "car1", 1) is None and store.series(conn, CHARGE, "other", c["start"]) is None


def test_open_rows_series_are_replaced_every_update():
    conn, d = setup(trip_samples(0, secs=10)[:8])  # ignition, gear, gps, speed samples: still open
    d.update("car1", None, 10 * DAY)
    n = len(store.series(conn, TRIP, "car1", 0)["rows"])
    db.ingest(conn, "car1", SRC, [s(t, "speed", 10.0) for t in range(8000, 12000, 1000)], 0)
    d.update("car1", None, 10 * DAY)
    assert _count(conn, "trip_series") == 1 and len(store.series(conn, TRIP, "car1", 0)["rows"]) > n


def test_derive_deletes_series_with_rows():
    conn, d = setup(trip_samples(0))
    d.update("car1", None, 10 * DAY)
    assert store.series(conn, TRIP, "car1", 0)["rows"][-1][2] is None
    db.ingest(conn, "car1", SRC, [s(0, "battery_wh", 20_000.0), s(40_000, "battery_wh", 19_900.0)], 0)
    d.update("car1", 0, 10 * DAY)
    assert _count(conn, "trips") == 1 and _count(conn, "trip_series") == 1
    assert store.series(conn, TRIP, "car1", 0)["rows"][-1][2] == 0.1  # the new row's series, not the old


def test_algo_bump_drops_series_of_rebuilt_vehicles():
    conn, d = _cloud_setup()
    db.ingest(conn, "car1", SRC, [*_wake_drive(), s(at("16:18:00"), "ignition", 2.0)], 0)
    d.update("car1", None, at("16:20:00"))
    assert _count(conn, "trip_series") == 1 and _count(conn, "charge_series") == 1
    conn.execute("UPDATE charges SET algo=?", (ALGO - 1,))
    Deriver(conn, lambda la, lo: "Home").purge_stale()
    assert _count(conn, "trips") == _count(conn, "charges") == _count(conn, "trip_series") == _count(conn, "charge_series") == 0


def test_trip_route_stored_and_rebuilt():
    conn, d = setup(trip_samples(0))
    d.update("car1", None, 10 * DAY)
    assert store.route(conn, "car1", 0) == [[52.0, 5.0], [52.1, 5.1]]
    assert store.route(conn, "car1", 1) is None and store.route(conn, "other", 0) is None
    db.ingest(conn, "car1", SRC, [s(50_000, "gps", [52.0, 5.1])], 0)  # late fix far off the line
    d.update("car1", 50_000, 10 * DAY)
    assert store.route(conn, "car1", 0) == [[52.0, 5.0], [52.0, 5.1], [52.1, 5.1]] and _count(conn, "trip_routes") == 1
    conn.execute("UPDATE trips SET algo=?", (ALGO - 1,))
    Deriver(conn, lambda la, lo: "Home").purge_stale()
    assert _count(conn, "trips") == _count(conn, "trip_routes") == 0


def test_trip_without_fixes_stores_an_empty_route():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)],
                     s(70_000, "ignition", 2.0)])
    d.update("car1", None, 10 * DAY)
    assert store.route(conn, "car1", 0) == []


POINTS = ("from_lat", "from_lon", "to_lat", "to_lon")


def test_trip_points_stay_off_the_wire():
    conn, d = setup([*trip_samples(0), s(1000, "gps", [52.0, 5.0])])  # a fix after the start: the first one inside the trip
    trips, _, _ = d.update("car1", None, 10 * DAY)
    assert conn.execute("SELECT from_lat, from_lon, to_lat, to_lon FROM trips").fetchone() == (52.0, 5.0, 52.1, 5.1)  # kept, in columns
    mqtt = FakeMqtt()
    sensors = TripSensors(conn, mqtt, lambda vid: 57_000.0)
    sensors.publish("car1", trips[0], None, trips, [])
    # a row that did carry the points would still leave them out of the event
    sensors.publish("car1", None, None, [{**trips[0], **dict(zip(POINTS, (52.0, 5.0, 52.1, 5.1)))}], [])
    wires = [*trips, store.row(conn, TRIP, "car1", 0), *store.closed(conn, TRIP, "car1"), *store.ended(conn, TRIP, "car1", 0),
             *[e for e, _ in mqtt.on("car_insights/car1/trip_event")], store.current_trip(conn, "car1") or {}]
    assert len(wires) == 7 and all(k not in w for w in wires for k in POINTS)
    assert len(mqtt.on("car_insights/car1/trip_event")) == 2


# --- cloud-only vehicles: approximate trips from the readings of the car's own HA integration ---
MIN = 60_000
T0 = 1_700_000_000_000  # invented


def cloud_drive(on, off, odo=(1000.0, 1012.4), wh=(40_000, 37_600)):
    """the readings a minute-level poll sees around an ignition trip: before it, ignition on, two fixes, ignition off, the settled readings"""
    return [s(on - MIN, "odometer_km", odo[0]), s(on - MIN, "battery_wh", wh[0]), s(on - MIN, "gps", [45.0, 10.0, 5.0]),
            s(on, "ignition", 4), s(on + 5 * MIN, "gps", [45.05, 10.0, 5.0]), s(on + 10 * MIN, "gps", [45.1, 10.0, 5.0]),
            s(off, "ignition", 2), s(off + MIN, "odometer_km", odo[1]), s(off + MIN, "battery_wh", wh[1])]


def cloud_setup(*batches):
    conn = db.connect(":memory:")
    db.set_vehicle(conn, "car9", "Invented", True)
    for b in batches:
        db.ingest(conn, "car9", CLOUD, b, 0)
    return conn, Deriver(conn, lambda la, lo: "Home", cloud_only=lambda vid: db.is_cloud_only(conn, vid))


def test_cloud_only_vehicle_gets_an_approximate_trip_without_style_or_series():
    conn, d = cloud_setup(cloud_drive(T0, T0 + 20 * MIN))
    d.horizon["car9"] = T0 + 120 * MIN
    (trip,), _, _ = d.update("car9", None, T0 + 120 * MIN)
    assert trip["approx"] is True and trip["style"] is None and trip["from"] == "Home"
    assert (trip["start"], trip["end"], trip["distance_m"], trip["net_wh"], trip["gross_wh"]) == (T0, T0 + 20 * MIN, pytest.approx(12_400), 2400, None)
    stored = store.closed(conn, TRIP, "car9", 1)[0]
    assert stored["approx"] is True and stored["style"] is None and store.series(conn, TRIP, "car9", stored["start"]) is None
    assert store.route(conn, "car9", stored["start"]) == [[45.05, 10.0], [45.1, 10.0]]  # the polled fixes of the trip
    assert d.update("car9", None, T0 + 120 * MIN) == ([], [], set())


def test_cloud_only_trip_stays_open_without_a_horizon_and_closes_with_one():
    conn, d = cloud_setup(cloud_drive(T0, T0 + 20 * MIN))
    assert d.update("car9", None, T0 + 120 * MIN) == ([], [], set()) and store.current_trip(conn, "car9")["end"] is None
    d.horizon["car9"] = T0 + 120 * MIN
    assert [t["end"] for t in d.update("car9", None, T0 + 120 * MIN)[0]] == [T0 + 20 * MIN] and store.current_trip(conn, "car9") is None


def test_the_horizon_never_reaches_past_what_the_window_read():
    # a rebuild window reads up to received + a day; a later motion sample may still extend the trip, so the poll's own horizon cannot close it
    r = T0
    samples = [s(r + 86_400_000 - 4 * MIN, "odometer_km", 1000.0), s(r + 86_400_000 - 3 * MIN, "odometer_km", 1003.0)]
    conn, d = cloud_setup(samples)
    d.horizon["car9"] = r + 10 * 86_400_000
    assert d.update("car9", None, r) == ([], [], set()) and store.current_trip(conn, "car9")["end"] is None
    assert [t["end"] for t in d.update("car9", None, r + 20 * MIN)[0]] == [r + 86_400_000 - 3 * MIN]


def test_car_app_vehicle_derives_as_before():
    plain = setup(trip_samples(0))[1].update("car1", None, 10 * DAY)[0]
    conn, d = setup(trip_samples(0), [s(5_000, "odometer_km", 1000.0)])  # a polled reading the car app car also gets
    flat = lambda rows: [{k: v for k, v in r.items() if k not in ("odometer_start_km", "odometer_end_km")} for r in rows]
    (trip,) = d.update("car1", None, 10 * DAY)[0]
    assert flat([trip]) == flat(plain) and "approx" not in trip and trip["style"] is not None
    assert store.series(conn, TRIP, "car1", 0) is not None


def test_cloud_charge_between_two_trips_is_measured_from_battery_energy():
    conn, d = cloud_setup(
        cloud_drive(T0, T0 + 20 * MIN),
        [s(T0 + 60 * MIN, "charging_state", True), s(T0 + 120 * MIN, "charging_state", False), s(T0 + 121 * MIN, "battery_wh", 52_000)],
        cloud_drive(T0 + 180 * MIN, T0 + 200 * MIN, odo=(1012.4, 1020.0), wh=(52_000, 50_000)))
    d.horizon["car9"] = T0 + 300 * MIN
    trips, charges, _ = d.update("car9", None, T0 + 300 * MIN)
    assert [t["start"] for t in trips] == [T0, T0 + 180 * MIN] and all(t["approx"] for t in trips)
    (c,) = charges
    assert c["energy_source"] == "car" and c["added_wh"] == 14_400 and (c["start"], c["end"]) == (T0 + 60 * MIN, T0 + 120 * MIN)
    assert "approx" not in c


def test_restart_mid_trip_keeps_one_trip():
    first = [s(T0 + i * MIN, "odometer_km", v) for i, v in enumerate([1000.0, 1001.0, 1003.0])]
    conn, d = cloud_setup(first)
    assert d.update("car9", None, T0 + 3 * MIN) == ([], [], set())  # the start-up rebuild: no horizon yet
    assert store.current_trip(conn, "car9")["start"] == T0 + MIN
    d2 = Deriver(conn, lambda la, lo: "Home", cloud_only=lambda vid: db.is_cloud_only(conn, vid))  # the restart
    db.ingest(conn, "car9", CLOUD, [s(T0 + (3 + i) * MIN, "odometer_km", v) for i, v in enumerate([1006.0] * 13)], 0)
    d2.horizon["car9"] = T0 + 40 * MIN
    (trip,), _, _ = d2.update("car9", T0 + 3 * MIN, T0 + 40 * MIN)
    assert (trip["start"], trip["end"], trip["distance_m"]) == (T0 + MIN, T0 + 3 * MIN, pytest.approx(6000))
    assert [t["start"] for t in store.closed(conn, TRIP, "car9")] == [T0 + MIN] and store.current_trip(conn, "car9") is None


@pytest.mark.parametrize("restart", [False, True])
def test_ignition_trip_open_across_a_window_boundary_ends_up_as_one_trip(restart):
    # the coarse finder opens a trip only at its ignition-on sample and ignores an ignition seed, so every window must reach back to it.
    # Here a cloud charge that was still flagged when the drive began closes after the trip's start: the window starts past the ignition sample
    t1 = T0 + 3 * DAY
    charge = [s(t1 - 30 * MIN, "charging_state", True), s(t1 + MIN, "charging_state", False), s(t1 + 2 * MIN, "battery_wh", 40_500)]
    conn, d = cloud_setup(cloud_drive(T0, T0 + 20 * MIN), [s(t1 - 40 * MIN, "battery_wh", 40_000), *charge],
                          cloud_drive(t1, t1 + 20 * MIN, odo=(1012.4, 1030.0), wh=(40_500, 38_000))[1:])
    d.horizon["car9"] = t1 + DAY
    d.update("car9", None, t1 + 10 * MIN - DAY)  # this window reads up to the middle of the second trip
    assert store.current_trip(conn, "car9")["start"] == t1 and store.newest_end(conn, "car9") > t1
    if restart:
        d = Deriver(conn, lambda la, lo: "Home", cloud_only=lambda vid: db.is_cloud_only(conn, vid))
        d.horizon["car9"] = t1 + DAY
    d.update("car9", None, t1 + 2 * 3_600_000)
    assert [(t["start"], t["end"]) for t in store.closed(conn, TRIP, "car9")] == [(t1, t1 + 20 * MIN), (T0, T0 + 20 * MIN)]
    assert store.current_trip(conn, "car9") is None and len(store.closed(conn, CHARGE, "car9")) == 1


def test_forget_drops_what_the_deriver_remembers():
    conn, d = cloud_setup(cloud_drive(T0, T0 + 20 * MIN), [s(T0 + 60 * MIN, "charging_state", False)])
    d.horizon["car9"] = T0 + 120 * MIN
    d.update("car9", None, T0 + 120 * MIN)
    assert "car9" in d._ignition and "car9" in d._cloud and "car9" in d._idle
    d._quiet["car9"] = 1
    d.forget("car9")
    d.forget("nobody")
    assert not (d._ignition or d._cloud or d._idle or d._quiet)


def test_rebuild_without_a_horizon_closes_every_trip_the_stored_samples_prove_over():
    # a start-up or kind-switch rebuild has no horizon: the newest stored sample is the evidence
    later = [s(T0 + 10 * 3_600_000, "odometer_km", 1020.0)]
    conn, d = cloud_setup(cloud_drive(T0, T0 + 20 * MIN), cloud_drive(T0 + 180 * MIN, T0 + 200 * MIN, odo=(1012.4, 1020.0)), later)
    trips, _, _ = d.update("car9", None, T0 + 12 * 3_600_000)
    assert [(t["start"], t["end"]) for t in trips] == [(T0, T0 + 20 * MIN), (T0 + 180 * MIN, T0 + 200 * MIN)]
    assert store.current_trip(conn, "car9") is None
    conn2, d2 = cloud_setup(cloud_drive(T0, T0 + 20 * MIN)[:-2])  # the newest sample is the ignition-off itself: nothing after it yet
    assert d2.update("car9", None, T0 + 3_600_000) == ([], [], set()) and store.current_trip(conn2, "car9")["end"] is None
