import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => test.skip(Boolean(isMobile), 'Desktop service task flow.'));
for (const locale of ['bg', 'en']) {
	test(`${locale}: all four task entries stay anchored, keep separate drafts and retain catalogue results`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const finder = page.locator('.desktop-service-finder');
		for (const width of [768, 1024, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			await finder.locator('#desktop-service-mode-check').click();
			const panel = await finder.boundingBox();
			const row = await finder.locator('.service-entry-row').boundingBox();
			for (const task of ['check', 'selling', 'import', 'viewing']) {
				await finder.locator('#desktop-service-mode-' + task).click();
				await expect(page.locator('.service-card')).toHaveCount(6);
				expect(await finder.boundingBox()).toEqual(panel);
				expect(
					await finder.locator('.service-entry-row, .desktop-import-entry__row').boundingBox()
				).toEqual(row);
				const next = finder.locator('[data-service-next], [data-intake-next]');
				expect((await next.boundingBox())!.height).toBe(36);
				await next.click();
				await expect(finder.getByRole('alert')).toBeVisible();
				expect(await finder.boundingBox()).toEqual(panel);
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
				false
			);
		}
		await finder.locator('#desktop-service-mode-check').click();
		await finder.locator('.service-entry-row input').fill('https://example.com/car/check');
		await finder.locator('#desktop-service-mode-viewing').click();
		await finder.locator('.service-entry-row input').fill('BMW X5');
		await finder.locator('#desktop-service-mode-check').click();
		await expect(finder.locator('.service-entry-row input')).toHaveValue(
			'https://example.com/car/check'
		);
		await finder.locator('#desktop-service-mode-viewing').click();
		await expect(finder.locator('.service-entry-row input')).toHaveValue('BMW X5');
		const search = page.locator('.service-catalogue-search input[type=search]');
		await search.fill('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await finder.locator('#desktop-service-mode-import').click();
		await expect(search).toHaveValue('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await search.press('Enter');
		await expect(page).toHaveURL(
			(url) => url.searchParams.get('q') === 'VIN' && url.searchParams.get('service') === 'import'
		);
		await expect(finder.locator('#desktop-service-mode-import')).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});
	test(`${locale}: hero Check and Viewing validate, prefill the modal, preserve contact drafts and send the right context`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const finder = page.locator('.desktop-service-finder');
		for (const task of ['check', 'viewing']) {
			await finder.locator('#desktop-service-mode-' + task).click();
			const reference = task === 'check' ? 'https://example.com/car/check' : 'BMW X5';
			await finder.locator('.service-entry-row input').fill(reference);
			await finder.locator('.service-entry-row input').press('Enter');
			const dialog = page.getByRole('dialog');
			await expect(dialog.locator('[name=reference]')).toHaveValue(reference);
			await expect(dialog).toBeFocused();
			await dialog.locator('[name=name]').fill('Synthetic Service QA');
			await dialog.locator('[name=phone]').fill('+359000000000');
			await page.keyboard.press('Escape');
			await expect(finder.locator('[data-service-next]')).toBeFocused();
			await finder.locator('[data-service-next]').click();
			await expect(dialog.locator('[name=name]')).toHaveValue('Synthetic Service QA');
			const axe = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
				.analyze();
			expect(axe.violations).toEqual([]);
			const response = page.waitForResponse(
				(r) => r.url().endsWith('/api/inquiries') && r.request().method() === 'POST'
			);
			await dialog.locator('.site-dialog__footer button').click();
			const saved = await response;
			expect(saved.status()).toBe(201);
			expect(saved.request().postDataJSON()).toMatchObject({
				kind: task === 'check' ? 'vin-check' : 'viewing',
				reference
			});
			expect((await saved.json()).data.receipt).toMatchObject({
				storage: 'demo',
				notification: 'not-configured'
			});
			await dialog
				.getByRole('button', { name: locale === 'en' ? 'Done' : 'Готово', exact: true })
				.click();
			await finder.locator('[data-service-next]').click();
			await expect(dialog.locator('[name=reference]')).toHaveValue(reference);
			await page.keyboard.press('Escape');
		}
	});
	test(`${locale}: Selling has valid VIN handoff and a real manual entry`, async ({ page }) => {
		await visit(page, `/${locale}/services?service=selling`);
		const finder = page.locator('.desktop-service-finder');
		await expect(finder.locator('#desktop-service-mode-selling')).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await finder.locator('.service-entry-row input').fill('bad VIN');
		await finder.locator('[data-service-next]').click();
		await expect(finder.getByRole('alert')).toBeVisible();
		await finder.locator('.service-entry-row input').fill('WBA12345678901234');
		await finder.locator('[data-service-next]').click();
		await expect(page).toHaveURL(`/${locale}/services?service=selling`);
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.locator('#sell-flow-vin:visible')).toHaveValue('WBA12345678901234');
		await visit(page, `/${locale}/services?service=selling`);
		await finder.locator('.service-utility a').click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page).toHaveURL(`/${locale}/services?service=selling`);
		await expect(page.locator('#dialog-sell-mode-manual')).toHaveAttribute('aria-selected', 'true');
		await expect(page.locator('#sell-flow-model:visible')).toBeVisible();
	});
}
