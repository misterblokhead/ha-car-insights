import json
import logging
import sqlite3
from typing import Callable

from . import db, ha_mqtt
from .figures import wh_per_100km
from .ha_mqtt import Sink
from .kinds import KINDS

log = logging.getLogger(__name__)

# field -> (state leaf, value key, name, unit, device_class)
_SENSORS = {
    "last_trip_distance": ("last_trip", "distance_km", "Last trip distance", "km", "distance"),
    "last_trip_net": ("last_trip", "net_kwh", "Last trip energy", "kWh", "energy"),
    "last_trip_consumption": ("last_trip", "consumption", "Last trip consumption", "kWh/100km", "energy_distance"),
    "last_charge_added": ("last_charge", "added_kwh", "Last charge added", "kWh", "energy"),
    "last_charge_percent": ("last_charge", "added_percent", "Last charge percentage", "%", None),
    "last_charge_avg_power": ("last_charge", "avg_power_kw", "Last charge average power", "kW", "power"),
    "last_trip_cost": ("last_trip", "cost", "Last trip cost", "EUR", "monetary"),
    "last_charge_cost": ("last_charge", "cost", "Last charge cost", "EUR", "monetary"),
}
_EVENTS = {k.name: k.event for k in KINDS}
_PRIVATE = ("lat", "lon", "zone", "from_lat", "from_lon", "to_lat", "to_lon")  # the exact GPS points stay out of events


def _div(v: float | None, d: float) -> float | None:
    return None if v is None else round(v / d, 2)


def _trip_state(w: dict) -> dict:
    dist, net = w.get("distance_m"), w.get("net_wh")
    cons = _div(wh_per_100km(dist, net), 1000)
    return {"distance_km": _div(dist, 1000), "net_kwh": _div(net, 1000), "consumption": cons,
            **{k: w.get(k) for k in ("from", "to", "start", "end", "odometer_start_km", "odometer_end_km")}}


def _charge_state(w: dict, capacity_wh: float) -> dict:
    added = w.get("added_wh")
    pct = None if added is None or not capacity_wh else round(added / capacity_wh * 100, 1)
    return {"added_kwh": _div(added, 1000), "added_percent": pct, "avg_power_kw": _div(w.get("avg_w"), 1000),
            **{k: w.get(k) for k in ("place", "start", "end", "times_source", "energy_source")}}


class TripSensors:
    """Publishes the last closed trip/charge as retained sensors and each ended one as a non-retained event."""

    def __init__(self, conn: sqlite3.Connection, mqtt: Sink, capacity: Callable[[str], float],
                 trip_cost: Callable[[str, dict], float | None] = lambda vid, row: None,
                 charge_cost: Callable[[str, dict], float | None] = lambda vid, row: None):
        """capacity(vid): usable Wh; trip_cost/charge_cost(vid, row): the euros of a trip or charge, or None."""
        self._conn, self._mqtt, self._capacity = conn, mqtt, capacity
        self._cost = {"trip": trip_cost, "charge": charge_cost}
        self._announced: set[str] = set()

    def _discovery(self, vid: str) -> list[tuple[str, str]]:
        # HA rejects state_class measurement on energy and monetary; a per-trip value is no running total anyway
        specs = {f: ha_mqtt.sensor(name, unit, dclass, measurement=dclass not in ("energy", "monetary"), state_topic=leaf,
                                   json_attributes_topic=leaf, value_template="{{ value_json.%s }}" % key)
                 for f, (leaf, key, name, unit, dclass) in _SENSORS.items()}
        specs |= {e: ("event", {"name": name, "state_topic": f"{e}_event", "event_types": ["ended"]}) for e, name in _EVENTS.items()}
        return ha_mqtt.discovery(vid, ha_mqtt.device(vid, *db.device_info(self._conn, vid)), specs)

    # shortcut: clears 0.7.0's curve sensors once; delete after 0.8.x
    def _remove_curves(self, vid: str) -> list[tuple[str, str]]:
        """Empty retained payloads that clear the curve sensors an earlier version announced."""
        return [*((f"homeassistant/sensor/{vid}_last_{e}_curve/config", "") for e in _EVENTS),
                *((ha_mqtt.topic(vid, f"last_{e}_curve{leaf}"), "") for e in _EVENTS for leaf in ("_state", ""))]

    def _euros(self, kind: str, vid: str, w: dict) -> float | None:
        try:
            c = self._cost[kind](vid, w)
        except Exception:  # a cost problem is a null, never a lost state or event
            log.exception("cost of %s %s at %s failed", kind, vid, w.get("start"))
            return None
        return None if c is None else round(c, 2)

    def forget(self, vid: str) -> None:
        """Drop that a vehicle was announced (its entry was removed), so a vehicle added again is announced again."""
        self._announced.discard(vid)

    def publish(self, vid: str, last_trip: dict | None, last_charge: dict | None, ended_trips: list[dict], ended_charges: list[dict]) -> None:
        """last_trip/last_charge: the newest stored row of a kind that just had a segment close (None: leave the state alone).
        ended_*: the closed segments worth an event (a backlog's old ones are left out)."""
        if not (last_trip or last_charge or ended_trips or ended_charges):
            return
        if vid not in self._announced:
            self._mqtt.publish(self._discovery(vid) + self._remove_curves(vid))
            self._announced.add(vid)
        state = [(ha_mqtt.topic(vid, leaf), json.dumps({**conv(w), "cost": self._euros(kind, vid, w)})) for leaf, kind, w, conv in
                 (("last_trip", "trip", last_trip, _trip_state), ("last_charge", "charge", last_charge, lambda c: _charge_state(c, self._capacity(vid)))) if w]
        if state:
            self._mqtt.publish(state)
        evs = [(ha_mqtt.topic(vid, f"{e}_event"), json.dumps({"event_type": "ended", **{k: v for k, v in w.items() if k not in _PRIVATE}, "cost": self._euros(e, vid, w)}))
               for e, items in (("trip", ended_trips), ("charge", ended_charges)) for w in items]
        if evs:
            self._mqtt.publish(evs, retain=False)
