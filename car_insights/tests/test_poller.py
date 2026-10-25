import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from functools import partial

import pytest

from car_insights import db, summary
from car_insights.derive import Deriver
from car_insights.pipeline import App, ingested
from car_insights.totals_sensors import TotalsSensors
from car_insights.trip_sensors import TripSensors
from car_insights.db import connect
from car_insights.protocol import Sample
from car_insights.poller import BACKFILL_MS, Poller, SourceConf, source_id
from car_insights.ha_entities import MAPPINGS, REPORT_MAX_AGE_MS, entity_ids
from conftest import FakeMqtt, ms

NOW = ms("2026-10-23T12:00:00+00:00")
CONF = SourceConf("car1", "renault", "zoe")
SID = source_id(CONF)
IDS = entity_ids(MAPPINGS["renault"], "zoe")
CHARGE, SOC, ODO, PLUG, REPORT = IDS


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

    def __call__(self, ids, start, end):
        self.calls.append((ids, start, end))
        if self.error:
            raise self.error
        return self.payload


T = NOW - 3_600_000
FULL = [rows(CHARGE, (T, "charge_in_progress"), (T + 600_000, "charge_ended")), rows(SOC, (T, "50"), (T + 600_000, "55")),
        rows(ODO, (T, "1000")), rows(PLUG, (T, "plugged"), (T + 600_000, "unplugged")), rows(REPORT, (T - 1000, iso(T - 30_000)), (T + 599_000, iso(T + 570_000)))]


def make(fetch, conn=None):
    calls = []
    conn = conn or connect(":memory:")
    p = Poller(conn, [CONF], fetch, lambda *a: calls.append(a), lambda: NOW)
    return p, conn, calls


def poll(p):
    asyncio.run(p.poll_once())


def test_source_id_is_stable_hash_of_mapping_and_stem():
    assert SID == "ha_entities-" + hashlib.sha1(b"renault:zoe").hexdigest()[:8]


def test_first_poll_backfills_ten_days_and_ends_ten_seconds_ago():
    f = Fetch()
    poll(make(f)[0])
    assert f.calls == [(IDS, NOW - BACKFILL_MS, NOW - 10_000)]


def test_first_poll_ingests_samples_and_notifies():
    p, conn, calls = make(Fetch(FULL))
    poll(p)
    got = conn.execute("SELECT t, key, value_json FROM samples WHERE source_id=? ORDER BY seq", (SID,)).fetchall()
    assert got == [(T - 30_000, "charging_state", "true"), (T - 30_000, "soc_percent", "50.0"), (T, "odometer_km", "1000.0"),
                   (T, "plug_state", "true"), (T + 570_000, "charging_state", "false"), (T + 570_000, "soc_percent", "55.0"),
                   (T + 600_000, "plug_state", "false")]
    assert calls == [("car1", T - 30_000, NOW)]


def test_poller_calls_ingested_only(monkeypatch):
    conn = connect(":memory:")
    d = Deriver(conn, lambda la, lo: None)
    app = App(conn, d, TripSensors(conn, FakeMqtt(), lambda vid: 57_000.0), TotalsSensors(conn, FakeMqtt(), timezone.utc), timezone.utc,
              lambda vid: 57_000.0, lambda la, lo: None, lambda la, lo: None)
    built = []
    monkeypatch.setattr(summary, "build", lambda *a, **k: built.append(1))
    p = Poller(conn, [CONF], Fetch(FULL), partial(ingested, app), lambda: NOW)
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
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 7 and calls == []
    assert f.calls[1] == (IDS, NOW - REPORT_MAX_AGE_MS, NOW - 10_000)


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
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 7 and calls == []


def test_report_time_row_older_than_the_metric_cursor_is_still_found():
    conn = connect(":memory:")
    c = T + 3_000_000
    poll(make(Fetch([rows(ODO, (c, "1000"))]), conn)[0])  # cursor: only the odometer, at c
    report_t = c - 1_200_000  # the cloud's report time, 20 min before the cursor
    f = Fetch([rows(ODO, (c, "1000")), rows(REPORT, (report_t + 1000, iso(report_t))), rows(SOC, (c + 60_000, "70"))])
    p, _, calls = make(f, conn)
    poll(p)
    assert f.calls[0][1:] == (c - REPORT_MAX_AGE_MS, NOW - 10_000)
    assert conn.execute("SELECT t, key FROM samples WHERE key='soc_percent'").fetchall() == [(report_t, "soc_percent")]


def test_missing_entity_logged_once_others_ingested(caplog):
    f = Fetch([r for r in FULL if r[0].get("entity_id") != ODO])
    p, conn, _ = make(f)
    with caplog.at_level(logging.WARNING):
        poll(p)
        poll(p)
    msgs = [r.getMessage() for r in caplog.records if ODO in r.getMessage()]
    assert len(msgs) == 1
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
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 0 and calls == []


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

    def ha(ids, start, end):  # like HA: the state at `start` stamped `start`, then the rows inside the window
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
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == n and calls == []
