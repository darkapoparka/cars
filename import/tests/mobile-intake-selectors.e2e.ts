import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile intake selectors');

const labels = {
	en: {
		find: 'Find a car',
		manual: 'No VIN?',
		describe: 'Describe the car',
		make: 'Make',
		model: 'Model',
		country: 'Purchase market',
		selectMake: 'Select make',
		selectModel: 'Select model',
		makeFirst: 'Choose a make first',
		searchMake: 'Search or enter a make',
		searchModel: 'Search or enter a model',
		china: 'China',
		germany: 'Germany',
		back: 'Back',
		close: 'Close',
		use: 'Use',
		continue: 'Continue'
	},
	bg: {
		find: 'Нямам линк',
		manual: 'Без VIN?',
		describe: 'Опиши автомобила',
		make: 'Марка',
		model: 'Модел',
		country: 'Пазар за покупка',
		selectMake: 'Избери марка',
		selectModel: 'Избери модел',
		makeFirst: 'Първо избери марка',
		searchMake: 'Потърси или въведи марка',
		searchModel: 'Потърси или въведи модел',
		china: 'Китай',
		germany: 'Германия',
		back: 'Назад',
		close: 'Затвори',
		use: 'Използвай',
		continue: 'Продължи'
	}
} as const;

for (const locale of ['en', 'bg'] as const) {
	for (const width of [320, 390]) {
		const copy = labels[locale];
		test(`${locale} Import selectors retain country, values and Back at ${width}px`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height: 568 });
			await visit(page, `/${locale}/import?lang=${locale}&origin=CN`);
			await page.getByRole('tab', { name: copy.find, exact: true }).click();
			await page.getByRole('button', { name: copy.describe, exact: true }).click();
			const dialog = page.getByRole('dialog');
			const make = dialog.getByRole('button', {
				name: `${copy.make}: ${copy.selectMake}`,
				exact: true
			});
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: ${copy.makeFirst}`, exact: true })
			).toBeDisabled();
			await expect(
				dialog.getByRole('button', { name: `${copy.country}: ${copy.china}`, exact: true })
			).toBeVisible();
			await make.click();
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(
				dialog.getByRole('heading', { name: copy.selectMake, exact: true })
			).toBeFocused();
			await expect(dialog.getByRole('searchbox')).not.toBeFocused();
			await dialog.getByRole('searchbox', { name: copy.searchMake, exact: true }).fill('bmw');
			await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
			await expect(
				dialog.getByRole('button', { name: `${copy.make}: BMW`, exact: true })
			).toBeFocused();
			await dialog
				.getByRole('button', { name: `${copy.model}: ${copy.selectModel}`, exact: true })
				.click();
			await expect(dialog.getByRole('button', { name: 'X5', exact: true })).toBeVisible();
			await dialog.getByRole('searchbox', { name: copy.searchModel, exact: true }).fill('X5');
			await dialog.getByRole('button', { name: 'X5', exact: true }).click();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: X5`, exact: true })
			).toBeFocused();
			const country = dialog.getByRole('button', {
				name: `${copy.country}: ${copy.china}`,
				exact: true
			});
			await page.setViewportSize({ width, height: 448 });
			const body = dialog.locator('.bc-import-wizard__body');
			await body.evaluate((node) => node.scrollTo({ top: 100, behavior: 'instant' }));
			const previousScroll = await body.evaluate((node) => node.scrollTop);
			await country.click();
			await expect(dialog.getByRole('button', { name: copy.china, exact: true })).toHaveAttribute(
				'aria-pressed',
				'true'
			);
			await page.goBack();
			await expect(country).toBeFocused();
			expect(await body.evaluate((node) => node.scrollTop)).toBe(previousScroll);
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: X5`, exact: true })
			).toBeVisible();
			await country.click();
			await dialog.getByRole('button', { name: copy.germany, exact: true }).click();
			await expect(
				dialog.getByRole('button', { name: `${copy.country}: ${copy.germany}`, exact: true })
			).toBeFocused();
			await page.setViewportSize({ width, height: 568 });
			await dialog.getByRole('button', { name: `${copy.make}: BMW`, exact: true }).click();
			await dialog.getByRole('button', { name: 'Audi', exact: true }).click();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: ${copy.selectModel}`, exact: true })
			).toBeVisible();
			await dialog
				.getByRole('button', { name: `${copy.model}: ${copy.selectModel}`, exact: true })
				.click();
			await dialog.getByRole('searchbox').fill('Custom model for QA');
			await dialog
				.getByRole('button', { name: `${copy.use} “Custom model for QA”`, exact: true })
				.click();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: Custom model for QA`, exact: true })
			).toBeVisible();
			await expect(
				dialog.getByRole('button', { name: copy.continue, exact: true })
			).toBeInViewport();
			expect(await dialog.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(false);
			await dialog.getByRole('button', { name: copy.continue, exact: true }).click();
			await dialog.getByRole('button', { name: copy.back, exact: true }).click();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: Custom model for QA`, exact: true })
			).toBeVisible();
			await dialog.getByRole('button', { name: copy.close, exact: true }).click();
			await expect(dialog).not.toBeVisible();
		});

		test(`${locale} Sell selectors accept a custom car without stacked dialogs at ${width}px`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height: 568 });
			await visit(page, `/${locale}/sell-your-car?lang=${locale}`);
			await page.getByRole('tab', { name: copy.manual, exact: true }).click();
			await page.getByRole('button', { name: copy.describe, exact: true }).click();
			const dialog = page.getByRole('dialog');
			await dialog
				.getByRole('button', { name: `${copy.make}: ${copy.selectMake}`, exact: true })
				.click();
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await dialog.getByRole('searchbox').fill('Custom make for QA');
			await dialog
				.getByRole('button', { name: `${copy.use} “Custom make for QA”`, exact: true })
				.click();
			await dialog
				.getByRole('button', { name: `${copy.model}: ${copy.selectModel}`, exact: true })
				.click();
			await dialog.getByRole('searchbox').fill('Custom model for QA');
			await dialog
				.getByRole('button', { name: `${copy.use} “Custom model for QA”`, exact: true })
				.click();
			const make = dialog.getByRole('button', {
				name: `${copy.make}: Custom make for QA`,
				exact: true
			});
			await make.click();
			await page.keyboard.press('Escape');
			await expect(make).toBeFocused();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: Custom model for QA`, exact: true })
			).toBeVisible();
			await expect(
				dialog.getByRole('button', { name: copy.continue, exact: true })
			).toBeInViewport();
			const violations = await new AxeBuilder({ page })
				.include('[role="dialog"]')
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(violations.violations).toEqual([]);
			await make.click();
			const pickerViolations = await new AxeBuilder({ page })
				.include('[role="dialog"]')
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(pickerViolations.violations).toEqual([]);
			await dialog.getByRole('button', { name: copy.back, exact: true }).click();
			await dialog.getByRole('button', { name: copy.continue, exact: true }).click();
			await dialog.getByRole('button', { name: copy.back, exact: true }).click();
			await expect(make).toBeVisible();
			await expect(
				dialog.getByRole('button', { name: `${copy.model}: Custom model for QA`, exact: true })
			).toBeVisible();
		});
	}
}
