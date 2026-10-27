# Wire protocol (v1)

How a sender (a car app, logger or script) delivers data to the Car Insights integration. Car-agnostic: keys and units are the sender's business, except those listed below.

## Request

`POST <webhook_url>`, `Content-Type: application/json`, uncompressed. The webhook URL must be https. Headers:

- `X-CI-Signature: sha256=<hex>`: HMAC-SHA256 over the exact raw body bytes; the key is the shared secret as UTF-8.
- `X-CI-Vehicle: <vehicle_id>`: must equal the vehicle id configured in the integration (the header itself is not signed; the signed body's `vehicle_id` must match too).

```json
{
  "v": 1,
  "vehicle_id": "my_car",
  "source_id": "app-3f9a1c2e",
  "samples": [
    {"seq": 1201, "t": 1792680000123, "k": "speed", "v": 13.4},
    {"seq": 1202, "t": 1792680000200, "k": "gps", "v": [52.0907, 5.1214, 4.0, 181.5, 13.1, 3.2]},
    {"seq": 1203, "t": 1792680001000, "k": "mode", "v": "driving"}
  ]
}
```

- `v`: must be the integer `1`.
- `vehicle_id`: `[A-Za-z0-9_-]{1,64}`.
- `source_id`: `<lowercase letters/underscore>-<8 hex chars>`, generated once per sender install. A sender that restarts `seq` at 1 must use a new source id.
- `samples`: at most 5000 per batch. Each has integer `seq` >= 1 (per vehicle and source, strictly increasing), integer `t` (epoch ms), `k` (string, 1-32 chars) and `v` (any JSON value).
- Samples with `t` more than 24 h in the future are ignored for live state and for trips/charges.
- `summary_rev` (optional string, at most 64 chars; `null` counts as absent): the `rev` of the last summary the sender holds. Any other type or a longer string is a `400`. An empty `samples` list is valid: it only asks for the current summary.

## Keys the integration understands

Everything is stored. These drive the live sensors (latest `t` wins per key):

| `k` | `v` | Used for |
|---|---|---|
| `speed` | number, m/s | speed (km/h), driving detection |
| `gear` | number (4 = park) | driving detection |
| `plugged` | boolean | plugged-in sensor, charging detection |
| `power` | number, W (positive while charging) | power; charging if plugged and > 500 W |
| `battery_wh` | number, Wh | battery energy; state of charge from the configured capacity |
| `range_m` | number, m | range |
| `outside_temp` | number, deg C | outside temperature |
| `gps` | `[lat, lon, accuracy_m, bearing_deg, speed_m_s, altitude_m]` (first three required) | device tracker |
| `mode` | `"driving"` \| `"charging"` \| `"parked"` | status, see below |
| `meta` | object, optional string `vehicle_name` (also e.g. `make`, `model`) | device name in HA |
| `gap` | `{"from_seq": a, "to_seq": b}` with `1 <= a <= b < this seq` | see Gaps |

Status: a `mode` sample is used as the status only when its `t` is >= the newest `gear`/`plugged` `t`. Otherwise status is derived: driving if gear != 4 or |speed| > 0.3 m/s; charging if plugged and power > 500 W; else parked.

## Size limits

Sender batches should stay <= 256 KB. The integration's webhook accepts up to 300 KB.

## Responses

| Status | Meaning | Sender should |
|---|---|---|
| `200 {"acked_seq": N, "current_trip": {...} or null, "summary": {...}}` (`current_trip` and `summary` optional, see Summary) | Accepted | Drop samples with `seq <= N`; replace the open trip with `current_trip` if present; store `summary` if present |
| `400` | Vehicle id mismatch or invalid batch | Back off and retry; check vehicle id / sender version |
| `401` | Bad signature | Stop uploading; check the secret |
| `413` | Batch too large | Halve the batch size |
| `503` | Car Insights is starting or stopping | Back off and retry |

## Summary

The integration derives trips and charging sessions and answers in the 200 body with two optional keys. Versions before 0.2.0 send neither, and the integration omits both when it could not derive them (the ack is never held back); a sender must treat both as optional. Units are SI (m, m/s, Wh, s, deg C), times are epoch ms, `null` means not available.

- `current_trip`: the trip in progress (a Trip, below, with `end` `null`) or `null` when there is none. Present in every 200 whenever the integration derived anything, so it is the only part that is resent every few seconds while driving. A sender replaces its open trip with it, `null` included.
- `summary`: present when its `rev` differs from the `summary_rev` in the request (or none was sent). It covers closed trips and charges only, so its `rev` does not change while a trip is merely in progress.

Summary keys: `rev` (first 12 hex chars of the sha1 of the compact, key-sorted JSON of everything except `rev` and `updated`), `updated` (ms), `today`, `last_trip` (or `null`), `last_charge` (or `null`), `trips` (closed, newest first, at most 20), `charges` (closed, newest first, at most 20), `week` (7 days, oldest first, today last), `capacity_wh` (the vehicle's usable capacity in Wh, or `null`).

- Trip: `start`, `end` (`null` while open), `from`, `to` (HA zone names or `null`), `distance_m`, `duration_s`, `avg_speed_mps`, `max_speed_mps`, `start_wh`, `end_wh`, `net_wh`, `gross_wh`, `recup_wh`, `avg_temp_c`, `odometer_start_km`, `odometer_end_km` (km, from the newest odometer reading at or before the trip start plus the distance of closed trips since; `null` when no reading exists), `route` (`[[lat, lon], …]`, at most 48 points, or `null`: the card version of the trip's stored route; the top-level `current_trip` carries `route` the same way).
- Charge: `start`, `end`, `place` (zone name or `null`), `start_wh`, `end_wh`, `added_wh`, `duration_s`, `range_added_m`, `avg_w`, `times_source` (`"car"` or `"cloud"`: whether start and end come from the car or from the cloud source), `energy_source` (`"car"`: from the car's `battery_wh` before and after; `"soc_estimate"`: estimated from the cloud's state of charge and the learned usable capacity; `null`: unknown).
- Day (`today` and each `week` entry): `date` (`YYYY-MM-DD`, local date in the Home Assistant time zone), `distance_m`, `net_wh`, `charged_wh`. A trip or charge counts on the day it started; only closed ones count, so the open trip joins the totals when it ends. Days without data are zeros (sums, not measurements).

When a trip ends: an ignition off/lock sample ends it; without proof it stays open until its next sample arrives, except when the trip's last sample is in P and the car has sent no batch for 10 minutes (it switched off and its ignition-off batch was lost): the integration then ends the trip at that first P sample, checked every minute. Trips under 100 m and 60 s are dropped once closed, but shown while open. An open charge ends at the next trip start if the unplug was never seen.

## Cloud source

A vehicle can also be read from a cloud-connected car integration in Home Assistant: as a second source next to the car, or as the only source of a car without the car app. The source is set when adding the car and in the integration's Configure, and stored in the vehicle's config entry options (`cloud: {preset, device_id, entities, source_id, capacity_kwh}`; `capacity_kwh` only for a car without the car app, which learns its own). `entities` maps each reading (required: `charge_level`, `odometer`; optional: `location`, `charging`, `plugged`, `battery_energy`, `range`, `speed`, `ignition`, `report_time`) to an entity registry id (a converted 1.0.0 entity that is not in the registry keeps its entity id); `preset` (`renault`, `stellantis` or none) only pre-fills the pickers. The integration polls their history every 60 s and stores the changes as samples of their own source (`ha_entities-<hex>`) with these keys (the first three are the ones the car's own data also uses; the rest are stored only for a cloud source):

| `k` | `v` | Used for |
|---|---|---|
| `charging_state` | boolean | opens and closes charging sessions |
| `soc_percent` | number, % | energy estimate for a charge |
| `odometer_km` | number, km | trip odometer values |

`charging_state` and `soc_percent` are stamped with the cloud's own report time (the `report_time` reading, e.g. Renault `last_battery_activity`) when it is at most 30 min older than, and not after, the time Home Assistant noticed the change; otherwise with that change time. `odometer_km` always uses the change time. Only the car app sends `battery_wh` for a car that has one; for such a car the cloud's `battery_energy`, `range`, `speed`, `location` and `ignition` readings are ignored.

A cloud charge session may start and end while the car sleeps, so its energy is the car's `battery_wh` before and after when available (`energy_source` `"car"`), otherwise an estimate from `soc_percent` and the usable capacity learned from the car's own samples (`"soc_estimate"`). An estimated charge is held up to 7 days (only when the car reported `battery_wh` before it started; otherwise it can never be refined) and refined in place when the car's value arrives; no second `ended` event is sent. After that it stays an estimate.

`plug_state` (cloud key, boolean, from the `plugged` reading: `plugged`/`unplugged` only) is stored with the other cloud samples but is not a car key: it never opens a car span. It is used only to draw plugged periods in the detail curves.

## UI API

The integration's `/api/car_insights/ui/...` endpoints serve the sidebar page only. They are internal (Home Assistant's own authentication, with the logged-in user as the viewer; no ingress) and not part of this protocol; senders never call them. The summary above is unchanged.

## Acknowledgement and gaps

`acked_seq` is the highest N such that every seq from 1 to N (for that vehicle and source) is stored or covered by a `gap` marker. Inserts are idempotent on `(vehicle_id, source_id, seq)`, so duplicate or out-of-order batches are harmless.

The ack is gap-aware and floored: because the sender must follow the invariant below, every seq below a batch's first seq is treated as resolved (recorded as a gap) even if it never arrived.

**Sender invariant:** send oldest-first, with one batch in flight, and never send a seq while still holding a lower unacknowledged one. If the sender discards samples (buffer full), it emits a `gap` sample (with a fresh, higher `seq`) covering the dropped seq range.
