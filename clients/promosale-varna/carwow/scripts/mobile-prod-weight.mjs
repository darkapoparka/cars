// Prod page-weight probe: transfer size by resource type per route (mobile).
import { chromium } from '@playwright/test';

const BASE = process.env.AUDIT_BASE || 'http://localhost:4399';
const ROUTES = ['/', '/inventory', '/inventory/mercedes-benz-150i-2010-15437', '/sell-your-car'];

const browser = await chromium.launch();

for (const route of ROUTES) {
	const ctx = await browser.newContext({
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
			if (size > 100_000)
				big.push({
					url: res.url().replace(BASE, '').slice(0, 90),
					kb: Math.round(size / 1024),
					type
				});
		} catch {
			// Some responses cannot expose a body in Playwright; skip them for budget accounting.
		}
	});
	const t0 = Date.now();
	await page
		.goto(BASE + route, { waitUntil: 'networkidle' })
		.catch((e) => console.log('NAV FAIL', route, e.message.split('\n')[0]));
	const loadMs = Date.now() - t0;
	const total = Object.values(byType).reduce((a, b) => a + b, 0);
	console.log(
		`\n=== ${route}  (networkidle ${loadMs}ms, total ${(total / 1024 / 1024).toFixed(2)}MB uncompressed)`
	);
	for (const [t, v] of Object.entries(byType).sort((a, b) => b[1] - a[1]))
		console.log(`  ${t.padEnd(12)} ${(v / 1024).toFixed(0).padStart(6)} KB`);
	big.sort((a, b) => b.kb - a.kb);
	for (const b of big.slice(0, 8))
		console.log(`  BIG: ${String(b.kb).padStart(5)}KB  [${b.type}] ${b.url}`);
	await ctx.close();
}

await browser.close();
