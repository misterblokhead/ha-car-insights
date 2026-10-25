import asyncio
import io
import json
import logging
import time
import urllib.error
from pathlib import Path

import pytest

from car_insights import db, geocode
from conftest import seed_charge, seed_trip

ANSWERS = Path(__file__).parent / "nominatim"


def answer(name: str) -> dict:
    return json.loads((ANSWERS / f"{name}.json").read_text())


@pytest.mark.parametrize("name, text", [
    ("house", "Teststraat 12, Teststad"),
    ("footpath", "Voorbeeldpad, Voorbeelddorp"),
    ("carpark", "Parkeerterrein Proef, Voorbeelddorp"),
    ("municipality", "Gemeente Proef"),
    ("error", None),
    ("empty", None),
])
def test_label_of_saved_answers(name, text):
    assert geocode.label(answer(name)) == text


@pytest.mark.parametrize("address, text", [
    ({"road": "Kerkstraat", "house_number": "12", "city": "Utrecht"}, "Kerkstraat 12, Utrecht"),
    ({"road": "Kerkstraat", "town": "Utrecht"}, "Kerkstraat, Utrecht"),
    ({"pedestrian": "Kerkplein", "hamlet": "Dorp"}, "Kerkplein, Dorp"),
    ({"road": "Kerkstraat", "pedestrian": "Plein", "city": "A", "town": "B"}, "Kerkstraat, A"),  # the spec's order wins
    ({"road": "Kerkstraat", "house_number": "12"}, "Kerkstraat 12"),
    ({"house_number": "12", "city": "Utrecht"}, "Utrecht"),  # a number alone says nothing
    ({"country": "Nederland"}, None),
])
def test_label_orders_keys(address, text):
    assert geocode.label({"address": address}) == text


def test_label_without_road_uses_the_name_and_the_town():
    assert geocode.label({"name": "Winkel", "address": {"village": "Dorp"}}) == "Winkel, Dorp"
    assert geocode.label({"name": "Winkel", "address": {}}) is None


def run(conn, fetch, rounds):
    """geocode.run until `rounds` sleeps have happened; returns the sleeps"""
    sleeps = []

    async def sleep(s):
        sleeps.append(s)
        if len(sleeps) == rounds:
            raise asyncio.CancelledError

    with pytest.raises(asyncio.CancelledError):
        asyncio.run(geocode.run(conn, fetch, lambda: 99, sleep))
    return sleeps


def addresses(conn):
    return conn.execute("SELECT lat4, lon4, text, looked_up_ms FROM addresses ORDER BY lat4").fetchall()


def test_run_looks_up_newest_first_with_the_rounded_coordinates_then_idles():
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    seed_charge(conn, "car1", 30, 40, lat=51.4, lon=-4.5)
    asked = []

    def fetch(lat, lon):
        asked.append((lat, lon))
        return {"address": {"road": f"Weg{len(asked)}", "city": "Stad"}}

    assert run(conn, fetch, 3) == [geocode.SPACING_S, geocode.SPACING_S, geocode.IDLE_S]
    assert asked == [(51.4, -4.5), (51.2, 4.3)]
    assert addresses(conn) == [(512000, 43000, "Weg2, Stad", 99), (514000, -45000, "Weg1, Stad", 99)]


def test_run_backs_off_on_a_failure_and_stores_nothing(caplog):
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    calls = []

    def fetch(lat, lon):
        calls.append(1)
        raise urllib.error.HTTPError("https://x", 429, "Too Many Requests", {}, None)

    with caplog.at_level(logging.WARNING):
        assert run(conn, fetch, 2) == [geocode.BACKOFF_S, geocode.BACKOFF_S]
    assert len(calls) == 2 and addresses(conn) == []
    assert len(caplog.records) == 2 and "51.2" not in caplog.text and "4.3" not in caplog.text


def test_run_retries_after_the_backoff_and_goes_on():
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    answers = [OSError("down"), {"address": {"road": "Weg", "city": "Stad"}}]

    def fetch(lat, lon):
        a = answers.pop(0)
        if isinstance(a, Exception):
            raise a
        return a

    assert run(conn, fetch, 3) == [geocode.BACKOFF_S, geocode.SPACING_S, geocode.IDLE_S]
    assert addresses(conn) == [(512000, 43000, "Weg, Stad", 99)]


def test_run_stores_no_address_once_and_never_asks_again():
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    calls = []

    def fetch(lat, lon):
        calls.append(1)
        return answer("error")

    assert run(conn, fetch, 3) == [geocode.SPACING_S, geocode.IDLE_S, geocode.IDLE_S]
    assert len(calls) == 1 and addresses(conn) == [(512000, 43000, None, 99)]


def test_run_skips_named_points():
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3, place="Home")
    seed_trip(conn, "car1", 30, 40, from_lat=51.4, from_lon=4.5, **{"from": "Home"})

    def fetch(lat, lon):
        raise AssertionError("a named point is never looked up")

    assert run(conn, fetch, 1) == [geocode.IDLE_S]


def test_run_does_not_block_the_event_loop():
    conn = db.connect(":memory:")
    seed_charge(conn, "car1", 10, 20, lat=51.2, lon=4.3)
    ticks = []

    def fetch(lat, lon):
        time.sleep(0.3)
        return answer("house")

    async def stop(s):
        raise asyncio.CancelledError

    async def main():
        async def tick():
            while True:
                ticks.append(1)
                await asyncio.sleep(0.01)
        t = asyncio.create_task(tick())
        with pytest.raises(asyncio.CancelledError):
            await geocode.run(conn, fetch, lambda: 1, stop)
        t.cancel()

    asyncio.run(main())
    assert len(ticks) > 5


def _nominatim(monkeypatch, body=b"{}", status=200):
    seen = {}

    def urlopen(req, timeout):
        seen.update(url=req.full_url, ua=req.get_header("User-agent"), lang=req.get_header("Accept-language"), timeout=timeout)
        r = io.BytesIO(body)
        r.status = status
        return r

    monkeypatch.setattr("car_insights.geocode.urllib.request.urlopen", urlopen)
    return seen


def test_fetch_asks_nominatim_politely(monkeypatch):
    seen = _nominatim(monkeypatch, json.dumps(answer("house")).encode())
    monkeypatch.setenv("CAR_INSIGHTS_VERSION", "1.2.3")
    assert geocode.fetch(51.2, -4.3, "nl") == answer("house")
    assert seen == {"url": "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=51.2&lon=-4.3&zoom=18&addressdetails=1",
                    "ua": "ha-car-insights/1.2.3 (+https://github.com/misterblokhead/ha-car-insights)", "lang": "nl", "timeout": 10}


def test_fetch_user_agent_version_is_dev_when_unset(monkeypatch):
    seen = _nominatim(monkeypatch)
    monkeypatch.delenv("CAR_INSIGHTS_VERSION", raising=False)
    geocode.fetch(51.2, 4.3, "en")
    assert seen["ua"] == "ha-car-insights/dev (+https://github.com/misterblokhead/ha-car-insights)"


def test_fetch_raises_on_a_status_other_than_200(monkeypatch):
    _nominatim(monkeypatch, status=204)
    with pytest.raises(OSError):
        geocode.fetch(51.2, 4.3, "en")
