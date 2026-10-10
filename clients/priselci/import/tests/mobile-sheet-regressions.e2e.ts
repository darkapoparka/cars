import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile sheet coverage');

async function stableSheet(page: Page, header: string, action: string) {
	const dialog = page.getByRole('dialog');
	await expect(dialog.locator(header)).toBeInViewport();
	await expect(dialog.getByRole('button', { name: action, exact: true })).toBeInViewport();
	expect(
		await dialog.evaluate((node) => ({
			scroll: node.scrollTop,
			overflows: node.scrollHeight > node.clientHeight + 1
		}))
	).toEqual({ scroll: 0, overflows: false });
}

for (const width of [320, 390]) {
	for (const height of [568, 844]) {
		test(`Import and Sell keep their headers and actions visible at ${width}x${height}`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height });
			await visit(page, '/en/import');
			await page.locator('#import-entry-panel button').click();
			const wizard = page.locator('.bc-import-wizard:visible');
			await wizard
				.locator('[id^="import-wizard-vehicle-"]')
				.fill('https://example.invalid/mobile-qa');
			await wizard.getByRole('button', { name: /^Purchase market:/ }).click();
			await wizard.getByRole('button', { name: 'Germany', exact: true }).click();
			await expect(
				wizard.getByRole('button', { name: 'Purchase market: Germany', exact: true })
			).toBeVisible();
			await wizard.getByRole('button', { name: 'Continue', exact: true }).click();
			await stableSheet(page, '.bc-import-wizard__header', 'Continue');
			await wizard.locator('[id^="import-wizard-budget-"]').fill('30000');
			await wizard.getByRole('button', { name: /^Fuel:/ }).click();
			await wizard.getByRole('button', { name: 'Hybrid', exact: true }).click();
			await expect(wizard.getByRole('button', { name: 'Fuel: Hybrid', exact: true })).toBeVisible();
			await wizard.getByRole('button', { name: 'Automatic', exact: true }).click();
			await wizard.getByRole('button', { name: 'Continue', exact: true }).click();
			await expect(wizard.getByLabel('Name *', { exact: true })).toHaveAccessibleName('Name *');
			await expect(wizard.getByLabel('Phone *', { exact: true })).toHaveAccessibleName('Phone *');
			await wizard.getByLabel('Email', { exact: true }).fill('synthetic@example.invalid');
			expect(
				await wizard
					.locator('input')
					.evaluateAll((nodes) =>
						nodes.every(
							(node) =>
								[...document.querySelectorAll('input')].filter((input) => input.id === node.id)
									.length === 1
						)
					)
			).toBe(true);
			await stableSheet(page, '.bc-import-wizard__header', 'Submit request');
			await wizard.getByRole('button', { name: 'Back', exact: true }).click();
			await stableSheet(page, '.bc-import-wizard__header', 'Continue');
			await wizard.getByRole('button', { name: 'Close', exact: true }).click();
			await expect(page.getByRole('dialog')).not.toBeVisible();
			await expect(
				page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
			).toBeVisible();

			await visit(page, '/en/sell-your-car');
			await page.locator('#sell-entry-panel button').click();
			const sell = page.locator('.sell-flow:visible');
			await sell.locator('#sell-flow-vin').fill('WBA12345678901234');
			await sell.locator('.sell-flow__next').click();
			await sell.locator('#sell-flow-phone').fill('+359000000000');
			await stableSheet(page, '.sell-flow__header', 'Request a valuation');
		});
	}
}

for (const locale of ['en', 'bg']) {
	test(`${locale} home sourcing helper and consultant lead to a native contact page`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		await page.getByRole('tab', { name: locale === 'en' ? 'Import' : 'Внос', exact: true }).click();
		await page
			.getByRole('button', {
				name: locale === 'en' ? 'Listing URL or VIN...' : 'Линк към обява или VIN...',
				exact: true
			})
			.click();
		await expect(page.locator('.daynight-home-search-drawer__hint')).toContainText(
			locale === 'en' ? 'European' : 'Европа'
		);
		await page.keyboard.press('Escape');
		const consultant = page.getByRole('link', {
			name: locale === 'en' ? 'Consultant' : 'Консултант',
			exact: true
		});
		await expect(consultant).toHaveAttribute('href', `/${locale}/contact?topic=import`);
		await consultant.click();
		await expect(page).toHaveURL(new RegExp(`/${locale}/contact\\?topic=import$`));
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			locale === 'en' ? 'Contact' : 'Контакти'
		);
	});
}

test('expanded mobile Import requirements meet automated WCAG 2.2 AA checks', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/import');
	await page.locator('#import-entry-panel button').click();
	await page
		.locator('.bc-import-wizard:visible [id^="import-wizard-vehicle-"]')
		.fill('https://example.invalid/mobile-qa');
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(
		page.getByRole('navigation', { name: 'Mobile navigation', includeHidden: true })
	).not.toBeVisible();
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(
		result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
	).toEqual([]);
});

test('contact validation scrolls the form body and keeps the sheet close control visible', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/contact');
	await page.getByRole('button', { name: 'Open contact form', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: 'Send request', exact: true }).click();
	await expect(dialog.locator('[name="name"]')).toBeFocused();
	await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
	expect(await dialog.evaluate((node) => node.scrollTop)).toBe(0);
	await dialog.locator('[name="message"]').fill('Synthetic mobile keyboard verification.');
	await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
	expect(await dialog.evaluate((node) => node.scrollTop)).toBe(0);
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(result.violations.map(({ id }) => id)).toEqual([]);
});

test('photo viewer contains keyboard focus and browser back restores its trigger', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/inventory/11774283016080050');
	const photo = page.getByRole('button', { name: 'Photos 1', exact: true });
	await photo.focus();
	await page.keyboard.press('Enter');
	const viewer = page.getByRole('dialog', { name: 'Photos', exact: true });
	await expect(viewer).toBeVisible();
	await viewer.getByRole('button', { name: 'Close', exact: true }).focus();
	await page.keyboard.press('Shift+Tab');
	await expect(viewer.locator(':focus')).toHaveCount(1);
	await page.keyboard.press('Tab');
	await expect(viewer.locator(':focus')).toHaveCount(1);
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(result.violations.map(({ id }) => id)).toEqual([]);
	await page.goBack();
	await expect(viewer).not.toBeVisible();
	await expect(photo).toBeFocused();
	await expect(page).toHaveURL(/\/en\/inventory\/11774283016080050$/);
});

for (const locale of ['en', 'bg']) {
	for (const route of ['', '/inventory', '/import']) {
		test(`${locale}${route || '/home'} control names contain their visible labels`, async ({
			page
		}) => {
			await visit(page, `/${locale}${route}`);
			const result = await new AxeBuilder({ page })
				.withRules(['label-content-name-mismatch'])
				.analyze();
			expect(
				result.violations.map(({ id, nodes }) => ({
					id,
					targets: nodes.map(({ target }) => target)
				}))
			).toEqual([]);
		});
	}
}

for (const [route, opener] of [
	['/en', 'Menu'],
	['/en', 'Search brand, model, price...'],
	['/en', 'Open filters'],
	['/en/import', 'How it works']
]) {
	test(`open mobile ${opener} meets automated WCAG 2.2 AA checks`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await visit(page, route);
		await page.getByRole('button', { name: opener, exact: true }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(
			result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
		).toEqual([]);
	});
}

test('native mobile locale dialog meets automated WCAG 2.2 AA checks', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en');
	await page.getByRole('link', { name: 'Country and language · English', exact: true }).click();
	await expect(
		page.getByRole('dialog', { name: 'Country and language', exact: true })
	).toBeVisible();
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(
		result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
	).toEqual([]);
});
