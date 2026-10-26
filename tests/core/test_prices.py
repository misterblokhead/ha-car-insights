from datetime import date

import pytest

from custom_components.car_insights.core import prices, store
from custom_components.car_insights.core.db import connect
from custom_components.car_insights.core.kinds import CHARGE
from conftest import seed_charge


@pytest.fixture
def c():
    c = connect(":memory:")
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    return c


def charge(c, start, end=None, lat=None, lon=None, zone=None, place=None):
    seed_charge(c, "car1", start, end or start + 1000, lat=lat, lon=lon, zone=zone, place=place)


def place(c, start):
    return store.row(c, CHARGE, "car1", start)["place"]


def count(c, table):
    return c.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]


def test_migration_adds_cost_tables(c):
    for t in ("charge_spots", "tariffs", "fixed_costs", "charge_receipts"):
        assert count(c, t) == 0
    assert c.execute("SELECT card_markup_pct, card_start_fee FROM vehicles").fetchone() == (0, 0)


def test_tariff_boundary(c):
    prices.set_tariff(c, "ac", 1000, 0.40)
    prices.set_tariff(c, "ac", 2000, 0.50)
    assert prices.book(c, "car1").tariff_at("ac", 999) is None
    assert prices.book(c, "car1").tariff_at("ac", 1000)["per_kwh"] == 0.40
    assert prices.book(c, "car1").tariff_at("ac", 1999)["per_kwh"] == 0.40
    assert prices.book(c, "car1").tariff_at("ac", 2000) == {"valid_from": 2000, "per_kwh": 0.50, "start_fee": 0, "per_min": 0}


def test_set_tariff_upserts(c):
    prices.set_tariff(c, "ac", 1000, 0.40)
    prices.set_tariff(c, "ac", 1000, 0.45)
    assert count(c, "tariffs") == 1
    assert prices.book(c, "car1").tariff_at("ac", 1000)["per_kwh"] == 0.45


def test_set_tariff_unknown_spot(c):
    with pytest.raises(KeyError):
        prices.set_tariff(c, "nope", 0, 0.3)


NAN, INF = float("nan"), float("inf")


@pytest.mark.parametrize("call", [
    lambda c: prices.set_tariff(c, "ac", 0, 5.01),
    lambda c: prices.set_tariff(c, "ac", 0, -0.01),
    lambda c: prices.set_tariff(c, "ac", 0, NAN),
    lambda c: prices.set_tariff(c, "ac", 0, INF),
    lambda c: prices.set_tariff(c, "ac", 0, 1, start_fee=1000.01),
    lambda c: prices.set_tariff(c, "ac", 0, 1, per_min=NAN),
    lambda c: prices.set_card(c, "car1", 100.1, 0),
    lambda c: prices.set_card(c, "car1", 0, INF),
    lambda c: prices.add_fixed_cost(c, "car1", "Tax", 100000.01, "year", date(2026, 1, 1), None),
    lambda c: prices.add_fixed_cost(c, "car1", "", 1, "year", date(2026, 1, 1), None),
    lambda c: prices.add_fixed_cost(c, "car1", "   ", 1, "year", date(2026, 1, 1), None),
    lambda c: prices.add_fixed_cost(c, "car1", "x" * 41, 1, "year", date(2026, 1, 1), None),
    lambda c: prices.add_fixed_cost(c, "car1", "Tax", 1, "week", date(2026, 1, 1), None),
    lambda c: prices.add_fixed_cost(c, "car1", "Tax", 1, "year", date(2026, 1, 2), date(2026, 1, 1)),
    lambda c: prices.set_receipt(c, "car1", 5, 1000.01),
    lambda c: prices.add_fixed_cost(c, "car1", "Tax", 1, "year", date(1999, 12, 31), None),
    lambda c: prices.add_fixed_cost(c, "car1", "Tax", 1, "year", date(2026, 1, 1), date(2101, 1, 1)),
])
def test_limits(c, call):
    charge(c, 5)
    with pytest.raises(ValueError):
        call(c)
    assert [count(c, t) for t in ("tariffs", "fixed_costs", "charge_receipts")] == [0, 0, 0]
    assert c.execute("SELECT card_markup_pct, card_start_fee FROM vehicles").fetchone() == (0, 0)


def test_limit_bounds_pass(c):
    prices.set_tariff(c, "ac", 0, 5, start_fee=1000)
    assert prices.book(c, "car1").tariff_at("ac", 0)["per_kwh"] == 5


def test_spot_name_limits(c):
    charge(c, 10, lat=52.1, lon=5.2)
    for bad in ("", "   ", "x" * 41):
        with pytest.raises(ValueError):
            prices.create_spot(c, "car1", 10, bad, 0.3)
    assert count(c, "charge_spots") == 0


def test_create_spot_from_charge(c):
    charge(c, 10_000, lat=52.1, lon=5.2)
    sid = prices.create_spot(c, "car1", 10_000, " Plaza ", 0.35)
    assert prices.book(c, "car1").spot_at(52.1, 5.2) == (sid, "Plaza")
    assert prices.spot_name_at(c, 52.1, 5.2) == "Plaza"
    assert prices.book(c, "car1").tariff_at(sid, 10_000)["per_kwh"] == 0.35


def test_spot_namer_and_books_query_once(c):
    charge(c, 10_000, lat=52.1, lon=5.2)
    prices.create_spot(c, "car1", 10_000, "Plaza", 0.35)
    queries = []
    c.set_trace_callback(queries.append)
    name = prices.spot_namer(c)
    assert [name(52.1, 5.2) for _ in range(3)] == ["Plaza"] * 3 and name(52.5, 5.5) is None
    assert len(queries) == 1  # one load, however many points are asked
    queries.clear()
    books = prices.books(c)
    assert books("car1") is books("car1") and books("car1") is not books("car2")
    assert len([q for q in queries if "FROM tariffs" in q]) == 2  # a book per vehicle, once


def test_create_spot_needs_point_and_charge(c):
    charge(c, 10_000)
    with pytest.raises(ValueError, match="no GPS point"):
        prices.create_spot(c, "car1", 10_000, "Plaza", 0.35)
    with pytest.raises(KeyError):
        prices.create_spot(c, "car1", 99, "Plaza", 0.35)


def test_spot_at_nearest_of_overlapping(c):
    for s, lon in (("a", 5.0), ("b", 5.00088)):
        c.execute("INSERT INTO charge_spots VALUES(?,?,?,?,100)", (s, s.upper(), 52.0, lon))
    assert prices.book(c, "car1").spot_at(52.0, 5.0007) == ("b", "B")
    assert prices.book(c, "car1").spot_at(52.0, 5.0) == ("a", "A")
    assert prices.book(c, "car1").spot_at(52.0, 5.0 - 0.0023) is None  # about 157 m west of both


def test_spot_writes_leave_the_charges_alone(c):
    """places follow a spot through store.relabel, which the spot routes call after the write"""
    charge(c, 10, lat=52.1, lon=5.2, place="Kept")
    sid = prices.create_spot(c, "car1", 10, "Plaza", 0.35)
    prices.rename_spot(c, sid, " Mall ")
    assert c.execute("SELECT name FROM charge_spots").fetchone()[0] == "Mall" and place(c, 10) == "Kept"
    prices.delete_spot(c, sid)
    assert count(c, "tariffs") == 0 and count(c, "charge_spots") == 0 and place(c, 10) == "Kept"
    for call in (lambda: prices.rename_spot(c, "nope", "x"), lambda: prices.delete_spot(c, "nope")):
        with pytest.raises(KeyError):
            call()


def test_receipt_survives_earlier_start(c):
    charge(c, 5000, 9000)
    prices.set_receipt(c, "car1", 5000, 12.5)
    charge(c, 4000, 9000)
    c.execute("DELETE FROM charges WHERE start=5000")
    assert prices.book(c, "car1").receipt_for(4000, 9000) == 12.5
    assert prices.book(c, "car1").receipt_for(6000, 9000) is None
    assert prices.book(c, "car1").receipt_for(6000, None) is None
    assert prices.book(c, "car1").receipt_for(4000, None) == 12.5
    prices.set_receipt(c, "car1", 4000, 20)  # the old row at 5000 must not shadow the edit
    assert prices.book(c, "car1").receipt_for(4000, 9000) == 20
    prices.set_receipt(c, "car1", 4000, None)
    assert prices.book(c, "car1").receipt_for(4000, 9000) is None


def test_receipt_newest_start_wins(c):
    charge(c, 5000, 9000)
    charge(c, 6000, 9000)
    prices.set_receipt(c, "car1", 5000, 1)
    prices.set_receipt(c, "car1", 6000, 2)
    assert prices.book(c, "car1").receipt_for(4000, 9000) == 2


def test_receipt_clear_and_unknown(c):
    charge(c, 5000)
    prices.set_receipt(c, "car1", 5000, 3)
    prices.set_receipt(c, "car1", 5000, None)
    assert count(c, "charge_receipts") == 0
    with pytest.raises(KeyError):
        prices.set_receipt(c, "car1", 1, 3)


def test_fixed_cost_lifecycle(c):
    cid = prices.add_fixed_cost(c, "car1", " Insurance ", 300, "quarter", date(2026, 1, 1), None)
    assert prices.end_fixed_cost(c, cid, date(2026, 12, 31)) == "car1"
    with pytest.raises(ValueError):
        prices.end_fixed_cost(c, cid, date(2025, 12, 31))
    with pytest.raises(ValueError):
        prices.end_fixed_cost(c, cid, date(2101, 1, 1))
    assert prices.delete_fixed_cost(c, cid) == "car1"
    with pytest.raises(KeyError):
        prices.delete_fixed_cost(c, cid)
    with pytest.raises(KeyError):
        prices.end_fixed_cost(c, cid, None)
    with pytest.raises(KeyError):
        prices.add_fixed_cost(c, "nope", "Tax", 1, "year", date(2026, 1, 1), None)


def test_card(c):
    assert prices.book(c, "car1").card == (0.0, 0.0)
    assert prices.book(c, "nope").card == (0.0, 0.0)
    prices.set_card(c, "car1", 10, 0.35)
    assert prices.book(c, "car1").card == (10.0, 0.35)
    with pytest.raises(KeyError):
        prices.set_card(c, "nope", 1, 1)


def test_settings_shape(c):
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('car0')")
    charge(c, 10, lat=52.1, lon=5.2)
    charge(c, 20, lat=53.1, lon=5.2)
    z = prices.create_spot(c, "car1", 10, "zeta", 0.3)
    a = prices.create_spot(c, "car1", 20, "Alpha", 0.4)
    prices.set_tariff(c, "dc", 100, 0.6)
    prices.set_tariff(c, "dc", 200, 0.7)
    prices.set_tariff(c, a, 500, 0.45, 1, 0.02)
    prices.add_fixed_cost(c, "car1", "B", 1, "month", date(2026, 3, 1), date(2026, 4, 1))
    prices.add_fixed_cost(c, "car1", "A", 2, "once", date(2026, 2, 1), None)
    prices.add_fixed_cost(c, "car0", "C", 3, "year", date(2026, 9, 1), None)
    prices.set_card(c, "car1", 5, 0.2)
    s = prices.settings(c)
    assert set(s) == {"ac", "dc", "spots", "fixed_costs", "cards"}
    assert s["ac"] == []
    assert [t["valid_from"] for t in s["dc"]] == [200, 100]
    assert [x["name"] for x in s["spots"]] == ["Alpha", "zeta"]
    assert s["spots"][0] == {"id": a, "name": "Alpha", "lat": 53.1, "lon": 5.2, "radius_m": 100,
                             "tariffs": [{"valid_from": 500, "per_kwh": 0.45, "start_fee": 1, "per_min": 0.02},
                                         {"valid_from": 20, "per_kwh": 0.4, "start_fee": 0, "per_min": 0}]}
    assert z in {x["id"] for x in s["spots"]}
    assert [(f["vehicle_id"], f["name"]) for f in s["fixed_costs"]] == [("car0", "C"), ("car1", "A"), ("car1", "B")]
    assert s["fixed_costs"][2] | {"id": None} == {"id": None, "vehicle_id": "car1", "name": "B", "amount": 1, "period": "month",
                                                   "start": "2026-03-01", "end": "2026-04-01"}
    assert s["cards"]["car1"] == {"markup_pct": 5, "start_fee": 0.2}
