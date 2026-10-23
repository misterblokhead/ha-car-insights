# Car Insights add-on

Receives signed car batches forwarded by the webhook receiver integration (internal bearer token, port 8099, not exposed),
stores them in SQLite (`/data/car_insights.db`) and publishes live sensors over MQTT discovery.

- Needs the MQTT service (Mosquitto add-on).
- The internal token is created at `/share/car_insights/internal_token` on first start; the integration reads it from there.
- Option `default_capacity_kwh` (10-200) is used to derive state of charge.
- Option `sources` (default none) lists cloud-connected cars read through Home Assistant entities: `vehicle_id`, `mapping` (`renault`) and `entity_stem` (the shared prefix of the car's entity ids, e.g. `zoe` for `sensor.zoe_battery`). The add-on polls their history every minute.
