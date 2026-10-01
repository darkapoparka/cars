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

for (const width of [320, 390]) {
	test(`Sell and Import stay interactive through mobile route changes at ${width}px`, async ({
		page
	}, testInfo) => {
		test.skip(testInfo.project.name !== 'mobile');
		await page.setViewportSize({ width, height: 844 });
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await visit(page, '/en');
		const navigation = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
		for (const service of [
			{
				link: 'Sell',
				heading: 'Sell your car',
				tab: 'No VIN?',
				trigger: 'Describe the car',
				dialog: 'Vehicle valuation'
			},
			{
				link: 'Import',
				heading: 'Import a car',
				tab: 'Find a car',
				trigger: 'Describe the car',
				dialog: 'Import request'
			},
			{
				link: 'Sell',
				heading: 'Sell your car',
				tab: 'VIN',
				trigger: 'Enter the VIN',
				dialog: 'Vehicle valuation'
			}
		]) {
			await navigation.getByRole('link', { name: service.link, exact: true }).click();
			await expect(
				page.getByRole('heading', {
					name: service.heading,
					level: service.link === 'Sell' ? 2 : 1,
					exact: true
				})
			).toBeVisible();
			await page.getByRole('tab', { name: service.tab, exact: true }).click();
			await page.getByRole('button', { name: service.trigger, exact: true }).click();
			const dialog = page.getByRole('dialog', { name: service.dialog, exact: true });
			await expect(dialog.getByRole('textbox').first()).toBeVisible();
			await dialog.getByRole('button', { name: 'Close', exact: true }).click();
			await expect(dialog).not.toBeVisible();
			await expect(navigation).toBeVisible();
			expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe(
				'hidden'
			);
		}
		await navigation.getByRole('link', { name: 'Home', exact: true }).click();
		await expect(page.getByRole('tab', { name: 'Buy', exact: true })).toBeVisible();
		expect(errors).toEqual([]);
	});
}
