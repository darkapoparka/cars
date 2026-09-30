import { expect, test, type Page } from '@playwright/test';

test.use({
	viewport: { width: 390, height: 844 },
	locale: 'en-GB',
	contextOptions: { reducedMotion: 'reduce' }
});
test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([
		{ name: 'cars_prompt', value: 'v1', url: baseURL! },
		{ name: 'cars_locale', value: 'en', url: baseURL! }
	]);
});

async function visit(page: Page, route: string) {
	await page.goto(`/en${route}`, { waitUntil: 'networkidle' });
	await expect(page.locator('[data-locale-ready="true"]')).toBeAttached();
}

async function usableInputs(page: Page) {
	const small = await page
		.locator(
			'input:visible:not([type=checkbox]):not([type=radio]):not([type=range]), select:visible, textarea:visible'
		)
		.evaluateAll((elements) =>
			elements.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => e.outerHTML)
		);
	expect(small, 'Editable text stays at least 16px to avoid iOS focus zoom').toEqual([]);
	expect(await page.locator('meta[name=viewport]').getAttribute('content')).not.toMatch(
		/user-scalable=no|maximum-scale=1/
	);
}

test('service drawers use English copy and searching their descriptions works', async ({
	page
}) => {
	await visit(page, '/services');
	const cards = page.locator('.mobile-services-card');
	await expect(cards).toHaveCount(4);
	for (let index = 0; index < 4; index++) {
		await cards.nth(index).click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		expect(await dialog.innerText()).not.toMatch(/[А-Яа-я]/);
		await usableInputs(page);
		await dialog.getByRole('button', { name: 'Close', exact: true }).click();
		await expect(dialog).not.toBeVisible();
	}
	await page.getByRole('searchbox').fill('history');
	await page.getByRole('searchbox').press('Enter');
	await expect(cards).toHaveCount(1);
	await cards.click();
	await expect(page.getByRole('dialog')).toContainText('Vehicle history check');
});

test('blog search and article return preserve the explicit English locale', async ({
	page,
	context,
	baseURL
}) => {
	await visit(page, '/blog');
	const cards = page.locator('.mobile-blog__card');
	await expect(cards).toHaveCount(6);
	const title = await cards.first().getByRole('heading').innerText();
	await context.addCookies([{ name: 'cars_locale', value: 'bg', url: baseURL! }]);
	await cards.first().click();
	await expect(page).toHaveURL(/\/en\/blog\//);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
	await page.locator('.mobile-article__controls a').click();
	await expect(page).toHaveURL(/\/en\/blog$/);
	await page.getByRole('searchbox').fill('zzznomatch');
	await page.getByRole('searchbox').press('Enter');
	await expect(page).toHaveURL(/\/en\/blog\?q=zzznomatch/);
	await expect(cards).toHaveCount(0);
	await page.locator('.mobile-blog__empty a').click();
	await expect(cards).toHaveCount(6);
});

test('calculator inputs update the estimate and all FAQ accordions toggle', async ({ page }) => {
	await visit(page, '/calculator');
	await usableInputs(page);
	const estimate = page.locator('.finance-mobile-result strong');
	const initial = await estimate.innerText();
	await page.locator('#calculatePrice').fill('60000');
	await expect(estimate).not.toHaveText(initial);
	await visit(page, '/faq');
	const questions = page.locator('button[aria-controls^="faq-answer-"]');
	expect(await questions.count()).toBeGreaterThan(0);
	for (const question of await questions.all()) {
		if ((await question.getAttribute('aria-expanded')) === 'true') await question.click();
		await question.click();
		await expect(question).toHaveAttribute('aria-expanded', 'true');
		await question.click();
		await expect(question).toHaveAttribute('aria-expanded', 'false');
	}
});

test('all home video controls open one inline player and close with focus return', async ({
	page
}) => {
	await page.route('https://www.youtube-nocookie.com/**', (route) =>
		route.fulfill({ contentType: 'text/html', body: '<html><body>Test video embed</body></html>' })
	);
	await visit(page, '');
	const videos = page.locator('article.mobile-video-card');
	for (const video of await videos.all()) {
		const play = video.locator('.mobile-video-card__play');
		await play.click();
		await expect(page.locator('.mobile-video-card iframe')).toHaveCount(1);
		await expect(video.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
		await video.locator('.mobile-video-card__close').click();
		await expect(video.locator('iframe')).toHaveCount(0);
		await expect(play).toBeFocused();
	}
});

for (const width of [320, 390, 430]) {
	test(`English home search, localized budgets and clear at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await visit(page, '');
		await page.getByRole('button', { name: 'Search make, model, price…', exact: true }).click();
		const dialog = page.getByRole('dialog', { name: 'Find a car' });
		const budget = dialog.getByRole('combobox', { name: 'Budget' });
		expect(await budget.locator('option').allTextContents()).toEqual([
			'All prices',
			'Up to 10,000 EUR',
			'Up to 20,000 EUR',
			'Up to 30,000 EUR',
			'Up to 50,000 EUR',
			'Over 50,000 EUR'
		]);
		await usableInputs(page);
		await budget.selectOption('under-30000');
		await dialog.getByRole('searchbox').fill('BMW');
		await dialog.getByRole('searchbox').press('Enter');
		await expect(page).toHaveURL(/\/en\/inventory\?.*q=BMW/);
		await expect(page.locator('.mobile-inventory-card')).toHaveCount(2);
		await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
		await expect(page.locator('.mobile-inventory-card')).toHaveCount(40);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}

test('every inventory quick filter opens, dismisses and restores focus; sort works', async ({
	page
}) => {
	await visit(page, '/inventory');
	for (const name of ['Make', 'Model', 'Price', 'Fuel', 'Mileage', 'Body type']) {
		const trigger = page
			.getByRole('group', { name: 'Quick filters' })
			.getByRole('button', { name, exact: true });
		// WebKit deliberately does not focus buttons on pointer clicks. Exercise
		// focus return from a keyboard opener; pointer opening is covered by the crawl.
		await trigger.focus();
		await trigger.press('Enter');
		await expect(page.locator('dialog[open]')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('dialog[open]')).toHaveCount(0);
		await expect(trigger).toBeFocused();
	}
	await page.getByRole('button', { name: 'Sort by:Lowest price' }).click();
	await expect(page.locator('dialog[open]')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.locator('dialog[open]')).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('map contact text and actions remain readable on the mobile header', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await visit(page, '/inventory/map');
	const ratios = await page
		.locator('.mobile-map-card strong, .mobile-map-card span, .mobile-map-card__actions a')
		.evaluateAll((elements) => {
			const rgba = (value: string) => {
				const values = value.match(/[\d.]+/g)!.map(Number);
				return [values[0], values[1], values[2], values[3] ?? 1];
			};
			const blend = (color: number[], backdrop: number[]) =>
				color.slice(0, 3).map((v, i) => v * color[3] + backdrop[i] * (1 - color[3]));
			const luminance = (color: number[]) =>
				color
					.map((v) => v / 255)
					.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
					.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
			return elements.map((element) => {
				const ancestors: Element[] = [];
				for (let current: Element | null = element; current; current = current.parentElement)
					ancestors.unshift(current);
				const background = ancestors.reduce(
					(color, node) => blend(rgba(getComputedStyle(node).backgroundColor), color),
					[255, 255, 255]
				);
				const foreground = blend(rgba(getComputedStyle(element).color), background);
				const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
				return {
					text: element.textContent?.trim(),
					ratio: (values[0] + 0.05) / (values[1] + 0.05)
				};
			});
		});
	expect(ratios).toHaveLength(5);
	for (const { text, ratio } of ratios) expect(ratio, text).toBeGreaterThanOrEqual(4.5);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('detail contact labels match destinations, tabs work, save and compare persist', async ({
	page
}) => {
	await visit(page, '/inventory');
	await page.locator('.mobile-inventory-card__link').first().click();
	await expect(page.getByRole('link', { name: 'Viber', exact: true })).toHaveAttribute(
		'href',
		/^viber:/
	);
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await page.getByRole('button', { name: 'Add to comparison', exact: true }).click();
	await page.getByRole('tab', { name: 'Info', exact: true }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'Details', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await page.keyboard.press('End');
	await expect(page.getByRole('tab', { name: 'Features', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await page.getByRole('link', { name: 'Back to cars', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/inventory$/);
	await visit(page, '/favorites');
	await expect(page.locator('.mobile-favorites-card')).toHaveCount(1);
	await visit(page, '/compare');
	await expect(page.locator('.mobile-compare .cars article')).toHaveCount(1);
});

for (const viewport of [
	{ width: 320, height: 568 },
	{ width: 390, height: 420 },
	{ width: 568, height: 320 }
]) {
	test(`menu, language preferences and focus at ${viewport.width}x${viewport.height}`, async ({
		page
	}) => {
		await page.setViewportSize(viewport);
		await visit(page, '/services');
		const trigger = page.getByRole('button', { name: 'Menu', exact: true });
		await trigger.click();
		const menu = page.getByRole('dialog', { name: 'Menu', exact: true });
		await expect(menu.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
		await menu.getByRole('link', { name: 'Change country and language' }).click();
		const preferences = page.locator('[data-locale-dialog]');
		await expect(preferences).toBeVisible();
		await usableInputs(page);
		await preferences.locator('select[name=locale]').selectOption('bg');
		await preferences.locator('.cars-locale-close').click();
		await expect(preferences).not.toBeVisible();
		await expect(trigger).toBeFocused();
		await trigger.click();
		await page.keyboard.press('Escape');
		await expect(menu).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});
}

for (const kind of ['import', 'sell'] as const) {
	test(`${kind} explainer is fully localized and dismisses in the small viewport`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await visit(page, kind === 'import' ? '/contact?intent=import' : '/sell-your-car');
		const trigger = page.getByRole('button', { name: 'How it works', exact: true });
		await trigger.click();
		const dialog = page.locator('dialog[open]');
		await expect(dialog).toHaveAccessibleName(
			kind === 'import' ? 'How importing works' : 'How selling works'
		);
		expect(await dialog.innerText()).not.toMatch(/[А-Яа-я]/);
		const bounds = (await dialog.boundingBox())!;
		expect(bounds.y).toBeGreaterThanOrEqual(48);
		await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
		await expect(dialog.getByRole('button', { name: 'Got it', exact: true })).toBeInViewport();
		await dialog.getByRole('button', { name: 'Got it', exact: true }).click();
		await expect(dialog).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});

	test(`${kind} validates, retains drafts and honestly reports demo submission`, async ({
		page
	}) => {
		await visit(page, kind === 'import' ? '/contact?intent=import' : '/sell-your-car');
		if (kind === 'import') await page.locator('.mobile-lead-hero__link').click();
		else {
			await page.getByRole('tab').nth(1).click();
			await page.locator('.mobile-lead-hero__manual').click();
		}
		const dialog = page.locator('dialog[open]');
		await usableInputs(page);
		await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
		await expect(dialog.getByRole('alert')).toBeVisible();
		if (kind === 'import') {
			await dialog.locator('[name=sourceUrl]').fill('invalid');
			await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
			await expect(dialog.locator('[name=sourceUrl]')).toHaveAttribute('aria-invalid', 'true');
			await dialog.locator('[name=sourceUrl]').fill('https://example.com/car');
			await dialog.locator('[name=query]').fill('BMW X5');
		} else {
			await dialog.locator('[name=make]').fill('BMW');
			await dialog.locator('[name=model]').fill('X5');
		}
		await page.keyboard.press('Escape');
		await (
			kind === 'import'
				? page.locator('.mobile-lead-hero__link')
				: page.locator('.mobile-lead-hero__manual')
		).click();
		await expect(dialog.locator(kind === 'import' ? '[name=query]' : '[name=model]')).toHaveValue(
			kind === 'import' ? 'BMW X5' : 'X5'
		);
		await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
		await page.setViewportSize({ width: 390, height: 420 });
		await usableInputs(page);
		await expect(dialog.locator('button[type=submit]')).toBeInViewport();
		await dialog.locator('[name=contact]').fill('invalid');
		await dialog.locator('button[type=submit]').click();
		await expect(dialog.locator('[name=contact]')).toHaveAttribute('aria-invalid', 'true');
		await dialog
			.locator('[name=contact]')
			.fill(kind === 'import' ? 'mobile-qa@example.com' : '+359888123456');
		const response = page.waitForResponse(
			(r) => /\/api\/(leads|import-requests)$/.test(r.url()) && r.request().method() === 'POST'
		);
		await dialog.locator('button[type=submit]').click();
		expect((await response).status()).toBe(403);
		await expect(dialog.getByRole('alert')).toContainText(/demo/i);
		await expect(dialog.locator('[name=contact]')).toHaveValue(
			kind === 'import' ? 'mobile-qa@example.com' : '+359888123456'
		);
	});
}
