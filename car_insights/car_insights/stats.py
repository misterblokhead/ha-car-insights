"""Statistics over the stored trips and charges."""
import sqlite3
from datetime import date, timedelta, tzinfo
from typing import Callable

from .figures import wh_per_100km
from .periods import local_date, midnight_ms, period_bounds, span
from .totals import sums


def similar_trips(conn: sqlite3.Connection, vid: str, trip: dict, limit: int = 20) -> dict | None:
    """The newest earlier trips between the same two zones, or None when the zones are unknown or nothing matches."""
    a, b = trip.get("from"), trip.get("to")
    if a is None or b is None:
        return None
    rows = conn.execute(
        "SELECT json_extract(json,'$.duration_s'), json_extract(json,'$.distance_m'), json_extract(json,'$.net_wh') FROM trips "
        "WHERE vehicle_id=? AND end IS NOT NULL AND start<? AND json_extract(json,'$.from')=? AND json_extract(json,'$.to')=? "
        "ORDER BY start DESC LIMIT ?", (vid, trip["start"], a, b, limit)).fetchall()
    if not rows:
        return None
    durs = [d for d, _, _ in rows if d is not None]
    used = [(m, wh) for _, m, wh in rows if m and m > 0 and wh is not None]
    dist = sum(m for m, _ in used)
    return {"n": len(rows), "avg_duration_s": sum(durs) / len(durs) if durs else None,
            "avg_wh_per_100km": sum(wh for _, wh in used) / dist * 100_000 if used else None}


def stats(conn: sqlite3.Connection, vids: list[str], period: str, at: date, tz: tzinfo,
          names: Callable[[str], str] | None = None, now_ms: int | None = None) -> dict:
    """Totals of the closed trips and charges of `vids` in the period containing `at`, against the period before it."""
    first, after = span(period, at)
    lo, hi = period_bounds(period, at, tz)
    plo, phi = period_bounds(period, first - timedelta(days=1), tz)
    q = ",".join("?" * len(vids))
    now_ms = hi if now_ms is None else now_ms  # None: the period has ended
    # buckets are days, or months for a year; a trip belongs to the one it started in (local time)
    key = (lambda d: d.replace(day=1)) if period == "year" else (lambda d: d)
    days = [first + timedelta(days=i) for i in range((after - first).days)]
    buckets = {key(d): [0.0, 0.0] for d in days}
    longest = best = None
    recup = gross = 0.0
    for vid, start, dist, net, rec, gr, a, b in conn.execute(
            f"SELECT vehicle_id, start, json_extract(json,'$.distance_m'), json_extract(json,'$.net_wh'), json_extract(json,'$.recup_wh'),"
            f" json_extract(json,'$.gross_wh'), json_extract(json,'$.from'), json_extract(json,'$.to') FROM trips"
            f" WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ? AND start < ? ORDER BY start", (*vids, lo, hi)):
        s = buckets[key(local_date(start, tz))]
        s[0] += dist or 0
        s[1] += net or 0
        recup += rec or 0
        gross += gr or 0
        if dist is not None and (longest is None or dist > longest["distance_m"]):
            longest = {"vehicle_id": vid, "start": start, "distance_m": dist, "from": a, "to": b}
        if dist is not None and dist >= 5000 and net is not None and (best is None or net / dist < best[0]):
            best = (net / dist, {"vehicle_id": vid, "start": start, "wh_per_100km": net / dist * 100_000})
    places = [{"place": p, "wh": float(wh)} for p, wh in conn.execute(
        f"SELECT json_extract(json,'$.place'), COALESCE(SUM(json_extract(json,'$.added_wh')),0) FROM charges"
        f" WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ? AND start < ? GROUP BY 1", (*vids, lo, hi))]
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
