import { promptVersion } from './locale-fixture';
import { test, expect, type Page } from '@playwright/test';
const mount = process.env.LOCALE_FIXTURE_BASE ?? '';
const route = (locale: string, path = '') => mount + '/' + locale + path;
async function suppressPrompt(page: Page, origin: string) {
	await page.context().addCookies([{ name: 'cars_prompt', value: promptVersion, url: origin }]);
}
for (const width of [320, 390, 1440])
	for (const locale of ['en', 'bg']) {
		const english = locale === 'en';
		test(`import listing and source submissions ${locale} ${width}`, async ({ page }, info) => {
			test.setTimeout(90000);
			await page.setViewportSize({ width, height: 900 });
			await suppressPrompt(page, info.project.use.baseURL as string);
			for (const mode of ['listing', 'source']) {
				await page.goto(route(locale, '/import'));
				await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
				if (width < 768) {
					await page.locator('#import-mode-' + mode).click();
					await page.locator('#import-entry-panel button').click();
				} else await page.locator('#desktop-import-mode-' + mode).click();
				const wizard = page.locator('.bc-import-wizard:visible');
				await expect(wizard).toBeVisible();
				if (mode === 'listing') {
					await wizard
						.getByRole('button', { name: english ? 'Continue' : 'Продължи', exact: true })
						.click();
					await expect(wizard.getByRole('alert')).toBeVisible();
					await wizard
						.locator('#import-wizard-vehicle')
						.fill('https://listing.example.invalid/synthetic');
				} else {
					await expect(wizard.locator('#import-wizard-make')).toBeVisible();
					await wizard.locator('#import-wizard-make').fill('BMW');
					await wizard.locator('#import-wizard-model').fill('X5');
				}
				await wizard
					.getByRole('button', { name: english ? 'Continue' : 'Продължи', exact: true })
					.click();
				await expect(wizard.locator('#import-wizard-budget')).toBeVisible();
				await wizard.locator('#import-wizard-budget').fill('30000');
				await wizard
					.getByRole('button', { name: english ? 'Petrol' : 'Бензин', exact: true })
					.click();
				await wizard
					.getByRole('button', { name: english ? 'Continue' : 'Продължи', exact: true })
					.click();
				await wizard.locator('#import-wizard-name').fill('Synthetic Verification');
				await wizard.locator('#import-wizard-phone').fill('+359000000000');
				await wizard.locator('#import-wizard-email').fill('synthetic@example.invalid');
				const response = page.waitForResponse(
					(r) => r.url().includes('/api/inquiries') && r.request().method() === 'POST'
				);
				await wizard
					.getByRole('button', {
						name: english ? 'Submit request' : 'Изпрати заявката',
						exact: true
					})
					.click();
				const result = await response;
				expect(result.status()).toBe(201);
				const receipt = (await result.json()).data.receipt;
				expect(receipt.storage).toBe('demo');
				expect(receipt.notification).toBe('not-configured');
				await expect(wizard.getByRole('status')).toContainText(
					english ? 'No message was sent' : 'Не е изпратено съобщение'
				);
				await page.screenshot({
					path: info.outputPath('import-' + mode + '-' + locale + '-' + width + '.png')
				});
			}
		});
		test(`sell VIN and manual submissions ${locale} ${width}`, async ({ page }, info) => {
			test.setTimeout(90000);
			await page.setViewportSize({ width, height: 900 });
			await suppressPrompt(page, info.project.use.baseURL as string);
			for (const mode of ['vin', 'manual']) {
				await page.goto(route(locale, '/sell-your-car'));
				await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
				if (width < 768) {
					await page.locator('#sell-mode-' + mode).click();
					await page.locator('#sell-entry-panel button').click();
				} else await page.locator('#desktop-sell-mode-' + mode).click();
				const wizard = page.locator('.sell-flow:visible');
				await expect(wizard).toBeVisible();
				await wizard.locator('.sell-flow__next').click();
				await expect(wizard.getByRole('alert')).toBeVisible();
				if (mode === 'vin') await wizard.locator('#sell-flow-vin').fill('WBA12345678901234');
				else {
					await wizard.getByRole('button', { name: 'BMW', exact: true }).click();
					await wizard.locator('#sell-flow-model').fill('X5');
				}
				await wizard.locator('.sell-flow__next').click();
				await wizard.locator('#sell-flow-phone').fill('+359000000000');
				const response = page.waitForResponse(
					(r) => r.url().includes('/api/inventory/submissions') && r.request().method() === 'POST'
				);
				await wizard.locator('.sell-flow__next').click();
				const result = await response;
				expect(result.status()).toBe(201);
				expect((await result.json()).data.receipt.storage).toBe('demo');
				await expect(wizard.getByRole('status')).toContainText(
					english ? 'No message was sent' : 'Не е изпратено съобщение'
				);
			}
		});
		test(`calculator, contact trade-in and menu ${locale} ${width}`, async ({ page }, info) => {
			test.setTimeout(90000);
			await page.setViewportSize({ width, height: 900 });
			await suppressPrompt(page, info.project.use.baseURL as string);
			await page.goto(route(locale, '/calculator'));
			const calculator = page.locator('.import-estimator');
			await calculator.locator('input').nth(0).fill('30000');
			await calculator.locator('input').nth(1).fill('1000');
			await calculator.locator('input').nth(2).fill('10');
			await calculator.locator('input').nth(3).fill('20');
			await calculator.locator('input').nth(4).fill('500');
			await expect(calculator.locator('output')).toContainText(/41[\s,.]*300/);
			await calculator.locator('input').first().fill('-1');
			await expect(calculator.getByRole('status')).toBeVisible();
			await page.goto(route(locale, '/financing'));
			const finance = page.locator('.finance-estimator');
			await finance.locator('input').nth(0).fill('30000');
			await finance.locator('input').nth(1).fill('6000');
			await finance.locator('select').selectOption('60');
			await finance.locator('input').nth(2).fill('0');
			await expect(finance.locator('.finance-estimator__total')).toContainText('400');
			await page.goto(route(locale, '/contact?topic=trade-in'));
			if (width < 768)
				await page
					.getByRole('button', {
						name: english ? 'Open contact form' : 'Отвори форма за контакт',
						exact: true
					})
					.click();
			const form = page.locator('form.site-form:visible').first();
			await expect(form.locator('[name=source]')).toHaveValue('trade-in');
			await form.locator('[name=name]').fill('Synthetic Verification');
			await form.locator('[name=phone]').fill('+359000000000');
			await form.locator('[name=email]').fill('synthetic@example.invalid');
			await form
				.getByRole('button', { name: english ? 'Send request' : 'Изпрати запитване', exact: true })
				.click();
			await expect(
				page
					.getByRole('status')
					.filter({ hasText: english ? 'No message was sent' : 'Не е изпратено съобщение' })
					.first()
			).toBeVisible();
			await page.goto(route(locale, '/inventory'));
			if (width < 768) {
				await page.getByRole('button', { name: english ? 'Menu' : 'Меню', exact: true }).click();
				const menu = page
					.getByRole('dialog')
					.filter({ has: page.locator('.mobile-navigation-menu__sections') });
				await expect(menu).toBeVisible();
				await expect(page.locator('[data-locale-selector]:visible').first()).toBeVisible();
				await page
					.getByRole('dialog')
					.getByRole('link', { name: english ? 'Contact' : 'Контакти', exact: true })
					.click();
				await expect(page).toHaveURL((u) => u.pathname === route(locale, '/contact'));
				await expect(menu).not.toBeVisible();
			} else {
				await expect(page.locator('.site-header [data-locale-selector]')).toBeVisible();
			}
		});
		test(`vehicle gallery, specs and inquiry ${locale} ${width}`, async ({ page }, info) => {
			test.setTimeout(90000);
			await page.setViewportSize({ width, height: 900 });
			await suppressPrompt(page, info.project.use.baseURL as string);
			await page.goto(route(locale, '/inventory/11774283016080050'));
			await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
			if (width < 768) {
				await page.locator('.daynight-mobile-pdp__hero').getByRole('button').first().click();
				await expect(page.locator('.daynight-mobile-pdp__viewer')).toBeVisible();
				await page.keyboard.press('Escape');
				await page.getByRole('tab', { name: english ? 'Specs' : 'Данни', exact: true }).click();
				await expect(page.locator('.daynight-mobile-pdp__spec-list')).toContainText(
					english ? '3000 cc / 340 hp' : '3000 куб.см / 340 к.с.'
				);
				await page.getByRole('tab', { name: english ? 'Features' : 'Екстри', exact: true }).click();
				await expect(page.locator('.daynight-mobile-pdp__feature-groups')).toBeVisible();
				await page.locator('.daynight-mobile-pdp__actions button').click();
				const form = page.locator('.daynight-mobile-pdp__inquiry-form');
				await expect(form).toBeVisible();
				await form.locator('[name=name]').fill('Synthetic Verification');
				await form.locator('[name=phone]').fill('+359000000000');
				await form
					.getByRole('button', {
						name: english ? 'Send Inquiry' : 'Изпрати запитване',
						exact: true
					})
					.click();
				await expect(form.locator('[aria-live]')).toContainText(
					english ? 'No message was sent' : 'Не е изпратено съобщение'
				);
			} else {
				const photo = page.getByRole('button', {
					name: english ? 'Open full-size photo' : 'Отвори снимката',
					exact: true
				});
				await photo.click();
				await expect(page.getByRole('dialog')).toBeVisible();
				await page.keyboard.press('Escape');
				await expect(photo).toBeFocused();
				await page
					.getByRole('button', {
						name: english ? 'Enquire about this car' : 'Запитване за автомобила',
						exact: true
					})
					.click();
				await expect(page.getByRole('dialog').locator('form')).toBeVisible();
			}
		});
	}

for (const width of [320, 390, 1440])
	for (const locale of ['en', 'bg'])
		test(
			'no-JS localized contact submission ' + locale + ' ' + width,
			async ({ browser }, info) => {
				const context = await browser.newContext({
					javaScriptEnabled: false,
					viewport: { width, height: 900 }
				});
				const page = await context.newPage();
				for (const path of ['/import', '/sell-your-car', '/calculator', '/financing']) {
					await page.goto((info.project.use.baseURL as string) + route(locale, path));
					const fallback = page.locator('noscript a');
					await expect(fallback).toBeVisible();
					await expect(fallback).toHaveAttribute('href', route(locale, '/contact'));
					await fallback.click();
					await expect(page.locator('form.site-form:visible').first()).toBeVisible();
				}
				await page.goto(
					(info.project.use.baseURL as string) + route(locale, '/contact?topic=trade-in')
				);
				const form = page.locator('form.site-form:visible').first();
				await expect(form).toBeVisible();
				await expect(form.locator('[name=source]')).toHaveValue('trade-in');
				await form.locator('[name=name]').fill('Synthetic Verification');
				await form.locator('[name=phone]').fill('+359000000000');
				await form.locator('[name=email]').fill('synthetic@example.invalid');
				await form
					.getByRole('button', {
						name: locale === 'en' ? 'Send request' : 'Изпрати запитване',
						exact: true
					})
					.click();
				await expect(
					page
						.getByRole('status')
						.filter({
							hasText: locale === 'en' ? 'No message was sent' : 'Не е изпратено съобщение'
						})
						.first()
				).toBeVisible();
				await expect(page.locator('html')).toHaveAttribute('lang', locale);
				await page.locator('[data-locale-selector]:visible').first().click();
				await expect(page).toHaveURL((u) => u.pathname === route(locale, '/locale-settings'));
				await expect(page.locator('main select[name=locale] option')).toHaveCount(2);
				await context.close();
			}
		);
