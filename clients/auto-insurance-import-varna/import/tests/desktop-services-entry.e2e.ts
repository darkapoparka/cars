import { expect, test, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile), 'Desktop service entry.'));

async function expectInsetAction(entry: Locator) {
	const row = await entry.locator('.desktop-import-entry__row').boundingBox();
	const action = await entry.locator('[data-intake-next]').boundingBox();
	expect(row).not.toBeNull();
	expect(action).not.toBeNull();
	expect(row!.height).toBe(52);
	expect(action!.height).toBe(36);
	expect(action!.x).toBeGreaterThanOrEqual(row!.x + 4);
	expect(action!.x + action!.width).toBeLessThanOrEqual(row!.x + row!.width - 4);
	expect(action!.y).toBeGreaterThanOrEqual(row!.y + 4);
	expect(action!.y + action!.height).toBeLessThanOrEqual(row!.y + row!.height - 4);
}

for (const locale of ['bg', 'en']) {
	test(`${locale}: typing an import search keeps the service search input and its focus`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const finder = page.locator('.desktop-service-finder');
		const search = page.locator('.service-catalogue-search').getByRole('searchbox');
		await search.fill(locale === 'en' ? 'import' : 'внос');
		await expect(search).toBeVisible();
		await expect(search).toBeFocused();
		await expect(page.locator('.service-card')).toHaveCount(2);
		await finder.locator('#desktop-service-mode-import').click();
		await expect(finder.locator('.desktop-import-entry')).toBeVisible();
	});
	test(`${locale}: Services Import keeps the entry in place and carries the listing without a country`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const finder = page.locator('.desktop-service-finder');
		const before = await finder.locator('.service-entry-row').boundingBox();
		const panel = await finder.boundingBox();
		await finder.locator('#desktop-service-mode-import').click();
		const entry = finder.locator('.desktop-import-entry');
		await expect(entry).toBeVisible();
		expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
		expect(await finder.boundingBox()).toEqual(panel);
		await expectInsetAction(entry);
		await entry.locator('[data-intake-next]').click();
		await expect(entry.getByRole('alert')).toBeVisible();
		expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
		expect(await finder.boundingBox()).toEqual(panel);
		await entry.locator('[name=vehicle]').fill('https://example.com/car/from-services');
		await expect(entry.locator('.desktop-import-entry__choices')).toHaveCount(0);
		await expect(entry.locator('[name=origin]')).toHaveValue('');
		await entry.locator('[name=vehicle]').press('Enter');
		await expect(page).toHaveURL((url) => url.pathname === `/${locale}/services`);
		const wizard = page.getByRole('dialog');
		await expect(wizard).toBeVisible();
		await wizard
			.getByRole('button', { name: locale === 'en' ? 'Back' : 'Назад', exact: true })
			.click();
		await expect(wizard.locator('[id^="import-wizard-vehicle-"]')).toHaveValue(
			'https://example.com/car/from-services'
		);
		await expect(
			wizard.getByRole('button', { name: locale === 'en' ? 'All' : 'Всички', exact: true })
		).toHaveAttribute('aria-pressed', 'true');
	});

	test(`${locale}: Services sourcing retains its brief across categories with no field movement`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const finder = page.locator('.desktop-service-finder');
		await finder.locator('#desktop-service-mode-import').click();
		const entry = finder.locator('.desktop-import-entry');
		const before = await entry.locator('.desktop-import-entry__row').boundingBox();
		await entry
			.getByText(locale === 'en' ? 'No listing link' : 'Нямам линк', { exact: true })
			.click();
		expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
		await entry.locator('[data-intake-next]').click();
		await expect(entry.getByRole('alert')).toHaveText(
			locale === 'en' ? 'Enter a make or model.' : 'Въведи марка или модел.'
		);
		await entry.locator('[name=make]').fill('BMW');
		await entry.locator('[name=model]').fill('X5');
		await entry.locator('[name=bodyType]').selectOption('SUV');
		await finder.locator('#desktop-service-mode-check').click();
		await expect(finder.locator('.service-entry-row')).toBeVisible();
		await finder.locator('#desktop-service-mode-import').click();
		await expect(entry.locator('[name=make]')).toHaveValue('BMW');
		await expect(entry.locator('[name=model]')).toHaveValue('X5');
		await expect(entry.locator('[name=bodyType]')).toHaveValue('SUV');
		await expect(entry.locator('[name=origin]')).toHaveValue('');
		await expectInsetAction(entry);
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))
		).toEqual([]);
		await entry.locator('[data-intake-next]').click();
		await expect(page).toHaveURL((url) => url.pathname === `/${locale}/services`);
		const wizard = page.getByRole('dialog');
		await expect(wizard).toBeVisible();
		await wizard
			.getByRole('button', { name: locale === 'en' ? 'Back' : 'Назад', exact: true })
			.click();
		await expect(wizard.locator('[id^="import-wizard-make-"]')).toHaveValue('BMW');
		await expect(wizard.locator('[id^="import-wizard-model-"]')).toHaveValue('X5');
		await expect(wizard.locator('[id^="import-wizard-type-"]')).toHaveValue('SUV');
	});

	test(`${locale}: Services entry keeps its compact action and has no country controls`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services?service=import`);
		const finder = page.locator('.desktop-service-finder');
		const entry = finder.locator('.desktop-import-entry');
		const check = finder.locator('#desktop-service-mode-check');
		for (const width of [768, 1024, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			await check.hover();
			const bounds = await check.boundingBox();
			const label = await check.locator('.mode-tab-label').boundingBox();
			expect(label!.x).toBeGreaterThanOrEqual(bounds!.x);
			expect(label!.x + label!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
			expect(await check.innerText()).toBe(locale === 'en' ? 'Check' : 'Проверка');
			const row = await entry.locator('.desktop-import-entry__row').boundingBox();
			await expect(
				entry.locator('.desktop-import-entry__choices, .desktop-country-select')
			).toHaveCount(0);
			await expectInsetAction(entry);
			const utility = await entry.locator('.desktop-import-entry__toggle').boundingBox();
			expect(utility!.y).toBeGreaterThanOrEqual(row!.y + row!.height);
			const pills = await finder.locator('.service-modes').boundingBox();
			expect(pills!.y + pills!.height).toBeLessThanOrEqual(row!.y);
			expect(utility!.x + utility!.width / 2).toBeCloseTo(row!.x + row!.width / 2, 0);
			await entry
				.getByText(locale === 'en' ? 'No listing link' : 'Нямам линк', { exact: true })
				.click();
			await expect(
				entry.locator('.desktop-import-entry__choices, .desktop-country-select')
			).toHaveCount(0);
			expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(row);
			await entry
				.getByText(locale === 'en' ? 'I have a link' : 'Имам линк', { exact: true })
				.click();
		}
	});

	test(`${locale}: Home input remains anchored through Import, no-link and Sell at desktop widths`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		const home = page.locator('.home-hero__box');
		for (const width of [768, 1024, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			await home.locator('#home-mode-buy').click();
			const before = await home.locator('.desktop-search-control').boundingBox();
			const panel = await home.boundingBox();
			await home.locator('#home-mode-import').click();
			const entry = home.locator('.desktop-import-entry');
			expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
			expect(await home.boundingBox()).toEqual(panel);
			await expect(entry.locator('fieldset')).toHaveCount(0);
			await expectInsetAction(entry);
			await entry.locator('.desktop-import-entry__toggle').click();
			expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
			await entry.locator('[data-intake-next]').click();
			expect(await entry.locator('.desktop-import-entry__row').boundingBox()).toEqual(before);
			expect(await home.boundingBox()).toEqual(panel);
			await entry.locator('.desktop-import-entry__toggle').click();
			await home.locator('#home-mode-sell').click();
			expect(await home.locator('.home-hero__intent-row').boundingBox()).toEqual(before);
			await expect(home.locator('.home-hero__intent-row button')).toHaveCSS('min-height', '36px');
			expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
				false
			);
		}
	});
}
