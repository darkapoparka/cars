import { expect, test } from '@playwright/test';

for (const width of [992, 1280, 1440, 1920]) {
	test(`desktop sections share a frame and use compact cards at ${width}px`, async ({
		page
	}, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		for (const locale of ['en', 'bg']) {
			await page.goto(`/${locale}`);
			await expect(page.locator('.hero-intent')).toBeVisible();
			const frame = (await page.locator('.daynight-home-inventory__body').boundingBox())!;
			const panel = (await page.locator('.hero-intent').boundingBox())!;
			const tabs = await page.locator('.hero-intent__tabs button').evaluateAll((buttons) => {
				const first = buttons[0].getBoundingClientRect();
				const last = buttons.at(-1)!.getBoundingClientRect();
				return { left: first.left, right: last.right, width: last.right - first.left };
			});
			expect(tabs.width).toBeLessThan(panel.width * 0.75);
			expect(Math.abs((tabs.left + tabs.right) / 2 - panel.x - panel.width / 2)).toBeLessThan(1);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'background-color',
				'rgb(23, 27, 30)'
			);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'color',
				'rgb(255, 255, 255)'
			);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'border-width',
				'1px'
			);
			await expect(page.locator('label[for="hero-buy-query"]')).toHaveCSS('width', '1px');
			await expect(page.locator('#hero-buy-query')).toHaveAccessibleName(
				locale === 'en' ? 'What car are you looking for?' : 'Какъв автомобил търсиш?'
			);
			await expect(page.locator('.hero-intent__row--search')).toHaveCSS(
				'background-color',
				'rgb(255, 255, 255)'
			);
			await expect(page.locator('#hero-buy-query')).toHaveCSS(
				'background-color',
				'rgba(0, 0, 0, 0)'
			);
			for (const route of ['services', 'about', 'blog']) {
				await page.goto(`/${locale}/${route}`);
				await page.evaluate(() => document.fonts.ready);
				const container = page.locator(
					route === 'services'
						? '.desktop-services-offers .container'
						: route === 'about'
							? '.about-story'
							: '.blog-container'
				);
				await expect(container).toBeVisible();
				const box = (await container.boundingBox())!;
				expect(Math.abs(box.x - frame.x)).toBeLessThan(1);
				expect(Math.abs(box.width - frame.width)).toBeLessThan(1);
				if (route === 'services') {
					await expect
						.poll(() =>
							page.locator('.services-shortcuts a').evaluateAll((links) => {
								const rows = new Map<number, number>();
								for (const link of links) {
									const top = Math.round(link.getBoundingClientRect().top);
									rows.set(top, (rows.get(top) ?? 0) + 1);
								}
								return links.length === 6 && [...rows.values()].every((count) => count > 1);
							})
						)
						.toBe(true);
					const cards = page.locator('.desktop-services-card');
					await expect(cards).toHaveCount(6);
					await expect
						.poll(() =>
							page
								.locator('.desktop-services-grid')
								.evaluate(
									(element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
								)
						)
						.toBe(5);
					await expect
						.poll(() =>
							cards.evaluateAll((elements) =>
								elements.every((element) => {
									const box = element.getBoundingClientRect();
									const heading = element.querySelector('h3')!;
									const summary = element.querySelector('p')!;
									return (
										box.height < 360 &&
										heading.scrollWidth <= heading.clientWidth + 1 &&
										getComputedStyle(heading).fontSize === '18px' &&
										getComputedStyle(summary).fontSize === '14px' &&
										summary.getBoundingClientRect().height <= 43
									);
								})
							)
						)
						.toBe(true);
				} else if (route === 'about') {
					await expect(container.locator('img')).toHaveCount(0);
					expect(box.height).toBeLessThan(360);
				} else {
					await expect(page.locator('.blog-featured-card, .blog-magazine')).toHaveCount(0);
					await expect
						.poll(() =>
							page
								.locator('.blog-card-grid')
								.evaluate(
									(element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
								)
						)
						.toBe(width < 1200 ? 3 : 4);
					await expect
						.poll(() =>
							page.locator('.blog-article-card').evaluateAll((cards) => {
								const widths = cards.map((card) => card.getBoundingClientRect().width);
								return Math.max(...widths) - Math.min(...widths) < 1;
							})
						)
						.toBe(true);
					const pills = page.locator('.blog-category-switch a, .blog-quick-topics a');
					await expect(pills.first()).toHaveCSS('border-radius', '8px');
					await expect(pills.first()).toHaveCSS('background-color', 'rgb(23, 27, 30)');
				}
				if (width === 1440 && locale === 'en')
					await page.screenshot({ path: testInfo.outputPath(`${route}.png`) });
			}
		}
	});
}

test('desktop service cards keep request preselection and navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/en/services');
	await page.locator('.desktop-services-card').nth(4).click();
	await expect(page.locator('#desktop-services-service')).toHaveValue('sourcing');
	await expect(page).toHaveURL(/service=sourcing#services-request$/);
	await expect(page.locator('.desktop-services-form')).toBeVisible();
});

test('desktop blog pills preserve search and category filters, Back and reset', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/en/blog');
	const initialCount = await page.locator('[data-daynight-article-card]').count();
	expect(initialCount).toBeGreaterThan(0);
	await page
		.locator('.blog-category-switch')
		.getByRole('link', { name: 'Selling', exact: true })
		.click();
	await expect(page).toHaveURL((url) => url.searchParams.get('category') === 'Продажба');
	await expect(
		page.locator('.blog-category-switch').getByRole('link', { name: 'Selling', exact: true })
	).toHaveAttribute('aria-current', 'true');
	const sellerCards = page.locator('[data-daynight-article-card]');
	expect(await sellerCards.count()).toBeGreaterThan(0);
	await expect
		.poll(() =>
			sellerCards.evaluateAll((cards) =>
				cards.every((card) => card.getAttribute('data-daynight-category') === 'Продажба')
			)
		)
		.toBe(true);
	await page.locator('.blog-quick-topics a').first().click();
	await expect(page).toHaveURL(
		(url) => url.searchParams.get('category') === 'Продажба' && !!url.searchParams.get('tag')
	);
	const selectedTag = new URL(page.url()).searchParams.get('tag');
	await page.locator('#blog-hero-search').fill('no-matching-article-9281');
	await page.locator('#blog-hero-search').press('Enter');
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('q') === 'no-matching-article-9281' &&
			url.searchParams.get('category') === 'Продажба' &&
			url.searchParams.get('tag') === selectedTag
	);
	await expect(page.locator('[data-daynight-article-card]')).toHaveCount(0);
	await expect(page.locator('.blog-empty')).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL(
		(url) => !url.searchParams.has('q') && url.searchParams.get('tag') === selectedTag
	);
	const reset = page.locator('.blog-clear-filters');
	await expect(reset).toHaveAttribute('href', '/en/blog');
	await reset.click();
	await expect(page).toHaveURL(/\/en\/blog$/);
	await expect(page.locator('[data-daynight-article-card]')).toHaveCount(initialCount);
});
