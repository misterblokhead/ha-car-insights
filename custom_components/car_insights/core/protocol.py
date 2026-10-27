import json
import math
import re
from dataclasses import dataclass
from typing import Any

MAX_SAMPLES = 5000
PARK_GEAR = 4
IGNITION_ON, IGNITION_OFF, IGNITION_LOCK = 4, 2, 1  # the car app's ignition codes; 0 is UNDEFINED
FUTURE_SLACK_MS = 86_400_000  # a sample this far ahead of its arrival is a clock error
_VEHICLE = re.compile(r"[A-Za-z0-9_-]{1,64}")
_SOURCE = re.compile(r"[a-z_]+-[0-9a-f]{8}")


@dataclass(frozen=True)
class Sample:
    seq: int
    t: int
    k: str
    v: Any


@dataclass(frozen=True)
class Batch:
    vehicle_id: str
    source_id: str
    samples: list[Sample]
    summary_rev: str | None = None


class ProtocolError(ValueError):
    pass


def num(v: Any) -> float | None:
    """v as a finite float, else None (bools are not numbers)"""
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
        return None
    return float(v)


def fix(v: Any) -> tuple[float, float] | None:
    """(lat, lon) of a gps value, else None"""
    if not isinstance(v, list) or len(v) < 2:
        return None
    lat, lon = num(v[0]), num(v[1])
    return None if lat is None or lon is None else (lat, lon)


def _int(x) -> bool:
    return isinstance(x, int) and not isinstance(x, bool)


_MAX = 2**62  # SQLite INTEGER is 64-bit signed; real seq/t are far below this


def _sample(s) -> Sample:
    if not isinstance(s, dict) or not (_int(s.get("seq")) and 1 <= s["seq"] < _MAX and _int(s.get("t")) and 0 <= s["t"] < _MAX):
        raise ProtocolError("bad sample")
    k = s.get("k")
    if not isinstance(k, str) or not 1 <= len(k) <= 32 or "v" not in s:
        raise ProtocolError("bad sample")
    if k == "gap":
        v = s["v"]
        if not isinstance(v, dict) or not (_int(v.get("from_seq")) and _int(v.get("to_seq")) and 1 <= v["from_seq"] <= v["to_seq"] < s["seq"] and v["to_seq"] < _MAX):
            raise ProtocolError("bad gap")  # a gap may only cover seqs before its own
    elif k == "meta":
        v = s["v"]
        if not isinstance(v, dict) or not isinstance(v.get("vehicle_name", ""), str):
            raise ProtocolError("bad meta")
    return Sample(s["seq"], s["t"], k, s["v"])


def parse_batch(raw: bytes) -> Batch:
    try:
        d = json.loads(raw)
    except (ValueError, RecursionError) as e:  # RecursionError: deeply nested JSON
        raise ProtocolError("bad json") from e
    if not isinstance(d, dict) or d.get("v") != 1 or not _int(d["v"]):
        raise ProtocolError("bad version")
    vid, sid, samples = d.get("vehicle_id"), d.get("source_id"), d.get("samples")
    if not isinstance(vid, str) or not _VEHICLE.fullmatch(vid):
        raise ProtocolError("bad vehicle_id")
    if not isinstance(sid, str) or not _SOURCE.fullmatch(sid):
        raise ProtocolError("bad source_id")
    if not isinstance(samples, list) or len(samples) > MAX_SAMPLES:
        raise ProtocolError("bad samples")
    rev = d.get("summary_rev")  # null counts as absent: a sender with no summary yet may send it
    if rev is not None and (not isinstance(rev, str) or len(rev) > 64):
        raise ProtocolError("bad summary_rev")
    return Batch(vid, sid, [_sample(s) for s in samples], rev)
