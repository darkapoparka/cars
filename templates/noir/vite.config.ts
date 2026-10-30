import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// BASE_PATH mounts the build under a sub-path such as /variant-7.
const base = (process.env.BASE_PATH ?? "") as "" | `/${string}`;

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ fallback: "404.html" }),
      paths: { base },
      prerender: { handleHttpError: "fail" },
    }),
  ],
  server: { host: "127.0.0.1", port: 6470, strictPort: true },
  preview: { host: "127.0.0.1", port: 6470, strictPort: true },
});
