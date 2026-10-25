import math
from bisect import bisect_left, bisect_right
from typing import Iterator

from .protocol import Sample, num
from .trips import MAX_SPEED_STEP_MS, _wh_readings, distance_steps, energy_steps

ACCEL_MPS2 = 3.0
BRAKE_MPS2 = 3.0  # a magnitude
CORNER_MPS2 = 4.0
CORNER_MAX_MPS2 = 10  # no road car corners harder; above it a fix's bearing is a GPS glitch (the collector sends 0.0 without one)
MIN_RUN_S = 0.5
SMOOTH_S = 1.0
DIFF_S = 1.0
CORNER_MIN_MPS = 6.944  # 25 km/h
CORNER_MAX_ACC_M = 15
CORNER_MAX_GAP_S = 2
PENALTY = 20
MIN_SCORE_M = 2000
KINDS = ("accel", "brake", "corner")
BANDS = ((0, "0-50"), (50, "50-80"), (80, "80-100"), (100, "100-120"), (120, "120+"))  # km/h lower bounds, inclusive

Point = tuple[int, float, float]  # t ms, value, cumulative m
Steps = list[tuple[int, float, float]]  # distance_steps


def _accel_groups(samples: list[Sample], steps: Steps | None = None) -> list[list[Point]]:
    """(t, a, m) per speed sample, one list per stretch of samples at most MAX_SPEED_STEP_MS apart"""
    stretches: list[Steps] = []
    for step in distance_steps(samples) if steps is None else steps:
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
        for t in ts:
            lo, hi = bisect_left(ts, t - half), bisect_right(ts, t + half)
            smooth.append((csum[hi] - csum[lo]) / (hi - lo))
        group = []
        for t, m, _ in st:
            k, j = bisect_left(ts, t - DIFF_S * 500), bisect_right(ts, t + DIFF_S * 500) - 1
            group.append((t, (smooth[j] - smooth[k]) / ((ts[j] - ts[k]) / 1000) if ts[j] > ts[k] else 0.0, m))
        out.append(group)
    return out


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


def _corner_groups(samples: list[Sample], steps: Steps | None = None) -> list[list[Point]]:
    """(t of the later fix, lateral m/s2, m at the latest speed sample) per pair of usable fixes; a pair that does not count ends the list"""
    steps = list(distance_steps(samples)) if steps is None else steps
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
            lateral = steps[i][2] * math.radians(abs(turn)) / ((cur[0] - prev[0]) / 1000)
            pair = (cur[0], lateral, steps[i][1]) if lateral <= CORNER_MAX_MPS2 else None
        if pair:
            if not groups or not prev_ok:
                groups.append([])
            groups[-1].append(pair)
        prev, prev_ok = cur, bool(pair)
    return groups


def events(samples: list[Sample], steps: Steps | None = None) -> list[tuple[str, float, float]]:
    """(kind, km at peak, severity) per hard acceleration, hard braking and sharp corner, in time order"""
    steps = list(distance_steps(samples)) if steps is None else steps
    groups = _accel_groups(samples, steps)
    braking = [[(t, -a, m) for t, a, m in g] for g in groups]
    found = [(t, kind, m / 1000, x / thr) for kind, gs, thr, min_s in
             (("accel", groups, ACCEL_MPS2, MIN_RUN_S), ("brake", braking, BRAKE_MPS2, MIN_RUN_S), ("corner", _corner_groups(samples, steps), CORNER_MPS2, 0))
             for t, x, m in _peaks(gs, thr, min_s)]
    return [(kind, km, sev) for _, kind, km, sev in sorted(found)]


def score(events: list[tuple[str, float, float]], distance_m: float) -> int | None:
    """0-100: per kind 100 - PENALTY x severity per km (floored at 0), the mean of the three; None under MIN_SCORE_M"""
    if distance_m < MIN_SCORE_M:
        return None
    km = distance_m / 1000
    subs = [max(0.0, 100 - PENALTY * sum(sev for k, _, sev in events if k == kind) / km) for kind in KINDS]
    return round(sum(subs) / 3)


def _band(mps: float) -> str:
    return [name for lo, name in BANDS if mps * 3.6 >= lo][-1]


def bands(samples: list[Sample], wh0: float | None, start: int, steps: Steps | None = None) -> tuple[dict[str, list[int | None]], int | None]:
    """(band -> [m, wh], standing wh): each distance increment in the band of the speed that produced it, each energy step's net change split
    across the bands by the distance driven in each since the previous step; a step with no distance is standing; no base wh: wh and standing None"""
    out = {name: [0.0, 0.0] for _, name in BANDS}
    steps = list(distance_steps(samples)) if steps is None else steps
    incs = [(t1, d1 - d0, v0) for (_, d0, v0), (t1, d1, _) in zip(steps, steps[1:])]
    for _, d, v in incs:
        out[_band(v)][0] += d
    i, prev_net, standing = 0, 0.0, 0.0
    for t, net, *_ in energy_steps(samples, wh0, start):
        part: dict[str, float] = {}
        while i < len(incs) and incs[i][0] <= t:
            name = _band(incs[i][2])
            part[name] = part.get(name, 0.0) + incs[i][1]
            i += 1
        d = sum(part.values())
        if d:
            for name, m in part.items():
                out[name][1] += (net - prev_net) * m / d
        else:
            standing += net - prev_net
        prev_net = net
    known = _wh_readings(samples, wh0, start)[0] is not None
    return {name: [round(m), round(wh) if known else None] for name, (m, wh) in out.items()}, round(standing) if known else None


def measure(samples: list[Sample], wh0: float | None, start: int, distance_m: float, found: list[tuple[str, float, float]] | None = None) -> dict:
    """the driving style of a trip: [count, summed severity] per event kind, the speed bands, the standing wh and the score; `found` is events(samples) when already at hand"""
    steps = list(distance_steps(samples))
    found = events(samples, steps) if found is None else found
    by_band, standing = bands(samples, wh0, start, steps)
    return {**{kind: [sum(k == kind for k, _, _ in found), round(sum(sev for k, _, sev in found if k == kind), 2)] for kind in KINDS},
            "bands": by_band, "standing": standing, "score": score(found, distance_m)}
