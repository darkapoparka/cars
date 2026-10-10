import { expect, test, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit, controlHeight } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile intake and enquiry treatment');

async function fixedAction(page: Page, dialog: Locator) {
	await expect(dialog.locator('.bc-mobile-sheet__header')).toBeInViewport();
	await expect(dialog.locator('.bc-mobile-sheet__footer button')).toBeInViewport();
	expect(await dialog.evaluate((node) => node.scrollTop)).toBe(0);
	expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
	expect(
		await dialog
			.locator('.bc-mobile-sheet__footer button')
			.evaluate((node) => Math.round(node.getBoundingClientRect().height))
	).toBe(await controlHeight(dialog.locator('.bc-mobile-sheet__footer button')));
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
		true
	);
}

for (const locale of ['en', 'bg'] as const) {
	for (const width of [320, 390]) {
		test(`${locale}: Import preferences retain the draft across selectors at ${width}px`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
			await visit(page, `/${locale}/import`);
			await page.locator('#import-entry-panel button').click();
			const wizard = page.locator('.bc-import-wizard:visible');
			await wizard.locator('[id^="import-wizard-vehicle-"]').fill('https://example.invalid/qa');
			await wizard.locator('[data-intake-next]').click();
			await wizard.locator('[id^="import-wizard-year-"]').fill('2021');
			await wizard.locator('[id^="import-wizard-budget-"]').fill('30000');
			await wizard.locator('[id^="import-wizard-notes-"]').fill('Synthetic preference draft');
			const fuel = wizard.locator('[id^="import-wizard-fuel-"]');
			await fuel.click();
			await wizard
				.getByRole('button', { name: locale === 'en' ? 'Hybrid' : 'Хибрид', exact: true })
				.click();
			await expect(fuel).toContainText(locale === 'en' ? 'Hybrid' : 'Хибрид');
			await expect(fuel).toBeFocused();
			const timeframe = wizard.locator('[id^="import-wizard-timeframe-"]');
			await timeframe.click();
			await expect(wizard.getByRole('heading')).toContainText(
				locale === 'en' ? 'Select timeframe' : 'Избери срок'
			);
			await page.goBack();
			await expect(timeframe).toBeFocused();
			await timeframe.click();
			await wizard
				.getByRole('button', {
					name: locale === 'en' ? 'Within 1 month' : 'До 1 месец',
					exact: true
				})
				.click();
			await expect(timeframe).toContainText(locale === 'en' ? 'Within 1 month' : 'До 1 месец');
			await expect(wizard.locator('[id^="import-wizard-year-"]')).toHaveValue('2021');
			await expect(wizard.locator('[id^="import-wizard-budget-"]')).toHaveValue('30000');
			await expect(wizard.locator('[id^="import-wizard-notes-"]')).toHaveValue(
				'Synthetic preference draft'
			);
			expect(
				await wizard.locator('fieldset button').evaluateAll((nodes) => ({
					count: nodes.length,
					rows: new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().top))).size,
					heights: nodes.map((node) => Math.round(node.getBoundingClientRect().height))
				}))
			).toEqual({
				count: 2,
				rows: 1,
				heights: Array(2).fill(await controlHeight(wizard.locator('fieldset button').first()))
			});
			await fuel.click();
			await wizard
				.getByRole('button', { name: locale === 'en' ? 'Any fuel' : 'Без значение', exact: true })
				.click();
			await expect(fuel).toContainText(locale === 'en' ? 'Any fuel' : 'Без значение');
			await expect(wizard.locator('[data-intake-next]')).toBeInViewport();
			const result = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(result.violations.map(({ id }) => id)).toEqual([]);
		});

		for (const target of ['contact', 'vehicle'] as const) {
			test(`${locale}: ${target} enquiry keeps Send visible at ${width}px and short heights`, async ({
				page
			}) => {
				await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
				await visit(
					page,
					`/${locale}/${target === 'contact' ? 'contact' : 'inventory/21778068579001193'}`
				);
				const opener =
					target === 'contact'
						? page.getByRole('button', {
								name: locale === 'en' ? 'Open contact form' : 'Отвори форма за контакт',
								exact: true
							})
						: page.locator('.daynight-mobile-pdp__cta--primary');
				await opener.click();
				const dialog = page.getByRole('dialog').filter({ has: page.locator('form') });
				await expect(dialog).toBeFocused();
				await fixedAction(page, dialog);
				await dialog.locator('.bc-mobile-sheet__footer button').click();
				await expect(dialog.locator('[name="name"]')).toBeFocused();
				await dialog.locator('[name="message"]').fill('Synthetic mobile enquiry draft');
				await page.setViewportSize({ width, height: 360 });
				await fixedAction(page, dialog);
				await expect(dialog.locator('[name="message"]')).toHaveValue(
					'Synthetic mobile enquiry draft'
				);
				await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
				const result = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
					.analyze();
				expect(result.violations.map(({ id }) => id)).toEqual([]);
				await page.goBack();
				await expect(dialog).not.toBeVisible();
				await expect(opener).toBeFocused();
			});
		}
	}
}

test('Contact footer preserves a failed draft, saves one demo request and resets for a new one', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/contact?topic=trade-in');
	await page.getByRole('button', { name: 'Open contact form', exact: true }).click();
	const dialog = page.getByRole('dialog');
	const form = dialog.locator('form');
	await form.locator('[name="name"]').fill('X');
	await form.locator('[name="phone"]').fill('+359000000000');
	await form.locator('[name="message"]').fill('Synthetic failure and retry verification');
	await form.evaluate((node) => ((node as HTMLFormElement).noValidate = true));
	await dialog.locator('footer button').click();
	await expect(form.locator('[name="name"]')).toHaveAttribute('aria-invalid', 'true');
	await expect(form.locator('[name="name"]')).toBeFocused();
	await expect(form.locator('[name="phone"]')).toHaveValue('+359000000000');
	await expect(form.locator('[name="message"]')).toHaveValue(
		'Synthetic failure and retry verification'
	);
	await fixedAction(page, dialog);
	await form.locator('[name="name"]').fill('Synthetic Verification');
	let releaseRequest!: () => void;
	const gate = new Promise<void>((resolve) => (releaseRequest = resolve));
	let posts = 0;
	await page.route('**/en/contact?topic=trade-in', async (route) => {
		if (route.request().method() !== 'POST') return route.continue();
		posts += 1;
		await gate;
		return route.continue();
	});
	await dialog.locator('footer button').click();
	await expect(dialog.locator('footer button')).toBeDisabled();
	await form.locator('[name="name"]').press('Enter');
	expect(posts).toBe(1);
	releaseRequest();
	await expect(dialog.getByRole('status')).toContainText('No message was sent to a dealer.');
	await expect(dialog.locator('footer button')).toHaveCount(0);
	await dialog.getByRole('button', { name: 'New request', exact: true }).click();
	await expect(dialog.locator('[name="name"]')).toHaveValue('');
	await fixedAction(page, dialog);
});

test('Vehicle footer retains a failed draft and the retry keeps its vehicle context', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/inventory/21778068579001193');
	await page.locator('.daynight-mobile-pdp__cta--primary').click();
	const dialog = page.getByRole('dialog').filter({ has: page.locator('form') });
	await dialog.locator('[name="name"]').fill('Synthetic Verification');
	await dialog.locator('[name="phone"]').fill('+359000000000');
	await dialog.locator('[name="message"]').fill('Synthetic vehicle retry verification');
	await dialog.locator('[name="subject"]').selectOption({ index: 2 });
	await page.route('**/api/inquiries', (route) => route.abort(), { times: 1 });
	await dialog.locator('footer button').click();
	await expect(dialog.locator('[aria-live]')).toContainText('The request was not saved.');
	await expect(dialog.locator('[aria-live]')).toBeInViewport();
	await expect(dialog.locator('[name="name"]')).toHaveValue('Synthetic Verification');
	await expect(dialog.locator('[name="message"]')).toHaveValue(
		'Synthetic vehicle retry verification'
	);
	const response = page.waitForResponse(
		(result) => result.url().endsWith('/api/inquiries') && result.request().method() === 'POST'
	);
	await dialog.locator('footer button').click();
	const saved = await response;
	expect(saved.request().postDataJSON()).toMatchObject({
		source: 'vehicle-detail-mobile',
		vehicleSlug: '21778068579001193',
		message: 'Synthetic vehicle retry verification'
	});
	await expect(dialog.locator('[aria-live]')).toContainText('No message was sent to a dealer.');
	await expect(dialog.locator('[aria-live]')).toBeInViewport();
	await expect(dialog.locator('footer button')).toHaveText('Close');
	await dialog.locator('footer button').click();
	await expect(dialog).not.toBeVisible();
});

test('a late Contact response cannot replace a newly reopened enquiry', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/contact');
	const opener = page.getByRole('button', { name: 'Open contact form', exact: true });
	await opener.click();
	const dialog = page.getByRole('dialog');
	await dialog.locator('[name="name"]').fill('Synthetic Verification');
	await dialog.locator('[name="phone"]').fill('+359000000000');
	let releaseRequest!: () => void;
	const gate = new Promise<void>((resolve) => (releaseRequest = resolve));
	await page.route('**/en/contact', async (route) => {
		if (route.request().method() !== 'POST') return route.continue();
		await gate;
		return route.continue();
	});
	const response = page.waitForResponse(
		(result) => result.url().endsWith('/en/contact') && result.request().method() === 'POST'
	);
	await dialog.locator('footer button').click();
	await expect(dialog.locator('footer button')).toBeDisabled();
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	await opener.click();
	await dialog.locator('[name="message"]').fill('A new synthetic enquiry draft');
	releaseRequest();
	await (await response).finished();
	await page.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
			)
	);
	await expect(dialog.locator('[name="message"]')).toHaveValue('A new synthetic enquiry draft');
	await expect(dialog.locator('footer button')).toHaveText('Send request');
	await expect(dialog.locator('footer button')).toBeEnabled();
});

test('a late vehicle response cannot replace a newly reopened enquiry', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/en/inventory/21778068579001193');
	const opener = page.locator('.daynight-mobile-pdp__cta--primary');
	await opener.click();
	const dialog = page.getByRole('dialog').filter({ has: page.locator('form') });
	await dialog.locator('[name="name"]').fill('Synthetic Verification');
	await dialog.locator('[name="phone"]').fill('+359000000000');
	let releaseRequest!: () => void;
	const gate = new Promise<void>((resolve) => (releaseRequest = resolve));
	await page.route('**/api/inquiries', async (route) => {
		await gate;
		return route.continue();
	});
	const response = page.waitForResponse(
		(result) => result.url().endsWith('/api/inquiries') && result.request().method() === 'POST'
	);
	await dialog.locator('footer button').click();
	await expect(dialog.locator('footer button')).toBeDisabled();
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	await opener.click();
	await dialog.locator('[name="message"]').fill('A new synthetic vehicle enquiry draft');
	releaseRequest();
	await (await response).finished();
	await page.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
			)
	);
	await expect(dialog.locator('[name="message"]')).toHaveValue(
		'A new synthetic vehicle enquiry draft'
	);
	await expect(dialog.locator('footer button')).toHaveText('Send Inquiry');
	await expect(dialog.locator('footer button')).toBeEnabled();
});
