"""One rule per figure shown or published."""
MIN_CONSUMPTION_M = 100  # shorter than this, a consumption means nothing


def wh_per_100km(distance_m: float | None, net_wh: float | None) -> float | None:
    if distance_m is None or net_wh is None or distance_m < MIN_CONSUMPTION_M:
        return None
    return net_wh / distance_m * 100_000


def pct(wh: float | None, capacity_wh: float | None) -> float | None:
    """Battery percentage, 0-100 with one decimal."""
    if wh is None or not capacity_wh or capacity_wh < 0:
        return None
    return round(min(100.0, max(0.0, wh / capacity_wh * 100)), 1)
