import json
import logging
import os
import time
from pathlib import Path

import uvicorn

from .api import create_app
from . import capacity as capacity_learning, db
from .db import connect
from .mqtt_out import MqttOut
from .poller import Poller, SourceConf
from . import costs, ha_users, pipeline, prices, ui_api
from .derive import Deriver
from .ha_users import AdminCache
from .publisher import Publisher
from .token_file import load_or_create
from .totals_sensors import TotalsSensors
from .trip_sensors import TripSensors
from .ha_api import fetch_history, fetch_time_zone, fetch_zones, supervisor_get
from .zones import ZoneCache, zones_changed


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
    def capacity(vid: str) -> float:
        return db.capacity_wh(conn, vid, default_wh)

    zones = ZoneCache(lambda: fetch_zones(sup_token))
    deriver = Deriver(conn, zones, capacity, spots=lambda lat, lon: prices.spot_name_at(conn, lat, lon))
    # tz is assigned below; the cost lambdas read it only when called
    sensors = TripSensors(conn, mqtt, capacity,
                          trip_cost=lambda vid, row: costs.trip_cost(conn, vid, row, tz)["total"],
                          charge_cost=lambda vid, row: costs.charge_cost(prices.book(conn, vid), row)["amount"])
    tz = fetch_time_zone(sup_token)
    totals = TotalsSensors(conn, mqtt, tz)

    def summarize(vid: str, min_t: int | None, received: int) -> tuple[dict | None, dict]:
        return pipeline.refresh(deriver, sensors, totals, conn, capacity, vid, min_t, received, tz)

    poller = Poller(conn, [SourceConf(**c) for c in opts.get("sources", [])], lambda ids, a, b: fetch_history(sup_token, ids, a, b),
                    lambda vid, min_t, received: summarize(vid, min_t, received))  # the open trip and summary only matter to the webhook ack
    # before the server and run_daily's first publish: an ALGO bump emptied the rows, and a zone added, moved or renamed rebuilds them all
    pipeline.rebuild(deriver, sensors, conn, int(time.time() * 1000), zones_changed(lambda: fetch_zones(sup_token), Path("/data/zones.json")))
    uvicorn.run(create_app(conn, token, Publisher(conn, mqtt, capacity).on_ingested, summarize=summarize, background=[poller.run, totals.run_daily, lambda: capacity_learning.run(conn), lambda: pipeline.run_close_quiet(conn, summarize)],
                           ui=ui_api.router(conn, zones, tz, capacity, AdminCache(lambda: ha_users.fetch_users(sup_token)).is_admin, on_settings=totals.publish_groups,
                           on_costs=lambda vids: pipeline.republish(sensors, totals, conn, vids)),
                           web_dir=Path("/app/web")),
                host="0.0.0.0", port=8099)


if __name__ == "__main__":
    main()
