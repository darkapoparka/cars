import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import adapter from "@sveltejs/adapter-node";
export default defineConfig({
  plugins: [sveltekit({ adapter: adapter() })],
  server: { host: "127.0.0.1", port: 6466, strictPort: true },
});
