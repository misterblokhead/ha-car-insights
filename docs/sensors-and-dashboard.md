# Sensors and dashboard

Each car becomes a device in Home Assistant. Its entities are named after the car: a car called "My car" gets `sensor.my_car_status`, `sensor.my_car_state_of_charge` and so on. Check the exact ids in Settings > Devices & services > Car Insights.

## Live sensors

| Entity | Meaning |
|---|---|
| `sensor.my_car_status` | `driving`, `charging` or `parked` |
| `sensor.my_car_state_of_charge` | Battery, % |
| `sensor.my_car_battery_energy` | Energy in the battery, kWh |
| `sensor.my_car_range` | Range, km |
| `sensor.my_car_speed` | Speed, km/h |
| `sensor.my_car_power` | Charging or driving power, kW |
| `sensor.my_car_outside_temperature` | Outside temperature, °C |
| `sensor.my_car_last_seen` | When Car Insights last heard from the car |
| `binary_sensor.my_car_plugged_in` | Whether the plug is in |
| `device_tracker.my_car_location` | Where the car is |

A sensor only appears once the car has sent that reading.

## Last trip and last charge

Updated when a trip or charge ends:

- `sensor.my_car_last_trip_distance` (km), `..._last_trip_energy` (kWh), `..._last_trip_consumption` (kWh/100km), `..._last_trip_cost` (EUR)
- `sensor.my_car_last_charge_added` (kWh), `..._last_charge_percentage` (%), `..._last_charge_average_power` (kW), `..._last_charge_cost` (EUR)

Each also carries attributes such as the start and end time and the places.

## Month and year totals

For each car, and for each [cost group](sharing.md#groups) (on a device of its own): `month_distance`, `month_energy`, `month_charged`, `month_energy_cost`, `month_fixed_cost`, `month_total_cost`, `month_cost_per_km`, and the same with `year_`. They turn over at midnight.

## Events: Trip ended and Charge ended

Each car has two event entities, `event.my_car_trip` and `event.my_car_charge`. Each fires an `ended` event when a trip or charge ends. The event carries the details as attributes: the start and end time, distance and energy of a trip (`distance_m`, `net_wh`) or energy added by a charge (`added_wh`), the places, and `cost`. Exact GPS points are left out. Events that were found while catching up on a backlog are not sent.

An automation that tells you when a charge is done:

```yaml
alias: Car charge finished
triggers:
  - trigger: state
    entity_id: event.my_car_charge
    not_from:
      - unavailable
      - unknown
actions:
  - action: notify.notify
    data:
      message: >-
        Charge finished: {{ ((trigger.to_state.attributes.added_wh or 0) / 1000) | round(1) }} kWh{% if trigger.to_state.attributes.cost is not none %}, {{ trigger.to_state.attributes.cost }} EUR{% endif %}.
```

`not_from` stops it firing again when Home Assistant restarts or the integration reloads. `added_wh` and `cost` can be empty, so the message copes with that. Replace `notify.notify` with your own notify service.

## The ready-made dashboard

[dashboard/car-insights.yaml](../dashboard/car-insights.yaml) is a dashboard view with the live values, the last trip and charge, the month and year totals, and two charts.

1. Install [apexcharts-card](https://github.com/RomRider/apexcharts-card) from HACS (for the two charts).
2. Open a dashboard > Edit > the three dots > Raw configuration editor, and paste the file's content as a new view in the `views:` list.
3. Replace every `VEHICLE` with the id prefix of your car, for example `my_car` (so `sensor.VEHICLE_status` becomes `sensor.my_car_status`), and the view `title` with your car's name.
