import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile), 'Desktop Selling overlay.'));

for (const locale of ['bg', 'en'] as const) {
	test(`${locale}: Selling card keeps Services, supports both modes and restores its opener`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const opener = page.locator('[data-service="selling"] > a');
		await opener.focus();
		await page.keyboard.press('Enter');
		const dialog = page.getByRole('dialog', {
			name: locale === 'en' ? 'Sell your car' : 'Продай автомобила си',
			exact: true
		});
		await expect(dialog).toBeVisible();
		await expect(page).toHaveURL(`/${locale}/services`);
		await expect(dialog).toBeFocused();
		const accessibility = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			accessibility.violations.map(({ id, nodes }) => ({
				id,
				targets: nodes.map(({ target }) => target)
			}))
		).toEqual([]);
		await dialog.locator('#dialog-sell-mode-manual').click();
		await expect(dialog.locator('#sell-flow-vin')).toHaveCount(0);
		await dialog.locator('[data-intake-next]').click();
		await expect(dialog.getByRole('alert')).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'BMW', exact: true })).toBeFocused();
		await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
		await dialog.locator('#sell-flow-model').fill('X5');
		await dialog.locator('[data-intake-next]').click();
		await expect(dialog).toBeFocused();
		await dialog.locator('#sell-flow-phone').fill('+359 888 000 111');
		await dialog
			.getByRole('textbox', { name: locale === 'en' ? 'City' : 'Град', exact: true })
			.fill('Plovdiv');
		await dialog.locator('textarea').fill('Sample car details');
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(opener).toBeFocused();
		await opener.click();
		await expect(dialog.locator('#sell-flow-phone')).toHaveValue('+359 888 000 111');
		await expect(dialog.locator('textarea')).toHaveValue('Sample car details');
		await dialog.locator('[data-intake-back]').click();
		await expect(dialog.locator('#sell-flow-model')).toHaveValue('X5');
		await expect(dialog.locator('#dialog-sell-mode-manual')).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await page.mouse.click(10, 10);
		await expect(dialog).not.toBeVisible();
		await expect(opener).toBeFocused();
	});
}

test('Selling preserves a supplied VIN and keeps a different car draft separate', async ({
	page
}) => {
	await visit(page, '/en/services?service=selling');
	const finder = page.locator('.desktop-service-finder');
	const opener = finder.locator('[data-service-next]');
	await finder.locator('[name="vin"]').fill('WBA12345678901234');
	await finder.locator('[name="vin"]').press('Enter');
	const dialog = page.getByRole('dialog');
	await expect(dialog.locator('#sell-flow-vin')).toHaveValue('WBA12345678901234');
	await dialog.locator('#sell-flow-model').fill('First car');
	await dialog.locator('[data-intake-next]').click();
	await dialog.locator('#sell-flow-phone').fill('+359 888 000 111');
	await page.keyboard.press('Escape');
	await expect(opener).toBeFocused();
	await finder.locator('[name="vin"]').fill('WBA12345678901235');
	await opener.click();
	await expect(dialog.locator('#sell-flow-vin')).toHaveValue('WBA12345678901235');
	await expect(dialog.locator('#sell-flow-model')).toHaveValue('');
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.locator('#sell-flow-phone')).toHaveValue('');
	await page.keyboard.press('Escape');
	await finder.locator('[name="vin"]').fill('WBA12345678901234');
	await opener.click();
	await dialog.locator('[data-intake-back]').click();
	await expect(dialog.locator('#sell-flow-model')).toHaveValue('First car');
	await expect(page).toHaveURL('/en/services?service=selling');
});

test('Selling uses the demo API, retains a failed request and prevents duplicate sends', async ({
	page
}) => {
	await visit(page, '/en/services?service=selling');
	const finder = page.locator('.desktop-service-finder');
	await finder.locator('[name="vin"]').fill('WBA12345678901234');
	await finder.locator('[data-service-next]').click();
	const dialog = page.getByRole('dialog');
	await dialog.locator('[data-intake-next]').click();
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.getByRole('alert')).toBeVisible();
	await expect(dialog.locator('#sell-flow-phone')).toBeFocused();
	await dialog.locator('#sell-flow-phone').fill('+359 888 000 111');
	await page.route('**/api/inventory/submissions', (route) => route.abort(), { times: 1 });
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.getByRole('alert')).toBeVisible();
	await expect(dialog.locator('#sell-flow-phone')).toHaveValue('+359 888 000 111');
	let sends = 0;
	let release!: () => void;
	const gate = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route('**/api/inventory/submissions', async (route) => {
		sends += 1;
		await gate;
		await route.continue();
	});
	const response = page.waitForResponse(
		(response) =>
			response.url().endsWith('/api/inventory/submissions') &&
			response.request().method() === 'POST'
	);
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.locator('[data-intake-next]')).toBeDisabled();
	await expect(dialog.locator('[data-intake-back]')).toBeDisabled();
	release();
	const saved = await response;
	expect(saved.status()).toBe(201);
	expect(sends).toBe(1);
	expect(saved.request().postDataJSON()).toMatchObject({
		source: 'sell-your-car',
		vin: 'WBA12345678901234'
	});
	expect((await saved.json()).data.receipt).toMatchObject({
		storage: 'demo',
		notification: 'not-configured'
	});
	await expect(dialog.getByRole('status')).toContainText('No message was sent to a dealer.');
	await dialog.locator('.site-dialog__footer button').click();
	await expect(dialog).not.toBeVisible();
	await finder.locator('[data-service-next]').click();
	await expect(dialog.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.locator('#sell-flow-phone')).toHaveValue('');
});

test('Selling has a reachable short-screen footer, trapped focus and mobile fallback', async ({
	page
}) => {
	await page.setViewportSize({ width: 768, height: 540 });
	await visit(page, '/en/services?service=selling');
	const opener = page.locator('.service-utility a');
	await opener.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog.locator('#dialog-sell-mode-manual')).toHaveAttribute('aria-selected', 'true');
	const footer = await dialog.locator('.site-dialog__footer').boundingBox();
	expect(footer!.y + footer!.height).toBeLessThanOrEqual(540);
	for (let i = 0; i < 18; i++) {
		await page.keyboard.press('Tab');
		expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
	}
	expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(dialog).not.toBeVisible();
	const link = page.locator('[data-service="selling"] > a');
	await expect(link).toHaveAttribute('href', '/en/sell-your-car');
	await link.click();
	await expect(page).toHaveURL('/en/sell-your-car');
	await expect(page.locator('#sell-entry-panel')).toBeVisible();
});

test('Selling keeps modified links and no-JS GET entries on the native page', async ({
	page,
	browser
}) => {
	await visit(page, '/en/services');
	const popup = page.context().waitForEvent('page', { timeout: 10000 });
	await page.locator('[data-service="selling"] > a').click({ modifiers: ['Control'] });
	const nativePage = await popup;
	await expect(nativePage).toHaveURL('/en/sell-your-car');
	await expect(
		nativePage.getByRole('heading', { name: 'Sell your car', exact: true })
	).toBeVisible();
	await nativePage.close();
	await expect(page).toHaveURL('/en/services');
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 1000 }
	});
	const noJS = await context.newPage();
	await noJS.goto(new URL('/en/services?service=selling', page.url()).href);
	await noJS.locator('.desktop-service-finder [name="vin"]').fill('WBA12345678901234');
	await noJS.locator('[data-service-next]').click();
	await expect(noJS).toHaveURL(
		(url) =>
			url.pathname === '/en/sell-your-car' && url.searchParams.get('vin') === 'WBA12345678901234'
	);
	await expect(noJS.locator('#sell-flow-vin')).toHaveValue('WBA12345678901234');
	await expect(noJS.locator('noscript a')).toBeVisible();
	await context.close();
});
