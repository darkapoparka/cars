import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.beforeEach(({ isMobile }) => {
	test.skip(Boolean(isMobile), 'Desktop page composition.');
});

for (const locale of ['bg', 'en']) {
	test(`${locale}: service, about and contact heroes share their geometry`, async ({ page }) => {
		for (const width of [768, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			let baseline;
			for (const route of ['services', 'about', 'contact']) {
				await visit(page, `/${locale}/${route}`);
				const geometry = await page.locator('.site-intro').evaluate((node) => {
					const rect = node.getBoundingClientRect();
					return {
						top: rect.y,
						height: rect.height,
						title: node.querySelector('h1')!.getBoundingClientRect().y,
						actions: node.querySelector('.site-intro__desktop-actions')!.getBoundingClientRect().y
					};
				});
				baseline ??= geometry;
				expect(geometry, `${width}: ${route}`).toEqual(baseline);
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
				const underline = await page.locator('.site-nav-item.active > a').evaluate((node) => {
					const style = getComputedStyle(node, '::after');
					return {
						width: parseFloat(style.width),
						link: node.getBoundingClientRect().width,
						left: style.left,
						right: style.right
					};
				});
				expect(underline.width).toBeCloseTo(underline.link, 1);
				expect(underline.left).toBe('0px');
				expect(underline.right).toBe('0px');
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
		const quickFilters = page.getByRole('group', {
			name: locale === 'en' ? 'Quick service filters' : 'Бърз избор на услуга'
		});
		for (const pill of await quickFilters.getByRole('button').all()) {
			await pill.click();
			await expect(pill).toHaveAttribute('aria-pressed', 'true');
			expect(await page.locator('.service-card').count()).toBeGreaterThan(0);
		}
		await page
			.getByRole('button', {
				name: locale === 'en' ? 'Check / VIN' : 'Проверка / VIN',
				exact: true
			})
			.click();
		await expect(search).toHaveValue('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await page
			.getByRole('button', { name: locale === 'en' ? 'All' : 'Всички', exact: true })
			.click();
		await expect(search).toBeEmpty();
		await expect(page.locator('.service-card')).toHaveCount(6);
		await search.fill('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await expect(page.locator('.service-card > a')).toHaveAttribute('href', `/${locale}/import`);
		await search.fill('no such service');
		await expect(page.locator('.service-card')).toHaveCount(0);
		await expect(page.locator('.service-empty')).toBeVisible();
		await page.locator('.service-empty').getByRole('button').click();
		await expect(search).toBeEmpty();
		await expect(page.locator('.service-card')).toHaveCount(6);
		await search.fill('VIN');
		await search.press('Enter');
		await expect(page).toHaveURL(new RegExp(`/${locale}/services\\?q=VIN`));
		await expect(page.locator('.service-card')).toHaveCount(1);
		await page.locator('.service-card > a').click();
		await expect(page).toHaveURL(new RegExp(`/${locale}/import$`));
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
	const directions = page.locator('.site-intro').getByRole('link', { name: 'Get directions' });
	await expect(directions).toHaveAttribute('href', /^https:\/\/www.google.com\/maps/);
	const action = (await directions.boundingBox())!;
	const socials = (await page.locator('.site-intro .social-links').boundingBox())!;
	expect(socials.y).toBeGreaterThan(action.y + action.height);
	await visit(page, '/en/contact');
	await expect(page.locator('.site-intro').getByRole('link', { name: 'Call us' })).toHaveAttribute(
		'href',
		/^tel:/
	);
	await expect(
		page.locator('.site-intro').getByRole('link', { name: 'Get directions' })
	).toHaveAttribute('href', /^https:\/\/www.google.com\/maps/);
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
