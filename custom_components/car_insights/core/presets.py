"""Presets: which entities of a device are a car's readings, for known integrations."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RegEntry:
    registry_id: str
    entity_id: str
    domain: str
    platform: str
    translation_key: str | None
    unique_id: str


@dataclass(frozen=True)
class Preset:
    name: str
    label: str  # for people
    # reading -> (entity domain, key) candidates, best first
    readings: dict[str, tuple[tuple[str, str], ...]]
    capacity: tuple[str, str] | None = None


PRESETS: dict[str, Preset] = {
    "renault": Preset("renault", "Renault", {
        "charge_level": (("sensor", "battery_level"),),
        "odometer": (("sensor", "mileage"),),
        "charging": (("sensor", "charge_state"),),
        "plugged": (("sensor", "plug_state"),),
        "battery_energy": (("sensor", "battery_available_energy"),),
        "range": (("sensor", "battery_autonomy"),),
        "location": (("device_tracker", "location"),),
        "report_time": (("sensor", "battery_last_activity"),),
    }),
    "stellantis_vehicles": Preset("stellantis", "Stellantis", {
        "charge_level": (("sensor", "battery"),),
        "odometer": (("sensor", "mileage"),),
        "charging": (("binary_sensor", "battery_charging"),),
        "plugged": (("binary_sensor", "battery_plugged"),),
        "battery_energy": (("sensor", "battery_residual"),),
        "range": (("sensor", "autonomy"),),
        "location": (("device_tracker", "vehicle"),),
        "speed": (("sensor", "speed"),),
        "ignition": (("binary_sensor", "engine"), ("binary_sensor", "moving")),
    }, capacity=("sensor", "battery_capacity")),
}


def _find(integration: str, entries: list[RegEntry], domain: str, key: str) -> RegEntry | None:
    pool = [e for e in entries if e.platform == integration and e.domain == domain]
    for e in pool:
        if e.translation_key == key:
            return e
    return next((e for e in pool if e.unique_id.endswith("_" + key)), None)


def match(integration: str | None, entries: list[RegEntry]) -> tuple[str | None, dict[str, str]]:
    preset = PRESETS.get(integration or "")
    if preset is None:
        return None, {}
    got: dict[str, str] = {}
    for reading, candidates in preset.readings.items():
        for domain, key in candidates:
            if (e := _find(integration, entries, domain, key)) is not None:
                got[reading] = e.registry_id
                break
    return preset.name, got


def capacity_entry(integration: str | None, entries: list[RegEntry]) -> RegEntry | None:
    preset = PRESETS.get(integration or "")
    if preset is None or preset.capacity is None:
        return None
    return _find(integration, entries, *preset.capacity)
