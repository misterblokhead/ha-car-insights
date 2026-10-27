"""Removing a car from the page and deleting its stored history: the two vehicle routes of the page API end here."""
import asyncio
import logging
import os
from typing import Any, Awaitable, Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from . import bridge
from .const import DB_PATH, DOMAIN
from .core import db

log = logging.getLogger(__name__)
REMOVING = "car_insights_removing"  # hass.data: the vehicle ids the page is removing now (a removal in Devices & services is not in it)


def issue_id(vid: str) -> str:
    """The repair that asks whether to delete the history of a car removed in Devices & services."""
    return f"vehicle_removed_{vid}"


def entries_by_vehicle(hass: HomeAssistant) -> dict[str, ConfigEntry]:
    """The entries of the domain by vehicle id. Any state counts: a disabled or retrying entry is still the car's."""
    return {e.data["vehicle_id"]: e for e in hass.config_entries.async_entries(DOMAIN) if "vehicle_id" in e.data}


def has_entry(hass: HomeAssistant, vid: str) -> bool:
    return vid in entries_by_vehicle(hass)


def _directly(fn: Callable[[Any, str], Any], path: str, vid: str) -> Any:
    if not os.path.exists(path):  # a car that never loaded: connecting would create a database, and nothing is stored
        return None
    conn = db.connect(path)
    try:
        return fn(conn, vid)
    finally:
        conn.close()


async def _on_database(hass: HomeAssistant, vid: str, through_service: Callable[[Any], Awaitable], directly: Callable[[Any, str], Any]) -> Any:
    """Through the running service, else (the last car's removal stopped it) `directly(conn, vid)` with a connection of its own."""
    if (service := hass.data.get(DOMAIN)) is not None:
        try:
            return await through_service(service)
        except (RuntimeError, asyncio.CancelledError) as err:  # the worker stopped meanwhile, or cancelled the call as it stopped
            if isinstance(err, asyncio.CancelledError) and asyncio.current_task().cancelling():
                raise  # the caller itself was cancelled
    return await hass.async_add_executor_job(_directly, directly, hass.config.path(*DB_PATH), vid)


async def has_history(hass: HomeAssistant, vid: str) -> bool:
    """Whether a vehicles row is stored for the car."""
    return bool(await _on_database(hass, vid, lambda service: service.has_vehicle(vid), lambda conn, v: db.vehicle(conn, v) is not None))


async def purge(hass: HomeAssistant, vid: str) -> None:
    """Delete a vehicle's stored history."""
    await _on_database(hass, vid, lambda service: service.forget(vid), db.delete_vehicle)
    bridge.async_get(hass).forget(vid)  # on HA's side: the bridge outlives a service stopped with its last car
    ir.async_delete_issue(hass, DOMAIN, issue_id(vid))  # its question is answered


async def remove_vehicle(hass: HomeAssistant, vid: str, delete_history: bool) -> tuple[int, dict]:
    """Remove a car's config entry as Devices & services does, and with `delete_history` its stored history after it."""
    removing = hass.data.setdefault(REMOVING, set())
    entry = entries_by_vehicle(hass).get(vid)
    if entry is None or vid in removing:  # the second of two people removing the same car
        return 404, {"detail": "This car was already removed"}
    removing.add(vid)
    try:
        removed = await hass.config_entries.async_remove(entry.entry_id)
    except Exception:
        log.exception("Removing the entry of %s failed", vid)
        return 500, {"detail": "Could not remove the car"}
    finally:
        removing.discard(vid)
    if delete_history and removed["require_restart"]:  # its unload failed: the car is still read until a restart, which would write rows back
        log.warning("The entry of %s did not unload, so its history is kept; restart Home Assistant, then delete it", vid)
        return 200, {"removed": True, "history_deleted": False}
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
