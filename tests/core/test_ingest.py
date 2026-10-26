import json
from types import SimpleNamespace

import pytest

from custom_components.car_insights.core import ingest as ing
from custom_components.car_insights.core.db import connect
from custom_components.car_insights.core.pipeline import late_min_t
from custom_components.car_insights.core.protocol import FUTURE_SLACK_MS, Sample

VALID = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1, "k": "speed", "v": 1.0}]}).encode()


def body(**over):
    d = {"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd", "samples": [{"seq": 1, "t": 7, "k": "speed", "v": 1.0}]}
    d.update(over)
    return json.dumps(d).encode()


def boom(*a):
    raise RuntimeError("x")


@pytest.fixture
def run(monkeypatch):
    """handle_batch over an in-memory database; ingested and reply are replaced, calls are recorded in `run.calls`."""
    def make(on_ingested=None, ingested=None, reply=None):
        calls = []
        app = SimpleNamespace(conn=connect(":memory:"))
        publisher = SimpleNamespace(on_ingested=on_ingested or (lambda vid, samples, ms: calls.append(("on_ingested", vid, ms))))
        monkeypatch.setattr(ing.pipeline, "ingested", ingested or (lambda a, vid, min_t, received: calls.append(("ingested", vid, min_t, received))))
        monkeypatch.setattr(ing.pipeline, "reply", reply or (lambda a, vid, received: (None, {"rev": "r"})))
        return lambda b, received=1000: ing.handle_batch(app, publisher, b, received), calls, app
    return make


def test_bad_body_is_400(run):
    status, out = run()[0](b"{}")
    assert status == 400 and "error" in out
    assert run()[0](b"not json")[0] == 400


def test_acks_and_notifies(run):
    handle, calls, _ = run(reply=lambda *a: (None, {"rev": "r"}))
    assert handle(VALID, 1000)[1]["acked_seq"] == 1
    assert calls[0] == ("on_ingested", "car1", 1000)


def test_notify_failure_still_acks(run):
    assert run(on_ingested=boom)[0](VALID) == (200, {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}})


def test_store_failure_is_500(run, monkeypatch):
    monkeypatch.setattr(ing.db, "ingest", lambda *a: 1 / 0)
    assert run()[0](VALID) == (500, {"error": "internal error"})


def test_response_includes_summary_when_rev_differs(run):
    handle, calls, _ = run(reply=lambda a, vid, received: (None, {"rev": "r2"}))
    assert handle(body(summary_rev="r1")) == (200, {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}})
    assert handle(VALID)[1] == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r2"}}  # no rev sent
    assert calls[1] == ("ingested", "car1", 7, 1000)


def test_current_trip_on_every_ack_summary_only_when_rev_differs(run):
    cur = {"start": 5, "end": None, "distance_m": 1.0}
    handle = run(reply=lambda *a: (cur, {"rev": "r1"}))[0]
    assert handle(body(summary_rev="r1"))[1] == {"acked_seq": 1, "current_trip": cur}
    assert handle(body(summary_rev="old"))[1] == {"acked_seq": 1, "current_trip": cur, "summary": {"rev": "r1"}}


def test_empty_batch_returns_summary(run):
    seen = []
    handle, _, app = run(ingested=lambda a, v, m, r: seen.append(m))
    assert handle(VALID)[1]["acked_seq"] == 1
    status, out = handle(body(samples=[]))
    assert status == 200 and out == {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}}
    assert seen[-1] is None
    assert app.conn.execute("SELECT count(*) FROM gaps").fetchone()[0] == 0


def test_reply_error_still_acks(run):
    assert run(reply=boom)[0](VALID) == (200, {"acked_seq": 1})


def test_failing_ingested_is_logged_and_reply_still_answers(run, caplog):
    handle = run(ingested=boom)[0]
    assert handle(VALID) == (200, {"acked_seq": 1, "current_trip": None, "summary": {"rev": "r"}})
    assert "ingested failed" in caplog.text


def test_reply_runs_after_ingested(run):
    order = []
    handle = run(on_ingested=lambda *a: order.append("on_ingested"), ingested=lambda *a: order.append("ingested"),
                 reply=lambda *a: order.append("reply") or (None, {"rev": "r"}))[0]
    handle(VALID)
    assert order == ["on_ingested", "ingested", "reply"]


def test_ingested_gets_late_min_t(run):
    seen = []
    handle = run(ingested=lambda a, v, m, r: seen.append(m))[0]
    handle(body(samples=[{"seq": 1, "t": 1, "k": "speed", "v": 1.0}, {"seq": 2, "t": 999, "k": "speed", "v": 1.0}]))
    assert seen == [1]  # received is 1000: both are inside the window


def test_late_min_t_ignores_bogus_timestamps():
    received = 100 * 86_400_000
    def at(*ts):
        return late_min_t([Sample(i + 1, t, "speed", 1.0) for i, t in enumerate(ts)], received)
    assert at(1, received - 1000, received + 2 * 86_400_000) == received - 1000  # a clock-reset sample, a good one, a far-future one
    assert at(1, received + 2 * 86_400_000) is None
    assert at(received - 31 * 86_400_000, received + FUTURE_SLACK_MS) == received - 31 * 86_400_000  # exactly at both limits
    assert at(received - 31 * 86_400_000 - 1) is None and at(received + FUTURE_SLACK_MS + 1) is None
