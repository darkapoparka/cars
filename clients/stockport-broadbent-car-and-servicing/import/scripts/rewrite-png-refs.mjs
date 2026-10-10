// Rewrites local /assets/*.png references to .webp — but only when the matching
// .webp actually exists in static/. PNGs are kept on disk, so any ref this script
// does NOT rewrite simply keeps serving the PNG (no broken images possible).
// Usage: `node scripts/rewrite-png-refs.mjs`
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = 'src';
const EXTS = new Set(['.ts', '.svelte', '.css', '.js', '.mjs']);
const REF = /\/assets\/[A-Za-z0-9_\-./]+\.png/g;

function walk(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules') continue;
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) walk(p, acc);
		else if (EXTS.has(extname(name).toLowerCase())) acc.push(p);
	}
	return acc;
}

const files = walk(SRC);
let changedFiles = 0;
let totalRepl = 0;
const changed = [];

for (const file of files) {
	const txt = readFileSync(file, 'utf8');
	let n = 0;
	const out = txt.replace(REF, (m) => {
		const webpRef = m.slice(0, -4) + '.webp';
		const diskPath = join('static', webpRef.replace(/^\//, ''));
		if (existsSync(diskPath)) {
			n++;
			return webpRef;
		}
		return m;
	});
	if (n > 0) {
		writeFileSync(file, out);
		changedFiles++;
		totalRepl += n;
		changed.push(`${file} (${n})`);
	}
}

console.log(JSON.stringify({ changedFiles, totalRepl, changed }, null, 2));
