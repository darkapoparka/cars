import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, contextOptions: { reducedMotion: 'reduce' } });

test('import tabs preserve separate drafts and submit only the chosen identifier', async ({
	page
}) => {
	let payload: Record<string, unknown> = {};
	await page.route('**/api/import-requests', async (route) => {
		payload = route.request().postDataJSON();
		await route.fulfill({
			status: 201,
			json: {
				importRequestId: 'mode-test',
				leadId: 'mode-lead',
				conversationId: 'mode-conversation',
				status: 'new'
			}
		});
	});
	await page.goto('/contact?intent=import', { waitUntil: 'networkidle' });
	const link = page.getByRole('textbox', { name: 'Линк към обява', exact: true });
	await link.fill('not a link');
	await page.getByRole('button', { name: 'Продължи', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('https://');
	await link.fill('https://example.com/car');
	await page.getByRole('tab', { name: 'Линк', exact: true }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'VIN', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	const vin = page.getByRole('textbox', { name: 'VIN', exact: true });
	await vin.fill('123');
	await page.getByRole('button', { name: 'Продължи', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('17');
	await vin.fill('WBA12345678901234');
	await page.getByRole('tab', { name: 'Линк', exact: true }).click();
	await expect(link).toHaveValue('https://example.com/car');
	await page.getByRole('tab', { name: 'VIN', exact: true }).click();
	await expect(vin).toHaveValue('WBA12345678901234');
	await page.getByRole('button', { name: 'Продължи', exact: true }).click();
	const dialog = page.locator('dialog[open]');
	await expect(dialog.locator('[name="query"]')).toHaveValue('WBA12345678901234');
	await expect(dialog.locator('[name="sourceUrl"]')).toHaveValue('');
	await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
	await dialog.locator('[name="contact"]').fill('+359888123456');
	await dialog.getByRole('button', { name: 'Изпрати заявка', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Заявката е изпратена' })).toBeVisible();
	expect(payload.notes).toContain('WBA12345678901234');
	expect(payload.notes).not.toContain('https://example.com/car');
});

test('sell manual mode preserves the identifier draft and form details', async ({ page }) => {
	await page.goto('/sell-your-car', { waitUntil: 'networkidle' });
	const identifier = page.getByRole('textbox', { name: 'Регистрационен номер или VIN' });
	await identifier.fill('CB 1234 AB');
	await page.getByRole('tab', { name: 'Данни', exact: true }).click();
	await page.getByRole('button', { name: /Въведи данните за автомобила ръчно/ }).click();
	const dialog = page.locator('dialog[open]');
	await dialog.locator('[name="make"]').fill('BMW');
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: /Въведи данните за автомобила ръчно/ }).click();
	await expect(dialog.locator('[name="make"]')).toHaveValue('BMW');
	await page.keyboard.press('Escape');
	await page.getByRole('tab', { name: 'VIN / Номер', exact: true }).click();
	await expect(identifier).toHaveValue('CB 1234 AB');
});

for (const route of ['/sell-your-car', '/contact?intent=import']) {
	test(`information sheet supports short pull, drag dismissal and focus return: ${route}`, async ({
		page
	}) => {
		await page.goto(route, { waitUntil: 'networkidle' });
		const trigger = page.getByRole('button', { name: 'Как работи', exact: true });
		await trigger.click();
		const dialog = page.locator('dialog[open]');
		const handle = dialog.getByRole('button', { name: 'Прибери панела', exact: true });
		let box = (await handle.boundingBox())!;
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 30, { steps: 5 });
		await page.mouse.up();
		await expect(dialog).toBeVisible();
		box = (await handle.boundingBox())!;
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 120, { steps: 10 });
		await page.mouse.up();
		await expect(dialog).toHaveCount(0);
		await expect(trigger).toBeFocused();
		expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
	});
}
