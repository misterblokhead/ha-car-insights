<script>
  import { tick } from "svelte";
  import { get, send } from "../lib/api.js";
  import { when } from "../lib/format.js";

  let data = $state(null);
  let error = $state("");
  let newName = $state("");
  let names = $state({});
  let busy = $state(false);

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
    busy = true;
    let ok = true;
    try {
      await fn();
    } catch (e) {
      ok = false;
      fail(e);
    }
    await load();
    busy = false;
    return ok;
  }

  // Svelte skips the DOM write when the bound value is unchanged, so a rejected change must be undone by hand.
  async function control(e, fn, reset) {
    const el = e.currentTarget;
    if (!(await change(fn))) reset(el);
    await tick();
    el.focus(); // disabling while busy dropped focus
  }

  // Disabling the buttons while busy drops focus: give it back to whatever had it (the input on Enter, the button on click).
  async function keepFocus(fn) {
    const el = document.activeElement;
    await fn();
    await tick();
    el?.focus();
  }

  const addGroup = () => keepFocus(async () => {
    await change(() => send("POST", "api/ui/groups", { name: newName }));
    if (!error) newName = "";
  });
  const rename = (g) => keepFocus(() => change(() => send("PUT", `api/ui/groups/${g.id}`, { name: names[g.id] })));
  const remove = (g) => confirm(`Delete group "${g.name}"?`) && change(() => send("DELETE", `api/ui/groups/${g.id}`));
  const setVehicle = (v, group_id, viewers) => () => send("PUT", `api/ui/vehicles/${v.id}`, { group_id, viewers });

  load();
</script>

<div class="page">
<h1>Settings</h1>
{#if error}<p class="err" role="alert">{error}</p>{/if}
{#if data}
  <h2>Cost groups</h2>
  <div class="list">
    {#each data.groups as g (g.id)}
      <form class="row" onsubmit={(e) => { e.preventDefault(); rename(g); }}>
        <label class="grow"><span class="sr">Group name</span><input bind:value={names[g.id]} required maxlength="40" /></label>
        <button type="submit" disabled={busy} aria-label={`Rename ${g.name}`}>Rename</button>
        <button type="button" class="danger" disabled={busy} aria-label={`Delete ${g.name}`} onclick={() => remove(g)}>Delete</button>
      </form>
    {:else}
      <p class="row empty">No groups yet.</p>
    {/each}
    <form class="row" onsubmit={(e) => { e.preventDefault(); addGroup(); }}>
      <label class="grow"><span class="sr">New group</span><input bind:value={newName} required maxlength="40" placeholder="New group" /></label>
      <button type="submit" disabled={busy}>Add group</button>
    </form>
  </div>

  <h2>Vehicles</h2>
  <p class="note">Users appear here after they open this page once. Administrators always see every vehicle.</p>
  {#each data.vehicles as v (v.id)}
    <section>
      <h3>{v.name}</h3>
      <div class="list">
        <label class="row split">Cost group
          <select disabled={busy} value={v.group_id ?? ""} onchange={(e) => control(e, setVehicle(v, e.currentTarget.value || null, v.viewers), (el) => (el.value = v.group_id ?? ""))}>
            <option value="">No group</option>
            {#each data.groups as g}<option value={g.id}>{g.name}</option>{/each}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Viewers</legend>
        <div class="list">
          {#each data.users as u (u.id)}
            <label class="row split">
              <span>{u.name || u.id} <span class="muted">(last seen {when(u.last_seen)})</span></span>
              <input type="checkbox" disabled={busy} checked={v.viewers.includes(u.id)} onchange={(e) => { const on = e.currentTarget.checked; control(e, setVehicle(v, v.group_id, on ? [...v.viewers, u.id] : v.viewers.filter((x) => x !== u.id)), (el) => (el.checked = !on)); }} />
            </label>
          {:else}
            <p class="row empty">No users yet.</p>
          {/each}
        </div>
      </fieldset>
    </section>
  {/each}
{:else if !error}
  <p class="msg">Loading…</p>
{/if}
</div>

<style>
  .page { max-width: 640px; }
  h1 { margin: 0 0 12px; font-size: var(--fs-title); font-weight: 700; letter-spacing: -0.01em; }
  h2, h3, legend { margin: 20px 0 6px 14px; padding: 0; font-size: 13px; font-weight: 400; color: var(--muted); }
  h2 + .note { margin-top: -2px; }
  fieldset { min-width: 0; margin: 14px 0 0; padding: 0; border: 0; }
  .list { background: var(--card); border-radius: var(--radius-card); overflow: hidden; }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; box-sizing: border-box; min-height: 44px; margin: 0; padding: 0 14px; }
  .row + .row { border-top: 1px solid var(--line); }
  .split { justify-content: space-between; cursor: pointer; }
  .grow { flex: 1 1 8em; min-width: 0; }
  .empty, .msg, .note, .muted { color: var(--muted); }
  .note { margin: 0 14px 8px; font-size: 13px; }
  .msg { padding: 24px 0; text-align: center; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  input:not([type="checkbox"]), select, button { font: inherit; color: var(--fg); background: none; border: 0; }
  input:not([type="checkbox"]) { width: 100%; box-sizing: border-box; min-height: 44px; padding: 0; }
  input::placeholder { color: var(--muted); opacity: 1; }
  select { min-height: 44px; max-width: 100%; cursor: pointer; }
  input[type="checkbox"] { flex: none; width: 22px; height: 22px; margin: 0; accent-color: var(--trip); cursor: pointer; }
  button { min-height: 44px; min-width: 44px; padding: 0 8px; font-weight: 600; color: var(--trip-text); cursor: pointer; transition: transform 100ms; }
  button.danger { color: var(--warn-text); }
  button:active:not(:disabled) { transform: scale(var(--press-scale)); }
  button:disabled, select:disabled { opacity: 0.35; cursor: default; }
  :is(input, select, button):focus-visible { outline: 2px solid var(--trip); outline-offset: -2px; border-radius: 6px; } /* inside: the list clips its rows */
  .err { margin: 0 0 8px; padding: 8px 14px; color: #b00020; }
  @media (prefers-color-scheme: dark) { .err { color: #ff8a80; } }
</style>
