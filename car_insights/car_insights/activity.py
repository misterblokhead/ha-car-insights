"""The home timeline: trips and charges of the visible vehicles, newest first, in whole local days."""
import json
from datetime import datetime
from typing import Callable

from . import route as route_mod
from .periods import midnight_ms


def page(conn, vids: list[str], before: int | None, now_ms: int, tz, name: Callable[[str], str],
         route: Callable[[str, int], list | None], capacity: Callable[[str], float], min_items: int = 20) -> dict:
    today = datetime.fromtimestamp(now_ms / 1000, tz).date()
    out = {"today": today.isoformat(), "capacity_wh": {v: capacity(v) for v in vids}, "days": [], "next": None}
    if not vids:
        return out
    marks = ",".join("?" * len(vids))
    tables = (("trip", "trips"), ("charge", "charges"))
    if before is None:
        # first page: find the cut from the newest starts and the open rows, then read only the rows at or after it
        newest = sorted((r[0] for _, t in tables for r in conn.execute(
            f"SELECT start FROM {t} WHERE vehicle_id IN ({marks}) ORDER BY start DESC LIMIT ?", (*vids, min_items))), reverse=True)
        if not newest:
            return out
        # the cut also reaches back to the oldest open row: it belongs on the page whatever the other cars did since
        # shortcut: a long-stuck open row makes the first page long, cap it if that ever happens
        open_starts = [r[0] for _, t in tables for r in conn.execute(f"SELECT start FROM {t} WHERE vehicle_id IN ({marks}) AND end IS NULL", vids)]
        cut = midnight_ms(datetime.fromtimestamp(min([newest[:min_items][-1], *open_starts]) / 1000, tz).date(), tz)
        cond, args = "start>=?", (cut,)
    else:
        cond, args = "start<? AND end IS NOT NULL", (before,)
    rows = sorted(
        ((start, v, kind, json.loads(j)) for kind, table in tables for v, start, j in conn.execute(
            f"SELECT vehicle_id, start, json FROM {table} WHERE vehicle_id IN ({marks}) AND {cond}", (*vids, *args))),
        key=lambda r: (-r[0], r[1]))
    if not rows:
        return out
    if before is None:
        if any(conn.execute(f"SELECT 1 FROM {t} WHERE vehicle_id IN ({marks}) AND start<? LIMIT 1", (*vids, cut)).fetchone() for _, t in tables):
            out["next"] = cut
    else:
        cut = midnight_ms(datetime.fromtimestamp(rows[:min_items][-1][0] / 1000, tz).date(), tz)
    days: dict[str, dict] = {}
    for start, v, kind, row in rows:
        if start < cut:
            out["next"] = cut
            break
        item = {**row, "kind": kind, "vehicle_id": v, "vehicle_name": name(v)}
        if kind == "trip":
            pts = route(v, start)
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
