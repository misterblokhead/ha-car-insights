import logging
from datetime import tzinfo

from . import costs, store
from .kinds import CHARGE, TRIP
from .figures import wh_per_100km
from .periods import period_starts

log = logging.getLogger(__name__)


def sums(conn, vids: list[str], lo: int, hi: int, tz: tzinfo, now_ms: int) -> dict:
    """Closed trips and charges of `vids` starting in [lo, hi): the one query behind the sensors and the Statistics page."""
    # a null counts as 0 in the sums only
    d, n, nt = store.sums(conn, TRIP, vids, lo, hi, ("distance_m", "net_wh"))
    known = [(r["distance_m"] or 0, r["net_wh"]) for r in store.in_range(conn, TRIP, vids, lo, hi) if r["net_wh"] is not None]  # consumption counts measured trips only
    a, nc = store.sums(conn, CHARGE, vids, lo, hi, ("added_wh",))
    try:
        cost = costs.period_costs(conn, vids, lo, hi, tz, now_ms)
    except Exception:  # a cost problem is a null, never lost distance and energy
        log.exception("totals cost failed")
        cost = {"energy": None, "fixed": None, "total": None, "uncosted": None}
    return {"distance_m": float(d), "net_wh": float(n), "charged_wh": float(a), "trips": nt, "charges": nc, "cost": cost,
            "wh_per_100km": wh_per_100km(sum(m for m, _ in known) if known else None, sum(w for _, w in known))}


def totals(conn, vids: list[str], now_ms: int, tz: tzinfo) -> dict:
    month, year = period_starts(now_ms, tz)
    return {"month": sums(conn, vids, month, now_ms + 1, tz, now_ms), "year": sums(conn, vids, year, now_ms + 1, tz, now_ms)}
