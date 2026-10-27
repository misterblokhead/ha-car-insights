import test from "node:test";
import assert from "node:assert/strict";
import { splitCars, removalMessage, navigateHa, stoppedWithLastCar } from "./cars.js";

test("splitCars keeps order and splits on archived", () => {
  const cars = [{ id: "a", archived: false }, { id: "b", archived: true }, { id: "c", archived: false }, { id: "d", archived: true }];
  const { active, archived } = splitCars(cars);
  assert.deepEqual(active.map((v) => v.id), ["a", "c"]);
  assert.deepEqual(archived.map((v) => v.id), ["b", "d"]);
});

test("removalMessage reports a history that could not be deleted", () => {
  assert.equal(removalMessage({ removed: true, history_deleted: false }), "Its history could not be deleted; try Delete history again.");
  assert.equal(removalMessage({ removed: true, history_deleted: true }), null);
});

test("stoppedWithLastCar takes only a 503 right after a removal for Car Insights stopping", () => {
  assert.equal(stoppedWithLastCar({ status: 503 }, true), true);
  assert.equal(stoppedWithLastCar({ status: 503 }, false), false); // at any other time it is a failure to load
  assert.equal(stoppedWithLastCar({ status: 500 }, true), false);
});

test("navigateHa pushes the path on the top window and fires location-changed", () => {
  const pushed = [], events = [];
  globalThis.window = { top: { history: { pushState: (...a) => pushed.push(a) }, dispatchEvent: (e) => events.push(e.type) } };
  try {
    navigateHa("/config/x");
    assert.deepEqual(pushed, [[null, "", "/config/x"]]);
    assert.deepEqual(events, ["location-changed"]);
  } finally {
    delete globalThis.window;
  }
});
