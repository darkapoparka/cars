import { expect, test } from '@playwright/test';

test('mobile blog combines category and search, restores history and opens articles', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/blog');
	const categories = page.getByRole('navigation', { name: 'Категории публикации' });
	const cards = page.locator('.mobile-blog__card');
	await expect(cards).toHaveCount(6);
	await categories.getByRole('link', { name: 'Продажба', exact: true }).click();
	await expect(cards).toHaveCount(2);
	await page.getByRole('searchbox').fill('комплект кадри');
	await page.getByRole('searchbox').press('Enter');
	await expect(cards).toHaveCount(1);
	await expect(cards.first()).toContainText('Снимки за автомобилна обява');
	await cards.first().click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Снимки за автомобилна обява: полезният комплект кадри'
	);
	await page.getByRole('link', { name: 'Назад към блога', exact: true }).click();
	await expect(page.getByRole('searchbox')).toHaveValue('комплект кадри');
	await expect(cards).toHaveCount(1);
	await categories.getByRole('link', { name: 'Покупка', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Няма намерени публикации' })).toBeVisible();
	await categories.getByRole('link', { name: 'Всички', exact: true }).click();
	await expect(page.getByRole('searchbox')).toHaveValue('комплект кадри');
	await expect(cards).toHaveCount(1);
	await page.getByRole('link', { name: 'Изчисти', exact: true }).click();
	await expect(cards).toHaveCount(6);
	await categories.getByRole('link', { name: 'Новини', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Все още няма новини' })).toBeVisible();
	await page.getByRole('link', { name: 'Виж всички статии', exact: true }).click();
	await expect(cards).toHaveCount(6);
	await page.setViewportSize({ width: 320, height: 740 });
	await expect(categories).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.locator('.blog-page')).toBeVisible();
	await expect(page.locator('.mobile-blog')).toHaveCount(0);
});
