import test from "node:test";
import assert from "node:assert/strict";
import { STEP_IDS, allDone, canShowAgain, cardVisible, hints, showCard, steps } from "./onboarding.js";

const car = (o = {}) => ({ id: "a", name: "Aurora", source: "car_app", has_data: false, missing_entities: false, ...o });
const state = (o = {}) => ({ cars: [car()], price_set: false, opened: [], hidden: false, ...o });
const done = (s, places = false) => Object.fromEntries(steps(s, places).map((x) => [x.id, x.done]));
const finished = state({ cars: [car({ has_data: true })], price_set: true, opened: ["viewers", "dashboard"] });

test("the six steps come in order", () => {
  assert.deepEqual(STEP_IDS, ["car", "data", "prices", "places", "viewers", "dashboard"]);
  assert.deepEqual(steps(state(), false).map((s) => s.id), STEP_IDS);
});

test("a fresh install has only the car step done", () => {
  assert.deepEqual(done(state()), { car: true, data: false, prices: false, places: false, viewers: false, dashboard: false });
});

test("each step's done rule", () => {
  assert.equal(done(state({ cars: [car(), car({ id: "b", has_data: true })] })).data, true); // some car has data
  assert.equal(done(state({ price_set: true })).prices, true);
  assert.equal(done(state(), true).places, true);
  assert.equal(done(state({ opened: ["viewers"] })).viewers, true);
  assert.equal(done(state({ opened: ["viewers"] })).dashboard, false);
  assert.equal(done(state({ opened: ["dashboard"] })).dashboard, true);
});

test("allDone needs every step", () => {
  assert.equal(allDone(finished, true), true);
  assert.equal(allDone(finished, false), false);
});

test("cardVisible is false when hidden and false when all done", () => {
  assert.equal(cardVisible(state(), false), true);
  assert.equal(cardVisible(state({ hidden: true }), false), false);
  assert.equal(cardVisible(finished, true), false);
});

test("canShowAgain only when hidden and not all done", () => {
  assert.equal(canShowAgain(state({ hidden: true }), false), true);
  assert.equal(canShowAgain(state(), false), false);
  assert.equal(canShowAgain({ ...finished, hidden: true }, true), false);
});

test("no card for a non-admin", () => {
  assert.equal(showCard(true, state(), false), true);
  assert.equal(showCard(false, state(), false), false);
  assert.equal(showCard(true, state({ hidden: true }), false), false);
});

test("hints name the source of each car without data", () => {
  assert.deepEqual(hints(state()), [{ name: "Aurora", kinds: ["car_app"] }]);
  assert.deepEqual(hints(state({ cars: [car({ source: "integration" })] })), [{ name: "Aurora", kinds: ["integration"] }]);
  assert.deepEqual(hints(state({ cars: [car({ source: "both" })] })), [{ name: "Aurora", kinds: ["car_app", "integration"] }]);
});

test("hints for a car with a repair", () => {
  assert.deepEqual(hints(state({ cars: [car({ source: "integration", missing_entities: true })] })), [{ name: "Aurora", kinds: ["integration", "missing"] }]);
});

test("cars with data get no hints", () => {
  assert.deepEqual(hints(state({ cars: [car({ has_data: true, missing_entities: true }), car({ id: "b", name: "Breeze" })] })), [{ name: "Breeze", kinds: ["car_app"] }]);
});
