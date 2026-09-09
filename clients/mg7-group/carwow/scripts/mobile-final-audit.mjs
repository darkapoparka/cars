// Throwaway visual-audit script: screenshots every mobile surface on :5178.
// Run: node scripts/mobile-final-audit.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5178';
const OUT = 'm:/daynightauto-svelte/.audit-shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
	userAgent:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});
const page = await ctx.newPage();

const shot = (name, opts = {}) => page.screenshot({ path: `${OUT}/${name}.png`, ...opts });

const goto = async (path) => {
	await page.goto(BASE + path, { waitUntil: 'networkidle' });
	await page.waitForTimeout(600);
};

// ---------- HOME ----------
await goto('/');
await shot('01-home-top');
await page.mouse.wheel(0, 700);
await page.waitForTimeout(400);
await shot('02-home-scroll1');
await page.mouse.wheel(0, 700);
await page.waitForTimeout(400);
await shot('03-home-scroll2');
await page.mouse.wheel(0, 700);
await page.waitForTimeout(400);
await shot('04-home-scroll3');
await page.mouse.wheel(0, 2000);
await page.waitForTimeout(400);
await shot('05-home-bottom');
await page.mouse.wheel(0, 3000);
await page.waitForTimeout(400);
await shot('06-home-footer');

// search drawer (dark search card on hero)
await goto('/');
try {
	const search = page
		.locator('.mh-hero button, .mh-hero [role="button"], .mh-search, [class*="search"]')
		.filter({ hasText: /Търси|търсене|марка|модел/i })
		.first();
	await search.click({ timeout: 4000 });
	await page.waitForTimeout(800);
	await shot('07-home-search-drawer');
	await page.keyboard.press('Escape');
} catch (e) {
	console.log('search drawer:', e.message.split('\n')[0]);
}

// menu sheet from bottom dock
await goto('/');
try {
	await page.locator('button[aria-label="Меню"]').click({ timeout: 4000 });
	await page.waitForTimeout(800);
	await shot('08-menu-sheet');
	await page.keyboard.press('Escape');
} catch (e) {
	console.log('menu sheet:', e.message.split('\n')[0]);
}

// ---------- SELL ----------
await goto('/sell-your-car');
await shot('10-sell-top');
await shot('11-sell-full', { fullPage: true });

// ---------- SERVICES ----------
await goto('/services');
await shot('12-services-top');
await shot('13-services-full', { fullPage: true });

// ---------- CONTACT ----------
await goto('/contact');
await shot('14-contact-full', { fullPage: true });

// ---------- INVENTORY ----------
await goto('/inventory');
await page.waitForTimeout(1200);
await shot('15-inventory-top');
await page.mouse.wheel(0, 800);
await page.waitForTimeout(400);
await shot('16-inventory-scroll');

// filter drawer
try {
	const filterBtn = page
		.locator('button')
		.filter({ hasText: /Филтри|Филтър/i })
		.first();
	await filterBtn.click({ timeout: 4000 });
	await page.waitForTimeout(800);
	await shot('17-inventory-filter-drawer');
	await page.keyboard.press('Escape');
	await page.waitForTimeout(400);
} catch (e) {
	console.log('filter drawer:', e.message.split('\n')[0]);
}

// grab first PDP link
const pdpHref = await page
	.locator('a[href*="/inventory/"]')
	.first()
	.getAttribute('href')
	.catch(() => null);
console.log('PDP href:', pdpHref);

// ---------- PDP ----------
if (pdpHref) {
	await goto(pdpHref.replace(BASE, ''));
	await page.waitForTimeout(1000);
	await shot('18-pdp-initial');
	// drag the snap sheet up (vaul sheet; window scroll is a no-op)
	try {
		await page.mouse.move(195, 700);
		await page.mouse.down();
		await page.mouse.move(195, 200, { steps: 20 });
		await page.mouse.up();
		await page.waitForTimeout(800);
		await shot('19-pdp-sheet-up');
		// scroll inside the sheet
		await page.mouse.wheel(0, 900);
		await page.waitForTimeout(400);
		await shot('20-pdp-sheet-scrolled');
		await page.mouse.wheel(0, 1200);
		await page.waitForTimeout(400);
		await shot('21-pdp-sheet-scrolled2');
		await page.mouse.wheel(0, 2500);
		await page.waitForTimeout(400);
		await shot('22-pdp-sheet-bottom');
	} catch (e) {
		console.log('pdp sheet:', e.message.split('\n')[0]);
	}
}

// ---------- FAVORITES ----------
await goto('/favorites');
await shot('23-favorites');

await browser.close();
console.log('DONE — shots in', OUT);
