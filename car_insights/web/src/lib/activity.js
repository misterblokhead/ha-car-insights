// Pure helpers of the activity timeline (no runes, so node --test can import them).
const keep = (filter, item) => filter === "all" || item.kind === (filter === "trips" ? "trip" : "charge");

// "#/trips/<vid>/<start>" or "#/charges/..." for an item
export const hashOf = (item) => `#/${item.kind}s/${encodeURIComponent(item.vehicle_id)}/${item.start}`;

// The days with only the items the filter shows; a day left empty is dropped, summaries stay as the server made them.
export const visible = (days, filter) =>
  filter === "all" ? days : days.map((d) => ({ ...d, items: d.items.filter((i) => keep(filter, i)) })).filter((d) => d.items.length);

// Detail hashes of the items before (newer) and after (older) one in the filtered timeline; null at an end or for an unknown item.
export function neighbours(days, filter, kind, vid, start) {
  const items = visible(days, filter).flatMap((d) => d.items);
  const at = items.findIndex((i) => i.kind === kind && i.vehicle_id === vid && i.start === start);
  if (at < 0) return { prev: null, next: null };
  return { prev: at > 0 ? hashOf(items[at - 1]) : null, next: at < items.length - 1 ? hashOf(items[at + 1]) : null };
}

// A fresh first page replaces the loaded days of the same dates; older loaded days stay.
export const replaceDays = (have, fresh) =>
  [...fresh, ...have.filter((d) => !fresh.some((f) => f.date === d.date))].sort((a, b) => (a.date < b.date ? 1 : -1));
