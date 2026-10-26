import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setHass } from "./api.js";
import { authedUrl } from "./authed.js";

let fetched, revoked, fail;
beforeEach(() => {
  fetched = []; revoked = []; fail = null;
  let n = 0;
  URL.createObjectURL = () => `blob:${++n}`;
  URL.revokeObjectURL = (u) => revoked.push(u);
  setHass({
    fetchWithAuth: async (u) => {
      fetched.push(u);
      if (fail === "reject") throw new Error("offline");
      return { ok: fail !== "status", blob: async () => new Blob(["x"]) };
    },
  });
});

// first: the cache is module state, so it must be empty for the count to be exact
test("the 301st distinct URL revokes the oldest, and only it", async () => {
  const first = await authedUrl("/t/0");
  for (let i = 1; i < 300; i++) await authedUrl(`/t/${i}`);
  assert.deepEqual(revoked, []);
  await authedUrl("/t/300");
  assert.deepEqual(revoked, [first]);
});

test("a cache hit returns the same object URL and fetches once", async () => {
  const [a, b] = [await authedUrl("/t/hit"), await authedUrl("/t/hit")];
  assert.equal(a, b);
  assert.deepEqual(fetched, ["/t/hit"]);
});

test("a failed fetch rejects and is retried next time", async () => {
  fail = "status";
  await assert.rejects(authedUrl("/t/bad"));
  fail = "reject";
  await assert.rejects(authedUrl("/t/bad"), /offline/);
  fail = null;
  assert.match(await authedUrl("/t/bad"), /^blob:/);
  assert.equal(fetched.length, 3);
});
