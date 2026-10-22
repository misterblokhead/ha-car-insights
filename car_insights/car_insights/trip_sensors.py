import json
import sqlite3

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
    """Publishes the last closed trip/charge as retained sensors and each ended one as a non-retained event."""

    def __init__(self, conn: sqlite3.Connection, mqtt: Sink):
        self._conn, self._mqtt = conn, mqtt
        self._announced: set[str] = set()

    def _discovery(self, vid: str) -> list[tuple[str, str]]:
        dev = live.device(vid, *db.device_info(self._conn, vid))
        out = []
        for f, (leaf, key, name, unit, dclass) in _SENSORS.items():
            # HA rejects state_class measurement on energy; a per-trip value is no running total anyway
            comp, extra = live.sensor(name, unit, dclass, measurement=dclass != "energy", state_topic=leaf,
                                      json_attributes_topic=leaf, value_template="{{ value_json.%s }}" % key)
            out.append((f"homeassistant/{comp}/{vid}_{f}/config", json.dumps(live.config(vid, f, extra, dev))))
        for e, name in _EVENTS.items():
            extra = {"name": name, "state_topic": f"{e}_event", "event_types": ["ended"]}
            out.append((f"homeassistant/event/{vid}_{e}/config", json.dumps(live.config(vid, e, extra, dev))))
        return out

    def publish(self, vid: str, last_trip: dict | None, last_charge: dict | None, ended_trips: list[dict], ended_charges: list[dict]) -> None:
        """last_trip/last_charge: the newest stored row of a kind that just had a segment close (None: leave the state alone).
        ended_*: the closed segments worth an event (a backlog's old ones are left out)."""
        if not (last_trip or last_charge or ended_trips or ended_charges):
            return
        if vid not in self._announced:
            self._mqtt.publish(self._discovery(vid))
            self._announced.add(vid)
        state = [(live.topic(vid, leaf), json.dumps(conv(w))) for leaf, w, conv in
                 (("last_trip", last_trip, _trip_state), ("last_charge", last_charge, _charge_state)) if w]
        if state:
            self._mqtt.publish(state)
        evs = [(live.topic(vid, f"{e}_event"), json.dumps({"event_type": "ended", **w}))
               for e, items in (("trip", ended_trips), ("charge", ended_charges)) for w in items]
        if evs:
            self._mqtt.publish(evs, retain=False)
