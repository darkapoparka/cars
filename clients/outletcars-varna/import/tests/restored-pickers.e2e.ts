import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('homepage makes and models use the retained modal picker, not native selects', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	const fields = page.locator('.home-hero__filters .hfp__field');
	await expect(fields).toHaveCount(4);
	await expect(page.locator('.home-hero__filters select')).toHaveCount(0);
	await fields.first().click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole('searchbox')).toBeFocused();
	await expect(dialog.locator('.hfp__chip img').first()).toBeVisible();
	const make = dialog.locator('.hfp__chip').filter({ hasText: 'BMW' });
	await make.click();
	await expect(make).toHaveAttribute('aria-pressed', 'true');
	await dialog.getByRole('button', { name: /^Готово/ }).click();
	await expect(fields.first()).toBeFocused();
	await fields.nth(1).click();
	await expect(dialog).toBeVisible();
	await dialog.getByRole('searchbox').fill('X5');
	await dialog.locator('.hfp__row').first().click();
	await dialog.getByRole('button', { name: /^Готово/ }).click();
	await expect(page.locator('.home-hero input[name="q"]')).toHaveCount(1);
	await fields.first().click();
	await dialog.getByRole('button', { name: 'Изчисти', exact: true }).click();
	await dialog.locator('.hfp__chip').filter({ hasText: 'Audi' }).click();
	await dialog.getByRole('button', { name: /^Готово/ }).click();
	await expect(page.locator('.home-hero input[name="q"]')).toHaveCount(0);
	await fields.nth(1).click();
	await expect(dialog.locator('.hfp__row').filter({ hasText: 'X5' })).toHaveCount(0);
	await page.keyboard.press('Escape');
	await expect(fields.nth(1)).toBeFocused();
	await page.locator('.home-hero').getByRole('button', { name: 'Търси', exact: true }).click();
	await expect(page.locator('.vehicle-search-dialog')).toBeVisible();
	await page
		.locator('.vehicle-search-dialog .site-dialog__footer')
		.getByRole('button', { name: /Покажи автомобили/ })
		.click();
	await expect(page).toHaveURL(
		(url) => url.pathname === '/bg/inventory' && url.searchParams.get('brand') === 'Audi'
	);
});

test('quick filters have a proper dialog with a fixed apply action and readable options', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory?view=3');
	const trigger = page.locator('.site-filter-trigger').filter({ hasText: 'Марка' });
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const row = dialog.locator('.filter-choice').first();
	expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(48);
	expect(
		await row.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
	).toBeGreaterThanOrEqual(18);
	await dialog.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		result.violations.map((item) => ({
			id: item.id,
			targets: item.nodes.map((node) => node.target)
		}))
	).toEqual([]);
	await dialog
		.locator('.site-dialog__footer')
		.getByRole('button', { name: 'Покажи автомобили', exact: true })
		.click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.getAll('brand').includes('BMW') && url.searchParams.get('view') === '3'
	);
});

test('restored homepage picker traps keyboard focus and remains usable at 768px', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await page.setViewportSize({ width: 768, height: 700 });
	await visit(page, '/');
	const trigger = page.locator('.home-hero__filters .hfp__field').first();
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const rect = (await dialog.boundingBox())!;
	expect(rect.x).toBeGreaterThanOrEqual(0);
	expect(rect.x + rect.width).toBeLessThanOrEqual(768);
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		result.violations.map((item) => ({
			id: item.id,
			targets: item.nodes.map((node) => node.target)
		}))
	).toEqual([]);
	await page.keyboard.press('Tab');
	expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
	await page.keyboard.press('Escape');
	await expect(trigger).toBeFocused();
});
