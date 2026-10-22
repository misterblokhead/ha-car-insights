from dataclasses import dataclass
from typing import Any

from .protocol import PARK_GEAR, Sample, fix, num

KEYS = ("gear", "ignition", "speed", "battery_wh", "outside_temp", "gps")  # the sample keys find_trips reads
IGNITION_ENDS_TRIP = (1, 2)  # LOCK, OFF; 0 is UNDEFINED
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


def find_trips(samples: list[Sample], seed: dict[str, Any], has_ignition: bool) -> list[Trip]:
    """samples are sorted by (t, seq); seed holds the latest value per key before the first sample.
    A trip closes only on evidence in the samples (ignition off/lock, or a stop in P proven by a later sample):
    arrival time proves nothing, as a backlog arrives late. A tail without proof stays open."""
    gear, wh, temp = num(seed.get("gear")), num(seed.get("battery_wh")), num(seed.get("outside_temp"))
    out: list[Trip] = []
    cur: tuple[int, float | None, float | None] | None = None  # first index, wh and temp at start
    p: int | None = None  # first P sample of the current P stretch inside the trip
    prev_t = 0

    def close(stop: int, closed: bool) -> None:
        nonlocal cur, p
        assert cur is not None
        out.append(_build(samples[cur[0]:stop], cur[1], cur[2], closed))
        cur = p = None

    for i, s in enumerate(samples):
        # P held for MERGE_GAP_MS ends the trip at its first P sample; with an ignition signal P alone proves
        # nothing, only silence (the car asleep: two samples that far apart, counting only the keys derivation loads) does
        if cur and p is not None and s.t - (prev_t if has_ignition else samples[p].t) >= MERGE_GAP_MS:
            close(p + 1, True)
        v = num(s.v)
        if v is not None:
            if s.k == "gear":
                gear = v
                p = (i if p is None else p) if v == PARK_GEAR else None
            elif s.k == "ignition" and cur and v in IGNITION_ENDS_TRIP:
                close(i + 1, True)
            elif s.k == "battery_wh":
                wh = v
            elif s.k == "outside_temp":
                temp = v
            elif s.k == "speed" and not cur and abs(v) > MOVING_MPS and gear != PARK_GEAR:
                cur, p = (i, wh, temp), None
        prev_t = s.t
    if cur:
        close(len(samples), False)
    # noise is dropped once closed: an open trip shows from its first second
    return [t for t in out if t.end is None or t.distance_m >= NOISE_DISTANCE_M or t.duration_s >= NOISE_DURATION_S]


def _build(seg: list[Sample], wh0: float | None, temp0: float | None, closed: bool) -> Trip:
    start, end = seg[0].t, seg[-1].t
    speeds = [(s.t, abs(v)) for s in seg if s.k == "speed" and (v := num(s.v)) is not None]  # reverse is negative
    distance = moving = 0.0
    for (t0, v), (t1, _) in zip(speeds, speeds[1:]):
        dt = min(t1 - t0, MAX_SPEED_STEP_MS) / 1000
        distance += v * dt
        if v > MOVING_MPS:
            moving += dt

    # energy: walk the battery readings; a reading at the start instant is the start value, not a step
    base, readings = wh0, []
    for s in seg:
        if s.k == "battery_wh" and (v := num(s.v)) is not None:
            if s.t == start:
                base = v
            else:
                readings.append(v)
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

    temps = [x for x in [temp0, *(num(s.v) for s in seg if s.k == "outside_temp")] if x is not None]
    fixes = [f for s in seg if s.k == "gps" and (f := fix(s.v))]
    return Trip(
        start=start, end=end if closed else None, distance_m=distance, duration_s=(end - start) / 1000,
        avg_speed_mps=distance / moving if moving > 0 else None, max_speed_mps=max((v for _, v in speeds), default=None),
        start_wh=base, end_wh=end_wh, net_wh=net, gross_wh=gross, recup_wh=recup,
        avg_temp_c=sum(temps) / len(temps) if temps else None,
        first_fix=fixes[0] if fixes else None, last_fix=fixes[-1] if fixes else None,
    )
