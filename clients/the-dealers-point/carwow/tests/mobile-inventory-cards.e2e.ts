import { expect, test } from '@playwright/test';

for (const width of [320, 390, 428]) {
	test(`mobile inventory cards stay uncluttered at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.goto('/inventory');
		const card = page.locator('.mobile-inventory-card').first();
		await expect(card).toBeVisible();
		await expect(card.locator('h3')).toHaveText('Mercedes-Benz GLA 45 AMG');
		await expect(card.locator('h3')).toHaveCSS('font-weight', '650');
		await expect(card.locator('.mobile-inventory-card__price strong')).toHaveCSS(
			'font-size',
			'20px'
		);
		await expect(card.locator('button')).toHaveCount(0);
		await expect(card.locator('.mobile-inventory-card__tools')).toHaveCount(0);
		await expect(card.locator('.mobile-inventory-card__arrow')).toHaveCSS(
			'background-color',
			'rgba(0, 0, 0, 0)'
		);
		await expect(card.locator('.mobile-inventory-card__arrow svg')).toHaveCSS('width', '20px');
		await expect(card.locator('.mobile-inventory-card__arrow svg path').first()).toHaveCSS(
			'stroke',
			'rgb(15, 20, 23)'
		);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		const link = card.locator('.mobile-inventory-card__link');
		const href = await link.getAttribute('href');
		await link.focus();
		await expect(link).toBeFocused();
		await expect(link).toHaveCSS('outline-style', 'solid');
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(new RegExp(`${href}$`));
		await expect(page.locator('.mobile-detail__nav-button--save')).toBeVisible();
		await expect(page.locator('.mobile-detail__nav-button--compare')).toBeVisible();
	});
}
