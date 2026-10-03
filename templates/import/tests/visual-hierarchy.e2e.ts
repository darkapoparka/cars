import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('desktop browse cards finish the Home grids and follow native destinations', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	for (const width of [768, 1024, 1440, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		for (const selector of ['.home-vehicles', '.home-reviews', '.home-news']) {
			const grid = page.locator(selector);
			const card = grid.getByRole('link').last();
			await expect(card).toBeVisible();
			const bounds = await grid.boundingBox();
			const box = await card.boundingBox();
			expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
			expect(box!.y + box!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
			expect(box!.height).toBeGreaterThan(100);
			await card.focus();
			await expect(card).toBeFocused();
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	await expect(page.locator('.home-section-heading .site-action')).toHaveCount(0);
	await expect(page.locator('.home-section-action')).toHaveCount(0);
	for (const [selector, path] of [
		['.home-vehicles', 'inventory'],
		['.home-reviews', 'reviews'],
		['.home-news', 'blog']
	]) {
		await page.locator(selector).getByRole('link').last().press('Enter');
		await expect(page).toHaveURL(new RegExp(`/bg/${path}$`));
		await page.goBack();
		await expect(page.locator(selector)).toBeVisible();
	}
});

for (const locale of ['bg', 'en']) {
	test(`${locale}: Home browse cards work without JavaScript`, async ({
		browser,
		baseURL
	}, info) => {
		test.skip(info.project.name !== 'desktop');
		const context = await browser.newContext({
			javaScriptEnabled: false,
			viewport: { width: 1440, height: 1000 }
		});
		try {
			const page = await context.newPage();
			for (const [selector, destination] of [
				['.home-vehicles', 'inventory'],
				['.home-reviews', 'reviews'],
				['.home-news', 'blog']
			]) {
				await page.goto(`${baseURL}/${locale}`);
				await page.locator(selector).getByRole('link').last().click();
				await expect(page).toHaveURL((url) => url.pathname === `/${locale}/${destination}`);
				if (locale === 'en') expect(new URL(page.url()).searchParams.get('lang')).toBe('en');
			}
		} finally {
			await context.close();
		}
	});
}

test('desktop detail restores a title above the gallery and operable payment tabs', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	await page.locator('.site-vehicle-card__media a').first().click();
	await expect(page).toHaveURL((url) => /^\/bg\/inventory\/[^/]+$/.test(url.pathname));
	await expect(page.locator('.detail-heading h1')).toBeVisible();
	await expect(page.locator('main h1')).toHaveCount(1);
	const heading = await page.locator('.detail-heading h1').boundingBox();
	const gallery = await page.locator('.gallery').boundingBox();
	expect(heading!.y + heading!.height).toBeLessThan(gallery!.y);
	await expect(page.locator('.vehicle-facts')).toBeVisible();
	await page.getByRole('tab', { name: 'Финансиране', exact: true }).click();
	await expect(page.getByRole('tabpanel', { name: 'Финансиране' })).toBeVisible();
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))
	).toEqual([]);
	await page.keyboard.press('ArrowLeft');
	await expect(page.getByRole('tab', { name: 'В брой', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await page.getByRole('button', { name: 'Запитване за автомобила', exact: true }).click();
	await expect(page.getByRole('dialog').locator('form')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('desktop detail sidebar remains within the viewport at supported widths', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	for (const width of [768, 1024, 1440, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		await visit(page, '/inventory');
		await page.locator('.site-vehicle-card__media a').first().click();
		await expect(page.locator('.purchase-panel')).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
});
