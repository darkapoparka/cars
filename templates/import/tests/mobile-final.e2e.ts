import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile viewport coverage');

for (const locale of ['en', 'bg']) {
	test(`mobile ${locale} account menu keeps legacy routes outside the locale prefix`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		await page
			.getByRole('navigation', {
				name: locale === 'en' ? 'Mobile navigation' : 'Мобилна навигация'
			})
			.getByRole('button')
			.click();
		const menu = page.getByRole('dialog');
		const account = menu.getByRole('link', {
			name: locale === 'en' ? 'Account' : 'Вход / профил',
			exact: true
		});
		await expect(account).toHaveAttribute(
			'href',
			locale === 'en' ? '/account?lang=en' : '/account'
		);
		const messages = menu.getByRole('link', {
			name: locale === 'en' ? 'Messages' : 'Съобщения',
			exact: true
		});
		await expect(messages).toHaveAttribute(
			'href',
			locale === 'en' ? '/account/messages?lang=en' : '/account/messages'
		);
		await account.click();
		await expect(page).toHaveURL(/\/account(?:\?lang=en)?$/);
		await expect(page.locator('body')).not.toContainText('Auxero template route not found');
	});
}

test('mobile home prioritizes its visible photo without downloading desktop artwork', async ({
	page
}) => {
	const desktopImages: string[] = [];
	page.on('request', (request) => {
		if (/inventory-(bmw-x5|audi-sq5)-cutout/.test(request.url())) desktopImages.push(request.url());
	});
	await visit(page, '/en');
	const photo = page.locator('[data-daynight-home-vehicles] .card--img').first();
	await expect(photo).toHaveAttribute('loading', 'eager');
	await expect(photo).toHaveAttribute('fetchpriority', 'high');
	expect(desktopImages).toEqual([]);
});

test('mobile comparison supports adding, removing and clearing cars', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 844 });
	await visit(page, '/en/compare');
	const choose = page.getByRole('combobox', { name: 'Add a car (up to four)' });
	await choose.selectOption({ label: 'BMW X3 30e xDrive' });
	await choose.selectOption({ label: 'BMW X4 M Competition' });
	const table = page.getByRole('table', { name: 'Vehicle specifications' });
	await expect(table.getByRole('columnheader')).toHaveCount(3);
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(result.violations.map(({ id }) => id)).toEqual([]);
	await table
		.getByRole('columnheader')
		.filter({ hasText: 'BMW X3' })
		.getByRole('button', { name: 'Remove' })
		.click();
	await expect(table.getByRole('columnheader')).toHaveCount(2);
	await page.getByRole('button', { name: 'Clear comparison' }).click();
	await expect(page.getByRole('heading', { name: 'Choose cars to compare' })).toBeVisible();
});

for (const width of [320, 390]) {
	test(`vehicle toolbar remains keyboard reachable outside the persistent panel at ${width}`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 844 });
		await visit(page, '/en/inventory/11774283016080050');
		const save = page.getByRole('button', { name: 'Save', exact: true });
		await save.focus();
		await expect(save).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(save).toHaveAttribute('aria-pressed', 'true');
		await page.keyboard.press('Enter');
		await expect(save).toHaveAttribute('aria-pressed', 'false');
		const photo = page.getByRole('button', { name: 'Photos 1', exact: true });
		await photo.focus();
		await expect(photo).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('.daynight-mobile-pdp__viewer')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(photo).toBeFocused();
		await page.getByRole('button', { name: 'Inquire', exact: true }).click();
		const inquiry = page.getByRole('dialog', { name: 'Send Inquiry about Vehicle', exact: true });
		await expect(inquiry).toBeVisible();
		await inquiry.getByRole('button', { name: 'Close', exact: true }).focus();
		await page.keyboard.press('Shift+Tab');
		await expect(inquiry.locator(':focus')).toHaveCount(1);
		await page.keyboard.press('Escape');
		await expect(inquiry).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Inquire', exact: true })).toBeFocused();
	});
}

for (const route of [
	'/en',
	'/en/inventory',
	'/en/inventory/11774283016080050',
	'/en/contact',
	'/en/import',
	'/en/sell-your-car',
	'/en/financing',
	'/en/calculator',
	'/en/about',
	'/en/services',
	'/en/blog',
	'/en/blog/vnos-ot-kanada-proverka',
	'/en/reviews',
	'/en/faqs',
	'/en/privacy',
	'/en/terms',
	'/en/cookies',
	'/en/account/favorites',
	'/en/compare',
	'/en/locale-settings'
]) {
	test(`English mobile WCAG 2.2 AA and reflow: ${route}`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 844 });
		const response = await visit(page, route);
		expect(response?.status()).toBe(200);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
			true
		);
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(
			result.violations.map(({ id, nodes }) => ({
				id,
				nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary }))
			}))
		).toEqual([]);
	});
}
