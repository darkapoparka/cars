import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile), 'Desktop Import hero layout.'));

for (const locale of ['bg', 'en']) {
	test(`${locale}: Import keeps entry state when moving between hero and detailed steps`, async ({
		page
	}) => {
		const english = locale === 'en';
		const nextLabel = english ? 'Continue' : 'Продължи';
		const backLabel = english ? 'Back' : 'Назад';
		await visit(page, `/${locale}/import`);
		const hero = page.locator('.site-intro .bc-import-wizard');
		const details = page.locator('.service-intake .bc-import-wizard');
		const next = () =>
			page
				.locator('.bc-import-wizard:visible')
				.getByRole('button', { name: nextLabel, exact: true });
		await expect(hero).toBeVisible();
		await expect(details).toHaveCount(0);
		await next().click();
		await expect(hero.getByRole('alert')).toBeVisible();
		await expect(hero.locator('[id^="import-wizard-vehicle-"]')).toBeFocused();
		await hero
			.locator('[id^="import-wizard-vehicle-"]')
			.fill('https://listing.example.invalid/synthetic');
		await hero.getByRole('button', { name: english ? 'Germany' : 'Германия', exact: true }).click();
		await next().click();
		await expect(hero).toHaveCount(0);
		await expect(details.locator('[id^="import-wizard-year-"]')).toBeFocused();
		await details.locator('[id^="import-wizard-year-"]').fill('2020');
		await details.locator('[id^="import-wizard-budget-"]').fill('40000');
		await details.getByRole('button', { name: backLabel, exact: true }).click();
		await expect(hero.locator('[id^="import-wizard-vehicle-"]')).toHaveValue(
			'https://listing.example.invalid/synthetic'
		);
		await expect(hero.locator('[id^="import-wizard-vehicle-"]')).toBeFocused();
		await expect(
			hero.getByRole('button', { name: english ? 'Germany' : 'Германия', exact: true })
		).toHaveAttribute('aria-pressed', 'true');
		await page.reload();
		await expect(hero.locator('[id^="import-wizard-vehicle-"]')).toHaveValue(
			'https://listing.example.invalid/synthetic'
		);
		await next().click();
		await expect(details.locator('[id^="import-wizard-budget-"]')).toHaveValue('40000');
		await expect(details.locator('[id^="import-wizard-year-"]')).toHaveValue('2020');
		await page.locator('#desktop-import-mode-source').click();
		await expect(hero).toBeVisible();
		await hero.locator('[id^="import-wizard-make-"]').fill('BMW');
		await hero.locator('[id^="import-wizard-model-"]').fill('X5');
		await hero.locator('[id^="import-wizard-type-"]').selectOption('SUV');
		await hero.getByRole('button', { name: english ? 'Japan' : 'Япония', exact: true }).click();
		await next().click();
		await expect(details).toBeVisible();
		await details.getByRole('button', { name: backLabel, exact: true }).click();
		await expect(hero.locator('[id^="import-wizard-make-"]')).toHaveValue('BMW');
		await expect(hero.locator('[id^="import-wizard-model-"]')).toHaveValue('X5');
		await expect(hero.locator('[id^="import-wizard-type-"]')).toHaveValue('SUV');
		await expect(
			hero.getByRole('button', { name: english ? 'Japan' : 'Япония', exact: true })
		).toHaveAttribute('aria-pressed', 'true');
	});
}
