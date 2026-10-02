import { expect, test } from '@playwright/test';

for (const locale of ['en', 'bg']) {
	for (const width of [992, 1440]) {
		test(`desktop hero actions remain readable and centered in ${locale} at ${width}px`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height: 1000 });
			for (const route of ['contact', 'financing', 'faq', 'favorites', 'sell-your-car']) {
				await page.mouse.move(0, 0);
				await page.goto(`/${locale}/${route}`, { waitUntil: 'networkidle' });
				await page.evaluate(() => document.fonts.ready);
				const hero = page.locator('.daynight-yellow-route-hero');
				const deck = hero.locator('.daynight-yellow-route-hero__deck');
				await expect(deck).toHaveCSS('background-color', 'rgb(52, 58, 62)');
				const heroBox = (await hero.boundingBox())!;
				const deckBox = (await deck.boundingBox())!;
				expect(heroBox.height).toBe(400);
				expect(deckBox.width).toBe(720);
				expect(Math.abs(deckBox.x + deckBox.width / 2 - width / 2)).toBeLessThan(1);
				const primary = deck.locator('.sa-cta-primary, .desktop-primary-action');
				await expect(primary).toHaveCSS('background-color', 'rgb(245, 197, 66)');
				await expect(primary).toHaveCSS('color', 'rgb(15, 20, 23)');
				await primary.focus();
				await expect(primary).toHaveCSS('outline-color', 'rgb(245, 197, 66)');
				await expect(primary).toHaveCSS('outline-width', '2px');
				await primary.hover();
				await expect(primary).not.toHaveCSS('background-color', 'rgb(245, 197, 66)');
				await expect(primary).toHaveCSS('color', 'rgb(15, 20, 23)');
				if (route === 'sell-your-car') {
					const button = (await primary.boundingBox())!;
					const entry = page.locator('#desktop-sell-hero-identity');
					const field = (await entry.boundingBox())!;
					expect(field.y).toBe(button.y);
					expect(field.height).toBe(button.height);
					expect(field.x).toBe(deckBox.x + 24);
					expect(button.x + button.width).toBe(deckBox.x + deckBox.width - 24);
					expect(button.width).toBeLessThan(400);
					await entry.fill('PB 1234 AB');
					await primary.press('Enter');
					await expect(page.locator('.sell-modal')).toBeVisible();
					await expect(page.locator('.sell-modal input[name="plate"]')).toHaveValue('PB 1234 AB');
					await expect(page.locator('.sell-modal input[name="make"]')).toBeFocused();
					await page.keyboard.press('Escape');
					await expect(primary).toBeFocused();
				} else {
					const actions = deck.locator('.daynight-yellow-route-hero__actions');
					const buttons = await actions.locator('a').evaluateAll((links) =>
						links.map((link) => {
							const r = link.getBoundingClientRect();
							return { left: r.left, right: r.right, top: r.top, width: r.width, height: r.height };
						})
					);
					expect(buttons).toHaveLength(2);
					expect(buttons[0].top).toBe(buttons[1].top);
					expect(buttons[0].width).toBe(buttons[1].width);
					expect(buttons[0].height).toBe(48);
					expect(
						Math.abs((buttons[0].left + buttons[1].right) / 2 - deckBox.x - deckBox.width / 2)
					).toBeLessThan(1);
					await expect(actions.locator('a').last()).toHaveAttribute(
						'href',
						new RegExp(`^/${locale}/`)
					);
				}
			}
		});
	}
}

for (const width of [992, 1280, 1440, 1920]) {
	test(`desktop sections share a frame and use compact cards at ${width}px`, async ({
		page
	}, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		for (const locale of ['en', 'bg']) {
			await page.goto(`/${locale}`);
			await expect(page.locator('.hero-intent')).toBeVisible();
			await expect(page.locator('.hero-intent__tabs button').first()).toBeEnabled();
			await page.evaluate(() => document.fonts.ready);
			const frame = (await page.locator('.daynight-home-inventory__body').boundingBox())!;
			const panel = (await page.locator('.hero-intent').boundingBox())!;
			const tabHeader = (await page.locator('.hero-intent__tabs').boundingBox())!;
			expect(Math.abs(tabHeader.x - panel.x)).toBeLessThan(1);
			expect(Math.abs(tabHeader.y - panel.y)).toBeLessThan(1);
			expect(Math.abs(tabHeader.width - panel.width)).toBeLessThan(1);
			const tabs = await page.locator('.hero-intent__tabs button').evaluateAll((buttons) => {
				const first = buttons[0].getBoundingClientRect();
				const last = buttons.at(-1)!.getBoundingClientRect();
				return {
					left: first.left,
					right: last.right,
					width: last.right - first.left,
					widths: buttons.map((button) => button.getBoundingClientRect().width)
				};
			});
			expect(Math.abs(tabs.width - panel.width)).toBeLessThan(1);
			for (const tabWidth of tabs.widths)
				expect(Math.abs(tabWidth - panel.width / 3)).toBeLessThan(1);
			expect(Math.abs((tabs.left + tabs.right) / 2 - panel.x - panel.width / 2)).toBeLessThan(1);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'background-color',
				'rgb(255, 255, 255)'
			);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'color',
				'rgb(23, 27, 30)'
			);
			await expect(page.locator('.hero-intent__tabs button[aria-selected="true"]')).toHaveCSS(
				'border-width',
				'0px'
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
				await page.goto(`/${locale}/${route}`, { waitUntil: 'networkidle' });
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
					const serviceChoice = page.locator('#desktop-services-hero-service');
					const serviceAction = page.locator('.services-chooser__action');
					await expect(serviceChoice).toHaveAccessibleName(
						locale === 'en' ? 'Choose a service' : 'Изберете услуга'
					);
					const choiceBox = (await serviceChoice.boundingBox())!;
					const actionBox = (await serviceAction.boundingBox())!;
					expect(choiceBox.y).toBe(actionBox.y);
					expect(choiceBox.height).toBe(actionBox.height);
					expect(choiceBox.height).toBe(48);
					await expect(serviceAction).toHaveCSS('background-color', 'rgb(245, 197, 66)');
					await serviceChoice.selectOption('documents');
					await expect(serviceAction).toHaveAttribute(
						'href',
						`/${locale}/services?service=documents#services-request`
					);
					await serviceAction.press('Enter');
					await expect(page).toHaveURL(
						new RegExp(`/${locale}/services\\?service=documents#services-request$`)
					);
					await expect(page.locator('#desktop-services-service')).toHaveValue('documents');
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
					for (const link of await page.locator('.about-hero-contact > a').all()) {
						await expect(link).toHaveCSS('color', 'rgb(15, 20, 23)');
					}
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
					const blogDeck = page.locator('.daynight-yellow-route-hero__deck');
					const blogPanel = (await blogDeck.boundingBox())!;
					expect(blogPanel.width).toBe(640);
					expect(blogPanel.height).toBeLessThan(160);
					const categories = page.locator('.blog-category-switch a');
					await expect(categories).toHaveCount(3);
					for (const category of await categories.all()) {
						const categoryBox = (await category.boundingBox())!;
						expect(Math.abs(categoryBox.width - blogPanel.width / 3)).toBeLessThan(1);
						expect(categoryBox.height).toBe(52);
					}
					await expect(categories.first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
					await expect(categories.first()).toHaveCSS('color', 'rgb(23, 27, 30)');
					await expect(categories.nth(1)).toHaveCSS('color', 'rgb(255, 255, 255)');
					await expect(blogDeck.locator('.blog-quick-topics')).toHaveCount(0);
					await expect(page.locator('.blog-list .blog-quick-topics')).toBeVisible();
				}
				if (width === 1440 && locale === 'en')
					await page.screenshot({ path: testInfo.outputPath(`${route}.png`) });
			}
		}
	});
}

test('desktop service cards keep request preselection and navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/en/services', { waitUntil: 'networkidle' });
	await page.locator('.desktop-services-card').nth(4).click();
	await expect(page.locator('#desktop-services-service')).toHaveValue('sourcing');
	await expect(page).toHaveURL(/service=sourcing#services-request$/);
	await expect(page.locator('.desktop-services-form')).toBeVisible();
});

for (const locale of ['en', 'bg']) {
	test(`desktop Sell entry keeps VIN, keyboard focus and fallback data in ${locale}`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		const leadRequests: string[] = [];
		page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().includes('/api/leads')) {
				leadRequests.push(request.url());
			}
		});
		await page.goto(`/${locale}/sell-your-car`, { waitUntil: 'networkidle' });
		const entry = page.locator('#desktop-sell-hero-identity');
		await page
			.locator('.sell-entry__mode')
			.getByRole('button', { name: 'VIN', exact: true })
			.click();
		await expect(entry).toHaveAccessibleName('VIN');
		await entry.fill('WBA12345678901234');
		await entry.press('Enter');
		const modal = page.locator('.sell-modal');
		await expect(modal).toBeVisible();
		await expect(modal.locator('input[name="vin"]')).toHaveValue('WBA12345678901234');
		await expect(modal.locator('input[name="make"]')).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(entry).toBeFocused();
		await expect(entry).toHaveValue('WBA12345678901234');
		await expect(page.locator('.sell-final .sell-action')).toHaveAttribute(
			'href',
			`/${locale}/sell-your-car/request?vin=WBA12345678901234`
		);
		await entry.fill('');
		await entry.press('Enter');
		await expect(modal.locator('input[name="vin"]')).toBeFocused();
		expect(leadRequests).toEqual([]);
	});
}

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
	const allCategory = page
		.locator('.blog-category-switch')
		.getByRole('link', { name: 'All', exact: true });
	await allCategory.click();
	await expect(page).toHaveURL(
		(url) => !url.searchParams.has('category') && url.searchParams.get('tag') === selectedTag
	);
	await expect(allCategory).toHaveAttribute('aria-current', 'true');
	await page.locator('#blog-hero-search').fill('no-matching-article-9281');
	await page.locator('#blog-hero-search').press('Enter');
	await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'no-matching-article-9281');
	await page
		.locator('.blog-category-switch')
		.getByRole('link', { name: 'Selling', exact: true })
		.click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('q') === 'no-matching-article-9281' &&
			url.searchParams.get('category') === 'Продажба' &&
			url.searchParams.get('tag') === selectedTag
	);
	const reset = page.locator('.blog-clear-filters');
	await expect(reset).toHaveAttribute('href', '/en/blog');
	await reset.click();
	await expect(page).toHaveURL(/\/en\/blog$/);
	await expect(page.locator('[data-daynight-article-card]')).toHaveCount(initialCount);
});
