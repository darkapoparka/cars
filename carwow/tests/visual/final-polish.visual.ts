import { expect, test } from '@playwright/test';

const visualCases = [
	{ name: 'home-mobile', path: '/', width: 390, height: 900 },
	{ name: 'inventory-mobile', path: '/inventory', width: 390, height: 900 },
	{
		name: 'detail-mobile',
		path: '/inventory/mercedes-benz-gla-45-amg-405323',
		width: 390,
		height: 900
	},
	{ name: 'home-desktop', path: '/', width: 1440, height: 900 },
	{ name: 'inventory-desktop', path: '/inventory', width: 1440, height: 900 },
	{
		name: 'detail-desktop',
		path: '/inventory/mercedes-benz-gla-45-amg-405323',
		width: 1440,
		height: 900
	}
] as const;

for (const visualCase of visualCases) {
	test(visualCase.name, async ({ page }) => {
		await page.setViewportSize({ width: visualCase.width, height: visualCase.height });
		await page.goto(visualCase.path, { waitUntil: 'networkidle' });
		await expect(page).toHaveScreenshot(`${visualCase.name}.png`, { fullPage: true });
	});
}
