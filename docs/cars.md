# Cars and data sources

Car Insights can get a car's data from three places. You choose when you add the car, and can change it later with the integration's **Configure** button.

| Source | Use it when |
|---|---|
| **My car's Home Assistant integration** | Your car already shows up in Home Assistant (Renault, Peugeot, Kia and more). |
| **Car app** | You have an Android Automotive car with the Car Insights app. It is not publicly available yet. |
| **Both** | You have the car app and want the integration's charge level, plug and odometer too. |

## Your car's Home Assistant integration

### Pick the device

Choose the device of your car's own integration, for example "My car" under the Renault integration. Car Insights then fills in the entities it knows. Renault and Stellantis devices are recognized. For any other car you pick the entities yourself.

### Readings

Each reading is one entity of your car's device. The entity lists show matching entities from every device, so check the preset's choices.

| Reading | Needed? | Used for |
|---|---|---|
| **Charge level** | Yes | Battery percentage, charges, energy used |
| **Odometer** | Yes | Trip distance |
| **Location** | Optional | The route and the places of a trip |
| **Charging** | Optional | When a charge starts and ends |
| **Plugged in** | Optional | The plug sensor |
| **Battery energy** | Optional | Energy in kWh, instead of an estimate from the percentage |
| **Range** | Optional | The range sensor |
| **Speed** | Optional | Telling that you are driving |
| **Driving / ignition** | Optional | Telling that you are driving |
| **Report time** | Optional | The time the car itself reported a value, so a late update is placed correctly |

You also enter the car's **battery capacity** in kWh: the usable capacity. The car app learns it by itself, so it is asked only for cars without the car app.

If an entity has no unique ID, Car Insights cannot follow it. Pick an entity that can be managed in the UI.

### Approximate trips

A car that only uses its integration gets approximate trips: distance, times, battery used, cost and a rough route. There is no driving style, and no speed or consumption curves. Car Insights reads the integration every few minutes. If it was not running for a while, it catches up on up to 10 days.

### Missing entities

If an entity is removed or renamed, a repair says "some car data is missing". If Charge level or Odometer is missing, the car's integration data is paused until you pick them again in Settings > Devices & services > Car Insights > Configure. Nothing is lost. See [Troubleshooting](troubleshooting.md#missing-entities).

## The car app (optional)

The car app is a separate app for Android Automotive cars. It is **not publicly available yet**. If you have it, it adds:

- exact trips (not approximate),
- your driving style,
- speed and consumption curves for every trip and charge.

A car with the car app takes its trips only from the car app. An integration source next to it adds charge level, charging, plug and odometer.

The car app must reach Home Assistant over **https**. You need either:

- Nabu Casa (Car Insights then uses a cloudhook, `https://hooks.nabu.casa/...`), or
- an https external URL for Home Assistant (your own domain with TLS), set in Settings > System > Network.

Set this up **before** you add the car: until then Car Insights waits and the `.conf` file does not appear.

### The `.conf` file and the USB stick

When you add a car with the car app, Car Insights writes the app's config file to `/config/car_insights/<vehicle_id>.conf` and shows a notification. It holds the webhook URL and the secret. Copy it to the car's USB stick for the car app. A car with only its Home Assistant integration gets no `.conf`.

Treat the `.conf` file like a password: anyone with it can send data for your car.

### Building your own sender

Anything that follows [the protocol](protocol.md) works as a sender.
