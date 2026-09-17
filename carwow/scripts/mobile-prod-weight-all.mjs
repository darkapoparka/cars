import { chromium, devices } from '@playwright/test';

const BASE = process.env.AUDIT_BASE || 'http://localhost:4399';
const DEFAULT_PDP_PATH = '/inventory/mercedes-benz-gla-45-amg-405323';

function extractInventoryPathsFromSitemap(xml) {
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
		.map((match) => match[1])
		.map((loc) => {
			try {
				return new URL(loc).pathname;
			} catch {
				return '';
			}
		})
		.filter(
			(path) =>
				path.startsWith('/inventory/') &&
				path !== '/inventory/map' &&
				path.split('/').filter(Boolean).length === 2
		);
}

async function resolvePublishedPdpPath() {
	if (process.env.AUDIT_PDP_PATH) {
		return process.env.AUDIT_PDP_PATH;
	}

	try {
		const response = await fetch(new URL('/sitemap.xml', BASE));
		if (!response.ok) {
			throw new Error(`sitemap returned ${response.status}`);
		}
		const paths = extractInventoryPathsFromSitemap(await response.text());
		return paths[0] ?? DEFAULT_PDP_PATH;
	} catch (error) {
		console.warn(
			`Unable to derive published PDP route from sitemap: ${error instanceof Error ? error.message : String(error)}`
		);
		return DEFAULT_PDP_PATH;
	}
}

const ROUTES = [
	{ path: '/', budgetMb: 1.5 },
	{ path: '/inventory', budgetMb: 2.0 },
	{ path: await resolvePublishedPdpPath(), budgetMb: 2.0 },
	{ path: '/sell-your-car', budgetMb: 1.5 },
	{ path: '/services', budgetMb: 1.5 },
	{ path: '/contact', budgetMb: 1.5 },
	{ path: '/about', budgetMb: 1.5 },
	{ path: '/favorites', budgetMb: 1.5 }
];

const browser = await chromium.launch();
let failed = false;

for (const route of ROUTES) {
	const ctx = await browser.newContext({
		...devices['iPhone 13'],
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2,
		isMobile: true,
		hasTouch: true
	});
	const page = await ctx.newPage();
	const byType = {};
	const big = [];

	page.on('response', async (res) => {
		try {
			const req = res.request();
			const type = req.resourceType();
			const body = await res.body().catch(() => null);
			const size = body ? body.length : 0;
			byType[type] = (byType[type] || 0) + size;
			if (size > 100_000) {
				big.push({
					url: res.url().replace(BASE, '').slice(0, 100),
					kb: Math.round(size / 1024),
					type
				});
			}
		} catch {
			// Some responses cannot expose a body in Playwright; skip them for budget accounting.
		}
	});

	const started = Date.now();
	await page.goto(BASE + route.path, { waitUntil: 'networkidle' }).catch((error) => {
		console.log('NAV FAIL', route.path, error.message.split('\n')[0]);
		failed = true;
	});

	const loadMs = Date.now() - started;
	const total = Object.values(byType).reduce((sum, size) => sum + size, 0);
	const totalMb = total / 1024 / 1024;
	const status = totalMb <= route.budgetMb ? 'ok' : 'OVER';

	if (status === 'OVER') failed = true;

	console.log(
		`\n=== ${route.path} ${status} ${totalMb.toFixed(2)}MB / ${route.budgetMb.toFixed(
			2
		)}MB (${loadMs}ms networkidle)`
	);

	for (const [type, size] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
		console.log(`  ${type.padEnd(12)} ${(size / 1024).toFixed(0).padStart(6)} KB`);
	}

	for (const item of big.sort((a, b) => b.kb - a.kb).slice(0, 8)) {
		console.log(`  BIG: ${String(item.kb).padStart(5)}KB [${item.type}] ${item.url}`);
	}

	await ctx.close();
}

await browser.close();
if (failed) process.exit(1);
