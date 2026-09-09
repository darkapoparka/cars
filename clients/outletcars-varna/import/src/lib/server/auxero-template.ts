import {
	daynightAssets,
	daynightBrand,
	daynightContact,
	isPrimaryNavActive,
	mainNavigation
} from '$lib/data/daynight';
import { vehicles } from '$lib/data/vehicles';
import {
	applyAccountTemplateData,
	getAuxeroAccountRuntimeData,
	isAccountTemplate
} from './auxero-account-data';
import { accountContext } from './account-dashboard-state';
import { canAccessDayNightRoute, resolveDayNightPageSession, resolveDayNightSession } from './auth';
import {
	applyAgentDetailData,
	applyAgentsData,
	applyCompareData,
	applyContactData,
	applyDetailData,
	applyInventoryData,
	getAuxeroListingRuntimeData,
	type AuxeroRenderOptions
} from './auxero-listing-data';
import { resolveLocale } from '$lib/i18n/messages';
import { applyHome05TemplateData, applyHomeTemplateData } from './auxero-home-data';
import { applySupportTemplateData, isSupportTemplate } from './auxero-support-data';
import { inventoryTemplateForView, resolveInventoryView } from './inventory-state';

const templateModules = import.meta.glob(
	[
		'../../../.template-ref/about-us.html',
		'../../../.template-ref/add-listings-2.html',
		'../../../.template-ref/blog-details-1.html',
		'../../../.template-ref/blog-grid-style-1.html',
		'../../../.template-ref/calculator.html',
		'../../../.template-ref/change-password.html',
		'../../../.template-ref/clients-reviews.html',
		'../../../.template-ref/compare.html',
		'../../../.template-ref/contact-us.html',
		'../../../.template-ref/dashboard.html',
		'../../../.template-ref/faqs.html',
		'../../../.template-ref/home-05.html',
		'../../../.template-ref/home-09.html',
		'../../../.template-ref/listing-details-3.html',
		'../../../.template-ref/listing-grid3-columns.html',
		'../../../.template-ref/listing-grid4-columns.html',
		'../../../.template-ref/listing-gridstyle-halfmap.html',
		'../../../.template-ref/message.html',
		'../../../.template-ref/my-favorites.html',
		'../../../.template-ref/my-listings.html',
		'../../../.template-ref/my-profile.html',
		'../../../.template-ref/sale-agents-details.html',
		'../../../.template-ref/sale-agents.html',
		'../../../.template-ref/sell-your-car.html',
		'../../../.template-ref/services-center.html',
		'../../../.template-ref/terms.html'
	],
	{
		query: '?raw',
		import: 'default',
		eager: true
	}
) as Record<string, string>;

const htmlByFile = Object.fromEntries(
	Object.entries(templateModules).map(([path, html]) => [path.split('/').pop() ?? path, html])
);

const prettyRouteToFile: Record<string, string> = {
	about: 'about-us.html',
	services: 'services-center.html',
	financing: 'services-center.html',
	faq: 'faqs.html',
	faqs: 'faqs.html',
	'sell-your-car': 'sell-your-car.html',
	agents: 'sale-agents.html',
	'agents/daynight-sales': 'sale-agents-details.html',
	'agents/daynight-import': 'sale-agents-details.html',
	'agents/daynight-inspection': 'sale-agents-details.html',
	reviews: 'clients-reviews.html',
	calculator: 'calculator.html',
	compare: 'compare.html',
	blog: 'blog-grid-style-1.html',
	'blog/vnos-ot-kanada-proverka': 'blog-details-1.html',
	'blog/gotov-za-registracia': 'blog-details-1.html',
	'blog/prodai-avtomobila-si': 'blog-details-1.html',
	contact: 'contact-us.html',
	terms: 'terms.html',
	account: 'dashboard.html',
	'account/favorites': 'my-favorites.html',
	'account/compare': 'compare.html',
	'account/messages': 'message.html',
	'account/listings': 'my-listings.html',
	'account/profile': 'my-profile.html',
	'account/password': 'change-password.html',
	admin: 'dashboard.html',
	'admin/inventory': 'my-listings.html',
	'admin/inventory/new': 'add-listings-2.html',
	'admin/inquiries': 'message.html',
	'admin/messages': 'message.html',
	'admin/agents': 'sale-agents.html',
	'admin/users': 'dashboard.html',
	dashboard: 'dashboard.html'
};

const primaryPageToFile = {
	home: 'home-05.html',
	inventory: 'listing-grid4-columns.html',
	detail: 'listing-details-3.html'
} as const;

type AuxeroPrimaryPage = keyof typeof primaryPageToFile;

const firstVehicleSlug = vehicles[0]?.slug ?? '21764342419542174';

const blockedTemplateFiles = new Set([
	'check-out.html',
	'coming-soon.html',
	'product-details.html',
	'shop.html',
	'shopping-cart.html'
]);

const blockedPrettyRoutes = new Set([
	'check-out',
	'checkout',
	'coming-soon',
	'product-details',
	'shop',
	'shopping-cart'
]);

const canonicalTemplateRoutes: Record<string, string> = {
	'404.html': '/',
	'about-us.html': '/about',
	'add-listings.html': '/admin/inventory/new',
	'add-listings-2.html': '/admin/inventory/new',
	'blog-details-1.html': '/blog/vnos-ot-kanada-proverka',
	'blog-details-2.html': '/blog/gotov-za-registracia',
	'blog-grid-style-1.html': '/blog',
	'blog-grid-style-2.html': '/blog',
	'blog-grid-style-3.html': '/blog',
	'blog-list.html': '/blog',
	'blog-standard.html': '/blog',
	'calculator.html': '/calculator',
	'change-password.html': '/account/password',
	'clients-reviews.html': '/reviews',
	'compare.html': '/compare',
	'contact-us.html': '/contact',
	'dashboard.html': '/account',
	'dealer-details.html': '/agents/daynight-sales',
	'dealers-listing.html': '/agents',
	'faqs.html': '/faqs',
	'financing.html': '/services',
	'home-09.html': '/',
	'index.html': '/',
	'listing-grid2-columns.html': '/inventory',
	'listing-grid3-columns.html': '/inventory?view=3',
	'listing-grid4-columns.html': '/inventory',
	'listing-gridstyle-halfmap.html': '/inventory?view=map',
	'listing-liststyle-halfmap.html': '/inventory?view=map',
	'listing-liststyle-sidebar.html': '/inventory',
	'listing-sidebar-left.html': '/inventory',
	'listing-sidebar-right.html': '/inventory',
	'listing-topmap.html': '/inventory?view=map',
	'message.html': '/account/messages',
	'my-favorites.html': '/account/favorites',
	'my-listings.html': '/account/listings',
	'my-profile.html': '/account/profile',
	'reviews.html': '/reviews',
	'sale-agents-details.html': '/agents/daynight-sales',
	'sale-agents.html': '/agents',
	'sell-your-car.html': '/sell-your-car',
	'services-center.html': '/services',
	'terms.html': '/terms'
};

const duplicateHomeFiles = [
	'home-02.html',
	'home-03.html',
	'home-04.html',
	'home-05.html',
	'home-06.html',
	'home-07.html',
	'home-08.html',
	'home-10.html'
];

const duplicateDetailFiles = [
	'listing-details-1.html',
	'listing-details-2.html',
	'listing-details-3.html',
	'listing-details-4.html',
	'listing-details-5.html',
	'listing-details-6.html'
];

for (const file of duplicateHomeFiles) {
	canonicalTemplateRoutes[file] = '/';
}

for (const file of duplicateDetailFiles) {
	canonicalTemplateRoutes[file] = `/inventory/${firstVehicleSlug}`;
}

const rawTemplateRouteFiles = new Set(Object.keys(canonicalTemplateRoutes));

const stripAuxeroTemplateScriptTags = (html: string) =>
	html.replace(
		/\s*<script\b[^>]*\bsrc=(["'])(?:\.?\/assets\/js\/[^"']+|https:\/\/code\.jquery\.com\/ui\/[^"']+)\1[^>]*><\/script>\s*/gi,
		'\n'
	);

function normalizeAssetUrls(html: string) {
	return stripAuxeroTemplateScriptTags(html)
		.replaceAll('./assets/', '/assets/')
		.replaceAll('href="assets/', 'href="/assets/')
		.replaceAll("href='assets/", "href='/assets/")
		.replaceAll('src="assets/', 'src="/assets/')
		.replaceAll("src='assets/", "src='/assets/")
		.replaceAll('content="./assets/', 'content="/assets/')
		.replaceAll('content="assets/', 'content="/assets/');
}

function applyBackgroundImages(html: string) {
	return html.replace(/data-background="([^"]+)"/g, (_match, src: string) => {
		return `data-background="${src}" style="background-image: url('${src}')"`;
	});
}

function routeForTemplateFile(file: string) {
	const normalized = file.replace(/^\/+/, '');

	if (blockedTemplateFiles.has(normalized)) {
		return '/inventory';
	}

	return canonicalTemplateRoutes[normalized] ?? `/${normalized}`;
}

function canonicalRouteForRawTemplateRequest(routePath: string, templateFile: string) {
	const normalizedPath = routePath.replace(/^\/+|\/+$/g, '');
	const templateStem = templateFile.replace(/\.html$/i, '');
	const isRawTemplateRequest = normalizedPath === templateFile || normalizedPath === templateStem;

	if (!isRawTemplateRequest) {
		return undefined;
	}

	const canonicalRoute = canonicalTemplateRoutes[templateFile];

	if (!canonicalRoute) {
		return undefined;
	}

	const currentRoute = `/${normalizedPath}`;

	return canonicalRoute === currentRoute ? undefined : canonicalRoute;
}

function rewriteTemplateLinks(html: string) {
	return html.replace(
		/href=(["'])(?!https?:|mailto:|tel:|#)(?:\.\/|\/)?([^"']+\.html)\1/g,
		(_match, quote: string, file: string) => {
			return `href=${quote}${routeForTemplateFile(file)}${quote}`;
		}
	);
}

function wireGlobalSearchForms(html: string) {
	return html
		.replace(
			/<form class="search-form__form" action="#" method="get">/g,
			'<form class="search-form__form" action="/inventory" method="get" data-daynight-search-form="inventory">'
		)
		.replace(
			/<form class="search-modal__form" action="#" method="get">/g,
			'<form class="search-modal__form" action="/inventory" method="get" data-daynight-search-form="inventory">'
		)
		.replace(
			/<input type="text" class="search-form__input" placeholder="Search\.\.\." autocomplete="off" id="searchInput">/g,
			'<input type="text" class="search-form__input" name="q" placeholder="Search OUTLETCARS.BG — Варна inventory" autocomplete="off" id="searchInput">'
		)
		.replace(
			/<input type="text" class="search-modal__input" placeholder="Search for anything" autocomplete="off" id="searchModalInput">/g,
			'<input type="text" class="search-modal__input" name="q" placeholder="Search OUTLETCARS.BG — Варна inventory" autocomplete="off" id="searchModalInput">'
		);
}

function clearAuthModalDemoValues(html: string) {
	return html
		.replace(
			/value="[^"]*" type="email" id="email-login" name="email-login"/g,
			'value="" type="email" id="email-login" name="email-login"'
		)
		.replace(
			/value="[^"]*" type="email" id="SignUp-login" name="SignUp-login"/g,
			'value="" type="email" id="SignUp-login" name="SignUp-login"'
		);
}

function stripBlockedTemplateAnchors(html: string) {
	const blockedHrefPattern = [...blockedTemplateFiles]
		.map((file) => file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|');
	const blockedAnchorPattern = new RegExp(
		`\\s*<a\\b(?=[^>]*href=(["'])(?:\\./|/)?(?:${blockedHrefPattern})\\1)[^>]*>[\\s\\S]*?<\\/a>`,
		'g'
	);

	return html.replace(blockedAnchorPattern, '');
}

function applyDayNightBranding(html: string) {
	return html
		.replaceAll('Aurexo | Car Dealer, Rental & Listing HTML Template', 'OUTLETCARS.BG — Варна')
		.replaceAll('Aurexo Garage', 'OUTLETCARS.BG — Варна')
		.replaceAll('Aurexo', daynightBrand.name)
		.replaceAll('Super Admin', 'OUTLETCARS.BG — Варна Admin')
		.replaceAll('themesflat@gmail.com', daynightContact.emailLabel)
		.replaceAll('https://themeforest.net/user/themesflat', `https://${daynightBrand.domain}`)
		.replace(
			/6205 Peachtree Dunwoody Rd,\s*Atlanta,\s*(?:GA 30328)?/g,
			daynightContact.addressLabel
		)
		.replaceAll('/assets/images/logo-white.png', daynightAssets.logoDark)
		.replaceAll('/assets/images/logo.png', daynightAssets.logoLight)
		.replaceAll(
			'/assets/images/brand/app-store-dark.png',
			'/assets/images/brand/app-store-dark.webp'
		)
		.replaceAll(
			'/assets/images/brand/google-play-dark.png',
			'/assets/images/brand/google-play-dark.webp'
		)
		.replaceAll('alt="logo-white.png"', 'alt="OUTLETCARS.BG — Варна"')
		.replaceAll('alt="logo"', 'alt="OUTLETCARS.BG — Варна"')
		.replaceAll('href="/account/favorites"', 'href="/account"')
		.replaceAll('href="./account/favorites"', 'href="./account"')
		.replaceAll('aria-label="Wishlist"', 'aria-label="Любими"')
		.replaceAll('Search Cars Near You – Buy Today!', 'Find Your Next OUTLETCARS.BG — Варна Vehicle')
		.replaceAll('Search Cars Near You', 'Find Your Next OUTLETCARS.BG — Варна Vehicle')
		.replaceAll('Get Your Dream Car', 'Import or buy with OUTLETCARS.BG — Варна')
		.replaceAll('Listing Grid 3 Columns', 'OUTLETCARS.BG — Варна Inventory')
		.replaceAll('Sale Agents', 'OUTLETCARS.BG — Варна Consultants')
		.replaceAll('Sale Agents List', 'Consultants')
		.replaceAll('Sale Agents Detail', 'Consultant Profile')
		.replaceAll('Dealer Listing', 'Consultants')
		.replaceAll('Dealer Detail', 'Consultant Detail')
		.replaceAll('Want to sell your car?', 'Want to sell your car with OUTLETCARS.BG — Варна?')
		.replaceAll('Contact Us', 'Contact OUTLETCARS.BG — Варна')
		.replaceAll('Get Prequalified for Auto Financing', 'Services for import, documents, and sales')
		.replaceAll('Financing', 'Services')
		.replaceAll('Sevices Center', 'Services')
		.replaceAll('Services Center', 'Services')
		.replace(
			/Monday–Friday from 8 AM to 8 PM\s*<br>\s*Saturday from 9 AM to 6 PM EST/g,
			'Monday-Friday 9:00 - 18:00 <br>Weekend viewings by appointment'
		)
		.replaceAll('Buying a car', 'Buying With OUTLETCARS.BG — Варна')
		.replaceAll('Selling a car', 'Sell Your Car')
		.replaceAll('Investor Relations', 'Services')
		.replaceAll('Careers', 'FAQ')
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replaceAll('Listings by City', 'Inventory Map')
		.replaceAll('Certified Pre-Owned', 'Verified Listings')
		.replaceAll('Car Payment Calculators', 'Import Calculator')
		.replaceAll('Car Reviews & Ratings', 'Client Reviews')
		.replaceAll('Download App', 'OUTLETCARS.BG — Варна Online')
		.replaceAll('Clients Reviews', 'Client Reviews')
		.replace(/My Listing(?!s)/g, 'My Listings')
		.replaceAll('My Reviews', 'Reviews')
		.replaceAll('All Listing', 'Inventory')
		.replaceAll('Recent Reviews', 'Recent Inquiries')
		.replaceAll('Car Views', 'Lead Views')
		.replaceAll('Pending', 'Open Leads')
		.replaceAll('tel:1-555-678-8888', daynightContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', daynightContact.marketplacePhoneHref)
		.replaceAll('tel:1-333-123-6666', daynightContact.marketplacePhoneHref)
		.replaceAll('tel:1-866-288-6868', daynightContact.primaryPhoneHref)
		.replaceAll('tel:5551234567', daynightContact.primaryPhoneHref)
		.replaceAll('1-555-678-8888', daynightContact.primaryPhoneLabel)
		.replaceAll('1-555-678-9999', daynightContact.marketplacePhoneLabel)
		.replaceAll('1-333-123-6666', daynightContact.marketplacePhoneLabel)
		.replaceAll('1-866-288-6868', daynightContact.primaryPhoneLabel)
		.replaceAll('(555) 123-4567', daynightContact.primaryPhoneLabel)
		.replace(
			/<p class="text-secondary mb-4">Username:[\s\S]*?<\/p>\s*<p class="text-secondary">Password:[\s\S]*?<\/p>/g,
			'<p class="text-secondary mb-4">Use your OUTLETCARS.BG — Варна account credentials.</p>'
		)
		.replace(
			/©2026[\s\S]*?All Rights Reserved\./g,
			`©2026 ${daynightBrand.name}. All Rights Reserved.`
		);
}

function collapseDuplicateAdjacentPhoneLinks(html: string) {
	return html.replace(
		/(<a\b[^>]*href=(["'])(tel:[^"']+)\2[^>]*>([\s\S]*?)<\/a>)(\s*)<a\b[^>]*href=\2\3\2[^>]*>([\s\S]*?)<\/a>/g,
		(
			match,
			firstLink: string,
			_quote: string,
			_href: string,
			firstText: string,
			_space: string,
			secondText: string
		) => {
			const normalize = (value: string) =>
				value
					.replace(/<[^>]*>/g, '')
					.replace(/\s+/g, ' ')
					.trim();

			return normalize(firstText) === normalize(secondText) ? firstLink : match;
		}
	);
}

function rewriteUnfinishedAccountDashboardLinks(html: string) {
	return html
		.replaceAll('href="/account/favorites"', 'href="/account"')
		.replaceAll('href="./account/favorites"', 'href="./account"');
}

function navMarkup(pathname: string) {
	return mainNavigation
		.map((item) => {
			const active = isPrimaryNavActive(pathname, item);
			const { href, label } = item;
			return `<li class="menu-item ${active ? 'current-menu-item menu-item-main' : ''}"><a href="${href}">${label}</a></li>`;
		})
		.join('');
}

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

function applyAuxeroAccessibilityLabels(html: string, templateFile: string) {
	let next = html
		.replace(
			/<button type="submit" class="btn-submit"(?![^>]*aria-label)/g,
			'<button type="submit" class="btn-submit" aria-label="Изпрати" title="Изпрати"'
		)
		.replace(
			/<a href="https:\/\/www\.facebook\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://www.facebook.com$1" aria-label="Facebook" title="Facebook"'
		)
		.replace(
			/<a href="https:\/\/x\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://x.com$1" aria-label="X" title="X"'
		)
		.replace(
			/<a href="https:\/\/www\.instagram\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://www.instagram.com$1" aria-label="Instagram" title="Instagram"'
		)
		.replace(
			/<a href="https:\/\/www\.tiktok\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://www.tiktok.com$1" aria-label="TikTok" title="TikTok"'
		)
		.replace(
			/<a href="https:\/\/www\.amazon\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://www.amazon.com$1" aria-label="Amazon" title="Amazon"'
		)
		.replace(
			/<a href="https:\/\/www\.pinterest\.com([^"]*)"(?![^>]*aria-label)/g,
			'<a href="https://www.pinterest.com$1" aria-label="Pinterest" title="Pinterest"'
		)
		.replace(
			/<a href="#" class="pagination__link">\s*(<svg[\s\S]*?<\/svg>)\s*<\/a>/g,
			'<a href="#" class="pagination__link" aria-label="Следваща страница" title="Следваща страница">$1</a>'
		);

	if (templateFile === 'contact-us.html') {
		const contactSocialLabels = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok', 'Pinterest'];
		let contactSocialIndex = 0;
		next = next.replace(
			/<a href="#" class="hover-(?:fill|stroke)-white"(?![^>]*aria-label)>/g,
			(match) => {
				const label = contactSocialLabels[contactSocialIndex++];
				return label ? match.replace('>', ` aria-label="${label}" title="${label}">`) : match;
			}
		);
	}

	return next;
}

function findClosingTagIndex(html: string, openTagIndex: number, tagName: string) {
	if (openTagIndex < 0) return -1;

	const pattern = new RegExp(`</?${tagName}\\b[^>]*>`, 'gi');
	pattern.lastIndex = openTagIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith(`</${tagName}`)) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
}

function rewritePrimaryNavigation(html: string, templateFile: string) {
	if (isAccountTemplate(templateFile)) {
		return html;
	}

	const pathname = routeForTemplateFile(templateFile).split('?')[0];
	const start = html.indexOf('<ul id="menu-primary-menu"');
	const openingEnd = html.indexOf('>', start);
	const end = findClosingTagIndex(html, start, 'ul');

	if (start < 0 || openingEnd < 0 || end < 0) {
		return html;
	}

	const opening = html.slice(start, openingEnd + 1);
	const className = opening.match(/class="([^"]+)"/)?.[1] ?? 'menu';

	return `${html.slice(0, start)}<ul id="menu-primary-menu" class="${className}">${navMarkup(pathname)}</ul>${html.slice(end)}`;
}

const accountDashboardTitles: Record<string, string> = {
	add: 'Подай автомобил',
	compare: 'Сравнения',
	dashboard: 'Табло на акаунта',
	favorites: 'Запазени автомобили',
	inquiries: 'Запитвания',
	listings: 'Моите автомобили',
	messages: 'Съобщения',
	password: 'Сигурност на профила',
	profile: 'Данни за контакт',
	reviews: 'Отзиви'
};

const adminDashboardTitles: Record<string, string> = {
	add: 'Add Listing',
	agents: 'Agents',
	dashboard: 'Admin Dashboard',
	inquiries: 'Inquiries',
	listings: 'Inventory Management',
	messages: 'Messages',
	password: 'Profile Security',
	profile: 'Admin Profile',
	users: 'User Management'
};

function dashboardContextHeaderMarkup(templateFile: string, options: AuxeroRenderOptions = {}) {
	const context = accountContext(templateFile, options);
	const titleMap = context.isAdmin ? adminDashboardTitles : accountDashboardTitles;
	const title = titleMap[context.active] ?? titleMap.dashboard;
	const eyebrow = context.isAdmin ? 'Admin dashboard' : 'Клиентско табло';
	const dashboardLabel = context.isAdmin ? 'Admin Dashboard' : 'Табло';
	const dashboardHref = context.basePath;
	const links = [
		{
			active: false,
			href: '/inventory',
			label: context.isAdmin ? 'Inventory' : 'Автомобили'
		},
		{ active: context.active === 'dashboard', href: dashboardHref, label: dashboardLabel }
	];

	return `<div id="main-nav" class="main-nav mr-18 daynight-dashboard-context-header" data-daynight-dashboard-context-header>
	<div class="daynight-dashboard-context-heading">
		<span>${escapeHtml(eyebrow)}</span>
		<p class="h4 mb-0">${escapeHtml(title)}</p>
	</div>
	<ul id="menu-primary-menu" class="menu daynight-dashboard-context-links" data-daynight-dashboard-context-nav>
		${links
			.map(
				(link) =>
					`<li class="menu-item ${link.active ? 'current-menu-item menu-item-main' : ''}"><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`
			)
			.join('\n')}
	</ul>
</div>`;
}

function applyDashboardContextHeader(
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) {
	if (!isAccountTemplate(templateFile)) return html;

	const withWrapperClass = html.replace(
		/<div class="header-right main-nav-wrapper([^"]*)"/,
		'<div class="header-right main-nav-wrapper daynight-dashboard-header-wrapper$1"'
	);
	const start = withWrapperClass.indexOf('<nav id="main-nav"');
	const end = findClosingTagIndex(withWrapperClass, start, 'nav');

	if (start < 0 || end < 0) {
		return withWrapperClass;
	}

	return `${withWrapperClass.slice(0, start)}${dashboardContextHeaderMarkup(templateFile, options)}${withWrapperClass.slice(end)}`;
}

function applyTemplateData(html: string, templateFile: string, options: AuxeroRenderOptions = {}) {
	if (templateFile === 'home-05.html') {
		return applyHome05TemplateData(html);
	}

	if (templateFile === 'home-09.html') {
		return applyHomeTemplateData(html);
	}

	if (
		templateFile === 'listing-grid3-columns.html' ||
		templateFile === 'listing-grid4-columns.html' ||
		templateFile === 'listing-gridstyle-halfmap.html' ||
		templateFile === 'listing-topmap.html'
	) {
		return applyInventoryData(html, templateFile, options);
	}

	if (templateFile === 'listing-details-3.html') {
		return applyDetailData(html, options);
	}

	if (templateFile === 'compare.html') {
		return applyCompareData(html, options);
	}

	if (templateFile === 'sale-agents.html') {
		return applyAgentsData(html, options);
	}

	if (templateFile === 'sale-agents-details.html') {
		return applyAgentDetailData(html, options);
	}

	if (templateFile === 'contact-us.html') {
		return applyContactData(html);
	}

	if (isAccountTemplate(templateFile)) {
		return applyAccountTemplateData(html, templateFile, options);
	}

	if (isSupportTemplate(templateFile)) {
		return applySupportTemplateData(html, templateFile, options);
	}

	return html;
}

function injectLocalBehavior(
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) {
	const pageClass = `auxero-template-${templateFile.replace(/[^a-z0-9]/gi, '-')}`;
	const runtimeData = {
		...getAuxeroListingRuntimeData(),
		account: getAuxeroAccountRuntimeData(options),
		locale: resolveLocale(options.searchParams?.get('lang'))
	};
	const currentView = resolveInventoryView(options.view ?? options.searchParams?.get('view'));
	const isInventoryTemplate =
		templateFile === 'listing-grid3-columns.html' ||
		templateFile === 'listing-grid4-columns.html' ||
		templateFile === 'listing-gridstyle-halfmap.html' ||
		templateFile === 'listing-topmap.html';
	const localScopeClass = isInventoryTemplate ? 'daynight-inventory-template' : pageClass;
	const bodyClassInjection = isInventoryTemplate
		? `document.body.classList.add('${pageClass}');
	document.body.classList.add('${localScopeClass}');`
		: `document.body.classList.add('${pageClass}');`;
	const normalizedRoutePath = (options.routePath ?? routeForTemplateFile(templateFile))
		.split('?')[0]
		.replace(/^\/+|\/+$/g, '');
	const isAccountLikeRoute =
		normalizedRoutePath === 'account' ||
		normalizedRoutePath.startsWith('account/') ||
		normalizedRoutePath === 'admin' ||
		normalizedRoutePath.startsWith('admin/');
	const usesPublicHeader = !isAccountLikeRoute && !isAccountTemplate(templateFile);
	const headInjection = `
<style>
	body.${localScopeClass} .preload {
		display: none !important;
	}
	body.${localScopeClass} .logo img,
	body.${localScopeClass} .logo-mobile img {
		width: 240px;
		max-height: 58px;
		object-fit: contain;
	}
	body.${localScopeClass} .logo {
		align-items: center;
		display: flex;
		line-height: 0;
	}
	body.${localScopeClass} .logo img {
		display: block;
	}
	body.${localScopeClass} .dashboard-sidebar .logo img {
		width: 184px;
		max-height: 52px;
		object-fit: contain;
	}
	body.${localScopeClass} .dashboard-container .dashboard-cart .icon {
		flex: 0 0 72px;
		min-width: 72px;
		width: 72px;
	}
	body.${localScopeClass} .dashboard-container .dashboard-cart > div:first-child {
		min-width: 0;
	}
	body.${localScopeClass} .dashboard-container .cart-item .action img {
		height: 24px;
		width: 24px;
	}
	body.${localScopeClass} .dashboard-container .cart-item .action:hover img {
		filter: brightness(0) invert(1);
	}
	body.${localScopeClass} .dashboard-container .daynight-account-listings[data-daynight-submissions-table] .cart-header,
	body.${localScopeClass} .dashboard-container .daynight-account-listings[data-daynight-submissions-table] .cart-item {
		gap: 8px;
		grid-template-columns: minmax(320px, 1fr) 116px 120px 100px 96px 90px;
	}
	body.${localScopeClass} .dashboard-container .daynight-account-listings[data-daynight-submissions-table] .cart-header > div,
	body.${localScopeClass} .dashboard-container .daynight-account-listings[data-daynight-submissions-table] .cart-item > div {
		min-width: 0;
	}
	@media (min-width: 1400px) {
		body.${localScopeClass} .header .logo img {
			height: 52px;
			max-height: none;
			width: auto;
		}
	}
	@media (max-width: 1199px) {
		body.${localScopeClass} .logo img,
		body.${localScopeClass} .logo-mobile img {
			width: 200px;
		}
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .logo img,
		body.${localScopeClass} .logo-mobile img {
			width: 160px;
		}
	}
	body.${localScopeClass} .modal-login .resutl {
		background: var(--bc-surface-soft, #f7f7f6);
		border-radius: 12px;
		padding: 12px 14px;
	}
	body.${localScopeClass} .daynight-view-toggle .item-menu {
		align-items: center;
		background: transparent;
		border-radius: 999px;
		display: inline-flex;
		height: 40px;
		justify-content: center;
		width: 40px;
	}
	body.${localScopeClass} .daynight-view-toggle .item-menu.active {
		background: var(--bc-accent-soft, #f3f4f6);
	}
	body.${localScopeClass} .daynight-view-toggle .daynight-inventory-layout-toggle {
		align-items: center;
		background: var(--bc-accent-soft, #f3f4f6);
		border-radius: 999px;
		color: #1c1c1c;
		display: inline-flex;
		font-size: 13px;
		font-weight: 800;
		height: 40px;
		justify-content: center;
		line-height: 18px;
		padding: 0 14px;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-view-toggle .daynight-inventory-layout-toggle:hover,
	body.${localScopeClass} .daynight-view-toggle .daynight-inventory-layout-toggle.active {
		background: var(--bc-surface-hover, #eceff2);
		color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-inventory-filter-mode-toggle {
		align-items: center;
		background: var(--bc-accent-soft, #f3f4f6);
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 999px;
		display: inline-flex;
		gap: 4px;
		padding: 4px;
	}
	body.${localScopeClass} .daynight-inventory-filter-mode-toggle__item {
		align-items: center;
		border-radius: 999px;
		color: #1c1c1c;
		display: inline-flex;
		font-size: 13px;
		font-weight: 800;
		height: 32px;
		justify-content: center;
		line-height: 18px;
		padding: 0 14px;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-filter-mode-toggle__item:hover {
		background: #ffffff;
		color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-inventory-filter-mode-toggle__item.active {
		background: #1c1c1c;
		color: #ffffff;
	}
	${
		usesPublicHeader
			? `
	body.${localScopeClass} .mobile-hidden-header-button a[href="/admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .mobile-hidden-header-button a[href="./admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .header-button-mobile a[href="/admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .header-button-mobile a[href="./admin/inventory/new"]:not(.open-modal) {
		display: none !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal,
	body.${localScopeClass} .header-button-mobile .open-modal {
		background: var(--bc-accent, #b9161c) !important;
		border-color: var(--bc-accent, #b9161c) !important;
		color: #ffffff !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal svg path,
	body.${localScopeClass} .header-button-mobile .open-modal svg path {
		stroke: #ffffff !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button {
		gap: 0 !important;
	}
	@media (min-width: 1200px) {
		body.${localScopeClass} .header-right.main-nav-wrapper {
			display: flex !important;
			flex: 1 1 auto;
			align-items: center;
			justify-content: flex-end;
			gap: 20px;
			min-width: 0;
		}
		body.${localScopeClass} #main-nav {
			margin-right: auto !important;
			margin-left: auto !important;
			min-width: 0;
		}
		body.${localScopeClass} #menu-primary-menu {
			justify-content: center;
		}
		body.${localScopeClass} .mobile-hidden-header-button,
		body.${localScopeClass} .header-actions {
			justify-self: end;
		}
		body.${localScopeClass} .header-actions {
			margin-left: 20px !important;
		}
	}
`
			: ''
	}
	${
		isAccountTemplate(templateFile)
			? `
	body.${localScopeClass} .daynight-dashboard-header-wrapper {
		min-width: 0;
		width: 100%;
	}
	body.${localScopeClass} #main-nav.daynight-dashboard-context-header {
		align-items: center;
		display: flex;
		gap: 24px;
		justify-content: space-between;
		margin-right: 0 !important;
		min-width: 0;
		width: 100%;
	}
	body.${localScopeClass} .daynight-dashboard-context-heading {
		min-width: 0;
	}
	body.${localScopeClass} .daynight-dashboard-context-heading span {
		color: #777f89;
		display: block;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
		margin-bottom: 3px;
		text-transform: uppercase;
	}
	body.${localScopeClass} .daynight-dashboard-context-heading .h4 {
		color: #1c1c1c;
		font-size: 24px;
		line-height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links {
		align-items: center;
		display: flex !important;
		flex-wrap: nowrap;
		gap: 10px;
		justify-content: flex-end;
		margin: 0;
		padding: 0;
	}
	body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links > li {
		margin: 0 !important;
		padding: 0 !important;
	}
	body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links > li > a {
		align-items: center;
		background: var(--bc-surface-soft, #f7f7f6);
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 12px;
		color: #1c1c1c !important;
		display: inline-flex;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		min-height: 48px;
		padding: 0 20px;
		white-space: nowrap;
	}
	body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links > li.current-menu-item > a,
	body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links > li > a:hover {
		background: var(--bc-surface-hover, #eceff2);
		border-color: var(--bc-border-strong, #c8cdd3);
	}
	@media (min-width: 1200px) {
		body.${localScopeClass} .header-right.main-nav-wrapper.daynight-dashboard-header-wrapper {
			align-items: center;
			display: grid;
			flex: 1 1 auto;
			gap: 18px;
			grid-template-columns: minmax(280px, 1fr) auto auto;
		}
		body.${localScopeClass} .daynight-dashboard-header-wrapper .mobile-hidden-header-button,
		body.${localScopeClass} .daynight-dashboard-header-wrapper .header-actions {
			justify-self: end;
		}
		body.${localScopeClass} .daynight-dashboard-header-wrapper .header-actions {
			margin-left: 0 !important;
		}
	}
	@media (max-width: 1199px) {
		body.${localScopeClass} #main-nav.daynight-dashboard-context-header {
			flex: 1 1 auto;
		}
		body.${localScopeClass} #menu-primary-menu.daynight-dashboard-context-links {
			display: none !important;
		}
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .daynight-dashboard-context-heading .h4 {
			font-size: 20px;
			line-height: 26px;
		}
		body.${localScopeClass} .daynight-dashboard-context-heading span {
			font-size: 12px;
			line-height: 16px;
		}
	}
`
			: ''
	}
	${
		isInventoryTemplate
			? `
	body.${localScopeClass},
	body.${localScopeClass} #wrapper {
		background: #fbfcfa !important;
	}
	body.${localScopeClass} section.pb-100 {
		background: #fbfcfa !important;
		padding-top: 32px;
	}
	body.${localScopeClass} .daynight-inventory-banner {
		align-items: center;
		background-color: var(--bc-surface-soft, #f7f7f6);
		background:
			radial-gradient(ellipse at 52% 88%, rgba(185, 22, 28, 0.18), transparent 38%),
			linear-gradient(104deg, #f7f7f6 0%, #eceff2 48%, #f3f4f6 100%);
		border: 0;
		box-shadow: none;
		display: flex !important;
		isolation: isolate;
		min-height: 342px;
		overflow: hidden;
		position: relative;
	}
	body.${localScopeClass} .daynight-inventory-banner:has(.filter-select-dropdown__toggle:checked),
	body.${localScopeClass} .daynight-inventory-banner:has(.ifp--open) {
		overflow: visible;
		z-index: 80;
	}
	body.${localScopeClass} .daynight-inventory-banner::before {
		background:
			linear-gradient(0deg, rgba(28, 28, 28, 0.08), rgba(28, 28, 28, 0) 40%),
			linear-gradient(90deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0) 42%);
		content: "";
		inset: 0;
		position: absolute;
		z-index: 0;
	}
	body.${localScopeClass} .daynight-inventory-banner > .container {
		align-items: start;
		box-sizing: border-box;
		display: grid;
		min-height: inherit;
		padding-bottom: 26px;
		padding-top: 27px;
		position: relative;
		z-index: 1;
	}
	body.${localScopeClass} .daynight-inventory-banner__cars {
		align-items: end;
		box-sizing: border-box;
		display: grid;
		gap: 0;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		bottom: 0;
		left: 50%;
		justify-items: center;
		padding: 0 18px 22px;
		pointer-events: none;
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		user-select: none;
		width: min(1760px, calc(100vw - 28px));
		z-index: 1;
	}
	body.${localScopeClass} .daynight-inventory-banner__copy {
		align-items: center;
		display: flex;
		inset: 0;
		justify-content: center;
		pointer-events: none;
		position: absolute;
		text-align: center;
		z-index: 2;
	}
	body.${localScopeClass} .daynight-inventory-banner__copy h1 {
		color: #1c1c1c;
		font-size: clamp(34px, 3.1vw, 56px);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1;
		margin: 0;
		text-shadow: 0 12px 30px rgba(255, 255, 255, 0.9);
	}
	body.${localScopeClass} .daynight-inventory-banner__buybox {
		margin: 0 auto;
		max-width: min(1220px, calc(100vw - 48px));
		position: relative;
		width: 100%;
		z-index: 5;
	}
	body.${localScopeClass} .daynight-inventory-banner__car {
		display: block;
		filter: drop-shadow(0 18px 22px rgba(28, 28, 28, 0.2));
		height: auto;
		max-height: 190px;
		max-width: 100%;
		object-fit: contain;
		position: relative;
		width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-banner__car--x5 {
		justify-self: start;
		max-width: 430px;
		transform: translate(-18%, 18px);
		z-index: 4;
	}
	body.${localScopeClass} .daynight-inventory-banner__car--sq5 {
		justify-self: end;
		max-width: 430px;
		opacity: 0.98;
		transform: translate(18%, 20px) scaleX(-1);
		z-index: 3;
	}
	body.${localScopeClass} .daynight-inventory-banner--compact {
		min-height: 250px;
	}
	body.${localScopeClass} .daynight-inventory-banner--compact > .container {
		padding-bottom: 20px;
		padding-top: 22px;
	}
	body.${localScopeClass} .daynight-inventory-banner--compact .daynight-inventory-banner__car {
		max-height: 152px;
	}
	body.${localScopeClass} .daynight-inventory-banner--compact .daynight-inventory-banner__car--x5,
	body.${localScopeClass} .daynight-inventory-banner--compact .daynight-inventory-banner__car--sq5 {
		max-width: 348px;
	}
	body.${localScopeClass} .daynight-sr-only {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	body.${localScopeClass} section.pb-100 > .container > h2 {
		color: #1c1c1c !important;
		font-size: 40px;
		line-height: 1.14;
		margin-bottom: 0 !important;
	}
	body.is_dark.${pageClass} section.pb-100 > .container > h2 {
		color: #ffffff !important;
	}
	body.${localScopeClass} .tf-spacing-style3 {
		height: 28px !important;
	}
	body.${localScopeClass} .daynight-inventory-searchbar {
		background: #ffffff;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 18px 42px rgba(54, 95, 104, 0.12);
		margin: 0;
		padding: 20px 20px 18px;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__row {
		align-items: center;
		display: grid;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr);
	}
	body.${localScopeClass} .daynight-inventory-searchbar__primary {
		align-items: center;
		background: #f6f7f3;
		border: 1px solid #e1e5d9;
		border-radius: 8px;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		height: 50px;
		min-height: 50px;
		overflow: hidden;
		padding: 4px;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__primary:focus-within {
		background: #ffffff;
		border-color: var(--bc-accent, #b9161c);
		box-shadow: 0 0 0 2px rgba(185, 22, 28, 0.2);
	}
	body.${localScopeClass} .daynight-inventory-searchbar__search {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 0;
		display: flex;
		gap: 10px;
		min-height: 40px;
		padding: 0 16px;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__search img {
		flex: 0 0 auto;
		height: 16px;
		opacity: 0.72;
		width: 16px;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__search input {
		background: transparent;
		border: 0 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		color: #1c1c1c;
		font-size: 16px;
		height: auto;
		line-height: 24px;
		min-width: 0;
		outline: 0;
		padding: 0 !important;
		transition: none !important;
		width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__filter {
		align-items: center;
		background: var(--bc-accent-soft, #f3f4f6);
		border-color: var(--bc-accent, #b9161c);
		border-radius: 8px;
		color: #1c1c1c;
		display: inline-flex;
		gap: 8px;
		justify-content: center;
		min-height: 46px;
		padding: 0 16px;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__filter:hover {
		background: var(--bc-accent, #b9161c);
		border-color: var(--bc-accent, #b9161c);
		color: var(--bc-accent-contrast, #ffffff);
	}
	body.${localScopeClass} .daynight-inventory-searchbar__filter img {
		height: 18px;
		width: 18px;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__filter span {
		display: inline-block;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__submit {
		background: #1c1c1c;
		border: 0;
		border-radius: 6px;
		color: #ffffff;
		cursor: pointer;
		font-weight: 800;
		font-size: 15px;
		height: 40px;
		min-height: 40px;
		padding: 0 30px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-filter-grid {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
		margin-top: 12px;
		position: relative;
		z-index: 8;
	}
	body.${localScopeClass} .daynight-inventory-filter-grid:has(.ifp--open) {
		z-index: 90;
	}
	body.${localScopeClass} .daynight-inventory-filter-field {
		background: var(--bc-accent-soft, #f3f4f6);
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 8px;
		box-sizing: border-box;
		display: block;
		height: 54px;
		min-width: 0;
		overflow: visible;
		position: relative;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}
	body.${localScopeClass} .daynight-inventory-filter-field.search-cars__select {
		padding: 0 !important;
	}
	body.${localScopeClass} .daynight-inventory-filter-field:hover,
	body.${localScopeClass} .daynight-inventory-filter-field:focus-within {
		background: #ffffff;
		border-color: var(--bc-accent, #b9161c);
	}
	body.${localScopeClass} .daynight-inventory-filter-field:has(.filter-select-dropdown__toggle:checked) {
		z-index: 40;
	}
	body.${localScopeClass} .daynight-inventory-filter-field > span {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .filter-select-dropdown__toggle {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .search-cars__label {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .filter-select-dropdown__text {
		background:
			url('/assets/icons/chevron-down-black.svg') right 14px center / 14px 14px no-repeat,
			transparent;
		border: 0;
		border-radius: 0;
		box-sizing: border-box;
		color: #1c1c1c;
		cursor: pointer;
		display: flex;
		align-items: center;
		height: 52px;
		justify-content: flex-start;
		line-height: 1.25;
		outline: 0;
		padding: 0 38px 0 16px;
		width: 100% !important;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .filter-select-dropdown__menu {
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 8px;
		box-shadow: 0 16px 36px rgba(28, 28, 28, 0.12);
		margin-top: 6px;
		max-height: 292px;
		min-width: 100%;
		overflow: hidden;
		width: 100%;
		z-index: 40;
	}
	body.${localScopeClass} .daynight-inventory-filter-field .filter-select-dropdown__list {
		max-height: 292px;
		overflow-y: auto;
		padding: 6px;
	}
	body.${localScopeClass} .daynight-inventory-filter-option {
		align-items: center;
		border-radius: 6px;
		display: grid;
		gap: 9px;
		grid-template-columns: auto minmax(0, 1fr) auto;
		min-height: 39px;
		padding: 0 10px;
	}
	body.${localScopeClass} .daynight-inventory-filter-option:hover,
	body.${localScopeClass} .daynight-inventory-filter-option:has(input:checked) {
		background: var(--bc-surface-hover, #eceff2);
	}
	body.${localScopeClass} .daynight-inventory-filter-option input {
		accent-color: #1c1c1c;
		height: 15px;
		margin: 0;
		width: 15px;
	}
	body.${localScopeClass} .daynight-inventory-filter-option input:checked + span::before {
		background-image: url('/assets/icons/checked-2.svg') !important;
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}
	body.${localScopeClass} .daynight-inventory-filter-option img {
		height: 18px;
		object-fit: contain;
		width: 22px;
	}
	body.${localScopeClass} .daynight-inventory-filter-option small {
		color: #777777;
		font-size: 12px;
		font-weight: 700;
	}
	body.${localScopeClass} .daynight-inventory-filter-option span {
		font-size: 15px;
		line-height: 20px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	body.${localScopeClass} .daynight-inventory-active-filters {
		align-items: center;
		display: grid;
		gap: 10px 16px;
		grid-template-columns: auto minmax(0, 1fr);
		margin: 0;
		min-width: 0;
	}
	body.${localScopeClass} .daynight-inventory-active-filters--results {
		background: transparent;
		border: 0;
		margin: 0 0 18px;
		padding: 0;
	}
	body.${localScopeClass} .daynight-inventory-active-filters__summary {
		color: #4b4b4b;
		font-size: 15px;
		font-weight: 500;
		line-height: 36px;
		margin: 0;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-active-filters__chips {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: flex-start;
		min-width: 0;
	}
	body.${localScopeClass} .daynight-inventory-active-filters__chips--quick {
		overflow: hidden;
	}
	body.${localScopeClass} .daynight-inventory-searchbar,
	body.${localScopeClass} .daynight-inventory-searchbar *,
	body.${localScopeClass} .daynight-inventory-filter-grid,
	body.${localScopeClass} .daynight-inventory-filter-grid *,
	body.${localScopeClass} .daynight-inventory-active-filters,
	body.${localScopeClass} .daynight-inventory-active-filters * {
		animation: none !important;
		transform: none !important;
		transition: none !important;
		will-change: auto !important;
	}
	body.${localScopeClass} .daynight-inventory-filter-grid .ifp__panel--modal {
		transform: none !important;
	}
	body.${localScopeClass} .daynight-inventory-filter-grid .ifp__chev {
		transform: translateY(-50%) !important;
		transition: transform 0.18s ease !important;
	}
	body.${localScopeClass} .daynight-inventory-filter-grid .ifp--open .ifp__chev {
		transform: translateY(-50%) rotate(180deg) !important;
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .daynight-inventory-filter-grid .ifp__panel--modal {
			transform: none !important;
		}
	}
	body.${localScopeClass} .daynight-quick-chip,
	body.${localScopeClass} .daynight-active-filter {
		align-items: center;
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 6px;
		color: #1c1c1c;
		display: inline-flex;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		min-height: 36px;
		padding: 0 14px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-quick-chip {
		background: #ffffff;
	}
	body.${localScopeClass} .daynight-quick-chip.active,
	body.${localScopeClass} .daynight-quick-chip:hover,
	body.${localScopeClass} .daynight-active-filter {
		background: var(--bc-accent-soft, #f3f4f6);
		border-color: var(--bc-accent, #b9161c);
	}
	body.${localScopeClass} .daynight-active-filter--clear {
		background: #ffffff;
		border-color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-active-filter span {
		margin-left: 5px;
	}
	body.${localScopeClass} .daynight-inventory-content .wow {
		animation-name: none !important;
		opacity: 1 !important;
		visibility: visible !important;
	}
	body.${localScopeClass} .daynight-inventory-content .content-inner,
	body.${localScopeClass} .daynight-inventory-content .content-inner.active {
		opacity: 1 !important;
		position: relative !important;
		transform: none !important;
		transition: none !important;
		visibility: visible !important;
		z-index: 1 !important;
	}
	body.${localScopeClass} .daynight-inventory-searchbar__utility {
		align-items: center;
		background: transparent;
		border: 0;
		border-top: 1px solid var(--bc-border, #dde0e4);
		border-radius: 0;
		box-shadow: none;
		display: grid;
		gap: 16px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-left: 0 !important;
		margin-bottom: 0 !important;
		margin-top: 14px !important;
		margin-right: 0 !important;
		padding: 14px 0 0;
		width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-hero-switches {
		align-items: center;
		border-top: 1px solid var(--bc-border, #dde0e4);
		display: flex;
		gap: 12px;
		justify-content: space-between;
		margin-top: 14px;
		padding-top: 14px;
		width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-hero-switches__label {
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 800;
		line-height: 22px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-view-toggle {
		align-items: center;
		background: var(--bc-accent-soft, #f3f4f6);
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 999px;
		display: flex;
		gap: 4px;
		justify-self: center;
		margin: 0;
		padding: 4px !important;
	}
	body.${localScopeClass} .daynight-inventory-result-count p {
		margin: 0;
	}
	body.${localScopeClass} .daynight-inventory-result-count {
		align-items: center;
		display: flex;
		gap: 14px;
		min-width: 0;
	}
	body.${localScopeClass} .daynight-inventory-sort {
		align-items: center;
		display: flex;
		gap: 10px;
		justify-self: end;
	}
	body.${localScopeClass} .daynight-inventory-sort__label {
		color: #1c1c1c;
		font-size: 15px;
		line-height: 22px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-content {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 18px 18px 22px;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown {
		min-width: 178px;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__button {
		background: var(--bc-accent-soft, #f3f4f6);
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 8px;
		box-shadow: none;
		color: #1c1c1c;
		min-height: 46px;
		padding: 0 14px;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__button:hover,
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown.active .core-dropdown__button {
		background: #ffffff;
		border-color: var(--bc-accent, #b9161c);
		box-shadow: none;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__button:focus {
		box-shadow: none;
		outline: none;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__selected {
		color: #1c1c1c;
		font-size: 15px;
		line-height: 22px;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__menu {
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(54, 95, 104, 0.1);
		margin-top: 6px;
	}
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__option:hover,
	body.${localScopeClass} .daynight-inventory-toolbar-row .core-dropdown__option.active {
		background: #eef0ec;
	}
	body.${localScopeClass} .daynight-inventory-main {
		background: #fbfcfa !important;
		padding-top: 30px;
		position: relative;
		z-index: 1;
	}
	body.${localScopeClass} .daynight-inventory-main > .container {
		max-width: none;
		width: calc(100vw - 48px);
	}
	body.${localScopeClass} .daynight-inventory-dashboard {
		align-items: start;
		display: grid;
		gap: 22px;
		grid-template-columns: 336px minmax(0, 1fr);
		background: #ffffff;
		border: 1px solid #e1e7ed;
		border-radius: 12px;
		padding: 18px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map {
		grid-template-columns: 320px minmax(410px, 0.86fr) minmax(420px, 1fr);
	}
	body.${localScopeClass} .daynight-inventory-dashboard-sidebar,
	body.${localScopeClass} .daynight-inventory-dashboard-results,
	body.${localScopeClass} .daynight-inventory-dashboard-map {
		box-shadow: none;
		min-width: 0;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-sidebar {
		background: #eef1ed;
		border: 1px solid #dfe6d4;
		border-radius: 10px;
		max-height: none;
		overflow: visible;
		padding: 18px;
		position: sticky;
		top: 104px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-results,
	body.${localScopeClass} .daynight-inventory-dashboard-map {
		background: #ffffff;
		border: 0;
		border-radius: 0;
		padding: 0;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-form {
		display: grid;
		gap: 0;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-heading {
		border-bottom: 0;
		margin-bottom: 15px;
		padding: 0;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-heading p {
		margin: 0;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-heading .h5 {
		color: #141414;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 22px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-heading .text-secondary {
		color: #656d5f !important;
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
		margin-top: 4px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-group {
		border: 0;
		border-bottom: 1px solid var(--bc-border, #dde0e4);
		min-inline-size: 0;
		margin: 0;
		padding: 15px 0;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-group:last-of-type {
		border-bottom: 0;
		padding-bottom: 6px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-group legend {
		color: #141414;
		display: block;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: -0.005em;
		line-height: 16px;
		margin-bottom: 9px;
		padding: 0;
		width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-group legend span {
		color: #141414;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-options {
		display: grid;
		gap: 2px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 8px;
		color: #1c1c1c;
		cursor: pointer;
		display: grid;
		gap: 11px;
		grid-template-columns: auto auto minmax(0, 1fr) auto;
		min-height: 38px;
		padding: 6px 9px;
		transition: background-color 0.12s ease;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:hover {
		background: #f5f6f3;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:has(input:checked),
	body.${localScopeClass} .daynight-inventory-sidebar-option.is-selected {
		background: #eef3e1;
		color: #161616;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option input {
		height: 1px;
		margin: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		width: 1px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option__control {
		background: #ffffff;
		border: 1.5px solid #8b9199;
		border-radius: 4px;
		box-sizing: border-box;
		display: inline-grid;
		height: 18px;
		place-items: center;
		position: relative;
		transition:
			background-color 0.12s ease,
			border-color 0.12s ease;
		width: 18px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option--single .daynight-inventory-sidebar-option__control {
		border-radius: 999px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:hover .daynight-inventory-sidebar-option__control {
		border-color: #6b7280;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option input:focus-visible + .daynight-inventory-sidebar-option__control {
		outline: 2px solid #B9161C;
		outline-offset: 2px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:has(input:checked) .daynight-inventory-sidebar-option__control {
		background: #B9161C;
		border-color: #B9161C;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:has(input:checked) .daynight-inventory-sidebar-option__control::after {
		border-bottom: 2px solid #ffffff;
		border-left: 2px solid #ffffff;
		content: "";
		height: 5px;
		margin-top: -1px;
		transform: rotate(-45deg);
		width: 9px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option--single:has(input:checked) .daynight-inventory-sidebar-option__control::after {
		background: #ffffff;
		border: 0;
		border-radius: 999px;
		height: 7px;
		margin-top: 0;
		transform: none;
		width: 7px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option__media {
		align-items: center;
		background: #ffffff;
		border: 1px solid #ecefe8;
		border-radius: 7px;
		display: inline-flex;
		height: 28px;
		justify-content: center;
		width: 32px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option__media img {
		display: block;
		height: 17px;
		max-width: 22px;
		object-fit: contain;
		width: auto;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option__label {
		font-size: 14px;
		line-height: 18px;
		font-weight: 500;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:has(input:checked) .daynight-inventory-sidebar-option__label,
	body.${localScopeClass} .daynight-inventory-sidebar-option.is-selected .daynight-inventory-sidebar-option__label {
		color: #161616;
		font-weight: 700;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:not(.daynight-inventory-sidebar-option--with-media) .daynight-inventory-sidebar-option__label {
		grid-column: 2 / 4;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option .daynight-inventory-sidebar-option__count {
		background: none;
		border: 0;
		color: #5b6470;
		font-size: 12px;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		line-height: 18px;
		min-width: 0;
		padding: 0 2px 0 0;
		text-align: right;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-option:has(input:checked) .daynight-inventory-sidebar-option__count {
		color: #B9161C;
		font-weight: 700;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-actions {
		align-items: center;
		display: grid;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-top: 14px;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-actions .daynight-inventory-sidebar-clear,
	body.${localScopeClass} .daynight-inventory-sidebar-actions .daynight-inventory-sidebar-apply {
		align-items: center;
		border-radius: 8px;
		display: inline-flex;
		justify-content: center;
		min-height: 40px;
		padding: 0 15px;
		text-decoration: none;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-actions .daynight-inventory-sidebar-clear {
		background: #ffffff;
		border: 1px solid var(--bc-border-strong, #c8cdd3);
		color: #151515;
	}
	body.${localScopeClass} .daynight-inventory-sidebar-actions .daynight-inventory-sidebar-apply {
		background: var(--bc-accent, #b9161c);
		border: 1px solid var(--bc-accent, #b9161c);
		color: #ffffff;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-results {
		padding: 0;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-results > .daynight-inventory-searchbar__utility {
		border-top: 0;
		margin: 0 0 18px !important;
		padding: 0;
	}
	body.${localScopeClass}
		.daynight-inventory-dashboard-results
		.daynight-inventory-searchbar__filter {
		display: none;
	}
	body.${localScopeClass}
		.daynight-inventory-dashboard--map
		.daynight-inventory-dashboard-results
		> .daynight-inventory-searchbar__utility {
		gap: 10px;
		grid-template-columns: 1fr;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .daynight-view-toggle {
		justify-self: start;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .daynight-inventory-sort {
		justify-content: space-between;
		justify-self: stretch;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .daynight-inventory-result-count {
		align-items: flex-start;
		flex-direction: column;
		gap: 8px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-results .daynight-inventory-content {
		padding: 0;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-results .card-box {
		background: #ffffff;
		min-width: 0;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-map {
		min-height: calc(100vh - 124px);
		overflow: hidden;
		position: sticky;
		top: 104px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-map .daynight-map-fallback {
		height: 100%;
		min-height: calc(100vh - 124px);
		padding: 30px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard-map .daynight-map-fallback__inner {
		border-radius: 8px;
		max-width: 100%;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9 {
		min-height: 200px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9.card-box .image {
		max-width: 170px;
		min-height: 200px;
		border-radius: 12px 0 0 12px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9.card-box .image .card--img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9.card-box .top,
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9.card-box .bottom {
		width: 170px;
	}
	body.${localScopeClass} .daynight-inventory-dashboard--map .card-box-style-9.card-box .content {
		width: calc(100% - 170px);
		padding: 16px 16px 16px;
	}
	body.${localScopeClass} .flat-tabs[data-custom='true'] .btn-filter {
		border-color: rgba(185, 22, 28, 0.35);
		color: #1c1c1c;
	}
	body.${localScopeClass} .flat-tabs[data-custom='true'] .btn-filter svg path {
		fill: #1c1c1c;
		stroke: #1c1c1c;
	}
	body.is_dark.${pageClass} .flat-tabs[data-custom='true'] .btn-filter {
		color: #ffffff;
	}
	body.is_dark.${pageClass} .flat-tabs[data-custom='true'] .btn-filter svg path {
		fill: #ffffff;
		stroke: #ffffff;
	}
	@media (max-width: 1399px) {
		body.${localScopeClass} .daynight-inventory-banner__buybox {
			max-width: min(1220px, calc(100vw - 48px));
		}
		body.${localScopeClass} .daynight-inventory-dashboard {
			gap: 18px;
			grid-template-columns: 320px minmax(0, 1fr);
		}
		body.${localScopeClass} .daynight-inventory-dashboard--map {
			grid-template-columns: 300px minmax(390px, 0.86fr) minmax(390px, 1fr);
		}
		body.${localScopeClass} .daynight-inventory-dashboard-results,
		body.${localScopeClass} .daynight-inventory-dashboard-sidebar {
			padding: 16px;
		}
		body.${localScopeClass}
			.daynight-inventory-dashboard--4
			.daynight-inventory-content
			.grid-cols-4 {
			grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__row {
			grid-template-columns: minmax(0, 1fr);
		}
		body.${localScopeClass} .daynight-inventory-filter-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
		}
	}
	@media (max-width: 991px) {
		body.${localScopeClass} .daynight-inventory-banner__buybox {
			max-width: calc(100vw - 30px);
		}
		body.${localScopeClass} .daynight-inventory-dashboard,
		body.${localScopeClass} .daynight-inventory-dashboard--map {
			grid-template-columns: 1fr;
		}
		body.${localScopeClass} .daynight-inventory-dashboard-sidebar,
		body.${localScopeClass} .daynight-inventory-dashboard-map {
			max-height: none;
			position: relative;
			top: auto;
		}
		body.${localScopeClass} .daynight-inventory-dashboard-map,
		body.${localScopeClass} .daynight-inventory-dashboard-map .daynight-map-fallback {
			min-height: 520px;
		}
		body.${localScopeClass}
			.daynight-inventory-dashboard--4
			.daynight-inventory-content
			.grid-cols-4,
		body.${localScopeClass}
			.daynight-inventory-dashboard--3
			.daynight-inventory-content
			.grid-cols-3 {
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
		}
		body.${localScopeClass} section.pb-100 > .container > h2 {
			font-size: 30px;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__row {
			grid-template-columns: minmax(0, 1fr);
		}
		body.${localScopeClass} .daynight-inventory-searchbar__utility {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		body.${localScopeClass} .daynight-inventory-sort {
			grid-column: 1 / -1;
			justify-self: stretch;
			justify-content: flex-end;
		}
	}
	@media (max-width: 767px) {
		body.${localScopeClass} section.pb-100 {
			padding-top: 24px;
		}
		body.${localScopeClass} .daynight-inventory-banner {
			min-height: 188px;
		}
		body.${localScopeClass} .daynight-inventory-banner__cars {
			gap: 18px;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			padding-bottom: 6px;
			width: calc(100vw - 32px);
		}
		body.${localScopeClass} .daynight-inventory-banner__copy h1 {
			font-size: 30px;
		}
		body.${localScopeClass} .daynight-inventory-banner__car--x5,
		body.${localScopeClass} .daynight-inventory-banner__car--sq5 {
			max-width: 280px;
		}
		body.${localScopeClass} section.pb-100 > .container > h2 {
			font-size: 27px;
			margin-bottom: 14px;
		}
		body.${localScopeClass} .switcher-container {
			display: none !important;
		}
		body.${localScopeClass} .daynight-inventory-searchbar {
			padding: 18px;
		}
		body.${localScopeClass} .daynight-inventory-filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		body.${localScopeClass} .daynight-inventory-searchbar__utility {
			grid-template-columns: minmax(0, 1fr);
			padding: 12px 0 0;
		}
		body.${localScopeClass} .daynight-inventory-hero-switches {
			align-items: flex-start;
			flex-direction: column;
			gap: 10px;
			margin-top: 12px;
			padding-top: 12px;
		}
		body.${localScopeClass} .daynight-inventory-hero-switches .daynight-view-toggle {
			flex-wrap: wrap;
			justify-content: flex-start;
		}
		body.${localScopeClass} .daynight-inventory-result-count,
		body.${localScopeClass} .daynight-inventory-sort {
			justify-content: space-between;
		}
		body.${localScopeClass} .daynight-inventory-content {
			padding: 12px;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__submit {
			min-width: 0;
			padding-inline: 18px;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__filter {
			gap: 0;
			min-height: 46px;
			min-width: 46px;
			padding: 0;
			width: 46px;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__filter span {
			display: none;
		}
		body.${localScopeClass} .daynight-quick-chip,
		body.${localScopeClass} .daynight-active-filter {
			flex: 0 0 auto;
		}
	}
	@media (max-width: 340px) {
		body.${localScopeClass} .daynight-inventory-searchbar__primary,
		body.${localScopeClass} .daynight-inventory-searchbar__row {
			grid-template-columns: 1fr;
		}
		body.${localScopeClass} .daynight-inventory-searchbar__submit {
			width: 100%;
		}
	}
	`
			: ''
	}
	body.${localScopeClass} .daynight-favorite.is-active path {
		fill: var(--bc-accent, #b9161c);
		stroke: var(--bc-accent, #b9161c);
	}
	body.${localScopeClass} .daynight-map-fallback {
		align-items: center;
		background:
			linear-gradient(135deg, rgba(243, 244, 246, 0.92), rgba(255, 255, 255, 0.88)),
			url('${daynightAssets.hero}');
		background-position: center;
		background-size: cover;
		display: flex;
		min-height: 100%;
		padding: 48px;
	}
	body.${localScopeClass} .daynight-map-fallback__inner {
		background: rgba(255, 255, 255, 0.94);
		border-radius: 16px;
		max-width: 480px;
		padding: 28px;
	}
	body.${localScopeClass} .daynight-map-fallback__locations {
		display: grid;
		gap: 10px;
		list-style: none;
		margin: 16px 0;
		padding: 0;
	}
	body.${localScopeClass} .daynight-map-fallback__locations li {
		background: rgba(247, 248, 243, 0.92);
		border: 1px solid rgba(18, 18, 18, 0.08);
		border-radius: 12px;
		display: grid;
		gap: 2px;
		padding: 12px 14px;
	}
	body.${localScopeClass} .card-box[data-daynight-slug] .card--img,
	body.${localScopeClass} .listing-details-item .img-main,
	body.${localScopeClass} .listing-details-thumb img {
		object-fit: cover;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box__title a,
	body.${localScopeClass} .daynight-inventory-content .card-box__price,
	body.${localScopeClass} .flat-tabs[data-custom='true'] .md-hidden,
	body.${localScopeClass} .flat-tabs[data-custom='true'] #filterResults,
	body.${localScopeClass} section.pb-100 > .container > h2 {
		color: #ffffff;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box__title a,
	body.${localScopeClass} .daynight-inventory-content .card-box__price {
		color: #1c1c1c !important;
	}
	body.${localScopeClass} .flat-tabs[data-custom='true'] .md-hidden,
	body.${localScopeClass} .flat-tabs[data-custom='true'] #filterResults {
		color: #1c1c1c !important;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box {
		background: #ffffff;
		border: 0 !important;
		box-shadow: none !important;
		transition:
			background-color 0.22s ease,
			box-shadow 0.22s ease;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box .image {
		background: #ffffff;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box .top .highlight {
		background: #ffffff !important;
		box-shadow: 0 6px 14px rgba(28, 28, 28, 0.16);
		color: #1c1c1c !important;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box .content {
		background: #eef1ed;
		border: 0 !important;
		transition: background-color 0.22s ease;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover,
	body.${localScopeClass} .daynight-inventory-content .card-box:focus-within {
		background: var(--bc-surface-soft, #f7f7f6);
		box-shadow: none !important;
		transform: none !important;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active .content,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .content,
	body.${localScopeClass} .daynight-inventory-content .card-box:focus-within .content {
		background: var(--bc-surface-hover, #eceff2);
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active .card--img,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .card--img,
	body.${localScopeClass} .daynight-inventory-content .card-box:focus-within .card--img {
		transform: none !important;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active .content .card-box__title a,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .content .card-box__title a,
	body.${localScopeClass} .daynight-inventory-content .card-box:focus-within .content .card-box__title a,
	body.${localScopeClass} .daynight-inventory-content .card-box.active .content .bottom .category a,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .content .bottom .category a,
	body.${localScopeClass} .daynight-inventory-content .card-box:focus-within .content .bottom .category a {
		text-decoration: none;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box-style-1 {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box-style-1 .content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box-style-1 .card-box__title {
		display: -webkit-box;
		min-height: 52px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box .divider {
		background: #dde2dc;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-specs {
		display: flex !important;
		flex-wrap: wrap !important;
		gap: 5px !important;
		overflow: visible;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-specs li {
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--bc-border, #dde0e4);
		border-radius: 8px;
		display: inline-flex;
		flex: 0 0 auto !important;
		gap: 5px;
		justify-content: flex-start;
		min-width: max-content !important;
		padding: 5px 8px !important;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-specs li img {
		flex: 0 0 14px;
		height: 14px;
		object-fit: contain;
		width: 14px;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-specs li span {
		overflow: visible;
		text-overflow: clip;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-price__amount {
		font-size: 22px;
		font-weight: 600;
		line-height: 28px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-align: right;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-price__monthly {
		display: block;
		line-height: 20px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-price__finance-link {
		line-height: 16px;
		margin-left: 0;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-inventory-content .tag li img {
		filter: none;
		opacity: 1;
	}
	body.${localScopeClass} .daynight-inventory-content .tag li span,
	body.${localScopeClass} .daynight-inventory-content .text-secondary {
		color: #696665 !important;
	}
	body.${localScopeClass} .daynight-inventory-content .text-secondary,
	body.${localScopeClass} .daynight-inventory-content .tag li span {
		color: #b8bdc7;
	}
	body.${localScopeClass} .daynight-inventory-content .view-details,
	body.${localScopeClass} .daynight-inventory-content .view-details img {
		color: #b9161c;
	}
	body.${localScopeClass} .daynight-inventory-content .compare-details {
		border-color: #1c1c1c;
		color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-inventory-content .compare-details::after {
		background-color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-inventory-content .compare-details svg path {
		stroke: #1c1c1c;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-actions {
		margin-top: auto;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-actions .view-details {
		width: auto !important;
		min-width: 0 !important;
		height: auto !important;
		min-height: 0 !important;
		border: 0 !important;
		background: transparent !important;
		color: #1c1c1c !important;
		font-size: 15px !important;
		font-weight: 800 !important;
		line-height: 22px !important;
		padding: 0 !important;
		text-decoration: none !important;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-actions .view-details::before,
	body.${localScopeClass} .daynight-inventory-content .daynight-card-actions .view-details::after {
		display: none !important;
	}
	body.${localScopeClass} .daynight-inventory-content .daynight-card-actions .view-details img {
		display: inline-block !important;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active .compare-details,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .compare-details {
		background-color: #1c1c1c;
		color: #ffffff;
	}
	body.${localScopeClass} .daynight-inventory-content .card-box.active .compare-details svg path,
	body.${localScopeClass} .daynight-inventory-content .card-box:hover .compare-details svg path {
		stroke: #ffffff;
	}
	body.${localScopeClass} .daynight-compare-table .image {
		aspect-ratio: 16 / 10;
		object-fit: cover;
		width: 100%;
	}
	body.${localScopeClass} .daynight-contact-form .auxero-form-status,
	body.${localScopeClass} .daynight-profile-form .auxero-form-status,
	body.${localScopeClass} .daynight-password-form .auxero-form-status,
	body.${localScopeClass} .daynight-add-listing-form .auxero-form-status,
	body.${localScopeClass} .daynight-sell-form .auxero-form-status,
	body.${localScopeClass} .daynight-service-form .auxero-form-status,
	body.${localScopeClass} .daynight-blog-comment-form .auxero-form-status,
	body.${localScopeClass} .daynight-newsletter-form .auxero-form-status,
	body.${localScopeClass} .form-footer .auxero-form-status,
	body.${localScopeClass} .newsletter-form .auxero-form-status,
	body.${localScopeClass} .send-inquiry .auxero-form-status,
	body.${localScopeClass} #LoginModal form .auxero-form-status,
	body.${localScopeClass} #SignUpModal form .auxero-form-status,
	body.${localScopeClass} #ForgotPasswordModal form .auxero-form-status {
		background: var(--bc-surface-soft, #f7f7f6);
		border-radius: 12px;
		color: #1c1c1c;
		padding: 12px 14px;
	}
	${
		templateFile === 'home-05.html'
			? `
	body.${localScopeClass} .effect-item,
	body.${localScopeClass} .wow {
		animation-name: none !important;
		opacity: 1 !important;
		transform: none !important;
		visibility: visible !important;
	}
	body.${localScopeClass} .daynight-vehicle-pills {
		width: 100%;
		max-width: 100%;
		background: #ffffff;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 10px 28px rgb(54 95 104 / 0.06);
		padding: 10px;
		scrollbar-width: none;
	}
	body.${localScopeClass} .daynight-vehicle-pills::-webkit-scrollbar {
		display: none;
	}
	body.${localScopeClass} .daynight-vehicle-pills .menu-tab-style2 {
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		gap: 10px;
		justify-content: flex-start;
		min-width: max-content;
		width: auto;
	}
	body.${localScopeClass} .daynight-vehicle-pill {
		background: var(--bc-surface, #f1f2f3) !important;
		border: 1px solid var(--bc-border, #dde0e4) !important;
		color: #1c1c1c;
		min-height: 44px;
		overflow: hidden;
		padding: 0 !important;
		transition: background-color 0.18s ease;
	}
	body.${localScopeClass} .daynight-vehicle-pill:hover {
		background: var(--bc-surface-hover, #eceff2) !important;
		border-color: var(--bc-border-strong, #c8cdd3) !important;
		color: #1c1c1c !important;
	}
	body.${localScopeClass} .daynight-vehicle-pill.active {
		background: var(--bc-accent-soft, #f3f4f6) !important;
		border-color: var(--bc-accent, #b9161c) !important;
		color: #1c1c1c !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal {
		background: var(--bc-accent, #b9161c) !important;
		border-color: var(--bc-accent, #b9161c) !important;
		color: #ffffff !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal:hover {
		background: var(--bc-hover-accent, #B9161C) !important;
		border-color: var(--bc-hover-accent, #B9161C) !important;
		color: #ffffff !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal svg path {
		stroke: #ffffff !important;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal:hover svg path {
		stroke: #ffffff !important;
	}
	body.${localScopeClass} .daynight-vehicle-pill a {
		align-items: center;
		color: inherit;
		display: inline-flex;
		font-size: 15px;
		font-weight: 500;
		gap: 7px;
		line-height: 22px;
		min-height: 44px;
		padding: 0 11px;
		white-space: nowrap;
	}
	body.${localScopeClass} .daynight-vehicle-pill span,
	body.${localScopeClass} .daynight-type-icon,
	body.${localScopeClass} .daynight-pill-image {
		flex: 0 0 auto;
	}
	body.${localScopeClass} .daynight-type-icon {
		color: currentColor;
		height: 18px;
		stroke-width: 1.15;
		width: 36px;
	}
	body.${localScopeClass} .daynight-pill-image {
		display: block;
		object-fit: contain;
		width: auto;
	}
	body.${localScopeClass} .daynight-pill-image--spec {
		height: 18px;
		max-width: 22px;
	}
	body.${localScopeClass} .daynight-pill-image--brand {
		height: 21px;
		max-width: 38px;
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .daynight-vehicle-pills {
			justify-content: flex-start;
			margin-inline: -15px;
			padding-inline: 10px;
		}
		body.${localScopeClass} .daynight-vehicle-pills .menu-tab-style2 {
			justify-content: flex-start;
			max-width: none;
			min-width: max-content;
			width: auto;
		}
	}
	`
			: ''
	}
	${
		templateFile === 'home-09.html'
			? `
	body.${localScopeClass} .wow {
		animation-name: none !important;
		visibility: visible !important;
	}
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .card-box__title a,
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .card-box__price {
		color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .text-secondary,
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .tag li span {
		color: #696665;
	}
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .view-details,
	body.${localScopeClass} .daynight-home-featured .card-box[data-daynight-slug] .view-details img {
		color: #1c1c1c;
	}
	body.${localScopeClass} .daynight-home-featured .card--img,
	body.${localScopeClass} .card-box-style-7 .image img,
	body.${localScopeClass} .card-box-style-2 .card--img,
	body.${localScopeClass} .daynight-home-news .blog-card img {
		object-fit: cover;
	}
	body.${localScopeClass} .search-cars__subtitle {
		max-width: 720px;
	}
	body.${localScopeClass} .cta-box {
		background-position: center;
		background-size: cover;
		min-height: 360px;
		padding: 72px;
	}
	body.${localScopeClass} .cta-box .content {
		max-width: 620px;
	}
	`
			: ''
	}
	${
		isSupportTemplate(templateFile)
			? `
	body.${localScopeClass} .wow {
		animation-name: none !important;
		visibility: visible !important;
	}
	body.${localScopeClass} section.pb-100 > .container > h2,
	body.${localScopeClass} section.bg-white > .container > h2,
	body.${localScopeClass} section.bg-white.pb-84 > .container > h2 {
		color: #1c1c1c;
	}
	`
			: ''
	}
</style>`;
	const bodyInjection = `
<script>
(() => {
	${bodyClassInjection}
	const firstVehicleSlug = ${JSON.stringify(firstVehicleSlug)};
	const currentView = ${JSON.stringify(currentView)};
	const runtimeData = ${JSON.stringify(runtimeData)};
	const navItems = ${JSON.stringify(mainNavigation)};
	const routeMap = ${JSON.stringify(canonicalTemplateRoutes)};
	const blockedFiles = ${JSON.stringify([...blockedTemplateFiles])};
	const favoriteKey = 'daynight:favorites';
	const compareKey = 'daynight:compare';
	const sessionKey = 'daynight:session';
	const previousRuntimeController = window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__;
	if (previousRuntimeController) previousRuntimeController.abort();
	const runtimeAbortController = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
	window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ = runtimeAbortController;
	const runtimeListenerOptions = runtimeAbortController ? { signal: runtimeAbortController.signal } : undefined;
	const runtimeCaptureListenerOptions = runtimeAbortController
		? { capture: true, signal: runtimeAbortController.signal }
		: true;
	const runtimeOnceListenerOptions = runtimeAbortController
		? { once: true, signal: runtimeAbortController.signal }
		: { once: true };
	const roleFromUrl = new URLSearchParams(window.location.search).get('role');
	const prototypeRole = roleFromUrl || (
		(window.location.pathname.startsWith('/account') || window.location.pathname.startsWith('/admin'))
			? runtimeData.account.session.role
			: ''
	);
	const readList = (key) => {
		try {
			const value = JSON.parse(localStorage.getItem(key) || '[]');
			return Array.isArray(value) ? value : [];
		} catch (_error) {
			return [];
		}
	};
	const writeList = (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (_error) {
			// Some embedded browser contexts disable localStorage; API state can still render.
		}
	};
	const hasStoredSession = () => readList(sessionKey).length > 0;
	const isAccountComparePage = () => window.location.pathname === '/account/compare';
	const shouldUseAccountGarageApi = () =>
		Boolean(prototypeRole) ||
		hasStoredSession() ||
		window.location.pathname.startsWith('/account') ||
		window.location.pathname.startsWith('/admin');
	const vehicleBySlug = Object.fromEntries(runtimeData.vehicles.map((vehicle) => [vehicle.slug, vehicle]));
	const escapeText = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[char]);
	const formatKm = (value) => Number(value || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' km';
	const compareLabels = runtimeData.locale === 'bg'
		? {
			mileage: 'Пробег',
			year: 'Година',
			fuel: 'Гориво',
			color: 'Цвят',
			location: 'Локация',
			interior: 'Интериор',
			engine: 'Двигател',
			transmission: 'Скорости',
			sourceId: 'ID от източника',
			stockNumber: 'Номер в наличност',
			price: 'Цена',
			onRequest: 'По запитване'
		}
		: {
			mileage: 'Mileage',
			year: 'Years',
			fuel: 'Fuel',
			color: 'Color',
			location: 'Location',
			interior: 'Interior',
			engine: 'Engine',
			transmission: 'Transmission',
			sourceId: 'Source ID',
			stockNumber: 'Stock Number',
			price: 'Price',
			onRequest: 'On request'
		};
	const compareRows = [
		['mileage.svg', compareLabels.mileage, (vehicle) => formatKm(vehicle.mileage)],
		['years.svg', compareLabels.year, (vehicle) => vehicle.year],
		['gaspump.svg', compareLabels.fuel, (vehicle) => vehicle.fuel],
		['color.svg', compareLabels.color, (vehicle) => vehicle.exterior || compareLabels.onRequest],
		['location.svg', compareLabels.location, (vehicle) => vehicle.location],
		['interior.svg', compareLabels.interior, (vehicle) => vehicle.interior || compareLabels.onRequest],
		['engine.svg', compareLabels.engine, (vehicle) => vehicle.engine || compareLabels.onRequest],
		['transmission.svg', compareLabels.transmission, (vehicle) => vehicle.transmission],
		['VIN.svg', compareLabels.sourceId, (vehicle) => vehicle.vin],
		['QrCode.svg', compareLabels.stockNumber, (vehicle) => vehicle.stockNumber],
		['Payment.png', compareLabels.price, (vehicle) => vehicle.priceLabel]
	];
	const compareTopCell = (vehicle) => '<td data-daynight-compare-column="' + escapeText(vehicle.slug) + '">' +
		'<div class="relative top">' +
			'<button class="compare-item-remove-table" type="button" data-daynight-compare-remove="' + escapeText(vehicle.slug) + '" style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;">' +
				'<img src="/assets/icons/close-modal.svg" alt="Remove" style="width: 24px; height: 24px;">' +
			'</button>' +
			'<a href="/inventory/' + encodeURIComponent(vehicle.slug) + '"><img class="mb-10 radius-16 image" src="' + escapeText(vehicle.image) + '" alt="' + escapeText(vehicle.title) + '"></a>' +
			'<p class="h4 text-center"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '">' + escapeText(vehicle.title) + '</a></p>' +
		'</div>' +
	'</td>';
	const compareRowHtml = ([icon, label, read], selected) => '<tr><td><div class="flex items-center gap-8"><img src="/assets/icons/' + icon + '" alt="' + escapeText(label) + '"><span>' + escapeText(label) + ':</span></div></td>' +
		selected.map((vehicle) => '<td>' + escapeText(read(vehicle)) + '</td>').join('') +
	'</tr>';
	const buildCompareRows = (selected) => '<tr><td></td>' + selected.map(compareTopCell).join('') + '</tr>' +
		compareRows.map((row) => compareRowHtml(row, selected)).join('');
	const renderCompareTables = (compareList) => {
		const tables = Array.from(document.querySelectorAll('[data-daynight-compare-table]')).filter(
			(table) => !table.hasAttribute('data-daynight-style-compare-table')
		);
		if (!tables.length) return;

		const stored = (Array.isArray(compareList) ? compareList : readList(compareKey)).filter(
			(slug) => vehicleBySlug[slug]
		);
		if (!stored.length && isAccountComparePage()) return;

		const fallback = runtimeData.vehicles.slice(0, 4).map((vehicle) => vehicle.slug);
		const selected = (stored.length ? stored : fallback)
			.slice(0, 4)
			.map((slug) => vehicleBySlug[slug])
			.filter(Boolean);
		const rows = buildCompareRows(selected);
		tables.forEach((table) => {
			table.innerHTML = rows;
		});
	};
	const favoriteCardHtml = (vehicle, index) => {
		const tagClass = 'bg-primary-2';
		const favoriteIconHtml = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 5 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C14.1444 5 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" fill="#b9161c"/></svg>';
		return '<div class="card-box card-box-style-1" data-daynight-slug="' + escapeText(vehicle.slug) + '">' +
			'<div class="top"><p class="' + tagClass + ' text-white highlight">' + escapeText(vehicle.tag || vehicle.condition || 'Available') + '</p><p class="heart daynight-favorite is-active" role="button" tabindex="0" aria-label="Remove ' + escapeText(vehicle.title) + '">' + favoriteIconHtml + '</p></div>' +
			'<div class="image"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '"><img class="card--img" src="' + escapeText(vehicle.image) + '" alt="' + escapeText(vehicle.title) + '"></a></div>' +
			'<div class="content border-light border-top-none">' +
				'<div class="bottom"><p class="category uppercase text-white"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '" class="text-white uppercase text-xs">' + escapeText(vehicle.brand) + '</a></p><div class="flex items-center gap-8"><p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ' + escapeText(vehicle.imagesCount || 1) + '</p><p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p></div></div>' +
				'<p class="h6 card-box__title mb-8"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '">' + escapeText(vehicle.title) + '</a></p>' +
				'<ul class="tag mb-10"><li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>' + formatKm(vehicle.mileage) + '</span></li><li><img src="/assets/icons/calendar.svg" alt="year"><span>' + escapeText(vehicle.year) + '</span></li><li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>' + escapeText(vehicle.fuel) + '</span></li><li><img src="/assets/icons/transmission.svg" alt="transmission"><span>' + escapeText(vehicle.transmission) + '</span></li></ul>' +
				'<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">' + escapeText(vehicle.priceLabel) + '</p>' +
				'<div class="divider mb-15"></div>' +
				'<div class="flex justify-between"><p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-daynight-compare="' + escapeText(vehicle.slug) + '" role="button" tabindex="0">Compare</p><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a></div>' +
			'</div></div>';
	};
	const renderAccountFavorites = (favoritesList) => {
		const grids = document.querySelectorAll('[data-daynight-favorites-grid]');
		if (!grids.length) return;

		const stored = (Array.isArray(favoritesList) ? favoritesList : readList(favoriteKey)).filter(
			(slug) => vehicleBySlug[slug]
		);
		if (!stored.length) return;

		const selected = stored.slice(0, 6).map((slug) => vehicleBySlug[slug]).filter(Boolean);
		grids.forEach((grid) => {
			grid.innerHTML = selected.map(favoriteCardHtml).join('');
		});
	};
	const go = (url) => {
		window.location.href = url;
	};
	const inventorySearchUrl = (form) => {
		const params = new URLSearchParams(new FormData(form));
		for (const [key, value] of [...params.entries()]) {
			const normalized = String(value).trim().toLowerCase();
			if (!normalized || normalized === 'all' || (key === 'view' && normalized === '4')) {
				params.delete(key);
			}
		}
		const query = params.toString();
		return '/inventory' + (query ? '?' + query : '');
	};
	const ensureInventoryUrlState = async () => {
		if (window.location.pathname !== '/inventory' || !window.location.search) return;

		const params = new URLSearchParams(window.location.search);
		const form = document.querySelector('.daynight-inventory-searchbar');
		if (!form) return;

		const valueFor = (...keys) =>
			keys.map((key) => params.get(key)).find((value) => value && value.trim()) || '';
		const expected = [
			['q', valueFor('q', 'query', 'keyword', 'model')],
			['brand', valueFor('brand')],
			['minYear', valueFor('minYear', 'yearFrom')],
			['fuel', valueFor('fuel', 'FuelType')],
			['transmission', valueFor('transmission', 'Transmission', 'gearbox')]
		].filter(([, value]) => value);

		if (!expected.length) return;

		const controlsAreStale = expected.some(([name, expectedValue]) => {
			const field = form.elements.namedItem(name);
			return field && String(field.value || '').trim() !== expectedValue;
		});
		const q = valueFor('q', 'query', 'keyword', 'model');
		const searchTagIsStale =
			q &&
			![...document.querySelectorAll('.daynight-active-filter')].some((tag) =>
				tag.textContent.includes('Search: ' + q)
			);

		if (!controlsAreStale && !searchTagIsStale) return;

		const response = await fetch(window.location.href, {
			cache: 'no-store',
			credentials: 'same-origin',
			headers: { 'x-daynight-inventory-sync': '1' }
		});
		if (!response.ok) throw new Error('Inventory sync failed');

		const fresh = new DOMParser().parseFromString(await response.text(), 'text/html');
		[
			'.daynight-inventory-searchbar',
			'.daynight-inventory-content'
		].forEach((selector) => {
			const currentNode = document.querySelector(selector);
			const freshNode = fresh.querySelector(selector);
			if (currentNode && freshNode) currentNode.replaceWith(freshNode);
		});

		updateGarageState();
	};
	const setFormStatus = (form, message) => {
		let status = form.querySelector('.auxero-form-status');
		if (!status) {
			status = document.createElement('p');
			status.className = 'auxero-form-status text-highlight font-weight-600 mt-12';
			form.appendChild(status);
		}
		status.textContent = message;
	};
	const formDataObject = (form) => Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [
		key,
		typeof value === 'string' ? value : value.name
	]));
	const postJson = async (url, payload, method = 'POST') => {
		try {
			const headers = { 'content-type': 'application/json' };
			if (prototypeRole) headers['x-daynight-prototype-role'] = prototypeRole;
			const response = await fetch(url, {
				body: JSON.stringify(payload),
				credentials: 'same-origin',
				headers,
				method
			});

			return response.ok ? response.json() : undefined;
		} catch (_error) {
			return undefined;
		}
	};
	const syncGarageState = () =>
		shouldUseAccountGarageApi()
			? postJson('/api/account/garage', {
			compare: readList(compareKey),
			favorites: readList(favoriteKey),
			...(prototypeRole ? { role: prototypeRole } : {})
		})
			: Promise.resolve(undefined);
	const hydrateGarageState = async () => {
		const existingCompare = readList(compareKey);
		const existingFavorites = readList(favoriteKey);

		if (existingCompare.length || existingFavorites.length) {
			await syncGarageState();
			return;
		}

		if (!shouldUseAccountGarageApi()) return;

		try {
			const response = await fetch(
				'/api/account/garage' + (prototypeRole ? '?role=' + encodeURIComponent(prototypeRole) : ''),
				{ credentials: 'same-origin' }
			);
			const body = response.ok ? await response.json() : undefined;
			const garage = body?.data;
			const nextCompare = Array.isArray(garage?.compare) ? garage.compare : readList(compareKey);
			const nextFavorites = Array.isArray(garage?.favorites)
				? garage.favorites
				: readList(favoriteKey);

			if (Array.isArray(garage?.compare)) writeList(compareKey, nextCompare);
			if (Array.isArray(garage?.favorites)) writeList(favoriteKey, nextFavorites);
			updateGarageState({ compare: nextCompare, favorites: nextFavorites });
		} catch (_error) {
			// LocalStorage-only garage state remains available when the API is unavailable.
		}
	};
	const formContext = (form) => {
		const pathname = window.location.pathname;
		const isVehicleDetail = pathname.startsWith('/inventory/');
		const isAgentDetail = pathname.startsWith('/agents/');
		const source =
			form.classList.contains('send-inquiry') && isVehicleDetail
				? 'vehicle-detail'
				: form.classList.contains('send-inquiry') && isAgentDetail
					? 'agent-detail'
					: form.className || form.id || 'daynight-form';

		return {
			agentSlug: isAgentDetail ? decodeURIComponent(pathname.split('/').pop() || '') : undefined,
			routePath: pathname,
			source,
			vehicleSlug: isVehicleDetail ? decodeURIComponent(pathname.split('/').pop() || '') : undefined
		};
	};
	const formPayload = (form) => ({
		...formDataObject(form),
		...formContext(form),
		role: runtimeData.account.session.role
	});
	const vehicleImageFallback = ${JSON.stringify(daynightAssets.hero)};
	const isVehicleImage = (img) =>
		!img.closest('.daynight-inventory-desktop-route .daynight-inventory-content') &&
		(
			Boolean(img.closest('[data-daynight-slug], [data-daynight-compare-column], .listing-details')) ||
			/mobistatic\\d*\\.focus\\.bg/.test(img.currentSrc || img.src || '')
		);
	const applyVehicleImageFallback = (img) => {
		if (!isVehicleImage(img) || img.dataset.daynightFallbackApplied === 'true') return;

		img.dataset.daynightFallbackApplied = 'true';
		img.src = vehicleImageFallback;
		if (!img.alt) img.alt = 'OUTLETCARS.BG — Варна vehicle';
	};
	const prepareVehicleImages = () => {
		document.querySelectorAll('img').forEach((img) => {
			if (!isVehicleImage(img)) return;

			img.addEventListener('error', () => applyVehicleImageFallback(img), runtimeOnceListenerOptions);
			if (img.complete && img.naturalWidth === 0) {
				applyVehicleImageFallback(img);
			}
		});
	};
	let vehicleImagePreparationReady = false;
	let vehicleImagePreparationScheduled = false;
	const runVehicleImagePreparation = () => {
		vehicleImagePreparationReady = true;
		prepareVehicleImages();
	};
	const scheduleVehicleImagePreparation = () => {
		if (vehicleImagePreparationReady) {
			prepareVehicleImages();
			return;
		}

		if (vehicleImagePreparationScheduled) return;
		vehicleImagePreparationScheduled = true;

		const afterHydrationFrame = () => {
			requestAnimationFrame(() => requestAnimationFrame(runVehicleImagePreparation));
		};

		if (document.readyState === 'complete') {
			afterHydrationFrame();
		} else {
			window.addEventListener('load', afterHydrationFrame, runtimeOnceListenerOptions);
		}
	};
	const updateGarageState = (garage) => {
		const favorites = Array.isArray(garage?.favorites) ? garage.favorites : readList(favoriteKey);
		const compare = Array.isArray(garage?.compare) ? garage.compare : readList(compareKey);
		document.querySelectorAll('[data-daynight-slug]').forEach((card) => {
			const slug = card.getAttribute('data-daynight-slug');
			const favorite = card.querySelector('.daynight-favorite, .heart');
			if (favorite && slug) {
				favorite.classList.toggle('is-active', favorites.includes(slug));
				favorite.setAttribute('aria-pressed', String(favorites.includes(slug)));
			}
		});
		document.querySelectorAll('[aria-label="Compare"], [aria-label="Сравни"]').forEach((link) => {
			link.setAttribute('data-badge', String(compare.length));
		});
		document.querySelectorAll('[aria-label="Wishlist"], [aria-label="Любими"]').forEach((link) => {
			link.setAttribute('data-badge', String(favorites.length));
		});
		renderCompareTables(compare);
		renderAccountFavorites(favorites);
		scheduleVehicleImagePreparation();
		window.dispatchEvent(new CustomEvent('daynight:garage-updated', {
			detail: { favorites, compare }
		}));
	};
	const mainNav = document.getElementById('menu-primary-menu');
	if (mainNav && !mainNav.hasAttribute('data-daynight-dashboard-context-nav') && !mainNav.querySelector('.sub-menu')) {
		mainNav.innerHTML = navItems.map((item) => {
			const prefixes = Array.isArray(item.matchPrefixes) && item.matchPrefixes.length ? item.matchPrefixes : [item.href];
			const active = prefixes.some((prefix) => window.location.pathname === prefix || (prefix !== '/' && window.location.pathname.startsWith(prefix)));
			return '<li class="menu-item ' + (active ? 'current-menu-item menu-item-main' : '') + '"><a href="' + item.href + '">' + item.label + '</a></li>';
		}).join('');
	}
	document.querySelectorAll('a[href]').forEach((link) => {
		const href = link.getAttribute('href') || '';
		const clean = href.replace(/^\\//, '').split('?')[0];
		if (blockedFiles.includes(clean)) {
			link.setAttribute('href', '/inventory');
			return;
		}
		if (routeMap[clean]) {
			link.setAttribute('href', routeMap[clean]);
		}
	});
	document.querySelectorAll('.filter-sidebar form').forEach((form) => {
		form.setAttribute('action', '/inventory');
		form.setAttribute('method', 'get');
		if (!form.querySelector('input[name="view"]')) {
			const hidden = document.createElement('input');
			hidden.type = 'hidden';
			hidden.name = 'view';
			hidden.value = currentView;
			form.prepend(hidden);
		}
	});
	document.querySelectorAll('[data-daynight-search-form="inventory"]').forEach((form) => {
		form.setAttribute('action', '/inventory');
		form.setAttribute('method', 'get');
		const input = form.querySelector('input');
		if (input && !input.name) input.name = 'q';
	});
	ensureInventoryUrlState().catch(() => window.location.reload());
	document.addEventListener('click', (event) => {
		const removeCompare = event.target.closest('[data-daynight-compare-remove], .daynight-compare-table .compare-item-remove-table');
		if (!removeCompare) return;
		if (removeCompare.hasAttribute('data-daynight-style-compare-remove')) return;

		const slug = removeCompare.getAttribute('data-daynight-compare-remove') || removeCompare.closest('[data-daynight-compare-column]')?.getAttribute('data-daynight-compare-column');
		if (!slug) return;

		event.preventDefault();
		event.stopPropagation();
		const current = readList(compareKey).filter((item) => item !== slug);
		writeList(compareKey, current);
		updateGarageState();
		syncGarageState();
	}, runtimeCaptureListenerOptions);
	document.addEventListener('click', async (event) => {
		const logout = event.target.closest('[data-daynight-menu-item="logout"], [data-daynight-user-menu-item="logout"]');
		if (logout) {
			event.preventDefault();
			localStorage.removeItem(sessionKey);
			await postJson('/api/auth/logout', {});
			document.cookie = 'daynight_session=; Path=/; Max-Age=0; SameSite=Lax';
			go('/');
			return;
		}
		const search = event.target.closest('.search-cars__search, .daynight-inventory-searchbar__submit');
		if (search) {
			event.preventDefault();
			const form = search.closest('form');
			if (form && form.getAttribute('action') === '/inventory') {
				go(inventorySearchUrl(form));
			} else {
				go('/inventory');
			}
			return;
		}
		const favorite = event.target.closest('.daynight-favorite, .card-box .heart');
		if (favorite) {
			const card = favorite.closest('[data-daynight-slug]');
			const slug = card && card.getAttribute('data-daynight-slug');
			if (slug) {
				event.preventDefault();
				const favorites = readList(favoriteKey);
				const next = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
				writeList(favoriteKey, next);
				updateGarageState();
				syncGarageState();
				return;
			}
		}
		const compare = event.target.closest('[data-daynight-compare], .compare-details');
		if (compare) {
			const card = compare.closest('[data-daynight-slug]');
			const slug = compare.getAttribute('data-daynight-compare') || (card && card.getAttribute('data-daynight-slug'));
			if (slug) {
				event.preventDefault();
				const current = readList(compareKey).filter((item) => item !== slug);
				writeList(compareKey, [slug, ...current].slice(0, 4));
				updateGarageState();
				syncGarageState();
				const modalText = document.querySelector('#CompareModal .h4, #CompareModal .h5, #CompareModal p');
				if (modalText) modalText.textContent = 'Added to OUTLETCARS.BG — Варна compare list';
				return;
			}
		}
		const listingCard = event.target.closest('.card-box a, .view-details');
		if (listingCard && /listing-details/i.test(listingCard.getAttribute('href') || '')) {
			event.preventDefault();
			go('/inventory/' + firstVehicleSlug);
			return;
		}
		const formAction = event.target.closest('[data-daynight-form-target]');
		if (formAction) {
			const form = document.querySelector(formAction.getAttribute('data-daynight-form-target'));
			if (form) {
				event.preventDefault();
				if (formAction.hasAttribute('data-daynight-submit-form')) {
					let statusInput = form.querySelector('input[name="status"]');
					if (!statusInput) {
						statusInput = document.createElement('input');
						statusInput.type = 'hidden';
						statusInput.name = 'status';
						form.prepend(statusInput);
					}
					statusInput.value = formAction.getAttribute('data-daynight-listing-status') || 'draft';
					if (typeof form.requestSubmit === 'function') {
						form.requestSubmit();
					} else {
						form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
					}
					return;
				}
				setFormStatus(
					form,
					formAction.getAttribute('data-daynight-form-status') || 'Saved locally by OUTLETCARS.BG — Варна'
				);
			}
		}
	}, runtimeListenerOptions);
	document.addEventListener('submit', async (event) => {
		const form = event.target;
		if (form.matches('[data-daynight-search-form="inventory"]')) {
			event.preventDefault();
			go(inventorySearchUrl(form));
			return;
		}

		if (!form.matches('.send-inquiry, .daynight-contact-form, .daynight-profile-form, .daynight-password-form, .daynight-add-listing-form, .daynight-sell-form, .daynight-service-form, .daynight-blog-comment-form, .daynight-newsletter-form, .form-footer, .newsletter-form, #LoginModal form, #SignUpModal form, #ForgotPasswordModal form')) {
			return;
		}

		if (form.matches('.daynight-add-listing-form[data-daynight-native-submit="true"]')) {
			return;
		}

		event.preventDefault();
		const payload = formPayload(form);
		if (form.matches('#LoginModal form')) {
			const result = await postJson('/api/auth/login', {
				...payload,
				email: payload.email || payload['email-login'] || runtimeData.account.session.email,
				password: payload.password || payload['Password-login'] || 'local prototype login',
				role: runtimeData.account.session.role
			});
			const session = result?.data?.session || runtimeData.account.session;
			writeList(sessionKey, [session]);
			setFormStatus(form, 'Signed in locally as ' + session.name);
		} else if (form.matches('#SignUpModal form')) {
			const result = await postJson('/api/auth/register', {
				...payload,
				email: payload.email || payload['SignUp-login'],
				password: payload.password || payload['Password-SignUp'],
				role: 'customer'
			});
			const session = result?.data?.session;
			if (session) writeList(sessionKey, [session]);
			setFormStatus(form, 'Customer account created locally for OUTLETCARS.BG — Варна');
		} else if (form.matches('#ForgotPasswordModal form')) {
			await postJson('/api/auth/recovery', {
				...payload,
				email: payload.email || payload['email-forgot-password']
			});
			setFormStatus(form, 'Password recovery request queued locally for OUTLETCARS.BG — Варна');
		} else if (form.matches('.daynight-profile-form')) {
			await postJson('/api/account/profile', payload);
			setFormStatus(form, 'Profile saved locally for ' + runtimeData.account.session.name);
		} else if (form.matches('.daynight-password-form')) {
			await postJson('/api/account/password', payload);
			setFormStatus(form, 'Password change recorded locally');
		} else if (form.matches('.daynight-add-listing-form')) {
			if (window.location.pathname.startsWith('/admin')) {
				const listingId = payload.listingId || payload.id || payload.slug;
				await postJson(
					'/api/inventory/listings',
					{
						...payload,
						actorRole: runtimeData.account.session.role,
						role: runtimeData.account.session.role,
						status: payload.status || 'draft'
					},
					listingId ? 'PATCH' : 'POST'
				);
				setFormStatus(
					form,
					listingId
						? 'Listing changes saved locally for OUTLETCARS.BG — Варна'
						: 'Listing draft saved locally for OUTLETCARS.BG — Варна review'
				);
			} else {
				await postJson('/api/inventory/submissions', {
					...payload,
					source: 'customer-listing'
				});
				setFormStatus(form, 'Listing draft saved locally for OUTLETCARS.BG — Варна review');
			}
		} else if (form.matches('.daynight-sell-form')) {
			await postJson('/api/inventory/submissions', {
				...payload,
				source: 'sell-your-car'
			});
			setFormStatus(form, 'Заявката е подготвена. OUTLETCARS.BG — Варна ще се свърже с вас.');
		} else if (form.matches('.daynight-service-form')) {
			await postJson('/api/inquiries', payload);
			setFormStatus(form, 'Service request queued locally for OUTLETCARS.BG — Варна');
		} else if (form.matches('.daynight-blog-comment-form')) {
			await postJson('/api/messages', payload);
			setFormStatus(form, 'Comment saved locally for OUTLETCARS.BG — Варна review');
		} else if (form.matches('.daynight-newsletter-form, .form-footer, .newsletter-form')) {
			await postJson('/api/messages', {
				...payload,
				message: 'Newsletter signup'
			});
			setFormStatus(form, 'Newsletter signup saved locally for OUTLETCARS.BG — Варна');
		} else {
			await postJson('/api/inquiries', payload);
			setFormStatus(
				form,
				form.matches('.daynight-contact-form')
					? 'Съобщението е подготвено локално за OUTLETCARS.BG — Варна'
					: 'Inquiry sent to OUTLETCARS.BG — Варна locally'
			);
		}
	}, runtimeListenerOptions);
	const readCalcNumber = (calculator, key) => {
		const input = calculator.querySelector('[data-daynight-calc-input="' + key + '"]');
		const value = Number(String(input?.value || '0').replace(/[^0-9.-]/g, ''));
		return Number.isFinite(value) ? value : 0;
	};
	const formatEur = (value) => Math.round(value).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' EUR';
	const updateCalculator = (calculator) => {
		const price = readCalcNumber(calculator, 'price');
		const transport = readCalcNumber(calculator, 'transport');
		const dutyRate = readCalcNumber(calculator, 'dutyRate') / 100;
		const vatRate = readCalcNumber(calculator, 'vatRate') / 100;
		const prep = readCalcNumber(calculator, 'prep');
		const duty = price * dutyRate;
		const vat = (price + transport + duty) * vatRate;
		const total = price + transport + duty + vat + prep;
		const values = { price, transport, duty, vat, prep, total, totalSmall: total };
		Object.entries(values).forEach(([key, value]) => {
			calculator.querySelectorAll('[data-daynight-calc-output="' + key + '"]').forEach((node) => {
				node.textContent = formatEur(value);
			});
		});
	};
	document.querySelectorAll('[data-daynight-calculator]').forEach(updateCalculator);
	document.addEventListener('input', (event) => {
		const calculator = event.target.closest('[data-daynight-calculator]');
		if (calculator) updateCalculator(calculator);
	}, runtimeListenerOptions);
	updateGarageState();
	hydrateGarageState();
	window.__DAYNIGHT_RUNTIME__ = runtimeData;
})();
</script>`;

	return html
		.replace('</head>', `${headInjection}\n</head>`)
		.replace('</body>', `${bodyInjection}\n</body>`);
}

export function resolveAuxeroTemplateFile(routePath: string) {
	const normalizedPath = routePath.replace(/^\/+|\/+$/g, '');

	if (!normalizedPath) {
		return primaryPageToFile.home;
	}

	if (blockedPrettyRoutes.has(normalizedPath) || blockedTemplateFiles.has(normalizedPath)) {
		return undefined;
	}

	if (/^admin\/inventory\/edit\/[^/]+$/.test(normalizedPath)) {
		return 'add-listings-2.html';
	}

	if (prettyRouteToFile[normalizedPath]) {
		return prettyRouteToFile[normalizedPath];
	}

	if (htmlByFile[normalizedPath] || rawTemplateRouteFiles.has(normalizedPath)) {
		return normalizedPath;
	}

	const htmlFile = `${normalizedPath}.html`;
	if (blockedTemplateFiles.has(htmlFile)) {
		return undefined;
	}

	if (htmlByFile[htmlFile] || rawTemplateRouteFiles.has(htmlFile)) {
		return htmlFile;
	}

	return undefined;
}

export function renderAuxeroTemplate(templateFile: string, options: AuxeroRenderOptions = {}) {
	const sourceHtml = htmlByFile[templateFile];

	if (!sourceHtml) {
		return undefined;
	}

	const normalized = normalizeAssetUrls(sourceHtml);
	const withBackgrounds = applyBackgroundImages(normalized);
	const branded = applyDayNightBranding(withBackgrounds);
	const withoutDuplicatePhones = collapseDuplicateAdjacentPhoneLinks(branded);
	const withoutBlockedAnchors = stripBlockedTemplateAnchors(withoutDuplicatePhones);
	const withNavigation = rewritePrimaryNavigation(withoutBlockedAnchors, templateFile);
	const withRoutes = rewriteTemplateLinks(withNavigation);
	const withAccountTeaserLinks = rewriteUnfinishedAccountDashboardLinks(withRoutes);
	const withAuthValues = clearAuthModalDemoValues(withAccountTeaserLinks);
	const withSearchForms = wireGlobalSearchForms(withAuthValues);
	const withData = applyTemplateData(withSearchForms, templateFile, options);
	const withDashboardHeader = applyDashboardContextHeader(withData, templateFile, options);
	const withAccessibilityLabels = applyAuxeroAccessibilityLabels(withDashboardHeader, templateFile);

	return injectLocalBehavior(withAccessibilityLabels, templateFile, options);
}

export function auxeroResponse(
	page: AuxeroPrimaryPage | string,
	options: AuxeroRenderOptions = {}
) {
	const templateFile =
		page === 'inventory'
			? inventoryTemplateForView(
					resolveInventoryView(options.view ?? options.searchParams?.get('view'))
				)
			: page in primaryPageToFile
				? primaryPageToFile[page as AuxeroPrimaryPage]
				: page;
	const html = renderAuxeroTemplate(templateFile, options);

	if (!html) {
		return new Response('Auxero template page not found', { status: 404 });
	}

	return new Response(html, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'no-store'
		}
	});
}

export function auxeroRouteResponse(routePath: string, options: AuxeroRenderOptions = {}) {
	const templateFile = resolveAuxeroTemplateFile(routePath);

	if (!templateFile) {
		return new Response('Auxero template route not found', { status: 404 });
	}

	const canonicalRoute = canonicalRouteForRawTemplateRequest(routePath, templateFile);

	if (canonicalRoute) {
		return new Response(null, {
			status: 308,
			headers: {
				location: canonicalRoute,
				'cache-control': 'no-store'
			}
		});
	}

	const session = options.request
		? resolveDayNightPageSession(options.request, routePath, options.searchParams)
		: resolveDayNightSession(routePath, options.searchParams);

	if (!session) {
		return new Response('OUTLETCARS.BG — Варна account session is required', { status: 401 });
	}

	if (!canAccessDayNightRoute(session, routePath)) {
		return new Response('OUTLETCARS.BG — Варна account role cannot access this route', { status: 403 });
	}

	return auxeroResponse(templateFile, { ...options, routePath, session });
}
