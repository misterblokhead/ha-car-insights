import math
from bisect import bisect_left, bisect_right
from typing import Iterator

from .protocol import Sample, num
from .trips import MAX_SPEED_STEP_MS, distance_steps, energy_steps

ACCEL_MPS2 = 2.5
BRAKE_MPS2 = 3.0  # a magnitude
CORNER_MPS2 = 3.0
MIN_RUN_S = 0.5
SMOOTH_S = 1.0
DIFF_S = 1.0
CORNER_MIN_MPS = 4.167  # 15 km/h
CORNER_MAX_ACC_M = 15
CORNER_MAX_GAP_S = 2
PENALTY = 20
MIN_SCORE_M = 2000
BANDS = ((0, "0-50"), (50, "50-80"), (80, "80-100"), (100, "100-120"), (120, "120+"))  # km/h lower bounds, inclusive

Point = tuple[int, float, float]  # t ms, value, cumulative m


def _accel_groups(samples: list[Sample]) -> list[list[Point]]:
    """(t, a, m) per speed sample, one list per stretch of samples at most MAX_SPEED_STEP_MS apart"""
    stretches: list[list[tuple[int, float, float]]] = []
    for step in distance_steps(samples):
        if stretches and step[0] - stretches[-1][-1][0] <= MAX_SPEED_STEP_MS:
            stretches[-1].append(step)
        else:
            stretches.append([step])
    out = []
    for st in stretches:
        ts = [t for t, _, _ in st]
        csum = [0.0]
        for _, _, v in st:
            csum.append(csum[-1] + v)
        half = SMOOTH_S * 500
        smooth = []
        for i, t in enumerate(ts):
            lo, hi = bisect_left(ts, t - half), bisect_right(ts, t + half)
            smooth.append((csum[hi] - csum[lo]) / (hi - lo))
        group = []
        for i, (t, m, _) in enumerate(st):
            k, j = bisect_left(ts, t - DIFF_S * 500), bisect_right(ts, t + DIFF_S * 500) - 1
            group.append((t, (smooth[j] - smooth[k]) / ((ts[j] - ts[k]) / 1000) if ts[j] > ts[k] else 0.0, m))
        out.append(group)
    return out


def accel_series(samples: list[Sample]) -> list[tuple[int, float, float]]:
    """(t, a m/s2, cumulative m) per speed sample; no a across a gap longer than MAX_SPEED_STEP_MS"""
    return [p for group in _accel_groups(samples) for p in group]


def _peaks(groups: list[list[Point]], threshold: float, min_s: float) -> Iterator[Point]:
    """the peak point of each run of values above threshold lasting at least min_s (first over-threshold point to the first one after the run)"""
    for g in groups:
        i = 0
        while i < len(g):
            if g[i][1] <= threshold:
                i += 1
                continue
            j = i
            while j + 1 < len(g) and g[j + 1][1] > threshold:
                j += 1
            if (g[j + 1][0] if j + 1 < len(g) else g[j][0]) - g[i][0] >= min_s * 1000:
                yield max(g[i:j + 1], key=lambda p: p[1])
            i = j + 1


def _usable(v) -> tuple[float, float] | None:
    """(accuracy m, bearing deg) of a gps value, else None"""
    if not isinstance(v, list) or len(v) < 4 or (acc := num(v[2])) is None or (bearing := num(v[3])) is None:
        return None
    return (acc, bearing) if acc < CORNER_MAX_ACC_M else None


def _corner_groups(samples: list[Sample]) -> list[list[Point]]:
    """(t of the later fix, lateral m/s2, m at the latest speed sample) per pair of usable fixes; a pair that does not count ends the list"""
    steps = list(distance_steps(samples))
    ts = [t for t, _, _ in steps]
    groups: list[list[Point]] = []
    prev, prev_ok = None, False
    for smp in samples:
        if smp.k != "gps":
            continue
        cur = (smp.t, fx) if (fx := _usable(smp.v)) else None
        pair = None
        if prev and cur and 0 < cur[0] - prev[0] <= CORNER_MAX_GAP_S * 1000 and (i := bisect_right(ts, cur[0]) - 1) >= 0 and steps[i][2] > CORNER_MIN_MPS:
            turn = (cur[1][1] - prev[1][1] + 180) % 360 - 180
            pair = (cur[0], steps[i][2] * math.radians(abs(turn)) / ((cur[0] - prev[0]) / 1000), steps[i][1])
        if pair:
            if not groups or not prev_ok:
                groups.append([])
            groups[-1].append(pair)
        prev, prev_ok = cur, bool(pair)
    return groups


def events(samples: list[Sample]) -> list[tuple[str, float, float]]:
    """(kind, km at peak, severity) per hard acceleration, hard braking and sharp corner, in time order"""
    groups = _accel_groups(samples)
    braking = [[(t, -a, m) for t, a, m in g] for g in groups]
    found = [(t, kind, m / 1000, x / thr) for kind, gs, thr, min_s in
             (("accel", groups, ACCEL_MPS2, MIN_RUN_S), ("brake", braking, BRAKE_MPS2, MIN_RUN_S), ("corner", _corner_groups(samples), CORNER_MPS2, 0))
             for t, x, m in _peaks(gs, thr, min_s)]
    return [(kind, km, sev) for _, kind, km, sev in sorted(found)]


def score(events: list[tuple[str, float, float]], distance_m: float) -> int | None:
    """0-100: per kind 100 - PENALTY x severity per km (floored at 0), the mean of the three; None under MIN_SCORE_M"""
    if distance_m < MIN_SCORE_M:
        return None
    km = distance_m / 1000
    subs = [max(0.0, 100 - PENALTY * sum(sev for k, _, sev in events if k == kind) / km) for kind in ("accel", "brake", "corner")]
    return round(sum(subs) / 3)


def _band(mps: float) -> str:
    return [name for lo, name in BANDS if mps * 3.6 >= lo][-1]


def bands(samples: list[Sample], wh0: float | None, start: int) -> dict[str, list[int]]:
    """band -> [m, wh]: each distance increment in the band of the speed that produced it, each energy step's net change in the band of the
    distance-weighted mean speed since the previous step (none moved: the lowest band); no base wh, no wh"""
    out = {name: [0.0, 0.0] for _, name in BANDS}
    steps = list(distance_steps(samples))
    incs = [(t1, d1 - d0, v0) for (_, d0, v0), (t1, d1, _) in zip(steps, steps[1:])]
    for _, d, v in incs:
        out[_band(v)][0] += d
    i, prev_net = 0, 0.0
    for t, net, *_ in energy_steps(samples, wh0, start):
        d = dv = 0.0
        while i < len(incs) and incs[i][0] <= t:
            d, dv, i = d + incs[i][1], dv + incs[i][1] * incs[i][2], i + 1
        out[_band(dv / d if d else 0.0)][1] += net - prev_net
        prev_net = net
    return {name: [round(m), round(wh)] for name, (m, wh) in out.items()}


def measure(samples: list[Sample], wh0: float | None, start: int, distance_m: float) -> dict:
    """the driving style of a trip: [count, summed severity] per event kind, the speed bands and the score"""
    found = events(samples)
    return {**{kind: [sum(k == kind for k, _, _ in found), round(sum(sev for k, _, sev in found if k == kind), 2)] for kind in ("accel", "brake", "corner")},
            "bands": bands(samples, wh0, start), "score": score(found, distance_m)}
