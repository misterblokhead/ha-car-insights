import logging
from datetime import tzinfo

from . import costs
from .figures import wh_per_100km
from .periods import period_starts

log = logging.getLogger(__name__)


def sums(conn, vids: list[str], lo: int, hi: int, tz: tzinfo, now_ms: int) -> dict:
    """Closed trips and charges of `vids` starting in [lo, hi): the one query behind the sensors and the Statistics page."""
    q = ",".join("?" * len(vids))
    # json null counts as 0 in the sums only
    d, n, nt = conn.execute(
        f"SELECT COALESCE(SUM(json_extract(json,'$.distance_m')),0), COALESCE(SUM(json_extract(json,'$.net_wh')),0), COUNT(*)"
        f" FROM trips WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ? AND start < ?", (*vids, lo, hi)).fetchone()
    a, nc = conn.execute(
        f"SELECT COALESCE(SUM(json_extract(json,'$.added_wh')),0), COUNT(*)"
        f" FROM charges WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ? AND start < ?", (*vids, lo, hi)).fetchone()
    try:
        cost = costs.period_costs(conn, vids, lo, hi, tz, now_ms)
    except Exception:  # a cost problem is a null, never lost distance and energy
        log.exception("totals cost failed")
        cost = {"energy": None, "fixed": None, "total": None, "uncosted": None}
    return {"distance_m": float(d), "net_wh": float(n), "charged_wh": float(a), "trips": nt, "charges": nc, "cost": cost,
            "wh_per_100km": wh_per_100km(d, n)}


def totals(conn, vids: list[str], now_ms: int, tz: tzinfo) -> dict:
    month, year = period_starts(now_ms, tz)
    return {"month": sums(conn, vids, month, now_ms + 1, tz, now_ms), "year": sums(conn, vids, year, now_ms + 1, tz, now_ms)}
