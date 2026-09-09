// Console-error + horizontal-overflow sweep across all mobile routes.
import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE || 'http://[::1]:5178';
const ROUTES = [
	'/',
	'/inventory',
	'/inventory/mercedes-benz-150i-2010-15437',
	'/sell-your-car',
	'/services',
	'/contact',
	'/about',
	'/favorites'
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true
});
const page = await ctx.newPage();

const errors = [];
page.on('console', (msg) => {
	if (msg.type() === 'error') errors.push({ route: page.url(), text: msg.text().slice(0, 200) });
});
page.on('pageerror', (err) =>
	errors.push({ route: page.url(), text: 'PAGEERROR: ' + err.message.slice(0, 200) })
);

for (const route of ROUTES) {
	await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch((e) => {
		errors.push({ route, text: 'NAV FAIL: ' + e.message.split('\n')[0] });
	});
	await page.waitForTimeout(800);
	const overflow = await page.evaluate(() => {
		const docW = document.documentElement.clientWidth;
		const sw = document.documentElement.scrollWidth;
		const bad = [];
		if (sw > docW + 1) {
			for (const el of document.querySelectorAll('body *')) {
				const r = el.getBoundingClientRect();
				if (r.width > 5 && (r.right > docW + 2 || r.left < -2)) {
					const s = getComputedStyle(el);
					// skip intentional horizontal scrollers' children
					let p = el.parentElement,
						inScroller = false;
					while (p) {
						const ps = getComputedStyle(p);
						if (/(auto|scroll)/.test(ps.overflowX)) {
							inScroller = true;
							break;
						}
						p = p.parentElement;
					}
					if (!inScroller && s.position !== 'fixed')
						bad.push(
							`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(r.right)}`
						);
				}
			}
		}
		return { docW, sw, bad: bad.slice(0, 8) };
	});
	console.log(
		route.padEnd(45),
		overflow.sw > overflow.docW + 1 ? `OVERFLOW ${overflow.sw}px: ${overflow.bad.join(', ')}` : 'ok'
	);
}

console.log('\nCONSOLE ERRORS:', errors.length);
for (const e of errors.slice(0, 20)) console.log('-', e.route, '::', e.text);

await browser.close();
