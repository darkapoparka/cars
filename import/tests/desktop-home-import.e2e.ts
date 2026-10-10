import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile), 'Desktop Import entry.'));

for (const locale of ['bg', 'en']) {
	test(`${locale}: Home Import keeps the box stable and carries its listing into the remaining steps`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		const box = page.locator('.home-hero__box');
		const before = await box.boundingBox();
		await box.locator('#home-mode-import').click();
		await expect(box.locator('.desktop-import-entry')).toBeVisible();
		expect(await box.boundingBox()).toEqual(before);
		const input = box.locator('[name="vehicle"]');
		await box
			.getByRole('button', { name: locale === 'en' ? 'Continue' : 'Продължи', exact: true })
			.click();
		await expect(input).toBeFocused();
		await expect(box.getByRole('alert')).toBeVisible();
		await input.fill('https://example.com/car/123');
		await expect(box.locator('.desktop-import-entry fieldset')).toHaveCount(0);
		await input.press('Enter');
		await expect(page).toHaveURL((url) => url.pathname === `/${locale}`);
		const wizard = page.getByRole('dialog');
		await expect(wizard).toBeVisible();
		await expect(page.locator('.site-intro .bc-import-wizard')).toHaveCount(0);
		await wizard
			.getByRole('button', { name: locale === 'en' ? 'Back' : 'Назад', exact: true })
			.click();
		await expect(wizard.locator('[id^="import-wizard-vehicle-"]')).toHaveValue(
			'https://example.com/car/123'
		);
	});

	test(`${locale}: no-link mode retains its fields across tabs and opens sourcing details`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		const box = page.locator('.home-hero__box');
		await box.locator('#home-mode-import').click();
		await box.locator('.desktop-import-entry__toggle').click();
		await box.locator('[name="make"]').fill('BMW');
		await box.locator('[name="model"]').fill('X5');
		await box.locator('[name="bodyType"]').selectOption('SUV');
		await box.locator('#home-mode-buy').click();
		await box.locator('#home-mode-import').click();
		await expect(box.locator('[name="make"]')).toHaveValue('BMW');
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			result.violations.map((item) => ({
				id: item.id,
				targets: item.nodes.map((node) => node.target)
			}))
		).toEqual([]);
		await box
			.getByRole('button', { name: locale === 'en' ? 'Continue' : 'Продължи', exact: true })
			.click();
		await expect(page).toHaveURL((url) => url.pathname === `/${locale}`);
		const wizard = page.getByRole('dialog');
		await expect(wizard).toBeVisible();
		await wizard
			.getByRole('button', { name: locale === 'en' ? 'Back' : 'Назад', exact: true })
			.click();
		await expect(wizard.locator('[id^="import-wizard-make-"]')).toHaveValue('BMW');
		await expect(wizard.locator('[id^="import-wizard-model-"]')).toHaveValue('X5');
		await expect(wizard.locator('[id^="import-wizard-type-"]')).toHaveValue('SUV');
	});
}

test('new listing URLs never restore the previous car draft', async ({ page }) => {
	await visit(
		page,
		'/en/import?vehicle=https%3A%2F%2Fexample.com%2Fcar%2Fa&origin=DE&step=details'
	);
	await page
		.locator('.bc-import-wizard:visible')
		.getByRole('button', { name: 'Back', exact: true })
		.click();
	await page
		.locator('.desktop-import-entry [name="vehicle"]')
		.fill('https://example.com/car/old-draft');
	await page.locator('.desktop-import-entry [name="vehicle"]').blur();
	await visit(
		page,
		'/en/import?vehicle=https%3A%2F%2Fexample.com%2Fcar%2Fb&origin=DE&step=details'
	);
	await page
		.locator('.bc-import-wizard:visible')
		.getByRole('button', { name: 'Back', exact: true })
		.click();
	await expect(page.locator('.desktop-import-entry [name="vehicle"]')).toHaveValue(
		'https://example.com/car/b'
	);
});

test('native Home Import submissions retain criteria without JavaScript', async ({
	browser
}, info) => {
	const origin = info.project.use.baseURL as string;
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 1000 }
	});
	await context.addCookies([
		{ name: 'cars_prompt', value: 'v1', url: origin },
		{ name: 'cars_locale', value: 'en', url: origin }
	]);
	const page = await context.newPage();
	await page.goto(origin + '/en?intent=import');
	const form = page.locator('.home-hero__box form[action="/en/import"]');
	await expect(form).toBeVisible();
	await form.locator('[name="vehicle"]').fill('https://example.com/car/native');
	await form.locator('button[type="submit"]').click();
	await expect(page).toHaveURL(
		(url) =>
			url.pathname === '/en/import' &&
			url.searchParams.get('vehicle') === 'https://example.com/car/native' &&
			url.searchParams.get('intent') === 'listing' &&
			url.searchParams.get('step') === 'details'
	);
	await context.close();
});
