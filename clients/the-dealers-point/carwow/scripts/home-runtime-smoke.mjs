import { chromium } from '@playwright/test';

const baseURL = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:5178';
const forbiddenScripts = [
	'/assets/js/swiper-bundle.min.js',
	'/assets/js/swiper.js',
	'/assets/js/jquery.min.js',
	'/assets/js/jquery.cookie.min.js',
	'/assets/js/countto.js',
	'/assets/js/gear-slider.js',
	'/assets/js/wow.min.js',
	'/assets/js/app.js',
	'jquery-ui.min.js'
];

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

async function inspectHome(browser, viewport) {
	const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
	const messages = [];

	page.on('console', (message) => {
		if (['error', 'warning'].includes(message.type())) {
			messages.push(`${message.type()}: ${message.text()}`);
		}
	});
	page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`));

	await page.goto(new URL('/', baseURL).href, { waitUntil: 'networkidle', timeout: 60_000 });

	const initial = await page.evaluate(() => {
		const measureStaticTrack = (rootSelector, itemSelector) => {
			const root = document.querySelector(rootSelector);
			const item = root?.querySelector(itemSelector);
			const rootRect = root?.getBoundingClientRect();
			const itemRect = item?.getBoundingClientRect();

			return {
				itemWidth: itemRect?.width ?? 0,
				rootWidth: rootRect?.width ?? 0
			};
		};

		return {
			scripts: Array.from(document.scripts)
				.map((script) => script.getAttribute('src'))
				.filter(Boolean),
			hasSvelteHero: Boolean(document.querySelector('.daynight-home-hero')),
			hasLegacyHeroMarkup: Boolean(
				document.querySelector(
					'.daynight-conversion-hero, .page-title.page-title-style-3, .height-664, .effect-content-slide, .effect-2, .search-cars, [class*="search-cars__"]'
				)
			),
			hasLegacySwiperMarkup: Boolean(
				document.querySelector(
					'.swiper-container, .swiper-wrapper, .swiper-slide, .swiper-outbrand, .swiper-card-3, .swiper-card-8, .swiper-testimonior'
				)
			),
			hasLegacyWowMarkup: Boolean(
				document.querySelector('.wow, .fadeIn, .fadeInUp, .fadeInDown, [data-wow-delay]')
			),
			hasLegacyReviewActionMarkup: Boolean(
				document.querySelector(
					'.daynight-home-review-grid .testimonior-box, .daynight-home-review-grid .testimonior-box--desc, .daynight-home-review-grid .testimonior--img, .car-box-style-3, .tf-spacing'
				)
			),
			hasLegacyInventoryCardMarkup: Boolean(
				document.querySelector(
					'.daynight-home-inventory__card.card-box, .daynight-home-inventory__card.card-box-style-1, .daynight-home-inventory__card .card--img, .daynight-home-inventory__card .card-box__title, .daynight-home-inventory__card .card-box__price, .daynight-home-inventory__card .view-details, .daynight-home-inventory__card .tag.style2, .daynight-home-inventory__card .bg-primary-2.highlight'
				)
			),
			hasLegacyVehicleComparisonMarkup: Boolean(
				document.querySelector(
					'.daynight-vehicle-types .card-box-style-5, .daynight-comparison-grid .card-box-style-7, .daynight-comparison-grid .card-box-style-7--title'
				)
			),
			hasLegacyHomeSectionMarkup: Boolean(
				document.querySelector(
					'.daynight-home-inventory.py-100, .daynight-home-brand-section.py-100, .daynight-home-brand-section.background-light, section.py-100 .daynight-vehicle-types, section.background-light.py-100 .daynight-comparison-grid, .daynight-home-review-grid .title-section, .daynight-brand-grid .out-brand, .why-choose-us, .box-couter-item, .box-couter'
				)
			),
			hasLegacyFooterGridMarkup: Boolean(
				document.querySelector(
					'.footer-top, .footer-bottom, .footer .footer-links, .footer .footer-contact, .footer .form-footer, .footer-top > .container > .row, .footer-top .col-lg-4, .widget-links, .widget-socical'
				)
			),
			hasTabletNav: Boolean(document.querySelector('#daynight-home-mobile-nav')),
			headerClass:
				document.querySelector('#header_main, .header-wrapper-style-3 .header')?.className ?? '',
			hasMobileHome: Boolean(document.querySelector('.mobile-home')),
			mobileHeroVisible: Boolean(document.querySelector('.mh-hero')),
			mobileFeaturedCount: document.querySelectorAll('.mh-car').length,
			mobileBrandCardCount: document.querySelectorAll('.mh-brandcard').length,
			mobileBottomDockVisible: (() => {
				const dock = document.querySelector('.mobile-bottom-dock');
				return dock ? getComputedStyle(dock).display !== 'none' : false;
			})(),
			brandStrip: (() => {
				const root = document.querySelector('.daynight-brand-grid');
				const wrapper = root?.querySelector('.daynight-brand-grid__items');
				const slides = Array.from(root?.querySelectorAll('.daynight-brand-grid__item') ?? []);
				const rect = root?.getBoundingClientRect();

				return {
					exists: Boolean(root),
					firstBrand: slides[0]?.textContent?.trim() ?? '',
					slideCount: slides.length,
					wrapperDisplay: wrapper ? getComputedStyle(wrapper).display : '',
					width: rect?.width ?? 0
				};
			})(),
			reviewTrack: measureStaticTrack(
				'.daynight-home-review-grid',
				'.daynight-home-review-grid__item'
			),
			comparisonSectionCount: document.querySelectorAll('.daynight-home-section--comparison')
				.length,
			inventoryCardCount: document.querySelectorAll(
				'.daynight-home-inventory .daynight-home-inventory__card'
			).length,
			vehicleTypeCardCount: document.querySelectorAll(
				'.daynight-vehicle-types .daynight-vehicle-type-card'
			).length,
			vehicleTypeTrack: measureStaticTrack(
				'.daynight-vehicle-types',
				'.daynight-vehicle-types__item'
			),
			reviewCardCount: document.querySelectorAll(
				'.daynight-home-review-grid .daynight-home-review-card'
			).length
		};
	});

	await page.evaluate(() => window.scrollTo(0, 950));
	await page.waitForTimeout(200);
	const afterScroll = await page.evaluate(() => ({
		headerClass:
			document.querySelector('#header_main, .header-wrapper-style-3 .header')?.className ?? '',
		scrollY: window.scrollY
	}));

	await page.evaluate(() => window.scrollTo(0, 0));
	await page.waitForTimeout(500);
	const afterLanguage = await page.evaluate(() => {
		const button = document.querySelector(
			'#language-select button[aria-controls="headerLanguageMenu"]'
		);
		button?.click();
		const menu = document.querySelector('#headerLanguageMenu');
		return new Promise((resolve) =>
			window.setTimeout(
				() =>
					resolve({
						rootClass: document.querySelector('#language-select')?.className ?? '',
						expanded: button?.getAttribute('aria-expanded') ?? '',
						menuVisibility: menu ? getComputedStyle(menu).visibility : '',
						menuOpacity: menu ? getComputedStyle(menu).opacity : ''
					}),
				250
			)
		);
	});

	const afterMobileToggle = await page.evaluate(() => {
		const button =
			document.querySelector('.daynight-home-header__mobile-toggle') ??
			document.querySelector('.mobile-bottom-dock button[aria-controls="mobile-menu-sheet"]');
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		const overlay = document.querySelector('.daynight-home-mobile-overlay');
		return new Promise((resolve) =>
			window.setTimeout(
				() =>
					resolve({
						bodyClass: document.body.className,
						buttonClass: button?.className ?? '',
						buttonExpanded: button?.getAttribute('aria-expanded') ?? '',
						navId: document.querySelector('#daynight-home-mobile-nav')
							? 'daynight-home-mobile-nav'
							: document.querySelector('#daynight-home-main-nav')
								? 'daynight-home-main-nav'
								: '',
						navClass:
							document.querySelector('#daynight-home-mobile-nav, #daynight-home-main-nav')
								?.className ?? '',
						mobileDrawerState:
							document
								.querySelector('.mobile-drawer[data-state="open"]')
								?.getAttribute('data-state') ?? '',
						mobileSheetId: document.querySelector('#mobile-menu-sheet') ? 'mobile-menu-sheet' : '',
						hasOverlay: Boolean(overlay),
						overlayStyle: overlay?.getAttribute('style') ?? ''
					}),
				200
			)
		);
	});

	await page.close();

	return {
		viewport,
		messages,
		initial,
		afterScroll,
		afterLanguage,
		afterMobileToggle
	};
}

const browser = await chromium.launch({ headless: true });
const results = [];

try {
	results.push(await inspectHome(browser, { width: 1440, height: 1100 }));
	results.push(await inspectHome(browser, { width: 900, height: 900 }));
} finally {
	await browser.close();
}

for (const result of results) {
	const label = `${result.viewport.width}x${result.viewport.height}`;
	const expectsDesktopHome = result.viewport.width >= 992;

	assert(result.messages.length === 0, `${label}: console issues:\n${result.messages.join('\n')}`);
	assert(!result.initial.hasLegacySwiperMarkup, `${label}: homepage still contains Swiper markup`);
	assert(
		!result.initial.hasLegacyWowMarkup,
		`${label}: homepage still contains WOW animation markup`
	);
	assert(
		!result.initial.hasLegacyReviewActionMarkup,
		`${label}: homepage still contains legacy review/action-card markup`
	);
	assert(
		!result.initial.hasLegacyInventoryCardMarkup,
		`${label}: homepage still contains legacy inventory-card markup`
	);
	assert(
		!result.initial.hasLegacyVehicleComparisonMarkup,
		`${label}: homepage still contains legacy vehicle/comparison-card markup`
	);
	assert(
		!result.initial.hasLegacyHomeSectionMarkup,
		`${label}: homepage still contains legacy home section markup`
	);
	assert(
		!result.initial.hasLegacyFooterGridMarkup,
		`${label}: homepage still contains legacy footer grid markup`
	);

	if (expectsDesktopHome) {
		assert(
			result.initial.brandStrip.exists &&
				result.initial.brandStrip.slideCount >= 8 &&
				result.initial.brandStrip.wrapperDisplay === 'grid' &&
				result.initial.brandStrip.width > 300,
			`${label}: Svelte/CSS brand strip did not render`
		);
		assert(
			result.initial.comparisonSectionCount === 0,
			`${label}: homepage comparison section should not render`
		);
		assert(
			result.initial.vehicleTypeCardCount >= 4,
			`${label}: Svelte vehicle type cards did not render the stocked categories`
		);
		assert(
			result.initial.inventoryCardCount >= 8,
			`${label}: Svelte inventory cards did not render`
		);
		assert(result.initial.reviewCardCount >= 3, `${label}: Svelte review cards did not render`);
		for (const [name, track] of [
			['vehicle type', result.initial.vehicleTypeTrack],
			['review', result.initial.reviewTrack]
		]) {
			assert(
				track.rootWidth > 300 && track.itemWidth > 0 && track.itemWidth < track.rootWidth * 0.8,
				`${label}: ${name} cards collapsed into a one-slide carousel layout`
			);
		}
		assert(result.initial.hasSvelteHero, `${label}: Svelte hero missing`);
		assert(
			!result.initial.hasLegacyHeroMarkup,
			`${label}: homepage still contains legacy hero markup`
		);
		assert(result.afterScroll.scrollY >= 900, `${label}: scroll probe did not move page`);
		assert(
			result.afterScroll.headerClass.includes('is-fixed') &&
				result.afterScroll.headerClass.includes('is-custom') &&
				result.afterScroll.headerClass.includes('is-visible'),
			`${label}: sticky header classes missing after scroll`
		);
	} else {
		assert(result.initial.hasMobileHome, `${label}: mobile/tablet home shell did not render`);
		assert(result.initial.mobileHeroVisible, `${label}: mobile/tablet hero missing`);
		assert(
			result.initial.mobileFeaturedCount >= 4,
			`${label}: mobile/tablet featured cars did not render`
		);
		assert(
			result.initial.mobileBrandCardCount >= 3,
			`${label}: mobile/tablet brand grid did not render from published inventory`
		);
		assert(
			result.initial.mobileBottomDockVisible,
			`${label}: mobile/tablet bottom dock was not visible`
		);
	}

	for (const script of forbiddenScripts) {
		assert(
			!result.initial.scripts.some((src) => src.includes(script)),
			`${label}: forbidden legacy script still loaded: ${script}`
		);
	}

	if (expectsDesktopHome) {
		assert(!result.initial.hasTabletNav, `${label}: desktop should not use tablet nav`);
		assert(
			result.afterLanguage.expanded === 'true' && result.afterLanguage.menuVisibility === 'visible',
			`${label}: language dropdown did not open`
		);
		assert(
			!result.afterMobileToggle.bodyClass.includes('daynight-home-nav-open'),
			`${label}: hidden desktop mobile toggle should not open body nav`
		);
	} else {
		assert(
			result.afterMobileToggle.buttonClass.includes('is-active') &&
				result.afterMobileToggle.buttonExpanded === 'true' &&
				result.afterMobileToggle.mobileDrawerState === 'open' &&
				result.afterMobileToggle.mobileSheetId === 'mobile-menu-sheet',
			`${label}: mobile/tablet menu sheet did not open`
		);
	}

	console.log(`${label} home runtime ok`);
}
