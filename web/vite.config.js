import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// base "./" keeps asset URLs relative so the page works under the ingress prefix
export default defineConfig({ base: "./", plugins: [svelte()], build: { outDir: "dist" } });
