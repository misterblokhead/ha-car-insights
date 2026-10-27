"""Home Assistant's side of a cloud source: a device's registry entries, entity ids as registry ids, the 1.0.0 options and the poller's conf."""
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .core.ha_entities import LEGACY
from .core.poller import SourceConf, legacy_source_id
from .core.presets import PRESETS, RegEntry

log = logging.getLogger(__name__)


def device_entries(hass: HomeAssistant, device_id: str) -> tuple[str | None, list[RegEntry]]:
    """(the integration of a device, its registry entries): the first of its integrations that has a preset, else the first one."""
    device = dr.async_get(hass).async_get(device_id)
    if device is None:
        return None, []
    domains = sorted({e.domain for eid in device.config_entries if (e := hass.config_entries.async_get_entry(eid))})
    domain = next((d for d in domains if d in PRESETS), domains[0] if domains else None)
    return domain, [RegEntry(e.id, e.entity_id, e.entity_id.partition(".")[0], e.platform, e.translation_key, e.unique_id)
                    for e in er.async_entries_for_device(er.async_get(hass), device_id)]


def to_registry_ids(hass: HomeAssistant, entity_ids: dict[str, str]) -> dict[str, str]:
    """reading -> entity id into reading -> registry id; an entity that is not in the registry is left out"""
    reg = er.async_get(hass)
    return {r: e.id for r, eid in entity_ids.items() if (e := reg.async_get(eid)) is not None}


def to_entity_ids(hass: HomeAssistant, registry_ids: dict[str, str]) -> dict[str, str]:
    """reading -> registry id into reading -> entity id; a removed entity is left out"""
    reg = er.async_get(hass)
    return {r: e.entity_id for r, rid in registry_ids.items() if (e := reg.async_get(rid)) is not None}


def convert_legacy(hass: HomeAssistant, vehicle_id: str, old: dict) -> dict:
    """The 1.0.0 cloud options ({"mapping", "entity_stem"}) as the cloud options of 1.1.0. The source id stays the old one, so the stored cursor
    carries on. An entity that is not in the registry stays in `entities` as its entity id (the registry takes either): the poller reports
    it as missing, and it is found again when the entity comes back. Raises ValueError for another mapping or a missing stem."""
    legacy = LEGACY.get(old["mapping"])
    if legacy is None:
        raise ValueError(f"no 1.0.0 mapping named {old['mapping']!r}")
    if not isinstance(stem := old.get("entity_stem"), str):
        raise ValueError("no entity_stem")
    wanted = {r: tpl.format(stem=stem) for r, tpl in legacy.items()}
    found = to_registry_ids(hass, wanted)
    entities = {r: found.get(r, eid) for r, eid in wanted.items()}
    reg = er.async_get(hass)
    device_id = next((e.device_id for rid in entities.values() if (e := reg.async_get(rid)) is not None and e.device_id), None)
    return {"preset": old["mapping"], "device_id": device_id, "entities": entities, "source_id": legacy_source_id(old["mapping"], stem)}


def source_conf(entry: ConfigEntry) -> SourceConf | None:
    """The poller's conf from an entry's cloud options; None for an entry without a cloud source or with options that do not fit."""
    cloud = entry.options.get("cloud")
    if not cloud:
        return None
    try:
        return SourceConf(entry.data["vehicle_id"], cloud["source_id"], dict(cloud["entities"]), "webhook_id" in entry.data)
    except (KeyError, TypeError, ValueError):
        log.warning("Skipping the cloud source of %s: its options do not fit", entry.title)
        return None
