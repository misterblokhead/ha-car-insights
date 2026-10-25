import heapq
from typing import Any

from . import style
from .protocol import Sample, num
from .trips import distance_steps, energy_steps

MAX_POINTS = 200
KEYS = ("plug_state",)  # the cloud sample key series adds to what derivation loads
TRIP_COLS = ["t", "km", "net_kwh", "gross_kwh", "recup_kwh", "speed_kmh"]


def downsample(rows: list, n: int = MAX_POINTS) -> list:
    """at most n rows, evenly spread by index, first and last kept"""
    return rows if len(rows) <= n else [rows[round(i * (len(rows) - 1) / (n - 1))] for i in range(n)]


def trip(samples: list[Sample], start_wh: float | None, start: int) -> dict[str, Any]:
    """one row per distance or energy step in t order, each carrying the latest value of every column (None where none exists yet), and the style events as [km, kind]"""
    steps = heapq.merge(((t, "d", (d, v)) for t, d, v in distance_steps(samples)),
                        ((t, "e", e) for t, *e in energy_steps(samples, start_wh, start)), key=lambda x: x[0])
    dist: tuple[float, float] | None = None
    energy: list[float] | None = None
    rows = []
    for t, kind, val in steps:
        dist, energy = (val, energy) if kind == "d" else (dist, val)
        rows.append([t, None if dist is None else round(dist[0] / 1000, 3),
                     *([None] * 3 if energy is None else [round(x / 1000, 3) for x in energy]),
                     None if dist is None else round(dist[1] * 3.6, 1)])
    return {"cols": TRIP_COLS, "rows": downsample(rows), "events": [[round(km, 1), kind] for kind, km, _ in style.events(samples)]}


def charge(samples: list[Sample], start: int, end: int | None) -> dict[str, list]:
    """the car's kWh and the cloud's SoC and plug points inside the span; kept apart, never one figure (spec 6)"""
    car, soc, plug = [], [], []
    for s in samples:
        if s.t < start or (end is not None and s.t > end):
            continue
        if s.k == "battery_wh" and (v := num(s.v)) is not None:
            car.append([s.t, round(v / 1000, 3)])
        elif s.k == "soc_percent" and (v := num(s.v)) is not None:
            soc.append([s.t, v])
        elif s.k == "plug_state" and isinstance(s.v, bool):
            plug.append([s.t, int(s.v)])
    return {"car_kwh": downsample(car), "cloud_soc": downsample(soc), "cloud_plugged": downsample(plug)}
