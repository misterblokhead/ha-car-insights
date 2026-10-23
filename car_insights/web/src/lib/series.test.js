import test from "node:test";
import assert from "node:assert/strict";
import { tripCharts, chargeCharts } from "./series.js";

const cols = ["t", "km", "net_kwh", "gross_kwh", "recup_kwh", "speed_kmh"];

test("tripCharts null on empty", () => {
  assert.equal(tripCharts(null), null);
  assert.equal(tripCharts({ cols, rows: [] }), null);
});

test("tripCharts maps cols", () => {
  const c = tripCharts({ cols, rows: [[0, 0, 0, 0, 0, 10], [1000, 1.5, 0.2, 0.3, 0.1, 50]] });
  assert.deepEqual(c.consumption.x, [0, 1.5]);
  assert.deepEqual(c.consumption.series.map((s) => s.values), [[0, 0.2], [0, 0.3], [0, 0.1]]);
  assert.deepEqual(c.speed.series[0].values, [10, 50]);
});

test("tripCharts all-null chart is null", () => {
  const c = tripCharts({ cols, rows: [[0, 0, 0, 0, 0, null], [1000, 1, 0.1, 0.1, 0, null]] });
  assert.equal(c.speed, null);
  assert.ok(c.consumption);
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
