import json
from datetime import date, datetime
from zoneinfo import ZoneInfo

from pytest import approx

from car_insights import db, prices
from car_insights.totals import period_starts, totals

TZ = ZoneInfo("Europe/Amsterdam")


def ms(y, mo, d, h=0):
    return int(datetime(y, mo, d, h, tzinfo=TZ).timestamp() * 1000)


NOW = ms(2026, 10, 23, 12)


def conn_with(trips=(), charges=()):
    c = db.connect(":memory:")
    for vid, start, end, dist, net in trips:
        c.execute("INSERT INTO trips VALUES(?,?,?,?,?)", (vid, start, end, 1, json.dumps({"distance_m": dist, "net_wh": net})))
    for vid, start, end, added in charges:
        c.execute("INSERT INTO charges VALUES(?,?,?,?,?)", (vid, start, end, 1, json.dumps({"added_wh": added})))
    return c


def plain(m):
    return {k: v for k, v in m.items() if k != "cost"}


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
        c.execute("INSERT INTO charges VALUES(?,?,?,?,?)", ("a", st, st + 3_600_000, 1, json.dumps({"start": st, "end": st + 3_600_000, "added_wh": wh})))
    prices.add_fixed_cost(c, "a", "Insurance", 31.0, "month", date(2026, 10, 1), None)
    assert totals(c, ["a"], now, TZ)["month"]["cost"] == {"energy": approx(8.8), "fixed": approx(10.0), "total": approx(18.8), "uncosted": 1}
