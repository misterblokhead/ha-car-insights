import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// One fixed-name module the integration registers as its custom panel; its css and chunks load relative to it under /car_insights_static/
export default defineConfig({
  base: "/car_insights_static/",
  plugins: [svelte()],
  build: {
    outDir: "../custom_components/car_insights/frontend",
    emptyOutDir: true,
    lib: { entry: "src/panel.js", formats: ["es"], fileName: () => "panel.js", cssFileName: "panel" },
  },
});
