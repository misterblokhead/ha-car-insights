import json
import re
from dataclasses import dataclass
from typing import Any

MAX_SAMPLES = 5000
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


class ProtocolError(ValueError):
    pass


def _int(x) -> bool:
    return isinstance(x, int) and not isinstance(x, bool)


def _sample(s) -> Sample:
    if not isinstance(s, dict) or not (_int(s.get("seq")) and s["seq"] >= 1 and _int(s.get("t"))):
        raise ProtocolError("bad sample")
    k = s.get("k")
    if not isinstance(k, str) or not 1 <= len(k) <= 32 or "v" not in s:
        raise ProtocolError("bad sample")
    if k == "gap":
        v = s["v"]
        if not isinstance(v, dict) or not (_int(v.get("from_seq")) and _int(v.get("to_seq")) and 1 <= v["from_seq"] <= v["to_seq"] < s["seq"]):
            raise ProtocolError("bad gap")  # a gap may only cover seqs before its own
    elif k == "meta":
        v = s["v"]
        if not isinstance(v, dict) or not isinstance(v.get("vehicle_name", ""), str):
            raise ProtocolError("bad meta")
    return Sample(s["seq"], s["t"], k, s["v"])


def parse_batch(raw: bytes) -> Batch:
    try:
        d = json.loads(raw)
    except ValueError as e:
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
    return Batch(vid, sid, [_sample(s) for s in samples])
