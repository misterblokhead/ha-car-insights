import json
import logging
import os
import urllib.request
from pathlib import Path

import uvicorn

from .api import create_app
from .db import connect
from .mqtt_out import MqttOut
from .publisher import Publisher
from .token_file import load_or_create


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
    uvicorn.run(create_app(conn, token, Publisher(conn, mqtt, capacity_wh).on_ingested), host="0.0.0.0", port=8099)


if __name__ == "__main__":
    main()
