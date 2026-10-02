import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    // The CSP permits same-origin fonts; small subsets must not become data URLs.
    assetsInlineLimit: (filePath) => /\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  },
  preview: {
    host: '127.0.0.1',
    port: 5173
  }
});
