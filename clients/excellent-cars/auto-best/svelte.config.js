import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Avoid extra blocking requests for small styles; keep larger sheets cacheable.
    inlineStyleThreshold: 32 * 1024,
    alias: {
      $components: 'src/lib/components',
      $config: 'src/lib/config',
      $data: 'src/lib/data'
    }
  }
};

export default config;
