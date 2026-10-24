# Car Insights for Home Assistant

Receives raw car data over an HMAC-signed webhook, stores it in SQLite, and publishes live sensors (status, speed, state of charge, range, power, plugged, location, ...) over MQTT discovery.

Two parts:

- `car_insights/`: the add-on. Stores samples, derives live state, publishes MQTT sensors.
- `custom_components/car_insights/`: the receiver integration. Registers the external webhook, verifies the signature, forwards batches to the add-on, and writes a config file for the sender.

The car-side sender is a separate project. Any sender that follows [docs/protocol.md](docs/protocol.md) works.

## Sidebar page

The add-on adds a **Car Insights** sidebar page (ingress) with Activity (one timeline of trips and charges with route outlines, detail pages with curves), Statistics (week, month, year) and Settings. Vehicles can be put in cost groups (month and year totals per group) and a vehicle group, and viewers choose which HA users see which vehicles and groups; HA admins edit these on the page's Settings. Every user sees only what they may see. A ready-made dashboard is in [dashboard/car-insights.yaml](dashboard/car-insights.yaml) (see the add-on README for the recorder exclude).

## Requirements

- Nabu Casa (the receiver then uses a cloudhook, `https://hooks.nabu.casa/...`), or an https external URL for Home Assistant (your own TLS domain).
- The Mosquitto broker add-on.

## Install

1. Add-on: Settings > Add-ons > Add-on store > menu > Repositories, add `https://github.com/misterblokhead/ha-car-insights`, install **Car Insights**, start it.
2. Integration: in HACS add `https://github.com/misterblokhead/ha-car-insights` as a custom repository (type Integration), install, restart HA.
   Manual alternative: copy `custom_components/car_insights` into your HA `custom_components` directory.
3. Add the **Car Insights receiver** integration once per vehicle (vehicle id, name, add-on URL: `http://local-car-insights:8099` for a local install; a repository install uses `http://<repo-hash>-car-insights:8099`, shown on the add-on's Info page as its hostname). It writes `/share/car_insights/<vehicle_id>.conf` (webhook URL, secret, vehicle id/name) for the sender.

## Development

```sh
python -m venv car_insights/.venv
car_insights/.venv/bin/pip install -r car_insights/requirements-dev.txt -r car_insights/requirements.txt
(cd car_insights && .venv/bin/python -m pytest)

python -m venv tests/.venv
tests/.venv/bin/pip install -r tests/requirements.txt
tests/.venv/bin/python -m pytest tests
```

(On Windows use `Scripts\` instead of `bin/`.)

## License

MIT
