import itertools

from car_insights import db
from car_insights.derive import ALGO, Deriver
from car_insights.protocol import Sample

_seq = itertools.count(1)
DAY = 86_400_000
SRC = "phone-0000abcd"


def s(t, k, v):
    return Sample(next(_seq), t, k, v)


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
    assert d2.current_trip("car1") is None
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
