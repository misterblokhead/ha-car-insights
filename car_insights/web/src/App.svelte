<script>
  import { get } from "./lib/api.js";
  import { parse } from "./lib/routes.js";
  import Shell from "./lib/ui/Shell.svelte";
  import Activity from "./pages/Activity.svelte";
  import Settings from "./pages/Settings.svelte";
  import Stats from "./pages/Stats.svelte";

  let me = $state(null);
  let views = $state({ vehicles: [], groups: [] });
  let view = $state("");
  const first = parse(location.hash);
  let route = $state(first);
  let error = $state("");

  const KEY = "car-insights-view";
  const options = $derived([
    ...views.vehicles.map((v) => ({ value: `v:${v.id}`, label: v.name })),
    ...views.groups.map((g) => ({ value: `g:${g.id}`, label: `Group: ${g.name}` })),
  ]);

  // groups made on the Settings page show up in the switcher when the user leaves it
  async function reloadViews() {
    try {
      views = await get("api/ui/views");
      if (!options.some((o) => o.value === view)) view = options[0]?.value || "";
    } catch {} // keep the lists we have
  }

  function navigate() {
    const was = route.page;
    route = parse(location.hash);
    if (route.redirect) location.replace(route.redirect);
    if (was === "settings" && route.page !== "settings") reloadViews();
  }
  addEventListener("hashchange", navigate);
  if (first.redirect) location.replace(first.redirect);

  // the Settings tab is hidden from non-admins; a typed or remembered link goes to the activity page
  $effect(() => {
    if (me && !me.is_admin && route.page === "settings") location.replace("#/activity");
  });

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
  <p class="msg">Loading…</p>
{:else}
  <Shell page={route.page} isAdmin={me.is_admin} {options} bind:view>
    {#if route.page === "settings" && me.is_admin}
      <Settings />
    {:else if !view}
      <p class="msg">No vehicles available to you.</p>
    {:else if route.page === "stats"}
      {#key view}<Stats {view} />{/key}
    {:else}
      {#key view}<Activity {view} detail={route.detail} />{/key}
    {/if}
  </Shell>
{/if}

<style>
  .msg { padding: 12px; color: var(--muted); }
</style>
