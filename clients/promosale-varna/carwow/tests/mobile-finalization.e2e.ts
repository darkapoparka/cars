import { expect, test } from '@playwright/test';

const routes = [
	'/',
	'/inventory',
	'/inventory/map',
	'/contact',
	'/contact?intent=import',
	'/sell-your-car',
	'/sell-your-car/request',
	'/financing',
	'/services',
	'/about',
	'/about/daynight-auto-plovdiv',
	'/blog',
	'/blog/kak-da-kupim-upotrebyavan-avtomobil',
	'/calculator',
	'/compare',
	'/favorites',
	'/faq',
	'/reviews',
	'/team',
	'/team/prodazhbi-showroom',
	'/terms'
];
const phoneUA =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const width of [320, 390, 430]) {
	test(`mobile route contract at ${width}`, async ({ page }) => {
		// This test visits 21 pages; keep per-assertion timeouts, but budget the whole batch.
		test.setTimeout(routes.length * 5_000);
		await page.setViewportSize({ width, height: 844 });
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		for (const route of routes) {
			const response = await page.goto(route, { waitUntil: 'networkidle' });
			expect(response?.status(), route).toBe(200);
			expect((await page.title()).trim(), route).not.toBe('');
			await expect(page.locator('main'), route).toHaveCount(1);
			await expect(page.locator('#main-content'), route).toHaveCount(1);
			await expect(page.locator('h1:visible'), route).toHaveCount(1);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
				route
			).toBe(true);
		}
		expect(errors).toEqual([]);
	});
}

test('phone SSR has content and navigation without JavaScript', async ({ browser, baseURL }) => {
	const context = await browser.newContext({
		baseURL,
		viewport: { width: 390, height: 844 },
		userAgent: phoneUA,
		javaScriptEnabled: false
	});
	const page = await context.newPage();
	for (const route of [...routes, '/inventory/mercedes-benz-gla-45-amg-405323']) {
		const response = await page.goto(route);
		expect(response?.headers().vary?.toLowerCase(), route).toContain('user-agent');
		await expect(page.locator('main')).toHaveCount(1);
		await expect(page.locator('h1:visible')).toHaveCount(1);
		expect((await page.locator('body').innerText()).length, route).toBeGreaterThan(80);
	}
	await context.close();
});

for (const viewport of [
	{ width: 568, height: 320 },
	{ width: 844, height: 390 }
]) {
	test(`menu remains operable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.goto('/', { waitUntil: 'networkidle' });
		const trigger = page.getByRole('button', { name: 'Меню', exact: true });
		await trigger.click();
		const dialog = page.getByRole('dialog', { name: 'Меню', exact: true });
		const close = dialog.getByRole('button', { name: 'Затвори', exact: true });
		await expect(close).toBeInViewport();
		await dialog.getByRole('link', { name: 'Блог', exact: true }).scrollIntoViewIfNeeded();
		await expect(dialog.getByRole('link', { name: 'Блог', exact: true })).toBeInViewport();
		await expect(close).toBeInViewport();
		await close.click();
		await expect(dialog).not.toBeVisible();
		await expect(trigger).toBeFocused();
		expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
	});
}

test('blog active category is visible and filters are reversible', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/blog', { waitUntil: 'networkidle' });
	const categories = page.locator('.blog-controls .widget-categories');
	await categories.getByRole('link', { name: 'Продажба', exact: true }).click();
	await expect(page).toHaveURL(/category=/);
	const active = categories.locator('a.active');
	await expect(active).toHaveText('Продажба');
	await expect(active).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(active).not.toHaveCSS('background-color', 'rgb(255, 255, 255)');
	const visibleCards = page.locator('[data-daynight-article-card]:visible');
	expect(await visibleCards.count()).toBeGreaterThan(0);
	for (const card of await visibleCards.all())
		await expect(card).toHaveAttribute('data-daynight-category', 'Продажба');
	await categories.getByRole('link', { name: 'Всички', exact: true }).click();
	await expect(page).toHaveURL(/\/blog$/);
});

for (const kind of ['sell', 'import'] as const) {
	test(`${kind} validates, retains drafts and handles mocked intake responses`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		let submissions = 0;
		let payload: Record<string, unknown> = {};
		await page.route(`**/api/${kind === 'sell' ? 'leads' : 'import-requests'}`, async (route) => {
			submissions++;
			payload = route.request().postDataJSON();
			await route.fulfill({
				status: submissions === 1 ? 503 : 201,
				json:
					submissions === 1
						? { message: 'Lead intake is temporarily unavailable.' }
						: {
								leadId: 'test-lead',
								conversationId: 'test-conversation',
								importRequestId: 'test-import',
								status: 'new'
							}
			});
		});
		await page.goto(kind === 'sell' ? '/sell-your-car' : '/contact?intent=import', {
			waitUntil: 'networkidle'
		});
		if (kind === 'sell') await page.getByRole('tab', { name: 'Данни', exact: true }).click();
		await page
			.getByRole('button', { name: kind === 'sell' ? /Нямам номер или VIN/ : /Нямам линк/ })
			.click();
		const dialog = page.locator('dialog[open]');
		await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
		await expect(dialog.getByRole('alert')).toBeVisible();
		if (kind === 'sell') {
			await dialog.locator('[name="make"]').fill('BMW');
			await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
			await expect(dialog.locator('[name="model"]')).toHaveAttribute('aria-invalid', 'true');
			await dialog.locator('[name="model"]').fill('X5');
		} else {
			await dialog.locator('[name="query"]').fill('BMW X5');
			await dialog.locator('[name="budget"]').fill('40 000');
		}
		await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
		await dialog.locator('[name="contact"]').fill('not-a-contact');
		await dialog.locator('button[type="submit"]').click();
		await expect(dialog.locator('[name="contact"]')).toHaveAttribute('aria-invalid', 'true');
		expect(submissions).toBe(0);
		await dialog.locator('[name="contact"]').fill('+359888123456');
		await dialog.locator('button[type="submit"]').click();
		await expect(dialog.getByRole('alert')).toContainText('Опитайте отново');
		await expect(dialog.getByRole('alert')).not.toContainText('Lead intake');
		await expect(dialog.locator('[name="contact"]')).toHaveValue('+359888123456');
		await dialog.locator('button[type="submit"]').click();
		await expect(page.getByRole('heading', { name: 'Заявката е изпратена' })).toBeVisible();
		expect(submissions).toBe(2);
		expect(payload.contact).toBe('+359888123456');
		if (kind === 'import') expect(payload.budgetMax).toBe(40000);
	});
}

test('mobile home search renders body filters and preserves a search', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Търси марка, модел, цена…', exact: true }).click();
	const dialog = page.locator('dialog[open]');
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await dialog.getByRole('searchbox').fill('BMW');
	await expect(dialog.getByRole('button', { name: 'Джип', exact: true })).toBeVisible();
	await dialog.getByRole('searchbox').press('Enter');
	await expect(page).toHaveURL(/\/inventory\?.*q=BMW/);
	await expect(page.locator('.mobile-inventory-card').first()).toBeVisible();
});

test('detail tabs support keyboard selection and a single selected tab', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory/mercedes-benz-gla-45-amg-405323', { waitUntil: 'networkidle' });
	const info = page.getByRole('tab', { name: 'Инфо', exact: true });
	await info.focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'Данни', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await page.keyboard.press('End');
	await expect(page.getByRole('tab', { name: 'Екстри', exact: true })).toBeFocused();
	await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
});

test('withdrawn garage selections are retained until explicitly removed', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.evaluate(() =>
		localStorage.setItem('daynight:favorites', JSON.stringify(['withdrawn-test-car']))
	);
	await page.goto('/favorites', { waitUntil: 'networkidle' });
	await expect(page.getByRole('complementary', { name: 'Недостъпни обяви' })).toBeVisible();
	expect(
		await page.evaluate(() => JSON.parse(localStorage.getItem('daynight:favorites') || '[]'))
	).toEqual(['withdrawn-test-car']);
	await page.getByRole('button', { name: /Премахни недостъпните/ }).click();
	await expect(page.getByRole('complementary', { name: 'Недостъпни обяви' })).toHaveCount(0);
	expect(
		await page.evaluate(() => JSON.parse(localStorage.getItem('daynight:favorites') || '[]'))
	).toEqual([]);
});

test('legacy sell aliases preserve query parameters', async ({ request }) => {
	for (const [from, to] of [
		['/sell-car', '/sell-your-car'],
		['/sell-car/request', '/sell-your-car/request']
	]) {
		const response = await request.get(`${from}?make=BMW`, { maxRedirects: 0 });
		expect(response.status()).toBe(308);
		expect(response.headers().location).toBe(`${to}?make=BMW`);
	}
});

test('import form actions remain reachable in a reduced visible viewport', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 420 });
	await page.goto('/contact?intent=import', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: /Нямам линк/ }).click();
	const dialog = page.locator('dialog[open]');
	await dialog.locator('[name="query"]').fill('BMW X5');
	await expect(dialog.getByRole('button', { name: 'Продължи', exact: true })).toBeInViewport();
	await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
	await expect(dialog.locator('button[type="submit"]')).toBeInViewport();
	await expect(dialog.getByRole('button', { name: 'Затвори', exact: true })).toBeInViewport();
});
