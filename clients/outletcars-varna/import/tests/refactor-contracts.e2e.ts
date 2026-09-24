import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('failed vehicle photos recover even when the request fails before hydration', async ({
	page
}) => {
	await page.route('**/*', (route) => {
		const request = route.request();
		return request.resourceType() === 'image' &&
			!new URL(request.url()).hostname.match(/^(localhost|127\.0\.0\.1)$/)
			? route.abort()
			: route.continue();
	});
	await visit(page, '/inventory');
	const image = page.locator('main img:visible');
	await expect
		.poll(() =>
			image.evaluateAll(
				(images) =>
					images.filter(
						(i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0
					).length
			)
		)
		.toBe(0);
});

test('language-specific pages have distinct canonicals and matching HTML language', async ({
	page
}) => {
	await visit(page, '/inventory?lang=en');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/inventory$/);
	await expect(page.locator('link[rel="alternate"][hreflang="bg"]')).toHaveAttribute(
		'href',
		/\/bg\/inventory$/
	);
	await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
		'href',
		/\/en\/inventory$/
	);
});

test('mobile menu is accessible and preserves language during navigation', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'mobile');
	await visit(page, '/inventory?lang=en');
	await page.getByRole('button', { name: 'Menu', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
		[]
	);
	await dialog.getByRole('link', { name: 'Contact', exact: true }).click();
	await expect(page).toHaveURL(
		(url) => url.pathname === '/en/contact' && url.searchParams.get('lang') === 'en'
	);
	await expect(dialog).not.toBeVisible();
});

test('desktop content reflows at intermediate and wide widths', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	for (const width of [768, 1024, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		await visit(page, '/inventory');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await expect(page.locator('.site-filter-trigger').first()).toBeVisible();
	}
});

test('desktop import country choices do not clip or need horizontal scrolling', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/import');
	const countries = page.locator('.bc-import-wizard--embedded .bc-import-wizard__country-grid');
	await expect(countries).toBeVisible();
	expect(await countries.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
		true
	);
});
