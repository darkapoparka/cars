import { visit } from './helpers';
import { expect, test } from '@playwright/test';

test('inventory remains server-rendered without JavaScript', async ({
	browser,
	baseURL
}, testInfo) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		locale: 'bg-BG',
		viewport: testInfo.project.use.viewport
	});
	const page = await context.newPage();
	await page.goto(`${baseURL}/inventory`);
	await expect(page.locator('main a[href*="/inventory/"]:visible').first()).toBeVisible();
	await context.close();
});

test('filters and detail return retain the original URL', async ({ page }) => {
	await visit(page, '/inventory?brand=BMW&maxPrice=40000&sort=lowest-price&view=3');
	const original = page.url();
	await page.locator('main a[href*="/inventory/"]:visible').first().click();
	await expect(page).toHaveURL((url) => url.pathname.startsWith('/bg/inventory/'));
	await page.goBack();
	await expect(page).toHaveURL(original);
	await expect(page.locator('main a[href*="/inventory/"]:visible').first()).toBeVisible();
});

test('desktop filter search does not discard a previously selected make', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	await page.locator('.site-filter-trigger').filter({ hasText: 'Марка' }).click();
	const popover = page.getByRole('dialog');
	await popover.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	const search = popover.getByRole('searchbox');
	if (await search.count()) await search.fill('Audi');
	await popover.getByRole('button', { name: 'Покажи автомобили', exact: true }).click();
	await expect(page).toHaveURL((url) => url.searchParams.getAll('brand').includes('BMW'));
	await expect(page.locator('main .site-vehicle-card').first()).toBeVisible();
});
