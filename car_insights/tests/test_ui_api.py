import json
import logging
import threading
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import pytest
from pytest import approx
from fastapi.testclient import TestClient

from car_insights import access, db, prices, ui_api
from car_insights.api import create_app
from car_insights.db import connect, json_dumps
from car_insights.ha_users import AdminCache
from conftest import s, seed_charge, seed_trip

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 23, 12, tzinfo=TZ).timestamp() * 1000)
ADMIN = {"X-Remote-User-Id": "u-admin"}  # admin by the (fake) user list below, not by any header
ADMINS = {"u-admin"}
VIEWER = {"X-Remote-User-Id": "u-viewer", "X-Remote-User-Name": "viewer"}
CAP = {"car1": 57_000.0}


@pytest.fixture
def conn():
    c = connect(":memory:")
    for vid, name in (("car1", "Car One"), ("car2", "Car Two"), ("car3", "Car Three")):
        c.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)", (vid, json_dumps({"vehicle_name": name})))
    access.set_vehicle(c, "car1", None, ["u-viewer"])
    access.set_vehicle(c, "car2", None, ["u-viewer"])
    return c


async def is_admin(uid):
    return uid in ADMINS


def build(conn, **kw):
    zones = lambda lat, lon: "Home"
    cap = lambda vid: CAP.get(vid, 60_000.0)
    calls = []
    router = ui_api.router(conn, zones, TZ, cap, is_admin, lambda: calls.append(1), now_ms=lambda: NOW,
                           on_costs=lambda vids: calls.append(vids), **kw)  # on_settings appends 1, on_costs its argument
    return create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router), calls


def build_with(conn, admins):
    zones = lambda lat, lon: "Home"
    cap = lambda vid: 60_000.0
    router = ui_api.router(conn, zones, TZ, cap, admins.is_admin, now_ms=lambda: NOW)
    return create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router), None


def client(conn, host="172.30.32.2", **kw):
    app, calls = build(conn, **kw)
    return TestClient(app, client=(host, 50000)), calls


def put(conn, table, vid, start, end, extra=None):
    (seed_trip if table == "trips" else seed_charge)(conn, vid, start, end, **(extra or {}))


def test_non_ingress_address_forbidden(conn):
    c, _ = client(conn, host="172.30.33.5")
    for path in ("/api/ui/me", "/api/ui/views", "/api/ui/overview?view=v:car1", "/api/ui/activity?view=v:car1", "/api/ui/settings"):
        assert c.get(path, headers=ADMIN).status_code == 403
    assert c.post("/api/ui/groups", json={"name": "x"}, headers=ADMIN).status_code == 403
    assert conn.execute("SELECT COUNT(*) FROM seen_users").fetchone()[0] == 0  # a rejected request is not recorded


def test_missing_user_header_forbidden(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/me").status_code == 403
    assert c.get("/api/ui/overview?view=v:car1", headers={"X-Remote-User-Name": "x"}).status_code == 403


def test_me_has_ha_time_zone(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/me", headers=VIEWER).json()["tz"] == "Europe/Amsterdam"


def test_me_has_no_time_zone_name_on_a_fixed_offset(conn):
    router = ui_api.router(conn, lambda lat, lon: "Home", timezone(timedelta(hours=1)), lambda vid: 60_000.0, is_admin, now_ms=lambda: NOW)
    c = TestClient(create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router), client=("172.30.32.2", 50000))
    assert c.get("/api/ui/me", headers=VIEWER).json()["tz"] is None


def test_me_and_seen_user_recorded(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/me", headers=VIEWER).json() == {"user_id": "u-viewer", "name": "viewer", "is_admin": False, "tz": "Europe/Amsterdam"}
    assert c.get("/api/ui/me", headers=ADMIN).json()["is_admin"] is True
    assert conn.execute("SELECT user_id, last_seen_ms FROM seen_users ORDER BY user_id").fetchall() == [("u-admin", NOW), ("u-viewer", NOW)]
    assert [v["id"] for v in c.get("/api/ui/views", headers=VIEWER).json()["vehicles"]] == ["car1", "car2"]


def test_hidden_vehicle_trip_is_404_like_missing(conn):
    put(conn, "trips", "car3", 1000, 2000)  # car3 is not shared with u-viewer
    put(conn, "trips", "car1", 1000, 2000)
    c, _ = client(conn)
    hidden = c.get("/api/ui/trips/car3/1000", headers=VIEWER)
    assert hidden.status_code == 404
    for missing in ("/api/ui/trips/car1/999", "/api/ui/trips/nope/1000"):
        m = c.get(missing, headers=VIEWER)
        assert (m.status_code, m.content) == (hidden.status_code, hidden.content)
    assert c.get("/api/ui/trips/car1/1000", headers=VIEWER).status_code == 200
    assert c.get("/api/ui/trips/car3/1000", headers=ADMIN).status_code == 200
    # the same for charges, lists and views
    put(conn, "charges", "car3", 1000, 2000)
    assert c.get("/api/ui/charges/car3/1000", headers=VIEWER).content == hidden.content
    for path in ("/api/ui/activity?view=v:car3", "/api/ui/overview?view=v:car3", "/api/ui/activity?view=v:nope", "/api/ui/activity?view=x"):
        r = c.get(path, headers=VIEWER)
        assert (r.status_code, r.content) == (404, hidden.content)


def test_detail_has_series_and_capacity(conn):
    row = seed_trip(conn, "car1", 1000, 2000)
    charge = seed_charge(conn, "car1", 1000, 2000, series={"t": [1, 2]})
    c, _ = client(conn)
    t = c.get("/api/ui/trips/car1/1000", headers=VIEWER).json()
    assert t == {"trip": row | {"start_pct": None, "end_pct": None, "wh_per_100km": None}, "cost": {"energy": None, "fixed": None, "total": None}, "series": None, "route": None, "similar": None}
    ch = c.get("/api/ui/charges/car1/1000", headers=VIEWER).json()
    cost = ch.pop("cost")
    assert cost["amount"] is None and cost["basis"] is None  # no tariff set: not computable, never 0
    assert ch == {"charge": charge | {"start_pct": None, "end_pct": None}, "series": {"t": [1, 2]}, "capacity_wh": CAP["car1"], "outside_temp_c": None}


def test_trip_detail_route_and_similar(conn):
    put(conn, "trips", "car1", 500, 900, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 1000, "net_wh": 100})
    pts = [[52.0 + i / 1000, 5.0] for i in range(300)]
    seed_trip(conn, "car1", 1000, 2000, route=pts, **{"from": "Home", "to": "Work"})
    c, _ = client(conn)
    t = c.get("/api/ui/trips/car1/1000", headers=VIEWER).json()
    assert t["route"] == pts and len(t["route"]) == 300
    assert t["similar"] == {"n": 1, "avg_duration_s": 60, "avg_wh_per_100km": 10_000}


def test_trip_reply_has_style(conn):
    style = {"accel": [1, 1.2], "brake": [0, 0], "corner": [0, 0], "bands": {"0-50": [1000, 80]}, "score": 94}
    seed_trip(conn, "car1", 1000, 2000, series={"cols": [], "rows": [], "events": [[0.4, "accel"]]}, style=style)
    c, _ = client(conn)
    t = c.get("/api/ui/trips/car1/1000", headers=VIEWER).json()
    assert t["trip"]["style"] == style and t["series"]["events"] == [[0.4, "accel"]]


def test_charge_outside_temp_from_sample_before_start(conn):
    put(conn, "charges", "car1", 1000, 2000)
    put(conn, "charges", "car1", 5000, 6000)
    conn.execute("INSERT INTO samples VALUES('car1','a',1,500,'outside_temp','7.5')")
    conn.execute("INSERT INTO samples VALUES('car1','a',2,3000,'outside_temp','12')")
    conn.execute("INSERT INTO samples VALUES('car1','a',3,1500,'outside_temp','99')")  # after the first start
    c, _ = client(conn)
    assert c.get("/api/ui/charges/car1/1000", headers=VIEWER).json()["outside_temp_c"] == 7.5
    assert c.get("/api/ui/charges/car1/5000", headers=VIEWER).json()["outside_temp_c"] == 12
    put(conn, "charges", "car1", 100, 200)
    assert c.get("/api/ui/charges/car1/100", headers=VIEWER).json()["outside_temp_c"] is None


def test_charge_outside_temp_non_number_is_null(conn):
    put(conn, "charges", "car1", 1000, 2000)
    conn.execute("""INSERT INTO samples VALUES('car1','a',1,500,'outside_temp','"warm"')""")
    c, _ = client(conn)
    assert c.get("/api/ui/charges/car1/1000", headers=VIEWER).json()["outside_temp_c"] is None


def test_overview_status_and_soc(conn):
    db.ingest(conn, "car1", "src", [s(NOW - 5000, "battery_wh", 46_550), s(NOW - 4000, "range_m", 250_000.0),
                                    s(NOW - 3000, "gps", [52.0, 5.0, 3.0]), s(NOW + 99_000, "battery_wh", 1.0)], NOW)
    db.ingest(conn, "car2", "src", [s(NOW - 9000, "battery_wh", 30_000)], NOW)
    put(conn, "trips", "car1", NOW - 1000, None)
    put(conn, "charges", "car2", NOW - 1000, None)
    put(conn, "trips", "car1", 1, 2)  # closed: no effect on status
    c, _ = client(conn)
    r = c.get("/api/ui/overview?view=v:car1", headers=VIEWER).json()
    assert r["vehicles"] == [{"id": "car1", "name": "Car One", "status": "driving", "battery_wh": 46_550, "soc_percent": 81.7,
                              "range_m": 250_000.0, "position": {"lat": 52.0, "lon": 5.0, "place": "Home"}, "updated": NOW - 3000}]
    two = c.get("/api/ui/overview?view=v:car2", headers=VIEWER).json()["vehicles"][0]
    assert (two["status"], two["soc_percent"], two["position"]) == ("charging", 50.0, None)


def test_overview_without_samples_is_null_not_zero(conn):
    c, _ = client(conn)
    v = c.get("/api/ui/overview?view=v:car1", headers=VIEWER).json()["vehicles"][0]
    assert v == {"id": "car1", "name": "Car One", "status": "parked", "battery_wh": None, "soc_percent": None,
                 "range_m": None, "position": None, "updated": None}


def test_settings_admin_only(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/settings", headers=VIEWER).status_code == 403
    assert c.get("/api/ui/settings", headers=ADMIN).json() == access.settings(conn) | {"prices": prices.settings(conn)}
    for r in (c.post("/api/ui/groups", json={"name": "x"}, headers=VIEWER), c.put("/api/ui/groups/g", json={"name": "x"}, headers=VIEWER),
              c.delete("/api/ui/groups/g", headers=VIEWER),
              c.put("/api/ui/vehicles/car1", json={"group_id": None, "viewers": ["u-viewer"]}, headers=VIEWER)):
        assert r.status_code == 403
    assert conn.execute("SELECT COUNT(*) FROM cost_groups").fetchone()[0] == 0


def test_create_group_and_assign_vehicle_calls_on_settings(conn):
    c, calls = client(conn)
    gid = c.post("/api/ui/groups", json={"name": "Fleet"}, headers=ADMIN).json()["id"]
    assert len(calls) == 1
    assert c.put("/api/ui/vehicles/car3", json={"group_id": gid, "viewers": ["u-viewer"]}, headers=ADMIN).json() == {}
    assert c.put(f"/api/ui/groups/{gid}", json={"name": "Renamed"}, headers=ADMIN).json() == {}
    assert len(calls) == 3
    st = access.settings(conn)
    assert st["groups"] == [{"id": gid, "name": "Renamed"}]
    assert [v for v in st["vehicles"] if v["id"] == "car3"][0]["group_id"] == gid
    assert c.delete(f"/api/ui/groups/{gid}", headers=ADMIN).json() == {} and len(calls) == 4
    assert access.settings(conn)["groups"] == []


def test_unknown_targets_404_and_no_on_settings(conn):
    c, calls = client(conn)
    assert c.put("/api/ui/vehicles/nope", json={"group_id": None, "viewers": []}, headers=ADMIN).status_code == 404
    assert c.put("/api/ui/vehicles/car1", json={"group_id": "nope", "viewers": []}, headers=ADMIN).status_code == 404
    assert c.put("/api/ui/groups/nope", json={"name": "x"}, headers=ADMIN).status_code == 404
    assert calls == []


def test_bad_group_name_400(conn):
    c, calls = client(conn)
    assert c.post("/api/ui/groups", json={"name": "  "}, headers=ADMIN).status_code == 400
    assert c.post("/api/ui/groups", json={"name": "x" * 41}, headers=ADMIN).status_code == 400
    gid = c.post("/api/ui/groups", json={"name": "ok"}, headers=ADMIN).json()["id"]
    assert c.put(f"/api/ui/groups/{gid}", json={"name": ""}, headers=ADMIN).status_code == 400
    assert len(calls) == 1


def test_static_index_served_and_ingest_still_works(conn, tmp_path):
    (tmp_path / "index.html").write_text("<h1>cars</h1>")
    router = ui_api.router(conn, lambda a, b: None, TZ, lambda v: 1.0, is_admin, now_ms=lambda: NOW)
    c = TestClient(create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router, web_dir=tmp_path), client=("172.30.32.2", 50000))
    assert c.get("/").text == "<h1>cars</h1>"
    assert c.get("/health").json() == {"ok": True}
    assert c.get("/api/ui/me", headers=VIEWER).json()["user_id"] == "u-viewer"
    body = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd", "samples": [{"seq": 1, "t": 1, "k": "speed", "v": 1.0}]})
    assert c.post("/ingest", content=body, headers={"Authorization": "Bearer " + "t" * 64}).json()["acked_seq"] == 1
    assert c.post("/ingest", content=body).status_code == 401
    # a missing web_dir leaves the app without a root page instead of failing to start
    app = create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, web_dir=tmp_path / "nope")
    assert TestClient(app).get("/").status_code == 404


def test_guard_runs_before_validation(conn):
    other, _ = client(conn, host="172.30.33.5")
    for r in (other.post("/api/ui/groups", json={}, headers=ADMIN), other.post("/api/ui/groups", content=b"not json", headers=ADMIN),
              other.get("/api/ui/activity?view=v:car1&before=abc", headers=ADMIN), other.get("/api/ui/trips/car1/abc", headers=ADMIN),
              other.put("/api/ui/vehicles/car1", json={"viewers": 5}, headers=ADMIN)):
        assert r.status_code == 403
    c, _ = client(conn)  # ingress address but no user
    for r in (c.get("/api/ui/activity?view=v:car1&before=abc"), c.post("/api/ui/groups", json={}), c.get("/api/ui/trips/car1/abc")):
        assert r.status_code == 403


def test_huge_integers_are_422_not_500(conn):
    c, _ = client(conn)
    for path in ("/api/ui/activity?view=v:car1&before=99999999999999999999", "/api/ui/activity?view=v:car1&before=-1",
                 "/api/ui/trips/car1/99999999999999999999", "/api/ui/charges/car1/-1"):
        assert c.get(path, headers=VIEWER).status_code == 422


def test_forged_groups_header_grants_nothing(conn):
    c, calls = client(conn)
    forged = {"X-Remote-User-Id": "u-viewer", "X-Remote-User-Groups": "system-users,system-admin"}
    assert c.get("/api/ui/me", headers=forged).json()["is_admin"] is False
    assert c.get("/api/ui/settings", headers=forged).status_code == 403
    assert c.post("/api/ui/groups", json={"name": "x"}, headers=forged).status_code == 403
    assert c.put("/api/ui/vehicles/car3", json={"group_id": None, "viewers": ["u-viewer"]}, headers=forged).status_code == 403
    assert [v["id"] for v in c.get("/api/ui/views", headers=forged).json()["vehicles"]] == ["car1", "car2"]  # own, not car3
    assert c.get("/api/ui/overview?view=v:car3", headers=forged).status_code == 404
    assert not calls and conn.execute("SELECT COUNT(*) FROM cost_groups").fetchone()[0] == 0


def test_admin_per_user_list_sees_everything(conn):
    c, _ = client(conn)
    assert [v["id"] for v in c.get("/api/ui/views", headers=ADMIN).json()["vehicles"]] == ["car1", "car2", "car3"]
    assert c.get("/api/ui/settings", headers=ADMIN).status_code == 200


def test_user_list_failure_means_no_admin(conn):
    def down():
        raise OSError("core down")
    app, _ = build_with(conn, AdminCache(down))
    c = TestClient(app, client=("172.30.32.2", 50000))
    assert c.get("/api/ui/me", headers=ADMIN).json()["is_admin"] is False
    assert c.get("/api/ui/settings", headers=ADMIN).status_code == 403
    assert c.get("/api/ui/views", headers=ADMIN).json()["vehicles"] == []  # fails closed to "own vehicles", of which it has none


def test_admin_cache_wired_into_the_router(conn):
    app, _ = build_with(conn, AdminCache(lambda: [{"id": "u-admin", "group_ids": ["system-admin"]}, {"id": "u-viewer", "group_ids": ["system-users"]}]))
    c = TestClient(app, client=("172.30.32.2", 50000))
    assert c.get("/api/ui/settings", headers=ADMIN).status_code == 200
    assert c.get("/api/ui/settings", headers=VIEWER).status_code == 403


def test_activity_visibility(conn):
    put(conn, "trips", "car1", 1000, 1500)
    put(conn, "trips", "car3", 2000, 2500)
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-viewer"])
    access.set_vehicle(conn, "car3", gid, [])  # in the cost group, hidden from the viewer
    c, _ = client(conn)
    assert c.get("/api/ui/activity?view=v:car3", headers=VIEWER).status_code == 404
    assert c.get(f"/api/ui/activity?view=g:{gid}", headers=VIEWER).status_code == 404  # a partly hidden group is not listed
    r = c.get("/api/ui/activity?view=v:car1", headers=VIEWER).json()
    assert [i["vehicle_id"] for d in r["days"] for i in d["items"]] == ["car1"] and "capacity_wh" not in r


def test_activity_before_validated(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/activity?view=v:car1&before=-1", headers=VIEWER).status_code == 422


def ms(*a):
    return int(datetime(*a, tzinfo=TZ).timestamp() * 1000)


def test_stats_future_at_422(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/stats?view=v:car1&period=week&at=2026-10-24", headers=VIEWER).status_code == 422  # tomorrow
    assert c.get("/api/ui/stats?view=v:car1&period=week&at=2026-10-23", headers=VIEWER).status_code == 200  # today
    assert c.get("/api/ui/stats?view=v:car1&period=decade", headers=VIEWER).status_code == 422
    assert c.get("/api/ui/stats?view=v:car1&period=week&at=nope", headers=VIEWER).status_code == 422


def test_stats_hidden_vehicle_excluded(conn):
    put(conn, "trips", "car1", ms(2026, 10, 20), ms(2026, 10, 20, 1), {"distance_m": 1000, "net_wh": 100})
    put(conn, "trips", "car3", ms(2026, 10, 21), ms(2026, 10, 21, 1), {"distance_m": 90_000, "net_wh": 1, "recup_wh": 7, "gross_wh": 8})
    put(conn, "charges", "car3", ms(2026, 10, 21), ms(2026, 10, 21, 1), {"added_wh": 9999, "place": "Shop"})
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-viewer"])
    access.set_vehicle(conn, "car3", gid, [])  # in the cost group, hidden from the viewer
    c, _ = client(conn)
    q = "/api/ui/stats?period=week&at=2026-10-23&view="
    assert c.get(q + "v:car3", headers=VIEWER).status_code == 404
    assert c.get(q + f"g:{gid}", headers=VIEWER).status_code == 404  # a partly hidden group is not listed
    r = c.get(q + "v:car1", headers=VIEWER).json()
    assert r["totals"]["distance_m"] == 1000 and r["totals"]["charges"] == 0 and r["by_place"] == []
    assert r["highlights"]["longest"]["vehicle_id"] == "car1" and r["highlights"]["recup_wh"] == 0 and r["per_vehicle"] is None
    a = c.get(q + f"g:{gid}", headers=ADMIN).json()  # the admin sees the whole group, split per car
    assert a["totals"]["distance_m"] == 91_000 and [(p["id"], p["name"]) for p in a["per_vehicle"]] == [("car1", "Car One"), ("car3", "Car Three")]


def test_stats_defaults_to_today(conn):
    put(conn, "trips", "car1", ms(2026, 10, 19), ms(2026, 10, 19, 1), {"distance_m": 1000})  # Monday of NOW's week
    put(conn, "trips", "car1", ms(2026, 10, 18), ms(2026, 10, 18, 1), {"distance_m": 5000})
    c, _ = client(conn)
    r = c.get("/api/ui/stats?view=v:car1&period=week", headers=VIEWER).json()
    assert (r["period"]["start"], r["period"]["end"]) == (ms(2026, 10, 19), ms(2026, 10, 26))
    assert r["totals"]["distance_m"] == 1000 and r["previous"]["distance_m"] == 5000


def test_stats_without_at(conn):
    c, _ = client(conn)
    r = c.get("/api/ui/stats?view=v:car1&period=week", headers=VIEWER).json()  # NOW is Friday 2026-10-23
    assert r["period"] == {"start": ms(2026, 10, 19), "end": ms(2026, 10, 26), "first": "2026-10-19", "prev_at": "2026-10-18", "next_at": None}
    r = c.get("/api/ui/stats?view=v:car1&period=month&at=2026-09-15", headers=VIEWER).json()
    assert (r["period"]["first"], r["period"]["prev_at"], r["period"]["next_at"]) == ("2026-09-01", "2026-08-31", "2026-10-01")
    r = c.get("/api/ui/stats?view=v:car1&period=month", headers=VIEWER).json()
    assert (r["period"]["first"], r["period"]["next_at"]) == ("2026-10-01", None)
    assert c.get("/api/ui/stats?view=v:car1&period=week&at=2026-10-24", headers=VIEWER).status_code == 422


CHARGE = {"added_wh": 20_000, "lat": 52.0, "lon": 5.0}
URL = "/api/ui"


def cost_state(conn):
    return (prices.settings(conn), conn.execute("SELECT * FROM charge_receipts").fetchall())


def test_cost_writes_need_admin(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    sid = prices.create_spot(conn, "car1", 1000, "Shop", 0.3)
    cid = prices.add_fixed_cost(conn, "car1", "Lease", 100, "month", date(2026, 1, 1), None)
    before = cost_state(conn)
    c, calls = client(conn)
    rs = [c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 0.4}, headers=VIEWER),
              c.post(f"{URL}/spots", json={"vehicle_id": "car1", "start": 1000, "name": "X", "per_kwh": 0.4}, headers=VIEWER),
              c.put(f"{URL}/spots/{sid}", json={"name": "Y"}, headers=VIEWER),
              c.delete(f"{URL}/spots/{sid}", headers=VIEWER),
              c.put(f"{URL}/charges/car1/1000/receipt", json={"amount": 5}, headers=VIEWER),
              c.post(f"{URL}/vehicles/car1/fixed_costs", json={"name": "Z", "amount": 1, "period": "once", "start": "2026-01-01", "end": None}, headers=VIEWER),
              c.put(f"{URL}/fixed_costs/{cid}", json={"end": "2026-02-01"}, headers=VIEWER),
              c.delete(f"{URL}/fixed_costs/{cid}", headers=VIEWER),
              c.put(f"{URL}/vehicles/car1/card", json={"markup_pct": 5, "start_fee": 1}, headers=VIEWER)]
    assert [r.status_code for r in rs] == [403] * 9
    assert cost_state(conn) == before and not calls


def test_cost_read_flow(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, _ = client(conn)
    assert c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 0.40}, headers=ADMIN).json() == {}
    for who in (ADMIN, VIEWER):
        items = [i for d in c.get(f"{URL}/activity?view=v:car1", headers=who).json()["days"] for i in d["items"]]
        assert items[0]["cost"] == {"amount": approx(8.8), "basis": "default"}
        assert c.get(f"{URL}/charges/car1/1000", headers=who).json()["cost"]["current"] == "ac"


def test_trip_detail_cost(conn):
    put(conn, "trips", "car1", 1000, 2000, {"net_wh": 3000})
    c, _ = client(conn)
    c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 0.40}, headers=ADMIN)  # the 1.32 holds only with this tariff
    assert c.get(f"{URL}/trips/car1/1000", headers=VIEWER).json()["cost"]["energy"] == approx(1.32)


def test_settings_lists_prices(conn):
    c, _ = client(conn)
    c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 0.40}, headers=ADMIN)
    assert c.get(f"{URL}/settings", headers=ADMIN).json()["prices"]["ac"][0]["per_kwh"] == 0.40


def test_cost_validation(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    assert c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 5.01}, headers=ADMIN).status_code == 400
    assert c.post(f"{URL}/vehicles/car1/fixed_costs", json={"name": "Z", "amount": 1, "period": "week", "start": "2026-01-01", "end": None},
                  headers=ADMIN).status_code == 400
    assert c.post(f"{URL}/vehicles/car1/fixed_costs", json={"name": "Z", "amount": 1, "period": "once", "start": "2026-01-01", "end": "9999-12-31"},
                  headers=ADMIN).status_code == 400
    assert c.put(f"{URL}/charges/car1/1000/receipt", json={"amount": -1}, headers=ADMIN).status_code == 400
    nan = c.put(f"{URL}/charges/car1/1000/receipt", content='{"amount": NaN}', headers={**ADMIN, "Content-Type": "application/json"})
    assert nan.status_code == 400
    assert c.put(f"{URL}/charges/car1/1000/receipt", json={"amount": True}, headers=ADMIN).status_code == 422  # a JSON boolean is no number
    assert cost_state(conn) == (prices.settings(conn), []) and prices.settings(conn)["ac"] == [] and prices.settings(conn)["fixed_costs"] == []
    assert not calls


def test_spot_from_charge_without_point(conn):
    put(conn, "charges", "car1", 1000, 2000, {"lat": None, "lon": None})
    c, calls = client(conn)
    body = {"vehicle_id": "car1", "name": "X", "per_kwh": 0.4}
    assert c.post(f"{URL}/spots", json={**body, "start": 1000}, headers=ADMIN).status_code == 400
    assert c.post(f"{URL}/spots", json={**body, "start": 999}, headers=ADMIN).status_code == 404
    assert prices.settings(conn)["spots"] == [] and not calls



def test_spot_price_holds_from_the_charge_days_midnight(conn):
    """a charge's start can move a little earlier when it is re-derived (cloud plug time): the new spot's price must still hold"""
    start = int(datetime(2026, 10, 26, 8, 16, 53, tzinfo=TZ).timestamp() * 1000)
    put(conn, "charges", "car1", start, start + 3_600_000, CHARGE)
    c, _ = client(conn)
    sid = c.post(f"{URL}/spots", json={"vehicle_id": "car1", "start": start, "name": "Work", "per_kwh": 0.21}, headers=ADMIN).json()["id"]
    midnight = int(datetime(2026, 10, 26, tzinfo=TZ).timestamp() * 1000)
    assert [t["valid_from"] for t in prices.settings(conn)["spots"][0]["tariffs"]] == [midnight]
    assert prices.book(conn, "car1").tariff_at(sid, start - 28_000)["per_kwh"] == 0.21

def test_spot_routes_relabel_after_the_write_and_before_on_costs(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    order = []
    router = ui_api.router(conn, lambda a, b: None, TZ, lambda v: 1.0, is_admin, now_ms=lambda: NOW,
                           relabel=lambda: order.append(("relabel", conn.execute("SELECT COUNT(*) FROM charge_spots").fetchone()[0])),
                           on_costs=lambda vids: order.append("costs"))
    c = TestClient(create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router), client=("172.30.32.2", 50000))
    sid = c.post(f"{URL}/spots", json={"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3}, headers=ADMIN).json()["id"]
    assert order == [("relabel", 1), "costs"]  # the spot is written when relabel runs
    order.clear()
    assert c.put(f"{URL}/spots/{sid}", json={"name": "Shop 2"}, headers=ADMIN).status_code == 200
    assert order == [("relabel", 1), "costs"]
    order.clear()
    assert c.delete(f"{URL}/spots/{sid}", headers=ADMIN).status_code == 200
    assert order == [("relabel", 0), "costs"]
    order.clear()
    assert c.put(f"{URL}/spots/nope", json={"name": "X"}, headers=ADMIN).status_code == 404
    assert c.delete(f"{URL}/spots/nope", headers=ADMIN).status_code == 404
    assert order == []  # a failed write relabels nothing


def test_a_failing_relabel_after_a_spot_write_still_answers(conn, caplog):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    def boom():
        raise RuntimeError("boom")
    c, calls = client(conn, relabel=boom)
    r = c.post(f"{URL}/spots", json={"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3}, headers=ADMIN)
    assert r.status_code == 200 and len(prices.settings(conn)["spots"]) == 1  # the spot is saved and answered
    assert calls == [None]  # the cost sensors still follow
    assert "renaming places after a spot change failed" in caplog.text


def test_on_costs_targets(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    c.put(f"{URL}/prices/ac", json={"valid_from": 0, "per_kwh": 0.4}, headers=ADMIN)
    sid = c.post(f"{URL}/spots", json={"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3}, headers=ADMIN).json()["id"]
    c.put(f"{URL}/spots/{sid}", json={"name": "Shop 2"}, headers=ADMIN)
    c.delete(f"{URL}/spots/{sid}", headers=ADMIN)
    assert calls == [None] * 4
    calls.clear()
    c.put(f"{URL}/charges/car1/1000/receipt", json={"amount": 9.5}, headers=ADMIN)
    c.put(f"{URL}/vehicles/car1/card", json={"markup_pct": 5, "start_fee": 1}, headers=ADMIN)
    cid = c.post(f"{URL}/vehicles/car1/fixed_costs", json={"name": "Lease", "amount": 100, "period": "month", "start": "2026-01-01", "end": None},
                 headers=ADMIN).json()["id"]
    c.put(f"{URL}/fixed_costs/{cid}", json={"end": "2026-06-30"}, headers=ADMIN)
    c.delete(f"{URL}/fixed_costs/{cid}", headers=ADMIN)
    assert calls == [["car1"]] * 5
    assert c.put(f"{URL}/fixed_costs/{cid}", json={"end": None}, headers=ADMIN).status_code == 404 and len(calls) == 5


def test_failed_cost_edits_call_on_costs_zero_times(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    cid = prices.add_fixed_cost(conn, "car1", "Lease", 100, "month", date(2026, 1, 1), None)
    c, calls = client(conn)
    assert c.put(f"{URL}/spots/nope", json={"name": "X"}, headers=ADMIN).status_code == 404
    assert c.delete(f"{URL}/spots/nope", headers=ADMIN).status_code == 404
    assert c.put(f"{URL}/charges/car1/999/receipt", json={"amount": 5}, headers=ADMIN).status_code == 404
    assert c.put(f"{URL}/vehicles/nope/card", json={"markup_pct": 5, "start_fee": 1}, headers=ADMIN).status_code == 404
    assert c.put(f"{URL}/fixed_costs/{cid}", json={"end": "2025-12-31"}, headers=ADMIN).status_code == 400
    assert c.delete(f"{URL}/fixed_costs/nope", headers=ADMIN).status_code == 404
    assert not calls


def test_raw_samples_admin_only_in_range(conn):
    db.ingest(conn, "car1", "src", [s(NOW - 3000, "battery_wh", 46_600), s(NOW - 2000, "battery_wh", 46_550),
                                    s(NOW - 2000, "speed", 10.0), s(NOW, "battery_wh", 46_500)], NOW)
    c, _ = client(conn)
    q = f"/api/ui/samples/car1?key=battery_wh&start={NOW - 2000}&end={NOW - 1}"
    assert c.get(q, headers=VIEWER).status_code == 403
    assert c.get(q, headers=ADMIN).json() == {"key": "battery_wh", "rows": [[NOW - 2000, 46_550]]}
    assert c.get(f"/api/ui/samples/car1?key=battery_wh&start=0&end={2 * 86_400_000}", headers=ADMIN).status_code == 400
    assert c.get(f"/api/ui/samples/nope?key=battery_wh&start=0&end=1", headers=ADMIN).status_code == 404


def tile_client(conn, fn):
    return client(conn, tile=fn)[0]


def test_tile_forwards_and_caches(conn):
    got = []
    c = tile_client(conn, lambda z, x, y: got.append((z, x, y)) or b"PNG")
    r = c.get("/api/ui/tiles/3/4/5.png", headers=VIEWER)
    assert (r.status_code, r.content, r.headers["content-type"], r.headers["cache-control"]) == (200, b"PNG", "image/png", "private, max-age=604800")
    assert got == [(3, 4, 5)]


def test_tile_bounds(conn):
    got = []
    c = tile_client(conn, lambda z, x, y: got.append((z, x, y)) or b"PNG")
    for p in ("20/0/0", "3/8/0", "3/0/-1", "x/0/0"):
        assert c.get(f"/api/ui/tiles/{p}.png", headers=VIEWER).status_code in (404, 422)
    assert got == []


def test_tile_upstream_error_is_502(conn):
    def boom(z, x, y):
        raise OSError("down")
    r = tile_client(conn, boom).get("/api/ui/tiles/3/4/5.png", headers=VIEWER)
    assert (r.status_code, r.content) == (502, b"")


def test_tile_needs_a_viewer(conn):
    c = tile_client(conn, lambda z, x, y: b"PNG")
    assert c.get("/api/ui/tiles/3/4/5.png").status_code == 403


def test_map_period_and_thinning(conn):
    pts = [[52 + i / 10_000, 5 + i / 10_000] for i in range(400)]
    seed_trip(conn, "car1", ms(2026, 10, 21), ms(2026, 10, 21, 1), route=pts)
    seed_trip(conn, "car1", ms(2026, 10, 14), ms(2026, 10, 14, 1), route=pts)  # the week before
    put(conn, "charges", "car1", ms(2026, 10, 22), ms(2026, 10, 22, 2), {"lat": 52.0, "lon": 5.0})
    conn.execute("INSERT INTO addresses VALUES(520000, 50000, 'Some Street 1', 0)")
    c, _ = client(conn)
    r = c.get("/api/ui/map?view=v:car1&period=week", headers=VIEWER).json()
    assert [(t["vid"], t["start"], len(t["route"])) for t in r["trips"]] == [("car1", ms(2026, 10, 21), 300)]
    assert r["charges"] == [{"vid": "car1", "start": ms(2026, 10, 22), "lat": 52.0, "lon": 5.0, "name": "Some Street 1"}]
    y = c.get("/api/ui/map?view=v:car1&period=year", headers=VIEWER).json()
    assert sorted(len(t["route"]) for t in y["trips"]) == [48, 48]


def test_map_empty_period(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/map?view=v:car1&period=week", headers=VIEWER).json() == {"trips": [], "charges": []}


def test_map_future_at_is_422(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/map?view=v:car1&period=week&at=2026-10-24", headers=VIEWER).status_code == 422


def _access(path, status=200):
    return logging.LogRecord("uvicorn.access", logging.INFO, "", 0, '%s - "%s %s HTTP/%s" %d', ("172.30.32.2:1", "GET", path, "1.1", status), None)


def test_the_access_log_drops_tile_requests_only():
    quiet = ui_api.QuietTiles()
    assert not quiet.filter(_access("/api/ui/tiles/3/4/5.png"))
    assert quiet.filter(_access("/ingest", 200)) and quiet.filter(_access("/api/ui/map?view=v:car1")) and quiet.filter(_access("/health"))
    assert quiet.filter(logging.LogRecord("uvicorn.access", logging.INFO, "", 0, "plain", None, None))


def test_the_access_filter_survives_uvicorn_logging_setup():
    import uvicorn
    logger, quiet = logging.getLogger("uvicorn.access"), ui_api.QuietTiles()
    logger.addFilter(quiet)
    try:
        uvicorn.Config(lambda *a: None).configure_logging()
        assert quiet in logger.filters
    finally:
        logger.removeFilter(quiet)


def test_a_failed_tile_is_logged_once_a_minute_without_its_coordinates(conn, caplog):
    def boom(z, x, y):
        raise OSError("down")
    c = tile_client(conn, boom)
    with caplog.at_level(logging.WARNING, logger="car_insights.ui_api"):
        assert [c.get(f"/api/ui/tiles/12/{x}/2048.png", headers=VIEWER).status_code for x in (2000, 2001)] == [502, 502]
    assert [r.getMessage() for r in caplog.records] == ["tile fetch failed: OSError('down')"]  # the second failure is inside the minute
    assert caplog.records[0].exc_info is None and "2000" not in caplog.text and "2048" not in caplog.text


def test_tile_fetches_run_in_their_own_pool(conn):
    names = []
    tile_client(conn, lambda z, x, y: names.append(threading.current_thread().name) or b"PNG").get("/api/ui/tiles/3/4/5.png", headers=VIEWER)
    assert names[0].startswith("tiles")


def test_map_leaves_out_a_charge_without_a_position_and_an_open_trip(conn):
    seed_trip(conn, "car1", ms(2026, 10, 21), ms(2026, 10, 21, 1), route=[[52.0, 5.0], [52.1, 5.1]])
    seed_trip(conn, "car1", ms(2026, 10, 22), None, route=[[52.0, 5.0], [52.1, 5.1]])  # open: its end is where the car is
    put(conn, "charges", "car1", ms(2026, 10, 22), ms(2026, 10, 22, 2))
    put(conn, "charges", "car1", ms(2026, 10, 22, 3), ms(2026, 10, 22, 4), {"lat": 52.0, "lon": 5.0})
    c, _ = client(conn)
    r = c.get("/api/ui/map?view=v:car1&period=week", headers=VIEWER).json()
    assert [t["start"] for t in r["trips"]] == [ms(2026, 10, 21)]
    assert [(ch["start"], ch["name"]) for ch in r["charges"]] == [(ms(2026, 10, 22, 3), None)]


def test_map_of_a_hidden_vehicle_is_404(conn):
    c, _ = client(conn)
    assert c.get("/api/ui/map?view=v:car3&period=week", headers=VIEWER).status_code == 404
