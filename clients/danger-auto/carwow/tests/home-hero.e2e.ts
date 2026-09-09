import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 1000 } });

test('hero modes switch with the keyboard and retain separate drafts', async ({ page }) => {
	await page.goto('/');
	const buy = page.getByRole('tab', { name: 'Купи', exact: true });
	await buy.click();
	await page.locator('#hero-buy-query').fill('Audi');
	await buy.focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'Продай', exact: true })).toBeFocused();
	await page.locator('#hero-sell-make').fill('BMW');
	await page.locator('#hero-sell-model').fill('320d Touring');
	await page.getByRole('tab', { name: 'Внос', exact: true }).click();
	await page.locator('#hero-import-url').fill('https://www.mobile.de/auto-inserat/test/123.html');
	await buy.click();
	await expect(page.locator('#hero-buy-query')).toHaveValue('Audi');
	await page.getByRole('tab', { name: 'Продай', exact: true }).click();
	await expect(page.locator('#hero-sell-make')).toHaveValue('BMW');
	await expect(page.locator('#hero-sell-model')).toHaveValue('320d Touring');
	await page.getByRole('tab', { name: 'Внос', exact: true }).click();
	await expect(page.locator('#hero-import-url')).toHaveValue(
		'https://www.mobile.de/auto-inserat/test/123.html'
	);
	await expect(page).toHaveURL(/\/$/);
});

test('sell carries make and model into the existing desktop intake', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('tab', { name: 'Продай', exact: true }).click();
	await page.locator('#hero-sell-make').fill('BMW');
	await page.locator('#hero-sell-model').fill('320d Touring');
	await page.locator('.hero-intent__submit').click();
	await expect(page).toHaveURL(/\/sell-your-car\?make=BMW&model=320d\+Touring$/);
	await expect(page.locator('.desktop-sell input[name="make"]')).toHaveValue('BMW');
	await expect(page.locator('.desktop-sell input[name="model"]')).toHaveValue('320d Touring');
});

test('import validates a URL and carries it into the existing request', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('tab', { name: 'Внос', exact: true }).click();
	const input = page.locator('#hero-import-url');
	await input.fill('not-a-url');
	await page.locator('.hero-intent__submit').click();
	await expect(input).toBeFocused();
	await expect(page).toHaveURL(/\/$/);
	const sourceUrl = 'https://www.mobile.de/auto-inserat/test/123.html?lang=bg&ref=home';
	await input.fill(sourceUrl);
	await page.locator('.hero-intent__submit').click();
	await expect(page).toHaveURL(/\/contact\?intent=import&sourceUrl=/);
	await expect(page.locator('input[name="sourceUrl"]')).toHaveValue(sourceUrl);
	await expect(page.locator('h1')).toHaveText('Заявка за внос на автомобил');
});

test('buy preserves the inventory query and quick filter contract', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Марка: Марка', exact: true }).click();
	await page.getByRole('option', { name: 'BMW', exact: true }).click();
	await page.locator('#hero-buy-query').fill('X6');
	await page.locator('.hero-intent__submit').click();
	await expect(page).toHaveURL(/\/inventory\?/, { timeout: 30_000 });
	const url = new URL(page.url());
	expect(url.searchParams.get('brand')?.toLowerCase()).toBe('bmw');
	expect(url.searchParams.get('q')).toBe('X6');
});

for (const width of [1280, 1440, 1920]) {
	test(`desktop hierarchy and hero geometry at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto('/');
		await expect(page.locator('.hero-intent')).toBeVisible();
		await page.evaluate(() => document.fonts.ready);
		const layout = await page.evaluate(() => {
			const headingSelectors = [
				'.daynight-home-inventory h2',
				'.daynight-home-section--vehicle-types h2',
				'.daynight-home-brand-section h2',
				'.daynight-home-section--reviews-with-banner h2'
			];
			const headings = headingSelectors.map((selector) => {
				const style = getComputedStyle(document.querySelector(selector)!);
				return [style.fontSize, style.fontFamily, style.fontWeight, style.lineHeight];
			});
			return {
				headings,
				overflow: document.documentElement.scrollWidth > innerWidth,
				heroSize: parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize)
			};
		});
		expect(layout.overflow).toBe(false);
		for (const heading of layout.headings) expect(heading).toEqual(layout.headings[0]);
		// The shared section heading scales from 28px to 36px across desktop widths.
		expect(parseFloat(layout.headings[0][0])).toBeGreaterThanOrEqual(28);
		expect(parseFloat(layout.headings[0][0])).toBeLessThanOrEqual(36);
		expect(layout.heroSize).toBeGreaterThan(parseFloat(layout.headings[0][0]));
		const heights: number[] = [];
		for (const mode of ['Купи', 'Продай', 'Внос']) {
			await page.getByRole('tab', { name: mode, exact: true }).click();
			heights.push((await page.locator('.hero-intent').boundingBox())!.height);
			await page.screenshot({ path: testInfo.outputPath(`hero-${width}-${mode}.png`) });
		}
		expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
	});
}

test('mobile retains its separate home composition', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await expect(page.locator('.mobile-home')).toBeVisible();
	await expect(page.locator('.hero-intent')).toHaveCount(0);
	await expect(page.locator('.mobile-home h1')).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: testInfo.outputPath('mobile-preservation.png') });
});
