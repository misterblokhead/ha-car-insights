import { test } from "node:test";
import assert from "node:assert/strict";
import { latest, send } from "./api.js";

const reply = (status, body) => () =>
  Promise.resolve({ ok: status < 400, status, json: () => (body === undefined ? Promise.reject(new Error("no body")) : Promise.resolve(body)) });

test("error carries status and the server's detail string", async () => {
  globalThis.fetch = reply(400, { detail: "name too long" });
  await assert.rejects(send("POST", "x", {}), (e) => e.message === "400" && e.status === 400 && e.detail === "name too long");
});

test("error without a usable body has no detail", async () => {
  globalThis.fetch = reply(500);
  await assert.rejects(send("GET", "x"), (e) => e.message === "500" && e.detail === undefined);
  globalThis.fetch = reply(422, { detail: [{ msg: "x" }] });
  await assert.rejects(send("GET", "x"), (e) => e.detail === undefined);
});

test("a newer ticket supersedes the older one", () => {
  const { next } = latest();
  const t1 = next();
  const t2 = next();
  assert.equal(t1.current, false);
  assert.equal(t2.current, true);
});

test("reset supersedes the ticket in flight", () => {
  const { next, reset } = latest();
  const t = next();
  reset();
  assert.equal(t.current, false);
});

test("the older request resolving last does not overwrite the newer one", async () => {
  const { next } = latest();
  const later = [];
  const fake = () => {
    let resolve;
    return { promise: new Promise((r) => (resolve = r)), resolve };
  };
  const [a, b] = [fake(), fake()];
  let shown = null;
  const consume = async (req) => {
    const t = next();
    const v = await req.promise;
    if (t.current) shown = v;
    later.push(v);
  };
  const [pa, pb] = [consume(a), consume(b)];
  b.resolve("second");
  await pb;
  a.resolve("first");
  await pa;
  assert.deepEqual(later, ["second", "first"]);
  assert.equal(shown, "second");
});
