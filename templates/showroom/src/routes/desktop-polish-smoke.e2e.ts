import { expect, test, type Page } from '@playwright/test';

// Abort slow/unreliable third-party hosts so pages reach network-idle deterministically.
// These same hosts hung the page during manual QA; they are removed for good in the
// image-migration plan, after which this guard is a no-op.
async function blockThirdParty(page: Page) {
	await page.route('**/*', (route) => {
		const url = route.request().url();
		if (/focus\.bg|code\.jquery\.com/i.test(url)) return route.abort();
		return route.continue();
	});
}

function collectPageErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	return errors;
}

const STATIC_ROUTES = [
	'/',
	'/inventory',
	'/about',
	'/contact',
	'/agents',
	'/calculator',
	'/compare'
];

for (const path of STATIC_ROUTES) {
	test(`smoke: ${path} renders the Eliqauto shell without uncaught errors`, async ({ page }) => {
		const errors = collectPageErrors(page);
		await blockThirdParty(page);
		const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
		expect(resp?.status() ?? 0, `${path} HTTP status`).toBeLessThan(400);
		await expect(page.locator('body')).toContainText('Eliqauto');
		await expect(page.locator('body')).not.toContainText('Eliq Auto');
		await expect(page.locator('body')).not.toContainText('ThemeForest');
		expect(errors, `uncaught JS errors on ${path}: ${errors.join(' | ')}`).toEqual([]);
	});
}

test('smoke: a vehicle detail page renders the Eliqauto shell without uncaught errors', async ({
	page
}) => {
	const errors = collectPageErrors(page);
	await blockThirdParty(page);
	await page.goto('/inventory', { waitUntil: 'domcontentloaded' });
	const href = await page.locator('a[href*="/inventory/"]').first().getAttribute('href');
	expect(href, 'first inventory card href').toBeTruthy();
	const target = '/' + href!.replace(/^[./]+/, '');
	const resp = await page.goto(target, { waitUntil: 'domcontentloaded' });
	expect(resp?.status() ?? 0, 'pdp HTTP status').toBeLessThan(400);
	await expect(page.locator('body')).toContainText('Eliqauto');
	expect(errors, `uncaught JS errors on pdp: ${errors.join(' | ')}`).toEqual([]);
});
