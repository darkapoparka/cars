// Generated Cloudflare publisher configuration; canonical templates remain Next.js.
import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [
    
    vinext(),
    cloudflare({ viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] } }),
  ],
  build: { target: ['chrome111', 'edge111', 'firefox111', 'safari16.4'] },
});
