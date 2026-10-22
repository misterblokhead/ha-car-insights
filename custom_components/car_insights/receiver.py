"""Pure helpers (no Home Assistant imports) so they can be tested standalone."""
import asyncio
import hashlib
import hmac
import json
from pathlib import Path

import aiohttp

_UNREACHABLE = (503, b'{"error":"addon unreachable"}')


def verify_signature(secret: str, body: bytes, header: str | None) -> bool:
    if not header or not header.startswith("sha256="):
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    given = header[len("sha256="):].encode("utf-8", "surrogateescape")  # bytes: str compare raises on non-ASCII
    return hmac.compare_digest(expected.encode(), given)


def body_vehicle_matches(body: bytes, vehicle_id: str) -> bool:
    """The X-CI-Vehicle header is not signed; the signed body's vehicle_id must match the entry."""
    try:
        return json.loads(body).get("vehicle_id") == vehicle_id
    except (ValueError, AttributeError):  # bad JSON/UTF-8, or a non-object body
        return False


def map_addon_status(status: int, body: bytes) -> tuple[int, bytes]:
    """Pass 200/400/413 through; anything else (e.g. an add-on 401) must not look like a car-side auth failure."""
    if status in (200, 400, 413):
        return status, body
    return 503, b'{"error":"addon error"}'


async def forward(session: aiohttp.ClientSession, addon_url: str, token: str, body: bytes) -> tuple[int, bytes]:
    try:
        async with session.post(
            f"{addon_url.rstrip('/')}/ingest",
            data=body,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            timeout=aiohttp.ClientTimeout(total=10),
        ) as resp:
            return resp.status, await resp.read()
    except (aiohttp.ClientError, asyncio.TimeoutError):
        return _UNREACHABLE


def read_token(path: Path) -> str | None:
    try:
        return path.read_text().strip() or None
    except OSError:
        return None


def is_https_url(url: str) -> bool:
    """The car only accepts https webhook URLs, so an http external URL must not produce a .conf."""
    return url.startswith("https://")


class TokenCache:
    """Keeps the add-on token in memory; call refresh() after the add-on rejects it (the token file was recreated)."""

    def __init__(self, path: Path):
        self._path = path
        self._token: str | None = None

    def get(self) -> str | None:
        if self._token is None:
            self._token = read_token(self._path)
        return self._token

    def refresh(self) -> str | None:
        self._token = None
        return self.get()


async def read_limited(content, limit: int) -> bytes | None:
    """Read a request stream, giving up (None) as soon as it exceeds limit instead of buffering it all.

    Only uses read(n): Nabu Casa-relayed webhooks arrive as HA's MockRequest, whose MockStreamReader has nothing else.
    """
    chunks, size = [], 0
    while chunk := await content.read(64 * 1024):
        size += len(chunk)
        if size > limit:
            return None
        chunks.append(chunk)
    return b"".join(chunks)


def config_file_text(webhook_url: str, secret: str, vehicle_id: str, vehicle_name: str) -> str:
    return f"webhook.url={webhook_url}\nsecret={secret}\nvehicle.id={vehicle_id}\nvehicle.name={vehicle_name}\n"
