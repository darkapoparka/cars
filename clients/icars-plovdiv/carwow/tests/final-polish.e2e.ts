import { expect, test, type Page } from '@playwright/test';

async function clearGarage(page: Page) {
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	await page.evaluate(() => {
		localStorage.clear();
		sessionStorage.clear();
	});
}

test.describe('final polish public journeys', () => {
	test('mobile listing actions stay in sync with favorites and compare', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });

		expect(await page.locator('#main-content').count()).toBe(1);
		const firstCard = page.locator('.mobile-inventory-card').first();
		await expect(firstCard).toBeVisible();

		const compareButton = firstCard.getByRole('button', { name: /сравнение/ });
		const favoriteButton = firstCard.getByRole('button', { name: /любими/ });
		await compareButton.click();
		await favoriteButton.click();
		await expect(compareButton).toHaveAttribute('aria-pressed', 'true');
		await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('[data-compare-tray]')).toBeVisible();

		await page.goto('/favorites', { waitUntil: 'networkidle' });
		await expect(page.locator('.mobile-favorites-card')).toHaveCount(1);

		await page.goto('/compare', { waitUntil: 'networkidle' });
		await expect(page.locator('.card-details')).toBeVisible();
		await expect(page.locator('.compare-empty')).toHaveCount(0);
	});

	test('compare keeps the first three selections and exposes its limit', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await clearGarage(page);
		await page.goto('/inventory', { waitUntil: 'networkidle' });

		const cards = page.locator('.mobile-inventory-card');
		for (let index = 0; index < 4; index += 1) {
			await cards
				.nth(index)
				.getByRole('button', { name: /сравнение/ })
				.click();
		}

		for (let index = 0; index < 3; index += 1) {
			await expect(cards.nth(index).getByRole('button', { name: /сравнение/ })).toHaveAttribute(
				'aria-pressed',
				'true'
			);
		}
		await expect(cards.nth(3).getByRole('button', { name: /сравнение/ })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
		await expect(page.getByRole('alert')).toContainText('до 3 автомобила');

		await page.locator('[data-compare-tray]').getByRole('button', { name: 'Изчисти' }).click();
		await expect(page.locator('[data-compare-tray]')).toHaveCount(0);
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

		for (const pathname of ['/contact', '/services', '/sell-your-car', '/about', '/favorites']) {
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
