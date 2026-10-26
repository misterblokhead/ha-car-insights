"""The page API through Home Assistant's own HTTP: HA authenticates, the worker answers."""
import json
from http import HTTPStatus

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.http import KEY_HASS

from .const import DOMAIN
from .core.access import Viewer
from .receiver import read_limited

MAX_UI_BODY = 1024 * 1024


def _reject_constant(name: str):
    raise ValueError(name)  # NaN / Infinity are not JSON


class UiView(HomeAssistantView):
    url = "/api/car_insights/ui/{path:.*}"
    name = "api:car_insights:ui"
    requires_auth = True

    async def _handle(self, request: web.Request, path: str) -> web.Response:
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
