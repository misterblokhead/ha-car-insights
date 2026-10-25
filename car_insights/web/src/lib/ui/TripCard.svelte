<script>
  import { hashOf } from "../activity.js";
  import { km, consumption, kwh, duration } from "../format.js";
  import { clock } from "../time.js";
  import { place, routeLabel } from "../detail.js";
  import Card from "./Card.svelte";
  import RouteOutline from "./RouteOutline.svelte";

  let { item, current = false, onclick } = $props();
  const [dist, unit] = $derived(km(item.distance_m).split(" "));
  const when = $derived(`${clock(item.start)} · ${item.end == null ? "now" : duration(item.duration_s)}`);
</script>

<Card href={hashOf(item)} {current} {onclick} kind="trip" title="{place(item.from)} → {place(item.to)}" value={dist} {unit} {when}>
  {#snippet glyph()}
    <svg class="icon" viewBox="0 0 24 24"><path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10" /></svg>
  {/snippet}
  {#snippet aside()}
    <!-- the box stays when there is no outline, so cards keep one height -->
    <span class="route">
      <RouteOutline points={item.route} width={120} height={84} label={routeLabel(item)} />
    </span>
    <span class="caption stats">{consumption(item.wh_per_100km)}<br />{kwh(item.net_wh)}</span>
  {/snippet}
</Card>

<style>
  .route { grid-column: 3; width: 120px; height: 84px; }
  .stats { grid-column: 3; text-align: right; }
  @container (min-width: 520px) {
    .route { grid-column: 3; grid-row: 1 / 3; }
    .stats { grid-column: 4; grid-row: 2; align-self: start; }
  }
</style>
