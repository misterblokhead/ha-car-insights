import asyncio
import json
import logging
import sqlite3
import time
from datetime import datetime, time as dtime, timedelta, tzinfo
from typing import Callable

from . import db, live
from .publisher import Sink
from .totals import totals

log = logging.getLogger(__name__)

RUN_DELAY_S = 5  # after local midnight, so the new month's totals are computed when the clock is surely past it
GROUP_PREFIX = "group_"

# field -> (period, totals key, name, unit, device_class); the distance and energy values are divided by 1000 (m to km, Wh to kWh)
_SENSORS = {f"{p}_{k}": (p, key, f"{p.capitalize()} {k}", unit, dclass) for p in ("month", "year") for k, key, unit, dclass in (
    ("distance", "distance_m", "km", "distance"), ("energy", "net_wh", "kWh", "energy"), ("charged", "charged_wh", "kWh", "energy"))}
# the euro fields: totals["cost"][key], not divided
_COSTS = {f"{p}_{k}_cost": (p, k) for p in ("month", "year") for k in ("energy", "fixed", "total")}
_COST_SENSORS = {f: (f"{p.capitalize()} {k} cost", "EUR", "monetary") for f, (p, k) in _COSTS.items()} | {
    f"{p}_cost_per_km": (f"{p.capitalize()} cost per km", "EUR/km", None) for p in ("month", "year")}


def _state(t: dict) -> dict:
    out = {f: round(t[p][key] / 1000, 2) for f, (p, key, *_) in _SENSORS.items()}
    out |= {f: None if t[p]["cost"][k] is None else round(t[p]["cost"][k], 2) for f, (p, k) in _COSTS.items()}
    for p in ("month", "year"):
        km, total = t[p]["distance_m"] / 1000, t[p]["cost"]["total"]
        out[f"{p}_cost_per_km"] = round(total / km, 3) if km and total is not None else None
    return out


class TotalsSensors:
    """Month and year distance, net energy and charged energy as retained sensors: one set per vehicle (on its device)
    and one per cost group (on a device of its own)."""

    def __init__(self, conn: sqlite3.Connection, mqtt: Sink, tz: tzinfo, now_ms: Callable[[], int] = lambda: int(time.time() * 1000)):
        self._conn, self._mqtt, self._tz, self._now_ms = conn, mqtt, tz, now_ms
        self._announced: set[str] = set()  # vehicles whose discovery went out
        self._groups: set[str] = set()  # groups whose entities exist in HA

    def _discovery(self, key: str, dev: dict) -> list[tuple[str, str]]:
        out = []
        for f, (_, _, name, unit, dclass) in _SENSORS.items():
            # no state_class on energy: HA rejects measurement there (see TripSensors)
            comp, extra = live.sensor(name, unit, dclass, measurement=dclass != "energy", state_topic="totals",
                                      value_template="{{ value_json.%s }}" % f)
            out.append((f"homeassistant/{comp}/{key}_{f}/config", json.dumps(live.config(key, f, extra, dev))))
        for f, (name, unit, dclass) in _COST_SENSORS.items():  # HA rejects state_class measurement on monetary
            comp, extra = live.sensor(name, unit, dclass, measurement=False, state_topic="totals", value_template="{{ value_json.%s }}" % f)
            out.append((f"homeassistant/{comp}/{key}_{f}/config", json.dumps(live.config(key, f, extra, dev))))
        return out

    def _publish(self, key: str, vids: list[str]) -> None:
        self._mqtt.publish([(live.topic(key, "totals"), json.dumps(_state(totals(self._conn, vids, self._now_ms(), self._tz))))])

    def publish_vehicle(self, vid: str) -> None:
        if vid not in self._announced:
            self._mqtt.publish(self._discovery(vid, live.device(vid, *db.device_info(self._conn, vid))))
            self._announced.add(vid)
        self._publish(vid, [vid])

    def in_group(self, vid: str) -> bool:
        return self._conn.execute("SELECT 1 FROM vehicles WHERE vehicle_id=? AND cost_group_id IN (SELECT group_id FROM cost_groups)",
                                  (vid,)).fetchone() is not None

    def publish_groups(self) -> None:
        """Every group's device and totals (discovery again each time: the name may have changed), and the removal of groups gone."""
        names = dict(self._conn.execute("SELECT group_id, name FROM cost_groups"))
        for gid, name in names.items():
            key = GROUP_PREFIX + gid
            self._mqtt.publish(self._discovery(key, live.device(key, name, None, None)))
            self._publish(key, [r[0] for r in self._conn.execute("SELECT vehicle_id FROM vehicles WHERE cost_group_id=?", (gid,))])
        for gid in self._groups - names.keys():  # an empty retained payload removes the entity and its state
            key = GROUP_PREFIX + gid
            self._mqtt.publish([*((f"homeassistant/sensor/{key}_{f}/config", "") for f in (*_SENSORS, *_COST_SENSORS)), (live.topic(key, "totals"), "")])
        self._groups = set(names)

    def _seconds_to_next_run(self) -> float:
        now = datetime.fromtimestamp(self._now_ms() / 1000, self._tz)
        nxt = datetime.combine(now.date() + timedelta(days=1), dtime.min, self._tz)
        return nxt.timestamp() - now.timestamp() + RUN_DELAY_S  # timestamps: aware datetimes in one zone subtract as wall time, DST-blind

    def _publish_all(self) -> None:
        try:
            for (vid,) in self._conn.execute("SELECT vehicle_id FROM vehicles").fetchall():
                self.publish_vehicle(vid)
            self.publish_groups()
        except Exception:
            log.exception("totals publish failed")

    async def run_daily(self) -> None:
        """Publishes every vehicle and group at start (it also learns the groups, so a later delete clears them, and refreshes totals
        stale from the downtime), then at each local midnight (+5 s), so a new month shows 0 without waiting for a drive."""
        self._publish_all()
        while True:
            await asyncio.sleep(self._seconds_to_next_run())
            self._publish_all()
