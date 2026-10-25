"""Statistics over the stored trips and charges."""
import sqlite3
from datetime import date, timedelta, tzinfo
from typing import Callable

from . import store
from .figures import wh_per_100km
from .kinds import CHARGE, TRIP
from .periods import local_date, midnight_ms, period_bounds, span
from .series import downsample
from .style import BANDS
from .totals import sums

SPEED_BANDS = tuple(n for _, n in BANDS)


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
    return {"n": len(rows), "avg_duration_s": sum(durs) / len(durs) if durs else None,
            "avg_wh_per_100km": wh_per_100km(sum(m for m, _ in used), sum(wh for _, wh in used))}


def _style(rows: list[dict]) -> dict:
    """Driving style of the trips that carry it: summed events, distance-weighted score, consumption per speed band."""
    rows = [r for r in rows if r.get("style")]
    km = {b: 0.0 for b in SPEED_BANDS}
    wh = dict(km)
    scored = []  # (distance_m, score)
    for r in rows:
        for b, (m, w) in r["style"]["bands"].items():
            km[b] += m / 1000
            wh[b] += w
        if r["style"]["score"] is not None:
            scored.append((r.get("distance_m") or 0, r["style"]["score"]))
    weight = sum(m for m, _ in scored)
    return {"km": round(sum(r.get("distance_m") or 0 for r in rows) / 1000, 1),
            **{e: sum(r["style"][e][0] for r in rows) for e in ("accel", "brake", "corner")},
            "score": round(sum(m * sc for m, sc in scored) / weight) if weight else None,
            "bands": {b: {"km": round(km[b], 1), "kwh_per_100km": round(wh[b] / km[b] / 10, 1) if km[b] >= 5 else None} for b in SPEED_BANDS}}


def stats(conn: sqlite3.Connection, vids: list[str], period: str, at: date, tz: tzinfo,
          names: Callable[[str], str] | None = None, now_ms: int | None = None) -> dict:
    """Totals of the closed trips and charges of `vids` in the period containing `at`, against the period before it."""
    first, after = span(period, at)
    lo, hi = period_bounds(period, at, tz)
    plo, phi = period_bounds(period, first - timedelta(days=1), tz)
    today = None if now_ms is None else local_date(now_ms, tz)
    now_ms = hi if now_ms is None else now_ms  # None: the period has ended
    # buckets are days, or months for a year; a trip belongs to the one it started in (local time)
    key = (lambda d: d.replace(day=1)) if period == "year" else (lambda d: d)
    days = [first + timedelta(days=i) for i in range((after - first).days)]
    buckets = {key(d): [0.0, 0.0] for d in days}
    longest = best = None
    recup = gross = 0.0
    trips = store.in_range(conn, TRIP, vids, lo, hi)
    for t in trips:
        vid, start, dist, net, a, b = t["vehicle_id"], t["start"], t.get("distance_m"), t.get("net_wh"), t.get("from"), t.get("to")
        s = buckets[key(local_date(start, tz))]
        s[0] += dist or 0
        s[1] += net or 0
        recup += t.get("recup_wh") or 0
        gross += t.get("gross_wh") or 0
        if dist is not None and (longest is None or dist > longest["distance_m"]):
            longest = {"vehicle_id": vid, "start": start, "distance_m": dist, "from": a, "to": b,
                       "from_address": t.get("from_address"), "to_address": t.get("to_address")}
        if dist is not None and dist >= 5000 and (w := wh_per_100km(dist, net)) is not None and (best is None or w < best["wh_per_100km"]):
            best = {"vehicle_id": vid, "start": start, "wh_per_100km": w}
    places = [{"place": p, "wh": wh} for p, wh in store.charged_by_place(conn, vids, lo, hi)]
    places.sort(key=lambda p: (-p["wh"], p["place"] is None, p["place"] or ""))
    return {
        # the days the page steps to: none after the present (a None `now_ms` is the past: always one)
        "period": {"start": lo, "end": hi, "first": first.isoformat(), "prev_at": (first - timedelta(days=1)).isoformat(),
                   "next_at": None if today is not None and after > today else after.isoformat()},
        "totals": sums(conn, vids, lo, hi, tz, now_ms),
        "previous": sums(conn, vids, plo, phi, tz, now_ms),
        "buckets": [{"start": midnight_ms(d, tz), "distance_m": m, "net_wh": wh, "wh_per_100km": wh_per_100km(m, wh)} for d, (m, wh) in buckets.items()],
        "by_place": places,
        "highlights": {"longest": longest, "most_efficient": best, "recup_wh": recup, "gross_wh": gross},
        "style": _style(trips),
        "previous_style": _style(store.in_range(conn, TRIP, vids, plo, phi)),
        "per_vehicle": [{"id": v, "name": names(v), "totals": sums(conn, [v], lo, hi, tz, now_ms)} for v in vids] if names else None,
    }


ROUTE_POINTS = {"week": 300, "month": 120, "year": 48}


def map_items(conn: sqlite3.Connection, vids: list[str], period: str, at: date, tz: tzinfo) -> dict:
    """The routes of the closed trips and the positions of the closed charges that started in the period containing `at`."""
    lo, hi = period_bounds(period, at, tz)
    return {
        "trips": [{"vid": v, "start": s, "route": downsample(pts, ROUTE_POINTS[period])} for v, s, pts in store.routes(conn, vids, lo, hi)],
        "charges": [{"vid": c["vehicle_id"], "start": c["start"], "lat": c["lat"], "lon": c["lon"], "name": c.get("place") or c.get("address")}
                    for c in store.in_range(conn, CHARGE, vids, lo, hi) if c.get("lat") is not None and c.get("lon") is not None],
    }
