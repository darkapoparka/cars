import { expect, test } from '@playwright/test';
import { visit, controlHeight } from './helpers';

test('desktop navigation is centered and follows direct localized links by keyboard', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	for (const locale of ['bg', 'en']) {
		await visit(page, `/${locale}`);
		const nav = page.locator('.site-header__nav');
		await expect(nav.getByRole('link')).toHaveCount(5);
		await expect(nav.getByRole('button')).toHaveCount(0);
		for (const width of [1280, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			const navBounds = (await nav.boundingBox())!;
			const header = (await page.locator('.site-header__inner').boundingBox())!;
			expect(
				Math.abs(navBounds.x + navBounds.width / 2 - header.x - header.width / 2)
			).toBeLessThan(2);
		}
		const services = nav.getByRole('link', {
			name: locale === 'en' ? 'Services' : 'Услуги',
			exact: true
		});
		await services.focus();
		await services.press('Enter');
		await expect(page).toHaveURL((url) => url.pathname === `/${locale}/services`);
		await expect(services).toHaveAttribute('aria-current', 'page');
	}
});

test('image banners do not underline their titles or action copy', async ({ page }) => {
	await visit(page, '/');
	const banners = page.locator('.commerce-banner');
	expect(await banners.count()).toBeGreaterThan(0);
	expect(
		await banners.evaluateAll((nodes) =>
			nodes.every((n) => getComputedStyle(n).textDecorationLine === 'none')
		)
	).toBe(true);
});

test('desktop catalogue keeps an accessible filter action and five readable quick pills', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	const allFilters = page.getByRole('button', { name: 'Всички филтри', exact: true });
	await expect(allFilters).toBeVisible();
	expect((await allFilters.boundingBox())!.height).toBeGreaterThanOrEqual(
		await controlHeight(allFilters)
	);
	await allFilters.click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(allFilters).toBeFocused();
	const triggers = page.locator('.inventory-toolbar .site-filter-trigger');
	await expect(triggers).toHaveCount(5);
	expect(
		await triggers.first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
	).toBeGreaterThanOrEqual(16);
	expect((await triggers.first().boundingBox())!.height).toBeGreaterThanOrEqual(
		await controlHeight(triggers.first())
	);
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
		const form = await page
			.locator(route === '/import' ? '#desktop-import-intake' : '#desktop-sell-intake')
			.boundingBox();
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
	if (info.project.name === 'desktop') {
		for (const [width, columns] of [
			[768, 2],
			[1024, 4],
			[1440, 4]
		]) {
			await page.setViewportSize({ width, height: 1000 });
			expect(
				await page
					.locator('.services-grid')
					.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length)
			).toBe(columns);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
		}
	}
});
