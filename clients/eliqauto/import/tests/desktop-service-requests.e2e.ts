import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

const dialogs = {
	bg: ['Проверка на обява / VIN', 'Документи и регистрация', 'Уговори оглед'],
	en: ['Listing / VIN check', 'Documents and registration', 'Arrange a viewing']
};
const services = ['listing-check', 'registration', 'viewing'];

for (const locale of ['bg', 'en'] as const) {
	test(`desktop service cards and contextual hero actions open focused requests in ${locale}`, async ({
		page
	}, info) => {
		test.skip(info.project.name !== 'desktop');
		await visit(page, `/${locale}/services`);
		const url = page.url();
		for (const [index, service] of services.entries()) {
			const opener = page.locator(`[data-service="${service}"] > a`);
			await opener.focus();
			await page.keyboard.press('Enter');
			const dialog = page.getByRole('dialog', { name: dialogs[locale][index], exact: true });
			await expect(dialog).toBeVisible();
			await expect(dialog).toBeFocused();
			expect(page.url()).toBe(url);
			const accessibility = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
				.analyze();
			expect(
				accessibility.violations.map((violation) => ({
					id: violation.id,
					targets: violation.nodes.map((node) => node.target)
				}))
			).toEqual([]);
			await page.keyboard.press('Escape');
			await expect(dialog).not.toBeVisible();
			await expect(opener).toBeFocused();
		}
		const finder = page.locator('.desktop-service-finder');
		for (const [index, label] of [
			locale === 'bg' ? 'Проверка' : 'Check',
			locale === 'bg' ? 'Оглед' : 'Viewing'
		].entries()) {
			await finder.getByRole('tab', { name: label, exact: true }).click();
			const reference = index === 0 ? 'https://example.com/car/hero' : 'BMW X5';
			await finder.locator('.service-entry-row input').fill(reference);
			const opener = finder.locator('[data-service-next]');
			await opener.click();
			await expect(page.getByRole('dialog')).toBeVisible();
			await expect(page.getByRole('dialog').locator('[name="reference"]')).toHaveValue(reference);
			await expect(page.getByRole('dialog')).toBeFocused();
			await page.mouse.click(10, 10);
			await expect(page.getByRole('dialog')).not.toBeVisible();
			await expect(opener).toBeFocused();
		}
		await finder
			.getByRole('tab', { name: locale === 'bg' ? 'Внос' : 'Import', exact: true })
			.click();
		await finder
			.locator('.desktop-import-entry [name="vehicle"]')
			.fill('https://example.com/car/123');
		await finder.locator('[data-intake-next]').click();
		await expect(page).toHaveURL(url);
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.locator('.desktop-import-request .bc-import-wizard')).toBeVisible();
		await visit(page, `/${locale}/services`);
		await page.locator('[data-service="selling"] > a').click();
		await expect(page).toHaveURL(url);
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.locator('.desktop-sell-request .sell-flow')).toBeVisible();
	});

	test(`all three desktop requests save their service context through the demo API in ${locale}`, async ({
		page
	}, info) => {
		test.skip(info.project.name !== 'desktop');
		await visit(page, `/${locale}/services`);
		for (const [index, service] of services.entries()) {
			await page.locator(`[data-service="${service}"] > a`).click();
			const dialog = page.getByRole('dialog');
			await dialog.locator('[name="name"]').fill('Demo Customer');
			await dialog.locator('[name="phone"]').fill('+359 888 000 111');
			if (service === 'registration')
				await dialog.locator('[name="message"]').fill('Registration for an imported car');
			else
				await dialog
					.locator('[name="reference"]')
					.fill(service === 'viewing' ? 'BMW X5' : 'https://example.com/car/123');
			if (service === 'viewing')
				await dialog.locator('[name="preferredDate"]').fill('2026-10-15T14:30');
			const response = page.waitForResponse(
				(response) =>
					response.url().endsWith('/api/inquiries') && response.request().method() === 'POST'
			);
			await dialog.locator('.site-dialog__footer button').click();
			const saved = await response;
			expect(saved.status()).toBe(201);
			expect((await saved.json()).data.receipt).toMatchObject({
				storage: 'demo',
				notification: 'not-configured'
			});
			expect(saved.request().postDataJSON()).toMatchObject({
				source: 'service-request',
				kind: ['vin-check', 'registration', 'viewing'][index],
				routePath: `/${locale}/services`
			});
			await expect(dialog.getByRole('status')).toContainText(
				locale === 'bg'
					? 'Не е изпратено съобщение до търговец.'
					: 'No message was sent to a dealer.'
			);
			await dialog
				.getByRole('button', { name: locale === 'bg' ? 'Готово' : 'Done', exact: true })
				.click();
			await expect(dialog).not.toBeVisible();
		}
	});
}

test('invalid input and API failure retain the draft, prevent duplicate sends and allow retry', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/en/services');
	await page.locator('[data-service="listing-check"] > a').click();
	const dialog = page.getByRole('dialog');
	await dialog.locator('.site-dialog__footer button').click();
	await expect(dialog.locator('[name="reference"]')).toBeFocused();
	await expect(dialog.locator('[name="reference"]')).toHaveAttribute('aria-invalid', 'true');
	await dialog.locator('[name="reference"]').fill('https://example.com/car');
	await dialog.locator('[name="name"]').fill('Demo Customer');
	await dialog.locator('[name="phone"]').fill('+359 888 000 111');
	await page.keyboard.press('Escape');
	await page.locator('[data-service="registration"] > a').click();
	await expect(dialog.locator('[name="name"]')).toHaveValue('');
	await page.keyboard.press('Escape');
	await page.locator('[data-service="listing-check"] > a').click();
	await expect(dialog.locator('[name="reference"]')).toHaveValue('https://example.com/car');
	let sends = 0;
	let release!: () => void;
	const pending = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route('**/api/inquiries', async (route) => {
		sends++;
		await pending;
		await route.fulfill({
			status: 503,
			contentType: 'application/json',
			body: JSON.stringify({ ok: false })
		});
	});
	await dialog.locator('.site-dialog__footer button').click();
	await expect(dialog.locator('.site-dialog__footer button')).toBeDisabled();
	await dialog.locator('[name="phone"]').press('Enter');
	expect(sends).toBe(1);
	release();
	await expect(dialog.getByRole('alert')).toHaveText(
		'The request was not saved. Please try again.'
	);
	await expect(dialog.locator('[name="reference"]')).toHaveValue('https://example.com/car');
	await page.unroute('**/api/inquiries');
	await dialog.locator('.site-dialog__footer button').click();
	await expect(dialog.getByRole('status')).toContainText('Demo request saved temporarily.');
	const invalid = await page.request.post('/api/inquiries', {
		data: {
			source: 'service-request',
			kind: 'vin-check',
			name: 'Demo Customer',
			phone: '1234567',
			reference: 'bad VIN'
		}
	});
	expect(invalid.status()).toBe(400);
});

test('short desktop viewports keep the action visible, trap focus and dismiss on mobile resize', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await page.setViewportSize({ width: 768, height: 500 });
	await visit(page, '/en/services');
	await page.locator('[data-service="viewing"] > a').click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const footer = await dialog.locator('.site-dialog__footer').boundingBox();
	expect(footer!.y + footer!.height).toBeLessThanOrEqual(476);
	for (let index = 0; index < 12; index++) {
		await page.keyboard.press('Tab');
		expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
	}
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect(page.locator('.site-dialog-backdrop')).toHaveCount(0);
	await expect(page.locator('[data-service="viewing"] > a')).not.toHaveAttribute(
		'aria-haspopup',
		'dialog'
	);
	await page.locator('[data-service="viewing"] > a').click();
	await expect(page).toHaveURL(/\/en\/contact#contact-details$/);
});

test('native service links remain available without JavaScript', async ({ browser }, info) => {
	test.skip(info.project.name !== 'desktop');
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 1000 }
	});
	const baseURL = info.project.use.baseURL as string;
	await context.addCookies([
		{ name: 'cars_prompt', value: 'v1', url: baseURL },
		{ name: 'cars_locale', value: 'en', url: baseURL }
	]);
	const page = await context.newPage();
	await page.goto(`${baseURL}/en/services`);
	await expect(page.locator('[data-service="listing-check"] > a')).toHaveAttribute(
		'href',
		'/en/import'
	);
	await page.locator('[data-service="registration"] > a').click();
	await expect(page).toHaveURL(/\/en\/contact\?topic=registration#contact-details$/);
	await context.close();
});
