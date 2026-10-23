<script>
  import { get, send } from "../lib/api.js";
  import { when } from "../lib/format.js";

  let data = $state(null);
  let error = $state("");
  let newName = $state("");
  let names = $state({});

  const fail = (e) => (error = e.detail || `Could not save (${e.message})`);

  async function load() {
    try {
      data = await get("api/ui/settings");
      names = Object.fromEntries(data.groups.map((g) => [g.id, g.name]));
    } catch (e) {
      error = `Could not load (${e.message})`;
    }
  }

  // Every change is sent at once; on failure show the error and reload so the form shows the truth.
  async function change(fn) {
    error = "";
    try {
      await fn();
    } catch (e) {
      fail(e);
    }
    await load();
  }

  const addGroup = async () => {
    await change(() => send("POST", "api/ui/groups", { name: newName }));
    if (!error) newName = "";
  };
  const rename = (g) => change(() => send("PUT", `api/ui/groups/${g.id}`, { name: names[g.id] }));
  const remove = (g) => confirm(`Delete group "${g.name}"?`) && change(() => send("DELETE", `api/ui/groups/${g.id}`));
  const setVehicle = (v, group_id, viewers) => change(() => send("PUT", `api/ui/vehicles/${v.id}`, { group_id, viewers }));
  const toggle = (v, uid, on) => setVehicle(v, v.group_id, on ? [...v.viewers, uid] : v.viewers.filter((u) => u !== uid));

  load();
</script>

{#if error}<p class="err" role="alert">{error}</p>{/if}
{#if data}
  <h2>Cost groups</h2>
  {#each data.groups as g (g.id)}
    <form class="row" onsubmit={(e) => { e.preventDefault(); rename(g); }}>
      <label>Group name <input bind:value={names[g.id]} required maxlength="40" /></label>
      <button type="submit">Rename</button>
      <button type="button" onclick={() => remove(g)}>Delete</button>
    </form>
  {:else}
    <p class="msg">No groups yet.</p>
  {/each}
  <form class="row" onsubmit={(e) => { e.preventDefault(); addGroup(); }}>
    <label>New group <input bind:value={newName} required maxlength="40" /></label>
    <button type="submit">Add group</button>
  </form>

  <h2>Vehicles</h2>
  <p class="msg">Users appear here after they open this page once. Administrators always see every vehicle.</p>
  {#each data.vehicles as v (v.id)}
    <section class="card">
      <h3>{v.name}</h3>
      <label>Cost group
        <select value={v.group_id ?? ""} onchange={(e) => setVehicle(v, e.currentTarget.value || null, v.viewers)}>
          <option value="">No group</option>
          {#each data.groups as g}<option value={g.id}>{g.name}</option>{/each}
        </select>
      </label>
      <fieldset>
        <legend>Viewers</legend>
        {#each data.users as u (u.id)}
          <label class="chk">
            <input type="checkbox" checked={v.viewers.includes(u.id)} onchange={(e) => toggle(v, u.id, e.currentTarget.checked)} />
            {u.name} <span class="muted">(last seen {when(u.last_seen)})</span>
          </label>
        {:else}
          <span class="muted">No users yet.</span>
        {/each}
      </fieldset>
    </section>
  {/each}
{:else if !error}
  <p class="msg">Loading...</p>
{/if}

<style>
  h2 { font-size: 1.1em; margin: 16px 0 8px; }
  h3 { font-size: 1em; margin: 0 0 8px; }
  .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; margin-bottom: 8px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 10px; margin-bottom: 10px; }
  label { display: flex; flex-direction: column; gap: 2px; }
  .chk { flex-direction: row; align-items: center; gap: 6px; padding: 4px 0; }
  fieldset { border: 1px solid var(--line); border-radius: 6px; margin: 8px 0 0; }
  input:not([type="checkbox"]), select, button { font: inherit; color: var(--fg); background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; max-width: 100%; }
  button { cursor: pointer; }
  input[type="checkbox"] { width: 18px; height: 18px; }
  .muted, .msg { color: var(--muted); }
  .err { color: #b00020; padding: 8px 0; }
  @media (prefers-color-scheme: dark) { .err { color: #ff8a80; } }
</style>
