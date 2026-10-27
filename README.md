# Car Insights for Home Assistant

A Home Assistant integration that receives raw car data over an HMAC-signed webhook, stores it in SQLite, and gives you live sensors (status, speed, state of charge, range, power, plugged, location, ...) plus a **Car Insights** sidebar page.

Two parts:

- `custom_components/car_insights/`: the integration (this repository, installed through HACS).
- The car app: a separate project that runs on the car's head unit and sends the data. Any sender that follows [docs/protocol.md](docs/protocol.md) works.

## Sidebar page

The **Car Insights** sidebar page (`/car_insights`) has Activity (one timeline of trips and charges with route outlines, detail pages with curves), Statistics (week, month, year) and Settings. Vehicles can be put in cost groups (month and year totals per group) and a vehicle group, and viewers choose which HA users see which vehicles and groups; HA admins edit these on the page's Settings. Every user sees only what they may see. A ready-made dashboard is in [dashboard/car-insights.yaml](dashboard/car-insights.yaml).

## Requirements

- Home Assistant 2026.9 or newer.
- An https external URL for Home Assistant (your own domain with TLS), or Nabu Casa (the integration then uses a cloudhook, `https://hooks.nabu.casa/...`). The car app needs it to reach Home Assistant. Set it in Settings > System > Network before you add a vehicle: until then the integration waits and the `.conf` file does not appear.

## Install from HACS

1. In HACS, open the menu (the three dots, top right) > **Custom repositories**, add `https://github.com/misterblokhead/ha-car-insights` with type **Integration**, then install **Car Insights** and restart Home Assistant.
   Manual alternative: copy `custom_components/car_insights` into your HA `custom_components` directory.
2. Settings > Devices & services > Add integration > **Car Insights**. Enter a vehicle id and a vehicle name. Add the integration once per vehicle.
3. The integration writes the car app's config file to `/config/car_insights/<vehicle_id>.conf` and shows a notification saying so. It holds the webhook URL and the secret. Copy it to the car's USB stick for the car app.

All data lives in `/config/car_insights/car_insights.db`, so it is included in Home Assistant backups.

## Cars without the car app

A car that has no car app (or whose app you do not want) can still be added, from its own Home Assistant integration.

1. Settings > Devices & services > Add integration > **Car Insights**, enter the car's name, then under "How does Car Insights get this car's data?" choose **Car app (Android Automotive)**, **My car's Home Assistant integration** or **Both**.
2. For the integration, pick the car's device and confirm the entities. **Charge level** and **Odometer** are required; **Location**, **Charging**, **Plugged in**, **Battery energy**, **Range**, **Speed**, **Driving / ignition** and **Report time** are optional. Then enter the car's usable battery capacity in kWh.
   - Renault and Stellantis devices are recognized and their entities are filled in for you. For any other car, pick the entities yourself. The entity lists show matching entities from every device, so check the preset's choices.
3. The integration's **Configure** button adds, changes or removes the car's integration source later.

What you get:

- **A car with the car app** takes trips only from the car app. Its integration source adds charge level, charging, plug and odometer.
- **A car with the integration only** gets approximate trips: distance, times, battery used, cost and a rough route. There is no driving style, and no speed or consumption curves. The trip page says "From your car's cloud data, approximate".
- **Missing entities.** If an entity is removed or renamed, a repair says "some car data is missing". If Charge level or Odometer is missing, the car's cloud data is paused until you fix it. Nothing is lost: it catches up on up to 10 days.
- **No data.** A car with only the integration and no new data for 7 days shows "No data since <date>" on its page. Stellantis cars stop being connected after 7 days without a trip of more than 15 minutes, so a parked Stellantis car shows this until you drive it.

Upgrading from 1.0.0: a car-app vehicle's Renault cloud options are converted on the first start. The converted source keeps the same id, so nothing is read twice, and entity ids and stored data are unchanged. Take a Home Assistant backup before updating; going back to 1.0.0 means restoring it. A 1.0.0 cloud source that cannot be converted is dropped with a warning in the log; add it again in Configure.

## Moving from the add-on

1. Update the add-on to 0.11.0.
2. Open the add-on's page, Settings, and press **Export for the integration**. This stops the add-on's MQTT sensors. Do this while the car is off (see below).
3. Install the integration from HACS (see above) and restart Home Assistant. On first start it imports `/share/car_insights/export.db`. Your existing receiver entries stay, so keep them: a vehicle without an entry is not imported, and one with a cloud source (`sources` option) but no entry is dropped with its history.
4. If the import fails, a repair appears. Restart Home Assistant to retry.
5. Check the Car Insights page and the sensors.
6. Remove the add-on, and Mosquitto if nothing else uses it.
7. Delete the old `/share/car_insights/` folder. It holds an old copy of the car's secret and the internal token.

Things to know:

- **Order.** Exporting first, then updating, is the order to prefer. A late export still works: if the integration already received samples from the car, the import merges them into the history. Only the samples are carried (with their acknowledgements and each vehicle's name); settings made in the integration in the meantime (prices, groups, viewers, costs) are not. A failed import followed by uploads from the car and a fixed retry merges the same way.
- **Samples sent in between.** What the car sent to the add-on after the export is not in the export. It is kept only if the add-on did not acknowledge it, because then the car sends it again. Do the move while the car is off.
- **First start.** The history is derived again from the samples, so a warning that Home Assistant's setup is taking over 10 seconds is expected, once.
- **Breaking: entities.** The sensors come back on the same entity IDs only where you never renamed them. Renamed entity IDs, names, areas, icons and disabled flags of the old MQTT devices do not carry over, and neither do device-based automation triggers, conditions and actions (the ones picked from a device in the UI). Check the automations that used them.

## Development

Tests run with `pytest-homeassistant-custom-component` (it pulls in Home Assistant), on Linux or WSL (Home Assistant does not run on Windows):

```sh
pip install -r tests/requirements.txt
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
