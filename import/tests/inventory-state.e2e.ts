import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test('mobile sorting preserves keywords, exact ranges and repeated URL context across reload', async ({
	page,
	isMobile
}) => {
	test.skip(!isMobile, 'Native mobile sheet contract');
	await visit(
		page,
		'/en/inventory?keyword=BMW&maxPrice=45678&maxMileage=123456&campaign=one&campaign=two'
	);
	await page.getByRole('button', { name: 'Sort: Best Match', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Lowest Price', exact: true }).click();
	await expect(page).toHaveURL((url) => url.searchParams.get('sort') === 'lowest-price');
	const applied = page.url();
	const params = new URL(applied).searchParams;
	expect(params.get('keyword')).toBe('BMW');
	expect(params.get('maxPrice')).toBe('45678');
	expect(params.get('maxMileage')).toBe('123456');
	expect(params.getAll('campaign')).toEqual(['one', 'two']);
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
	await expect(page).toHaveURL(applied);
	await expect(page.getByRole('button', { name: 'Sort: Lowest Price', exact: true })).toBeVisible();
});
