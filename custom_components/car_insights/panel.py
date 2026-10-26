"""The static path for the page and its sidebar panel."""
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN
from .views import UiView

log = logging.getLogger(__name__)
PANEL = "car_insights"
_HTTP = "car_insights_http"  # not DOMAIN: that key is the Service


async def async_register_http(hass: HomeAssistant) -> None:
    """The view and the static path cannot be unregistered: once per HA run."""
    if hass.data.get(_HTTP):
        return
    hass.data[_HTTP] = True
    hass.http.register_view(UiView())
    directory = Path(__file__).parent / "frontend"
    if await hass.async_add_executor_job(directory.is_dir):
        await hass.http.async_register_static_paths([StaticPathConfig("/car_insights_static", str(directory), cache_headers=False)])
    else:
        log.error("The page is missing (%s): the Car Insights panel will not load", directory)


async def async_register_panel(hass: HomeAssistant) -> None:
    if PANEL in hass.data.get(frontend.DATA_PANELS, {}):
        return
    version = (await async_get_integration(hass, DOMAIN)).version
    await panel_custom.async_register_panel(
        hass, frontend_url_path=PANEL, webcomponent_name="car-insights-panel",
        module_url=f"/car_insights_static/panel.js?v={version}", sidebar_title="Car Insights",
        sidebar_icon="mdi:car-electric", embed_iframe=True, require_admin=False)


def remove_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL, warn_if_unknown=False)
