import json
import re
from pathlib import Path

import pytest

import car_insights
from car_insights import db, store
from car_insights.derive import ALGO
from car_insights.kinds import CHARGE, KINDS, TRIP
from conftest import seed_charge, seed_trip

DERIVED = r"(trips|charges|trip_series|charge_series|trip_routes)"


@pytest.fixture
def conn():
    return db.connect(":memory:")


def test_only_store_reads_derived_tables():
    reads = re.compile(rf"""SELECT[^"']*FROM\s+{DERIVED}\b""", re.I)
    from_ = re.compile(rf"FROM\s+{DERIVED}\b", re.I)
    sources = {p.name: p.read_text(encoding="utf-8") for p in Path(car_insights.__file__).parent.glob("*.py") if p.name != "store.py"}
    assert [n for n, src in sources.items() if reads.search(src) or from_.search(src)] == []


def test_no_json_extract():
    """a field SQL needs is a column, so no module digs into the json column"""
    sources = {p.name: p.read_text(encoding="utf-8") for p in Path(car_insights.__file__).parent.glob("*.py")}
    assert [n for n, src in sources.items() if "json_extract(json" in src or "json_set(json" in src] == []


def test_kinds_name_their_tables():
    assert [(k.name, k.table, k.series_table, k.has_route, k.event) for k in KINDS] == [
        ("trip", "trips", "trip_series", True, "Trip"), ("charge", "charges", "charge_series", False, "Charge")]


def test_a_trip_round_trips_through_every_read(conn):
    row = seed_trip(conn, "car1", 1000, 2000, series={"rows": [[1, 2, 3]]}, route=[[52.0, 5.0], [52.1, 5.1]],
                    distance_m=500, net_wh=80.5, **{"from": "Home", "to": None})
    assert store.row(conn, TRIP, "car1", 1000) == row
    assert store.closed(conn, TRIP, "car1") == [row]
    assert store.series(conn, TRIP, "car1", 1000) == {"rows": [[1, 2, 3]]}
    assert store.route(conn, "car1", 1000) == [[52.0, 5.0], [52.1, 5.1]]
    assert store.current_trip(conn, "car1") is None and not store.has_open(conn, TRIP, "car1")
    # nothing leaks across vehicles, starts or kinds
    assert store.row(conn, TRIP, "car2", 1000) is None and store.row(conn, TRIP, "car1", 1) is None and store.row(conn, CHARGE, "car1", 1000) is None
    assert store.series(conn, TRIP, "car1", 1) is None and store.route(conn, "car2", 1000) is None and store.closed(conn, TRIP, "car2") == []


def test_a_charge_round_trips_through_every_read(conn):
    row = seed_charge(conn, "car1", 1000, 2000, series={"car_kwh": []}, added_wh=5000, place="Home", lat=52.0, lon=5.0)
    assert store.row(conn, CHARGE, "car1", 1000) == row
    assert store.closed(conn, CHARGE, "car1") == [row]
    assert store.series(conn, CHARGE, "car1", 1000) == {"car_kwh": []}
    assert store.route(conn, "car1", 1000) is None  # a charge has no route
    assert store.closed(conn, TRIP, "car1") == []


def test_a_row_without_a_series_or_route_has_none(conn):
    seed_trip(conn, "car1", 1000, 2000)
    assert store.series(conn, TRIP, "car1", 1000) is None and store.route(conn, "car1", 1000) is None


def test_an_empty_route_is_stored_as_empty(conn):
    seed_trip(conn, "car1", 1000, 2000, route=[])
    assert store.route(conn, "car1", 1000) == []


def test_open_rows_are_current_not_closed(conn):
    open_trip = seed_trip(conn, "car1", 3000, None, distance_m=10)
    seed_charge(conn, "car1", 3500, None)
    assert store.current_trip(conn, "car1") == open_trip and store.current_trip(conn, "car2") is None
    assert store.has_open(conn, TRIP, "car1") and store.has_open(conn, CHARGE, "car1") and not store.has_open(conn, TRIP, "car2")
    assert store.closed(conn, TRIP, "car1") == [] and store.closed(conn, CHARGE, "car1") == []
    assert store.row(conn, TRIP, "car1", 3000) == open_trip  # a detail page may show the open row


def test_closed_is_newest_first_limited_and_since(conn):
    for start in (0, 10, 20):
        seed_trip(conn, "car1", start, start + 5)
    seed_trip(conn, "car1", 30, None)
    assert [r["start"] for r in store.closed(conn, TRIP, "car1")] == [20, 10, 0]
    assert [r["start"] for r in store.closed(conn, TRIP, "car1", since=10)] == [20, 10]
    assert [r["start"] for r in store.closed(conn, TRIP, "car1", 1, since=10)] == [20]


def test_in_range_is_closed_half_open_oldest_first_with_vehicle_id(conn):
    for vid, start in (("car1", 0), ("car2", 10), ("car1", 20), ("car2", 30), ("car3", 15)):
        seed_trip(conn, vid, start, start + 5, distance_m=start)
    seed_trip(conn, "car1", 25, None)  # open: not in range
    got = store.in_range(conn, TRIP, ["car1", "car2"], 10, 30)  # lo <= start < hi
    assert [(r["vehicle_id"], r["start"], r["distance_m"]) for r in got] == [("car2", 10, 10), ("car1", 20, 20)]
    assert store.in_range(conn, TRIP, [], 0, 100) == [] and store.in_range(conn, CHARGE, ["car1"], 0, 100) == []


def test_sums_count_null_as_zero_and_skip_open_rows(conn):
    seed_trip(conn, "car1", 0, 5, distance_m=100, net_wh=10)
    seed_trip(conn, "car2", 10, 15, distance_m=50)  # no energy
    seed_trip(conn, "car1", 20, None, distance_m=999, net_wh=999)
    seed_trip(conn, "car1", 40, 45, distance_m=7, net_wh=7)  # past hi
    assert store.sums(conn, TRIP, ["car1", "car2"], 0, 40, ("distance_m", "net_wh")) == (150, 10, 2)
    assert store.sums(conn, TRIP, ["car1"], 100, 200, ("distance_m", "net_wh")) == (0, 0, 0)
    seed_charge(conn, "car1", 0, 5, added_wh=3000)
    seed_charge(conn, "car1", 10, 15)
    assert store.sums(conn, CHARGE, ["car1"], 0, 40, ("added_wh",)) == (3000, 2)


def test_newest_end_ignores_open_rows(conn):
    assert store.newest_end(conn, "car1") == -1
    seed_trip(conn, "car1", 0, 100)
    seed_charge(conn, "car1", 150, 200)
    seed_trip(conn, "car1", 300, None)
    seed_trip(conn, "car2", 400, 500)
    assert store.newest_end(conn, "car1") == 200
    assert store.newest_end(conn, "car1", 200) == 100 and store.newest_end(conn, "car1", 100) == -1  # strictly below
    assert store.newest_end(conn, "car1", kinds=(TRIP,)) == 100 and store.newest_end(conn, "car2", kinds=(CHARGE,)) == -1


def test_ended_between_is_closed_and_inclusive(conn):
    for start, end in ((0, 10), (20, 30), (40, 50), (60, None)):
        seed_charge(conn, "car1", start, end)
    assert [r["start"] for r in store.ended(conn, CHARGE, "car1", 10, 50)] == [0, 20, 40]
    assert [r["start"] for r in store.ended(conn, CHARGE, "car1", 11)] == [20, 40]  # no upper bound


def test_rows_after_and_straddling_find_what_a_window_must_redo(conn):
    seed_trip(conn, "car1", 0, 100)
    seed_trip(conn, "car1", 200, 300)
    seed_charge(conn, "car1", 400, None)
    assert sorted(store.rows_after(conn, TRIP, "car1", 100)) == [200] and sorted(store.rows_after(conn, CHARGE, "car1", 100)) == [400]
    assert store.rows_after(conn, TRIP, "car1", 100)[200]["end"] == 300
    assert sorted(store.straddling(conn, "car1", 50)) == [0] and store.straddling(conn, "car1", 100) == []
    assert store.straddling(conn, "car1", 450) == [400]  # an open row straddles any later window start


def test_newest_start_counts_open_rows(conn):
    assert store.newest_start(conn, TRIP, "car1") == -1
    seed_trip(conn, "car1", 0, 5)
    seed_trip(conn, "car1", 10, None)
    assert store.newest_start(conn, TRIP, "car1") == 10 and store.newest_start(conn, CHARGE, "car1") == -1


def test_purge_deletes_one_vehicle_of_one_kind_with_series_and_route(conn):
    for vid in ("car1", "car2"):
        seed_trip(conn, vid, 0, 5, series={}, route=[])
        seed_charge(conn, vid, 10, 15, series={})
    store.purge(conn, TRIP, "car1")
    count = lambda t, v: conn.execute(f"SELECT COUNT(*) FROM {t} WHERE vehicle_id=?", (v,)).fetchone()[0]
    assert [count(t, "car1") for t in ("trips", "trip_series", "trip_routes", "charges", "charge_series")] == [0, 0, 0, 1, 1]
    assert [count(t, "car2") for t in ("trips", "trip_series", "trip_routes", "charges", "charge_series")] == [1] * 5


def test_drop_after_keeps_earlier_closed_rows(conn):
    seed_trip(conn, "car1", 0, 100, series={}, route=[])
    seed_trip(conn, "car1", 200, 300, series={}, route=[])
    seed_trip(conn, "car1", 400, None, series={}, route=[])
    store.drop_after(conn, TRIP, "car1", 100)
    assert [r["start"] for r in store.closed(conn, TRIP, "car1")] == [0] and not store.has_open(conn, TRIP, "car1")
    assert store.series(conn, TRIP, "car1", 0) == {} and store.series(conn, TRIP, "car1", 200) is None
    assert store.route(conn, "car1", 0) == [] and store.route(conn, "car1", 400) is None


def test_stale_vehicles_have_a_row_of_an_old_algo(conn):
    seed_trip(conn, "old", 0, 5, algo=1)
    seed_charge(conn, "mixed", 0, 5, algo=1)
    seed_trip(conn, "mixed", 10, 15)
    seed_trip(conn, "fresh", 0, 5)
    assert store.stale_vehicles(conn, ALGO) == {"old", "mixed"}
    assert store.stale_vehicles(conn, 1) == {"mixed", "fresh"}


def test_open_trip_vehicles(conn):
    seed_trip(conn, "car1", 0, None)
    seed_trip(conn, "car1", 10, None)
    seed_trip(conn, "car2", 0, 5)
    seed_charge(conn, "car3", 0, None)
    assert store.open_trip_vehicles(conn) == ["car1"]


def test_page_reads_of_the_activity_list(conn):
    for vid, start in (("car1", 0), ("car2", 10), ("car1", 20)):
        seed_trip(conn, vid, start, start + 5)
    seed_trip(conn, "car1", 30, None)
    assert store.newest_starts(conn, TRIP, ["car1", "car2"], 3) == [30, 20, 10]
    assert store.open_starts(conn, TRIP, ["car1", "car2"]) == [30] and store.open_starts(conn, CHARGE, ["car1"]) == []
    assert sorted(r["start"] for r in store.rows_from(conn, TRIP, ["car1", "car2"], 10)) == [10, 20, 30]  # open rows too
    assert sorted(r["start"] for r in store.closed_before(conn, TRIP, ["car1", "car2"], 20)) == [0, 10]
    assert store.closed_before(conn, TRIP, ["car1"], 30)[0]["vehicle_id"] == "car1"
    assert store.any_before(conn, TRIP, ["car1"], 20) and not store.any_before(conn, TRIP, ["car1"], 0)
    assert not store.any_before(conn, CHARGE, ["car1"], 100)


def test_similar_trips_are_earlier_closed_with_the_same_places_newest_first(conn):
    for start, a, b in ((0, "A", "B"), (10, "A", "B"), (20, "A", "C"), (30, "A", "B"), (40, "A", "B")):
        seed_trip(conn, "car1", start, start + 5, **{"from": a, "to": b})
    seed_trip(conn, "car1", 50, None, **{"from": "A", "to": "B"})
    seed_trip(conn, "car2", 5, 8, **{"from": "A", "to": "B"})
    assert [r["start"] for r in store.similar(conn, "car1", 40, "A", "B", 20)] == [30, 10, 0]
    assert [r["start"] for r in store.similar(conn, "car1", 40, "A", "B", 1)] == [30]


def test_trip_distance_and_first_trip_start(conn):
    assert store.first_trip_start(conn, "car1", 99) == 99 and store.trip_distance_m(conn, "car1", 0, 1000) == 0
    seed_trip(conn, "car1", 10, 20, distance_m=100)
    seed_trip(conn, "car1", 30, 40, distance_m=50)
    seed_trip(conn, "car1", 50, None, distance_m=5)
    seed_trip(conn, "car1", 60, 70)  # no distance
    assert store.first_trip_start(conn, "car1", 99) == 10
    assert store.trip_distance_m(conn, "car1", 0, 40) == 150 and store.trip_distance_m(conn, "car1", 15, 70) == 50  # start >= lo, end <= hi
    assert store.trip_distance_m(conn, "car1", 0, 1000) == 150  # the open one is not counted


def test_charged_by_place_sums_closed_charges_in_range(conn):
    seed_charge(conn, "car1", 0, 5, place="Home", added_wh=1000)
    seed_charge(conn, "car2", 10, 15, place="Home", added_wh=500)
    seed_charge(conn, "car1", 20, 25, place=None, added_wh=300)
    seed_charge(conn, "car1", 30, 35, place="Work")  # no energy
    seed_charge(conn, "car1", 40, None, place="Home", added_wh=9999)
    seed_charge(conn, "car1", 100, 105, place="Home", added_wh=7)  # past hi
    assert sorted(store.charged_by_place(conn, ["car1", "car2"], 0, 100), key=lambda p: (p[0] is None, p[0] or "")) == [
        ("Home", 1500.0), ("Work", 0.0), (None, 300.0)]


def test_place():
    assert store.place("Home", "Spot") == "Home"
    assert store.place(None, "Spot") == "Spot"
    assert store.place(None, None) is None


def _named(table, conn):
    return conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]


def test_relabel_after_a_zone_rename(conn):
    A, B = (52.0, 5.0), (52.1, 5.1)
    seed_trip(conn, "car1", 0, 5, from_lat=A[0], from_lon=A[1], to_lat=B[0], to_lon=B[1], **{"from": "Home", "to": "Work"})
    seed_charge(conn, "car1", 10, 15, lat=A[0], lon=A[1], zone="Home", place="Home")
    renamed = lambda lat, lon: {A: "Home 2", B: "Work"}[(lat, lon)]
    assert store.relabel(conn, renamed, lambda lat, lon: None) == 2
    trip = store.row(conn, TRIP, "car1", 0)
    assert (trip["from"], trip["to"]) == ("Home 2", "Work")
    charge = store.row(conn, CHARGE, "car1", 10)
    assert (charge["zone"], charge["place"]) == ("Home 2", "Home 2")
    assert (_named("trips", conn), _named("charges", conn)) == (1, 1)  # rows renamed, none rebuilt
    assert store.relabel(conn, renamed, lambda lat, lon: None) == 0  # nothing left to change


def test_relabel_names_a_charge_outside_every_zone_after_its_spot(conn):
    seed_charge(conn, "car1", 0, 5, lat=52.0, lon=5.0, zone="Old", place="Old")
    seed_charge(conn, "car1", 10, 15, lat=52.0, lon=5.0, zone=None, place=None)
    assert store.relabel(conn, lambda lat, lon: None, lambda lat, lon: "Plaza") == 2
    assert [store.row(conn, CHARGE, "car1", s)[k] for s in (0, 10) for k in ("zone", "place")] == [None, "Plaza"] * 2
    assert store.relabel(conn, lambda lat, lon: None, lambda lat, lon: None) == 2  # a deleted spot: back to nothing
    assert [store.row(conn, CHARGE, "car1", s)["place"] for s in (0, 10)] == [None, None]


def test_relabel_is_one_transaction_that_rolls_back_on_error(conn):
    seed_charge(conn, "car1", 0, 5, lat=52.0, lon=5.0, zone="Old", place="Old")
    seed_charge(conn, "car1", 10, 15, lat=52.1, lon=5.0, zone="Old", place="Old")
    seen = []
    def zones(lat, lon):
        seen.append(conn.in_transaction)
        if len(seen) == 2:
            raise RuntimeError("boom")
        return "New"
    with pytest.raises(RuntimeError):
        store.relabel(conn, zones, lambda lat, lon: None)
    assert seen == [True, True] and not conn.in_transaction
    assert [store.row(conn, CHARGE, "car1", s)["zone"] for s in (0, 10)] == ["Old", "Old"]  # the first rename went with it


def test_relabel_skips_rows_without_gps(conn):
    seed_charge(conn, "car1", 0, 5, lat=None, lon=None, zone=None, place="Cloud")
    seed_trip(conn, "car1", 10, 15, **{"from": "Kept", "to": "Kept"})
    seed_trip(conn, "car1", 20, 25, from_lat=52.0, from_lon=5.0, **{"from": "Old"})  # only a start fix: the end has no place
    assert store.relabel(conn, lambda lat, lon: "New", lambda lat, lon: "Spot") == 1
    assert store.row(conn, CHARGE, "car1", 0)["place"] == "Cloud"
    assert [(t["from"], t["to"]) for t in store.closed(conn, TRIP, "car1")] == [("New", None), ("Kept", "Kept")]


TRIP_FIELDS = {"distance_m": 1500.5, "duration_s": 360, "net_wh": 220.5, "gross_wh": 300.0, "recup_wh": 79.5, "from": "Home", "to": "Work",
               "avg_speed_mps": 12.5, "max_speed_mps": 25.0, "start_wh": 50_000.0, "end_wh": 49_780.0, "avg_temp_c": 11.5,
               "odometer_start_km": 100.0, "odometer_end_km": 101.5}
CHARGE_FIELDS = {"added_wh": 5000.0, "energy_source": "car", "start_wh": 20_000.0, "end_wh": 25_000.0, "lat": 52.0, "lon": 5.0, "zone": "Home",
                 "place": "Home", "duration_s": 3600, "range_added_m": 30_000.0, "avg_w": 5000.0, "times_source": "car"}
POINTS = {"from_lat": 52.0, "from_lon": 5.0, "to_lat": 52.1, "to_lon": 5.1}


def test_columns_round_trip(conn):
    trip = seed_trip(conn, "car1", 1000, 2000, **TRIP_FIELDS)
    cloud = {**CHARGE_FIELDS, "lat": None, "lon": None, "zone": None, "place": None, "times_source": "cloud"}
    charges = [seed_charge(conn, "car1", 1000, 2000, **CHARGE_FIELDS), seed_charge(conn, "car1", 3000, None, **cloud)]
    assert trip == {"start": 1000, "end": 2000, **TRIP_FIELDS, "from_address": None, "to_address": None} and store.row(conn, TRIP, "car1", 1000) == trip
    assert charges == [{"start": 1000, "end": 2000, **CHARGE_FIELDS, "address": None}, {"start": 3000, "end": None, **cloud, "address": None}]
    assert [store.row(conn, CHARGE, "car1", c["start"]) for c in charges] == charges
    assert store.closed(conn, TRIP, "car1") == [trip] and store.closed(conn, CHARGE, "car1") == charges[:1]
    # a field is in a column or in json, never both; the null ones are columns too
    assert conn.execute("SELECT json FROM trips").fetchone()[0].count("distance_m") == 0
    assert set(json.loads(conn.execute("SELECT json FROM charges WHERE start=3000").fetchone()[0])) == {
        "end_wh", "duration_s", "range_added_m", "avg_w", "times_source"}


def test_trip_points_are_columns_never_in_a_row(conn):
    store.insert(conn, TRIP, "car1", {"start": 1, "end": 2, **POINTS, **TRIP_FIELDS}, None, None, ALGO)
    assert conn.execute("SELECT from_lat, from_lon, to_lat, to_lon FROM trips").fetchone() == tuple(POINTS.values())
    leaked = set(store.row(conn, TRIP, "car1", 1)) | set(json.loads(conn.execute("SELECT json FROM trips").fetchone()[0]))
    assert not set(POINTS) & leaked
    seed_trip(conn, "car1", 3, 4)  # no fix
    assert store.trip_points(conn) == [("car1", 1, *POINTS.values())]
    store.insert(conn, TRIP, "car2", {"start": 5, "end": 6, "from_lat": 1.0, "from_lon": 2.0}, None, None, ALGO)  # only a start fix
    assert ("car2", 5, 1.0, 2.0, None, None) in store.trip_points(conn)


def test_unaddressed_skips_named_points(conn):
    seed_trip(conn, "car1", 10, 20, **{"from": "Home", "from_lat": 51.2, "from_lon": 4.3, "to_lat": 51.3, "to_lon": 4.4})
    assert store.unaddressed(conn) == (513000, 44000)  # only the unnamed end
    store.save_address(conn, 513000, 44000, "Teststraat 1, Teststad", 1)
    assert store.unaddressed(conn) is None


def test_unaddressed_newest_first(conn):
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    seed_charge(conn, "car2", 30, None, lat=51.4, lon=4.5)  # open counts
    seed_charge(conn, "car1", 50, 60, lat=51.6, lon=4.7, place="Home")
    seed_charge(conn, "car1", 70, 80)  # no fix
    assert store.unaddressed(conn) == (514000, 45000)
    store.save_address(conn, 514000, 45000, None, 1)
    assert store.unaddressed(conn) == (512000, 43000)


def test_address_key_matches_on_edges(conn):
    seed_charge(conn, "car1", 10, 20, lat=52.00005, lon=-0.00005)
    key = store.unaddressed(conn)
    store.save_address(conn, *key, "X 1, Y", 1)
    assert store.row(conn, CHARGE, "car1", 10)["address"] == "X 1, Y"
    assert store.unaddressed(conn) is None


def test_trip_reads_carry_addresses(conn):
    seed_trip(conn, "car1", 10, 20, from_lat=51.2, from_lon=4.3, to_lat=51.3, to_lon=4.4)
    seed_trip(conn, "car1", 30, None, from_lat=51.2, from_lon=4.3)
    seed_trip(conn, "car1", 50, 60)
    nones = {"from_address": None, "to_address": None}
    assert store.row(conn, TRIP, "car1", 50) | nones == store.row(conn, TRIP, "car1", 50)
    store.save_address(conn, 512000, 43000, "A 1, B", 1)
    want = {10: ("A 1, B", None), 30: ("A 1, B", None), 50: (None, None)}
    reads = {"row": [store.row(conn, TRIP, "car1", s) for s in want], "closed": store.closed(conn, TRIP, "car1"),
             "in_range": store.in_range(conn, TRIP, ["car1"], 0, 100), "current": [store.current_trip(conn, "car1")]}
    for got in reads.values():
        assert all((d["from_address"], d["to_address"]) == want[d["start"]] for d in got)
    assert [len(v) for v in reads.values()] == [3, 2, 2, 1]
    store.save_address(conn, 513000, 44000, "C 2, D", 1)
    assert store.row(conn, TRIP, "car1", 10)["to_address"] == "C 2, D"


def test_saved_none_is_final(conn):
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    store.save_address(conn, 512000, 43000, None, 1)
    assert store.unaddressed(conn) is None
    assert store.row(conn, CHARGE, "car1", 10)["address"] is None


def test_insert_ignores_address_fields(conn):
    store.insert(conn, TRIP, "car1", {"start": 1, "end": 2, "from_lat": 51.2, "from_lon": 4.3, "from_address": "Fake", "to_address": "Fake"},
                 None, None, ALGO)
    store.insert(conn, CHARGE, "car1", {"start": 1, "end": 2, "lat": 51.2, "lon": 4.3, "address": "Fake"}, None, None, ALGO)
    assert "Fake" not in "".join(r[0] for k in KINDS for r in conn.execute(f"SELECT json FROM {k.table}"))
    store.save_address(conn, 512000, 43000, "Real", 1)
    assert store.row(conn, TRIP, "car1", 1)["from_address"] == "Real" and store.row(conn, CHARGE, "car1", 1)["address"] == "Real"
    assert store.row(conn, TRIP, "car1", 1)["to_address"] is None
