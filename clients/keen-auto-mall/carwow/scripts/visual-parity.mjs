import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const mode = modeArg?.split('=')[1] ?? (args.has('--baseline') ? 'baseline' : 'verify');
const baseURL = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:5178';
const outDir = path.resolve('.tmp', 'visual-parity', mode);

const viewports = [
	{ name: 'desktop', shell: 'desktop', width: 1440, height: 1100 },
	{ name: 'tablet-portrait', shell: 'mobile', width: 768, height: 1024 },
	{ name: 'tablet-landscape', shell: 'desktop', width: 1024, height: 768 },
	{ name: 'mobile', shell: 'mobile', width: 390, height: 900 }
];

const routes = [
	{
		name: 'home',
		pathname: '/',
		required: {
			desktop: [
				'.daynight-home-shell',
				'.daynight-home-hero',
				'.daynight-home-action-card',
				'footer'
			],
			mobile: ['.mobile-home', '.mh-hero', '.mh-car', '.mh-brandcard']
		}
	},
	{
		name: 'inventory',
		pathname: '/inventory',
		required: {
			desktop: [
				'.inventory-template-shell',
				'.daynight-inventory-viewport',
				'.daynight-inventory-listings-shell'
			],
			mobile: ['.mobile-inventory', '.mobile-inventory-search', '.mobile-inventory-card']
		}
	},
	{
		name: 'detail',
		pathname: '/inventory/mercedes-benz-gla-45-amg-405323',
		required: {
			desktop: ['.daynight-detail', '.listing-details', '.pdp-card', '.daynight-pdp-title'],
			mobile: ['.mobile-detail', '.mobile-detail-sheet', '.mobile-detail-sheet__title']
		}
	},
	{
		name: 'about',
		pathname: '/about',
		required: {
			desktop: [
				'.about-page',
				'.daynight-inner-hero--about',
				'.daynight-about-location',
				'.daynight-about-brand-card'
			],
			mobile: ['.mobile-about-app', '.mobile-about-hero']
		}
	},
	{
		name: 'services',
		pathname: '/services',
		required: {
			desktop: ['.desktop-services', '.desktop-services-hero', '#services-request'],
			mobile: ['.mobile-services-app', '.mobile-services-hero', '.mobile-services-card']
		}
	},
	{
		name: 'sell-your-car',
		pathname: '/sell-your-car',
		required: {
			desktop: ['.desktop-sell', '.desktop-sell-hero', '.desktop-sell-form'],
			mobile: ['.mobile-sell', '.ms-hero', '.ms-quick-start']
		}
	},
	{
		name: 'contact',
		pathname: '/contact',
		required: {
			desktop: [
				'.daynight-contact-primary',
				'.contact-page-form',
				'.daynight-contact-map__overlay'
			],
			mobile: ['.mobile-contact-app', '.mobile-contact-hero', '.mobile-contact-form']
		}
	},
	{
		name: 'favorites',
		pathname: '/favorites',
		required: {
			desktop: ['.desktop-favorites', '.desktop-favorites__hero', '.desktop-favorites__grid'],
			mobile: ['.mobile-favorites', '.mobile-favorites-top', '.mobile-favorites-results']
		}
	},
	{
		name: 'inventory-map',
		pathname: '/inventory/map',
		required: {
			desktop: ['.inventory-map-template-shell', '.listing-halfmap'],
			mobile: ['.mobile-inventory', '.mobile-inventory-card']
		}
	}
];

function safeName(routeName, viewportName) {
	return `${viewportName}__${routeName}`;
}

async function captureRoute(browser, route, viewport) {
	const page = await browser.newPage({
		viewport: { width: viewport.width, height: viewport.height },
		deviceScaleFactor: 1
	});
	const messages = [];

	page.on('console', (message) => {
		if (['error', 'warning'].includes(message.type())) {
			messages.push(`${message.type()}: ${message.text()}`);
		}
	});
	page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`));

	const url = new URL(route.pathname, baseURL).href;
	await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });

	const requiredSelectors = route.required[viewport.shell] ?? route.required.desktop;
	const checks = await page.evaluate((requiredSelectors) => {
		const selectFirst = (selector) => {
			for (const part of selector.split(',').map((value) => value.trim())) {
				const element = document.querySelector(part);

				if (element) {
					return element;
				}
			}

			return null;
		};

		const isVisible = (element) => {
			if (!element) {
				return false;
			}

			const style = getComputedStyle(element);

			if (
				style.display === 'none' ||
				style.visibility === 'hidden' ||
				Number(style.opacity) === 0
			) {
				return false;
			}

			const rect = element.getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		};

		const hero =
			document.querySelector('.daynight-home-shell .daynight-home-hero') ??
			document.querySelector('.daynight-home-hero') ??
			document.querySelector('main');
		const heroStyle = hero ? getComputedStyle(hero) : null;

		return {
			title: document.title,
			bodyClass: document.body.className,
			requiredSelectors: requiredSelectors.map((selector) => {
				const element = selectFirst(selector);

				return {
					selector,
					found: Boolean(element),
					visible: isVisible(element)
				};
			}),
			appCssLinks: document.querySelectorAll('link[href*="/assets/app.css"]').length,
			styleTags: document.querySelectorAll('style').length,
			heroHeight: heroStyle?.height ?? null,
			heroDisplay: heroStyle?.display ?? null
		};
	}, requiredSelectors);

	const missing = checks.requiredSelectors
		.filter((check) => !check.found || !check.visible)
		.map((check) => check.selector);
	const screenshot = path.join(outDir, `${safeName(route.name, viewport.name)}.png`);
	await page.screenshot({ path: screenshot, fullPage: true });
	await page.close();

	return {
		route: route.pathname,
		viewport: viewport.name,
		viewportShell: viewport.shell,
		url,
		screenshot,
		missing,
		consoleMessages: messages,
		checks
	};
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
	for (const viewport of viewports) {
		for (const route of routes) {
			results.push(await captureRoute(browser, route, viewport));
		}
	}
} finally {
	await browser.close();
}

function hasFencedAppCss(result) {
	return (
		result.checks.appCssLinks > 0 &&
		(result.viewportShell === 'mobile' || result.route === '/favorites')
	);
}

const failed = results.filter(
	(result) => result.missing.length > 0 || result.consoleMessages.some(Boolean)
);
const manifest = {
	mode,
	baseURL,
	capturedAt: new Date().toISOString(),
	results
};

await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

for (const result of results) {
	const issues = [];
	if (result.missing.length > 0) {
		issues.push(`missing: ${result.missing.join(', ')}`);
	}
	if (hasFencedAppCss(result)) {
		issues.push(`app.css fenced: ${result.checks.appCssLinks}`);
	}
	if (result.consoleMessages.length > 0) {
		issues.push(`console: ${result.consoleMessages.length}`);
	}

	console.log(
		`${result.viewport.padEnd(7)} ${result.route.padEnd(36)} ` +
			`${issues.length ? issues.join('; ') : 'ok'}`
	);
}

if (failed.length > 0) {
	console.error(`Visual parity capture found ${failed.length} route/viewport issue(s).`);
	process.exitCode = 1;
}
