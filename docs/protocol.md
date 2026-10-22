# Wire protocol (v1)

How a sender (a car app, logger or script) delivers data to the Car Insights receiver. Car-agnostic: keys and units are the sender's business, except those listed below.

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
- Samples with `t` more than 24 h in the future are ignored for live state.

## Keys the add-on understands

Everything is stored. These drive the live MQTT sensors (latest `t` wins per key):

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

Sender batches should stay <= 256 KB. The receiver integration accepts up to 300 KB, the add-on up to 1 MiB (largest, so it never rejects what the receiver forwarded).

## Responses

| Status | Meaning | Sender should |
|---|---|---|
| `200 {"acked_seq": N}` | Accepted | Drop samples with `seq <= N` |
| `400` | Vehicle id mismatch or invalid batch | Back off and retry; check vehicle id / sender version |
| `401` | Bad signature | Stop uploading; check the secret |
| `413` | Batch too large | Halve the batch size |
| `503` | Add-on or token unavailable | Back off and retry |

## Acknowledgement and gaps

`acked_seq` is the highest N such that every seq from 1 to N (for that vehicle and source) is stored or covered by a `gap` marker. Inserts are idempotent on `(vehicle_id, source_id, seq)`, so duplicate or out-of-order batches are harmless.

The ack is gap-aware and floored: because the sender must follow the invariant below, every seq below a batch's first seq is treated as resolved (recorded as a gap) even if it never arrived.

**Sender invariant:** send oldest-first, with one batch in flight, and never send a seq while still holding a lower unacknowledged one. If the sender discards samples (buffer full), it emits a `gap` sample (with a fresh, higher `seq`) covering the dropped seq range.
