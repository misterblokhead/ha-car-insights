"""The sidebar page's API: answers only Supervisor ingress requests, and only with what the viewer may see."""
import dataclasses
import json
import time
from datetime import date, datetime
from typing import Annotated, Awaitable, Callable, Literal

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request
from pydantic import BaseModel

from . import access, activity, db, stats
from .access import Viewer
from .derive import Deriver, Zones
from .protocol import fix
from .totals import totals

MAX_LIMIT = 200
EpochMs = Annotated[int, Query(ge=0, lt=2**62)]  # sqlite integers are 64-bit: anything larger would be a 500, not a 422
StartMs = Annotated[int, Path(ge=0, lt=2**62)]


def _not_found() -> HTTPException:
    return HTTPException(404, "not found")  # one body for unknown and hidden alike: a viewer cannot probe for other vehicles


class _Name(BaseModel):
    name: str


class _VehicleSettings(BaseModel):
    group_id: str | None
    viewers: list[str]


def router(conn, deriver: Deriver, zones: Zones, tz, capacity: Callable[[str], float],
           is_admin: Callable[[str], Awaitable[bool]], on_settings: Callable[[], None] = lambda: None,
           ingress_hosts: tuple[str, ...] = ("172.30.32.2",), now_ms: Callable[[], int] = lambda: int(time.time() * 1000)) -> APIRouter:
    # handlers are async def with no awaits around the DB work (like /ingest): the event loop serializes access to the connection
    async def ingress_guard(request: Request) -> None:
        """Router dependency: runs before FastAPI reports body/query/path errors, so every /api/ui/* request that is not from
        the ingress address, or has no user, gets 403 and never a 422 that tells it about the API."""
        if request.client is None or request.client.host not in ingress_hosts or access.viewer_from_headers(request.headers) is None:
            raise HTTPException(403, "forbidden")

    r = APIRouter(prefix="/api/ui", dependencies=[Depends(ingress_guard)])

    async def who(request: Request, admin: bool = False) -> Viewer:
        """Called first by every route: the viewer (admin when asked), whom it then notes as seen.
        Admin status comes from HA's user list, never from a header."""
        viewer = access.viewer_from_headers(request.headers)
        if viewer is None:
            raise HTTPException(403, "forbidden")
        viewer = dataclasses.replace(viewer, is_admin=await is_admin(viewer.user_id))
        if admin and not viewer.is_admin:
            raise HTTPException(403, "forbidden")
        access.see(conn, viewer, now_ms())
        return viewer

    def vids_of(viewer: Viewer, view: str) -> list[str]:
        v = access.resolve(conn, viewer, view)
        if v is None:
            raise _not_found()
        return v

    def visible(viewer: Viewer, vid: str) -> None:
        if vid not in access.visible_vehicles(conn, viewer):
            raise _not_found()

    def edit(fn, *args) -> dict:
        try:
            fn(*args)
        except ValueError as e:
            raise HTTPException(400, str(e))
        except KeyError:
            raise _not_found()
        on_settings()
        return {}

    def has_open(table: str, vid: str) -> bool:
        return conn.execute(f"SELECT 1 FROM {table} WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone() is not None

    def vehicle_card(vid: str, now: int) -> dict:
        got = db.latest_at_or_before(conn, vid, now, ("battery_wh", "range_m", "gps"))
        wh, cap, pos = got.get("battery_wh"), capacity(vid), fix(got.get("gps"))
        return {
            "id": vid, "name": db.device_info(conn, vid)[0],
            "status": "driving" if has_open("trips", vid) else "charging" if has_open("charges", vid) else "parked",
            "battery_wh": wh, "soc_percent": round(wh / cap * 100, 1) if wh is not None and cap else None,
            "range_m": got.get("range_m"),
            "position": None if pos is None else {"lat": pos[0], "lon": pos[1], "place": zones(*pos)},
            "updated": conn.execute("SELECT MAX(t) FROM samples WHERE vehicle_id=? AND t<=? AND key NOT IN ('meta','gap')",
                                    (vid, now)).fetchone()[0],
        }

    def page(table: str, vids: list[str], before: int | None, limit: int) -> dict:
        """Newest first; open rows lead the first page only and do not count against the limit."""
        marks, limit = ",".join("?" * len(vids)), max(1, min(limit, MAX_LIMIT))
        def rows(cond: str, args: tuple, n: int = -1) -> list[dict]:
            return [{**json.loads(j), "vehicle_id": v, "vehicle_name": db.device_info(conn, v)[0]} for v, j in conn.execute(
                f"SELECT vehicle_id, json FROM {table} WHERE vehicle_id IN ({marks}) AND {cond} ORDER BY start DESC, vehicle_id LIMIT ?",
                (*vids, *args, n))]
        # shortcut: two vehicles starting in the same millisecond may straddle a page boundary and one is skipped, add a tiebreak cursor if that shows
        closed = rows("end IS NOT NULL AND start<?", (2 ** 62 if before is None else before,), limit)
        return {"items": ([] if before is not None else rows("end IS NULL", ())) + closed,
                "next": closed[-1]["start"] if len(closed) == limit else None}

    def detail(table: str, series: Callable[[str, int], dict | None], viewer: Viewer, vid: str, start: int) -> tuple[dict, dict | None]:
        visible(viewer, vid)
        row = conn.execute(f"SELECT json FROM {table} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
        if row is None:
            raise _not_found()
        return json.loads(row[0]), series(vid, start)

    @r.get("/me")
    async def me(request: Request):
        v = await who(request)
        return {"user_id": v.user_id, "name": v.name, "is_admin": v.is_admin}

    @r.get("/views")
    async def get_views(request: Request):
        return access.views(conn, await who(request))

    @r.get("/overview")
    async def overview(request: Request, view: str = ""):
        vids, now = vids_of(await who(request), view), now_ms()
        return {"vehicles": [vehicle_card(v, now) for v in vids], "totals": totals(conn, vids, now, tz)}

    @r.get("/trips")
    async def trips(request: Request, view: str = "", before: EpochMs | None = None, limit: int = 50):
        return page("trips", vids_of(await who(request), view), before, limit)

    @r.get("/charges")
    async def charges(request: Request, view: str = "", before: EpochMs | None = None, limit: int = 50):
        return page("charges", vids_of(await who(request), view), before, limit)

    @r.get("/activity")
    async def get_activity(request: Request, view: str = "", before: EpochMs | None = None):
        return activity.page(conn, vids_of(await who(request), view), before, now_ms(), tz, lambda v: db.device_info(conn, v)[0],
                             deriver.trip_route, capacity)

    @r.get("/stats")
    async def get_stats(request: Request, view: str = "", period: Literal["week", "month", "year"] = "week", at: date | None = None):
        vids, today = vids_of(await who(request), view), datetime.fromtimestamp(now_ms() / 1000, tz).date()
        if at is not None and at > today:
            raise HTTPException(422, "at is in the future")
        return stats.stats(conn, vids, period, at or today, tz, (lambda v: db.device_info(conn, v)[0]) if view.startswith("g:") else None)

    @r.get("/trips/{vid}/{start}")
    async def trip(request: Request, vid: str, start: StartMs):
        row, series = detail("trips", deriver.trip_series, await who(request), vid, start)
        return {"trip": row, "series": series, "route": deriver.trip_route(vid, start),
                "similar": stats.similar_trips(conn, vid, row), "capacity_wh": capacity(vid)}

    @r.get("/charges/{vid}/{start}")
    async def charge(request: Request, vid: str, start: StartMs):
        row, series = detail("charges", deriver.charge_series, await who(request), vid, start)
        return {"charge": row, "series": series, "capacity_wh": capacity(vid),
                "outside_temp_c": db.latest_at_or_before(conn, vid, start, ("outside_temp",)).get("outside_temp")}

    @r.get("/settings")
    async def get_settings(request: Request):
        await who(request, admin=True)
        return access.settings(conn)

    @r.post("/groups")
    async def create_group(request: Request, body: _Name):
        await who(request, admin=True)
        try:
            gid = access.create_group(conn, body.name)
        except ValueError as e:
            raise HTTPException(400, str(e))
        on_settings()
        return {"id": gid}

    @r.put("/groups/{gid}")
    async def rename_group(request: Request, gid: str, body: _Name):
        await who(request, admin=True)
        return edit(access.rename_group, conn, gid, body.name)

    @r.delete("/groups/{gid}")
    async def delete_group(request: Request, gid: str):
        await who(request, admin=True)
        return edit(access.delete_group, conn, gid)

    @r.put("/vehicles/{vid}")
    async def put_vehicle(request: Request, vid: str, body: _VehicleSettings):
        await who(request, admin=True)
        return edit(access.set_vehicle, conn, vid, body.group_id, body.viewers)

    return r
