import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // SvelteKit supplies a nonce/hash for its own inline bootstrap; arbitrary scripts are not allowed.
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'base-uri': ['self'],
        'connect-src': process.env.NODE_ENV === 'production' ? ['self'] : ['self', 'ws:', 'wss:'],
        'font-src': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['self'],
        'frame-src': ['https://maps.google.com', 'https://www.google.com', 'https://www.youtube-nocookie.com'],
        'img-src': ['self', 'data:', 'blob:'],
        'object-src': ['none'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline']
      }
    },
    alias: { $components: 'src/lib/components', $config: 'src/lib/config', $data: 'src/lib/data' }
  }
};

export default config;
