import { get, latest } from "./api.js";
import { replaceDays } from "./activity.js";

export { visible, neighbours, hashOf, linkAction } from "./activity.js";

export const feed = $state({ view: "", filter: "all", today: "", days: [], next: null, loading: false, error: "" });

const request = latest();
let ticket = request.next(); // the page being loaded; paging and refresh belong to the same context, so they keep it

const url = (view, before) => `api/ui/activity?view=${encodeURIComponent(view)}${before == null ? "" : `&before=${before}`}`;

export async function load(view) {
  const mine = (ticket = request.next());
  Object.assign(feed, { view, days: [], next: null, today: "", loading: true, error: "" });
  try {
    const d = await get(url(view));
    if (!mine.current) return;
    Object.assign(feed, { today: d.today, days: d.days, next: d.next });
  } catch (e) {
    if (mine.current) feed.error = e.message;
  }
  if (mine.current) feed.loading = false;
}

export async function more() {
  if (feed.loading || feed.next == null) return;
  const mine = ticket;
  Object.assign(feed, { loading: true, error: "" });
  try {
    const d = await get(url(feed.view, feed.next));
    if (!mine.current) return;
    const have = new Set(feed.days.map((x) => x.date));
    feed.days.push(...d.days.filter((x) => !have.has(x.date)));
    feed.next = d.next;
  } catch (e) {
    if (mine.current) feed.error = e.message;
  }
  if (mine.current) feed.loading = false;
}

// Re-fetches the first page; its days replace the loaded days of the same date, older days stay. A failure keeps what is shown.
export async function refresh() {
  if (feed.loading || !feed.view) return;
  const mine = ticket;
  try {
    const d = await get(url(feed.view));
    if (!mine.current || feed.loading) return;
    const days = replaceDays(feed.days, d.days);
    Object.assign(feed, { today: d.today, error: "", days });
    if (days.length === d.days.length) feed.next = d.next; // no older day loaded: the cursor is the fresh page's
  } catch {}
}
