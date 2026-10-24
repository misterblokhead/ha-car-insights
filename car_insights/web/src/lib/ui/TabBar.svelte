<script>
  let { tabs, page } = $props();
</script>

<nav aria-label="Main">
  {#each tabs as t (t.page)}
    <a href={t.href} aria-current={page === t.page ? "page" : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{@html t.icon}</svg>
      <span>{t.label}</span>
    </a>
  {/each}
</nav>

<style>
  nav {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; display: flex;
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--chrome); -webkit-backdrop-filter: var(--chrome-filter); backdrop-filter: var(--chrome-filter);
    border-top: 0.5px solid var(--line);
  }
  a {
    flex: 1; min-height: 49px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
    color: var(--muted); text-decoration: none; font-size: var(--fs-small); transition: transform 100ms;
  }
  a[aria-current] { color: var(--trip-text); }
  a:active { transform: scale(var(--press-scale)); }
  a:focus-visible { outline: 2px solid var(--trip); outline-offset: -4px; border-radius: var(--radius-ctl); }
  svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
