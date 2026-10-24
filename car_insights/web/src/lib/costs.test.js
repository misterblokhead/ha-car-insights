import test from "node:test";
import assert from "node:assert/strict";
import { eur, costLabel, chargeBasis, tripCostLine, per100, localMidnight, currentTariff } from "./costs.js";

test("eur shows two decimals, zero included, and null is not available", () => {
  assert.equal(eur(7.4), "€7.40");
  assert.equal(eur(0), "€0.00");
  assert.equal(eur(null), "–");
});

test("costLabel marks a default-priced amount as approximate", () => {
  assert.equal(costLabel({ amount: 7.4, basis: "spot" }), "€7.40");
  assert.equal(costLabel({ amount: 7.4, basis: "receipt" }), "€7.40");
  assert.equal(costLabel({ amount: 7.4, basis: "default" }), "≈ €7.40");
  assert.equal(costLabel({ amount: 0, basis: "default" }), "≈ €0.00");
  assert.equal(costLabel({ amount: null, basis: null }), "–");
  assert.equal(costLabel(undefined), "–");
});

const tariff = { valid_from: 0, per_kwh: 0.35, start_fee: 0, per_min: 0 };
const base = { amount: 9.5, kind: "ac", spot: null, tariff, loss: 1.1, card_markup_pct: 0, card_start_fee: 0 };

test("chargeBasis names the receipt, the spot or the default price", () => {
  assert.equal(chargeBasis({ ...base, basis: "receipt" }), "Receipt");
  assert.equal(chargeBasis({ ...base, basis: "spot", spot: "Plaza" }), "Plaza · €0.35/kWh · 10 % charging loss");
  assert.equal(chargeBasis({ ...base, basis: "default", tariff: { ...tariff, per_kwh: 0.4 } }), "Default AC price · €0.40/kWh · 10 % charging loss");
  assert.equal(chargeBasis({ ...base, basis: "default", kind: "dc", loss: 1.05 }), "Default DC price · €0.35/kWh · 5 % charging loss");
});

test("chargeBasis adds the optional parts only when nonzero, in order", () => {
  const all = { ...base, basis: "spot", spot: "Plaza", tariff: { ...tariff, start_fee: 0.5, per_min: 0.02 }, card_markup_pct: 10, card_start_fee: 0.35 };
  assert.equal(chargeBasis(all), "Plaza · €0.35/kWh · 10 % charging loss · start fee €0.50 · €0.02/min · card +10 % · card fee €0.35");
  assert.equal(chargeBasis({ ...all, tariff: { ...tariff, per_min: 0.02 }, card_markup_pct: 0 }), "Plaza · €0.35/kWh · 10 % charging loss · €0.02/min · card fee €0.35");
});

test("chargeBasis without an amount points to the settings", () => {
  assert.equal(chargeBasis({ ...base, amount: null, basis: null, tariff: null }), "Not available: set a default price in Settings");
  assert.equal(chargeBasis(undefined), "Not available: set a default price in Settings");
});

test("tripCostLine splits energy and fixed", () => {
  assert.equal(tripCostLine({ energy: 1.4, fixed: 0.75, total: 2.15 }), "€1.40 energy · €0.75 fixed");
  assert.equal(tripCostLine({ energy: 1.4, fixed: null, total: 1.4 }), "€1.40 energy · fixed not available yet");
  assert.equal(tripCostLine({ energy: 0, fixed: 0, total: 0 }), "€0.00 energy · €0.00 fixed");
  assert.equal(tripCostLine({ energy: null, fixed: null, total: null }), "");
});

test("per100 needs a total and a distance", () => {
  assert.equal(per100(16.4, 200000), "€8.20/100 km");
  assert.equal(per100(0, 200000), "€0.00/100 km");
  assert.equal(per100(16.4, 0), "–");
  assert.equal(per100(null, 200000), "–");
});

test("localMidnight is the browser's midnight of that day", () => {
  assert.equal(localMidnight("2026-10-25"), new Date(2026, 9, 25).getTime());
});

test("currentTariff is the newest entry already valid", () => {
  const list = [{ valid_from: 300, per_kwh: 3 }, { valid_from: 200, per_kwh: 2 }, { valid_from: 100, per_kwh: 1 }];
  assert.equal(currentTariff(list, 250).per_kwh, 2);
  assert.equal(currentTariff(list, 300).per_kwh, 3);
  assert.equal(currentTariff(list, 99), null);
  assert.equal(currentTariff([], 99), null);
});
