"""The home timeline: trips and charges of the visible vehicles, newest first, in whole local days."""
from datetime import datetime
from typing import Callable

from . import route as route_mod, store
from .figures import pct, wh_per_100km
from .kinds import KINDS
from .periods import midnight_ms


def with_figures(kind: str, row: dict, capacity_wh: float | None) -> dict:
    """The row with the figures the server owns: consumption of a trip, and the battery percentages of both kinds."""
    out = {**row, "start_pct": pct(row.get("start_wh"), capacity_wh), "end_pct": pct(row.get("end_wh"), capacity_wh)}
    if kind == "trip":
        out["wh_per_100km"] = wh_per_100km(row.get("distance_m"), row.get("net_wh"))
    return out


def page(conn, vids: list[str], before: int | None, now_ms: int, tz, name: Callable[[str], str],
         capacity: Callable[[str], float], min_items: int = 20) -> dict:
    today = datetime.fromtimestamp(now_ms / 1000, tz).date()
    out = {"today": today.isoformat(), "capacity_wh": {v: capacity(v) for v in vids}, "days": [], "next": None}
    if not vids:
        return out
    if before is None:
        # first page: find the cut from the newest starts and the open rows, then read only the rows at or after it
        newest = sorted((s for k in KINDS for s in store.newest_starts(conn, k, vids, min_items)), reverse=True)
        if not newest:
            return out
        # the cut also reaches back to the oldest open row: it belongs on the page whatever the other cars did since
        # shortcut: a long-stuck open row makes the first page long, cap it if that ever happens
        open_starts = [s for k in KINDS for s in store.open_starts(conn, k, vids)]
        cut = midnight_ms(datetime.fromtimestamp(min([newest[:min_items][-1], *open_starts]) / 1000, tz).date(), tz)
        fetch = lambda k: store.rows_from(conn, k, vids, cut)
    else:
        fetch = lambda k: store.closed_before(conn, k, vids, before)
    rows = sorted(((r["start"], r["vehicle_id"], k.name, r) for k in KINDS for r in fetch(k)), key=lambda r: (-r[0], r[1]))
    if not rows:
        return out
    if before is None:
        if any(store.any_before(conn, k, vids, cut) for k in KINDS):
            out["next"] = cut
    else:
        cut = midnight_ms(datetime.fromtimestamp(rows[:min_items][-1][0] / 1000, tz).date(), tz)
    days: dict[str, dict] = {}
    for start, v, kind, row in rows:
        if start < cut:
            out["next"] = cut
            break
        item = {**with_figures(kind, row, out["capacity_wh"][v]), "kind": kind, "vehicle_id": v, "vehicle_name": name(v)}
        if kind == "trip":
            pts = store.route(conn, v, start)
            item["route"] = None if pts is None else route_mod.card(pts)
        d = days.setdefault(datetime.fromtimestamp(start / 1000, tz).date().isoformat(),
                            {"summary": {"distance_m": 0, "net_wh": 0, "charged_wh": 0}, "items": []})
        d["items"].append(item)
        s = d["summary"]  # open rows count too, so the header adds up with the cards under it
        if kind == "trip":
            s["distance_m"] += row.get("distance_m") or 0
            s["net_wh"] += row.get("net_wh") or 0
        else:
            s["charged_wh"] += row.get("added_wh") or 0
    out["days"] = [{"date": k, **d} for k, d in days.items()]
    return out
