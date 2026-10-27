<script>
  import { tick } from "svelte";
  import { send } from "../api.js";
  import { navigateHa } from "../cars.js";
  import { DOCS, hints, steps } from "../onboarding.js";

  // The admin's checklist at the top of Activity. `checklist` is GET /onboarding, `places` api.hasPlaces(); `reload` fetches the state again
  // after a change; `gone` is where focus goes when Hide takes the card away.
  let { checklist, places, reload, gone } = $props();

  const HINT = {
    car_app: "Put the .conf file on the car's USB stick and check that the car app is running.",
    integration: "Car Insights reads your car's integration every few minutes. Check that its entities are not unavailable.",
    missing: "Some of its entities are missing: see Settings → System → Repairs.",
  };
  const TITLE = {
    car: "Add your car",
    data: "First data from your car",
    prices: "Set your electricity prices",
    places: "Name your places",
    viewers: "Choose who sees what",
    dashboard: "Dashboard and sensors",
  };
  const n = $derived(checklist.cars.length);
  const detail = $derived({
    car: `${n} ${n === 1 ? "car is" : "cars are"} set up`,
    places: "Trips then read Home → Work instead of street names.",
    viewers: "Only matters when other people use this Home Assistant.",
  });
  const list = $derived(steps(checklist, places));
  const waiting = $derived(hints(checklist));

  let error = $state("");
  let busy = $state(false);

  async function put(body) {
    error = "";
    busy = true;
    try {
      await send("PUT", "onboarding", body);
      return true;
    } catch (e) {
      error = e.detail || `Could not save (${e.message})`;
      return false;
    } finally {
      busy = false;
    }
  }

  async function hide() {
    if (await put({ hidden: true })) await reload();
    await tick();
    gone?.focus(); // the Hide button went with the card
  }
  // the mark is saved before the page changes, so the checklist found on the way back already shows it
  async function viewers(e) {
    e.preventDefault();
    await put({ opened: "viewers" });
    location.hash = "#/settings/cars";
  }
  async function dashboard() {
    if (await put({ opened: "dashboard" })) await reload();
  }
</script>

<section class="card" aria-labelledby="getting-started">
  <div class="head">
    <h2 id="getting-started">Getting started</h2>
    <button class="press" type="button" disabled={busy} onclick={hide}>Hide</button>
  </div>
  {#if error}<p class="err" role="alert">{error}</p>{/if}
  <ol>
    {#each list as s (s.id)}
      <li>
        <span class="mark" class:done={s.done} aria-hidden="true">{s.done ? "✓" : ""}</span>
        <div class="body">
          <span class="title"><span class="sr">{s.done ? "Done: " : "To do: "}</span>{TITLE[s.id]}</span>
          {#if detail[s.id]}<span class="caption">{detail[s.id]}</span>{/if}
          {#if s.id === "data" && !s.done}
            <span class="caption">Waiting for your car's first data…</span>
            {#each waiting as w}
              {#each w.kinds as k}<span class="caption">{n > 1 ? `${w.name}: ` : ""}{HINT[k]}</span>{/each}
            {/each}
          {/if}
          {#if s.id === "prices"}
            <a href="#/settings/prices">Open prices</a>
          {:else if s.id === "places"}
            <button class="link press" type="button" onclick={() => navigateHa("/config/zone")}>Open zones</button>
          {:else if s.id === "viewers"}
            <a href="#/settings/cars" onclick={viewers}>Open cars</a>
          {:else if s.id === "dashboard"}
            <a href={DOCS + "sensors-and-dashboard.md"} target="_blank" rel="noopener" onclick={dashboard}>Read how</a>
          {/if}
        </div>
      </li>
    {/each}
  </ol>
</section>

<style>
  section { margin: 12px 0; padding: 4px 14px 8px; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  h2 { margin: 0; font-size: var(--fs-body); font-weight: 600; }
  button, a { font: inherit; font-weight: 600; color: var(--trip-text); }
  button { min-height: 44px; min-width: 44px; padding: 0 8px; background: none; border: 0; }
  .err { margin: 0 0 8px; color: var(--warn-text); }
  ol { list-style: none; margin: 0; padding: 0; }
  li { display: flex; gap: 12px; padding: 8px 0; }
  li + li { border-top: 1px solid var(--line); }
  .mark { flex: none; width: 22px; height: 22px; box-sizing: border-box; display: grid; place-items: center; border-radius: 50%; border: 2px solid var(--line); font-size: 13px; line-height: 1; }
  .mark.done { border-color: var(--good); background: var(--good); color: var(--on-charge); }
  .body { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }
  a, .link { display: inline-flex; align-items: center; min-height: 44px; text-decoration: none; }
  .link { padding: 0; }
</style>
