from dataclasses import dataclass
from typing import Any, Iterator

from .protocol import PARK_GEAR, Sample, fix, num

KEYS = ("gear", "ignition", "speed", "battery_wh", "outside_temp", "gps")  # the sample keys find_trips reads
IGNITION_ENDS_TRIP = (1, 2)  # LOCK, OFF; 0 is UNDEFINED
MERGE_GAP_MS = 180_000
# no batch from the car for this long with the trip's tail in P: the car switched off and its last batch (ignition off) was lost
QUIET_MS = 600_000
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


def find_trips(samples: list[Sample], seed: dict[str, Any], has_ignition: bool, quiet: bool = False) -> list[Trip]:
    """samples are sorted by (t, seq); seed holds the latest value per key before the first sample.
    A trip closes only on evidence in the samples (ignition off/lock, or a stop in P proven by a later sample):
    arrival time proves nothing, as a backlog arrives late. A tail without proof stays open, unless `quiet` (the car's
    senders delivered nothing for QUIET_MS, so no backlog is draining) and the tail is in P: it then ends at its first P sample."""
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
        # nothing, only silence (the car asleep: two samples that far apart, counting only the keys find_trips reads) does
        if cur and p is not None and s.t - (prev_t if has_ignition else samples[p].t) >= MERGE_GAP_MS:
            close(p + 1, True)
        # the car records every second while a trip is open, so this much silence means it was off
        if cur and s.t - prev_t >= QUIET_MS:
            close(i, True)
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
    if cur and quiet and p is not None:
        close(p + 1, True)
    if cur:
        close(len(samples), False)
    # noise is dropped once closed: an open trip shows from its first second
    return [t for t in out if t.end is None or t.distance_m >= NOISE_DISTANCE_M or t.duration_s >= NOISE_DURATION_S]


def distance_steps(samples: list[Sample]) -> Iterator[tuple[int, float, float]]:
    """(t, cumulative distance m, speed m/s) per speed sample; a sample stands for at most MAX_SPEED_STEP_MS"""
    distance, prev = 0.0, None
    for s in samples:
        if s.k == "speed" and (v := num(s.v)) is not None:
            if prev:
                distance += prev[1] * (min(s.t - prev[0], MAX_SPEED_STEP_MS) / 1000)
            prev = (s.t, abs(v))  # reverse is negative
            yield s.t, distance, prev[1]


def _wh_readings(samples: list[Sample], wh0: float | None, start: int) -> tuple[float | None, list[tuple[int, float]]]:
    """the base wh and the later readings; a reading at the start instant is the base, not a step"""
    base, readings = wh0, []
    for s in samples:
        if s.k == "battery_wh" and (v := num(s.v)) is not None:
            if s.t == start:
                base = v
            else:
                readings.append((s.t, v))
    return base, readings


def energy_steps(samples: list[Sample], wh0: float | None, start: int) -> Iterator[tuple[int, float, float, float]]:
    """(t, net, gross, recup) wh since the base, cumulative, per battery_wh reading; nothing without a base"""
    base, readings = _wh_readings(samples, wh0, start)
    if base is None:
        return
    cur, gross, recup = base, 0.0, 0.0
    for t, v in readings:
        if v < cur:
            gross += cur - v
        else:
            recup += v - cur
        cur = v
        yield t, base - cur, gross, recup


def _build(seg: list[Sample], wh0: float | None, temp0: float | None, closed: bool) -> Trip:
    start, end = seg[0].t, seg[-1].t
    steps = list(distance_steps(seg))
    distance = steps[-1][1] if steps else 0.0
    moving = sum(min(t1 - t0, MAX_SPEED_STEP_MS) / 1000 for (t0, _, v), (t1, _, _) in zip(steps, steps[1:]) if v > MOVING_MPS)

    base, readings = _wh_readings(seg, wh0, start)
    end_wh = net = gross = recup = None
    if base is not None:
        end_wh = readings[-1][1] if readings else base
        *_, (_, net, gross, recup) = [(0, 0.0, 0.0, 0.0), *energy_steps(seg, wh0, start)]

    temps = [x for x in [temp0, *(num(s.v) for s in seg if s.k == "outside_temp")] if x is not None]
    fixes = [f for s in seg if s.k == "gps" and (f := fix(s.v))]
    return Trip(
        start=start, end=end if closed else None, distance_m=distance, duration_s=(end - start) / 1000,
        avg_speed_mps=distance / moving if moving > 0 else None, max_speed_mps=max((v for _, _, v in steps), default=None),
        start_wh=base, end_wh=end_wh, net_wh=net, gross_wh=gross, recup_wh=recup,
        avg_temp_c=sum(temps) / len(temps) if temps else None,
        first_fix=fixes[0] if fixes else None, last_fix=fixes[-1] if fixes else None,
    )
