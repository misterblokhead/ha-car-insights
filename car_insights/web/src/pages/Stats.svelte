<script>
  import { get } from "../lib/api.js";
  import { hashOf } from "../lib/activity.js";
  import { NA, km, kwh, kwh100, delta, dayKey, dayLabel } from "../lib/format.js";
  import { split } from "../lib/detail.js";
  import { bucketLabel, change, isCurrent, periodLabel, places, shift } from "../lib/stats.js";
  import Chart from "../lib/Chart.svelte";
  import Figure from "../lib/ui/Figure.svelte";
  import Segmented from "../lib/ui/Segmented.svelte";
  import "../lib/detail.css";

  let { view } = $props();

  const PERIODS = [{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }];
  const PLACE = ["--charge", "--trip", "--energy", "--p3", "--p4"];
  const today = dayKey(Date.now()); // the browser's day; if the server's differs by one, its 422 shows as the error line
  let period = $state("week");
  let at = $state(today);
  let data = $state(null);
  let error = $state(false);
  let loading = $state(true);
  let seq = 0;

  // switching the period starts at the present again
  const setPeriod = (p) => ((period = p), (at = today));
  const current = $derived(isCurrent(period, at, today));

  // the newest request wins; the data on screen stays (dimmed) until the next arrives
  async function load() {
    const n = ++seq;
    loading = true;
    error = false;
    try {
      const d = await get(`api/ui/stats?view=${encodeURIComponent(view)}&period=${period}&at=${at}`);
      if (n === seq) data = d;
    } catch {
      if (n === seq) error = true;
    } finally {
      if (n === seq) loading = false;
    }
  }
  $effect(load);

  // "▲ 12 %" against the previous period; null without one. `hint` colours it (more energy used is the warning), never alone
  const trend = (now, before, hint = false) => {
    const c = change(now, before);
    if (c == null) return null;
    const r = Math.round(c * 100);
    return { dir: Math.sign(r), text: `${Math.abs(r)} %`, hint };
  };
  const per100 = (x) => kwh100(x.net_wh, x.distance_m);
  const per100Text = (x) => (per100(x) == null ? NA : `${per100(x).toFixed(1)} kWh/100 km`);

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
  const line = $derived(buckets.map((b) => kwh100(b.net_wh, b.distance_m)));
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
  const chartLabel = $derived(t ? `Distance per ${unit}: ${km(t.distance_m)} in total, average ${per100Text(t)}` : "");

  const segments = $derived(data ? places(data.by_place) : []);
  const tint = (s, i) => (s.other ? "--muted" : PLACE[i % PLACE.length]);

  const hl = $derived(data?.highlights);
  const share = $derived(hl?.gross_wh > 0 ? Math.round((hl.recup_wh / hl.gross_wh) * 100) : null);
  const when = (ms) => dayLabel(dayKey(ms), today);
  const trip = (x) => hashOf({ kind: "trip", vehicle_id: x.vehicle_id, start: x.start });
</script>

<div class="page">
  <h1>Statistics</h1>
  <div class="seg"><Segmented options={PERIODS} bind:value={() => period, setPeriod} label="Period" /></div>

  <div class="nav">
    <button onclick={() => (at = shift(period, at, -1))} aria-label="Previous {period}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <h2 aria-live="polite">{data ? periodLabel(period, data.period.start, data.period.end) : ""}</h2>
    <button onclick={() => (at = shift(period, at, 1))} disabled={current} aria-label="Next {period}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
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
                  <span class="sub">
                    {#if f.count}<span>{f.count}</span>{/if}
                    {#if f.trend}
                      <span class="trend" class:up={f.trend.hint && f.trend.dir > 0} class:down={f.trend.hint && f.trend.dir < 0}>
                        {#if f.trend.dir}<span aria-hidden="true">{f.trend.dir > 0 ? "▲" : "▼"}</span><span class="sr">{f.trend.dir > 0 ? "up" : "down"}</span>{/if}
                        {f.trend.text}
                      </span>
                    {/if}
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
                  <span class="d-note facts"><span>{km(v.totals.distance_m)}</span><span>{per100Text(v.totals)}</span><span>{kwh(v.totals.net_wh)} used</span><span>{kwh(v.totals.charged_wh)} charged</span></span>
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
                <a href={trip(hl.longest)}>
                  <span class="k">Longest trip</span><span class="v">{km(hl.longest.distance_m)}</span>
                  <span class="d-note">{hl.longest.from ?? "Unknown"} → {hl.longest.to ?? "Unknown"} · {when(hl.longest.start)}</span>
                </a>
              {:else}
                <div><span class="k">Longest trip</span><span class="v">{NA}</span></div>
              {/if}
            </li>
            <li>
              {#if hl.most_efficient}
                <a href={trip(hl.most_efficient)}>
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
            <li><div><span class="k">Cost</span><span class="v soon">Arrives with part 3</span></div></li>
          </ul>
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
            <div class="bar" role="img" aria-label="Charged by place: {segments.map((s) => `${s.name} ${kwh(s.wh)}`).join(', ')}">
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
  {/if}
</div>

<style>
  .page { --accent: var(--trip-text); max-width: 1000px; }
  h1 { margin: 0 0 12px; font-size: var(--fs-title); font-weight: 700; letter-spacing: -0.01em; }
  .seg { max-width: 400px; }
  .nav { display: grid; grid-template-columns: 44px minmax(0, 1fr) 44px; align-items: center; margin: 8px 0 4px; }
  .nav h2 { margin: 0; text-align: center; font-size: 17px; font-weight: 600; }
  .nav button {
    width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; display: grid; place-items: center;
    background: var(--fill); color: var(--trip-text); cursor: pointer; transition: transform 100ms;
  }
  .nav button:active:not(:disabled) { transform: scale(var(--press-scale)); }
  .nav button:disabled { opacity: 0.35; cursor: default; }
  .nav button:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
  svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .msg { padding: 24px 0; text-align: center; color: var(--muted); }
  .msg p { margin: 0 0 8px; }

  /* one column on a phone, in reading order; two columns of cards from 768 px */
  .grid { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; transition: opacity var(--fade); }
  .grid.busy { opacity: 0.5; }
  .col { display: contents; }
  .tiles { order: 1; display: flex; flex-direction: column; gap: 8px; }
  .pv { order: 2; }
  .chartcard { order: 3; }
  .places { order: 4; }
  .hl { order: 5; }
  @media (min-width: 768px) {
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
    .col { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  }
  .d-figs { grid-template-columns: repeat(auto-fill, minmax(max(160px, 8em), 1fr)); }

  .sub { display: flex; flex-wrap: wrap; gap: 0 8px; font-size: 13px; color: var(--muted); }
  .trend { white-space: nowrap; }
  .trend.up { color: var(--warn-text); }
  .trend.down { color: var(--good-text); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

  ul { list-style: none; margin: 0; padding: 0; }
  .pv ul { margin-top: 8px; }
  .pv li { display: flex; flex-direction: column; gap: 2px; padding: 10px 0; }
  .pv li + li, .hl li + li { border-top: 1px solid var(--line); }
  .facts { display: flex; flex-wrap: wrap; gap: 0 12px; }
  .facts span { white-space: nowrap; }
  .hl ul { margin-top: 4px; }
  .hl li > * {
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2px 12px; align-items: baseline; box-sizing: border-box;
    min-height: 44px; padding: 10px 0; color: inherit; text-decoration: none; transition: transform 100ms;
  }
  .hl a:active { transform: scale(var(--press-scale)); }
  .hl a:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; border-radius: 8px; }
  .hl .k { color: var(--muted); }
  .hl .v { margin-left: auto; font-weight: 600; text-align: right; white-space: nowrap; }
  .hl a .v { color: var(--trip-text); }
  .hl a .v::after { content: " ›"; color: var(--muted); }
  .hl .soon { font-weight: 400; color: var(--muted); }
  .hl .d-note { flex-basis: 100%; }

  .places { --p3: #AF52DE; --p4: #5AC8FA; }
  @media (prefers-color-scheme: dark) { .places { --p3: #BF5AF2; --p4: #64D2FF; } }
  .bar { display: flex; gap: 2px; height: 12px; border-radius: 6px; overflow: hidden; }
  .bar i { min-width: 2px; }
  .places ul { margin-top: 10px; }
  .places li { display: flex; flex-wrap: wrap; align-items: center; gap: 0 10px; min-height: 32px; }
  .dot { flex: none; width: 10px; height: 10px; border-radius: 50%; }
  .n { flex: 1 1 5em; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pc { min-width: 3em; white-space: nowrap; text-align: right; color: var(--muted); }
</style>
