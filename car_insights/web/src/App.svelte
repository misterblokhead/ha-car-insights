<script>
  import { get } from "./lib/api.js";
  import Overview from "./pages/Overview.svelte";
  import Trips from "./pages/Trips.svelte";
  import TripDetail from "./pages/TripDetail.svelte";
  import Charges from "./pages/Charges.svelte";
  import ChargeDetail from "./pages/ChargeDetail.svelte";
  import Settings from "./pages/Settings.svelte";

  let me = $state(null);
  let views = $state({ vehicles: [], groups: [] });
  let view = $state("");
  let route = $state(location.hash || "#/overview");
  let error = $state("");

  const KEY = "car-insights-view";
  const options = $derived([
    ...views.vehicles.map((v) => ({ value: `v:${v.id}`, label: v.name })),
    ...views.groups.map((g) => ({ value: `g:${g.id}`, label: `Group: ${g.name}` })),
  ]);
  const parts = $derived(route.split("/"));
  const page = $derived(parts[1] || "overview");
  const vid = $derived(parts[2]);
  const start = $derived(parts[3]);

  addEventListener("hashchange", () => (route = location.hash || "#/overview"));

  $effect(() => {
    if (view) try { localStorage.setItem(KEY, view); } catch {}
  });

  (async () => {
    try {
      [me, views] = await Promise.all([get("api/ui/me"), get("api/ui/views")]);
      let saved = "";
      try { saved = localStorage.getItem(KEY) || ""; } catch {}
      const values = options.map((o) => o.value);
      view = values.includes(saved) ? saved : values[0] || "";
    } catch (e) {
      error = `Could not load (${e.message})`;
    }
  })();
</script>

{#if error}
  <p class="msg">{error}</p>
{:else if !me}
  <p class="msg">Loading...</p>
{:else}
  <header>
    <nav>
      <a href="#/overview" class:on={page === "overview"} aria-current={page === "overview" ? "page" : undefined}>Overview</a>
      <a href="#/trips" class:on={page === "trips"} aria-current={page === "trips" ? "page" : undefined}>Trips</a>
      <a href="#/charges" class:on={page === "charges"} aria-current={page === "charges" ? "page" : undefined}>Charges</a>
      {#if me.is_admin}<a href="#/settings" class:on={page === "settings"} aria-current={page === "settings" ? "page" : undefined}>Settings</a>{/if}
    </nav>
    <select bind:value={view} aria-label="View">
      {#each options as o}<option value={o.value}>{o.label}</option>{/each}
    </select>
  </header>
  <main>
    {#if page === "settings" && me.is_admin}
      <Settings />
    {:else if !view}
      <p class="msg">No vehicles available to you.</p>
    {:else if page === "overview"}
      {#key view}<Overview {view} />{/key}
    {:else if page === "trips"}
      {#if vid && start}{#key route}<TripDetail {vid} {start} />{/key}{:else}{#key view}<Trips {view} />{/key}{/if}
    {:else if page === "charges"}
      {#if vid && start}{#key route}<ChargeDetail {vid} {start} />{/key}{:else}{#key view}<Charges {view} />{/key}{/if}
    {:else}
      <p class="msg">Coming soon.</p>
    {/if}
  </main>
{/if}

<style>
  :global(:root) {
    --bg: #fafafa; --fg: #1c1c1e; --muted: #6b6b70; --card: #fff; --line: #dcdce0; --accent: #0060df;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root) { --bg: #111113; --fg: #ececf0; --muted: #9a9aa2; --card: #1c1c1f; --line: #333338; --accent: #5eb0ff; }
  }
  :global(body) { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.4 system-ui, sans-serif; }
  header { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--line); }
  nav { display: flex; gap: 14px; }
  nav a { color: var(--muted); text-decoration: none; padding: 4px 0; }
  nav a.on { color: var(--accent); border-bottom: 2px solid var(--accent); }
  select { max-width: 100%; font: inherit; color: var(--fg); background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 4px; }
  main { padding: 12px; max-width: 900px; margin: 0 auto; }
  .msg { padding: 12px; color: var(--muted); }
</style>
