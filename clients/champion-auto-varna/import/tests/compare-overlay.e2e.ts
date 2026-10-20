import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

const titles = ['BMW X4 M Competition', 'Audi SQ5 30T Black Optic', 'BMW XM', 'BMW X3 30e xDrive'];
async function select(page: Page, title: string, locale: 'bg' | 'en' = 'en') {
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('searchbox').fill(title);
	const choice = dialog.getByRole('button', {
		name: (locale === 'en' ? 'Select car: ' : 'Избери автомобил: ') + title,
		exact: true
	});
	await choice.click();
	await expect(choice).toHaveAttribute('aria-pressed', 'true');
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await expect(dialog.getByRole('table')).toHaveCount(0);
}
async function compare(page: Page, count: number, locale: 'bg' | 'en' = 'en') {
	const dialog = page.getByRole('dialog');
	await dialog
		.getByRole('button', {
			name: `${locale === 'en' ? 'Compare' : 'Сравни'} (${count})`,
			exact: true
		})
		.click();
	await expect(dialog.getByRole('table')).toBeVisible();
	await expect(dialog).toBeFocused();
}
async function accessible(page: Page) {
	const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
	expect(
		axe.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
	).toEqual([]);
}
for (const locale of ['bg', 'en'] as const) {
	test(`${locale}: choose several cars before comparing, preserve order and accessible dismissal`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const opener = page.locator('[data-service="comparison"] > a');
		await opener.focus();
		await page.keyboard.press('Enter');
		const dialog = page.getByRole('dialog', {
			name: locale === 'en' ? 'Compare cars' : 'Сравни автомобили',
			exact: true
		});
		await expect(dialog.getByRole('searchbox')).toBeVisible();
		await expect(dialog).toBeFocused();
		await expect(page).toHaveURL(`/${locale}/services`);
		await expect(
			dialog.getByRole('button', { name: `${locale === 'en' ? 'Compare' : 'Сравни'} (0)` })
		).toBeDisabled();
		await select(page, titles[0], locale);
		await expect(
			dialog.getByRole('button', { name: `${locale === 'en' ? 'Compare' : 'Сравни'} (1)` })
		).toBeDisabled();
		await select(page, titles[1], locale);
		await accessible(page);
		await compare(page, 2, locale);
		const carHeaders = dialog.getByRole('columnheader').filter({ has: page.getByRole('link') });
		await expect(carHeaders.nth(0)).toContainText(titles[0]);
		await expect(carHeaders.nth(1)).toContainText(titles[1]);
		await accessible(page);
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(opener).toBeFocused();
		await opener.click();
		await expect(dialog.getByRole('table')).toBeVisible();
		await page.goBack();
		await expect(dialog).not.toBeVisible();
		await expect(page).toHaveURL(`/${locale}/services`);
		await page.goForward();
		await expect(dialog.getByRole('table')).toBeVisible();
		await dialog
			.getByRole('button', { name: locale === 'en' ? 'Done' : 'Готово', exact: true })
			.click();
		await expect(dialog).not.toBeVisible();
	});
}
test('four-car limit permits editing, removal, actual link copying and a native fallback', async ({
	page
}) => {
	await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
	await visit(page, '/en/services');
	await page.locator('[data-service="comparison"] > a').click();
	const dialog = page.getByRole('dialog');
	for (const title of titles) await select(page, title);
	await dialog.getByRole('searchbox').fill('');
	await expect(
		dialog.getByRole('button', { name: /^Select car:/, pressed: false }).first()
	).toBeDisabled();
	await expect(dialog.getByRole('button', { name: /^Select car:/, pressed: true })).toHaveCount(4);
	await compare(page, 4);
	await expect(dialog.getByRole('button', { name: 'Change selection', exact: true })).toBeEnabled();
	await dialog.getByRole('button', { name: 'Remove: ' + titles[0], exact: true }).click();
	await expect(
		dialog.getByRole('columnheader').filter({ has: page.getByRole('link') })
	).toHaveCount(3);
	await expect(dialog.getByRole('button', { name: 'Add a car', exact: true })).toBeEnabled();
	await dialog.getByRole('button', { name: 'Copy link', exact: true }).click();
	await expect(dialog.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
	const copied = await page.evaluate(() => navigator.clipboard.readText());
	const copiedUrl = new URL(copied);
	expect(copiedUrl.pathname).toBe('/en/compare');
	expect(copiedUrl.searchParams.get('ids')?.split(',')).toEqual(
		await page.evaluate(() => JSON.parse(localStorage.getItem('daynight:compare') ?? '[]'))
	);
	await page.evaluate(() =>
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText: () => Promise.reject(new Error('Denied for test')) },
			configurable: true
		})
	);
	await dialog.getByRole('button', { name: 'Copied', exact: true }).click();
	await dialog.getByRole('link', { name: 'Open as a page', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/compare\?ids=/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByRole('columnheader')).toHaveCount(4);
	await page.getByRole('button', { name: 'Clear comparison', exact: true }).click();
	await expect(
		page.getByRole('heading', { name: 'Choose cars to compare', exact: true })
	).toBeVisible();
});
test('two phone columns fit, headers stay while scrolling, and search remains deliberate', async ({
	page
}) => {
	await page.setViewportSize({ width: 768, height: 540 });
	await visit(page, '/en/services');
	await page.locator('[data-service="comparison"] > a').click();
	const dialog = page.getByRole('dialog');
	for (const title of titles.slice(0, 2)) await select(page, title);
	await compare(page, 2);
	await expect(dialog.getByRole('button', { name: 'Done', exact: true })).toBeInViewport();
	await expect(dialog.getByRole('cell', { name: '€43,500', exact: true })).toBeInViewport({
		ratio: 1
	});
	const region = dialog.getByRole('region', { name: 'Vehicle comparison table', exact: true });
	await region.evaluate((element) => {
		element.scrollTop = element.scrollHeight;
	});
	await expect(dialog.getByRole('link', { name: titles[0], exact: true })).toBeInViewport();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Shift+Tab');
	expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
	for (const { width, height } of [
		{ width: 320, height: 844 },
		{ width: 390, height: 844 },
		{ width: 320, height: 540 }
	]) {
		await page.setViewportSize({ width, height });
		await expect(dialog.getByRole('button', { name: 'Done', exact: true })).toBeInViewport();
		expect(await region.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
			true
		);
		const bounds = await dialog.getByRole('columnheader').evaluateAll((headers) =>
			headers.map((header) => {
				const r = header.getBoundingClientRect();
				return { x: r.x, width: r.width };
			})
		);
		expect(bounds).toHaveLength(2);
		for (const box of bounds) {
			expect(box.x).toBeGreaterThanOrEqual(15);
			expect(box.x + box.width).toBeLessThanOrEqual(width - 15);
		}
		await accessible(page);
		await dialog.getByRole('button', { name: 'Add a car', exact: true }).click();
		await expect(dialog.getByRole('searchbox')).not.toBeFocused();
		const choices = await dialog
			.getByRole('group', { name: 'Selected cars', exact: true })
			.getByRole('button')
			.evaluateAll((buttons) =>
				buttons.map((button) => {
					const r = button.getBoundingClientRect();
					return { left: r.left, right: r.right, height: r.height };
				})
			);
		expect(choices).toHaveLength(2);
		for (const choice of choices) {
			expect(choice.left).toBeGreaterThanOrEqual(15);
			expect(choice.right).toBeLessThanOrEqual(width - 15);
			expect(choice.height).toBeGreaterThanOrEqual(42);
		}
		await dialog.getByRole('searchbox').fill('not-a-car');
		await expect(dialog.getByText('No matching cars', { exact: true })).toBeVisible();
		await dialog.getByRole('button', { name: 'Clear search', exact: true }).click();
		await expect(
			dialog.getByRole('button', { name: 'Select car: ' + titles[2], exact: true })
		).toBeVisible();
		await compare(page, 2);
	}
	await dialog.getByRole('button', { name: 'Add a car', exact: true }).click();
	await select(page, titles[2]);
	await compare(page, 3);
	expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
	await region.focus();
	await page.keyboard.press('ArrowRight');
	await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
	await expect(dialog.getByRole('button', { name: 'Done', exact: true })).toBeInViewport();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('Only differences hides equal facts and restores every specification', async ({ page }) => {
	await visit(page, '/en/services');
	await page.locator('[data-service="comparison"] > a').click();
	const dialog = page.getByRole('dialog');
	for (const title of titles.slice(0, 2)) await select(page, title);
	await compare(page, 2);
	await dialog.getByRole('checkbox', { name: 'Only differences', exact: true }).check();
	await expect(dialog.getByRole('rowheader', { name: 'Fuel', exact: true })).toHaveCount(0);
	await expect(dialog.getByRole('rowheader', { name: 'Transmission', exact: true })).toHaveCount(0);
	await expect(dialog.getByRole('rowheader', { name: 'Price', exact: true })).toBeVisible();
	await expect(dialog.getByRole('rowheader', { name: 'Year', exact: true })).toBeVisible();
	await dialog.getByRole('checkbox', { name: 'Only differences', exact: true }).uncheck();
	await expect(dialog.getByRole('rowheader')).toHaveCount(5);
	await dialog.getByRole('button', { name: 'Clear comparison', exact: true }).click();
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await expect(dialog.getByRole('searchbox')).not.toBeFocused();
	await expect(dialog.getByRole('button', { name: 'Compare (0)', exact: true })).toBeDisabled();
});
test('Compare preserves modified links, no-JS and direct URLs', async ({ page, browser }) => {
	await visit(page, '/en/services');
	const opener = page.locator('[data-service="comparison"] > a');
	const newPage = page.context().waitForEvent('page');
	await opener.click({ modifiers: ['Control'] });
	const opened = await newPage;
	await opened.waitForLoadState('domcontentloaded');
	await expect(opened).toHaveURL(/\/en\/compare$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await opened.close();
	const context = await browser.newContext({ javaScriptEnabled: false });
	const native = await context.newPage();
	await native.goto('/en/services');
	await native.locator('[data-service="comparison"] > a').click();
	await expect(native).toHaveURL(/\/en\/compare$/);
	await expect(native.getByRole('heading', { name: 'Compare cars', exact: true })).toBeVisible();
	await context.close();
});
test('Compare reports a loading failure and can retry without leaving Services', async ({
	page
}) => {
	await visit(page, '/en/services');
	await page.route('**/en/compare/__data.json*', (route) => route.abort(), { times: 1 });
	await page.locator('[data-service="comparison"] > a').click();
	const dialog = page.getByRole('dialog');
	await expect(dialog.getByRole('alert')).toHaveText('We couldn’t load the cars.');
	await dialog.getByRole('button', { name: 'Try again', exact: true }).click();
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await expect(page).toHaveURL('/en/services');
});
test('phone menu Compare opens over its original page and returns focus to Menu', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await visit(page, '/en/services');
	const opener = page
		.getByRole('navigation', { name: 'Mobile navigation', exact: true })
		.getByRole('button', { name: 'Menu', exact: true });
	await opener.click();
	await page.getByRole('dialog').getByRole('link', { name: 'Compare cars', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Compare cars', exact: true });
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await expect(page).toHaveURL('/en/services');
	await expect(dialog).toBeFocused();
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	await expect(opener).toBeFocused();
});
