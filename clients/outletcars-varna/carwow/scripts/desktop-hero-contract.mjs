import { chromium } from '@playwright/test';

const baseURL = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:6517';
const strict = process.argv.includes('--strict');

const routes = [
	['inventory', '/inventory'],
	['services', '/services'],
	['sell', '/sell-your-car'],
	['about', '/about'],
	['dealer', '/about/daynight-auto-plovdiv'],
	['contact', '/contact'],
	['financing', '/financing'],
	['reviews', '/reviews'],
	['calculator', '/calculator'],
	['compare', '/compare'],
	['team', '/team'],
	['team-member', '/team/prodazhbi-showroom'],
	['blog', '/blog'],
	['article', '/blog/kak-da-kupim-upotrebyavan-avtomobil'],
	['faq', '/faq'],
	['terms', '/terms'],
	['favorites', '/favorites']
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failures = [];
for (const [name, pathname] of routes) {
	await page.goto(new URL(pathname, baseURL).href, {
		waitUntil: 'domcontentloaded',
		timeout: 30_000
	});
	await page.waitForTimeout(180);

	const metrics = await page.evaluate(() => {
		const chrome = document.querySelector('[data-daynight-site-chrome]');
		const hero = document.querySelector('.daynight-yellow-route-hero');
		const deck = hero?.querySelector('.daynight-yellow-route-hero__deck');
		const h1 = hero?.querySelector('h1');
		const rect = (node) => (node ? node.getBoundingClientRect() : null);
		const style = (node) => (node ? getComputedStyle(node) : null);
		const controls = deck
			? [...deck.querySelectorAll('a, button, input, select')].map((node) => ({
					tag: node.tagName,
					height: Math.round(node.getBoundingClientRect().height),
					radius: style(node)?.borderRadius
				}))
			: [];

		return {
			chromeHeight: Math.round(rect(chrome)?.height ?? 0),
			heroTop: Math.round(rect(hero)?.top ?? -1),
			heroHeight: Math.round(rect(hero)?.height ?? 0),
			deckWidth: Math.round(rect(deck)?.width ?? 0),
			deckHeight: Math.round(rect(deck)?.height ?? 0),
			h1Size: Number.parseFloat(style(h1)?.fontSize ?? '0'),
			controls
		};
	});

	const hasContract =
		metrics.chromeHeight === 94 &&
		metrics.heroTop === 94 &&
		metrics.heroHeight >= 300 &&
		metrics.deckWidth >= 600 &&
		metrics.h1Size >= 47 &&
		metrics.h1Size <= 49;

	if (!hasContract) failures.push({ pathname, metrics });
	console.log(`${name.padEnd(12)} ${pathname.padEnd(42)} ${hasContract ? 'OK' : 'FAIL'}`);
	console.log(JSON.stringify(metrics));
}

await browser.close();
if (failures.length) {
	console.error(`\n${failures.length} route(s) violate the desktop hero contract.`);
	for (const failure of failures) {
		console.error(`${failure.pathname}: ${JSON.stringify(failure.metrics)}`);
	}
	if (strict) process.exitCode = 1;
} else {
	console.log('\nAll audited storefront routes satisfy the desktop hero contract.');
}
