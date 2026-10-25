from datetime import date, datetime
from zoneinfo import ZoneInfo

from pytest import approx

from car_insights import prices, stats, store
from car_insights.periods import period_bounds
from car_insights.db import connect
from conftest import seed_charge, seed_trip


def put(conn, start, extra, vid="car1", end=None):
    seed_trip(conn, vid, start, start + 1000 if end is None else end, **extra)


def trip(start=100_000, **kw):
    return {"start": start, "from": "Home", "to": "Work", **kw}


def test_similar_matches_zones_earlier_only():
    c = connect(":memory:")
    put(c, 1000, {"from": "Home", "to": "Work", "duration_s": 600, "distance_m": 10_000, "net_wh": 2000})
    put(c, 2000, {"from": "Home", "to": "Work", "duration_s": 1000, "distance_m": 10_000, "net_wh": 3000})
    put(c, 3000, {"from": "Home", "to": "Shop", "duration_s": 5, "distance_m": 1, "net_wh": 1})
    put(c, 200_000, {"from": "Home", "to": "Work", "duration_s": 5, "distance_m": 1, "net_wh": 1})
    assert stats.similar_trips(c, "car1", trip()) == {"n": 2, "avg_duration_s": 800, "avg_wh_per_100km": 25_000}


def test_similar_limit_20_newest():
    c = connect(":memory:")
    for i in range(25):
        put(c, 1000 * (i + 1), {"from": "Home", "to": "Work", "duration_s": i, "distance_m": 1000, "net_wh": 100 * i})
    got = stats.similar_trips(c, "car1", trip())
    assert got["n"] == 20 and got["avg_duration_s"] == sum(range(5, 25)) / 20
    assert got["avg_wh_per_100km"] == sum(100 * i for i in range(5, 25)) / 20_000 * 100_000


def test_similar_unknown_zone_none():
    c = connect(":memory:")
    put(c, 1000, {"from": None, "to": None, "duration_s": 5})
    assert stats.similar_trips(c, "car1", trip(**{"from": None, "to": None})) is None
    assert stats.similar_trips(c, "car1", trip(to=None)) is None
    assert stats.similar_trips(c, "car1", trip()) is None  # no earlier match


def test_similar_zero_distance_no_division():
    c = connect(":memory:")
    put(c, 1000, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 0, "net_wh": 0})
    put(c, 2000, {"from": "Home", "to": "Work", "duration_s": 120, "distance_m": 0, "net_wh": None})
    assert stats.similar_trips(c, "car1", trip()) == {"n": 2, "avg_duration_s": 90, "avg_wh_per_100km": None}


def test_similar_short_trips_have_no_consumption():
    c = connect(":memory:")
    put(c, 1000, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 40, "net_wh": 30})
    put(c, 2000, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 50, "net_wh": 40})
    assert stats.similar_trips(c, "car1", trip())["avg_wh_per_100km"] is None  # 90 m in all: the one consumption rule says nothing


TZ = ZoneInfo("Europe/Amsterdam")
OCT24 = date(2026, 10, 24)


def ms(*a):
    return int(datetime(*a, tzinfo=TZ).timestamp() * 1000)


def plain(m):
    return {k: v for k, v in m.items() if k not in ("cost", "wh_per_100km")}


def row(c, table, start, extra, vid="car1", end=True):
    (seed_trip if table == "trips" else seed_charge)(c, vid, start, start + 1000 if end else None, **extra)


def test_period_bounds_week_month_year():
    assert period_bounds("week", OCT24, TZ) == (ms(2026, 10, 19), ms(2026, 10, 26))
    lo, hi = period_bounds("week", OCT24, TZ)
    assert hi - lo == (7 * 24 + 1) * 3600_000  # the clocks go back on 25 October
    assert period_bounds("month", OCT24, TZ) == (ms(2026, 10, 1), ms(2026, 11, 1))
    assert period_bounds("year", OCT24, TZ) == (ms(2026, 1, 1), ms(2027, 1, 1))
    assert period_bounds("week", date(2026, 10, 19), TZ)[0] == ms(2026, 10, 19)  # Monday is its own week
    assert period_bounds("week", date(2026, 10, 25), TZ)[0] == ms(2026, 10, 19)  # Sunday belongs to the week before


def test_buckets_cover_period_with_zeros():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 24, 23, 50), {"distance_m": 1000, "net_wh": 100})  # own day, not the 25th
    row(c, "trips", ms(2026, 10, 25, 0, 10), {"distance_m": 2000, "net_wh": 200})  # the 25-hour day
    row(c, "trips", ms(2026, 10, 25, 23, 50), {"distance_m": 4000, "net_wh": 400})  # after the clocks went back
    row(c, "trips", ms(2026, 10, 26, 0, 5), {"distance_m": 8000, "net_wh": 800})
    b = stats.stats(c, ["car1"], "month", OCT24, TZ)["buckets"]
    assert len(b) == 31 and b[0]["start"] == ms(2026, 10, 1) and b[30]["start"] == ms(2026, 10, 31)
    assert [(i, x["distance_m"], x["net_wh"]) for i, x in enumerate(b) if x["distance_m"]] == [
        (23, 1000, 100), (24, 6000, 600), (25, 8000, 800)]
    assert b[3] == {"start": ms(2026, 10, 4), "distance_m": 0, "net_wh": 0, "wh_per_100km": None}
    assert len(stats.stats(c, ["car1"], "week", OCT24, TZ)["buckets"]) == 7
    y = stats.stats(c, ["car1"], "year", OCT24, TZ)["buckets"]
    assert len(y) == 12 and y[9] == {"start": ms(2026, 10, 1), "distance_m": 15000, "net_wh": 1500, "wh_per_100km": 10_000}


def test_previous_period_totals():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 14), {"distance_m": 1000, "net_wh": 100})
    row(c, "charges", ms(2026, 10, 15), {"added_wh": 5000})
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 3000, "net_wh": 300})
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)
    assert plain(s["previous"]) == {"distance_m": 1000, "net_wh": 100, "charged_wh": 5000, "trips": 1, "charges": 1}
    assert plain(s["totals"]) == {"distance_m": 3000, "net_wh": 300, "charged_wh": 0, "trips": 1, "charges": 0}
    assert s["period"] == {"start": ms(2026, 10, 19), "end": ms(2026, 10, 26), "first": "2026-10-19", "prev_at": "2026-10-18", "next_at": "2026-10-26"}
    # the month before January is December of the year before; the boundary instant belongs to the later period
    row(c, "trips", ms(2025, 12, 31, 23, 59), {"distance_m": 7})
    row(c, "trips", ms(2026, 1, 1), {"distance_m": 9})
    j = stats.stats(c, ["car1"], "month", date(2026, 1, 15), TZ)
    assert j["previous"]["distance_m"] == 7 and j["totals"]["distance_m"] == 9
    assert stats.stats(c, ["car1"], "year", date(2026, 3, 1), TZ)["previous"]["distance_m"] == 7


def test_open_rows_excluded():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 50_000, "net_wh": 9000, "recup_wh": 5, "gross_wh": 9}, end=False)
    row(c, "charges", ms(2026, 10, 20), {"added_wh": 9000, "place": "Home"}, end=False)
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)
    assert plain(s["totals"]) == {"distance_m": 0, "net_wh": 0, "charged_wh": 0, "trips": 0, "charges": 0}
    assert s["by_place"] == [] and s["highlights"] == {"longest": None, "most_efficient": None, "recup_wh": 0, "gross_wh": 0}
    assert all(b["distance_m"] == 0 for b in s["buckets"])


def test_by_place_sorted_with_unknown():
    c = connect(":memory:")
    row(c, "charges", ms(2026, 10, 19), {"added_wh": 1000, "place": "Shop"})
    row(c, "charges", ms(2026, 10, 20), {"added_wh": 3000, "place": "Home"})
    row(c, "charges", ms(2026, 10, 21), {"added_wh": 4000, "place": "Home"})
    row(c, "charges", ms(2026, 10, 22), {"added_wh": 2000, "place": None})
    row(c, "charges", ms(2026, 10, 23), {"added_wh": None, "place": "Work"})  # null counts 0, the place stays listed
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)
    assert s["by_place"] == [{"place": "Home", "wh": 7000}, {"place": None, "wh": 2000}, {"place": "Shop", "wh": 1000}, {"place": "Work", "wh": 0}]
    assert s["totals"]["charged_wh"] == 10000 and s["totals"]["charges"] == 5


def test_highlights():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 19), {"distance_m": 3000, "net_wh": 30, "from": "Home", "to": "Shop", "recup_wh": 10, "gross_wh": 40})  # 1 Wh/km but too short
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 20_000, "net_wh": 4000, "from": "Home", "to": "Work", "recup_wh": 500, "gross_wh": 4500})  # 20 kWh/100km
    row(c, "trips", ms(2026, 10, 21), {"distance_m": 10_000, "net_wh": 1500, "from": None, "to": "Shop", "recup_wh": None, "gross_wh": 1500})  # 15 kWh/100km
    row(c, "trips", ms(2026, 10, 22), {"distance_m": 10_000, "net_wh": 1500, "recup_wh": 0, "gross_wh": 1500})  # ties do not crash
    row(c, "trips", ms(2026, 10, 23), {"distance_m": 0, "net_wh": None, "recup_wh": None, "gross_wh": None})
    row(c, "trips", ms(2026, 10, 23, 1), {"distance_m": None, "net_wh": 50})
    h = stats.stats(c, ["car1"], "week", OCT24, TZ)["highlights"]
    assert h["longest"] == {"vehicle_id": "car1", "start": ms(2026, 10, 20), "distance_m": 20_000, "from": "Home", "to": "Work",
                           "from_address": None, "to_address": None}
    assert h["most_efficient"] == {"vehicle_id": "car1", "start": ms(2026, 10, 21), "wh_per_100km": 15_000}
    assert h["recup_wh"] == 510 and h["gross_wh"] == 7540
    empty = stats.stats(c, ["car1"], "week", date(2026, 9, 1), TZ)["highlights"]
    assert empty == {"longest": None, "most_efficient": None, "recup_wh": 0, "gross_wh": 0}


def test_highlights_nothing_efficient_when_all_short_or_unmeasured():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 4999, "net_wh": 1})
    row(c, "trips", ms(2026, 10, 21), {"distance_m": 9000, "net_wh": None})
    h = stats.stats(c, ["car1"], "week", OCT24, TZ)["highlights"]
    assert h["most_efficient"] is None and h["longest"]["distance_m"] == 9000


def test_per_vehicle_split():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 1000, "net_wh": 100}, vid="car1")
    row(c, "trips", ms(2026, 10, 21), {"distance_m": 5000, "net_wh": 500}, vid="car2")
    row(c, "charges", ms(2026, 10, 21), {"added_wh": 700}, vid="car2")
    names = {"car1": "Car One", "car2": "Car Two"}.get
    s = stats.stats(c, ["car1", "car2"], "week", OCT24, TZ, names)
    assert s["totals"]["distance_m"] == 6000
    assert [(v["id"], v["name"], plain(v["totals"])) for v in s["per_vehicle"]] == [
        ("car1", "Car One", {"distance_m": 1000, "net_wh": 100, "charged_wh": 0, "trips": 1, "charges": 0}),
        ("car2", "Car Two", {"distance_m": 5000, "net_wh": 500, "charged_wh": 700, "trips": 1, "charges": 1})]
    assert stats.stats(c, ["car1", "car2"], "week", OCT24, TZ)["per_vehicle"] is None


def test_hidden_vehicle_rows_never_leak():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 1000, "net_wh": 100}, vid="car1")
    row(c, "trips", ms(2026, 10, 21), {"distance_m": 90_000, "net_wh": 1, "recup_wh": 7, "gross_wh": 8, "from": "Home", "to": "Work"}, vid="car3")
    row(c, "charges", ms(2026, 10, 21), {"added_wh": 9999, "place": "Shop"}, vid="car3")
    s = stats.stats(c, ["car1", "car2"], "week", OCT24, TZ, {"car1": "A", "car2": "B"}.get)
    assert plain(s["totals"]) == {"distance_m": 1000, "net_wh": 100, "charged_wh": 0, "trips": 1, "charges": 0}
    assert s["by_place"] == [] and s["highlights"]["longest"]["vehicle_id"] == "car1" and s["highlights"]["recup_wh"] == 0
    assert [p["id"] for p in s["per_vehicle"]] == ["car1", "car2"]


def test_period_cost():
    c = connect(":memory:")
    now = ms(2026, 10, 10, 12)
    prices.set_tariff(c, "ac", 0, 0.40)
    for vid in ("car1", "car2"):
        c.execute("INSERT INTO vehicles(vehicle_id) VALUES(?)", (vid,))
        row(c, "charges", ms(2026, 10, 5, 8), {"added_wh": 20_000}, vid=vid)
        prices.add_fixed_cost(c, vid, "Insurance", 31.0, "month", date(2026, 9, 1), None)
    names = {"car1": "A", "car2": "B"}.get
    s = stats.stats(c, ["car1", "car2"], "month", date(2026, 10, 10), TZ, names, now)
    assert s["totals"]["cost"]["fixed"] == approx(20.0)  # 10 days of 2 vehicles
    assert s["previous"]["cost"]["fixed"] == approx(62.0)  # the ended September counts whole
    assert s["totals"]["cost"]["energy"] == approx(2 * 20 * 1.10 * 0.40)
    assert sum(v["totals"]["cost"]["total"] for v in s["per_vehicle"]) == approx(s["totals"]["cost"]["total"])
    one = stats.stats(c, ["car1"], "month", date(2026, 10, 10), TZ, None, now)
    assert one["totals"]["cost"]["fixed"] == approx(10.0) and one["previous"]["cost"]["fixed"] == approx(31.0)


def test_longest_carries_addresses():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 20), {"distance_m": 20_000, "from": "Home", "to": None, "from_lat": 51.1, "from_lon": 4.1, "to_lat": 51.2, "to_lon": 4.3})
    store.save_address(c, 512000, 43000, "A 1, B", 1)
    h = stats.stats(c, ["car1"], "week", OCT24, TZ)["highlights"]["longest"]
    assert h["to_address"] == "A 1, B" and h["from_address"] is None
    assert store.unaddressed(c) is None  # the start is named by its zone, the end by its saved address


def test_by_place_groups_unnamed_by_address():
    c = connect(":memory:")
    row(c, "charges", ms(2026, 10, 20), {"added_wh": 1000, "lat": 51.2, "lon": 4.3})
    row(c, "charges", ms(2026, 10, 21), {"added_wh": 2000, "lat": 51.2, "lon": 4.3})
    row(c, "charges", ms(2026, 10, 22), {"added_wh": 500, "lat": 51.4, "lon": 4.5})
    store.save_address(c, 512000, 43000, "A 1, B", 1)
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)
    assert s["by_place"] == [{"place": "A 1, B", "wh": 3000}, {"place": None, "wh": 500}]


def styled(km, score, accel=0, brake=0, corner=0, bands=None):
    z = {n: [0, 0] for n in ("0-50", "50-80", "80-100", "100-120", "120+")}
    return {"distance_m": km * 1000, "style": {"accel": [accel, 0.0], "brake": [brake, 0.0], "corner": [corner, 0.0], "bands": {**z, **(bands or {})}, "score": score}}


def test_style_aggregates_period():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 19), styled(10, 90, accel=1, brake=2, corner=3, bands={"80-100": [6000, 1200]}))
    row(c, "trips", ms(2026, 10, 20), styled(30, 70, accel=4, brake=5, corner=6))
    row(c, "trips", ms(2026, 10, 21), {"distance_m": 5000})  # no style: skipped
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)["style"]
    assert (s["km"], s["score"], s["accel"], s["brake"], s["corner"]) == (40.0, 75, 5, 7, 9)
    assert s["bands"]["80-100"] == {"km": 6.0, "kwh_per_100km": 20.0}


def test_band_under_5_km_is_null():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 19), styled(10, 90, bands={"50-80": [4900, 900]}))
    assert stats.stats(c, ["car1"], "week", OCT24, TZ)["style"]["bands"]["50-80"] == {"km": 4.9, "kwh_per_100km": None}


def test_previous_style():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 12), styled(20, 60, accel=2))
    st = stats.stats(c, ["car1"], "week", OCT24, TZ)
    assert st["previous_style"]["score"] == 60 and st["previous_style"]["accel"] == 2 and st["style"]["km"] == 0.0


def test_period_without_scored_trips():
    c = connect(":memory:")
    row(c, "trips", ms(2026, 10, 19), styled(1, None))
    s = stats.stats(c, ["car1"], "week", OCT24, TZ)["style"]
    assert s["score"] is None and s["km"] == 1.0
