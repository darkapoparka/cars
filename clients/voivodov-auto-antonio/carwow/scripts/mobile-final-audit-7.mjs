// Keyboard-readiness probe: every input/textarea/select font-size on every
// surface (iOS zooms on focus when < 16px), incl. inside opened drawers.
import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE || 'http://[::1]:5178';

const browser = await chromium.launch();
const ctx = await browser.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true
});
const page = await ctx.newPage();

const collect = (where) =>
	page.evaluate((label) => {
		return [...document.querySelectorAll('input, textarea, select')]
			.filter((el) => {
				const r = el.getBoundingClientRect();
				return r.width > 0 && r.height > 0;
			})
			.map((el) => {
				const s = getComputedStyle(el);
				return {
					where: label,
					tag: el.tagName.toLowerCase(),
					id: el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.name || '',
					fontSize: s.fontSize,
					h: Math.round(el.getBoundingClientRect().height)
				};
			});
	}, where);

const all = [];

await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
all.push(...(await collect('home')));

// home search drawer
try {
	await page
		.locator('.mh-hero button, .mh-hero [role="button"]')
		.filter({ hasText: /Търси|марка/i })
		.first()
		.click({ timeout: 3000 });
	await page.waitForTimeout(700);
	all.push(...(await collect('home-search-drawer')));
	await page.keyboard.press('Escape');
	await page.waitForTimeout(400);
} catch {
	console.log('no search drawer trigger');
}

// home sell mode (VIN drawer)
try {
	await page
		.locator('.mh-hero__modes button')
		.filter({ hasText: /Продай/i })
		.click({ timeout: 3000 });
	await page.waitForTimeout(400);
	await page
		.locator('.mh-hero button')
		.filter({ hasText: /VIN|рег|номер|Продай/i })
		.first()
		.click({ timeout: 3000 });
	await page.waitForTimeout(700);
	all.push(...(await collect('home-sell-drawer')));
	await page.keyboard.press('Escape');
} catch {
	console.log('no sell drawer');
}

for (const route of ['/inventory', '/sell-your-car', '/contact', '/favorites']) {
	await page.goto(BASE + route, { waitUntil: 'networkidle' });
	await page.waitForTimeout(700);
	all.push(...(await collect(route)));
}

// inventory filter drawer
await page.goto(BASE + '/inventory', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
try {
	await page
		.locator('button')
		.filter({ hasText: /Филтри/i })
		.first()
		.click({ timeout: 3000 });
	await page.waitForTimeout(600);
	all.push(...(await collect('inventory-filter-drawer')));
	// open a sub-drawer with numeric fields if present (Цена)
	const price = page
		.locator('.mobile-drawer button, [class*="filter"] button')
		.filter({ hasText: /Цена/i })
		.first();
	await price.click({ timeout: 3000 });
	await page.waitForTimeout(600);
	all.push(...(await collect('inventory-price-drawer')));
} catch (e) {
	console.log('filter drawers:', e.message.split('\n')[0]);
}

const bad = all.filter((i) => parseFloat(i.fontSize) < 16);
console.log('ALL INPUTS:', all.length);
for (const i of all)
	console.log(
		`${i.where.padEnd(24)} ${i.tag.padEnd(9)} ${String(i.fontSize).padEnd(6)} h=${i.h}  ${i.id.slice(0, 30)}`
	);
console.log('\nSUB-16PX (iOS zoom risk):', bad.length);
for (const i of bad) console.log('!!', i.where, i.tag, i.fontSize, i.id);

await browser.close();
