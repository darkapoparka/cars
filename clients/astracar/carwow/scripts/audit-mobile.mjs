import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit, devices } from '@playwright/test';
import { hasAuditIssues, toAuditRoute } from './lib/mobile-audit.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = new URL(process.env.AUDIT_BASE ?? 'http://127.0.0.1:6463');
const engineName = process.env.AUDIT_BROWSER ?? 'chromium';
const engine = { chromium, firefox, webkit }[engineName];
if (!engine) throw new Error('AUDIT_BROWSER must be chromium, firefox, or webkit');
const widths = (process.env.AUDIT_WIDTHS ?? '390,320,430,1440').split(',').map(Number);
if (widths.some((width) => !Number.isInteger(width) || width < 280 || width > 4000))
	throw new Error('Invalid AUDIT_WIDTHS');
const output = path.resolve(root, process.env.AUDIT_OUTPUT ?? '.audit/mobile-current');
fs.mkdirSync(output, { recursive: true });
const coreRoutes = [
	'/',
	'/inventory',
	'/inventory/map',
	'/sell-your-car',
	'/sell-your-car/request',
	'/contact',
	'/contact?intent=import',
	'/services',
	'/about',
	'/about/daynight-auto-plovdiv',
	'/financing',
	'/favorites',
	'/compare',
	'/blog',
	'/calculator',
	'/faq',
	'/reviews',
	'/terms',
	'/team',
	'/home1',
	'/home1-box',
	'/presentation/home2',
	'/presentation/home3',
	'/admin/login'
];
const routes = new Set(coreRoutes);
const browser = await engine.launch();
const results = [];
try {
	const discovery = await browser.newPage();
	try {
		// The sitemap includes vehicles beyond the first inventory pagination page.
		const sitemap = await discovery.request.get(new URL('/sitemap.xml', base).href);
		if (!sitemap.ok()) throw new Error(`Sitemap discovery failed: HTTP ${sitemap.status()}`);
		const locations = await discovery.evaluate(
			(xml) => {
				const document = new DOMParser().parseFromString(xml, 'application/xml');
				if (document.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
				return [...document.querySelectorAll('url > loc')].map((node) => node.textContent);
			},
			await sitemap.text()
		);
		for (const href of locations) {
			const route = toAuditRoute(href, base);
			if (route) routes.add(route);
		}
		for (const route of ['/inventory', '/blog', '/team']) {
			await discovery.goto(new URL(route, base).href, {
				waitUntil: 'networkidle',
				timeout: 30_000
			});
			const links = await discovery
				.locator('a[href]')
				.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
			for (const href of links)
				if (href?.startsWith(route + '/') && !href.includes('?')) routes.add(href);
		}
	} finally {
		await discovery.close();
	}
	fs.writeFileSync(path.join(output, 'routes.json'), JSON.stringify([...routes], null, 2));
	for (const width of widths) {
		const selectedRoutes =
			width === 390 || process.env.AUDIT_ALL_WIDTHS === '1' ? [...routes] : coreRoutes;
		for (const route of selectedRoutes) {
			// Fresh contexts bound browser memory and prevent route/garage/CSS state contaminating evidence.
			const context = await browser.newContext(
				width >= 992
					? { viewport: { width, height: 1000 } }
					: {
							...devices['iPhone 13'],
							viewport: { width, height: 844 },
							deviceScaleFactor: 1,
							isMobile: engineName !== 'firefox'
						}
			);
			const page = await context.newPage();
			const errors = [];
			const httpErrors = [];
			page.on('response', (response) => {
				if (response.status() >= 400)
					httpErrors.push({ status: response.status(), url: response.url() });
			});
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error') errors.push(message.text());
			});
			try {
				const response = await page.goto(new URL(route, base).href, {
					waitUntil: 'networkidle',
					timeout: 30_000
				});
				await page.evaluate(() => document.fonts.ready);
				const name =
					(route === '/' ? 'home' : route.slice(1).replace(/[^a-z0-9-]/gi, '_')) + '-' + width;
				await page.screenshot({
					path: path.join(output, name + '-viewport.png'),
					animations: 'disabled'
				});
				// Initial-viewport evidence stays untouched; full-page QA must inspect lazy media too.
				await page.evaluate(async () => {
					const images = [...document.images].filter((image) => image.currentSrc || image.src);
					for (const image of images) image.loading = 'eager';
					let timer;
					try {
						await Promise.race([
							Promise.all(images.map((image) => image.decode().catch(() => undefined))),
							new Promise((resolve) => {
								timer = setTimeout(resolve, 8000);
							})
						]);
					} finally {
						clearTimeout(timer);
					}
				});
				if (width === 390) {
					await page.evaluate(async () => {
						for (let y = 0; y < document.body.scrollHeight; y += 750) {
							window.scrollTo(0, y);
							await new Promise((resolve) => requestAnimationFrame(resolve));
						}
						window.scrollTo(0, 0);
					});
				}
				await page.screenshot({
					path: path.join(output, name + '.png'),
					fullPage: width === 390,
					animations: 'disabled'
				});
				const metrics = await page.evaluate(() => {
					const visible = (element) => {
						const rect = element.getBoundingClientRect();
						return rect.width > 0 && rect.height > 0;
					};
					return {
						title: document.title,
						width: innerWidth,
						scrollWidth: document.documentElement.scrollWidth,
						mains: [...document.querySelectorAll('main')].filter(visible).length,
						targets: document.querySelectorAll('#main-content').length,
						headings: [...document.querySelectorAll('h1')]
							.filter(visible)
							.map((element) => element.textContent.trim()),
						pending: [...document.images]
							.filter((image) => !image.complete && image.currentSrc)
							.map((image) => image.getAttribute('src')),
						broken: [...document.images]
							.filter((image) => image.complete && !image.naturalWidth && image.currentSrc)
							.map((image) => image.getAttribute('src'))
					};
				});
				results.push({
					route,
					width,
					status: response.status(),
					...metrics,
					httpErrors,
					errors: [...new Set(errors)]
				});
				console.log(JSON.stringify(results.at(-1)));
			} catch (error) {
				results.push({ route, width, error: error.message });
				console.error(route, width, error.message);
			} finally {
				await context.close();
				fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
			}
		}
	}
} finally {
	await browser.close();
}
const issues = results.filter(hasAuditIssues);
fs.writeFileSync(
	path.join(output, 'summary.json'),
	JSON.stringify(
		{ base: base.href, browser: engineName, routes: routes.size, cases: results.length, issues },
		null,
		2
	)
);
console.log(
	`Audit: ${routes.size} routes, ${results.length} cases, ${issues.length} cases needing review. Evidence: ${output}`
);
if (issues.length) process.exitCode = 1;
