"""The page's API as plain Python: a request in, `(status, json-able)` out, and only what the viewer may see.
Whoever serves it (Home Assistant's views, the demo server) owns transport and authentication and passes the authenticated `Viewer`."""
import logging
import re
import time
from datetime import date
from typing import Any, Callable

import voluptuous as vol

from . import access, activity, costs, db, prices, stats, store
from .access import Viewer
from .figures import pct, with_figures
from .periods import local_date, midnight_ms
from .zones import Zones
from .kinds import CHARGE, TRIP, Kind
from .protocol import fix, num

log = logging.getLogger(__name__)
RAW_SPAN_MS = 86_400_000
SILENT_MS = 7 * 86_400_000  # a cloud-only car quiet this long shows "No data since"


class ApiError(Exception):
    """An error reply: `handle` answers `(status, {"detail": detail})`."""

    def __init__(self, status: int, detail: str):
        super().__init__(detail)
        self.status, self.detail = status, detail


def _not_found() -> ApiError:
    return ApiError(404, "not found")  # one body for unknown and hidden alike: a viewer cannot probe for other vehicles


# --- validation: query and path values are strings, a body is parsed JSON ---

def _ms(v):
    """epoch ms: a whole number (not a boolean), and below 2**62 because sqlite integers are 64-bit: larger would be a 500, not a 422"""
    if type(v) is not int or not 0 <= v < 2**62:
        raise vol.Invalid("expected whole milliseconds")
    return v


def _digits(raw):
    if not (isinstance(raw, str) and raw.isascii() and raw.isdigit() and len(raw) <= 19):  # the length keeps int() clear of its digit limit
        raise vol.Invalid("expected whole milliseconds")
    return int(raw)


def _num(v):
    """a JSON number as a float; strict: a boolean is none (prices._num would take a JSON true as 1)"""
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        raise vol.Invalid("expected a number")
    try:
        return float(v)
    except OverflowError:
        raise vol.Invalid("number too large")


def _date(v):
    try:
        return date.fromisoformat(v)
    except (TypeError, ValueError):
        raise vol.Invalid("expected a date as YYYY-MM-DD")


_EPOCH, _DAY, _STR = vol.Schema(vol.All(_digits, _ms)), vol.Schema(_date), vol.Schema(str)
_PERIOD = vol.Schema(vol.In(("week", "month", "year")))


def _shape(fields: dict) -> vol.Schema:
    """a body with all its fields required (Optional ones aside); fields it does not know are ignored"""
    return vol.Schema(fields, required=True, extra=vol.REMOVE_EXTRA)


_NAME = _shape({"name": str})
_VEHICLE = _shape({"group_id": vol.Any(None, str), "viewers": [str]})
_TARIFF = _shape({"valid_from": _ms, "per_kwh": _num, vol.Optional("start_fee", default=0): _num, vol.Optional("per_min", default=0): _num})
_SPOT = _shape({"vehicle_id": str, "start": _ms, "name": str, "per_kwh": _num,
                vol.Optional("start_fee", default=0): _num, vol.Optional("per_min", default=0): _num})
_RECEIPT = _shape({"amount": vol.Any(None, _num)})
_FIXED_COST = _shape({"name": str, "amount": _num, "period": str, "start": _date, "end": vol.Any(None, _date)})
_END = _shape({"end": vol.Any(None, _date)})
_CARD = _shape({"markup_pct": _num, "start_fee": _num})


def _body(schema: vol.Schema, body: Any) -> dict:
    try:
        return schema(body)
    except vol.Invalid as e:
        raise ApiError(422, f"invalid body: {e}")


def _arg(check: vol.Schema, raw: str, what: str) -> Any:
    try:
        return check(raw)
    except vol.Invalid as e:
        raise ApiError(422, f"invalid {what}: {e.msg}")


def _query(q: dict[str, str], key: str, check: vol.Schema, required: bool = False) -> Any:
    if key not in q:
        if required:
            raise ApiError(422, f"{key} is required")
        return None
    return _arg(check, q[key], key)


def _admin(fn):
    """Marks a handler for admins only: `handle` answers 403 to anyone else before reading the request."""
    fn.admin = True
    return fn


class UiApi:
    """The page's routes over `conn`. Handlers are plain functions with no awaits: `handle` is async so a caller can run it on its own
    worker loop, one call at a time, which keeps the connection to one thread."""

    def __init__(self, conn, zones: Zones, tz, capacity: Callable[[str], float], on_settings: Callable[[], None] = lambda: None,
                 on_costs: Callable[[list[str] | None], None] = lambda vids: None, relabel: Callable[[], None] = lambda: None,
                 now_ms: Callable[[], int] = lambda: int(time.time() * 1000),
                 entry_vehicles: Callable[[], frozenset[str]] = frozenset):
        self.conn, self.zones, self.tz, self.capacity = conn, zones, tz, capacity
        self.on_settings, self.on_costs, self.relabel, self.now_ms = on_settings, on_costs, relabel, now_ms
        self.entry_vehicles = entry_vehicles  # the vehicle ids that still have a config entry; any other stored vehicle is archived

    async def handle(self, method: str, path: str, query: dict[str, str], body: Any, viewer: Viewer) -> tuple[int, Any]:
        """`path` is relative to /api/car_insights/ui. An admin-only route answers a non-admin 403 before anything else (so before a bad
        body is a 422 that describes the API); every other answered request notes the viewer as seen."""
        try:
            hits = [(m, fn, hit.groupdict()) for m, pattern, fn in ROUTES if (hit := pattern.fullmatch(path))]
            if not hits:
                raise _not_found()
            route = next((h for h in hits if h[0] == method), None)
            if route is None:
                raise ApiError(405, "method not allowed")
            _, fn, params = route
            if getattr(fn, "admin", False) and not viewer.is_admin:
                raise ApiError(403, "forbidden")
            access.see(self.conn, viewer, self.now_ms())
            return 200, fn(self, viewer, params, query, body)
        except ApiError as e:
            return e.status, {"detail": e.detail}

    def _vids(self, viewer: Viewer, view: str) -> list[str]:
        v = access.resolve(self.conn, viewer, view)
        if v is None:
            raise _not_found()
        return v

    def _scope(self, viewer: Viewer, q: dict[str, str]) -> tuple[list[str], date, str]:
        """The viewer's vehicles for the query's `view`, the date a period page is about (today when `at` is not given; a future one is a 422)
        and the period. A malformed value is a 422 before a hidden view is a 404."""
        period, at = _arg(_PERIOD, q.get("period", "week"), "period"), _query(q, "at", _DAY)
        vids, today = self._vids(viewer, q.get("view", "")), local_date(self.now_ms(), self.tz)
        if at is not None and at > today:
            raise ApiError(422, "at is in the future")
        return vids, at or today, period

    def _visible(self, viewer: Viewer, vid: str) -> None:
        if vid not in access.visible_vehicles(self.conn, viewer):
            raise _not_found()

    def _attempt(self, fn, *args):
        try:
            return fn(*args)
        except ValueError as e:
            raise ApiError(400, str(e))
        except KeyError:
            raise _not_found()

    def _edit(self, fn, *args) -> dict:
        self._attempt(fn, *args)
        self.on_settings()
        return {}

    def _cost_edit(self, fn, *args, vids: list[str] | Callable[[Any], list[str]] | None = None, spot: bool = False) -> Any:
        """Every admin cost write: run it, rename the places when it changed a charge spot, then republish the cost sensors of `vids`
        (a list, None for all, or a function of the result)."""
        out = self._attempt(fn, *args)
        if spot:
            try:
                self.relabel()
            except Exception:  # the write is committed: the answer stays, the names follow at the next zone or spot change
                log.exception("renaming places after a spot change failed")
        self.on_costs(vids(out) if callable(vids) else vids)
        return out

    def _vehicle_card(self, vid: str, now: int) -> dict:
        conn = self.conn
        got = db.latest_at_or_before(conn, vid, now, ("battery_wh", "range_m", "gps", "soc_percent"))
        wh, cap, pos = got.get("battery_wh"), self.capacity(vid), fix(got.get("gps"))
        updated = conn.execute("SELECT MAX(t) FROM samples WHERE vehicle_id=? AND t<=? AND key NOT IN ('meta','gap')", (vid, now)).fetchone()[0]
        status = ("no_data" if updated is not None and updated < now - SILENT_MS and db.is_cloud_only(conn, vid)
                  else "driving" if store.has_open(conn, TRIP, vid) else "charging" if store.has_open(conn, CHARGE, vid) else "parked")
        return {
            "id": vid, "name": db.device_info(conn, vid)[0],
            "status": status,
            "battery_wh": wh, "soc_percent": pct(wh, cap) if wh is not None else pct(num(got.get("soc_percent")), 100),
            "range_m": got.get("range_m"),
            "position": None if pos is None else {"lat": pos[0], "lon": pos[1], "place": self.zones(*pos)},
            "updated": updated,
        }

    def _detail(self, kind: Kind, viewer: Viewer, vid: str, start: int) -> tuple[dict, dict | None]:
        self._visible(viewer, vid)
        row = store.row(self.conn, kind, vid, start)
        if row is None:
            raise _not_found()
        return row, store.series(self.conn, kind, vid, start)

    def _me(self, viewer, p, q, body):
        # the zone name for the page's dates; the host's fixed-offset fallback has none, and the page then keeps the browser's
        return {"user_id": viewer.user_id, "name": viewer.name, "is_admin": viewer.is_admin, "tz": getattr(self.tz, "key", None)}

    def _views(self, viewer, p, q, body):
        return access.views(self.conn, viewer)

    def _overview(self, viewer, p, q, body):
        vids, now = self._vids(viewer, q.get("view", "")), self.now_ms()
        return {"vehicles": [self._vehicle_card(v, now) for v in vids]}

    def _activity(self, viewer, p, q, body):
        before = _query(q, "before", _EPOCH)
        return activity.page(self.conn, self._vids(viewer, q.get("view", "")), before, self.now_ms(), self.tz,
                             lambda v: db.device_info(self.conn, v)[0], self.capacity)

    def _stats(self, viewer, p, q, body):
        vids, day, period = self._scope(viewer, q)
        return stats.stats(self.conn, vids, period, day, self.tz, (lambda v: db.device_info(self.conn, v)[0]) if q.get("view", "").startswith("g:") else None,
                           self.now_ms())

    def _map(self, viewer, p, q, body):
        vids, day, period = self._scope(viewer, q)
        return stats.map_items(self.conn, vids, period, day, self.tz)

    def _trip(self, viewer, p, q, body):
        vid, start = p["vid"], _arg(_EPOCH, p["start"], "start")
        row, series = self._detail(TRIP, viewer, vid, start)
        return {"trip": with_figures(TRIP, row, self.capacity(vid)), "cost": costs.trip_cost(self.conn, vid, row, self.tz), "series": series,
                "route": store.route(self.conn, vid, start), "similar": stats.similar_trips(self.conn, vid, row)}

    def _charge(self, viewer, p, q, body):
        vid, start = p["vid"], _arg(_EPOCH, p["start"], "start")
        row, series = self._detail(CHARGE, viewer, vid, start)
        return {"charge": with_figures(CHARGE, row, self.capacity(vid)), "cost": costs.charge_cost(prices.book(self.conn, vid), row),
                "series": series, "capacity_wh": self.capacity(vid),
                "outside_temp_c": num(db.latest_at_or_before(self.conn, vid, start, ("outside_temp",)).get("outside_temp"))}

    @_admin
    def _raw_samples(self, viewer, p, q, body):
        """one key's stored samples with start <= t <= end, at most a day, for checking derived figures"""
        key, start, end = _query(q, "key", _STR, True), _query(q, "start", _EPOCH, True), _query(q, "end", _EPOCH, True)
        if db.vehicle(self.conn, p["vid"]) is None:
            raise _not_found()
        if not 0 <= end - start <= RAW_SPAN_MS:
            raise ApiError(400, "span must be 0 to 1 day")
        return {"key": key, "rows": [[x.t, x.v] for x in db.samples_after(self.conn, p["vid"], start - 1, end, (key,))]}

    @_admin
    def _settings(self, viewer, p, q, body):
        return access.settings(self.conn, self.entry_vehicles()) | {"prices": prices.settings(self.conn)}

    @_admin
    def _create_group(self, viewer, p, q, body):
        gid = self._attempt(access.create_group, self.conn, _body(_NAME, body)["name"])
        self.on_settings()
        return {"id": gid}

    @_admin
    def _rename_group(self, viewer, p, q, body):
        return self._edit(access.rename_group, self.conn, p["gid"], _body(_NAME, body)["name"])

    @_admin
    def _delete_group(self, viewer, p, q, body):
        return self._edit(access.delete_group, self.conn, p["gid"])

    @_admin
    def _put_vehicle(self, viewer, p, q, body):
        b = _body(_VEHICLE, body)
        return self._edit(access.set_vehicle, self.conn, p["vid"], b["group_id"], b["viewers"])

    @_admin
    def _put_price(self, viewer, p, q, body):
        b = _body(_TARIFF, body)
        self._cost_edit(prices.set_tariff, self.conn, p["target"], b["valid_from"], b["per_kwh"], b["start_fee"], b["per_min"])
        return {}

    @_admin
    def _create_spot(self, viewer, p, q, body):
        b = _body(_SPOT, body)
        # from the charge day's midnight, like every price on Settings: a re-derived charge may start a little earlier
        return {"id": self._cost_edit(prices.create_spot, self.conn, b["vehicle_id"], b["start"], b["name"], b["per_kwh"], b["start_fee"], b["per_min"],
                                      midnight_ms(local_date(b["start"], self.tz), self.tz), spot=True)}

    @_admin
    def _rename_spot(self, viewer, p, q, body):
        self._cost_edit(prices.rename_spot, self.conn, p["sid"], _body(_NAME, body)["name"], spot=True)
        return {}

    @_admin
    def _delete_spot(self, viewer, p, q, body):
        self._cost_edit(prices.delete_spot, self.conn, p["sid"], spot=True)
        return {}

    @_admin
    def _put_receipt(self, viewer, p, q, body):
        start = _arg(_EPOCH, p["start"], "start")
        self._cost_edit(prices.set_receipt, self.conn, p["vid"], start, _body(_RECEIPT, body)["amount"], vids=[p["vid"]])
        return {}

    @_admin
    def _add_fixed_cost(self, viewer, p, q, body):
        b = _body(_FIXED_COST, body)
        return {"id": self._cost_edit(prices.add_fixed_cost, self.conn, p["vid"], b["name"], b["amount"], b["period"], b["start"], b["end"],
                                      vids=[p["vid"]])}

    @_admin
    def _end_fixed_cost(self, viewer, p, q, body):
        self._cost_edit(prices.end_fixed_cost, self.conn, p["cid"], _body(_END, body)["end"], vids=lambda vid: [vid])
        return {}

    @_admin
    def _delete_fixed_cost(self, viewer, p, q, body):
        self._cost_edit(prices.delete_fixed_cost, self.conn, p["cid"], vids=lambda vid: [vid])
        return {}

    @_admin
    def _put_card(self, viewer, p, q, body):
        b = _body(_CARD, body)
        self._cost_edit(prices.set_card, self.conn, p["vid"], b["markup_pct"], b["start_fee"], vids=[p["vid"]])
        return {}


def _route(method: str, template: str, handler: Callable) -> tuple[str, re.Pattern, Callable]:
    """`{name}` in the template matches one path segment"""
    return method, re.compile(re.sub(r"\{(\w+)\}", r"(?P<\1>[^/]+)", template)), handler


ROUTES = [_route(*r) for r in (
    ("GET", "/me", UiApi._me),
    ("GET", "/views", UiApi._views),
    ("GET", "/overview", UiApi._overview),
    ("GET", "/activity", UiApi._activity),
    ("GET", "/stats", UiApi._stats),
    ("GET", "/map", UiApi._map),
    ("GET", "/trips/{vid}/{start}", UiApi._trip),
    ("GET", "/charges/{vid}/{start}", UiApi._charge),
    ("GET", "/samples/{vid}", UiApi._raw_samples),
    ("GET", "/settings", UiApi._settings),
    ("POST", "/groups", UiApi._create_group),
    ("PUT", "/groups/{gid}", UiApi._rename_group),
    ("DELETE", "/groups/{gid}", UiApi._delete_group),
    ("PUT", "/vehicles/{vid}", UiApi._put_vehicle),
    ("PUT", "/prices/{target}", UiApi._put_price),
    ("POST", "/spots", UiApi._create_spot),
    ("PUT", "/spots/{sid}", UiApi._rename_spot),
    ("DELETE", "/spots/{sid}", UiApi._delete_spot),
    ("PUT", "/charges/{vid}/{start}/receipt", UiApi._put_receipt),
    ("POST", "/vehicles/{vid}/fixed_costs", UiApi._add_fixed_cost),
    ("PUT", "/fixed_costs/{cid}", UiApi._end_fixed_cost),
    ("DELETE", "/fixed_costs/{cid}", UiApi._delete_fixed_cost),
    ("PUT", "/vehicles/{vid}/card", UiApi._put_card),
)]
