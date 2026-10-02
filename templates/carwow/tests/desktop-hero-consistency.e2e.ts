import { expect, test } from '@playwright/test';

const routes = [
	'',
	'/inventory',
	'/services',
	'/about',
	'/blog',
	'/sell-your-car',
	'/contact',
	'/financing',
	'/faq',
	'/about/daynight-auto-plovdiv',
	'/reviews',
	'/calculator',
	'/compare',
	'/team',
	'/team/prodazhbi-showroom',
	'/blog/kak-da-kupim-upotrebyavan-avtomobil',
	'/terms',
	'/favorites'
];

for (const locale of ['en', 'bg']) {
	test(`desktop route chrome and heroes survive the 991/992px boundary in ${locale}`, async ({
		page
	}) => {
		test.setTimeout(60_000);
		for (const route of ['/sell-your-car', '/contact', '/reviews', '/terms']) {
			await page.setViewportSize({ width: 992, height: 1000 });
			await page.goto(`/${locale}${route}`);
			await expect(page.locator('.site-chrome[data-daynight-site-chrome]')).toBeVisible();
			await expect(page.locator('.daynight-yellow-route-hero')).toBeVisible();
			await page.setViewportSize({ width: 991, height: 1000 });
			await expect(page.locator('.site-chrome[data-daynight-site-chrome]')).toHaveCount(0);
			await expect(page.locator('.daynight-yellow-route-hero')).not.toBeVisible();
			await expect(page.locator('#main-content')).toBeVisible();
			await page.setViewportSize({ width: 992, height: 1000 });
			await expect(page.locator('.site-chrome[data-daynight-site-chrome]')).toBeVisible();
			await expect(page.locator('.daynight-yellow-route-hero')).toBeVisible();
		}
	});

	for (const width of [992, 1280, 1440, 1920]) {
		test(`desktop route heroes match Home geometry in ${locale} at ${width}px`, async ({
			page
		}) => {
			test.setTimeout(90_000);
			await page.setViewportSize({ width, height: 1000 });
			let reference: { height: number; titleFont: string } | undefined;
			for (const route of routes) {
				await page.goto(`/${locale}${route}`);
				const hero = page.locator('.daynight-home-hero--cutouts, .daynight-yellow-route-hero');
				await expect(hero).toBeVisible();
				await page.evaluate(async () => {
					await document.fonts.ready;
					await new Promise<void>((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
					);
				});
				// Query and measure in one browser call; hydration can replace an SSR node.
				const geometry = await hero.evaluateAll(([element]) => {
					const box = element.getBoundingClientRect();
					const title = element.querySelector('h1')!;
					const content = element.querySelector(
						'.daynight-home-hero__stage, .daynight-yellow-route-hero__content'
					)!;
					const titleBox = title.getBoundingClientRect();
					const contentBottom = content.lastElementChild!.getBoundingClientRect().bottom;
					return {
						height: box.height,
						topSpace: titleBox.top - box.top,
						bottomSpace: box.bottom - contentBottom,
						titleFont: getComputedStyle(title).font,
						contentContained: content.getBoundingClientRect().bottom <= box.bottom + 1
					};
				});
				reference ??= geometry;
				expect(reference.height, `/${locale} Home hero height`).toBe(400);
				expect(
					Math.abs(geometry.height - reference.height),
					`/${locale}${route} height ${geometry.height}px; Home ${reference.height}px`
				).toBeLessThan(1);
				expect(
					Math.abs(geometry.topSpace - geometry.bottomSpace),
					`/${locale}${route} title and panel are vertically centred`
				).toBeLessThan(1);
				expect(
					geometry.topSpace,
					`/${locale}${route} header breathing room`
				).toBeGreaterThanOrEqual(32);
				expect(geometry.titleFont, `/${locale}${route} title typography`).toBe(reference.titleFont);
				expect(geometry.contentContained, `/${locale}${route} content fits`).toBe(true);
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
			}
		});
	}
}
