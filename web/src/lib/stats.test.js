process.env.TZ = "America/New_York"; // the browser is west of the server
import test from "node:test";
import assert from "node:assert/strict";
import { statsUrl, mapUrl, change, periodLabel, bucketLabel, places, styleRows, pointsTag } from "./stats.js";
import { setZone } from "./time.js";

setZone("Europe/Amsterdam");

test("mapUrl asks /map for the same view, period and day", () => {
  assert.equal(mapUrl("v:car1", "week", null), "api/ui/map?view=v%3Acar1&period=week");
  assert.equal(mapUrl("g:a b", "year", "2026-09-01"), "api/ui/map?view=g%3Aa%20b&period=year&at=2026-09-01");
});

test("statsUrl sends no at until a date is chosen", () => {
  assert.equal(statsUrl("g:a b", "week", null), "api/ui/stats?view=g%3Aa%20b&period=week");
  assert.equal(statsUrl("v:car1", "month", "2026-09-01"), "api/ui/stats?view=v%3Acar1&period=month&at=2026-09-01");
});

test("change: a fraction against before; no baseline is null", () => {
  assert.equal(change(110, 100), 0.1);
  assert.equal(change(50, 100), -0.5);
  assert.equal(change(0, 100), -1);
  assert.equal(change(5, 0), null);
  assert.equal(change(5, null), null);
  assert.equal(change(5, undefined), null);
  assert.equal(change(null, 5), null);
});

// Amsterdam midnights (UTC+1 / UTC+2), read in HA's zone
const ams = (iso) => Date.parse(iso);
test("periodLabel: month, year, week", () => {
  assert.equal(periodLabel("month", ams("2026-10-01T00:00+02:00"), ams("2026-11-01T00:00+01:00")), "October 2026");
  assert.equal(periodLabel("month", ams("2026-01-01T00:00+01:00"), ams("2026-02-01T00:00+01:00")), "January 2026");
  assert.equal(periodLabel("year", ams("2026-01-01T00:00+01:00"), ams("2027-01-01T00:00+01:00")), "2026");
  assert.equal(periodLabel("week", ams("2026-10-19T00:00+02:00"), ams("2026-10-26T00:00+01:00")), "19 – 25 Oct"); // the clocks go back inside it
  assert.equal(periodLabel("week", ams("2026-10-26T00:00+01:00"), ams("2026-11-02T00:00+01:00")), "26 Oct – 1 Nov");
  assert.equal(periodLabel("week", ams("2026-12-28T00:00+01:00"), ams("2027-01-04T00:00+01:00")), "28 Dec 2026 – 3 Jan 2027");
});

test("periodLabel: a week that holds the 23-hour day ends on its Sunday", () => {
  assert.equal(periodLabel("week", ams("2026-03-23T00:00+01:00"), ams("2026-03-30T00:00+02:00")), "23 – 29 Mar");
});

test("bucketLabel: the day number, or the short month name for a year", () => {
  assert.equal(bucketLabel("month", ams("2026-10-05T00:00+02:00")), "5");
  assert.equal(bucketLabel("week", ams("2026-10-25T00:00+02:00")), "25");
  assert.equal(bucketLabel("year", ams("2026-09-01T00:00+02:00")), "Sep");
});

test("places: by size, zero and unnamed handled, the tail folds into Other", () => {
  assert.deepEqual(places([]), []);
  assert.deepEqual(places([{ place: "Home", wh: 0 }]), []);
  const p = places([{ place: "Home", wh: 30000 }, { place: null, wh: 10000 }]);
  assert.deepEqual(p.map((x) => [x.name, x.wh, x.share]), [["Home", 30000, 0.75], ["Other", 10000, 0.25]]);
  const many = places([...[50, 40, 30, 20, 10, 5, 5].map((k, i) => ({ place: `P${i}`, wh: k * 1000 })), { place: null, wh: 1000 }], 3);
  assert.deepEqual(many.map((x) => [x.name, x.wh]), [["P0", 50000], ["P1", 40000], ["P2", 30000], ["Other", 41000]]);
  assert.equal(many.at(-1).other, true);
});

test("without a zone name the labels still read the server's midnights", () => {
  setZone(undefined);
  assert.equal(periodLabel("week", ams("2026-10-19T00:00+02:00"), ams("2026-10-26T00:00+01:00")), "19 – 25 Oct");
  assert.equal(periodLabel("week", ams("2026-12-28T00:00+01:00"), ams("2027-01-04T00:00+01:00")), "28 Dec 2026 – 3 Jan 2027");
  assert.equal(periodLabel("month", ams("2026-10-01T00:00+02:00"), ams("2026-11-01T00:00+01:00")), "October 2026");
  assert.equal(bucketLabel("month", ams("2026-10-05T00:00+02:00")), "5");
  setZone("Europe/Amsterdam");
});

const B = (v) => Object.fromEntries(["0-50", "50-80", "80-100", "100-120", "120+"].map((k, i) => [k, { km: 1, kwh_per_100km: v[i] }]));

test("styleRows: events per 10 km with their change, bands relative to the largest", () => {
  const now = { km: 100, accel: 20, brake: 10, corner: 0, score: 80, bands: B([14, 18, 20, null, 10]) };
  const before = { km: 50, accel: 5, brake: 10, corner: 5, score: 77, bands: B([]) };
  const r = styleRows(now, before);
  assert.deepEqual(r.events, [
    { k: "accel", name: "Hard accelerations", change: 1 }, // 2.0 against 1.0 per 10 km
    { k: "brake", name: "Hard brakings", change: -0.5 },
    { k: "corner", name: "Sharp corners", change: -1 }, // 1.0 down to none
  ]);
  assert.equal(r.points, 3);
  assert.deepEqual(r.bands.map((b) => [b.name, b.value, b.share]), [
    ["0-50", 14, 0.7], ["50-80", 18, 0.9], ["80-100", 20, 1], ["100-120", null, 0], ["120+", 10, 0.5],
  ]);
});

test("styleRows: a band of net recuperation has no bar", () => {
  const r = styleRows({ km: 10, accel: 0, brake: 0, corner: 0, score: 90, bands: B([-3, 10, null, null, null]) }, null);
  assert.deepEqual(r.bands.map((b) => b.share), [0, 1, 0, 0, 0]);
  assert.ok(styleRows({ km: 10, accel: 0, brake: 0, corner: 0, score: 90, bands: B([-3, -1, null, null, null]) }, null).bands.every((b) => b.share === 0));
});

test("styleRows: nothing to compare against without a previous period", () => {
  const now = { km: 10, accel: 1, brake: 1, corner: 1, score: null, bands: B([1, 1, 1, 1, 1]) };
  const none = { km: 0, accel: 0, brake: 0, corner: 0, score: null, bands: B([]) };
  for (const p of [none, null]) {
    const r = styleRows(now, p);
    assert.equal(r.points, null);
    assert.ok(r.events.every((e) => e.change == null));
  }
});

test("pointsTag: the arrow carries the sign, the text the size", () => {
  assert.deepEqual(pointsTag(3), { dir: 1, text: "3", hint: false });
  assert.deepEqual(pointsTag(-2), { dir: -1, text: "2", hint: false });
  assert.equal(pointsTag(0).text, "same");
  assert.equal(pointsTag(null), null);
});
