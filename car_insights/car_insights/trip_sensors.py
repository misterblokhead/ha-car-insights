import json
import logging
import sqlite3
from datetime import datetime, timezone
from typing import Callable

from . import db, live
from .publisher import Sink

log = logging.getLogger(__name__)

MIN_CONSUMPTION_M = 100
CURVE_MAX_BYTES = 16_384  # HA drops or truncates larger state attributes; a bigger curve is never published

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
_EVENTS = {"trip": "Trip", "charge": "Charge"}
_PRIVATE = ("lat", "lon", "zone")  # the exact GPS point stays out of events


def _div(v: float | None, d: float) -> float | None:
    return None if v is None else round(v / d, 2)


def _trip_state(w: dict) -> dict:
    dist, net = w.get("distance_m"), w.get("net_wh")
    cons = None if net is None or dist is None or dist < MIN_CONSUMPTION_M else round(net / dist * 100, 2)
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
                 series: Callable[[str, str, int], dict | None],
                 cost: Callable[[str, str, dict], float | None] = lambda kind, vid, row: None):
        """capacity(vid): usable Wh; series(kind, vid, start): the stored curve of a "trip" or "charge"; cost(kind, vid, row): its euros or None."""
        self._conn, self._mqtt, self._capacity, self._series, self._cost = conn, mqtt, capacity, series, cost
        self._announced: set[str] = set()

    def _discovery(self, vid: str) -> list[tuple[str, str]]:
        dev = live.device(vid, *db.device_info(self._conn, vid))
        out = []
        for f, (leaf, key, name, unit, dclass) in _SENSORS.items():
            # HA rejects state_class measurement on energy and monetary; a per-trip value is no running total anyway
            comp, extra = live.sensor(name, unit, dclass, measurement=dclass not in ("energy", "monetary"), state_topic=leaf,
                                      json_attributes_topic=leaf, value_template="{{ value_json.%s }}" % key)
            out.append((f"homeassistant/{comp}/{vid}_{f}/config", json.dumps(live.config(vid, f, extra, dev))))
        for e in _EVENTS:
            comp, extra = live.sensor(f"Last {e} curve", None, "timestamp", measurement=False,
                                      state_topic=f"last_{e}_curve_state", json_attributes_topic=f"last_{e}_curve")
            out.append((f"homeassistant/{comp}/{vid}_last_{e}_curve/config", json.dumps(live.config(vid, f"last_{e}_curve", extra, dev))))
        for e, name in _EVENTS.items():
            extra = {"name": name, "state_topic": f"{e}_event", "event_types": ["ended"]}
            out.append((f"homeassistant/event/{vid}_{e}/config", json.dumps(live.config(vid, e, extra, dev))))
        return out

    def _euros(self, kind: str, vid: str, w: dict) -> float | None:
        try:
            c = self._cost(kind, vid, w)
        except Exception:  # a cost problem is a null, never a lost state or event
            log.exception("cost of %s %s at %s failed", kind, vid, w.get("start"))
            return None
        return None if c is None else round(c, 2)

    def _curve(self, kind: str, vid: str, w: dict) -> list[tuple[str, str]]:
        """The curve sensor's state (the segment start) and its attributes (the series, or {} when missing or too big)."""
        attrs = json.dumps(self._series(kind, vid, w["start"]) or {}, separators=(",", ":"))
        if len(attrs.encode()) > CURVE_MAX_BYTES:
            log.warning("%s curve of %s at %s is %d bytes, over %d: not published", kind, vid, w["start"], len(attrs), CURVE_MAX_BYTES)
            attrs = "{}"
        start = datetime.fromtimestamp(w["start"] / 1000, timezone.utc).isoformat()
        return [(live.topic(vid, f"last_{kind}_curve_state"), start), (live.topic(vid, f"last_{kind}_curve"), attrs)]

    def publish(self, vid: str, last_trip: dict | None, last_charge: dict | None, ended_trips: list[dict], ended_charges: list[dict]) -> None:
        """last_trip/last_charge: the newest stored row of a kind that just had a segment close (None: leave the state alone).
        ended_*: the closed segments worth an event (a backlog's old ones are left out)."""
        if not (last_trip or last_charge or ended_trips or ended_charges):
            return
        if vid not in self._announced:
            self._mqtt.publish(self._discovery(vid))
            self._announced.add(vid)
        state = [(live.topic(vid, leaf), json.dumps({**conv(w), "cost": self._euros(kind, vid, w)})) for leaf, kind, w, conv in
                 (("last_trip", "trip", last_trip, _trip_state), ("last_charge", "charge", last_charge, lambda c: _charge_state(c, self._capacity(vid)))) if w]
        state += [m for kind, w in (("trip", last_trip), ("charge", last_charge)) if w for m in self._curve(kind, vid, w)]
        if state:
            self._mqtt.publish(state)
        evs = [(live.topic(vid, f"{e}_event"), json.dumps({"event_type": "ended", **{k: v for k, v in w.items() if k not in _PRIVATE}, "cost": self._euros(e, vid, w)}))
               for e, items in (("trip", ended_trips), ("charge", ended_charges)) for w in items]
        if evs:
            self._mqtt.publish(evs, retain=False)
