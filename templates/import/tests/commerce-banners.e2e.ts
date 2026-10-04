import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('menu banner stays inside its row and clear of contact buttons', async ({ page }, info) => {
	test.skip(info.project.name !== 'mobile');
	for (const locale of ['en', 'bg']) {
		for (const [width, height] of [
			[320, 568],
			[320, 844],
			[390, 568],
			[390, 844]
		]) {
			await page.setViewportSize({ width, height });
			await visit(page, `/${locale}?lang=${locale}`);
			await page
				.getByRole('navigation', {
					name: locale === 'en' ? 'Mobile navigation' : 'Мобилна навигация'
				})
				.getByRole('button', { name: locale === 'en' ? 'Menu' : 'Меню', exact: true })
				.click();
			const menu = page.getByRole('dialog');
			await expect(menu.locator('.mobile-navigation-menu__banner')).toBeVisible();
			const layout = await menu.evaluate((element) => {
				const feature = element.querySelector('.mobile-navigation-menu__banner')!;
				const banner = feature.getBoundingClientRect();
				const buttons = element
					.querySelector('.mobile-navigation-menu__actions')!
					.getBoundingClientRect();
				const body = element.querySelector('.bc-mobile-sheet__body')!.getBoundingClientRect();
				const contactFits = [...feature.querySelectorAll('.mobile-navigation-menu__logo, a')].every(
					(node) => {
						const box = node.getBoundingClientRect();
						return (
							box.left >= banner.left &&
							box.right <= banner.right &&
							box.top >= banner.top &&
							box.bottom <= banner.bottom
						);
					}
				);
				return {
					contactFits,
					gap: buttons.top - banner.bottom,
					right: banner.right,
					bodyRight: body.right,
					left: banner.left,
					bodyLeft: body.left
				};
			});
			await page.screenshot({
				path: info.outputPath(`menu-contained-${locale}-${width}-${height}.png`)
			});
			expect(
				layout.gap,
				`${locale} ${width}x${height}: ${JSON.stringify(layout)}`
			).toBeGreaterThanOrEqual(11);
			expect(layout.right).toBeLessThanOrEqual(layout.bodyRight + 1);
			expect(layout.left).toBeGreaterThanOrEqual(layout.bodyLeft - 1);
			expect(layout.contactFits).toBe(true);
			const localeControl = menu.locator('[data-locale-selector]');
			await localeControl.scrollIntoViewIfNeeded();
			await expect(localeControl).toBeVisible();
			expect(
				await menu
					.locator('.mobile-navigation-menu__locale')
					.evaluate((node) => getComputedStyle(node).position)
			).toBe('static');
			expect(
				await localeControl.evaluate((node) => Boolean(node.closest('.bc-mobile-sheet__body')))
			).toBe(true);
		}
	}
});

for (const locale of ['en', 'bg'] as const) {
	for (const width of [320, 390]) {
		test(`commerce banners and menu work at ${width}px in ${locale}`, async ({ page }, info) => {
			test.skip(info.project.name !== 'mobile');
			await page.setViewportSize({ width, height: 844 });
			const errors: string[] = [];
			const iconBarrels: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('request', (request) => {
				if (/\/@hugeicons_core-free-icons\.js\?/.test(request.url()))
					iconBarrels.push(request.url());
			});
			await visit(page, `/${locale}?lang=${locale}`);
			const campaign = page.locator('.daynight-action-band--mobile .commerce-banner');
			await campaign.scrollIntoViewIfNeeded();
			await expect(campaign).toBeVisible();
			await expect
				.poll(() =>
					campaign
						.locator('img')
						.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
				)
				.toBe(true);
			expect(await campaign.getAttribute('href')).toContain('/contact');
			const articles = page.locator('.home-news .article-card');
			await articles.first().scrollIntoViewIfNeeded();
			for (const article of await articles.all()) {
				await article.scrollIntoViewIfNeeded();
				await expect
					.poll(() =>
						article
							.locator('img')
							.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
					)
					.toBe(true);
			}
			await campaign.scrollIntoViewIfNeeded();
			await page.screenshot({
				path: info.outputPath(`home-commerce-${locale}-${width}.png`)
			});
			await page
				.getByRole('tab', { name: locale === 'en' ? 'Buy' : 'Купи', exact: true })
				.scrollIntoViewIfNeeded();
			await page
				.getByRole('navigation', {
					name: locale === 'en' ? 'Mobile navigation' : 'Мобилна навигация'
				})
				.getByRole('button', { name: locale === 'en' ? 'Menu' : 'Меню', exact: true })
				.click();
			const menu = page.getByRole('dialog');
			const feature = menu.locator('.mobile-navigation-menu__banner');
			await expect(feature).toBeVisible();
			await expect
				.poll(() =>
					feature
						.locator('.mobile-navigation-menu__logo')
						.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
				)
				.toBe(true);
			const accessibility = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(accessibility.violations).toEqual([]);
			await page.screenshot({
				path: info.outputPath(`menu-commerce-${locale}-${width}.png`)
			});
			await menu
				.getByRole('link', {
					name: locale === 'en' ? 'Sell your car' : 'Продай колата си',
					exact: true
				})
				.click();
			await expect(page).toHaveURL(/\/sell-your-car/);
			await expect(menu).not.toBeVisible();
			const title = page.locator('#sell-valuation-title');
			const titleFit = await title.evaluate((element) => ({
				height: element.getBoundingClientRect().height,
				lineHeight: parseFloat(getComputedStyle(element).lineHeight),
				right: element.getBoundingClientRect().right,
				viewport: innerWidth
			}));
			expect(titleFit.height).toBeLessThan(titleFit.lineHeight + 1);
			expect(titleFit.right).toBeLessThanOrEqual(titleFit.viewport);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			expect(errors).toEqual([]);
			expect(iconBarrels).toEqual([]);
		});
	}
}

test('desktop commerce actions and article covers load', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/en?lang=en');
	const campaigns = page.locator('.daynight-action-band--ownership .commerce-banner');
	await campaigns.first().scrollIntoViewIfNeeded();
	await expect(campaigns).toHaveCount(2);
	for (const campaign of await campaigns.all()) {
		await expect(campaign).toBeVisible();
		await expect
			.poll(() =>
				campaign
					.locator('.commerce-banner__image')
					.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true);
	}
	await page.screenshot({ path: info.outputPath('home-commerce-en-1440.png') });
	await visit(page, '/en/blog/gotov-za-registracia?lang=en');
	await expect(page.locator('.article-cover')).toBeVisible();
});

test('shared contact banner and registration cover reflow', async ({ page }, info) => {
	for (const width of info.project.name === 'mobile' ? [320, 390] : [1440]) {
		await page.setViewportSize({ width, height: 844 });
		await visit(page, '/en/services?lang=en');
		const contact = page.locator('.contact-banner');
		await contact.scrollIntoViewIfNeeded();
		await expect
			.poll(() =>
				contact
					.locator('img')
					.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true);
		await expect(contact.locator('a[href^="tel:"]')).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await page.screenshot({ path: info.outputPath(`contact-commerce-en-${width}.png`) });
		await visit(page, '/en/blog/gotov-za-registracia?lang=en');
		const cover = page.locator('.article-cover');
		await expect
			.poll(() =>
				cover.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await cover.scrollIntoViewIfNeeded();
		await page.screenshot({ path: info.outputPath(`article-commerce-en-${width}.png`) });
	}
});
