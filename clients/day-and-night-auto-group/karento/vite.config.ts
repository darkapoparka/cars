import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import adapter from "@sveltejs/adapter-node";

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter(), files: { assets: "static" } })],
  server: { host: "127.0.0.1", port: 6691, strictPort: true },
});
