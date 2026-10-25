import test from "node:test";
import assert from "node:assert/strict";
import { tripCharts, chargeCharts, consumptionBuckets, chargeSpeed } from "./series.js";

const cols = ["t", "km", "net_kwh", "gross_kwh", "recup_kwh", "speed_kmh"];

test("tripCharts null on empty", () => {
  assert.equal(tripCharts(null), null);
  assert.equal(tripCharts({ cols, rows: [] }), null);
});

test("tripCharts maps cols", () => {
  const c = tripCharts({ cols, rows: [[0, 0, 0, 0, 0, 10], [1000, 1.5, 0.2, 0.3, 0.1, 50]] });
  assert.deepEqual(c.speed.series[0].values, [10, 50]);
});

test("tripCharts all-null chart is null", () => {
  const c = tripCharts({ cols, rows: [[0, 0, 0, 0, 0, null], [1000, 1, 0.1, 0.1, 0, null]] });
  assert.equal(c.speed, null);
});

test("chargeCharts cloud-only gives car null", () => {
  const c = chargeCharts({ car_kwh: [], cloud_soc: [[1000, 50]], cloud_plugged: [[1000, 1]] });
  assert.equal(c.car, null);
  assert.deepEqual(c.cloud.x, [1]);
  assert.deepEqual(c.cloud.series.map((s) => s.values), [[50], [1]]);
});

test("chargeCharts never mixes", () => {
  const c = chargeCharts({ car_kwh: [[1000, 20]], cloud_soc: [], cloud_plugged: [] });
  assert.equal(c.cloud, null);
  assert.deepEqual(c.car.series.map((s) => s.label), ["Battery kWh"]);
  assert.deepEqual(chargeCharts({ car_kwh: [], cloud_soc: [], cloud_plugged: [] }), { car: null, cloud: null });
});

test("chargeCharts merges differing cloud timestamps", () => {
  const c = chargeCharts({ car_kwh: [], cloud_soc: [[1000, 50], [3000, 60]], cloud_plugged: [[2000, 1]] });
  assert.deepEqual(c.cloud.x, [1, 2, 3]);
  assert.deepEqual(c.cloud.series[0].values, [50, null, 60]);
  assert.deepEqual(c.cloud.series[1].values, [null, 1, null]);
});

test("consumption buckets per half km", () => {
  const b = consumptionBuckets({
    cols,
    rows: [[0, 0, 0, 0, 0, 0], [1, 0.3, 0.05, 0.06, 0.01, 0], [2, 0.6, 0.1, 0.12, 0.02, 0], [3, 1.0, 0.2, 0.25, 0.05, 0]],
  });
  assert.deepEqual(b.x, [0.5, 1.0]);
  assert.deepEqual(b.net.map((v) => +v.toFixed(6)), [0.05, 0.15]);
  assert.equal(consumptionBuckets(null), null);
  assert.equal(consumptionBuckets({ cols, rows: [] }), null);
});

const H = 3600000;
test("charge speed from the car", () => {
  const car = [0, 1, 2, 3, 4, 5].map((i) => [i * 0.4 * H, 22.5 + (i * 24.1) / 5]);
  const c = chargeSpeed({ car_kwh: car, cloud_soc: [] }, 60000);
  assert.equal(c.source, "car");
  assert.equal(c.kw.length, 5);
  for (const v of c.kw) assert.ok(Math.abs(v - 12.05) < 0.01);
  assert.ok(c.min <= c.max);
  assert.ok(Math.abs(c.x[0] - ((22.5 + 24.1 / 10) / 60) * 100) < 0.01);
});

test("charge speed falls back to cloud and smooths", () => {
  const soc = [0, 1, 2, 3, 4, 5].map((i) => [i * 0.1 * H, 40 + i * 8.2]);
  soc[2][1] += 2; // a bump the smoothing must flatten
  const c = chargeSpeed({ car_kwh: [[0, 20], [H, 30]], cloud_soc: soc }, 60000);
  assert.equal(c.source, "cloud");
  assert.equal(c.kw.length, 5);
  // unsmoothed: 49.2, 61.2, 37.2, 49.2, 49.2 kW; the 3-point average flattens the bump
  assert.ok(Math.max(...c.kw) < 61.2 - 1);
  assert.ok(c.kw.every(Number.isFinite));
});

test("charge speed null with too few points", () => {
  assert.equal(chargeSpeed({ car_kwh: [[0, 1], [H, 2]], cloud_soc: [[0, 1], [H, 2]] }, 60000), null);
  assert.equal(chargeSpeed(null, 60000), null);
  assert.equal(chargeSpeed({ car_kwh: [], cloud_soc: [] }, 60000), null);
});
