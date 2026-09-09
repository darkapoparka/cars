import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const mode = modeArg?.split('=')[1] ?? 'before';
const baseURL = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:5178';
const outDir = path.resolve('.tmp', 'desktop-audit', mode);

const routes = [
	{ name: 'home', pathname: '/' },
	{ name: 'inventory', pathname: '/inventory' },
	{ name: 'detail', pathname: '/inventory/mercedes-benz-gla-45-amg-405323' },
	{ name: 'inventory-map', pathname: '/inventory/map' },
	{ name: 'about', pathname: '/about' },
	{ name: 'contact', pathname: '/contact' },
	{ name: 'services', pathname: '/services' },
	{ name: 'sell-your-car', pathname: '/sell-your-car' },
	{ name: 'financing', pathname: '/financing' },
	{ name: 'reviews', pathname: '/reviews' },
	{ name: 'team', pathname: '/team' },
	{ name: 'blog', pathname: '/blog' },
	{ name: 'faq', pathname: '/faq' },
	{ name: 'dashboard', pathname: '/dashboard' },
	{ name: 'favorites', pathname: '/favorites' }
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
	viewport: { width: 1440, height: 1100 },
	deviceScaleFactor: 1
});

const results = [];
const consoleIssues = [];
page.on('console', (message) => {
	if (['error', 'warning'].includes(message.type())) {
		consoleIssues.push(`${message.type()}: ${message.text()}`);
	}
});
page.on('pageerror', (error) => consoleIssues.push(`pageerror: ${error.message}`));

try {
	for (const route of routes) {
		consoleIssues.length = 0;
		const url = new URL(route.pathname, baseURL).href;
		try {
			await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
		} catch {
			await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
		}
		await page.waitForTimeout(700);
		const screenshot = path.join(outDir, `${route.name}.png`);
		await page.screenshot({ path: screenshot, fullPage: true });
		results.push({
			route: route.pathname,
			screenshot,
			title: await page.title(),
			consoleIssues: [...consoleIssues]
		});
		console.log(
			`${route.pathname.padEnd(36)} captured${consoleIssues.length ? ` (${consoleIssues.length} console issue(s))` : ''}`
		);
	}
} finally {
	await browser.close();
}

await writeFile(
	path.join(outDir, 'manifest.json'),
	`${JSON.stringify({ mode, baseURL, results }, null, 2)}\n`
);
