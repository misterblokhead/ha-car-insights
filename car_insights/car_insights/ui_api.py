"""The sidebar page's API: answers only Supervisor ingress requests, and only with what the viewer may see."""
import asyncio
import dataclasses
import logging
import time
from datetime import date
from typing import Annotated, Any, Awaitable, Callable, Literal

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request, Response
from pydantic import BaseModel, Field

from . import access, activity, costs, db, prices, stats, store
from .access import Viewer
from .figures import pct, with_figures
from .periods import local_date
from .zones import Zones
from .kinds import CHARGE, TRIP, Kind
from .protocol import fix, num

log = logging.getLogger(__name__)
EpochMs = Annotated[int, Query(ge=0, lt=2**62)]  # sqlite integers are 64-bit: anything larger would be a 500, not a 422
StartMs = Annotated[int, Path(ge=0, lt=2**62)]
RAW_SPAN_MS = 86_400_000


def _not_found() -> HTTPException:
    return HTTPException(404, "not found")  # one body for unknown and hidden alike: a viewer cannot probe for other vehicles


class _Name(BaseModel):
    name: str


class _VehicleSettings(BaseModel):
    group_id: str | None
    viewers: list[str]


# strict: prices._num would take a JSON true as 1
Num = Annotated[float, Field(strict=True)]
Ms = Annotated[int, Field(strict=True, ge=0, lt=2**62)]


class _Tariff(BaseModel):
    valid_from: Ms
    per_kwh: Num
    start_fee: Num = 0
    per_min: Num = 0


class _Spot(BaseModel):
    vehicle_id: str
    start: Ms
    name: str
    per_kwh: Num
    start_fee: Num = 0
    per_min: Num = 0


class _Receipt(BaseModel):
    amount: Num | None


class _FixedCost(BaseModel):
    name: str
    amount: Num
    period: str
    start: date
    end: date | None


class _End(BaseModel):
    end: date | None


class _Card(BaseModel):
    markup_pct: Num
    start_fee: Num


def _no_tiles(z: int, x: int, y: int) -> bytes:
    raise RuntimeError("no tile source")


def router(conn, zones: Zones, tz, capacity: Callable[[str], float],
           is_admin: Callable[[str], Awaitable[bool]], on_settings: Callable[[], None] = lambda: None,
           on_costs: Callable[[list[str] | None], None] = lambda vids: None, relabel: Callable[[], None] = lambda: None,
           tile: Callable[[int, int, int], bytes] = _no_tiles,
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

    def attempt(fn, *args):
        try:
            return fn(*args)
        except ValueError as e:
            raise HTTPException(400, str(e))
        except KeyError:
            raise _not_found()

    def edit(fn, *args) -> dict:
        attempt(fn, *args)
        on_settings()
        return {}

    def cost_edit(fn, *args, vids: list[str] | Callable[[Any], list[str]] | None = None, spot: bool = False) -> Any:
        """Every admin cost write: run it, rename the places when it changed a charge spot, then republish the cost sensors of `vids`
        (a list, None for all, or a function of the result)."""
        out = attempt(fn, *args)
        if spot:
            try:
                relabel()
            except Exception:  # the write is committed: the answer stays, the names follow at the next zone or spot change
                log.exception("renaming places after a spot change failed")
        on_costs(vids(out) if callable(vids) else vids)
        return out

    def vehicle_card(vid: str, now: int) -> dict:
        got = db.latest_at_or_before(conn, vid, now, ("battery_wh", "range_m", "gps"))
        wh, cap, pos = got.get("battery_wh"), capacity(vid), fix(got.get("gps"))
        return {
            "id": vid, "name": db.device_info(conn, vid)[0],
            "status": "driving" if store.has_open(conn, TRIP, vid) else "charging" if store.has_open(conn, CHARGE, vid) else "parked",
            "battery_wh": wh, "soc_percent": pct(wh, cap),
            "range_m": got.get("range_m"),
            "position": None if pos is None else {"lat": pos[0], "lon": pos[1], "place": zones(*pos)},
            "updated": conn.execute("SELECT MAX(t) FROM samples WHERE vehicle_id=? AND t<=? AND key NOT IN ('meta','gap')",
                                    (vid, now)).fetchone()[0],
        }

    def detail(kind: Kind, viewer: Viewer, vid: str, start: int) -> tuple[dict, dict | None]:
        visible(viewer, vid)
        row = store.row(conn, kind, vid, start)
        if row is None:
            raise _not_found()
        return row, store.series(conn, kind, vid, start)

    @r.get("/me")
    async def me(request: Request):
        v = await who(request)
        # the zone name for the page's dates; the host's fixed-offset fallback has none, and the page then keeps the browser's
        return {"user_id": v.user_id, "name": v.name, "is_admin": v.is_admin, "tz": getattr(tz, "key", None)}

    @r.get("/views")
    async def get_views(request: Request):
        return access.views(conn, await who(request))

    @r.get("/overview")
    async def overview(request: Request, view: str = ""):
        vids, now = vids_of(await who(request), view), now_ms()
        return {"vehicles": [vehicle_card(v, now) for v in vids]}

    @r.get("/activity")
    async def get_activity(request: Request, view: str = "", before: EpochMs | None = None):
        return activity.page(conn, vids_of(await who(request), view), before, now_ms(), tz, lambda v: db.device_info(conn, v)[0], capacity)

    @r.get("/stats")
    async def get_stats(request: Request, view: str = "", period: Literal["week", "month", "year"] = "week", at: date | None = None):
        vids, today = vids_of(await who(request), view), local_date(now_ms(), tz)
        if at is not None and at > today:
            raise HTTPException(422, "at is in the future")
        return stats.stats(conn, vids, period, at or today, tz, (lambda v: db.device_info(conn, v)[0]) if view.startswith("g:") else None, now_ms())

    @r.get("/map")
    async def get_map(request: Request, view: str = "", period: Literal["week", "month", "year"] = "week", at: date | None = None):
        vids, today = vids_of(await who(request), view), local_date(now_ms(), tz)
        if at is not None and at > today:
            raise HTTPException(422, "at is in the future")
        return stats.map_items(conn, vids, period, at or today, tz)

    @r.get("/tiles/{z}/{x}/{y}.png")
    async def get_tile(request: Request, z: int, x: int, y: int):
        await who(request)
        if not (0 <= z <= 19 and 0 <= x < 2**z and 0 <= y < 2**z):
            raise _not_found()
        try:
            png = await asyncio.to_thread(tile, z, x, y)
        except Exception:
            log.warning("tile %s/%s/%s failed", z, x, y, exc_info=True)
            return Response(status_code=502)
        return Response(png, media_type="image/png", headers={"Cache-Control": "private, max-age=604800"})

    @r.get("/trips/{vid}/{start}")
    async def trip(request: Request, vid: str, start: StartMs):
        row, series = detail(TRIP, await who(request), vid, start)
        return {"trip": with_figures(TRIP, row, capacity(vid)), "cost": costs.trip_cost(conn, vid, row, tz), "series": series,
                "route": store.route(conn, vid, start), "similar": stats.similar_trips(conn, vid, row)}

    @r.get("/charges/{vid}/{start}")
    async def charge(request: Request, vid: str, start: StartMs):
        row, series = detail(CHARGE, await who(request), vid, start)
        return {"charge": with_figures(CHARGE, row, capacity(vid)), "cost": costs.charge_cost(prices.book(conn, vid), row),
                "series": series, "capacity_wh": capacity(vid),
                "outside_temp_c": num(db.latest_at_or_before(conn, vid, start, ("outside_temp",)).get("outside_temp"))}

    @r.get("/samples/{vid}")
    async def raw_samples(request: Request, vid: str, key: str, start: EpochMs, end: EpochMs):
        """admin only: one key's stored samples with start <= t <= end, at most a day, for checking derived figures"""
        await who(request, admin=True)
        if db.vehicle(conn, vid) is None:
            raise _not_found()
        if not 0 <= end - start <= RAW_SPAN_MS:
            raise HTTPException(400, "span must be 0 to 1 day")
        return {"key": key, "rows": [[x.t, x.v] for x in db.samples_after(conn, vid, start - 1, end, (key,))]}

    @r.get("/settings")
    async def get_settings(request: Request):
        await who(request, admin=True)
        return access.settings(conn) | {"prices": prices.settings(conn)}

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

    @r.put("/prices/{target}")
    async def put_price(request: Request, target: str, body: _Tariff):
        await who(request, admin=True)
        cost_edit(prices.set_tariff, conn, target, body.valid_from, body.per_kwh, body.start_fee, body.per_min)
        return {}

    @r.post("/spots")
    async def create_spot(request: Request, body: _Spot):
        await who(request, admin=True)
        return {"id": cost_edit(prices.create_spot, conn, body.vehicle_id, body.start, body.name, body.per_kwh, body.start_fee, body.per_min, spot=True)}

    @r.put("/spots/{sid}")
    async def rename_spot(request: Request, sid: str, body: _Name):
        await who(request, admin=True)
        cost_edit(prices.rename_spot, conn, sid, body.name, spot=True)
        return {}

    @r.delete("/spots/{sid}")
    async def delete_spot(request: Request, sid: str):
        await who(request, admin=True)
        cost_edit(prices.delete_spot, conn, sid, spot=True)
        return {}

    @r.put("/charges/{vid}/{start}/receipt")
    async def put_receipt(request: Request, vid: str, start: StartMs, body: _Receipt):
        await who(request, admin=True)
        cost_edit(prices.set_receipt, conn, vid, start, body.amount, vids=[vid])
        return {}

    @r.post("/vehicles/{vid}/fixed_costs")
    async def add_fixed_cost(request: Request, vid: str, body: _FixedCost):
        await who(request, admin=True)
        return {"id": cost_edit(prices.add_fixed_cost, conn, vid, body.name, body.amount, body.period, body.start, body.end, vids=[vid])}

    @r.put("/fixed_costs/{cid}")
    async def end_fixed_cost(request: Request, cid: str, body: _End):
        await who(request, admin=True)
        cost_edit(prices.end_fixed_cost, conn, cid, body.end, vids=lambda vid: [vid])
        return {}

    @r.delete("/fixed_costs/{cid}")
    async def delete_fixed_cost(request: Request, cid: str):
        await who(request, admin=True)
        cost_edit(prices.delete_fixed_cost, conn, cid, vids=lambda vid: [vid])
        return {}

    @r.put("/vehicles/{vid}/card")
    async def put_card(request: Request, vid: str, body: _Card):
        await who(request, admin=True)
        cost_edit(prices.set_card, conn, vid, body.markup_pct, body.start_fee, vids=[vid])
        return {}

    return r
