import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'svelte/compiler';
const root = process.cwd();
const walk = (dir: string): string[] =>
	fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const entries = walk(path.join(root, 'src/routes/(site)')).filter((p) => /\.(ts|svelte)$/.test(p));
entries.push(
	path.join(root, 'src/lib/components/layout/MobileBottomNav.svelte'),
	path.join(root, 'src/routes/+error.svelte')
);
const seen = new Set<string>();
function collect(file: string) {
	if (seen.has(file)) return;
	seen.add(file);
	const source = fs.readFileSync(file, 'utf8');
	for (const match of source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)) {
		const spec = match[1];
		if (!spec.startsWith('$lib/') && !spec.startsWith('.')) continue;
		const base = spec.startsWith('$lib/')
			? path.join(root, 'src/lib', spec.slice(5))
			: path.resolve(path.dirname(file), spec);
		const resolved = [base, base + '.ts', base + '.svelte', path.join(base, 'index.ts')].find(
			(p) => fs.existsSync(p) && fs.statSync(p).isFile()
		);
		if (resolved && /\.(ts|svelte)$/.test(resolved)) collect(resolved);
	}
}
entries.forEach(collect);
describe('native source localization boundary', () => {
	it('contains no uncatalogued static Bulgarian text or accessibility attributes in public markup', () => {
		const misses: string[] = [];
		const fixedLatin: string[] = [];
		for (const file of [...seen].filter((p) => p.endsWith('.svelte'))) {
			const source = fs.readFileSync(file, 'utf8');
			const ast = parse(source, { modern: true, filename: file });
			function visit(value: unknown, attribute = '') {
				if (!value || typeof value !== 'object') return;
				const node = value as Record<string, unknown>;
				if (node.name === 'style' || node.name === 'script') return;
				if (node.type === 'Attribute') attribute = String(node.name);
				if (
					node.type === 'Text' &&
					typeof node.data === 'string' &&
					/[a-zA-Z]/.test(node.data) &&
					(!attribute || ['placeholder', 'alt', 'title', 'aria-label'].includes(attribute))
				)
					fixedLatin.push(path.relative(root, file) + ': ' + node.data.trim());
				if (
					node.type === 'Text' &&
					typeof node.data === 'string' &&
					/[\u0400-\u04ff]/u.test(node.data) &&
					!['value'].includes(attribute)
				)
					misses.push(path.relative(root, file) + ': ' + node.data.trim());
				for (const [key, item] of Object.entries(node)) {
					if (['css', 'loc', 'metadata'].includes(key)) continue;
					if (Array.isArray(item)) item.forEach((n) => visit(n, attribute));
					else if (item && typeof item === 'object') visit(item, attribute);
				}
			}
			visit(ast.fragment);
		}
		// Native language names, brand/acronyms, currency and representative VIN/model inputs are fixed facts.
		expect(fixedLatin.sort()).toEqual(
			[
				'src/lib/locale/LocalePreferences.svelte: English',
				'src/routes/(site)/locale-settings/+page.svelte: English',
				'src/lib/components/common/YouTubeSection.svelte: YouTube',
				'src/lib/components/common/YouTubeSection.svelte: YouTube',
				'src/lib/components/services/ImportRequestWizard.svelte: EUR',
				'src/lib/components/sell-your-car/SellCarWizard.svelte: EUR',
				'src/lib/components/sell-your-car/SellCarWizard.svelte: VIN',
				'src/lib/components/sell-your-car/SellCarWizard.svelte: WBA...',
				'src/lib/components/sell-your-car/SellCarWizard.svelte: X5'
			]
				.map((p) => p.replaceAll('/', path.sep))
				.sort()
		);
		// The language selector deliberately uses the native language name in either locale.
		expect(misses.sort()).toEqual(
			[
				'src/lib/locale/LocalePreferences.svelte: Български',
				'src/routes/(site)/locale-settings/+page.svelte: Български'
			]
				.map((p) => p.replaceAll('/', path.sep))
				.sort()
		);
	});
});
