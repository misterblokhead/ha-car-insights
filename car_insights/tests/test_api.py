import json

import pytest
from fastapi.testclient import TestClient

from car_insights.api import create_app
from car_insights.db import connect

TOKEN = "t" * 64
AUTH = {"Authorization": f"Bearer {TOKEN}"}
VALID = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1, "k": "speed", "v": 1.0}]}).encode()


def make(on_ingested=None):
    calls = []
    def default(vid, samples, ms):
        calls.append((vid, samples, ms))
    return TestClient(create_app(connect(":memory:"), TOKEN, on_ingested or default, lambda: 1000)), calls


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
