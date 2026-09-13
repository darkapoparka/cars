import { expect, test } from '@playwright/test';

test('menu contrast survives navigation back to Home', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/', { waitUntil: 'networkidle' });
	for (const route of ['/sell-your-car', '/']) {
		await page
			.locator('.mobile-bottom-dock')
			.getByRole('link', { name: route === '/' ? 'Начало' : 'Продай', exact: true })
			.click();
		await expect(page).toHaveURL(new RegExp(`${route}$`));
		await page.getByRole('button', { name: 'Меню', exact: true }).click();
		const dialog = page.getByRole('dialog', { name: 'Меню', exact: true });
		for (const action of await dialog.locator('.mobile-menu-sheet__quick-action').all()) {
			await expect(action.locator('strong')).toHaveCSS('color', 'rgb(255, 255, 255)');
			await expect(action.locator('svg')).toHaveCSS('color', 'rgb(255, 255, 255)');
		}
		await dialog.getByRole('button', { name: 'Затвори', exact: true }).click();
		await expect(dialog).not.toBeVisible();
	}
});
