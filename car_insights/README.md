# Car Insights add-on

Receives signed car batches forwarded by the webhook receiver integration (internal bearer token, port 8099, not exposed),
stores them in SQLite (`/data/car_insights.db`) and publishes live sensors over MQTT discovery.

- Needs the MQTT service (Mosquitto add-on).
- The internal token is created at `/share/car_insights/internal_token` on first start; the integration reads it from there.
- Option `default_capacity_kwh` (10-200) is used to derive state of charge.
- Option `sources` (default none) lists cloud-connected cars read through Home Assistant entities: `vehicle_id` (must equal the vehicle id entered in the "Car Insights receiver" integration: a typo creates a separate vehicle), `mapping` (`renault`) and `entity_stem` (the shared prefix of the car's entity ids, e.g. `zoe` for `sensor.zoe_battery`). The `sensor.<stem>_mileage` entity must report km (HA shows miles under the imperial unit system or a per-entity unit override, which this mapping does not convert). The add-on polls their history every minute.

## Sidebar page

The add-on adds a **Car Insights** entry to the Home Assistant sidebar (ingress, no port to open). It has three pages; every user sees only the vehicles and cost groups they may see.

- **Activity**: a live strip (state, place, battery, range) above one timeline of trips and charges, newest first, grouped by day with the day's totals. A filter shows all, only trips or only charges. A trip card shows From → To, the time, the distance and a route outline; a charge card shows the place, average power, the energy added and a charge bar. Places are your Home Assistant zones ("Unknown" outside every zone); a zone added, moved or renamed renames past trips and charges within 10 minutes. A day's totals include the trip or charge still in progress. A card opens its detail page: a trip with its consumption per 0.5 km, speed curve and a comparison with earlier similar trips, a charge with its charging speed against charge level and the battery energy (from the car) and charge level (from the cloud) in separate charts.
- **Statistics**: week, month or year (weeks start on Monday) with the change against the previous period, distance per day or month with consumption, kWh charged per place, and highlights (longest and most efficient trip, recuperated energy). A cost group adds a split per car.
- **Settings** (HA admins only): cost groups, the vehicle group, viewers, prices, charge locations and fixed costs (see Costs).

Pages are addressed by hash: `#/activity`, `#/trips/<vehicle>/<start>`, `#/charges/<vehicle>/<start>`, `#/stats` and `#/settings`; the older `#/overview` and `#/charges` list links go to Activity. The route outline is drawn from the trip's stored GPS points as a plain line without a map (no map tiles are loaded from outside; a map arrives with part 4). Below 768 px wide the tabs sit in a bar at the bottom and a detail slides in as a page; from 768 px they move to a sidebar and, on Activity, the detail opens beside the list.

Admin status is read server-side from Home Assistant's user list (the `system-admin` group, via the Core websocket; cached for a minute), never from request headers; when the list cannot be read nobody is treated as admin. The page's API is internal and answers only Supervisor ingress requests.

## Costs

Costs are computed when shown, so nothing needs recomputing after a price change.

- **Prices** (Settings, admins): a default AC and DC price, each with a valid-from date. A new price counts from its date; older charges keep theirs. Give the first default price a valid-from date before your oldest charge, otherwise earlier charges and trips show no cost.
- **Charge locations** (Settings, admins): spots saved from a charge, 100 m radius, renameable and deletable. Each carries its own price (€/kWh, start fee, €/min), used before the default price for its kind. Deleting one sends its charges back to the default price.
- **Card** (Settings, per vehicle): a markup in % and a start fee per charge.
- **Fixed costs** (Settings, per vehicle): an amount per month, quarter, year or once, with a start and an optional end.
- **Charge detail**: shows the cost and what it is based on. Admins can **Set actual amount** (a receipt that replaces the computed cost; it can be cleared again) and **Save as charge location** for a charge at an unsaved spot. A cost from a default price shows as "≈ €...".
- **Trip detail** has a cost row; **Statistics** has a Cost row (total, charging, fixed, EUR/100 km).

Rules: a charge is DC when its average power is above 22 kW, else AC. Charging loss is 1.10 for AC and 1.05 for DC. A trip costs an energy part (net kWh times the kWh-weighted price of the last 30 days' charges, default AC price times 1.10 when there are none; EUR 0 for a downhill trip) plus a fixed part (the last 365 days' fixed costs per km times the distance, shown after 100 km).

The first start of 0.8.0 migrates the database and rebuilds all trips and charges once; the log shows `rebuild of N vehicles took ... s`. Take a Home Assistant backup before updating: 0.7.0 cannot open the migrated database.

Trip gross energy and recuperation ignore a battery reading that changes again within 1 s (the Mégane's level flickers 50-100 Wh for a fraction of a second); net is unchanged. 0.8.2 rebuilds all trips once on its first start for this.

## Sensors and dashboard

Per vehicle: live sensors, last trip and last charge, month and year totals. Per cost group: month and year totals on a device of its own.

Cost sensors (0.7.0): `last_trip_cost` and `last_charge_cost` (EUR); per vehicle and per cost group `month_` and `year_` `energy_cost`, `fixed_cost` and `total_cost` (EUR) and `cost_per_km` (EUR/km). The ended trip and charge events carry `cost`.

A ready-made Lovelace sections view is in [dashboard/car-insights.yaml](../dashboard/car-insights.yaml) (Now, Last trip, Last charge, This month, This year, Last 24 hours, and a shortcut to the sidebar page): replace `VEHICLE` with the device's entity prefix and its title with your car's name. Its two charts need `apexcharts-card` from HACS. Per-trip curves are on the sidebar page, not on the dashboard: `apexcharts-card` only draws a time axis ending at a span relative to now, so a past trip's km-based curve cannot be shown faithfully.
