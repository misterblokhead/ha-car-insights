import asyncio
import json
from datetime import date, datetime
from zoneinfo import ZoneInfo

import pytest

from car_insights import access, db, prices, totals_sensors
from car_insights.totals_sensors import TotalsSensors
from conftest import FakeMqtt, seed_charge, seed_trip

TZ = ZoneInfo("Europe/Amsterdam")
NOW = int(datetime(2026, 10, 23, 12, tzinfo=TZ).timestamp() * 1000)
THIS_MONTH = int(datetime(2026, 10, 5, 12, tzinfo=TZ).timestamp() * 1000)
LAST_MONTH = int(datetime(2026, 9, 5, 12, tzinfo=TZ).timestamp() * 1000)
SENSORS = [f"{p}_{k}" for p in ("month", "year") for k in ("distance", "energy", "charged", "energy_cost", "fixed_cost", "total_cost", "cost_per_km")]


def add(conn, vid, group=None, trips=(), charges=()):
    conn.execute("INSERT INTO vehicles(vehicle_id, name) VALUES(?,?)", (vid, vid))
    if group:
        access.set_vehicle(conn, vid, group, [])
    for start, dist, net in trips:
        seed_trip(conn, vid, start, start + 1, distance_m=dist, net_wh=net)
    for start, added in charges:
        seed_charge(conn, vid, start, start + 1, added_wh=added)


@pytest.fixture
def env():
    conn, mqtt = db.connect(":memory:"), FakeMqtt()
    return conn, mqtt, TotalsSensors(conn, mqtt, TZ, now_ms=lambda: NOW)


def test_vehicle_totals_published_after_close(env):
    conn, mqtt, ts = env
    add(conn, "car1", trips=[(THIS_MONTH, 10_000.0, 2_000.0), (LAST_MONTH, 5_000.0, 1_000.0)], charges=[(THIS_MONTH, 30_000.0)])
    ts.publish_vehicle("car1")
    st, retained = mqtt.on("car_insights/car1/totals")[-1]
    assert retained and {k: v for k, v in st.items() if "cost" not in k} == {"month_distance": 10.0, "month_energy": 2.0, "month_charged": 30.0,
                                                                          "year_distance": 15.0, "year_energy": 3.0, "year_charged": 30.0}
    cfgs = {t: json.loads(p) for t, p, _ in mqtt.msgs if t.startswith("homeassistant/sensor/car1_")}
    assert sorted(cfgs) == sorted(f"homeassistant/sensor/car1_{s}/config" for s in SENSORS)
    d = cfgs["homeassistant/sensor/car1_month_distance/config"]
    assert d["unit_of_measurement"] == "km" and d["state_class"] == "measurement" and d["value_template"] == "{{ value_json.month_distance }}"
    assert d["state_topic"] == "car_insights/car1/totals" and d["unique_id"] == "car_insights_car1_month_distance"
    energy = [c for c in cfgs.values() if c.get("device_class") == "energy"]
    assert len(energy) == 4 and all("state_class" not in c and c["unit_of_measurement"] == "kWh" for c in energy)
    n = len(mqtt.msgs)
    ts.publish_vehicle("car1")
    assert len(mqtt.msgs) == n + 1  # discovery is sent once, the state every time


def test_cost_fields(env):
    conn, mqtt, _ = env
    ts = TotalsSensors(conn, mqtt, TZ, now_ms=lambda: int(datetime(2026, 10, 10, 12, tzinfo=TZ).timestamp() * 1000))
    add(conn, "car1", trips=[(THIS_MONTH, 50_000.0, 9_000.0)], charges=[(THIS_MONTH, 20_000.0)])
    add(conn, "car2")
    prices.set_tariff(conn, "ac", 0, 0.40)
    prices.add_fixed_cost(conn, "car1", "Insurance", 31.0, "month", date(2026, 10, 1), None)
    ts.publish_vehicle("car1")
    ts.publish_vehicle("car2")
    st = mqtt.on("car_insights/car1/totals")[-1][0]
    assert (st["month_energy_cost"], st["month_fixed_cost"], st["month_total_cost"], st["month_cost_per_km"]) == (8.08, 10.0, 18.08, 0.362)
    assert mqtt.on("car_insights/car2/totals")[-1][0]["month_cost_per_km"] is None  # 0 km
    cfgs = {t: json.loads(p) for t, p, _ in mqtt.msgs if t.startswith("homeassistant/sensor/car1_")}
    cost = cfgs["homeassistant/sensor/car1_month_total_cost/config"]
    assert cost["device_class"] == "monetary" and cost["unit_of_measurement"] == "EUR" and "state_class" not in cost
    per_km = cfgs["homeassistant/sensor/car1_year_cost_per_km/config"]
    assert per_km["unit_of_measurement"] == "EUR/km" and "device_class" not in per_km and per_km["name"] == "Year cost per km"


def test_failing_cost_still_publishes_distance_and_energy(env, monkeypatch, caplog):
    conn, mqtt, ts = env
    add(conn, "car1", trips=[(THIS_MONTH, 10_000.0, 2_000.0)], charges=[(THIS_MONTH, 30_000.0)])
    monkeypatch.setattr("car_insights.costs.period_costs", lambda *a: 1 / 0)
    ts.publish_vehicle("car1")
    st = mqtt.on("car_insights/car1/totals")[-1][0]
    assert st["month_distance"] == 10.0 and st["year_charged"] == 30.0
    assert all(st[f] is None for f in ("month_energy_cost", "month_fixed_cost", "year_total_cost", "month_cost_per_km", "year_cost_per_km"))
    assert "totals cost failed" in caplog.text


def test_vehicle_totals_zero_when_nothing_in_period(env):
    conn, mqtt, ts = env
    add(conn, "car1", trips=[(LAST_MONTH, 5_000.0, 1_000.0)])
    ts.publish_vehicle("car1")
    st = mqtt.on("car_insights/car1/totals")[-1][0]
    assert st["month_distance"] == 0 and st["month_charged"] == 0 and st["year_distance"] == 5.0


def test_group_device_sums_members(env):
    conn, mqtt, ts = env
    gid = access.create_group(conn, "Fleet")
    add(conn, "car1", gid, trips=[(THIS_MONTH, 10_000.0, 2_000.0)])
    add(conn, "car2", gid, trips=[(THIS_MONTH, 4_000.0, 1_000.0)], charges=[(THIS_MONTH, 8_000.0)])
    add(conn, "car3", trips=[(THIS_MONTH, 99_000.0, 9_000.0)])  # not a member
    ts.publish_groups()
    st = mqtt.on(f"car_insights/group_{gid}/totals")[-1][0]
    assert st["month_distance"] == 14.0 and st["month_energy"] == 3.0 and st["month_charged"] == 8.0
    cfg = json.loads(next(p for t, p, _ in mqtt.msgs if t == f"homeassistant/sensor/group_{gid}_month_distance/config"))
    assert cfg["device"] == {"identifiers": [f"car_insights_group_{gid}"], "name": "Fleet"}
    assert cfg["unique_id"] == f"car_insights_group_{gid}_month_distance"
    ts.publish_groups()
    ts.publish_groups()
    assert len([t for t in mqtt.topics if t == f"homeassistant/sensor/group_{gid}_year_energy/config"]) == 3  # the name may have changed


def test_renamed_group_updates_device_name(env):
    conn, mqtt, ts = env
    gid = access.create_group(conn, "Old")
    ts.publish_groups()
    access.rename_group(conn, gid, "New")
    ts.publish_groups()
    cfg = json.loads([p for t, p, _ in mqtt.msgs if t == f"homeassistant/sensor/group_{gid}_month_energy/config"][-1])
    assert cfg["device"]["name"] == "New"


def test_deleted_group_discovery_cleared(env):
    conn, mqtt, ts = env
    keep, gone = access.create_group(conn, "Keep"), access.create_group(conn, "Gone")
    ts.publish_groups()
    n = len(mqtt.msgs)
    access.delete_group(conn, gone)
    ts.publish_groups()
    new = mqtt.msgs[n:]
    cleared = {t for t, p, r in new if p == "" and r}
    assert cleared >= {f"homeassistant/sensor/group_{gone}_{s}/config" for s in SENSORS}
    assert f"car_insights/group_{gone}/totals" in cleared
    assert not [t for t in cleared if keep in t]
    n = len(mqtt.msgs)
    ts.publish_groups()
    assert not [1 for t, p, _ in mqtt.msgs[n:] if p == ""]  # cleared once


def test_in_group(env):
    conn, _, ts = env
    gid = access.create_group(conn, "Fleet")
    add(conn, "car1", gid)
    add(conn, "car2")
    assert ts.in_group("car1") and not ts.in_group("car2") and not ts.in_group("nobody")


def test_seconds_to_next_run_is_next_local_midnight_plus_5s(env):
    _, _, ts = env
    assert ts._seconds_to_next_run() == 12 * 3600 + 5
    dst = TotalsSensors(db.connect(":memory:"), FakeMqtt(), TZ, now_ms=lambda: int(datetime(2026, 10, 25, 0, 30, tzinfo=TZ).timestamp() * 1000))
    assert dst._seconds_to_next_run() == 24.5 * 3600 + 5  # the day DST ends has 25 hours


def test_run_daily_publishes_all_survives_errors_and_stops_on_cancel(env, monkeypatch):
    conn, mqtt, ts = env
    gid = access.create_group(conn, "Fleet")
    add(conn, "car1", gid)
    sleeps = []

    async def fake_sleep(sec):
        sleeps.append(sec)
        if len(sleeps) == 4:
            raise asyncio.CancelledError
    monkeypatch.setattr(totals_sensors.asyncio, "sleep", fake_sleep)
    orig, calls = ts.publish_vehicle, []

    def flaky(vid):
        calls.append(vid)
        if len(calls) == 1:
            raise RuntimeError("mqtt down")
        orig(vid)
    ts.publish_vehicle = flaky
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(ts.run_daily())
    assert sleeps == [12 * 3600 + 5] * 4 and calls == ["car1"] * 4  # the start-up publish failed: logged, the loop still ran
    assert mqtt.on("car_insights/car1/totals") and mqtt.on(f"car_insights/group_{gid}/totals")


def test_group_deleted_after_restart_is_cleared(env, monkeypatch):
    conn, mqtt, ts = env  # a fresh instance: the groups are only known once run_daily has published at start-up
    gid = access.create_group(conn, "Gone")

    async def stop(_):
        raise asyncio.CancelledError
    monkeypatch.setattr(totals_sensors.asyncio, "sleep", stop)
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(ts.run_daily())
    assert mqtt.on(f"car_insights/group_{gid}/totals")
    access.delete_group(conn, gid)
    ts.publish_groups()
    assert {t for t, p, _ in mqtt.msgs if p == ""} >= {f"homeassistant/sensor/group_{gid}_{s}/config" for s in SENSORS}
