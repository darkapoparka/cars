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
					.replaceAll('Tampa, FL', 'Dallas')
					.replaceAll('GA 30328', '')
					.replaceAll('VIEW ON MAP', 'VIEW MAP')
					.replaceAll('View on map', 'View map')
					.replaceAll('https://themeforest.net/user/themesflat', '/')
					.replaceAll('themeforest.net/user/themesflat', '/')
					.replaceAll('themesflat', 'daynightauto')
					.replaceAll('Add Listing', daynightSite.sellCarCta)
					.replaceAll('Sign In', daynightSite.accountCta)
					.replaceAll('Dealer Listings', 'dealership inquiries')
					.replaceAll('Dealer Listing', 'Texas Drive Auto Dallas profile')
					.replaceAll(
						'Mike Hanley (@mike_hanley) is a writer who draws. He’s the Bestselling author of “Number of The Year”.',
						'Explore practical tips on buying, viewing vehicles, paperwork, buyer-arranged funding, and next steps in this Texas Drive Auto preview.'
					)
					.replaceAll('Mike Hanley', 'Texas Drive Auto')
					.replaceAll('@mike_hanley', '@daynightauto')
					.replaceAll('Michael Carter', 'Texas Drive Auto preview placeholder')
					.replaceAll('Sophia Carter', 'Customer from Dallas')
					.replaceAll('Contact', 'Contact')
					.replaceAll('About', 'About us')
					.replaceAll('News', 'Helpful')
					.replaceAll('Contact Us', 'Contact')
					.replaceAll('Heather Dick', 'Texas Drive Auto preview placeholder')
					.replaceAll(
						'Owned since 2010. Drove it through all kinds of weather, from hot summers to snowy roads, and it never let me down. A few minor repairs here and there — mostly wear and tear — but the engine just keeps going.',
						'Customer reviews are unavailable in this preview. Ask about vehicle condition, price, paperwork, and next steps.'
					)
					.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
					.replaceAll('Add A Review', 'Add a review')
					.replaceAll('Login To Add A Review', 'Sign in to add a review')
					.replaceAll('Your email address will not be published', 'Your email won’t be published')
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
								.replace(daynightSite.accountCta, 'Staff sign-in')
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
	aboutExterior: '/assets/images/pages/daynight-about-lot-v1.webp',
	aboutConsultation: '/assets/images/pages/daynight-about-consultation-v1.webp',
	aboutShowroomVehicle: '/assets/images/pages/daynight-about-showroom-suv-v1.webp',
	servicesInspection: '/assets/images/pages/daynight-services-inspection-v1.webp',
	servicesConsultation: '/assets/images/pages/daynight-services-consultation-v1.webp',
	dealerProfileMark: '/brand/daynight-logo-generated.png'
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
		title: 'About Texas Drive Auto',
		description:
			'Ask about vehicle condition, available history records, and purchase paperwork.',
		image: daynightPageAssets.aboutExterior,
		primaryHref: '/inventory',
		primaryLabel: 'View vehicles',
		secondaryHref: '/contact',
		secondaryLabel: 'Get in touch'
	},
	'sell-your-car.html': {
		modifier: 'sell',
		title: 'Explore selling or trading in your car',
		description:
			'Prepare your vehicle details and ask about purchase options. Trade-in and customer listing options are unconfirmed in this preview.',
		image: daynightPageAssets.aboutConsultation,
		primaryHref: '/sell-your-car/request',
		primaryLabel: 'Submit request',
		secondaryHref: '/sell-your-car/request',
		secondaryLabel: 'Contact the dealership'
	},
	'services-center.html': {
		modifier: 'services',
		title: 'Services',
		description: 'Ask about viewings, paperwork, and registration. Trade-in and delivery details are unavailable in this preview. No dealer financing or payment plans.',
		image: daynightPageAssets.servicesInspection,
		primaryHref: '/services?service=inspection#services-request',
		primaryLabel: 'Draft an inquiry',
		secondaryHref: '/inventory',
		secondaryLabel: 'View vehicles'
	}
};

function buildDayNightMapIframe(height: string, loading: 'lazy' | 'eager' = 'lazy') {
	// The Google Maps embed pulls ~2MB of map JS. Defer it: render without `src` and let
	// TemplateLocalBehaviors load it (via IntersectionObserver) when scrolled into view.
	return `<iframe title="Map to Texas Drive Auto" data-map-src="${daynightMapEmbedSrc}" data-daynight-scroll-map height="${height}" style="border:0;width: 100%;" allowfullscreen="" loading="${loading}" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
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
									<a href="mailto:${member.email}" title="Email Texas Drive Auto" aria-label="Email Texas Drive Auto">
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
									<a href="mailto:${member.email}" title="Email ${member.name}" aria-label="Email ${member.name}">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<path d="M3.75 7.5L10.94 12.2933C11.5667 12.7111 12.4333 12.7111 13.06 12.2933L20.25 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M4.5 5.25H19.5C20.3284 5.25 21 5.92157 21 6.75V17.25C21 18.0784 20.3284 18.75 19.5 18.75H4.5C3.67157 18.75 3 18.0784 3 17.25V6.75C3 5.92157 3.67157 5.25 4.5 5.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</a>
								</li>
								<li>
									<a href="${route}" title="View profile" aria-label="View profile">
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
								<a href="https://www.facebook.com/61566304063141/" target="_blank" rel="noopener" class="hover-fill-white" title="Facebook" aria-label="Facebook">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M11.5541 20V10.8777H14.6148L15.074 7.32156H11.5541V5.05147C11.5541 4.0222 11.8387 3.32076 13.3164 3.32076L15.1979 3.31999V0.13923C14.8725 0.0969453 13.7556 0 12.4556 0C9.74098 0 7.88252 1.65697 7.88252 4.69927V7.32156H4.8125V10.8777H7.88252V20H11.5541Z" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="https://www.instagram.com/daynight.auto.plovdiv/" target="_blank" rel="noopener" class="hover-stroke-white" title="Instagram" aria-label="Instagram">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="#1C1C1C" stroke-width="1.5"/>
										<circle cx="10" cy="10" r="3.15" stroke="#1C1C1C" stroke-width="1.5"/>
										<circle cx="14.05" cy="5.95" r="0.9" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="tel:${daynightSite.phone}" class="hover-stroke-white" title="Contact Texas Drive Auto by phone or Viber." aria-label="Contact Texas Drive Auto by phone or Viber.">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="${daynightSite.sourceInventory}" target="_blank" rel="noopener" class="hover-stroke-white" title="View available vehicles on mobile.bg" aria-label="View available vehicles on mobile.bg">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M3 12.5L4.6 8.8C4.95 7.98 5.76 7.44 6.65 7.44H13.35C14.24 7.44 15.05 7.98 15.4 8.8L17 12.5" stroke="#1C1C1C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M4 12.5H16.1C16.87 12.5 17.5 13.13 17.5 13.9V14.7C17.5 15.47 16.87 16.1 16.1 16.1H3.9C3.13 16.1 2.5 15.47 2.5 14.7V13.9C2.5 13.13 3.13 12.5 3.9 12.5H4Z" stroke="#1C1C1C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="5.7" cy="14.35" r="1.05" fill="#1C1C1C"/>
										<circle cx="14.3" cy="14.35" r="1.05" fill="#1C1C1C"/>
									</svg>
								</a>
							</li>
							<li>
								<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="hover-stroke-white" title="Open the Texas Drive Auto location in Google Maps" aria-label="Open the Texas Drive Auto location in Google Maps">
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
					<h2 class="">Vehicle makes</h2>
					<a href="/inventory" class="btn btn-line btn-large hover-fill-white effect-line-primary">
						View inventory
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
								<span>Customer profile</span>
								<strong>${title}</strong>
							</div>
							<div class="daynight-dashboard-header__actions">
								<a class="daynight-dashboard-header__ghost" href="/inventory">Vehicle inventory</a>
								<a class="daynight-dashboard-header__user" href="/admin/settings">
									<img class="avatar" src="/assets/images/dashboard/dashbroard_avatar.png" alt="">
									<span>Customer profile</span>
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
			.replaceAll('$44.900,00', first.priceLabel)
			.replaceAll('$40.900,00', second.priceLabel)
			.replaceAll('$42.800,00', second.priceLabel)
			.replaceAll('$45.500,00', third.priceLabel)
			.replaceAll('$35.500,00', fourth.priceLabel)
			.replaceAll('$45.500', fifth.priceLabel)
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
			.replaceAll('See Finance', 'View payment information')
			.replaceAll('View details', 'View details')
			.replaceAll('>Auto<', '>Automatic<')
			.replaceAll('Benzin', 'Gasoline')
			.replace(/\$(\d[\d.,]*)\s*\/mo/g, (_match, amount) => `${amount} USD/mo.`)
			.replace(/(\d[\d ,]*)\s*miles\b/g, (_match, amount) => `${amount.trim()} mi`)
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
			/<p class="font-weight-500 text-muted h7 text-center">Ask about vehicle inspections<\/p>/,
			'<p class="font-weight-500 text-muted h7 text-center">ask about paperwork</p>'
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
		.replaceAll('Filters', 'Filters')
		.replaceAll('Best Match', 'Best match')
		.replaceAll('Lowest Price', 'Lowest price')
		.replaceAll('Highest Price', 'Highest price')
		.replaceAll('Lowest Mileage', 'Lowest mileage')
		.replaceAll('Highest Mileage', 'Highest mileage')
		.replaceAll('Nearest Location', 'Nearest')
		.replaceAll('Best Deal', 'Best deal')
		.replaceAll('Newest Year', 'Newest year')
		.replaceAll('Oldest Year', 'Oldest year')
		.replaceAll('Newest Listed', 'Newest listings')
		.replaceAll('Oldest Listed', 'Oldest listings')
		.replaceAll('Sort Vehicles by', 'Sorting')
		.replaceAll('27 matches', `${daynightVehicles.length} vehicles`)
		.replaceAll('183 ', `${daynightVehicles.length} `)
		.replaceAll(' matches', ' vehicles')
		.replaceAll('No accidents', 'Accident history unverified')
		.replaceAll('Great Price', 'Good price')
		.replaceAll('Black', 'Black')
		.replaceAll('White', 'White')
		.replaceAll('Gray', 'Gray')
		.replaceAll('Red', 'Red')
		.replaceAll('Blue', 'Blue')
		.replaceAll('REMOVE ALL', 'Clear')
		.replaceAll('Remove All', 'Clear')
		.replaceAll('Special', 'Featured')
		.replaceAll('Compare', 'Compare')
		.replaceAll('View details', 'View details')
		.replaceAll('See Finance', 'Buyer-arranged funding')
		.replaceAll(
			'How the adventure ended will be seen soon. Aouda was anxious...',
			first.conditionLine
		)
		.replaceAll('Price & Payment', 'Price and payment')
		.replaceAll('Full Price', 'Full price')
		.replaceAll('Monthly', 'Monthly (buyer-arranged funding)')
		.replaceAll('Min price', 'Minimum price')
		.replaceAll('Max price', 'Maximum price')
		.replaceAll('Body Style', 'Coupe')
		.replaceAll('Sedan', 'Sedan')
		.replaceAll('SUV', 'SUV')
		.replaceAll('Hatchback', 'Hatchback')
		.replaceAll('Fuel Type', 'Fuel')
		.replaceAll('Electrical', 'Electric')
		.replaceAll('Petrol', 'Gasoline')
		.replaceAll('Diesel', 'Diesel')
		.replaceAll('Transmission', 'Transmission')
		.replaceAll('Automatic', 'Automatic')
		.replaceAll('Manual', 'Manual')
		.replaceAll('Door count', 'Number of doors')
		.replaceAll('4 doors', '4 doors')
		.replaceAll('3 doors', '3 doors')
		.replaceAll('Cylinders', 'Cylinders')
		.replaceAll('4 cylinders', '4 cylinders')
		.replaceAll('6 cylinders', '6 cylinders')
		.replaceAll('8 cylinders', '8 cylinders')
		.replaceAll('Exterior color', 'Exterior color')
		.replaceAll('Interior color', 'Interior color')
		.replaceAll('Features', 'Features')
		.replaceAll('Adaptive Control', 'Adaptive cruise control')
		.replaceAll('Apple CarPlay', 'Apple CarPlay')
		.replaceAll('Alloy Wheels', 'Alloy wheels')
		.replaceAll('Brake Assist', 'Brake assist')
		.replaceAll('Tow Hitch', 'Tow hitch')
		.replaceAll('Autopilot', 'Driver assistance')
		.replaceAll('Android Auto', 'Android Auto')
		.replaceAll('Moonroof', 'Panoramic roof')
		.replaceAll('Show 1,029 Matches', 'Browse available vehicles')
		.replaceAll('Mileage:', 'Mileage:')
		.replaceAll('Years:', 'Year:')
		.replaceAll('Fuel:', 'Fuel:')
		.replaceAll('Color:', 'Color:')
		.replaceAll('Location:', 'Location:')
		.replaceAll('Interior:', 'Interior:')
		.replaceAll('Engine:', 'Engine:')
		.replaceAll('VIN:', 'Reference number:')
		.replaceAll('Stock Number:', 'Stock number:')
		.replaceAll('Tampa, FL', 'Dallas')
		.replaceAll('Listing GridStyle Half Map', 'Available vehicles map')
		.replaceAll('Listing GridStyle HalfMap', 'Available vehicles map')
		.replaceAll('Grid Style Half Map', 'Available vehicles map')
		.replaceAll('Vehicles GridStyle Half Map', 'Available vehicles map')
		.replaceAll('Vehicles GridStyle HalfMap', 'Available vehicles map')
		.replaceAll('Listing Grid 4 Columns', 'Available vehicles')
		.replaceAll('Vehicles Grid 4 Columns', 'Vehicle inventory')
		.replaceAll('Showing 1 – 30 of 118 Listings', `Showing ${daynightVehicles.length} vehicles`)
		.replaceAll(
			'Showing 1 – 30 of 118 Vehicles',
			`Showing ${daynightVehicles.length} vehicles`
		);

	return templateFile === 'listing-gridstyle-halfmap.html'
		? output.replace(
				`<p class="md-hidden">Showing ${daynightVehicles.length} vehicles</p>`,
				`<p class="md-hidden">Available vehicle map · ${daynightVehicles.length} vehicles</p>`
			)
		: output;
}

function replaceMapModeEmbed(html: string, templateFile: string) {
	if (templateFile !== 'listing-gridstyle-halfmap.html') {
		return html;
	}

	const mapEmbed = `<div id="map" data-map-zoom="16" data-map-scroll="true"><iframe title="Map to Texas Drive Auto" data-map-src="${daynightMapEmbedSrc}" data-daynight-scroll-map width="100%" height="100%" style="border:0;display:block;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;

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
		name: 'Customer from Dallas',
		label: 'Purchase and paperwork',
		text: 'Customer reviews are unavailable in this preview. Ask about the vehicle, paperwork, next steps, and arranging a viewing.'
	},
	{
		name: 'Texas Drive Auto preview placeholder',
		label: 'Buyer-arranged funding',
		text: 'How can I compare vehicles and set a budget? Dealer financing and payment plans are not offered; any funding must be arranged independently.'
	},
	{
		name: 'Preview customer example',
		label: 'Inspection and trade-in questions',
		text: 'What vehicle details, trade-in options, and registration requirements should I confirm before buying?'
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
									<a href="${href}" aria-label="View ${escapeHtml(vehicle.shortTitle)}">
										<img class="mb-10 radius-16 image" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.shortTitle)}" loading="lazy">
									</a>
									<p class="h4 text-center"><a href="${href}">${escapeHtml(vehicle.shortTitle)}</a></p>
									<p class="text-secondary text-center">${escapeHtml(vehicle.priceLabel)}</p>
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
								'Mileage',
								vehicles.map((vehicle) => vehicle.mileage)
							),
							renderCompareSpecRow(
								'years',
								'Year',
								vehicles.map((vehicle) => String(vehicle.year))
							),
							renderCompareSpecRow(
								'fuel',
								'Fuel',
								vehicles.map((vehicle) => vehicle.fuel)
							),
							renderCompareSpecRow(
								'transmission',
								'Transmission',
								vehicles.map((vehicle) => vehicle.transmission)
							),
							renderCompareSpecRow(
								'auto',
								'Coupe',
								vehicles.map((vehicle) => vehicle.body)
							),
							renderCompareSpecRow(
								'engine',
								'Engine',
								vehicles.map((vehicle) => vehicle.engine)
							),
							renderCompareSpecRow(
								'icon-gauge',
								'Power',
								vehicles.map((vehicle) => vehicle.power)
							),
							renderCompareSpecRow(
								'color',
								'Color',
								vehicles.map((vehicle) => vehicle.color)
							),
							renderCompareSpecRow(
								'location',
								'Location',
								vehicles.map(() => daynightSite.location)
							),
							renderCompareSpecRow(
								'QrCode',
								'Reference number',
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
			<h2>Customer reviews unavailable in this preview</h2>
			<a href="/reviews" class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">View all</a>
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
				<p class="eyebrow">Showroom location</p>
				<h2>Review vehicle history and the buying process</h2>
				<p class="text-secondary h7 line-height-28">Explore the Texas Drive Auto vehicle preview. Confirm availability, inspection options, paperwork, registration requirements, and whether trade-ins are accepted. Dealer financing and payment plans are not offered.</p>
				<ul class="daynight-about-location__list">
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Ask about on-site and independent shop inspections</li>
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Ask about paperwork and registration; no dealer financing</li>
					<li><img src="/assets/icons/check.svg" alt="" aria-hidden="true">Ask about trade-ins, appraisals, and vehicle searches</li>
				</ul>
				<div class="daynight-about-location__actions">
					<a href="/inventory" class="btn btn-primary btn-large font-weight-600">View vehicles</a>
					<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="btn btn-line btn-large font-weight-600">View location</a>
				</div>
			</div>
			<div class="daynight-about-location__visual">
				<div class="daynight-about-location__images">
					<img src="${daynightPageAssets.aboutShowroomVehicle}" alt="Texas Drive Auto showroom">
					<img src="${daynightPageAssets.aboutConsultation}" alt="Contact Texas Drive Auto">
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
	let output = replaceSectionByMarker(html, 'Buying questions', '');
	output = replaceSectionByMarker(output, 'Explore vehicles at Texas Drive Auto', '');

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
	const financeMonthly = vehicle.monthly.replace(/^from\s+/i, '');

	if (!vehicle) return html;

	let output = html
		// Replace the whole English marketing paragraph first, before the title/brand/year
		// swaps below mutate its inner words (which is why the old exact-string match failed).
		.replace(/The 2024 - 2025 Honda HR-V is offered[\s\S]*?RM 141,900\./, () => vehicle.description)
		.replaceAll('Audi A6 Avant e-tron', vehicle.title)
		.replaceAll('Audi A6 Avant E-Tron', vehicle.title)
		.replaceAll('BMW I7', vehicle.title)
		.replaceAll('$245/mo', `${vehicle.priceLabel} ${vehicle.monthly}`)
		.replaceAll('$44.900,00', vehicle.priceLabel)
		.replaceAll('$44.900', vehicle.priceLabel)
		.replaceAll('51600 km', vehicle.mileage)
		.replaceAll('2022', String(vehicle.year))
		.replaceAll('Benzin + Plin', vehicle.fuel)
		.replaceAll('Tampa, FL', 'Dallas')
		.replaceAll('White', vehicle.color)
		.replaceAll('Jet Black', 'Dark interior')
		.replaceAll('1.5L Inline', vehicle.engine)
		.replaceAll('Automatic', vehicle.transmission)
		.replace('1G1ZD5ST0PF', 'ask at the viewing')
		.replaceAll('1G1ZD5ST0PF', vehicle.lot)
		.replaceAll('165921', vehicle.lot)
		.replaceAll('Mike Hanley', salesTeam?.name ?? 'Texas Drive Auto')
		.replaceAll('Verified Dealer', 'Dealership preview')
		.replaceAll('/assets/images/pages/sale-agent-9.jpg', salesTeam?.image ?? daynightSite.logoDark)
		.replaceAll('Get Directions', 'View location')
		.replaceAll('Call To Dealer', daynightSite.phoneCta)
		.replaceAll('Send Inquiry About Vehicle', 'Draft a vehicle inquiry')
		.replaceAll('Honda HR-V', vehicle.shortTitle)
		.replaceAll('RM 115,900', vehicle.priceLabel)
		.replaceAll('RM 141,900', vehicle.secondaryPrice)
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
		.replaceAll('<li>Cash</li>', '<li>Cash</li>')
		.replaceAll('<li class="active">Finance</li>', '<li class="active">Buyer-arranged funding</li>')
		// Price block
		.replaceAll('Price:', 'Price:')
		.replaceAll('List price w/o taxes, fees, and accessories', 'Price before taxes and fees')
		.replaceAll('Finance payment w/o taxes, fees, and accessories', 'Buyer-arranged payment estimate before taxes and fees')
		.replaceAll(
			'$1,560 due at signing · 72 mo · 7.89% APR',
			'Buyer-arranged funding example: down payment · 72 mo. · 7.89% APR'
		)
		.replaceAll('Special tax on motor vehicles:', 'Vehicle tax:')
		.replaceAll('Price with special tax:', 'Price including tax:')
		.replaceAll('Vehicle in the VAT system', 'VAT status')
		// Car overview
		.replaceAll('Car Overview', 'Vehicle overview')
		.replaceAll('Mileage:', 'Mileage:')
		.replaceAll('Years:', 'Year:')
		.replaceAll('Fuel:', 'Fuel:')
		.replaceAll('Color:', 'Color:')
		.replaceAll('Location:', 'Location:')
		.replaceAll('Interior:', 'Interior:')
		.replaceAll('Engine:', 'Engine:')
		.replaceAll('Transmission:', 'Transmission:')
		.replaceAll('Stock Number:', 'Reference No.:')
		// Description + spec tabs
		.replaceAll('<p class="h4 mb-16">Description</p>', '<p class="h4 mb-16">Description</p>')
		.replaceAll('Get To Know this car', 'Explore the vehicle')
		.replaceAll('>Exterior</span>', '>Exterior</span>')
		.replaceAll('>Interior</span>', '>Interior</span>')
		.replaceAll('>Safety</span>', '>Safety</span>')
		.replaceAll('>Mechanical</span>', '>Mechanical</span>')
		.replaceAll('>Technology</span>', '>Technology</span>')
		.replaceAll('>Other</span>', '>Other</span>')
		// Feature lists (default visible tab)
		.replaceAll('Child Safety Locks', 'Child safety locks')
		.replaceAll('Dual front impact airbags', 'Front airbags')
		.replaceAll('Daytime Running Lights', 'Daytime running lights')
		.replaceAll('Panic alarm', 'Panic alarm')
		.replaceAll('Driver Air Bag', 'Driver airbag')
		.replaceAll('Passenger Air Bag', 'Passenger airbag')
		.replaceAll('Security System', 'Security system')
		.replaceAll('Security system', 'Security system')
		// Financing calculator
		.replaceAll('Financing Calculator', 'Buyer-arranged funding calculator')
		.replaceAll('Car Price', 'Vehicle price')
		.replaceAll('Interest Rate', 'Buyer-arranged interest rate')
		.replaceAll('Loan Term (months)', 'Term (months)')
		.replaceAll('Down Payment', 'Down payment')
		.replaceAll('>Calculate</button>', '>Calculate</button>')
		.replaceAll('Monthly Payment:', 'Estimated monthly payment:')
		.replaceAll('Total Interest Payment:', 'Interest and fees:')
		.replaceAll('Est. Total Loan:', 'Estimated price:')
		.replaceAll('60 months', '60 months')
		.replaceAll('30 months', '30 months')
		.replaceAll('10 months', '10 months')
		.replaceAll('$46.300|', vehicle.priceLabel)
		.replaceAll('value="$400"', 'value="Request a quote"')
		.replaceAll('$788.56/Month', financeMonthly)
		.replaceAll('$1413.60', 'to be confirmed')
		.replaceAll('$47713.60', vehicle.secondaryPrice)
		.replaceAll('$23.577', vehicle.secondaryPrice)
		.replaceAll('$1.322', 'to be confirmed')
		.replaceAll('$24.900', vehicle.secondaryPrice)
		// Inquiry form
		.replaceAll('Send Inquiry about Vehicle', 'Vehicle inquiry')
		.replaceAll('>Name</p>', '>Name</p>')
		.replaceAll('>Email</p>', '>Email</p>')
		.replaceAll('>Phone</p>', '>Phone</p>')
		.replaceAll('>Subject</p>', '>Subject</p>')
		.replaceAll('>Message</p>', '>Message</p>')
		.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Your name"')
		.replaceAll('placeholder="Phone (optional)"', 'placeholder="Phone (optional)"')
		.replaceAll("This Vehicle's Availability 2", 'Price and viewing')
		.replaceAll("This Vehicle's Availability 3", 'Buyer-arranged funding')
		.replaceAll("This Vehicle's Availability", 'Vehicle availability')
		.replaceAll('placeholder="Comment"', 'placeholder="Your message"')
		.replaceAll('Send Inquiry', 'Send inquiry')
		.replaceAll(
			'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			'Yes, I’d like price alerts and useful information about this vehicle.'
		)
		.replaceAll('By using this service, you accept our', 'By using this service, you accept our')
		.replaceAll('Visitor Agreement.', 'User Agreement.')
		.replaceAll('Play Video', 'Video overview')
		.replaceAll('View All Photo', 'View all photos')
		.replaceAll('View All Photos', 'View all photos')
		.replaceAll('Write A Review', 'Add feedback')
		.replaceAll('Write a review', 'Add feedback')
		.replaceAll('Login To Add A Review', 'Sign in to add a review')
		.replaceAll('Login to add a Review', 'Sign in to add a review')
		.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
		.replaceAll('View more reviews', daynightSite.reviewLinkLabel)
		.replaceAll('Customer Reviews', 'Customer reviews unavailable in this preview')
		.replaceAll('Add A Review', 'Add feedback')
		.replaceAll('Add a review', 'Add feedback')
		.replaceAll('Chat via WhatsApp', 'Viber / WhatsApp')
		.replaceAll('Prev', 'PREVIOUS')
		.replaceAll('Next', 'NEXT')
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

const blogCategories = ['News', 'Tips', 'Buyer-arranged funding', 'Paperwork', 'Makes'] as const;

function formatArticleDate(value: string) {
	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(`${value}T00:00:00+02:00`));
}

function renderArticleMeta(article: DayNightArticle, textClass = 'text-sm') {
	const categoryClass = `${textClass} text-highlight uppercase text-underline`;

	return `<div class="flex gap-12 justify-start mb-12">
		<span class="${textClass}">from ${escapeHtml(article.author)}</span>
		<span class="${textClass}">${escapeHtml(formatArticleDate(article.date))}</span>
		<span class="${categoryClass}">${escapeHtml(article.category)}</span>
	</div>`;
}

function renderFeaturedArticleMeta(article: DayNightArticle) {
	return `<div class="flex gap-12 justify-start mb-2">
		<span class="text-white text-xs">from ${escapeHtml(article.author)}</span>
		<span class="text-white text-xs">${escapeHtml(formatArticleDate(article.date))}</span>
		<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(article.category)}</span>
	</div>`;
}

function articleArchiveValue(article: DayNightArticle) {
	return article.date.slice(0, 7);
}

function formatArticleArchive(value: string) {
	return new Intl.DateTimeFormat('en-US', {
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
	return category === 'All'
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
	<input class="input-normal" type="search" name="q" id="blog-search" placeholder="Search news..." data-daynight-blog-search />
	<button type="submit" class="widget-search-btn" aria-label="Search">${renderBlogSearchIcon()}</button>
</form>`;
}

function renderBlogCategoriesWidget(articles: DayNightArticle[]) {
	const links = [
		`<li>${renderBlogSidebarLink('all', '', 'All posts', articles.length, true)}</li>`,
		...blogCategories
			.map((category) => ({ category, count: countBlogCategory(category, articles) }))
			.filter(({ count }) => count > 0)
			.map(
				({ category, count }) =>
					`<li>${renderBlogSidebarLink('category', category, category, count)}</li>`
			)
	].join('\n');

	return `<p class="h4 mb-16">Categories</p>
<ul class="widget-categories mb-32">
	${links}
</ul>`;
}

function renderBlogRecentMeta(article: DayNightArticle) {
	return `<div class="flex gap-12 md-gap-6 justify-start mb-6">
	<span class="text-xs">from ${escapeHtml(article.author)}</span>
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

	return `<p class="h4 mb-16 capitalize">Recent posts</p>
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

	return `<p class="h4 mb-16">Archive</p>
<ul class="widget-categories mb-32">
	${links}
</ul>`;
}

function renderBlogTagsWidget(articles: DayNightArticle[]) {
	const tags = [...new Set(articles.flatMap((article) => article.tags))]
		.sort((first, second) => first.localeCompare(second, 'en-US'))
		.slice(0, 12)
		.map(
			(tag) => `<li>
	${renderBlogSidebarLink('tag', tag, tag)}
</li>`
		)
		.join('\n');

	return `<p class="h4 mb-16">Tags</p>
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
		return `<p class="h5 text-secondary mb-40">No Texas Drive Auto posts are available in this preview.</p>`;
	}

	return `<div data-daynight-blog-index>
	${renderBlogFeaturedCard(featured)}
	<div class="grid grid-cols-2 md-grid-cols-1 gap-y-40 gap-x-30 mb-40">
		${cards.map((article) => renderBlogIndexCard(article)).join('\n')}
	</div>
	<p class="h5 text-secondary mb-40 daynight-blog-empty" hidden>No posts match the selected filters.</p>
</div>`;
}

function replaceBlogGridIndexCopy(html: string, articles: DayNightArticle[]) {
	const cards = articles.map((article) => renderBlogIndexCard(article)).join('\n');

	let output = html
		.replaceAll('Blog Grid Style 1', 'Tips and news')
		.replaceAll('News', 'Helpful')
		.replaceAll('Home', 'Home');

	output = replaceDivInnerByExactClass(
		output,
		'grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30 mb-40',
		cards
	);

	return output
		.replaceAll('EXPERT REVIEW', 'TIPS')
		.replaceAll('PERFORMANCE', 'TIPS')
		.replaceAll('LUXURY', 'MAKES')
		.replaceAll('DESIGN', 'DOCUMENTS')
		.replaceAll('REVIEWS', 'TIPS')
		.replaceAll('TREND', 'NEWS')
		.replaceAll('MAINTENANCE', 'TIPS')
		.replaceAll('TIPS', 'TIPS');
}

function replaceBlogStandardIndexCopy(html: string, articles: DayNightArticle[]) {
	let output = html
		.replaceAll('Blog Standard', 'Tips and news')
		.replaceAll('News', 'Helpful')
		.replaceAll('Home', 'Home');

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
		<p>Topic:</p>
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
	const shareUrl = encodeURIComponent(`https://daynight.mobile.bg${blogArticleRoute(article)}`);

	return `<ul class="blog-detail-social flex gap-12">
	<li>
		<p>Share:</p>
	</li>
	<li><a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on Facebook">${renderBlogSocialIcon('facebook')}</a></li>
	<li><a href="https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on X">${renderBlogSocialIcon('x')}</a></li>
	<li><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">${renderBlogSocialIcon('instagram')}</a></li>
	<li><a href="mailto:?subject=${shareText}&body=${shareUrl}" aria-label="Send by email">${renderBlogSocialIcon('mail')}</a></li>
</ul>`;
}

function renderBlogDetailAuthorBox() {
	return `<div class="mb-40">
	<div class="listing-details--contact-dealer mb-20">
		<img src="${daynightPageAssets.dealerProfileMark}" alt="${daynightSite.shortName}">
		<div class="content">
			<a href="/about/daynight-auto-plovdiv" class="h4 mb-4 font-weight-600">Texas Drive Auto</a>
			<p class="text-secondary mb-18">Used-car dealership</p>
			<ul class="blog-detail-social flex gap-12">
				<li><a href="https://www.facebook.com/61566304063141/" target="_blank" rel="noopener" aria-label="Facebook page">${renderBlogSocialIcon('facebook')}</a></li>
				<li><a href="https://www.instagram.com/daynight.auto.plovdiv/" target="_blank" rel="noopener" aria-label="Instagram profile">${renderBlogSocialIcon('instagram')}</a></li>
				<li><a href="mailto:${daynightSite.email}" aria-label="Email Texas Drive Auto">${renderBlogSocialIcon('mail')}</a></li>
			</ul>
		</div>
	</div>
	<p class="h7 line-height-28">This Texas Drive Auto preview includes general used-car buying topics: availability, inspections, paperwork, registration, and independently arranged funding. Dealer financing and payment plans are not offered.</p>
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
		<p class="font-weight-600 text-highlight uppercase mb-4">PREVIOUS</p>
		<a href="${blogArticleRoute(previous)}" class="h5 font-weight-500 capitalize">${escapeHtml(previous.title)}</a>
	</div>
	<div class="next">
		<p class="font-weight-600 text-highlight uppercase mb-4 text-right">NEXT</p>
		<a href="${blogArticleRoute(next)}" class="h5 font-weight-500 text-right capitalize">${escapeHtml(next.title)}</a>
	</div>
</div>`;
}

function renderBlogDetailComments() {
	const comments = [
		{
			name: 'Ivan Dimitrov',
			time: '1 day ago',
			text: 'What should a checklist cover before inspecting and buying a vehicle?',
			avatar: '/assets/images/blog/comments-post-1.jpg',
			inner: false
		},
		{
			name: 'Maria Georgieva',
			time: '2 days ago',
			text: 'I’m looking for a vehicle within a specific budget. Can I get some guidance?',
			avatar: '/assets/images/blog/comments-post-2.jpg',
			inner: true
		},
		{
			name: 'Texas Drive Auto',
			time: '2 days ago',
			text: 'Start by comparing your budget, mileage, fuel type, and confirmed availability before scheduling an inspection.',
			avatar: daynightPageAssets.dealerProfileMark,
			inner: false
		}
	];

	return `<p class="h3 mb-20">03 comments</p>
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
			<p class="text-underline font-weight-600 text-highlight">Reply</p>
		</div>
	</a>`
		)
		.join('\n')}
</div>`;
}

function renderBlogDetailCommentForm() {
	return `<form action="/contact?intent=blog-comment" class="blog-detail-comment-form">
	<p class="h3 mb-24 capitalize">Leave a comment</p>
	<div class="grid grid-cols-2 gap-22 mb-16 md-grid-cols-1">
		<div class="md-col-span-2">
			<p class="mb-8">Your name</p>
			<input class="active input-large" id="name-comment" name="name-review" type="text" value="" placeholder="Your name" required>
		</div>
		<div class="md-col-span-2">
			<p class="mb-8">Your email</p>
			<input class="input-large" name="email-comment" id="email-review" type="email" value="" placeholder="Your email" required>
		</div>
		<div class="col-span-2 padding-0">
			<p class="mb-8">Comment</p>
			<textarea placeholder="Write a comment" rows="3" tabindex="5" name="comment" class="message" id="comment" required></textarea>
		</div>
	</div>
	<label class="filter-checkbox style-2 style-3 mb-28">
		<input type="checkbox" name="remember-comment" value="yes">
		<span>Save name and email for my next comment</span>
	</label>
	<button class="btn btn-primary-3 btn-large font-weight-600 capitalize">Draft comment</button>
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
				<p class="h4 mb-14 capitalize">"An informed choice starts with paperwork, vehicle history, an in-person inspection, and a clear budget."</p>
				<p class="h7 flex items-center gap-8">
					<img src="/assets/icons/line.svg" alt="quote">
					Texas Drive Auto
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
		<p class="h4 mb-12">Conclusion</p>
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
		<h2 class="mb-12 text-center">More on this topic</h2>
		<p class="h7 text-secondary mb-40 text-center">News and practical tips on buying, paperwork, buyer-arranged funding, and availability.</p>
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
								<span class="text-white text-xs">from ${escapeHtml(related.author)}</span>
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
	const uppercaseCategory = article.category.toLocaleUpperCase('en-US');
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
		.replaceAll('by Admin', `from ${article.author}`)
		.replaceAll('Admin', article.author)
		.replaceAll('John Smith', 'Texas Drive Auto')
		.replaceAll('August 5, 2025', formattedDate)
		.replaceAll('Aug. 5, 2025', formattedDate)
		.replaceAll('3. Performance and Capability', '3. Compare price, maintenance costs, and independently arranged funding')
		.replaceAll('PERFORMANCE', 'TIPS')
		.replaceAll('Performance', 'Tips')
		.replaceAll(
			'"Choosing the right SUV isn’t just about size—it’s about finding the perfect fit for your lifestyle, needs, and adventures."',
			'An informed choice starts with paperwork, vehicle history, an in-person inspection, and a clear budget.'
		)
		.replaceAll('Nelson Mandela', 'Texas Drive Auto')
		.replaceAll(
			'From the size and space they offer to their fuel efficiency, performance capabilities, and overall cost of ownership, each type of SUV caters to different priorities and preferences. By carefully weighing these aspects, you can make a more informed choice that not only meets your immediate requirements but also supports your long-term goals and lifestyle.',
			article.body[0] ?? article.description
		)
		.replaceAll('1. Size and Space', '1. Check the vehicle’s origin and paperwork')
		.replaceAll(
			'Full-size SUVs offer more interior space, making them ideal for larger families or those who need more cargo capacity. On the other hand, compact SUVs are more maneuverable and easier to park, making them a great choice for urban driving.',
			article.body[1] ?? article.description
		)
		.replaceAll('2. Fuel Efficiency', '2. Take your time inspecting the vehicle')
		.replaceAll(
			'Generally, compact SUVs tend to be more fuel-efficient compared to their full-size counterparts. If fuel economy is a priority for you, a compact SUV could save you money on gas over time.',
			article.body[2] ?? article.description
		)
		.replaceAll('3. Tips and Capability', '3. Compare price, maintenance costs, and independently arranged funding')
		.replaceAll(
			'Full-size SUVs often come with more powerful engines and greater towing capacity, making them suitable for off-road adventures and heavy-duty hauling. Compact SUVs, while still capable, might not offer the same level of performance and capability as full-size models.',
			article.body[3] ?? article.description
		)
		.replaceAll('4. Cost', '4. Confirm the next steps before finalizing')
		.replaceAll(
			'Cost is another key differentiator. Full-size SUVs typically come with a higher price tag, both in terms of the purchase price and ongoing maintenance costs. Compact SUVs are generally more affordable, making them a budget-friendly option for many buyers.',
			article.body[4] ?? article.description
		)
		.replaceAll('Conclusion', 'Conclusion')
		.replaceAll(
			'Choosing between a compact SUV and a full-size SUV depends on your specific needs, whether that’s maximizing fuel efficiency, interior space, or performance. Understanding these differences can help you make a more informed decision that aligns with your lifestyle and budget.',
			article.body[5] ?? article.description
		)
		.replaceAll('Tag:', 'Topic:')
		.replaceAll('Luxury', 'Buying')
		.replaceAll('Share this post:', 'Share:')
		.replaceAll('PREVIOUS', 'PREVIOUS')
		.replaceAll('Home', 'Home')
		.replaceAll(
			'Truck vs. Minivan: Which is Better for Family Needs?',
			articles[1]?.title ?? 'Independently arranged used-car funding'
		)
		.replaceAll('NEXT', 'NEXT')
		.replaceAll(
			'Tires: All-Season vs. Summer vs. Winter – What You Need to Know',
			articles[2]?.title ?? 'Vehicle paperwork and registration'
		)
		.replaceAll('03 Comments', '03 comments')
		.replaceAll('1 days ago', '1 day ago')
		.replaceAll('2 days ago', '2 days ago')
		.replaceAll('3 days ago', '3 days ago')
		.replaceAll(
			'Great article! Understanding the differences between compact and full-size SUVs helped my decision.',
			'What should a checklist cover before inspecting and buying a vehicle?'
		)
		.replaceAll(
			'Interesting read! I’m looking for advice on choosing the right SUV. Any recommendations?',
			'I’m looking for a vehicle within a specific budget. Can I get some guidance?'
		)
		.replaceAll(
			'Glad you found it helpful! Choosing between compact and full-size SUVs impacts convenience.',
			'Start by comparing your budget, mileage, fuel type, and confirmed availability.'
		)
		.replaceAll('Reply', 'Reply')
		.replaceAll('Leave A comment', 'Leave a comment')
		.replaceAll('You Name (Public)', 'Your name')
		.replaceAll('Your email (private)', 'Your email')
		.replaceAll('Comment', 'Comment')
		.replaceAll('Post Comment', 'Draft comment')
		.replaceAll('Categories', 'Categories')
		.replaceAll('Auto Maintenance', 'Support')
		.replaceAll('Car Buying Tips', 'Buying tips')
		.replaceAll('Car Technology', 'Technology')
		.replaceAll('Electric & Hybrid Cars', 'Electric and hybrid vehicles')
		.replaceAll('Road Trips & Travel', 'Travel')
		.replaceAll('Recent posts', 'Recent posts')
		.replaceAll('Related Articles', 'More on this topic')
		.replaceAll(
			'Get the latest insights, expert tips, and updates to stay informed and inspired.',
			'News and practical tips on buying, paperwork, buyer-arranged funding, and availability.'
		)
		.replaceAll('2025 BMW 5 Series Priced From $59,375; i5 EV From $68,275', secondaryArticle.title)
		.replaceAll('Expert Review', 'TIPS')
		.replaceAll('NEWS', uppercaseCategory)
		.replaceAll(
			"Top 5 Tips for Maintaining Your Car's Resale Value",
			articles[3]?.title ?? 'What to check when buying a premium vehicle'
		)
		.replaceAll('Leave A Comment', 'Leave a comment');

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
			.replaceAll('About Us', 'About Texas Drive Auto')
			.replaceAll(
				'Premium vehicles for every lifestyle',
				'used-car listings and questions about paperwork, registration, and inspections. Dealer financing and payment plans are not offered.'
			)
			.replaceAll('Quality Services', 'used-car listings')
			.replaceAll(
				'Driving Your Ultimate Automotive Dreams Forward',
				'Review vehicle history and the buying process'
			)
			.replaceAll(
				'At Texas Drive Auto, we make car ownership simple and accessible with expert guidance, personalized solutions, and exceptional service. Our team is committed to helping you find the perfect vehicle while ensuring a hassle-free experience.',
				'Use the Texas Drive Auto preview to prepare questions about vehicle selection, inspections, paperwork, registration, and next steps. Any funding must be arranged independently.'
			)
			.replaceAll('Experienced Automotive Experts', 'Ask about vehicle selection and inspections')
			.replaceAll('Transparent Pricing, No Hidden Fees', 'Confirm prices and terms')
			.replaceAll('Quick Process, Smooth Transactions', 'Review the buying process')
			.replaceAll('Clients Reviews', 'Customer reviews unavailable in this preview')
			.replaceAll('Individual Service Team', 'Texas Drive Auto staff details are unavailable in this preview')
			.replaceAll('Service team details unavailable in this preview', 'Texas Drive Auto staff details are unavailable in this preview')
			.replaceAll('President and Chief Individual Service Officer', 'Sample sales consultant role')
			.replaceAll('Leadership details unavailable in this preview', 'Sample sales consultant role')
			.replaceAll('Chief Operating Officer', 'Appraisal, purchase, and trade-in questions')
			.replaceAll('Chief Revenue Officer', 'Sample sales consultant role')
			.replaceAll('Chief Financial Officer', 'Customer service contact unavailable in this preview')
			.replace(
				/<p class="text-secondary h7 line-height-28 mb-32">[\s\S]*?<\/p>/,
				'<p class="text-secondary h7 line-height-28 mb-32">Explore the Texas Drive Auto vehicle preview. Verify each vehicle’s condition and origin, and ask about appraisals, paperwork, and registration. Purchase and trade-in services are unconfirmed. Dealer financing and payment plans are not offered.</p>'
			)
			.replace(
				/At Texas Drive Auto, we make car ownership simple and accessible[\s\S]*?hassle-free experience\./,
				'Explore the Texas Drive Auto vehicle preview. Verify each vehicle’s condition and origin, and ask about appraisals, paperwork, and registration. Purchase and trade-in services are unconfirmed. Dealer financing and payment plans are not offered.'
			)
			.replaceAll('/assets/images/pages/about-1.jpg', daynightPageAssets.aboutExterior)
			.replaceAll('/assets/images/pages/about-2.jpg', daynightPageAssets.aboutConsultation)
			.replaceAll('/assets/images/card/why-choose-us.webp', daynightPageAssets.aboutShowroomVehicle)
			.replaceAll('Have any Question?', 'Have a question?');

		output = replaceDivInnerByExactClass(output, daynightTeamGridClass, renderTeamGrid('about'));
		output = replaceAboutBrandCarousel(output);
		output = polishAboutPageStructure(output);

		return output;
	}

	if (templateFile === 'financing.html') {
		return html
			.replaceAll('Financing', 'No dealer financing or payment plans')
			.replaceAll('Auto loan calculator', 'Independent funding estimate calculator')
			.replaceAll('How it works', 'Understanding buyer-arranged funding')
			.replaceAll(
				'Find the right car with the right features for the right budget.',
				'Review your budget and any independently arranged funding before a viewing. Calculator results are hypothetical estimates.'
			)
			.replaceAll('Start with getting prequalified', 'Draft an inquiry')
			.replaceAll('Shop with your terms', 'Confirm the terms')
			.replaceAll('Explore financing offers', 'Choose a suitable option');
	}

	if (templateFile === 'sell-your-car.html') {
		return html
			.replaceAll('Sell Your Car', 'Ask about selling or trading in your vehicle')
			.replaceAll('Get a fair price', 'Does Texas Drive Auto buy vehicles or accept trade-ins?')
			.replaceAll('Certified Dealers', 'Texas Drive Auto')
			.replaceAll(
				'Answer a few questions about your vehicle, and then connect with one of thousands of Certified Dealers who can pay you directly for your used car.',
				'Describe your vehicle and add photos to a draft inquiry about inspections, selling, or trading in. These services are unconfirmed in this preview.'
			)
			.replaceAll('Secure Transactions And Title Transfer', 'Questions about paperwork and title transfer')
			.replaceAll('Secure Transactions', 'Paperwork questions')
			.replaceAll('Title Transfer', 'and title transfer')
			.replaceAll('Verified Community Of Buyers', 'Ask about purchase and trade-in interest')
			.replaceAll('Verified Community', 'Ask about purchase interest')
			.replaceAll('Of Buyers', 'and trade-in interest')
			.replaceAll('Free Vehicle History Report', 'Review condition and history')
			.replaceAll('Vehicle History Report', 'Review condition and history')
			.replaceAll('Have any Question?', 'Have a question?')
			.replaceAll('License Plate', 'License plate number')
			.replaceAll('Enter VIN Number', 'Enter VIN')
			.replaceAll('Zip Code', 'Location')
			.replaceAll('Get Started', 'Send inquiry')
			.replaceAll('Enter Your Car’s Details', 'Describe your vehicle')
			.replaceAll(
				'Provide your car’s information to get an instant value estimate.',
				'Include the model, year, mileage, and condition in your draft inquiry about selling or trading in.'
			)
			.replaceAll('Fine-Tune Your Value', 'Add details')
			.replaceAll(
				'Adjust factors like color and mileage to see their impact on your car’s value.',
				'Add photos, equipment, and notable details to describe your vehicle.'
			)
			.replaceAll('Receive Your Offer', 'Draft only — not sent')
			.replaceAll(
				'Ready to sell? Get a personalized offer from a local dealer.',
				'Draft only — not sent. Inspection, purchase, and trade-in options must be confirmed directly with Texas Drive Auto.'
			)
			.replaceAll('Complete the Sale Easily', 'Review before finalizing')
			.replaceAll(
				'Finalize the deal with secure transactions & hassle-free paperwork assistance.',
				'Ask which documents are required and who will coordinate each step before finalizing.'
			)
			.replaceAll('Get In Touch With Us', 'Contact Texas Drive Auto')
			.replaceAll(
				'We’re here to assist with any questions, concerns, or inquiries contact us today!',
				'Ask about viewings, paperwork, registration, trade-in availability, or available vehicles. No dealer financing or payment plans; buyer-arranged funding is separate.'
			)
			.replaceAll('Monday - Saturday: 08:00AM - 17:00PM', 'Monday - Saturday: 9:00 - 18:00')
			.replaceAll('Sunday: Close', 'Sunday: by appointment')
			.replaceAll(
				'What Paperwork Is Needed To Sell My Car?',
				'What documents do I need to sell my car?'
			)
			.replace(
				/What\s*Paperwork\s*Is\s*Needed\s*To\s*Sell\s*My\s*Car\?/g,
				'What documents do I need to sell my car?'
			)
			.replaceAll(
				'Usually, you will need the current registration for the vehicle signed by all registered owners, along with the car title and your ID or driver’s license. You may also need to provide warranty information. To complete your sale transaction, you will likely need to complete a bill of sale.',
				'You typically need the vehicle title, registration, identification, and any additional documents required for your vehicle. Ask Texas Drive Auto which documents apply before scheduling an inspection.'
			)
			.replaceAll(
				'Check with your local DMV to confirm what you’ll need in your state.',
				'Ask what you should prepare in advance for your situation.'
			);
	}

	if (templateFile === 'add-listings-2.html') {
		return html
			.replaceAll('Dashboard', daynightAccount.title)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('My Reviews', daynightAccount.reviewsTitle)
			.replaceAll('Messages', 'Messages')
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('Change Password', daynightAccount.passwordTitle)
			.replaceAll('Logout', 'Sign out')
			.replaceAll('Show Dashboard', 'Profile menu')
			.replaceAll('Show My account', 'Profile menu')
			.replaceAll('Add Listings', 'Vehicle appraisal request')
			.replaceAll('Add Listing', 'Vehicle appraisal request')
			.replaceAll('New sale request', 'New sale request')
			.replaceAll('Sell a vehicle', 'Vehicle appraisal request')
			.replaceAll('Submit Listing', 'Submit request')
			.replaceAll('List Now', 'Submit request')
			.replaceAll('Save & Preview', 'Review request')
			.replaceAll(
				'Lorem ipsum dolor sit amet, ',
				'Describe your vehicle, its condition, and your preferred next steps.'
			)
			.replaceAll('Gallery', 'Vehicle photos')
			.replaceAll('Car Preview', 'Review request')
			.replaceAll('Car Gallery', 'Photos')
			.replaceAll('Car Details', 'Vehicle details')
			.replaceAll('Features', 'Features and equipment')
			.replaceAll('Car Price', 'Expected price')
			.replaceAll('Location', 'Location')
			.replaceAll('Video', 'Video')
			.replaceAll('Attachments', 'Paperwork')
			.replaceAll('Stock Number*', 'Stock number')
			.replaceAll('VIN Number*', 'VIN')
			.replaceAll('Mileage*', 'Mileage')
			.replaceAll('Transmission*', 'Transmission')
			.replaceAll('Model*', 'Model')
			.replaceAll('Type*', 'Coupe')
			.replaceAll('Enter number', 'Number or note')
			.replaceAll('Enter VIN', 'VIN')
			.replaceAll('Enter mileage', 'Mileage')
			.replaceAll('Vehicle Information', 'Vehicle details')
			.replaceAll('Upload Photos', 'Add photos');
	}

	if (templateFile === 'services-center.html') {
		let output = html
			.replaceAll('Aurexo Services Center', 'Buyer and seller services')
			.replaceAll('Services Center', 'Buyer and seller services')
			.replaceAll('Sevices Center', 'Buyer and seller services')
			.replaceAll('Our Services Include', 'Buying questions')
			.replaceAll('Features Services', 'Questions before and after purchase')
			.replaceAll(
				'Maintenance and repairs',
				'Questions about documents, registration, buyer-arranged funding, trade-ins, inspections, and delivery'
			)
			.replaceAll(
				'Your one-stop destination for expert car services, maintenance, and repairs—keeping your vehicle in top condition.',
				'Questions about documents, registration, buyer-arranged funding, trade-ins, inspections, and delivery'
			)
			.replaceAll('Oil Change & Filter Replacement', 'Documents and vehicle history questions')
			.replaceAll('Transmission Service', 'Registration assistance')
			.replaceAll('Brake Inspection & Repair', 'No dealer financing or payment plans')
			.replaceAll('AC & Heating Repair', 'Trade-in and appraisal questions')
			.replaceAll('Tire Rotation & Balancing', 'Independent inspection questions')
			.replaceAll('Wheel Alignment', 'Delivery availability')
			.replaceAll('Battery Testing & Replacement', 'Vehicle search request')
			.replaceAll('Suspension & Steering Repair', 'Pre-purchase inspection')
			.replaceAll('Engine Diagnostics & Repair', 'Preparing for a purchase or sale')
			.replaceAll('Exhaust System Maintenance', 'After-sale assistance')
			.replaceAll('Oil Change', 'Document assistance')
			.replaceAll('Air Conditioning & Heating', 'Delivery questions and next steps')
			.replaceAll('Brake Repair', 'Registration and service after purchase')
			.replaceAll(
				'Find the right car with the right features for the right budget.',
				'Ask about practical steps before and after choosing a vehicle.'
			)
			.replaceAll(
				'Keep your engine running smoothly with regular oil changes and filter replacements.',
				'Ask which documents and vehicle history records are available and what to do before purchasing.'
			)
			.replaceAll(
				'Extend tire life and improve vehicle performance with proper rotation and balancing.',
				'Ask whether an on-site or independent shop inspection can be arranged for the vehicle.'
			)
			.replaceAll(
				'Ensure safety with comprehensive brake inspections, repairs, and replacements.',
				'No dealer financing or payment plans are offered. Any buyer-arranged funding is separate.'
			)
			.replaceAll(
				'Keep your vehicle powered up with battery testing and timely replacements.',
				'Ask which registration, insurance, and ownership documents your vehicle requires.'
			)
			.replaceAll(
				'Detect and fix engine issues with advanced diagnostic tools and expert repair services.',
				'Ask whether trade-ins or appraisals are available and how to compare market value.'
			)
			.replaceAll(
				'Stay comfortable year-round with full AC and heating system inspections and repairs.',
				'Delivery availability is unconfirmed in this preview. Ask about transportation options before purchasing.'
			)
			.replaceAll(
				'Get in touch with us for expert service and support. Whether you need routine maintenance, urgent repairs, or professional guidance, our dedicated team is here to ensure your vehicle stays in top condition.',
				'Contact Texas Drive Auto with questions about documents, registration, trade-ins, inspections, delivery, or finding a vehicle. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
			)
			.replaceAll('Expert Technicians', 'Practical assistance')
			.replaceAll('Quick Turnaround Time', 'Clear next steps')
			.replaceAll('Affordable Pricing', 'Clear terms')
			.replaceAll('Comprehensive Vehicle Care', 'Purchase and sale support')
			.replaceAll('Schedule A Services', 'Draft an inquiry')
			.replaceAll('Schedule Services', 'Send inquiry')
			.replaceAll('Schedule A Service', 'Draft an inquiry')
			.replaceAll('Opening Hours:', 'Business hours:')
			.replaceAll('Mon-Sat:8:00am - 18:00pm', 'Viewings: by appointment')
			.replaceAll('Sun: Closed', 'Documents and handoff: after confirmation')
			.replaceAll('Name', 'Name')
			.replaceAll('Email', 'Email')
			.replaceAll('Phone', 'Phone')
			.replaceAll('Date', 'Date')
			.replaceAll('Brand', 'Make')
			.replaceAll('Model', 'Model')
			.replaceAll(
				'Find Your Perfect Used Car Anytime, Anywhere!',
				'Explore vehicles at Texas Drive Auto'
			)
			.replaceAll(
				'Experience hassle-free car shopping with our app. Browse, compare, and buy used cars wherever you are - it’s fast, simple, and convenient.',
				'Ask about inspections, documents, trade-ins, and registration in Dallas. No dealer financing or payment plans are offered.'
			)
			.replaceAll(
				'Experience hassle-free car shopping with our app. Browse, compare, and buy used cars wherever you are – it’s fast, simple, and convenient.',
				'Ask about inspections, documents, trade-ins, and registration in Dallas. No dealer financing or payment plans are offered.'
			)
			.replace(
				/Experience hassle-free car shopping with our app\. Browse, compare, and buy used cars\s*<br class="lg-hidden" \/>\s*wherever you are - it’s fast, simple, and convenient\./g,
				'Ask about inspections, documents, trade-ins, and registration in Dallas. No dealer financing or payment plans are offered.'
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
				/<h2 class="mb-12 capitalize">\s*Buyer and seller services\s*<\/h2>/i,
				'<h2 class="mb-12">Buyer and seller services</h2>'
			)
			.replace(
				/<h2 class="text-center capitalize mb-12">\s*Support before and after purchase\s*<\/h2>/i,
				'<h2 class="text-center mb-12">Questions before and after purchase</h2>'
			)
			.replace(
				/<h2 class="mb-12 text-white">\s*Contact\s+Information\s*<\/h2>/i,
				'<h2 class="mb-12 text-white">Contact information</h2>'
			)
			.replace(/class="h4 font-weight-600 mb-8 capitalize"/g, 'class="h4 font-weight-600 mb-8"')
			.replaceAll('Infomation', 'Information')
			.replace(/Contact\s+Information/g, 'Contact information')
			.replace(/Contact\s+Infomation/g, 'Contact information')
			.replace(/Contact\s+Information/g, 'Contact information');

		output = polishServicesPageStructure(output);

		return output;
	}

	if (templateFile === 'clients-reviews.html') {
		return html
			.replaceAll('Clients Reviews', 'Customer reviews unavailable in this preview')
			.replaceAll('What our clients say', 'Customer reviews for Texas Drive Auto are unavailable in this preview')
			.replaceAll(
				'I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.',
				'Customer reviews are unavailable in this preview. Ask about vehicle details, paperwork, next steps, and scheduling a viewing.'
			)
			.replaceAll(
				'Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.',
				'Compare vehicles and set a budget. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
			)
			.replaceAll(
				'I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!',
				'Customer reviews are unavailable in this preview. Ask about vehicle photos, price, condition, and the purchase process.'
			)
			.replaceAll(
				'Buying my car through this platform was a breeze! The detailed car listings helped me make an informed choice. The support team answered all my questions promptly. I’m thrilled with my purchase!',
				'Ask about mileage, service records, and registration before deciding on a vehicle.'
			)
			.replaceAll(
				'The professionalism displayed by this dealership was top-notch. They guided me through every step and ensured I got a great deal on my car. I’ll definitely return here for my next car purchase.',
				'Ask which documents are required, how registration works, and what terms apply before proceeding.'
			)
			.replaceAll(
				'Buying my car here was simple! The website was user-friendly, and I quickly found a car that perfectly fit my needs. Customer support was helpful throughout the seamless process, making everything stress-free.',
				'Compare vehicles and ask about viewings and paperwork. Arrange any outside funding independently.'
			)
			.replaceAll(
				'This platform’s wide variety of cars made finding the perfect one for me incredibly easy. The process was straightforward and well-organized, and the team was attentive and helpful at every step along the way.',
				'Use the vehicle preview to compare options against your budget and needs. Confirm availability before planning a visit.'
			)
			.replaceAll(
				'The intuitive website, along with detailed listings, made choosing a car enjoyable and effortless. Customer support promptly addressed all my concerns and ensured I was confident in my decision.',
				'Ask how to arrange a viewing and what steps a purchase requires. Response times are not confirmed in this preview.'
			)
			.replaceAll(
				'This platform was fast, efficient, and very easy to use for finding a car. I found the right vehicle quickly, and the entire process was hassle-free and transparent. Definitely recommend this service to everyone!',
				'Ask for the purchase steps and terms, from the initial inquiry through the final paperwork.'
			)
			.replaceAll('Emily Johnson', 'Texas Drive Auto preview placeholder')
			.replaceAll('Benjamin Parker', 'Customer from Dallas')
			.replaceAll('Olivia Williams', 'Texas Drive Auto preview placeholder')
			.replaceAll('Sophia Martinez', 'Customer from Dallas')
			.replaceAll('Daniel Wright', 'Texas Drive Auto preview placeholder')
			.replaceAll('Sarah Nguyen', 'Customer from Dallas')
			.replaceAll('Manager, NexTech', 'Texas Drive Auto preview placeholder')
			.replaceAll('Freelance Designer', 'Customer from Dallas')
			.replaceAll('Entrepreneur', 'Texas Drive Auto preview placeholder')
			.replaceAll('Accountant', 'Customer from Dallas')
			.replaceAll('CEO BMW', 'Texas Drive Auto preview placeholder')
			.replaceAll('CEO Texas Drive Auto', 'Texas Drive Auto preview placeholder')
			.replaceAll('James Anderson', 'Customer from Dallas')
			.replaceAll('Project Manager', 'Texas Drive Auto preview placeholder')
			.replaceAll('Avitex', 'Texas Drive Auto')
			.replaceAll('Tesla', 'Texas Drive Auto')
			.replaceAll('Aurexo', 'Texas Drive Auto');
	}

	if (templateFile === 'sale-agents.html') {
		let output = html
			.replaceAll('Sale Agents', 'Texas Drive Auto sample team profiles')
			.replaceAll('Our Agents', 'Sales contacts')
			.replaceAll('Brooklyn Simmons', daynightTeam[0]?.name ?? 'Texas Drive Auto sample team profiles')
			.replaceAll(
				'Darrell Steward',
				daynightTeam[1]?.name ?? daynightTeam[0]?.name ?? 'Texas Drive Auto sample team profiles'
			)
			.replaceAll(
				'Senior Dealer Partner',
				daynightTeam[0]?.role.toLowerCase() ?? 'Sales contact details unavailable'
			)
			.replaceAll('Mike Hanley', daynightTeam[0]?.name ?? 'Texas Drive Auto sample team profiles');

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
			.replaceAll('Sale Agent Details', 'Staff profile unavailable in this preview')
			.replaceAll('Senior Dealer Partner', member?.role ?? 'Sample sales consultant role')
			.replaceAll('Mike Hanley', member?.name ?? 'Texas Drive Auto sample team profiles')
			.replaceAll('Dealer Inventory', 'Recommended vehicles')
			.replaceAll('Customer Reviews', 'Customer reviews unavailable in this preview')
			.replaceAll('Write A Review', 'Add feedback')
			.replaceAll('Add A Review', 'Add feedback')
			.replaceAll('Location', 'Location')
			.replaceAll('Call To Dealer', daynightSite.phoneCta)
			.replaceAll('Chat via WhatsApp', 'Chat on WhatsApp')
			.replaceAll('Send Inquiry About Vehicle', 'Draft an inquiry')
			.replaceAll('Send vehicle inquiry', 'Send inquiry')
			.replaceAll("This Vehicle's Availability", 'Viewing interest')
			.replaceAll("This Vehicle's Availability 2", 'Trade-in or appraisal inquiry')
			.replaceAll("This Vehicle's Availability 3", 'Paperwork and payment')
			.replaceAll('Viewing interest 2', 'Trade-in or appraisal inquiry')
			.replaceAll('Viewing interest 3', 'Paperwork and payment')
			.replaceAll('Comment', 'Your message')
			.replaceAll('placeholder="Your Review"', 'placeholder="Your review"')
			.replaceAll('Your email address will not be published', 'Your email won’t be published')
			.replaceAll('Send Inquiry', 'Send inquiry')
			.replaceAll('View More Reviews (98)', daynightSite.reviewLinkLabel)
			.replaceAll('Login To Add A Review', 'Draft feedback')
			.replaceAll('(1,968 Ratings)', `(${daynightSite.reviewCountLabel})`)
			.replaceAll('Randynox', 'Texas Drive Auto preview placeholder')
			.replaceAll('Mista Nyroom', 'Customer from Dallas')
			.replace(/<p class="mb-8">Name<\/p>/g, '<p class="mb-8">Name</p>')
			.replace(/<p class="mb-8">Email<\/p>/g, '<p class="mb-8">Email</p>')
			.replace(/<p class="mb-8">Phone<\/p>/g, '<p class="mb-8">Phone</p>')
			.replace(/<p class="mb-8">Subject<\/p>/g, '<p class="mb-8">Subject</p>')
			.replace(/<p class="mb-8">Message<\/p>/g, '<p class="mb-8">Message</p>')
			.replace(/<p class="mb-8">Review<\/p>/g, '<p class="mb-8">Review</p>')
			.replace(/<p class="mb-12">Rating<\/p>/g, '<p class="mb-12">Rating</p>')
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Your name"')
			.replaceAll(`value="${daynightSite.email}"`, 'value="" placeholder="Your email"')
			.replaceAll('placeholder="Phone (optional)"', 'placeholder="Phone"')
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
				'Customer reviews are unavailable in this preview. Ask about available vehicles, viewing arrangements, and next steps.'
			)
			.replaceAll(
				'Picked this car up used about five years ago with 90k miles. It’s now at 160k and still starts every morning without hesitation. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives.',
				'Customer reviews are unavailable in this preview. Ask about documents and registration. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
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
			/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">\s*Submit a review\s*<\/button>/i,
			'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Review verification and publication are unavailable in this preview.">Draft feedback</a>'
		);

		return output;
	}

	if (templateFile === 'dealer-details.html') {
		let output = html
			.replaceAll('Dealer Listing', 'Texas Drive Auto Dallas profile')
			.replaceAll('Dealer Details', 'Texas Drive Auto Dallas profile')
			.replaceAll('Dealer Detail', 'Texas Drive Auto Dallas profile')
			.replaceAll('Aurexo Atlanta', 'Texas Drive Auto')
			.replaceAll('Euro Workshop', 'Texas Drive Auto')
			.replaceAll('537 Orchard St, NY', daynightSite.location)
			.replaceAll('Verified Dealer', 'Dealership preview')
			.replaceAll('Dealer Inventory', 'Vehicle inventory')
			.replaceAll('About Dealer', 'About the dealership')
			.replaceAll('Customer Reviews', 'Customer reviews unavailable in this preview')
			.replaceAll('Write A Review', 'Add feedback')
			.replaceAll('Write a Review', 'Add feedback')
			.replaceAll('Location', 'Location')
			.replaceAll('Call To Dealer', daynightSite.phoneCta)
			.replaceAll('Chat via WhatsApp', 'Chat on WhatsApp')
			.replaceAll('(751 review)', `(${daynightSite.reviewCountLabel})`)
			.replaceAll(
				'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience.',
				'Explore used vehicles in the Texas Drive Auto preview. Ask about price, mileage, condition, available history records, documents, registration, trade-in availability, and independent inspections. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
			)
			.replaceAll(
				'His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with his clients, always prioritizing trust and transparency.',
				'Ask about comparing available vehicles, trade-in availability, and required documents before visiting. No dealer financing or payment plans are offered.'
			)
			.replaceAll(
				'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience. His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with clients, offering honest advice, transparent deals, and personalized support every step of the way.',
				'Explore used vehicles in the Texas Drive Auto preview. Ask about price, mileage, condition, available history records, documents, registration, trade-in availability, and independent inspections. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
			)
			.replaceAll('/assets/images/pages/volvo.png', daynightPageAssets.dealerProfileMark)
			.replace(/<p class="mb-8">Name<\/p>/g, '<p class="mb-8">Name</p>')
			.replace(/<p class="mb-8">Email<\/p>/g, '<p class="mb-8">Email</p>')
			.replace(/<p class="mb-8">Review<\/p>/g, '<p class="mb-8">Review</p>')
			.replace(/<p class="mb-12">Rating<\/p>/g, '<p class="mb-12">Rating</p>')
			.replaceAll('placeholder="Your Review"', 'placeholder="Your review"')
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Your name"')
			.replaceAll(`value="${daynightSite.email}"`, 'value="" placeholder="Your email"');

		output = replaceWidgetMapByClass(
			output,
			'widget-gg-map flex radius-8 overflow-hidden mb-28',
			'234'
		);

		output = output.replace(
			/<form action="#">/i,
			'<form action="/contact?intent=review" title="Review verification and publication are unavailable in this preview.">'
		);

		output = output.replace(
			/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">\s*Login\s*to\s*add\s*a\s*Review\s*<\/button>/i,
			'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Review verification and publication are unavailable in this preview.">Draft feedback</a>'
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
			.replaceAll('Contact Us', 'Contact')
			.replaceAll('Get In Touch', 'Contact Texas Drive Auto')
			.replaceAll('get in touch', 'Contact Texas Drive Auto')
			.replaceAll('<p class="mb-8">Message</p>', '<p class="mb-8">Message</p>')
			.replaceAll('<p class="mb-8">Email</p>', '<p class="mb-8">Email</p>')
			.replaceAll('<p class="mb-8">First Name</p>', '<p class="mb-8">Name</p>')
			.replaceAll('<p class="mb-8">Last Name</p>', '<p class="mb-8">Subject</p>')
			.replaceAll('value="Tony"', 'value="" placeholder="Your name"')
			.replaceAll(
				'placeholder="Enter your last name"',
				'placeholder="Vehicle, trade-in questions, documents..."'
			)
			.replaceAll('placeholder="Enter your phone number"', 'placeholder="Enter phone number"')
			.replaceAll('placeholder="Enter your email address"', 'placeholder="Enter email"')
			.replaceAll('Your Message*', 'Your message*')
			.replaceAll('Send Message', 'Send inquiry')
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
				/<div class="bg-white radius-20 contact-page-form">\s*<p class="h3 mb-12">Contact Texas Drive Auto<\/p>/,
				'<div class="bg-white radius-20 contact-page-form">\n\t\t\t\t\t\t<p class="h3 mb-12">Ask about a vehicle</p>'
			)
			.replace(
				/<p class="text-secondary">City\. Dallas, Dallas, City of Dallas, Studentski Grad, 18 Atanas Manchev St.<\/p>/,
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
			.replaceAll('Home', 'Home')
			.replaceAll('Pages', 'More')
			.replaceAll('Frequently Asked Questions', 'Frequently asked questions')
			.replaceAll('Do you offer financing?', 'Do you offer dealer financing? No; buyer-arranged funding is separate.')
			.replaceAll('Exchanges &amp; Returns', 'Are trade-ins accepted?')
			.replaceAll('Exchanges & Returns', 'Are trade-ins accepted?')
			.replaceAll('Refund Questions', 'Warranty and delivery questions')
			.replaceAll(
				'Policies on vehicle exchanges after purchase?',
				'Do you accept trade-ins?'
			)
			.replaceAll(
				'Conditions for returning a rental car early?',
				'How would a trade-in be valued?'
			)
			.replaceAll(
				'Timeframes for initiating an exchange or return?',
				'Can I pay the difference on a trade-in?'
			)
			.replaceAll(
				'Documentation needed for processing exchanges?',
				'What documents would a trade-in require?'
			)
			.replaceAll(
				'Eligibility for refunds on purchases or deposits?',
				'Do any vehicles include a warranty?'
			)
			.replaceAll(
				'How refunds are processed for canceled rentals?',
				'Is vehicle history information available?'
			)
			.replaceAll('Timeframes for receiving a refund?', 'Is delivery to another city available?')
			.replaceAll(
				'To purchase a car from our dealership, start by exploring our inventory online or visiting us in person to find the vehicle that suits your needs. Schedule a test drive to ensure it’s the right fit, then review financing or leasing options with our team.',
				'Browse the vehicle preview, then ask Texas Drive Auto about availability, a viewing, and a test drive. No dealer financing or payment plans are offered. Buyer-arranged funding is separate; trade-in availability is unconfirmed.'
			)
			.replaceAll(
				'Provide the necessary documents, such as your ID, proof of insurance, and income verification. Once terms are agreed upon, finalize the paperwork, inspect the car, and drive away with your new vehicle!',
				'Ask which identification and purchase documents are required. Confirm the terms, inspect the vehicle, and review the paperwork before completing a purchase.'
			)
			.replaceAll(
				'An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.',
				'Ask Texas Drive Auto about the selected vehicle, accepted payment methods, and required paperwork. Trade-in availability and valuations are not confirmed in this preview.'
			);
	}

	if (templateFile === 'calculator.html') {
		// Longest strings first — a bare 'Calculator' swap would break the longer matches.
		const localized = html
			.replaceAll('Car Payment Calculator', 'Monthly payment estimator')
			.replaceAll('Calculate Your Estimated Monthly', 'Estimate a monthly payment')
			.replaceAll(
				'Estimate your monthly payments and budget for your next car with ease.',
				'Illustrative estimates for buyer-arranged funding. No dealer financing or payment plans.'
			)
			.replaceAll('Calculator FAQ', 'Frequently asked questions')
			.replaceAll('Calculator', 'Calculator')
			.replaceAll(
				'Loan Term <span class="text-muted">(months)</span>',
				'Term <span class="text-muted">(months)</span>'
			)
			.replaceAll('36 months', '36 months')
			.replaceAll('24 months', '24 months')
			.replaceAll('12 months', '12 months')
			.replaceAll('Trade In Value (Optional)', 'Trade-in / exchange inquiry (optional)')
			.replaceAll('Trade In Value', 'Hypothetical trade-in credit')
			.replaceAll('Trade-In Value?', 'Trade-in?')
			// Must run before the generic 'Car Price' rule below or it never matches.
			.replaceAll('Budget & Car Price?', 'Vehicle budget and price?')
			.replaceAll('Interest Rate', 'Buyer-arranged interest rate')
			.replaceAll('Est. Sales Tax', 'Fees (est.)')
			.replaceAll('Sales Tax', 'Taxes and fees')
			.replaceAll('Estimated Monthly Payment*', 'Estimated monthly payment*')
			.replaceAll('Est. Interest', 'Interest (est.)')
			.replaceAll('/Month', '/month')
			.replaceAll('for 3 years', 'over 3 years')
			.replaceAll('Loan Summary', 'Estimate summary')
			.replaceAll('Other Fees', 'Other fees')
			.replaceAll('Not Included', 'not included')
			.replaceAll('Total Loan Amount', 'Total amount payable')
			.replaceAll('Monthly Payment', 'No dealer payment plans')
			.replaceAll('Car Price', 'Vehicle price')
			.replaceAll('Down Payment', 'Down payment')
			.replaceAll('Browse by Price', 'Browse by budget')
			.replaceAll('$46.300', '46 300 $')
			.replaceAll('-$400', '−400 $')
			.replaceAll('$400', '400 $')
			.replaceAll('-$0', '−0 $')
			.replaceAll('$0', '0 $')
			.replaceAll('+$880', '+880 $')
			.replaceAll('+$1.389', '+1 389 $')
			.replaceAll('$1.338', '1 338 $')
			.replaceAll('$48.169', '48 169 $')
			.replaceAll('What is an Auto Loan?', 'What is buyer-arranged funding?')
			.replaceAll('How to Calculate an Auto Loan?', 'How is the monthly payment estimated?')
			.replace(
				/Auto loans are very common[\s\S]*?period of time\./g,
				'If you plan to borrow, compare payment estimates and total borrowing costs with an independent lender. Buyer-arranged funding is separate from the dealership.'
			)
			.replace(
				/You can get an auto loan[\s\S]*?pay off the loan\./g,
				'Financing services are unavailable in this Texas Drive Auto preview. Texas Drive Auto offers no dealer financing, leasing, or payment plans. Buyers must arrange any funding independently.'
			)
			// The raw template repeats the same English paragraph under all 7 FAQ
			// headings. Non-global replaces swap them out one by one, in document
			// order, so every question gets its own answer.
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'A loan arranged independently with a lender may let you pay for a vehicle in monthly installments. Payments depend on the price, down payment, term, interest rate, and fees. This calculator provides an illustrative estimate only. Texas Drive Auto offers no dealer financing or payment plans.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'The calculator estimates payments using the vehicle price minus the down payment and any hypothetical trade-in credit, plus interest and financed fees over the selected term. Adjust the values to update the estimate. Trade-in acceptance is not confirmed, and this is not a dealer financing offer.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Leave room in your budget for registration, insurance, and maintenance. The calculator uses a general 15–20% monthly-income guideline for payment estimates, not a personalized recommendation. Estimates apply only to buyer-arranged funding; no dealer financing or payment plans are offered.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'A down payment reduces the amount borrowed and the estimated monthly payment. Ask your independent lender how different down payments affect its terms. No financing options are available through this Texas Drive Auto preview.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Trade-in acceptance and valuations are not confirmed in this Texas Drive Auto preview. Ask whether a trade-in is possible before including its value in your purchase budget.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Taxes, title and registration fees, and insurance may add to your budget. The calculator uses illustrative fees only and does not confirm actual costs. Request an itemized purchase total for the specific vehicle.'
			)
			.replace(
				/An auto loan is a sum of money[\s\S]*?monthly payments\./,
				'Your independent lender determines the interest rate and loan terms. The calculator’s rate is illustrative only. Texas Drive Auto offers no dealer financing, payment plans, or financing approval.'
			);

		// The template's "Browse by Price" boxes list US demo cars — render the real
		// budget tiers with live counts instead.
		const budgetTiers = [
			{ label: 'Up to 10 000 USD', value: 'under-10000', limit: 10000 },
			{ label: 'Up to 20 000 USD', value: 'under-20000', limit: 20000 },
			{ label: 'Up to 30 000 USD', value: 'under-30000', limit: 30000 },
			{ label: 'Up to 50 000 USD', value: 'under-50000', limit: 50000 },
			{ label: 'Over 50 000 USD', value: 'over-50000', min: 50000 }
		];
		const budgetBoxes = budgetTiers
			.map((tier) => {
				const count = daynightVehicles.filter((vehicle) =>
					tier.limit !== undefined
						? vehicle.price > 0 && vehicle.price <= tier.limit
						: vehicle.price > (tier.min ?? 0)
				).length;

				return `<div class="price-box"><a href="/inventory?price=${tier.value}" class="h7 font-weight-500 mb-8 text-underline">${count} ${count === 1 ? 'vehicle' : 'vehicles'}</a><p class="h4">${tier.label}</p></div>`;
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
			.replaceAll('Compare Cars Side-By-Side', 'Compare vehicles')
			.replaceAll('Compare Cars Side-by-Side', 'Compare vehicles')
			.replaceAll(
				'Compare features, performance, and pricing to choose the perfect car.',
				'Compare mileage, fuel type, features, and price before a viewing.'
			)
			.replaceAll('Compare', 'Compare');

		return replaceCompareVehicleTable(localized);
	}

	if (templateFile === 'terms.html') {
		return (
			html
				.replaceAll('Home', 'Home')
				.replaceAll('Pages', 'More')
				// Section-4 heading: translate the full English phrase BEFORE the
				// generic 'Terms Of Use' rule, otherwise it half-renders as
				// "Site Terms of Use Modifications".
				.replaceAll('Site Terms Of Use Modifications', 'Changes to terms')
				.replaceAll('Site terms of use modifications', 'Changes to terms')
				.replaceAll('Terms Of Use', 'Terms of use')
				.replaceAll('Limitations', 'Limitations')
				.replaceAll('Revisions And Errata', 'Updates')
				.replaceAll('Revisions and errata', 'Updates')
				.replaceAll('Risks', 'Clarifications')
				// Replace placeholder (lorem ipsum) copy with real informational BG
				// terms. Ordered LONGEST-FIRST so a shorter variant never partially
				// matches a longer paragraph that contains it as a prefix/suffix.
				.replaceAll(
					'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
					'Listings and descriptions require verification in person and do not constitute a binding offer.'
				)
				.replaceAll(
					'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis',
					'A vehicle may be sold or reserved before its listing is updated. Confirm availability before visiting.'
				)
				.replaceAll(
					'Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
					'No dealer financing or payment plans are offered. Buyer-arranged funding is separate. Ask whether trade-ins are accepted.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.',
					'Texas Drive Auto preview listings may contain incomplete information or technical errors. Confirm details before purchasing.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie ',
					'Preview service information and terms may change. Confirm applicable terms directly with Texas Drive Auto before purchasing. '
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie',
					'Verify listing photos and descriptions against the vehicle, and confirm its condition and equipment during an inspection.'
				)
				.replaceAll(
					'Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie a, finibus nec ex.',
					'Verify listed specifications and their sources during an inspection.'
				)
				.replaceAll(
					'Etiam eleifend metus at nunc ultricies facilisis.',
					'Contact the dealership to confirm the location and arrange a viewing or test drive.'
				)
				.replaceAll(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.',
					'This site is an informational preview. Confirm current prices and availability directly with Texas Drive Auto before purchasing. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
				)
		);
	}

	if (templateFile === '404.html') {
		return html
			.replaceAll('Oops! Something is Missing....', '404 - page not found')
			.replaceAll('Something is Missing....', '404 - page not found')
			.replaceAll(
				'The page you are looking for cannot be found.',
				'This page doesn’t exist or has moved.'
			)
			.replaceAll('Back To Homepage', 'Back to home');
	}

	return html;
}

function replaceAccountPageCopy(html: string, templateFile: string) {
	const withAccountChrome = html
		.replaceAll('Dashboard', daynightAccount.title)
		.replaceAll('My Listings', daynightAccount.listingsTitle)
		.replaceAll('My Listing', daynightAccount.listingsTitle)
		.replaceAll('Messages', 'Messages')
		.replaceAll('My Favorites', daynightAccount.favoritesTitle)
		.replaceAll('My Reviews', daynightAccount.reviewsTitle)
		.replaceAll('My Profile', daynightAccount.profileTitle)
		.replaceAll('Change Password', daynightAccount.passwordTitle)
		.replaceAll('Logout', 'Sign out');

	if (templateFile === 'dashboard.html') {
		return withAccountChrome
			.replaceAll('My Listings', daynightAccount.listingsTitle)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Vehicles', daynightAccount.listingsTitle)
			.replaceAll('My Vehicles', daynightAccount.listingsTitle)
			.replaceAll('Messages', 'Messages')
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Sell a vehicle', daynightAccount.newListingCta)
			.replaceAll('Show My account', 'Profile menu')
			.replaceAll('Pending', 'In progress')
			.replaceAll('Car Views', 'Vehicle interest')
			.replaceAll('6 Month', '6 months')
			.replaceAll('3 Month', '3 months')
			.replaceAll('12 Month', '12 months')
			.replaceAll('All Listing', 'All requests')
			.replaceAll('Sort by:', 'Sort:')
			.replaceAll('Newest', 'Newest')
			.replaceAll('Best Match', 'Best match')
			.replaceAll('Lowest Price', 'Lowest price')
			.replaceAll('Highest Price', 'Highest price')
			.replaceAll('Lowest Mileage', 'Lowest mileage')
			.replaceAll('Highest Mileage', 'Highest mileage')
			.replaceAll('Recent Reviews', 'Recent reviews');
	}

	if (templateFile === 'my-profile.html') {
		return withAccountChrome
			.replaceAll('My Profile', daynightAccount.profileTitle)
			.replaceAll('My profile', daynightAccount.profileTitle)
			.replaceAll('Personal Information', 'Contact information')
			.replaceAll('Infomation', 'Information')
			.replaceAll(
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum arcu sit amet dolor aliquet, non fermentum quam ullamcorper. Nunc iaculis arcu sed interdum suscipit. Donec quis diam a sem sagittis consequat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur a ligula magna. Maecenas nec est dignissim, molestie sem vel, tristique lacus.',
				daynightAccount.authNote
			)
			.replaceAll('Save Changes', 'Save changes');
	}

	if (templateFile === 'my-listings.html') {
		return withAccountChrome
			.replaceAll('My Listings', daynightAccount.listingsTitle)
			.replaceAll('My Listing', daynightAccount.listingsTitle)
			.replaceAll('My Vehicles', daynightAccount.listingsTitle)
			.replaceAll('My Vehicles', daynightAccount.listingsTitle)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Sell a vehicle', daynightAccount.newListingCta)
			.replaceAll('Published', 'Draft only — not sent')
			.replaceAll('Pending', 'Under review');
	}

	if (templateFile === 'add-listings.html') {
		return withAccountChrome
			.replaceAll('Add Listings', daynightAccount.newListingCta)
			.replaceAll('Add Listing', daynightAccount.newListingCta)
			.replaceAll('Sell a vehicle', daynightAccount.newListingCta)
			.replaceAll('Vehicle Information', 'Vehicle details')
			.replaceAll('Your Package', 'Vehicle details')
			.replaceAll('Save & Publish', 'Send to Texas Drive Auto')
			.replaceAll('Submit Listing', 'Send to Texas Drive Auto')
			.replaceAll('Upload Photos', 'Vehicle photos');
	}

	if (templateFile === 'message.html') {
		return withAccountChrome
			.replaceAll('Messages', daynightAccount.messagesTitle)
			.replaceAll('Messages', daynightAccount.messagesTitle)
			.replaceAll('Message', daynightAccount.messagesTitle)
			.replaceAll('Inbox', 'Inbox')
			.replaceAll('Marvin McKinney', 'Website customer')
			.replaceAll('John Smith', 'Website customer')
			.replaceAll('Brooklyn Simmons', 'Customer from Dallas')
			.replaceAll('Arlene McCoy', 'Customer from Dallas')
			.replaceAll('Darrell Steward', 'Texas Drive Auto')
			.replaceAll('Theresa Webb', 'Website customer')
			.replaceAll('Aurexo Support', 'Texas Drive Auto')
			.replaceAll('Texas Drive Auto Support', 'Texas Drive Auto')
			.replaceAll('Send Message', 'Save draft')
			.concat(html.includes('Texas Drive Auto') ? '' : ' Texas Drive Auto');
	}

	if (templateFile === 'my-favorites.html') {
		return withAccountChrome
			.replaceAll('My Favorites', daynightAccount.favoritesTitle)
			.replaceAll('View Details', 'View vehicle');
	}

	if (templateFile === 'reviews.html') {
		return withAccountChrome
			.replaceAll('Reviews', daynightAccount.reviewsTitle)
			.replaceAll('Submit Review', 'Submit review');
	}

	if (templateFile === 'change-password.html') {
		return withAccountChrome
			.replaceAll('Change Password', daynightAccount.passwordTitle)
			.replaceAll('New Password', 'New password')
			.replaceAll('Confirm Password', 'Confirm password');
	}

	return html;
}

function replaceVisibleTemplateFiller(html: string, templateFile: string) {
	const salesTeam = daynightTeam[0];
	const tradeInTeam = daynightTeam[1] ?? salesTeam;
	let output = html
		.replaceAll('Browse By Type', 'Vehicles by type')
		.replaceAll('Check All Car Type', 'View all types')
		.replaceAll('Check All Types', 'View all types')
		.replaceAll('New Vehicles', 'Vehicle inventory')
		.replaceAll('Explore Our Brands', 'Makes in stock')
		.replaceAll('Clients Reviews', 'Customer reviews unavailable in this preview')
		.replace(/\bView All\b/g, 'View all')
		.replaceAll('View All Makes', 'View all makes')
		.replaceAll('Why Choose Us?', 'Why Texas Drive Auto?')
		.replaceAll('Why Choose Us', 'Why Texas Drive Auto')
		.replaceAll(
			'Explore our wide selection, competitive prices, and exceptional service for a hassle-free car-buying experience.',
			'Browse vehicles and ask about availability, inspections, paperwork, and registration. No dealer financing or payment plans are offered.'
		)
		.replaceAll(
			'Wide Selection – A variety of cars to fit every need.',
			'Browse vehicles for different budgets and needs.'
		)
		.replaceAll(
			'Competitive Prices: Great deals and flexible financing.',
			'Confirm pricing. Any funding must be arranged independently by the buyer.'
		)
		.replaceAll(
			'Trusted Service: Transparent, honest, and reliable.',
			'Ask for vehicle details and viewing availability.'
		)
		.replaceAll(
			'Excellent Support: Always here to assist you.',
			'Ask about paperwork, registration, and next steps.'
		)
		.replaceAll('Find Your Car Now!', 'Browse available vehicles')
		.replaceAll('18K+', `${daynightVehicles.length}+`)
		.replaceAll('Car For Sale', 'Available vehicles')
		.replaceAll('8k+', '2019')
		.replaceAll('Visitors per day', 'presence on mobile.bg')
		.replaceAll('4,5k+', `${daynightBrandsInStock}`)
		.replaceAll('Dealer Reviews', 'brands in stock')
		.replaceAll('3,5k+', '100%')
		.replaceAll('Verified Dealers', 'Ask about vehicle inspections')
		.replace(
			/<a href="\/sell-your-car" class="btn btn-white btn-large font-weight-600 max-w-min text-primary">\s*View available vehicles\s*<\/a>/g,
			'<a href="/inventory" class="btn btn-white btn-large font-weight-600 max-w-min text-primary">Browse available vehicles</a>'
		)
		.replaceAll('Want to sell your car?', 'Looking to sell or trade a vehicle? Ask whether this service is available.')
		.replaceAll('Want To Sell Your Car?', 'Looking to sell or trade a vehicle? Ask whether this service is available.')
		.replaceAll('Secure transactions and title transfer', 'Questions about paperwork and title transfer')
		.replaceAll('Verified community of buyers', 'Ask about purchase and trade-in interest')
		.replaceAll('Free vehicle history report', 'Review condition and history')
		.replaceAll('How It Works', 'How it works')
		.replaceAll('How it works', 'How it works')
		.replaceAll('Certified Dealers', 'Texas Drive Auto')
		.replaceAll(
			'Answer a few questions about your vehicle, and then connect with one of thousands of Texas Drive Auto who can pay you directly for your used car.',
			'Describe your vehicle and add photos to a draft inquiry about inspections, selling, or trading in. These services are unconfirmed in this preview.'
		)
		.replaceAll('Reach Out to Us', 'Contact Texas Drive Auto')
		.replaceAll('Reach Out To Us', 'Contact Texas Drive Auto')
		.replaceAll('Get In Touch', 'Contact Texas Drive Auto')
		.replaceAll('get in touch', 'Contact Texas Drive Auto')
		.replaceAll('Have any Question?', 'Have a question?')
		.replaceAll(
			'We’re here to assist with any questions, concerns, or inquiries—contact us today!',
			'Ask about viewings, paperwork, registration, trade-in availability, or available vehicles. No dealer financing or payment plans; buyer-arranged funding is separate.'
		)
		.replaceAll(
			"We're here to assist with any questions, concerns, or inquiries—contact us today!",
			'Ask about viewings, paperwork, registration, trade-in availability, or available vehicles. No dealer financing or payment plans; buyer-arranged funding is separate.'
		)
		.replaceAll(
			"We'd love to hear from you! If you have any questions",
			'Draft a question about a vehicle, viewing, paperwork, or next steps.'
		)
		.replaceAll('Subscribe To Our Newletter!', 'Subscribe to new listings')
		.replaceAll(
			'Sign Up For Updates On Our Latest News & Events.',
			'Request inventory updates and helpful tips from Texas Drive Auto.'
		)
		.replaceAll(
			'Sign Up for Our Latest News & Events.',
			'Request inventory updates and helpful tips from Texas Drive Auto.'
		)
		.replace(
			/Sign Up For Updates On Our\s*<br class="lg-hidden">\s*Latest (?:News|News) & Events\./g,
			'Request inventory updates and helpful tips from Texas Drive Auto.'
		)
		.replaceAll('NewsletterModal', 'NewsletterModal')
		.replaceAll('Enter your e-mail', 'Enter email')
		.replace(/>\s*Subscribe\s*</g, '>Subscribe<')
		.replaceAll(
			'I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.',
			'Customer reviews are unavailable in this preview. Ask about vehicle details, paperwork, next steps, and scheduling a viewing.'
		)
		.replaceAll(
			'Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.',
			'Compare vehicles and set a budget. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
		)
		.replaceAll(
			'I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!',
			'Customer reviews are unavailable in this preview. Ask about vehicle photos, price, condition, and the purchase process.'
		)
		.replaceAll('Address Business', 'Address')
		.replaceAll('Contact Us', 'Contact')
		.replaceAll('Working Time', 'Business hours')
		.replaceAll('Week-Day: 8:00 - 18:00', 'Weekdays: 9:00 - 18:00')
		.replaceAll('Mon-Sat:8:00am - 18:00pm', 'Monday - Saturday: 9:00 - 18:00')
		.replaceAll('Sunday: Closed', 'Sunday: by appointment')
		.replaceAll('Sunday: Close', 'Sunday: by appointment')
		.replaceAll('Sun: Closed', 'Sunday: by appointment')
		.replaceAll('Follow Us On social media:', 'Follow Texas Drive Auto:')
		.replaceAll('First Name', 'Name')
		.replaceAll('Last Name', 'Last name')
		.replaceAll('Phone Number', 'Phone')
		.replaceAll('Your Message*', 'Your message*')
		.replaceAll('Enter your last name', 'Enter last name')
		.replaceAll('Enter your email address', 'Enter email')
		.replaceAll('Enter your phone number', 'Enter phone number')
		.replaceAll('Send Message', 'Save draft')
		.replaceAll('Frequently Asked Questions', 'Frequently asked questions')
		.replaceAll('How To Buy?', 'How does buying a car work?')
		.replaceAll('Steps to purchase a car from our dealership?', 'What are the steps to buy a car?')
		.replaceAll(
			'To purchase a car from our dealership, start by exploring our inventory online or visiting us in person to find the vehicle that suits your needs. Schedule a test drive to ensure it’s the right fit, then review financing or leasing options with our team.',
			'Choose a listed vehicle and contact Texas Drive Auto to confirm availability, request a viewing, and ask about paperwork or trade-in availability. Any funding must be arranged independently by the buyer.'
		)
		.replaceAll(
			'Provide the necessary documents, such as your ID, proof of insurance, and income verification. Once terms are agreed upon, finalize the paperwork, inspect the car, and drive away with your new vehicle!',
			'Ask what inspection, contract, and registration assistance is available for the specific vehicle.'
		)
		.replaceAll(
			'Required documents for financing or leasing?',
			'What documents does my own lender require?'
		)
		.replaceAll(
			'What paperwork is needed to sell my car?',
			'What documents do I need to sell my car?'
		)
		.replaceAll(
			'Options for reserving or pre-ordering a vehicle?',
			'Can I reserve a vehicle?'
		)
		.replaceAll('Available payment methods and financing plans?', 'What payment methods are accepted?')
		.replaceAll('How to schedule a test drive before buying?', 'How do I arrange a viewing or test drive?')
		.replaceAll(
			'An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.',
			'No dealer financing or payment plans are offered. Buyers must arrange any funding independently and confirm terms with their chosen lender.'
		)
		.replaceAll('Terms Of Use', 'Terms of use')
		.replaceAll('Terms of use', 'Terms of use')
		.replaceAll('Terms', 'Terms')
		.replaceAll('Limitations', 'Limitations')
		.replaceAll('Revisions And Errata', 'Updates')
		.replaceAll('Revisions and errata', 'Updates')
		.replaceAll('Site Terms Of Use Modifications', 'Changes to terms')
		.replaceAll('Site terms of use modifications', 'Changes to terms')
		.replaceAll('Risks', 'Clarifications')
		.replaceAll(
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed euismod justo, sit amet efficitur dui. Aliquam sodales vestibulum velit, eget sollicitudin quam. Donec non aliquam eros. Etiam sit amet lectus vel justo dignissim condimentum.',
			'This website is for informational purposes. Confirm current prices, availability, and required documents directly with Texas Drive Auto before purchasing. No dealer financing or payment plans are offered.'
		)
		.replaceAll(
			'In malesuada neque quis libero laoreet posuere. In consequat vitae ligula quis rutrum. Morbi dolor orci, maximus a pulvinar sed, bibendum ac lacus. Suspendisse in consectetur lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam elementum, est sed interdum cursus, felis ex pharetra nisi, ut elementum tortor urna eu nulla. Donec rhoncus in purus quis blandit.',
			'Confirm the vehicle’s condition, equipment, and documents during a viewing; photos, descriptions, and specifications may need verification.'
		)
		.replaceAll(
			'Etiam eleifend metus at nunc ultricies facilisis. Morbi finibus tristique interdum. Nullam vel eleifend est, eu posuere risus. Vestibulum ligula ex, ullamcorper sit amet molestie',
			'Ask Texas Drive Auto about paperwork, registration, inspections, and whether trade-ins are available. No dealer financing or payment plans are offered.'
		)
		.replaceAll('EXPERT REVIEW', 'Tips')
		.replaceAll('EXPERT REVIEW', 'Tips')
		.replaceAll('Related Articles', 'Related articles')
		.replaceAll('Expert Review', 'Tips')
		.replaceAll(
			'2025 BMW 5 Series Priced From $59,375; i5 LPG/Gasoline From $68,275',
			'How to choose a vehicle for your budget'
		)
		.replaceAll('by Admin', 'Texas Drive Auto')
		.replaceAll('Super Admin', 'Customer profile')
		.replaceAll('Or Purchase New Package', 'Request to Texas Drive Auto')
		.replaceAll('Choose Your Package', 'Select a service')
		.replaceAll('MOST POPULAR', 'Helpful')
		.replaceAll('Basic Plan', 'Basic request')
		.replaceAll('Starter', 'Viewing')
		.replaceAll('Professional', 'Ask about available assistance')
		.replaceAll('Executive', 'Individual service')
		.replaceAll('Service team details unavailable in this preview', 'Texas Drive Auto staff details are unavailable in this preview')
		.replaceAll('Leadership details unavailable in this preview', 'Sample sales consultant role')
		.replaceAll('FREE', 'No fee')
		.replaceAll('$5.00', 'On request')
		.replaceAll('$10.00', 'On request')
		.replaceAll('$25.00', 'On request')
		.replaceAll('Buy this package', 'Submit request')
		.replaceAll('List Up to 5 Cars', 'Vehicle details')
		.replaceAll('List Up to 10 Cars', 'Photos and description')
		.replaceAll('List Up to 20 Cars', 'Team assessment')
		.replaceAll('List Up to 30 Cars', 'Personal assistance')
		.replaceAll('Apply for Dealer Listings', 'Request to Texas Drive Auto')
		.replaceAll('Apply for 50 Dealer Listings', 'Detailed inquiry for Texas Drive Auto')
		.replaceAll('Apply for 150 Dealer Listings', 'Personal inquiry for Texas Drive Auto')
		.replaceAll('Highlighted Dealer Profile', 'Contact an advisor')
		.replaceAll('Inquiry Messenger for Buyers', 'Inquiry tracking')
		.replaceAll('Inquiry Messenger Services', 'Inquiry tracking')
		.replaceAll('Unlimited Video Calls with Buyers', 'Request additional photos')
		.replaceAll('Unlimited Video Calls with Potential Buyers', 'Additional details as needed')
		.replaceAll('24/7 Live Chat Support', 'Response from the Texas Drive Auto team')
		.replaceAll('Live Chatbot', 'Contact the team')
		.replaceAll('Sale Agents Detail', 'Team information unavailable in this preview')
		.replaceAll('Sale Agents List', 'Contact options')
		.replaceAll('Sale Agents', 'Texas Drive Auto sample team profiles')
		.replaceAll('Senior Sales Agent', salesTeam?.role ?? 'Sample sales profiles')
		.replaceAll('Senior Dealer Partner', salesTeam?.role ?? 'Sample sales profiles')
		.replaceAll('Verified Dealer', 'Dealership preview')
		.replaceAll('Emily Johnson', 'Texas Drive Auto preview placeholder')
		.replaceAll('CEO Avitex', 'Texas Drive Auto preview placeholder')
		.replaceAll('Benjamin Parker', 'Customer from Dallas')
		.replaceAll('CEO Tesla', 'Customer from Dallas')
		.replaceAll('Olivia Williams', 'Texas Drive Auto preview placeholder')
		.replaceAll('CEO BMW', 'Texas Drive Auto preview placeholder')
		.replaceAll('CEO Texas Drive Auto', 'Texas Drive Auto preview placeholder')
		.replaceAll('James Anderson', 'Customer from Dallas')
		.replaceAll('Project Manager', 'Texas Drive Auto preview placeholder')
		.replaceAll('Robert Fox', salesTeam?.name ?? 'Texas Drive Auto Sales Team')
		.replaceAll('Bessie Cooper', tradeInTeam?.name ?? 'Texas Drive Auto Trade-In Team')
		.replaceAll('Brooklyn Simmons', salesTeam?.name ?? 'Texas Drive Auto Sales Team')
		.replaceAll('Kristin Watson', tradeInTeam?.name ?? 'Texas Drive Auto Trade-In Team')
		.replaceAll('Guy Hawkins', salesTeam?.name ?? 'Texas Drive Auto Sales Team')
		.replaceAll('Darrell Steward', salesTeam?.name ?? 'Texas Drive Auto Sales Team')
		.replaceAll('Cody Fisher', tradeInTeam?.name ?? 'Texas Drive Auto Trade-In Team')
		.replaceAll('Eleanor Pena', salesTeam?.name ?? 'Texas Drive Auto Sales Team')
		.replaceAll('Los Angeles,California', 'Dallas, Bulgaria')
		.replaceAll('FROM:', 'Location:')
		.replaceAll('two-sided marketplace business', 'Texas Drive Auto’s operations')
		.replaceAll(
			'responsible for driving profitable growth strategies for its two-sided marketplace business, Society6.',
			'provides a place to ask about viewings, paperwork, and purchase steps. Trade-in availability is unconfirmed.'
		)
		.replaceAll(
			'Prior to Leaf Group, Oliver was Director of Finance at Ogin, Inc., a private equity backed clean technology company.',
			'Confirm vehicle availability, price, mileage, and condition directly.'
		)
		.replaceAll('How the adventure ended will...', 'Vehicle listed by Texas Drive Auto. Inspection status is unconfirmed.')
		.replaceAll('How the adventure ended will be seen soon.', 'Vehicle listed by Texas Drive Auto. Inspection status is unconfirmed.')
		.replaceAll('Vehicle Information', 'Vehicle details')
		.replaceAll('Car Details', 'Vehicle details')
		.replace(
			/<a href="#" class="flex gap-16">/g,
			`<a href="tel:${daynightSite.phone}" class="flex gap-16">`
		)
		.replace(
			/<a href="#" class="h4 font-weight-600 mb-8 capitalize">/g,
			'<a href="/contact" class="h4 font-weight-600 mb-8 capitalize" title="Contact Texas Drive Auto to ask about this service">'
		)
		.replace(
			/<a href="#" class="h4 font-weight-600 mb-8">/g,
			'<a href="/sell-your-car/request" class="h4 font-weight-600 mb-8" title="Prepare an inquiry for Texas Drive Auto">'
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
			'<a href="/contact" title="Texas Drive Auto mobile app"><img class="h-40" src="/assets/images/brand/app-store-primary.png" alt="app-store">'
		)
		.replace(
			/<a href="#">\s*<img class="h-40" src="\/assets\/images\/brand\/google-play-primary\.png" alt="google-play">/g,
			'<a href="/contact" title="Texas Drive Auto mobile app"><img class="h-40" src="/assets/images/brand/google-play-primary.png" alt="google-play">'
		)
		.replaceAll(
			'Darrell Steward is a dedicated automotive professional with over 15 years of experience in the car dealership industry. Known for his customer-first approach and in-depth knowledge of the market, Darrell has helped countless clients find their perfect vehicle while ensuring a seamless and enjoyable buying experience.',
			salesTeam?.bio ??
				'Ask about vehicle selection, viewings, paperwork, registration, and trade-in availability. No dealer financing or payment plans are offered.'
		)
		.replaceAll(
			'His passion for automobiles began at a young age, driving him to excel in understanding every aspect of car sales, from customer service to financing solutions. Darrell is committed to building lasting relationships with his clients, always prioritizing trust and transparency.',
			'Ask for clear vehicle information and the next steps for your inquiry.'
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
				'This page doesn’t exist or has moved.'
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
				'<a href="/compare" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" title="Compare vehicle">'
			)
			.replace(
				/<a class="listing-details-item--button" href="#">\s*<img src="\/assets\/icons\/playcircle\.svg" alt="play">\s*Play Video\s*<\/a>/g,
				'<a class="listing-details-item--button" href="/contact" title="Video overview"><img src="/assets/icons/playcircle.svg" alt="" aria-hidden="true">Video overview</a>'
			)
			.replace(
				/<a href="#" class="text-sm text-underline text-highlight">View location<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-sm text-underline text-highlight" target="_blank" rel="noopener">View location</a>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight text-sm">\s*View location\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">View location</a>`
			)
			.replace(
				/<a href="#" class="text-underline text-highlight ?" id="coreDropdownBtn">Vehicle in the VAT system<\/a>/g,
				'<a href="/terms" class="text-underline text-highlight" id="coreDropdownBtn">VAT status</a>'
			)
			.replace(
				/<a href="#" class="text-underline text-highlight ?">Vehicle in the VAT system<\/a>/g,
				'<a href="/terms" class="text-underline text-highlight">VAT status</a>'
			)
			.replace(
				/<a href="#" class="h4 mb-8 font-weight-600">Texas Drive Auto<\/a>/g,
				'<a href="/about/daynight-auto-plovdiv" class="h4 mb-8 font-weight-600">Texas Drive Auto</a>'
			)
			.replace(
				/<a href="#">\s*City\. Dallas, Dallas, City. Dallas, Studentski Grad, Atanas Manchev St. 18\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener">${daynightSite.location}</a>`
			)
			.replace(
				/<a href="#" class="btn btn-medium btn-primary-4 font-weight-600 gap-5">([\s\S]*?Chat via WhatsApp\s*)<\/a>/g,
				`<a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-medium btn-primary-4 font-weight-600 gap-5">$1</a>`
			)
			.replace(
				/<a href="#" class="text-xs text-underline text-highlight">Visitor Agreement\.<\/a>/g,
				'<a href="/terms" class="text-xs text-underline text-highlight">User Agreement.</a>'
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
				/<a href="#">\s*City\. Dallas, Dallas, City. Dallas, Studentski Grad, Atanas Manchev St. 18\s*<\/a>/g,
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
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">View location</a>`
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
			.replace(/Write a review/gi, 'Add feedback')
			.replace(/View more reviews \(98\)/gi, daynightSite.reviewLinkLabel)
			.replace(/\(1,968 Ratings\)/g, `(${daynightSite.reviewCountLabel})`)
			.replace(/add a review/gi, 'Add feedback')
			.replace(/August 13, 2025/g, 'August 2025')
			.replace(/August 22, 2025/g, 'August 2025')
			.replace(/August 18, 2025/g, 'August 2025')
			.replace(/Randynox/g, 'Ivan Dimitrov')
			.replace(/Mista Nyroom/g, 'Maria Georgieva')
			.replace(
				/Bought new in 2012, and it’s still running strong at over 180,000 miles\. I’ve only had to replace the battery and brakes once\. The ride is smooth, the interior still feels solid, and the fuel economy hasn’t dropped much\./g,
				'Customer reviews are unavailable in this preview. Ask about mileage, paperwork, and vehicle condition before scheduling a viewing.'
			)
			.replace(
				/Picked this car up used about five years ago with 90k miles\. It’s now at 160k and still starts every morning without hesitation\. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives\./g,
				'Customer reviews are unavailable in this preview. Compare vehicles, confirm viewing availability, and arrange any funding independently. No dealer financing or payment plans are offered.'
			)
			.replace(
				/<form action="#" class="add-review-form">/i,
				'<form action="/contact?intent=review" class="add-review-form" title="Review verification and publication are unavailable in this preview.">'
			)
			.replace(
				/<input class="input-large" name="email-review" id="email-review" type="text" value="[^"]+" required="" \/>/i,
				'<input class="input-large" name="email-review" id="email-review" type="text" value="" placeholder="Your email" required="" />'
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
				/<a href="#">\s*City\. Dallas, Dallas, City. Dallas, Studentski Grad, Atanas Manchev St. 18\s*<\/a>/g,
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
				/<a href="#" class="text-underline text-highlight text-sm">\s*(?:Get Directions|View location)\s*<\/a>/g,
				`<a href="${daynightSite.mapUrl}" class="text-underline text-highlight text-sm" target="_blank" rel="noopener">View location</a>`
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
			.replace(/Write A Review/gi, 'Add feedback')
			.replace(/View More Reviews \(98\)/gi, daynightSite.reviewLinkLabel)
			.replace(/Add A Review/gi, 'Add feedback')
			.replace(/\(1,968 Ratings\)/g, `(${daynightSite.reviewCountLabel})`)
			.replace(/August 13, 2025/g, 'August 2025')
			.replace(/August 22, 2025/g, 'August 2025')
			.replace(/August 18, 2025/g, 'August 2025')
			.replace(
				/<form action="#" class="send-inquiry">/i,
				'<form action="/contact?intent=team" class="send-inquiry">'
			)
			.replace(
				/<form action="#" class="add-review-form">/i,
				'<form action="/contact?intent=review" class="add-review-form" title="Review verification and publication are unavailable in this preview.">'
			)
			.replace(
				/<input class="input-large" name="email-review" id="email-review" type="text" value="[^"]+" required="" \/>/i,
				'<input class="input-large" name="email-review" id="email-review" type="text" value="" placeholder="Your email" required="" />'
			)
			.replace(
				/<button class="btn btn-primary btn-large font-weight-600 capitalize open-modal" data-modal-id="#LoginModal">[\s\S]*?<\/button>/i,
				'<a href="/contact?intent=review" class="btn btn-primary btn-large font-weight-600 capitalize" title="Review verification and publication are unavailable in this preview.">Draft feedback</a>'
			)
			.replace(
				/<button class="btn btn-primary btn-large font-weight-600 w-full">\s*Prepare inquiry\s*<\/button>/i,
				'<button class="btn btn-primary btn-large font-weight-600 w-full">Send inquiry</button>'
			)
			.replaceAll('Send vehicle inquiry', 'Send inquiry')
			.replaceAll('Viewing interest 2', 'Trade-in or appraisal inquiry')
			.replaceAll('Viewing interest 3', 'Paperwork and payment')
			.replaceAll('<p class="mb-6">Message</p>', '<p class="mb-6">Message</p>')
			.replaceAll('value="demo@getrich.local"', 'value="" placeholder="Your email"')
			.replaceAll(
				'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
				'I would like updates on availability and next steps for this inquiry.'
			)
			.replaceAll('By using this service, you accept our ', 'By submitting the form, you accept the ')
			.replaceAll('Visitor Agreement.', 'terms of use.')
			.replaceAll('CEO Texas Drive Auto', 'Texas Drive Auto preview placeholder')
			.replaceAll(
				member?.name ?? '',
				member?.name ?? daynightTeam[0]?.name ?? 'Texas Drive Auto sample team profiles'
			);
	}

	if (templateFile === 'services-center.html') {
		output = output
			.replaceAll('value="Tony Nguyen"', 'value="" placeholder="Your name"')
			.replaceAll('value="themesflat@gmail.com"', 'value="" placeholder="Your email"')
			.replaceAll('value="demo@getrich.local"', 'value="" placeholder="Your email"')
			.replaceAll('value="01/23/2024"', 'value=""')
			.replaceAll('value="2024-01-23"', 'value=""')
			.replaceAll('Phone (optional)', 'Phone')
			.replaceAll('placeholder="Phone (optional)"', 'placeholder="Phone"')
			.replace(
				/<a href="tel:(214) 972-3233" class="text-sm text-white">(214) 972-3233<\/a>\s*<a href="tel:(214) 972-3233" class="text-sm text-white">(214) 972-3233<\/a>/,
				'<a href="tel:(214) 972-3233" class="text-sm text-white">(214) 972-3233</a><a href="mailto:demo@getrich.local" class="text-sm text-white">demo@getrich.local</a>'
			)
			.replaceAll('Viewings: by appointment', 'Viewings: by appointment')
			.replaceAll(
				'Documents and handoff: after confirmation',
				'Documents and handoff: after confirmation'
			)
			.replace(
				/<select class="select-style-2" name="SendInquirybrand" id="SendInquirybrand">[\s\S]*?<\/select>/,
				`<select class="select-style-2" name="SendInquirybrand" id="SendInquirybrand">
									<option>Select make</option>
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
									<option>Select model</option>
									<option>I’ll confirm with the dealership</option>
									<option>Still deciding</option>
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
				/<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600">\s*Review inquiry\s*<\/a>/g,
				'<a href="/sell-your-car/request?preview=1" class="btn btn-line-1 px-24 btn-large font-weight-600" title="Review request">Review request</a>'
			)
			.replace(
				/<a href="#" class="btn btn-primary px-24 btn-large font-weight-600">\s*Prepare inquiry\s*<\/a>/g,
				'<a href="/sell-your-car/request" class="btn btn-primary px-24 btn-large font-weight-600">Submit request</a>'
			)
			.replace(/<a class="item" href="#">/g, `<a class="item" href="/contact">`);
	}

	if (templateFile === 'financing.html') {
		output = output
			.replaceAll('Search by your monthly budget', 'Review your purchase budget')
			.replaceAll('Select an offer on the car', 'Choose a vehicle')
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">Draft an inquiry<\/a>/g,
				'<a href="/contact?intent=financing" class="h4 font-weight-600 mb-8 capitalize text-center">Draft an inquiry</a>'
			)
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">\s*Explore your independently funded monthly budget\s*<\/a>/g,
				'<a href="/calculator" class="h4 font-weight-600 mb-8 capitalize text-center">Review your purchase budget</a>'
			)
			.replace(
				/<a href="#" class="h4 font-weight-600 mb-8 capitalize text-center">Choose a vehicle<\/a>/g,
				'<a href="/inventory" class="h4 font-weight-600 mb-8 capitalize text-center">Choose a vehicle</a>'
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
				/<a href="#" class="h4 mb-8 font-weight-600">Texas Drive Auto<\/a>/g,
				'<a href="/about/daynight-auto-plovdiv" class="h4 mb-8 font-weight-600">Texas Drive Auto</a>'
			)
			.replace(
				/<a class="text-white" href="#">Texas Drive Auto<\/a>/g,
				'<a class="text-white" href="/about/daynight-auto-plovdiv">Texas Drive Auto</a>'
			)
			.replace(
				/<a class="text-white" href="#">Aug\. 8, 2025<\/a>/g,
				'<a class="text-white" href="/blog">Aug. 8, 2025</a>'
			)
			.replace(
				/<a class="uppercase text-underline text-highlight" href="#">TIPS<\/a>/g,
				'<a class="uppercase text-underline text-highlight" href="/blog">TIPS</a>'
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

	if (!output.includes('Vehicles')) {
		output = output.replace(daynightSite.sellCarCta, 'Vehicles');
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
		.replaceAll('Car Dealer, Rental & Listing HTML Template', 'Texas Drive Auto')
		.replaceAll('Aurexo |', 'Texas Drive Auto |');
}
