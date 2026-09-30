import { expect, test } from '@playwright/test';

test.use({
	viewport: { width: 320, height: 568 },
	locale: 'en-GB',
	storageState: { cookies: [], origins: [] }
});

test('first-visit preferences save the language and stay dismissed after reload', async ({
	page
}) => {
	await page.goto('/en');
	const dialog = page.locator('[data-locale-dialog]');
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAccessibleName('Welcome to DAY NIGHT AUTO GROUP');
	const close = dialog.getByRole('button', { name: 'Close country and language preferences' });
	await expect(close).toBeFocused();
	await expect(close).toBeInViewport();
	await dialog.locator('select[name=country]').selectOption('GB');
	await dialog.locator('select[name=locale]').selectOption('bg');
	await dialog.locator('button[type=submit]').click();
	await expect(page).toHaveURL(/\/bg$/);
	await expect(dialog).not.toBeVisible();
	await page.reload();
	await expect(page.locator('[data-locale-ready=true]')).toBeAttached();
	await expect(dialog).not.toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
	const menu = page.getByRole('button', { name: 'Меню', exact: true });
	await menu.click();
	await page.getByRole('link', { name: 'Промени държавата и езика' }).click();
	await expect(dialog.locator('select[name=country]')).toHaveValue('GB');
	await expect(dialog.locator('select[name=locale]')).toHaveValue('bg');
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(menu).toBeFocused();
});

test('first-visit preferences can be dismissed without changing the explicit locale', async ({
	page
}) => {
	await page.goto('/en');
	const dialog = page.locator('[data-locale-dialog]');
	await expect(dialog).toBeVisible();
	await dialog.locator('select[name=locale]').selectOption('bg');
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(page).toHaveURL(/\/en$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await page.reload();
	await expect(page.locator('[data-locale-ready=true]')).toBeAttached();
	await expect(dialog).not.toBeVisible();
});
