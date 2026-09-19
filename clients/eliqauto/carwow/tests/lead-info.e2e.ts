import { expect, test } from '@playwright/test';
import { leadInfoContent } from '../src/lib/data/lead-content';

const flows = [
	{ kind: 'import', route: '/contact?intent=import', manual: /Филтри за внос/ },
	{ kind: 'sell', route: '/sell-your-car', manual: /Нямам номер или VIN/ }
] as const;
const viewports = [
	{ width: 320, height: 568 },
	{ width: 390, height: 685 },
	{ width: 430, height: 932 },
	{ width: 568, height: 320 }
];

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
});
for (const flow of flows) {
	for (const viewport of viewports) {
		test(`${flow.kind} explainer fits ${viewport.width}x${viewport.height}`, async ({
			page
		}, testInfo) => {
			await page.setViewportSize(viewport);
			await page.goto(flow.route, { waitUntil: 'networkidle' });
			await page.getByRole('button', { name: 'Как работи', exact: true }).click();
			const dialog = page.locator('.mobile-fullsheet--content[open]');
			await expect(dialog).toHaveAccessibleName(leadInfoContent[flow.kind].title);
			await expect(dialog.locator('li')).toHaveCount(leadInfoContent[flow.kind].steps.length);
			await expect(dialog.locator('img')).toHaveCount(0);
			await expect(dialog.locator('.lead-explainer__header')).toHaveCSS(
				'background-color',
				'rgb(255, 255, 255)'
			);
			await expect(dialog.locator('a[href^="tel:"]')).toHaveCount(0);
			await expect(dialog.locator('.lead-explainer__footer button')).toHaveCount(1);
			const rect = (await dialog.boundingBox())!;
			expect(rect.y).toBeGreaterThanOrEqual(0);
			expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height + 1);
			if (viewport.height > 500) expect(rect.height).toBeLessThan(viewport.height - 40);
			for (const control of [
				dialog.getByRole('button', { name: 'Затвори' }),
				dialog.getByRole('button', { name: 'Разбрах' })
			]) {
				const box = (await control.boundingBox())!;
				expect(box.height).toBeGreaterThanOrEqual(44);
				expect(box.y).toBeGreaterThanOrEqual(0);
				expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
			}
			await dialog.locator('li').last().scrollIntoViewIfNeeded();
			const last = (await dialog.locator('li').last().boundingBox())!;
			const body = (await dialog.locator('.lead-explainer__body').boundingBox())!;
			expect(last.y + last.height).toBeLessThanOrEqual(body.y + body.height + 1);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await testInfo.attach('explainer', {
				body: await page.screenshot(),
				contentType: 'image/png'
			});
			await page.keyboard.press('Escape');
			await expect(dialog).toHaveCount(0);
			await expect(page.getByRole('button', { name: 'Как работи', exact: true })).toBeFocused();
		});
	}

	test(`${flow.kind} dismissal and focus remain local to the sheet`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(flow.route, { waitUntil: 'networkidle' });
		const trigger = page.getByRole('button', { name: 'Как работи', exact: true });
		await trigger.click();
		const dialog = page.locator('.mobile-fullsheet--content[open]');
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Затвори' }).focus();
		await page.keyboard.press('Shift+Tab');
		await expect(dialog.getByRole('button', { name: 'Прибери панела', exact: true })).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect(dialog.getByRole('button', { name: 'Разбрах' })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(dialog.getByRole('button', { name: 'Прибери панела', exact: true })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(dialog.getByRole('button', { name: 'Затвори' })).toBeFocused();
		await dialog.getByRole('button', { name: 'Разбрах' }).click();
		await expect(dialog).toHaveCount(0);
		await expect(trigger).toBeFocused();
		await trigger.click();
		await expect(dialog).toBeVisible();
		await page.mouse.click(5, 5);
		await expect(dialog).toHaveCount(0);
		await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
	});
	test(`${flow.kind} actual form keeps the full viewport and its draft`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(flow.route, { waitUntil: 'networkidle' });
		if (flow.kind === 'sell') await page.getByRole('tab', { name: 'Данни', exact: true }).click();
		await page.getByRole('button', { name: flow.manual }).click();
		const form = page.locator('.mobile-fullsheet:not(.mobile-fullsheet--content)[open]');
		await expect(form).toBeVisible();
		const box = (await form.boundingBox())!;
		expect(box.height).toBe(844);
		expect(box.y).toBe(0);
		const input = form.locator(
			flow.kind === 'import' ? 'input[name="query"]' : 'input[name="make"]'
		);
		await input.fill(flow.kind === 'import' ? 'BMW X5' : 'BMW');
		const value = await input.inputValue();
		await page.keyboard.press('Escape');
		await expect(form).toHaveCount(0);
		await page.getByRole('button', { name: flow.manual }).click();
		await expect(input).toHaveValue(value);
	});
}

test('inventory search remains a full task sheet', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory', { waitUntil: 'networkidle' });
	await page.locator('#mobile-inventory-search').click();
	const dialog = page.locator('.mobile-fullsheet[open]');
	await expect(dialog).toBeVisible();
	await expect(dialog).not.toHaveClass(/mobile-fullsheet--content/);
	expect((await dialog.boundingBox())!.height).toBe(844);
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
});
