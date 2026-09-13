import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('mobile home keeps independent buy and import drafts across sheet and mode changes', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'networkidle' });
	const trigger = page.locator('.mh-hero__search');
	await trigger.click();
	let sheet = page.locator('.mobile-fullsheet[open]');
	await sheet.getByRole('searchbox', { name: 'Търсене', exact: true }).fill('BMW & Audi');
	await sheet.getByRole('button', { name: 'BMW', exact: true }).click();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Внос', exact: true }).click();
	await trigger.click();
	sheet = page.locator('.mobile-fullsheet[open]');
	await sheet.getByRole('textbox', { name: 'Търсен автомобил за внос' }).fill('BMW X5');
	await sheet.getByRole('textbox', { name: 'Марка', exact: true }).fill('BMW');
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Купи', exact: true }).click();
	await trigger.click();
	sheet = page.locator('.mobile-fullsheet[open]');
	await expect(sheet.getByRole('searchbox', { name: 'Търсене', exact: true })).toHaveValue(
		'BMW & Audi'
	);
	await expect(sheet.getByRole('button', { name: 'BMW', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	const href = await sheet.getByRole('link', { name: 'Виж автомобилите →' }).getAttribute('href');
	expect(new URL(href!, 'https://example.test').searchParams.get('q')).toBe('BMW & Audi');
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Внос', exact: true }).click();
	await trigger.click();
	await expect(page.getByRole('textbox', { name: 'Търсен автомобил за внос' })).toHaveValue(
		'BMW X5'
	);
	await expect(page.getByRole('textbox', { name: 'Марка', exact: true })).toHaveValue('BMW');
});

test('home and vehicle CSS follows the 991/992 boundary without duplicate links or shells', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory', { waitUntil: 'networkidle' });
	const href = await page
		.locator('a[href^="/inventory/"]:not([href="/inventory/map"])')
		.first()
		.getAttribute('href');
	expect(href).toBeTruthy();
	await page.goto(href!, { waitUntil: 'networkidle' });
	await expect(page.locator('#daynight-detail-desktop-css')).toHaveCount(0);
	for (const width of [992, 991, 1440, 390, 992]) {
		await page.setViewportSize({ width, height: 1000 });
		await expect(page.locator('main:visible')).toHaveCount(1);
		await expect(page.locator('#main-content')).toHaveCount(1);
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
			.toBe(true);
		await expect(page.locator('#daynight-detail-desktop-css')).toHaveCount(1);
		if (width >= 992)
			await expect
				.poll(() =>
					page
						.locator('#daynight-detail-desktop-css')
						.evaluate((node) => node instanceof HTMLLinkElement && Boolean(node.sheet))
				)
				.toBe(true);
	}
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.locator('#daynight-home-desktop-css')).toHaveCount(0);
	await page.setViewportSize({ width: 1440, height: 1000 });
	await expect(page.locator('#daynight-home-desktop-css')).toHaveCount(1);
	await expect(page.locator('.mobile-home')).toHaveCount(0);
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(page.locator('.mobile-home')).toBeVisible();
	await expect(page.locator('#daynight-home-desktop-css')).toHaveCount(1);
});

test('navigating from a home sheet releases modal scroll and keyboard ownership', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.locator('.mh-hero__search').click();
	await page.getByRole('dialog').getByRole('link', { name: 'Виж автомобилите →' }).click();
	await expect(page).toHaveURL(/\/inventory$/);
	await expect(page.locator('.mobile-fullsheet[open]')).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
	await page.locator('#mobile-inventory-search').click();
	await expect(page.locator('.mobile-fullsheet[open]')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('legacy dashboard URLs redirect, while unknown and prototype-named URLs stay 404', async ({
	request
}) => {
	for (const [path, target] of [
		['dashboard', '/admin'],
		['dashboard/profile', '/admin/settings'],
		['dashboard/listings', '/admin/listings'],
		['dashboard/listings/new', '/admin/listings/new'],
		['dashboard/messages', '/admin/conversations'],
		['dashboard/favorites', '/admin'],
		['dashboard/reviews', '/admin'],
		['dashboard/change-password', '/admin/settings']
	]) {
		const response = await request.get('/' + path, { maxRedirects: 0 });
		expect(response.status()).toBe(303);
		expect(response.headers().location).toBe(target);
	}
	for (const path of [
		'/not-a-real-route',
		'/constructor',
		'/__proto__',
		'/dashboard/unknown',
		'/dashboard.html'
	]) {
		expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(404);
	}
});

for (const route of ['/about', '/presentation/home2', '/presentation/home3', '/admin/login']) {
	test(`single skip target and main landmark at ${route}`, async ({ page }) => {
		for (const width of [390, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(route, { waitUntil: 'networkidle' });
			await expect(page.locator('main:visible')).toHaveCount(1);
			await expect(page.locator('#main-content')).toHaveCount(1);
			await expect(page.locator('#main-content')).toHaveAttribute('tabindex', '-1');
		}
	});
}

test('native calculator and financing accordions work without a DOM-repair adapter', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	for (const route of ['/calculator', '/financing']) {
		await page.setViewportSize({ width: route === '/calculator' ? 390 : 1440, height: 1000 });
		await page.goto(route, { waitUntil: 'networkidle' });
		const trigger = page.locator('.flat-accordion button[aria-expanded="false"]').first();
		await trigger.click();
		await expect(page.locator('.flat-accordion button[aria-expanded="true"]')).toHaveCount(1);
	}
});

test('production inventory preserves the inspected search action and listing gutters', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	for (const previous of [null, '/', '/favorites', '/inventory/map']) {
		if (previous) await page.goto(previous, { waitUntil: 'networkidle' });
		await page.goto('/inventory', { waitUntil: 'networkidle' });
		const action = page.locator('.inventory-hero .daynight-inventory-searchbar__submit');
		await expect(action).toHaveCSS('width', '44px');
		await expect(action).toHaveCSS('height', '44px');
		await expect(action).toHaveCSS('background-color', 'rgb(23, 27, 30)');
		await expect
			.poll(async () => (await page.locator('.daynight-inventory-listings-shell').boundingBox())?.x)
			.toBe(56);
	}
});
