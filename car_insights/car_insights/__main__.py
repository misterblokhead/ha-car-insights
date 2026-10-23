import json
import logging
import os
from pathlib import Path

import uvicorn

from .api import create_app
from . import db
from .db import connect
from .mqtt_out import MqttOut
from .poller import Poller, SourceConf
from . import pipeline
from .derive import Deriver
from .publisher import Publisher
from .token_file import load_or_create
from .trip_sensors import TripSensors
from .zones import ZoneCache, fetch_history, fetch_time_zone, fetch_zones, supervisor_get


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    opts_path = Path("/data/options.json")
    opts = json.loads(opts_path.read_text()) if opts_path.exists() else {}
    default_wh = float(opts.get("default_capacity_kwh", 60)) * 1000
    sup_token = os.environ["SUPERVISOR_TOKEN"]
    m = supervisor_get("/services/mqtt", sup_token)["data"]
    mqtt = MqttOut(m["host"], m["port"], m.get("username", ""), m.get("password", ""))
    conn = connect("/data/car_insights.db")
    token = load_or_create(Path("/share/car_insights/internal_token"))
    deriver = Deriver(conn, ZoneCache(lambda: fetch_zones(sup_token)))
    sensors = TripSensors(conn, mqtt)
    tz = fetch_time_zone(sup_token)

    def summarize(vid: str, min_t: int | None, received: int) -> tuple[dict | None, dict]:
        return pipeline.refresh(deriver, sensors, vid, min_t, received, tz)

    poller = Poller(conn, [SourceConf(**c) for c in opts.get("sources", [])], lambda ids, a, b: fetch_history(sup_token, ids, a, b),
                    lambda vid, min_t, received: summarize(vid, min_t, received))  # the open trip and summary only matter to the webhook ack
    uvicorn.run(create_app(conn, token, Publisher(conn, mqtt, lambda vid: db.capacity_wh(conn, vid, default_wh)).on_ingested, summarize=summarize, background=[poller.run]),
                host="0.0.0.0", port=8099)


if __name__ == "__main__":
    main()
