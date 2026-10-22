import json

import pytest
from fastapi.testclient import TestClient

from car_insights.api import create_app
from car_insights.db import connect

TOKEN = "t" * 64
AUTH = {"Authorization": f"Bearer {TOKEN}"}
VALID = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1, "k": "speed", "v": 1.0}]}).encode()


def make(on_ingested=None, summarize=None):
    calls = []
    def default(vid, samples, ms):
        calls.append((vid, samples, ms))
    return TestClient(create_app(connect(":memory:"), TOKEN, on_ingested or default, lambda: 1000, summarize=summarize)), calls


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
    def summarize(vid, min_t, received):
        seen.append((vid, min_t, received))
        return None, {"rev": "r2"}
    c, _ = make(summarize=summarize)
    assert c.post("/ingest", content=body(summary_rev="r1"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}}
    assert c.post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}}  # no rev sent
    assert seen[0] == ("car1", 7, 1000)


def test_current_trip_on_every_ack_summary_only_when_rev_differs():
    cur = {"start": 5, "end": None, "distance_m": 1.0}
    c, _ = make(summarize=lambda *a: (cur, {"rev": "r1"}))
    assert c.post("/ingest", content=body(summary_rev="r1"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": cur}
    assert c.post("/ingest", content=body(summary_rev="old"), headers=AUTH).json() == {"acked_seq": 1, "current_trip": cur, "summary": {"rev": "r1"}}


def test_response_omits_both_when_summarize_gives_none():
    c, _ = make(summarize=lambda *a: None)
    assert c.post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1}


def test_empty_batch_returns_summary():
    seen = []
    def summarize(vid, min_t, received):
        seen.append(min_t)
        return None, {"rev": "r"}
    conn = connect(":memory:")
    c = TestClient(create_app(conn, TOKEN, lambda *a: None, lambda: 1000, summarize=summarize))
    assert c.post("/ingest", content=VALID, headers=AUTH).json()["acked_seq"] == 1
    r = c.post("/ingest", content=body(samples=[]), headers=AUTH)
    assert r.status_code == 200 and r.json() == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}}
    assert seen[-1] is None
    assert conn.execute("SELECT count(*) FROM gaps").fetchone()[0] == 0


def test_summarize_error_still_acks():
    def boom(*a):
        raise RuntimeError("x")
    assert make(summarize=boom)[0].post("/ingest", content=VALID, headers=AUTH).json() == {"acked_seq": 1}


def test_summarize_runs_after_on_ingested():
    order = []
    c, _ = make(on_ingested=lambda *a: order.append("ingested"), summarize=lambda *a: order.append("summarize"))
    c.post("/ingest", content=VALID, headers=AUTH)
    assert order == ["ingested", "summarize"]


def test_summarize_min_t_ignores_bogus_timestamps():
    seen = []
    received = 100 * 86_400_000
    c = TestClient(create_app(connect(":memory:"), TOKEN, lambda *a: None, lambda: received, summarize=lambda v, m, r: seen.append(m)))
    def post(*ts):
        samples = [{"seq": i + 1, "t": t, "k": "speed", "v": 1.0} for i, t in enumerate(ts)]
        c.post("/ingest", content=body(samples=samples), headers=AUTH)
    post(1, received - 1000, received + 2 * 86_400_000)  # a clock-reset sample, a good one, a far-future one
    post(1, received + 2 * 86_400_000)
    post(received - 31 * 86_400_000, received + 86_400_000)  # exactly at both limits
    assert seen == [received - 1000, None, received - 31 * 86_400_000]
