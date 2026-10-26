import { authedFetch } from "./api.js";

// Tiles need Home Assistant's login, which an <img src> cannot send: fetch them signed and show the blob.
// Promises are cached by URL; the oldest of more than MAX are revoked so a long session does not hold every tile it ever saw.
const MAX = 300;
const cache = new Map();

export function authedUrl(url) {
  let p = cache.get(url);
  if (!p) {
    p = authedFetch(url).then(async (r) => {
      if (!r.ok) throw new Error(String(r.status));
      return URL.createObjectURL(await r.blob());
    });
    p.catch(() => cache.get(url) === p && cache.delete(url)); // a failure is retried next time
    cache.set(url, p);
    if (cache.size > MAX) {
      const [oldest, old] = cache.entries().next().value;
      cache.delete(oldest);
      old.then((u) => setTimeout(() => URL.revokeObjectURL(u), 0), () => {}); // still pending: revoked once it lands, after its consumer had a tick to use it
    }
  }
  return p;
}
