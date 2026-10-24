import { test } from "node:test";
import assert from "node:assert/strict";
import { visible, neighbours, hashOf, replaceDays } from "./activity.js";

const trip = (start, vid = "a") => ({ kind: "trip", vehicle_id: vid, start });
const charge = (start, vid = "a") => ({ kind: "charge", vehicle_id: vid, start });
const sum = (n) => ({ distance_m: n, net_wh: 0, charged_wh: 0 });
// newest first, like the API: day 2 has a trip and a charge, day 1 only a charge, day 0 a trip
const days = [
  { date: "2026-10-23", summary: sum(5), items: [trip(300), charge(250)] },
  { date: "2026-10-22", summary: sum(0), items: [charge(200, "b/c")] },
  { date: "2026-10-21", summary: sum(7), items: [trip(100)] },
];

test("visible: all keeps everything", () => {
  assert.deepEqual(visible(days, "all"), days);
});

test("visible: trips drops charges, and a day left with nothing", () => {
  const v = visible(days, "trips");
  assert.deepEqual(v.map((d) => d.date), ["2026-10-23", "2026-10-21"]);
  assert.deepEqual(v[0].items, [trip(300)]);
});

test("visible: charges filter and untouched summaries", () => {
  const v = visible(days, "charges");
  assert.deepEqual(v.map((d) => d.date), ["2026-10-23", "2026-10-22"]);
  assert.equal(v[0].summary, days[0].summary);
  assert.equal(days[0].items.length, 2); // the input is not changed
});

test("neighbours: the first item has no prev, the last no next", () => {
  assert.deepEqual(neighbours(days, "all", "trip", "a", 300), { prev: null, next: "#/charges/a/250" });
  assert.deepEqual(neighbours(days, "all", "trip", "a", 100), { prev: "#/charges/b%2Fc/200", next: null });
});

test("neighbours: across a day boundary, with the vehicle id encoded", () => {
  assert.deepEqual(neighbours(days, "all", "charge", "a", 250), { prev: "#/trips/a/300", next: "#/charges/b%2Fc/200" });
});

test("neighbours: respects the filter", () => {
  assert.deepEqual(neighbours(days, "trips", "trip", "a", 300), { prev: null, next: "#/trips/a/100" });
  assert.deepEqual(neighbours(days, "charges", "charge", "a", 250), { prev: null, next: "#/charges/b%2Fc/200" });
});

test("neighbours: an item the filter hides or a missing one gives nothing", () => {
  const none = { prev: null, next: null };
  assert.deepEqual(neighbours(days, "trips", "charge", "a", 250), none);
  assert.deepEqual(neighbours(days, "all", "trip", "a", 999), none);
  assert.deepEqual(neighbours(days, "all", "trip", "other", 300), none);
  assert.deepEqual(neighbours([], "all", "trip", "a", 300), none);
});

test("hashOf: kind, encoded vehicle and start", () => {
  assert.equal(hashOf(trip(5, "x y")), "#/trips/x%20y/5");
  assert.equal(hashOf(charge(5)), "#/charges/a/5");
});

test("replaceDays: fresh days replace the same dates, older days stay, newest first", () => {
  const fresh = [{ date: "2026-10-24", items: [trip(400)] }, { date: "2026-10-23", items: [trip(300)] }];
  const out = replaceDays(days, fresh);
  assert.deepEqual(out.map((d) => d.date), ["2026-10-24", "2026-10-23", "2026-10-22", "2026-10-21"]);
  assert.deepEqual(out[1].items, [trip(300)]); // the stale 23rd is gone
  assert.equal(out[2], days[1]);
  assert.deepEqual(replaceDays([], fresh), fresh);
});
