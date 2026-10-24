import test from "node:test";
import assert from "node:assert/strict";
import { split, durationParts, avgSpeedKmh, per100, compare, markerAt, deltaText, kwLabel, arrow, rangeLine } from "./detail.js";

test("split separates the value from its unit", () => {
  assert.deepEqual(split("12.3 km"), ["12.3", "km"]);
  assert.deepEqual(split("17.5 kWh/100 km"), ["17.5", "kWh/100 km"]);
  assert.deepEqual(split("–"), ["–", ""]);
  assert.deepEqual(split("~8.40 kWh"), ["~8.40", "kWh"]);
});

test("durationParts keeps hours and minutes together", () => {
  assert.deepEqual(durationParts(23 * 60), ["23", "min"]);
  assert.deepEqual(durationParts(65 * 60), ["1 h 05", "min"]);
  assert.deepEqual(durationParts(null), ["–", ""]);
});

test("avgSpeedKmh is distance over duration, null without both", () => {
  assert.equal(avgSpeedKmh(36000, 3600), 36);
  assert.equal(avgSpeedKmh(1000, 0), null);
  assert.equal(avgSpeedKmh(null, 600), null);
  assert.equal(avgSpeedKmh(1000, null), null);
  assert.equal(avgSpeedKmh(0, 600), 0);
});

test("per100 needs 100 m of distance and a net energy", () => {
  assert.ok(Math.abs(per100({ net_wh: 3000, distance_m: 20000 }) - 15) < 1e-9);
  assert.equal(per100({ net_wh: 3000, distance_m: 50 }), null);
  assert.equal(per100({ net_wh: null, distance_m: 20000 }), null);
});

test("compare gives each measure the trip, the usual value and the difference", () => {
  const c = compare({ duration_s: 1500, net_wh: 3000, distance_m: 20000 }, { n: 6, avg_duration_s: 1680, avg_wh_per_100km: 14000 });
  assert.equal(c.duration.delta, -3);
  assert.equal(c.duration.usual, 28);
  assert.ok(Math.abs(c.consumption.mine - 15) < 1e-9);
  assert.ok(Math.abs(c.consumption.delta - 1) < 1e-9);
});

test("compare is null without similar trips and per measure without data", () => {
  assert.equal(compare({ duration_s: 60 }, null), null);
  const c = compare({ duration_s: 600, net_wh: null, distance_m: 5000 }, { n: 1, avg_duration_s: null, avg_wh_per_100km: 14000 });
  assert.equal(c.duration, null);
  assert.equal(c.consumption, null);
  assert.equal(compare({ duration_s: 600, net_wh: 3000, distance_m: 50 }, { n: 1, avg_duration_s: 600, avg_wh_per_100km: 14000 }).consumption, null);
});

test("markerAt puts the usual value in the middle and clamps", () => {
  assert.equal(markerAt(10, 10), 50);
  assert.ok(Math.abs(markerAt(11, 10) - 60) < 1e-9);
  assert.ok(Math.abs(markerAt(9, 10) - 40) < 1e-9);
  assert.equal(markerAt(100, 10), 94);
  assert.equal(markerAt(0, 10), 6);
  assert.equal(markerAt(5, 0), null);
});

test("deltaText says the same when the rounded difference is zero", () => {
  assert.equal(deltaText(-3.2, "min"), "−3 min");
  assert.equal(deltaText(1.14, "kWh/100 km", 1), "+1.1 kWh/100 km");
  assert.equal(deltaText(0.2, "min"), "same");
  assert.equal(deltaText(-0.04, "kWh/100 km", 1), "same");
});

test("kwLabel uses the true minus sign", () => {
  assert.equal(kwLabel(7.04), "7.0 kW");
  assert.equal(kwLabel(-0.3), "−0.3 kW");
  assert.equal(kwLabel(null), "–");
});

test("arrow shows both ends, a missing one as a dash, and nothing when both are missing", () => {
  assert.equal(arrow("74", "69", "%"), "74 → 69 %");
  assert.equal(arrow("74", null, "%"), "74 → – %");
  assert.equal(arrow(null, null, "%"), "–");
});

test("rangeLine names the day and says now for an open end", () => {
  const at = new Date(2026, 9, 22, 14, 5).getTime();
  assert.match(rangeLine(at, null, at + 1000), /^Today · .+ – now$/);
  assert.match(rangeLine(at, at + 600000, at + 86400000 * 3), /^Thu 22 Oct · .+ – .+$/);
});
