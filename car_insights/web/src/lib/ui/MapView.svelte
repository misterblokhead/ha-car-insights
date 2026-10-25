<script>
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  // lines: [{ points: [[lat, lon]], kind: "trip", href? }]; dots: [{ lat, lon, kind: "trip" | "charge", role?: "start" | "end", href? }]
  let { lines = [], dots = [], height } = $props();
  let el = $state();

  $effect(() => {
    // Leaflet needs literal colours, so the tokens are read once, here
    const css = getComputedStyle(el);
    const colour = (kind) => css.getPropertyValue(`--${kind}`).trim();
    // on touch, a map that drags would trap the page's vertical scroll, so it pans only after a tap (like the wheel)
    const coarse = matchMedia("(pointer: coarse)").matches;
    const map = L.map(el, { scrollWheelZoom: false, dragging: !coarse });
    L.tileLayer("api/ui/tiles/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const open = (layer, href) => href && layer.on("click", () => (location.hash = href));
    for (const { points, kind, href } of lines) {
      open(L.polyline(points, { color: colour(kind), weight: 4 }).addTo(map), href);
      bounds.extend(points);
    }
    for (const { lat, lon, kind, role, href } of dots) {
      const ring = role === "end";
      open(L.circleMarker([lat, lon], {
        radius: 6, fillColor: colour(kind), fillOpacity: 1, color: "#fff", weight: ring ? 2 : 0,
      }).addTo(map), href);
      bounds.extend([lat, lon]);
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [16, 16], maxZoom: 17 });

    // the wheel zooms only after a click or focus, so scrolling the page past the map still works
    const zoomOn = () => (map.scrollWheelZoom.enable(), map.dragging.enable());
    const zoomOff = () => map.scrollWheelZoom.disable();
    const dragOff = () => coarse && map.dragging.disable();
    // dragging the map must not reach the detail pane's swipe
    const stop = (e) => e.stopPropagation();
    const listeners = [
      ["click", zoomOn], ["focus", zoomOn], ["blur", zoomOff], ["blur", dragOff], ["mouseleave", zoomOff],
      ["pointerdown", stop], ["touchstart", stop], ["wheel", stop],
    ];
    for (const [type, fn] of listeners) el.addEventListener(type, fn, { passive: true });

    return () => {
      for (const [type, fn] of listeners) el.removeEventListener(type, fn);
      map.remove();
    };
  });
</script>

<div class="map" bind:this={el} style:height="{height}px" role="region" aria-label="Map"></div>

<style>
  .map { border-radius: var(--radius-card); background: var(--fill); }
  .map :global(.leaflet-tile-pane) { filter: var(--tile-filter); }
</style>
