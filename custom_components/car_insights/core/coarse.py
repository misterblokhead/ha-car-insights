from typing import Any, Callable

from .protocol import Sample, fix, num
from .trips import IGNITION_ENDS_TRIP, Trip
from .zones import _haversine_m

# the coarse rules, in one place: a car without the car app is only known from its cloud entities, polled about once a minute
MOVE_M = 200  # a gps fix this far from the previous one is motion
END_QUIET_MS = 600_000  # without ignition, a trip ends after this long without motion
MIN_DISTANCE_M = 500  # a closed trip shorter than this is noise
ODO_SETTLE_MS = 120_000  # the cloud odometer lags the ignition: end values are read this long after the end
KEYS = ("ignition", "odometer_km", "gps", "battery_wh", "soc_percent", "speed")  # the sample keys find_cloud_trips reads

Span = tuple[int, int, bool]  # start, last evidence (or ignition off) and whether the trip is closed


def find_cloud_trips(samples: list[Sample], seed: dict[str, Any], has_ignition: bool, capacity_wh: float, horizon: int | None) -> list[Trip]:
    """Approximate trips from cloud readings. samples are sorted by (t, seq); seed holds the latest value per key before the first sample.
    horizon is the time up to which the cloud has been read: without it, or while the evidence can still grow, a trip stays open."""
    spans = _ignition_spans(samples, horizon) if has_ignition else _motion_spans(samples, seed, horizon)
    trips = [_build(samples, seed, span, capacity_wh) for span in spans]
    return [t for t in trips if t.end is None or t.distance_m >= MIN_DISTANCE_M]


def _ignition_spans(samples: list[Sample], horizon: int | None) -> list[Span]:
    out, start = [], None
    for s in samples:
        if s.k != "ignition" or (v := num(s.v)) is None:
            continue
        if start is None and v not in IGNITION_ENDS_TRIP:
            start = s.t
        elif start is not None and v in IGNITION_ENDS_TRIP:
            if horizon is None or horizon < s.t + ODO_SETTLE_MS:
                return [*out, (start, s.t, False)]  # whatever follows waits until this one can close
            out.append((start, s.t, True))
            start = None
    return [*out, (start, samples[-1].t, False)] if start is not None else out


def _motion_spans(samples: list[Sample], seed: dict[str, Any], horizon: int | None) -> list[Span]:
    odo, pos = num(seed.get("odometer_km")), fix(seed.get("gps"))  # the previous reading, from the seed first
    moves: list[int] = []
    for s in samples:
        if s.k == "odometer_km" and (v := num(s.v)) is not None:
            if odo is not None and v > odo:
                moves.append(s.t)
            odo = v
        elif s.k == "gps" and (f := fix(s.v)):
            if pos and _haversine_m(*pos, *f) > MOVE_M:
                moves.append(s.t)
            pos = f
    runs: list[list[int]] = []
    for t in moves:
        if runs and t - runs[-1][1] < END_QUIET_MS:
            runs[-1][1] = t
        else:
            runs.append([t, t])
    # a later run proves the quiet; for the last one only the horizon can
    return [(a, b, i < len(runs) - 1 or (horizon is not None and horizon - b >= END_QUIET_MS)) for i, (a, b) in enumerate(runs)]


def _build(samples: list[Sample], seed: dict[str, Any], span: Span, capacity_wh: float) -> Trip:
    start, last, closed = span
    cut = last + ODO_SETTLE_MS if closed else None  # an open trip's end values are the latest readings

    def reading(k: str, parse: Callable[[Any], Any], before: int | None = None, upto: int | None = None) -> Any:
        """the latest valid value of k strictly before `before` / at or before `upto`, else the seed's"""
        v = parse(seed.get(k))
        for s in samples:
            if (before is not None and s.t >= before) or (upto is not None and s.t > upto):
                break
            if s.k == k and (p := parse(s.v)) is not None:
                v = p
        return v

    first_fix, last_fix = reading("gps", fix, before=start), reading("gps", fix, upto=cut)
    odo0, odo1 = reading("odometer_km", num, before=start), reading("odometer_km", num, upto=cut)
    if odo0 is not None and odo1 is not None and odo1 >= odo0:
        distance = (odo1 - odo0) * 1000
    else:  # no usable odometer: the route through the trip's fixes
        route = [first_fix] if first_fix else []
        route += [f for s in samples if s.k == "gps" and start <= s.t and (cut is None or s.t <= cut) and (f := fix(s.v))]
        distance = sum(_haversine_m(*a, *b) for a, b in zip(route, route[1:]))

    wh0, wh1 = reading("battery_wh", num, before=start), reading("battery_wh", num, upto=cut)
    if wh0 is None or wh1 is None:
        soc0, soc1 = reading("soc_percent", num, before=start), reading("soc_percent", num, upto=cut)
        wh0, wh1 = (None, None) if soc0 is None or soc1 is None else (soc0 / 100 * capacity_wh, soc1 / 100 * capacity_wh)

    duration = (last - start) / 1000
    speeds = [v for s in samples if s.k == "speed" and start <= s.t <= last and (v := num(s.v)) is not None]
    return Trip(
        start=start, end=last if closed else None, distance_m=distance, duration_s=duration,
        avg_speed_mps=distance / duration if duration > 0 else None, max_speed_mps=max(speeds, default=None),
        start_wh=wh0, end_wh=wh1, net_wh=None if wh0 is None else wh0 - wh1, gross_wh=None, recup_wh=None, avg_temp_c=None,
        first_fix=first_fix, last_fix=last_fix,
    )
