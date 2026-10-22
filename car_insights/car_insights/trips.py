import math
from dataclasses import dataclass
from typing import Any

from .protocol import Sample

PARK_GEAR = 4
IGNITION_OFF_MAX = 2  # LOCK = 1, OFF = 2
MERGE_GAP_MS = 180_000
MOVING_MPS = 0.2778  # 1 km/h
MAX_SPEED_STEP_MS = 5_000  # a speed sample stands for at most this long
NOISE_DISTANCE_M = 100
NOISE_DURATION_S = 60


@dataclass
class Trip:
    start: int
    end: int | None
    distance_m: float
    duration_s: float
    avg_speed_mps: float | None
    max_speed_mps: float | None
    start_wh: float | None
    end_wh: float | None
    net_wh: float | None
    gross_wh: float | None
    recup_wh: float | None
    avg_temp_c: float | None
    first_fix: tuple[float, float] | None
    last_fix: tuple[float, float] | None


def _num(v: Any) -> float | None:
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
        return None
    return float(v)


def _fix(v: Any) -> tuple[float, float] | None:
    if not isinstance(v, list) or len(v) < 2:
        return None
    lat, lon = _num(v[0]), _num(v[1])
    return None if lat is None or lon is None else (lat, lon)


def _p_over(p_t: int, prev_t: int, t: int, has_ignition: bool) -> bool:
    # with an ignition signal P alone proves nothing: only silence (car asleep) ends the trip
    return t - (prev_t if has_ignition else p_t) >= MERGE_GAP_MS


def find_trips(samples: list[Sample], seed: dict[str, Any], now_ms: int, has_ignition: bool) -> list[Trip]:
    """samples are sorted by (t, seq); seed holds the latest value per key before the first sample."""
    gear, wh, temp = _num(seed.get("gear")), _num(seed.get("battery_wh")), _num(seed.get("outside_temp"))
    spans: list[tuple[int, int, float | None, float | None, bool]] = []  # first index, end index (exclusive), wh and temp at start, closed
    cur: tuple[int, float | None, float | None] | None = None
    p: int | None = None  # first P sample of the current P stretch inside the trip
    prev_t = 0
    for i, s in enumerate(samples):
        if cur and p is not None and _p_over(samples[p].t, prev_t, s.t, has_ignition):
            spans.append((cur[0], p + 1, cur[1], cur[2], True))
            cur = p = None
        v = _num(s.v)
        if v is not None:
            if s.k == "gear":
                gear = v
                p = (i if p is None else p) if v == PARK_GEAR else None
            elif s.k == "ignition" and cur and v <= IGNITION_OFF_MAX:
                spans.append((cur[0], i + 1, cur[1], cur[2], True))
                cur = p = None
            elif s.k == "battery_wh":
                wh = v
            elif s.k == "outside_temp":
                temp = v
            elif s.k == "speed" and not cur and abs(v) > MOVING_MPS and gear != PARK_GEAR:
                cur, p = (i, wh, temp), None
        prev_t = s.t
    if cur:
        if p is not None and _p_over(samples[p].t, prev_t, now_ms, has_ignition):
            spans.append((cur[0], p + 1, cur[1], cur[2], True))
        else:
            spans.append((cur[0], len(samples), cur[1], cur[2], False))
    out = (_build(samples[a:b], wh0, temp0, closed) for a, b, wh0, temp0, closed in spans)
    return [t for t in out if t.distance_m >= NOISE_DISTANCE_M or t.duration_s >= NOISE_DURATION_S]


def _build(seg: list[Sample], wh0: float | None, temp0: float | None, closed: bool) -> Trip:
    start, end = seg[0].t, seg[-1].t
    speeds = [(s.t, abs(v)) for s in seg if s.k == "speed" and (v := _num(s.v)) is not None]  # reverse is negative
    distance = moving = 0.0
    for (t0, v), (t1, _) in zip(speeds, speeds[1:]):
        dt = min(t1 - t0, MAX_SPEED_STEP_MS) / 1000
        distance += v * dt
        if v > MOVING_MPS:
            moving += dt

    # energy: walk the battery readings; a reading at the start instant is the start value, not a step
    base, readings = wh0, []
    for s in seg:
        if s.k == "battery_wh" and (v := _num(s.v)) is not None:
            if s.t == start:
                base = v
            else:
                readings.append(v)
    if base is None and readings:
        base = readings.pop(0)
    end_wh = net = gross = recup = None
    if base is not None:
        end_wh, gross, recup = base, 0.0, 0.0
        for v in readings:
            if v < end_wh:
                gross += end_wh - v
            else:
                recup += v - end_wh
            end_wh = v
        net = base - end_wh

    temps = [x for x in [temp0, *(_num(s.v) for s in seg if s.k == "outside_temp")] if x is not None]
    fixes = [f for s in seg if s.k == "gps" and (f := _fix(s.v))]
    return Trip(
        start=start, end=end if closed else None, distance_m=distance, duration_s=(end - start) / 1000,
        avg_speed_mps=distance / moving if moving > 0 else None, max_speed_mps=max((v for _, v in speeds), default=None),
        start_wh=base, end_wh=end_wh, net_wh=net, gross_wh=gross, recup_wh=recup,
        avg_temp_c=sum(temps) / len(temps) if temps else None,
        first_fix=fixes[0] if fixes else None, last_fix=fixes[-1] if fixes else None,
    )
