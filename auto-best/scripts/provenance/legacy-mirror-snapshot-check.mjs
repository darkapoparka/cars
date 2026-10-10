import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Historical verifier retained for provenance. The application no longer ships
// the mirror payload, so this script only applies if that snapshot is restored
// from Git history into mirror/pages and mirror/public.
const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const manifestPath = path.join(root, 'provenance', 'mirror-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const missing = [];

for (const route of manifest.routes) {
	const key = route === '/' ? 'index' : route.replace(/^\//, '').replaceAll('/', '__');
	try {
		await readFile(path.join(root, 'mirror', 'pages', `${key}.html`));
	} catch {
		missing.push(route);
	}
}

if (missing.length) {
	throw new Error(`Missing route snapshots: ${missing.join(', ')}`);
}

for (const relativePath of [
	'mirror/public/assets/best-home.js',
	'mirror/public/assets/day-night-site.js'
]) {
	const filePath = path.join(root, ...relativePath.split('/'));
	const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
	if (result.status !== 0) {
		throw new Error(`Invalid served script: ${relativePath}\n${result.stderr || result.stdout}`);
	}
}

for (const relativePath of [
	'mirror/public/assets/images/lead/day-night-promo-catalog-v12-quiet.png',
	'mirror/public/assets/images/lead/day-night-promo-viewing-v12-quiet.png',
	'mirror/public/assets/images/lead/day-night-promo-finance-kristian-v10-quiet.png'
]) {
	try {
		await readFile(path.join(root, ...relativePath.split('/')));
	} catch {
		throw new Error(`Missing generated promo asset: ${relativePath}`);
	}
}

console.log(`Mirror verified: ${manifest.routes.length} routes, ${manifest.resources.length} local resources.`);
