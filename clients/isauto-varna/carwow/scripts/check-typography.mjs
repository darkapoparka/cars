import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
let count = 0;
for (const file of readdirSync(resolve(root, 'src'), { recursive: true })) {
	if (!/\.(css|svelte)$/.test(file) || file.endsWith('tokens.css')) continue;
	count++;
	const source = readFileSync(resolve(root, 'src', file), 'utf8');
	const styles = file.endsWith('.css')
		? [source]
		: [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
	for (const style of styles) {
		const css = style.replace(/\/\*[\s\S]*?\*\//g, '');
		for (const match of css.matchAll(
			/(?:^|[;{])\s*((?:--[\w-]*font-size|font-size|font-weight|font-family|font))\s*:\s*([^;{}]+);/g
		)) {
			const [, property, value] = match;
			if (
				(property.includes('font-size') || property === 'font') &&
				/\b\d*\.?\d+(?:px|rem|em|vw|vh)\b/.test(value)
			)
				failures.push(`${file}: ${property}: ${value.trim()}`);
			if (property === 'font-weight' && /^\d/.test(value))
				failures.push(`${file}: use a weight role`);
			if (property === 'font-family' && !/^(?:var\(|inherit)/.test(value))
				failures.push(`${file}: use the shared font family`);
		}
	}
	if (/text-\[\d[^\]]*(?:px|rem|em)\]/.test(source) || /font-\[\d+\]/.test(source))
		failures.push(`${file}: arbitrary typography utility`);
}
if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
} else
	console.log(`Typography: ${count} source files; no local font-size, weight or family literals.`);
