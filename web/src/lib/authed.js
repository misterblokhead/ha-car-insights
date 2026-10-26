import { authedFetch } from "./api.js";

// Tiles need Home Assistant's login, which an <img src> cannot send: fetch them signed and show the blob.
// Promises are cached by URL.
// shortcut: no cache limit; tiles live as long as the panel iframe, add LRU if memory shows up
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
  }
  return p;
}
