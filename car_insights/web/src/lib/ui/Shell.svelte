<script>
  import { screen } from "../media.svelte.js";
  import Sidebar from "./Sidebar.svelte";
  import TabBar from "./TabBar.svelte";
  import VehiclePill from "./VehiclePill.svelte";

  // `options` and `view` feed the vehicle pill (sidebar on wide screens, a slim header on phones); Settings does not depend on the view
  let { page, isAdmin, options = [], view = $bindable(""), children } = $props();

  const tabs = $derived([
    { page: "activity", href: "#/activity", label: "Activity", icon: '<path d="M3 12h4l3-8 4 16 3-8h4"/>' },
    { page: "stats", href: "#/stats", label: "Statistics", icon: '<path d="M5 20V10M12 20V4M19 20v-7"/>' },
    ...(isAdmin ? [{ page: "settings", href: "#/settings", label: "Settings",
                     icon: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>' }] : []),
  ]);
  const showPill = $derived(page !== "settings");
</script>

<!-- main stays in the same place in the tree, so a resize across 768 px keeps the page state -->
<div class="shell" class:wide={screen.wide}>
  {#if screen.wide}
    <Sidebar {tabs} {page} {options} bind:view {showPill} />
  {:else if showPill}
    <header><VehiclePill {options} bind:value={view} /></header>
  {/if}
  <main>{@render children()}</main>
  {#if !screen.wide}<TabBar {tabs} {page} />{/if}
</div>

<style>
  .shell { min-height: 100dvh; }
  .shell.wide { display: grid; grid-template-columns: 240px minmax(0, 1fr); }
  header { padding: 12px 16px 0; }
  main { padding: 16px 16px calc(65px + env(safe-area-inset-bottom)); }  /* clear of the fixed tab bar (49 px + gap) */
  .wide main { padding: 24px; }
</style>
