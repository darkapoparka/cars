import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sourceImports, resolveSourceImport } from './source-graph.mjs';

test('resolves TypeScript .js barrels and .svelte.js rune modules', () => {
	const files = new Set(['src/lib/ui/button/index.ts', 'src/lib/state/viewport.svelte.ts']);
	assert.equal(
		resolveSourceImport('src/routes/+page.svelte', '$lib/ui/button/index.js', files),
		'src/lib/ui/button/index.ts'
	);
	assert.equal(
		resolveSourceImport('src/lib/ui/button/index.ts', '../../state/viewport.svelte.js', files),
		'src/lib/state/viewport.svelte.ts'
	);
});
test('keeps stylesheet URL imports and native component imports reachable', () => {
	const files = new Set(['src/lib/styles/home.css', 'src/lib/components/Home.svelte']);
	assert.equal(
		resolveSourceImport('src/routes/+page.svelte', '$lib/styles/home.css?url', files),
		'src/lib/styles/home.css'
	);
	assert.equal(
		resolveSourceImport('src/routes/+page.svelte', '../lib/components/Home.svelte', files),
		'src/lib/components/Home.svelte'
	);
});
test('collects module scripts, instance scripts, dynamic imports and styles', () => {
	const text = `<script module>import type { A } from './a';</script><script>const load = () => import('./B.svelte');</script><style>@import './c.css';</style>`;
	assert.deepEqual(sourceImports('Widget.svelte', text).sort(), ['./B.svelte', './a', './c.css']);
});
test('does not invent dependencies from package names or missing local modules', () => {
	assert.equal(resolveSourceImport('src/routes/+page.svelte', 'svelte', new Set()), null);
	assert.equal(resolveSourceImport('src/routes/+page.svelte', '$lib/missing', new Set()), null);
});
