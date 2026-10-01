import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

const generatedWatchIgnores = [
	'**/artifacts/**',
	'**/.vercel/**',
	'**/.svelte-kit/output/**',
	'**/.svelte-kit/vercel-tmp/**',
	'**/.tmp/**',
	'**/tmp/**',
	'**/test-results/**',
	'**/playwright-report/**',
	'**/.audit/**',
	'**/.audit-shots/**'
];

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// URL-imported desktop CSS must have the same bytes/hash in both builds.
	// SSR otherwise inherits a Node target and emits a second browser stylesheet.
	build: { cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'] },
	server: {
		host: '127.0.0.1',
		port: 6463,
		strictPort: true,
		watch: {
			ignored: generatedWatchIgnores
		}
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
