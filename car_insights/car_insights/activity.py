"""The home timeline: trips and charges of the visible vehicles, newest first, in whole local days."""
from typing import Callable

from . import costs, prices, route as route_mod, store
from .figures import with_figures
from .kinds import KINDS, TRIP
from .periods import local_date, midnight_ms


def page(conn, vids: list[str], before: int | None, now_ms: int, tz, name: Callable[[str], str],
         capacity: Callable[[str], float], min_items: int = 20) -> dict:
    today = local_date(now_ms, tz)
    out = {"today": today.isoformat(), "days": [], "next": None}
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
        cut = midnight_ms(local_date(min([newest[:min_items][-1], *open_starts]), tz), tz)
        fetch = lambda k: store.rows_from(conn, k, vids, cut)
    else:
        fetch = lambda k: store.closed_before(conn, k, vids, before)
    rows = sorted(((r["start"], r["vehicle_id"], k, r) for k in KINDS for r in fetch(k)), key=lambda r: (-r[0], r[1]))
    if not rows:
        return out
    if before is None:
        if any(store.any_before(conn, k, vids, cut) for k in KINDS):
            out["next"] = cut
    else:
        cut = midnight_ms(local_date(rows[:min_items][-1][0], tz), tz)
    days: dict[str, dict] = {}
    capacities, book = {v: capacity(v) for v in vids}, prices.books(conn)
    for start, v, kind, row in rows:
        if start < cut:
            out["next"] = cut
            break
        item = {**with_figures(kind, row, capacities[v]), "kind": kind.name, "vehicle_id": v, "vehicle_name": name(v)}
        if kind is TRIP:
            pts = store.route(conn, v, start)
            item["route"] = None if pts is None else route_mod.card(pts)
        else:
            c = costs.charge_cost(book(v), item)
            item["cost"] = {"amount": c["amount"], "basis": c["basis"]}
        d = days.setdefault(local_date(start, tz).isoformat(),
                            {"summary": {"distance_m": 0, "net_wh": 0, "charged_wh": 0}, "items": []})
        d["items"].append(item)
        s = d["summary"]  # open rows count too, so the header adds up with the cards under it
        if kind is TRIP:
            s["distance_m"] += row.get("distance_m") or 0
            s["net_wh"] += row.get("net_wh") or 0
        else:
            s["charged_wh"] += row.get("added_wh") or 0
    out["days"] = [{"date": k, **d} for k, d in days.items()]
    return out
