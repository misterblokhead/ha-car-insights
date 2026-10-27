const PAGES = new Set(["activity", "stats", "settings"]);
const DETAIL = { trips: "trip", charges: "charge" };
const SECTIONS = new Set(["prices", "cars"]); // "#/settings/<section>" scrolls the settings page to that section
const REDIRECT = { page: "activity", section: null, detail: null, redirect: "#/activity" };

// "#/trips/<vid>/<start>" (the pre-redesign detail link) opens the activity page's detail; the old list routes and anything unknown go to the activity page
export function parse(hash) {
  const [, page, vid, start, ...rest] = hash.replace(/^#/, "").split("/");
  if (PAGES.has(page) && vid === undefined) return { page, section: null, detail: null, redirect: null };
  if (page === "settings" && SECTIONS.has(vid) && start === undefined) return { page, section: vid, detail: null, redirect: null };
  if (DETAIL[page] && /^\d+$/.test(start) && !rest.length) {
    try {
      return { page: "activity", section: null, detail: { kind: DETAIL[page], vid: decodeURIComponent(vid), start: Number(start) }, redirect: null };
    } catch {} // malformed %-escape: unknown
  }
  return REDIRECT;
}
