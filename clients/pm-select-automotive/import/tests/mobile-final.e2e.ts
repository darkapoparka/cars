import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile viewport coverage');

for (const locale of ['en', 'bg']) {
	test(`mobile ${locale} menu uses the shared admin demo and keeps saved cars`, async ({
		page
	}) => {
		await visit(page, `/${locale}`);
		await page
			.getByRole('navigation', {
				name: locale === 'en' ? 'Mobile navigation' : 'Мобилна навигация'
			})
			.getByRole('button')
			.click();
		const menu = page.getByRole('dialog');
		const admin = menu.getByRole('link', {
			name: locale === 'en' ? 'Admin dashboard (demo)' : 'Админ панел (демо)',
			exact: true
		});
		await expect(admin).toHaveAttribute('href', 'https://cars-admin-blue.vercel.app/');
		await expect(admin).toHaveAttribute('target', '_blank');
		await expect(admin).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(menu.locator('a[href^="/account/messages"]')).toHaveCount(0);
		await expect(menu.locator('a[href="/account"], a[href^="/account?"]')).toHaveCount(0);
		await expect(
			menu.getByRole('link', {
				name: locale === 'en' ? 'Saved cars' : 'Любими автомобили',
				exact: true
			})
		).toHaveAttribute('href', `/${locale}/account/favorites${locale === 'en' ? '?lang=en' : ''}`);
		// Check the external navigation contract independently of the hosted demo's availability.
		await page
			.context()
			.route('https://cars-admin-blue.vercel.app/**', (route) =>
				route.fulfill({ contentType: 'text/html', body: '<title>Shared admin destination</title>' })
			);
		const storefrontURL = page.url();
		const popupPromise = page.waitForEvent('popup');
		await admin.click();
		const popup = await popupPromise;
		await expect(popup).toHaveURL('https://cars-admin-blue.vercel.app/');
		await expect(page).toHaveURL(storefrontURL);
		await popup.close();
	});
}

test('mobile home prioritizes its visible photo without downloading desktop artwork', async ({
	page
}) => {
	const desktopImages: string[] = [];
	page.on('request', (request) => {
		if (/inventory-(bmw-x5|audi-sq5)-cutout/.test(request.url())) desktopImages.push(request.url());
	});
	await visit(page, '/en');
	const photo = page.locator('[data-daynight-home-vehicles] .card--img').first();
	await expect(photo).toHaveAttribute('loading', 'eager');
	await expect(photo).toHaveAttribute('fetchpriority', 'high');
	expect(desktopImages).toEqual([]);
});

test('visible mobile inventory photos load delivery renditions and Contact prioritizes its banner', async ({
	page
}) => {
	const desktopArtwork: string[] = [];
	page.on('request', (request) => {
		if (/\/megamenu\/inventory-(audi-a7|bmw-x5)-cutout/.test(request.url())) {
			desktopArtwork.push(request.url());
		}
	});
	await page.setViewportSize({ width: 320, height: 844 });
	await visit(page, '/en/inventory');
	const photos = page.locator('.daynight-inventory-mobile__cards .mobile-vehicle-card img');
	for (const photo of (await photos.all()).slice(0, 3)) {
		await expect(photo).toHaveAttribute('loading', 'eager');
		await expect(photo).toHaveAttribute('fetchpriority', 'high');
		await expect
			.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
			.toBeGreaterThan(0);
		expect(await photo.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain(
			'/delivery/vehicles/'
		);
	}
	expect(desktopArtwork).toEqual([]);
	await visit(page, '/en/contact');
	const preload = page.locator('head link[rel="preload"][as="image"]');
	await expect(preload).toHaveAttribute(
		'href',
		'/assets/daynight/proof-studio-import-handoff.webp'
	);
	await expect(preload).toHaveAttribute('media', '(max-width: 767px)');
	await expect(preload).toHaveAttribute('fetchpriority', 'high');
	await expect(preload).toHaveAttribute(
		'imagesrcset',
		/delivery\/services\/proof-studio-import-handoff/
	);
});

test('mobile comparison supports adding, removing and clearing cars', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 844 });
	await visit(page, '/en/compare');
	for (const title of ['BMW X3 30e xDrive', 'BMW X4 M Competition']) {
		await page.getByRole('button', { name: /Add a car/ }).click();
		const picker = page.getByRole('dialog', { name: 'Choose a car', exact: true });
		await picker.getByRole('searchbox').fill(title);
		await picker.getByRole('button', { name: 'Add ' + title, exact: true }).click();
		await expect(picker).not.toBeVisible();
		await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
	}
	const table = page.getByRole('table', { name: 'Vehicle specifications' });
	await expect(table.getByRole('columnheader')).toHaveCount(3);
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(result.violations.map(({ id }) => id)).toEqual([]);
	await table
		.getByRole('columnheader')
		.filter({ hasText: 'BMW X3' })
		.getByRole('button', { name: 'Remove' })
		.click();
	await expect(table.getByRole('columnheader')).toHaveCount(2);
	await page.getByRole('button', { name: 'Clear comparison' }).click();
	await expect(page.getByRole('heading', { name: 'Choose cars to compare' })).toBeVisible();
});

test('mobile service cards load delivery copies of every retained image', async ({ page }) => {
	const oversizedOrDesktop: string[] = [];
	page.on('request', (request) => {
		if (
			/\/services\/desktop\//.test(request.url()) ||
			/\/(hero\/home-05-showroom-exterior|footer-premium-request-v2|cta\/premium-cars-banner-v2)\.webp$/.test(
				request.url()
			)
		)
			oversizedOrDesktop.push(request.url());
	});
	await visit(page, '/bg/services');
	const photos = page.locator('.service-card img');
	await expect(photos).toHaveCount(6);
	for (const photo of await photos.all()) {
		await photo.scrollIntoViewIfNeeded();
		await expect
			.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
			.toBeGreaterThan(0);
		expect(await photo.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain(
			'/delivery/services/'
		);
	}
	expect(oversizedOrDesktop).toEqual([]);
});

for (const width of [320, 390]) {
	test(`vehicle toolbar remains keyboard reachable outside the persistent panel at ${width}`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 844 });
		await visit(page, '/en/inventory/11774283016080050');
		const save = page.getByRole('button', { name: 'Save', exact: true });
		await save.focus();
		await expect(save).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(save).toHaveAttribute('aria-pressed', 'true');
		await page.keyboard.press('Enter');
		await expect(save).toHaveAttribute('aria-pressed', 'false');
		const photo = page
			.getByRole('button', { name: 'Photos 1', exact: true })
			.and(page.locator('.daynight-mobile-pdp__image-button'));
		await photo.focus();
		await expect(photo).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('.daynight-mobile-pdp__viewer')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('.daynight-mobile-pdp__viewer')).not.toBeVisible();
		await expect(photo).toBeFocused();
		await page.getByRole('button', { name: 'Inquire', exact: true }).click();
		const inquiry = page.getByRole('dialog', { name: 'Send Inquiry about Vehicle', exact: true });
		await expect(inquiry).toBeVisible();
		await inquiry.getByRole('button', { name: 'Close', exact: true }).focus();
		await page.keyboard.press('Shift+Tab');
		await expect(inquiry.locator(':focus')).toHaveCount(1);
		await page.keyboard.press('Escape');
		await expect(inquiry).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Inquire', exact: true })).toBeFocused();
	});
}

for (const route of [
	'/en',
	'/en/inventory',
	'/en/inventory/11774283016080050',
	'/en/contact',
	'/en/import',
	'/en/sell-your-car',
	'/en/financing',
	'/en/calculator',
	'/en/about',
	'/en/services',
	'/en/blog',
	'/en/blog/vnos-ot-kanada-proverka',
	'/en/reviews',
	'/en/faqs',
	'/en/privacy',
	'/en/terms',
	'/en/cookies',
	'/en/account/favorites',
	'/en/compare',
	'/en/locale-settings'
]) {
	test(`English mobile WCAG 2.2 AA and reflow: ${route}`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 844 });
		const response = await visit(page, route);
		expect(response?.status()).toBe(200);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
			true
		);
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(
			result.violations.map(({ id, nodes }) => ({
				id,
				nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary }))
			}))
		).toEqual([]);
	});
}
