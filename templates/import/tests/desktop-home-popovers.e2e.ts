import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile)));

test('quick-filter drafts apply with Done and cancel with Escape or outside click', async ({
	page
}) => {
	await visit(page, '/bg');
	const fields = page.locator('.home-hero__filters');
	const make = fields.getByRole('button', { name: 'Марка: Всички марки', exact: true });
	const search = page
		.locator('.home-hero__search')
		.getByRole('link', { name: 'Търси', exact: true });
	await make.click();
	const menu = page.getByRole('dialog', { name: 'Избери марка', exact: true });
	await expect(menu.getByRole('searchbox')).toBeFocused();
	await expect(page.locator('.site-dialog-backdrop')).toHaveCount(0);
	const triggerBounds = await make.boundingBox();
	const menuBounds = await menu.boundingBox();
	expect(menuBounds!.y).toBeGreaterThanOrEqual(triggerBounds!.y + triggerBounds!.height);
	expect(menuBounds!.width).toBeLessThanOrEqual(360);
	await menu.getByRole('button', { name: /^BMW\s/ }).click();
	await expect(search).toHaveAttribute('href', '/bg/inventory');
	await page.keyboard.press('Escape');
	await expect(menu).not.toBeVisible();
	await expect(make).toBeFocused();
	await make.click();
	await expect(menu.getByRole('button', { name: /^BMW\s/ })).toHaveAttribute(
		'aria-pressed',
		'false'
	);
	await menu.getByRole('button', { name: /^BMW\s/ }).click();
	await page.getByRole('heading', { name: 'Купи автомобил', exact: true }).click();
	await expect(menu).not.toBeVisible();
	await expect(search).toHaveAttribute('href', '/bg/inventory');
	await make.click();
	await menu.getByRole('button', { name: /^BMW\s/ }).click();
	await menu.getByRole('button', { name: 'Готово', exact: true }).click();
	await expect(fields.getByRole('button', { name: 'Марка: BMW', exact: true })).toBeFocused();
	await expect(search).toHaveAttribute('href', '/bg/inventory?brand=BMW');
	await fields.getByRole('button', { name: 'Марка: BMW', exact: true }).click();
	await menu.getByRole('button', { name: 'Изчисти', exact: true }).click();
	await expect(search).toHaveAttribute('href', '/bg/inventory?brand=BMW');
	await menu.getByRole('button', { name: 'Готово', exact: true }).click();
	await expect(search).toHaveAttribute('href', '/bg/inventory');
});

test('applied make, dependent model and maximum price retain the native inventory query', async ({
	page
}) => {
	await visit(page, '/en');
	const fields = page.locator('.home-hero__filters');
	await fields.getByRole('button', { name: /^Make:/ }).click();
	let menu = page.getByRole('dialog', { name: 'Choose make', exact: true });
	await menu.getByRole('button', { name: /^BMW\s/ }).click();
	await menu.getByRole('button', { name: 'Done', exact: true }).click();
	await fields.getByRole('button', { name: /^Model:/ }).click();
	menu = page.getByRole('dialog', { name: 'Choose model', exact: true });
	await menu.getByRole('searchbox').fill('X3');
	await menu.getByRole('button', { name: /^X3(?:\s|$)/ }).click();
	await menu.getByRole('button', { name: 'Done', exact: true }).click();
	await expect(fields.getByRole('button', { name: /^Model:/ })).toContainText('X3');
	await fields.getByRole('button', { name: /^Price:/ }).click();
	menu = page.getByRole('dialog', { name: 'Price', exact: true });
	await menu.getByRole('button', { name: '30 000 EUR', exact: true }).click();
	await expect(menu).toBeVisible();
	await menu.getByRole('button', { name: 'Done', exact: true }).click();
	const destination = new URL(
		(await page.locator('.home-hero__search a').getAttribute('href'))!,
		'http://local'
	);
	expect(destination.pathname).toBe('/en/inventory');
	expect(destination.searchParams.get('brand')).toBe('BMW');
	expect(destination.searchParams.get('q')).toContain('X3');
	expect(destination.searchParams.get('maxPrice')).toBe('30 000 EUR');
	expect(destination.searchParams.get('lang')).toBe('en');
	await fields.getByRole('button', { name: /^Make:/ }).click();
	menu = page.getByRole('dialog', { name: 'Choose make', exact: true });
	await menu.getByRole('button', { name: 'Clear', exact: true }).click();
	await menu.getByRole('button', { name: /^Mercedes\s/ }).click();
	await menu.getByRole('button', { name: 'Done', exact: true }).click();
	await expect(fields.getByRole('button', { name: /^Model:/ })).not.toContainText('X3');
	const changedDestination = new URL(
		(await page.locator('.home-hero__search a').getAttribute('href'))!,
		'http://local'
	);
	expect(changedDestination.searchParams.get('q')).toBeNull();
});

test('quick menus stay inside desktop viewports, switch mutually, and close below the mobile breakpoint', async ({
	page
}) => {
	for (const locale of ['bg', 'en']) {
		await visit(page, '/' + locale);
		const fields = page.locator('.home-hero__filters').getByRole('button');
		for (const width of [768, 1024, 1440, 1920]) {
			await page.setViewportSize({ width, height: 700 });
			for (let index = 0; index < 4; index++) {
				await fields.nth(index).click();
				const menu = page.locator('.desktop-home-filter__menu');
				await expect(menu).toHaveCount(1);
				const bounds = await menu.boundingBox();
				expect(bounds!.x).toBeGreaterThanOrEqual(0);
				expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
				expect(bounds!.y).toBeGreaterThanOrEqual(0);
				expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(700);
				await expect(
					menu.getByRole('button', { name: locale === 'en' ? 'Done' : 'Готово', exact: true })
				).toBeInViewport();
			}
			await page.keyboard.press('Escape');
			await expect(fields.nth(3)).toBeFocused();
		}
		await fields.first().click();
		await page.setViewportSize({ width: 390, height: 844 });
		await expect(page.locator('.desktop-home-filter__menu')).toHaveCount(0);
		await expect(page.locator('.home-mobile-entry')).toBeVisible();
		await page.setViewportSize({ width: 1440, height: 1000 });
	}
});

test('the make menu remains accessible while the larger keyword search retains its modal', async ({
	page
}) => {
	await visit(page, '/bg');
	await page.locator('.home-hero__filters').getByRole('button').first().click();
	const menu = page.getByRole('dialog', { name: 'Избери марка', exact: true });
	await menu.getByRole('searchbox').fill('no-such-make');
	await expect(menu.getByRole('status')).toBeVisible();
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		results.violations.map((violation) => ({
			id: violation.id,
			targets: violation.nodes.map((node) => node.target)
		}))
	).toEqual([]);
	await page.keyboard.press('Escape');
	await page.locator('#home-query').click();
	await expect(page.locator('.vehicle-search-dialog')).toBeVisible();
	await expect(page.locator('.site-dialog-backdrop')).toBeVisible();
});
