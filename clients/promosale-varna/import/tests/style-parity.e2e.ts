import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test('desktop navigation is centered and its dropdown aligns with the complete item', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	for (const width of [1280, 1440, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		const nav = await page.locator('.site-header__nav').boundingBox();
		const header = await page.locator('.site-header__inner').boundingBox();
		expect(Math.abs(nav!.x + nav!.width / 2 - header!.x - header!.width / 2)).toBeLessThan(2);
	}
	await page.setViewportSize({ width: 1440, height: 1000 });
	const item = page
		.locator('.site-nav-item')
		.filter({ has: page.locator('a[href="/bg/services"]') });
	await item.getByRole('button').click();
	const popover = page.locator('.site-nav-popover');
	await expect(popover).toBeVisible();
	expect(Math.abs((await popover.boundingBox())!.x - (await item.boundingBox())!.x)).toBeLessThan(
		2
	);
	await page.keyboard.press('Escape');
});

test('image banners do not underline their titles or action copy', async ({ page }) => {
	await visit(page, '/');
	const banners = page.locator('.daynight-action-card');
	expect(await banners.count()).toBeGreaterThan(0);
	expect(
		await banners.evaluateAll((nodes) =>
			nodes.every((n) => getComputedStyle(n).textDecorationLine === 'none')
		)
	).toBe(true);
});

test('desktop catalogue keeps a prominent filter action and six readable quick pills', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	await expect(page.locator('.inventory-toolbar__all')).toHaveClass(/strong/);
	const triggers = page.locator('.inventory-toolbar__filters .site-filter-trigger');
	await expect(triggers).toHaveCount(6);
	expect(
		await triggers.first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
	).toBeGreaterThanOrEqual(18);
	expect((await triggers.first().boundingBox())!.height).toBeGreaterThanOrEqual(48);
	await triggers.first().click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
});

test('conversion forms precede the horizontal process instead of a split column layout', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	for (const route of ['/import', '/sell-your-car']) {
		await visit(page, route);
		const form = await page.locator('.service-intake').boundingBox();
		const process = await page.locator('.service-process').boundingBox();
		expect(form!.y + form!.height).toBeLessThan(process!.y);
		await expect(page.locator('.service-process .process-steps--horizontal')).toBeVisible();
	}
});

test('about and services retain centered media sections at desktop and mobile widths', async ({
	page
}, info) => {
	await visit(page, '/about');
	await expect(page.locator('.about-team article')).toHaveCount(3);
	expect(
		await page
			.locator('.about-heading')
			.first()
			.evaluate((node) => getComputedStyle(node).textAlign)
	).toBe('center');
	await visit(page, '/services');
	await expect(page.locator('.service-card')).toHaveCount(6);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	if (info.project.name === 'desktop')
		expect(
			await page
				.locator('.services-grid')
				.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length)
		).toBe(3);
});
