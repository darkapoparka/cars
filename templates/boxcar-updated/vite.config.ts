import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
export default defineConfig({
  plugins: [svelte()],
  server: { host: "127.0.0.1", port: 6455, strictPort: true },
  preview: { host: "127.0.0.1", port: 6455, strictPort: true },
  build: { target: "es2022" },
});
