# Car Insights for Home Assistant

Car Insights records your car's trips, charges and costs in Home Assistant. It works for any car: from your car's own Home Assistant integration (Renault, Peugeot, Kia and more) or from an optional Android Automotive car app.

![Activity: trips and charges on one timeline](docs/images/activity.png)
![A trip with its route and curves](docs/images/trip.png)
![Statistics per week, month and year](docs/images/statistics.png)

## What you get

- **Activity**: one timeline of your trips and charges, with route outlines and a page per trip or charge.
- **Statistics**: distance, energy and cost per week, month and year.
- **Costs**: your electricity prices, charge locations, card fees and fixed costs such as insurance.
- **Live sensors** in Home Assistant: charge level, range, plug, location and more, plus *Trip ended* and *Charge ended* events for automations.
- **Several cars and several people**: group cars for shared totals, and choose who sees which car.
- A **ready-made dashboard**.

## Requirements

Home Assistant 2026.9 or newer.

## Install

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=misterblokhead&repository=ha-car-insights&category=integration)

Or by hand:

1. In HACS, open the menu (three dots, top right) > **Custom repositories**, add `https://github.com/misterblokhead/ha-car-insights` with type **Integration**, then download **Car Insights**.
2. Restart Home Assistant.
3. Click the button to add your first car:

[![Open your Home Assistant instance and start setting up Car Insights.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=car_insights)

Then follow [Getting started](docs/getting-started.md).

## Guides

- [Getting started](docs/getting-started.md): install, add your first car, the checklist.
- [Cars and data sources](docs/cars.md): your car's integration, the car app, which readings you need.
- [Costs](docs/costs.md): prices, charge locations, cost groups, fixed costs.
- [Sharing](docs/sharing.md): administrators, other users, groups.
- [Sensors and dashboard](docs/sensors-and-dashboard.md): live sensors, events, the dashboard.
- [Managing cars](docs/managing-cars.md): add, remove, archive, delete.
- [Troubleshooting](docs/troubleshooting.md): no data, repairs, backups, uninstalling.
- [Protocol](docs/protocol.md): for building your own sender.
- [Development](docs/development.md): running the tests and building the panel.

## What this touches

In detail, from the code:

**Network.** Nothing by default. One optional outside service, **off unless you turn on Street names** in the Car
Insights Settings: [Nominatim](https://nominatim.openstreetmap.org) (OpenStreetMap's public address lookup), to name
the start and end of trips and charges. When on, it sends one point at a time, rounded to 4 decimals (about 11 m), at
most one every 15 seconds, with the Car Insights version and Home Assistant's language. Points inside one of your Home
Assistant zones or a saved charge location are never sent. When off, it makes no request and those places show their
zone or charge location name, or "Unknown". No telemetry, no analytics, no update checks. The maps load their tiles through Home Assistant's own map
tile proxy (`/api/map_tiles/`), so the page never contacts a map server itself.

**Inbound (car app only).** One webhook per car (`POST` only, reachable from outside your network). Every upload must be
signed with that car's secret (HMAC-SHA256) and name the same car; anything else is rejected. Uploads are size-capped.
With a Nabu Casa subscription it creates a Nabu Casa cloudhook for the car, so uploads travel through Nabu Casa's relay;
otherwise the car uses your external URL, which must be `https://`.

**Credentials.** No Home Assistant token and no car-maker account. For a car-app car it makes a random secret, stored in
the config entry and in `/config/car_insights/<vehicle_id>.conf` (the file you copy to the car). Cars without the car app
use your car's existing Home Assistant integration and need no credentials here.

**Home Assistant data it reads.** The car entities you pick (states and recorder history), the entity and device
registry for those cars, your zones, Home Assistant's language and users (to decide who sees which car), and whether
Nabu Casa is active.

**What it writes.**
- Files in `/config/car_insights/`: `car_insights.db` (SQLite: trips, charges, costs, addresses) and one `.conf` per
  car-app car. These are part of Home Assistant's backups.
- On the first start after the old add-on, a one-time import of its export from `/share/car_insights/`.
- Entities: sensors, binary sensors, a device tracker and events per car (made inside Home Assistant; no MQTT broker),
  repair issues and notifications.
- The Car Insights panel and its API at `/api/car_insights/ui/` (Home Assistant login required; removing a car or its
  history is admin-only).

It registers no actions, runs no shell commands, and has no `eval` or `exec`.

## How this is made

I build Car Insights with [Claude Code](https://claude.com/claude-code), Anthropic's AI coding tool. I read and test the
changes before they go into a release, and I use it every day with my own car. The repository has unit tests for the
integration and the page; GitHub runs the HACS and hassfest checks on every push.
[TODO maintainer: confirm this wording, and whether you also run the unit tests before each release.]

## Help

Found a bug or have a question? [Open an issue](https://github.com/misterblokhead/ha-car-insights/issues).

## Support

Car Insights is free. If it is useful to you, you can support its development through [GitHub Sponsors](https://github.com/sponsors/misterblokhead).

## License

MIT
