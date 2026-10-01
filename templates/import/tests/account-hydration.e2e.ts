import { expect, test } from '@playwright/test';
import { promptVersion } from './locale-fixture';

test('account pages hydrate without recovering from a markup mismatch', async ({ page }, info) => {
	test.setTimeout(120000);
	await page.context().addCookies(
		['cars_prompt', 'cars_locale'].map((name) => ({
			name,
			value: name === 'cars_prompt' ? promptVersion : 'bg',
			url: info.project.use.baseURL as string
		}))
	);
	const warnings: string[] = [];
	page.on('console', (message) => {
		if (/hydration_(mismatch|failed)/.test(message.text())) warnings.push(message.text());
	});
	for (const route of [
		'/account',
		'/account/profile',
		'/account/listings',
		'/account/messages',
		'/account/password',
		'/account/listings/new'
	]) {
		await page.goto(route, { waitUntil: 'domcontentloaded' });
		await expect(page.locator('html'), route).toHaveAttribute('data-daynight-hydrated', 'true', {
			timeout: 30000
		});
		expect(warnings, route).toEqual([]);
	}
});
