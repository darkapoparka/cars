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
