import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales, splitLocalePath } from '../i18n/config.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifestPath = path.join(root, 'mirror', 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const missing = [];

if (manifest.routes.length !== 150) throw new Error(`Expected 150 mirror routes, found ${manifest.routes.length}.`);
if (manifest.resources.length !== 479) throw new Error(`Expected 479 local resources, found ${manifest.resources.length}.`);

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

for (const pathname of ['config.mjs', 'site-config.mjs', 'runtime.js', 'styles.css']) {
	await readFile(path.join(root, 'i18n', pathname));
}

for (const locale of locales) {
	const parsed = splitLocalePath(`/${locale}/listing-grid`);
	if (parsed.locale !== locale || parsed.routePath !== '/listing-grid') throw new Error(`Locale route parser failed for ${locale}.`);
}

console.log(`Mirror verified: ${manifest.routes.length} routes, ${manifest.resources.length} local resources, ${locales.length} locale routes.`);
