import asyncio
import json

import pytest
from fastapi.testclient import TestClient

from car_insights.api import create_app
from car_insights.db import connect
from car_insights.pipeline import late_min_t
from car_insights.protocol import FUTURE_SLACK_MS, Sample

TOKEN = "t" * 64
AUTH = {"Authorization": f"Bearer {TOKEN}"}
VALID = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1, "k": "speed", "v": 1.0}]}).encode()


def make(on_ingested=None, ingested=None, reply=None):
    calls = []
    def default(vid, samples, ms):
        calls.append((vid, samples, ms))
    return TestClient(create_app(connect(":memory:"), TOKEN, on_ingested or default, lambda: 1000, ingested=ingested, reply=reply)), calls


@pytest.fixture
def client():
    return make()[0]


def test_health(client):
    assert client.get("/health").json() == {"ok": True}


def test_rejects_missing_token(client):
    assert client.post("/ingest", content=VALID).status_code == 401


def test_rejects_wrong_token(client):
    assert client.post("/ingest", content=VALID, headers={"Authorization": "Bearer nope"}).status_code == 401


def test_rejects_bad_body(client):
    r = client.post("/ingest", content=b"{}", headers=AUTH)
    assert r.status_code == 400 and "error" in r.json()


def test_rejects_oversize_body(client):
    assert client.post("/ingest", content=b"x" * (1024 * 1024 + 1), headers=AUTH).status_code == 413


def test_acks_and_notifies():
    c, calls = make()
    assert c.post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1}
    assert calls[0][0] == "car1" and calls[0][2] == 1000


def test_notify_failure_still_acks():
    def boom(*a):
        raise RuntimeError("x")
    assert make(boom)[0].post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1}


def test_ingest_failure_is_500(monkeypatch):
    import car_insights.api as api
    monkeypatch.setattr(api, "ingest", lambda *a: 1 / 0)
    assert make()[0].post("/ingest", content=VALID, headers=AUTH).status_code == 500


def test_empty_token_refused():
    with pytest.raises(ValueError):
        create_app(connect(":memory:"), "", lambda *a: None)


def body(**over):
    d = {"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd", "samples": [{"seq": 1, "t": 7, "k": "speed", "v": 1.0}]}
    d.update(over)
    return json.dumps(d).encode()


def test_response_includes_summary_when_rev_differs():
    seen = []
    def ingested(vid, min_t, received):
        seen.append((vid, min_t, received))
    c, _ = make(ingested=ingested, reply=lambda vid, received: (None, {"rev": "r2"}))
    assert c.post("/ingest", content=body(summary_rev="r1"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}}
    assert c.post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}}  # no rev sent
    assert seen[0] == ("car1", 7, 1000)


def test_current_trip_on_every_ack_summary_only_when_rev_differs():
    cur = {"start": 5, "end": None, "distance_m": 1.0}
    c, _ = make(reply=lambda *a: (cur, {"rev": "r1"}))
    assert c.post("/ingest", content=body(summary_rev="r1"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": cur}
    assert c.post("/ingest", content=body(summary_rev="old"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": cur, "summary": {"rev": "r1"}}


def test_empty_batch_returns_summary():
    seen = []
    conn = connect(":memory:")
    c = TestClient(create_app(conn, TOKEN, lambda *a: None, lambda: 1000, ingested=lambda v, m, r: seen.append(m), reply=lambda v, r: (None, {"rev": "r"})))
    assert c.post("/ingest", content=VALID, headers=AUTH).json()["acked_seq"] == 1
    r = c.post("/ingest", content=body(samples=[]), headers=AUTH)
    assert r.status_code == 200 and r.json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}}
    assert seen[-1] is None
    assert conn.execute("SELECT count(*) FROM gaps").fetchone()[0] == 0


def boom(*a):
    raise RuntimeError("x")


def test_reply_error_still_acks():
    assert make(reply=boom)[0].post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1}


def test_failing_ingested_is_logged_and_reply_still_answers(caplog):
    c, _ = make(ingested=boom, reply=lambda *a: (None, {"rev": "r"}))
    assert c.post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}}
    assert "ingested failed" in caplog.text


def test_reply_runs_after_ingested():
    order = []
    c, _ = make(on_ingested=lambda *a: order.append("on_ingested"), ingested=lambda *a: order.append("ingested"),
                reply=lambda *a: order.append("reply") or (None, {"rev": "r"}))
    c.post("/ingest", content=VALID, headers=AUTH)
    assert order == ["on_ingested", "ingested", "reply"]


def test_ingested_gets_late_min_t():
    seen = []
    c = make(ingested=lambda v, m, r: seen.append(m))[0]
    c.post("/ingest", content=body(samples=[{"seq": 1, "t": 1, "k": "speed", "v": 1.0}, {"seq": 2, "t": 999, "k": "speed", "v": 1.0}]), headers=AUTH)
    assert seen == [1]  # received is 1000: both are inside the window


def test_late_min_t_ignores_bogus_timestamps():
    received = 100 * 86_400_000
    def at(*ts):
        return late_min_t([Sample(i + 1, t, "speed", 1.0) for i, t in enumerate(ts)], received)
    assert at(1, received - 1000, received + 2 * 86_400_000) == received - 1000  # a clock-reset sample, a good one, a far-future one
    assert at(1, received + 2 * 86_400_000) is None
    assert at(received - 31 * 86_400_000, received + FUTURE_SLACK_MS) == received - 31 * 86_400_000  # exactly at both limits
    assert at(received - 31 * 86_400_000 - 1) is None and at(received + FUTURE_SLACK_MS + 1) is None
