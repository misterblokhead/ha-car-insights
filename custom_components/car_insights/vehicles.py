"""Removing a car from the page and deleting its stored history: the two vehicle routes of the page API end here."""
import logging
import os

from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .core import db

log = logging.getLogger(__name__)
REMOVING = "car_insights_removing"  # hass.data: the vehicle ids the page is removing now (a removal in Devices & services is not in it)


def has_entry(hass: HomeAssistant, vid: str) -> bool:
    """Any state counts: a disabled or retrying entry is still the car's."""
    return any(e.data.get("vehicle_id") == vid for e in hass.config_entries.async_entries(DOMAIN))


def _delete_directly(path: str, vid: str) -> None:
    conn = db.connect(path)
    try:
        db.delete_vehicle(conn, vid)
    finally:
        conn.close()


def _stored_directly(path: str, vid: str) -> bool:
    if not os.path.exists(path):  # a car that never loaded: connecting would create a database
        return False
    conn = db.connect(path)
    try:
        return conn.execute("SELECT 1 FROM vehicles WHERE vehicle_id=?", (vid,)).fetchone() is not None
    finally:
        conn.close()


async def has_history(hass: HomeAssistant, vid: str) -> bool:
    """Whether a vehicles row is stored for the car: through the running service, else (the last car's removal stopped it) with a connection of its own."""
    if (service := hass.data.get(DOMAIN)) is not None:
        try:
            return await service.has_vehicle(vid)
        except RuntimeError:  # the worker stopped meanwhile
            pass
    return await hass.async_add_executor_job(_stored_directly, hass.config.path("car_insights", "car_insights.db"), vid)


async def purge(hass: HomeAssistant, vid: str) -> None:
    """Delete a vehicle's stored history: through the running service, else (the last car's removal stopped it) with a connection of its own."""
    if (service := hass.data.get(DOMAIN)) is not None:
        try:
            return await service.forget(vid)
        except RuntimeError:  # the worker stopped meanwhile
            pass
    await hass.async_add_executor_job(_delete_directly, hass.config.path("car_insights", "car_insights.db"), vid)


async def remove_vehicle(hass: HomeAssistant, vid: str, delete_history: bool) -> tuple[int, dict]:
    """Remove a car's config entry as Devices & services does, and with `delete_history` its stored history after it."""
    removing = hass.data.setdefault(REMOVING, set())
    entry = next((e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get("vehicle_id") == vid), None)
    if entry is None or vid in removing:  # the second of two people removing the same car
        return 404, {"detail": "This car was already removed"}
    removing.add(vid)
    try:
        await hass.config_entries.async_remove(entry.entry_id)
    except Exception:
        log.exception("Removing the entry of %s failed", vid)
        return 500, {"detail": "Could not remove the car"}
    finally:
        removing.discard(vid)
    if delete_history:
        try:
            await purge(hass, vid)
        except Exception:
            log.exception("Deleting the history of %s failed", vid)
            return 200, {"removed": True, "history_deleted": False}
    return 200, {"removed": True, "history_deleted": delete_history}


async def delete_history(hass: HomeAssistant, vid: str) -> tuple[int, dict]:
    """Delete the stored history of a car that has no entry any more (an archived one); idempotent."""
    if has_entry(hass, vid):
        return 409, {"detail": "Remove the car first"}
    try:
        await purge(hass, vid)
    except Exception:
        log.exception("Deleting the history of %s failed", vid)
        return 500, {"detail": "Its history could not be deleted"}
    return 200, {"history_deleted": True}
