<script>
  import VehiclePill from "./VehiclePill.svelte";

  let { tabs, page, options, view = $bindable(""), showPill = true } = $props();
</script>

<aside class="chrome">
  {#if showPill}<VehiclePill {options} bind:value={view} />{/if}
  <nav aria-label="Main">
    {#each tabs as t (t.page)}
      <a class="press" href={t.href} aria-current={page === t.page ? "page" : undefined}>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">{@html t.icon}</svg>
        <span>{t.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  aside {
    position: sticky; top: 0; align-self: start; height: 100dvh; box-sizing: border-box; padding: 16px 12px;
    display: flex; flex-direction: column; gap: 16px;
    border-right: 0.5px solid var(--line);
  }
  nav { display: flex; flex-direction: column; gap: 2px; }
  a {
    min-height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 12px; border-radius: var(--radius-ctl);
    color: var(--fg); text-decoration: none;
  }
  a[aria-current] { background: var(--fill); color: var(--trip-text); font-weight: 600; }
  svg { width: 22px; height: 22px; }
</style>
