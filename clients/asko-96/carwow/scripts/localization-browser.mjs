import fs from 'node:fs';
import { chromium } from '@playwright/test';
const origin = process.env.LOCALE_ORIGIN || 'http://127.0.0.1:6464',
	base = process.env.DAY_LOCALE_BASE || '',
	label = process.env.LOCALE_EVIDENCE || (base ? 'mounted' : 'standalone');
const out = `.audit/localization/${label}`;
fs.mkdirSync(out, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
const routes = [
	'/home1',
	'/home1-box',
	'/presentation/home2',
	'/presentation/home3',
	'',
	'/inventory',
	'/inventory/map',
	'/inventory?q=zzznomatch',
	'/inventory?fuel=%D0%94%D0%B8%D0%B7%D0%B5%D0%BB&transmission=%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%BA',
	'/services',
	'/sell-your-car',
	'/sell-your-car/request',
	'/contact',
	'/contact?intent=import',
	'/contact?topic=trade-in',
	'/financing',
	'/calculator',
	'/about',
	'/about/daynight-auto-plovdiv',
	'/reviews',
	'/blog',
	'/team',
	'/faq',
	'/terms',
	'/compare',
	'/favorites',
	'/inventory/mercedes-benz-gla-45-amg-405323',
	'/blog/kak-da-kupim-upotrebyavan-avtomobil',
	'/team/prodazhbi-showroom',
	'/not-a-page'
];
function record(row) {
	results.push(row);
	fs.writeFileSync(`${out}/routes.json`, JSON.stringify(results, null, 2));
	console.log(JSON.stringify(row));
}
for (const locale of ['en', 'bg'])
	for (const width of [320, 390, 1440]) {
		const context = await browser.newContext({
			viewport: { width, height: 950 },
			locale: locale === 'en' ? 'en-GB' : 'bg-BG',
			userAgent:
				width < 992
					? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
					: undefined
		});
		await context.addCookies([{ name: 'cars_prompt', value: 'v1', url: origin }]);
		for (const route of routes.filter(
			(route) => !process.env.LOCALE_ROUTE_FILTER || route.includes(process.env.LOCALE_ROUTE_FILTER)
		)) {
			const p = await context.newPage(),
				errors = [],
				failedResources = [];
			p.on('pageerror', (e) => errors.push(e.message));
			p.on('response', (r) => {
				if (
					r.status() >= 400 &&
					r.url().startsWith(origin) &&
					/\.(?:js|css|webp|svg|woff2)(?:\?|$)/.test(r.url())
				)
					failedResources.push({ url: r.url(), status: r.status() });
			});
			try {
				const response = await p.goto(`${origin}${base}/${locale}${route}`, {
					waitUntil: 'domcontentloaded',
					timeout: 45000
				});
				await p
					.locator('[data-locale-ready="true"]')
					.waitFor({ state: 'attached', timeout: 25000 });
				await p.evaluate(() => document.fonts.ready);
				await p.waitForTimeout(120);
				const data = await p.evaluate(
					({ locale, base }) => {
						const visible = (e) =>
							e.getClientRects().length &&
							getComputedStyle(e).visibility !== 'hidden' &&
							getComputedStyle(e).display !== 'none';
						const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT),
							untranslated = [],
							tabs = [];
						while (walker.nextNode()) {
							const n = walker.currentNode,
								e = n.parentElement;
							if (!e || ['SCRIPT', 'STYLE', 'OPTION'].includes(e.tagName) || !visible(e)) continue;
							const text = n.textContent.trim();
							if (locale === 'en' && /[А-Яа-я]/.test(text) && text !== 'Български')
								untranslated.push(text);
						}
						for (const e of document.querySelectorAll('[role=tab],.mobile-services-chips button')) {
							if (!visible(e)) continue;
							const range = document.createRange();
							range.selectNodeContents(e);
							const a = range.getBoundingClientRect(),
								b = e.getBoundingClientRect();
							if (
								a.width &&
								(a.left < b.left - 1 ||
									a.right > b.right + 1 ||
									a.top < b.top - 1 ||
									a.bottom > b.bottom + 1)
							)
								tabs.push({ text: e.textContent.trim(), textRect: a.toJSON(), box: b.toJSON() });
						}
						const untranslatedAttributes =
							locale === 'en'
								? [...document.querySelectorAll('[aria-label],[title],[alt],[placeholder]')]
										.filter(visible)
										.flatMap((e) =>
											['aria-label', 'title', 'alt', 'placeholder']
												.map((name) => ({ name, value: e.getAttribute(name) }))
												.filter((a) => a.value && /[А-Яа-я]/.test(a.value))
										)
								: [];
						const links = [...document.querySelectorAll('a[href]')]
							.filter(visible)
							.map((e) => e.getAttribute('href'))
							.filter(
								(h) =>
									!h.startsWith('#') &&
									!h.startsWith('?') &&
									!/^[a-z][a-z0-9+.-]*:/i.test(h) &&
									!h.startsWith('//') &&
									!/^\/(?:variant-3\/)?(?:en|bg|api|admin|assets|_app|favicon)(?:\/|\?|$)/.test(h)
							);
						return {
							lang: document.documentElement.lang,
							untranslated: [...new Set(untranslated)],
							untranslatedAttributes,
							overflow: document.documentElement.scrollWidth > innerWidth + 1,
							tabTextOverflow: tabs,
							unlocalizedLinks: links,
							manualControl: [...document.querySelectorAll('[data-locale-selector]')].some(visible),
							title: document.title,
							metadata: {
								description: document.querySelector('meta[name=description]')?.content ?? '',
								ogLocale: document.querySelector('meta[property="og:locale"]')?.content ?? '',
								ogImage: document.querySelector('meta[property="og:image"]')?.content ?? '',
								alternates: [...document.querySelectorAll('link[hreflang]')].map((e) => ({
									lang: e.hreflang,
									href: e.href
								}))
							},
							assetMountLeaks: base
								? [...document.images]
										.map((e) => e.currentSrc || e.src)
										.filter(
											(h) =>
												h.startsWith(location.origin + '/') &&
												!new URL(h).pathname.startsWith(base + '/')
										)
								: []
						};
					},
					{ locale, base }
				);
				const expected = route === '/not-a-page' ? 404 : 200;
				const pass =
					response.status() === expected &&
					data.lang === locale &&
					(expected !== 200 ||
						(data.metadata.ogLocale === (locale === 'en' ? 'en_GB' : 'bg_BG') &&
							data.metadata.alternates.some(
								(a) => a.lang === 'en' && new URL(a.href).pathname.startsWith(base + '/en')
							) &&
							data.metadata.alternates.some(
								(a) => a.lang === 'bg' && new URL(a.href).pathname.startsWith(base + '/bg')
							) &&
							(locale !== 'en' || !/[А-Яа-я]/.test(data.metadata.description)) &&
							(!base || new URL(data.metadata.ogImage).pathname.startsWith(base + '/')))) &&
					!data.assetMountLeaks.length &&
					!errors.length &&
					!failedResources.length &&
					!data.untranslated.length &&
					!data.untranslatedAttributes.length &&
					!data.overflow &&
					!data.tabTextOverflow.length &&
					!data.unlocalizedLinks.length &&
					data.manualControl;
				record({
					locale,
					width,
					route,
					status: response.status(),
					pass,
					errors,
					failedResources,
					...data
				});
				if (['', '/inventory', '/services', '/calculator', '/not-a-page'].includes(route))
					await p.screenshot({ path: `${out}/${locale}-${width}-${route.slice(1) || 'home'}.png` });
			} catch (error) {
				record({ locale, width, route, pass: false, error: error.message, errors });
			}
			await p.close();
		}
		await context.close();
	}
await browser.close();
const summary = {
	cases: results.length,
	passed: results.filter((r) => r.pass).length,
	failed: results.filter((r) => !r.pass).length,
	skipped: 0,
	base,
	origin
};
fs.writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
console.log(summary);
if (summary.failed) process.exitCode = 1;
