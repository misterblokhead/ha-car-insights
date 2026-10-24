import math

from . import series
from .protocol import Sample, fix

MAX_POINTS = 300
CARD_POINTS = 48


def _dist_to_chord(p, a, b) -> float:
    dx, dy = b[0] - a[0], b[1] - a[1]
    n = dx * dx + dy * dy
    if n == 0:  # a closed loop: the chord is a point
        return math.hypot(p[0] - a[0], p[1] - a[1])
    return abs(dx * (a[1] - p[1]) - dy * (a[0] - p[0])) / math.sqrt(n)


def simplify(points: list[tuple[float, float]], tol_m: float = 5.0) -> list[tuple[float, float]]:
    """Ramer-Douglas-Peucker on (lat, lon) points; iterative, so a long trip cannot hit the recursion limit"""
    if len(points) <= 2:
        return list(points)
    lat0, lon0 = points[0]
    kx = 111_320 * math.cos(math.radians(lat0))
    xy = [((lon - lon0) * kx, (lat - lat0) * 110_540) for lat, lon in points]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    todo = [(0, len(points) - 1)]
    while todo:
        i, j = todo.pop()
        far, k = max(((_dist_to_chord(xy[m], xy[i], xy[j]), m) for m in range(i + 1, j)), default=(0.0, i))
        if far > tol_m:
            keep[k] = True
            todo += [(i, k), (k, j)]
    return [p for p, kept in zip(points, keep) if kept]


def from_samples(samples: list[Sample]) -> list[list[float]]:
    """the trip's gps fixes in order, simplified to at most 300 [lat, lon] at 5 decimals (~1 m)"""
    pts = [f for s in samples if s.k == "gps" and (f := fix(s.v))]
    return [[round(la, 5), round(lo, 5)] for la, lo in series.downsample(simplify(pts), MAX_POINTS)]


def card(points: list[list[float]]) -> list[list[float]]:
    """a stored route thinned for a list card"""
    return series.downsample(points, CARD_POINTS)
