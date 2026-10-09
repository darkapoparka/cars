import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

const copy = {
	en: {
		country: 'Country',
		germany: 'Germany',
		type: 'Type',
		make: 'Make',
		model: 'Model',
		apply: 'Apply',
		reset: 'Reset',
		find: 'Find this car',
		request: 'Import request',
		close: 'Close',
		valuation: 'Get a valuation',
		noVin: 'No VIN?',
		guide: 'Selling in 3 steps'
	},
	bg: {
		country: 'Държава',
		germany: 'Германия',
		type: 'Тип',
		make: 'Марка',
		model: 'Модел',
		apply: 'Приложи',
		reset: 'Изчисти',
		find: 'Намери този автомобил',
		request: 'Заявка за внос',
		close: 'Затвори',
		valuation: 'Заяви оценка',
		noVin: 'Без VIN?',
		guide: 'Продажба в 3 стъпки'
	}
} as const;

async function openPreference(page: Page, label: string) {
	await page.locator('.import-browse__countries > button').click();
	await page.getByRole('dialog').getByRole('button', { name: label, exact: true }).click();
}

async function openSourceRequest(page: Page) {
	await page.locator('#import-mode-source').click();
	await page.locator('#import-entry-panel button').click();
}

async function accessible(page: Page) {
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(result.violations).toEqual([]);
}

for (const width of [320, 390]) {
	for (const locale of ['en', 'bg'] as const) {
		test(`Import preferences reach the request at ${width}px in ${locale}`, async ({
			page
		}, info) => {
			test.skip(info.project.name !== 'mobile');
			const c = copy[locale];
			await page.setViewportSize({ width, height: 844 });
			await visit(page, `/${locale}/import`);
			const cards = page.locator('.mobile-service-entry__vehicles .mobile-vehicle-card');
			const initialCar = await cards.first().getAttribute('href');
			await expect(page.getByText('stock matches')).not.toBeVisible();
			await expect(page.getByRole('link', { name: 'Browse all', exact: true })).not.toBeVisible();
			expect(
				await page
					.locator('.import-browse__countries a')
					.evaluateAll((buttons) =>
						buttons.every(
							(button) =>
								button.getBoundingClientRect().top === buttons[0].getBoundingClientRect().top
						)
					)
			).toBe(true);
			await accessible(page);
			await openPreference(page, c.country);
			const country = page.getByRole('dialog', { name: c.country, exact: true });
			await country.getByRole('button', { name: c.germany, exact: true }).click();
			await expect(country.getByRole('button', { name: c.germany, exact: true })).toHaveAttribute(
				'aria-pressed',
				'true'
			);
			await accessible(page);
			await country.getByRole('button', { name: c.apply, exact: true }).click();
			await expect(page).toHaveURL((url) => url.searchParams.get('origin') === 'DE');
			await expect(country).not.toBeVisible();
			await expect(cards.first()).toHaveAttribute('href', initialCar!);
			for (const [label, key, value] of [
				[c.type, 'bodyType', 'SUV'],
				[c.make, 'make', 'BMW'],
				[c.model, 'model', 'X5']
			]) {
				await openPreference(page, label);
				const dialog = page.getByRole('dialog', { name: label, exact: true });
				await dialog.getByRole('button', { name: value, exact: true }).click();
				await dialog.getByRole('button', { name: c.apply, exact: true }).click();
				await expect(page).toHaveURL((url) => url.searchParams.get(key) === value);
				await expect(dialog).not.toBeVisible();
			}
			const matches = page.locator('.mobile-service-entry__vehicles .mobile-vehicle-card');
			await expect(matches.first()).toBeVisible();
			for (const card of await matches.all()) {
				await expect(card.getByRole('heading')).toContainText('BMW X5');
			}
			await openSourceRequest(page);
			const request = page.getByRole('dialog');
			await expect(request.locator('[id^="import-wizard-make-"]')).toContainText('BMW');
			await expect(request.locator('[id^="import-wizard-model-"]')).toContainText('X5');
			await expect(request.locator('[id^="import-wizard-type-"]')).toContainText('SUV');
			await expect(request.locator('[id^="import-wizard-country-"]')).toContainText(c.germany);
			await accessible(page);
			await request.getByRole('button', { name: c.close, exact: true }).click();
			await expect(request).not.toBeVisible();
			await expect(page.locator('#import-entry-panel button')).toBeFocused();
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
		});

		test(`Sell card opens both entry modes at ${width}px in ${locale}`, async ({ page }, info) => {
			test.skip(info.project.name !== 'mobile');
			const c = copy[locale];
			await page.setViewportSize({ width, height: 844 });
			await visit(page, `/${locale}/sell-your-car`);
			const image = page.locator('.sell-valuation img');
			await expect
				.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
				.toBe(true);
			expect(await image.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(
				'sell-commerce'
			);
			await expect(page.locator('.sell-valuation__guide li')).toHaveCount(3);
			await expect(
				page.locator('.sell-valuation__guide').getByRole('heading', { name: c.guide, exact: true })
			).toBeVisible();
			await accessible(page);
			for (const manual of [false, true]) {
				await page.getByRole('tab', { name: manual ? c.noVin : 'VIN', exact: true }).click();
				await page.getByRole('button', { name: c.valuation, exact: true }).click();
				const dialog = page.getByRole('dialog');
				if (manual) {
					await expect(dialog.locator('#sell-mobile-make')).toBeVisible();
					await expect(dialog.getByLabel('VIN', { exact: true })).not.toBeVisible();
				} else {
					await expect(dialog.getByLabel('VIN', { exact: true })).toBeVisible();
				}
				await dialog.getByRole('button', { name: c.close, exact: true }).click();
				await expect(dialog).not.toBeVisible();
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
		});
	}
}

test('Import picker back, empty requests, model reset and changed-criteria drafts work', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'mobile');
	await visit(page, '/en/import?make=BMW&model=X5');
	const country = page.locator('.import-browse__countries > button');
	await openPreference(page, 'Country');
	await page.goBack();
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect(country).toBeFocused();
	await openSourceRequest(page);
	const request = page.getByRole('dialog');
	await request.locator('[id^="import-wizard-model-"]').click();
	await request.getByRole('searchbox').fill('draft model');
	await request.getByRole('button', { name: 'Use “draft model”', exact: true }).click();
	await request.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(request).not.toBeVisible();
	await openPreference(page, 'Make: BMW');
	const make = page.getByRole('dialog', { name: 'Make', exact: true });
	await make.getByRole('button', { name: 'Audi', exact: true }).click();
	await make.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(page).toHaveURL(
		(url) => url.searchParams.get('make') === 'Audi' && !url.searchParams.has('model')
	);
	await openPreference(page, 'Model');
	const model = page.getByRole('dialog', { name: 'Model', exact: true });
	await model.getByRole('searchbox', { name: 'Model', exact: true }).fill('custom future model');
	await model.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(page).toHaveURL((url) => url.searchParams.get('model') === 'custom future model');
	await expect(
		page.getByRole('heading', { name: 'Nothing in stock matches yet.', exact: true })
	).toBeVisible();
	await openSourceRequest(page);
	await expect(request.locator('[id^="import-wizard-make-"]')).toContainText('Audi');
	await expect(request.locator('[id^="import-wizard-model-"]')).toContainText(
		'custom future model'
	);
	await request.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(request).not.toBeVisible();
	await page.locator('.import-browse__countries > button').click();
	await page.getByRole('dialog').getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(page).toHaveURL(
		(url) => !url.searchParams.has('make') && !url.searchParams.has('model')
	);
	await expect(page.locator('.mobile-service-entry__vehicles .mobile-vehicle-card')).toHaveCount(3);
});

test('desktop service routes keep their existing layout without mobile Sell artwork downloads', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	const mobileImages: string[] = [];
	page.on('request', (request) => {
		if (request.url().includes('/services/sell-commerce')) mobileImages.push(request.url());
	});
	await visit(page, '/en/sell-your-car');
	await expect(page.getByRole('heading', { name: 'Sell your car', exact: true })).toBeVisible();
	await expect(page.locator('.sell-valuation')).not.toBeVisible();
	await visit(page, '/en/import');
	await expect(page.getByRole('heading', { name: 'Import a car', exact: true })).toBeVisible();
	await expect(page.locator('.import-browse')).not.toBeVisible();
	expect(mobileImages).toEqual([]);
});

test('mobile footer belongs to Home and hides navigation only while visible', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'mobile');
	await visit(page, '/en');
	const navigation = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
	await expect(navigation).toBeVisible();
	await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
	await expect(navigation).not.toBeVisible();
	await page.getByRole('tab', { name: 'Buy', exact: true }).scrollIntoViewIfNeeded();
	await expect(navigation).toBeVisible();
	for (const route of ['inventory', 'sell-your-car', 'import']) {
		await visit(page, `/en/${route}`);
		await expect(page.getByRole('contentinfo')).not.toBeVisible();
		await expect(navigation).toBeVisible();
	}
	await navigation.getByRole('link', { name: 'Home', exact: true }).click();
	await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
	await expect(navigation).not.toBeVisible();
	await page.getByRole('tab', { name: 'Buy', exact: true }).scrollIntoViewIfNeeded();
	await expect(navigation).toBeVisible();
	await navigation.getByRole('link', { name: 'Import', exact: true }).click();
	await expect(page.getByRole('button', { name: 'How it works', exact: true })).toBeVisible();
	await navigation.getByRole('button', { name: 'Menu', exact: true }).click();
	const menu = page.getByRole('dialog', { name: 'Menu', exact: true });
	await expect(menu).toHaveCSS('background-color', 'rgb(238, 241, 244)');
	await expect(menu.getByRole('link', { name: 'All cars', exact: true })).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await accessible(page);
	await menu.getByRole('button', { name: 'Close', exact: true }).click();
	await page.getByRole('button', { name: 'How it works', exact: true }).click();
	const guide = page.getByRole('dialog', { name: 'How it works', exact: true });
	await expect(guide).toHaveCSS('background-color', 'rgb(238, 241, 244)');
	await expect(guide.locator('li').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await accessible(page);
});
