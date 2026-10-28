<script>
  import { tick } from "svelte";
  import { get, hasPlaces, latest, send } from "../lib/api.js";
  import { ADD_CAR_PATH, CONFIGURE_PATH, STOPPED, navigateHa, removalMessage, splitCars, stoppedWithLastCar } from "../lib/cars.js";
  import { canShowAgain } from "../lib/onboarding.js";
  import { dateTime } from "../lib/time.js";
  import FixedCosts from "./settings/FixedCosts.svelte";
  import Prices from "./settings/Prices.svelte";
  import "./settings/settings.css";

  let { section = null } = $props(); // "prices" or "cars": scrolled into view once the page has loaded

  let data = $state(null);
  let onboarding = $state(null); // the Getting started checklist's state; null when it could not be read
  let error = $state("");
  let newName = $state("");
  let names = $state({});
  let removing = $state(null); // id of the car whose Remove car choice is open
  let removed = false; // a removal answered: the reload after it may find Car Insights stopped with its last car
  let stopped = $state(false);
  let addCar = $state(); // where focus goes when the control that had it went with its car
  let pending = $state(0); // changes still running; the controls stay disabled until the last one is done
  const busy = $derived(pending > 0);
  const request = latest();

  const fail = (e) => (error = e.detail || `Could not save (${e.message})`);

  async function load() {
    const ticket = request.next();
    const afterRemoval = removed;
    removed = false;
    try {
      const [d, o] = await Promise.all([get("settings"), get("onboarding").catch(() => null)]);
      if (!ticket.current) return;
      data = d;
      onboarding = o;
      stopped = false;
      names = Object.fromEntries(d.groups.map((g) => [g.id, g.name]));
    } catch (e) {
      if (!ticket.current) return;
      if (stoppedWithLastCar(e, afterRemoval)) {
        stopped = true;
        data = { ...data, vehicles: [] };
      } else error = `Could not load (${e.message})`;
    }
  }

  // Every change is sent at once; on failure show the error and reload so the form shows the truth.
  async function change(fn) {
    error = "";
    pending++;
    let ok = true;
    try {
      await fn();
    } catch (e) {
      ok = false;
      fail(e);
    }
    await load();
    pending--;
    return ok;
  }

  // Svelte skips the DOM write when the bound value is unchanged, so a rejected change must be undone by hand.
  async function control(e, fn, reset) {
    const el = e.currentTarget;
    if (!(await change(fn))) reset(el);
    await tick();
    el.focus(); // disabling while busy dropped focus
  }

  // Disabling the buttons while busy drops focus: give it back to whatever had it (the input on Enter, the button on click),
  // or to `gone` when that left the page.
  async function keepFocus(fn, gone) {
    const el = document.activeElement;
    await fn();
    await tick();
    (el?.isConnected ? el : gone)?.focus();
  }

  const addGroup = () => keepFocus(async () => {
    await change(() => send("POST", "groups", { name: newName }));
    if (!error) newName = "";
  });
  const rename = (g) => keepFocus(() => change(() => send("PUT", `groups/${g.id}`, { name: names[g.id] })));
  const remove = (g) => confirm(`Delete group "${g.name}"?`) && change(() => send("DELETE", `groups/${g.id}`));
  const setVehicle = (v, group_id, viewers) => () => send("PUT", `vehicles/${v.id}`, { group_id, viewers });
  const removeCar = (v, history) => {
    removing = null;
    return keepFocus(() => change(async () => {
      const reply = await send("DELETE", `vehicles/${v.id}?history=${history}`);
      removed = true;
      error = removalMessage(reply) ?? "";
    }), addCar);
  };
  const deleteEverything = (v) => confirm(`Remove "${v.name}" and delete everything stored for it? This cannot be undone.`) && removeCar(v, "delete");
  const deleteHistory = (v) => confirm(`Delete the stored history of "${v.name}"? This cannot be undone.`) && keepFocus(() => change(() => send("DELETE", `vehicles/${v.id}/history`)), addCar);
  const focus = (el) => el.focus();
  // the card fields are sent together; a blank one counts as 0
  const setCard = (v, card) => () => send("PUT", `vehicles/${v.id}/card`, card);

  const showGettingStarted = async () => {
    if (await change(() => send("PUT", "onboarding", { hidden: false }))) location.hash = "#/activity";
  };

  // the route's section (#/settings/prices) comes into view and gets focus once its heading is on the page, once: a reload after a save must not scroll back
  let scrolledTo = null;
  $effect(() => {
    if (!section) scrolledTo = null;
    else if (data && section !== scrolledTo) {
      scrolledTo = section;
      const heading = document.getElementById(section);
      heading?.scrollIntoView();
      heading?.focus({ preventScroll: true }); // keyboard and screen reader users land at the section too
    }
  });

  load();
</script>

<div class="page settings">
<h1 class="page-title">Settings</h1>
{#if error}<p class="err" role="alert">{error}</p>{/if}
{#if stopped}<p class="note" role="status">{STOPPED}</p>{/if}
{#if data}
  {@const cars = splitCars(data.vehicles)}
  <div class="blocks">
  <div class="block">
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
  </div>

  <div class="block"><Prices {data} {change} /></div>

  <div class="block">
  <h2 id="cars" tabindex="-1">Cars</h2>
  <p class="note caption">Users appear here after they open this page once. Administrators always see every car.</p>
  <div class="row"><button class="press" type="button" disabled={busy} bind:this={addCar} onclick={() => navigateHa(ADD_CAR_PATH)}>Add car</button></div>
  {#each cars.active as v (v.id)}
    <section>
      <h3>{v.name}</h3>
      <div class="row">
        <button class="press" type="button" disabled={busy} onclick={() => navigateHa(CONFIGURE_PATH)}>Configure</button>
        {#if removing === v.id}
          <button class="danger press" type="button" disabled={busy} onclick={() => removeCar(v, "keep")}>Keep its history</button>
          <button class="danger press" type="button" disabled={busy} onclick={() => deleteEverything(v)}>Delete everything</button>
          <button class="press" type="button" {@attach focus} onclick={() => (removing = null)}>Cancel</button>
        {:else}
          <button class="danger press" type="button" disabled={busy} onclick={() => (removing = v.id)}>Remove car</button>
        {/if}
      </div>
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
              <span>{u.name || u.id} <span class="muted">(last seen {dateTime(u.last_seen)})</span></span>
              <input type="checkbox" disabled={busy} checked={v.viewers.includes(u.id)} onchange={(e) => { const on = e.currentTarget.checked; control(e, setVehicle(v, v.group_id, on ? [...v.viewers, u.id] : v.viewers.filter((x) => x !== u.id)), (el) => (el.checked = !on)); }} />
            </label>
          {:else}
            <p class="row muted">No users yet.</p>
          {/each}
        </div>
      </fieldset>
    </section>
  {/each}
  </div>
  {#if cars.archived.length}
    <div class="block">
    <h2>Archived</h2>
    <div class="list card">
      {#each cars.archived as v (v.id)}
        <div class="row split">
          <span>{v.name} <span class="muted">Archived</span></span>
          <button class="danger press" type="button" disabled={busy} onclick={() => deleteHistory(v)}>Delete history</button>
        </div>
      {/each}
    </div>
    </div>
  {/if}
  <div class="block"><FixedCosts {data} {change} /></div>
  {#if onboarding && canShowAgain(onboarding, hasPlaces())}
    <div class="block row"><button class="press" type="button" disabled={busy} onclick={showGettingStarted}>Show getting started</button></div>
  {/if}
  </div>
{:else if !error}
  <p class="msg">Loading…</p>
{/if}
</div>

<style>
  .page { max-width: 640px; }
  /* a wide screen: the sections flow into two columns, each still a readable width */
  @media (min-width: 1200px) {
    .page { max-width: 1320px; }
    .blocks { columns: 2; column-gap: 24px; }
    .block { break-inside: avoid; display: flow-root; } /* its heading margin stays inside, also at the top of the second column */
  }
  .err { margin: 0 0 8px; padding: 8px 14px; color: var(--warn-text); }
</style>
