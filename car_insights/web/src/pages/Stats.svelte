<script>
  import { get, latest } from "../lib/api.js";
  import { hashOf } from "../lib/activity.js";
  import { NA, km, kwh, kwhPer100, consumption, delta } from "../lib/format.js";
  import { dayKey, dayLabel, today } from "../lib/time.js";
  import { per10, scoreWord, split, tripTitle } from "../lib/detail.js";
  import { eur, per100 as costPer100, uncostedText } from "../lib/costs.js";
  import { bucketLabel, change, periodLabel, places, statsUrl, styleRows } from "../lib/stats.js";
  import Chart from "../lib/Chart.svelte";
  import Figure from "../lib/ui/Figure.svelte";
  import Segmented from "../lib/ui/Segmented.svelte";
  import StatsMap from "../lib/ui/StatsMap.svelte";

  let { view } = $props();

  const PERIODS = [{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }];
  const PLACE = ["--charge", "--trip", "--energy", "--p3", "--p4"];
  let period = $state("week");
  let at = $state(null); // null: the server's today
  let data = $state(null);
  let error = $state(false);
  let loading = $state(true);
  const request = latest();

  // switching the period starts at the present again; the arrows wait for its data, so a step uses the dates of the period on screen
  const setPeriod = (p) => ((period = p), (at = null));

  // the newest request wins; the data on screen stays (dimmed) until the next arrives
  async function load() {
    const ticket = request.next();
    loading = true;
    error = false;
    try {
      const d = await get(statsUrl(view, period, at));
      if (ticket.current) data = d;
    } catch {
      if (ticket.current) error = true;
    } finally {
      if (ticket.current) loading = false;
    }
  }
  $effect(() => {
    load();
    return request.reset; // a new view, period or date drops the reply still on its way
  });

  // "▲ 12 %" against the previous period; null without one. `hint` colours it (more energy used is the warning), never alone
  const tag = (c, hint = false) => {
    if (c == null) return null;
    const r = Math.round(c * 100);
    return { dir: Math.sign(r), text: `${Math.abs(r)} %`, hint };
  };
  const trend = (now, before, hint = false) => tag(change(now, before), hint);
  const per100 = (x) => kwhPer100(x.wh_per_100km);

  const t = $derived(data?.totals);
  const tiles = $derived.by(() => {
    if (!t) return [];
    const p = data.previous;
    const [now, before] = [per100(t), p.trips ? per100(p) : null];
    const d = now != null && before ? Number((now - before).toFixed(1)) : null; // the rounded value is what the arrow follows
    return [
      { label: "Distance", value: split(km(t.distance_m)), trend: trend(t.distance_m, p.distance_m) },
      { label: "Average", value: now == null ? [NA, ""] : [now.toFixed(1), "kWh/100 km"],
        trend: d == null ? null : { dir: Math.sign(d), text: d ? delta(d, "kWh/100", 1) : "0.0 kWh/100", hint: true } },
      { label: "Energy used", value: split(kwh(t.net_wh)), count: `${t.trips} ${t.trips === 1 ? "trip" : "trips"}`, trend: trend(t.net_wh, p.net_wh, true) },
      { label: "Charged", value: split(kwh(t.charged_wh)), count: `${t.charges} ${t.charges === 1 ? "charge" : "charges"}`, trend: trend(t.charged_wh, p.charged_wh) },
    ];
  });

  // bars: distance per bucket on the left axis, consumption as a line on the right
  const buckets = $derived(data?.buckets ?? []);
  const labels = $derived(buckets.map((b) => bucketLabel(period, b.start)));
  const line = $derived(buckets.map((b) => kwhPer100(b.wh_per_100km)));
  const xaxis = $derived({
    // a month names its 1st and every 5th day so the labels do not touch
    splits: labels.map((l, i) => i).filter((i) => period !== "month" || labels[i] === "1" || Number(labels[i]) % 5 === 0),
    values: (u, splits) => splits.map((i) => labels[i]),
  });
  const series = $derived([
    { label: "Distance (km)", values: buckets.map((b) => b.distance_m / 1000), kind: "bars", color: "--trip" },
    ...(line.some((v) => v != null) ? [{ label: "kWh/100 km", values: line, scale: "y2", color: "--energy" }] : []),
  ]);
  const unit = $derived(period === "year" ? "month" : "day");
  const chartLabel = $derived(t ? `Distance per ${unit}: ${km(t.distance_m)} in total, average ${consumption(t.wh_per_100km)}` : "");

  const segments = $derived(data ? places(data.by_place) : []);
  const tint = (s, i) => (s.other ? "--muted" : PLACE[i % PLACE.length]);

  const costTrend = $derived(t ? trend(t.cost.total, data.previous.cost.total, true) : null); // more spent is the warning, like more energy
  const hl = $derived(data?.highlights);
  const share = $derived(hl?.gross_wh > 0 ? Math.round((hl.recup_wh / hl.gross_wh) * 100) : null);
  const style = $derived(data?.style);
  const sty = $derived(style?.km > 0 ? styleRows(style, data.previous_style) : null);
  const points = $derived(sty?.points == null ? null : { dir: Math.sign(sty.points), text: sty.points ? `${sty.points < 0 ? "−" : "+"}${Math.abs(sty.points)}` : "same", hint: false }); // points: a percentage of a 0–100 score reads oddly
  const when = (ms) => dayLabel(dayKey(ms), today()); // at render, so a page left open past midnight labels right
  const trip = (x) => hashOf({ kind: "trip", vehicle_id: x.vehicle_id, start: x.start });
</script>

{#snippet changeTag(tr)}
  <span class="trend" class:up={tr.hint && tr.dir > 0} class:down={tr.hint && tr.dir < 0}>
    {#if tr.dir}<span aria-hidden="true">{tr.dir > 0 ? "▲" : "▼"}</span><span class="sr">{tr.dir > 0 ? "up" : "down"}</span>{/if}
    {tr.text}
  </span>
{/snippet}

<div class="page">
  <h1 class="page-title">Statistics</h1>
  <div class="seg"><Segmented options={PERIODS} bind:value={() => period, setPeriod} label="Period" /></div>

  <div class="nav">
    <button class="press" onclick={() => (at = data.period.prev_at)} disabled={!data || loading} aria-label="Previous {period}">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <h2 aria-live="polite">{data ? periodLabel(period, data.period.start, data.period.end) : ""}</h2>
    <button class="press" onclick={() => (at = data.period.next_at)} disabled={loading || !data?.period.next_at} aria-label="Next {period}">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
    </button>
  </div>

  {#if error}
    <div class="msg" role="alert">
      <p>Couldn't load your statistics.</p>
      <button class="d-btn" onclick={load}>Retry</button>
    </div>
  {:else if !data}
    <p class="msg" aria-busy="true">Loading…</p>
  {:else}
    <div class="grid" class:busy={loading} aria-busy={loading}>
      <div class="col">
        <div class="tiles">
          <div class="d-figs">
            {#each tiles as f (f.label)}
              <Figure label={f.label} value={f.value[0]} unit={f.value[1]}>
                {#if f.count || f.trend}
                  <span class="sub caption">
                    {#if f.count}<span>{f.count}</span>{/if}
                    {#if f.trend}{@render changeTag(f.trend)}{/if}
                  </span>
                {/if}
              </Figure>
            {/each}
          </div>
          {#if tiles.some((f) => f.trend)}<p class="d-note">Change against the previous {period}</p>{/if}
        </div>

        {#if data.per_vehicle}
          <section class="d-card pv">
            <h2>By car</h2>
            <ul>
              {#each data.per_vehicle as v (v.id)}
                <li>
                  <b>{v.name}</b>
                  <span class="d-note facts"><span>{km(v.totals.distance_m)}</span><span>{consumption(v.totals.wh_per_100km)}</span><span>{kwh(v.totals.net_wh)} used</span><span>{kwh(v.totals.charged_wh)} charged</span><span>{eur(v.totals.cost.total)} cost</span></span>
                </li>
              {/each}
            </ul>
          </section>
        {/if}

        <section class="d-card hl">
          <h2>Highlights</h2>
          <ul>
            <li>
              {#if hl.longest}
                <a class="press" href={trip(hl.longest)}>
                  <span class="k">Longest trip</span><span class="v">{km(hl.longest.distance_m)}</span>
                  <span class="d-note">{tripTitle(hl.longest)} · {when(hl.longest.start)}</span>
                </a>
              {:else}
                <div><span class="k">Longest trip</span><span class="v">{NA}</span></div>
              {/if}
            </li>
            <li>
              {#if hl.most_efficient}
                <a class="press" href={trip(hl.most_efficient)}>
                  <span class="k">Most efficient trip</span><span class="v">{(hl.most_efficient.wh_per_100km / 1000).toFixed(1)} kWh/100 km</span>
                  <span class="d-note">{when(hl.most_efficient.start)} · trips of at least 5 km</span>
                </a>
              {:else}
                <div><span class="k">Most efficient trip</span><span class="v">{NA}</span><span class="d-note">Trips of at least 5 km</span></div>
              {/if}
            </li>
            <li>
              <div>
                <span class="k">Recuperated</span><span class="v">{kwh(hl.recup_wh)}</span>
                {#if share != null}<span class="d-note">{share} % of the {kwh(hl.gross_wh)} used before recuperation</span>{/if}
              </div>
            </li>
            <li>
              <div>
                <span class="k">Cost</span><span class="v">{eur(t.cost.total)}</span>
                <span class="d-note cost">
                  {eur(t.cost.energy)} charging · {eur(t.cost.fixed)} fixed{#if t.distance_m} · {costPer100(t.cost.total, t.distance_m)}{/if}{#if t.cost.uncosted > 0} · {uncostedText(t.cost.uncosted)}{/if}
                  {#if costTrend}{@render changeTag(costTrend)}{/if}
                </span>
              </div>
            </li>
          </ul>
        </section>

        <section class="d-card sty">
          <div class="d-head"><h2>Driving style</h2>{#if sty}<span class="d-note">{scoreWord(style.score)}</span>{/if}</div>
          {#if sty}
            {#if style.score != null}
              <div class="big">{style.score}<small> / 100</small>{#if points}<span class="d-note pts">{@render changeTag(points)}</span>{/if}</div>
            {/if}
            <dl class="d-rows">
              {#each sty.events as e (e.k)}
                {@const tr = tag(e.change, true)}
                <div><dt>{e.name}</dt><dd>{per10(style[e.k], style.km)}{#if tr} {@render changeTag(tr)}{/if}</dd></div>
              {/each}
            </dl>
            <div class="d-head bandhead"><h2>Consumption by speed</h2><span class="d-note">km/h · kWh/100 km</span></div>
            <ul class="bands">
              {#each sty.bands as b (b.name)}
                <li><span class="bn">{b.name}</span><span class="track"><i class="bar" style:width="{b.share * 100}%"></i></span><span class="bv">{b.value == null ? NA : b.value.toFixed(1)}</span></li>
              {/each}
            </ul>
          {:else}
            <p class="d-msg">No trips this {period}.</p>
          {/if}
        </section>
      </div>

      <div class="col">
        <section class="d-card chartcard">
          <div class="d-head"><h2>Distance</h2><span class="d-note">per {unit}</span></div>
          {#if t.distance_m > 0}
            <Chart x={buckets.map((_, i) => i)} {series} {xaxis} height={200} label={chartLabel} />
          {:else}
            <p class="d-msg">No trips in this {period}.</p>
          {/if}
        </section>

        <section class="d-card places">
          <div class="d-head"><h2>Charged by place</h2><span class="d-note">{kwh(t.charged_wh)}</span></div>
          {#if segments.length}
            <div class="share-bar" role="img" aria-label="Charged by place: {segments.map((s) => `${s.name} ${kwh(s.wh)}`).join(', ')}">
              {#each segments as s, i (s.name)}<i style:flex="{s.wh} 1 0" style:background="var({tint(s, i)})"></i>{/each}
            </div>
            <ul>
              {#each segments as s, i (s.name)}
                <li><i class="dot" style:background="var({tint(s, i)})"></i><span class="n">{s.name}</span><span>{kwh(s.wh)}</span><span class="pc">{Math.round(s.share * 100)} %</span></li>
              {/each}
            </ul>
          {:else}
            <p class="d-msg">No charging in this {period}.</p>
          {/if}
        </section>
      </div>
    </div>
    <div class="mapcard"><StatsMap {view} {period} {at} /></div>
  {/if}
</div>

<style>
  .page { max-width: 1000px; }
  .seg { max-width: 400px; }
  .nav { display: grid; grid-template-columns: 44px minmax(0, 1fr) 44px; align-items: center; margin: 8px 0 4px; }
  .nav h2 { margin: 0; text-align: center; font-size: 17px; font-weight: 600; }
  .nav button {
    width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; display: grid; place-items: center;
    background: var(--fill); color: var(--trip-text);
  }
  svg { width: 20px; height: 20px; stroke-width: 2.4; }
  .msg { --accent: var(--trip-text); } /* the Retry button, as on the detail pages */

  /* one column on a phone, in reading order; two columns of cards from 768 px */
  .grid { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; transition: opacity var(--fade); }
  .mapcard { margin-top: 12px; }
  .grid.busy { opacity: 0.5; }
  .col { display: contents; }
  .tiles { order: 1; display: flex; flex-direction: column; gap: 8px; }
  .pv { order: 2; }
  .chartcard { order: 3; }
  .places { order: 4; }
  .hl { order: 5; }
  .sty { order: 6; }
  @media (min-width: 768px) {
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
    .col { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  }
  .d-figs { grid-template-columns: repeat(auto-fill, minmax(max(160px, 8em), 1fr)); }

  .sub { display: flex; flex-wrap: wrap; gap: 0 8px; }
  .trend { white-space: nowrap; }
  .trend.up { color: var(--warn-text); }
  .trend.down { color: var(--good-text); }

  ul { list-style: none; margin: 0; padding: 0; }
  .pv ul { margin-top: 8px; }
  .pv li { display: flex; flex-direction: column; gap: 2px; padding: 10px 0; }
  .pv li + li, .hl li + li { border-top: 1px solid var(--line); }
  .facts { display: flex; flex-wrap: wrap; gap: 0 12px; }
  .facts span { white-space: nowrap; }
  .hl ul { margin-top: 4px; }
  .hl li > * {
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2px 12px; align-items: baseline; box-sizing: border-box;
    min-height: 44px; padding: 10px 0; color: inherit; text-decoration: none;
  }
  .hl a:focus-visible { border-radius: 8px; }
  .hl .k { color: var(--muted); }
  .hl .v { margin-left: auto; font-weight: 600; text-align: right; white-space: nowrap; }
  .hl a .v { color: var(--trip-text); }
  .hl a .v::after { content: " ›"; color: var(--muted); }
  .cost { display: flex; flex-wrap: wrap; gap: 0 8px; }
  .hl .d-note { flex-basis: 100%; }

  .pts { margin-left: 8px; font-size: 15px; font-weight: 500; }
  .bandhead { margin: 14px 0 8px; }
  .bands li { display: flex; align-items: center; gap: 10px; min-height: 28px; }
  .bn { flex: none; width: 4.5em; color: var(--muted); }
  .track { flex: 1; min-width: 0; }
  .bar { display: block; height: 8px; border-radius: 4px; background: var(--energy); }
  .bv { flex: none; min-width: 3em; text-align: right; white-space: nowrap; }

  .places ul { margin-top: 10px; }
  .places li { display: flex; flex-wrap: wrap; align-items: center; gap: 0 10px; min-height: 32px; }
  .dot { flex: none; width: 10px; height: 10px; border-radius: 50%; }
  .n { flex: 1 1 5em; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pc { min-width: 3em; white-space: nowrap; text-align: right; color: var(--muted); }
</style>
