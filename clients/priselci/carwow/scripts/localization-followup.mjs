import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const origin = process.env.LOCALE_ORIGIN || 'http://127.0.0.1:6464',
	base = process.env.DAY_LOCALE_BASE || '',
	out = '.audit/localization/' + (process.env.LOCALE_EVIDENCE || 'followup-extra');
fs.mkdirSync(out, { recursive: true });
const results = [];
async function check(name, fn, info = {}) {
	try {
		await fn();
		results.push({ name, ...info, pass: true });
	} catch (e) {
		results.push({ name, ...info, pass: false, error: e.message });
	}
	fs.writeFileSync(out + '/followup.json', JSON.stringify(results, null, 2));
	console.log(JSON.stringify(results.at(-1)));
}
await check('localized mounted XML and robots sitemap', async () => {
	const r = await fetch(origin + base + '/sitemap.xml');
	assert.equal(r.status, 200);
	const xml = await r.text();
	const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((x) =>
		x[1].replaceAll('&amp;', '&')
	);
	assert.ok(locations.length > 40);
	assert.ok(
		locations.every(
			(x) =>
				new URL(x).pathname.startsWith(base + '/en') || new URL(x).pathname.startsWith(base + '/bg')
		)
	);
	for (const locale of ['en', 'bg'])
		assert.ok(locations.some((x) => x.includes(base + '/' + locale + '/blog/')));
	const robots = await (await fetch(origin + base + '/robots.txt')).text();
	assert.ok(robots.includes(base + '/sitemap.xml'));
	fs.writeFileSync(out + '/sitemap.xml', xml);
	for (const url of locations.filter((x) => x.includes('/en/inventory/'))) {
		const p = new URL(url).pathname;
		const response = await fetch(origin + p);
		assert.equal(response.status, 200, p);
		const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
		assert.ok(!html.includes('уточняват се') && !html.includes('лв.'), p);
		const description = html.match(/<meta name="description" content="([^"]*)/)?.[1];
		assert.ok(description && !/[А-Яа-я]/.test(description), p + ' metadata');
	}
});
for (const path of [
	base + '/en/api/preferences',
	base + '/bg/api/preferences',
	(base ? '' : '/variant-3') + '/api/preferences'
])
	await check('reject preference alias ' + path, async () => {
		const r = await fetch(origin + path, {
			method: 'POST',
			headers: { origin, 'content-type': 'application/json' },
			body: JSON.stringify({
				action: 'dismiss',
				locale: 'en',
				country: 'GB',
				returnTo: base + '/en'
			})
		});
		assert.ok([403, 404].includes(r.status));
		assert.equal(r.headers.get('set-cookie'), null);
	});
for (const locale of ['en', 'bg'])
	await check('explicit locale wins invalid lang ' + locale, async () => {
		const r = await fetch(origin + base + '/' + locale + '/contact?lang=de');
		assert.equal(r.status, 200);
		assert.ok((await r.text()).includes('lang="' + locale + '"'));
	});
await check('unsupported query is rejected before redirect', async () => {
	const r = await fetch(origin + base + '/contact?lang=de', { redirect: 'manual' });
	assert.equal(r.status, 400);
});
for (const alias of ['home2', 'home3'])
	await check('legacy presentation redirect ' + alias, async () => {
		const r = await fetch(origin + base + '/en/' + alias, { redirect: 'manual' });
		assert.ok([301, 302, 303, 307, 308].includes(r.status));
		assert.equal(r.headers.get('location'), base + '/en/presentation/' + alias);
	});
const browser = await chromium.launch();
for (const locale of ['en', 'bg'])
	for (const width of [320, 390, 1440]) {
		const c = await browser.newContext({
			viewport: { width, height: 950 },
			userAgent:
				width < 992
					? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
					: undefined
		});
		await c.addCookies([
			{ name: 'cars_prompt', value: 'v1', url: origin },
			{ name: 'cars_locale', value: locale === 'en' ? 'bg' : 'en', url: origin }
		]);
		const p = await c.newPage();
		await check(
			'legacy trade-in preset and free-text preservation',
			async () => {
				await p.goto(origin + base + '/' + locale + '/contact?topic=trade-in');
				await p.locator('[data-locale-ready=true]').waitFor({ state: 'attached' });
				if (width >= 992)
					assert.equal(
						await p.locator('#contact-subject').inputValue(),
						locale === 'en' ? 'Sell or trade in' : 'Продажба или бартер'
					);
				else
					assert.ok(
						(await p.locator('main').innerText()).includes(
							locale === 'en' ? 'Sell or trade in' : 'Продажба или бартер'
						)
					);
				const input = p.locator('textarea[name=message]:visible').first();
				await input.fill('My raw text / Моят VIN RAW-123');
				assert.equal(await input.inputValue(), 'My raw text / Моят VIN RAW-123');
				assert.equal(await p.locator('.locale-control').count(), 0);
			},
			{ locale, width }
		);
		if (width === 1440)
			await check(
				'visible VAT popup has localized stock and labels',
				async () => {
					await p.goto(origin + base + '/' + locale + '/inventory/mercedes-benz-gla-45-amg-405323');
					await p.locator('[data-locale-ready=true]').waitFor({ state: 'attached' });
					await p.locator('#coreDropdownBtn').click();
					await p.waitForFunction(
						() =>
							document.getElementById('coreDropdownBtn')?.getAttribute('aria-expanded') === 'true'
					);
					await p.locator('#coreDropdownMenu').waitFor({ state: 'visible' });
					const text = await p.locator('#coreDropdownMenu').innerText();
					assert.ok(locale === 'bg' ? /[А-Яа-я]/.test(text) : !/[А-Яа-я]/.test(text), text);
					await p.screenshot({ path: out + '/' + locale + '-tax-popup.png' });
				},
				{ locale, width }
			);
		for (const variant of ['home2', 'home3'])
			await check(
				'presentation selected and unselected tab text containment',
				async () => {
					await p.goto(origin + base + '/' + locale + '/presentation/' + variant);
					await p.locator('[data-locale-ready=true]').waitFor({ state: 'attached' });
					const account = p.locator('.' + variant + '-shell a[href$="/admin/login"]');
					assert.equal(await account.getAttribute('href'), base + '/admin/login');
					const tabs = p.getByRole('tab');
					assert.equal(await tabs.count(), 3);
					for (let i = 0; i < 3; i++) {
						await tabs.nth(i).click();
						assert.equal(await tabs.nth(i).getAttribute('aria-selected'), 'true');
						const issues = await tabs.evaluateAll((nodes) =>
							nodes.flatMap((n) => {
								const range = document.createRange();
								range.selectNodeContents(n);
								const a = range.getBoundingClientRect(),
									b = n.getBoundingClientRect();
								return a.bottom > b.bottom + 1 || a.right > b.right + 1 || a.left < b.left - 1
									? [n.textContent]
									: [];
							})
						);
						assert.deepEqual(issues, []);
					}
					const geometry = await p.evaluate((variant) => {
						const h = document.querySelector('h1').getBoundingClientRect(),
							form = document.querySelector('.' + variant + '-search').getBoundingClientRect();
						const clipped = [...document.querySelectorAll('header a')]
							.filter((n) => {
								const r = n.getBoundingClientRect();
								return r.width && r.height && (r.left < 0 || r.right > innerWidth + 1);
							})
							.map((n) => n.textContent);
						return { overlap: h.bottom > form.top + 1, clipped };
					}, variant);
					assert.equal(geometry.overlap, false);
					assert.deepEqual(geometry.clipped, []);
					await p.screenshot({ path: out + '/' + locale + '-' + width + '-' + variant + '.png' });
				},
				{ locale, width }
			);
		await c.close();
	}
for (const locale of ['en', 'bg'])
	for (const malicious of [
		'https://evil.example',
		'/x/..//evil.example/path',
		'/%2e%2e//evil.example/'
	])
		await check(
			'no-JS invalid return fallback remains mounted: ' + malicious,
			async () => {
				const c = await browser.newContext({ javaScriptEnabled: false });
				const p = await c.newPage();
				await p.goto(
					origin +
						base +
						'/' +
						locale +
						'/locale-settings?returnTo=' +
						encodeURIComponent(malicious)
				);
				const returnTo = await p.locator('input[name=returnTo]').inputValue();
				assert.equal(returnTo, base + '/' + locale);
				await p.locator('button[value=dismiss]').click();
				await p.waitForURL((u) => u.pathname === base + '/' + locale);
				await c.close();
			},
			{ locale }
		);
await browser.close();
const summary = {
	cases: results.length,
	passed: results.filter((x) => x.pass).length,
	failed: results.filter((x) => !x.pass).length
};
fs.writeFileSync(out + '/followup-summary.json', JSON.stringify(summary, null, 2));
console.log(summary);
if (summary.failed) process.exitCode = 1;
