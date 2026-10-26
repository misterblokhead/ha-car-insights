"""Home Assistant MQTT discovery helpers shared by the live, trip and totals sensors."""
import json
from typing import Any, Protocol


class Sink(Protocol):
    def publish(self, messages: list[tuple[str, str]], retain: bool = True) -> None: ...


def sensor(name: str, unit: str | None = None, device_class: str | None = None, measurement: bool = True, **extra) -> tuple[str, dict]:
    cfg = {"name": name, "state_topic": "state", **extra}
    for k, v in (("unit_of_measurement", unit), ("device_class", device_class), ("state_class", "measurement" if measurement else None)):
        if v:
            cfg[k] = v
    return "sensor", cfg


def topic(vehicle_id: str, leaf: str) -> str:
    return f"car_insights/{vehicle_id}/{leaf}"


def device(vehicle_id: str, name: str, make: str | None, model: str | None) -> dict:
    d = {"identifiers": [f"car_insights_{vehicle_id}"], "name": name, "manufacturer": make, "model": model}
    return {k: v for k, v in d.items() if v is not None}  # HA rejects null strings


def config(vehicle_id: str, unique: str, extra: dict, dev: dict) -> dict:
    """Discovery config shared by the sensors: keys ending in _topic hold a leaf, expanded to the full topic."""
    cfg: dict[str, Any] = {"unique_id": f"car_insights_{vehicle_id}_{unique}", "device": dev}
    cfg.update({k: topic(vehicle_id, v) if k.endswith("_topic") else v for k, v in extra.items()})
    return cfg


def discovery(key: str, dev: dict, specs: dict[str, tuple[str, dict]]) -> list[tuple[str, str]]:
    """One retained discovery message per spec: field -> (component, extra config)."""
    return [(f"homeassistant/{comp}/{key}_{f}/config", json.dumps(config(key, f, extra, dev))) for f, (comp, extra) in specs.items()]
