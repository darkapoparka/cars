import { expect, test } from '@playwright/test';
import { visit } from './helpers';

for (const locale of ['bg', 'en'] as const) {
	test(`${locale}: phone Import focuses the sheet until a field is tapped`, async ({ page }) => {
		for (const width of [320, 390]) {
			await page.setViewportSize({ width, height: 844 });
			await visit(page, `/${locale}/import`);
			await page.evaluate(() => {
				const log: string[] = [];
				(window as unknown as { formFocusLog: string[] }).formFocusLog = log;
				document.addEventListener('focusin', (event) => {
					const target = event.target;
					if (
						target instanceof HTMLElement &&
						target.matches('input, textarea, select, [contenteditable="true"]')
					)
						log.push(target.id);
				});
			});
			const opener = page.locator('.daynight-import-mobile .service-manual-entry').first();
			await opener.click();
			const dialog = page.getByRole('dialog');
			await expect(dialog).toBeVisible();
			await expect(dialog).toBeFocused();
			expect(
				await page.evaluate(() => (window as unknown as { formFocusLog: string[] }).formFocusLog)
			).toEqual([]);
			const input = dialog.locator('input').first();
			await input.click();
			await expect(input).toBeFocused();
			await input.fill('https://example.com/car/form-focus');
			await dialog
				.getByRole('button', { name: locale === 'en' ? 'Close' : 'Затвори', exact: true })
				.click();
			await expect(dialog).not.toBeVisible();
			await expect(opener).toBeFocused();
		}
	});
}

test('phone vehicle enquiry opens without activating a field and restores its button', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await visit(page, '/en/inventory/21778068579001193');
	const opener = page.locator('.daynight-mobile-pdp__cta--primary');
	await opener.click();
	const dialog = page.getByRole('dialog').filter({ has: page.locator('form') });
	await expect(dialog).toBeVisible();
	await expect(dialog).toBeFocused();
	const input = dialog.locator('[name="name"]');
	await expect(input).not.toBeFocused();
	await input.click();
	await expect(input).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(opener).toBeFocused();
});
