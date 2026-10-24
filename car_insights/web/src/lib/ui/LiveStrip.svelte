<script>
  import { km, pct, NA } from "../format.js";

  let { vehicles } = $props();

  const STATE = { driving: "Driving", charging: "Charging", parked: "Parked" };
  const COLOR = { driving: "var(--trip)", charging: "var(--charge)", parked: "var(--muted)" };
</script>

{#if vehicles.length}
  <ul>
    {#each vehicles as v (v.id)}
      <li>
        <i style:background={COLOR[v.status] ?? COLOR.parked}></i>
        <span class="where"><b>{v.name}</b> · {STATE[v.status] ?? v.status} · {v.position?.place || NA}</span>
        <span class="vals">
          {pct(v.soc_percent)} · {km(v.range_m)}
          {#if v.status === "charging"}
            <svg viewBox="0 0 24 24" role="img" aria-label="Plugged in"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" /></svg>
          {/if}
        </span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul { list-style: none; margin: 0; padding: 4px 14px; background: var(--card); border-radius: var(--radius-card); }
  li { display: flex; align-items: center; gap: 10px; min-height: 40px; }
  i { flex: none; width: 10px; height: 10px; border-radius: 50%; }
  .where { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
  b { color: var(--fg); font-weight: 600; }
  .vals { flex: none; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  svg { width: 16px; height: 16px; fill: none; stroke: var(--charge); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>
