import pytest

from car_insights import costs, prices
from car_insights.db import connect, json_dumps
from car_insights.derive import ALGO

LAT, LON = 52.0, 5.0


@pytest.fixture
def c():
    c = connect(":memory:")
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('car1')")
    return c


def ch(**kw):
    return {"start": 5000, "end": 8600, "added_wh": 20_000, "avg_w": 11_000, "duration_s": 3600, "lat": LAT, "lon": LON, **kw}


def spot(c, name="Home", start=5000, **tariff):
    c.execute("INSERT INTO charges VALUES('car1',?,?,?,?)", (start, start + 3600, ALGO, json_dumps({"lat": LAT, "lon": LON})))
    return prices.create_spot(c, "car1", start, name, **tariff)


def test_spot_price(c):
    spot(c, per_kwh=0.50, start_fee=1.00, per_min=0.02)
    r = costs.charge_cost(c, "car1", ch())
    assert r["amount"] == pytest.approx(13.2)
    assert (r["basis"], r["spot"], r["kind"]) == ("spot", "Home", "ac")


def test_default_ac(c):
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(c, "car1", ch())
    assert r["amount"] == pytest.approx(8.8)
    assert (r["basis"], r["kind"], r["spot_id"]) == ("default", "ac", None)


def test_dc_above_22kw(c):
    prices.set_tariff(c, "dc", 0, 0.60)
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(c, "car1", ch(avg_w=22_001))
    assert r["amount"] == pytest.approx(12.6) and r["kind"] == "dc"
    assert costs.charge_cost(c, "car1", ch(avg_w=22_000))["kind"] == "ac"


def test_spot_tariff_not_yet_valid(c):
    spot(c, per_kwh=0.50)
    prices.set_tariff(c, "ac", 0, 0.40)
    r = costs.charge_cost(c, "car1", ch(start=1000, end=4600))
    assert r["basis"] == "default" and r["spot"] == "Home"


def test_card(c):
    prices.set_tariff(c, "ac", 0, 0.40)
    prices.set_card(c, "car1", 10, 0.35)
    assert costs.charge_cost(c, "car1", ch())["amount"] == pytest.approx(10.03)


def test_receipt_wins(c):
    c.execute("INSERT INTO charges VALUES('car1',5000,8600,?,?)", (ALGO, json_dumps({})))
    prices.set_receipt(c, "car1", 5000, 9.99)
    r = costs.charge_cost(c, "car1", ch())
    assert (r["amount"], r["basis"]) == (9.99, "receipt")


@pytest.mark.parametrize("kw", [{"added_wh": None}, {"end": None}, {}])
def test_not_available(c, kw):
    r = costs.charge_cost(c, "car1", ch(**kw))
    assert r["amount"] is None and r["basis"] is None
