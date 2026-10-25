from car_insights import db, store
from car_insights.db import connect
from car_insights.kinds import TRIP
from car_insights.odometer import chain
from car_insights.protocol import Sample
from conftest import seed_trip

H = 3_600_000
M = 60_000
D = 100 * 86_400_000


def reading(conn, t, km, seq=[0]):
    seq[0] += 1
    db.ingest(conn, "car1", "cloud", [Sample(seq[0], t, "odometer_km", km)], t)


def trip(conn, start, end, distance_m):
    seed_trip(conn, "car1", start, end, distance_m=distance_m)


def test_chain_from_cloud_reading():
    conn = connect(":memory:")
    reading(conn, D + 8 * H + 38 * M, 36979)
    assert chain(conn, "car1", D + 16 * H + 14 * M, 25_930) == (36979.0, 37004.9)


def test_trips_since_reading_are_added():
    conn = connect(":memory:")
    reading(conn, D + 7 * H + 56 * M, 36953)
    trip(conn, D + 8 * H + 10 * M, D + 8 * H + 32 * M, 23_300)
    assert chain(conn, "car1", D + 16 * H + 14 * M, 25_930)[0] == 36976.3


def test_later_reading_reanchors_next_trip_not_distance():
    conn = connect(":memory:")
    reading(conn, D + 8 * H + 38 * M, 36979)
    start = D + 16 * H + 14 * M
    trip(conn, start, start + 20 * M, 25_930)
    reading(conn, D + 16 * H + 56 * M, 37005)
    assert chain(conn, "car1", D + 17 * H, 1_000)[0] == 37005.0
    assert store.row(conn, TRIP, "car1", start)["distance_m"] == 25_930


def test_no_reading_none():
    conn = connect(":memory:")
    assert chain(conn, "car1", D, 1_000) == (None, None)
    reading(conn, D + H, 100)
    assert chain(conn, "car1", D + 2 * H, None) == (100.0, None)


def test_malformed_or_non_finite_readings_are_skipped():
    conn = connect(":memory:")
    reading(conn, D + H, 100)
    for i, v in enumerate([None, True, "36979", [1], {"a": 1}, float("nan"), float("inf")]):
        reading(conn, D + 2 * H + i, v)
    assert chain(conn, "car1", D + 3 * H, 1_000) == (100.0, 101.0)
