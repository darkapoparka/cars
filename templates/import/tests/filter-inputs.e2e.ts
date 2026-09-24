import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => {
	test.skip(Boolean(isMobile), 'Desktop filter composition only.');
});

for (const locale of ['en', 'bg']) {
	test(`${locale}: fields and first option retain their position across categories`, async ({
		page
	}) => {
		const categories =
			locale === 'en'
				? ['Search', 'Make', 'Model', 'Price', 'Mileage']
				: ['Търсене', 'Марка', 'Модел', 'Цена', 'Пробег'];
		for (const width of [768, 1024, 1440, 1920]) {
			await page.setViewportSize({ width, height: 800 });
			await visit(page, `/${locale}/inventory`);
			await page
				.getByRole('button', {
					name: locale === 'en' ? 'All filters' : 'Всички филтри',
					exact: true
				})
				.click();
			const dialog = page.getByRole('dialog');
			await dialog.getByRole('tab', { name: categories[0], exact: true }).click();
			const baseline = (await dialog.locator('.filter-control').boundingBox())!;
			const baselineInput = (await dialog.getByRole('searchbox').boundingBox())!;
			let firstOption;
			for (const name of categories.slice(1)) {
				await dialog.getByRole('tab', { name, exact: true }).click();
				const fields = await dialog.locator('.filter-control').all();
				const bounds = await Promise.all(fields.map((field) => field.boundingBox()));
				expect(bounds[0]!.x, `${width}: ${name} left edge`).toBe(baseline.x);
				const last = bounds.at(-1)!;
				expect(last!.x + last!.width, `${width}: ${name} right edge`).toBe(
					baseline.x + baseline.width
				);
				for (const [index, field] of fields.entries()) {
					expect(bounds[index]!.y, `${width}: ${name} top edge`).toBe(baseline.y);
					expect(bounds[index]!.height).toBe(baseline.height);
					const input = (await field.locator('input').boundingBox())!;
					expect(input.y).toBe(baselineInput.y);
					expect(input.height).toBe(baselineInput.height);
				}
				const option = await dialog.locator('.filter-choice').first().boundingBox();
				firstOption ??= option;
				expect(option, `${width}: ${name} first option`).toEqual(firstOption);
			}
			await dialog.getByRole('tab', { name: categories[1], exact: true }).click();
			await dialog.getByRole('checkbox', { name: 'BMW', exact: true }).check();
			await dialog.getByRole('searchbox').fill('no-matching-make');
			await expect(dialog.getByRole('status')).toHaveText(
				locale === 'en' ? 'No matches' : 'Няма съвпадения'
			);
			expect(await dialog.locator('.filter-control').boundingBox()).toEqual(baseline);
			await page.keyboard.press('Escape');
		}
	});
}

test('clearing a category retains other drafts and returns focus to its input', async ({
	page
}) => {
	await visit(page, '/en/inventory?brand=BMW&minPrice=10000&maxPrice=40000');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('tab', { name: /^Price/ }).click();
	await dialog.getByRole('button', { name: 'Clear selection', exact: true }).click();
	await expect(
		dialog.getByRole('spinbutton', { name: 'Minimum price (EUR)', exact: true })
	).toBeFocused();
	await expect(
		dialog.getByRole('spinbutton', { name: 'Minimum price (EUR)', exact: true })
	).toBeEmpty();
	await expect(
		dialog.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true })
	).toBeEmpty();
	await dialog.getByRole('tab', { name: /^Make/ }).click();
	await expect(dialog.getByRole('checkbox', { name: 'BMW', exact: true })).toBeChecked();
	await dialog.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('brand') === 'BMW' &&
			!url.searchParams.has('minPrice') &&
			!url.searchParams.has('maxPrice')
	);
});

test('desktop categories stay readable and stationary across viewport sizes', async ({ page }) => {
	for (const width of [768, 1024, 1440, 1920]) {
		await page.setViewportSize({ width, height: 800 });
		await visit(page, '/en/inventory');
		await page.getByRole('button', { name: 'All filters', exact: true }).click();
		const dialog = page.getByRole('dialog');
		const footer = await dialog.locator('.site-dialog__footer').boundingBox();
		for (const name of ['Make', 'Model', 'Price', 'Fuel', 'Extras']) {
			await dialog.getByRole('tab', { name, exact: true }).click();
			await expect(dialog.getByRole('button', { name: 'Show cars', exact: true })).toBeInViewport();
			expect((await dialog.locator('.site-dialog__footer').boundingBox())!.y).toBe(footer!.y);
			const metrics = await dialog
				.locator('[role="tab"], .filter-control input, .filter-choice, .inventory-all__apply')
				.evaluateAll((nodes) =>
					nodes.map((node) => ({
						text: node.textContent,
						size: parseFloat(getComputedStyle(node).fontSize),
						overflows: node.scrollWidth > node.clientWidth + 1
					}))
				);
			for (const metric of metrics) {
				expect(metric.size, `${width}: ${metric.text}`).toBeGreaterThanOrEqual(20);
				expect(metric.overflows, `${width}: ${metric.text}`).toBe(false);
			}
		}
		await dialog.getByRole('tab', { name: 'Make', exact: true }).click();
		const tabs = await dialog.getByRole('tablist').boundingBox();
		await dialog.getByRole('checkbox', { name: 'BMW', exact: true }).check();
		expect(await dialog.getByRole('tablist').boundingBox()).toEqual(tabs);
		if (width === 1440) {
			const accessibility = await new AxeBuilder({ page })
				.include('[role="dialog"]')
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
				.analyze();
			expect(accessibility.violations).toEqual([]);
		}
		await page.keyboard.press('Escape');
	}
});

test('category tabs and search stay visible while long choices scroll', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 600 });
	await visit(page, '/en/inventory');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog.getByRole('searchbox')).toBeFocused();
	await expect(dialog.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
	await dialog.getByRole('tab', { name: 'Model', exact: true }).click();
	const footer = await dialog.locator('.site-dialog__footer').boundingBox();
	const search = await dialog.getByRole('searchbox').boundingBox();
	const options = dialog.locator('.desktop-picker__options');
	await options.evaluate((n) => (n.scrollTop = n.scrollHeight));
	expect(await options.evaluate((n) => n.scrollTop)).toBeGreaterThan(0);
	expect(await dialog.getByRole('searchbox').boundingBox()).toEqual(search);
	await expect(dialog.getByRole('searchbox')).toBeInViewport();
	expect((await dialog.locator('.site-dialog__footer').boundingBox())!.y).toBe(footer!.y);
	await dialog.getByRole('searchbox').fill('Audi');
	await expect(dialog.getByRole('checkbox', { name: 'Audi A7', exact: true })).toBeInViewport();
	await dialog.getByRole('tab', { name: 'Price', exact: true }).click();
	await expect.poll(() => dialog.locator('.range-presets').evaluate((n) => n.scrollTop)).toBe(0);
	await expect(
		dialog.getByRole('spinbutton', { name: 'Minimum price (EUR)', exact: true })
	).toBeInViewport();
	await dialog.getByRole('tab', { name: 'Fuel', exact: true }).click();
	await expect(dialog.getByRole('searchbox')).toHaveCount(0);
	await expect(dialog.getByRole('checkbox', { name: 'Petrol', exact: true })).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(1);
	await dialog.getByRole('tab', { name: 'Fuel', exact: true }).press('ArrowLeft');
	await expect(dialog.getByRole('tab', { name: 'Gearbox', exact: true })).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'All filters', exact: true })).toBeFocused();
});

test('draft makes update models and ranges submit the same filters as the preview', async ({
	page
}) => {
	await visit(page, '/en/inventory?brand=BMW&view=5');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const d = page.getByRole('dialog');
	await d.getByRole('tab', { name: 'Model', exact: true }).click();
	await d.getByRole('checkbox').first().check();
	await d.getByRole('tab', { name: /^Make/ }).click();
	await d.getByRole('checkbox', { name: 'BMW', exact: true }).uncheck();
	await d.getByRole('checkbox', { name: 'Mazda', exact: true }).check();
	await d.getByRole('tab', { name: 'Model', exact: true }).click();
	await expect(d.getByRole('checkbox')).toHaveCount(1);
	await d.getByRole('checkbox').check();
	await d.getByRole('tab', { name: 'Price', exact: true }).click();
	await d.getByRole('spinbutton', { name: 'Minimum price (EUR)', exact: true }).fill('10000');
	await d.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true }).fill('42500');
	await d.getByRole('tab', { name: 'Mileage', exact: true }).click();
	await d.getByRole('spinbutton', { name: 'Maximum mileage (km)', exact: true }).fill('125000');
	await expect(d.getByRole('button', { name: 'Show cars', exact: true })).toHaveAttribute(
		'aria-busy',
		'false'
	);
	const count = Number(await d.locator('.inventory-all__count').innerText());
	await d.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(u) =>
			u.searchParams.get('brand') === 'Mazda' &&
			u.searchParams.get('q') === 'CX-9' &&
			u.searchParams.get('minPrice') === '10000' &&
			u.searchParams.get('maxPrice') === '42500' &&
			u.searchParams.get('maxMileage') === '125000' &&
			u.searchParams.get('view') === '5'
	);
	const r = await page.request.get('/api/inventory/count?' + new URL(page.url()).searchParams);
	expect((await r.json()).count).toBe(count);
});

test('invalid ranges reveal their category and focus the invalid input', async ({ page }) => {
	await visit(page, '/en/inventory');
	await page.getByRole('button', { name: 'Price', exact: true }).click();
	const d = page.getByRole('dialog');
	await expect(d.getByRole('tab', { name: 'Price', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	const low = d.getByRole('spinbutton', { name: 'Minimum price (EUR)', exact: true });
	const high = d.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true });
	await low.fill('50000');
	await high.fill('30000');
	await d.getByRole('tab', { name: 'Make', exact: true }).click();
	await d.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(high).toBeFocused();
	await expect(page).not.toHaveURL(/maxPrice=/);
	await high.fill('60000');
	await high.press('Enter');
	await expect(page).toHaveURL(
		(u) => u.searchParams.get('minPrice') === '50000' && u.searchParams.get('maxPrice') === '60000'
	);
});

test('searched-out choices survive switching categories and closing discards the draft', async ({
	page
}) => {
	await visit(page, '/en/inventory');
	const trigger = page.getByRole('button', { name: 'Make', exact: true });
	await trigger.click();
	const d = page.getByRole('dialog');
	await d.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	await d.getByRole('searchbox').fill('no-match');
	await expect(d.getByRole('status')).toHaveText('No matches');
	await d.getByRole('searchbox').press('Enter');
	await expect(d).toBeVisible();
	await d.getByRole('tab', { name: 'Fuel', exact: true }).click();
	await d.getByRole('tab', { name: /^Make/ }).click();
	await expect(d.getByRole('checkbox', { name: 'BMW', exact: true })).toBeChecked();
	await d.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(trigger).toBeFocused();
	await trigger.click();
	await expect(d.getByRole('checkbox', { name: 'BMW', exact: true })).not.toBeChecked();
});

test('clear removes visible and passthrough filters while retaining the view', async ({ page }) => {
	await visit(page, '/en/inventory?brand=BMW&minYear=2018&minPrice=20000&keyword=X5&view=3');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const d = page.getByRole('dialog');
	await d.getByRole('button', { name: 'Clear', exact: true }).click();
	await expect(d.locator('.inventory-all__count')).toHaveText('42');
	await d.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(u) =>
			!u.searchParams.has('brand') &&
			!u.searchParams.has('minYear') &&
			!u.searchParams.has('minPrice') &&
			!u.searchParams.get('keyword') &&
			u.searchParams.get('view') === '3'
	);
});

test('zero results recover and unavailable counts do not block filtering', async ({ page }) => {
	await visit(page, '/en/inventory');
	await page.getByRole('button', { name: 'Price', exact: true }).click();
	const d = page.getByRole('dialog');
	const actionBounds = await d
		.getByRole('button', { name: 'Show cars', exact: true })
		.boundingBox();
	await d.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true }).fill('1');
	await expect(d.locator('.inventory-all__count')).toHaveText('0');
	await expect(d.locator('.inventory-all__empty')).toBeVisible();
	expect((await d.getByRole('button', { name: 'Show cars', exact: true }).boundingBox())!.y).toBe(
		actionBounds!.y
	);
	await page.route('**/api/inventory/count?**', (r) =>
		r.fulfill({ status: 503, body: 'unavailable' })
	);
	await d.getByRole('spinbutton', { name: 'Maximum price (EUR)', exact: true }).fill('42500');
	await expect(d.getByRole('button', { name: 'Show cars', exact: true })).toHaveAttribute(
		'aria-busy',
		'false'
	);
	await expect(d.locator('.inventory-all__count')).toBeEmpty();
	await d.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(/maxPrice=42500/);
});

test('free-text inventory search is retained when adding a filter', async ({ page }) => {
	await visit(page, '/en/inventory?q=Sport');
	await page.getByRole('button', { name: 'All filters', exact: true }).click();
	const d = page.getByRole('dialog');
	await d.getByRole('tab', { name: /^Search/ }).click();
	await expect(d.getByRole('searchbox')).toHaveValue('Sport');
	await d.getByRole('tab', { name: 'Make', exact: true }).click();
	await d.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	await d.getByRole('button', { name: 'Show cars', exact: true }).click();
	await expect(page).toHaveURL(
		(u) => u.searchParams.get('brand') === 'BMW' && u.searchParams.get('keyword') === 'Sport'
	);
});
