import { visit } from './helpers';
import { expect, test } from '@playwright/test';

for (const route of [
	'/',
	'/inventory',
	'/import',
	'/sell-your-car',
	'/financing',
	'/contact',
	'/about',
	'/services',
	'/blog',
	'/faqs',
	'/reviews',
	'/privacy',
	'/terms',
	'/cookies',
	'/calculator',
	'/compare',
	'/account/favorites'
]) {
	test(`renders ${route} without errors or horizontal overflow`, async ({ page }, testInfo) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const response = await visit(page, route);
		expect(response?.status()).toBe(200);
		await page.evaluate(() => document.fonts.ready);
		await expect(page.locator('main').first()).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		expect(errors).toEqual([]);
		await testInfo.attach('viewport', { body: await page.screenshot(), contentType: 'image/png' });
	});
}

test('preview responses cannot be indexed', async ({ request }) => {
	const response = await request.get('/');
	expect(response.headers()['x-robots-tag']).toContain('noindex');
});

for (const locale of ['bg', 'en']) {
	test(`${locale}: missing vehicles retain localized recovery and desktop navigation`, async ({
		page
	}, info) => {
		const response = await visit(page, `/${locale}/inventory/does-not-exist`);
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			locale === 'en' ? 'Page not found' : 'Страницата не е намерена'
		);
		const recovery = page.locator('main').getByRole('link', {
			name: locale === 'en' ? 'Browse cars' : 'Разгледай автомобили',
			exact: true
		});
		if (info.project.name === 'desktop') {
			await page.keyboard.press('Tab');
			await expect(page.locator('.site-skip')).toBeFocused();
			await page.keyboard.press('Enter');
			await expect(page.locator('main')).toBeInViewport();
			await expect(page.locator('.site-shell')).toHaveCSS('background-color', 'rgb(246, 246, 247)');
			await expect(
				page.getByRole('navigation', {
					name: locale === 'en' ? 'Main navigation' : 'Основна навигация',
					exact: true
				})
			).toBeVisible();
		}
		await recovery.click();
		await expect(page).toHaveURL(new RegExp(`/${locale}/inventory$`));
	});
}
