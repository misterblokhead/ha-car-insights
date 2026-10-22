import json
import logging
import os
import urllib.request
from pathlib import Path

import uvicorn

from .api import create_app
from .db import connect
from .mqtt_out import MqttOut
from . import summary
from .derive import Deriver
from .publisher import Publisher
from .token_file import load_or_create
from .trip_sensors import TripSensors
from .zones import ZoneCache, fetch_time_zone, fetch_zones


def _mqtt_service() -> dict:
    req = urllib.request.Request("http://supervisor/services/mqtt", headers={"Authorization": f"Bearer {os.environ['SUPERVISOR_TOKEN']}"})
    with urllib.request.urlopen(req, timeout=10) as r:  # raises HTTPError on non-2xx
        return json.load(r)["data"]


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    opts_path = Path("/data/options.json")
    opts = json.loads(opts_path.read_text()) if opts_path.exists() else {}
    capacity_wh = float(opts.get("default_capacity_kwh", 60)) * 1000
    m = _mqtt_service()
    mqtt = MqttOut(m["host"], m["port"], m.get("username", ""), m.get("password", ""))
    conn = connect("/data/car_insights.db")
    token = load_or_create(Path("/share/car_insights/internal_token"))
    sup_token = os.environ["SUPERVISOR_TOKEN"]
    deriver = Deriver(conn, ZoneCache(lambda: fetch_zones(sup_token)))
    sensors = TripSensors(conn, mqtt)
    tz = fetch_time_zone(sup_token)

    def summarize(vid: str, min_t: int | None, received: int) -> dict:
        sensors.publish_closed(vid, *deriver.update(vid, min_t, received))  # after update: it reads the newest stored row
        # shortcut: 500 rows bound the week's totals, a week with more trips undercounts; page by date if that ever shows
        return summary.build(deriver.current_trip(vid), deriver.stored_trips(vid, 500), deriver.stored_charges(vid, 500), received, tz)

    uvicorn.run(create_app(conn, token, Publisher(conn, mqtt, capacity_wh).on_ingested, summarize=summarize), host="0.0.0.0", port=8099)


if __name__ == "__main__":
    main()
