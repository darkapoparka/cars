import { visit } from './helpers';
import { expect, test } from '@playwright/test';
import { promptVersion } from './locale-fixture';

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

test('desktop sidebar submits canonical filters, keeps searched-out choices and preserves layout on clear', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(
		page,
		'/en/inventory?brand=BMW&priceTo=50000&sort=lowest-price&layout=dashboard&view=3&keyword=BMW&lang=en'
	);
	const sidebar = page.locator('.inventory-sidebar');
	await expect(sidebar.getByRole('checkbox', { name: 'BMW', exact: true })).toBeChecked();
	await sidebar.getByRole('searchbox').first().fill('Audi');
	await sidebar.getByRole('checkbox', { name: 'Audi', exact: true }).check();
	await sidebar.getByRole('spinbutton').first().fill('32000');
	await sidebar.getByRole('button', { name: 'Apply filters', exact: true }).click();
	await expect(page).toHaveURL((url) => {
		const params = url.searchParams;
		return (
			params.getAll('brand').includes('BMW') &&
			params.getAll('brand').includes('Audi') &&
			params.get('maxPrice') === '32000' &&
			!params.has('priceTo') &&
			params.get('keyword') === 'BMW' &&
			params.get('layout') === 'dashboard' &&
			params.get('view') === '3' &&
			params.get('sort') === 'lowest-price' &&
			params.get('lang') === 'en'
		);
	});
	await expect(sidebar.getByRole('checkbox', { name: 'BMW', exact: true })).toBeChecked();
	await expect(sidebar.getByRole('checkbox', { name: 'Audi', exact: true })).toBeChecked();
	await sidebar.getByRole('link', { name: 'Clear', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			!url.searchParams.has('brand') &&
			!url.searchParams.has('maxPrice') &&
			!url.searchParams.has('keyword') &&
			url.searchParams.get('layout') === 'dashboard'
	);
	await expect(sidebar).toBeVisible();
	await page
		.getByRole('link', { name: 'Show the grid without a persistent filter panel', exact: true })
		.click();
	await expect(sidebar).not.toBeVisible();
});

test('desktop keyword search replaces its previous value and preserves model and presentation state', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(
		page,
		'/inventory?brand=BMW&model=X3&keyword=Sport&priceTo=50000&layout=dashboard&view=3&sort=lowest-price'
	);
	await page.locator('.inventory-hero').getByRole('searchbox').fill('xDrive');
	await page.locator('.inventory-hero').getByRole('searchbox').press('Enter');
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.getAll('keyword').join() === 'xDrive' &&
			url.searchParams.get('q') === 'X3' &&
			!url.searchParams.has('model') &&
			url.searchParams.get('maxPrice') === '50000' &&
			url.searchParams.get('layout') === 'dashboard' &&
			url.searchParams.get('view') === '3' &&
			url.searchParams.get('sort') === 'lowest-price'
	);
	await expect(page.locator('main .site-vehicle-card').first()).toContainText('BMW X3');
});

test('desktop sidebar maximums and choices submit without JavaScript', async ({
	browser,
	baseURL
}, info) => {
	test.skip(info.project.name !== 'desktop');
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: info.project.use.viewport
	});
	await context.addCookies([{ name: 'cars_prompt', value: promptVersion, url: baseURL! }]);
	const page = await context.newPage();
	await page.goto(`${baseURL}/bg/inventory?layout=dashboard&brand=BMW&maxPrice=50000`);
	const sidebar = page.locator('.inventory-sidebar');
	await sidebar.getByRole('spinbutton').first().fill('32000');
	await sidebar.getByRole('checkbox', { name: 'Audi', exact: true }).check();
	await sidebar.getByRole('button', { name: 'Приложи филтрите', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('maxPrice') === '32000' &&
			url.searchParams.getAll('brand').includes('BMW') &&
			url.searchParams.getAll('brand').includes('Audi') &&
			url.searchParams.get('layout') === 'dashboard'
	);
	await expect(page.locator('main .site-vehicle-card').first()).toBeVisible();
	await context.close();
});
