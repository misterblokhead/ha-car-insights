<script>
  import { NA, km, kwh, kwhPer100 } from "../lib/format.js";
  import { eur, tripCostLine } from "../lib/costs.js";
  import { arrow, bandRows, compare, deltaText, durationParts, EVENTS, fig, markerAt, per10, rangeLine, routeLabel, scoreWord, split, temp, tripTitle } from "../lib/detail.js";
  import { consumptionBuckets, tripCharts } from "../lib/series.js";
  import Chart from "../lib/Chart.svelte";
  import DetailPage from "../lib/ui/DetailPage.svelte";
  import Figure from "../lib/ui/Figure.svelte";
  import MapView from "../lib/ui/MapView.svelte";

  let { vid, start } = $props();

  // numbers for the "a → b" lines; null when unknown
  const wh = (v) => (v == null ? null : (v / 1000).toFixed(2));
  const whole = (v) => (v == null ? null : v.toFixed(0));
  const kmh = (v) => (v == null ? NA : `${Math.round(v)} km/h`);
  const MARK = { accel: "--trip", brake: "--trip-text", corner: "--muted" }; // the colour of each event's marker
  const BAND_OPACITY = [0.4, 0.45, 0.6, 0.8, 1]; // one hue, darker for faster
</script>

<DetailPage url={`api/ui/trips/${encodeURIComponent(vid)}/${start}`} noun="trip" accent="--trip-text">
  {#snippet title({ trip: t })}{tripTitle(t)}{/snippet}
  {#snippet subtitle({ trip: t })}<p class="d-sub">{rangeLine(t.start, t.end)}</p>{/snippet}
  {#snippet body(data)}
    {@const t = data.trip}
    {@const buckets = consumptionBuckets(data.series, 0.5)}
    {@const speed = tripCharts(data.series)?.speed}
    {@const marks = (data.series?.events ?? []).map(([x, kind]) => ({ x, color: MARK[kind] }))}
    {@const style = t.style}
    {@const bands = style ? bandRows(style.bands, 0.5) : []}
    {@const avg = t.avg_speed_mps != null ? t.avg_speed_mps * 3.6 : null}
    {@const max = t.max_speed_mps == null ? null : t.max_speed_mps * 3.6}
    {@const used = kwhPer100(t.wh_per_100km)}
    {@const cmp = compare(t, data.similar)}
    {@const figures = [
      fig("Distance", split(km(t.distance_m))),
      fig("Duration", durationParts(t.duration_s)),
      fig("Energy used", split(kwh(t.net_wh))),
      fig("Average", used == null ? [NA, ""] : [used.toFixed(1), "kWh/100 km"]),
      fig("Average speed", avg == null ? [NA, ""] : [avg.toFixed(0), "km/h"]),
      fig("Recuperated", split(kwh(t.recup_wh))),
    ]}
    {@const rows = cmp
      ? [
          { name: "Time", m: cmp.duration, unit: "min", digits: 0, text: (v) => `${Math.round(v)} min` },
          { name: "Energy", m: cmp.consumption, unit: "kWh/100 km", digits: 1, text: (v) => `${v.toFixed(1)} kWh/100 km` },
        ].filter((r) => r.m)
      : []}
    {#if data.route?.length >= 2}
      {@const [a, z] = [data.route[0], data.route.at(-1)]}
      <MapView
        lines={[{ points: data.route, kind: "trip" }]}
        dots={[{ lat: a[0], lon: a[1], kind: "trip", role: "start" }, { lat: z[0], lon: z[1], kind: "trip", role: "end" }]}
        label={routeLabel(t)}
        height={240} />
    {/if}

    <div class="d-figs">
      {#each figures as f (f.label)}<Figure {...f} />{/each}
      <Figure label="Cost" value={eur(data.cost.total)}>
        {#if tripCostLine(data.cost)}<span class="d-note">{tripCostLine(data.cost)}</span>{/if}
      </Figure>
    </div>

    {#if style}
      <section class="d-card">
        <div class="d-head"><h2>Driving style</h2><span class="d-note">{scoreWord(style.score)}</span></div>
        {#if style.score != null}<div class="big">{style.score}<small> / 100</small></div>{/if}
        <dl class="d-rows">
          {#each EVENTS as [k, name] (k)}
            <div><dt>{name}</dt><dd>{style[k][0]} · {per10(style[k][0], t.distance_m / 1000)}</dd></div>
          {/each}
        </dl>
        <div class="d-head bandhead"><h2>Speed bands</h2><span class="d-note">km/h · kWh/100 km · share</span></div>
        <div class="share-bar" role="img" aria-label="Distance by speed band: {bands.map((b) => `${b.name} km/h ${Math.round(b.share * 100)} %`).join(', ')}">
          {#each bands as b, i (b.name)}{#if b.share > 0}<i style:flex="{b.share} 1 0" style:background="var(--trip)" style:opacity={BAND_OPACITY[i]}></i>{/if}{/each}
        </div>
        <ul class="bands">
          {#each bands as b, i (b.name)}
            <li><i class="swatch" style:opacity={BAND_OPACITY[i]}></i><span class="n">{b.name}</span><span>{b.kwhPer100 == null ? NA : b.kwhPer100.toFixed(1)}</span><span class="pc">{Math.round(b.share * 100)} %</span></li>
          {/each}
        </ul>
      </section>
    {/if}

    <section class="d-card">
      <div class="d-head"><h2>Consumption</h2><span class="d-note">kWh per 0.5 km</span></div>
      {#if buckets}
        <Chart
          x={buckets.x} xlabel="km"
          label="Consumption per 0.5 km: net {kwh(t.net_wh)}, gross {kwh(t.gross_wh)}, recuperated {kwh(t.recup_wh)}"
          series={[
            { label: "Gross", values: buckets.gross, color: "--muted" }, // drawn first, so the net line stays on top
            { label: "Net", values: buckets.net, color: "--trip" },
            { label: "Recuperated", values: buckets.recup, color: "--good", dash: true },
          ]}
        />
      {:else}
        <p class="d-msg">No consumption data</p>
      {/if}
      <dl class="d-rows">
        <div><dt>Battery</dt><dd>{arrow(wh(t.start_wh), wh(t.end_wh), "kWh")}</dd></div>
        <div><dt>Net</dt><dd>{kwh(t.net_wh)}</dd></div>
        <div><dt>Gross</dt><dd>{kwh(t.gross_wh)}</dd></div>
        <div><dt>Recuperated</dt><dd>{kwh(t.recup_wh)}</dd></div>
      </dl>
    </section>

    <section class="d-card">
      <div class="d-head"><h2>Speed</h2><span class="d-note">max {kmh(max)} · average {kmh(avg)}</span></div>
      {#if speed}
        <Chart
          x={speed.x} xlabel="km"
          label="Speed over distance, maximum {kmh(max)}, average {kmh(avg)}{marks.length ? `, ${marks.length} driving events marked` : ''}"
          {marks}
          series={speed.series.map((s) => ({ ...s, kind: "area", color: "--trip" }))}
        />
      {:else}
        <p class="d-msg">No speed data</p>
      {/if}
    </section>

    {#if rows.length}
      <section class="d-card">
        <h2>Compared with your usual route</h2>
        <p class="d-note">{tripTitle(t)}, {data.similar.n} earlier {data.similar.n === 1 ? "trip" : "trips"}</p>
        {#each rows as r (r.name)}
          {@const text = deltaText(r.m.delta, r.unit, r.digits)}
          <div class="cmp">
            <div class="line">
              <span>{r.name}</span>
              <b class:good={text !== "same" && r.m.delta < 0} class:worse={text !== "same" && r.m.delta > 0}>{text}</b>
            </div>
            <div class="track" aria-hidden="true"><i class="usual"></i><i class="dot" style:left="{markerAt(r.m.mine, r.m.usual)}%"></i></div>
            <span class="d-note">{r.text(r.m.mine)} · usually {r.text(r.m.usual)}</span>
          </div>
        {/each}
      </section>
    {/if}

    <section class="d-card">
      <dl class="d-rows foot">
        <div><dt>Battery</dt><dd>{arrow(whole(t.start_pct), whole(t.end_pct), "%")}</dd></div>
        <div><dt>Outside temperature</dt><dd>{temp(t.avg_temp_c)}</dd></div>
        <div><dt>Odometer</dt><dd>{arrow(whole(t.odometer_start_km), whole(t.odometer_end_km), "km")}</dd></div>
      </dl>
    </section>
  {/snippet}
</DetailPage>

<style>
  .bands { margin: 10px 0 0; padding: 0; list-style: none; }
  .bands li { display: flex; align-items: center; gap: 0 10px; min-height: 32px; }
  .swatch { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--trip); }
  .n { flex: 1; }
  .pc { min-width: 3em; text-align: right; color: var(--muted); }
  .cmp { margin-top: 14px; }
  .line { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0 12px; margin-bottom: 10px; }
  .line b { font-weight: 600; color: var(--muted); white-space: nowrap; }
  .line b.good { color: var(--good-text); }
  .line b.worse { color: var(--energy-text); }
  .track { position: relative; height: 6px; margin: 0 7px 8px; border-radius: 3px; background: var(--fill); }
  .usual { position: absolute; left: 50%; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; background: var(--muted); border-radius: 1px; }
  .dot { position: absolute; top: 50%; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: var(--trip); box-shadow: 0 0 0 3px var(--card); }
</style>
