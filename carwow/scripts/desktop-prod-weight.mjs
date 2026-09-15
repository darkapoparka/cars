import { chromium } from '@playwright/test';

const baseUrl = process.env.AUDIT_BASE ?? 'http://127.0.0.1:4399';
const strict = process.argv.includes('--strict');
const targetStrict = process.argv.includes('--target-strict');

const routes = [
	{ path: '/', label: 'home', initialBudgetMb: 4.8, targetBudgetMb: 2.2 },
	{ path: '/inventory', label: 'inventory', initialBudgetMb: 2.7, targetBudgetMb: 1.8 },
	{
		path: '/inventory/mercedes-benz-gla-45-amg-405323',
		label: 'pdp',
		initialBudgetMb: 4.6,
		targetBudgetMb: 2.4
	},
	{ path: '/sell-your-car', label: 'sell', initialBudgetMb: 2.2, targetBudgetMb: 1.4 },
	{ path: '/services', label: 'services', initialBudgetMb: 10.5, targetBudgetMb: 2.5 },
	{ path: '/about', label: 'about', initialBudgetMb: 16, targetBudgetMb: 3 },
	{ path: '/contact', label: 'contact', initialBudgetMb: 3.8, targetBudgetMb: 1.6 },
	{ path: '/favorites', label: 'favorites', initialBudgetMb: 1.2, targetBudgetMb: 0.45 },
	{ path: '/financing', label: 'financing', initialBudgetMb: 2.3, targetBudgetMb: 1.4 },
	{ path: '/reviews', label: 'reviews', initialBudgetMb: 2.3, targetBudgetMb: 1.4 },
	{ path: '/team', label: 'team', initialBudgetMb: 10, targetBudgetMb: 2.2 },
	{ path: '/blog', label: 'blog', initialBudgetMb: 2.5, targetBudgetMb: 1.5 },
	{ path: '/faq', label: 'faq', initialBudgetMb: 2.1, targetBudgetMb: 1.2 },
	{ path: '/terms', label: 'terms', initialBudgetMb: 2.1, targetBudgetMb: 1.2 },
	{ path: '/inventory/map', label: 'inventory-map', initialBudgetMb: 5.6, targetBudgetMb: 2.2 }
];

const legacyTemplateScriptNames = new Set([
	'app.js',
	'plugin.js',
	'shop.js',
	'filterCar.js',
	'swiper.js',
	'swiper-bundle.min.js',
	'jquery.min.js',
	'jquery.fancybox.js',
	'maps.js',
	'marker.js',
	'switcher.js'
]);

function formatBytes(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function resourceName(url) {
	try {
		return new URL(url).pathname.split('/').pop() ?? url;
	} catch {
		return url;
	}
}

async function responseBytes(response) {
	try {
		const buffer = await response.body();
		return buffer.length;
	} catch {
		const header = response.headers()['content-length'];
		return header ? Number(header) : 0;
	}
}

const browser = await chromium.launch();
let failures = 0;

for (const route of routes) {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 1
	});
	const page = await context.newPage();
	const rows = [];
	const consoleErrors = [];

	page.on('console', (message) => {
		if (message.type() === 'error') {
			consoleErrors.push(message.text());
		}
	});

	page.on('response', async (response) => {
		const request = response.request();
		const type = request.resourceType();
		const url = response.url();
		const bytes = await responseBytes(response);
		rows.push({ type, url, bytes, status: response.status() });
	});

	const url = new URL(route.path, baseUrl).toString();
	const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
	const status = response?.status() ?? 0;
	await page.waitForTimeout(500);

	const totalBytes = rows.reduce((sum, row) => sum + row.bytes, 0);
	const byType = new Map();
	for (const row of rows) {
		byType.set(row.type, (byType.get(row.type) ?? 0) + row.bytes);
	}

	const appCssLinks = await page.evaluate(() =>
		[...document.querySelectorAll('link[rel="stylesheet"]')]
			.map((link) => link.getAttribute('href') ?? '')
			.filter((href) => href.includes('/assets/app.css'))
	);

	const legacyScripts = await page.evaluate(() =>
		[...document.scripts]
			.map((script) => script.src || script.getAttribute('src') || '')
			.filter((src) => src.includes('/assets/js/'))
	);

	const googleMapsScripts = rows
		.filter((row) => row.type === 'script' && row.url.includes('google'))
		.map((row) => row.url);

	const oversized = [...rows]
		.filter((row) => row.bytes >= 100 * 1024)
		.sort((a, b) => b.bytes - a.bytes)
		.slice(0, 12);

	const overInitial = totalBytes / 1024 / 1024 > route.initialBudgetMb;
	const overTarget = totalBytes / 1024 / 1024 > route.targetBudgetMb;
	const unexpectedLegacyScripts = legacyScripts.filter((src) =>
		legacyTemplateScriptNames.has(resourceName(src))
	);

	if (strict && overInitial) failures += 1;
	if (targetStrict && overTarget) failures += 1;

	console.log(`\n${route.label} ${route.path}`);
	console.log(`  status: ${status}`);
	console.log(
		`  total: ${formatBytes(totalBytes)} initial<=${route.initialBudgetMb} target<=${route.targetBudgetMb}`
	);
	console.log(
		`  by type: ${[...byType.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([type, bytes]) => `${type}=${formatBytes(bytes)}`)
			.join(', ')}`
	);
	console.log(`  app.css links: ${appCssLinks.length}`);
	console.log(`  legacy template scripts: ${unexpectedLegacyScripts.length}`);
	console.log(`  google maps scripts: ${googleMapsScripts.length}`);
	for (const row of oversized) {
		console.log(`    ${row.type.padEnd(10)} ${formatBytes(row.bytes).padStart(8)} ${row.url}`);
	}
	if (consoleErrors.length > 0) {
		console.log(`  console errors: ${consoleErrors.length}`);
		for (const error of consoleErrors.slice(0, 5)) {
			console.log(`    ${error}`);
		}
	}

	await context.close();
}

await browser.close();

if (failures > 0) {
	console.error(`\nDesktop weight audit failed with ${failures} budget violation(s).`);
	process.exit(1);
}
