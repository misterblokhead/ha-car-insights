// Pure helpers for showing costs (no runes, so node --test can import them).
import { NA } from "./format.js";
import { midnight, nextMidnight } from "./time.js";

export const eur = (x) => (x == null ? NA : `€${x.toFixed(2)}`);

// "≈ €7.40" when the price is only the default one
export const costLabel = (cost) => (cost?.amount == null ? NA : cost.basis === "default" ? `≈ ${eur(cost.amount)}` : eur(cost.amount));

// "Plaza · €0.35/kWh · 10 % charging loss · start fee €0.50 · €0.02/min · card +10 % · card fee €0.35"; the optional parts only when nonzero
export function chargeBasis(cost) {
  if (cost?.amount == null) return "Not available: no price for this date, or no energy reading";
  if (cost.basis === "receipt") return "Receipt";
  const t = cost.tariff;
  const parts = [
    cost.basis === "spot" ? (cost.spot ?? "Spot") : `Default ${cost.current.toUpperCase()} price`,
    `${eur(t.per_kwh)}/kWh`,
    `${Math.round((cost.loss - 1) * 100)} % charging loss`,
  ];
  if (t.start_fee) parts.push(`start fee ${eur(t.start_fee)}`);
  if (t.per_min) parts.push(`${eur(t.per_min)}/min`);
  if (cost.card_markup_pct) parts.push(`card +${cost.card_markup_pct} %`);
  if (cost.card_start_fee) parts.push(`card fee ${eur(cost.card_start_fee)}`);
  return parts.join(" · ");
}

// "€1.40 energy · €0.75 fixed"; empty when even the energy part is unknown (an open trip, or no price yet)
export const tripCostLine = ({ energy, fixed }) =>
  energy == null ? "" : `${eur(energy)} energy · ${fixed == null ? "fixed not available yet" : `${eur(fixed)} fixed`}`;

export const per100 = (total, distance_m) => (total == null || !distance_m ? NA : `${eur((total / distance_m) * 100000)}/100 km`);

// the valid_from to save for a price changed on `day`: that of a tariff already saved inside the day (a spot's own is at its charge's
// start), so the save corrects it; else the day's midnight
export const validFromFor = (tariffs, day) => {
  const lo = midnight(day);
  const hi = nextMidnight(day);
  return tariffs.find((t) => t.valid_from >= lo && t.valid_from < hi)?.valid_from ?? lo;
};

// "2 charges without a price"; empty when none are left out of the cost
export const uncostedText = (n) => (n > 0 ? `${n} ${n === 1 ? "charge" : "charges"} without a price` : "");

// the tariff in force at `now` of a list kept newest first
export const currentTariff = (list, now) => list.find((t) => t.valid_from <= now) ?? null;
