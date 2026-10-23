// Relative URLs (no leading slash) so requests work under the ingress prefix.
export async function send(method, path, body) {
  const r = await fetch(path, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok) throw new Error(String(r.status));
  return r.status === 204 ? null : r.json();
}

export const get = (path) => send("GET", path);
