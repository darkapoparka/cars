import { expect, test } from '@playwright/test';

test('services search and filters combine, and the existing request drawer keeps the selected service', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	let payload: Record<string, unknown> = {};
	await page.route('**/api/leads', async (route) => {
		payload = route.request().postDataJSON();
		await route.fulfill({
			status: 201,
			json: { leadId: 'service-test', conversationId: 'service-conversation', status: 'new' }
		});
	});
	await page.goto('/services');
	const cards = page.locator('.mobile-services-card');
	const categories = page.getByRole('navigation', { name: 'Вид услуга' });
	await expect(cards).toHaveCount(4);
	await page.getByRole('searchbox').fill('лизинг');
	await page.getByRole('searchbox').press('Enter');
	await expect(cards).toHaveCount(1);
	await expect(cards).toHaveAccessibleName('Финансиране');
	await categories.getByRole('link', { name: 'Документи', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Няма намерени услуги' })).toBeVisible();
	await page.getByRole('link', { name: 'Изчисти', exact: true }).click();
	await categories.getByRole('link', { name: 'Документи', exact: true }).click();
	await expect(cards).toHaveCount(1);
	await cards.click();
	const drawer = page.getByRole('dialog', { name: 'Регистрация и документи' });
	await expect(drawer).toBeVisible();
	await expect(drawer.getByText('Договор и фактура', { exact: true })).toBeVisible();
	await drawer.getByLabel('Автомобил', { exact: true }).fill('BMW X5');
	await drawer.getByLabel('Телефон', { exact: true }).fill('+359888123456');
	await drawer.getByRole('button', { name: 'Попитай за документи', exact: true }).click();
	await expect(drawer.getByRole('status')).toContainText('Заявката е подготвена');
	expect(payload.source).toBe('services-mobile');
	expect(payload.message).toContain('Регистрация и документи');
	await drawer.getByRole('button', { name: 'Затвори', exact: true }).click();
	await expect(drawer).not.toBeVisible();
	await page.getByRole('link', { name: 'Изчисти', exact: true }).click();
	await page.setViewportSize({ width: 320, height: 740 });
	await expect(cards).toHaveCount(4);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});
