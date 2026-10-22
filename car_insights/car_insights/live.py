import json
import math
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Iterable

from .protocol import Sample

PARK_GEAR = 4
FUTURE_SLACK_MS = 86_400_000
MODES = ("driving", "charging", "parked")


def _sensor(name: str, unit: str | None = None, device_class: str | None = None, measurement: bool = True, **extra) -> tuple[str, dict]:
    cfg = {"name": name, "state_topic": "state", **extra}
    for k, v in (("unit_of_measurement", unit), ("device_class", device_class), ("state_class", "measurement" if measurement else None)):
        if v:
            cfg[k] = v
    return "sensor", cfg


# field -> (component, extra discovery config); keys ending in _topic hold a leaf under car_insights/<vehicle>/
FIELDS: dict[str, tuple[str, dict]] = {
    "speed_kmh": _sensor("Speed", "km/h", "speed"),
    "soc": _sensor("State of charge", "%", "battery"),
    "battery_kwh": _sensor("Battery energy", "kWh", "energy_storage"),
    "range_km": _sensor("Range", "km", "distance"),
    "power_kw": _sensor("Power", "kW", "power"),
    "outside_temp": _sensor("Outside temperature", "°C", "temperature"),
    "status": _sensor("Status", None, "enum", measurement=False, options=list(MODES)),
    "last_seen": _sensor("Last seen", None, "timestamp", measurement=False),
    "plugged": ("binary_sensor", {"name": "Plugged in", "state_topic": "state", "device_class": "plug", "payload_on": "ON", "payload_off": "OFF"}),
    "location": ("device_tracker", {"name": "Location", "json_attributes_topic": "location", "source_type": "gps"}),
}


@dataclass
class LiveState:
    values: dict[str, tuple[int, Any]] = field(default_factory=dict)


def apply(state: LiveState, samples: Iterable[Sample], received_ms: int) -> tuple[bool, int]:
    """Returns (anything changed, number of samples skipped for being too far in the future)."""
    changed, future = False, 0
    for s in samples:
        if s.k in ("meta", "gap") or (s.k == "mode" and s.v not in MODES):
            continue
        if s.t > received_ms + FUTURE_SLACK_MS:
            future += 1
            continue
        old = state.values.get(s.k)
        if old is None or s.t > old[0]:
            state.values[s.k] = (s.t, s.v)
            changed = True
    return changed, future


def _num(state: LiveState, key: str) -> float | None:
    v = state.values.get(key, (0, None))[1]
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
        return None
    return float(v)


def snapshot(state: LiveState, capacity_wh: float) -> dict:
    snap: dict[str, Any] = {}
    speed, power, wh = _num(state, "speed"), _num(state, "power"), _num(state, "battery_wh")
    gear, range_m, temp = _num(state, "gear"), _num(state, "range_m"), _num(state, "outside_temp")
    plugged = state.values.get("plugged", (0, None))[1]
    plugged = plugged if isinstance(plugged, bool) else None
    mode_t, mode = state.values.get("mode", (0, None))
    newest_input = max((state.values[k][0] for k in ("gear", "plugged") if k in state.values), default=0)
    if mode in MODES and mode_t >= newest_input:  # the car's mode tracker wins unless gear/plugged (the on-change inputs; speed is high-rate) is newer, i.e. an out-of-order start-up mode
        snap["status"] = mode
    elif gear is not None or speed is not None or plugged is not None:
        if (gear is not None and gear != PARK_GEAR) or (speed is not None and abs(speed) > 0.3):
            snap["status"] = "driving"
        elif plugged and power is not None and power > 500:
            snap["status"] = "charging"
        else:
            snap["status"] = "parked"
    if speed is not None:
        snap["speed_kmh"] = round(abs(speed) * 3.6, 1)
    if wh is not None:
        snap["battery_kwh"] = round(wh / 1000, 2)
        if math.isfinite(capacity_wh) and capacity_wh > 0:
            snap["soc"] = round(min(100.0, max(0.0, wh / capacity_wh * 100)), 1)
    if range_m is not None:
        snap["range_km"] = round(range_m / 1000, 1)
    if power is not None:
        snap["power_kw"] = round(power / 1000, 2)
    if plugged is not None:
        snap["plugged"] = "ON" if plugged else "OFF"
    if temp is not None:
        snap["outside_temp"] = round(temp, 1)
    if state.values:
        t = max(t for t, _ in state.values.values())
        snap["last_seen"] = datetime.fromtimestamp(t / 1000, timezone.utc).isoformat()
    return snap


def location(state: LiveState) -> dict | None:
    g = state.values.get("gps", (0, None))[1]
    if not isinstance(g, list) or len(g) < 3:
        return None
    if not all(isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(x) for x in g[:3]):
        return None
    return {"latitude": g[0], "longitude": g[1], "gps_accuracy": g[2]}


def _topic(vehicle_id: str, leaf: str) -> str:
    return f"car_insights/{vehicle_id}/{leaf}"


def discovery_messages(vehicle_id: str, name: str, make: str | None, model: str | None, fields: set[str]) -> list[tuple[str, str]]:
    device = {"identifiers": [f"car_insights_{vehicle_id}"], "name": name, "manufacturer": make, "model": model}
    device = {k: v for k, v in device.items() if v is not None}  # HA rejects null strings
    out = []
    for f, (comp, extra) in FIELDS.items():
        if f not in fields:
            continue
        cfg: dict[str, Any] = {"unique_id": f"car_insights_{vehicle_id}_{f}", "device": device}
        cfg.update({k: _topic(vehicle_id, v) if k.endswith("_topic") else v for k, v in extra.items()})
        if "state_topic" in cfg:
            cfg["value_template"] = "{{ value_json.%s if '%s' in value_json else None }}" % (f, f)
        out.append((f"homeassistant/{comp}/{vehicle_id}_{f}/config", json.dumps(cfg)))
    return out


def state_message(vehicle_id: str, snap: dict) -> tuple[str, str]:
    return (_topic(vehicle_id, "state"), json.dumps(snap))


def location_message(vehicle_id: str, loc: dict) -> tuple[str, str]:
    return (_topic(vehicle_id, "location"), json.dumps(loc))
