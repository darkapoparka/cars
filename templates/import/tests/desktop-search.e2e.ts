import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => {
	test.skip(Boolean(isMobile));
});

test('desktop artwork tabs connect to compact fields without changing the mobile tab variant', async ({
	page
}) => {
	await visit(page, '/');
	const box = page.locator('.home-hero__box');
	const tabs = box.getByRole('tab');
	await expect(tabs).toHaveCount(4);
	const artwork = box.locator('.mode-tab-artwork img');
	await expect(artwork).toHaveCount(4);
	for (const width of [768, 1024, 1440, 1920]) {
		await page.setViewportSize({ width, height: 900 });
		for (const tab of await tabs.all()) {
			await expect(tab).toHaveCSS('font-size', '20px');
			await expect(tab).toHaveCSS('font-weight', '400');
		}
		await expect
			.poll(() =>
				artwork.evaluateAll((images) =>
					images.every((node) => {
						const image = node as HTMLImageElement;
						const bounds = image.getBoundingClientRect();
						const target = image.closest('button')!.getBoundingClientRect();
						return (
							image.complete &&
							image.naturalWidth > 1 &&
							image.alt === '' &&
							bounds.width >= 40 &&
							bounds.height >= 40 &&
							bounds.x >= target.x &&
							bounds.right <= target.right &&
							bounds.y >= target.y &&
							bounds.bottom <= target.bottom
						);
					})
				)
			)
			.toBe(true);
		const metrics = await box.locator('.hfp__field').evaluateAll((nodes) =>
			nodes.map((n) => ({
				height: n.getBoundingClientRect().height,
				size: getComputedStyle(n.querySelector('.hfp__value')!).fontSize,
				weight: getComputedStyle(n.querySelector('.hfp__value')!).fontWeight
			}))
		);
		expect(metrics).toHaveLength(4);
		for (const m of metrics) {
			expect(m.height).toBe(48);
			expect(m.size).toBe('20px');
			expect(m.weight).toBe('400');
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	const tabRect = await tabs.first().boundingBox();
	const panel = await page.locator('.home-hero__panel').boundingBox();
	expect(tabRect!.y + tabRect!.height).toBeLessThanOrEqual(panel!.y + 2);
	await box.getByRole('tab', { name: 'Лизинг', exact: true }).click();
	await expect(box.getByRole('link', { name: 'Изчисли вноска' })).toHaveAttribute(
		'href',
		'/bg/financing'
	);
	await box.getByRole('tab', { name: 'Внос', exact: true }).click();
	await expect(page.locator('#home-query')).toHaveAttribute('name', 'vehicle');
	await expect(page.locator('#home-query')).toHaveCSS('font-size', '20px');
	await box.getByRole('tab', { name: 'Продай', exact: true }).click();
	await expect(page.locator('#home-query')).toHaveAttribute('name', 'vin');
	await expect(page.locator('#home-query')).toHaveCSS('font-size', '20px');
});

test('search entry opens a focused dialog with one intact focus outline and pinned actions', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 700 });
	await visit(page, '/');
	const opener = page.locator('#home-query');
	await opener.click();
	const dialog = page.locator('.vehicle-search-dialog');
	await expect(dialog).toBeVisible();
	const input = dialog.getByRole('searchbox');
	await expect(input).toBeFocused();
	const ring = await input.evaluate((n) => ({
		input: getComputedStyle(n).outlineStyle,
		outer: getComputedStyle(n.parentElement!).outlineStyle,
		radius: parseFloat(getComputedStyle(n.parentElement!).borderRadius)
	}));
	expect(ring.input).toBe('none');
	expect(ring.outer).toBe('solid');
	expect(ring.radius).toBeGreaterThan(0);
	await expect(dialog.locator('.vehicle-search__results li')).toHaveCount(4);
	const header = await dialog.locator('.site-dialog__toolbar').boundingBox();
	const footer = await dialog.locator('.site-dialog__footer').boundingBox();
	await dialog.locator('.site-dialog__body').evaluate((n) => {
		n.scrollTop = n.scrollHeight;
	});
	expect((await dialog.locator('.site-dialog__toolbar').boundingBox())!.y).toBe(header!.y);
	expect((await dialog.locator('.site-dialog__footer').boundingBox())!.y).toBe(footer!.y);
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))
	).toEqual([]);
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(opener).toBeFocused();
});

test('nested make selection returns to search, keeps the draft, and submits the same canonical query', async ({
	page
}) => {
	await visit(page, '/?lang=en');
	await page.locator('#home-query').click();
	const search = page.locator('.vehicle-search-dialog');
	const input = search.getByRole('searchbox');
	await input.fill('X5');
	const make = search.locator('.hfp__field').first();
	await make.click();
	const picker = page.getByRole('dialog').filter({ has: page.locator('.hfp-picker') });
	await expect(picker).toBeVisible();
	await expect(picker.getByRole('searchbox')).toBeFocused();
	await picker.locator('.hfp__chip').filter({ hasText: 'BMW' }).click();
	await page.keyboard.press('Escape');
	await expect(picker).not.toBeVisible();
	await expect(search).toBeVisible();
	await expect(make).toBeFocused();
	await expect(input).toHaveValue('X5');
	await expect(search.locator('.vehicle-search__results li').first()).toContainText('BMW');
	const api = await page.request.get('/api/inventory/count?brand=BMW&keyword=X5&lang=en&preview=1');
	const data = await api.json();
	await expect(search.locator('.site-dialog__footer')).toContainText('(' + data.count + ')');
	await input.press('Enter');
	await expect(page).toHaveURL(
		(u) =>
			u.pathname === '/en/inventory' &&
			u.searchParams.get('brand') === 'BMW' &&
			u.searchParams.get('keyword') === 'X5' &&
			u.searchParams.get('lang') === 'en'
	);
});

test('empty results and an unavailable preview never manufacture a result count', async ({
	page
}) => {
	await visit(page, '/');
	await page.locator('#home-query').click();
	const dialog = page.locator('.vehicle-search-dialog');
	const initialBounds = await dialog.boundingBox();
	const initialInput = await dialog.getByRole('searchbox').boundingBox();
	await dialog.getByRole('searchbox').fill('no-car-with-this-name-78234');
	await expect(dialog.getByText('Няма намерени автомобили', { exact: true })).toBeVisible();
	await expect(dialog.locator('.site-dialog__footer')).toContainText('(0)');
	expect((await dialog.boundingBox())!.height).toBe(initialBounds!.height);
	expect((await dialog.getByRole('searchbox').boundingBox())!.y).toBe(initialInput!.y);
	await dialog.getByRole('button', { name: 'Изчисти филтрите', exact: true }).click();
	await expect(dialog.locator('.vehicle-search__results li')).toHaveCount(4);
	await page.route('**/api/inventory/count?**', (route) =>
		route.fulfill({ status: 503, body: 'unavailable' })
	);
	await dialog.getByRole('searchbox').fill('BMW');
	await expect(dialog.getByText(/Прегледът не се зареди/)).toBeVisible();
	await expect(dialog.locator('.site-dialog__footer')).not.toContainText('(0)');
	await dialog
		.locator('.site-dialog__footer')
		.getByRole('button', { name: 'Покажи автомобили', exact: true })
		.click();
	await expect(page).toHaveURL(
		(u) => u.pathname === '/bg/inventory' && u.searchParams.get('keyword') === 'BMW'
	);
});

test('header search reuses the same focused result dialog', async ({ page }) => {
	await visit(page, '/about?lang=en');
	const opener = page
		.locator('.site-header')
		.getByRole('button', { name: 'Search cars', exact: true });
	await opener.click();
	const dialog = page.locator('.vehicle-search-dialog');
	await expect(dialog.getByRole('searchbox')).toBeFocused();
	await dialog.getByRole('searchbox').fill('Audi');
	await expect(dialog.locator('.vehicle-search__results li').first()).toContainText('Audi');
	await page.keyboard.press('Escape');
	await expect(opener).toBeFocused();
});

test('inventory type shortcuts preserve search context and share the existing type picker', async ({
	page
}) => {
	await visit(
		page,
		'/inventory?lang=en&brand=BMW&bodyType=Sedan&maxPrice=100000&sort=lowest-price&view=3&layout=dashboard&marker=keep'
	);
	const types = page.getByRole('navigation', { name: 'Vehicle type', exact: true });
	await expect(types.getByRole('link', { name: 'Sedan', exact: true })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await types.getByRole('link', { name: 'SUV', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.pathname === '/en/inventory' &&
			url.searchParams.get('body') === 'SUV' &&
			!url.searchParams.has('bodyType') &&
			url.searchParams.get('brand') === 'BMW' &&
			url.searchParams.get('maxPrice') === '100000' &&
			url.searchParams.get('sort') === 'lowest-price' &&
			url.searchParams.get('view') === '3' &&
			url.searchParams.get('layout') === 'dashboard' &&
			url.searchParams.get('marker') === 'keep'
	);
	await expect(types.getByRole('link', { name: 'SUV', exact: true })).toHaveAttribute(
		'aria-current',
		'page'
	);
	const search = page.locator('.inventory-hero__search');
	await search.getByRole('searchbox').fill('X5');
	await search.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('keyword') === 'X5' &&
			url.searchParams.get('body') === 'SUV' &&
			url.searchParams.get('brand') === 'BMW'
	);
	await expect(page.locator('main .site-vehicle-card').first()).toContainText('BMW X5');
	await types.getByRole('link', { name: 'All cars', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			!url.searchParams.has('body') &&
			url.searchParams.get('keyword') === 'X5' &&
			url.searchParams.get('brand') === 'BMW'
	);
	await expect(types.getByRole('link', { name: 'All cars', exact: true })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await page.getByRole('button', { name: 'Type', exact: true }).click();
	const picker = page.locator('.inventory-filters-dialog');
	await expect(picker).toBeVisible();
	await expect(picker).toContainText('SUV');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: 'Type', exact: true })).toBeFocused();
});

test('home Search follows selected filters and newest vehicles retains the inventory entry', async ({
	page
}) => {
	await visit(page, '/');
	await page.getByRole('button', { name: 'Марка: Всички марки', exact: true }).click();
	const picker = page.getByRole('dialog').filter({ has: page.locator('.hfp-picker') });
	await picker.locator('.hfp__chip').filter({ hasText: 'BMW' }).click();
	await page.keyboard.press('Escape');
	await page
		.locator('.home-hero__search')
		.getByRole('link', { name: 'Търси', exact: true })
		.click();
	await expect(page).toHaveURL(
		(url) => url.pathname === '/bg/inventory' && url.searchParams.get('brand') === 'BMW'
	);
	await expect(page.locator('.vehicle-search-dialog')).not.toBeVisible();
	await expect(page.locator('main .site-vehicle-card').first()).toContainText('BMW');
	await visit(page, '/');
	await expect(page.getByRole('navigation', { name: 'Бързо търсене' })).toHaveCount(0);
	const stock = page.locator('.home-desktop-entry');
	await expect(stock.locator('.home-vehicles .site-vehicle-card')).toHaveCount(3);
	await stock
		.locator('.home-vehicles')
		.getByRole('link', { name: /^Виж всички:/ })
		.click();
	await expect(page).toHaveURL(
		(url) => url.pathname === '/bg/inventory' && !url.searchParams.has('brand')
	);
	await expect(page.locator('main .site-vehicle-card').first()).toBeVisible();
});
