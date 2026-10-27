<script module>
  let fromList = false; // the open detail was reached from a card, so the history entry before it is the list
</script>

<script>
  import { untrack } from "svelte";
  import { get, hasPlaces, latest } from "../lib/api.js";
  import { feed, hashOf, linkAction, load, more, neighbours, refresh, visible } from "../lib/activity.svelte.js";
  import { daySummary } from "../lib/format.js";
  import { showCard } from "../lib/onboarding.js";
  import { dayLabel } from "../lib/time.js";
  import { screen } from "../lib/media.svelte.js";
  import { cssMs } from "../lib/motion.js";
  import ChargeCard from "../lib/ui/ChargeCard.svelte";
  import GettingStarted from "../lib/ui/GettingStarted.svelte";
  import LiveStrip from "../lib/ui/LiveStrip.svelte";
  import Segmented from "../lib/ui/Segmented.svelte";
  import DetailPane from "../lib/ui/DetailPane.svelte";
  import TripCard from "../lib/ui/TripCard.svelte";
  import ChargeDetail from "./ChargeDetail.svelte";
  import TripDetail from "./TripDetail.svelte";

  // detail: {kind: "trip" | "charge", vid, start} from the route, or null
  let { view, detail = null, isAdmin = false } = $props();

  const FILTERS = [{ value: "all", label: "All" }, { value: "trips", label: "Trips" }, { value: "charges", label: "Charges" }];
  const EMPTY = { all: "Your trips and charges appear here after the first drive.", trips: "No trips yet.", charges: "No charges yet." };

  let vehicles = $state([]);
  let onboarding = $state(null); // the Getting started checklist's state, read only for an administrator
  let title = $state();
  let sentinel = $state();
  // the list shows `shown`, which follows the filter after the old list has faded out; both halves together are --fade
  let shown = $state(feed.filter);
  let out = $state(false);
  let listEl;
  const days = $derived(visible(feed.days, shown));
  const open = $derived(detail && hashOf({ kind: detail.kind, vehicle_id: detail.vid, start: detail.start }));
  const around = $derived(detail ? neighbours(feed.days, feed.filter, detail.kind, detail.vid, detail.start) : { prev: null, next: null });
  const isOpen = (item) => detail?.kind === item.kind && detail.vid === item.vehicle_id && detail.start === item.start;

  // a card clicked while a detail is open replaces it, so closing is still one step back to the list
  const picked = (e) => {
    if (e.button !== 0 || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (linkAction({ detailOpen: !!detail }) === "replace") {
      e.preventDefault();
      location.replace(e.currentTarget.getAttribute("href"));
    } else fromList = true;
  };
  // back to the list: one step back when it is the entry before, else replace the detail (a link opened cold)
  const close = () => (fromList ? history.back() : location.replace("#/activity"));

  // stepping with the arrows keeps the open card in view (beside the list only; elsewhere the list under the pane keeps its scroll)
  $effect(() => {
    if (open && screen.split) listEl?.querySelector("[aria-current=page]")?.closest("li").scrollIntoView({ block: "nearest" });
  });

  let last = "";
  $effect(() => {
    if (open) return void (last = open);
    fromList = false;
    if (!last || !listEl) return;
    // focus goes back to the card that was open
    [...listEl.querySelectorAll("a")].find((a) => a.getAttribute("href") === last)?.focus({ preventScroll: true });
    last = "";
  });

  const liveRequest = latest();
  async function live() {
    const ticket = liveRequest.next();
    try {
      const d = await get(`overview?view=${encodeURIComponent(view)}`);
      if (ticket.current) vehicles = d.vehicles;
    } catch {} // the strip keeps what it shows
  }

  const onboardingRequest = latest();
  async function loadOnboarding() {
    if (!isAdmin) return;
    const ticket = onboardingRequest.next();
    try {
      const d = await get("onboarding");
      if (ticket.current) onboarding = d; // an older reply must not bring the card back after Hide
    } catch {} // the card keeps what it shows, or stays away
  }

  $effect(() => {
    load(view);
    live();
    loadOnboarding();
    return () => (liveRequest.reset(), onboardingRequest.reset()); // another view (or leaving the page) drops the replies still on their way
  });

  $effect(() => {
    const f = feed.filter;
    if (f === untrack(() => shown)) return void (out = false); // back to the shown filter before the swap
    out = true;
    const half = cssMs("--fade") / 2; // the list fades out in half of --fade
    const t = setTimeout(() => ((shown = f), (out = false)), half);
    return () => clearTimeout(t);
  });

  // also when the page comes back to the front: the Companion app keeps the WebView alive while parked
  $effect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        refresh();
        live();
        loadOnboarding(); // the first data, or a price set elsewhere, ticks a step
      }
    };
    const id = setInterval(tick, 60_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  });

  // observing anew after every page (loading flips) reports a sentinel that is still in view
  $effect(() => {
    if (!sentinel || feed.next == null || feed.loading || feed.error) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more(), { rootMargin: "400px" });
    io.observe(sentinel);
    return () => io.disconnect();
  });
</script>

<div class="split" class:two={screen.split && detail}>
<div class="page" class:wide={screen.wide}>
  <h1 class="page-title" tabindex="-1" bind:this={title}>Activity</h1>
  {#if onboarding && showCard(isAdmin, onboarding, hasPlaces())}
    <GettingStarted checklist={onboarding} places={hasPlaces()} reload={loadOnboarding} gone={title} />
  {/if}
  <LiveStrip {vehicles} />
  <div class="filter"><Segmented options={FILTERS} bind:value={feed.filter} label="Show" /></div>

  <div class="list" class:out bind:this={listEl}>
    {#each days as day (day.date)}
      {@const summary = daySummary(day.summary)}
      <section>
        <h2 class="chrome">{dayLabel(day.date, feed.today)}{#if summary}<span>{" · "}{summary}</span>{/if}</h2>
        <ul>
          {#each day.items as item (`${item.kind}/${item.vehicle_id}/${item.start}`)}
            <li>
              {#if item.kind === "trip"}
                <TripCard {item} current={isOpen(item)} onclick={picked} />
              {:else}
                <ChargeCard {item} current={isOpen(item)} onclick={picked} />
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
      <button class="btn" onclick={() => (feed.days.length ? more() : load(view))}>Retry</button>
    </div>
  {:else if feed.loading}
    <p class="msg" aria-busy="true">Loading…</p>
  {:else if feed.next != null}
    <div bind:this={sentinel} aria-hidden="true"></div>
  {/if}
</div>

{#if detail}
  <DetailPane id={open} onclose={close} prev={around.prev} next={around.next}>
    {#if detail.kind === "trip"}
      <TripDetail vid={detail.vid} start={detail.start} />
    {:else}
      <ChargeDetail vid={detail.vid} start={detail.start} {isAdmin} />
    {/if}
  </DetailPane>
{/if}
</div>

<style>
  .split.two { display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 24px; align-items: start; } /* only while a detail is open; the list is a single column otherwise */
  .page { --bleed: 16px; max-width: 760px; }
  .page.wide { --bleed: 24px; }
  .filter { margin: 12px 0 4px; }
  .list { transition: opacity calc(var(--fade) / 2); }
  .list.out { opacity: 0; }
  h2 {
    position: sticky; top: 0; z-index: 2; margin: 0 calc(-1 * var(--bleed)); padding: 14px var(--bleed) 6px;
    font-size: var(--fs-body); font-weight: 600;
    border-bottom: var(--edge);
  }
  h2 span { font-weight: 400; color: var(--muted); }
  li { scroll-margin-block: 56px; } /* clear of the sticky day header */
  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; container-type: inline-size; } /* the cards size to the list, not the screen */
</style>
