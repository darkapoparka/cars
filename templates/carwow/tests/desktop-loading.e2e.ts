import { devices, expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 1000 } });

async function expectAlignedCardDetails(page: Page) {
	await expect
		.poll(() =>
			page.locator('.desktop-vehicle-details:visible').evaluateAll((cards) => {
				const rowOffsets = new Map<number, number>();
				return (
					cards.length > 0 &&
					cards.every((card) => {
						const title = card.querySelector('.desktop-vehicle-details__title')!;
						const facts = card.querySelector('.desktop-vehicle-details__metadata')!;
						const values = [...facts.querySelectorAll('dd')];
						if (values.length !== 4) return false;
						const titleBox = title.getBoundingClientRect();
						const factsBox = facts.getBoundingClientRect();
						const valueBoxes = values.map((value) => value.getBoundingClientRect());
						const cardBox = card.closest('[data-daynight-vehicle-card]')!.getBoundingClientRect();
						const row = Math.round(cardBox.top);
						const factsOffset = factsBox.top - cardBox.top;
						const rowOffset = rowOffsets.get(row) ?? factsOffset;
						rowOffsets.set(row, rowOffset);
						return (
							getComputedStyle(title).fontSize === '18px' &&
							Math.abs(titleBox.height - parseFloat(getComputedStyle(title).lineHeight) * 2) < 1 &&
							factsBox.top >= titleBox.bottom + 11 &&
							Math.abs(factsOffset - rowOffset) < 1 &&
							values.every(
								(value) =>
									getComputedStyle(value).fontSize === '14px' &&
									value.scrollWidth <= value.clientWidth + 1
							) &&
							Math.abs(valueBoxes[0].top - valueBoxes[1].top) < 1 &&
							Math.abs(valueBoxes[2].top - valueBoxes[3].top) < 1 &&
							Math.abs(valueBoxes[0].left - valueBoxes[2].left) < 1 &&
							Math.abs(valueBoxes[1].left - valueBoxes[3].left) < 1
						);
					})
				);
			})
		)
		.toBe(true);
}

test.afterEach(async ({ page }, testInfo) => {
	if (testInfo.status === testInfo.expectedStatus) return;
	await testInfo.attach('desktop-viewport-diagnostic', {
		body: JSON.stringify(
			await page.evaluate(() => ({
				innerWidth,
				clientWidth: document.documentElement.clientWidth,
				desktopMedia: matchMedia('(min-width: 992px)').matches,
				mobileMedia: matchMedia('(max-width: 991px)').matches,
				scrollHeight: document.documentElement.scrollHeight,
				scrollbarGutter: getComputedStyle(document.documentElement).scrollbarGutter,
				bodyClass: document.body.className,
				home: document.querySelector('.daynight-home-shell')?.getBoundingClientRect().toJSON(),
				mobileHome: Boolean(document.querySelector('.mobile-home')),
				grid: document
					.querySelector('.daynight-home-inventory__grid')
					?.getBoundingClientRect()
					.toJSON(),
				cards: [...document.querySelectorAll('.daynight-home-inventory__card')].map((card) => ({
					display: getComputedStyle(card).display,
					box: card.getBoundingClientRect().toJSON()
				})),
				cssLinks: [...document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')].map(
					(link) => ({
						href: link.href,
						media: link.media,
						mediaMatches: matchMedia(link.media || 'all').matches,
						loaded: Boolean(link.sheet)
					})
				)
			})),
			null,
			2
		),
		contentType: 'application/json'
	});
});

test('home and inventory use matching centered frames and compact four or five column cards', async ({
	page
}, testInfo) => {
	for (const width of [992, 1280, 1440, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto('/en');
		await expect(page.locator('.daynight-home-shell')).toBeVisible();
		const homeGrid = page.locator('.daynight-home-inventory__grid');
		const expectedColumns = width < 1440 ? 4 : 5;
		await expect
			.poll(() =>
				homeGrid.evaluate(
					(element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
				)
			)
			.toBe(expectedColumns);
		await expect(homeGrid.locator('[data-daynight-vehicle-card]:visible')).toHaveCount(
			expectedColumns * 2
		);
		const homeFrame = (await page.locator('.daynight-home-inventory__body').boundingBox())!;
		await expectAlignedCardDetails(page);
		await expect(homeGrid.locator('.desktop-vehicle-details__metadata').first()).toHaveCSS(
			'border-top-width',
			'0px'
		);
		await homeGrid.scrollIntoViewIfNeeded();
		await page.screenshot({ path: testInfo.outputPath(`home-compact-${width}.png`) });
		await page.goto('/en/inventory');
		const inventoryGrid = page.locator('[data-daynight-grid-panel="3"].active > .grid');
		await expect
			.poll(() =>
				inventoryGrid.evaluate(
					(element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
				)
			)
			.toBe(expectedColumns);
		const inventoryFrame = (await page.locator('.daynight-inventory-viewport').boundingBox())!;
		await expectAlignedCardDetails(page);
		expect(Math.abs(homeFrame.x - inventoryFrame.x)).toBeLessThan(1);
		expect(Math.abs(homeFrame.width - inventoryFrame.width)).toBeLessThan(1);
		const inventoryCards = (await inventoryGrid.boundingBox())!;
		expect(Math.abs(homeFrame.x - inventoryCards.x)).toBeLessThan(1);
		expect(Math.abs(homeFrame.width - inventoryCards.width)).toBeLessThan(1);
		await expect(inventoryGrid.locator('.desktop-vehicle-details__metadata').first()).toHaveCSS(
			'border-top-width',
			'0px'
		);
		await expect
			.poll(() =>
				inventoryGrid
					.locator('.daynight-card-price__value')
					.evaluateAll((prices) =>
						prices.every(
							(price) =>
								price.getBoundingClientRect().right <=
								price.closest('[data-daynight-vehicle-card]')!.getBoundingClientRect().right - 12
						)
					)
			)
			.toBe(true);
		await page.screenshot({ path: testInfo.outputPath(`inventory-compact-${width}.png`) });
		await page.goto('/en/inventory/mercedes-benz-gla-45-amg-405323');
		const detailContainer = page.locator('.daynight-detail .container').first();
		await expect(detailContainer).toBeVisible();
		await expect
			.poll(async () => {
				const detailFrame = await detailContainer.boundingBox();
				return (
					detailFrame !== null &&
					Math.abs(homeFrame.x - detailFrame.x) < 1 &&
					Math.abs(homeFrame.width - detailFrame.width) < 1
				);
			})
			.toBe(true);
	}
});

test('desktop cards align titles and specifications before pricing in both languages', async ({
	page
}) => {
	for (const locale of ['en', 'bg']) {
		for (const width of [992, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			for (const route of [
				`/${locale}`,
				`/${locale}/inventory`,
				`/${locale}/inventory/mercedes-benz-gla-45-amg-405323`
			]) {
				await page.goto(route);
				await expect(page.locator('.daynight-card-price__monthly').first()).toBeVisible();
				await page.evaluate(() => document.fonts.ready);
				await expectAlignedCardDetails(page);
				await expect
					.poll(() =>
						page.locator('.daynight-card-price__monthly:visible').evaluateAll((captions) =>
							captions.every((caption) => {
								const details = caption.closest('.desktop-vehicle-details')!;
								const facts = details.querySelector('.desktop-vehicle-details__metadata')!;
								const price = details.querySelector('.daynight-card-price__value')!;
								const arrow = details.querySelector('.daynight-card-price__link')!;
								return (
									Boolean(
										facts.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING
									) &&
									facts.getBoundingClientRect().bottom <= price.getBoundingClientRect().top - 12 &&
									facts.getBoundingClientRect().bottom <= arrow.getBoundingClientRect().top - 12 &&
									details.lastElementChild?.matches('.card-box__price') &&
									caption.getBoundingClientRect().right <=
										arrow.getBoundingClientRect().left - 10 &&
									caption.scrollWidth <= caption.clientWidth + 1
								);
							})
						)
					)
					.toBe(true);
			}
		}
	}
});

test('cold detail navigation waits for its desktop stylesheet', async ({ page }, testInfo) => {
	let release!: () => void;
	let requested!: () => void;
	const gate = new Promise<void>((resolve) => {
		release = resolve;
	});
	const intercepted = new Promise<void>((resolve) => {
		requested = resolve;
	});
	await page.route('**/*daynight-detail-desktop*.css*', async (route) => {
		requested();
		await gate;
		await route.continue();
	});
	await page.goto('/en/inventory');
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: testInfo.outputPath('inventory-desktop-after.png') });
	const click = page.locator('[data-daynight-grid-panel].active .image > a').first().click();
	await intercepted;
	await expect(page.locator('.inventory-refined')).toBeVisible();
	await expect(page.locator('.daynight-detail')).toHaveCount(0);
	release();
	await click;
	await expect(page.locator('.daynight-detail .listing-details')).toHaveCSS('display', 'flex');
	await expect(
		page.locator('.swiper-listing-details-main .swiper-slide-active .img-main')
	).toBeVisible();
	await expect(page.locator('link#daynight-detail-desktop-css')).toHaveCount(1);
	await page.evaluate(() => document.fonts.ready);
	await expect
		.poll(() =>
			page
				.locator('.swiper-listing-details-main .swiper-slide-active .img-main')
				.evaluate((image: HTMLImageElement) => image.naturalWidth)
		)
		.toBeGreaterThanOrEqual(1280);
	await page.screenshot({ path: testInfo.outputPath('detail-desktop-after.png') });
});

test('server bootstrap and hydration use one desktop CSS URL', async ({ page }, testInfo) => {
	const requests = new Set<string>();
	page.on('request', (request) => {
		if (/daynight-home-desktop.*\.css/.test(request.url())) requests.add(request.url());
	});
	await page.goto('/en');
	await expect(page.getByRole('tab', { name: 'Buy', exact: true })).toBeEnabled();
	expect(requests.size).toBe(1);
	await page.evaluate(() => document.fonts.ready);
	const photoHeights = await page
		.locator('.daynight-home-inventory-card__media')
		.evaluateAll((media) => media.slice(0, 3).map((item) => item.getBoundingClientRect().height));
	expect(Math.max(...photoHeights) - Math.min(...photoHeights)).toBeLessThan(1);
	await page.screenshot({ path: testInfo.outputPath('home-desktop-after.png') });
	for (const selector of [
		'.daynight-home-inventory__grid',
		'.daynight-home-action-grid',
		'.daynight-home-section--vehicle-types',
		'.daynight-home-brand-section',
		'.daynight-home-campaign-grid',
		'.home-videos',
		'.daynight-home-review-grid'
	]) {
		await page.locator(selector).scrollIntoViewIfNeeded();
		for (const photo of await page.locator(`${selector} img`).all()) {
			await expect
				.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
				.toBeGreaterThan(0);
		}
	}
	await page.evaluate(() => window.scrollTo(0, 0));
	await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
	await page.screenshot({
		path: testInfo.outputPath('home-desktop-full-after.png'),
		fullPage: true
	});
	for (const [selector, filename] of [
		['.daynight-home-inventory', 'desktop-car-cards.png'],
		['.daynight-home-section--vehicle-types', 'desktop-browse-types.png'],
		['.daynight-home-brand-section', 'desktop-browse-makes.png'],
		['.home-videos', 'desktop-youtube-panel.png']
	]) {
		const section = (await page.locator(selector).boundingBox())!;
		await page.screenshot({
			path: testInfo.outputPath(filename),
			fullPage: true,
			clip: { x: 0, y: section.y - 16, width: 1440, height: section.height + 32 }
		});
	}
	const campaigns = (await page.locator('.daynight-home-campaign-grid').boundingBox())!;
	const reviews = (await page.locator('.home-reviews-panel').boundingBox())!;
	await page.screenshot({
		path: testInfo.outputPath('desktop-banners-videos-reviews.png'),
		fullPage: true,
		clip: {
			x: 0,
			y: campaigns.y - 24,
			width: 1440,
			height: reviews.y + reviews.height - campaigns.y + 48
		}
	});
});

test('home stays visible at the scrollbar boundary and when resizing across it', async ({
	page
}, testInfo) => {
	await page.setViewportSize({ width: 992, height: 1000 });
	await page.goto('/en');
	await expect(page.locator('.daynight-home-shell')).toBeVisible();
	await expect(page.locator('.hero-intent')).toBeVisible();
	await page.screenshot({ path: testInfo.outputPath('home-desktop-992-after.png') });
	await page.setViewportSize({ width: 991, height: 1000 });
	await expect(page.locator('.mobile-home')).toBeVisible();
	await page.setViewportSize({ width: 992, height: 1000 });
	await expect(page.locator('.daynight-home-shell')).toBeVisible();
	await expect(page.locator('.hero-intent')).toBeVisible();
});

for (const width of [991, 992, 1440]) {
	test(`desktop variants and the 991/992px composition boundary remain usable at ${width}px`, async ({
		page
	}, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		for (const path of [
			'/en',
			'/en/home1',
			'/en/home1-box',
			'/en/inventory',
			'/en/inventory/mercedes-benz-gla-45-amg-405323',
			'/en/inventory/map'
		]) {
			await page.goto(path);
			await expect
				.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), {
					message: `${path} overflows at ${width}px`
				})
				.toBe(true);
			if (path.includes('/inventory/mercedes')) {
				await expect(page.locator('.daynight-detail')).toHaveCount(width >= 992 ? 1 : 0);
			} else if (path === '/en/inventory' && width >= 992) {
				const grid = page.locator('[data-daynight-grid-panel="3"].active > .grid');
				await expect(grid).toBeVisible();
				await expect
					.poll(() =>
						grid.evaluate(
							(element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
						)
					)
					.toBe(width < 1440 ? 4 : 5);
			} else if (!path.includes('/inventory')) {
				await expect(page.locator('.mobile-home')).toHaveCount(width < 992 ? 1 : 0);
				if (width >= 992) await expect(page.locator('.daynight-home-shell')).toBeVisible();
				if (width === 992 && path === '/en')
					await testInfo.attach('desktop-boundary-state', {
						body: JSON.stringify(
							await page.evaluate(() => ({
								innerWidth,
								clientWidth: document.documentElement.clientWidth,
								desktopMedia: matchMedia('(min-width: 992px)').matches,
								mobileMedia: matchMedia('(max-width: 991px)').matches,
								homeDisplay: document.querySelector('.daynight-home-shell')
									? getComputedStyle(document.querySelector('.daynight-home-shell')!).display
									: null,
								homeHeight: document.querySelector('.daynight-home-shell')?.getBoundingClientRect()
									.height,
								cssLinks: [
									...document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')
								].map((link) => ({
									href: link.href,
									media: link.media,
									loaded: Boolean(link.sheet)
								}))
							})),
							null,
							2
						),
						contentType: 'application/json'
					});
			}
		}
	});
}

test.describe('mobile preservation', () => {
	test.use({ viewport: { width: 390, height: 844 }, userAgent: devices['iPhone 13'].userAgent });
	test('mobile keeps its own composition and original image requests', async ({
		page
	}, testInfo) => {
		const desktopRequests: string[] = [];
		page.on('request', (request) => {
			if (
				/inventory-desktop\/|home-videos\/desktop\/|daynight-(?:home|detail)-desktop.*\.css/.test(
					request.url()
				)
			)
				desktopRequests.push(request.url());
		});
		for (const width of [320, 390]) {
			await page.setViewportSize({ width, height: 844 });
			await page.goto('/en');
			await expect(page.locator('.mobile-home')).toBeVisible();
			await expect(page.locator('.hero-intent')).toHaveCount(0);
			await page.evaluate(() => document.fonts.ready);
			await page.screenshot({ path: testInfo.outputPath(`mobile-home-${width}-after.png`) });
			await page.goto('/en/inventory/mercedes-benz-gla-45-amg-405323');
			await expect(page.locator('.daynight-detail')).toHaveCount(0);
			expect(desktopRequests).toEqual([]);
		}
	});
});

test.describe('desktop without JavaScript', () => {
	test.use({ javaScriptEnabled: false });
	test('home and detail still receive their desktop stylesheet', async ({ page }) => {
		await page.goto('/en');
		await expect(page.locator('.daynight-home-inventory__grid')).toHaveCSS('display', 'grid');
		await page.goto('/en/inventory/mercedes-benz-gla-45-amg-405323');
		await expect(page.locator('.daynight-detail .listing-details')).toHaveCSS('display', 'flex');
	});
});

test('desktop videos request the player only after activation', async ({ page }, testInfo) => {
	await page.goto('/en');
	await page.locator('.home-video__play').first().click({ trial: true });
	await expect(page.locator('.home-videos iframe')).toHaveCount(0);
	await expect(page.locator('.home-videos h3')).toHaveCount(0);
	await expect(page.locator('.home-video__image').first()).toHaveCSS('border-radius', '12px');
	const featured = (await page.locator('.home-video__image').first().boundingBox())!;
	const secondary = (await page.locator('.home-video__image').nth(1).boundingBox())!;
	expect(featured.width).toBeGreaterThan(secondary.width * 1.9);
	await expect(page.locator('.home-video__playmark').first()).toHaveCSS(
		'color',
		'rgb(255, 255, 255)'
	);
	await expect
		.poll(() =>
			page
				.locator('.home-video__play img')
				.first()
				.evaluate((image: HTMLImageElement) => image.naturalWidth)
		)
		.toBeGreaterThanOrEqual(1280);
	await page.screenshot({ path: testInfo.outputPath('videos-desktop-after.png') });
	await page.locator('.home-video__play').first().click();
	await expect(page.locator('.home-videos iframe')).toHaveCount(1);
	await page.locator('.home-video__close').click();
	await expect(page.locator('.home-videos iframe')).toHaveCount(0);
	await expect(page.locator('.home-video__play').first()).toBeFocused();
});
