const PAGES = new Set(["activity", "stats", "settings"]);
const DETAIL = { trips: "trip", charges: "charge" };
const REDIRECT = { page: "activity", detail: null, redirect: "#/activity" };

// "#/trips/<vid>/<start>" (the pre-redesign detail link) opens the activity page's detail; the old list routes and anything unknown go to the activity page
export function parse(hash) {
  const [, page, vid, start, ...rest] = hash.replace(/^#/, "").split("/");
  if (PAGES.has(page) && vid === undefined) return { page, detail: null, redirect: null };
  if (DETAIL[page] && /^\d+$/.test(start) && !rest.length) {
    try {
      return { page: "activity", detail: { kind: DETAIL[page], vid: decodeURIComponent(vid), start: Number(start) }, redirect: null };
    } catch {} // malformed %-escape: unknown
  }
  return REDIRECT;
}
