import { test, expect } from '@playwright/test';
import { promptVersion } from './locale-fixture';
const mount = process.env.LOCALE_FIXTURE_BASE ?? '';
for (const locale of ['en', 'bg'] as const) {
	test(
		'native constraints use the page language in an opposite-language browser: ' + locale,
		async ({ browser }, info) => {
			const baseURL = info.project.use.baseURL as string;
			const context = await browser.newContext({
				locale: locale === 'bg' ? 'en-US' : 'bg-BG',
				viewport: { width: 1440, height: 1000 }
			});
			try {
				await context.addCookies([{ name: 'cars_prompt', value: promptVersion, url: baseURL }]);
				const page = await context.newPage();
				await page.goto(baseURL + mount + '/' + locale + '/contact', {
					waitUntil: 'domcontentloaded'
				});
				await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
				const form = page.locator('form.site-form:visible').first();
				const name = form.locator('[name=name]');
				expect(await name.evaluate((node: HTMLInputElement) => node.checkValidity())).toBe(false);
				expect(await name.evaluate((node: HTMLInputElement) => node.validationMessage)).toBe(
					locale === 'en' ? 'Complete this field.' : 'Попълни това поле.'
				);
				const email = form.locator('[name=email]');
				await email.fill('not-an-email');
				expect(await email.evaluate((node: HTMLInputElement) => node.checkValidity())).toBe(false);
				expect(await email.evaluate((node: HTMLInputElement) => node.validationMessage)).toBe(
					locale === 'en' ? 'Enter a valid email address.' : 'Въведи валиден имейл адрес.'
				);
				await expect(email).toHaveValue('not-an-email');
				await email.fill('synthetic@example.invalid');
				expect(await email.evaluate((node: HTMLInputElement) => node.checkValidity())).toBe(true);
				await email.evaluate((node: HTMLInputElement) => {
					node.setCustomValidity('component-owned');
					node.checkValidity();
				});
				expect(await email.evaluate((node: HTMLInputElement) => node.validationMessage)).toBe(
					'component-owned'
				);
			} finally {
				await context.close();
			}
		}
	);
}
