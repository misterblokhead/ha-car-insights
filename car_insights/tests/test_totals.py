from datetime import date, datetime
from zoneinfo import ZoneInfo

from pytest import approx

from car_insights import costs, db, prices, stats
from car_insights.periods import period_starts
from car_insights.totals import totals
from conftest import seed_charge, seed_trip

TZ = ZoneInfo("Europe/Amsterdam")


def ms(y, mo, d, h=0):
    return int(datetime(y, mo, d, h, tzinfo=TZ).timestamp() * 1000)


NOW = ms(2026, 10, 23, 12)


def conn_with(trips=(), charges=()):
    c = db.connect(":memory:")
    for vid, start, end, dist, net in trips:
        seed_trip(c, vid, start, end, distance_m=dist, net_wh=net)
    for vid, start, end, added in charges:
        seed_charge(c, vid, start, end, added_wh=added)
    return c


def plain(m):
    return {k: v for k, v in m.items() if k not in ("cost", "wh_per_100km")}


def test_period_starts_local_midnight():
    assert period_starts(NOW, TZ) == (ms(2026, 10, 1), ms(2026, 1, 1))
    assert period_starts(NOW, TZ) == (
        int(datetime.fromisoformat("2026-10-01T00:00:00+02:00").timestamp() * 1000),
        int(datetime.fromisoformat("2026-01-01T00:00:00+01:00").timestamp() * 1000),
    )


def test_totals_sum_closed_rows_only():
    s = ms(2026, 10, 5, 8)
    c = conn_with(
        trips=[("a", s, s + 1000, 1000.0, 100.0), ("a", s + 5000, s + 6000, None, None), ("a", s + 9000, None, 7000.0, 700.0)],
        charges=[("a", s, s + 1000, 500.0), ("a", s + 5000, None, 900.0)],
    )
    t = totals(c, ["a"], NOW, TZ)
    assert plain(t["month"]) == {"distance_m": 1000.0, "net_wh": 100.0, "charged_wh": 500.0, "trips": 2, "charges": 1}
    assert t["year"] == t["month"] and "cost" in t["year"]


def test_totals_over_two_vehicles_is_plain_sum():
    s = ms(2026, 10, 5, 8)
    c = conn_with(trips=[("a", s, s + 1, 1000.0, 100.0), ("b", s, s + 1, 2000.0, 200.0), ("c", s, s + 1, 9.0, 9.0)], charges=[("b", s, s + 1, 300.0)])
    m = totals(c, ["a", "b"], NOW, TZ)["month"]
    assert plain(m) == {"distance_m": 3000.0, "net_wh": 300.0, "charged_wh": 300.0, "trips": 2, "charges": 1}
    assert plain(totals(c, [], NOW, TZ)["month"]) == {"distance_m": 0.0, "net_wh": 0.0, "charged_wh": 0.0, "trips": 0, "charges": 0}


def test_row_before_month_counts_for_year_only():
    s = ms(2026, 9, 30, 23)
    c = conn_with(trips=[("a", s, s + 1, 1000.0, 100.0)], charges=[("a", s, s + 1, 500.0)])
    t = totals(c, ["a"], NOW, TZ)
    assert t["month"]["trips"] == 0 and t["month"]["distance_m"] == 0.0
    assert plain(t["year"]) == {"distance_m": 1000.0, "net_wh": 100.0, "charged_wh": 500.0, "trips": 1, "charges": 1}


def test_month_cost():
    now = ms(2026, 10, 10, 12)
    s = ms(2026, 10, 5, 8)
    c = db.connect(":memory:")
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('a')")
    prices.set_tariff(c, "ac", 0, 0.40)
    for st, wh in ((s, 20_000), (s + 86_400_000, None)):
        seed_charge(c, "a", st, st + 3_600_000, added_wh=wh)
    prices.add_fixed_cost(c, "a", "Insurance", 31.0, "month", date(2026, 10, 1), None)
    assert totals(c, ["a"], now, TZ)["month"]["cost"] == {"energy": approx(8.08), "fixed": approx(10.0), "total": approx(18.08), "uncosted": 1}


def test_sums_is_both_sensors_and_stats():
    s = ms(2026, 10, 5, 8)
    c = conn_with(trips=[("a", s, s + 1000, 12_000.0, 2400.0), ("a", s + 9000, s + 9500, 3000.0, None)], charges=[("a", s, s + 1000, 500.0)])
    c.execute("INSERT INTO vehicles(vehicle_id) VALUES('a')")
    prices.set_tariff(c, "ac", 0, 0.40)
    now = ms(2026, 10, 31, 12)
    assert totals(c, ["a"], now, TZ)["month"] == stats.stats(c, ["a"], "month", date(2026, 10, 31), TZ, now_ms=now)["totals"]


def test_a_cost_failure_leaves_the_distance(monkeypatch):
    c = conn_with(trips=[("a", ms(2026, 10, 5, 8), ms(2026, 10, 5, 9), 12_000.0, 2400.0)])
    monkeypatch.setattr(costs, "period_costs", lambda *a: 1 / 0)
    t = stats.stats(c, ["a"], "month", date(2026, 10, 20), TZ)["totals"]
    assert t["cost"] == {"energy": None, "fixed": None, "total": None, "uncosted": None} and t["distance_m"] == 12_000


def test_null_distance_counts_as_zero():
    s = ms(2026, 10, 5, 8)
    c = conn_with(trips=[("a", s, s + 1000, 10_000.0, 2000.0), ("a", s + 5000, s + 6000, None, None)])
    m = totals(c, ["a"], NOW, TZ)["month"]
    assert (m["distance_m"], m["net_wh"], m["trips"], m["wh_per_100km"]) == (10_000, 2000, 2, 20_000)
