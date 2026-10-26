from datetime import date, datetime
from zoneinfo import ZoneInfo

import pytest

from car_insights import costs, prices
from car_insights.db import connect
from conftest import seed_charge, seed_trip

LAT, LON = 52.0, 5.0
TZ = ZoneInfo("Europe/Amsterdam")
DAY = 86_400_000
END = 100 * DAY  # a trip end far enough from 0 that charges can lie 31 days before it


@pytest.fixture
def c():
    c = connect(":memory:")
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    return c


def ch(**kw):
    return {"start": 5000, "end": 8600, "added_wh": 20_000, "avg_w": 11_000, "duration_s": 3600, "lat": LAT, "lon": LON, **kw}


def spot(c, name="Home", start=5000, **tariff):
    seed_charge(c, "car1", start, start + 3600, lat=LAT, lon=LON)
    return prices.create_spot(c, "car1", start, name, **tariff)


def test_spot_price(c):
    spot(c, per_kwh=0.50, start_fee=1.00, per_min=0.02)
    r = costs.charge_cost(prices.book(c, "car1"), ch())
    assert r["amount"] == pytest.approx(12.3)
    assert (r["basis"], r["spot"], r["current"]) == ("spot", "Home", "ac")


def test_default_ac(c):
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(prices.book(c, "car1"), ch())
    assert r["amount"] == pytest.approx(8.08)
    assert (r["basis"], r["current"], r["spot_id"]) == ("default", "ac", None)


def test_dc_above_22kw(c):
    prices.set_tariff(c, "dc", 0, 0.60)
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(prices.book(c, "car1"), ch(avg_w=22_001))
    assert r["amount"] == pytest.approx(12.6) and r["current"] == "dc"
    assert costs.charge_cost(prices.book(c, "car1"), ch(avg_w=22_000))["current"] == "ac"


def test_spot_tariff_not_yet_valid(c):
    spot(c, per_kwh=0.50)
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(prices.book(c, "car1"), ch(start=1000, end=4600))
    assert r["basis"] == "default" and r["spot"] == "Home"


def test_card(c):
    prices.set_tariff(c, "ac", 0, 0.40)
    prices.set_card(c, "car1", 10, 0.35)
    assert costs.charge_cost(prices.book(c, "car1"), ch())["amount"] == pytest.approx(9.238)


def test_receipt_wins(c):
    seed_charge(c, "car1", 5000, 8600)
    prices.set_receipt(c, "car1", 5000, 9.99)
    r = costs.charge_cost(prices.book(c, "car1"), ch())
    assert (r["amount"], r["basis"]) == (9.99, "receipt")


@pytest.mark.parametrize("kw", [{"added_wh": None}, {"added_wh": -300}, {"end": None}])
def test_not_available(c, kw):
    prices.set_tariff(c, "ac", 0, 0.40)  # a price exists, so only the charge itself can make the amount unavailable
    r = costs.charge_cost(prices.book(c, "car1"), ch(**kw))
    assert r["amount"] is None and r["basis"] is None


def test_not_available_without_a_price(c):
    r = costs.charge_cost(prices.book(c, "car1"), ch())
    assert r["amount"] is None and r["basis"] is None


def fixed(c, amount, period, start, end=None, vid="car1"):
    prices.add_fixed_cost(c, vid, "x", amount, period, start, end)


def test_fixed_monthly_spread(c):
    fixed(c, 31.0, "month", date(2026, 10, 1))
    assert costs.fixed_between(c, ["car1"], date(2026, 10, 1), date(2026, 11, 1)) == 31.0
    assert costs.fixed_between(c, ["car1"], date(2026, 10, 1), date(2026, 10, 8)) == 7.0


def test_fixed_quarter(c):
    fixed(c, 90.0, "quarter", date(2026, 7, 1))
    assert costs.fixed_between(c, ["car1"], date(2026, 7, 1), date(2026, 7, 2)) == pytest.approx(90 / 92)


def test_fixed_start_end_inclusive(c):
    fixed(c, 30.0, "month", date(2026, 11, 10), date(2026, 11, 19))
    assert costs.fixed_between(c, ["car1"], date(2026, 11, 1), date(2026, 12, 1)) == 10.0


def test_fixed_once(c):
    fixed(c, 50.0, "once", date(2026, 10, 15))
    assert costs.fixed_between(c, ["car1"], date(2026, 10, 1), date(2026, 11, 1)) == 50
    assert costs.fixed_between(c, ["car1"], date(2026, 10, 16), date(2026, 11, 1)) == 0


def test_fixed_other_vehicle_excluded(c):
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('car2')")
    fixed(c, 50.0, "once", date(2026, 10, 15), vid="car2")
    assert costs.fixed_between(c, ["car1"], date(2026, 10, 1), date(2026, 11, 1)) == 0


def charge(c, start, kwh, receipt):
    seed_charge(c, "car1", start, start + 3_600_000, added_wh=kwh * 1000, avg_w=11_000, duration_s=3600)
    prices.set_receipt(c, "car1", start, receipt)


def trip(c, start, end, km, net_wh=0):
    m = int(km * 1000)  # whole metres, as stored: SQLite divides integers as integers
    return seed_trip(c, "car1", start, end, distance_m=m, net_wh=net_wh)


def test_trip_energy_weighted(c):
    charge(c, END - DAY, 20, 10.0)
    charge(c, END - 2 * DAY, 10, 6.0)
    charge(c, END - 31 * DAY, 10, 100.0)  # outside the 30-day window
    r = costs.trip_cost(c, "car1", {"start": END - 3_600_000, "end": END, "distance_m": 10_000, "net_wh": 3000}, TZ)
    assert r["energy"] == pytest.approx(1.6)


def test_trip_energy_fallback(c):
    t = {"start": END - 3_600_000, "end": END, "distance_m": 10_000, "net_wh": 3000}
    assert costs.trip_cost(c, "car1", t, TZ)["energy"] is None
    prices.set_tariff(c, "ac", 0, 0.40)
    assert costs.trip_cost(c, "car1", t, TZ)["energy"] == pytest.approx(1.212)


def test_trip_negative_net(c):
    prices.set_tariff(c, "ac", 0, 0.40)
    t = {"start": END - 3_600_000, "end": END, "distance_m": 10_000, "net_wh": -500}
    assert costs.trip_cost(c, "car1", t, TZ)["energy"] == 0.0


def ms(d, h=12):
    return int(datetime(2026, 10, d, h, tzinfo=TZ).timestamp() * 1000)


@pytest.mark.parametrize("first_km, fixed_part", [(79, None), (180, 6.0), (180.5, 60 / 200.5 * 20)])
def test_trip_fixed_gate(c, first_km, fixed_part):
    prices.set_tariff(c, "ac", 0, 0.40)
    fixed(c, 60.0, "once", date(2026, 10, 5))
    trip(c, ms(1), ms(1, 13), first_km)
    t = trip(c, ms(30), ms(30, 13), 20, 3000)
    r = costs.trip_cost(c, "car1", t, TZ)
    assert r["fixed"] == (fixed_part and pytest.approx(fixed_part))
    assert r["total"] == pytest.approx(r["energy"] + (fixed_part or 0))


def test_trip_open(c):
    r = costs.trip_cost(c, "car1", {"start": 5000, "end": None, "distance_m": None, "net_wh": None}, TZ)
    assert r == {"energy": None, "fixed": None, "total": None}


def test_charge_cost_needs_no_database():
    book = prices.Book(tariffs={"ac": [{"valid_from": 0, "per_kwh": 0.30, "start_fee": 0, "per_min": 0}]})
    r = costs.charge_cost(book, {"start": 0, "end": 3_600_000, "added_wh": 20_000, "avg_w": 11_000, "duration_s": 3600})
    assert r["amount"] == pytest.approx(20 * 1.01 * 0.30) and r["current"] == "ac" and r["basis"] == "default"


def test_period_costs_loads_one_book_per_vehicle(c, monkeypatch):
    prices.set_tariff(c, "ac", 0, 0.40)
    for i in range(5):
        charge(c, 1000 + i * 4_000_000, 10, None)
    loaded = []
    real = prices.book
    monkeypatch.setattr(prices, "book", lambda conn, vid: loaded.append(vid) or real(conn, vid))
    costs.period_costs(c, ["car1"], 0, 10**9, TZ, 10**9)
    assert loaded == ["car1"]
