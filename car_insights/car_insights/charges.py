from dataclasses import dataclass
from typing import Any

from .protocol import Sample
from .trips import _fix, _num

MIN_ADDED_WH = 100


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


def find_charges(samples: list[Sample], seed: dict[str, Any], now_ms: int) -> list[Charge]:
    """samples are sorted by (t, seq); seed holds the latest value per key before the first sample."""
    spans: list[list[int | None]] = []  # [start t, end t or None]
    on = seed.get("plugged") is True
    if on and samples:
        spans.append([samples[0].t, None])
    for s in samples:
        if s.k != "plugged" or not isinstance(s.v, bool) or s.v == on:
            continue
        on = s.v
        if on:
            spans.append([s.t, None])
        else:
            spans[-1][1] = s.t

    def latest(k: str, t: int | None, conv: Any = _num) -> Any:
        """latest value of k at or before t (None: no limit), falling back to the seed"""
        val = conv(seed.get(k))
        for s in samples:
            if t is not None and s.t > t:
                break
            if s.k == k and (v := conv(s.v)) is not None:
                val = v
        return val

    out = []
    for start, end in spans:
        wh0, wh1 = latest("battery_wh", start), latest("battery_wh", end)
        r0, r1 = latest("range_m", start), latest("range_m", end)
        added = wh1 - wh0 if wh0 is not None and wh1 is not None else None
        if end is not None and added is not None and added < MIN_ADDED_WH:
            continue
        last = end if end is not None else max(samples[-1].t, start)
        duration = (last - start) / 1000
        out.append(Charge(
            start=start, end=end, start_wh=wh0, end_wh=wh1 if wh0 is not None else None, added_wh=added,
            duration_s=duration, range_added_m=r1 - r0 if r0 is not None and r1 is not None else None,
            avg_w=added / (duration / 3600) if added is not None and duration > 0 else None,
            fix=latest("gps", start, _fix),
        ))
    return out
