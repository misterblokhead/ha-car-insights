<script>
  import VehiclePill from "./VehiclePill.svelte";

  let { tabs, page, options, view = $bindable(""), showPill = true } = $props();
</script>

<aside>
  {#if showPill}<VehiclePill {options} bind:value={view} />{/if}
  <nav aria-label="Main">
    {#each tabs as t (t.page)}
      <a href={t.href} aria-current={page === t.page ? "page" : undefined}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{@html t.icon}</svg>
        <span>{t.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  aside {
    position: sticky; top: 0; align-self: start; height: 100dvh; box-sizing: border-box; padding: 16px 12px;
    display: flex; flex-direction: column; gap: 16px;
    background: var(--chrome); -webkit-backdrop-filter: var(--chrome-filter); backdrop-filter: var(--chrome-filter);
    border-right: 0.5px solid var(--line);
  }
  nav { display: flex; flex-direction: column; gap: 2px; }
  a {
    min-height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 12px; border-radius: var(--radius-ctl);
    color: var(--fg); text-decoration: none; transition: transform 100ms;
  }
  a[aria-current] { background: var(--fill); color: var(--trip); font-weight: 600; }
  a:active { transform: scale(var(--press-scale)); }
  a:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
  svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
