# Car Insights add-on

Receives signed car batches forwarded by the webhook receiver integration (internal bearer token, port 8099, not exposed),
stores them in SQLite (`/data/car_insights.db`) and publishes live sensors over MQTT discovery.

- Needs the MQTT service (Mosquitto add-on).
- The internal token is created at `/share/car_insights/internal_token` on first start; the integration reads it from there.
- Option `default_capacity_kwh` (10-200) is used to derive state of charge.
- Option `sources` (default none) lists cloud-connected cars read through Home Assistant entities: `vehicle_id` (must equal the vehicle id entered in the "Car Insights receiver" integration: a typo creates a separate vehicle), `mapping` (`renault`) and `entity_stem` (the shared prefix of the car's entity ids, e.g. `zoe` for `sensor.zoe_battery`). The `sensor.<stem>_mileage` entity must report km (HA shows miles under the imperial unit system or a per-entity unit override, which this mapping does not convert). The add-on polls their history every minute.

## Sidebar page

The add-on adds a **Car Insights** entry to the Home Assistant sidebar (ingress, no port to open). It has three pages; every user sees only the vehicles and cost groups they may see.

- **Activity**: a live strip (state, place, battery, range) above one timeline of trips and charges, newest first, grouped by day with the day's totals. A filter shows all, only trips or only charges. A trip card shows From → To, the time, the distance and a route outline; a charge card shows the place, average power, the energy added and a charge bar. A card opens its detail page: a trip with its consumption per 0.5 km, speed curve and a comparison with earlier similar trips, a charge with its charging speed against charge level and the battery energy (from the car) and charge level (from the cloud) in separate charts.
- **Statistics**: week, month or year (weeks start on Monday) with the change against the previous period, distance per day or month with consumption, kWh charged per place, and highlights (longest and most efficient trip, recuperated energy). A cost group adds a split per car.
- **Settings** (HA admins only): cost groups, the vehicle group and viewers.

Pages are addressed by hash: `#/activity`, `#/trips/<vehicle>/<start>`, `#/charges/<vehicle>/<start>`, `#/stats` and `#/settings`; the older `#/overview` and `#/charges` list links go to Activity. The route outline is drawn from the trip's stored GPS points as a plain line without a map (no map tiles are loaded from outside; a map arrives with part 4). Below 768 px wide the tabs sit in a bar at the bottom and a detail slides in as a page; from 768 px they move to a sidebar and, on Activity, the detail opens beside the list.

Admin status is read server-side from Home Assistant's user list (the `system-admin` group, via the Core websocket; cached for a minute), never from request headers; when the list cannot be read nobody is treated as admin. The page's API is internal and answers only Supervisor ingress requests.

## Sensors, dashboard and recorder

Per vehicle: live sensors, last trip and last charge, month and year totals, and `sensor.<vehicle>_last_trip_curve` / `sensor.<vehicle>_last_charge_curve` (the state is the segment start, the attributes carry the series for your own cards). Per cost group: month and year totals on a device of its own.

A ready-made Lovelace sections view is in [dashboard/car-insights.yaml](../dashboard/car-insights.yaml) (Now, Last trip, Last charge, This month, This year, Last 24 hours, and a shortcut to the sidebar page): replace `VEHICLE` with the device's entity prefix and its title with your car's name. Its two charts need `apexcharts-card` from HACS. Per-trip curves are on the sidebar page, not on the dashboard: `apexcharts-card` only draws a time axis ending at a span relative to now, so a past trip's km-based curve cannot be shown faithfully.

The curve attributes can be large and change on every trip, so keep them out of the recorder:

```yaml
recorder:
  exclude:
    entity_globs: ["sensor.*_last_trip_curve", "sensor.*_last_charge_curve"]
```
