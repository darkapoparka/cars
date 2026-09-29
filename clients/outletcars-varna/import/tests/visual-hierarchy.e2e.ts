import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('desktop section actions follow the content rather than competing with headings', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	const section = page.locator('section').filter({ has: page.locator('.home-vehicles') });
	const heading = await section.locator('h2').first().boundingBox();
	const grid = await section.locator('.home-vehicles').boundingBox();
	const action = section.locator('.home-section-action a');
	const box = await action.boundingBox();
	expect(heading && grid && box).toBeTruthy();
	expect(box!.y).toBeGreaterThanOrEqual(grid!.y + grid!.height);
	expect(Math.abs(box!.x + box!.width / 2 - (grid!.x + grid!.width / 2))).toBeLessThan(2);
	expect(await action.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(
		'rgba(0, 0, 0, 0)'
	);
	expect(await section.locator('.home-section-heading .site-action').count()).toBe(0);
});

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
