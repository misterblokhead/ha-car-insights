import test from "node:test";
import assert from "node:assert/strict";
import { statsUrl, change, periodLabel, bucketLabel, places } from "./stats.js";
import { setZone } from "./time.js";

setZone("Europe/Amsterdam");

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
