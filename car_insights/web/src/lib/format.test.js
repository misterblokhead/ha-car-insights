import test from "node:test";
import assert from "node:assert/strict";
import { km, kwh, kw, pct, duration, dayKey, byDay } from "./format.js";

test("units", () => {
  assert.equal(km(26000), "26.0 km");
  assert.equal(kwh(24050), "24.05 kWh");
  assert.equal(kw(11300), "11.3 kW");
  assert.equal(pct(81.72), "81.7 %");
});

test("null is not available", () => {
  for (const f of [km, kwh, kw, pct, duration]) assert.equal(f(null), "not available");
});

test("duration", () => {
  assert.equal(duration(7677), "2 h 08 min");
  assert.equal(duration(2700), "45 min");
});

test("dayKey is local YYYY-MM-DD", () => {
  const d = new Date(2026, 9, 3, 23, 30);
  assert.equal(dayKey(d.getTime()), "2026-10-03");
});

test("byDay groups newest day first", () => {
  const t = (day, h) => new Date(2026, 9, day, h).getTime();
  const items = [{ start: t(1, 8) }, { start: t(2, 9) }, { start: t(1, 18) }];
  const out = byDay(items);
  assert.deepEqual(out.map(([k]) => k), ["2026-10-02", "2026-10-01"]);
  assert.equal(out[1][1].length, 2);
});
