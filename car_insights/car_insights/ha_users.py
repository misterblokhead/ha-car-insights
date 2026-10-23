"""Who is a Home Assistant admin: read from Core's user list, never from request headers a client could forge."""
import asyncio
import json
import logging
import time
from typing import Callable

from websockets.sync.client import connect

log = logging.getLogger(__name__)

TIMEOUT_S = 10.0
ADMIN_GROUP = "system-admin"
CORE_URL = "ws://supervisor/core/websocket"


def fetch_users(token: str, url: str = CORE_URL) -> list[dict]:
    """Core's user list (config/auth/list, as the Supervisor itself reads it). Blocking: run it off the event loop.
    Raises on a refused auth, a failed command, or anything out of protocol."""
    deadline = time.monotonic() + TIMEOUT_S

    def left() -> float:
        return max(deadline - time.monotonic(), 0.001)

    with connect(url, open_timeout=left(), close_timeout=1) as ws:
        def recv() -> dict:
            msg = json.loads(ws.recv(timeout=left()))
            if not isinstance(msg, dict):
                raise ValueError("unexpected message")
            return msg

        if recv().get("type") != "auth_required":
            raise ValueError("no auth_required from Core")
        ws.send(json.dumps({"type": "auth", "access_token": token}))
        if recv().get("type") != "auth_ok":
            raise ValueError("Core refused the token")
        ws.send(json.dumps({"id": 1, "type": "config/auth/list"}))
        msg = recv()
        if msg.get("id") != 1 or msg.get("type") != "result" or msg.get("success") is not True or not isinstance(msg.get("result"), list):
            raise ValueError("config/auth/list failed")
        return msg["result"]


class AdminCache:
    """is_admin(user_id) from the fetched user list, cached for ttl_ms. Fails closed: when the list cannot be fetched nobody is
    an admin, except by a previous list that is younger than 10 x ttl."""

    def __init__(self, fetch: Callable[[], list[dict]], ttl_ms: int = 60_000, now_ms: Callable[[], int] = lambda: int(time.time() * 1000)):
        self._fetch, self._ttl, self._now_ms = fetch, ttl_ms, now_ms
        self._admins: set[str] = set()
        self._ok_at: int | None = None  # when _admins was fetched
        self._tried_at: int | None = None  # the last attempt, failed or not: the next one waits a ttl
        self._lock = asyncio.Lock()

    async def is_admin(self, user_id: str) -> bool:
        async with self._lock:  # one fetch at a time, and a burst of requests shares its outcome
            now = self._now_ms()
            if self._tried_at is None or now - self._tried_at >= self._ttl:
                self._tried_at = now
                try:
                    users = await asyncio.to_thread(self._fetch)
                    self._admins = {u["id"] for u in users if isinstance(u, dict) and isinstance(u.get("id"), str)
                                    and isinstance(u.get("group_ids"), list) and ADMIN_GROUP in u["group_ids"]}
                    self._ok_at = now
                except Exception as e:
                    log.warning("cannot read the Home Assistant user list, nobody is admin until it works: %s", e)
            fresh = self._ok_at is not None and now - self._ok_at < 10 * self._ttl
            return fresh and user_id in self._admins
