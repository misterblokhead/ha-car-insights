from dataclasses import dataclass
from typing import Any

from .protocol import PARK_GEAR, Sample, fix, num
from .trips import MOVING_MPS

KEYS = ("plugged", "gear", "speed", "battery_wh", "range_m", "gps", "charging_state", "soc_percent")  # the sample keys find_charges reads
MIN_ADDED_WH = 100
CAR_SNAP_MS = 600_000  # a car plug sample this close to a cloud bound is the same event, and its time wins


@dataclass
class Charge:
    start: int
    end: int | None
    start_wh: float | None
    end_wh: float | None
    added_wh: float | None
    duration_s: float
    range_added_m: float | None
    avg_w: float | None
    fix: tuple[float, float] | None
    times_source: str  # "car" | "cloud"
    energy_source: str | None  # "car" | "soc_estimate" | None


@dataclass
class _Span:
    start: int
    end: int | None
    start_car: bool = True  # the start time is a car sample's
    end_car: bool = True  # the end time is a car sample's, or the span is open or was closed by a trip start


def _latest(samples: list[Sample], seed: dict[str, Any], k: str, t: int | None, conv: Any = num) -> Any:
    """latest value of k at or before t (None: no limit), falling back to the seed"""
    val = conv(seed.get(k))
    for s in samples:
        if t is not None and s.t > t:
            break
        if s.k == k and (v := conv(s.v)) is not None:
            val = v
    return val


def _first_after(samples: list[Sample], k: str, t: int, before: int | None) -> float | None:
    """first value of k at or after t and strictly before `before` (None: no limit)"""
    for s in samples:
        if s.t >= t and (before is None or s.t < before) and s.k == k and (v := num(s.v)) is not None:
            return v
    return None


def _latest_between(samples: list[Sample], k: str, lo: int, hi: int) -> float | None:
    """latest value of k with lo < t <= hi, no seed"""
    return next((v for s in reversed(samples) if lo < s.t <= hi and s.k == k and (v := num(s.v)) is not None), None)


def _moving(samples: list[Sample], seed: dict[str, Any]) -> list[Sample]:
    """the speed samples that start a trip: moving while not in park"""
    gear = num(seed.get("gear"))
    out = []
    for s in samples:
        v = num(s.v)
        if s.k == "gear" and v is not None:
            gear = v
        elif s.k == "speed" and v is not None and abs(v) > MOVING_MPS and gear != PARK_GEAR:
            out.append(s)
    return out


def _spans(samples: list[Sample], seed: dict[str, Any], key: str, moving: set[int]) -> list[tuple[int, int | None]]:
    """(start t, end t or None) spans where the boolean `key` is true; a trip start closes an open one (a missed end)"""
    spans: list[tuple[int, int | None]] = []
    on = seed.get(key) is True
    start = samples[0].t if on and samples else 0
    for s in samples:
        if s.seq in moving:
            if on:
                spans.append((start, s.t))  # a trip started, so the end was missed: a stale span must not stay open
                on = False
        elif s.k == key and isinstance(s.v, bool) and s.v != on:
            on = s.v
            if on:
                start = s.t
            else:
                spans.append((start, s.t))
    if on and samples:
        spans.append((start, None))
    return spans


def _merge_unmeasured(spans: list[tuple[int, int | None]], samples: list[Sample]) -> list[tuple[int, int | None]]:
    """two spans with no car battery_wh between them (the car slept through a pause) are one: both would claim the same delta"""
    wh_times = [s.t for s in samples if s.k == "battery_wh" and num(s.v) is not None]
    out: list[tuple[int, int | None]] = []
    for start, end in spans:
        prev_end = out[-1][1] if out else None
        if prev_end is not None and not any(prev_end <= t <= start for t in wh_times):
            out[-1] = (out[-1][0], end)
        else:
            out.append((start, end))
    return out


def _plug_t(samples: list[Sample], plugged: bool, lo: int, hi: int) -> int | None:
    """latest t in [lo, hi] of a car plugged sample with that value"""
    return max((s.t for s in samples if s.k == "plugged" and s.v is plugged and lo <= s.t <= hi), default=None)


def _sessions(samples: list[Sample], seed: dict[str, Any], cloud: bool) -> list[_Span]:
    moving = {s.seq for s in _moving(samples, seed)}
    car = _spans(samples, seed, "plugged", moving)
    if not cloud:
        return [_Span(a, b) for a, b in car]
    sessions = []
    cloud_spans = _merge_unmeasured(_spans(samples, seed, "charging_state", moving), samples)
    for a, b in cloud_spans:
        start = _plug_t(samples, True, a - CAR_SNAP_MS, a)
        end = None if b is None else _plug_t(samples, False, max(b - CAR_SNAP_MS, a), b)  # never before the cloud start
        sessions.append(_Span(a if start is None else start, b if end is None else end,
                              start_car=start is not None, end_car=b is None or end is not None))
    inf = float("inf")

    def absorbed(a: int, b: int | None) -> bool:
        return any(a < (d if d is not None else inf) and (b if b is not None else inf) > c for c, d in cloud_spans)

    sessions += [_Span(a, b) for a, b in car if not absorbed(a, b)]
    return sorted(sessions, key=lambda x: x.start)


def find_charges(samples: list[Sample], seed: dict[str, Any], cloud: bool = False, capacity_wh: float = 60_000) -> list[Charge]:
    """samples are sorted by (t, seq); seed holds the latest value per key before the first sample.
    With cloud, spans where the cloud reports charging are sessions too (car plug times win where the car was awake)."""
    trip_starts = [s.t for s in _moving(samples, seed)]
    out = []
    for sp in _sessions(samples, seed, cloud):
        start, end = sp.start, sp.end
        cloud_end = end is not None and not sp.end_car
        after = next((t for t in trip_starts if t >= end), None) if cloud_end else None  # a cloud-timed end's reading comes before this

        def at_end(k: str) -> Any:
            if cloud_end and end == after:  # closed by a trip start: the car woke before it drove, so its latest reading since the start
                return _latest_between(samples, k, start, end)
            if cloud_end:
                return _first_after(samples, k, end, after)
            return _latest(samples, seed, k, end)

        wh0, wh1 = _latest(samples, seed, "battery_wh", start), at_end("battery_wh")
        r0, r1 = _latest(samples, seed, "range_m", start), at_end("range_m")
        soc0, soc1 = _latest(samples, seed, "soc_percent", start), _latest(samples, seed, "soc_percent", end)
        if wh0 is not None and wh1 is not None:
            added, source = wh1 - wh0, "car"
        elif cloud and soc0 is not None and soc1 is not None:
            added, source = (soc1 - soc0) / 100 * capacity_wh, "soc_estimate"
        else:
            added, source = None, None
        if end is not None and (end == start or (source == "car" and added < MIN_ADDED_WH)):
            continue
        last = end if end is not None else max(samples[-1].t, start)
        duration = (last - start) / 1000
        out.append(Charge(
            start=start, end=end, start_wh=wh0, end_wh=wh1 if source == "car" else None, added_wh=added,
            duration_s=duration, range_added_m=r1 - r0 if r0 is not None and r1 is not None else None,
            avg_w=added / (duration / 3600) if added is not None and duration > 0 else None,
            fix=_latest(samples, seed, "gps", start, fix),
            times_source="car" if sp.start_car and sp.end_car else "cloud", energy_source=source,
        ))
    return out
