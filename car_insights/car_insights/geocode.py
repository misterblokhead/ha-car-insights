"""Looks up the address of every unnamed point at Nominatim (OpenStreetMap), one at a time, and keeps the answers in `addresses`."""
import asyncio
import json
import logging
import os
import urllib.request
from typing import Callable

from . import store

log = logging.getLogger(__name__)
SPACING_S = 15  # Nominatim's usage policy for a scheduled job allows 4 requests a minute
IDLE_S = 60
BACKOFF_S = 3600
_URL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={}&lon={}&zoom=18&addressdetails=1"
_ROADS = ("road", "pedestrian", "footway", "cycleway", "path")
_TOWNS = ("city", "town", "village", "hamlet", "municipality")


def _first(address: dict, keys: tuple[str, ...]) -> str | None:
    return next((address[k] for k in keys if address.get(k)), None)


def label(answer: dict) -> str | None:
    """"Kerkstraat 12, Utrecht" from a reverse answer: the road and number, else the place's name, then the town; None when nothing is usable."""
    address = answer.get("address")
    if not address:
        return None
    road = _first(address, _ROADS)
    town = _first(address, _TOWNS)
    street = road and (f"{road} {address['house_number']}" if address.get("house_number") else road) or answer.get("name")
    return ", ".join(p for p in (street if street != town else None, town) if p) or None  # a town's own name is no street


def fetch(lat: float, lon: float, language: str, timeout: float = 10) -> dict:
    """Nominatim's answer for a point; raises on a network error, a timeout or a status other than 200."""
    ua = f"ha-car-insights/{os.environ.get('CAR_INSIGHTS_VERSION') or 'dev'} (+https://github.com/misterblokhead/ha-car-insights)"
    req = urllib.request.Request(_URL.format(lat, lon), headers={"User-Agent": ua, "Accept-Language": language})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        if r.status != 200:
            raise OSError(f"Nominatim answered {r.status}")
        return json.loads(r.read())


async def run(conn, fetch: Callable[[float, float], dict], now_ms: Callable[[], int], sleep=asyncio.sleep) -> None:
    """Forever: look up the newest point without an address, wait SPACING_S; idle IDLE_S when none is left; BACKOFF_S after a failure."""
    while True:
        try:
            key = store.unaddressed(conn)
            if key is None:
                wait = IDLE_S
            else:
                answer = await asyncio.to_thread(fetch, key[0] / 10000, key[1] / 10000)  # off the loop: the DB stays on it
                store.save_address(conn, *key, label(answer), now_ms())
                wait = SPACING_S
        except Exception as err:  # never the coordinates: they are where the car has been
            log.warning("address lookup failed, retrying in %d s: %r", BACKOFF_S, err)
            wait = BACKOFF_S
        await sleep(wait)
