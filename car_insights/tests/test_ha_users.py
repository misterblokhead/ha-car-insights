import asyncio
import json
import logging
import threading
from contextlib import contextmanager

import pytest
from websockets.sync.server import serve

from car_insights import ha_users
from car_insights.ha_users import AdminCache

USERS = [{"id": "u-admin", "group_ids": ["system-users", "system-admin"]}, {"id": "u-viewer", "group_ids": ["system-users"]},
         {"id": "u-nogroups"}]


@contextmanager
def fake_core(script):
    """A websocket server running script(ws, received) per connection; yields its url and what it received."""
    received = []
    with serve(lambda ws: script(ws, received), "127.0.0.1", 0) as server:
        threading.Thread(target=server.serve_forever, daemon=True).start()
        yield f"ws://127.0.0.1:{server.socket.getsockname()[1]}", received
        server.shutdown()


def happy(ws, received, auth_reply="auth_ok", result=None):
    ws.send(json.dumps({"type": "auth_required", "ha_version": "2026.10.0"}))
    received.append(json.loads(ws.recv()))
    ws.send(json.dumps({"type": auth_reply}))
    if auth_reply == "auth_ok":
        received.append(json.loads(ws.recv()))
        ws.send(json.dumps(result or {"id": 1, "type": "result", "success": True, "result": USERS}))


def test_fetch_users_sends_auth_then_list_and_returns_result():
    with fake_core(happy) as (url, received):
        assert ha_users.fetch_users("tok", url) == USERS
    assert received == [{"type": "auth", "access_token": "tok"}, {"id": 1, "type": "config/auth/list"}]


@pytest.mark.parametrize("script", [
    lambda ws, r: happy(ws, r, auth_reply="auth_invalid"),
    lambda ws, r: happy(ws, r, result={"id": 1, "type": "result", "success": False, "error": {"code": "unauthorized"}}),
    lambda ws, r: happy(ws, r, result={"id": 1, "type": "result", "success": True, "result": {"not": "a list"}}),
    lambda ws, r: happy(ws, r, result={"id": 2, "type": "result", "success": True, "result": USERS}),
    lambda ws, r: ws.send("not json"),
    lambda ws, r: ws.send(json.dumps({"type": "pong"})),
])
def test_fetch_users_raises_on_anything_unexpected(script):
    with fake_core(script) as (url, _):
        with pytest.raises(Exception):
            ha_users.fetch_users("tok", url)


def test_fetch_users_times_out_on_a_silent_server(monkeypatch):
    monkeypatch.setattr(ha_users, "TIMEOUT_S", 0.3)
    with fake_core(lambda ws, r: ws.recv()) as (url, _):  # never sends auth_required
        with pytest.raises(Exception):
            ha_users.fetch_users("tok", url)


class Clock:
    t = 1_000_000


def cache(fetch, clock):
    return AdminCache(fetch, ttl_ms=60_000, now_ms=lambda: clock.t)


def test_admin_cache_admin_only_with_system_admin_group():
    c = cache(lambda: USERS, Clock())
    assert asyncio.run(c.is_admin("u-admin")) is True
    assert [asyncio.run(c.is_admin(u)) for u in ("u-viewer", "u-nogroups", "u-unknown", "")] == [False] * 4


def test_admin_cache_fetches_once_per_ttl():
    clock, calls = Clock(), []
    c = cache(lambda: calls.append(1) or USERS, clock)
    assert asyncio.run(c.is_admin("u-admin")) and asyncio.run(c.is_admin("u-admin"))
    assert len(calls) == 1
    clock.t += 59_999
    asyncio.run(c.is_admin("u-admin"))
    assert len(calls) == 1
    clock.t += 1
    asyncio.run(c.is_admin("u-admin"))
    assert len(calls) == 2


def test_admin_cache_demotion_takes_effect_after_ttl():
    clock, users = Clock(), [dict(USERS[0])]
    c = cache(lambda: users, clock)
    assert asyncio.run(c.is_admin("u-admin")) is True
    users[0] = {"id": "u-admin", "group_ids": ["system-users"]}
    clock.t += 60_000
    assert asyncio.run(c.is_admin("u-admin")) is False


def test_admin_cache_fails_closed_and_logs_once_per_ttl(caplog):
    clock, calls = Clock(), []

    def boom():
        calls.append(1)
        raise OSError("core down")
    c = cache(boom, clock)
    with caplog.at_level(logging.WARNING):
        assert [asyncio.run(c.is_admin("u-admin")) for _ in range(3)] == [False] * 3
    assert len(calls) == 1 and len(caplog.records) == 1  # no retry (and no 10 s wait per request) inside the ttl
    clock.t += 60_000
    assert asyncio.run(c.is_admin("u-admin")) is False
    assert len(calls) == 2


def test_admin_cache_keeps_old_list_only_while_younger_than_ten_ttl():
    clock, ok = Clock(), [True]

    def fetch():
        if ok[0]:
            return USERS
        raise OSError("core down")
    c = cache(fetch, clock)
    assert asyncio.run(c.is_admin("u-admin")) is True
    ok[0] = False
    clock.t += 60_000  # the refetch fails: the list is 1 ttl old, still used
    assert asyncio.run(c.is_admin("u-admin")) is True
    clock.t += 9 * 60_000 - 1  # 10 ttl minus 1 ms old
    assert asyncio.run(c.is_admin("u-admin")) is True
    clock.t += 1
    assert asyncio.run(c.is_admin("u-admin")) is False


def test_admin_cache_ignores_malformed_entries():
    c = cache(lambda: [{"group_ids": ["system-admin"]}, "junk", {"id": "u-admin", "group_ids": "system-admin"}], Clock())
    assert asyncio.run(c.is_admin("u-admin")) is False
