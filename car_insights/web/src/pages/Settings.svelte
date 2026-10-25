<script>
  import { tick } from "svelte";
  import { get, send } from "../lib/api.js";
  import { when } from "../lib/format.js";
  import FixedCosts from "./settings/FixedCosts.svelte";
  import Prices from "./settings/Prices.svelte";
  import "./settings/settings.css";

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
  // the card fields are sent together; a blank one counts as 0
  const setCard = (v, card) => () => send("PUT", `api/ui/vehicles/${v.id}/card`, card);

  load();
</script>

<div class="page settings">
<h1 class="page-title">Settings</h1>
{#if error}<p class="err" role="alert">{error}</p>{/if}
{#if data}
  <h2>Cost groups</h2>
  <div class="list card">
    {#each data.groups as g (g.id)}
      <form class="row" onsubmit={(e) => { e.preventDefault(); rename(g); }}>
        <label class="grow"><span class="sr">Group name</span><input bind:value={names[g.id]} required maxlength="40" /></label>
        <button class="press" type="submit" disabled={busy} aria-label={`Rename ${g.name}`}>Rename</button>
        <button type="button" class="danger press" disabled={busy} aria-label={`Delete ${g.name}`} onclick={() => remove(g)}>Delete</button>
      </form>
    {:else}
      <p class="row muted">No groups yet.</p>
    {/each}
    <form class="row" onsubmit={(e) => { e.preventDefault(); addGroup(); }}>
      <label class="grow"><span class="sr">New group</span><input bind:value={newName} required maxlength="40" placeholder="New group" /></label>
      <button class="press" type="submit" disabled={busy}>Add group</button>
    </form>
  </div>

  <Prices {data} {change} />

  <h2>Vehicles</h2>
  <p class="note caption">Users appear here after they open this page once. Administrators always see every vehicle.</p>
  {#each data.vehicles as v (v.id)}
    <section>
      <h3>{v.name}</h3>
      <div class="list card">
        <label class="row split">Cost group
          <select disabled={busy} value={v.group_id ?? ""} onchange={(e) => control(e, setVehicle(v, e.currentTarget.value || null, v.viewers), (el) => (el.value = v.group_id ?? ""))}>
            <option value="">No group</option>
            {#each data.groups as g}<option value={g.id}>{g.name}</option>{/each}
          </select>
        </label>
        {#each [["markup_pct", "Card markup %"], ["start_fee", "Card start fee"]] as [key, label]}
          {@const card = data.prices.cards[v.id] ?? { markup_pct: 0, start_fee: 0 }}
          <label class="row split">{label}
            <input type="number" min="0" step="any" inputmode="decimal" disabled={busy} value={card[key]}
              onchange={(e) => control(e, setCard(v, { ...card, [key]: Number(e.currentTarget.value) }), (el) => (el.value = card[key]))} />
          </label>
        {/each}
      </div>
      <fieldset>
        <legend>Viewers</legend>
        <div class="list card">
          {#each data.users as u (u.id)}
            <label class="row split">
              <span>{u.name || u.id} <span class="muted">(last seen {when(u.last_seen)})</span></span>
              <input type="checkbox" disabled={busy} checked={v.viewers.includes(u.id)} onchange={(e) => { const on = e.currentTarget.checked; control(e, setVehicle(v, v.group_id, on ? [...v.viewers, u.id] : v.viewers.filter((x) => x !== u.id)), (el) => (el.checked = !on)); }} />
            </label>
          {:else}
            <p class="row muted">No users yet.</p>
          {/each}
        </div>
      </fieldset>
    </section>
  {/each}
  <FixedCosts {data} {change} />
{:else if !error}
  <p class="msg">Loading…</p>
{/if}
</div>

<style>
  .page { max-width: 640px; }
  .err { margin: 0 0 8px; padding: 8px 14px; color: var(--warn-text); }
</style>
