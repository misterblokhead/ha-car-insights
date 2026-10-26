import hashlib
import json
from datetime import tzinfo

from .periods import local_date, week_days

LIST = 20


def _sum(rows, day_of, field, days):
    out = dict.fromkeys(days, 0)
    for r in rows:
        d = day_of(r)
        if d in out:
            out[d] += r.get(field) or 0  # None counts as 0 for summing only
    return out


def build(trips: list[dict], charges: list[dict], week_trips: list[dict], week_charges: list[dict], now_ms: int, tz: tzinfo, capacity_wh: float | None = None) -> dict:
    """The summary sent back in the webhook response (the open trip is not part of it).
    trips/charges: the newest closed rows, newest first (at most LIST); week_*: every closed row since week_start_ms."""
    def day_of(r):
        return local_date(r["start"], tz)
    days = week_days(now_ms, tz)
    dist, net, added = _sum(week_trips, day_of, "distance_m", days), _sum(week_trips, day_of, "net_wh", days), _sum(week_charges, day_of, "added_wh", days)
    week = [{"date": d.isoformat(), "distance_m": dist[d], "net_wh": net[d], "charged_wh": added[d]} for d in days]
    s = {
        "today": week[-1], "last_trip": trips[0] if trips else None, "last_charge": charges[0] if charges else None,
        "trips": trips, "charges": charges, "week": week, "capacity_wh": capacity_wh,
    }
    s["rev"] = hashlib.sha1(json.dumps(s, separators=(",", ":"), sort_keys=True).encode()).hexdigest()[:12]
    s["updated"] = now_ms
    return s
