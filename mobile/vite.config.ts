// Generated Cloudflare publisher configuration; canonical templates remain Next.js.
import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
import { createRequire } from 'node:module';
import stylex from '@stylexjs/unplugin';
const sourceBabel = createRequire(import.meta.url)('./cars-babel-source.cjs');
const sourceStylex = sourceBabel.plugins.filter(entry => Array.isArray(entry) && entry[0] === '@stylexjs/babel-plugin');
if (sourceStylex.length !== 1) throw new Error('Expected one approved StyleX compiler configuration');
const stylexPlugin = stylex.vite({
  ...sourceStylex[0][1], useCSSLayers: true,
  dev: false, runtimeInjection: false, devMode: 'off',
});

export default defineConfig({
  plugins: [
    stylexPlugin,
    vinext(),
    cloudflare({ viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] } }),
  ],
  build: { target: ['chrome111', 'edge111', 'firefox111', 'safari16.4'] },
});
