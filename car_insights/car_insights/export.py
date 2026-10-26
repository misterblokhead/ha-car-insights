"""Hand-over to the Car Insights integration: a copy of the database and options, the add-on's discovery cleared, publishing stopped."""
import json
import os
import sqlite3
from datetime import timezone
from pathlib import Path

from . import ha_mqtt, live, totals_sensors, trip_sensors
from .ha_mqtt import Sink


class Gate:
    """Wraps the one MQTT sink the publishers share: drops everything once stopped. `inner` bypasses the gate."""

    def __init__(self, inner: Sink):
        self.inner, self._stopped = inner, False

    def publish(self, messages: list[tuple[str, str]], retain: bool = True) -> None:
        if not self._stopped:
            self.inner.publish(messages, retain)

    def stop(self) -> None:
        self._stopped = True


def write(conn: sqlite3.Connection, options: dict, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp, dest = out_dir / "export.db.tmp", out_dir / "export.db"
    tmp.unlink(missing_ok=True)
    copy = sqlite3.connect(tmp)
    try:
        conn.backup(copy)
    finally:
        copy.close()
    os.replace(tmp, dest)
    (out_dir / "export.json").write_text(json.dumps(options))
    return dest


def discovery_clear(conn: sqlite3.Connection) -> list[tuple[str, str]]:
    """An empty retained payload for every discovery config topic the publishers announce, built from their own spec tables."""
    dev = lambda key: ha_mqtt.device(key, key, None, None)
    trips = trip_sensors.TripSensors(conn, None, lambda vid: 0.0)  # the sink is never used by _discovery
    totals = totals_sensors.TotalsSensors(conn, None, timezone.utc)
    msgs: list[tuple[str, str]] = []
    for (vid,) in conn.execute("SELECT vehicle_id FROM vehicles").fetchall():
        msgs += live.discovery_messages(vid, vid, None, None, set(live.FIELDS))
        msgs += trips._discovery(vid)
        msgs += totals._discovery(vid, dev(vid))
    for (gid,) in conn.execute("SELECT group_id FROM cost_groups").fetchall():
        msgs += totals._discovery(totals_sensors.GROUP_PREFIX + gid, dev(gid))
    return [(t, "") for t, _ in msgs]
