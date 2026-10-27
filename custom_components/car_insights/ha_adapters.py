"""What the worker thread reads from Home Assistant: zones, recorder history, language. Each call hops to HA's loop and waits for the answer."""
import asyncio
from datetime import datetime
from functools import partial
from typing import Any, Coroutine, Sequence

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.history import get_significant_states
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .core.zones import Zone

CALL_TIMEOUT_S = 10
HISTORY_TIMEOUT_S = 60  # the first poll asks for 10 days and the recorder may need a while: a timeout would repeat the same query forever


def _on_ha(hass: HomeAssistant, coro: Coroutine, timeout: float) -> Any:
    """Run `coro` on HA's loop and wait for it from a worker thread. Never waits forever: it raises RuntimeError when HA is stopping and
    TimeoutError when HA does not answer, so a worker job cannot hold up the worker's own stop."""
    try:
        if hass.is_stopping:
            raise RuntimeError("Home Assistant is stopping")
        future = asyncio.run_coroutine_threadsafe(coro, hass.loop)
    except BaseException:
        coro.close()
        raise
    try:
        return future.result(timeout)
    except BaseException:
        future.cancel()
        raise


def _is_num(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def zones(hass: HomeAssistant) -> list[Zone]:
    async def read() -> list[Zone]:
        out = []
        for s in hass.states.async_all("zone"):
            a = s.attributes
            if _is_num(a.get("latitude")) and _is_num(a.get("longitude")) and _is_num(a.get("radius")):
                out.append(Zone(s.name, a["latitude"], a["longitude"], a["radius"], bool(a.get("passive"))))
        return out

    return _on_ha(hass, read(), CALL_TIMEOUT_S)


def history(hass: HomeAssistant, ids: list[str], start_ms: int, end_ms: int, attr_ids: Sequence[str] = ()) -> list[list[dict]]:
    """Every state change of the entities between two epoch-ms times in the REST history shape (only an entity's first row has its id).
    The rows of `attr_ids` also carry `attributes` and `last_updated` (a tracker moves while its state stays the same); the others have neither."""
    def at(ms: int) -> datetime:
        return dt_util.utc_from_timestamp(ms / 1000)

    async def read(who: list[str], attrs: bool) -> dict:
        if not who:
            return {}
        return await get_instance(hass).async_add_executor_job(partial(
            get_significant_states, hass, at(start_ms), at(end_ms), who,
            significant_changes_only=False, minimal_response=not attrs, no_attributes=not attrs))

    async def read_both() -> dict:
        return {**await read([i for i in ids if i not in attr_ids], False), **await read([i for i in ids if i in attr_ids], True)}

    by_entity = _on_ha(hass, read_both(), HISTORY_TIMEOUT_S)

    def row(r, attrs: bool) -> dict:
        if isinstance(r, dict):  # a minimal row: the recorder returns a State first and bare {state, last_changed} dicts after it
            return r
        out = {"state": r.state, "last_changed": r.last_changed.isoformat()}
        return {**out, "last_updated": r.last_updated.isoformat(), "attributes": dict(r.attributes)} if attrs else out

    out = []
    for eid in ids:  # an entity without rows is left out
        rows = [row(r, eid in attr_ids) for r in by_entity.get(eid, [])]
        if rows:
            out.append([{"entity_id": eid, **rows[0]}, *rows[1:]])
    return out


def resolve(hass: HomeAssistant, registry_ids: list[str]) -> dict[str, tuple[str, str | None]]:
    """Entity registry id -> (entity id, the unit its state carries now); a removed or disabled entity is left out."""
    async def read() -> dict:
        reg, out = er.async_get(hass), {}
        for rid in registry_ids:
            e = reg.async_get(rid)
            if e is not None and not e.disabled_by:
                s = hass.states.get(e.entity_id)
                out[rid] = (e.entity_id, s.attributes.get("unit_of_measurement") if s else None)
        return out

    return _on_ha(hass, read(), CALL_TIMEOUT_S)


def language(hass: HomeAssistant) -> str:
    return hass.config.language or "en"
