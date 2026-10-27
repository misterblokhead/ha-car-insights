"""The page API through Home Assistant's own HTTP: HA authenticates, the worker answers."""
import json
import re
from http import HTTPStatus

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.http import KEY_HASS

from . import vehicles
from .const import DOMAIN
from .core.access import Viewer
from .receiver import read_limited

MAX_UI_BODY = 1024 * 1024
VEHICLE_ROUTE = re.compile(r"vehicles/([^/]+)(/history)?")  # DELETE: remove a car / delete an archived car's history


def _reject_constant(name: str):
    raise ValueError(name)  # NaN / Infinity are not JSON


class UiView(HomeAssistantView):
    url = "/api/car_insights/ui/{path:.*}"
    name = "api:car_insights:ui"
    requires_auth = True

    async def _remove(self, request: web.Request, vid: str, history_only: bool) -> web.Response:
        """Not through the worker: removing the last car stops it, and the deletion still has to happen."""
        if not request["hass_user"].is_admin:
            return self.json({"detail": "admin only"}, status_code=HTTPStatus.FORBIDDEN)
        hass = request.app[KEY_HASS]
        if history_only:
            status, reply = await vehicles.delete_history(hass, vid)
        elif (choice := request.query.get("history")) in ("keep", "delete"):  # no default: a missing choice must not delete or keep by chance
            status, reply = await vehicles.remove_vehicle(hass, vid, choice == "delete")
        else:
            status, reply = HTTPStatus.UNPROCESSABLE_ENTITY, {"detail": "history must be keep or delete"}
        return self.json(reply, status_code=status)

    async def _handle(self, request: web.Request, path: str) -> web.Response:
        if request.method == "DELETE" and (route := VEHICLE_ROUTE.fullmatch(path)):
            return await self._remove(request, route[1], route[2] is not None)
        service = request.app[KEY_HASS].data.get(DOMAIN)
        if service is None:
            return self.json({"detail": "not ready"}, status_code=HTTPStatus.SERVICE_UNAVAILABLE)
        body = None
        if request.method in ("POST", "PUT"):
            if (request.content_length or 0) > MAX_UI_BODY:
                return self.json({"detail": "body too large"}, status_code=HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
            raw = await read_limited(request.content, MAX_UI_BODY)
            if raw is None:
                return self.json({"detail": "body too large"}, status_code=HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
            if raw.strip():
                try:
                    body = json.loads(raw, parse_constant=_reject_constant)
                except ValueError:  # includes bad UTF-8
                    return self.json({"detail": "invalid JSON"}, status_code=HTTPStatus.BAD_REQUEST)
        user = request["hass_user"]
        status, reply = await service.ui(request.method, "/" + path, dict(request.query), body, Viewer(user.id, user.name, user.is_admin))
        return self.json(reply, status_code=status)

    async def get(self, request, path):
        return await self._handle(request, path)

    post = put = delete = get
