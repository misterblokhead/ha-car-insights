import json
import logging
import os
import time
from functools import partial
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
from .zones import ZoneCache


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

    Path("/data/zones.json").unlink(missing_ok=True)  # an earlier version's cache of the zone list
    tz = fetch_time_zone(sup_token)
    zones = ZoneCache(lambda: fetch_zones(sup_token))
    deriver = Deriver(conn, zones, capacity, spots=lambda lat, lon: prices.spot_name_at(conn, lat, lon))
    sensors = TripSensors(conn, mqtt, capacity,
                          trip_cost=lambda vid, row: costs.trip_cost(conn, vid, row, tz)["total"],
                          charge_cost=lambda vid, row: costs.charge_cost(prices.book(conn, vid), row)["amount"])
    app = pipeline.App(conn, deriver, sensors, TotalsSensors(conn, mqtt, tz), tz, capacity, zones, lambda: zones.loaded)
    zones.on_change = partial(pipeline.relabel, app)  # the cache and the app need each other: only now can a fetch rename places

    poller = Poller(conn, [SourceConf(**c) for c in opts.get("sources", [])], lambda ids, a, b: fetch_history(sup_token, ids, a, b),
                    partial(pipeline.ingested, app))
    # before the server and run_daily's first publish: an ALGO bump emptied the rows
    zones.refresh()  # a success renames the stored rows through on_change; a failure changes nothing and zones.run retries
    pipeline.rebuild(app, int(time.time() * 1000))
    uvicorn.run(create_app(conn, token, Publisher(conn, mqtt, capacity).on_ingested, ingested=partial(pipeline.ingested, app), reply=partial(pipeline.reply, app),
                           background=[poller.run, app.totals.run_daily, lambda: capacity_learning.run(conn), zones.run, partial(pipeline.run_close_quiet, app)],
                           ui=ui_api.router(conn, zones, tz, capacity, AdminCache(lambda: ha_users.fetch_users(sup_token)).is_admin, on_settings=app.totals.publish_groups,
                           relabel=partial(pipeline.relabel, app), on_costs=partial(pipeline.republish, app)),
                           web_dir=Path("/app/web")),
                host="0.0.0.0", port=8099)


if __name__ == "__main__":
    main()
