import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "./routes.js";

const to = (page, detail = null, redirect = null, section = null) => ({ page, section, detail, redirect });

test("the three pages", () => {
  assert.deepEqual(parse("#/activity"), to("activity"));
  assert.deepEqual(parse("#/stats"), to("stats"));
  assert.deepEqual(parse("#/settings"), to("settings"));
});

test("the settings sections", () => {
  assert.deepEqual(parse("#/settings/prices"), to("settings", null, null, "prices"));
  assert.deepEqual(parse("#/settings/cars"), to("settings", null, null, "cars"));
});

test("an unknown settings section, or more path, redirects", () => {
  for (const h of ["#/settings/nope", "#/settings/prices/x", "#/activity/prices", "#/stats/cars"]) {
    assert.deepEqual(parse(h), to("activity", null, "#/activity"), h);
  }
});

test("old and unknown routes redirect to the activity page", () => {
  for (const h of ["#/overview", "#/trips", "#/charges", "", "#", "#/", "#/nope", "#/stats/extra", "#/trips/car1", "#/trips/car1/12/x"]) {
    assert.deepEqual(parse(h), to("activity", null, "#/activity"), h);
  }
});

test("trip and charge details open on the activity page", () => {
  assert.deepEqual(parse("#/trips/car1/1700000000000"), to("activity", { kind: "trip", vid: "car1", start: 1700000000000 }));
  assert.deepEqual(parse("#/charges/car1/5"), to("activity", { kind: "charge", vid: "car1", start: 5 }));
});

test("the vehicle id is URI-decoded", () => {
  assert.equal(parse("#/trips/car%201/7").detail.vid, "car 1");
});

test("a bad start or vehicle id redirects", () => {
  for (const h of ["#/trips/car1/abc", "#/trips/car1/-5", "#/charges/car1/1.5", "#/trips/%E0%A4%A/7"]) {
    assert.deepEqual(parse(h), to("activity", null, "#/activity"), h);
  }
});
