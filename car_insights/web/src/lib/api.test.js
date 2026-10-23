import { test } from "node:test";
import assert from "node:assert/strict";
import { send } from "./api.js";

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
