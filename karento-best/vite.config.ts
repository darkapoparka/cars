import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import adapter from '@sveltejs/adapter-cloudflare';
export default defineConfig({
  plugins: [sveltekit({ adapter: adapter(), paths: { base: "/variant-6", relative: false } })],
  server: { host: "127.0.0.1", port: 6466, strictPort: true },
});
