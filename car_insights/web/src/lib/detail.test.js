import test from "node:test";
import assert from "node:assert/strict";
import { split, durationParts, compare, markerAt, deltaText, kwLabel, arrow, rangeLine, place, chargedAt, estimate, routeLabel } from "./detail.js";

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

test("compare gives each measure the trip, the usual value and the difference", () => {
  const c = compare({ duration_s: 1500, wh_per_100km: 15_000 }, { n: 6, avg_duration_s: 1680, avg_wh_per_100km: 14000 });
  assert.equal(c.duration.delta, -3);
  assert.equal(c.duration.usual, 28);
  assert.ok(Math.abs(c.consumption.mine - 15) < 1e-9);
  assert.ok(Math.abs(c.consumption.delta - 1) < 1e-9);
});

test("compare is null without similar trips and per measure without data", () => {
  assert.equal(compare({ duration_s: 60 }, null), null);
  const c = compare({ duration_s: 600, wh_per_100km: null }, { n: 1, avg_duration_s: null, avg_wh_per_100km: 14000 });
  assert.equal(c.duration, null);
  assert.equal(c.consumption, null);
  assert.equal(compare({ duration_s: 600, wh_per_100km: null }, { n: 1, avg_duration_s: 600, avg_wh_per_100km: 14000 }).consumption, null);
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

test("place names an unknown place", () => {
  assert.equal(place(null), "Unknown");
  assert.equal(place(undefined), "Unknown");
  assert.equal(place("Home"), "Home");
});

test("chargedAt keeps the card and detail title as they were", () => {
  assert.equal(chargedAt("Work"), "Charged at Work");
  assert.equal(chargedAt(null), "Charged");
  assert.equal(chargedAt(""), "Charged");
});

test("estimate marks a figure that was estimated", () => {
  assert.equal(estimate("24.1 kWh", true), "~24.1 kWh");
  assert.equal(estimate("24.1 kWh", false), "24.1 kWh");
});

test("routeLabel describes the outline for a screen reader", () => {
  const trip = { from: "Home", to: "Work", distance_m: 26000, end: 5000, duration_s: 2700 };
  assert.equal(routeLabel(trip), "Route from Home to Work, 26.0 km, 45 min");
  assert.equal(routeLabel({ ...trip, from: null, to: null }), "Route from Unknown to Unknown, 26.0 km, 45 min");
  assert.equal(routeLabel({ ...trip, end: null }), "Route from Home to Work, 26.0 km, still driving");
});
