import pytest

from car_insights import db
from car_insights.derive import ALGO, Deriver
from conftest import s

DAY = 86_400_000
SRC = "phone-0000abcd"


def trip_samples(t0, step=1000, secs=100):
    """ignition on, drive at 10 m/s for secs, ignition off 10 s later; a speed sample stands for at most 5 s"""
    return [s(t0, "ignition", 4.0), s(t0, "gear", 1.0), s(t0, "gps", [52.0, 5.0]),
            *[s(t0 + t, "speed", 10.0) for t in range(0, secs * 1000 + 1, step)],
            s(t0 + secs * 1000, "gps", [52.1, 5.1]), s(t0 + secs * 1000 + 10_000, "ignition", 2.0)]


def setup(*batches):
    conn = db.connect(":memory:")
    for b in batches:
        db.ingest(conn, "car1", SRC, b, 0)
    return conn, Deriver(conn, lambda la, lo: "Home")


def test_closed_trip_stored_and_returned_once():
    conn, d = setup(trip_samples(0))
    (trips, charges) = d.update("car1", None, 10 * DAY)
    assert charges == [] and len(trips) == 1
    assert trips[0]["from"] == "Home" and trips[0]["to"] == "Home" and trips[0]["end"] == 110_000
    assert trips[0]["duration_s"] == 110 and isinstance(trips[0]["duration_s"], int)
    assert d.update("car1", None, 10 * DAY) == ([], [])
    stored = d.stored_trips("car1", 10)
    assert len(stored) == 1 and stored[0]["from"] == "Home" and stored[0] == trips[0]
    assert d.current_trip("car1") is None


def test_open_trip_is_current_not_stored():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    assert d.update("car1", None, 61_000) == ([], [])
    cur = d.current_trip("car1")
    assert cur["start"] == 0 and cur["end"] is None and cur["distance_m"] == 600
    assert d.stored_trips("car1", 10) == []
    assert d.current_trip("nobody") is None


def test_late_batch_rederives_once():
    a, b = trip_samples(0, step=10_000), trip_samples(DAY, step=10_000)
    conn, d = setup(a, b)
    d.update("car1", None, 10 * DAY)
    before = {t["start"]: t for t in d.stored_trips("car1", 10)}
    assert len(before) == 2
    late = [s(t, "speed", 10.0) for t in range(5_000, 100_000, 10_000)]
    db.ingest(conn, "car1", SRC, late, 0)
    trips, charges = d.update("car1", 5_000, 10 * DAY)
    after = {t["start"]: t for t in d.stored_trips("car1", 10)}
    assert len(after) == 2 and charges == []
    assert after[0]["distance_m"] > before[0]["distance_m"]
    assert after[DAY] == before[DAY]
    assert trips == [after[0]]
    assert d.update("car1", None, 10 * DAY) == ([], [])


def test_late_batch_changing_nothing_republishes_nothing():
    conn, d = setup(trip_samples(0), trip_samples(DAY))
    d.update("car1", None, 10 * DAY)
    db.ingest(conn, "car1", SRC, [s(DAY + 500, "speed", 10.0)], 0)
    trips, _ = d.update("car1", DAY + 500, 10 * DAY)
    assert [t["start"] for t in d.stored_trips("car1", 10)] == [DAY, 0]  # newest first
    assert trips == []  # the extra sample splits a step without changing the trip


def test_open_trip_rebuilt_after_restart():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    d.update("car1", None, 61_000)
    cur = d.current_trip("car1")
    d2 = Deriver(conn, lambda la, lo: "Home")
    assert d2.current_trip("car1") == cur  # persisted, no update needed
    d2.update("car1", None, 61_000)
    assert d2.current_trip("car1") == cur


def test_algo_change_clears_rows():
    conn, d = setup(trip_samples(0))
    d.update("car1", None, 10 * DAY)
    conn.execute("UPDATE trips SET algo=?", (ALGO - 1,))
    d2 = Deriver(conn, lambda la, lo: "Home")
    assert d2.stored_trips("car1", 10) == []
    trips, _ = d2.update("car1", None, 10 * DAY)
    assert len(trips) == 1 and len(d2.stored_trips("car1", 10)) == 1


def test_late_batch_inside_open_trip_keeps_trip_start():
    conn, d = setup([s(200_000, "battery_wh", 20_000.0), s(201_000, "plugged", True),
                     s(3_600_000, "battery_wh", 25_000.0), s(3_700_000, "plugged", False)])
    d.update("car1", None, DAY)  # a later charge is stored, so the batches below take the late path
    db.ingest(conn, "car1", SRC, [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 51_000, 1000)]], 0)
    d.update("car1", 0, DAY)
    assert d.current_trip("car1")["start"] == 0
    db.ingest(conn, "car1", SRC, [*[s(t, "speed", 10.0) for t in range(51_000, 100_001, 1000)],
                                   s(100_000, "gear", 4.0), s(110_000, "ignition", 2.0)], 0)
    trips, _ = d.update("car1", 51_000, DAY)
    (t,) = d.stored_trips("car1", 10)
    assert t["start"] == 0 and t["distance_m"] == 1000 and trips == [t]
    assert len(d.stored_charges("car1", 10)) == 1 and d.current_trip("car1") is None


def _plug_before_ignition_off():
    return [s(0, "ignition", 4.0), s(0, "gear", 1.0), s(0, "battery_wh", 20_000.0),
            *[s(t, "speed", 10.0) for t in range(0, 100_001, 1000)], s(100_000, "gear", 4.0), s(100_000, "gps", [52.0, 5.0]),
            s(120_000, "plugged", True), s(150_000, "ignition", 2.0)]


def _unplug_after_charge():
    return [s(3_600_000, "battery_wh", 30_000.0), s(3_700_000, "plugged", False)]


def test_charge_plugged_before_ignition_off_survives():
    conn, d = setup(_plug_before_ignition_off())
    trips, charges = d.update("car1", None, DAY)
    assert trips[0]["end"] == 150_000 and charges == []
    db.ingest(conn, "car1", SRC, _unplug_after_charge(), 0)
    _, charges = d.update("car1", None, DAY)
    (c,) = d.stored_charges("car1", 10)
    assert charges == [c] and c["start"] == 120_000 and c["added_wh"] == 10_000 and len(d.stored_trips("car1", 10)) == 1


def test_open_charge_survives_restart():
    conn, d = setup(_plug_before_ignition_off())
    d.update("car1", None, DAY)
    d = Deriver(conn, lambda la, lo: "Home")
    db.ingest(conn, "car1", SRC, _unplug_after_charge(), 0)
    d.update("car1", None, DAY)
    (c,) = d.stored_charges("car1", 10)
    assert c["start"] == 120_000 and c["added_wh"] == 10_000


def test_open_trip_row_not_listed_or_newly_closed():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    assert d.update("car1", None, 61_000) == ([], [])
    assert d.update("car1", None, 62_000) == ([], [])
    assert d.stored_trips("car1", 10) == []
    assert conn.execute("SELECT COUNT(*) FROM trips WHERE end IS NULL").fetchone()[0] == 1
    db.ingest(conn, "car1", SRC, [s(70_000, "ignition", 2.0)], 0)
    trips, _ = d.update("car1", None, 70_000)
    assert len(trips) == 1 and d.current_trip("car1") is None
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 1


def test_stale_algo_in_one_table_rebuilds_both():
    conn, d = setup(_plug_before_ignition_off(), _unplug_after_charge())
    d.update("car1", None, DAY)
    assert len(d.stored_trips("car1", 10)) == 1 and len(d.stored_charges("car1", 10)) == 1
    conn.execute("UPDATE trips SET algo=?", (ALGO - 1,))
    d2 = Deriver(conn, lambda la, lo: "Home")
    assert d2.stored_trips("car1", 10) == [] and d2.stored_charges("car1", 10) == []


def test_late_batch_extends_trip_earlier_dropped_as_noise():
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 6_000, 1000)], s(20_000, "ignition", 2.0)], trip_samples(DAY))
    d.update("car1", None, 10 * DAY)  # the early 50 m / 20 s trip is noise; the later trip makes the next batch late
    db.ingest(conn, "car1", SRC, [s(t, "speed", 10.0) for t in range(6_000, 16_000, 1000)], 0)
    trips, _ = d.update("car1", 6_000, 10 * DAY)
    assert [(t["start"], t["distance_m"]) for t in trips] == [(0, 150)]


def test_charge_stored_with_place():
    conn, d = setup([s(0, "battery_wh", 20_000.0), s(0, "gps", [52.0, 5.0]), s(1000, "plugged", True),
                     s(3_600_000, "battery_wh", 25_000.0), s(3_700_000, "plugged", False)])
    trips, charges = d.update("car1", None, 10 * DAY)
    assert trips == [] and len(charges) == 1
    c = charges[0]
    assert c["place"] == "Home" and c["added_wh"] == 5000 and c["end"] == 3_700_000 and "fix" not in c
    assert d.stored_charges("car1", 10) == charges
    assert d.update("car1", None, 10 * DAY) == ([], [])


def test_open_charge_not_stored():
    conn, d = setup([s(0, "battery_wh", 20_000.0), s(1000, "plugged", True), s(60_000, "battery_wh", 21_000.0)])
    assert d.update("car1", None, 10 * DAY) == ([], [])
    assert d.stored_charges("car1", 10) == []
    assert conn.execute("SELECT COUNT(*) FROM charges WHERE end IS NULL").fetchone()[0] == 1


def test_backlog_boundary_in_p_stop_keeps_one_trip():
    now = 3 * DAY  # backlog arrives days later, so the first batch's trailing P stop looks like a closed trip
    b1 = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 60_001, 1000)], s(60_000, "gear", 4.0)]
    conn, d = setup(b1)
    first, _ = d.update("car1", 0, now)
    assert first == [] and d.current_trip("car1")["start"] == 0  # no later sample proves the stop: stays open however old
    b2 = [s(120_000, "gps", [52.0, 5.0]), s(150_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(150_000, 300_001, 1000)],
          s(300_000, "gear", 4.0), s(310_000, "ignition", 2.0)]
    db.ingest(conn, "car1", SRC, b2, 0)
    trips, _ = d.update("car1", 120_000, now)
    stored = d.stored_trips("car1", 10)
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
    conn, d = setup(b1)
    first, _ = d.update("car1", 0, now)
    assert first == []
    b2 = [s(310_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(310_000, 400_001, 1000)],
          s(400_000, "gear", 4.0), s(410_000, "ignition", 2.0)]
    db.ingest(conn, "car1", SRC, b2, 0)
    trips, _ = d.update("car1", 310_000, now)
    stored = d.stored_trips("car1", 10)
    assert [(t["start"], t["end"]) for t in stored] == [(0, 410_000)] and trips == stored


def test_open_trip_below_the_noise_floor_is_current_but_dropped_once_closed():
    slow = [s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 1.0) for t in range(0, 20_001, 1000)]]  # 20 m in 20 s
    conn, d = setup(slow)
    assert d.update("car1", None, 20_000) == ([], [])
    cur = d.current_trip("car1")
    assert cur["start"] == 0 and cur["end"] is None and cur["distance_m"] == 20
    db.ingest(conn, "car1", SRC, [s(21_000, "ignition", 2.0)], 0)
    assert d.update("car1", None, 21_000) == ([], [])
    assert d.current_trip("car1") is None and d.stored_trips("car1", 10) == []


def test_open_charge_closed_by_the_next_trip_is_stored():
    conn, d = setup([s(0, "plugged", True), s(0, "battery_wh", 30000.0), s(500_000, "battery_wh", 40000.0),
                     s(600_000, "ignition", 4.0), s(600_000, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(600_000, 700_001, 1000)]])
    trips, charges = d.update("car1", None, DAY)  # the unplug was never seen
    (c,) = charges
    assert (c["start"], c["end"], c["added_wh"]) == (0, 600_000, 10000) and trips == []
    assert d.current_trip("car1")["start"] == 600_000 and d.stored_charges("car1", 10) == [c]


def test_samples_beyond_the_future_slack_are_ignored():
    received = 1_000_000
    far = trip_samples(received + 2 * DAY)
    conn, d = setup(far, trip_samples(received - 500_000))
    trips, _ = d.update("car1", None, received)
    assert [t["start"] for t in trips] == [received - 500_000]
    assert d.current_trip("car1") is None


def test_stale_row_cleanup_is_atomic():
    conn, _ = setup()
    for t in ("trips", "charges"):
        conn.execute(f"INSERT INTO {t} VALUES('car1', 1, 2, ?, '{{}}')", (ALGO - 1,))

    class FailOnCharges:
        def __init__(self, c):
            self._c = c

        def __getattr__(self, n):
            return getattr(self._c, n)

        def executemany(self, sql, *a):
            if sql.startswith("DELETE FROM charges"):
                raise RuntimeError("boom")
            return self._c.executemany(sql, *a)

    with pytest.raises(RuntimeError):
        Deriver(FailOnCharges(conn), lambda la, lo: None)
    assert not conn.in_transaction
    assert conn.execute("SELECT COUNT(*) FROM trips").fetchone()[0] == 1  # the trips delete was rolled back


def _spy_samples_after(monkeypatch, seen, what):
    real = db.samples_after
    monkeypatch.setattr(db, "samples_after", lambda conn, vid, after_t, max_t, keys: (seen.append(what(after_t, keys)), real(conn, vid, after_t, max_t, keys))[1])


def test_parked_car_update_reads_only_new_samples(monkeypatch):
    seen = []
    _spy_samples_after(monkeypatch, seen, lambda after_t, keys: after_t)
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
    before = d.stored_trips("car1")[0]["distance_m"]
    trips, _ = d.update("car1", 50_500, 10 * DAY)
    assert [t["start"] for t in trips] == [0] and trips[0]["distance_m"] > before


def test_no_watermark_while_a_segment_is_open(monkeypatch):
    seen = []
    _spy_samples_after(monkeypatch, seen, lambda after_t, keys: after_t)
    conn, d = setup([s(0, "ignition", 4.0), s(0, "gear", 1.0), *[s(t, "speed", 10.0) for t in range(0, 61_000, 1000)]])
    d.update("car1", None, 61_000)
    db.ingest(conn, "car1", SRC, [s(t, "speed", 10.0) for t in range(61_000, 70_000, 1000)], 0)
    d.update("car1", 61_000, 70_000)
    assert seen == [-1, -1]  # the open trip is re-read from its start


def test_derivation_loads_only_the_keys_it_uses(monkeypatch):
    from car_insights import derive
    seen = []
    _spy_samples_after(monkeypatch, seen, lambda after_t, keys: keys)
    conn, d = setup(trip_samples(0), [s(5000, "soc", 50.0), s(5000, "tire_pressure", 2.5)])
    trips, _ = d.update("car1", None, 10 * DAY)
    assert len(trips) == 1 and seen == [derive.KEYS]
    assert {"gear", "ignition", "speed", "battery_wh", "outside_temp", "gps", "plugged", "range_m", "charging_state", "soc_percent"} == set(derive.KEYS)


def test_has_ignition_is_looked_up_until_it_is_true(monkeypatch):
    calls = []
    real = db.has_key
    monkeypatch.setattr(db, "has_key", lambda *a: (calls.append(a[2]), real(*a))[1])
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
    assert [t["start"] for t in d.stored_trips("car1")] == [2 * DAY, DAY, 0]
    assert [t["start"] for t in d.stored_trips("car1", since=DAY)] == [2 * DAY, DAY]
    assert [t["start"] for t in d.stored_trips("car1", 1, since=DAY)] == [2 * DAY]


def test_stale_plugged_seed_after_forced_close_opens_no_session():
    conn, d = setup([s(0, "gear", 4.0), s(0, "ignition", 2.0), s(0, "battery_wh", 20000.0), s(1000, "plugged", True),
                     s(3_600_000, "battery_wh", 30000.0)])
    d.update("car1", 0, DAY)  # a charge is open; the unplug is never seen
    db.ingest(conn, "car1", SRC, [s(4_000_000, "ignition", 4.0), s(4_000_000, "gear", 1.0),
                                  *[s(t, "speed", 10.0) for t in range(4_000_000, 4_100_001, 1000)],
                                  s(4_100_000, "gear", 4.0), s(4_110_000, "ignition", 2.0)], 0)
    d.update("car1", 4_000_000, DAY)  # the trip start closes the charge, the trip ends
    (c,) = d.stored_charges("car1", 10)
    assert c["end"] == 4_000_000 and len(d.stored_trips("car1", 10)) == 1
    db.ingest(conn, "car1", SRC, [s(t, "speed", 0.0) for t in range(4_200_000, 4_500_000, 60_000)] + [s(4_500_000, "battery_wh", 30150.0)], 0)
    d.update("car1", 4_200_000, DAY)  # parked, +150 Wh: the stale plugged flag must not make that a charge
    db.ingest(conn, "car1", SRC, [s(5_000_000, "ignition", 4.0), s(5_000_000, "gear", 1.0), s(5_001_000, "speed", 10.0)], 0)
    _, charges = d.update("car1", 5_000_000, DAY)
    assert charges == [] and d.stored_charges("car1", 10) == [c]
