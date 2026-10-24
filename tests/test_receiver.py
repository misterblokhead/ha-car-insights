import importlib.util
from pathlib import Path

import aiohttp
from aiohttp import web
from aiohttp.test_utils import TestServer

_p = Path(__file__).parent.parent / "custom_components" / "car_insights" / "receiver.py"
_spec = importlib.util.spec_from_file_location("receiver", _p)
r = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(r)


def test_signature_vector():
    assert r.verify_signature("key", b"The quick brown fox jumps over the lazy dog", "sha256=f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8")


def test_signature_rejects():
    assert not r.verify_signature("key", b"x", "sha256=00")
    assert not r.verify_signature("key", b"x", None)
    assert not r.verify_signature("key", b"x", "f7bc83f4")


async def test_forward_passthrough():
    async def ingest(req):
        assert req.headers["Authorization"] == "Bearer tok"
        assert await req.read() == b"{}"
        return web.Response(status=201, body=b'{"acked_seq": 3}')

    app = web.Application()
    app.router.add_post("/ingest", ingest)
    async with TestServer(app) as srv, aiohttp.ClientSession() as s:
        url = f"http://127.0.0.1:{srv.port}"
        assert await r.forward(s, url, "tok", b"{}") == (201, b'{"acked_seq": 3}')


async def test_forward_unreachable():
    async with aiohttp.ClientSession() as s:
        status, _ = await r.forward(s, "http://127.0.0.1:9", "tok", b"{}")
    assert status == 503


def test_config_file_text():
    assert r.config_file_text("https://h/api/webhook/x", "ab", "car1", "Car") == "webhook.url=https://h/api/webhook/x\nsecret=ab\nvehicle.id=car1\nvehicle.name=Car\n"


def test_read_token(tmp_path):
    assert r.read_token(tmp_path / "nope") is None
    f = tmp_path / "t"
    f.write_text("abc\n")
    assert r.read_token(f) == "abc"
    f.write_text("\n")
    assert r.read_token(f) is None


def test_signature_non_ascii_header():
    assert r.verify_signature("key", b"x", "sha256=é") is False


def test_map_addon_status():
    for s in (200, 400, 413):
        assert r.map_addon_status(s, b"x") == (s, b"x")
    for s in (401, 500, 503):
        assert r.map_addon_status(s, b"x") == (503, b'{"error":"addon error"}')


def test_body_vehicle_matches():
    assert r.body_vehicle_matches(b'{"vehicle_id":"car1","samples":[]}', "car1")
    assert not r.body_vehicle_matches(b'{"vehicle_id":"car2"}', "car1")
    assert not r.body_vehicle_matches(b"{}", "car1")
    assert not r.body_vehicle_matches(b"not json", "car1")
    assert not r.body_vehicle_matches(b"[1]", "car1")
    assert not r.body_vehicle_matches(b"\xff\xfe", "car1")


def test_token_cache(tmp_path):
    f = tmp_path / "t"
    c = r.TokenCache(f)
    assert c.get() is None  # missing file is not cached
    f.write_text("a\n")
    assert c.get() == "a"
    f.write_text("b\n")
    assert c.get() == "a"  # cached, no reread
    assert c.refresh() == "b"
    f.unlink()
    assert c.refresh() is None


class _Reader:
    """Like HA's MockStreamReader: only read(n); honours n unless whole=True (returns everything at once)."""

    def __init__(self, data: bytes, whole: bool = False):
        self._data, self._whole = data, whole

    async def read(self, n=-1):
        if self._whole:
            n = -1
        out, self._data = (self._data, b"") if n < 0 else (self._data[:n], self._data[n:])
        return out


async def test_read_limited():
    assert await r.read_limited(_Reader(b"abcd"), 4) == b"abcd"
    assert await r.read_limited(_Reader(b"abcde"), 4) is None
    assert await r.read_limited(_Reader(b""), 4) == b""
    big = b"x" * (200 * 1024)  # spans several 64 KB reads
    assert await r.read_limited(_Reader(big), len(big)) == big
    assert await r.read_limited(_Reader(big), len(big) - 1) is None


async def test_read_limited_reader_ignoring_byte_count():
    assert await r.read_limited(_Reader(b"abcd", whole=True), 4) == b"abcd"
    assert await r.read_limited(_Reader(b"abcde", whole=True), 4) is None


def test_is_https_url():
    assert r.is_https_url("https://x.ui.nabu.casa/api/webhook/abc")
    assert not r.is_https_url("http://example.com:8123/api/webhook/abc")
    assert not r.is_https_url("")


def test_deep_json_does_not_match():
    assert not r.body_vehicle_matches(b'[' * 5000 + b']' * 5000, "megane")
