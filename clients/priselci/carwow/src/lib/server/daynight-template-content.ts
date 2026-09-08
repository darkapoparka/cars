import { daynightAccount } from '$lib/data/daynight-account';
import { daynightArticles, type DayNightArticle } from '$lib/data/daynight-blog';
import { getDayNightTeamMemberBySlug, daynightTeam } from '$lib/data/daynight-team';
import {
	featuredDayNightVehicles,
	getDayNightVehicleBySlug,
	daynightVehicles
} from '$lib/data/daynight-vehicles';
import { daynightSite } from '$lib/data/daynight-site';
import { dashboardTemplateFiles } from '$lib/data/template-routes';
import {
	insertStickyHeaderLogo,
	replaceHeaderContact,
	replaceHeaderSearch,
	replaceHeaderTopBarControls,
	renderHeaderLogo,
	renderPresentationFooter,
	renderTemplateMainMenu,
	replaceMainNav
} from './daynight-template-chrome';
import {
	renderInventoryQuickFilters,
	renderInventoryMapCardCollection,
	replaceDivInnerByExactClass,
	replaceInventoryCardCollections,
	escapeHtml
} from './daynight-inventory-template';

export type DayNightTemplateContentContext = {
	blogArticles?: DayNightArticle[];
};

function getBlogArticles(context?: DayNightTemplateContentContext) {
	return context?.blogArticles?.length ? context.blogArticles : daynightArticles;
}

function replaceCommonCopy(html: string) {
	const useLightHeaderLogo = html.includes('<body class="home-style-9"');
	const primaryLogo = useLightHeaderLogo ? daynightSite.logoLight : daynightSite.logoDark;

	return replaceHeaderSearch(
		replaceHeaderTopBarControls(
			replaceHeaderContact(
				html
					.replaceAll('/assets/images/logo-white.png', daynightSite.logoLight)
					.replaceAll('/assets/images/logo.png', primaryLogo)
					.replaceAll('Aurexo', daynightSite.shortName)
					.replaceAll('themesflat@gmail.com', daynightSite.email)
					.replaceAll('1-555-678-8888', daynightSite.phoneLabel)
					.replaceAll('1-222-345-8888', daynightSite.phoneLabel)
					.replaceAll('1-222-6666-8888', daynightSite.phoneLabel)
					.replaceAll('1-333-123-6666', daynightSite.phoneLabel)
					.replaceAll('1-555-678-9999', daynightSite.phoneLabel)
					.replaceAll('15505 Roscoe Blvd, North Hills, USA', daynightSite.location)
					.replaceAll('6205 Peachtree Dunwoody Rd, Atlanta, GA 30328', daynightSite.location)
					.replaceAll('6205 Peachtree Dunwoody Rd, Atlanta, GA', daynightSite.location)
					.replaceAll('6205 Peachtree Dunwoody Rd, Atlanta,', daynightSite.location)
					.replaceAll('Tampa, FL', 'Варна')
					.replaceAll('GA 30328', '')
					.replaceAll('VIEW ON MAP', 'ВИЖ КАРТА')
					.replaceAll('View on map', 'Виж карта')
					.replaceAll('https://themeforest.net/user/themesflat', '/')
					.replaceAll('themeforest.net/user/themesflat', '/')
					.replaceAll('themesflat', 'daynightauto')
					.replaceAll('Add Listing', daynightSite.sellCarCta)
					.replaceAll('Sign In', daynightSite.accountCta)
					.replaceAll('Dealer Listings', 'заявки към автокъщата')
					.replaceAll('Dealer Listing', 'Профил на Приселци Варна')
					.replaceAll(
						'Mike Hanley (@mike_hanley) is a writer who draws. He’s the Bestselling author of “Number of The Year”.',
						'Приселци публикува практични съвети за покупка, оглед, документи, финансиране и последващи стъпки.'
					)
					.replaceAll('Mike Hanley', 'Приселци')
					.replaceAll('@mike_hanley', '@daynightauto')
					.replaceAll('Michael Carter', 'Клиент на Приселци')
					.replaceAll('Sophia Carter', 'Клиент от Варна')
					.replaceAll('Contact', 'Контакти')
					.replaceAll('About', 'За нас')
					.replaceAll('News', 'Полезно')
					.replaceAll('Контакти Us', 'Контакти')
					.replaceAll('Heather Dick', 'Клиент на Приселци')
					.replaceAll(
						'Owned since 2010. Drove it through all kinds of weather, from hot summers to snowy roads, and it never let me down. A few minor repairs here and there — mostly wear and tear — but the engine just keeps going.',
						'Коректно съдействие при огледа, документите и избора на автомобил. Получих ясна информация за състояние, цена и следващи стъпки.'
					)
					.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
					.replaceAll('Add A Review', 'Добави отзив')
					.replaceAll('Login To Add A Review', 'Вход за добавяне на отзив')
					.replaceAll('Your email address will not be published', 'Имейлът няма да бъде публикуван')
					.replace(
						/<div class="logo">\s*<a href="[^"]*">\s*<img[^>]*>\s*<\/a>\s*<\/div>/,
						renderHeaderLogo('logo', primaryLogo)
					)
					.replace(
						/<div class="logo-mobile">\s*<a href="[^"]*">\s*<img[^>]*>\s*<\/a>\s*<\/div>/,
						renderHeaderLogo('logo-mobile', primaryLogo)
					)
					.replace(
						/(<div class="flex justify-between items-center gap-20 w-full main-nav-wrapper">[\s\S]*?<\/div>)/,
						(match) => insertStickyHeaderLogo(match)
					)
					.replace(
						/<a href="#" class="btn btn-line btn-large font-weight-600 bg-sign-in open-modal" data-modal-id="#LoginModal">[\s\S]*?<\/a>/,
						(match) =>
							match
								.replace('href="#"', 'href="/admin/login"')
								.replace(' bg-sign-in open-modal"', ' bg-sign-in"')
								.replace(' data-modal-id="#LoginModal"', '')
								.replace(daynightSite.accountCta, 'Екип вход')
					)
					.replace(/<nav id="main-nav"[\s\S]*?<\/nav>/, (match) => replaceMainNav(match))
					.replace(/<nav class="main-menu[^"]*"[^>]*>[\s\S]*?<\/nav>/, renderTemplateMainMenu())
			)
		)
	);
}

const selectedTemplateFileToRoute: Record<string, string> = {
	'listing-grid4-columns.html': '/inventory',
	'listing-gridstyle-halfmap.html': '/inventory/map',
	'listing-details-1.html': '/inventory',
	'listing-details-2.html': '/inventory',
	'listing-details-3.html': '/inventory',
	'listing-details-4.html': '/inventory',
	'listing-details-5.html': '/inventory',
	'listing-details-6.html': '/inventory',
	'listing-liststyle-halfmap.html': '/inventory/map',
	'listing-topmap.html': '/inventory/map',
	'listing-sidebar-left.html': '/inventory',
	'listing-sidebar-right.html': '/inventory',
	'listing-grid2-columns.html': '/inventory',
	'listing-grid3-columns.html': '/inventory',
	'dealers-listing.html': '/about/daynight-auto-plovdiv',
	'dealer-details.html': '/about/daynight-auto-plovdiv',
	'about-us.html': '/about',
	'contact-us.html': '/contact',
	'financing.html': '/financing',
	'sell-your-car.html': '/sell-your-car',
	'add-listings-2.html': '/sell-your-car/request',
	'services-center.html': '/services',
	'clients-reviews.html': '/reviews',
	'sale-agents.html': '/team',
	'sale-agents-details.html': '/team/prodazhbi-daynight-auto',
	'dashboard.html': '/admin',
	'my-profile.html': '/admin/settings',
	'my-listings.html': '/admin/listings',
	'add-listings.html': '/admin/listings/new',
	'message.html': '/admin/conversations',
	'my-favorites.html': '/admin',
	'reviews.html': '/admin',
	'change-password.html': '/admin/settings',
	'calculator.html': '/calculator',
	'compare.html': '/compare',
	'faqs.html': '/faq',
	'blog-standard.html': '/blog',
	'blog-grid-style-1.html': '/blog',
	'blog-details-1.html': '/blog/kak-da-kupim-upotrebyavan-avtomobil',
	'blog-details-2.html': '/blog/dnevni-novini-daynight-auto-obnovena-nalichnost',
	'terms.html': '/terms',
	'shop.html': '/inventory',
	'shopping-cart.html': '/inventory',
	'check-out.html': '/inventory',
	'product-details.html': '/inventory'
};

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const daynightPageAssets = {
	aboutExterior: '/assets/priselci/vehicle-05-1.webp',
	aboutConsultation: '/assets/priselci/vehicle-05-1.webp',
	aboutShowroomVehicle: '/assets/priselci/vehicle-05-1.webp',
	servicesInspection: '/assets/priselci/vehicle-05-1.webp',
	servicesConsultation: '/assets/priselci/vehicle-05-1.webp',
	dealerProfileMark: '/assets/priselci/wordmark.svg'
} as const;

const daynightMapEmbedQuery = `${daynightSite.mapLabel}, ${daynightSite.location}`;
const daynightMapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(daynightMapEmbedQuery)}&output=embed`;
const daynightTeamGridClass = 'grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16';
const supportHeroTemplateFiles = new Set([
	'about-us.html',
	'sell-your-car.html',
	'services-center.html'
]);

const supportHeroByTemplateFile: Record<
	string,
	{
		modifier: string;
		title: string;
		description: string;
		image: string;
		primaryHref: string;
		primaryLabel: string;
		secondaryHref: string;
		secondaryLabel: string;
	}
> = {
	'about-us.html': {
		modifier: 'about',
		title: 'За Приселци',
		description:
			'Автомобили от обяви, ясна история и съдействие от избора до документите в Варна.',
		image: daynightPageAssets.aboutExterior,
		primaryHref: '/inventory',
		primaryLabel: 'Виж автомобили',
		secondaryHref: '/contact',
		secondaryLabel: 'Свържете се'
	},
	'sell-your-car.html': {
		modifier: 'sell',
		title: 'Продай или замени автомобила си',
		description:
			'Изпратете данни за автомобила и получете ясни следващи стъпки за покупка, бартер или клиентска обява.',
		image: daynightPageAssets.aboutConsultation,
		primaryHref: '/sell-your-car/request',
		primaryLabel: 'Изпрати заявка',
		secondaryHref: '/sell-your-car/request',
		secondaryLabel: 'Говори с екипа'
	},
	'services-center.html': {
		modifier: 'services',
		title: 'Услуги',
		description: 'Съдействие при оглед, документи, регистрация, финансиране, бартер и доставка.',
		image: daynightPageAssets.servicesInspection,
		primaryHref: '/services?service=inspection#services-request',
		primaryLabel: 'Изпратете запитване',
		secondaryHref: '/inventory',
		secondaryLabel: 'Виж автомобили'
	}
};

function buildDayNightMapIframe(height: string, loading: 'lazy' | 'eager' = 'lazy') {
	// The Google Maps embed pulls ~2MB of map JS. Defer it: render without `src` and let
	// TemplateLocalBehaviors load it (via IntersectionObserver) when scrolled into view.
	return `<iframe title="Карта до Приселци Варна" data-map-src="${daynightMapEmbedSrc}" data-daynight-scroll-map height="${height}" style="border:0;width: 100%;" allowfullscreen="" loading="${loading}" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}

function renderSupportHero(templateFile: string) {
	const hero = supportHeroByTemplateFile[templateFile];

	if (!hero) {
		return '';
	}

	return `<section class="daynight-inner-hero daynight-inner-hero--${hero.modifier}">
	<div class="daynight-inner-hero__media" aria-hidden="true">
		<img src="${escapeHtml(hero.image)}" alt="">
	</div>
	<div class="container daynight-inner-hero__content">
		<h1>${escapeHtml(hero.title)}</h1>
		<p>${escapeHtml(hero.description)}</p>
		<div class="daynight-inner-hero__actions">
			<a class="daynight-inner-hero__button daynight-inner-hero__button--primary" href="${escapeHtml(hero.primaryHref)}">${escapeHtml(hero.primaryLabel)}</a>
			<a class="daynight-inner-hero__button daynight-inner-hero__button--secondary" href="${escapeHtml(hero.secondaryHref)}">${escapeHtml(hero.secondaryLabel)}</a>
		</div>
	</div>
</section>`;
}

function replaceSupportBreadcrumbWithHero(html: string, templateFile: string) {
	if (!supportHeroTemplateFiles.has(templateFile)) {
		return html;
	}

	return html.replace(
		/\s*<!-- breadcrumb -->[\s\S]*?<!-- breadcrumb -->\s*/,
		`\n${renderSupportHero(templateFile)}\n`
	);
}

function removeSupportTemplateTitle(html: string, templateFile: string) {
	if (!supportHeroTemplateFiles.has(templateFile)) {
		return html;
	}

	return html.replace(
		/(<section\b[^>]*\b(?:pb-100|bg-white pb-100)\b[^>]*>\s*<div class="container">\s*)<h2>[\s\S]*?<\/h2>\s*<div class="tf-spacing-style3"><\/div>\s*/i,
		'$1'
	);
}

function replaceSupportPageChrome(html: string, templateFile: string) {
	return removeSupportTemplateTitle(
		replaceSupportBreadcrumbWithHero(html, templateFile),
		templateFile
	);
}

function replaceWidgetMapByClass(
	html: string,
	className: string,
	height: string,
	loading: 'lazy' | 'eager' = 'lazy'
) {
	const pattern = new RegExp(
		`<div class="${escapeRegExp(className)}">[\\s\\S]*?<\\/iframe>\\s*<\\/div>`,
		'i'
	);

	return html.replace(
		pattern,
		`<div class="${className}">${buildDayNightMapIframe(height, loading)}</div>`
	);
}

function buildTeamRoute(slug: string) {
	return `/team/${slug}`;
}

function renderTeamContactActions(member: (typeof daynightTeam)[number]) {
	const phoneHref = member.phone.replace(/\s+/g, '');

	return `<ul class="contact">
								<li>
									<a href="tel:${phoneHref}" title="${daynightSite.phoneCta}" aria-label="${daynightSite.phoneCta}">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
								<li>
									<a href="mailto:${member.email}" title="Имейл към Приселци" aria-label="Имейл към Приселци">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M3.75 7.5L10.94 12.2933C11.5667 12.7111 12.4333 12.7111 13.06 12.2933L20.25 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M4.5 5.25H19.5C20.3284 5.25 21 5.92157 21 6.75V17.25C21 18.0784 20.3284 18.75 19.5 18.75H4.5C3.67157 18.75 3 18.0784 3 17.25V6.75C3 5.92157 3.67157 5.25 4.5 5.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
							</ul>`;
}

function renderTeamHoverActions(member: (typeof daynightTeam)[number], route: string) {
	const phoneHref = member.phone.replace(/\s+/g, '');

	return `<ul class="sale-agent-social flex gap-8">
								<li>
									<a href="tel:${phoneHref}" title="${daynightSite.phoneCta}" aria-label="${daynightSite.phoneCta}">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
								<li>
									<a href="mailto:${member.email}" title="Имейл към ${member.name}" aria-label="Имейл към ${member.name}">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M3.75 7.5L10.94 12.2933C11.5667 12.7111 12.4333 12.7111 13.06 12.2933L20.25 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M4.5 5.25H19.5C20.3284 5.25 21 5.92157 21 6.75V17.25C21 18.0784 20.3284 18.75 19.5 18.75H4.5C3.67157 18.75 3 18.0784 3 17.25V6.75C3 5.92157 3.67157 5.25 4.5 5.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
								<li>
									<a href="${route}" title="Виж профила" aria-label="Виж профила">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M12 12.75C14.0711 12.75 15.75 11.0711 15.75 9C15.75 6.92893 14.0711 5.25 12 5.25C9.92893 5.25 8.25 6.92893 8.25 9C8.25 11.0711 9.92893 12.75 12 12.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M4.5 20.25C5.37804 17.2645 8.23025 15 12 15C15.7698 15 18.622 17.2645 19.5 20.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
							</ul>`;
}

function renderContactPageSocialLinks() {
	return `<ul class="contact-page-info-social flex gap-8">
							<li>
								<a href="https://priselci.mobile.bg/" target="_blank" rel="noopener" class="hover-fill-white" title="Facebook" aria-label="Facebook">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M11.5541 20V10.8777H14.6148L15.074 7.32156H11.5541V5.05147C11.5541 4.0222 11.8387 3.32076 13.3164 3.32076L15.1979 3.31999V0.13923C14.8725 0.0969453 13.7556 0 12.4556 0C9.74098 0 7.88252 1.65697 7.88252 4.69927V7.32156H4.8125V10.8777H7.88252V20H11.5541Z" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="https://priselci.mobile.bg/" target="_blank" rel="noopener" class="hover-stroke-white" title="Instagram" aria-label="Instagram">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="#1C1C1C" stroke-width="1.5"/>
										<circle cx="10" cy="10" r="3.15" stroke="#1C1C1C" stroke-width="1.5"/>
										<circle cx="14.05" cy="5.95" r="0.9" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="tel:${daynightSite.phone}" class="hover-stroke-white" title="Свържете се с Приселци по телефон или Viber." aria-label="Свържете се с Приселци по телефон или Viber.">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="${daynightSite.sourceInventory}" target="_blank" rel="noopener" class="hover-stroke-white" title="Виж наличните автомобили в mobile.bg" aria-label="Виж наличните автомобили в mobile.bg">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M3 12.5L4.6 8.8C4.95 7.98 5.76 7.44 6.65 7.44H13.35C14.24 7.44 15.05 7.98 15.4 8.8L17 12.5" stroke="#1C1C1C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M4 12.5H16.1C16.87 12.5 17.5 13.13 17.5 13.9V14.7C17.5 15.47 16.87 16.1 16.1 16.1H3.9C3.13 16.1 2.5 15.47 2.5 14.7V13.9C2.5 13.13 3.13 12.5 3.9 12.5H4Z" stroke="#1C1C1C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="5.7" cy="14.35" r="1.05" fill="#1C1C1C"/>
										<circle cx="14.3" cy="14.35" r="1.05" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="hover-stroke-white" title="Отвори локацията на Приселци в Google Maps" aria-label="Отвори локацията на Приселци в Google Maps">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</a>
							</li>
						</ul>`;
}

function renderTeamGrid(variant: 'about' | 'team') {
	const members = daynightTeam;

	return members
		.map((member) => {
			const route = buildTeamRoute(member.slug);

			return `<div class="sale-agent-box">
						<div class="card-top mb-20">
							<a class="w-full flex" href="${route}">
								<img class="w-full" src="${member.image}" alt="${member.name}">
							</a>
							${renderTeamHoverActions(member, route)}
						</div>
						<div class="${variant === 'team' ? 'card-bottom flex items-center justify-between gap-16' : 'card-bottom'}">
							<div class="content">
								<a class="h5 font-weight-600 sale-agent-title" href="${route}">${member.name}</a>
								<p class="text-secondary text-sm">${member.role}</p>
							</div>
							${variant === 'team' ? renderTeamContactActions(member) : ''}
						</div>
					</div>`;
		})
		.join('\n');
}

const aboutBrandTiles = [
	['Audi', '/assets/images/brand/mobile/audi.svg'],
	['BMW', '/assets/images/brand/mobile/bmw.svg'],
	['Chevrolet', '/assets/images/brand/mobile/chevrolet.svg'],
	['Chrysler', '/assets/images/brand/mobile/chrysler.svg'],
	['Citroen', '/assets/images/brand/mobile/citroen.svg'],
	['Ford', '/assets/images/brand/mobile/ford.svg'],
	['Honda', '/assets/images/brand/mobile/honda.svg'],
	['Jaguar', '/assets/images/brand/mobile/jaguar.svg'],
	['Land Rover', '/assets/images/brand/mobile/land-rover.svg'],
	['Mazda', '/assets/images/brand/mobile/mazda.svg'],
	['Opel', '/assets/images/brand/mobile/opel.svg'],
	['Peugeot', '/assets/images/brand/mobile/peugeot.svg'],
	['Porsche', '/assets/images/brand/mobile/porsche.svg'],
	['Skoda', '/assets/images/brand/mobile/skoda.svg'],
	['VW', '/assets/images/brand/mobile/volkswagen.svg'],
	['Volvo', '/assets/images/brand/mobile/volvo.svg']
] as const;

const verifiedAboutBrandLogoByBrand = new Map<string, string>(aboutBrandTiles);

const brandFallbackMarkByBrand = new Map([
	['Chrysler', 'CHR'],
	['Citroen', 'CIT'],
	['Jaguar', 'JAG'],
	['Land Rover', 'LR'],
	['Mercedes-Benz', 'MB'],
	['Opel', 'OP'],
	['Peugeot', 'PEU'],
	['Porsche', 'POR'],
	['Skoda', 'SK'],
	['VW', 'VW']
]);

function getBrandFallbackMark(brand: string) {
	return (
		brandFallbackMarkByBrand.get(brand) ??
		brand
			.split(/[\s-]+/)
			.map((part) => part[0])
			.join('')
			.slice(0, 3)
			.toUpperCase()
	);
}

function renderAboutBrandMark(brand: string) {
	const logo = verifiedAboutBrandLogoByBrand.get(brand);

	if (logo) {
		return `<img class="daynight-about-brand-card__logo" src="${logo}" alt="" aria-hidden="true">`;
	}

	return `<span class="daynight-about-brand-card__mark" aria-hidden="true">${escapeHtml(
		getBrandFallbackMark(brand)
	)}</span>`;
}

function renderAboutBrandGrid() {
	return `<!-- Explore Our Brands -->
		<section class="tf-spacing-8 pt-0">
			<div class="container">
				<div class="title-section flex align-end justify-between mb-30">
					<h2 class="">Марки, с които работим</h2>
					<a href="/inventory" class="btn btn-line btn-large hover-fill-white effect-line-primary">
						Виж наличните
						<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z" fill="#1C1C1C"></path>
						</svg>
					</a>
				</div>
				<div class="daynight-about-brands">
					${aboutBrandTiles
						.map(([brand]) => {
							const href = `/inventory?brand=${encodeURIComponent(brand)}`;

							return `<a href="${href}" class="out-brand-4 daynight-about-brand-card">
						${renderAboutBrandMark(brand)}
						<span class="h6 font-weight-600 text-center">${escapeHtml(brand)}</span>
					</a>`;
						})
						.join('\n')}
				</div>
			</div>
		</section>
		<!-- Explore Our Brands -->`;
}

function replaceAboutBrandCarousel(html: string) {
	return html.replace(
		/<!-- Explore Our Brands -->[\s\S]*?<!-- Explore Our Brands -->/,
		renderAboutBrandGrid()
	);
}

function dashboardHeaderTitle(templateFile: string) {
	const titleByFile: Record<string, string> = {
		'dashboard.html': daynightAccount.title,
		'my-profile.html': daynightAccount.profileTitle,
		'my-listings.html': daynightAccount.listingsTitle,
		'add-listings.html': daynightAccount.newListingCta,
		'add-listings-2.html': daynightAccount.newListingCta,
		'message.html': daynightAccount.messagesTitle,
		'my-favorites.html': daynightAccount.favoritesTitle,
		'reviews.html': daynightAccount.reviewsTitle,
		'change-password.html': daynightAccount.passwordTitle
	};

	return titleByFile[templateFile] ?? daynightAccount.title;
}

function renderDashboardAccountHeader(templateFile: string) {
	const title = escapeHtml(dashboardHeaderTitle(templateFile));

	return `<header class="header bg-white daynight-dashboard-header" id="header_main">
					<div class="header-container-fluid relative">
						<div class="header-inner daynight-dashboard-header__inner" id="site-header-inner">
							<a class="daynight-dashboard-header__brand daynight-header-logo" href="/" aria-label="${escapeHtml(daynightSite.name)}">
								<img class="daynight-header-logo__image" src="${daynightSite.logoDark}" alt="${escapeHtml(daynightSite.name)}">
							</a>
							<div class="daynight-dashboard-header__summary">
								<span>Клиентски профил</span>
								<strong>${title}</strong>
							</div>
							<div class="daynight-dashboard-header__actions">
								<a class="daynight-dashboard-header__ghost" href="/inventory">Налични автомобили</a>
								<a class="daynight-dashboard-header__user" href="/admin/settings">
									<img class="avatar" src="/assets/images/dashboard/dashbroard_avatar.png" alt="">
									<span>Клиентски профил</span>
								</a>
								<a class="daynight-dashboard-header__cta" href="/admin/listings/new">
									<span aria-hidden="true">+</span>
									${escapeHtml(daynightAccount.newListingCta)}
								</a>
							</div>
						</div>
					</div>
				</header>`;
}

function replaceDashboardAccountHeader(html: string, templateFile: string) {
	if (!dashboardTemplateFiles.has(templateFile)) {
		return html;
	}

	return html.replace(
		/<header class="header bg-white" id="header_main">[\s\S]*?<\/header>/,
		renderDashboardAccountHeader(templateFile)
	);
}

function replaceTemplateFileLinks(html: string) {
	const firstVehicleRoute = `/inventory/${daynightVehicles[0]?.slug ?? 'bmw-i7-2023-full-maxx'}`;
	let output = html;

	for (const [file, route] of Object.entries(selectedTemplateFileToRoute)) {
		const replacementRoute = file.startsWith('listing-details-') ? firstVehicleRoute : route;
		const pattern = new RegExp(`href=(["'])(?:/)?${escapeRegExp(file)}(?:\\?[^"']*)?\\1`, 'g');
		output = output.replace(
			pattern,
			(_match, quote: string) => `href=${quote}${replacementRoute}${quote}`
		);
	}

	output = output.replace(
		/href=(["'])(?:\/)?(?:index|home-\d+)\.html(?:\?[^"']*)?\1/g,
		(_match, quote: string) => `href=${quote}/${quote}`
	);

	return output;
}

function restoreTemplateAssetPaths(html: string) {
	return html
		.replaceAll(
			'/assets/images/dashboard/Моят профил.svg',
			'/assets/images/dashboard/Dashboard.svg'
		)
		.replaceAll(
			'/assets/images/dashboard/MyАвтомобили.svg',
			'/assets/images/dashboard/MyListing.svg'
		)
		.replaceAll(
			'/assets/images/dashboard/AddАвтомобили.svg',
			'/assets/images/dashboard/AddListing.svg'
		)
		.replaceAll(
			'/assets/images/dashboard/MyМоите отзиви.svg',
			'/assets/images/dashboard/MyReviews.svg'
		)
		.replaceAll('/assets/images/dashboard/Запитвания.svg', '/assets/images/dashboard/Messages.svg')
		.replaceAll('/assets/images/dashboard/Съобщения.svg', '/assets/images/dashboard/Messages.svg')
		.replaceAll('/assets/images/dashboard/Изход.svg', '/assets/images/dashboard/Logout.svg')
		.replaceAll('/assets/icons/X-Бял.svg', '/assets/icons/X-White.svg')
		.replaceAll(
			'/assets/images/dashboard/Сигурност на профила.svg',
			'/assets/images/dashboard/ChangePassword.svg'
		);
}

const daynightBrandsInStock = new Set(daynightVehicles.map((vehicle) => vehicle.brand)).size;

function replaceSharedVehicleSnippets(html: string) {
	const first = daynightVehicles[0];
	const second = daynightVehicles[1] ?? first;
	const third = daynightVehicles[2] ?? first;
	const fourth = daynightVehicles[3] ?? first;
	const fifth = daynightVehicles[4] ?? first;

	if (!first) return html;

	return (
		html
			.replaceAll('Audi A6 Avant E-Tron', first.title)
			.replaceAll('2024 Hyundai Elantra', second.title)
			.replaceAll('Kia EV9 2024', third.title)
			.replaceAll('Chevrolet Camaro 2020', fourth.title)
			.replaceAll('Audi R8', fifth.title)
			// NOTE: bare-brand swaps (e.g. .replaceAll('Audi', first.brand)) were removed.
			// They rewrote EVERY occurrence of these brand names across the whole document,
			// corrupting real inventory cards — e.g. the genuine "Audi Q7" became "Chrysler Q7"
			// on the homepage. The full demo-title swaps above already localize the demo cars;
			// real brand names (Audi/Hyundai/Kia/Chevrolet) are valid DayNight brands and must stay.
			.replaceAll('$44.900,00', first.priceEur)
			.replaceAll('$40.900,00', second.priceEur)
			.replaceAll('$42.800,00', second.priceEur)
			.replaceAll('$45.500,00', third.priceEur)
			.replaceAll('$35.500,00', fourth.priceEur)
			.replaceAll('$45.500', fifth.priceEur)
			.replaceAll('32500 miles', first.mileage)
			.replaceAll('89300 miles', second.mileage)
			.replaceAll('76400 miles', third.mileage)
			.replaceAll('45800 miles', fourth.mileage)
			.replaceAll('97200 miles', fifth.mileage)
			.replace(/\bEV\b/g, first.fuel)
			.replaceAll('Manual', first.transmission)
			.replaceAll(
				'How the adventure ended will be seen soon. Aouda was anxious...',
				first.conditionLine
			)
			.replaceAll('/assets/images/card/card-1.jpg', first.image)
			.replaceAll('/assets/images/card/card-2.png', second.image)
			.replaceAll('/assets/images/card/card-3.png', third.image)
			.replaceAll('/assets/images/card/card-4.jpg', fourth.image)
			.replaceAll('/assets/images/card/card-5.jpg', fifth.image)
			// Localize the demo "similar cars" strip chrome that survives on template pages.
			.replaceAll('See Finance', 'Виж вноска')
			.replaceAll('View details', 'Виж детайли')
			.replaceAll('>Auto<', '>Автоматик<')
			.replaceAll('Benzin', 'Бензин')
			.replace(/\$(\d[\d.,]*)\s*\/mo/g, (_match, amount) => `${amount} лв./мес.`)
			.replace(/(\d[\d ,]*)\s*miles\b/g, (_match, amount) => `${amount.trim()} км`)
	);
}

function replacePresentationFooter(html: string) {
	return html.replace(
		/<footer class="bg-primary footer">[\s\S]*?<\/footer>/,
		renderPresentationFooter()
	);
}

function replaceSharedCounterMetrics(html: string) {
	return html
		.replace(
			/(<span class="count-number[^"]*"[^>]*data-to=")18("[^>]*>)18(<\/span>)K\+/,
			(_match, before, after, close) =>
				`${before}${daynightVehicles.length}${after}${daynightVehicles.length}${close}+`
		)
		.replace(
			/(<span class="count-number[^"]*"[^>]*data-to=")8("[^>]*>)8(<\/span>)k\+/,
			(_match, before, after, close) => `${before}2019${after}2019${close}`
		)
		.replace(
			/(<span class="count-number[^"]*"[^>]*data-to=")4\.5("[^>]*>)4,5(<\/span>)k\+/,
			(_match, before, after, close) =>
				`${before}${daynightBrandsInStock}${after.replace('data-decimals="1"', 'data-decimals="0"')}${daynightBrandsInStock}${close}`
		)
		.replace(
			/(<span class="count-number[^"]*"[^>]*data-to=")3\.5("[^>]*>)3,5(<\/span>)k\+/,
			(_match, before, after, close) => `${before}100${after}100${close}%`
		)
		.replace(
			/<p class="font-weight-500 text-muted h7 text-center">Автомобили от обяви<\/p>/,
			'<p class="font-weight-500 text-muted h7 text-center">съдействие по документи</p>'
		);
}

function removeInventoryBreadcrumb(html: string, templateFile: string) {
	if (templateFile !== 'listing-grid4-columns.html') {
		return html;
	}

	return html.replace(/\s*<!-- breadcrumb -->[\s\S]*?<!-- breadcrumb -->\s*/, '\n');
}

function replaceInventoryTitleWithQuickFilters(html: string, templateFile: string) {
	if (templateFile !== 'listing-grid4-columns.html') {
		return html;
	}

	const withoutTemplateTitle = html.replace(
		/<div class="container">\s*<h2>Listing Grid 4 Columns<\/h2>\s*<\/div>\s*/,
		''
	);

	const output = withoutTemplateTitle
		.replace(
			'<div class="tf-spacing-style3"></div>',
			'<div class="tf-spacing-style3 daynight-inventory-top-spacer"></div>'
		)
		.replace(
			'<div class="container mb-40 flat-tabs"',
			'<div class="container mb-40 flat-tabs daynight-inventory-listings-shell"'
		);

	const spacerInsertPoint = '<div class="tf-spacing-style3 daynight-inventory-top-spacer"></div>';
	if (output.includes(spacerInsertPoint)) {
		return output.replace(
			spacerInsertPoint,
			`${spacerInsertPoint}

			<div class="container mb-32 flat-tabs daynight-inventory-controls-shell">
				<div class="row">
					${renderInventoryQuickFilters()}
				</div>
			</div>`
		);
	}

	return html.replace(
		/<div class="container">\s*<h2>Listing Grid 4 Columns<\/h2>\s*<\/div>/,
		`<div class="container">${renderInventoryQuickFilters()}</div>`
	);
}

function replaceInventoryCopy(html: string, templateFile: string) {
	const first = daynightVehicles[0];

	if (!first) return html;

	const output = replaceInventoryCardCollections(
		replaceSharedVehicleSnippets(
			replaceInventoryTitleWithQuickFilters(
				removeInventoryBreadcrumb(html, templateFile),
				templateFile
			)
		),
		templateFile
	)
		.replaceAll('Filters', 'Филтри')
		.replaceAll('Best Match', 'Най-подходящи')
		.replaceAll('Lowest Price', 'Най-ниска цена')
		.replaceAll('Highest Price', 'Най-висока цена')
		.replaceAll('Lowest Mileage', 'Най-малък пробег')
		.replaceAll('Highest Mileage', 'Най-голям пробег')
		.replaceAll('Nearest Location', 'Най-близо')
		.replaceAll('Best Deal', 'Най-добра оферта')
		.replaceAll('Newest Year', 'Най-нова година')
		.replaceAll('Oldest Year', 'Най-стара година')
		.replaceAll('Newest Listed', 'Най-нови обяви')
		.replaceAll('Oldest Listed', 'Най-стари обяви')
		.replaceAll('Sort Vehicles by', 'Сортиране')
		.replaceAll('27 matches', `${daynightVehicles.length} автомобила`)
		.replaceAll('183 ', `${daynightVehicles.length} `)
		.replaceAll(' matches', ' автомобила')
		.replaceAll('No accidents', 'Без удари')
		.replaceAll('Great Price', 'Добра цена')
		.replaceAll('Black', 'Черен')
		.replaceAll('White', 'Бял')
		.replaceAll('Gray', 'Сив')
		.replaceAll('Red', 'Червен')
		.replaceAll('Blue', 'Син')
		.replaceAll('REMOVE ALL', 'Изчисти')
		.replaceAll('Remove All', 'Изчисти')
		.replaceAll('Special', 'Специално')
		.replaceAll('Compare', 'Сравни')
		.replaceAll('View details', 'Виж детайли')
		.replaceAll('See Finance', 'Финансиране')
		.replaceAll(
			'How the adventure ended will be seen soon. Aouda was anxious...',
			first.conditionLine
		)
		.replaceAll('Price & Payment', 'Цена и плащане')
		.replaceAll('Full Price', 'Пълна цена')
		.replaceAll('Monthly', 'Месечно')
		.replaceAll('Min price', 'Минимална цена')
		.replaceAll('Max price', 'Максимална цена')
		.replaceAll('Body Style', 'Купе')
		.replaceAll('Sedan', 'Седан')
		.replaceAll('SUV', 'SUV')
		.replaceAll('Hatchback', 'Хечбек')
		.replaceAll('Fuel Type', 'Гориво')
		.replaceAll('Electrical', 'Електрически')
		.replaceAll('Petrol', 'Бензин')
		.replaceAll('Diesel', 'Дизел')
		.replaceAll('Transmission', 'Скорости')
		.replaceAll('Automatic', 'Автоматик')
		.replaceAll('Manual', 'Ръчни')
		.replaceAll('Door count', 'Брой врати')
		.replaceAll('4 doors', '4 врати')
		.replaceAll('3 doors', '3 врати')
		.replaceAll('Cylinders', 'Цилиндри')
		.replaceAll('4 cylinders', '4 цилиндъра')
		.replaceAll('6 cylinders', '6 цилиндъра')
		.replaceAll('8 cylinders', '8 цилиндъра')
		.replaceAll('Exterior color', 'Външен цвят')
		.replaceAll('Interior color', 'Интериорен цвят')
		.replaceAll('Features', 'Екстри')
		.replaceAll('Adaptive Control', 'Адаптивен контрол')
		.replaceAll('Apple CarPlay', 'Apple CarPlay')
		.replaceAll('Alloy Wheels', 'Алуминиеви джанти')
		.replaceAll('Brake Assist', 'Асистент при спиране')
		.replaceAll('Tow Hitch', 'Теглич')
		.replaceAll('Autopilot', 'Асистенти за шофиране')
		.replaceAll('Android Auto', 'Android Auto')
		.replaceAll('Moonroof', 'Панорамен покрив')
		.replaceAll('Show 1,029 Matches', 'Виж наличните автомобили')
		.replaceAll('Mileage:', 'Пробег:')
		.replaceAll('Years:', 'Година:')
		.replaceAll('Fuel:', 'Гориво:')
		.replaceAll('Color:', 'Цвят:')
		.replaceAll('Location:', 'Локация:')
		.replaceAll('Interior:', 'Интериор:')
		.replaceAll('Engine:', 'Двигател:')
		.replaceAll('VIN:', 'Реф. номер:')
		.replaceAll('Stock Number:', 'Вътрешен номер:')
		.replaceAll('Tampa, FL', 'Варна')
		.replaceAll('Listing GridStyle Half Map', 'Карта на наличните автомобили')
		.replaceAll('Listing GridStyle HalfMap', 'Карта на наличните автомобили')
		.replaceAll('Grid Style Half Map', 'Карта на наличните автомобили')
		.replaceAll('Автомобили GridStyle Half Map', 'Карта на наличните автомобили')
		.replaceAll('Автомобили GridStyle HalfMap', 'Карта на наличните автомобили')
		.replaceAll('Listing Grid 4 Columns', 'Автомобили в наличност')
		.replaceAll('Автомобили Grid 4 Columns', 'Налични автомобили')
		.replaceAll('Showing 1 – 30 of 118 Listings', `Показани ${daynightVehicles.length} автомобила`)
		.replaceAll(
			'Showing 1 – 30 of 118 Автомобилиs',
			`Показани ${daynightVehicles.length} автомобила`
		);

	return templateFile === 'listing-gridstyle-halfmap.html'
		? output.replace(
				`<p class="md-hidden">Показани ${daynightVehicles.length} автомобила</p>`,
				`<p class="md-hidden">Карта на наличните автомобили · ${daynightVehicles.length} автомобила</p>`
			)
		: output;
}

function replaceMapModeEmbed(html: string, templateFile: string) {
	if (templateFile !== 'listing-gridstyle-halfmap.html') {
		return html;
	}

	const mapEmbed = `<div id="map" data-map-zoom="16" data-map-scroll="true"><iframe title="Карта до Приселци Варна" data-map-src="${daynightMapEmbedSrc}" data-daynight-scroll-map width="100%" height="100%" style="border:0;display:block;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;

	return html
		.replace(/<div id="map" data-map-zoom="16" data-map-scroll="true"><\/div>/, mapEmbed)
		.replace(
			/\s*<script src="https:\/\/maps\.googleapis\.com\/maps\/api\/js\?key=[^"]+"><\/script>/,
			''
		)
		.replace(/\s*<script src="\/assets\/js\/maps\.js"><\/script>/, '')
		.replace(/\s*<script src="\/assets\/js\/marker\.js"><\/script>/, '')
		.replace(/\s*<script src="\/assets\/js\/infobox\.min\.js"><\/script>/, '');
}

type HtmlRange = {
	start: number;
	end: number;
};

function findContainingSection(html: string, marker: string, fromIndex = 0): HtmlRange | undefined {
	const markerIndex = html.indexOf(marker, fromIndex);
	if (markerIndex === -1) return undefined;

	const start = html.lastIndexOf('<section', markerIndex);
	if (start === -1) return undefined;

	const sectionTagPattern = /<\/?section\b[^>]*>/gi;
	sectionTagPattern.lastIndex = start;

	let depth = 0;
	let match: RegExpExecArray | null;
	while ((match = sectionTagPattern.exec(html)) !== null) {
		depth += match[0].startsWith('</') ? -1 : 1;

		if (depth === 0) {
			return {
				start,
				end: sectionTagPattern.lastIndex
			};
		}
	}

	return undefined;
}

function addSectionClass(sectionHtml: string, className: string) {
	return sectionHtml.replace(/<section class="([^"]*)"/, `<section class="$1 ${className}"`);
}

function replaceSectionByMarker(html: string, marker: string, replacement: string) {
	const section = findContainingSection(html, marker);
	if (!section) return html;

	return html.slice(0, section.start) + replacement + html.slice(section.end);
}

const supportReviews = [
	{
		name: 'Клиент от Варна',
		label: 'Покупка и документи',
		text: 'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск.'
	},
	{
		name: 'Клиент на Приселци',
		label: 'Финансиране',
		text: 'Екипът ми помогна да сравня няколко автомобила и да планирам бюджета с вариант за разсрочено плащане.'
	},
	{
		name: 'Клиент от региона',
		label: 'Оглед и бартер',
		text: 'Автомобилът беше представен коректно, а условията за бартер и регистрация бяха казани предварително.'
	}
] as const;

function getCompareVehicles(limit = 3) {
	const selected: typeof daynightVehicles = [];
	const seenBrands = new Set<string>();

	for (const vehicle of featuredDayNightVehicles) {
		if (seenBrands.has(vehicle.brand)) continue;

		selected.push(vehicle);
		seenBrands.add(vehicle.brand);

		if (selected.length === limit) {
			return selected;
		}
	}

	return selected.concat(
		featuredDayNightVehicles
			.filter(
				(vehicle) => !selected.some((selectedVehicle) => selectedVehicle.slug === vehicle.slug)
			)
			.slice(0, limit - selected.length)
	);
}

function renderCompareVehicleCell(vehicle: (typeof daynightVehicles)[number]) {
	const href = `/inventory/${vehicle.slug}`;

	return `<td>
								<div class="relative top">
									<a href="${href}" aria-label="Виж ${escapeHtml(vehicle.shortTitle)}">
										<img class="mb-10 radius-16 image" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.shortTitle)}" loading="lazy">
									</a>
									<p class="h4 text-center"><a href="${href}">${escapeHtml(vehicle.shortTitle)}</a></p>
									<p class="text-secondary text-center">${escapeHtml(vehicle.priceEur)}</p>
								</div>
							</td>`;
}

function renderCompareSpecRow(icon: string, label: string, values: string[]) {
	return `<tr>
							<td>
								<div class="flex items-center gap-8">
									<img src="/assets/icons/${icon}.svg" alt="" aria-hidden="true">
									<span>${escapeHtml(label)}:</span>
								</div>
							</td>
							${values.map((value) => `<td>${escapeHtml(value)}</td>`).join('\n\t\t\t\t\t\t\t')}
						</tr>`;
}

function renderCompareVehicleTable() {
	const vehicles = getCompareVehicles();

	return `<table class="card-details--table">
						<tr>
							<td></td>
							${vehicles.map(renderCompareVehicleCell).join('\n\t\t\t\t\t\t\t')}
						</tr>
						${[
							renderCompareSpecRow(
								'mileage',
								'Пробег',
								vehicles.map((vehicle) => vehicle.mileage)
							),
							renderCompareSpecRow(
								'years',
								'Година',
								vehicles.map((vehicle) => String(vehicle.year))
							),
							renderCompareSpecRow(
								'fuel',
								'Гориво',
								vehicles.map((vehicle) => vehicle.fuel)
							),
							renderCompareSpecRow(
								'transmission',
								'Скоростна кутия',
								vehicles.map((vehicle) => vehicle.transmission)
							),
							renderCompareSpecRow(
								'auto',
								'Купе',
								vehicles.map((vehicle) => vehicle.body)
							),
							renderCompareSpecRow(
								'engine',
								'Двигател',
								vehicles.map((vehicle) => vehicle.engine)
							),
							renderCompareSpecRow(
								'icon-gauge',
								'Мощност',
								vehicles.map((vehicle) => vehicle.power)
							),
							renderCompareSpecRow(
								'color',
								'Цвят',
								vehicles.map((vehicle) => vehicle.color)
							),
							renderCompareSpecRow(
								'location',
								'Локация',
								vehicles.map(() => daynightSite.location)
							),
							renderCompareSpecRow(
								'QrCode',
								'Реф. номер',
								vehicles.map((vehicle) => vehicle.lot)
							)
						].join('\n')}
					</table>`;
}

function replaceCompareVehicleTable(html: string) {
	return replaceDivInnerByExactClass(html, 'card-details', renderCompareVehicleTable());
}

function renderReviewStars() {
	return Array.from(
		{ length: 5 },
		() => '<img src="/assets/icons/star-6.svg" alt="" aria-hidden="true">'
	).join('');
}

function renderSupportReviewsSection() {
	return `<section class="daynight-support-reviews">
	<div class="container">
		<div class="title-section mb-30">
			<h2>Отзиви от клиенти</h2>
			<a href="/reviews" class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">Виж всички</a>
		</div>
		<div class="daynight-review-grid">
			${supportReviews
				.map(
					(review) => `<article class="daynight-review-card">
				<div class="daynight-review-card__stars">${renderReviewStars()}</div>
				<p class="daynight-review-card__text">${escapeHtml(review.text)}</p>
				<div class="daynight-review-card__person">
					<strong>${escapeHtml(review.name)}</strong>
					<span>${escapeHtml(review.label)}</span>
				</div>
			</article>`
				)
				.join('\n')}
		</div>
	</div>
</section>`;
}

function renderAboutShowroomSection() {
	return `<section class="daynight-about-location-section">
	<div class="container">
		<div class="daynight-about-location">
			<div class="daynight-about-location__content">
				<p class="eyebrow">Шоурум в Варна</p>
				<h2>Автомобили с ясна история и подреден процес</h2>
				<p class="text-secondary h7 line-height-28">Приселци предлага внимателно подбрани автомобили с реална наличност, съдействие при оглед, документи, регистрация, финансиране и бартер.</p>
				<ul class="daynight-about-location__list">
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Огледи на място и в доверен сервиз</li>
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Съдействие за документи, регистрация и финансиране</li>
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Бартер, оценка и търсене по задание</li>
				</ul>
				<div class="daynight-about-location__actions">
					<a href="/inventory" class="btn btn-primary btn-large font-weight-600">Виж автомобили</a>
					<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="btn btn-line btn-large font-weight-600">Виж локация</a>
				</div>
			</div>
			<div class="daynight-about-location__visual">
				<div class="daynight-about-location__images">
					<img src="${daynightPageAssets.aboutShowroomVehicle}" alt="Шоурум на Приселци">
					<img src="${daynightPageAssets.aboutConsultation}" alt="Консултация със Приселци">
				</div>
				<div class="daynight-about-location__map">${buildDayNightMapIframe('260')}</div>
			</div>
		</div>
	</div>
</section>`;
}

function polishAboutPageStructure(html: string) {
	let output = replaceSectionByMarker(
		html,
		'about-content',
		`${renderAboutShowroomSection()}\n${renderSupportReviewsSection()}`
	);
	output = replaceSectionByMarker(output, 'why-choose-us style2 style3', '');

	return output;
}

function polishServicesPageStructure(html: string) {
	let output = replaceSectionByMarker(html, 'Как съдействаме', '');
	output = replaceSectionByMarker(output, 'Изберете автомобил с подкрепа от Приселци', '');

	return output;
}

function promoteContactContentBeforeMap(html: string) {
	const mapSection = findContainingSection(html, 'widget-gg-map flex radius-8 overflow-hidden');
	if (!mapSection) return html;

	const contactSection = findContainingSection(html, 'container contact-page', mapSection.end);
	if (!contactSection || contactSection.start < mapSection.end) return html;

	// The raw template puts a lazy third-party map iframe first. That preserves the template, but it can
	// paint as a blank 520px block during SvelteKit route transitions, so keep the trusted
	// section markup and move the actual contact content into the first viewport.
	const mapHtml = addSectionClass(
		html.slice(mapSection.start, mapSection.end),
		'daynight-contact-map'
	).replace('loading="lazy"', 'loading="eager"');
	const contactHtml = addSectionClass(
		html.slice(contactSection.start, contactSection.end),
		'daynight-contact-primary'
	);

	return (
		html.slice(0, mapSection.start) +
		contactHtml +
		html.slice(mapSection.end, contactSection.start) +
		mapHtml +
		html.slice(contactSection.end)
	);
}

function replacePdpCopy(html: string, routePath: string) {
	const slug = routePath.split('/').at(-1) ?? '';
	const vehicle = getDayNightVehicleBySlug(slug) ?? daynightVehicles[0];
	const salesTeam = daynightTeam[0];
	const financeMonthly = vehicle.monthly.replace(/^от\s+/i, '');

	if (!vehicle) return html;

	let output = html
		// Replace the whole English marketing paragraph first, before the title/brand/year
		// swaps below mutate its inner words (which is why the old exact-string match failed).
		.replace(/The 2024 - 2025 Honda HR-V is offered[\s\S]*?RM 141,900\./, () => vehicle.description)
		.replaceAll('Audi A6 Avant e-tron', vehicle.title)
		.replaceAll('Audi A6 Avant E-Tron', vehicle.title)
		.replaceAll('BMW I7', vehicle.title)
		.replaceAll('$245/mo', `${vehicle.priceEur} ${vehicle.monthly}`)
		.replaceAll('$44.900,00', vehicle.priceEur)
		.replaceAll('$44.900', vehicle.priceEur)
		.replaceAll('51600 km', vehicle.mileage)
		.replaceAll('2022', String(vehicle.year))
		.replaceAll('Benzin + Plin', vehicle.fuel)
		.replaceAll('Tampa, FL', 'Варна')
		.replaceAll('White', vehicle.color)
		.replaceAll('Jet Black', 'Тъмен салон')
		.replaceAll('1.5L Inline', vehicle.engine)
		.replaceAll('Automatic', vehicle.transmission)
		.replace('1G1ZD5ST0PF', 'предоставя се при оглед')
		.replaceAll('1G1ZD5ST0PF', vehicle.lot)
		.replaceAll('165921', vehicle.lot)
		.replaceAll('Mike Hanley', salesTeam?.name ?? 'Приселци')
		.replaceAll('Verified Dealer', 'Проверена автокъща')
		.replaceAll('/assets/images/pages/sale-agent-9.jpg', salesTeam?.image ?? daynightSite.logoDark)
		.replaceAll('Get Directions', 'Виж локация')
		.replaceAll('Call To Dealer', daynightSite.phoneCta)
		.replaceAll('Send Inquiry About Vehicle', 'Изпрати запитване за автомобила')
		.replaceAll('Honda HR-V', vehicle.shortTitle)
		.replaceAll('RM 115,900', vehicle.priceEur)
		.replaceAll('RM 141,900', vehicle.priceBgn)
		.replaceAll(
			'/assets/images/inner-page/slide-listing-details-5.jpg',
			vehicle.gallery[0] ?? vehicle.image
		)
		.replaceAll(
			'/assets/images/inner-page/slide-listing-details-6.jpg',
			vehicle.gallery[1] ?? vehicle.image
		)
		.replaceAll(
			'/assets/images/inner-page/slide-listing-details-7.jpg',
			vehicle.gallery[2] ?? vehicle.image
		)
		.replaceAll('How the adventure ended will be seen soon.', vehicle.description)
		.replaceAll(
			'The 2024 - 2025 Honda HR-V is offered in 4 variants - which are priced from RM 115,900 to RM 141,900, the base model of hr-v is 2023 Honda HR-V 1.5 S which is at a price of RM 115,900 and the top variant of Honda HR-V is 2023 Honda HR-V RS e:HEV which is offered at a price of RM 141,900.',
			vehicle.description
		)
		// --- DayNight: localize the remaining template PDP chrome (labels, tabs, calculator, form) ---
		// Cash / Finance tabs
		.replaceAll('<li>Cash</li>', '<li>В брой</li>')
		.replaceAll('<li class="active">Finance</li>', '<li class="active">Финансиране</li>')
		// Price block
		.replaceAll('Price:', 'Цена:')
		.replaceAll('List price w/o taxes, fees, and accessories', 'Цена без данъци и такси')
		.replaceAll('Finance payment w/o taxes, fees, and accessories', 'Вноска без данъци и такси')
		.replaceAll(
			'$1,560 due at signing · 72 mo · 7.89% APR',
			'Първоначална вноска · 72 мес. · 7.89% ГПР'
		)
		.replaceAll('Special tax on motor vehicles:', 'Данък върху МПС:')
		.replaceAll('Price with special tax:', 'Цена с данък:')
		.replaceAll('Vehicle in the VAT system', 'Автомобил по ДДС')
		// Car overview
		.replaceAll('Car Overview', 'Преглед на автомобила')
		.replaceAll('Mileage:', 'Пробег:')
		.replaceAll('Years:', 'Година:')
		.replaceAll('Fuel:', 'Гориво:')
		.replaceAll('Color:', 'Цвят:')
		.replaceAll('Location:', 'Локация:')
		.replaceAll('Interior:', 'Интериор:')
		.replaceAll('Engine:', 'Двигател:')
		.replaceAll('Transmission:', 'Скоростна кутия:')
		.replaceAll('Stock Number:', 'Референтен №:')
		// Description + spec tabs
		.replaceAll('<p class="h4 mb-16">Description</p>', '<p class="h4 mb-16">Описание</p>')
		.replaceAll('Get To Know this car', 'Опознайте автомобила')
		.replaceAll('>Exterior</span>', '>Екстериор</span>')
		.replaceAll('>Interior</span>', '>Интериор</span>')
		.replaceAll('>Safety</span>', '>Безопасност</span>')
		.replaceAll('>Mechanical</span>', '>Механика</span>')
		.replaceAll('>Technology</span>', '>Технологии</span>')
		.replaceAll('>Other</span>', '>Други</span>')
		// Feature lists (default visible tab)
		.replaceAll('Child Safety Locks', 'Защита за деца')
		.replaceAll('Dual front impact airbags', 'Челни въздушни възглавници')
		.replaceAll('Daytime Running Lights', 'Дневни светлини')
		.replaceAll('Panic alarm', 'Паник аларма')
		.replaceAll('Driver Air Bag', 'Въздушна възглавница за водача')
		.replaceAll('Passenger Air Bag', 'Въздушна възглавница за пътника')
		.replaceAll('Security System', 'Система за сигурност')
		.replaceAll('Security system', 'Система за сигурност')
		// Financing calculator
		.replaceAll('Financing Calculator', 'Калкулатор за финансиране')
		.replaceAll('Car Price', 'Цена на автомобила')
		.replaceAll('Interest Rate', 'Лихвен процент')
		.replaceAll('Loan Term (months)', 'Срок (месеци)')
		.replaceAll('Down Payment', 'Първоначална вноска')
		.replaceAll('>Calculate</button>', '>Изчисли</button>')
		.replaceAll('Monthly Payment:', 'Месечна вноска:')
		.replaceAll('Total Interest Payment:', 'Лихва и такси:')
		.replaceAll('Est. Total Loan:', 'Ориентировъчна цена:')
		.replaceAll('60 months', '60 месеца')
		.replaceAll('30 months', '30 месеца')
		.replaceAll('10 months', '10 месеца')
		.replaceAll('$46.300|', vehicle.priceEur)
		.replaceAll('value="$400"', 'value="по оферта"')
		.replaceAll('$788.56/Month', financeMonthly)
		.replaceAll('$1413.60', 'уточняват се')
		.replaceAll('$47713.60', vehicle.priceBgn)
		.replaceAll('$23.577', vehicle.priceBgn)
		.replaceAll('$1.322', 'уточняват се')
		.replaceAll('$24.900', vehicle.priceBgn)
		// Inquiry form
		.replaceAll('Send Inquiry about Vehicle', 'Запитване за автомобила')
		.replaceAll('>Name</p>', '>Име</p>')
		.replaceAll('>Email</p>', '>Имейл</p>')
		.replaceAll('>Phone</p>', '>Телефон</p>')
		.replaceAll('>Subject</p>', '>Тема</p>')
		.replaceAll('>Message</p>', '>Съобщение</p>')
		.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Вашето име"')
		.replaceAll('placeholder="Phone (optional)"', 'placeholder="Телефон (по избор)"')
		.replaceAll("This Vehicle's Availability 2", 'Цена и оглед')
		.replaceAll("This Vehicle's Availability 3", 'Финансиране')
		.replaceAll("This Vehicle's Availability", 'Наличност на автомобила')
		.replaceAll('placeholder="Comment"', 'placeholder="Вашето съобщение"')
		.replaceAll('Send Inquiry', 'Изпрати запитване')
		.replaceAll(
			'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			'Да, искам да получавам известия за цената и полезна информация за този автомобил.'
		)
		.replaceAll('By using this service, you accept our', 'Използвайки услугата, приемате нашето')
		.replaceAll('Visitor Agreement.', 'Споразумение с потребителите.')
		.replaceAll('Play Video', 'Видео преглед')
		.replaceAll('View All Photo', 'Виж всички снимки')
		.replaceAll('View All Photos', 'Виж всички снимки')
		.replaceAll('Write A Review', 'Добавете отзив')
		.replaceAll('Write a review', 'Добавете отзив')
		.replaceAll('Login To Add A Review', 'Вход за добавяне на отзив')
		.replaceAll('Login to add a Review', 'Вход за добавяне на отзив')
		.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
		.replaceAll('View more reviews', daynightSite.reviewLinkLabel)
		.replaceAll('Customer Reviews', 'Отзиви от клиенти')
		.replaceAll('Add A Review', 'Добавете отзив')
		.replaceAll('Add a review', 'Добавете отзив')
		.replaceAll('Chat via WhatsApp', 'Viber / WhatsApp')
		.replaceAll('Prev', 'ПРЕДИШНА')
		.replaceAll('Next', 'СЛЕДВАЩА')
		.replaceAll('alt="play"', 'alt="" aria-hidden="true"')
		.replaceAll('alt="listing-details"', `alt="${escapeHtml(vehicle.shortTitle)}"`)
		.replaceAll(
			`<h2 class="capitalize">${escapeHtml(vehicle.title)}</h2>`,
			`<h1 class="daynight-pdp-title">${escapeHtml(vehicle.title)}</h1>`
		);

	output = replaceWidgetMapByClass(
		output,
		'widget-gg-map flex radius-8 overflow-hidden mb-28',
		'520px'
	);
	output = output.replace(
		/<iframe\b(?=[^>]*google\.com\/maps\/embed\?pb=)[\s\S]*?<\/iframe>/i,
		buildDayNightMapIframe('520px')
	);

	return output;
}

function blogArticleRoute(article: DayNightArticle) {
	return `/blog/${article.slug}`;
}

const blogCategories = ['Новини', 'Съвети', 'Финансиране', 'Документи', 'Марки'] as const;

function formatArticleDate(value: string) {
	return new Intl.DateTimeFormat('bg-BG', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(`${value}T00:00:00+02:00`));
}

function renderArticleMeta(article: DayNightArticle, textClass = 'text-sm') {
	const categoryClass = `${textClass} text-highlight uppercase text-underline`;

	return `<div class="flex gap-12 justify-start mb-12">
		<span class="${textClass}">от ${escapeHtml(article.author)}</span>
		<span class="${textClass}">${escapeHtml(formatArticleDate(article.date))}</span>
		<span class="${categoryClass}">${escapeHtml(article.category)}</span>
	</div>`;
}

function renderFeaturedArticleMeta(article: DayNightArticle) {
	return `<div class="flex gap-12 justify-start mb-2">
		<span class="text-white text-xs">от ${escapeHtml(article.author)}</span>
		<span class="text-white text-xs">${escapeHtml(formatArticleDate(article.date))}</span>
		<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(article.category)}</span>
	</div>`;
}

function articleArchiveValue(article: DayNightArticle) {
	return article.date.slice(0, 7);
}

function formatArticleArchive(value: string) {
	return new Intl.DateTimeFormat('bg-BG', {
		month: 'long',
		year: 'numeric'
	}).format(new Date(`${value}-01T00:00:00+02:00`));
}

function renderArticleDataAttributes(article: DayNightArticle) {
	const haystack = [
		article.title,
		article.description,
		article.category,
		article.kind,
		article.author,
		...article.tags,
		...article.body
	].join(' ');

	return [
		'data-daynight-article-card',
		`data-daynight-article-kind="${escapeHtml(article.kind)}"`,
		`data-daynight-title="${escapeHtml(article.title)}"`,
		`data-daynight-category="${escapeHtml(article.category)}"`,
		`data-daynight-tags="${escapeHtml(article.tags.join(' '))}"`,
		`data-daynight-archive="${escapeHtml(articleArchiveValue(article))}"`,
		`data-daynight-haystack="${escapeHtml(haystack)}"`
	].join(' ');
}

function renderBlogFeaturedCard(article: DayNightArticle) {
	return `<a href="${blogArticleRoute(article)}" class="post-style-2 overflow-hidden mb-40" ${renderArticleDataAttributes(article)}>
	<img class="post--img flex" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}">
	<div class="content">
		<p class="h3 text-white mb-8 capitalize">${escapeHtml(article.title)}</p>
		${renderFeaturedArticleMeta(article)}
	</div>
</a>`;
}

function renderBlogIndexCard(article: DayNightArticle) {
	return `<a href="${blogArticleRoute(article)}" class="post-style-6 overflow-hidden" ${renderArticleDataAttributes(article)}>
	<div class="image">
		<img class="post--img flex" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}">
	</div>
	<div class="content">
		${renderArticleMeta(article)}
		<p class="h4 title mb-12">${escapeHtml(article.title)}</p>
		<p class="clamp clamp-2 text-secondary">${escapeHtml(article.description)}</p>
	</div>
</a>`;
}

function countBlogCategory(category: string, articles: DayNightArticle[]) {
	return category === 'Всички'
		? articles.length
		: articles.filter((article) => article.category === category).length;
}

function renderBlogFilterHref(name: 'category' | 'tag' | 'archive' | 'all', value = '') {
	if (name === 'all' || !value) {
		return '/blog';
	}

	const params = new URLSearchParams([[name, value]]);
	return `/blog?${params.toString()}`;
}

function renderBlogSidebarLink(
	name: 'category' | 'tag' | 'archive' | 'all',
	value: string,
	label: string,
	count?: number,
	active = false
) {
	return `<a href="${renderBlogFilterHref(name, value)}" class="${active ? 'active' : ''}" data-daynight-blog-filter-link data-filter-name="${name}" data-filter-value="${escapeHtml(value)}">
	<span class="label">${escapeHtml(label)}</span>${typeof count === 'number' ? `\n\t<span>(${count})</span>` : ''}
</a>`;
}

function renderBlogSearchIcon() {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<g clip-path="url(#clip0_daynight_blog_search)">
			<path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M15.8047 15.8047L21.0012 21.0012" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</g>
	</svg>`;
}

function renderBlogSidebarSearch() {
	return `<form action="/blog" class="widget-search w-full mb-34" data-daynight-blog-search-form>
	<input class="input-normal" type="search" name="q" id="blog-search" placeholder="Търсене в новини..." data-daynight-blog-search />
	<button type="submit" class="widget-search-btn" aria-label="Търси">${renderBlogSearchIcon()}</button>
</form>`;
}

function renderBlogCategoriesWidget(articles: DayNightArticle[]) {
	const links = [
		`<li>${renderBlogSidebarLink('all', '', 'Всички публикации', articles.length, true)}</li>`,
		...blogCategories
			.map((category) => ({ category, count: countBlogCategory(category, articles) }))
			.filter(({ count }) => count > 0)
			.map(
				({ category, count }) =>
					`<li>${renderBlogSidebarLink('category', category, category, count)}</li>`
			)
	].join('\n');

	return `<p class="h4 mb-16">Категории</p>
<ul class="widget-categories mb-32">
	${links}
</ul>`;
}

function renderBlogRecentMeta(article: DayNightArticle) {
	return `<div class="flex gap-12 md-gap-6 justify-start mb-6">
	<span class="text-xs">от ${escapeHtml(article.author)}</span>
	<span class="text-xs">${escapeHtml(formatArticleDate(article.date))}</span>
	<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(article.category)}</span>
</div>`;
}

function renderBlogRecentPostsWidget(articles: DayNightArticle[]) {
	const posts = articles
		.slice(0, 4)
		.map(
			(
				article,
				index
			) => `<a href="${blogArticleRoute(article)}" class="recent-post overflow-hidden mb-16">
	<div class="image">
		<img class="post--img flex" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}">
	</div>
	<div class="content">
		${renderBlogRecentMeta(article)}
		<p class="title h7">${escapeHtml(article.title)}</p>
	</div>
</a>${index < 3 ? '\n<div class="divider mb-16 w-full"></div>' : ''}`
		)
		.join('\n');

	return `<p class="h4 mb-16 capitalize">Последни публикации</p>
<div class="mb-32">
	${posts}
</div>`;
}

function renderBlogArchiveWidget(articles: DayNightArticle[]) {
	const archiveCounts = articles.reduce<Map<string, number>>((counts, article) => {
		const value = articleArchiveValue(article);
		counts.set(value, (counts.get(value) ?? 0) + 1);
		return counts;
	}, new Map());

	const links = [...archiveCounts.entries()]
		.sort(([first], [second]) => second.localeCompare(first))
		.map(
			([value, count]) =>
				`<li>${renderBlogSidebarLink('archive', value, formatArticleArchive(value), count)}</li>`
		)
		.join('\n');

	return `<p class="h4 mb-16">Архив</p>
<ul class="widget-categories mb-32">
	${links}
</ul>`;
}

function renderBlogTagsWidget(articles: DayNightArticle[]) {
	const tags = [...new Set(articles.flatMap((article) => article.tags))]
		.sort((first, second) => first.localeCompare(second, 'bg-BG'))
		.slice(0, 12)
		.map(
			(tag) => `<li>
	${renderBlogSidebarLink('tag', tag, tag)}
</li>`
		)
		.join('\n');

	return `<p class="h4 mb-16">Тагове</p>
<ul class="widget-tags">
	${tags}
</ul>`;
}

function renderBlogSidebar(articles: DayNightArticle[]) {
	return `${renderBlogSidebarSearch()}
${renderBlogCategoriesWidget(articles)}
<div class="divider mb-32 w-full"></div>
${renderBlogRecentPostsWidget(articles)}
<div class="divider mb-32 w-full"></div>
${renderBlogArchiveWidget(articles)}
<div class="divider mb-32 w-full"></div>
${renderBlogTagsWidget(articles)}`;
}

function renderBlogStandardContent(articles: DayNightArticle[]) {
	const [featured, ...cards] = articles;
	if (!featured) {
		return `<p class="h5 text-secondary mb-40">Очаквайте публикации от Приселци.</p>`;
	}

	return `<div data-daynight-blog-index>
	${renderBlogFeaturedCard(featured)}
	<div class="grid grid-cols-2 md-grid-cols-1 gap-y-40 gap-x-30 mb-40">
		${cards.map((article) => renderBlogIndexCard(article)).join('\n')}
	</div>
	<p class="h5 text-secondary mb-40 daynight-blog-empty" hidden>Няма публикации по избраните филтри.</p>
</div>`;
}

function replaceBlogGridIndexCopy(html: string, articles: DayNightArticle[]) {
	const cards = articles.map((article) => renderBlogIndexCard(article)).join('\n');

	let output = html
		.replaceAll('Blog Grid Style 1', 'Полезно и новини')
		.replaceAll('News', 'Полезно')
		.replaceAll('Home', 'Начало');

	output = replaceDivInnerByExactClass(
		output,
		'grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30 mb-40',
		cards
	);

	return output
		.replaceAll('EXPERT REVIEW', 'СЪВЕТИ')
		.replaceAll('PERFORMANCE', 'СЪВЕТИ')
		.replaceAll('LUXURY', 'МАРКИ')
		.replaceAll('DESIGN', 'ДОКУМЕНТИ')
		.replaceAll('REVIEWS', 'СЪВЕТИ')
		.replaceAll('TREND', 'НОВИНИ')
		.replaceAll('MAINTENANCE', 'СЪВЕТИ')
		.replaceAll('TIPS', 'СЪВЕТИ');
}

function replaceBlogStandardIndexCopy(html: string, articles: DayNightArticle[]) {
	let output = html
		.replaceAll('Blog Standard', 'Полезно и новини')
		.replaceAll('News', 'Полезно')
		.replaceAll('Home', 'Начало');

	output = replaceDivInnerByExactClass(
		output,
		'innerpage__content md-mb-30',
		renderBlogStandardContent(articles)
	);

	return replaceDivInnerByExactClass(output, 'innerpage__sidebar', renderBlogSidebar(articles));
}

function replaceBlogIndexCopy(
	html: string,
	templateFile: string,
	context?: DayNightTemplateContentContext
) {
	const articles = getBlogArticles(context);

	if (templateFile === 'blog-standard.html') {
		return replaceBlogStandardIndexCopy(html, articles);
	}

	return replaceBlogGridIndexCopy(html, articles);
}

function renderBlogDetailIcon(type: 'author' | 'date' | 'category') {
	if (type === 'author') {
		return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M12 12.75C14.0711 12.75 15.75 11.0711 15.75 9C15.75 6.92893 14.0711 5.25 12 5.25C9.92893 5.25 8.25 6.92893 8.25 9C8.25 11.0711 9.92893 12.75 12 12.75Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M4.5 20.25C5.37804 17.2645 8.23025 15 12 15C15.7698 15 18.622 17.2645 19.5 20.25" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>`;
	}

	if (type === 'date') {
		return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M7.5 3V5.25M16.5 3V5.25M3.75 9H20.25M5.25 5.25H18.75C19.5784 5.25 20.25 5.92157 20.25 6.75V18.75C20.25 19.5784 19.5784 20.25 18.75 20.25H5.25C4.42157 20.25 3.75 19.5784 3.75 18.75V6.75C3.75 5.92157 4.42157 5.25 5.25 5.25Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>`;
	}

	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M21 12L16.5 18.75H4.5C3.67157 18.75 3 18.0784 3 17.25V6.75C3 5.92157 3.67157 5.25 4.5 5.25H16.5L21 12Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M15 12H15.01" stroke="#1C1C1C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`;
}

function renderBlogDetailMetaList(article: DayNightArticle) {
	const items = [
		{ type: 'author' as const, label: article.author, href: '/about/daynight-auto-plovdiv' },
		{ type: 'date' as const, label: formatArticleDate(article.date), href: '/blog' },
		{
			type: 'category' as const,
			label: article.category,
			href: renderBlogFilterHref('category', article.category)
		}
	];

	return `<ul class="bloc-details-tag-style-2 mb-40">
	${items
		.map(
			(item) => `<li>
		<a class="h7" href="${item.href}">
			${renderBlogDetailIcon(item.type)}
			${escapeHtml(item.label)}
		</a>
	</li>`
		)
		.join('\n')}
</ul>`;
}

function renderBlogDetailArticleBody(article: DayNightArticle) {
	return article.sections
		.map(
			(section) => `<p class="h4 mb-12">${escapeHtml(section.heading)}</p>
${section.paragraphs
	.map(
		(paragraph) => `<p class="mb-28 text-secondary h7 line-height-28">${escapeHtml(paragraph)}</p>`
	)
	.join('\n')}`
		)
		.join('\n');
}

function renderBlogDetailTags(article: DayNightArticle) {
	return `<ul class="blog-detail-tags flex gap-12">
	<li>
		<p>Тема:</p>
	</li>
	${article.tags
		.slice(0, 3)
		.map(
			(tag) => `<li>
		<a href="${renderBlogFilterHref('tag', tag)}">${escapeHtml(tag)}</a>
	</li>`
		)
		.join('\n')}
</ul>`;
}

function renderBlogSocialIcon(label: 'facebook' | 'x' | 'instagram' | 'mail') {
	if (label === 'facebook') {
		return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M11.65 18V10.7H14.1L14.47 7.85H11.65V6.03C11.65 5.21 11.88 4.65 13.06 4.65H14.56V2.1C14.3 2.07 13.41 2 12.37 2C10.2 2 8.71 3.33 8.71 5.76V7.85H6.25V10.7H8.71V18H11.65Z" fill="#1C1C1C"/>
		</svg>`;
	}

	if (label === 'x') {
		return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8.9 11.21L3.75 16.87M16.25 3.13L11.1 8.79" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>`;
	}

	if (label === 'instagram') {
		return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<rect x="2.75" y="2.75" width="14.5" height="14.5" rx="4.25" stroke="#1C1C1C" stroke-width="1.5"/>
			<circle cx="10" cy="10" r="3.1" stroke="#1C1C1C" stroke-width="1.5"/>
			<circle cx="14.05" cy="5.95" r="0.85" fill="#1C1C1C"/>
		</svg>`;
	}

	return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M3.125 5.625L8.94 9.5C9.58 9.93 10.42 9.93 11.06 9.5L16.875 5.625" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M3.75 4.375H16.25C16.94 4.375 17.5 4.935 17.5 5.625V14.375C17.5 15.065 16.94 15.625 16.25 15.625H3.75C3.06 15.625 2.5 15.065 2.5 14.375V5.625C2.5 4.935 3.06 4.375 3.75 4.375Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`;
}

function renderBlogDetailSocialList(article: DayNightArticle) {
	const shareText = encodeURIComponent(article.title);
	const shareUrl = encodeURIComponent(`https://priselci.mobile.bg/)}`);

	return `<ul class="blog-detail-social flex gap-12">
	<li>
		<p>Сподели:</p>
	</li>
	<li><a href="https://priselci.mobile.bg/}" target="_blank" rel="noopener" aria-label="Сподели във Facebook">${renderBlogSocialIcon('facebook')}</a></li>
	<li><a href="https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" rel="noopener" aria-label="Сподели в X">${renderBlogSocialIcon('x')}</a></li>
	<li><a href="https://priselci.mobile.bg/" target="_blank" rel="noopener" aria-label="Instagram">${renderBlogSocialIcon('instagram')}</a></li>
	<li><a href="mailto:?subject=${shareText}&body=${shareUrl}" aria-label="Изпрати по имейл">${renderBlogSocialIcon('mail')}</a></li>
</ul>`;
}

function renderBlogDetailAuthorBox() {
	return `<div class="mb-40">
	<div class="listing-details--contact-dealer mb-20">
		<img src="${daynightPageAssets.dealerProfileMark}" alt="${daynightSite.shortName}">
		<div class="content">
			<a href="/about/daynight-auto-plovdiv" class="h4 mb-4 font-weight-600">Приселци</a>
			<p class="text-secondary mb-18">Автокъща в Варна</p>
			<ul class="blog-detail-social flex gap-12">
				<li><a href="https://priselci.mobile.bg/" target="_blank" rel="noopener" aria-label="Facebook канал">${renderBlogSocialIcon('facebook')}</a></li>
				<li><a href="https://priselci.mobile.bg/" target="_blank" rel="noopener" aria-label="Instagram канал">${renderBlogSocialIcon('instagram')}</a></li>
				<li><a href="mailto:${daynightSite.email}" aria-label="Имейл към Приселци">${renderBlogSocialIcon('mail')}</a></li>
			</ul>
		</div>
	</div>
	<p class="h7 line-height-28">Приселци публикува практични съвети и новини за наличност, покупка, оглед, документи, регистрация и финансиране на употребявани автомобили в Варна.</p>
</div>`;
}

function adjacentBlogArticles(article: DayNightArticle, articles: DayNightArticle[]) {
	const sourceArticles = articles.length ? articles : [article];
	const index = sourceArticles.findIndex((candidate) => candidate.slug === article.slug);
	const safeIndex = index === -1 ? 0 : index;
	const previous = sourceArticles[(safeIndex - 1 + sourceArticles.length) % sourceArticles.length];
	const next = sourceArticles[(safeIndex + 1) % sourceArticles.length];

	return { previous, next };
}

function renderBlogDetailPrevNext(article: DayNightArticle, articles: DayNightArticle[]) {
	const { previous, next } = adjacentBlogArticles(article, articles);

	return `<div class="flex justify-between mb-24 blog-detail-recentpost">
	<div class="previous">
		<p class="font-weight-600 text-highlight uppercase mb-4">ПРЕДИШНА</p>
		<a href="${blogArticleRoute(previous)}" class="h5 font-weight-500 capitalize">${escapeHtml(previous.title)}</a>
	</div>
	<div class="next">
		<p class="font-weight-600 text-highlight uppercase mb-4 text-right">СЛЕДВАЩА</p>
		<a href="${blogArticleRoute(next)}" class="h5 font-weight-500 text-right capitalize">${escapeHtml(next.title)}</a>
	</div>
</div>`;
}

function renderBlogDetailComments() {
	const comments = [
		{
			name: 'Иван Димитров',
			time: 'преди 1 ден',
			text: 'Полезен списък за проверка преди оглед и покупка.',
			avatar: '/assets/images/blog/comments-post-1.jpg',
			inner: false
		},
		{
			name: 'Мария Георгиева',
			time: 'преди 2 дни',
			text: 'Интересувам се от автомобил в конкретен бюджет. Мога ли да получа насока?',
			avatar: '/assets/images/blog/comments-post-2.jpg',
			inner: true
		},
		{
			name: 'Приселци',
			time: 'преди 2 дни',
			text: 'Да, най-добре е да сравним бюджет, пробег, гориво и реална наличност преди оглед.',
			avatar: daynightPageAssets.dealerProfileMark,
			inner: false
		}
	];

	return `<p class="h3 mb-20">03 коментара</p>
<div class="flex flex-col gap-24 mb-42">
	${comments
		.map(
			(
				comment
			) => `<a href="/contact" class="comments-post${comment.inner ? ' comments-post--inner' : ''}">
		<div class="avatar">
			<img src="${comment.avatar}" alt="${escapeHtml(comment.name)}">
		</div>
		<div class="content">
			<p class="h5 mb-4">${escapeHtml(comment.name)}</p>
			<p class="text-secondary text-sm mb-12">${escapeHtml(comment.time)}</p>
			<p class="text-secondary h7 mb-12">${escapeHtml(comment.text)}</p>
			<p class="text-underline font-weight-600 text-highlight">Отговор</p>
		</div>
	</a>`
		)
		.join('\n')}
</div>`;
}

function renderBlogDetailCommentForm() {
	return `<form action="/contact?intent=blog-comment" class="blog-detail-comment-form">
	<p class="h3 mb-24 capitalize">Оставете коментар</p>
	<div class="grid grid-cols-2 gap-22 mb-16 md-grid-cols-1">
		<div class="md-col-span-2">
			<p class="mb-8">Вашето име</p>
			<input class="active input-large" id="name-comment" name="name-review" type="text" value="" placeholder="Вашето име" required>
		</div>
		<div class="md-col-span-2">
			<p class="mb-8">Вашият имейл</p>
			<input class="input-large" name="email-comment" id="email-review" type="email" value="" placeholder="Вашият имейл" required>
		</div>
		<div class="col-span-2 padding-0">
			<p class="mb-8">Коментар</p>
			<textarea placeholder="Напишете коментар" rows="3" tabindex="5" name="comment" class="message" id="comment" required></textarea>
		</div>
	</div>
	<label class="filter-checkbox style-2 style-3 mb-28">
		<input type="checkbox" name="remember-comment" value="yes">
		<span>Запазете име и имейл за следващ коментар</span>
	</label>
	<button class="btn btn-primary-3 btn-large font-weight-600 capitalize">Изпрати коментар</button>
</form>`;
}

function renderBlogDetailMainSection(article: DayNightArticle, articles: DayNightArticle[]) {
	const relatedArticles = articles.filter((candidate) => candidate.slug !== article.slug);
	const secondaryArticle = relatedArticles[0] ?? article;
	const tertiaryArticle = relatedArticles[1] ?? secondaryArticle;

	return `<!-- New Cars -->
<section>
	<div class="bloc-details-container">
		<h1 class="title-2 mb-16 text-center">${escapeHtml(article.title)}</h1>
		${renderBlogDetailMetaList(article)}
		<img class="post--img radius-20 flex mb-40" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}">
		<p class="h7 text-secondary mb-28 line-height-28">${escapeHtml(article.description)}</p>
		<div class="quote mb-28">
			<div class="content">
				<p class="h4 mb-14 capitalize">"Провереният избор започва с документи, история, реален оглед и ясен бюджет."</p>
				<p class="h7 flex items-center gap-8">
					<img src="/assets/icons/line.svg" alt="quote">
					Приселци
				</p>
			</div>
			<img class="icon-quote" src="/assets/icons/quote.svg" alt="quote">
		</div>
		<p class="text-secondary mb-40 h7 line-height-28">${escapeHtml(article.summary[0] ?? article.description)}</p>
		<div class="grid grid-cols-2 md-grid-cols-1 gap-20 mb-40">
			<div>
				<img class="radius-20 flex" src="${escapeHtml(secondaryArticle.image)}" alt="${escapeHtml(secondaryArticle.title)}">
			</div>
			<div>
				<img class="radius-20 flex" src="${escapeHtml(tertiaryArticle.image)}" alt="${escapeHtml(tertiaryArticle.title)}">
			</div>
		</div>
		${renderBlogDetailArticleBody(article)}
		<p class="h4 mb-12">Заключение</p>
		<p class="text-secondary h7 line-height-28 mb-40">${escapeHtml(article.summary.at(-1) ?? article.description)}</p>
		<div class="flex justify-between mb-40 gap-16 md-flex-col">
			${renderBlogDetailTags(article)}
			${renderBlogDetailSocialList(article)}
		</div>
		<div class="divider mb-40"></div>
		${renderBlogDetailAuthorBox()}
		<div class="divider mb-26"></div>
		${renderBlogDetailPrevNext(article, articles)}
		<div class="divider mb-40"></div>
		${renderBlogDetailComments()}
		${renderBlogDetailCommentForm()}
	</div>
</section>
<!-- New Cars -->`;
}

function renderRelatedBlogSection(article: DayNightArticle, articles: DayNightArticle[]) {
	const relatedArticles = articles
		.filter((candidate) => candidate.slug !== article.slug)
		.slice(0, 3);

	if (!relatedArticles.length) {
		return '';
	}

	return `<section class="py-100">
	<div class="container">
		<h2 class="mb-12 text-center">Още по темата</h2>
		<p class="h7 text-secondary mb-40 text-center">Последни новини и практични съвети за покупка, документи, финансиране и наличност.</p>
		<div class="swiper-container swiper-news">
			<div class="swiper-wrapper">
				${relatedArticles
					.map(
						(related) => `<div class="swiper-slide">
					<a href="${blogArticleRoute(related)}" class="post-style-2 overflow-hidden">
						<img class="post--img flex" src="${escapeHtml(related.image)}" alt="${escapeHtml(related.title)}">
						<div class="content">
							<p class="h5 text-white mb-8 title">${escapeHtml(related.title)}</p>
							<div class="flex gap-8 justify-start">
								<span class="text-white text-xs">от ${escapeHtml(related.author)}</span>
								<span class="text-white text-xs">${escapeHtml(formatArticleDate(related.date))}</span>
								<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(related.category)}</span>
							</div>
						</div>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-news mt-35"></div>
		</div>
	</div>
</section>`;
}

function replaceBlogDetailCopy(
	html: string,
	routePath: string,
	context?: DayNightTemplateContentContext
) {
	const articles = getBlogArticles(context);
	const slug = routePath.split('/').at(-1) ?? '';
	const article = articles.find((candidate) => candidate.slug === slug) ?? articles[0];

	if (!article) return html;

	const formattedDate = formatArticleDate(article.date);
	const uppercaseCategory = article.category.toLocaleUpperCase('bg-BG');
	const relatedArticles = articles.filter((candidate) => candidate.slug !== article.slug);
	const secondaryArticle = relatedArticles[0] ?? article;
	const tertiaryArticle = relatedArticles[1] ?? secondaryArticle;

	let output = html
		.replaceAll('Blog Details', article.title)
		.replaceAll('Compact SUV vs. Full-Size SUV: What’s the Difference?', article.title)
		.replaceAll(
			'Compact SUV vs. Full-Size <br class="lg-hidden"> SUV: What’s the Difference?',
			article.title
		)
		.replaceAll(
			'When choosing between a compact SUV and a full-size SUV, there are several key factors to consider. Understanding the differences between these two vehicle types can significantly impact your decision-making process, helping you find the one that best aligns with your lifestyle, driving habits, and needs.',
			article.description
		)
		.replaceAll('Lorem ipsum dolor sit amet', article.description)
		.replaceAll('/assets/images/blog/blog-details.jpg', article.image)
		.replaceAll('/assets/images/blog/blog-details-2.jpg', article.image)
		.replaceAll('/assets/images/blog/post-40.jpg', article.image)
		.replaceAll('/assets/images/blog/post-43.jpg', article.image)
		.replaceAll('/assets/images/blog/post-41.jpg', secondaryArticle.image)
		.replaceAll('/assets/images/blog/post-42.jpg', tertiaryArticle.image)
		.replaceAll('/assets/images/blog/post-4.jpg', secondaryArticle.image)
		.replaceAll('/assets/images/blog/post-5.jpg', tertiaryArticle.image)
		.replaceAll('/assets/images/blog/post-6.jpg', relatedArticles[2]?.image ?? article.image)
		.replaceAll('title-2 mb-16 capitalize text-center', 'title-2 mb-16 text-center')
		.replaceAll('by Admin', `от ${article.author}`)
		.replaceAll('Admin', article.author)
		.replaceAll('John Smith', 'Приселци')
		.replaceAll('August 5, 2025', formattedDate)
		.replaceAll('Aug. 5, 2025', formattedDate)
		.replaceAll('3. Performance and Capability', '3. Сравнете цена, обслужване и финансиране')
		.replaceAll('PERFORMANCE', 'СЪВЕТИ')
		.replaceAll('Performance', 'Съвети')
		.replaceAll(
			'"Choosing the right SUV isn’t just about size—it’s about finding the perfect fit for your lifestyle, needs, and adventures."',
			'Провереният избор започва с документи, история, реален оглед и ясен бюджет.'
		)
		.replaceAll('Nelson Mandela', 'Приселци')
		.replaceAll(
			'From the size and space they offer to their fuel efficiency, performance capabilities, and overall cost of ownership, each type of SUV caters to different priorities and preferences. By carefully weighing these aspects, you can make a more informed choice that not only meets your immediate requirements but also supports your long-term goals and lifestyle.',
			article.body[0] ?? article.description
		)
		.replaceAll('1. Size and Space', '1. Проверете произхода и документите')
		.replaceAll(
			'Full-size SUVs offer more interior space, making them ideal for larger families or those who need more cargo capacity. On the other hand, compact SUVs are more maneuverable and easier to park, making them a great choice for urban driving.',
			article.body[1] ?? article.description
		)
		.replaceAll('2. Fuel Efficiency', '2. Огледайте автомобила спокойно')
		.replaceAll(
			'Generally, compact SUVs tend to be more fuel-efficient compared to their full-size counterparts. If fuel economy is a priority for you, a compact SUV could save you money on gas over time.',
			article.body[2] ?? article.description
		)
		.replaceAll('3. Съвети and Capability', '3. Сравнете цена, обслужване и финансиране')
		.replaceAll(
			'Full-size SUVs often come with more powerful engines and greater towing capacity, making them suitable for off-road adventures and heavy-duty hauling. Compact SUVs, while still capable, might not offer the same level of performance and capability as full-size models.',
			article.body[3] ?? article.description
		)
		.replaceAll('4. Cost', '4. Не финализирайте без ясни следващи стъпки')
		.replaceAll(
			'Cost is another key differentiator. Full-size SUVs typically come with a higher price tag, both in terms of the purchase price and ongoing maintenance costs. Compact SUVs are generally more affordable, making them a budget-friendly option for many buyers.',
			article.body[4] ?? article.description
		)
		.replaceAll('Conclusion', 'Заключение')
		.replaceAll(
			'Choosing between a compact SUV and a full-size SUV depends on your specific needs, whether that’s maximizing fuel efficiency, interior space, or performance. Understanding these differences can help you make a more informed decision that aligns with your lifestyle and budget.',
			article.body[5] ?? article.description
		)
		.replaceAll('Tag:', 'Тема:')
		.replaceAll('Luxury', 'Покупка')
		.replaceAll('Share this post:', 'Сподели:')
		.replaceAll('PREVIOUS', 'ПРЕДИШНА')
		.replaceAll('Home', 'Начало')
		.replaceAll(
			'Truck vs. Minivan: Which is Better for Family Needs?',
			articles[1]?.title ?? 'Финансиране на употребяван автомобил'
		)
		.replaceAll('NEXT', 'СЛЕДВАЩА')
		.replaceAll(
			'Tires: All-Season vs. Summer vs. Winter – What You Need to Know',
			articles[2]?.title ?? 'Документи и регистрация при автомобил'
		)
		.replaceAll('03 Comments', '03 коментара')
		.replaceAll('1 days ago', 'преди 1 ден')
		.replaceAll('2 days ago', 'преди 2 дни')
		.replaceAll('3 days ago', 'преди 3 дни')
		.replaceAll(
			'Great article! Understanding the differences between compact and full-size SUVs helped my decision.',
			'Полезен списък за проверка преди оглед и покупка.'
		)
		.replaceAll(
			'Interesting read! I’m looking for advice on choosing the right SUV. Any recommendations?',
			'Интересувам се от автомобил в конкретен бюджет. Мога ли да получа насока?'
		)
		.replaceAll(
			'Glad you found it helpful! Choosing between compact and full-size SUVs impacts convenience.',
			'Да, най-добре е да сравним бюджет, пробег, гориво и реална наличност.'
		)
		.replaceAll('Reply', 'Отговор')
		.replaceAll('Leave A comment', 'Оставете коментар')
		.replaceAll('You Name (Public)', 'Вашето име')
		.replaceAll('Your email (private)', 'Вашият имейл')
		.replaceAll('Comment', 'Коментар')
		.replaceAll('Post Comment', 'Изпрати коментар')
		.replaceAll('Categories', 'Категории')
		.replaceAll('Auto Maintenance', 'Поддръжка')
		.replaceAll('Car Buying Tips', 'Съвети за покупка')
		.replaceAll('Car Technology', 'Технологии')
		.replaceAll('Electric & Hybrid Cars', 'Електрически и хибридни')
		.replaceAll('Road Trips & Travel', 'Пътуване')
		.replaceAll('Recent posts', 'Последни публикации')
		.replaceAll('Related Articles', 'Още по темата')
		.replaceAll(
			'Get the latest insights, expert tips, and updates to stay informed and inspired.',
			'Последни новини и практични съвети за покупка, документи, финансиране и наличност.'
		)
		.replaceAll('2025 BMW 5 Series Priced From $59,375; i5 EV From $68,275', secondaryArticle.title)
		.replaceAll('Expert Review', 'СЪВЕТИ')
		.replaceAll('NEWS', uppercaseCategory)
		.replaceAll(
			"Top 5 Tips for Maintaining Your Car's Resale Value",
			articles[3]?.title ?? 'Какво да гледаме при премиум автомобил'
		)
		.replaceAll('Leave A Comment', 'Оставете коментар');

	if (html.includes('blog-details-banner')) {
		output = output
			.replace(
				/<section class="blog-details-banner">[\s\S]*?<\/section>/,
				`<section class="blog-details-banner">
			<div class="image flex">
				<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}">
			</div>
		</section>`
			)
			.replace(/<!-- New Cars -->\s*<section>[\s\S]*?<\/section>\s*<!-- New Cars -->/, () =>
				renderBlogDetailMainSection(article, articles)
			)
			.replace(/<section class="py-100">[\s\S]*?<\/section>\s*(?=<!-- Footer -->)/, () =>
				renderRelatedBlogSection(article, articles)
			);
	}

	return output;
}

function replaceSupportPageCopy(html: string, templateFile: string, routePath: string) {
	if (templateFile === 'about-us.html') {
		let output = html
			.replaceAll('About Us', 'За Приселци')
			.replaceAll(
				'Premium vehicles for every lifestyle',
				'проверени употребявани автомобили, съдействие за документи, регистрация, финансиране и огледи в Варна.'
			)
			.replaceAll('Quality Services', 'проверени употребявани автомобили')
			.replaceAll(
				'Driving Your Ultimate Automotive Dreams Forward',
				'Автомобили с ясна история и подреден процес'
			)
			.replaceAll(
				'At Приселци, we make car ownership simple and accessible with expert guidance, personalized solutions, and exceptional service. Our team is committed to helping you find the perfect vehicle while ensuring a hassle-free experience.',
				'Екипът на Приселци помага с избор на автомобил, оглед, документи, регистрация, финансиране и следващи стъпки без излишен шум.'
			)
			.replaceAll('Experienced Automotive Experts', 'Опитен екип за избор и оглед')
			.replaceAll('Transparent Pricing, No Hidden Fees', 'Ясни цени и реални условия')
			.replaceAll('Quick Process, Smooth Transactions', 'Подреден процес и спокойна сделка')
			.replaceAll('Clients Reviews', 'Отзиви от клиенти')
			.replaceAll('Individual Service Team', 'Консултанти на Приселци')
			.replaceAll('Индивидуална услуга Team', 'Консултанти на Приселци')
			.replaceAll('President and Chief Individual Service Officer', 'Консултант продажби')
			.replaceAll('President and Chief Индивидуална услуга Officer', 'Консултант продажби')
			.replaceAll('Chief Operating Officer', 'Оценка, покупка и бартер')
			.replaceAll('Chief Revenue Officer', 'Консултант продажби')
			.replaceAll('Chief Financial Officer', 'Консултант клиентски услуги')
			.replace(
				/<p class="text-secondary h7 line-height-28 mb-32">[\s\S]*?<\/p>/,
				'<p class="text-secondary h7 line-height-28 mb-32">Приселци предлага внимателно подбрани и автомобили от обяви с гарантиран произход, коректна оценка при изкупуване и пълно съдействие от избора до документите, регистрацията и финансирането.</p>'
			)
			.replace(
				/At Приселци, we make car ownership simple and accessible[\s\S]*?hassle-free experience\./,
				'Приселци предлага внимателно подбрани и автомобили от обяви с гарантиран произход, коректна оценка при изкупуване и пълно съдействие от избора до документите, регистрацията и финансирането.'
			)
			.replaceAll('/assets/images/pages/about-1.jpg', daynightPageAssets.aboutExterior)
			.replaceAll('/assets/images/pages/about-2.jpg', daynightPageAssets.aboutConsultation)
			.replaceAll('/assets/images/card/why-choose-us.webp', daynightPageAssets.aboutShowroomVehicle)
			.replaceAll('Have any Question?', 'Имате въпрос?');

		output = replaceDivInnerByExactClass(output, daynightTeamGridClass, renderTeamGrid('about'));
		output = replaceAboutBrandCarousel(output);
		output = polishAboutPageStructure(output);

		return output;
	}

	if (templateFile === 'financing.html') {
		return html
			.replaceAll('Financing', 'Финансиране и разсрочено плащане')
			.replaceAll('Auto loan calculator', 'Калкулатор за ориентировъчна месечна вноска')
			.replaceAll('How it works', 'Как работи финансирането')
			.replaceAll(
				'Find the right car with the right features for the right budget.',
				'Сравнете бюджет, първоначална вноска и ориентировъчна месечна вноска преди оглед.'
			)
			.replaceAll('Start with getting prequalified', 'Изпратете запитване')
			.replaceAll('Shop with your terms', 'Уточнете условията')
			.replaceAll('Explore financing offers', 'Изберете подходящ вариант');
	}

	if (templateFile === 'sell-your-car.html') {
		return html
			.replaceAll('Sell Your Car', 'Продайте или заменете автомобила си')
			.replaceAll('Get a fair price', 'Получете предложение за покупка или бартер от Приселци')
			.replaceAll('Certified Dealers', 'Приселци')
			.replaceAll(
				'Answer a few questions about your vehicle, and then connect with one of thousands of Certified Dealers who can pay you directly for your used car.',
				'Опишете автомобила, изпратете снимки и екипът на Приселци ще Ви изпрати следващи стъпки за оглед, покупка или бартер.'
			)
			.replaceAll('Secure Transactions And Title Transfer', 'Съдействие по документи и прехвърляне')
			.replaceAll('Secure Transactions', 'Съдействие по документи')
			.replaceAll('Title Transfer', 'и прехвърляне')
			.replaceAll('Verified Community Of Buyers', 'Реален купувач и бартерен интерес')
			.replaceAll('Verified Community', 'Реален купувач')
			.replaceAll('Of Buyers', 'и бартерен интерес')
			.replaceAll('Free Vehicle History Report', 'Преглед на състоянието и историята')
			.replaceAll('Vehicle History Report', 'Преглед на състоянието и историята')
			.replaceAll('Have any Question?', 'Имате въпрос?')
			.replaceAll('License Plate', 'Регистрационен номер')
			.replaceAll('Enter VIN Number', 'Въведете VIN номер')
			.replaceAll('Zip Code', 'Локация')
			.replaceAll('Get Started', 'Изпрати запитване')
			.replaceAll('Enter Your Car’s Details', 'Опишете автомобила')
			.replaceAll(
				'Provide your car’s information to get an instant value estimate.',
				'Споделете модел, година, пробег и състояние, за да подготвим ориентир за покупка или бартер.'
			)
			.replaceAll('Fine-Tune Your Value', 'Уточнете детайлите')
			.replaceAll(
				'Adjust factors like color and mileage to see their impact on your car’s value.',
				'Добавете снимки, оборудване и особености, за да преценим реалния интерес.'
			)
			.replaceAll('Receive Your Offer', 'Получете обратна връзка')
			.replaceAll(
				'Ready to sell? Get a personalized offer from a local dealer.',
				'Екипът на Приселци ще Ви изпрати следващи стъпки за оглед, покупка или бартер.'
			)
			.replaceAll('Complete the Sale Easily', 'Финализирайте спокойно')
			.replaceAll(
				'Finalize the deal with secure transactions & hassle-free paperwork assistance.',
				'Подготвяме документите и координираме процеса до финализиране.'
			)
			.replaceAll('Get In Touch With Us', 'Свържете се със Приселци')
			.replaceAll(
				'We’re here to assist with any questions, concerns, or inquiries contact us today!',
				'Свържете се за оглед, документи, регистрация, финансиране, бартер или въпрос за наличен автомобил.'
			)
			.replaceAll('Monday - Saturday: 08:00AM - 17:00PM', 'Понеделник - събота: 9:00 - 18:00')
			.replaceAll('Sunday: Close', 'Неделя: по уговорка')
			.replaceAll(
				'What Paperwork Is Needed To Sell My Car?',
				'Какви документи са нужни, ако продавам автомобил?'
			)
			.replace(
				/What\s*Paperwork\s*Is\s*Needed\s*To\s*Sell\s*My\s*Car\?/g,
				'Какви документи са нужни, ако продавам автомобил?'
			)
			.replaceAll(
				'Usually, you will need the current registration for the vehicle signed by all registered owners, along with the car title and your ID or driver’s license. You may also need to provide warranty information. To complete your sale transaction, you will likely need to complete a bill of sale.',
				'Обикновено са нужни талон, документ за собственост, лична карта и допълнителни документи според конкретния автомобил. Екипът на Приселци уточнява точния набор при оглед.'
			)
			.replaceAll(
				'Check with your local DMV to confirm what you’ll need in your state.',
				'При нужда съдействаме какво да подготвите предварително според случая.'
			);
	}

	if (templateFile === 'add-listings-2.html') {
		return html
			.replaceAll('Dashboard', daynightAccount.title)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('My Reviews', daynightAccount.reviewsTitle)
			.replaceAll('Messages', 'Съобщения')
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('Change Password', daynightAccount.passwordTitle)
			.replaceAll('Logout', 'Изход')
			.replaceAll('Show Dashboard', 'Меню профил')
			.replaceAll('Show Моят профил', 'Меню профил')
			.replaceAll('Add Listings', 'Заявка за оценка на автомобил')
			.replaceAll('Add Listing', 'Заявка за оценка на автомобил')
			.replaceAll('Нова заявка за продажбаs', 'Нова заявка за продажба')
			.replaceAll('Продай автомобил', 'Заявка за оценка на автомобил')
			.replaceAll('Submit Listing', 'Изпрати заявка')
			.replaceAll('List Now', 'Изпрати заявка')
			.replaceAll('Save & Preview', 'Преглед на заявката')
			.replaceAll(
				'Lorem ipsum dolor sit amet, ',
				'Опишете автомобила, състоянието и желаните следващи стъпки.'
			)
			.replaceAll('Gallery', 'Снимки на автомобила')
			.replaceAll('Car Preview', 'Преглед на заявката')
			.replaceAll('Car Gallery', 'Снимки')
			.replaceAll('Car Details', 'Данни за автомобила')
			.replaceAll('Features', 'Особености и оборудване')
			.replaceAll('Car Price', 'Очаквана цена')
			.replaceAll('Location', 'Локация')
			.replaceAll('Video', 'Видео')
			.replaceAll('Attachments', 'Документи')
			.replaceAll('Stock Number*', 'Вътрешен номер')
			.replaceAll('VIN Number*', 'VIN номер')
			.replaceAll('Mileage*', 'Пробег')
			.replaceAll('Transmission*', 'Скорости')
			.replaceAll('Model*', 'Модел')
			.replaceAll('Type*', 'Купе')
			.replaceAll('Enter number', 'Номер или бележка')
			.replaceAll('Enter VIN', 'VIN номер')
			.replaceAll('Enter mileage', 'Пробег')
			.replaceAll('Vehicle Information', 'Данни за автомобила')
			.replaceAll('Upload Photos', 'Добави снимки');
	}

	if (templateFile === 'services-center.html') {
		let output = html
			.replaceAll('Aurexo Services Center', 'Услуги за купувачи и продавачи')
			.replaceAll('Services Center', 'Услуги за купувачи и продавачи')
			.replaceAll('Sevices Center', 'Услуги за купувачи и продавачи')
			.replaceAll('Our Services Include', 'Как съдействаме')
			.replaceAll('Features Services', 'Подкрепа преди и след покупка')
			.replaceAll(
				'Maintenance and repairs',
				'документи, регистрация, финансиране, бартер, проверка и доставка'
			)
			.replaceAll(
				'Your one-stop destination for expert car services, maintenance, and repairs—keeping your vehicle in top condition.',
				'документи, регистрация, финансиране, бартер, проверка и доставка'
			)
			.replaceAll('Oil Change & Filter Replacement', 'Документи и проверка на история')
			.replaceAll('Transmission Service', 'Съдействие при регистрация')
			.replaceAll('Brake Inspection & Repair', 'Финансиране и разсрочено плащане')
			.replaceAll('AC & Heating Repair', 'Бартер и оценка на автомобил')
			.replaceAll('Tire Rotation & Balancing', 'Оглед в доверен сервиз')
			.replaceAll('Wheel Alignment', 'Доставка на автомобил')
			.replaceAll('Battery Testing & Replacement', 'Търсене на автомобил по задание')
			.replaceAll('Suspension & Steering Repair', 'Проверка преди покупка')
			.replaceAll('Engine Diagnostics & Repair', 'Подготовка за сделка')
			.replaceAll('Exhaust System Maintenance', 'Следпродажбено съдействие')
			.replaceAll('Oil Change', 'Съдействие с документи')
			.replaceAll('Air Conditioning & Heating', 'Доставка и следващи стъпки')
			.replaceAll('Brake Repair', 'Регистрация и обслужване след покупка')
			.replaceAll(
				'Find the right car with the right features for the right budget.',
				'Съдействаме с практичните стъпки преди и след избора на автомобил.'
			)
			.replaceAll(
				'Keep your engine running smoothly with regular oil changes and filter replacements.',
				'Проверяваме наличните документи, историята на автомобила и следващите стъпки преди сделка.'
			)
			.replaceAll(
				'Extend tire life and improve vehicle performance with proper rotation and balancing.',
				'Организираме оглед на място или в доверен сервиз според конкретния автомобил.'
			)
			.replaceAll(
				'Ensure safety with comprehensive brake inspections, repairs, and replacements.',
				'Съдействаме за финансиране, разсрочено плащане и ясно планиране на бюджета.'
			)
			.replaceAll(
				'Keep your vehicle powered up with battery testing and timely replacements.',
				'Подготвяме регистрация, застраховки и документи според произхода на автомобила.'
			)
			.replaceAll(
				'Detect and fix engine issues with advanced diagnostic tools and expert repair services.',
				'Помагаме при бартер, оценка и сравнение на реалната пазарна стойност.'
			)
			.replaceAll(
				'Stay comfortable year-round with full AC and heating system inspections and repairs.',
				'При нужда съдействаме за транспорт или доставка след финализиране на сделката.'
			)
			.replaceAll(
				'Get in touch with us for expert service and support. Whether you need routine maintenance, urgent repairs, or professional guidance, our dedicated team is here to ensure your vehicle stays in top condition.',
				'Свържете се със Приселци за документи, регистрация, финансиране, бартер, оглед, доставка или търсене на автомобил по задание.'
			)
			.replaceAll('Expert Technicians', 'Практично съдействие')
			.replaceAll('Quick Turnaround Time', 'Ясни следващи стъпки')
			.replaceAll('Affordable Pricing', 'Прозрачни условия')
			.replaceAll('Comprehensive Vehicle Care', 'Подкрепа при сделка')
			.replaceAll('Schedule A Services', 'Изпратете запитване')
			.replaceAll('Schedule Services', 'Изпрати запитване')
			.replaceAll('Schedule A Service', 'Изпратете запитване')
			.replaceAll('Opening Hours:', 'Работно време:')
			.replaceAll('Mon-Sat:8:00am - 18:00pm', 'Огледи: с предварителна уговорка')
			.replaceAll('Sun: Closed', 'Документи и предаване: след потвърждение')
			.replaceAll('Name', 'Име')
			.replaceAll('Email', 'Имейл')
			.replaceAll('Phone', 'Телефон')
			.replaceAll('Date', 'Дата')
			.replaceAll('Brand', 'Марка')
			.replaceAll('Model', 'Модел')
			.replaceAll(
				'Find Your Perfect Used Car Anytime, Anywhere!',
				'Изберете автомобил с подкрепа от Приселци'
			)
			.replaceAll(
				'Experience hassle-free car shopping with our app. Browse, compare, and buy used cars wherever you are - it’s fast, simple, and convenient.',
				'Съдействаме при оглед, документи, финансиране, бартер и регистрация в Варна.'
			)
			.replaceAll(
				'Experience hassle-free car shopping with our app. Browse, compare, and buy used cars wherever you are – it’s fast, simple, and convenient.',
				'Съдействаме при оглед, документи, финансиране, бартер и регистрация в Варна.'
			)
			.replace(
				/Experience hassle-free car shopping with our app\. Browse, compare, and buy used cars\s*<br class="lg-hidden" \/>\s*wherever you are - it’s fast, simple, and convenient\./g,
				'Съдействаме при оглед, документи, финансиране, бартер и регистрация в Варна.'
			)
			.replaceAll(
				'/assets/images/banner/bg-service-center.jpg',
				daynightPageAssets.servicesInspection
			)
			.replaceAll('/assets/images/pages/services-center.png', daynightPageAssets.servicesInspection)
			.replaceAll(
				'/assets/images/home/banner-download-app.jpg',
				daynightPageAssets.servicesConsultation
			)
			.replaceAll('/assets/icons/ТелефонCall-2.svg', '/assets/icons/PhoneCall-2.svg')
			.replace(
				/<h2 class="mb-12 capitalize">\s*Услуги за купувачи и продавачи\s*<\/h2>/i,
				'<h2 class="mb-12">Услуги за купувачи и продавачи</h2>'
			)
			.replace(
				/<h2 class="text-center capitalize mb-12">\s*Подкрепа преди и след покупка\s*<\/h2>/i,
				'<h2 class="text-center mb-12">Подкрепа преди и след покупка</h2>'
			)
			.replace(
				/<h2 class="mb-12 text-white">\s*Contact\s+Информация\s*<\/h2>/i,
				'<h2 class="mb-12 text-white">Контакти и информация</h2>'
			)
			.replace(/class="h4 font-weight-600 mb-8 capitalize"/g, 'class="h4 font-weight-600 mb-8"')
			.replaceAll('Infomation', 'Информация')
			.replace(/Контакти\s+Информация/g, 'Контакти и информация')
			.replace(/Контакти\s+Infomation/g, 'Контакти и информация')
			.replace(/Contact\s+Информация/g, 'Контакти и информация');

		output = polishServicesPageStructure(output);

		return output;
	}

	if (templateFile === 'clients-reviews.html') {
		return html
			.replaceAll('Clients Reviews', 'Отзиви от клиенти')
			.replaceAll('What our clients say', 'Реални впечатления от клиенти на Приселци')
			.replaceAll(
				'I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.',
				'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск и без излишни обещания.'
			)
			.replaceAll(
				'Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.',
				'Екипът ми помогна да сравня няколко автомобила и да преценя бюджета с вариант за разсрочено плащане.'
			)
			.replaceAll(
				'I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!',
				'Автомобилът беше представен коректно, със снимки, цена и обяснение за състоянието. Сделката мина бързо и подредено.'
			)
			.replaceAll(
				'Buying my car through this platform was a breeze! The detailed car listings helped me make an informed choice. The support team answered all my questions promptly. I’m thrilled with my purchase!',
				'Обявата беше достатъчно подробна, а на място получих отговори за пробег, обслужване и регистрация.'
			)
			.replaceAll(
				'The professionalism displayed by this dealership was top-notch. They guided me through every step and ensured I got a great deal on my car. I’ll definitely return here for my next car purchase.',
				'Съдействието при документите и регистрацията спести време. Хареса ми, че условията бяха казани предварително.'
			)
			.replaceAll(
				'Buying my car here was simple! The website was user-friendly, and I quickly found a car that perfectly fit my needs. Customer support was helpful throughout the seamless process, making everything stress-free.',
				'Лесно избрах подходящ автомобил и получих съдействие за оглед, документи и финансиране.'
			)
			.replaceAll(
				'This platform’s wide variety of cars made finding the perfect one for me incredibly easy. The process was straightforward and well-organized, and the team was attentive and helpful at every step along the way.',
				'Наличните автомобили са подредени ясно, а екипът помага с реални съвети според бюджета и нуждите.'
			)
			.replaceAll(
				'The intuitive website, along with detailed listings, made choosing a car enjoyable and effortless. Customer support promptly addressed all my concerns and ensured I was confident in my decision.',
				'Получих бърз отговор на въпросите си и ясни стъпки за оглед и покупка.'
			)
			.replaceAll(
				'This platform was fast, efficient, and very easy to use for finding a car. I found the right vehicle quickly, and the entire process was hassle-free and transparent. Definitely recommend this service to everyone!',
				'Процесът беше прозрачен и добре организиран от първото обаждане до финалните документи.'
			)
			.replaceAll('Emily Johnson', 'Клиент на Приселци')
			.replaceAll('Benjamin Parker', 'Клиент от Варна')
			.replaceAll('Olivia Williams', 'Клиент на Приселци')
			.replaceAll('Sophia Martinez', 'Клиент от Варна')
			.replaceAll('Daniel Wright', 'Клиент на Приселци')
			.replaceAll('Sarah Nguyen', 'Клиент от Варна')
			.replaceAll('Manager, NexTech', 'Клиент на Приселци')
			.replaceAll('Freelance Designer', 'Клиент от Варна')
			.replaceAll('Entrepreneur', 'Клиент на Приселци')
			.replaceAll('Accountant', 'Клиент от Варна')
			.replaceAll('CEO BMW', 'Клиент на Приселци')
			.replaceAll('CEO Приселци', 'Клиент на Приселци')
			.replaceAll('James Anderson', 'Клиент от Варна')
			.replaceAll('Project Manager', 'Клиент на Приселци')
			.replaceAll('Avitex', 'Приселци')
			.replaceAll('Tesla', 'Приселци')
			.replaceAll('Aurexo', 'Приселци');
	}

	if (templateFile === 'sale-agents.html') {
		let output = html
			.replaceAll('Sale Agents', 'Екипът на Приселци')
			.replaceAll('Our Agents', 'Консултанти')
			.replaceAll('Brooklyn Simmons', daynightTeam[0]?.name ?? 'Екипът на Приселци')
			.replaceAll(
				'Darrell Steward',
				daynightTeam[1]?.name ?? daynightTeam[0]?.name ?? 'Екипът на Приселци'
			)
			.replaceAll(
				'Senior Dealer Partner',
				daynightTeam[0]?.role.toLowerCase() ?? 'консултант продажби'
			)
			.replaceAll('Mike Hanley', daynightTeam[0]?.name ?? 'Екипът на Приселци');

		output = replaceDivInnerByExactClass(output, daynightTeamGridClass, renderTeamGrid('team'));
		output = output.replace(
			/<div class="container">\s*<ul class="pagination justify-center">[\s\S]*?<\/ul>\s*<\/div>/,
			''
		);

		return output;
	}

	if (templateFile === 'sale-agents-details.html') {
		const slug = routePath.split('/').at(-1) ?? '';
		const member = getDayNightTeamMemberBySlug(slug) ?? daynightTeam[0];

		let output = html
			.replaceAll('Sale Agent Details', 'Профил на консултант')
			.replaceAll('Senior Dealer Partner', member?.role ?? 'Консултант продажби')
			.replaceAll('Mike Hanley', member?.name ?? 'Екипът на Приселци')
			.replaceAll('Dealer Inventory', 'Препоръчани автомобили')
			.replaceAll('Customer Reviews', 'Отзиви от клиенти')
			.replaceAll('Write A Review', 'Добавете отзив')
			.replaceAll('Add A Review', 'Добавете отзив')
			.replaceAll('Location', 'Локация')
			.replaceAll('Call To Dealer', daynightSite.phoneCta)
			.replaceAll('Chat via WhatsApp', 'Чат в WhatsApp')
			.replaceAll('Send Inquiry About Vehicle', 'Изпратете запитване')
			.replaceAll('Изпрати запитване about Vehicle', 'Изпрати запитване')
			.replaceAll("This Vehicle's Availability", 'Интерес за оглед')
			.replaceAll("This Vehicle's Availability 2", 'Бартер или оценка')
			.replaceAll("This Vehicle's Availability 3", 'Документи и финансиране')
			.replaceAll('Интерес за оглед 2', 'Бартер или оценка')
			.replaceAll('Интерес за оглед 3', 'Документи и финансиране')
			.replaceAll('Comment', 'Вашето съобщение')
			.replaceAll('placeholder="Your Review"', 'placeholder="Вашият отзив"')
			.replaceAll('Your email address will not be published', 'Имейлът няма да бъде публикуван')
			.replaceAll('Send Inquiry', 'Изпрати запитване')
			.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
			.replaceAll('Login To Add A Review', 'Изпратете отзив')
			.replaceAll('(1,968 Ratings)', `(${daynightSite.reviewCountLabel})`)
			.replaceAll('Randynox', 'Клиент на Приселци')
			.replaceAll('Mista Nyroom', 'Клиент от Варна')
			.replace(/<p class="mb-8">Name<\/p>/g, '<p class="mb-8">Име</p>')
			.replace(/<p class="mb-8">Email<\/p>/g, '<p class="mb-8">Имейл</p>')
			.replace(/<p class="mb-8">Phone<\/p>/g, '<p class="mb-8">Телефон</p>')
			.replace(/<p class="mb-8">Subject<\/p>/g, '<p class="mb-8">Тема</p>')
			.replace(/<p class="mb-8">Message<\/p>/g, '<p class="mb-8">Съобщение</p>')
			.replace(/<p class="mb-8">Review<\/p>/g, '<p class="mb-8">Отзив</p>')
			.replace(/<p class="mb-12">Rating<\/p>/g, '<p class="mb-12">Оценка</p>')
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Вашето име"')
			.replaceAll(`value="${daynightSite.email}"`, 'value="" placeholder="Вашият имейл"')
			.replaceAll('placeholder="Phone (optional)"', 'placeholder="Телефон"')
			.replaceAll('type="number"', 'type="tel"')
			.replaceAll(
				'/assets/images/pages/sale-agent-9.jpg',
				member?.image ?? daynightTeam[0]?.image ?? daynightSite.logoDark
			)
			.replace(
				/<p class="text-secondary mb-4">[\s\S]*?<\/p>/,
				`<p class="text-secondary mb-4">${member?.bio ?? daynightTeam[0]?.bio}</p>`
			)
			.replace(
				/<p class="text-secondary mb-40">[\s\S]*?<\/p>/,
				`<p class="text-secondary mb-40">${member?.detail ?? member?.bio ?? daynightTeam[0]?.bio}</p>`
			)
			.replaceAll(
				'Bought new in 2012, and it’s still running strong at over 180,000 miles. I’ve only had to replace the battery and brakes once. The ride is smooth, the interior still feels solid, and the fuel economy hasn’t dropped much.',
				'Получих ясна информация за наличните автомобили, условията за оглед и следващите стъпки. Комуникацията беше точна и навременна.'
			)
			.replaceAll(
				'Picked this car up used about five years ago with 90k miles. It’s now at 160k and still starts every morning without hesitation. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives.',
				'Екипът отговори спокойно на въпросите ми за документи, финансиране и регистрация. Процесът беше подреден и без излишен шум.'
			);

		output = replaceWidgetMapByClass(
			output,
			'widget-gg-map flex radius-8 overflow-hidden mb-28',
			'234'
		);
		output = replaceDivInnerByExactClass(
			output,
			'grid grid-cols-1 gap-20 mb-40',
			renderInventoryMapCardCollection(3)
		);
		output = output.replace(
			/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">\s*Изпратете отзив\s*<\/button>/i,
			'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Отзивите се потвърждават от екипа преди публикуване.">Изпратете отзив</a>'
		);

		return output;
	}

	if (templateFile === 'dealer-details.html') {
		let output = html
			.replaceAll('Dealer Listing', 'Профил на Приселци Варна')
			.replaceAll('Dealer Details', 'Профил на Приселци Варна')
			.replaceAll('Dealer Detail', 'Профил на Приселци Варна')
			.replaceAll('Aurexo Atlanta', 'Приселци Варна')
			.replaceAll('Euro Workshop', 'Приселци Варна')
			.replaceAll('537 Orchard St, NY', daynightSite.location)
			.replaceAll('Verified Dealer', 'Проверена автокъща')
			.replaceAll('Dealer Inventory', 'Налични автомобили')
			.replaceAll('About Dealer', 'За автокъщата')
			.replaceAll('Customer Reviews', 'Отзиви от клиенти')
			.replaceAll('Write A Review', 'Добавете отзив')
			.replaceAll('Write a Review', 'Добавете отзив')
			.replaceAll('Location', 'Локация')
			.replaceAll('Call To Dealer', daynightSite.phoneCta)
			.replaceAll('Chat via WhatsApp', 'Чат в WhatsApp')
			.replaceAll('(751 review)', `(${daynightSite.reviewCountLabel})`)
			.replaceAll(
				'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience.',
				'Приселци Варна предлага проверени употребявани автомобили, съдействие за документи, регистрация, финансиране, бартер и оглед в доверен сервиз. Екипът работи с ясна информация за цена, пробег, състояние и следващи стъпки след избора на автомобил.'
			)
			.replaceAll(
				'His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with his clients, always prioritizing trust and transparency.',
				'На място клиентите могат да сравнят налични автомобили, да обсъдят бартер или разсрочено плащане и да подготвят документите без излишно забавяне.'
			)
			.replaceAll(
				'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience. His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with clients, offering honest advice, transparent deals, and personalized support every step of the way.',
				'Приселци Варна предлага проверени употребявани автомобили, съдействие за документи, регистрация, финансиране, бартер и оглед в доверен сервиз. Екипът работи с ясна информация за цена, пробег, състояние и следващи стъпки след избора на автомобил.'
			)
			.replaceAll('/assets/images/pages/volvo.png', daynightPageAssets.dealerProfileMark)
			.replace(/<p class="mb-8">Name<\/p>/g, '<p class="mb-8">Име</p>')
			.replace(/<p class="mb-8">Email<\/p>/g, '<p class="mb-8">Имейл</p>')
			.replace(/<p class="mb-8">Review<\/p>/g, '<p class="mb-8">Отзив</p>')
			.replace(/<p class="mb-12">Rating<\/p>/g, '<p class="mb-12">Оценка</p>')
			.replaceAll('placeholder="Your Review"', 'placeholder="Вашият отзив"')
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Вашето име"')
			.replaceAll(`value="${daynightSite.email}"`, 'value="" placeholder="Вашият имейл"');

		output = replaceWidgetMapByClass(
			output,
			'widget-gg-map flex radius-8 overflow-hidden mb-28',
			'234'
		);

		output = output.replace(
			/<form action="#">/i,
			'<form action="/contact?intent=review" title="Отзивите се потвърждават от екипа преди публикуване.">'
		);

		output = output.replace(
			/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">\s*Login\s*to\s*add\s*a\s*Review\s*<\/button>/i,
			'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Отзивите се потвърждават от екипа преди публикуване.">Изпратете отзив</a>'
		);

		output = replaceDivInnerByExactClass(
			output,
			'grid grid-cols-1 gap-20 mb-40',
			renderInventoryMapCardCollection(3)
		);

		return output;
	}

	if (templateFile === 'contact-us.html') {
		let output = promoteContactContentBeforeMap(html)
			.replaceAll('Contact Us', 'Контакти')
			.replaceAll('Get In Touch', 'Свържете се със Приселци')
			.replaceAll('get in touch', 'Свържете се със Приселци')
			.replaceAll('<p class="mb-8">Message</p>', '<p class="mb-8">Съобщение</p>')
			.replaceAll('<p class="mb-8">Email</p>', '<p class="mb-8">Имейл</p>')
			.replaceAll('<p class="mb-8">First Name</p>', '<p class="mb-8">Име</p>')
			.replaceAll('<p class="mb-8">Last Name</p>', '<p class="mb-8">Тема</p>')
			.replaceAll('value="Tony"', 'value="" placeholder="Вашето име"')
			.replaceAll(
				'placeholder="Enter your last name"',
				'placeholder="Автомобил, бартер, документи..."'
			)
			.replaceAll('placeholder="Enter your phone number"', 'placeholder="Въведете телефон"')
			.replaceAll('placeholder="Enter your email address"', 'placeholder="Въведете имейл"')
			.replaceAll('Your Message*', 'Вашето съобщение*')
			.replaceAll('Send Message', 'Изпрати запитване')
			.replace(/<p class="h3 mb-12 capitalize">([\s\S]*?)<\/p>/g, '<p class="h3 mb-12">$1</p>')
			.replace(
				/name="SendInquiryphone" id="SendInquiryphone" type="number"/,
				'name="SendInquiryphone" id="SendInquiryphone" type="tel"'
			)
			.replace(
				/<ul class="contact-page-info-social flex gap-8">[\s\S]*?<\/ul>/,
				renderContactPageSocialLinks()
			)
			.replace(
				/<a href="tel:[^"]+" class="text-secondary">\s*[^<]+\s*<\/a>\s*<a href="tel:[^"]+" class="text-secondary">\s*[^<]+\s*<\/a>/,
				`<a href="tel:${daynightSite.phone}" class="text-secondary">${daynightSite.phoneLabel}</a><a href="mailto:${daynightSite.email}" class="text-secondary">${daynightSite.email}</a>`
			);

		output = output
			.replace(
				/<div class="bg-white radius-20 contact-page-form">\s*<p class="h3 mb-12">Свържете се със Приселци<\/p>/,
				'<div class="bg-white radius-20 contact-page-form">\n\t\t\t\t\t\t<p class="h3 mb-12">Пишете ни за автомобил</p>'
			)
			.replace(
				/<p class="text-secondary">гр\. Варна, Варна, гр. Варна, бул. „Цар Освободител“ 285, бул. „Цар Освободител“ 285<\/p>/,
				`<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="text-secondary">${daynightSite.location}</a>`
			);

		output = output.replace(/<form action="#">/i, '<form action="/contact">');

		return replaceWidgetMapByClass(
			output,
			'widget-gg-map flex radius-8 overflow-hidden',
			'520',
			'eager'
		);
	}

	if (templateFile === 'faqs.html') {
		return html
			.replaceAll('Home', 'Начало')
			.replaceAll('Pages', 'Още')
			.replaceAll('Frequently Asked Questions', 'Често задавани въпроси')
			.replaceAll('Do you offer financing?', 'Предлагате ли съдействие за финансиране?')
			.replaceAll('Exchanges &amp; Returns', 'Бартер и замяна')
			.replaceAll('Exchanges & Returns', 'Бартер и замяна')
			.replaceAll('Refund Questions', 'Гаранция и доставка')
			.replaceAll(
				'Policies on vehicle exchanges after purchase?',
				'Приемате ли стария ми автомобил като бартер?'
			)
			.replaceAll(
				'Conditions for returning a rental car early?',
				'Как се оценява автомобил за замяна?'
			)
			.replaceAll(
				'Timeframes for initiating an exchange or return?',
				'Мога ли да доплатя разликата при замяна?'
			)
			.replaceAll(
				'Documentation needed for processing exchanges?',
				'Какви документи са нужни за бартер?'
			)
			.replaceAll(
				'Eligibility for refunds on purchases or deposits?',
				'Има ли гаранция за автомобилите?'
			)
			.replaceAll(
				'How refunds are processed for canceled rentals?',
				'Проверявате ли историята на автомобила?'
			)
			.replaceAll('Timeframes for receiving a refund?', 'Предлагате ли доставка до друг град?')
			.replaceAll(
				'To purchase a car from our dealership, start by exploring our inventory online or visiting us in person to find the vehicle that suits your needs. Schedule a test drive to ensure it’s the right fit, then review financing or leasing options with our team.',
				'Изберете автомобил от наличността онлайн или на място в Варна, запишете оглед и тест драйв, след което уточняваме финансиране, бартер или лизинг с екипа на Приселци.'
			)
			.replaceAll(
				'Provide the necessary documents, such as your ID, proof of insurance, and income verification. Once terms are agreed upon, finalize the paperwork, inspect the car, and drive away with your new vehicle!',
				'Подгответе лична карта и нужните документи. След като се договорим за условията, оформяме документите, правите оглед на автомобила и финализираме сделката.'
			)
			.replaceAll(
				'An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.',
				'Условията зависят от конкретния автомобил и избраната схема. Свържете се с екипа на Приселци за актуална информация, оценка на замяна и съдействие по документите.'
			);
	}

	if (templateFile === 'calculator.html') {
		// Longest strings first — a bare 'Calculator' swap would break the longer matches.
		const localized = html
			.replaceAll('Car Payment Calculator', 'Калкулатор за месечна вноска')
			.replaceAll('Calculate Your Estimated Monthly', 'Изчислете ориентировъчна месечна вноска')
			.replaceAll(
				'Estimate your monthly payments and budget for your next car with ease.',
				'Ориентировъчна сметка за бюджет, първоначална вноска и месечна вноска.'
			)
			.replaceAll('Calculator FAQ', 'Често задавани въпроси')
			.replaceAll('Calculator', 'Калкулатор')
			.replaceAll(
				'Loan Term <span class="text-muted">(months)</span>',
				'Срок <span class="text-muted">(месеци)</span>'
			)
			.replaceAll('36 months', '36 месеца')
			.replaceAll('24 months', '24 месеца')
			.replaceAll('12 months', '12 месеца')
			.replaceAll('Trade In Value (Optional)', 'Бартер / замяна (по избор)')
			.replaceAll('Trade In Value', 'Бартер / замяна')
			.replaceAll('Trade-In Value?', 'Бартер / замяна?')
			// Must run before the generic 'Car Price' rule below or it never matches.
			.replaceAll('Budget & Car Price?', 'Бюджет и цена на автомобила?')
			.replaceAll('Interest Rate', 'Лихвен процент')
			.replaceAll('Est. Sales Tax', 'Такси (ориент.)')
			.replaceAll('Sales Tax', 'Данъци и такси')
			.replaceAll('Estimated Monthly Payment*', 'Ориентировъчна месечна вноска*')
			.replaceAll('Est. Interest', 'Лихва (ориент.)')
			.replaceAll('/Month', '/месец')
			.replaceAll('for 3 years', 'за срок от 3 години')
			.replaceAll('Loan Summary', 'Обобщение на сметката')
			.replaceAll('Other Fees', 'Други такси')
			.replaceAll('Not Included', 'не са включени')
			.replaceAll('Total Loan Amount', 'Обща сума за плащане')
			.replaceAll('Monthly Payment', 'Месечна вноска')
			.replaceAll('Car Price', 'Цена на автомобила')
			.replaceAll('Down Payment', 'Първоначална вноска')
			.replaceAll('Browse by Price', 'Разгледай по бюджет')
			.replaceAll('$46.300', '46 300 €')
			.replaceAll('-$400', '−400 €')
			.replaceAll('$400', '400 €')
			.replaceAll('-$0', '−0 €')
			.replaceAll('$0', '0 €')
			.replaceAll('+$880', '+880 €')
			.replaceAll('+$1.389', '+1 389 €')
			.replaceAll('$1.338', '1 338 €')
			.replaceAll('$48.169', '48 169 €')
			.replaceAll('What is an Auto Loan?', 'Какво представлява финансирането?')
			.replaceAll('How to Calculate an Auto Loan?', 'Как се изчислява месечната вноска?')
			.replace(
				/Auto loans are very common[\s\S]*?period of time\./g,
				'Голяма част от покупките на автомобили у нас се финансират — разсроченото плащане прави месечната вноска постижима, вместо да се плаща цялата цена наведнъж.'
			)
			.replace(
				/You can get an auto loan[\s\S]*?pay off the loan\./g,
				'Екипът на Приселци съдейства с варианти за финансиране, лизинг и собствено разсрочено плащане според автомобила и бюджета. Получавате ориентировъчни условия предварително и избирате най-подходящия вариант.'
			)
			// The raw template repeats the same English paragraph under all 7 FAQ
			// headings. Non-global replaces swap them out one by one, in document
			// order, so every question gets its own answer.
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Финансирането позволява да платите автомобила на месечни вноски за избран срок. Вноската зависи от цената, първоначалната вноска, срока и лихвения процент — калкулаторът дава ориентировъчна сметка преди разговор с екипа.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Месечната вноска се изчислява от цената на автомобила минус първоначалната вноска и бартера, разпределена за избрания срок, плюс лихва и такси. Променете стойностите в калкулатора и сметката се обновява веднага.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Изберете бюджет, който оставя резерв за регистрация, застраховка и поддръжка. Ориентировъчно е добре месечната вноска да не надвишава 15–20% от месечния доход — калкулаторът помага да я видите предварително.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Първоначалната вноска намалява финансираната сума и месечната вноска. По-висока първоначална вноска обикновено означава по-добри условия — екипът на Приселци предлага варианти според бюджета.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Можете да дадете настоящия си автомобил като бартер — оценката му се приспада от цената и намалява финансираната сума. Приселци прави оглед и ясна оценка преди сделката.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Към цената се добавят такси за прехвърляне, регистрация и застраховка. Калкулаторът показва ориентировъчна стойност — точните суми се уточняват при огледа според конкретния автомобил.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Лихвеният процент зависи от финансиращата институция, срока и профила на клиента. Стойността в калкулатора е ориентировъчна — екипът съдейства с конкретни оферти от партньорски банки и лизинг.'
			);

		// The template's "Browse by Price" boxes list US demo cars — render the real
		// budget tiers with live counts instead.
		const budgetTiers = [
			{ label: 'До 10 000 EUR', value: 'under-10000', limit: 10000 },
			{ label: 'До 20 000 EUR', value: 'under-20000', limit: 20000 },
			{ label: 'До 30 000 EUR', value: 'under-30000', limit: 30000 },
			{ label: 'До 50 000 EUR', value: 'under-50000', limit: 50000 },
			{ label: 'Над 50 000 EUR', value: 'over-50000', min: 50000 }
		];
		const budgetBoxes = budgetTiers
			.map((tier) => {
				const count = daynightVehicles.filter((vehicle) =>
					tier.limit !== undefined
						? vehicle.price > 0 && vehicle.price <= tier.limit
						: vehicle.price > (tier.min ?? 0)
				).length;

				return `<div class="price-box"><a href="/inventory?price=${tier.value}" class="h7 font-weight-500 mb-8 text-underline">${count} ${count === 1 ? 'автомобил' : 'автомобила'}</a><p class="h4">${tier.label}</p></div>`;
			})
			.join('\n');

		return replaceDivInnerByExactClass(
			localized,
			'grid grid-cols-5 lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 gap-20 mb-40 padding-box-20',
			budgetBoxes
		);
	}

	if (templateFile === 'compare.html') {
		const localized = html
			.replaceAll('Compare Cars Side-By-Side', 'Сравнение на автомобили')
			.replaceAll('Compare Cars Side-by-Side', 'Сравнение на автомобили')
			.replaceAll(
				'Compare features, performance, and pricing to choose the perfect car.',
				'Сравнете пробег, гориво, оборудване и цена преди оглед.'
			)
			.replaceAll('Compare', 'Сравнение');

		return replaceCompareVehicleTable(localized);
	}

	if (templateFile === 'terms.html') {
		return (
			html
				.replaceAll('Home', 'Начало')
				.replaceAll('Pages', 'Още')
				// Section-4 heading: translate the full English phrase BEFORE the
				// generic 'Terms Of Use' rule, otherwise it half-renders as
				// "Site Условия за ползване Modifications".
				.replaceAll('Site Terms Of Use Modifications', 'Промени в условията')
				.replaceAll('Site terms of use modifications', 'Промени в условията')
				.replaceAll('Terms Of Use', 'Условия за ползване')
				.replaceAll('Limitations', 'Ограничения')
				.replaceAll('Revisions And Errata', 'Актуализации')
				.replaceAll('Revisions and errata', 'Актуализации')
				.replaceAll('Risks', 'Уточнения')
				// Replace placeholder (lorem ipsum) copy with real informational BG
				// terms. Ordered LONGEST-FIRST so a shorter variant never partially
				// matches a longer paragraph that contains it as a prefix/suffix.
				.replaceAll(
					'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
					'Използвайки сайта, потребителят приема, че обявите и описанията подлежат на проверка на място и не представляват публична оферта.'
				)
				.replaceAll(
					'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis',
					'Възможно е автомобил да бъде продаден или резервиран, преди обявата да бъде обновена, затова препоръчваме предварително потвърждение на наличността.'
				)
				.replaceAll(
					'Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
					'Финансиране, разсрочено плащане и бартер се предлагат при условия, договорени индивидуално за всеки клиент.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.',
					'Приселци полага усилия съдържанието да е точно и актуално, но не носи отговорност за непълноти или технически грешки в обявите.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie ',
					'Приселци може да актуализира услугите и условията по всяко време, като валидна е версията, публикувана към момента на ползване на сайта. '
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie',
					'Снимките и описанията илюстрират конкретния автомобил, а състоянието и оборудването се потвърждават при оглед.'
				)
				.replaceAll(
					'Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.',
					'Техническите характеристики са по данни на производителя и предходния собственик и подлежат на проверка при оглед.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis.',
					'Огледът и тестът се организират предварително по уговорка в Варна.'
				)
				.replaceAll(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.',
					'Информацията в този сайт има информативен характер. Актуалните цени, наличност и условия за финансиране се потвърждават директно със Приселци преди сделка.'
				)
		);
	}

	if (templateFile === '404.html') {
		return html
			.replaceAll('Oops! Something is Missing....', '404 - страницата не е намерена')
			.replaceAll('Something is Missing....', '404 - страницата не е намерена')
			.replaceAll(
				'The page you are looking for cannot be found.',
				'Тази страница не съществува или е преместена.'
			)
			.replaceAll('Back To Homepage', 'Към началната страница');
	}

	return html;
}

function replaceAccountPageCopy(html: string, templateFile: string) {
	const withAccountChrome = html
		.replaceAll('Dashboard', daynightAccount.title)
		.replaceAll('My Listings', daynightAccount.listingsTitle)
		.replaceAll('My Listing', daynightAccount.listingsTitle)
		.replaceAll('Messages', 'Съобщения')
		.replaceAll('My Favorites', daynightAccount.favoritesTitle)
		.replaceAll('My Reviews', daynightAccount.reviewsTitle)
		.replaceAll('My Profile', daynightAccount.profileTitle)
		.replaceAll('Change Password', daynightAccount.passwordTitle)
		.replaceAll('Logout', 'Изход');

	if (templateFile === 'dashboard.html') {
		return withAccountChrome
			.replaceAll('My Listings', daynightAccount.listingsTitle)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Автомобилиs', daynightAccount.listingsTitle)
			.replaceAll('My Автомобили', daynightAccount.listingsTitle)
			.replaceAll('Messages', 'Съобщения')
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Продай автомобил', daynightAccount.newListingCta)
			.replaceAll('Show Моят профил', 'Меню профил')
			.replaceAll('Pending', 'В процес')
			.replaceAll('Car Views', 'Интерес към автомобили')
			.replaceAll('6 Month', '6 месеца')
			.replaceAll('3 Month', '3 месеца')
			.replaceAll('12 Month', '12 месеца')
			.replaceAll('All Listing', 'Всички заявки')
			.replaceAll('Sort by:', 'Сортиране:')
			.replaceAll('Newest', 'Най-нови')
			.replaceAll('Best Match', 'Най-подходящи')
			.replaceAll('Lowest Price', 'Най-ниска цена')
			.replaceAll('Highest Price', 'Най-висока цена')
			.replaceAll('Lowest Mileage', 'Най-малък пробег')
			.replaceAll('Highest Mileage', 'Най-голям пробег')
			.replaceAll('Recent Reviews', 'Последни отзиви');
	}

	if (templateFile === 'my-profile.html') {
		return withAccountChrome
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('My profile', daynightAccount.profileTitle)
			.replaceAll('Personal Information', 'Контактна информация')
			.replaceAll('Infomation', 'Информация')
			.replaceAll(
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum arcu sit amet dolor aliquet, non fermentum quam ullamcorper. Nunc iaculis arcu sed interdum suscipit. Donec quis diam a sem sagittis consequat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur a ligula magna. Maecenas nec est dignissim, molestie sem vel, tristique lacus.',
				daynightAccount.authNote
			)
			.replaceAll('Save Changes', 'Запази промените');
	}

	if (templateFile === 'my-listings.html') {
		return withAccountChrome
			.replaceAll('My Listings', daynightAccount.listingsTitle)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Автомобилиs', daynightAccount.listingsTitle)
			.replaceAll('My Автомобили', daynightAccount.listingsTitle)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Продай автомобил', daynightAccount.newListingCta)
			.replaceAll('Published', 'Изпратени заявки')
			.replaceAll('Pending', 'В процес на преглед');
	}

	if (templateFile === 'add-listings.html') {
		return withAccountChrome
			.replaceAll('Add Listings', daynightAccount.newListingCta)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Продай автомобил', daynightAccount.newListingCta)
			.replaceAll('Vehicle Information', 'Данни за автомобила')
			.replaceAll('Your Package', 'Данни за автомобила')
			.replaceAll('Save & Publish', 'Изпрати към Приселци')
			.replaceAll('Submit Listing', 'Изпрати към Приселци')
			.replaceAll('Upload Photos', 'Снимки на автомобила');
	}

	if (templateFile === 'message.html') {
		return withAccountChrome
			.replaceAll('Съобщения', daynightAccount.messagesTitle)
			.replaceAll('Messages', daynightAccount.messagesTitle)
			.replaceAll('Message', daynightAccount.messagesTitle)
			.replaceAll('Inbox', 'Входящи')
			.replaceAll('Marvin McKinney', 'Клиент от сайта')
			.replaceAll('John Smith', 'Клиент от сайта')
			.replaceAll('Brooklyn Simmons', 'Клиент от Варна')
			.replaceAll('Arlene McCoy', 'Клиент от Варна')
			.replaceAll('Darrell Steward', 'Приселци')
			.replaceAll('Theresa Webb', 'Клиент от сайта')
			.replaceAll('Aurexo Support', 'Приселци')
			.replaceAll('Приселци Support', 'Приселци')
			.replaceAll('Send Message', 'Изпрати съобщение')
			.concat(html.includes('Приселци') ? '' : ' Приселци');
	}

	if (templateFile === 'my-favorites.html') {
		return withAccountChrome
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('View Details', 'Виж автомобила');
	}

	if (templateFile === 'reviews.html') {
		return withAccountChrome
			.replaceAll('Reviews', daynightAccount.reviewsTitle)
			.replaceAll('Submit Review', 'Изпрати отзив');
	}

	if (templateFile === 'change-password.html') {
		return withAccountChrome
			.replaceAll('Change Password', daynightAccount.passwordTitle)
			.replaceAll('New Password', 'Нова парола')
			.replaceAll('Confirm Password', 'Потвърди парола');
	}

	return html;
}

function replaceVisibleTemplateFiller(html: string, templateFile: string) {
	const salesTeam = daynightTeam[0];
	const tradeInTeam = daynightTeam[1] ?? salesTeam;
	let output = html
		.replaceAll('Browse By Type', 'Автомобили по тип')
		.replaceAll('Check All Car Type', 'Виж всички типове')
		.replaceAll('Check Всички Type', 'Виж всички типове')
		.replaceAll('New Vehicles', 'Налични автомобили')
		.replaceAll('Explore Our Brands', 'Марки в наличност')
		.replaceAll('Clients Reviews', 'Отзиви от клиенти')
		.replace(/\bView All\b/g, 'Виж всички')
		.replaceAll('View Всички марки', 'Виж всички марки')
		.replaceAll('Why Choose Us?', 'Защо Приселци?')
		.replaceAll('Why Choose Us', 'Защо Приселци')
		.replaceAll(
			'Explore our wide selection, competitive prices, and exceptional service for a hassle-free car-buying experience.',
			'Изберете автомобил с ясна информация, реална наличност и съдействие при оглед, документи, регистрация и финансиране.'
		)
		.replaceAll(
			'Wide Selection – A variety of cars to fit every need.',
			'Налични автомобили за различен бюджет и нужди.'
		)
		.replaceAll(
			'Competitive Prices: Great deals and flexible financing.',
			'Ясни цени и съдействие за финансиране.'
		)
		.replaceAll(
			'Trusted Service: Transparent, honest, and reliable.',
			'Коректна информация и възможност за оглед.'
		)
		.replaceAll(
			'Excellent Support: Always here to assist you.',
			'Помощ при документи, регистрация и следващи стъпки.'
		)
		.replaceAll('Find Your Car Now!', 'Виж наличните автомобили')
		.replaceAll('18K+', `${daynightVehicles.length}+`)
		.replaceAll('Car For Sale', 'Налични автомобила')
		.replaceAll('8k+', '2019')
		.replaceAll('Visitors per day', 'присъствие в mobile.bg')
		.replaceAll('4,5k+', `${daynightBrandsInStock}`)
		.replaceAll('Dealer Reviews', 'марки в наличност')
		.replaceAll('3,5k+', '100%')
		.replaceAll('Verified Dealers', 'Автомобили от обяви')
		.replace(
			/<a href="\/sell-your-car" class="btn btn-white btn-large font-weight-600 max-w-min text-primary">\s*Виж наличните автомобили\s*<\/a>/g,
			'<a href="/inventory" class="btn btn-white btn-large font-weight-600 max-w-min text-primary">Виж наличните автомобили</a>'
		)
		.replaceAll('Want to sell your car?', 'Искате да продадете или замените автомобил?')
		.replaceAll('Want To Sell Your Car?', 'Искате да продадете или замените автомобил?')
		.replaceAll('Secure transactions and title transfer', 'Съдействие по документи и прехвърляне')
		.replaceAll('Verified community of buyers', 'Реален купувач и бартерен интерес')
		.replaceAll('Free vehicle history report', 'Преглед на състоянието и историята')
		.replaceAll('How It Works', 'Как работи')
		.replaceAll('How it works', 'Как работи')
		.replaceAll('Certified Dealers', 'Приселци')
		.replaceAll(
			'Answer a few questions about your vehicle, and then connect with one of thousands of Приселци who can pay you directly for your used car.',
			'Опишете автомобила, изпратете снимки и екипът на Приселци ще Ви изпрати следващи стъпки за оглед, покупка или бартер.'
		)
		.replaceAll('Reach Out to Us', 'Свържете се със Приселци')
		.replaceAll('Reach Out To Us', 'Свържете се със Приселци')
		.replaceAll('Get In Touch', 'Свържете се със Приселци')
		.replaceAll('get in touch', 'Свържете се със Приселци')
		.replaceAll('Have any Question?', 'Имате въпрос?')
		.replaceAll(
			'We’re here to assist with any questions, concerns, or inquiries—contact us today!',
			'Свържете се за оглед, документи, регистрация, финансиране, бартер или въпрос за наличен автомобил.'
		)
		.replaceAll(
			"We're here to assist with any questions, concerns, or inquiries—contact us today!",
			'Свържете се за оглед, документи, регистрация, финансиране, бартер или въпрос за наличен автомобил.'
		)
		.replaceAll(
			"We'd love to hear from you! If you have any questions",
			'Пишете ни за автомобил, оглед, документи или следващи стъпки.'
		)
		.replaceAll('Subscribe To Our Newletter!', 'Абонирайте се за нови обяви')
		.replaceAll(
			'Sign Up For Updates On Our Latest News & Events.',
			'Получавайте нови наличности и полезни съвети от Приселци.'
		)
		.replaceAll(
			'Sign Up For Updates On Our Latest Полезно & Events.',
			'Получавайте нови наличности и полезни съвети от Приселци.'
		)
		.replace(
			/Sign Up For Updates On Our\s*<br class="lg-hidden">\s*Latest (?:News|Полезно) & Events\./g,
			'Получавайте нови наличности и полезни съвети от Приселци.'
		)
		.replaceAll('ПолезноletterModal', 'NewsletterModal')
		.replaceAll('Enter your e-mail', 'Въведете имейл')
		.replace(/>\s*Subscribe\s*</g, '>Абонирай се<')
		.replaceAll(
			'I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.',
			'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск и без излишни обещания.'
		)
		.replaceAll(
			'Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.',
			'Екипът ми помогна да сравня няколко автомобила и да преценя бюджета с вариант за разсрочено плащане.'
		)
		.replaceAll(
			'I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!',
			'Автомобилът беше представен коректно, със снимки, цена и обяснение за състоянието. Сделката мина бързо и подредено.'
		)
		.replaceAll('Address Business', 'Адрес')
		.replaceAll('Contact Us', 'Контакти')
		.replaceAll('Working Time', 'Работно време')
		.replaceAll('Week-Day: 8:00 - 18:00', 'Делнични дни: 9:00 - 18:00')
		.replaceAll('Mon-Sat:8:00am - 18:00pm', 'Понеделник - събота: 9:00 - 18:00')
		.replaceAll('Sunday: Closed', 'Неделя: по уговорка')
		.replaceAll('Sunday: Close', 'Неделя: по уговорка')
		.replaceAll('Sun: Closed', 'Неделя: по уговорка')
		.replaceAll('Follow Us On social media:', 'Последвайте Приселци:')
		.replaceAll('First Name', 'Име')
		.replaceAll('Last Name', 'Фамилия')
		.replaceAll('Phone Number', 'Телефон')
		.replaceAll('Your Message*', 'Вашето съобщение*')
		.replaceAll('Enter your last name', 'Въведете фамилия')
		.replaceAll('Enter your email address', 'Въведете имейл')
		.replaceAll('Enter your phone number', 'Въведете телефон')
		.replaceAll('Send Message', 'Изпрати съобщение')
		.replaceAll('Frequently Asked Questions', 'Често задавани въпроси')
		.replaceAll('How To Buy?', 'Как протича покупката?')
		.replaceAll('Steps to purchase a car from our dealership?', 'Какви са стъпките за покупка?')
		.replaceAll(
			'To purchase a car from our dealership, start by exploring our inventory online or visiting us in person to find the vehicle that suits your needs. Schedule a test drive to ensure it’s the right fit, then review financing or leasing options with our team.',
			'Изберете автомобил от наличността, свържете се за оглед и уточнете документи, финансиране или бартер с екипа на Приселци.'
		)
		.replaceAll(
			'Provide the necessary documents, such as your ID, proof of insurance, and income verification. Once terms are agreed upon, finalize the paperwork, inspect the car, and drive away with your new vehicle!',
			'След потвърждение съдействаме за проверка, договор, регистрация и следващи стъпки според конкретния автомобил.'
		)
		.replaceAll(
			'Required documents for financing or leasing?',
			'Какви документи трябват за финансиране?'
		)
		.replaceAll(
			'What paperwork is needed to sell my car?',
			'Какви документи са нужни, ако продавам автомобил?'
		)
		.replaceAll(
			'Options for reserving or pre-ordering a vehicle?',
			'Може ли автомобил да бъде запазен?'
		)
		.replaceAll('Available payment methods and financing plans?', 'Какви варианти за плащане има?')
		.replaceAll('How to schedule a test drive before buying?', 'Как се организира оглед или тест?')
		.replaceAll(
			'An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.',
			'Условията се уточняват според автомобила, бюджета и документите. Екипът може да насочи към подходящ вариант и ориентировъчна месечна вноска.'
		)
		.replaceAll('Terms Of Use', 'Условия за ползване')
		.replaceAll('Terms of use', 'Условия за ползване')
		.replaceAll('Terms', 'Условия')
		.replaceAll('Limitations', 'Ограничения')
		.replaceAll('Revisions And Errata', 'Актуализации')
		.replaceAll('Revisions and errata', 'Актуализации')
		.replaceAll('Site Terms Of Use Modifications', 'Промени в условията')
		.replaceAll('Site terms of use modifications', 'Промени в условията')
		.replaceAll('Risks', 'Уточнения')
		.replaceAll(
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.',
			'Информацията в сайта има информативен характер. Актуални цени, наличност, условия за финансиране и конкретни документи се потвърждават директно със Приселци преди сделка.'
		)
		.replaceAll(
			'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
			'Снимките, описанията и техническите характеристики се поддържат добросъвестно, но клиентът следва да потвърди състояние, оборудване и документи при оглед.'
		)
		.replaceAll(
			'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie',
			'Приселци може да съдейства с документи, регистрация, финансиране, бартер и проверка според конкретния случай.'
		)
		.replaceAll('EXPERT REVIEW', 'Съвети')
		.replaceAll('EXPERT RГАЗ/БЕНЗИНIEW', 'Съвети')
		.replaceAll('Related Articles', 'Свързани материали')
		.replaceAll('Expert Review', 'Съвети')
		.replaceAll(
			'2025 BMW 5 Series Priced From $59,375; i5 Газ/Бензин From $68,275',
			'Как да изберем автомобил според бюджета'
		)
		.replaceAll('by Admin', 'Приселци')
		.replaceAll('Super Admin', 'Клиентски профил')
		.replaceAll('Or Purchase New Package', 'Заявка към Приселци')
		.replaceAll('Choose Your Package', 'Изберете услуга')
		.replaceAll('MOST POPULAR', 'Полезно')
		.replaceAll('Basic Plan', 'Основна заявка')
		.replaceAll('Starter', 'Оглед')
		.replaceAll('Professional', 'Пълно съдействие')
		.replaceAll('Executive', 'Индивидуална услуга')
		.replaceAll('Индивидуална услуга Team', 'Консултанти на Приселци')
		.replaceAll('President and Chief Индивидуална услуга Officer', 'Консултант продажби')
		.replaceAll('FREE', 'Без такса')
		.replaceAll('$5.00', 'По заявка')
		.replaceAll('$10.00', 'По заявка')
		.replaceAll('$25.00', 'По заявка')
		.replaceAll('Buy this package', 'Изпрати заявка')
		.replaceAll('List Up to 5 Cars', 'Данни за автомобила')
		.replaceAll('List Up to 10 Cars', 'Снимки и описание')
		.replaceAll('List Up to 20 Cars', 'Оценка от екипа')
		.replaceAll('List Up to 30 Cars', 'Индивидуално съдействие')
		.replaceAll('Apply for Dealer Listings', 'Заявка към Приселци')
		.replaceAll('Apply for 50 Dealer Listings', 'Разширена заявка към Приселци')
		.replaceAll('Apply for 150 Dealer Listings', 'Персонална заявка към Приселци')
		.replaceAll('Highlighted Dealer Profile', 'Контакт с консултант')
		.replaceAll('Inquiry Messenger for Buyers', 'Проследяване на запитване')
		.replaceAll('Inquiry Messenger Services', 'Проследяване на запитване')
		.replaceAll('Unlimited Video Calls with Buyers', 'Допълнителни снимки при нужда')
		.replaceAll('Unlimited Video Calls with Potential Buyers', 'Допълнителни уточнения при нужда')
		.replaceAll('24/7 Live Chat Support', 'Отговор от екипа на Приселци')
		.replaceAll('Live Chatbot', 'Контакт с екипа')
		.replaceAll('Sale Agents Detail', 'Профил на екипа')
		.replaceAll('Sale Agents List', 'Екип')
		.replaceAll('Sale Agents', 'Екипът на Приселци')
		.replaceAll('Senior Sales Agent', salesTeam?.role ?? 'Консултанти продажби')
		.replaceAll('Senior Dealer Partner', salesTeam?.role ?? 'Консултанти продажби')
		.replaceAll('Verified Dealer', 'Проверена автокъща')
		.replaceAll('Emily Johnson', 'Клиент на Приселци')
		.replaceAll('CEO Avitex', 'Клиент на Приселци')
		.replaceAll('Benjamin Parker', 'Клиент от Варна')
		.replaceAll('CEO Tesla', 'Клиент от Варна')
		.replaceAll('Olivia Williams', 'Клиент на Приселци')
		.replaceAll('CEO BMW', 'Клиент на Приселци')
		.replaceAll('CEO Приселци', 'Клиент на Приселци')
		.replaceAll('James Anderson', 'Клиент от Варна')
		.replaceAll('Project Manager', 'Клиент на Приселци')
		.replaceAll('Robert Fox', salesTeam?.name ?? 'Приселци Sales Team')
		.replaceAll('Bessie Cooper', tradeInTeam?.name ?? 'Приселци Trade-In Team')
		.replaceAll('Brooklyn Simmons', salesTeam?.name ?? 'Приселци Sales Team')
		.replaceAll('Kristin Watson', tradeInTeam?.name ?? 'Приселци Trade-In Team')
		.replaceAll('Guy Hawkins', salesTeam?.name ?? 'Приселци Sales Team')
		.replaceAll('Darrell Steward', salesTeam?.name ?? 'Приселци Sales Team')
		.replaceAll('Cody Fisher', tradeInTeam?.name ?? 'Приселци Trade-In Team')
		.replaceAll('Eleanor Pena', salesTeam?.name ?? 'Приселци Sales Team')
		.replaceAll('Los Angeles,California', 'Варна, България')
		.replaceAll('FROM:', 'Локация:')
		.replaceAll('two-sided marketplace business', 'дейността на Приселци')
		.replaceAll(
			'responsible for driving profitable growth strategies for its two-sided marketplace business, Society6.',
			'отговаря за ясна комуникация, огледи, документи и следващи стъпки при покупка или бартер.'
		)
		.replaceAll(
			'Prior to Leaf Group, Oliver was Director of Finance at Ogin, Inc., a private equity backed clean technology company.',
			'Екипът работи с реална информация за наличност, цена, пробег и състояние на автомобила.'
		)
		.replaceAll('How the adventure ended will...', 'Проверен автомобил от Приселци.')
		.replaceAll('How the adventure ended will be seen soon.', 'Проверен автомобил от Приселци.')
		.replaceAll('Vehicle Information', 'Данни за автомобила')
		.replaceAll('Car Details', 'Данни за автомобила')
		.replace(
			/<a href="#" class="flex gap-16">/g,
			`<a href="tel:${daynightSite.phone}" class="flex gap-16">`
		)
		.replace(
			/<a href="#" class="h4 font-weight-600 mb-8 capitalize">/g,
			'<a href="/contact" class="h4 font-weight-600 mb-8 capitalize" title="Свържете се със Приселци за тази услуга">'
		)
		.replace(
			/<a href="#" class="h4 font-weight-600 mb-8">/g,
			'<a href="/sell-your-car/request" class="h4 font-weight-600 mb-8" title="Изпратете заявка към Приселци">'
		)
		.replace(
			/<a href="#" class="([^"]*\bhover-fill-white\b[^"]*)">/g,
			'<a href="/contact" class="$1">'
		)
		.replace(
			/<a href="#" class="([^"]*\bhover-stroke-white\b[^"]*)">/g,
			'<a href="/contact" class="$1">'
		)
		.replace(
			/<a href="#" class="([^"]*\bhover-stroke-hover\b[^"]*)">/g,
			'<a href="/contact" class="$1">'
		)
		.replace(
			/<a href="#">\s*<img class="h-40" src="\/assets\/images\/brand\/app-store-primary\.png" alt="app-store">/g,
			'<a href="/contact" title="Мобилно приложение на Приселци"><img class="h-40" src="/assets/images/brand/app-store-primary.png" alt="app-store">'
		)
		.replace(
			/<a href="#">\s*<img class="h-40" src="\/assets\/images\/brand\/google-play-primary\.png" alt="google-play">/g,
			'<a href="/contact" title="Мобилно приложение на Приселци"><img class="h-40" src="/assets/images/brand/google-play-primary.png" alt="google-play">'
		)
		.replaceAll(
			'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience.',
			salesTeam?.bio ??
				'Екипът съдейства при избор на автомобил, оглед, документи, бартер, финансиране и регистрация.'
		)
		.replaceAll(
			'His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with his clients, always prioritizing trust and transparency.',
			'Работата на екипа е да даде ясна информация за автомобилите и да подготви следващите стъпки без излишно забавяне.'
		);

	if (templateFile === 'sale-agents.html' || templateFile === 'sale-agents-details.html') {
		output = output.replace(
			/src="\/assets\/images\/avatar\/avatar-\d+\.png"/g,
			`src="${salesTeam?.image ?? daynightSite.logoDark}"`
		);
	}

	if (templateFile === '404.html') {
		output = output
			.replaceAll(
				'The page you are looking for cannot be found. take a break before trying again',
				'Тази страница не съществува или е преместена.'
			)
			.replaceAll(' take a break before trying again', '')
			.replaceAll('take a break before trying again', '')
			.replaceAll('oops!', 'Oops!')
			.replace(
				'<div class="content">',
				`<div class="content"><img class="daynight-header-logo__image mb-24" src="${daynightSite.logoDark}" alt="${daynightSite.shortName}" style="width: 172px; height: auto;">`
			);
	}

	return output;
}

function buildPresentationWhatsAppUrl() {
	const normalizedPhone = daynightSite.phone.startsWith('0')
		? `359${daynightSite.phone.slice(1)}`
		: daynightSite.phone;

	return `https://wa.me/${normalizedPhone}`;
}

function buildPaginationHref(routePath: string, page: number) {
	if (page <= 1) {
		return routePath;
	}

	return `${routePath}?page=${page}`;
}

function replacePaginationHashLinks(html: string, routePath: string) {
	let index = 0;

	return html.replace(/<a href="#" class="pagination__link([^"]*)">/g, (_match, suffix: string) => {
		index += 1;
		const href =
			index <= 3 ? buildPaginationHref(routePath, index) : buildPaginationHref(routePath, 2);

		return `<a href="${href}" class="pagination__link${suffix}">`;
	});
}

function syncDeadCardAnchorsToCardRoutes(html: string) {
	const cardRoutes = [
		...html.matchAll(/<div class="card-box[^"]*"[\s\S]*?<div class="image">\s*<a href="([^"]+)">/g)
	].map((match) => match[1]);

	let brandIndex = 0;
	const withBrandLinks = html.replace(
		/<a href="#" class="text-white uppercase text-xs">/g,
		() =>
			`<a href="${cardRoutes[brandIndex++] ?? '/inventory'}" class="text-white uppercase text-xs">`
	);

	let titleIndex = 0;
	return withBrandLinks.replace(
		/(<p class="h6 card-box__title mb-(?:4|8)">\s*<a )href="#"/g,
		(_match, prefix: string) => `${prefix}href="${cardRoutes[titleIndex++] ?? '/inventory'}"`
	);
}

function replaceRemainingPresentationLinks(html: string, templateFile: string, routePath: string) {
	const whatsappUrl = buildPresentationWhatsAppUrl();
	let output = html;

	if (
		templateFile === 'listing-gridstyle-halfmap.html' ||
		templateFile === 'clients-reviews.html' ||
		templateFile === 'sale-agents.html' ||
		templateFile === 'blog-standard.html' ||
		templateFile === 'blog-grid-style-1.html'
	) {
		output = replacePaginationHashLinks(output, routePath);
	}

	if (templateFile === 'listing-details-3.html') {
		output = syncDeadCardAnchorsToCardRoutes(output)
			.replace(
				/<a href="#" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" data-modal-id="#CardModal">/g,
				'<a href="/compare" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" title="Сравни автомобила">'
			)
			.replace(
				/<a class="listing-details-item--button" href="#">\s*<img src="\/assets\/icons\/playcircle\.svg" alt="play">\s*Play Video\s*<\/a>/g,
				'<a class="listing-details-item--button" href="/contact" title="Видео преглед"><img src="/assets/icons/playcircle.svg" alt="" aria-hidden="true">Видео преглед</a>'
			)
			.replace(
				/<a href="#" class="text-sm text-underline text-highlight">Виж локация<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-sm text-underline text-highlight" target="_blank" rel="noopener">Виж локация</a>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight text-sm">\s*Виж локация\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">Виж локация</a>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight ?" id="coreDropdownBtn">Vehicle in the VAT system<\/a>/g,
				'<a href="/terms" class="text-underline text-highlight" id="coreDropdownBtn">Автомобил по ДДС</a>'
			)
			.replace(
				/<a href="#" class="text-underline text-highlight ?">Vehicle in the VAT system<\/a>/g,
				'<a href="/terms" class="text-underline text-highlight">Автомобил по ДДС</a>'
			)
			.replace(
				/<a href="#" class="h4 mb-8 font-weight-600">Приселци<\/a>/g,
				'<a href="/about/daynight-auto-plovdiv" class="h4 mb-8 font-weight-600">Приселци</a>'
			)
			.replace(
				/<a href="#">\s*гр\. Варна, Варна, гр. Варна, бул. „Цар Освободител“ 285, бул. „Цар Освободител“ 285\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener">${daynightSite.location}</a>`
			)
			.replace(
				/<a href="#" class="btn btn-medium btn-primary-4 font-weight-600 gap-5">([\s\S]*?Chat via WhatsApp\s*)<\/a>/g,
				`<a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-medium btn-primary-4 font-weight-600 gap-5">$1</a>`
			)
			.replace(
				/<a href="#" class="text-xs text-underline text-highlight">Visitor Agreement\.<\/a>/g,
				'<a href="/terms" class="text-xs text-underline text-highlight">Споразумение с потребителите.</a>'
			);
	}

	if (templateFile === 'dealer-details.html') {
		output = syncDeadCardAnchorsToCardRoutes(output);
		output = replaceDivInnerByExactClass(
			output,
			'grid grid-cols-1 gap-20 mb-40',
			renderInventoryMapCardCollection(3)
		);
		output = output
			.replace(
				/<a href="#">\s*гр\. Варна, Варна, гр. Варна, бул. „Цар Освободител“ 285, бул. „Цар Освободител“ 285\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener">${daynightSite.location}</a>`
			)
			.replace(
				/<ul class="contact-info mb-28">\s*<li class="items-center">\s*<p class="icon"><img src="\/assets\/icons\/PhoneCall\.svg" alt="phone"><\/p>\s*<div class="flex flex-col">\s*<a href="tel:[^"]+">\s*[^<]+\s*<\/a>\s*<a href="tel:[^"]+">\s*[^<]+\s*<\/a>\s*<\/div>\s*<\/li>\s*<\/ul>/,
				`<ul class="contact-info mb-28">
								<li class="items-center">
									<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone"></p>
									<div class="flex flex-col">
										<a href="tel:${daynightSite.phone}">
											${daynightSite.phoneLabel}
										</a>
										<a href="mailto:${daynightSite.email}">
											${daynightSite.email}
										</a>
									</div>
								</li>
							</ul>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight text-sm">\s*Get Directions\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">Виж локация</a>`
			)
			.replace(
				/<a href="[^"]+" class="btn btn-medium btn-primary-3 font-weight-600(?: mb-12)? gap-5">([\s\S]*?<img src="[^"]*PhoneCall-2\.svg"[^>]*>[\s\S]*?)<\/a>/g,
				(match, inner) =>
					`<a href="tel:${daynightSite.phone}" class="${match.includes('mb-12') ? 'btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5' : 'btn btn-medium btn-primary-3 font-weight-600 gap-5'}">${inner}</a>`
			)
			.replace(
				/<a href="[^"]+"(?: target="_blank" rel="noopener")? class="btn btn-medium btn-primary-4 font-weight-600(?: mb-12)? gap-5">([\s\S]*?<img src="[^"]*ChatCircleDots\.svg"[^>]*>[\s\S]*?)<\/a>/g,
				(match, inner) =>
					`<a href="${whatsappUrl}" target="_blank" rel="noopener" class="${match.includes('mb-12') ? 'btn btn-medium btn-primary-4 font-weight-600 mb-12 gap-5' : 'btn btn-medium btn-primary-4 font-weight-600 gap-5'}">${inner}</a>`
			)
			.replace(/Write a review/gi, 'Добавете отзив')
			.replace(/View more reviews \(98\)/gi, daynightSite.reviewLinkLabel)
			.replace(/\(1,968 Ratings\)/g, `(${daynightSite.reviewCountLabel})`)
			.replace(/add a review/gi, 'Добавете отзив')
			.replace(/August 13, 2025/g, 'Август 2025')
			.replace(/August 22, 2025/g, 'Август 2025')
			.replace(/August 18, 2025/g, 'Август 2025')
			.replace(/Randynox/g, 'Иван Димитров')
			.replace(/Mista Nyroom/g, 'Мария Георгиева')
			.replace(
				/Bought new in 2012, and it’s still running strong at over 180,000 miles\. I’ve only had to replace the battery and brakes once\. The ride is smooth, the interior still feels solid, and the fuel economy hasn’t dropped much\./g,
				'Получих коректна информация за автомобила, пробега и документите още преди огледа. Сделката мина спокойно и без излишни обещания.'
			)
			.replace(
				/Picked this car up used about five years ago with 90k miles\. It’s now at 160k and still starts every morning without hesitation\. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives\./g,
				'Екипът помогна да сравня няколко автомобила и да планирам бюджета с вариант за финансиране. Огледът беше организиран бързо и подредено.'
			)
			.replace(
				/<form action="#" class="add-review-form">/i,
				'<form action="/contact?intent=review" class="add-review-form" title="Отзивите се потвърждават от екипа преди публикуване.">'
			)
			.replace(
				/<input class="input-large" name="email-review" id="email-review" type="text" value="[^"]+" required="" \/>/i,
				'<input class="input-large" name="email-review" id="email-review" type="text" value="" placeholder="Вашият имейл" required="" />'
			);
	}

	if (templateFile === 'sale-agents-details.html') {
		const slug = routePath.split('/').at(-1) ?? '';
		const member = getDayNightTeamMemberBySlug(slug) ?? daynightTeam[0];

		output = syncDeadCardAnchorsToCardRoutes(output);
		output = replaceDivInnerByExactClass(
			output,
			'grid grid-cols-1 gap-20 mb-40',
			renderInventoryMapCardCollection(3)
		);
		output = replaceWidgetMapByClass(
			output,
			'widget-gg-map flex radius-8 overflow-hidden mb-28',
			'234'
		);
		output = output
			.replace(
				/<a href="#">\s*гр\. Варна, Варна, гр. Варна, бул. „Цар Освободител“ 285, бул. „Цар Освободител“ 285\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener">${daynightSite.location}</a>`
			)
			.replace(
				/<ul class="contact-info mb-28">\s*<li class="items-center">\s*<p class="icon"><img src="\/assets\/icons\/PhoneCall\.svg" alt="phone"><\/p>\s*<div class="flex flex-col">\s*<a href="tel:[^"]+">\s*[^<]+\s*<\/a>\s*<a href="tel:[^"]+">\s*[^<]+\s*<\/a>\s*<\/div>\s*<\/li>\s*<\/ul>/,
				`<ul class="contact-info mb-28">
								<li class="items-center">
									<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone"></p>
									<div class="flex flex-col">
										<a href="tel:${daynightSite.phone}">
											${daynightSite.phoneLabel}
										</a>
										<a href="mailto:${daynightSite.email}">
											${daynightSite.email}
										</a>
									</div>
								</li>
							</ul>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight text-sm">\s*(?:Get Directions|Виж локация)\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">Виж локация</a>`
			)
			.replace(
				/<a href="[^"]+" class="btn btn-medium btn-primary-3 font-weight-600(?: mb-12)? gap-5">([\s\S]*?<img src="[^"]*PhoneCall-2\.svg"[^>]*>[\s\S]*?)<\/a>/g,
				(match, inner) =>
					`<a href="tel:${daynightSite.phone}" class="${match.includes('mb-12') ? 'btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5' : 'btn btn-medium btn-primary-3 font-weight-600 gap-5'}">${inner}</a>`
			)
			.replace(
				/<a href="[^"]+"(?: target="_blank" rel="noopener")? class="btn btn-medium btn-primary-4 font-weight-600(?: mb-12)? gap-5">([\s\S]*?<img src="[^"]*ChatCircleDots\.svg"[^>]*>[\s\S]*?)<\/a>/g,
				(match, inner) =>
					`<a href="${whatsappUrl}" target="_blank" rel="noopener" class="${match.includes('mb-12') ? 'btn btn-medium btn-primary-4 font-weight-600 mb-12 gap-5' : 'btn btn-medium btn-primary-4 font-weight-600 gap-5'}">${inner}</a>`
			)
			.replace(/Write A Review/gi, 'Добавете отзив')
			.replace(/View More Reviews \(98\)/gi, daynightSite.reviewLinkLabel)
			.replace(/Add A Review/gi, 'Добавете отзив')
			.replace(/\(1,968 Ratings\)/g, `(${daynightSite.reviewCountLabel})`)
			.replace(/August 13, 2025/g, 'Август 2025')
			.replace(/August 22, 2025/g, 'Август 2025')
			.replace(/August 18, 2025/g, 'Август 2025')
			.replace(
				/<form action="#" class="send-inquiry">/i,
				'<form action="/contact?intent=team" class="send-inquiry">'
			)
			.replace(
				/<form action="#" class="add-review-form">/i,
				'<form action="/contact?intent=review" class="add-review-form" title="Отзивите се потвърждават от екипа преди публикуване.">'
			)
			.replace(
				/<input class="input-large" name="email-review" id="email-review" type="text" value="[^"]+" required="" \/>/i,
				'<input class="input-large" name="email-review" id="email-review" type="text" value="" placeholder="Вашият имейл" required="" />'
			)
			.replace(
				/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">[\s\S]*?<\/button>/i,
				'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Отзивите се потвърждават от екипа преди публикуване.">Изпратете отзив</a>'
			)
			.replace(
				/<button class="btn btn-primary btn-large font-weight-600 w-full">\s*Изпрати запитване\s*<\/button>/i,
				'<button class="btn btn-primary btn-large font-weight-600 w-full">Изпрати запитване</button>'
			)
			.replaceAll('Изпрати запитване about Vehicle', 'Изпрати запитване')
			.replaceAll('Интерес за оглед 2', 'Бартер или оценка')
			.replaceAll('Интерес за оглед 3', 'Документи и финансиране')
			.replaceAll('<p class="mb-6">Message</p>', '<p class="mb-6">Съобщение</p>')
			.replaceAll('value="demo@getrich.local"', 'value="" placeholder="Вашият имейл"')
			.replaceAll(
				'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
				'Искам да получавам информация за наличност и следващи стъпки по това запитване.'
			)
			.replaceAll('By using this service, you accept our ', 'С изпращането на формата приемате ')
			.replaceAll('Visitor Agreement.', 'условията за ползване.')
			.replaceAll('CEO Приселци', 'Клиент на Приселци')
			.replaceAll(
				member?.name ?? '',
				member?.name ?? daynightTeam[0]?.name ?? 'Екипът на Приселци'
			);
	}

	if (templateFile === 'services-center.html') {
		output = output
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Вашето име"')
			.replaceAll('value="themesflat@gmail.com"', 'value="" placeholder="Вашият имейл"')
			.replaceAll('value="demo@getrich.local"', 'value="" placeholder="Вашият имейл"')
			.replaceAll('value="01/23/2024"', 'value=""')
			.replaceAll('value="2024-01-23"', 'value=""')
			.replaceAll('Phone (optional)', 'Телефон')
			.replaceAll('placeholder="Телефон (optional)"', 'placeholder="Телефон"')
			.replace(
				/<a href="tel:0886 251 705" class="text-sm text-white">0886 251 705<\/a>\s*<a href="tel:0886 251 705" class="text-sm text-white">0886 251 705<\/a>/,
				'<a href="tel:0886 251 705" class="text-sm text-white">0886 251 705</a><a href="mailto:demo@getrich.local" class="text-sm text-white">demo@getrich.local</a>'
			)
			.replaceAll('Огледи: с предварителна уговорка', 'Огледи: с предварителна уговорка')
			.replaceAll(
				'Документи и предаване: след потвърждение',
				'Документи и предаване: след потвърждение'
			)
			.replace(
				/<select class="select-style-2" name="SendInquirybrand" id="SendInquirybrand">[\s\S]*?<\/select>/,
				`<select class="select-style-2" name="SendInquirybrand" id="SendInquirybrand">
									<option>Изберете марка</option>
									<option>BMW</option>
									<option>Mercedes-Benz</option>
									<option>Audi</option>
									<option>Toyota</option>
									<option>Honda</option>
									<option>Volvo</option>
									<option>Chrysler</option>
								</select>`
			)
			.replace(
				/<select class="select-style-2" name="SendInquirymodel" id="SendInquirymodel">[\s\S]*?<\/select>/,
				`<select class="select-style-2" name="SendInquirymodel" id="SendInquirymodel">
									<option>Изберете модел</option>
									<option>Ще уточня с екипа</option>
									<option>Все още избирам</option>
								</select>`
			)
			.replace(
				/<form action="#" class="send-inquiry">/i,
				'<form action="/services?service=inspection#services-request" class="send-inquiry">'
			)
			.replace(
				/name="SendInquiryphone" id="SendInquiryphone" type="number"/,
				'name="SendInquiryphone" id="SendInquiryphone" type="tel"'
			);
	}

	if (templateFile === 'add-listings-2.html') {
		output = output
			.replace(
				/<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600">\s*Преглед на заявката\s*<\/a>/g,
				'<a href="/sell-your-car/request?preview=1" class="btn btn-line-1 px-24 btn-large font-weight-600" title="Преглед на заявката">Преглед на заявката</a>'
			)
			.replace(
				/<a href="#" class="btn btn-primary px-24 btn-large font-weight-600">\s*Изпрати заявка\s*<\/a>/g,
				'<a href="/sell-your-car/request" class="btn btn-primary px-24 btn-large font-weight-600">Изпрати заявка</a>'
			)
			.replace(/<a class="item" href="#">/g, `<a class="item" href="/contact">`);
	}

	if (templateFile === 'financing.html') {
		output = output
			.replaceAll('Search by your monthly budget', 'Търсете според месечния бюджет')
			.replaceAll('Select an offer on the car', 'Изберете подходяща оферта')
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">Изпратете запитване<\/a>/g,
				'<a href="/contact?intent=financing" class="h4 font-weight-600 mb-8 capitalize text-center">Изпратете запитване</a>'
			)
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">\s*Търсете според месечния бюджет\s*<\/a>/g,
				'<a href="/calculator" class="h4 font-weight-600 mb-8 capitalize text-center">Търсете според месечния бюджет</a>'
			)
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">Изберете подходяща оферта<\/a>/g,
				'<a href="/inventory" class="h4 font-weight-600 mb-8 capitalize text-center">Изберете подходяща оферта</a>'
			);
	}

	if (templateFile === 'sale-agents.html') {
		output = output.replace(
			/<a href="#">(\s*<svg[\s\S]*?<\/svg>\s*)<\/a>/g,
			`<a href="/contact">$1</a>`
		);
	}

	if (templateFile === 'blog-details-1.html' || templateFile === 'blog-details-2.html') {
		output = output
			.replace(
				/<a href="#" class="comments-post([^"]*)">/g,
				'<a href="/contact" class="comments-post$1">'
			)
			.replace(
				/<a href="#" class="h4 mb-8 font-weight-600">Приселци<\/a>/g,
				'<a href="/about/daynight-auto-plovdiv" class="h4 mb-8 font-weight-600">Приселци</a>'
			)
			.replace(
				/<a class="text-white" href="#">Приселци<\/a>/g,
				'<a class="text-white" href="/about/daynight-auto-plovdiv">Приселци</a>'
			)
			.replace(
				/<a class="text-white" href="#">Aug\. 8, 2025<\/a>/g,
				'<a class="text-white" href="/blog">Aug. 8, 2025</a>'
			)
			.replace(
				/<a class="uppercase text-underline text-highlight" href="#">СЪВЕТИ<\/a>/g,
				'<a class="uppercase text-underline text-highlight" href="/blog">СЪВЕТИ</a>'
			);
	}

	return output;
}

export function applyDayNightTemplateContent(
	html: string,
	templateFile: string,
	routePath: string,
	context?: DayNightTemplateContentContext
) {
	let output = replaceSupportPageCopy(html, templateFile, routePath);
	output = replaceSupportPageChrome(output, templateFile);
	output = replaceCommonCopy(output);
	output = replaceAccountPageCopy(output, templateFile);
	output = replaceDashboardAccountHeader(output, templateFile);

	if (
		templateFile === 'listing-grid4-columns.html' ||
		templateFile === 'listing-gridstyle-halfmap.html'
	) {
		output = replaceInventoryCopy(output, templateFile);
		output = replaceMapModeEmbed(output, templateFile);
	}

	if (templateFile === 'listing-details-3.html') {
		output = replacePdpCopy(output, routePath);
	}

	if (templateFile === 'blog-standard.html' || templateFile === 'blog-grid-style-1.html') {
		output = replaceBlogIndexCopy(output, templateFile, context);
	}

	if (templateFile === 'blog-details-1.html' || templateFile === 'blog-details-2.html') {
		output = replaceBlogDetailCopy(output, routePath, context);
	}

	if (templateFile === 'compare.html') {
		output = replaceInventoryCopy(output, templateFile);
	}

	if (!output.includes('Автомобили')) {
		output = output.replace(daynightSite.sellCarCta, 'Автомобили');
	}

	output = replaceSharedVehicleSnippets(output);
	if (templateFile === 'about-us.html') {
		output = replaceAboutBrandCarousel(output);
	}
	output = replaceTemplateFileLinks(output);
	output = replacePresentationFooter(output);
	output = replaceVisibleTemplateFiller(output, templateFile);
	output = replaceRemainingPresentationLinks(output, templateFile, routePath);
	output = replaceSharedCounterMetrics(output);

	return restoreTemplateAssetPaths(output)
		.replaceAll('Car Dealer, Rental & Listing HTML Template', 'Приселци Варна')
		.replaceAll('Aurexo |', 'Приселци |');
}
