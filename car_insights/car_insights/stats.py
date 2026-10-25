"""Statistics over the stored trips and charges."""
import sqlite3
from datetime import date, timedelta, tzinfo
from typing import Callable

from . import store
from .figures import wh_per_100km
from .kinds import TRIP
from .periods import local_date, midnight_ms, period_bounds, span
from .totals import sums


def similar_trips(conn: sqlite3.Connection, vid: str, trip: dict, limit: int = 20) -> dict | None:
    """The newest earlier trips between the same two zones, or None when the zones are unknown or nothing matches."""
    a, b = trip.get("from"), trip.get("to")
    if a is None or b is None:
        return None
    rows = store.similar(conn, vid, trip["start"], a, b, limit)
    if not rows:
        return None
    durs = [r.get("duration_s") for r in rows if r.get("duration_s") is not None]
    used = [(r["distance_m"], r["net_wh"]) for r in rows if r.get("distance_m") and r["distance_m"] > 0 and r.get("net_wh") is not None]
    dist = sum(m for m, _ in used)
    return {"n": len(rows), "avg_duration_s": sum(durs) / len(durs) if durs else None,
            "avg_wh_per_100km": sum(wh for _, wh in used) / dist * 100_000 if used else None}


def stats(conn: sqlite3.Connection, vids: list[str], period: str, at: date, tz: tzinfo,
          names: Callable[[str], str] | None = None, now_ms: int | None = None) -> dict:
    """Totals of the closed trips and charges of `vids` in the period containing `at`, against the period before it."""
    first, after = span(period, at)
    lo, hi = period_bounds(period, at, tz)
    plo, phi = period_bounds(period, first - timedelta(days=1), tz)
    now_ms = hi if now_ms is None else now_ms  # None: the period has ended
    # buckets are days, or months for a year; a trip belongs to the one it started in (local time)
    key = (lambda d: d.replace(day=1)) if period == "year" else (lambda d: d)
    days = [first + timedelta(days=i) for i in range((after - first).days)]
    buckets = {key(d): [0.0, 0.0] for d in days}
    longest = best = None
    recup = gross = 0.0
    for t in store.in_range(conn, TRIP, vids, lo, hi):
        vid, start, dist, net, a, b = t["vehicle_id"], t["start"], t.get("distance_m"), t.get("net_wh"), t.get("from"), t.get("to")
        s = buckets[key(local_date(start, tz))]
        s[0] += dist or 0
        s[1] += net or 0
        recup += t.get("recup_wh") or 0
        gross += t.get("gross_wh") or 0
        if dist is not None and (longest is None or dist > longest["distance_m"]):
            longest = {"vehicle_id": vid, "start": start, "distance_m": dist, "from": a, "to": b}
        if dist is not None and dist >= 5000 and net is not None and (best is None or net / dist < best[0]):
            best = (net / dist, {"vehicle_id": vid, "start": start, "wh_per_100km": net / dist * 100_000})
    places = [{"place": p, "wh": wh} for p, wh in store.charged_by_place(conn, vids, lo, hi)]
    places.sort(key=lambda p: (-p["wh"], p["place"] is None, p["place"] or ""))
    return {
        "period": {"start": lo, "end": hi},
        "totals": sums(conn, vids, lo, hi, tz, now_ms),
        "previous": sums(conn, vids, plo, phi, tz, now_ms),
        "buckets": [{"start": midnight_ms(d, tz), "distance_m": m, "net_wh": wh, "wh_per_100km": wh_per_100km(m, wh)} for d, (m, wh) in buckets.items()],
        "by_place": places,
        "highlights": {"longest": longest, "most_efficient": best[1] if best else None, "recup_wh": recup, "gross_wh": gross},
        "per_vehicle": [{"id": v, "name": names(v), "totals": sums(conn, [v], lo, hi, tz, now_ms)} for v in vids] if names else None,
    }
