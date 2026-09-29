import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const origin = process.env.LOCALE_ORIGIN || 'http://127.0.0.1:6464',
	base = process.env.DAY_LOCALE_BASE || '',
	label = process.env.LOCALE_EVIDENCE || (base ? 'mounted' : 'standalone'),
	out = `.audit/localization/${label}`,
	results = [];
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const check = async (name, fn, info = {}) => {
	try {
		await fn();
		results.push({ name, ...info, pass: true });
	} catch (e) {
		results.push({ name, ...info, pass: false, error: e.message });
	}
	fs.writeFileSync(`${out}/interactions.json`, JSON.stringify(results, null, 2));
	console.log(JSON.stringify(results.at(-1)));
};
const goto = async (p, url) => {
	await p.goto(origin + base + url, { waitUntil: 'domcontentloaded' });
	await p.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
};
const clean = async (p) => {
	const text = await p.locator('body').innerText();
	assert.ok(!/Missing template copy|Internal Error/.test(text));
};
for (const locale of ['en', 'bg'])
	for (const width of [320, 390, 1440]) {
		const info = { locale, width },
			c = await browser.newContext({
				viewport: { width, height: 950 },
				locale: locale === 'en' ? 'en-GB' : 'bg-BG',
				userAgent:
					width < 992
						? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
						: undefined
			});
		const p = await c.newPage();
		p.setDefaultTimeout(10000);
		const errs = [];
		p.on('pageerror', (e) => errs.push(e.message));
		await check(
			'first visit, language choices, focus trap and dismiss without acceptance',
			async () => {
				await goto(p, `/${locale}/inventory?q=BMW#filters`);
				const d = p.locator('[data-locale-dialog]');
				await d.waitFor({ state: 'visible' });
				assert.deepEqual(
					await d.locator('select[name=locale] option').evaluateAll((es) => es.map((e) => e.value)),
					['en', 'bg']
				);
				await d.locator('button[type=submit]').focus();
				await p.keyboard.press('Tab');
				assert.equal(
					await d.locator('.cars-locale-close').evaluate((e) => e === document.activeElement),
					true
				);
				const response = p.waitForResponse(
					(r) => r.url().includes('/api/preferences') && r.request().method() === 'POST'
				);
				await d.locator('.cars-locale-close').click();
				await response;
				assert.equal(await d.isVisible(), false);
				assert.ok(
					!(await c.cookies()).some((x) => x.name === 'cars_locale' || x.name === 'cars_country')
				);
				assert.equal(new URL(p.url()).hash, '#filters');
			},
			info
		);
		await check(
			'manual change saves independent country, language, route/query/hash',
			async () => {
				await p.locator('[data-locale-selector]:visible').first().click();
				const d = p.locator('[data-locale-dialog]');
				await d.locator('select[name=country]').selectOption('GB');
				await d.locator('select[name=locale]').selectOption(locale === 'en' ? 'bg' : 'en');
				await d.locator('button[type=submit]').click();
				await p.waitForURL(
					(u) => u.pathname === `${base}/${locale === 'en' ? 'bg' : 'en'}/inventory`
				);
				await p.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
				assert.equal(new URL(p.url()).search, '?q=BMW');
				assert.equal(new URL(p.url()).hash, '#filters');
				const cookies = await c.cookies();
				assert.equal(cookies.find((x) => x.name === 'cars_country')?.value, 'GB');
				for (const cookie of cookies.filter((x) => x.name.startsWith('cars_'))) {
					assert.equal(cookie.httpOnly, true);
					assert.equal(cookie.path, '/');
					assert.equal(cookie.sameSite, 'Lax');
				}
				await goto(p, `/${locale}/inventory`);
				assert.equal(await p.locator('html').getAttribute('lang'), locale);
			},
			info
		);
		await check(
			'native form validation and demo submission failure',
			async () => {
				await goto(p, `/${locale}/contact`);
				const form = p
					.locator('form')
					.filter({ has: p.locator('[name=name]') })
					.first();
				await form.locator('button[type=submit]').click();
				const invalid = await form.locator('[name=name]').evaluate((e) => e.validationMessage);
				assert.ok(locale === 'en' ? /[A-Za-z]/.test(invalid) : /[А-Яа-я]/.test(invalid));
				await form.locator('[name=name]').fill('Localization verification');
				const contact = form.locator('[name=contact]');
				if (await contact.count()) await contact.fill('test@example.com');
				else {
					await form.locator('[name=email]').fill('test@example.com');
					await form.locator('[name=phone]').fill('+359888123456');
				}
				if (await form.locator('[name=subject]').count())
					await form.locator('[name=subject]').fill('Demo');
				await form.locator('[name=message]').fill('Demo validation; must not be delivered.');
				const response = p.waitForResponse(
					(r) => r.url().includes('/api/leads') && r.request().method() === 'POST'
				);
				await form.locator('button[type=submit]').click();
				assert.equal((await response).status(), 403);
				await p.getByRole('alert').last().waitFor();
				const text = await p.getByRole('alert').last().innerText();
				assert.ok(locale === 'en' ? text.includes('Demonstration') : text.includes('демонстрация'));
				await clean(p);
			},
			info
		);

		await check(
			'inventory search/filter applies without losing locale or fragment',
			async () => {
				await goto(p, '/' + locale + '/inventory#filters');
				if (width < 992) {
					await p.locator('#mobile-inventory-search').click();
					const sheet = p.locator('.mobile-filter-sheet');
					await sheet.waitFor();
					await sheet.locator('#mobile-inventory-query').fill('zzznomatch');
					const text = await sheet.innerText();
					if (locale === 'en') assert.ok(!/[А-Яа-я]/.test(text), text);
					await sheet.locator('.mobile-filter-sheet__actions .is-primary').click();
					await p.waitForURL((u) => u.searchParams.get('q') === 'zzznomatch');
				} else {
					await p.locator('.inventory-filter-triggers button').first().click();
					const dialog = p.locator('dialog.inventory-filter-dialog');
					await dialog
						.locator('label.filter-dialog-choice')
						.filter({ hasText: 'BMW' })
						.locator('input')
						.check();
					await dialog.locator('.filter-dialog-apply').click();
					await p.waitForURL((u) => u.searchParams.get('brand')?.includes('BMW'));
				}
				assert.equal(new URL(p.url()).pathname, base + '/' + locale + '/inventory');
				assert.equal(new URL(p.url()).hash, '#filters');
				await clean(p);
			},
			info
		);
		await check(
			'finance invalid inputs render native errors',
			async () => {
				for (const query of [
					'price=invalid',
					'months=0',
					'months=121',
					'deposit=999999',
					'tradeIn=999999',
					'annualRate=101'
				]) {
					await goto(p, '/' + locale + '/calculator?' + query);
					const message = await p.locator('[role=alert]').innerText();
					assert.ok(message.length > 10);
					assert.equal(/[А-Яа-я]/.test(message), locale === 'bg', message);
				}
			},
			info
		);
		await check(
			'saved and compared vehicle facts render in the chosen language',
			async () => {
				await goto(p, '/' + locale + '/inventory/mercedes-benz-gla-45-amg-405323');
				const detailTrigger = p.locator('[data-locale-selector]:visible').first();
				await detailTrigger.click();
				await p.locator('[data-locale-dialog]').waitFor({ state: 'visible' });
				await p.keyboard.press('Escape');
				await p.locator('[data-locale-dialog]').waitFor({ state: 'hidden' });
				await p
					.locator(
						width < 992
							? '.mobile-detail__nav-button--save'
							: '.pdp-title-actions button[aria-pressed]'
					)
					.click();
				if (width < 992) await p.locator('.mobile-detail__nav-button--compare').click();
				else await p.locator('.pdp-title-actions a').click();
				for (const route of ['/favorites', '/compare']) {
					await goto(p, '/' + locale + route);
					const text = await p.locator('body').innerText();
					assert.ok(text.includes('Mercedes-Benz GLA 45 AMG'));
					if (locale === 'en') assert.ok(!/[А-Яа-я]/.test(text), text);
					await clean(p);
				}
			},
			info
		);
		await check(
			'mobile menu or desktop filter dialog stays in chosen language',
			async () => {
				await goto(p, `/${locale}/inventory`);
				if (width < 992) {
					const menu = p.locator('.mobile-bottom-dock button').last();
					if (await menu.count()) {
						await menu.click();
						await p.locator('[data-locale-selector]:visible').last().waitFor();
						assert.ok(
							(await p.locator('body').innerText()).includes(
								locale === 'en' ? 'Country and language' : 'Държава и език'
							)
						);
						await p.locator('#mobile-menu-sheet [data-locale-selector]').click();
						await p.locator('[data-locale-dialog]').waitFor({ state: 'visible' });
						await p.keyboard.press('Escape');
						await p.waitForTimeout(350);
						assert.equal(await menu.evaluate((el) => document.activeElement === el), true);
					} else throw Error('Expected mobile menu unavailable');
				} else {
					await p.locator('.inventory-filter-triggers button').first().click();
					const modal = p.locator('dialog[open]:visible, [role=dialog]:visible').last();
					await modal.waitFor();
					const dialogText = await modal.innerText();
					assert.ok(
						locale === 'en'
							? /Make|Brand/.test(dialogText) && !/[А-Яа-я]/.test(dialogText)
							: dialogText.includes('Марка'),
						dialogText
					);
					await p.keyboard.press('Escape');
				}
				await clean(p);
			},
			info
		);
		if (width < 992)
			await check(
				'mobile import invalid URL and service drawer copy',
				async () => {
					await goto(p, `/${locale}/contact?intent=import`);
					const form = p.locator('.mobile-lead-hero__search');
					await form.locator('input').fill('invalid-url');
					await form.locator('button[type=submit]').click();
					const error = p.locator('.mobile-lead-hero__error');
					await error.waitFor();
					const text = await error.innerText();
					assert.ok(text.includes('https://'), text);
					if (locale === 'en') assert.ok(!/[А-Яа-я]/.test(text), text);
					await goto(p, `/${locale}/services`);
					await p.locator('.mobile-services-card').first().click();
					await p.locator('.mobile-service-sheet').waitFor();
					await clean(p);
				},
				info
			);
		else
			results.push({
				name: 'mobile import hero validation',
				...info,
				skip: 'Desktop uses contact fields; the mobile URL hero is intentionally absent.'
			});
		await check('no client exceptions', () => assert.equal(errs.length, 0, errs.join('\n')), info);
		await c.close();
	}
await check('blocked local/session storage still allows preference save', async () => {
	const c = await browser.newContext({ viewport: { width: 390, height: 850 } });
	await c.addInitScript(() => {
		for (const name of ['localStorage', 'sessionStorage'])
			Object.defineProperty(window, name, {
				get() {
					throw new DOMException('blocked', 'SecurityError');
				}
			});
	});
	const p = await c.newPage();
	await goto(p, '/en');
	const d = p.locator('[data-locale-dialog]');
	await d.waitFor({ state: 'visible' });
	await d.locator('select[name=locale]').selectOption('bg');
	await d.locator('button[type=submit]').click();
	await p.waitForURL((u) => u.pathname === `${base}/bg`);
	assert.equal((await c.cookies()).find((x) => x.name === 'cars_locale')?.value, 'bg');
	await c.close();
});
for (const locale of ['en', 'bg'])
	await check(
		'no-JS preference form and redirects',
		async () => {
			const c = await browser.newContext({ javaScriptEnabled: false });
			const p = await c.newPage();
			await p.goto(
				`${origin}${base}/${locale}/locale-settings?returnTo=${encodeURIComponent(`${base}/${locale}/inventory?q=BMW#filters`)}`
			);
			await p.locator('#settings-country').selectOption('GB');
			await p.locator('#settings-language').selectOption(locale === 'en' ? 'bg' : 'en');
			await p.locator('button[value=save]').click();
			await p.waitForURL(
				(u) => u.pathname === `${base}/${locale === 'en' ? 'bg' : 'en'}/inventory`
			);
			assert.equal(new URL(p.url()).search, '?q=BMW');
			assert.equal(new URL(p.url()).hash, '#filters');
			assert.equal((await c.cookies()).find((x) => x.name === 'cars_country')?.value, 'GB');
			await c.close();
		},
		{ locale }
	);
await check('late save response cannot navigate after dismiss and reopen', async () => {
	const c = await browser.newContext();
	await c.addCookies([{ name: 'cars_prompt', value: 'v1', url: origin }]);
	const p = await c.newPage();
	let release;
	const gate = new Promise((r) => (release = r));
	let captured;
	await p.route('**/api/preferences', async (route) => {
		const body = route.request().postDataJSON();
		if (body.action === 'save') {
			captured = true;
			await gate;
			await route
				.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ destination: base + '/bg' })
				})
				.catch(() => {});
		} else await route.continue();
	});
	await goto(p, '/en');
	await p.locator('[data-locale-selector]:visible').first().click();
	const d = p.locator('[data-locale-dialog]');
	await d.locator('select[name=locale]').selectOption('bg');
	await d.locator('button[type=submit]').click();
	await p.waitForTimeout(100);
	assert.ok(captured);
	await d.locator('.cars-locale-close').click();
	await p.locator('[data-locale-selector]:visible').first().click();
	release();
	await p.waitForTimeout(200);
	assert.equal(new URL(p.url()).pathname, base + '/en');
	assert.equal(await d.isVisible(), true);
	assert.equal(await d.locator('button[type=submit]').isEnabled(), true);
	await c.close();
});
await check('normalized returns fail closed for forms and JSON', async () => {
	const c = await browser.newContext();
	for (const returnTo of [
		'/x/..//evil.example/path',
		'/%2e%2e//evil.example/',
		'/..//evil.example/path?x=1'
	])
		for (const action of ['save', 'dismiss'])
			for (const type of ['application/json', 'application/x-www-form-urlencoded']) {
				const data = { action, locale: 'en', country: 'BG', returnTo };
				const response = await c.request.post(origin + base + '/api/preferences', {
					headers: { origin, 'content-type': type },
					data:
						type === 'application/json'
							? JSON.stringify(data)
							: new URLSearchParams(data).toString(),
					maxRedirects: 0
				});
				assert.equal(response.status(), 400);
				assert.equal(response.headers().location, undefined);
				assert.equal(response.headers()['set-cookie'], undefined);
			}
	await c.close();
});
await check('dialog rejects a mocked normalized external destination', async () => {
	const c = await browser.newContext();
	await c.addCookies([{ name: 'cars_prompt', value: 'v1', url: origin }]);
	const p = await c.newPage();
	await p.route('**/api/preferences', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ destination: '/x/..//evil.example/path' })
		})
	);
	await goto(p, '/en');
	await p.locator('[data-locale-selector]:visible').first().click();
	const d = p.locator('[data-locale-dialog]');
	await d.locator('button[type=submit]').click();
	await d.locator('[role=alert]').waitFor();
	assert.equal(new URL(p.url()).origin, origin);
	assert.equal(await d.isVisible(), true);
	await c.close();
});
await check('admin stays English and redirects within deployment base', async () => {
	const c = await browser.newContext();
	const response = await c.request.get(origin + base + '/admin', { maxRedirects: 0 });
	assert.equal(response.status(), 303);
	assert.ok(response.headers().location.startsWith(base + '/admin/login?'));
	const p = await c.newPage();
	await p.goto(origin + base + '/admin/login');
	assert.equal(await p.locator('html').getAttribute('lang'), 'en');
	assert.ok(!(await p.locator('body').innerText()).includes('Internal Error'));
	await c.close();
});
await browser.close();
const summary = {
	cases: results.length,
	passed: results.filter((r) => r.pass).length,
	failed: results.filter((r) => r.pass === false).length,
	skipped: results.filter((r) => r.skip).length
};
fs.writeFileSync(`${out}/interaction-summary.json`, JSON.stringify(summary, null, 2));
console.log(summary);
if (summary.failed) process.exitCode = 1;
