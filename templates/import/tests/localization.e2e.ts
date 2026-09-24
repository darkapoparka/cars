import feed from '../src/lib/data/daynight-listings.json' with { type: 'json' };
import { site } from '../src/lib/config/site';
import { promptVersion } from './locale-fixture';
import { test, expect } from '@playwright/test';
const mount = process.env.LOCALE_FIXTURE_BASE ?? '';
const route = (locale: string, path = '') => mount + '/' + locale + path;
const routes = [
	'',
	'/inventory',
	'/inventory/11774283016080050',
	'/import',
	'/sell-your-car',
	'/financing',
	'/calculator',
	'/contact?topic=trade-in',
	'/services',
	'/about',
	'/blog',
	'/blog/vnos-ot-kanada-proverka',
	'/reviews',
	'/faqs',
	'/privacy',
	'/terms',
	'/cookies',
	'/account/favorites',
	'/compare',
	'/locale-settings'
];
test.describe.configure({ mode: 'default' });
for (const width of [320, 390, 1440])
	for (const locale of ['en', 'bg'])
		test('native route families ' + locale + ' ' + width, async ({ page, context }, info) => {
			test.setTimeout(180000);
			await page.setViewportSize({ width, height: 900 });
			await context.addCookies([
				{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string }
			]);
			const errors: string[] = [];
			const resourceErrors: string[] = [];
			page.on('response', (response) => {
				const url = new URL(response.url());
				if (url.origin !== new URL(info.project.use.baseURL as string).origin) return;
				if (!['image', 'stylesheet', 'font', 'script'].includes(response.request().resourceType()))
					return;
				if (response.status() >= 400 || (mount && !url.pathname.startsWith(mount + '/')))
					resourceErrors.push(response.status() + ' ' + url.pathname);
			});
			page.on('pageerror', (error) => errors.push(error.message));
			for (const path of routes) {
				const response = await page.goto(route(locale, path));
				expect(response?.status(), path).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', locale);
				await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
				await expect(page.getByRole('heading', { level: 1 }).first()).toBeAttached();
				await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
				await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
					'href',
					new RegExp(mount + '/' + locale + '(?:/|$)')
				);
				if (locale === 'en') {
					const text = await page.evaluate(() => {
						const found: string[] = [];
						const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
						while (walker.nextNode()) {
							const n = walker.currentNode,
								p = n.parentElement;
							if (
								p &&
								!p.closest('script,style') &&
								p.getClientRects().length &&
								getComputedStyle(p).visibility !== 'hidden' &&
								/[\u0400-\u04ff]/u.test(n.textContent ?? '')
							)
								found.push(n.textContent?.trim() ?? '');
						}
						return [...new Set(found)];
					});
					// Exact fixed dealer/address/person facts retain their source spelling. Native language names are intentional.
					const facts = [
						'гр. София, Студентски град, ул. Атанас Манчев 18',
						'Пловдив, гр. Пловдив',
						'Кристиян Кирилов',
						'Мария Петрова',
						'Александър Иванов',
						'Български'
					];
					expect(
						text.filter((t) => !facts.includes(t)),
						path
					).toEqual([]);
				}

				expect(
					await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
					path
				).toBe(true);
				const images = await page
					.locator('img')
					.evaluateAll((nodes) =>
						nodes
							.filter(
								(n) =>
									n instanceof HTMLImageElement &&
									n.getBoundingClientRect().width > 0 &&
									n.complete &&
									n.naturalWidth === 0
							)
							.map((n) => n.getAttribute('src'))
					);
				expect(images, path).toEqual([]);
				if (path === '/import' || path === '/contact?topic=trade-in')
					await page.screenshot({
						path: info.outputPath(
							locale + '-' + width + '-' + path.split('?')[0].slice(1) + '.png'
						),
						fullPage: true
					});
				if (locale === 'en') {
					const heading = await page.getByRole('heading', { level: 1 }).first().innerText();
					expect(heading, path).not.toMatch(/[А-Яа-я]/);
				}
			}
			expect(errors).toEqual([]);
			expect(resourceErrors).toEqual([]);
		});
for (const width of [320, 390, 1440])
	test('preferences save dismiss reload and focus ' + width, async ({ page, context }, info) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(route('en', '/contact?topic=trade-in#main-content'));
		const dialog = page.locator('[data-locale-dialog]');
		await expect(dialog).toBeVisible();
		await page.screenshot({ path: info.outputPath('preferences-' + width + '.png') });
		const close = dialog.getByRole('button', { name: 'Close', exact: true });
		const save = dialog.getByRole('button', { name: 'Save preferences' });
		await close.focus();
		await page.keyboard.press('Shift+Tab');
		await expect(save).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await dialog.getByRole('button', { name: 'Not now' }).click();
		await expect(dialog).not.toBeVisible();
		await expect(page.locator('[data-locale-selector]:focus')).toBeVisible();
		await expect
			.poll(async () => (await context.cookies()).filter((c) => c.name === 'cars_prompt').length)
			.toBe(1);
		expect(
			(await context.cookies()).filter((c) => ['cars_locale', 'cars_country'].includes(c.name))
		).toEqual([]);
		await page.reload();
		await expect(dialog).not.toBeVisible();
		await page.locator('[data-locale-selector]:visible').first().click();
		await expect(dialog).toBeVisible();
		await dialog.locator('[name=country]').selectOption('GB');
		await dialog.locator('[name=locale]').selectOption('bg');
		await dialog.getByRole('button', { name: 'Save preferences' }).click();
		await expect(page).toHaveURL(new RegExp(mount + '/bg/contact\\?topic=trade-in#main-content'));
		await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
		const cookies = await context.cookies();
		expect(cookies.find((c) => c.name === 'cars_locale')?.value).toBe('bg');
		expect(cookies.find((c) => c.name === 'cars_country')?.value).toBe('GB');
		expect(
			cookies
				.filter((c) => c.name.startsWith('cars_'))
				.every((c) => c.httpOnly && c.sameSite === 'Lax' && c.path === '/')
		).toBe(true);
		await page.reload();
		await expect(dialog).not.toBeVisible();
	});
test('stale save cannot navigate after close and reopen', async ({ page }) => {
	await page.goto(route('en'));
	const dialog = page.locator('[data-locale-dialog]');
	await expect(dialog).toBeVisible();
	let release: () => void = () => {};
	const delay = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route('**/api/preferences', async (intercepted) => {
		if (intercepted.request().postDataJSON().action === 'save') {
			await delay;
			await intercepted.fulfill({ json: { destination: route('bg') } }).catch(() => {});
		} else await intercepted.continue();
	});
	await dialog.locator('[name=locale]').selectOption('bg');
	await dialog.getByRole('button', { name: 'Save preferences' }).click();
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await page.locator('[data-locale-selector]:visible').first().click();
	await expect(dialog).toBeVisible();
	release();
	await expect(dialog.locator('[name=locale]')).toHaveValue('en');
	await expect(page).toHaveURL(new RegExp(mount + '/en/?$'));
	await expect(dialog.getByRole('button', { name: 'Save preferences' })).toBeEnabled();
});
test('no JavaScript preferences and contact are native forms', async ({ browser }, info) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 844 }
	});
	const page = await context.newPage();
	const origin = info.project.use.baseURL as string;
	await page.goto(
		origin +
			route(
				'en',
				'/locale-settings?returnTo=' +
					encodeURIComponent(route('en', '/contact?topic=trade-in#main-content'))
			)
	);
	await page.locator('main select[name=locale]').selectOption('bg');
	await page.locator('main select[name=country]').selectOption('US');
	await page.getByRole('button', { name: 'Save preferences' }).click();
	await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
	await expect(page.locator('noscript form')).toBeVisible();
	await context.close();
});
test('explicit URL works with blocked storage and conflicting preferences', async ({
	page,
	context
}, info) => {
	await context.addCookies([
		{ name: 'cars_locale', value: 'bg', url: info.project.use.baseURL as string }
	]);
	await page.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			get() {
				throw new Error('blocked');
			}
		});
		Object.defineProperty(window, 'sessionStorage', {
			get() {
				throw new Error('blocked');
			}
		});
	});
	await page.goto(route('en', '/inventory?lang=bg&fuel=Petrol'));
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('[data-locale-dialog]')).toBeVisible();
	await page.getByRole('button', { name: 'Not now' }).click();
	await expect(page.locator('main')).toContainText('Petrol');
});
test('language/country and cookies cannot leak between requests', async ({ request }) => {
	const answers = await Promise.all(
		['en', 'bg', 'en', 'bg'].map((locale) =>
			request.get(route(locale, '/contact'), {
				headers: { cookie: 'cars_locale=' + (locale === 'en' ? 'bg' : 'en') }
			})
		)
	);
	for (let i = 0; i < answers.length; i++) {
		expect(answers[i].headers()['content-language']).toBe(i % 2 ? 'bg' : 'en');
		expect(answers[i].headers()['cache-control']).toContain('no-store');
	}
	const rejected = await request.post(mount + '/api/preferences', {
		headers: { origin: 'https://external.invalid' },
		data: { action: 'save', locale: 'en', country: 'GB', returnTo: route('en') }
	});
	expect(rejected.status()).toBe(403);
});
test('both import modes and sell wizard validate without business writes', async ({
	page,
	context
}, info) => {
	await context.addCookies([
		{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string }
	]);
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(route('en', '/import'));
	await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
	const wizard = page.locator('.site-desktop-only .bc-import-wizard');
	await expect(wizard).toContainText('Which car should we check?');
	await wizard.getByRole('button', { name: 'Continue' }).click();
	await expect(wizard.getByRole('alert')).toContainText('Add a listing');
	await page.getByRole('tab', { name: 'Find a car', exact: true }).click();
	await expect(wizard.locator('#import-wizard-make')).toBeVisible();
	await wizard.locator('#import-wizard-make').fill('Synthetic');
	await wizard.getByRole('button', { name: 'Continue' }).click();
	await expect(wizard).toContainText('Preferred timeframe');
	await expect(wizard.getByRole('button', { name: 'Petrol', exact: true })).toBeVisible();
	await page.goto(route('en', '/sell-your-car'));
	await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Sell');
});

test('blocked cookies still allow explicit language and independent country selection', async ({
	page,
	context
}) => {
	await page.route('**/api/preferences', async (intercepted) => {
		// Use Node's fetch so the browser context never accepts Set-Cookie before interception.
		const original = intercepted.request();
		const response = await fetch(original.url(), {
			method: original.method(),
			headers: original.headers(),
			body: original.postData()
		});
		const headers = Object.fromEntries(response.headers);
		delete headers['set-cookie'];
		await intercepted.fulfill({ status: response.status, body: await response.text(), headers });
	});
	await page.goto(route('en', '/contact?topic=trade-in#main-content'));
	const dialog = page.locator('[data-locale-dialog]');
	await expect(dialog).toBeVisible();
	await dialog.locator('[name=country]').selectOption('US');
	await dialog.locator('[name=locale]').selectOption('bg');
	await dialog.getByRole('button', { name: 'Save preferences' }).click();
	await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
	expect((await context.cookies()).filter((c) => c.name.startsWith('cars_'))).toEqual([]);
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
	await expect(page).toHaveURL(
		(u) =>
			u.pathname === route('bg', '/contact') &&
			u.search === '?topic=trade-in' &&
			u.hash === '#main-content'
	);
});

test('client locale navigation and back update language, copy, SEO and links without reload', async ({
	page,
	context
}, info) => {
	await context.addCookies([
		{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string }
	]);
	await page.goto(route('bg', '/about?lang=en#about-team'));
	await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
	const description = page.locator('meta[name="description"]');
	const originalDescription = await description.getAttribute('content');
	expect(originalDescription).toMatch(/[А-Яа-я]/);
	await page.evaluate(
		(href) => {
			Object.assign(window, { localeNavigationSentinel: true });
			const link = document.createElement('a');
			link.id = 'locale-navigation-check';
			link.href = href;
			link.textContent = 'English';
			document.querySelector('main')!.prepend(link);
		},
		route('en', '/about?lang=bg#about-team')
	);
	await page.locator('#locale-navigation-check').click();
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('h1')).toHaveText('About us');
	await expect(description).not.toHaveAttribute('content', originalDescription!);
	expect(await description.getAttribute('content')).not.toMatch(/[А-Яа-я]/);
	await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
		'href',
		new RegExp(mount + '/en/about$')
	);
	await expect(
		page
			.getByRole('navigation', { name: 'Main navigation', exact: true })
			.getByRole('link', { name: 'Cars', exact: true })
	).toHaveAttribute('href', route('en', '/inventory?lang=en'));
	await page.goBack();
	await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
	await expect(page.locator('h1')).toHaveText('За нас');
	await expect(description).toHaveAttribute('content', originalDescription!);
	await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
		'href',
		new RegExp(mount + '/bg/about$')
	);
	await expect(page).toHaveURL(
		(u) =>
			u.pathname === route('bg', '/about') && u.search === '?lang=en' && u.hash === '#about-team'
	);
	await page.goForward();
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('h1')).toHaveText('About us');
	expect(
		await page.evaluate(() =>
			Boolean((window as Window & { localeNavigationSentinel?: boolean }).localeNavigationSentinel)
		)
	).toBe(true);
});
test('only offered public routes reroute; resource and admin boundaries remain separate', async ({
	request
}) => {
	for (const path of [
		'/de/inventory',
		'/en/api/inventory/count',
		'/en/admin',
		'/en/auth/login',
		'/en/en/inventory'
	])
		expect((await request.get(mount + path)).status(), path).toBe(404);
	const api = await request.get(mount + '/api/inventory/count');
	expect(api.status()).toBe(200);
	expect(api.headers()['content-type']).toContain('application/json');
	const asset = await request.get(mount + '/assets/vehicle-placeholder.svg');
	expect(asset.status()).toBe(200);
	expect(asset.headers()['content-type']).toContain('image/svg+xml');
	const response = await request.get(mount + '/inventory?brand=BMW', {
		headers: { 'accept-language': 'en', cookie: 'cars_locale=bg', 'x-vercel-ip-country': 'US' },
		maxRedirects: 0
	});
	expect(response.status()).toBe(307);
	expect(response.headers().location).toBe(route('bg', '/inventory?brand=BMW'));
	const sitemap = await request.get(mount + '/sitemap.xml');
	const xml = await sitemap.text();
	expect(xml).toContain(mount + '/en/blog/vnos-ot-kanada-proverka');
	expect(xml).toContain(mount + '/bg/inventory/');
	expect(xml).not.toMatch(/\/(?:ar|de)\/|\/agents\//);
});

test('localized errors and slash redirects are private while assets stay cacheable', async ({
	request
}) => {
	for (const path of [
		'/en/inventory/missing-synthetic-car',
		'/bg/blog/missing-synthetic-article',
		'/ar/contact',
		'/en/en/inventory'
	]) {
		const response = await request.get(mount + path);
		expect(response.status(), path).toBe(404);
		expect(response.headers()['cache-control'], path).toContain('private, no-store');
		expect(response.headers()['vercel-cdn-cache-control'], path).toBe('no-store');
	}
	const slash = await request.get(route('en', '/inventory/'), { maxRedirects: 0 });
	expect(slash.status()).toBe(308);
	expect(slash.headers().location).toBe(route('en', '/inventory'));
	expect(slash.headers()['cache-control']).toContain('private, no-store');
	const asset = await request.get(mount + '/assets/vehicle-placeholder.svg');
	expect(asset.status()).toBe(200);
	expect(asset.headers()['cache-control'] ?? '').not.toContain('private');
	const [en, bg] = await Promise.all(
		['en', 'bg'].map((locale) =>
			request
				.get(mount + '/api/inventory/count?lang=' + locale + '&preview=1')
				.then((r) => r.json())
		)
	);
	expect(en.features.map((f: { value: string }) => f.value)).toEqual(
		bg.features.map((f: { value: string }) => f.value)
	);
	expect(en.features.map((f: { label: string }) => f.label).join(' ')).not.toMatch(/[А-Яа-я]/);
	expect(en.cards.map((c: { slug: string }) => c.slug)).toEqual(
		bg.cards.map((c: { slug: string }) => c.slug)
	);
	for (const [locale, result] of [
		['en', en],
		['bg', bg]
	] as const) {
		const formatter = new Intl.NumberFormat(site.locale.formatLocales[locale], {
			style: 'currency',
			currency: site.locale.currency,
			maximumFractionDigits: 0
		});
		for (const card of result.cards as Array<{ slug: string; priceLabel: string }>) {
			const listing = feed.listings.find((value) => value.id === card.slug);
			expect(listing, card.slug).toBeDefined();
			expect(listing!.price).toMatch(/^[\d\s]+\s*€$/);
			const amount = Number(listing!.price.replace(/[^\d]/g, ''));
			expect(amount).toBeGreaterThan(0);
			expect(card.priceLabel).toBe(formatter.format(amount));
		}
	}
});
