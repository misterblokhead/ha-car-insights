import test from "node:test";
import assert from "node:assert/strict";
import { km, kwh, kw, pct, duration, daySummary, delta, kwhPer100, consumption } from "./format.js";

test("units", () => {
  assert.equal(km(26000), "26.0 km");
  assert.equal(kwh(24050), "24.05 kWh");
  assert.equal(kw(11300), "11.3 kW");
  assert.equal(pct(81.72), "81.7 %");
});

test("null is not available", () => {
  for (const f of [km, kwh, kw, pct, duration]) assert.equal(f(null), "–");
});

test("duration", () => {
  assert.equal(duration(7677), "2 h 08 min");
  assert.equal(duration(2700), "45 min");
});

test("daySummary", () => {
  assert.equal(daySummary({ distance_m: 29000, net_wh: 4700, charged_wh: 24100 }), "29 km · 4.7 kWh used · +24.1 kWh");
  assert.equal(daySummary({ distance_m: 5400, net_wh: 0, charged_wh: 0 }), "5.4 km");
  assert.equal(daySummary({ distance_m: 0, net_wh: null, charged_wh: 24100 }), "+24.1 kWh");
  assert.equal(daySummary({ distance_m: 0, net_wh: 0, charged_wh: 0 }), "");
});

test("delta", () => {
  assert.equal(delta(-3, "min"), "−3 min");
  assert.equal(delta(1.14, "kWh/100", 1), "+1.1 kWh/100");
});

test("consumption shows the server's Wh per 100 km as kWh, or a dash", () => {
  assert.equal(consumption(27_300), "27.3 kWh/100 km");
  assert.equal(consumption(null), "–");
  assert.equal(kwhPer100(15_580), 15.58);
  assert.equal(kwhPer100(null), null);
});
