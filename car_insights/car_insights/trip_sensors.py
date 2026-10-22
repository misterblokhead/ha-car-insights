import json
import sqlite3
from typing import Any

from . import db, live
from .publisher import Sink

MIN_CONSUMPTION_M = 100

# field -> (state leaf, value key, name, unit, device_class)
_SENSORS = {
    "last_trip_distance": ("last_trip", "distance_km", "Last trip distance", "km", "distance"),
    "last_trip_net": ("last_trip", "net_kwh", "Last trip energy", "kWh", "energy"),
    "last_trip_consumption": ("last_trip", "consumption", "Last trip consumption", "kWh/100km", "energy_distance"),
    "last_charge_added": ("last_charge", "added_kwh", "Last charge added", "kWh", "energy"),
    "last_charge_avg_power": ("last_charge", "avg_power_kw", "Last charge average power", "kW", "power"),
}
_EVENTS = {"trip": "Trip", "charge": "Charge"}


def _div(v: float | None, d: float) -> float | None:
    return None if v is None else round(v / d, 2)


def _trip_state(w: dict) -> dict:
    dist, net = w.get("distance_m"), w.get("net_wh")
    cons = None if net is None or dist is None or dist < MIN_CONSUMPTION_M else round(net / dist * 100, 2)
    return {"distance_km": _div(dist, 1000), "net_kwh": _div(net, 1000), "consumption": cons,
            **{k: w.get(k) for k in ("from", "to", "start", "end")}}


def _charge_state(w: dict) -> dict:
    return {"added_kwh": _div(w.get("added_wh"), 1000), "avg_power_kw": _div(w.get("avg_w"), 1000),
            **{k: w.get(k) for k in ("place", "start", "end")}}


class TripSensors:
    """Publishes the last closed trip/charge as retained sensors and each closed one as a non-retained event."""

    def __init__(self, conn: sqlite3.Connection, mqtt: Sink):
        self._conn, self._mqtt = conn, mqtt
        self._announced: set[str] = set()

    def _discovery(self, vid: str) -> list[tuple[str, str]]:
        meta = (db.vehicle(self._conn, vid) or {}).get("meta") or {}
        dev = live.device(vid, meta.get("vehicle_name") or vid, meta.get("make"), meta.get("model"))
        out = []
        for f, (leaf, key, name, unit, dclass) in _SENSORS.items():
            cfg: dict[str, Any] = {"unique_id": f"car_insights_{vid}_{f}", "device": dev, "name": name,
                                   "state_topic": live._topic(vid, leaf), "value_template": "{{ value_json.%s }}" % key,
                                   "unit_of_measurement": unit,
                                   "json_attributes_topic": live._topic(vid, leaf)}
            if dclass:
                cfg["device_class"] = dclass
            if dclass != "energy":  # HA rejects state_class measurement on energy; a per-trip value is no running total
                cfg["state_class"] = "measurement"
            out.append((f"homeassistant/sensor/{vid}_{f}/config", json.dumps(cfg)))
        for e, name in _EVENTS.items():
            cfg = {"unique_id": f"car_insights_{vid}_{e}", "device": dev, "name": name,
                   "state_topic": live._topic(vid, f"{e}_event"), "event_types": ["ended"]}
            out.append((f"homeassistant/event/{vid}_{e}/config", json.dumps(cfg)))
        return out

    def _newest(self, table: str, vid: str) -> dict | None:
        r = self._conn.execute(f"SELECT json FROM {table} WHERE vehicle_id=? AND end IS NOT NULL ORDER BY start DESC LIMIT 1", (vid,)).fetchone()
        return None if r is None else json.loads(r[0])

    def publish_closed(self, vid: str, trips: list[dict], charges: list[dict]) -> None:
        if not trips and not charges:
            return
        if vid not in self._announced:
            self._mqtt.publish(self._discovery(vid))
            self._announced.add(vid)
        state: list[tuple[str, str]] = []
        for table, leaf, items, conv in (("trips", "last_trip", trips, _trip_state), ("charges", "last_charge", charges, _charge_state)):
            newest = self._newest(table, vid) if items else None
            if newest is not None:
                state.append((live._topic(vid, leaf), json.dumps(conv(newest))))
        if state:
            self._mqtt.publish(state)
        events = [(live._topic(vid, f"{e}_event"), json.dumps({"event_type": "ended", **w}))
                  for e, items in (("trip", trips), ("charge", charges)) for w in items]
        if events:
            self._mqtt.publish(events, retain=False)
