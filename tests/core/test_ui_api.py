from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import pytest
from pytest import approx

from custom_components.car_insights.core import access, db, prices, ui_api
from custom_components.car_insights.core.access import Viewer
from custom_components.car_insights.core.db import connect, json_dumps
from conftest import s, seed_charge, seed_trip

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 23, 12, tzinfo=TZ).timestamp() * 1000)
ADMIN = Viewer("u-admin", None, True)  # the view layer decides who is admin; the API only reads the flag
VIEWER = Viewer("u-viewer", "viewer", False)
CAP = {"car1": 57_000.0}


@pytest.fixture
def conn():
    c = connect(":memory:")
    for vid, name in (("car1", "Car One"), ("car2", "Car Two"), ("car3", "Car Three")):
        c.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)", (vid, json_dumps({"vehicle_name": name})))
    access.set_vehicle(c, "car1", None, ["u-viewer"])
    access.set_vehicle(c, "car2", None, ["u-viewer"])
    return c


def build(conn, **kw):
    """the API over `conn`; on_settings appends 1 to the returned list, on_costs its argument"""
    calls = []
    kw = {"on_settings": lambda: calls.append(1), "on_costs": lambda vids: calls.append(vids), "now_ms": lambda: NOW} | kw
    return ui_api.UiApi(conn, kw.pop("zones", lambda lat, lon: "Home"), kw.pop("tz", TZ), kw.pop("capacity", lambda vid: CAP.get(vid, 60_000.0)),
                        **kw), calls


class Reply:
    """a (status, body) reply that also reads like a response"""

    def __init__(self, reply):
        self.status_code, self.body = reply

    def json(self):
        return self.body


class Client:
    def __init__(self, api):
        self.api = api

    async def send(self, method, path, body=None, who=ADMIN, **query):
        return Reply(await self.api.handle(method, path, {k: str(v) for k, v in query.items()}, body, who))

    async def get(self, path, who=VIEWER, **query):
        return await self.send("GET", path, None, who, **query)

    async def put(self, path, body, who=ADMIN):
        return await self.send("PUT", path, body, who)

    async def post(self, path, body, who=ADMIN):
        return await self.send("POST", path, body, who)

    async def delete(self, path, who=ADMIN):
        return await self.send("DELETE", path, None, who)


def client(conn, **kw):
    api, calls = build(conn, **kw)
    return Client(api), calls


def put(conn, table, vid, start, end, extra=None):
    (seed_trip if table == "trips" else seed_charge)(conn, vid, start, end, **(extra or {}))


async def test_me_has_ha_time_zone(conn):
    c, _ = client(conn)
    assert (await c.get("/me")).json()["tz"] == "Europe/Amsterdam"


async def test_me_has_no_time_zone_name_on_a_fixed_offset(conn):
    c, _ = client(conn, tz=timezone(timedelta(hours=1)))
    assert (await c.get("/me")).json()["tz"] is None


async def test_me_and_seen_user_recorded(conn):
    c, _ = client(conn)
    assert (await c.get("/me")).json() == {"user_id": "u-viewer", "name": "viewer", "is_admin": False, "tz": "Europe/Amsterdam"}
    assert (await c.get("/me", ADMIN)).json()["is_admin"] is True
    assert conn.execute("SELECT user_id, last_seen_ms FROM seen_users ORDER BY user_id").fetchall() == [("u-admin", NOW), ("u-viewer", NOW)]
    assert [v["id"] for v in (await c.get("/views")).json()["vehicles"]] == ["car1", "car2"]


async def test_the_reply_is_a_status_and_a_body(conn):
    api, _ = build(conn)
    assert await api.handle("GET", "/me", {}, None, VIEWER) == (200, {"user_id": "u-viewer", "name": "viewer", "is_admin": False, "tz": "Europe/Amsterdam"})


async def test_unknown_path_is_404_and_a_wrong_method_405(conn):
    c, _ = client(conn)
    assert (await c.get("/nope")).status_code == 404
    assert (await c.get("/trips/car1")).status_code == 404
    assert (await c.get("/trips/car1/1000/extra")).status_code == 404
    r = await c.send("DELETE", "/me")
    assert (r.status_code, r.json()) == (405, {"detail": "method not allowed"})
    assert (await c.send("POST", "/groups/x", {"name": "x"})).status_code == 405
    assert conn.execute("SELECT COUNT(*) FROM seen_users").fetchone()[0] == 0


async def test_hidden_vehicle_trip_is_404_like_missing(conn):
    put(conn, "trips", "car3", 1000, 2000)  # car3 is not shared with u-viewer
    put(conn, "trips", "car1", 1000, 2000)
    c, _ = client(conn)
    hidden = await c.get("/trips/car3/1000")
    assert (hidden.status_code, hidden.json()) == (404, {"detail": "not found"})
    for missing in ("/trips/car1/999", "/trips/nope/1000"):
        m = await c.get(missing)
        assert (m.status_code, m.json()) == (hidden.status_code, hidden.json())
    assert (await c.get("/trips/car1/1000")).status_code == 200
    assert (await c.get("/trips/car3/1000", ADMIN)).status_code == 200
    # the same for charges, lists and views
    put(conn, "charges", "car3", 1000, 2000)
    assert (await c.get("/charges/car3/1000")).json() == hidden.json()
    for path, q in (("/activity", "v:car3"), ("/overview", "v:car3"), ("/activity", "v:nope"), ("/activity", "x")):
        r = await c.get(path, view=q)
        assert (r.status_code, r.json()) == (404, hidden.json())


async def test_detail_has_series_and_capacity(conn):
    row = seed_trip(conn, "car1", 1000, 2000)
    charge = seed_charge(conn, "car1", 1000, 2000, series={"t": [1, 2]})
    c, _ = client(conn)
    t = (await c.get("/trips/car1/1000")).json()
    assert t == {"trip": row | {"start_pct": None, "end_pct": None, "wh_per_100km": None}, "cost": {"energy": None, "fixed": None, "total": None}, "series": None, "route": None, "similar": None}
    ch = (await c.get("/charges/car1/1000")).json()
    cost = ch.pop("cost")
    assert cost["amount"] is None and cost["basis"] is None  # no tariff set: not computable, never 0
    assert ch == {"charge": charge | {"start_pct": None, "end_pct": None}, "series": {"t": [1, 2]}, "capacity_wh": CAP["car1"], "outside_temp_c": None}


async def test_trip_detail_route_and_similar(conn):
    put(conn, "trips", "car1", 500, 900, {"from": "Home", "to": "Work", "duration_s": 60, "distance_m": 1000, "net_wh": 100})
    pts = [[52.0 + i / 1000, 5.0] for i in range(300)]
    seed_trip(conn, "car1", 1000, 2000, route=pts, **{"from": "Home", "to": "Work"})
    c, _ = client(conn)
    t = (await c.get("/trips/car1/1000")).json()
    assert t["route"] == pts and len(t["route"]) == 300
    assert t["similar"] == {"n": 1, "avg_duration_s": 60, "avg_wh_per_100km": 10_000}


async def test_trip_reply_has_style(conn):
    style = {"accel": [1, 1.2], "brake": [0, 0], "corner": [0, 0], "bands": {"0-50": [1000, 80]}, "score": 94}
    seed_trip(conn, "car1", 1000, 2000, series={"cols": [], "rows": [], "events": [[0.4, "accel"]]}, style=style)
    c, _ = client(conn)
    t = (await c.get("/trips/car1/1000")).json()
    assert t["trip"]["style"] == style and t["series"]["events"] == [[0.4, "accel"]]


async def test_charge_outside_temp_from_sample_before_start(conn):
    put(conn, "charges", "car1", 1000, 2000)
    put(conn, "charges", "car1", 5000, 6000)
    conn.execute("INSERT INTO samples VALUES('car1','a',1,500,'outside_temp','7.5')")
    conn.execute("INSERT INTO samples VALUES('car1','a',2,3000,'outside_temp','12')")
    conn.execute("INSERT INTO samples VALUES('car1','a',3,1500,'outside_temp','99')")  # after the first start
    c, _ = client(conn)
    assert (await c.get("/charges/car1/1000")).json()["outside_temp_c"] == 7.5
    assert (await c.get("/charges/car1/5000")).json()["outside_temp_c"] == 12
    put(conn, "charges", "car1", 100, 200)
    assert (await c.get("/charges/car1/100")).json()["outside_temp_c"] is None


async def test_charge_outside_temp_non_number_is_null(conn):
    put(conn, "charges", "car1", 1000, 2000)
    conn.execute("""INSERT INTO samples VALUES('car1','a',1,500,'outside_temp','"warm"')""")
    c, _ = client(conn)
    assert (await c.get("/charges/car1/1000")).json()["outside_temp_c"] is None


async def test_overview_status_and_soc(conn):
    db.ingest(conn, "car1", "src", [s(NOW - 5000, "battery_wh", 46_550), s(NOW - 4000, "range_m", 250_000.0),
                                    s(NOW - 3000, "gps", [52.0, 5.0, 3.0]), s(NOW + 99_000, "battery_wh", 1.0)], NOW)
    db.ingest(conn, "car2", "src", [s(NOW - 9000, "battery_wh", 30_000)], NOW)
    put(conn, "trips", "car1", NOW - 1000, None)
    put(conn, "charges", "car2", NOW - 1000, None)
    put(conn, "trips", "car1", 1, 2)  # closed: no effect on status
    c, _ = client(conn)
    r = (await c.get("/overview", view="v:car1")).json()
    assert r["vehicles"] == [{"id": "car1", "name": "Car One", "status": "driving", "battery_wh": 46_550, "soc_percent": 81.7,
                              "range_m": 250_000.0, "position": {"lat": 52.0, "lon": 5.0, "place": "Home"}, "updated": NOW - 3000}]
    two = (await c.get("/overview", view="v:car2")).json()["vehicles"][0]
    assert (two["status"], two["soc_percent"], two["position"]) == ("charging", 50.0, None)


async def test_overview_without_samples_is_null_not_zero(conn):
    c, _ = client(conn)
    v = (await c.get("/overview", view="v:car1")).json()["vehicles"][0]
    assert v == {"id": "car1", "name": "Car One", "status": "parked", "battery_wh": None, "soc_percent": None,
                 "range_m": None, "position": None, "updated": None}


async def test_settings_admin_only(conn):
    c, _ = client(conn)
    r = await c.get("/settings")
    assert (r.status_code, r.json()) == (403, {"detail": "forbidden"})
    assert (await c.get("/settings", ADMIN)).json() == access.settings(conn, frozenset()) | {"prices": prices.settings(conn)}
    for r in (await c.post("/groups", {"name": "x"}, VIEWER), await c.put("/groups/g", {"name": "x"}, VIEWER),
              await c.delete("/groups/g", VIEWER),
              await c.put("/vehicles/car1", {"group_id": None, "viewers": ["u-viewer"]}, VIEWER)):
        assert r.status_code == 403
    assert conn.execute("SELECT COUNT(*) FROM cost_groups").fetchone()[0] == 0


async def test_settings_marks_vehicles_without_a_config_entry_archived(conn):
    c, _ = client(conn, cars=lambda: {"car1": {}, "car3": {}})
    assert [(v["id"], v["archived"]) for v in (await c.get("/settings", ADMIN)).json()["vehicles"]] == [("car1", False), ("car2", True), ("car3", False)]


async def test_admin_check_comes_before_validation_and_before_the_user_is_noted(conn):
    c, calls = client(conn)
    for r in (await c.post("/groups", {}, VIEWER), await c.put("/prices/ac", {"valid_from": True}, VIEWER),
              await c.get("/samples/car1", VIEWER, key="battery_wh", start="abc", end="1")):
        assert (r.status_code, r.json()) == (403, {"detail": "forbidden"})
    assert conn.execute("SELECT COUNT(*) FROM seen_users").fetchone()[0] == 0 and not calls


async def test_create_group_and_assign_vehicle_calls_on_settings(conn):
    c, calls = client(conn)
    gid = (await c.post("/groups", {"name": "Fleet"})).json()["id"]
    assert len(calls) == 1
    assert (await c.put("/vehicles/car3", {"group_id": gid, "viewers": ["u-viewer"]})).json() == {}
    assert (await c.put(f"/groups/{gid}", {"name": "Renamed"})).json() == {}
    assert len(calls) == 3
    st = access.settings(conn, frozenset())
    assert st["groups"] == [{"id": gid, "name": "Renamed"}]
    assert [v for v in st["vehicles"] if v["id"] == "car3"][0]["group_id"] == gid
    assert (await c.delete(f"/groups/{gid}")).json() == {} and len(calls) == 4
    assert access.settings(conn, frozenset())["groups"] == []


async def test_unknown_targets_404_and_no_on_settings(conn):
    c, calls = client(conn)
    assert (await c.put("/vehicles/nope", {"group_id": None, "viewers": []})).status_code == 404
    assert (await c.put("/vehicles/car1", {"group_id": "nope", "viewers": []})).status_code == 404
    assert (await c.put("/groups/nope", {"name": "x"})).status_code == 404
    assert calls == []


async def test_bad_group_name_400(conn):
    c, calls = client(conn)
    assert (await c.post("/groups", {"name": "  "})).status_code == 400
    r = await c.post("/groups", {"name": "x" * 41})
    assert (r.status_code, r.json()) == (400, {"detail": "group name must be 1-40 characters"})
    gid = (await c.post("/groups", {"name": "ok"})).json()["id"]
    assert (await c.put(f"/groups/{gid}", {"name": ""})).status_code == 400
    assert len(calls) == 1


async def test_vehicle_settings_body_is_validated(conn):
    c, calls = client(conn)
    for body in (None, [], {}, {"viewers": []}, {"group_id": None}, {"group_id": None, "viewers": 5}, {"group_id": None, "viewers": [1]},
                 {"group_id": 5, "viewers": []}):
        r = await c.put("/vehicles/car1", body)
        assert (r.status_code, type(r.json()["detail"])) == (422, str), body
    ok = await c.put("/vehicles/car1", {"group_id": None, "viewers": ["u-viewer"], "extra": 1})  # fields it does not know are ignored
    assert ok.status_code == 200 and calls == [1]


async def test_huge_integers_are_422_not_500(conn):
    c, _ = client(conn)
    for path, q in (("/activity", {"before": "99999999999999999999"}), ("/activity", {"before": "-1"}), ("/activity", {"before": ""}),
                    ("/activity", {"before": "1.5"}), ("/activity", {"before": "abc"}),
                    ("/trips/car1/99999999999999999999", {}), ("/charges/car1/-1", {}), ("/trips/car1/abc", {})):
        r = await c.get(path, view="v:car1", **q)
        assert (r.status_code, type(r.json()["detail"])) == (422, str), (path, q)
    assert (await c.get("/activity", view="v:car1", before=2**62 - 1)).status_code == 200
    assert (await c.get("/activity", view="v:car1", before=2**62)).status_code == 422


async def test_admin_sees_everything(conn):
    c, _ = client(conn)
    assert [v["id"] for v in (await c.get("/views", ADMIN)).json()["vehicles"]] == ["car1", "car2", "car3"]
    assert (await c.get("/settings", ADMIN)).status_code == 200


async def test_activity_visibility(conn):
    put(conn, "trips", "car1", 1000, 1500)
    put(conn, "trips", "car3", 2000, 2500)
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-viewer"])
    access.set_vehicle(conn, "car3", gid, [])  # in the cost group, hidden from the viewer
    c, _ = client(conn)
    assert (await c.get("/activity", view="v:car3")).status_code == 404
    assert (await c.get("/activity", view=f"g:{gid}")).status_code == 404  # a partly hidden group is not listed
    r = (await c.get("/activity", view="v:car1")).json()
    assert [i["vehicle_id"] for d in r["days"] for i in d["items"]] == ["car1"] and "capacity_wh" not in r


async def test_activity_before_validated(conn):
    c, _ = client(conn)
    assert (await c.get("/activity", view="v:car1", before=-1)).status_code == 422


def ms(*a):
    return int(datetime(*a, tzinfo=TZ).timestamp() * 1000)


async def test_stats_future_at_422(conn):
    c, _ = client(conn)
    future = await c.get("/stats", view="v:car1", period="week", at="2026-10-24")  # tomorrow
    assert (future.status_code, future.json()) == (422, {"detail": "at is in the future"})
    assert (await c.get("/stats", view="v:car1", period="week", at="2026-10-23")).status_code == 200  # today
    assert (await c.get("/stats", view="v:car1", period="decade")).status_code == 422
    assert (await c.get("/stats", view="v:car1", period="week", at="nope")).status_code == 422
    assert (await c.get("/stats", view="v:car1", period="week", at="")).status_code == 422


async def test_stats_hidden_vehicle_excluded(conn):
    put(conn, "trips", "car1", ms(2026, 10, 20), ms(2026, 10, 20, 1), {"distance_m": 1000, "net_wh": 100})
    put(conn, "trips", "car3", ms(2026, 10, 21), ms(2026, 10, 21, 1), {"distance_m": 90_000, "net_wh": 1, "recup_wh": 7, "gross_wh": 8})
    put(conn, "charges", "car3", ms(2026, 10, 21), ms(2026, 10, 21, 1), {"added_wh": 9999, "place": "Shop"})
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-viewer"])
    access.set_vehicle(conn, "car3", gid, [])  # in the cost group, hidden from the viewer
    c, _ = client(conn)
    q = {"period": "week", "at": "2026-10-23"}
    assert (await c.get("/stats", view="v:car3", **q)).status_code == 404
    assert (await c.get("/stats", view=f"g:{gid}", **q)).status_code == 404  # a partly hidden group is not listed
    r = (await c.get("/stats", view="v:car1", **q)).json()
    assert r["totals"]["distance_m"] == 1000 and r["totals"]["charges"] == 0 and r["by_place"] == []
    assert r["highlights"]["longest"]["vehicle_id"] == "car1" and r["highlights"]["recup_wh"] == 0 and r["per_vehicle"] is None
    a = (await c.get("/stats", ADMIN, view=f"g:{gid}", **q)).json()  # the admin sees the whole group, split per car
    assert a["totals"]["distance_m"] == 91_000 and [(p["id"], p["name"]) for p in a["per_vehicle"]] == [("car1", "Car One"), ("car3", "Car Three")]


async def test_stats_defaults_to_today(conn):
    put(conn, "trips", "car1", ms(2026, 10, 19), ms(2026, 10, 19, 1), {"distance_m": 1000})  # Monday of NOW's week
    put(conn, "trips", "car1", ms(2026, 10, 18), ms(2026, 10, 18, 1), {"distance_m": 5000})
    c, _ = client(conn)
    r = (await c.get("/stats", view="v:car1", period="week")).json()
    assert (r["period"]["start"], r["period"]["end"]) == (ms(2026, 10, 19), ms(2026, 10, 26))
    assert r["totals"]["distance_m"] == 1000 and r["previous"]["distance_m"] == 5000


async def test_stats_without_at(conn):
    c, _ = client(conn)
    r = (await c.get("/stats", view="v:car1", period="week")).json()  # NOW is Friday 2026-10-23
    assert r["period"] == {"start": ms(2026, 10, 19), "end": ms(2026, 10, 26), "first": "2026-10-19", "prev_at": "2026-10-18", "next_at": None}
    r = (await c.get("/stats", view="v:car1", period="month", at="2026-09-15")).json()
    assert (r["period"]["first"], r["period"]["prev_at"], r["period"]["next_at"]) == ("2026-09-01", "2026-08-31", "2026-10-01")
    r = (await c.get("/stats", view="v:car1", period="month")).json()
    assert (r["period"]["first"], r["period"]["next_at"]) == ("2026-10-01", None)
    assert (await c.get("/stats", view="v:car1", period="week", at="2026-10-24")).status_code == 422
    assert (await c.get("/stats", view="v:car1")).json()["period"]["first"] == "2026-10-19"  # the period defaults to week


CHARGE = {"added_wh": 20_000, "lat": 52.0, "lon": 5.0}


def cost_state(conn):
    return (prices.settings(conn), conn.execute("SELECT * FROM charge_receipts").fetchall())


async def test_cost_writes_need_admin(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    sid = prices.create_spot(conn, "car1", 1000, "Shop", 0.3)
    cid = prices.add_fixed_cost(conn, "car1", "Lease", 100, "month", date(2026, 1, 1), None)
    before = cost_state(conn)
    c, calls = client(conn)
    rs = [await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.4}, VIEWER),
          await c.post(f"/spots", {"vehicle_id": "car1", "start": 1000, "name": "X", "per_kwh": 0.4}, VIEWER),
          await c.put(f"/spots/{sid}", {"name": "Y"}, VIEWER),
          await c.delete(f"/spots/{sid}", VIEWER),
          await c.put(f"/charges/car1/1000/receipt", {"amount": 5}, VIEWER),
          await c.post(f"/vehicles/car1/fixed_costs", {"name": "Z", "amount": 1, "period": "once", "start": "2026-01-01", "end": None}, VIEWER),
          await c.put(f"/fixed_costs/{cid}", {"end": "2026-02-01"}, VIEWER),
          await c.delete(f"/fixed_costs/{cid}", VIEWER),
          await c.put(f"/vehicles/car1/card", {"markup_pct": 5, "start_fee": 1}, VIEWER)]
    assert [r.status_code for r in rs] == [403] * 9
    assert cost_state(conn) == before and not calls


async def test_cost_read_flow(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, _ = client(conn)
    assert (await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.40})).json() == {}
    for who in (ADMIN, VIEWER):
        items = [i for d in (await c.get("/activity", who, view="v:car1")).json()["days"] for i in d["items"]]
        assert items[0]["cost"] == {"amount": approx(8.08), "basis": "default"}
        assert (await c.get("/charges/car1/1000", who)).json()["cost"]["current"] == "ac"


async def test_trip_detail_cost(conn):
    put(conn, "trips", "car1", 1000, 2000, {"net_wh": 3000})
    c, _ = client(conn)
    await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.40})  # the 1.212 holds only with this tariff
    assert (await c.get("/trips/car1/1000")).json()["cost"]["energy"] == approx(1.212)


async def test_settings_lists_prices(conn):
    c, _ = client(conn)
    await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.40})
    assert (await c.get("/settings", ADMIN)).json()["prices"]["ac"][0]["per_kwh"] == 0.40


async def test_cost_validation(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    assert (await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 5.01})).status_code == 400
    assert (await c.post(f"/vehicles/car1/fixed_costs", {"name": "Z", "amount": 1, "period": "week", "start": "2026-01-01", "end": None})).status_code == 400
    assert (await c.post(f"/vehicles/car1/fixed_costs", {"name": "Z", "amount": 1, "period": "once", "start": "2026-01-01", "end": "9999-12-31"})).status_code == 400
    assert (await c.put(f"/charges/car1/1000/receipt", {"amount": -1})).status_code == 400
    assert (await c.put(f"/charges/car1/1000/receipt", {"amount": float("nan")})).status_code == 400
    assert cost_state(conn) == (prices.settings(conn), []) and prices.settings(conn)["ac"] == [] and prices.settings(conn)["fixed_costs"] == []
    assert not calls


async def test_a_json_boolean_is_no_number(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    for r in (await c.put(f"/charges/car1/1000/receipt", {"amount": True}),
              await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": True}),
              await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.4, "start_fee": False}),
              await c.put(f"/prices/ac", {"valid_from": True, "per_kwh": 0.4}),
              await c.put(f"/vehicles/car1/card", {"markup_pct": True, "start_fee": 1}),
              await c.post(f"/vehicles/car1/fixed_costs", {"name": "Z", "amount": True, "period": "once", "start": "2026-01-01", "end": None}),
              await c.post(f"/spots", {"vehicle_id": "car1", "start": True, "name": "X", "per_kwh": 0.4})):
        assert (r.status_code, type(r.json()["detail"])) == (422, str)
    assert cost_state(conn) == (prices.settings(conn), []) and prices.settings(conn)["ac"] == [] and not calls


async def test_body_numbers_and_dates_are_checked(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    tariff = {"valid_from": 0, "per_kwh": 0.4}
    for body in (None, [], "x", {}, {"per_kwh": 0.4}, {"valid_from": 0}, {**tariff, "per_kwh": "0.4"}, {**tariff, "per_kwh": None},
                 {**tariff, "valid_from": 1.5}, {**tariff, "valid_from": "0"}, {**tariff, "valid_from": -1}, {**tariff, "valid_from": 2**62},
                 {**tariff, "per_kwh": 10**400}):
        assert (await c.put(f"/prices/ac", body)).status_code == 422, body
    assert (await c.put(f"/prices/ac", {**tariff, "per_kwh": 1, "start_fee": 0, "per_min": 2})).status_code == 200  # whole numbers are numbers
    assert (await c.put(f"/prices/ac", {**tariff, "valid_from": 5, "per_kwh": 0.4, "unknown": [1]})).status_code == 200
    fixed = {"name": "Z", "amount": 1, "period": "once", "start": "2026-01-01", "end": None}
    for patch in ({"start": "nope"}, {"start": 20260101}, {"start": None}, {"end": "2026-13-01"}, {"end": 5}, {"name": 5}, {"period": None}):
        assert (await c.post(f"/vehicles/car1/fixed_costs", {**fixed, **patch})).status_code == 422, patch
    assert (await c.post(f"/vehicles/car1/fixed_costs", {k: v for k, v in fixed.items() if k != "end"})).status_code == 422  # end may be null, not missing
    assert (await c.put(f"/charges/car1/1000/receipt", {})).status_code == 422
    assert (await c.put(f"/charges/car1/1000/receipt", {"amount": None})).status_code == 200  # no receipt
    assert (await c.put(f"/charges/car1/abc/receipt", {"amount": 5})).status_code == 422
    assert len(prices.settings(conn)["ac"]) == 2 and prices.settings(conn)["fixed_costs"] == []
    assert len(calls) == 3  # two tariffs and the receipt


async def test_spot_from_charge_without_point(conn):
    put(conn, "charges", "car1", 1000, 2000, {"lat": None, "lon": None})
    c, calls = client(conn)
    body = {"vehicle_id": "car1", "name": "X", "per_kwh": 0.4}
    assert (await c.post(f"/spots", {**body, "start": 1000})).status_code == 400
    assert (await c.post(f"/spots", {**body, "start": 999})).status_code == 404
    assert prices.settings(conn)["spots"] == [] and not calls


async def test_spot_price_holds_from_the_charge_days_midnight(conn):
    """a charge's start can move a little earlier when it is re-derived (cloud plug time): the new spot's price must still hold"""
    start = int(datetime(2026, 10, 26, 8, 16, 53, tzinfo=TZ).timestamp() * 1000)
    put(conn, "charges", "car1", start, start + 3_600_000, CHARGE)
    c, _ = client(conn)
    sid = (await c.post(f"/spots", {"vehicle_id": "car1", "start": start, "name": "Work", "per_kwh": 0.21})).json()["id"]
    midnight = int(datetime(2026, 10, 26, tzinfo=TZ).timestamp() * 1000)
    assert [t["valid_from"] for t in prices.settings(conn)["spots"][0]["tariffs"]] == [midnight]
    assert prices.book(conn, "car1").tariff_at(sid, start - 28_000)["per_kwh"] == 0.21


async def test_spot_routes_relabel_after_the_write_and_before_on_costs(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    order = []
    c, _ = client(conn, zones=lambda a, b: None, capacity=lambda v: 1.0,
                  relabel=lambda: order.append(("relabel", conn.execute("SELECT COUNT(*) FROM charge_spots").fetchone()[0])),
                  on_costs=lambda vids: order.append("costs"))
    sid = (await c.post(f"/spots", {"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3})).json()["id"]
    assert order == [("relabel", 1), "costs"]  # the spot is written when relabel runs
    order.clear()
    assert (await c.put(f"/spots/{sid}", {"name": "Shop 2"})).status_code == 200
    assert order == [("relabel", 1), "costs"]
    order.clear()
    assert (await c.delete(f"/spots/{sid}")).status_code == 200
    assert order == [("relabel", 0), "costs"]
    order.clear()
    assert (await c.put(f"/spots/nope", {"name": "X"})).status_code == 404
    assert (await c.delete(f"/spots/nope")).status_code == 404
    assert order == []  # a failed write relabels nothing


async def test_a_failing_relabel_after_a_spot_write_still_answers(conn, caplog):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)

    def boom():
        raise RuntimeError("boom")
    c, calls = client(conn, relabel=boom)
    r = await c.post(f"/spots", {"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3})
    assert r.status_code == 200 and len(prices.settings(conn)["spots"]) == 1  # the spot is saved and answered
    assert calls == [None]  # the cost sensors still follow
    assert "renaming places after a spot change failed" in caplog.text


async def test_on_costs_targets(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    c, calls = client(conn)
    await c.put(f"/prices/ac", {"valid_from": 0, "per_kwh": 0.4})
    sid = (await c.post(f"/spots", {"vehicle_id": "car1", "start": 1000, "name": "Shop", "per_kwh": 0.3})).json()["id"]
    await c.put(f"/spots/{sid}", {"name": "Shop 2"})
    await c.delete(f"/spots/{sid}")
    assert calls == [None] * 4
    calls.clear()
    await c.put(f"/charges/car1/1000/receipt", {"amount": 9.5})
    await c.put(f"/vehicles/car1/card", {"markup_pct": 5, "start_fee": 1})
    cid = (await c.post(f"/vehicles/car1/fixed_costs", {"name": "Lease", "amount": 100, "period": "month", "start": "2026-01-01", "end": None})).json()["id"]
    await c.put(f"/fixed_costs/{cid}", {"end": "2026-06-30"})
    await c.delete(f"/fixed_costs/{cid}")
    assert calls == [["car1"]] * 5
    assert (await c.put(f"/fixed_costs/{cid}", {"end": None})).status_code == 404 and len(calls) == 5


async def test_failed_cost_edits_call_on_costs_zero_times(conn):
    put(conn, "charges", "car1", 1000, 2000, CHARGE)
    cid = prices.add_fixed_cost(conn, "car1", "Lease", 100, "month", date(2026, 1, 1), None)
    c, calls = client(conn)
    assert (await c.put(f"/spots/nope", {"name": "X"})).status_code == 404
    assert (await c.delete(f"/spots/nope")).status_code == 404
    assert (await c.put(f"/charges/car1/999/receipt", {"amount": 5})).status_code == 404
    assert (await c.put(f"/vehicles/nope/card", {"markup_pct": 5, "start_fee": 1})).status_code == 404
    assert (await c.put(f"/fixed_costs/{cid}", {"end": "2025-12-31"})).status_code == 400
    assert (await c.delete(f"/fixed_costs/nope")).status_code == 404
    assert not calls


async def test_raw_samples_admin_only_in_range(conn):
    db.ingest(conn, "car1", "src", [s(NOW - 3000, "battery_wh", 46_600), s(NOW - 2000, "battery_wh", 46_550),
                                    s(NOW - 2000, "speed", 10.0), s(NOW, "battery_wh", 46_500)], NOW)
    c, _ = client(conn)
    q = {"key": "battery_wh", "start": NOW - 2000, "end": NOW - 1}
    assert (await c.get("/samples/car1", VIEWER, **q)).status_code == 403
    assert (await c.get("/samples/car1", ADMIN, **q)).json() == {"key": "battery_wh", "rows": [[NOW - 2000, 46_550]]}
    assert (await c.get("/samples/car1", ADMIN, key="battery_wh", start=0, end=2 * 86_400_000)).status_code == 400
    assert (await c.get("/samples/nope", ADMIN, key="battery_wh", start=0, end=1)).status_code == 404
    for missing in ({"start": 0, "end": 1}, {"key": "battery_wh", "end": 1}, {"key": "battery_wh", "start": 0}, {"key": "battery_wh", "start": "x", "end": 1}):
        assert (await c.get("/samples/car1", ADMIN, **missing)).status_code == 422, missing


async def test_map_period_and_thinning(conn):
    pts = [[52 + i / 10_000, 5 + i / 10_000] for i in range(400)]
    seed_trip(conn, "car1", ms(2026, 10, 21), ms(2026, 10, 21, 1), route=pts)
    seed_trip(conn, "car1", ms(2026, 10, 14), ms(2026, 10, 14, 1), route=pts)  # the week before
    put(conn, "charges", "car1", ms(2026, 10, 22), ms(2026, 10, 22, 2), {"lat": 52.0, "lon": 5.0})
    conn.execute("INSERT INTO addresses VALUES(520000, 50000, 'Some Street 1', 0)")
    c, _ = client(conn)
    r = (await c.get("/map", view="v:car1", period="week")).json()
    assert [(t["vid"], t["start"], len(t["route"])) for t in r["trips"]] == [("car1", ms(2026, 10, 21), 300)]
    assert r["charges"] == [{"vid": "car1", "start": ms(2026, 10, 22), "lat": 52.0, "lon": 5.0, "name": "Some Street 1"}]
    y = (await c.get("/map", view="v:car1", period="year")).json()
    assert sorted(len(t["route"]) for t in y["trips"]) == [48, 48]


async def test_map_empty_period(conn):
    c, _ = client(conn)
    assert (await c.get("/map", view="v:car1", period="week")).json() == {"trips": [], "charges": []}


async def test_map_future_at_is_422(conn):
    c, _ = client(conn)
    assert (await c.get("/map", view="v:car1", period="week", at="2026-10-24")).status_code == 422


async def test_there_is_no_tile_route(conn):
    c, _ = client(conn)
    assert (await c.get("/tiles/3/4/5.png")).status_code == 404


async def test_map_leaves_out_a_charge_without_a_position_and_an_open_trip(conn):
    seed_trip(conn, "car1", ms(2026, 10, 21), ms(2026, 10, 21, 1), route=[[52.0, 5.0], [52.1, 5.1]])
    seed_trip(conn, "car1", ms(2026, 10, 22), None, route=[[52.0, 5.0], [52.1, 5.1]])  # open: its end is where the car is
    put(conn, "charges", "car1", ms(2026, 10, 22), ms(2026, 10, 22, 2))
    put(conn, "charges", "car1", ms(2026, 10, 22, 3), ms(2026, 10, 22, 4), {"lat": 52.0, "lon": 5.0})
    c, _ = client(conn)
    r = (await c.get("/map", view="v:car1", period="week")).json()
    assert [t["start"] for t in r["trips"]] == [ms(2026, 10, 21)]
    assert [(ch["start"], ch["name"]) for ch in r["charges"]] == [(ms(2026, 10, 22, 3), None)]


async def test_map_of_a_hidden_vehicle_is_404(conn):
    c, _ = client(conn)
    assert (await c.get("/map", view="v:car3", period="week")).status_code == 404


async def test_vehicle_card_soc_from_soc_percent_and_no_data_after_seven_days(conn):
    db.set_vehicle(conn, "car1", "Car One", True)
    db.ingest(conn, "car1", "src", [s(NOW - 8 * 86_400_000, "soc_percent", 64.0)], NOW)
    c, _ = client(conn)
    v = (await c.get("/overview", view="v:car1")).json()["vehicles"][0]
    assert (v["soc_percent"], v["status"], v["battery_wh"]) == (64.0, "no_data", None)
    db.ingest(conn, "car1", "src", [s(NOW - 6 * 86_400_000, "soc_percent", 63.0)], NOW)
    assert (await c.get("/overview", view="v:car1")).json()["vehicles"][0]["status"] == "parked"


async def test_cloud_only_car_without_samples_is_not_no_data(conn):
    db.set_vehicle(conn, "car1", "Car One", True)
    c, _ = client(conn)
    assert (await c.get("/overview", view="v:car1")).json()["vehicles"][0]["status"] == "parked"


async def test_car_app_vehicle_is_never_no_data(conn):
    db.ingest(conn, "car1", "src", [s(NOW - 8 * 86_400_000, "battery_wh", 30_000)], NOW)
    c, _ = client(conn)
    assert (await c.get("/overview", view="v:car1")).json()["vehicles"][0]["status"] == "parked"


CARS = {"car1": {"source": "car_app", "missing_entities": False}}


async def test_onboarding_routes_are_admin_only(conn):
    c, _ = client(conn, cars=lambda: CARS)
    for r in (await c.get("/onboarding", VIEWER), await c.put("/onboarding", {"hidden": True}, VIEWER)):
        assert (r.status_code, r.json()) == (403, {"detail": "forbidden"})
    assert conn.execute("SELECT COUNT(*) FROM settings WHERE key='onboarding'").fetchone()[0] == 0  # not even read: no row was written


async def test_put_onboarding_returns_the_new_state(conn):
    c, _ = client(conn, cars=lambda: CARS)
    got = (await c.get("/onboarding", ADMIN)).json()
    assert got["cars"] == [{"id": "car1", "name": "Car One", "source": "car_app", "has_data": False, "missing_entities": False}]
    r = await c.put("/onboarding", {"opened": "viewers"})
    assert (r.status_code, r.json()) == (200, got | {"opened": ["viewers"]})
    assert (await c.put("/onboarding", {"hidden": True})).json() == got | {"opened": ["viewers"], "hidden": True}


async def test_put_onboarding_rejects_bad_bodies(conn):
    c, _ = client(conn, cars=lambda: CARS)
    for body in ({"opened": "prices"}, {}, {"opened": "viewers", "hidden": True}, {"hidden": "yes"}, {"hidden": 1}, {"opened": ["viewers"]}, None, ["hidden"]):
        assert (await c.put("/onboarding", body)).status_code == 422, body
    assert (await c.get("/onboarding", ADMIN)).json()["opened"] == []
