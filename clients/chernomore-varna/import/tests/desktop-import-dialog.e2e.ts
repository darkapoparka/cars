import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

for (const locale of ['bg', 'en'] as const) {
	test(`${locale}: Import keeps its page, contact draft and accessible dismissal`, async ({
		page
	}, info) => {
		test.skip(info.project.name !== 'desktop');
		await visit(page, `/${locale}/services`);
		const initialURL = page.url();
		const finder = page.locator('.desktop-service-finder');
		await finder.locator('#desktop-service-mode-import').click();
		await finder.locator('[name="vehicle"]').fill('https://example.com/car/overlay');
		const opener = finder.locator('[data-intake-next]');
		await opener.click();
		const dialog = page.getByRole('dialog', {
			name: locale === 'en' ? 'Import a car' : 'Внос на автомобил',
			exact: true
		});
		await expect(dialog).toBeVisible();
		await expect(dialog).toBeFocused();
		await expect(dialog.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
		await expect(page).toHaveURL(initialURL);
		const accessibility = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			accessibility.violations.map(({ id, nodes }) => ({
				id,
				targets: nodes.map(({ target }) => target)
			}))
		).toEqual([]);
		if (process.env.IMPORT_OVERLAY_EVIDENCE_DIR) {
			await page.screenshot({
				path: `${process.env.IMPORT_OVERLAY_EVIDENCE_DIR}/after-${locale}-1440.png`
			});
		}
		await dialog.locator('[id^="import-wizard-budget-"]').fill('35000');
		await dialog.locator('[id^="import-wizard-notes-"]').fill('Sample preferences');
		await dialog.locator('[data-intake-next]').click();
		await expect(dialog).toBeFocused();
		await dialog.locator('[id^="import-wizard-name-"]').fill('Demo Customer');
		await dialog.locator('[id^="import-wizard-phone-"]').fill('+359 888 000 111');
		await dialog.locator('[id^="import-wizard-email-"]').fill('demo@example.com');
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(opener).toBeFocused();
		await opener.click();
		await expect(dialog.locator('[id^="import-wizard-name-"]')).toHaveValue('Demo Customer');
		await expect(dialog.locator('[id^="import-wizard-phone-"]')).toHaveValue('+359 888 000 111');
		await expect(dialog.locator('[id^="import-wizard-email-"]')).toHaveValue('demo@example.com');
		await dialog.locator('[data-intake-back]').click();
		await expect(dialog.locator('[id^="import-wizard-budget-"]')).toHaveValue('35000');
		await expect(dialog.locator('[id^="import-wizard-notes-"]')).toHaveValue('Sample preferences');
		await page.mouse.click(10, 10);
		await expect(dialog).not.toBeVisible();
		await expect(opener).toBeFocused();
		await opener.click();
		await page.setViewportSize({ width: 390, height: 844 });
		await expect(dialog).not.toBeVisible();
		await expect(page).toHaveURL(initialURL);
	});
}

test('Import uses the demo API, retains a failed request and starts fresh after completion', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/en/about');
	const opener = page
		.getByRole('navigation', { name: 'Useful links' })
		.getByRole('link', { name: 'Import', exact: true });
	await opener.focus();
	await page.keyboard.press('Enter');
	const dialog = page.getByRole('dialog', { name: 'Import a car', exact: true });
	await expect(dialog).toBeFocused();
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.getByRole('alert')).toBeVisible();
	await expect(dialog.locator('[id^="import-wizard-vehicle-"]')).toBeFocused();
	await dialog.locator('[id^="import-wizard-vehicle-"]').fill('https://example.com/car/demo');
	await dialog.locator('[data-intake-next]').click();
	await dialog.locator('[data-intake-next]').click();
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.locator('[id^="import-wizard-name-"]')).toBeFocused();
	await dialog.locator('[id^="import-wizard-name-"]').fill('Demo Customer');
	await dialog.locator('[id^="import-wizard-phone-"]').fill('+359 888 000 111');
	await page.route('**/api/inquiries', (route) => route.abort(), { times: 1 });
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.getByRole('alert')).toBeVisible();
	await expect(dialog.locator('[id^="import-wizard-name-"]')).toHaveValue('Demo Customer');
	const response = page.waitForResponse(
		(response) =>
			response.url().endsWith('/api/inquiries') && response.request().method() === 'POST'
	);
	await dialog.locator('[data-intake-next]').click();
	const saved = await response;
	expect(saved.status()).toBe(201);
	expect(saved.request().postDataJSON()).toMatchObject({
		source: 'import-request',
		vehicle: 'https://example.com/car/demo'
	});
	expect((await saved.json()).data.receipt).toMatchObject({
		storage: 'demo',
		notification: 'not-configured'
	});
	await expect(dialog.getByRole('status')).toContainText('No message was sent to a dealer.');
	await dialog.locator('.site-dialog__footer button').click();
	await expect(dialog).not.toBeVisible();
	await expect(opener).toBeFocused();
	await opener.click();
	await expect(dialog.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
	await expect(dialog.locator('[id^="import-wizard-vehicle-"]')).toHaveValue('');
	await expect(page).toHaveURL(/\/en\/about$/);
});

test('a new car cannot inherit another Import request and the short-screen footer stays reachable', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await page.setViewportSize({ width: 768, height: 540 });
	await visit(page, '/en/services?service=import');
	const finder = page.locator('.desktop-service-finder');
	await finder.locator('[name="vehicle"]').fill('https://example.com/car/a');
	await finder.locator('[data-intake-next]').click();
	const dialog = page.getByRole('dialog', { name: 'Import a car', exact: true });
	const footer = await dialog.locator('.site-dialog__footer').boundingBox();
	expect(footer).not.toBeNull();
	expect(footer!.y + footer!.height).toBeLessThanOrEqual(540);
	await dialog.locator('[id^="import-wizard-budget-"]').fill('35000');
	await dialog.locator('[data-intake-next]').click();
	await dialog.locator('[id^="import-wizard-name-"]').fill('First car customer');
	await page.keyboard.press('Escape');
	await finder.locator('[name="vehicle"]').fill('https://example.com/car/b');
	await finder.locator('[data-intake-next]').click();
	await expect(dialog.locator('[id^="import-wizard-budget-"]')).toHaveValue('');
	await dialog.locator('[data-intake-next]').click();
	await expect(dialog.locator('[id^="import-wizard-name-"]')).toHaveValue('');
	await dialog.locator('[data-intake-back]').click();
	await dialog.locator('[data-intake-back]').click();
	await expect(dialog.locator('[id^="import-wizard-vehicle-"]')).toHaveValue(
		'https://example.com/car/b'
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
