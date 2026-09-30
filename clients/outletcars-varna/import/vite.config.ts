import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					// Keep small icon modules from queuing dozens of initial mobile requests.
					groups: [
						{
							name: 'icons',
							test: /node_modules[/\\]@lucide[/\\]svelte[/\\]/
						}
					]
				}
			}
		}
	},
	server: {
		watch: {
			// Generated deployment bundles and audit copies are not development sources.
			ignored: ['**/.audit/**', '**/.vercel/**']
		}
	},
	resolve: {
		preserveSymlinks: true
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
