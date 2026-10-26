import json
import sqlite3
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi.testclient import TestClient

from car_insights import access, db, export, ui_api
from car_insights.api import create_app
from car_insights.protocol import Sample
from car_insights.publisher import Publisher
from car_insights.totals_sensors import TotalsSensors
from car_insights.trip_sensors import TripSensors
from conftest import FakeMqtt

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 23, 12, tzinfo=TZ).timestamp() * 1000)
ADMIN = {"X-Remote-User-Id": "u-admin"}
VIEWER = {"X-Remote-User-Id": "u-viewer", "X-Remote-User-Name": "viewer"}


def test_export_is_a_consistent_copy(tmp_path):
    conn = db.connect(":memory:")
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES('car1','Car One')")
    conn.commit()
    path = export.write(conn, {}, tmp_path / "out")
    assert path == tmp_path / "out" / "export.db"
    copy = sqlite3.connect(path)
    assert copy.execute("SELECT name FROM vehicles").fetchall() == [("Car One",)]
    assert copy.execute("PRAGMA user_version").fetchone() == conn.execute("PRAGMA user_version").fetchone()
    copy.close()


def test_export_writes_options(tmp_path):
    opts = {"default_capacity_kwh": 52, "sources": [{"name": "a"}]}
    export.write(db.connect(":memory:"), opts, tmp_path)
    export.write(db.connect(":memory:"), opts, tmp_path)  # twice is safe
    assert json.loads((tmp_path / "export.json").read_text()) == opts
    assert sorted(p.name for p in tmp_path.iterdir()) == ["export.db", "export.json"]


def test_discovery_clear_covers_every_announced_topic():
    conn, mqtt = db.connect(":memory:"), FakeMqtt()
    gid = access.create_group(conn, "Family")
    for vid in ("car1", "car2"):
        conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES(?,?)", (vid, vid))
    conn.execute("INSERT INTO sources(vehicle_id, source_id, type) VALUES('car3', 'cloud-1', 'cloud')")  # cloud-only: no vehicles row
    access.set_vehicle(conn, "car1", gid, [])
    samples = [Sample(1, 1, "speed", 1.0), Sample(2, 1, "battery_wh", 30_000.0), Sample(3, 1, "range_m", 200_000.0), Sample(4, 1, "power", 1000.0),
               Sample(5, 1, "outside_temp", 12.0), Sample(6, 1, "mode", "parked"), Sample(7, 1, "plugged", True),
               Sample(8, 1, "gps", [1.0, 2.0, 3.0, 0, 0, 0])]
    totals = TotalsSensors(conn, mqtt, TZ, now_ms=lambda: NOW)
    for vid in ("car1", "car2", "car3"):
        Publisher(conn, mqtt, lambda v: 60_000.0).on_ingested(vid, samples, 1000)
        trip = {"start": 1000, "end": 2000, "from": "A", "to": "B", "distance_m": 1000.0, "net_wh": 100.0}
        TripSensors(conn, mqtt, lambda v: 60_000.0).publish(vid, trip, None, [trip], [])
        totals.publish_vehicle(vid)
    totals.publish_groups()
    announced = {t for t, p, _ in mqtt.msgs if t.endswith("/config") and p}  # the empty ones are the old curve removals
    assert any("device_tracker" in t for t in announced) and any(f"group_{gid}" in t for t in announced) and any("car3_" in t for t in announced)
    clear = export.discovery_clear(conn)
    assert announced <= {t for t, p in clear if p == ""}
    assert all(p == "" and t.startswith("homeassistant/") and t.endswith("/config") for t, p in clear)


def test_gate_drops_after_stop_but_clear_reaches_the_sink():
    sink = FakeMqtt()
    gate = export.Gate(sink)
    gate.publish([("a", "1")])
    gate.stop()
    gate.publish([("b", "2")])
    gate.inner.publish([("c", "")])
    assert sink.topics == ["a", "c"]


def test_export_route_is_admin_only():
    conn = db.connect(":memory:")
    calls = []

    async def is_admin(uid):
        return uid == "u-admin"

    router = ui_api.router(conn, lambda lat, lon: "Home", TZ, lambda v: 60_000.0, is_admin, now_ms=lambda: NOW,
                           on_export=lambda: calls.append(1) or "/share/car_insights/export.db")
    c = TestClient(create_app(conn, "t" * 64, lambda *a: None, lambda: NOW, ui=router), client=("172.30.32.2", 50000))
    assert c.post("/api/ui/export", headers=VIEWER).status_code == 403 and calls == []
    r = c.post("/api/ui/export", headers=ADMIN)
    assert r.status_code == 200 and r.json() == {"path": "/share/car_insights/export.db"} and calls == [1]
