# Getting started

This page takes you from nothing to your first recorded trip. You do not need to know Home Assistant well.

## 1. Install

1. In HACS, open the menu (three dots, top right) > **Custom repositories**, add `https://github.com/misterblokhead/ha-car-insights` with type **Integration**, then download **Car Insights**. (Manual alternative: copy `custom_components/car_insights` into your Home Assistant `custom_components` folder.)
2. Restart Home Assistant.

## 2. Add your car

Click the button, or go to Settings > Devices & services > Add integration > **Car Insights**:

[![Open your Home Assistant instance and start setting up Car Insights.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=car_insights)

The dialog asks for:

1. **Car name**, for example "My car". Under **Advanced** you can set the car's ID. Leave it empty to use the name.
2. **How does Car Insights get this car's data?**
   - **My car's Home Assistant integration**: your car already shows up in Home Assistant (Renault, Peugeot, Kia and more). This is the choice for most people.
   - **Car app**: an Android Automotive car with the Car Insights app. The app is not publicly available yet.
   - **Both**.
3. For the integration: pick your car's device, then check the entities. Charge level and Odometer are needed; the other readings make trips better. See [Pick the device](cars.md#pick-the-device) and [Readings](cars.md#readings).

When it is done, open **Car Insights** in the sidebar to finish setting up.

Add one car at a time. Repeat the steps for every car.

## 3. The Getting started checklist

The top of **Activity** shows a **Getting started** card, for administrators only. It ticks off each step as you go:

- **Add your car**
- **First data from your car**: until then the card says "Waiting for your car's first data…" and tells you what to check (see [Troubleshooting](troubleshooting.md#no-data-yet)).
- **Set your electricity prices**: opens the prices in Settings. See [Costs](costs.md).
- **Name your places**: your Home Assistant zones, so trips read "Home → Work" instead of street names.
- **Choose who sees what**: only matters when other people use your Home Assistant. See [Sharing](sharing.md).
- **Dashboard and sensors**: see [Sensors and dashboard](sensors-and-dashboard.md).

The card goes away when every step is done, or when you click **Hide**. In Settings, **Show getting started** brings it back.

## 4. Your first trip

Drive. A few minutes after the trip ends, it appears in Activity with its distance, times, battery used and cost. Open it for the route and details.

A car that only uses its Home Assistant integration gets *approximate* trips: the trip page says "From your car's cloud data, approximate". See [Approximate trips](cars.md#approximate-trips).

## Next

[Costs](costs.md), [Sharing](sharing.md), [Sensors and dashboard](sensors-and-dashboard.md).
