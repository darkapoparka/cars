import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit, controlHeight } from './helpers';
import { promptVersion } from './locale-fixture';

const copy = {
	en: {
		brand: 'Brand',
		make: 'Make',
		model: 'Model',
		price: 'Price',
		body: 'Body type',
		selectMake: 'Select make',
		selectModel: 'Select model',
		makeFirst: 'Choose a make first',
		find: 'Find a car',
		back: 'Back',
		clear: 'Clear',
		save: 'Save draft',
		manual: 'Enter manually',
		use: 'Use',
		saved: 'Draft saved.',
		failed: 'Could not save. Try again.'
	},
	bg: {
		brand: 'Марка',
		make: 'Марка',
		model: 'Модел',
		price: 'Цена',
		body: 'Тип купе',
		selectMake: 'Избери марка',
		selectModel: 'Избери модел',
		makeFirst: 'Първо избери марка',
		find: 'Намери автомобил',
		back: 'Назад',
		clear: 'Изчисти',
		save: 'Чернова',
		manual: 'Въведи ръчно',
		use: 'Използвай',
		saved: 'Черновата е запазена.',
		failed: 'Неуспешно запазване. Опитай отново.'
	}
} as const;

for (const locale of ['en', 'bg'] as const) {
	for (const width of [320, 390]) {
		for (const surface of ['home', 'cars'] as const) {
			test(`${locale} ${surface} search selectors retain drafts and URL context at ${width}px`, async ({
				page,
				isMobile
			}) => {
				test.skip(!isMobile, 'Mobile search composition');
				await page.setViewportSize({ width, height: 568 });
				const route = `/${locale}${surface === 'home' ? '' : '/inventory'}?lang=${locale}&sort=highest&context=one&context=two&view=3&minMileage=12000&page=3`;
				await visit(page, route);
				const opener = page.locator(
					surface === 'home'
						? '.mobile-search-control__label'
						: '.daynight-inventory-mobile__search-field'
				);
				await opener.click();
				const dialog = page.getByRole('dialog');
				await expect(dialog).toHaveCount(1);
				await expect(dialog).toHaveAccessibleName(copy[locale].find);
				await expect(dialog.getByRole('searchbox')).toBeFocused();
				await dialog.getByRole('searchbox').fill('Shadow');
				await dialog
					.getByRole('button', {
						name: `${copy[locale].brand}: ${copy[locale].selectMake}`,
						exact: true
					})
					.click();
				await expect(dialog).toHaveCount(1);
				await expect(
					dialog.getByRole('heading', { name: copy[locale].brand, exact: true })
				).toBeFocused();
				await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
				await expect(
					dialog.getByRole('button', { name: `${copy[locale].brand}: BMW`, exact: true })
				).toBeFocused();
				await expect(dialog.getByRole('searchbox')).toHaveValue('Shadow');
				await dialog
					.getByRole('button', {
						name: `${copy[locale].model}: ${copy[locale].selectModel}`,
						exact: true
					})
					.click();
				await dialog.getByRole('searchbox').fill('X5');
				await dialog.getByRole('button', { name: 'X5', exact: true }).click();
				await expect(
					dialog.getByRole('button', { name: `${copy[locale].model}: X5`, exact: true })
				).toBeFocused();
				await dialog.getByRole('button', { name: new RegExp(`^${copy[locale].price}:`) }).click();
				await page.goBack();
				await expect(dialog).toHaveAccessibleName(copy[locale].find);
				await expect(
					dialog.getByRole('button', { name: new RegExp(`^${copy[locale].price}:`) })
				).toBeFocused();
				await dialog.getByRole('button', { name: new RegExp(`^${copy[locale].body}:`) }).click();
				await page.keyboard.press('Escape');
				await expect(dialog).toHaveAccessibleName(copy[locale].find);
				await expect(dialog.getByRole('searchbox')).toHaveValue('Shadow');
				await page.setViewportSize({ width, height: 360 });
				const action = dialog.locator('button[type="submit"]');
				await expect(action).toBeInViewport({ ratio: 1 });
				await expect(
					dialog.getByRole('button', { name: copy[locale].clear, exact: true })
				).toBeInViewport({ ratio: 1 });
				const sizes = await dialog
					.locator('[data-intake-field] button')
					.evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
				expect(sizes).toEqual(
					Array(4).fill(await controlHeight(dialog.locator('[data-intake-field] button').first()))
				);
				expect(await dialog.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
					false
				);
				await action.click();
				await expect(dialog).not.toBeVisible();
				await expect(page).toHaveURL(
					(url) =>
						url.pathname === `/${locale}/inventory` &&
						url.searchParams.get('brand') === 'BMW' &&
						url.searchParams.get('q') === 'X5' &&
						url.searchParams.get('keyword') === 'Shadow'
				);
				const params = new URL(page.url()).searchParams;
				expect(params.getAll('context')).toEqual(['one', 'two']);
				expect(params.get('sort')).toBe('highest');
				expect(params.get('view')).toBe('3');
				expect(params.get('minMileage')).toBe('12000');
				expect(params.has('page')).toBe(false);
			});
		}

		test(`${locale} account selectors validate, retain uploads on retry and save at ${width}px`, async ({
			page,
			isMobile
		}) => {
			test.skip(!isMobile, 'Mobile listing composition');
			await page.setViewportSize({ width, height: 568 });
			await visit(page, `/account/listings/new?lang=${locale}`);
			const form = page.locator('[data-mobile-listing-form]');
			const textHeights = await form
				.locator('input:not([type="hidden"]):not([type="file"])')
				.evaluateAll((inputs) => inputs.map((input) => input.getBoundingClientRect().height));
			expect(textHeights).toEqual(Array(3).fill(await controlHeight(form)));
			const save = form.getByRole('button', { name: copy[locale].save, exact: true });
			await save.click();
			await expect(form.getByRole('alert')).toHaveText(copy[locale].selectMake);
			await expect(
				form.getByRole('button', {
					name: `${copy[locale].make}: ${copy[locale].selectMake}`,
					exact: true
				})
			).toBeFocused();
			await form.locator('[name="expectedPrice"]').fill('25000');
			await form.locator('[name="mileage"]').fill('140000');
			await form.locator('[name="vin"]').fill('QA123456789012345');
			await form.locator('[name="description"]').fill('Selector retry QA');
			await form
				.getByRole('button', {
					name: `${copy[locale].make}: ${copy[locale].selectMake}`,
					exact: true
				})
				.click();
			const dialog = page.getByRole('dialog');
			const searchStyle = await dialog.getByRole('searchbox').evaluate((input) => ({
				height: input.getBoundingClientRect().height,
				border: getComputedStyle(input).borderWidth,
				shadow: getComputedStyle(input).boxShadow
			}));
			expect(searchStyle.height).toBeCloseTo(await controlHeight(dialog.getByRole('searchbox')), 2);
			expect(searchStyle.border).toBe('0px');
			expect(searchStyle.shadow).toBe('none');
			await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
			await expect(dialog).not.toBeVisible();
			await save.click();
			await expect(form.getByRole('alert')).toHaveText(copy[locale].selectModel);
			await form
				.getByRole('button', {
					name: `${copy[locale].model}: ${copy[locale].selectModel}`,
					exact: true
				})
				.click();
			const customModel = 'X5 very long custom trim name for narrow mobile screens';
			await dialog.getByRole('searchbox').fill(customModel);
			await dialog
				.getByRole('button', { name: `${copy[locale].use} “${customModel}”`, exact: true })
				.click();
			const selectedModel = form.getByRole('button', {
				name: `${copy[locale].model}: ${customModel}`,
				exact: true
			});
			await expect(selectedModel).toBeFocused();
			const fit = await selectedModel.locator('span').evaluate((element) => ({
				width: element.clientWidth,
				text: element.scrollWidth,
				overflow: getComputedStyle(element).textOverflow
			}));
			expect(fit.text).toBeGreaterThan(fit.width);
			expect(fit.overflow).toBe('ellipsis');
			await form.getByRole('button', { name: `${copy[locale].make}: BMW`, exact: true }).click();
			await dialog.getByRole('searchbox').fill('Audi');
			await dialog.getByRole('searchbox').press('Enter');
			await expect(dialog).toBeVisible();
			await expect(page).toHaveURL(/\/account\/listings\/new\?/);
			await expect(form.locator('[name="title"]')).toHaveValue(`BMW ${customModel}`);
			await page.goBack();
			await expect(selectedModel).toBeVisible();
			await expect(form.locator('[name="description"]')).toHaveValue('Selector retry QA');
			await form.getByRole('button', { name: `${copy[locale].make}: BMW`, exact: true }).click();
			await dialog.getByRole('button', { name: 'Audi', exact: true }).click();
			await expect(form.locator('[name="title"]')).toHaveValue('');
			await expect(
				form.getByRole('button', {
					name: `${copy[locale].model}: ${copy[locale].selectModel}`,
					exact: true
				})
			).toBeVisible();
			await form.getByRole('button', { name: `${copy[locale].make}: Audi`, exact: true }).click();
			await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
			await form
				.getByRole('button', {
					name: `${copy[locale].model}: ${copy[locale].selectModel}`,
					exact: true
				})
				.click();
			await dialog.getByRole('searchbox').fill(customModel);
			await dialog
				.getByRole('button', { name: `${copy[locale].use} “${customModel}”`, exact: true })
				.click();
			await form.locator('details').first().locator('summary').click();
			await form.locator('[name="previewImage"]').setInputFiles({
				name: 'qa-car.png',
				mimeType: 'image/png',
				buffer: Buffer.from(
					'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
					'base64'
				)
			});
			await page.route('**/account/listings/new?*', (route) =>
				route.request().method() === 'POST'
					? route.fulfill({
							status: 500,
							contentType: 'application/json',
							body: '{"type":"error","status":500,"error":{"message":"QA save failure"}}'
						})
					: route.continue()
			);
			await save.click();
			await expect(form.getByRole('alert')).toHaveText(copy[locale].failed);
			await expect(save).toBeEnabled();
			expect(
				await form
					.locator('[name="previewImage"]')
					.evaluate((element) => (element as HTMLInputElement).files?.[0]?.name)
			).toBe('qa-car.png');
			await expect(form.locator('[name="title"]')).toHaveValue(`BMW ${customModel}`);
			await page.unroute('**/account/listings/new?*');
			await save.click();
			await expect(page).toHaveURL(/\/account\/listings\/edit\/.+created=draft/);
			await expect(form.getByRole('status')).toHaveText(copy[locale].saved);
			await expect(form.locator('[name="title"]')).toHaveValue(`BMW ${customModel}`);
			await expect(form.locator('[name="mileage"]')).toHaveValue('140000');
			await expect(form.locator('[name="vin"]')).toHaveValue('QA123456789012345');
			await page.setViewportSize({ width, height: 360 });
			await expect(save).toBeInViewport({ ratio: 1 });
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
		});
	}
}

test('search count failure keeps search usable, Clear removes owned filters, Back restores the opener', async ({
	page,
	isMobile
}) => {
	test.skip(!isMobile, 'Mobile search');
	await page.route('**/api/inventory/count?*', (route) => route.fulfill({ status: 500 }));
	await visit(
		page,
		'/en/inventory?lang=en&brand=BMW&q=X5&keyword=old&sort=highest&context=one&context=two'
	);
	const opener = page.locator('.daynight-inventory-mobile__search-field');
	await opener.click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: 'Brand: BMW', exact: true }).click();
	await page.goBack();
	await expect(dialog).toHaveAccessibleName('Find a car');
	await page.goBack();
	await expect(dialog).not.toBeVisible();
	await expect(opener).toBeFocused();
	await opener.click();
	await dialog.getByRole('button', { name: 'Clear', exact: true }).click();
	await expect(dialog.getByRole('searchbox')).toBeEmpty();
	await expect(
		dialog.getByRole('button', { name: 'Brand: Select make', exact: true })
	).toBeVisible();
	await expect(dialog.getByRole('button', { name: 'Show cars', exact: true })).toBeVisible();
	const violations = await new AxeBuilder({ page })
		.include('[role="dialog"]')
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(violations.violations).toEqual([]);
	await dialog.getByRole('button', { name: 'Brand: Select make', exact: true }).click();
	const pickerViolations = await new AxeBuilder({ page })
		.include('[role="dialog"]')
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(pickerViolations.violations).toEqual([]);
	await dialog.getByRole('button', { name: 'Back', exact: true }).click();
	await dialog.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			!url.searchParams.has('brand') &&
			!url.searchParams.has('q') &&
			!url.searchParams.has('keyword') &&
			url.searchParams.getAll('context').join(',') === 'one,two'
	);
});

test('account manual names survive edit and the form works without JavaScript', async ({
	page,
	browser,
	isMobile
}, info) => {
	test.skip(!isMobile, 'Mobile listing fallback');
	await visit(page, '/account/listings/new?lang=en');
	const form = page.locator('[data-mobile-listing-form]');
	await form.getByRole('button', { name: 'Enter manually', exact: true }).click();
	await form
		.getByRole('textbox', { name: 'Make and model', exact: false })
		.fill('Historic custom car 1956 rare trim');
	await form.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/account\/listings\/edit\//);
	await expect(form.getByRole('textbox', { name: 'Make and model', exact: false })).toHaveValue(
		'Historic custom car 1956 rare trim'
	);
	const violations = await new AxeBuilder({ page })
		.include('[data-mobile-listing-form]')
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(violations.violations).toEqual([]);
	const context = await browser.newContext({
		baseURL: info.project.use.baseURL as string,
		javaScriptEnabled: false,
		isMobile: true,
		viewport: { width: 320, height: 568 }
	});
	try {
		await context.addCookies([
			{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string },
			{ name: 'cars_locale', value: 'en', url: info.project.use.baseURL as string }
		]);
		const native = await context.newPage();
		await native.goto('/account/listings/new?lang=en');
		const nativeForm = native.locator('[data-mobile-listing-form]');
		await nativeForm
			.getByRole('textbox', { name: 'Make and model', exact: false })
			.fill('Native QA car');
		await nativeForm.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(native).toHaveURL(/\/account\/listings\/edit\//);
		await expect(
			nativeForm.getByRole('textbox', { name: 'Make and model', exact: false })
		).toHaveValue('Native QA car');
	} finally {
		await context.close();
	}
});
