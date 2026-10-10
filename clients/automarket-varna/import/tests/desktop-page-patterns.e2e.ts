import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => {
	test.skip(Boolean(isMobile), 'Desktop page composition.');
});

for (const locale of ['bg', 'en']) {
	test(`${locale}: all desktop image heroes share their frame`, async ({ page }) => {
		for (const width of [768, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			let frameBaseline;
			let intakeFrameBaseline;
			let titleBaseline;
			let panelBaseline;
			let artworkBaseline;
			let intakeArtworkBaseline;
			let ctaBaseline;
			for (const route of [
				'',
				'inventory',
				'services',
				'about',
				'contact',
				'sell-your-car',
				'financing',
				'import'
			]) {
				const intake = ['sell-your-car', 'financing'].includes(route);
				await visit(page, `/${locale}${route ? '/' + route : ''}`);
				await page.evaluate(async () => {
					await document.fonts.ready;
					await new Promise((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(resolve))
					);
				});
				const geometry = await page.locator('.site-intro').evaluate((node) => {
					const rect = node.getBoundingClientRect();
					const panel = node.querySelector('.desktop-discovery-panel');
					const panelStyle = panel ? getComputedStyle(panel) : undefined;
					return {
						top: rect.y,
						height: rect.height,
						minimum: getComputedStyle(node).minHeight,
						title: node.querySelector('h1')!.getBoundingClientRect().y,
						panel: panel
							? {
									bounds: panel.getBoundingClientRect().toJSON(),
									color: panelStyle!.backgroundColor,
									border: panelStyle!.border,
									radius: panelStyle!.borderRadius,
									shadow: panelStyle!.boxShadow
								}
							: undefined,
						artwork: [...node.querySelectorAll('.hero-cars__car')].map((car) =>
							car.getBoundingClientRect().toJSON()
						)
					};
				});
				const frame = { top: geometry.top, height: geometry.height };
				if (intake) intakeFrameBaseline ??= frame;
				else frameBaseline ??= frame;
				const expectedFrame = intake ? intakeFrameBaseline! : frameBaseline!;
				// Content-driven heroes can grow by a fractional pixel with font metrics.
				expect(frame.top, `${width}: ${route || 'home'} hero top`).toBe(expectedFrame.top);
				expect(
					Math.abs(frame.height - expectedFrame.height),
					`${width}: ${route || 'home'} hero frame`
				).toBeLessThan(1);
				expect(geometry.minimum).toBe(
					intake ? (width === 768 ? '260px' : '240px') : width === 768 ? '452px' : '400px'
				);
				titleBaseline ??= geometry.title;
				expect(geometry.title, `${width}: ${route || 'home'} title anchor`).toBe(titleBaseline);
				if (intake) intakeArtworkBaseline ??= geometry.artwork;
				else artworkBaseline ??= geometry.artwork;
				expect(geometry.artwork, `${width}: ${route || 'home'} car artwork`).toEqual(
					intake ? intakeArtworkBaseline : artworkBaseline
				);
				if (['', 'inventory', 'services', 'about', 'contact', 'import'].includes(route)) {
					panelBaseline ??= geometry.panel;
					expect(geometry.panel, `${width}: ${route || 'home'} white panel`).toEqual(panelBaseline);
					await expect(page.locator('.site-intro__content > p')).toHaveCount(0);
				}
				if (['about', 'contact'].includes(route)) {
					const cta = await page.locator('.desktop-hero-actions').boundingBox();
					ctaBaseline ??= cta;
					expect(cta, `${width}: ${route} primary buttons`).toEqual(ctaBaseline);
				}

				if (!route) {
					const box = page.locator('.home-hero__box');
					const initial = await box.boundingBox();
					for (const tab of await box.getByRole('tab').all()) {
						await tab.click();
						const bounds = await box.boundingBox();
						expect(bounds!.height).toBe(initial!.height);
						expect(bounds!.y).toBe(initial!.y);
						const hero = await page.locator('.site-intro').boundingBox();
						expect(hero!.height).toBe(frameBaseline!.height);
					}
				}
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
				if (!['services', 'about', 'contact'].includes(route)) continue;
				const selection = await page.locator('.site-nav-item.active > a').evaluate((node) => {
					const style = getComputedStyle(node);
					const inactive = document.querySelector('.site-nav-item:not(.active) > a')!;
					return {
						underline: getComputedStyle(node, '::after').display,
						background: style.backgroundColor,
						inactiveBackground: getComputedStyle(inactive).backgroundColor,
						radius: parseFloat(style.borderRadius),
						height: node.getBoundingClientRect().height
					};
				});
				expect(selection.underline).toBe('none');
				expect(selection.background).not.toBe(selection.inactiveBackground);
				expect(selection.radius).toBeGreaterThan(0);
				expect(selection.height).toBeGreaterThanOrEqual(44);
			}
		}
	});

	test(`${locale}: service search filters descriptions, clears and follows useful destinations`, async ({
		page
	}) => {
		await visit(page, `/${locale}/services`);
		const search = page.getByRole('searchbox', {
			name: locale === 'en' ? 'Search services' : 'Търси услуга'
		});
		await expect(page.locator('.service-card')).toHaveCount(6);
		await expect(search).toHaveAttribute(
			'placeholder',
			locale === 'en' ? 'Search services (6)' : 'Търси услуга (6)'
		);
		await expect(page.locator('.service-utility .service-count')).toHaveCount(0);
		const tasks = page.locator('.desktop-service-finder').getByRole('tab');
		await expect(tasks).toHaveCount(4);
		for (const task of await tasks.all()) {
			await task.click();
			await expect(task).toHaveAttribute('aria-selected', 'true');
			await expect(search).toBeEmpty();
			await expect(page.locator('.service-card')).toHaveCount(6);
		}
		await tasks.first().focus();
		await tasks.first().press('ArrowRight');
		await expect(tasks.nth(1)).toBeFocused();
		await expect(tasks.nth(1)).toHaveAttribute('aria-selected', 'true');
		await search.fill('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await expect(page.locator('.service-card > a')).toHaveAttribute('href', `/${locale}/import`);
		await search.fill('no such service');
		await expect(page.locator('.service-card')).toHaveCount(0);
		await expect(search).toHaveAttribute(
			'placeholder',
			locale === 'en' ? 'Search services (6)' : 'Търси услуга (6)'
		);
		await expect(page.locator('.service-empty')).toBeVisible();
		await page.locator('.service-empty').getByRole('button').click();
		await expect(search).toBeEmpty();
		await expect(page.locator('.service-card')).toHaveCount(6);
		await search.fill('VIN');
		await search.press('Enter');
		await expect(page).toHaveURL(
			(url) => url.pathname === `/${locale}/services` && url.searchParams.get('q') === 'VIN'
		);
		await expect(page.locator('.service-card')).toHaveCount(1);
		await page.locator('.service-card > a').click();
		await expect(
			page.getByRole('dialog', {
				name: locale === 'en' ? 'Listing / VIN check' : 'Проверка на обява / VIN',
				exact: true
			})
		).toBeVisible();
		await expect(page).toHaveURL(
			(url) => url.pathname === `/${locale}/services` && url.searchParams.get('q') === 'VIN'
		);
		await page.keyboard.press('Escape');
		await expect(page.locator('.service-card > a')).toBeFocused();
	});
}

test('service search is server-rendered and service links are distinct', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 1000 }
	});
	try {
		const page = await context.newPage();
		await page.goto(`${baseURL}/en/services?q=VIN`);
		await expect(page.locator('.service-card')).toHaveCount(1);
		await expect(page.getByRole('searchbox')).toHaveValue('VIN');
	} finally {
		await context.close();
	}
});

test('page actions are real destinations and the services directory is accessible', async ({
	page
}) => {
	await visit(page, '/en/about');
	await expect(
		page.locator('.site-intro').getByRole('link', { name: 'Browse our cars' })
	).toHaveAttribute('href', /^\/en\/inventory(?:\?|$)/);
	await expect(
		page.locator('.site-intro').getByRole('link', { name: 'View services' })
	).toHaveAttribute('href', /^\/en\/services(?:\?|$)/);
	const directions = page
		.locator('.contact-location')
		.getByRole('link', { name: 'Get directions' });
	await expect(directions).toHaveAttribute('href', /^https:\/\/www.google.com\/maps/);
	const action = (await directions.boundingBox())!;
	expect(action.height).toBeGreaterThanOrEqual(44);
	await expect(page.locator('.site-intro .social-links a')).toHaveCount(3);
	await expect(page.locator('.site-footer .social-links a')).toHaveCount(3);
	await visit(page, '/en/contact');
	const phone = page.locator('.site-intro a[href^="tel:"]');
	await expect(phone).toHaveCount(1);
	await expect(phone).toHaveAccessibleName(/\d+/);
	expect((await phone.boundingBox())!.height).toBeGreaterThanOrEqual(48);
	await expect(
		page.locator('.contact-location').getByRole('link', { name: 'Get directions' })
	).toHaveAttribute('href', /^https:\/\/www.google.com\/maps/);
	await expect(page.locator('.site-intro .site-action')).toHaveCount(2);
	await expect(page.locator('.site-intro .contact-hero-location')).toHaveAttribute(
		'href',
		/^https:\/\/www.google.com\/maps/
	);
	await expect(page.locator('.site-intro .social-links a')).toHaveCount(3);
	await expect(page.locator('.site-intro a[href^="mailto:"]')).toHaveCount(0);
	await expect(
		page.locator('.desktop-hero-actions').getByRole('link', { name: 'Enquiry', exact: true })
	).toHaveAttribute('href', '#contact-enquiry');
	await visit(page, '/en/services');
	const hrefs = await page
		.locator('.service-card > a')
		.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
	expect(new Set(hrefs).size).toBe(6);
	const accessibility = await new AxeBuilder({ page })
		.include('#main-content')
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(accessibility.violations).toEqual([]);
});
