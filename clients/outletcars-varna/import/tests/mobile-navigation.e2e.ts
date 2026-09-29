import { visit } from './helpers';
import { expect, test } from '@playwright/test';

test('menu restores focus and browser back dismisses it exactly once', async ({
	page
}, testInfo) => {
	test.skip(testInfo.project.name !== 'mobile');
	await visit(page, '/inventory');
	const trigger = page.getByRole('button', { name: 'Меню', exact: true });
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await page.goBack();
	await expect(dialog).not.toBeVisible();
	await expect(page).toHaveURL((url) => url.pathname === '/bg/inventory');
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(page).toHaveURL((url) => url.pathname === '/bg/inventory');
});

test('navigation from the menu does not leave a stale overlay or scroll lock', async ({
	page
}, testInfo) => {
	test.skip(testInfo.project.name !== 'mobile');
	await visit(page, '/inventory');
	await page.getByRole('button', { name: 'Меню', exact: true }).click();
	await page.getByRole('dialog').getByRole('link', { name: 'Контакти', exact: true }).click();
	await expect(page).toHaveURL((url) => url.pathname === '/bg/contact');
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect
		.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
		.not.toBe('hidden');
});
