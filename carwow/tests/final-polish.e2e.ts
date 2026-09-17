import { expect, test, type Page } from '@playwright/test';

async function clearGarage(page: Page) {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.evaluate(() => {
		localStorage.clear();
		sessionStorage.clear();
	});
}

test.describe('final polish public journeys', () => {
	test('mobile detail actions persist into favorites and compare', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });
		const card = page.locator('.mobile-inventory-card').first();
		await expect(card.locator('button')).toHaveCount(0);
		await card.getByRole('link').click();
		const save = page.locator('.mobile-detail__nav-button--save');
		const compare = page.locator('.mobile-detail__nav-button--compare');
		await save.click();
		await compare.click();
		await expect(save).toHaveAttribute('aria-pressed', 'true');
		await expect(compare).toHaveAttribute('aria-pressed', 'true');
		await page.goto('/favorites', { waitUntil: 'networkidle' });
		await expect(page.locator('.mobile-favorites-card')).toHaveCount(1);
		await page.reload({ waitUntil: 'networkidle' });
		await expect(page.locator('.mobile-favorites-card')).toHaveCount(1);
		await page.goto('/compare', { waitUntil: 'networkidle' });
		await expect(
			page.getByRole('region', { name: 'Избрани автомобили за сравнение' }).locator('article')
		).toHaveCount(1);
	});

	test('compare refuses the fourth selection and announces the limit', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });
		const paths = await page
			.locator('.mobile-inventory-card__link')
			.evaluateAll((links) => links.slice(0, 4).map((link) => link.getAttribute('href')!));
		for (const [index, path] of paths.entries()) {
			await page.goto(path, { waitUntil: 'networkidle' });
			const compare = page.locator('.mobile-detail__nav-button--compare');
			await compare.click();
			await expect(compare).toHaveAttribute('aria-pressed', index < 3 ? 'true' : 'false');
		}
		await expect(page.getByRole('alert')).toContainText('до 3 автомобила');
		await page.goto('/compare', { waitUntil: 'networkidle' });
		await expect(page.locator('.mobile-compare .cars article')).toHaveCount(3);
		while (await page.locator('.mobile-compare .photo button').count())
			await page.locator('.mobile-compare .photo button').first().click();
		await expect(page.locator('.mobile-compare .empty')).toBeVisible();
	});

	test('mobile sheets restore scroll locking and close on Escape', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });

		await page.locator('#mobile-inventory-search').click();
		await expect(page.locator('.mobile-fullsheet')).toBeVisible();
		await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
		await page.keyboard.press('Escape');
		await expect(page.locator('.mobile-fullsheet')).toHaveCount(0);
		await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');

		await page.goto('/', { waitUntil: 'networkidle' });
		await page.getByRole('button', { name: 'Меню' }).click();
		await expect(page.locator('#mobile-menu-sheet')).toBeVisible();
		await expect(page.getByRole('link', { name: /Сравнение/ })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('#mobile-menu-sheet')).toHaveCount(0);
	});

	test('mobile route shells do not mount duplicate landmarks', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);

		for (const pathname of [
			'/contact',
			'/services',
			'/sell-your-car',
			'/about',
			'/favorites',
			'/financing',
			'/sell-your-car/request',
			'/blog/kak-da-kupim-upotrebyavan-avtomobil',
			'/reviews',
			'/faq'
		]) {
			await page.goto(pathname, { waitUntil: 'networkidle' });
			expect(await page.locator('#main-content').count(), pathname).toBe(1);
		}
	});

	test('desktop listing action state is shared with compare route', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });

		const firstCard = page.locator('[data-daynight-vehicle-card]').first();
		await firstCard.getByRole('button', { name: /сравнение/ }).click();
		await expect(page.locator('[data-compare-tray]')).toBeVisible();
		await page
			.locator('[data-compare-tray]')
			.getByRole('link', { name: /Сравни/ })
			.click();
		await expect(page).toHaveURL(/\/compare$/);
		await expect(page.locator('.card-details')).toBeVisible();
	});
});
