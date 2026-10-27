"""the HA entities source: maps an HA car integration's entities to samples (history rows -> (t, key, value))"""
import math
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

_EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)
_MS = timedelta(milliseconds=1)
_SKIP = {"unknown", "unavailable", ""}
REPORT_LEAD_MS = 5000  # the report-time entity changes within seconds of the metric it stamps
REPORT_MAX_AGE_MS = 1_800_000  # an older report time is stale: use the poll time


def _iso_ms(s: str) -> int:
    """epoch ms of an ISO time with offset; ValueError when malformed or naive"""
    d = datetime.fromisoformat(s)
    if d.tzinfo is None:
        raise ValueError("no offset")
    return (d - _EPOCH) // _MS


IGNITION_ON, IGNITION_OFF = 4, 2  # the car app's ignition codes
REQUIRED = ("charge_level", "odometer")
REPORT_STAMPED = frozenset({"charge_level", "charging"})
CAR_APP_IGNORED = frozenset({"speed", "location", "ignition", "battery_energy", "range"})  # the car app already sends these
# 1.0.0 entity ids of the HA car integrations that had a fixed mapping
LEGACY: dict[str, dict[str, str]] = {"renault": {
    "charging": "sensor.{stem}_charge_state", "charge_level": "sensor.{stem}_battery", "odometer": "sensor.{stem}_mileage",
    "plugged": "sensor.{stem}_plug_state", "report_time": "sensor.{stem}_last_battery_activity"}}


def _num(s: str, lo: float, hi: float | None = None) -> float:
    v = float(s)
    if not math.isfinite(v) or v < lo or (hi is not None and v > hi):
        raise ValueError(s)
    return v


def _scaled(factors: dict[str, float]) -> Callable[[str, str | None, dict | None], float]:
    """>= 0 value in a known unit, times its factor"""
    def conv(s: str, unit: str | None, attrs: dict | None) -> float:
        if unit not in factors:
            raise ValueError(unit)
        v = _num(s, 0)
        return v * factors[unit]

    return conv


def _soc(s: str, unit: str | None, attrs: dict | None) -> float:
    return _num(s, 0, 100)


def _charging(s: str, unit: str | None, attrs: dict | None) -> bool:
    return s in ("on", "true", "charging", "charge_in_progress")


def _plugged(s: str, unit: str | None, attrs: dict | None) -> bool:
    """plug_error, plug_unknown and the like are no reading"""
    if s in ("on", "true", "plugged"):
        return True
    if s in ("off", "false", "unplugged"):
        return False
    raise ValueError(s)


def _ignition(s: str, unit: str | None, attrs: dict | None) -> int:
    if s not in ("on", "off"):
        raise ValueError(s)
    return IGNITION_ON if s == "on" else IGNITION_OFF


def _location(s: str, unit: str | None, attrs: dict | None) -> list[float]:
    a = attrs or {}
    try:
        lat, lon, acc = float(a["latitude"]), float(a["longitude"]), float(a.get("gps_accuracy") or 0)
    except (KeyError, TypeError) as e:
        raise ValueError(s) from e
    if not all(map(math.isfinite, (lat, lon, acc))):
        raise ValueError(s)
    return [lat, lon, acc]


@dataclass(frozen=True)
class Reading:
    key: str | None  # sample key; None for report_time, which only stamps other rows
    name: str
    convert: Callable[[str, str | None, dict | None], Any]  # (state, unit, attributes) -> value; ValueError = no reading


READINGS: dict[str, Reading] = {r.name: r for r in (
    Reading("soc_percent", "charge_level", _soc),
    Reading("odometer_km", "odometer", _scaled({"km": 1, "mi": 1.609344, "m": 0.001})),
    Reading("range_m", "range", _scaled({"km": 1000, "mi": 1609.344, "m": 1})),
    Reading("battery_wh", "battery_energy", _scaled({"kWh": 1000, "Wh": 1})),
    Reading("speed", "speed", _scaled({"km/h": 1 / 3.6, "mph": 0.44704, "m/s": 1})),
    Reading("charging_state", "charging", _charging),
    Reading("plug_state", "plugged", _plugged),
    Reading("ignition", "ignition", _ignition),
    Reading("gps", "location", _location),
    Reading(None, "report_time", lambda s, u, a: _iso_ms(s)),
)}


def parse_history(payload: list[list[dict]]) -> dict[str, list[tuple[int, str, dict | None]]]:
    """HA /api/history/period: one list per entity, only its first row has entity_id.
    A row with attributes is timed by last_updated (attribute changes keep last_changed)."""
    out: dict[str, list[tuple[int, str, dict | None]]] = {}
    for rows in payload:
        if not rows or not isinstance(rows[0], dict) or not isinstance(rows[0].get("entity_id"), str):
            continue
        dst = out.setdefault(rows[0]["entity_id"], [])
        for r in rows:
            try:
                attrs = r.get("attributes")
                dst.append((_iso_ms(r["last_updated" if attrs else "last_changed"]), r["state"], attrs))
            except (KeyError, TypeError, ValueError, AttributeError):
                continue
    return out


def to_samples(entities: dict[str, str], units: dict[str, str | None], history: dict[str, list[tuple[int, str, dict | None]]],
               cursor: dict[str, int]) -> tuple[list[tuple[int, str, Any]], dict[str, int], list[tuple[str, str]]]:
    """(t, key, value) sorted by t, the cursor advanced to the newest row seen per entity, and the (entity, state) rows that are no reading"""
    new_cursor = dict(cursor)
    reports: list[tuple[int, int | None]] = []  # (last_changed, report time) of every report-time row, even before the cursor
    rid = entities.get("report_time")
    for t, state, _ in history.get(rid, []) if rid else []:
        try:
            reports.append((t, _iso_ms(state)))
        except ValueError:
            reports.append((t, None))
        new_cursor[rid] = max(new_cursor.get(rid, -1), t)

    def stamp(t: int) -> int:
        r = max(((c, v) for c, v in reversed(reports) if c <= t + REPORT_LEAD_MS), key=lambda x: x[0], default=(0, None))[1]
        return r if r is not None and t - REPORT_MAX_AGE_MS <= r <= t else t

    out: list[tuple[int, str, Any]] = []
    bad: list[tuple[str, str]] = []
    for name, eid in entities.items():
        rd = READINGS.get(name)
        if rd is None or rd.key is None:
            continue
        floor = cursor.get(eid, -1)
        for t, state, attrs in history.get(eid, []):
            if t <= floor:
                continue
            new_cursor[eid] = max(new_cursor.get(eid, -1), t)
            if state in _SKIP:
                continue
            try:
                v = rd.convert(state, units.get(eid), attrs)
            except ValueError:
                bad.append((eid, state))
                continue
            out.append((stamp(t) if name in REPORT_STAMPED and rid else t, rd.key, v))
    out.sort(key=lambda x: x[0])
    return out, new_cursor, bad
