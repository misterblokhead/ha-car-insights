import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setHass } from "./api.js";
import { authedUrl } from "./authed.js";

let fetched, fail;
beforeEach(() => {
  fetched = []; fail = null;
  let n = 0;
  URL.createObjectURL = () => `blob:${++n}`;
  setHass({
    fetchWithAuth: async (u) => {
      fetched.push(u);
      if (fail === "reject") throw new Error("offline");
      return { ok: fail !== "status", blob: async () => new Blob(["x"]) };
    },
  });
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

test("two concurrent calls fetch once and share the URL", async () => {
  const [a, b] = await Promise.all([authedUrl("/t/twin"), authedUrl("/t/twin")]);
  assert.equal(a, b);
  assert.equal(fetched.length, 1);
});
