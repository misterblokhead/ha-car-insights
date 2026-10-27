# Troubleshooting

## No data yet

The Getting started card says "Waiting for your car's first data…" until the first reading arrives. It tells you what to check:

- **Car app:** put the `.conf` file on the car's USB stick and check that the car app is running. See [the car app](cars.md#the-car-app-optional).
- **Car's integration:** Car Insights reads your car's integration every few minutes. Check that its entities are not unavailable (Settings > Devices & services > Entities).
- **Missing entities:** see Settings > System > Repairs, and the next section.

## Missing entities

If an entity of your car's integration is removed or renamed, a repair says "some car data is missing". Pick the entities again in Settings > Devices & services > Car Insights > Configure.

If **Charge level** or **Odometer** is missing, Car Insights pauses the car's integration data. Nothing is lost: it catches up on up to 10 days once you fix it.

## "No data since…"

A car that only uses its integration, with no new data for 7 days, shows "No data since <date>" on its page. Open the car's integration and check that it still works.

**Stellantis cars** stop being connected after 7 days without a trip of more than 15 minutes. A parked Stellantis car shows this message until you drive it.

## Backups

All data lives in `/config/car_insights/car_insights.db`, so it is part of Home Assistant backups. The car app's `.conf` files are in the same folder.

Take a backup before updating Car Insights to a new major version.

## Uninstalling

1. Remove each car's Car Insights entry in Settings > Devices & services > Car Insights. Keep or delete its history when asked.
2. In HACS, remove Car Insights, and restart Home Assistant.
3. To erase the data for good, delete the `/config/car_insights/` folder. It holds the database and the `.conf` files with the cars' secrets.

## Still stuck?

[Open an issue](https://github.com/misterblokhead/ha-car-insights/issues). Do not include `.conf` files, webhook URLs or secrets.
