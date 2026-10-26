"""Home Assistant's backup hooks: the database file must hold everything while it is copied, and nothing may write to it meanwhile."""
from homeassistant.core import HomeAssistant

from .const import DOMAIN


async def async_pre_backup(hass: HomeAssistant) -> None:
    if service := hass.data.get(DOMAIN):
        await service.pause()


async def async_post_backup(hass: HomeAssistant) -> None:
    if service := hass.data.get(DOMAIN):
        service.resume()
