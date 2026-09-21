import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => {
	test.skip(Boolean(isMobile), 'These filters belong to the desktop inventory composition.');
});

test('every filter has a useful input and searching preserves selected makes', async ({ page }) => {
	await visit(page, '/inventory?lang=en&view=3');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: /^Make / }).click();
	const make = page.locator('.compact-field__popover');
	await make.getByRole('searchbox').fill('BMW');
	await make.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	await make.getByRole('searchbox').fill('no-such-make');
	await expect(make.getByRole('status')).toHaveText('No matches');
	await make.getByRole('button', { name: 'Done', exact: true }).click();
	await dialog.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL((url) => url.searchParams.get('brand') === 'BMW');
	await expect(page).toHaveURL((url) => url.searchParams.get('lang') === 'en');
});

test('custom maxima replace presets once and survive navigation and reopening', async ({
	page
}) => {
	await visit(page, '/inventory?lang=en&brand=BMW&maxPrice=50000&view=3');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const dialog = page.getByRole('dialog');
	const price = dialog.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true });
	const mileage = dialog.getByRole('spinbutton', { name: 'Maximum mileage (km)', exact: true });
	await expect(price).toHaveValue('50000');
	await price.fill('42500');
	await mileage.fill('125000');
	await dialog.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.getAll('maxPrice').join() === '42500' &&
			url.searchParams.getAll('maxMileage').join() === '125000' &&
			url.searchParams.get('brand') === 'BMW' &&
			url.searchParams.get('view') === '3' &&
			!url.searchParams.has('priceTo') &&
			!url.searchParams.has('mileageTo')
	);
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	await expect(price).toHaveValue('42500');
	await expect(mileage).toHaveValue('125000');
	await price.fill('30000');
	await expect(price).toHaveValue('30000');
	await mileage.fill('');
	await dialog.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.getAll('maxPrice').join() === '30000' && !url.searchParams.has('maxMileage')
	);
});

test('quick-filter input validates a maximum and clear removes its value', async ({ page }) => {
	await visit(page, '/inventory?lang=en');
	await page.getByRole('button', { name: 'Price', exact: true }).click();
	const dialog = page.getByRole('dialog');
	const input = dialog.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true });
	await input.fill('-1');
	await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(dialog).toBeVisible();
	await expect(input).toBeFocused();
	await input.fill('42500');
	await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(page).toHaveURL((url) => url.searchParams.get('maxPrice') === '42500');
	await page.getByRole('button', { name: /Up to.*42.*500.*EUR/ }).click();
	await expect(input).toHaveValue('42500');
	await dialog.getByRole('button', { name: 'Clear', exact: true }).click();
	await expect(input).toHaveValue('');
	await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(page).toHaveURL((url) => !url.searchParams.has('maxPrice'));
});
