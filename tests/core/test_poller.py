import asyncio
import hashlib
import logging
from datetime import datetime, timezone

import pytest

from custom_components.car_insights.core import db, summary
from custom_components.car_insights.core.derive import Deriver
from custom_components.car_insights.core.pipeline import App, ingested
from custom_components.car_insights.core.totals_sensors import TotalsSensors
from custom_components.car_insights.core.trip_sensors import TripSensors
from custom_components.car_insights.core.db import connect
from custom_components.car_insights.core.protocol import Sample
from custom_components.car_insights.core.poller import BACKFILL_MS, Poller, SourceConf, legacy_source_id, new_source_id
from custom_components.car_insights.core.ha_entities import REPORT_MAX_AGE_MS
from conftest import FakeMqtt, ms

NOW = ms("2026-10-23T12:00:00+00:00")
CHARGE, SOC, ODO, PLUG, REPORT = IDS = ["sensor.zoe_charge_state", "sensor.zoe_battery", "sensor.zoe_mileage", "sensor.zoe_plug_state",
                                         "sensor.zoe_last_battery_activity"]
SPEED, LOC = "sensor.zoe_speed", "device_tracker.zoe"
SID = legacy_source_id("renault", "zoe")
ENTITIES = {"charging": "rid-cs", "charge_level": "rid-bat", "odometer": "rid-mil", "plugged": "rid-ps", "report_time": "rid-act"}
CONF = SourceConf("car1", SID, ENTITIES, False)
RES = {"rid-cs": (CHARGE, None), "rid-bat": (SOC, "%"), "rid-mil": (ODO, "km"), "rid-ps": (PLUG, None), "rid-act": (REPORT, None),
       "rid-spd": (SPEED, "km/h"), "rid-loc": (LOC, None)}


def iso(t):
    return datetime.fromtimestamp(t / 1000, timezone.utc).isoformat()


def rows(eid, *pairs):
    """minimal-response rows of one entity: only the first carries entity_id"""
    out = [{"last_changed": iso(t), "state": st} for t, st in pairs]
    out[0]["entity_id"] = eid
    return out


class Fetch:
    def __init__(self, payload=(), error=None):
        self.payload, self.error, self.calls = list(payload), error, []

    def __call__(self, ids, start, end, attr_ids):
        self.calls.append((ids, start, end, attr_ids))
        if self.error:
            raise self.error
        return self.payload


T = NOW - 3_600_000
FULL = [rows(CHARGE, (T, "charge_in_progress"), (T + 600_000, "charge_ended")), rows(SOC, (T, "50"), (T + 600_000, "55")),
        rows(ODO, (T, "1000")), rows(PLUG, (T, "plugged"), (T + 600_000, "unplugged")), rows(REPORT, (T - 1000, iso(T - 30_000)), (T + 599_000, iso(T + 570_000)))]


def make(fetch, conn=None, conf=CONF, res=None, missing=None, clock=None):
    """res: registry id -> (entity id, unit), a dict the test may change; missing: collects on_missing; clock: [now_ms], a list the test may change"""
    calls = []
    conn = conn or connect(":memory:")
    res = RES if res is None else res
    clock = clock or [NOW]
    p = Poller(conn, fetch, lambda ids: {i: res[i] for i in ids if i in res}, lambda *a: calls.append(a),
               lambda *a: missing.append(a) if missing is not None else None, lambda: clock[0])
    p.set_conf("car1", conf)
    return p, conn, calls


def poll(p):
    asyncio.run(p.poll_once())


def test_legacy_source_id_is_the_1_0_0_hash():
    assert legacy_source_id("renault", "zoe") == "ha_entities-" + hashlib.sha1(b"renault:zoe").hexdigest()[:8]


def test_new_source_id_hashes_vehicle_and_device():
    assert new_source_id("car1", "dev9") == "ha_entities-" + hashlib.sha1(b"car1:dev9").hexdigest()[:8]


def test_first_poll_backfills_ten_days_and_ends_ten_seconds_ago():
    f = Fetch()
    poll(make(f)[0])
    assert f.calls == [(IDS, NOW - BACKFILL_MS, NOW - 10_000, [])]


def test_first_poll_ingests_samples_and_notifies():
    p, conn, calls = make(Fetch(FULL))
    poll(p)
    got = conn.execute("SELECT t, key, value_json FROM samples WHERE source_id=? ORDER BY seq", (SID,)).fetchall()
    assert got == [(T - 30_000, "charging_state", "true"), (T - 30_000, "soc_percent", "50.0"), (T, "odometer_km", "1000.0"),
                   (T, "plug_state", "true"), (T + 570_000, "charging_state", "false"), (T + 570_000, "soc_percent", "55.0"),
                   (T + 600_000, "plug_state", "false")]
    assert len(calls) == 1 and calls[0][0] == "car1" and calls[0][2:] == (NOW, NOW - 10_000)
    assert [s.t for s in calls[0][1]] == [T - 30_000, T - 30_000, T, T, T + 570_000, T + 570_000, T + 600_000]


def test_poller_calls_ingested_only(monkeypatch):
    conn = connect(":memory:")
    d = Deriver(conn, lambda la, lo: None)
    app = App(conn, d, TripSensors(conn, FakeMqtt(), lambda vid: 57_000.0), TotalsSensors(conn, FakeMqtt(), timezone.utc), timezone.utc,
              lambda vid: 57_000.0, lambda la, lo: None)
    built = []
    monkeypatch.setattr(summary, "build", lambda *a, **k: built.append(1))
    p = Poller(conn, Fetch(FULL), lambda ids: {i: RES[i] for i in ids}, lambda vid, ss, now, until: ss and ingested(app, vid, min(s.t for s in ss), now),
               lambda *a: None, lambda: NOW)
    p.set_conf("car1", CONF)
    poll(p)
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] > 0 and built == []


def test_seqs_contiguous_and_acked():
    f = Fetch(FULL)
    p, conn, _ = make(f)
    poll(p)
    assert conn.execute("SELECT MIN(seq), MAX(seq), COUNT(*) FROM samples").fetchone() == (1, 7, 7)
    assert db.acked_seq(conn, "car1", SID) == 7
    f.payload = FULL[:2] + [rows(ODO, (T, "1000"), (T + 3_000_000, "1005"))] + FULL[3:]
    poll(p)
    assert conn.execute("SELECT MAX(seq), COUNT(*) FROM samples").fetchone() == (8, 8)
    assert db.acked_seq(conn, "car1", SID) == 8


def test_second_poll_overlapping_history_adds_nothing():
    f = Fetch(FULL)
    p, conn, calls = make(f)
    poll(p)
    calls.clear()
    poll(p)
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 7 and calls == [("car1", [], NOW, NOW - 10_000)]
    assert f.calls[1] == (IDS, NOW - REPORT_MAX_AGE_MS, NOW - 10_000, [])


def test_second_poll_starts_at_previous_poll():
    f = Fetch(FULL)
    p, conn, _ = make(f)
    poll(p)
    poll(p)
    assert min(db.cursors(conn, "car1", SID).values()) < NOW - REPORT_MAX_AGE_MS  # the stale cursor would reach back further
    assert f.calls[1][1] == NOW - REPORT_MAX_AGE_MS


def test_failed_fetch_does_not_advance_the_window():
    f = Fetch(FULL)
    p, conn, _ = make(f)
    poll(p)
    f.error = RuntimeError("down")
    poll(p)
    f.error = None
    poll(p)
    assert f.calls[2][1] == f.calls[1][1]


def test_restart_resumes_from_stored_cursor_without_duplicates():
    conn = connect(":memory:")
    poll(make(Fetch(FULL), conn)[0])
    cursor = db.cursors(conn, "car1", SID)
    assert set(cursor) == set(IDS)
    f = Fetch(FULL)
    p2, _, calls = make(f, conn)
    poll(p2)
    assert f.calls[0][1] == min(cursor.values()) - REPORT_MAX_AGE_MS
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 7 and calls == [("car1", [], NOW, NOW - 10_000)]


def test_report_time_row_older_than_the_metric_cursor_is_still_found():
    conn = connect(":memory:")
    c = T + 3_000_000
    poll(make(Fetch([rows(ODO, (c, "1000"))]), conn)[0])  # cursor: only the odometer, at c
    report_t = c - 1_200_000  # the cloud's report time, 20 min before the cursor
    f = Fetch([rows(ODO, (c, "1000")), rows(REPORT, (report_t + 1000, iso(report_t))), rows(SOC, (c + 60_000, "70"))])
    p, _, calls = make(f, conn)
    poll(p)
    assert f.calls[0][1:3] == (c - REPORT_MAX_AGE_MS, NOW - 10_000)
    assert conn.execute("SELECT t, key FROM samples WHERE key='soc_percent'").fetchall() == [(report_t, "soc_percent")]


def test_entity_without_history_is_not_an_error_others_ingested():
    p, conn, _ = make(Fetch([r for r in FULL if r[0].get("entity_id") != ODO]))
    poll(p)
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 6


def test_fetch_error_keeps_cursor_and_retries(caplog):
    conn = connect(":memory:")
    poll(make(Fetch(FULL), conn)[0])
    before = db.cursors(conn, "car1", SID)
    with caplog.at_level(logging.ERROR):
        poll(make(Fetch(error=OSError("down")), conn)[0])
    assert db.cursors(conn, "car1", SID) == before and "down" in caplog.text
    f = Fetch(FULL[:2] + [rows(ODO, (T, "1000"), (T + 900_000, "1005"))] + FULL[3:])
    poll(make(f, conn)[0])
    assert db.cursors(conn, "car1", SID)[ODO] == T + 900_000


def test_cursor_moves_past_skipped_rows_without_ingesting():
    p, conn, calls = make(Fetch([rows(SOC, (T, "unavailable"))]))
    poll(p)
    assert db.cursors(conn, "car1", SID) == {SOC: T}
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 0 and calls == [("car1", [], NOW, NOW - 10_000)]


def test_run_polls_repeatedly_until_cancelled():
    f = Fetch()
    p, _, _ = make(f)

    async def go():
        t = asyncio.create_task(p.run(0.01))
        await asyncio.sleep(0.1)
        t.cancel()
        with pytest.raises(asyncio.CancelledError):
            await t

    asyncio.run(go())
    assert len(f.calls) >= 2


def test_quiet_car_is_not_reingested_from_the_start_time_state():
    allrows = {r[0]["entity_id"]: [(x, r_["state"]) for x, r_ in zip([T, T + 600_000][:len(r)], r)] for r in FULL}

    def ha(ids, start, end, attr_ids):  # like HA: the state at `start` stamped `start`, then the rows inside the window
        out = []
        for eid in ids:
            hist = allrows.get(eid, [])
            before = [st for t, st in hist if t <= start]
            inside = [(t, st) for t, st in hist if start < t <= end]
            r = ([(start, before[-1])] if before else []) + inside
            if r:
                out.append(rows(eid, *r))
        return out

    p, conn, calls = make(ha)
    poll(p)
    n = conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0]
    calls.clear()
    poll(p)
    poll(p)
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == n and all(c[1] == [] for c in calls)


def test_polled_is_called_without_new_samples_with_the_horizon():
    p, conn, calls = make(Fetch([]))
    poll(p)
    assert calls == [("car1", [], NOW, NOW - 10_000)]


def test_failed_fetch_calls_nothing():
    p, conn, calls = make(Fetch(error=OSError("down")))
    poll(p)
    assert calls == []


def test_car_app_vehicle_does_not_poll_ignored_readings():
    conf = SourceConf("car1", SID, {**ENTITIES, "speed": "rid-spd", "location": "rid-loc"}, True)
    f = Fetch(FULL)
    poll(make(f, conf=conf)[0])
    assert set(f.calls[0][0]) == {CHARGE, SOC, ODO, PLUG, REPORT} and f.calls[0][3] == []


def test_other_vehicle_polls_speed_and_location_with_attributes():
    conf = SourceConf("car1", SID, {**ENTITIES, "speed": "rid-spd", "location": "rid-loc"}, False)
    f = Fetch(FULL)
    poll(make(f, conf=conf)[0])
    assert set(f.calls[0][0]) == {CHARGE, SOC, ODO, PLUG, REPORT, SPEED, LOC} and f.calls[0][3] == [LOC]


def test_first_poll_reports_nothing_missing():
    missing = []
    p, _, _ = make(Fetch(), missing=missing)
    poll(p)
    poll(p)
    assert missing == [("car1", [])]


def test_missing_optional_reading_is_reported_once_and_the_rest_polled():
    missing, f = [], Fetch(FULL)
    p, conn, calls = make(f, res={k: v for k, v in RES.items() if k != "rid-ps"}, missing=missing)
    poll(p)
    poll(p)
    assert missing == [("car1", ["plugged"])]
    assert PLUG not in f.calls[0][0] and conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 5


def test_missing_required_reading_pauses_the_source_until_it_is_back():
    missing, f, res = [], Fetch(FULL), {k: v for k, v in RES.items() if k != "rid-mil"}
    p, conn, calls = make(f, res=res, missing=missing)
    poll(p)
    assert missing == [("car1", ["odometer"])] and f.calls == [] and calls == []
    assert db.cursors(conn, "car1", SID) == {} and conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 0
    res["rid-mil"] = RES["rid-mil"]
    poll(p)
    assert missing == [("car1", ["odometer"]), ("car1", [])] and f.calls[0][1] == NOW - BACKFILL_MS and len(calls) == 1


def test_renamed_entity_does_not_reingest_history():
    conn, renamed = connect(":memory:"), "sensor.zoe_renamed"
    poll(make(Fetch(FULL), conn)[0])
    f = Fetch([rows(renamed, (T, "50"), (T + 600_000, "55"), (NOW - 60_000, "60"))])
    poll(make(f, conn, res={**RES, "rid-bat": (renamed, "%")})[0])
    assert conn.execute("SELECT value_json FROM samples WHERE key='soc_percent' ORDER BY seq").fetchall() == [("50.0",), ("55.0",), ("60.0",)]
    assert db.cursors(conn, "car1", SID)[renamed] == NOW - 60_000


def test_set_conf_none_stops_polling():
    f = Fetch(FULL)
    p, _, calls = make(f)
    p.set_conf("car1", None)
    poll(p)
    assert f.calls == [] and calls == []


def test_bad_value_logged_once_per_hour(caplog):
    clock, f = [NOW], Fetch([rows(SOC, (NOW - 5_000, "abc"))])
    p, _, _ = make(f, clock=clock)
    warnings = lambda: len([r for r in caplog.records if SOC in r.getMessage() and r.levelno == logging.WARNING])
    with caplog.at_level(logging.WARNING):
        poll(p)
        clock[0], f.payload = NOW + 600_000, [rows(SOC, (NOW + 590_000, "abc"))]
        poll(p)
        assert warnings() == 1
        clock[0], f.payload = NOW + 3_700_000, [rows(SOC, (NOW + 3_690_000, "abc"))]
        poll(p)
        assert warnings() == 2
