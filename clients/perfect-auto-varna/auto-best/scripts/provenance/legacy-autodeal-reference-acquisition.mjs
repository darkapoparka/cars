import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Historical acquisition utility retained only for provenance. It targets the
// older AutoDeal reference below; it is not evidence for the separately
// retained Day & Night manifest and is not an application build command.
const authorizationVariable = 'ALLOW_LEGACY_REFERENCE_ACQUISITION';
const authorizationValue = 'I_UNDERSTAND_THIS_RECREATES_MIRROR';

if (process.env[authorizationVariable] !== authorizationValue) {
	throw new Error(
		`Archived destructive acquisition script. Set ${authorizationVariable}=${authorizationValue} only when intentionally recreating the retired mirror from its historical source.`
	);
}

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const origin = 'https://autodealnextjs.vercel.app';
const mirrorRoot = path.join(root, 'mirror');
const publicRoot = path.join(mirrorRoot, 'public');
const pagesRoot = path.join(mirrorRoot, 'pages');

const seedRoutes = [
	'/',
	'/home02',
	'/home03',
	'/home04',
	'/home05',
	'/home06',
	'/home07',
	'/home08',
	'/home09',
	'/home10',
	'/listing-grid',
	'/listing-grid2',
	'/listing-list',
	'/listing-grid-map',
	'/listing-list-map',
	'/listing-detail-v1/1',
	'/listing-detail-v2/1',
	'/listing-detail-v3/1',
	'/listing-detail-v4/1',
	'/listing-detail-v5/1',
	'/about-us',
	'/pricing',
	'/compare',
	'/dealer-listing',
	'/dealer-detail/1',
	'/sale-agents',
	'/sale-agents-detail/1',
	'/blog',
	'/blog-grid',
	'/blog-detail/1',
	'/faq',
	'/contact',
	'/add-listing',
	'/dashboard',
	'/my-favorite'
];
const routes = [...seedRoutes];
const discoveredRoutes = new Set(routes);
const validRoutes = [];

const resourcePattern = /(?:src|href|srcSet|poster)=["']([^"']+)["']/g;
const routePattern = /href=["']([^"']+)["']/g;
const cssUrlPattern = /url\((?:["']?)([^)"']+)(?:["']?)\)/g;
const nextResourcePattern = /["'`]((?:\/_next|\/assets|\/favicon\.ico)[^"'`\s<>]*)["'`]/g;
const fetched = new Map();
const queue = ['/_next/static/chunks/5471.eefa8750c27dcdbd.js'];

const routeKey = (route) => (route === '/' ? 'index' : route.replace(/^\//, '').replaceAll('/', '__'));
const localPathFor = (pathname) => path.join(publicRoot, pathname.replace(/^\//, '').split('/').join(path.sep));

const enqueue = (value) => {
	if (!value || value.startsWith('data:') || value.startsWith('#')) return;
	const clean = value.split(/[?#]/, 1)[0];
	if (!clean.startsWith('/')) return;
	if (!clean.startsWith('/_next') && !clean.startsWith('/assets') && clean !== '/favicon.ico') return;
	if (!fetched.has(clean) && !queue.includes(clean)) queue.push(clean);
};

const discover = (text) => {
	for (const match of text.matchAll(resourcePattern)) {
		for (const candidate of match[1].split(/\s+/)) enqueue(candidate);
	}
	for (const match of text.matchAll(cssUrlPattern)) enqueue(match[1]);
	for (const match of text.matchAll(nextResourcePattern)) enqueue(match[1]);
};

const discoverRoutes = (text) => {
	for (const match of text.matchAll(routePattern)) {
		const value = match[1].trim();
		if (!value.startsWith('/') || value.startsWith('/_next') || value.startsWith('/assets') || value === '/favicon.ico') continue;
		const pathname = new URL(value, origin).pathname.replace(/\/$/, '') || '/';
		if (!discoveredRoutes.has(pathname)) {
			discoveredRoutes.add(pathname);
			routes.push(pathname);
		}
	}
};

const fetchBody = async (pathname) => {
	const response = await fetch(`${origin}${pathname}`, { redirect: 'follow' });
	if (!response.ok) throw new Error(`${response.status} ${pathname}`);
	const type = response.headers.get('content-type') || 'application/octet-stream';
	const buffer = Buffer.from(await response.arrayBuffer());
	return { type, buffer };
};

await rm(mirrorRoot, { recursive: true, force: true });
await mkdir(pagesRoot, { recursive: true });
await mkdir(publicRoot, { recursive: true });

for (let index = 0; index < routes.length; index += 1) {
	const route = routes[index];
	try {
		const response = await fetchBody(route);
		const html = response.buffer.toString('utf8').replaceAll(origin, '');
		await writeFile(path.join(pagesRoot, `${routeKey(route)}.html`), html);
		validRoutes.push(route);
		discover(html);
		discoverRoutes(html);
	} catch (error) {
		console.warn(`Skipped route ${route}: ${error.message}`);
	}
}

while (queue.length) {
	const pathname = queue.shift();
	if (fetched.has(pathname)) continue;
	try {
		const response = await fetchBody(pathname);
		fetched.set(pathname, { type: response.type, bytes: response.buffer.byteLength });
		const target = localPathFor(pathname);
		await mkdir(path.dirname(target), { recursive: true });
		await writeFile(target, response.buffer);
		if (response.type.includes('text') || /\.(?:css|js|map|html)$/i.test(pathname)) {
			discover(response.buffer.toString('utf8'));
		}
	} catch (error) {
		console.warn(`Skipped ${pathname}: ${error.message}`);
	}
}

const manifest = {
	source: origin,
	acquiredAt: new Date().toISOString(),
	routes: validRoutes,
	resources: [...fetched.entries()].map(([pathname, meta]) => ({ pathname, ...meta }))
};
await writeFile(path.join(mirrorRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Mirrored ${routes.length} routes and ${fetched.size} same-origin resources.`);
