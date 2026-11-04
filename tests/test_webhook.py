import asyncio
import hashlib
import hmac
import json
import threading
from pathlib import Path
from unittest.mock import patch

import pytest
from homeassistant.components import webhook
from homeassistant.config_entries import ConfigEntryState
from pytest_homeassistant_custom_component.common import MockConfigEntry

import custom_components.car_insights as integration
from custom_components.car_insights import receiver as r
from custom_components.car_insights.const import DOMAIN, MAX_BODY
from custom_components.car_insights.core.protocol import MAX_DEPTH
from custom_components.car_insights.service import Service

SECRET = "invented-secret-0123"
WEBHOOK_ID = "invented_webhook_id"
URL = f"/api/webhook/{WEBHOOK_ID}"


def test_signature_vector():
    assert r.verify_signature("key", b"The quick brown fox jumps over the lazy dog", "sha256=f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8")


def test_signature_rejects():
    assert not r.verify_signature("key", b"x", "sha256=00")
    assert not r.verify_signature("key", b"x", None)
    assert not r.verify_signature("key", b"x", "f7bc83f4")


def test_config_file_text():
    assert r.config_file_text("https://h/api/webhook/x", "ab", "car1", "Car") == "webhook.url=https://h/api/webhook/x\nsecret=ab\nvehicle.id=car1\nvehicle.name=Car\n"


def test_signature_non_ascii_header():
    assert r.verify_signature("key", b"x", "sha256=é") is False


def test_body_vehicle_matches():
    assert r.body_vehicle_matches(b'{"vehicle_id":"car1","samples":[]}', "car1")
    assert not r.body_vehicle_matches(b'{"vehicle_id":"car2"}', "car1")
    assert not r.body_vehicle_matches(b"{}", "car1")
    assert not r.body_vehicle_matches(b"not json", "car1")
    assert not r.body_vehicle_matches(b"[1]", "car1")
    assert not r.body_vehicle_matches(b"\xff\xfe", "car1")


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
    deep = lambda n: b'{"vehicle_id":"megane","x":' + b'[' * n + b']' * n + b'}'  # nests n + 1 levels
    assert r.body_vehicle_matches(deep(MAX_DEPTH - 1), "megane")
    for n in (MAX_DEPTH, 100_000):  # the cap rejects it, whatever the stack would allow
        assert not r.body_vehicle_matches(deep(n), "megane")


def test_conf_with_url():
    text = "webhook.url=https://a\nsecret=s\nvehicle.id=v\n"
    assert r.conf_with_url(text, "https://b") == "webhook.url=https://b\nsecret=s\nvehicle.id=v\n"
    assert r.conf_with_url(text, "https://a") is None


def test_write_conf(tmp_path):
    p = tmp_path / "d" / "v.conf"
    text = r.config_file_text("https://a", "s", "v", "V")
    assert r.write_conf(p, text, "https://a") == "created"
    assert r.write_conf(p, text, "https://a") is None
    assert r.write_conf(p, text, "https://b") == "updated"
    assert p.read_text() == r.config_file_text("https://b", "s", "v", "V")
    p.write_text("junk")
    assert r.write_conf(p, text, "https://a") == "updated"
    assert p.read_text() == text
    assert [f.name for f in p.parent.iterdir()] == ["v.conf"]


def _body(vehicle="car1", samples=None):
    return json.dumps({"v": 1, "vehicle_id": vehicle, "source_id": "car_app-0000abcd",
                       "samples": [{"seq": 1, "t": 1_000, "k": "speed", "v": 1.0}] if samples is None else samples}).encode()


def _sign(body: bytes, secret=SECRET) -> str:
    return "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()


def _threads():
    return [t.name for t in threading.enumerate() if t.name.startswith("car-insights")]


def _entry(hass, **data):
    entry = MockConfigEntry(domain=DOMAIN, title="Invented car", data={
        "vehicle_id": "car1", "vehicle_name": "Invented car", "secret": SECRET, "webhook_id": WEBHOOK_ID, **data})
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def env(enable_custom_integrations, hass, monkeypatch):
    hass.config.external_url = "https://ci.example.test"
    monkeypatch.setattr(integration, "_last_warn", float("-inf"))


@pytest.fixture
async def client(hass, env, hass_client_no_auth):
    # addon_url: what an entry made before the integration took over still carries; it is ignored
    entry = _entry(hass, addon_url="http://legacy.invalid:8099")
    assert await hass.config_entries.async_setup(entry.entry_id)
    yield await hass_client_no_auth()
    await hass.config_entries.async_unload(entry.entry_id)
    assert DOMAIN not in hass.data and _threads() == []


async def _post(client, body: bytes, vehicle="car1", signature=None):
    headers = {"X-CI-Vehicle": vehicle, "X-CI-Signature": _sign(body) if signature is None else signature}
    return await client.post(URL, data=body, headers=headers)


async def test_signed_batch_is_stored_and_answered(hass, client):
    resp = await _post(client, _body())
    assert resp.status == 200
    out = await resp.json()
    assert out["acked_seq"] == 1 and "current_trip" in out
    assert (await (await _post(client, _body())).json())["acked_seq"] == 1  # a resend is acked, not stored twice


async def test_conf_file_in_config_dir(hass, client):
    conf = Path(hass.config.path("car_insights", "car1.conf"))
    assert conf.read_text() == r.config_file_text(f"https://ci.example.test{URL}", SECRET, "car1", "Invented car")


async def test_oversized_body_is_413(client):
    assert (await _post(client, b"x" * (MAX_BODY + 1))).status == 413


async def test_vehicle_header_mismatch_is_400(client):
    resp = await _post(client, _body(), vehicle="car2")
    assert resp.status == 400 and await resp.json() == {"error": "vehicle id mismatch"}


async def test_bad_signature_is_401_and_warned_once(client, caplog):
    assert (await _post(client, _body(), signature=_sign(_body(), "wrong"))).status == 401
    assert (await _post(client, _body(), signature="")).status == 401
    assert caplog.text.count("bad signature for vehicle car1") == 1  # rate limited


async def test_signed_body_for_another_vehicle_is_400(client):
    assert (await _post(client, _body(vehicle="car2"))).status == 400


async def test_malformed_batch_is_400_from_the_ingest(client):
    resp = await _post(client, b'{"vehicle_id": "car1"}')
    assert resp.status == 400 and "error" in await resp.json()


@pytest.mark.parametrize("exc", [RuntimeError("worker is stopped"), asyncio.CancelledError()])
async def test_stopping_service_is_503(client, exc, caplog):
    async def boom(self, body, received):
        raise exc

    with patch.object(Service, "ingest", boom):
        assert (await _post(client, _body())).status == 503
    assert "stopping" in caplog.text


async def test_stopped_worker_is_503(hass, client):
    await hass.async_add_executor_job(hass.data[DOMAIN]._close)  # what HA stopping does
    assert (await _post(client, _body())).status == 503


async def test_unexpected_error_is_500_with_traceback(client, caplog):
    async def boom(self, body, received):
        raise ValueError("invented failure")

    with patch.object(Service, "ingest", boom):
        assert (await _post(client, _body())).status == 500
    assert "invented failure" in caplog.text


async def test_failed_register_releases_the_service(hass, env):
    entry = _entry(hass)
    with patch.object(webhook, "async_register", side_effect=ValueError("invented")):
        assert not await hass.config_entries.async_setup(entry.entry_id)
    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert DOMAIN not in hass.data and _threads() == []


async def test_remove_entry_deletes_the_conf(hass, env):
    entry = _entry(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    conf = Path(hass.config.path("car_insights", "car1.conf"))
    assert conf.exists()
    await hass.config_entries.async_remove(entry.entry_id)
    assert not conf.exists() and _threads() == []


async def test_the_first_bad_signature_is_warned_whatever_the_uptime(caplog, monkeypatch):
    monkeypatch.setattr(integration, "_last_warn", float("-inf"))  # what a fresh start holds
    monkeypatch.setattr(integration.time, "monotonic", lambda: 5.0)  # five seconds after boot
    integration._warn_bad_signature("car1")
    assert "bad signature for vehicle car1" in caplog.text
