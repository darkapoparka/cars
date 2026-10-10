// Conservatively deletes static PNGs that are now WebP-only: a png is removed
// ONLY if (a) its .webp sibling exists AND (b) its "<name>.png" filename appears
// NOWHERE in the repo source (src/, .template-ref/, configs, app.html, ...).
// Any png still referenced as .png (template stock images, the 3 logo/avatar
// replaceAll match patterns, Payment.png, etc.) is kept. PNGs are git-tracked,
// so `git checkout -- static` restores anything. Usage: `node scripts/prune-unused-png.mjs`
import { readdirSync, statSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const SKIP_DIRS = new Set([
	'node_modules',
	'.git',
	'.svelte-kit',
	'static',
	'.tmp',
	'build',
	'dist',
	'.vercel'
]);
const SCAN_EXTS = new Set([
	'.ts',
	'.tsx',
	'.js',
	'.mjs',
	'.cjs',
	'.svelte',
	'.css',
	'.scss',
	'.html',
	'.json',
	'.md',
	'.yaml',
	'.yml',
	'.txt'
]);
const PNG_TOKEN = /([A-Za-z0-9_.-]+?)\.png\b/g;

const referenced = new Set();
function scanRefs(dir) {
	for (const name of readdirSync(dir)) {
		if (SKIP_DIRS.has(name)) continue;
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) scanRefs(p);
		else if (SCAN_EXTS.has(extname(name).toLowerCase())) {
			const txt = readFileSync(p, 'utf8');
			let m;
			while ((m = PNG_TOKEN.exec(txt))) referenced.add((m[1] + '.png').toLowerCase());
		}
	}
}
scanRefs('.');

function walkPng(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) walkPng(p, acc);
		else if (extname(name).toLowerCase() === '.png') acc.push(p);
	}
	return acc;
}

const pngs = walkPng('static');
let deleted = 0,
	keptReferenced = 0,
	keptNoWebp = 0,
	freed = 0;
const keptRefSample = [];
for (const png of pngs) {
	const base = basename(png).toLowerCase();
	const webp = png.slice(0, -4) + '.webp';
	if (referenced.has(base)) {
		keptReferenced++;
		if (keptRefSample.length < 25) keptRefSample.push(basename(png));
		continue;
	}
	if (!existsSync(webp)) {
		keptNoWebp++;
		continue;
	}
	freed += statSync(png).size;
	rmSync(png);
	deleted++;
}

console.log(
	JSON.stringify(
		{
			totalPng: pngs.length,
			deleted,
			keptReferenced,
			keptNoWebp,
			freedMB: (freed / 1048576).toFixed(1),
			keptReferencedSample: keptRefSample
		},
		null,
		2
	)
);
