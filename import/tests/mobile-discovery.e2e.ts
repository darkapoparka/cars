import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile discovery journeys');

for (const width of [320, 390]) {
	test(`Home search and filters have separate entries at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 568 });
		await visit(page, '/en');
		const search = page.getByRole('button', { name: 'Search brand, model, price...', exact: true });
		await search.click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toHaveCount(1);
		await expect(dialog).toHaveAccessibleName('Find a car');
		await expect(dialog.getByRole('searchbox')).toBeFocused();
		await dialog.getByRole('searchbox').fill('BMW');
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(search).toBeFocused();
		await expect(page).toHaveURL((url) => url.pathname === '/en');
		await page.getByRole('button', { name: 'Open filters', exact: true }).click();
		await expect(dialog).toHaveAccessibleName('Filters');
		await expect(dialog.getByRole('searchbox')).toHaveCount(0);
		await expect(dialog.getByRole('button', { name: 'Brand', exact: true })).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Model', exact: true })).toBeVisible();
		await expect(dialog.getByRole('button', { name: /Show \d+ cars/ })).toBeInViewport();
		await page.goBack();
		await expect(dialog).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Open filters', exact: true })).toBeFocused();
	});

	test(`filter category drafts survive Back and apply together at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 568 });
		await visit(page, '/en/inventory?lang=en&sort=highest&context=one&context=two');
		await page.getByRole('button', { name: 'Filters', exact: true }).click();
		const dialog = page.getByRole('dialog');
		await dialog.getByRole('button', { name: 'Brand', exact: true }).click();
		await dialog.getByRole('button', { name: /^BMW\s/ }).click();
		await dialog.getByRole('button', { name: 'Done', exact: true }).click();
		await expect(dialog.getByRole('button', { name: 'Brand: BMW', exact: true })).toBeVisible();
		await expect(dialog.getByRole('heading', { name: 'Filters', exact: true })).toBeInViewport();
		await dialog.getByRole('button', { name: 'Fuel', exact: true }).click();
		await dialog.getByRole('button', { name: /^Petrol\s/ }).click();
		await dialog.getByRole('button', { name: 'Back', exact: true }).click();
		await expect(dialog.getByRole('button', { name: 'Fuel: Petrol', exact: true })).toBeVisible();
		await expect(page).toHaveURL((url) => !url.searchParams.has('brand'));
		await expect(dialog.getByRole('button', { name: 'Apply', exact: true })).toBeInViewport();
		expect(await dialog.evaluate((node) => node.scrollTop)).toBe(0);
		await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
		await expect(page).toHaveURL((url) => url.searchParams.get('brand') === 'BMW');
		await expect(page).toHaveURL((url) => url.searchParams.get('fuel') === 'Petrol');
		await expect(page).toHaveURL((url) => url.searchParams.get('sort') === 'highest');
		await expect(page).toHaveURL(
			(url) => url.searchParams.getAll('context').join(',') === 'one,two'
		);
		await expect(dialog).not.toBeVisible();
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
		).toBeLessThanOrEqual(1);
	});

	test(`Import country links preserve car preferences at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 568 });
		await visit(page, '/en/import?lang=en');
		await page.evaluate(() => window.scrollTo({ top: 48, behavior: 'instant' }));
		const firstCard = page.locator('.mobile-vehicle-card--import').first();
		const initialCardTop = await firstCard.evaluate((node) => node.getBoundingClientRect().top);
		await page.getByRole('link', { name: 'China', exact: true }).click();
		await expect(page).toHaveURL((url) => url.searchParams.get('origin') === 'CN');
		await expect(page.getByRole('button', { name: 'Find this car', exact: true })).toHaveCount(0);
		expect(await firstCard.evaluate((node) => node.getBoundingClientRect().top)).toBeCloseTo(
			initialCardTop,
			1
		);
		await page.getByRole('tab', { name: 'Find a car', exact: true }).click();
		await page.getByRole('button', { name: 'Describe the car', exact: true }).click();
		const sourceRequest = page.getByRole('dialog', { name: 'Import request', exact: true });
		await expect(
			sourceRequest.getByRole('button', { name: 'Purchase market: China', exact: true })
		).toBeVisible();
		await sourceRequest.getByRole('button', { name: 'Close', exact: true }).click();
		await visit(page, '/en/import?make=BMW&model=X5');
		const markets = page.getByRole('navigation', {
			name: 'Choose the purchase market for your sourcing request.',
			exact: true
		});
		await markets.getByRole('link', { name: 'Germany', exact: true }).click();
		await expect(page).toHaveURL((url) => url.searchParams.get('origin') === 'DE');
		await expect(page).toHaveURL(
			(url) => url.searchParams.get('make') === 'BMW' && url.searchParams.get('model') === 'X5'
		);
		await expect(markets.getByRole('link', { name: 'Germany', exact: true })).toHaveAttribute(
			'aria-current',
			'page'
		);
		await markets.getByRole('link', { name: 'Everywhere', exact: true }).click();
		await expect(page).toHaveURL(
			(url) => !url.searchParams.has('origin') && url.searchParams.get('make') === 'BMW'
		);
		await page.getByRole('button', { name: 'Filters', exact: true }).click();
		const preferences = page.getByRole('dialog');
		await expect(preferences).toHaveAccessibleName('Filters');
		await preferences.getByRole('button', { name: 'Make: BMW', exact: true }).click();
		await expect(preferences).toHaveAccessibleName('Make');
		await preferences.getByRole('button', { name: 'Back', exact: true }).click();
		await expect(preferences).toHaveAccessibleName('Filters');
		await preferences.getByRole('button', { name: 'Make: BMW', exact: true }).click();
		await preferences.getByRole('button', { name: 'Audi', exact: true }).click();
		await preferences.getByRole('button', { name: 'Apply', exact: true }).click();
		await expect(preferences).not.toBeVisible();
		await expect(page).toHaveURL(
			(url) => url.searchParams.get('make') === 'Audi' && !url.searchParams.has('model')
		);
		await page.getByRole('button', { name: 'Listing link or VIN', exact: true }).click();
		const dialog = page.getByRole('dialog', { name: 'Import request', exact: true });
		await expect(dialog.getByRole('button', { name: 'Continue', exact: true })).toBeInViewport();
		await dialog.getByRole('button', { name: /^Purchase market:/ }).click();
		await dialog.getByRole('button', { name: 'Germany', exact: true }).click();
		await expect(
			dialog.getByRole('button', { name: 'Purchase market: Germany', exact: true })
		).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
	});
}
