<script>
  import { untrack } from "svelte";
  import { get } from "../lib/api.js";
  import { feed, load, more, refresh, visible } from "../lib/activity.svelte.js";
  import { dayLabel, daySummary } from "../lib/format.js";
  import { screen } from "../lib/media.svelte.js";
  import ChargeCard from "../lib/ui/ChargeCard.svelte";
  import LiveStrip from "../lib/ui/LiveStrip.svelte";
  import Segmented from "../lib/ui/Segmented.svelte";
  import TripCard from "../lib/ui/TripCard.svelte";

  let { view } = $props();

  const FILTERS = [{ value: "all", label: "All" }, { value: "trips", label: "Trips" }, { value: "charges", label: "Charges" }];
  const EMPTY = { all: "Your trips and charges appear here after the first drive.", trips: "No trips yet.", charges: "No charges yet." };

  let vehicles = $state([]);
  let sentinel = $state();
  // the list shows `shown`, which follows the filter after the old list has faded out; both halves together are --fade
  let shown = $state(feed.filter);
  let out = $state(false);
  let listEl;
  const days = $derived(visible(feed.days, shown));

  async function live() {
    try {
      vehicles = (await get(`api/ui/overview?view=${encodeURIComponent(view)}`)).vehicles;
    } catch {} // the strip keeps what it shows
  }

  $effect(() => {
    load(view);
    live();
  });

  $effect(() => {
    const f = feed.filter;
    if (f === untrack(() => shown)) return void (out = false); // back to the shown filter before the swap
    out = true;
    const half = parseFloat(getComputedStyle(listEl).transitionDuration) * 1000 || 75; // computed, so always in seconds
    const t = setTimeout(() => ((shown = f), (out = false)), half);
    return () => clearTimeout(t);
  });

  $effect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
        live();
      }
    }, 60_000);
    return () => clearInterval(id);
  });

  // observing anew after every page (loading flips) reports a sentinel that is still in view
  $effect(() => {
    if (!sentinel || feed.next == null || feed.loading || feed.error) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more(), { rootMargin: "400px" });
    io.observe(sentinel);
    return () => io.disconnect();
  });
</script>

<div class="page" class:wide={screen.wide}>
  <h1>Activity</h1>
  <LiveStrip {vehicles} />
  <div class="filter"><Segmented options={FILTERS} bind:value={feed.filter} label="Show" /></div>

  <div class="list" class:out bind:this={listEl}>
    {#each days as day (day.date)}
      {@const summary = daySummary(day.summary)}
      <section>
        <h2>{dayLabel(day.date, feed.today)}{#if summary}<span>{" · "}{summary}</span>{/if}</h2>
        <ul>
          {#each day.items as item (`${item.kind}/${item.vehicle_id}/${item.start}`)}
            <li>
              {#if item.kind === "trip"}
                <TripCard {item} />
              {:else}
                <ChargeCard {item} capacity={feed.capacity_wh[item.vehicle_id]} />
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/each}
    {#if !days.length && !feed.loading && !feed.error && feed.next == null}
      <p class="msg">{EMPTY[shown]}</p>
    {/if}
  </div>

  {#if feed.error}
    <div class="msg" role="alert">
      <p>Couldn't load your activity.</p>
      <button onclick={() => (feed.days.length ? more() : load(view))}>Retry</button>
    </div>
  {:else if feed.loading}
    <p class="msg" aria-busy="true">Loading…</p>
  {:else if feed.next != null}
    <div bind:this={sentinel} aria-hidden="true"></div>
  {/if}
</div>

<style>
  .page { --bleed: 16px; max-width: 760px; }
  .page.wide { --bleed: 24px; }
  h1 { margin: 0 0 12px; font-size: var(--fs-title); font-weight: 700; letter-spacing: -0.01em; }
  .filter { margin: 12px 0 4px; }
  .list { transition: opacity calc(var(--fade) / 2); }
  .list.out { opacity: 0; }
  h2 {
    position: sticky; top: 0; z-index: 2; margin: 0 calc(-1 * var(--bleed)); padding: 14px var(--bleed) 6px;
    font-size: var(--fs-body); font-weight: 600;
    background: var(--chrome); -webkit-backdrop-filter: var(--chrome-filter); backdrop-filter: var(--chrome-filter);
  }
  h2 span { font-weight: 400; color: var(--muted); }
  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .msg { padding: 24px 0; text-align: center; color: var(--muted); }
  .msg p { margin: 0 0 8px; }
  button {
    min-height: 44px; min-width: 44px; padding: 0 20px; border: 0; border-radius: var(--radius-ctl);
    background: var(--fill); color: var(--trip); font: inherit; font-weight: 600; cursor: pointer; transition: transform 100ms;
  }
  button:active { transform: scale(var(--press-scale)); }
  button:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
</style>
