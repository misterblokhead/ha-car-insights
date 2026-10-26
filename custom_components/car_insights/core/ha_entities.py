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


def _ranged(lo: float, hi: float | None = None) -> Callable[[str], float]:
    def conv(s: str) -> float:
        v = float(s)
        if not math.isfinite(v) or v < lo or (hi is not None and v > hi):
            raise ValueError(s)
        return v

    return conv


def _plug(s: str) -> bool:
    """plugged/unplugged only; plug_error, plug_unknown and the like are no reading (ValueError: skipped)"""
    if s not in ("plugged", "unplugged"):
        raise ValueError(s)
    return s == "plugged"


@dataclass(frozen=True)
class Mapping:
    metrics: dict[str, tuple[str, Callable[[str], Any]]]  # key -> (entity id template with {stem}, state -> value)
    report_time: str | None  # entity id template whose state is the cloud's report time (ISO)
    report_metrics: frozenset[str]  # metrics stamped with the report time


RENAULT = Mapping(
    metrics={
        "charging_state": ("sensor.{stem}_charge_state", lambda s: s == "charge_in_progress"),
        "soc_percent": ("sensor.{stem}_battery", _ranged(0, 100)),
        "odometer_km": ("sensor.{stem}_mileage", _ranged(0)),
        "plug_state": ("sensor.{stem}_plug_state", _plug),  # not "plugged": that key opens car spans
    },
    report_time="sensor.{stem}_last_battery_activity",
    report_metrics=frozenset({"charging_state", "soc_percent"}),
)
MAPPINGS: dict[str, Mapping] = {"renault": RENAULT}


def entity_ids(mapping: Mapping, stem: str) -> list[str]:
    ids = [tmpl.format(stem=stem) for tmpl, _ in mapping.metrics.values()]
    return ids + [mapping.report_time.format(stem=stem)] if mapping.report_time else ids


def parse_history(payload: list[list[dict]]) -> dict[str, list[tuple[int, str]]]:
    """HA /api/history/period?minimal_response: one list per entity, only its first row has entity_id"""
    out: dict[str, list[tuple[int, str]]] = {}
    for rows in payload:
        if not rows or not isinstance(rows[0], dict) or not isinstance(rows[0].get("entity_id"), str):
            continue
        dst = out.setdefault(rows[0]["entity_id"], [])
        for r in rows:
            try:
                dst.append((_iso_ms(r["last_changed"]), r["state"]))
            except (KeyError, TypeError, ValueError):
                continue
    return out


def to_samples(mapping: Mapping, stem: str, history: dict[str, list[tuple[int, str]]],
               cursor: dict[str, int]) -> tuple[list[tuple[int, str, Any]], dict[str, int]]:
    """(t, key, value) sorted by t, and the cursor advanced to the newest row seen per entity"""
    new_cursor = dict(cursor)
    reports: list[tuple[int, int | None]] = []  # (last_changed, report time) of every report-time row, even before the cursor
    if mapping.report_time:
        rid = mapping.report_time.format(stem=stem)
        for t, state in history.get(rid, []):
            try:
                reports.append((t, _iso_ms(state)))
            except ValueError:
                reports.append((t, None))
            new_cursor[rid] = max(new_cursor.get(rid, -1), t)

    def stamp(t: int) -> int:
        r = max(((c, v) for c, v in reversed(reports) if c <= t + REPORT_LEAD_MS), key=lambda x: x[0], default=(0, None))[1]
        return r if r is not None and t - REPORT_MAX_AGE_MS <= r <= t else t

    out: list[tuple[int, str, Any]] = []
    for key, (tmpl, conv) in mapping.metrics.items():
        eid = tmpl.format(stem=stem)
        floor = cursor.get(eid, -1)
        for t, state in history.get(eid, []):
            if t <= floor:
                continue
            new_cursor[eid] = max(new_cursor.get(eid, -1), t)
            if state in _SKIP:
                continue
            try:
                v = conv(state)
            except ValueError:
                continue
            out.append((stamp(t) if key in mapping.report_metrics else t, key, v))
    out.sort(key=lambda x: x[0])
    return out, new_cursor
