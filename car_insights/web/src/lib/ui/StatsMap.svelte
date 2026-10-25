<script>
  import { get, latest } from "../api.js";
  import { hashOf } from "../activity.js";
  import { mapUrl } from "../stats.js";
  import MapView from "./MapView.svelte";

  let { view, period, at } = $props();

  let card = $state();
  let seen = $state(false); // the map loads once the card first scrolls into view
  let map = $state(null);
  let error = $state(false);
  const request = latest();

  $effect(() => {
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && ((seen = true), io.disconnect()));
    io.observe(card);
    return () => io.disconnect();
  });

  async function load() {
    const ticket = request.next();
    error = false;
    try {
      const d = await get(mapUrl(view, period, at));
      if (!ticket.current) return;
      map = {
        lines: d.trips.map((t) => ({ points: t.route, kind: "trip", href: hashOf({ kind: "trip", vehicle_id: t.vid, start: t.start }) })),
        dots: d.charges.map((c) => ({ lat: c.lat, lon: c.lon, kind: "charge", href: hashOf({ kind: "charge", vehicle_id: c.vid, start: c.start }) })),
      };
    } catch {
      if (ticket.current) error = true;
    }
  }
  $effect(() => {
    if (!seen) return;
    load();
    return request.reset; // a new view, period or date drops the reply still on its way
  });
</script>

<section class="d-card" bind:this={card}>
  <div class="d-head"><h2>Map</h2></div>
  {#if error}
    <div class="msg" role="alert">
      <p>Couldn't load the map.</p>
      <button class="d-btn" onclick={load}>Retry</button>
    </div>
  {:else if !map}
    <p class="d-msg" aria-busy={seen}>{seen ? "Loading…" : ""}</p>
  {:else if !map.lines.length && !map.dots.length}
    <p class="d-msg">No trips this {period}</p>
  {:else}
    <MapView lines={map.lines} dots={map.dots} height={320} />
  {/if}
</section>

<style>
  .msg { --accent: var(--trip-text); text-align: center; color: var(--muted); }
</style>
