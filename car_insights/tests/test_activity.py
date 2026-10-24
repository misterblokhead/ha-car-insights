import json
from datetime import datetime
from zoneinfo import ZoneInfo

import pytest

from car_insights import activity
from car_insights.db import connect, json_dumps
from car_insights.derive import ALGO

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 25, 12, tzinfo=TZ).timestamp() * 1000)


def at(y, m, d, h=0, mi=0):
    return int(datetime(y, m, d, h, mi, tzinfo=TZ).timestamp() * 1000)


@pytest.fixture
def conn():
    c = connect(":memory:")
    for vid, name in (("car1", "Car One"), ("car2", "Car Two")):
        c.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)", (vid, json_dumps({"vehicle_name": name})))
    return c


def put(conn, table, vid, start, end, extra=None):
    conn.execute(f"INSERT INTO {table} VALUES(?,?,?,?,?)", (vid, start, end, ALGO, json.dumps({"start": start, "end": end, **(extra or {})})))


def page(conn, vids=("car1",), before=None, routes=None, **kw):
    from car_insights import db
    return activity.page(conn, list(vids), before, NOW, TZ, lambda v: db.device_info(conn, v)[0],
                         lambda v, s: (routes or {}).get((v, s)), lambda v: 50_000.0, **kw)


def test_merges_trips_and_charges_newest_first(conn):
    put(conn, "trips", "car1", at(2026, 10, 25, 8), at(2026, 10, 25, 9))
    put(conn, "charges", "car2", at(2026, 10, 25, 10), at(2026, 10, 25, 11))
    put(conn, "trips", "car1", at(2026, 10, 24, 8), at(2026, 10, 24, 9))
    p = page(conn, ("car1", "car2"))
    assert p["today"] == "2026-10-25" and p["capacity_wh"] == {"car1": 50_000.0, "car2": 50_000.0} and p["next"] is None
    assert [d["date"] for d in p["days"]] == ["2026-10-25", "2026-10-24"]
    first = p["days"][0]["items"]
    assert [(i["kind"], i["vehicle_id"], i["vehicle_name"]) for i in first] == [("charge", "car2", "Car Two"), ("trip", "car1", "Car One")]


def test_empty(conn):
    assert page(conn) == {"today": "2026-10-25", "capacity_wh": {"car1": 50_000.0}, "days": [], "next": None}


def test_page_holds_whole_days(conn):
    for i in range(25):
        put(conn, "trips", "car1", at(2026, 10, 20, 0, 10) + i * 60_000, at(2026, 10, 20, 12))
    for i in range(10):
        put(conn, "trips", "car1", at(2026, 10, 19, 8) + i * 60_000, at(2026, 10, 19, 12))
    p = page(conn, min_items=20)
    assert [(d["date"], len(d["items"])) for d in p["days"]] == [("2026-10-20", 25)] and p["next"] == at(2026, 10, 20)
    q = page(conn, before=p["next"], min_items=20)
    assert [(d["date"], len(d["items"])) for d in q["days"]] == [("2026-10-19", 10)] and q["next"] is None


def test_day_of_start_and_dst(conn):
    put(conn, "trips", "car1", at(2026, 10, 24, 23, 50), at(2026, 10, 25, 0, 20))
    put(conn, "charges", "car1", at(2026, 10, 25, 0, 10), at(2026, 10, 25, 1))
    put(conn, "trips", "car1", at(2026, 10, 25, 23, 30), at(2026, 10, 25, 23, 40))
    p = page(conn)
    assert [(d["date"], len(d["items"])) for d in p["days"]] == [("2026-10-25", 2), ("2026-10-24", 1)]


def test_open_rows_first_page_only_and_not_in_summary(conn):
    put(conn, "trips", "car1", at(2026, 10, 25, 7), at(2026, 10, 25, 8), {"distance_m": 1000})
    put(conn, "trips", "car1", at(2026, 10, 25, 9), None, {"distance_m": 5000})
    p = page(conn)
    day = p["days"][0]
    assert [i["end"] for i in day["items"]] == [None, at(2026, 10, 25, 8)] and day["summary"]["distance_m"] == 1000
    q = page(conn, before=at(2026, 10, 26))
    assert [i["end"] for i in q["days"][0]["items"]] == [at(2026, 10, 25, 8)]


def test_summary_nulls_count_zero(conn):
    put(conn, "trips", "car1", at(2026, 10, 25, 7), at(2026, 10, 25, 8), {"distance_m": 1000, "net_wh": None})
    put(conn, "trips", "car1", at(2026, 10, 25, 9), at(2026, 10, 25, 10), {"distance_m": 2000, "net_wh": 300})
    put(conn, "charges", "car1", at(2026, 10, 25, 11), at(2026, 10, 25, 12), {"added_wh": None})
    put(conn, "charges", "car1", at(2026, 10, 25, 13), at(2026, 10, 25, 14), {"added_wh": 700})
    assert page(conn)["days"][0]["summary"] == {"distance_m": 3000, "net_wh": 300, "charged_wh": 700}


def test_trip_items_carry_card_route(conn):
    a, b = at(2026, 10, 25, 7), at(2026, 10, 25, 9)
    put(conn, "trips", "car1", a, a + 1000)
    put(conn, "trips", "car1", b, b + 1000)
    put(conn, "charges", "car1", at(2026, 10, 25, 11), at(2026, 10, 25, 12))
    pts = [[52.0 + i / 1000, 5.0 + i / 1000] for i in range(300)]
    items = page(conn, routes={("car1", a): pts})["days"][0]["items"]
    assert "route" not in items[0]
    assert items[1]["route"] is None and len(items[2]["route"]) == 48
