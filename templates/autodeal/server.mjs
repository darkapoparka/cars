import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultLocale as templateDefaultLocale, localeNames as templateLocaleNames, locales as templateLocales, localePath, splitLocalePath } from './i18n/config.mjs';
import { defaultLocale as projectDefaultLocale, enabledLocales, localeNames as projectLocaleNames } from './i18n/site-config.mjs';

const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)));
const mirrorRoot = path.join(root, 'mirror');
const publicRoot = path.join(mirrorRoot, 'public');
const pagesRoot = path.join(mirrorRoot, 'pages');
const i18nRoot = path.join(root, 'i18n');
const port = Number(process.env.PORT || 5173);
const allowedLocales = new Set(enabledLocales);
const serverDefaultLocale = allowedLocales.has(projectDefaultLocale) ? projectDefaultLocale : templateDefaultLocale;
const serverLocaleNames = { ...templateLocaleNames, ...projectLocaleNames };

const types = {
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ico': 'image/x-icon'
};

const routeKey = (pathname) => (pathname === '/' ? 'index' : pathname.replace(/^\//, '').replaceAll('/', '__'));

function safePath(base, requestPath) {
	const basePath = path.resolve(base);
	const candidate = path.resolve(basePath, requestPath.replace(/^[/\\]+/, '').split('/').join(path.sep));
	if (candidate !== basePath && !candidate.startsWith(`${basePath}${path.sep}`)) return null;
	return candidate;
}

function safeJson(value) {
	return JSON.stringify(value)
		.replaceAll('<', '\\u003c')
		.replaceAll('>', '\\u003e')
		.replaceAll('&', '\\u0026')
		.replaceAll('\u2028', '\\u2028')
		.replaceAll('\u2029', '\\u2029');
}

async function readCatalog(locale) {
	const fallback = {
		version: 1,
		locale,
		sourceLocale: 'en',
		messages: {},
		compact: {},
		preserved: {},
		locales: enabledLocales,
		localeNames: serverLocaleNames,
		defaultLocale: serverDefaultLocale
	};
	try {
		const catalog = JSON.parse(await readFile(path.join(i18nRoot, 'catalogs', `${locale}.json`), 'utf8'));
		if (!catalog || typeof catalog !== 'object' || !catalog.messages || typeof catalog.messages !== 'object') throw new Error('catalog messages are missing');
		return { ...fallback, ...catalog, locales: enabledLocales, localeNames: serverLocaleNames, defaultLocale: serverDefaultLocale };
	} catch (error) {
		console.error(`[i18n] Could not load ${locale} catalog; serving source content safely.`, error instanceof Error ? error.message : error);
		return fallback;
	}
}

function setHtmlLocale(markup, locale) {
	return markup.replace(/<html\b([^>]*)>/iu, (whole, attributes) => {
		if (/\blang\s*=\s*["'][^"']*["']/iu.test(attributes)) {
			return `<html${attributes.replace(/(\blang\s*=\s*["'])[^"']*(["'])/iu, `$1${locale}$2`)}>`;
		}
		return `<html lang="${locale}"${attributes}>`;
	});
}

async function renderPage(filePath, locale) {
	const source = await readFile(filePath, 'utf8');
	const catalog = await readCatalog(locale);
	const payload = `<script type="application/json" id="autodeal-i18n-catalog" data-locale="${locale}">${safeJson(catalog)}</script>`;
	const shell = `<link rel="stylesheet" href="/i18n/styles.css" data-autodeal-i18n="styles"><script defer src="/i18n/runtime.js" data-autodeal-i18n="runtime"></script>`;
	const withLocale = setHtmlLocale(source, locale);
	const withOverlay = withLocale.includes('</head>')
		? withLocale.replace('</head>', `${shell.replace('<script defer src="/i18n/runtime.js" data-autodeal-i18n="runtime"></script>', `${payload}<script defer src="/i18n/runtime.js" data-autodeal-i18n="runtime"></script>`)}</head>`)
		: `${payload}${shell}${withLocale}`;
	return Buffer.from(withOverlay, 'utf8');
}

const server = createServer(async (request, response) => {
	const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
	const rawPathname = requestUrl.pathname;
	const isI18nAsset = rawPathname === '/i18n' || rawPathname.startsWith('/i18n/');
	const isMirrorAsset = rawPathname.startsWith('/_next/') || rawPathname.startsWith('/assets/') || rawPathname === '/favicon.ico';
	const isAsset = isI18nAsset || isMirrorAsset;
	let parsed;
	try {
		parsed = splitLocalePath(rawPathname);
	} catch {
		response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Invalid URL');
		return;
	}
	const routeLocale = allowedLocales.has(parsed.locale) ? parsed.locale : serverDefaultLocale;

	if (!isAsset && !parsed.hadLocale) {
		response.writeHead(307, { location: `${localePath(serverDefaultLocale, parsed.routePath)}${requestUrl.search}` });
		response.end();
		return;
	}

	const pathname = isAsset ? rawPathname : parsed.routePath;
	const filePath = isI18nAsset
		? safePath(i18nRoot, rawPathname.slice('/i18n/'.length))
		: isMirrorAsset
			? safePath(publicRoot, rawPathname)
			: safePath(pagesRoot, `${routeKey(parsed.routePath.replace(/\/$/u, '') || '/')}.html`);

	try {
		if (!filePath) throw new Error('unsafe path');
		const ext = path.extname(filePath).toLowerCase();
		const body = !isAsset && ext === '.html' ? await renderPage(filePath, routeLocale) : await readFile(filePath);
		response.writeHead(200, {
			'content-type': types[ext] || 'application/octet-stream',
			'cache-control': 'no-cache',
			...(isAsset ? {} : { 'content-language': routeLocale })
		});
		if (request.method !== 'HEAD') response.end(body);
		else response.end();
	} catch {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end(`Not found: ${pathname}`);
	}
});

server.listen(port, '127.0.0.1', () => {
	console.log(`AutoDeal reference template listening at http://localhost:${port}`);
	console.log(`Locales: ${templateLocales.filter((locale) => allowedLocales.has(locale)).join(', ')}; default: ${serverDefaultLocale}`);
});
