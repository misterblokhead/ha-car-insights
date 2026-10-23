// Relative URLs (no leading slash) so requests work under the ingress prefix.
// Error message stays the status; `detail` carries the server's text (FastAPI {detail}) when it is a string.
export async function send(method, path, body) {
  const r = await fetch(path, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok) {
    const e = new Error(String(r.status));
    e.status = r.status;
    try {
      const d = (await r.json()).detail;
      if (typeof d === "string") e.detail = d;
    } catch {}
    throw e;
  }
  return r.status === 204 ? null : r.json();
}

export const get = (path) => send("GET", path);
