import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { hasPlaces, latest, send, setHass } from "./api.js";

const reply = (status, body) => () =>
  Promise.resolve({ ok: status < 400, status, json: () => (body === undefined ? Promise.reject(new Error("no body")) : Promise.resolve(body)) });

afterEach(() => setHass(undefined));

test("without a hass, plain fetch gets the prefixed URL", async () => {
  setHass(undefined);
  let url;
  globalThis.fetch = (u) => ((url = u), reply(200, { a: 1 })());
  assert.deepEqual(await send("GET", "views"), { a: 1 });
  assert.equal(url, "/api/car_insights/ui/views");
});

test("with a hass, fetchWithAuth gets the prefixed URL and plain fetch is not called", async () => {
  let url;
  globalThis.fetch = () => assert.fail("plain fetch");
  setHass({ fetchWithAuth: (u) => ((url = u), reply(400, { detail: "no" })()) });
  await assert.rejects(send("POST", "spots", {}), (e) => e.status === 400 && e.detail === "no");
  assert.equal(url, "/api/car_insights/ui/spots");
});

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

test("hasPlaces without hass", () => {
  assert.equal(hasPlaces(), false);
  setHass({});
  assert.equal(hasPlaces(), false); // a hass without states
});

test("hasPlaces counts a zone other than home", () => {
  setHass({ states: { "zone.home": {}, "sensor.x": {} } });
  assert.equal(hasPlaces(), false);
  setHass({ states: { "zone.home": {}, "zone.work": {} } });
  assert.equal(hasPlaces(), true);
});
