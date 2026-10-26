# Car Insights for Home Assistant

A Home Assistant integration that receives raw car data over an HMAC-signed webhook, stores it in SQLite, and gives you live sensors (status, speed, state of charge, range, power, plugged, location, ...) plus a **Car Insights** sidebar page.

Two parts:

- `custom_components/car_insights/`: the integration (this repository, installed through HACS).
- The car app: a separate project that runs on the car's head unit and sends the data. Any sender that follows [docs/protocol.md](docs/protocol.md) works.

## Sidebar page

The **Car Insights** sidebar page (`/car_insights`) has Activity (one timeline of trips and charges with route outlines, detail pages with curves), Statistics (week, month, year) and Settings. Vehicles can be put in cost groups (month and year totals per group) and a vehicle group, and viewers choose which HA users see which vehicles and groups; HA admins edit these on the page's Settings. Every user sees only what they may see. A ready-made dashboard is in [dashboard/car-insights.yaml](dashboard/car-insights.yaml).

## Requirements

- Home Assistant 2026.9 or newer.
- An https external URL for Home Assistant (your own domain with TLS), or Nabu Casa (the integration then uses a cloudhook, `https://hooks.nabu.casa/...`). The car app needs it to reach Home Assistant.

## Install from HACS

1. In HACS, add `https://github.com/misterblokhead/ha-car-insights` as a custom repository (type **Integration**), install **Car Insights**, and restart Home Assistant.
   Manual alternative: copy `custom_components/car_insights` into your HA `custom_components` directory.
2. Settings > Devices & services > Add integration > **Car Insights**. Enter a vehicle id and a vehicle name. Add the integration once per vehicle.
3. The integration writes the car app's config file to `/config/car_insights/<vehicle_id>.conf` and shows a notification saying so. It holds the webhook URL and the secret. Copy it to the car's USB stick for the car app.

All data lives in `/config/car_insights/car_insights.db`, so it is included in Home Assistant backups.

## Moving from the add-on

1. Update the add-on to 0.11.0.
2. Open the add-on's page, Settings, and press **Export for the integration**. This stops the add-on's MQTT sensors.
3. Install the integration from HACS (see above) and restart Home Assistant. On first start it imports `/share/car_insights/export.db`. Vehicles without a config entry are not imported, and your existing receiver entries stay, so keep them.
4. If the import fails, a repair appears. Restart Home Assistant to retry.
5. Check the Car Insights page and the sensors.
6. Remove the add-on, and Mosquitto if nothing else uses it.
7. Delete the old `/share/car_insights/` folder. It holds an old copy of the car's secret and the internal token.

## Development

Tests run with `pytest-homeassistant-custom-component`, on Linux or WSL (Home Assistant does not run on Windows):

```sh
python -m pytest tests
```

The panel in `web/` is tested and built with npm:

```sh
cd web
npm ci
npm test
npm run build
```

## License

MIT
