import { expect, test } from '@playwright/test';

test('sample model opens an editable import request with the chosen origin', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	let payload: Record<string, unknown> = {};
	await page.route('**/api/import-requests', async (route) => {
		payload = route.request().postDataJSON();
		await route.fulfill({
			status: 201,
			json: {
				importRequestId: 'example-test',
				leadId: 'example-lead',
				conversationId: 'example-conversation',
				status: 'new'
			}
		});
	});
	await page.goto('/contact?intent=import', { waitUntil: 'networkidle' });
	const examples = page.getByRole('region', { name: /Примерни автомобили/ });
	const card = examples.getByRole('button').first();
	await expect(card.getByText('Пример', { exact: true })).toBeVisible();
	const title = await card.getAttribute('aria-label');
	await page.getByRole('button', { name: 'Германия', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Германия', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await card.click();
	const dialog = page.locator('dialog[open]');
	await expect(dialog).toContainText('Търсене от Германия');
	await expect(dialog.locator('[name="query"]')).not.toHaveValue('');
	await expect(dialog.locator('[name="year"]')).not.toHaveValue('');
	await expect(dialog.locator('[name="sourceUrl"]')).toHaveValue('');
	await expect(dialog.locator('[name="budget"]')).toHaveValue('');
	const query = await dialog.locator('[name="query"]').inputValue();
	expect(title).toContain(query.split(' ')[0]);
	await dialog.locator('[name="budget"]').fill('80000');
	await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
	await expect(dialog).toContainText('Търсене от Германия');
	await dialog.locator('[name="contact"]').fill('+359888123456');
	await dialog.getByRole('button', { name: 'Изпрати заявка', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Заявката е изпратена' })).toBeVisible();
	expect(payload.originCountry).toBe('DE');
	expect(payload.budgetMax).toBe(80000);
	expect(payload.desiredMake).toBeTruthy();
	expect(payload.desiredModel).toBeTruthy();
	expect(payload.notes).toContain(query);
	expect(payload.notes).not.toMatch(/https?:\/\//);
});

test('editing a sample request does not retain the old structured model', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 844 });
	let payload: Record<string, unknown> = {};
	await page.route('**/api/import-requests', async (route) => {
		payload = route.request().postDataJSON();
		await route.fulfill({
			status: 201,
			json: {
				importRequestId: 'edit-test',
				leadId: 'edit-lead',
				conversationId: 'edit-conversation',
				status: 'new'
			}
		});
	});
	await page.goto('/contact?intent=import', { waitUntil: 'networkidle' });
	await page
		.getByRole('region', { name: /Примерни автомобили/ })
		.getByRole('button')
		.first()
		.click();
	const dialog = page.locator('dialog[open]');
	await dialog.locator('[name="query"]').fill('BMW X5');
	await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
	await dialog.locator('[name="contact"]').fill('+359888123456');
	await dialog.getByRole('button', { name: 'Изпрати заявка', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Заявката е изпратена' })).toBeVisible();
	expect(payload.desiredMake).toBeNull();
	expect(payload.desiredModel).toBeNull();
	expect(payload.notes).toContain('BMW X5');
});
