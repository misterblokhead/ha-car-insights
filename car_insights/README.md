# Car Insights add-on

Receives signed car batches forwarded by the webhook receiver integration (internal bearer token, port 8099, not exposed),
stores them in SQLite (`/data/car_insights.db`) and publishes live sensors over MQTT discovery.

- Needs the MQTT service (Mosquitto add-on).
- The internal token is created at `/share/car_insights/internal_token` on first start; the integration reads it from there.
- Option `default_capacity_kwh` (10-200) is used to derive state of charge.
- Option `sources` (default none) lists cloud-connected cars read through Home Assistant entities: `vehicle_id` (must equal the vehicle id entered in the "Car Insights receiver" integration: a typo creates a separate vehicle), `mapping` (`renault`) and `entity_stem` (the shared prefix of the car's entity ids, e.g. `zoe` for `sensor.zoe_battery`). The `sensor.<stem>_mileage` entity must report km (HA shows miles under the imperial unit system or a per-entity unit override, which this mapping does not convert). The add-on polls their history every minute.

## Sidebar page

The add-on adds a **Car Insights** entry to the Home Assistant sidebar (ingress, no port to open). It lists trips and charges per vehicle with detail pages and curves, and every user sees only the vehicles and cost groups they may see. HA admins edit cost groups, the vehicle group and viewers on its Settings page. The page's API is internal and answers only Supervisor ingress requests.

## Sensors, dashboard and recorder

Per vehicle: live sensors, last trip and last charge, month and year totals, and `sensor.<vehicle>_last_trip_curve` / `sensor.<vehicle>_last_charge_curve` (the state is the segment start, the attributes carry the series for your own cards). Per cost group: month and year totals on a device of its own.

A ready-made Lovelace view is in [dashboard/car-insights.yaml](../dashboard/car-insights.yaml): replace `VEHICLE` with the device's entity prefix. Its two charts need `apexcharts-card` from HACS. Per-trip curves are on the sidebar page, not on the dashboard: `apexcharts-card` only draws a time axis ending at a span relative to now, so a past trip's km-based curve cannot be shown faithfully.

The curve attributes can be large and change on every trip, so keep them out of the recorder:

```yaml
recorder:
  exclude:
    entity_globs: ["sensor.*_last_trip_curve", "sensor.*_last_charge_curve"]
```
