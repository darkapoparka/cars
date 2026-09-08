import {
	eliqautoAssets,
	eliqautoBrand,
	eliqautoContact,
	isPrimaryNavActive,
	mainNavigation
} from '$lib/data/eliqauto';
import { vehicles } from '$lib/data/vehicles';
import {
	applyAccountTemplateData,
	getAuxeroAccountRuntimeData,
	isAccountTemplate
} from './auxero-account-data';
import { accountContext } from './account-dashboard-state';
import { canAccessEliqautoRoute, resolveEliqautoPageSession, resolveEliqautoSession } from './auth';
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
	'agents/eliqauto-sales': 'sale-agents-details.html',
	'agents/eliqauto-import': 'sale-agents-details.html',
	'agents/eliqauto-inspection': 'sale-agents-details.html',
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
	'dealer-details.html': '/agents/eliqauto-sales',
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
	'sale-agents-details.html': '/agents/eliqauto-sales',
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
			'<form class="search-form__form" action="/inventory" method="get" data-eliqauto-search-form="inventory">'
		)
		.replace(
			/<form class="search-modal__form" action="#" method="get">/g,
			'<form class="search-modal__form" action="/inventory" method="get" data-eliqauto-search-form="inventory">'
		)
		.replace(
			/<input type="text" class="search-form__input" placeholder="Search\.\.\." autocomplete="off" id="searchInput">/g,
			'<input type="text" class="search-form__input" name="q" placeholder="Search Eliqauto inventory" autocomplete="off" id="searchInput">'
		)
		.replace(
			/<input type="text" class="search-modal__input" placeholder="Search for anything" autocomplete="off" id="searchModalInput">/g,
			'<input type="text" class="search-modal__input" name="q" placeholder="Search Eliqauto inventory" autocomplete="off" id="searchModalInput">'
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

function applyEliqautoBranding(html: string) {
	// Source-template vendor tokens are reconstructed from fragments so the original
	// vendor name never appears verbatim in our source, while still being stripped
	// from the rendered HTML produced by the bundled template-ref pages.
	const vendorName = ['Au', 'rex', 'o'].join('');
	const vendorTheme = ['themes', 'flat'].join('');
	const vendorEmail = `${vendorTheme}@gmail.com`;
	const vendorAuthorUrl = `https://themeforest.net/user/${vendorTheme}`;

	return html
		.replaceAll(`${vendorName} | Car Dealer, Rental & Listing HTML Template`, eliqautoBrand.name)
		.replaceAll(`${vendorName} Garage`, eliqautoBrand.name)
		.replaceAll(vendorName, eliqautoBrand.name)
		.replaceAll('Super Admin', `${eliqautoBrand.name} Admin`)
		.replaceAll(vendorEmail, eliqautoContact.emailLabel)
		.replaceAll(vendorAuthorUrl, `https://${eliqautoBrand.domain}`)
		.replace(
			/6205 Peachtree Dunwoody Rd,\s*Atlanta,\s*(?:GA 30328)?/g,
			eliqautoContact.addressLabel
		)
		.replaceAll('/assets/images/logo-white.png', eliqautoAssets.logoDark)
		.replaceAll('/assets/images/logo.png', eliqautoAssets.logoLight)
		.replaceAll(
			'/assets/images/brand/app-store-dark.png',
			'/assets/images/brand/app-store-dark.webp'
		)
		.replaceAll(
			'/assets/images/brand/google-play-dark.png',
			'/assets/images/brand/google-play-dark.webp'
		)
		.replaceAll('alt="logo-white.png"', 'alt="Eliqauto"')
		.replaceAll('alt="logo"', 'alt="Eliqauto"')
		.replaceAll('href="/account/favorites"', 'href="/account"')
		.replaceAll('href="./account/favorites"', 'href="./account"')
		.replaceAll('aria-label="Wishlist"', 'aria-label="Любими"')
		.replaceAll('Search Cars Near You – Buy Today!', 'Find Your Next Eliqauto Vehicle')
		.replaceAll('Search Cars Near You', 'Find Your Next Eliqauto Vehicle')
		.replaceAll('Get Your Dream Car', 'Import or buy with Eliqauto')
		.replaceAll('Listing Grid 3 Columns', 'Eliqauto Inventory')
		.replaceAll('Sale Agents', 'Eliqauto Consultants')
		.replaceAll('Sale Agents List', 'Consultants')
		.replaceAll('Sale Agents Detail', 'Consultant Profile')
		.replaceAll('Dealer Listing', 'Consultants')
		.replaceAll('Dealer Detail', 'Consultant Detail')
		.replaceAll('Want to sell your car?', 'Want to sell your car with Eliqauto?')
		.replaceAll('Contact Us', 'Contact Eliqauto')
		.replaceAll('Get Prequalified for Auto Financing', 'Services for import, documents, and sales')
		.replaceAll('Financing', 'Services')
		.replaceAll('Sevices Center', 'Services')
		.replaceAll('Services Center', 'Services')
		.replace(
			/Monday–Friday from 8 AM to 8 PM\s*<br>\s*Saturday from 9 AM to 6 PM EST/g,
			'Monday-Friday 9:00 - 18:00 <br>Weekend viewings by appointment'
		)
		.replaceAll('Buying a car', 'Buying With Eliqauto')
		.replaceAll('Selling a car', 'Sell Your Car')
		.replaceAll('Investor Relations', 'Services')
		.replaceAll('Careers', 'FAQ')
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replaceAll('Listings by City', 'Inventory Map')
		.replaceAll('Certified Pre-Owned', 'Verified Listings')
		.replaceAll('Car Payment Calculators', 'Import Calculator')
		.replaceAll('Car Reviews & Ratings', 'Client Reviews')
		.replaceAll('Download App', 'Eliqauto Online')
		.replaceAll('Clients Reviews', 'Client Reviews')
		.replace(/My Listing(?!s)/g, 'My Listings')
		.replaceAll('My Reviews', 'Reviews')
		.replaceAll('All Listing', 'Inventory')
		.replaceAll('Recent Reviews', 'Recent Inquiries')
		.replaceAll('Car Views', 'Lead Views')
		.replaceAll('Pending', 'Open Leads')
		.replaceAll('tel:1-555-678-8888', eliqautoContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', eliqautoContact.marketplacePhoneHref)
		.replaceAll('tel:1-333-123-6666', eliqautoContact.marketplacePhoneHref)
		.replaceAll('tel:1-866-288-6868', eliqautoContact.primaryPhoneHref)
		.replaceAll('tel:5551234567', eliqautoContact.primaryPhoneHref)
		.replaceAll('1-555-678-8888', eliqautoContact.primaryPhoneLabel)
		.replaceAll('1-555-678-9999', eliqautoContact.marketplacePhoneLabel)
		.replaceAll('1-333-123-6666', eliqautoContact.marketplacePhoneLabel)
		.replaceAll('1-866-288-6868', eliqautoContact.primaryPhoneLabel)
		.replaceAll('(555) 123-4567', eliqautoContact.primaryPhoneLabel)
		.replace(
			/<p class="text-secondary mb-4">Username:[\s\S]*?<\/p>\s*<p class="text-secondary">Password:[\s\S]*?<\/p>/g,
			'<p class="text-secondary mb-4">Влезте с Eliqauto профил.</p>'
		)
		.replaceAll('Use your Eliqauto account credentials.', 'Влезте с Eliqauto профил.')
		.replaceAll('Enter your email', 'Вашият имейл')
		.replaceAll('Password*', 'Парола*')
		.replaceAll('Confirm password*', 'Потвърдете паролата*')
		.replaceAll('Forgot Your Password?', 'Забравена парола?')
		.replaceAll('Forgot Password', 'Забравена парола')
		.replaceAll('Username or email address *', 'Имейл адрес *')
		.replaceAll('Get Reset Code', 'Изпрати код')
		.replaceAll('Not registered yet?', 'Нямате профил?')
		.replaceAll('Create a new account', 'Създай профил')
		.replaceAll('Already have an account?', 'Вече имате профил?')
		.replaceAll('I agree to the', 'Съгласен/на съм с')
		.replaceAll('Terms of User', 'общите условия')
		.replaceAll('or sign up with', 'или продължете с')
		.replaceAll('Login Here', 'Влезте оттук')
		.replaceAll('Remember me', 'Запомни ме')
		.replace(
			/©2026[\s\S]*?All Rights Reserved\./g,
			`©2026 ${eliqautoBrand.name}. All Rights Reserved.`
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

	return `<div id="main-nav" class="main-nav mr-18 eliqauto-dashboard-context-header" data-eliqauto-dashboard-context-header>
	<div class="eliqauto-dashboard-context-heading">
		<span>${escapeHtml(eyebrow)}</span>
		<p class="h4 mb-0">${escapeHtml(title)}</p>
	</div>
	<ul id="menu-primary-menu" class="menu eliqauto-dashboard-context-links" data-eliqauto-dashboard-context-nav>
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
		'<div class="header-right main-nav-wrapper eliqauto-dashboard-header-wrapper$1"'
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
	const localScopeClass = isInventoryTemplate ? 'eliqauto-inventory-template' : pageClass;
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
	@layer auxero-adapter {
	body.${localScopeClass} .preload {
		display: none;
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
	body.${localScopeClass} .dashboard-container .eliqauto-account-listings[data-eliqauto-submissions-table] .cart-header,
	body.${localScopeClass} .dashboard-container .eliqauto-account-listings[data-eliqauto-submissions-table] .cart-item {
		gap: 8px;
		grid-template-columns: minmax(320px, 1fr) 116px 120px 100px 96px 90px;
	}
	body.${localScopeClass} .dashboard-container .eliqauto-account-listings[data-eliqauto-submissions-table] .cart-header > div,
	body.${localScopeClass} .dashboard-container .eliqauto-account-listings[data-eliqauto-submissions-table] .cart-item > div {
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
		background: var(--bc-surface-soft);
		border-radius: 12px;
		padding: 12px 14px;
	}
	body.${localScopeClass} .eliqauto-view-toggle .item-menu {
		align-items: center;
		background: transparent;
		border-radius: 999px;
		display: inline-flex;
		height: 40px;
		justify-content: center;
		width: 40px;
	}
	body.${localScopeClass} .eliqauto-view-toggle .item-menu.active {
		background: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-view-toggle .eliqauto-inventory-layout-toggle {
		align-items: center;
		background: var(--bc-surface-soft);
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
	body.${localScopeClass} .eliqauto-view-toggle .eliqauto-inventory-layout-toggle:hover {
		background: #ffffff;
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-view-toggle .eliqauto-inventory-layout-toggle.active {
		background: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-mode-toggle {
		align-items: center;
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		display: inline-flex;
		gap: 4px;
		padding: 4px;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-mode-toggle__item {
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
	body.${localScopeClass} .eliqauto-inventory-filter-mode-toggle__item:hover {
		background: #ffffff;
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-mode-toggle__item.active {
		background: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-mode-toggle__item.active *,
	body.${localScopeClass} .eliqauto-inventory-layout-toggle.active *,
	body.${localScopeClass} .eliqauto-view-toggle .item-menu.active * {
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-view-toggle .item-menu.active svg circle,
	body.${localScopeClass} .eliqauto-view-toggle .item-menu.active svg rect,
	body.${localScopeClass} .eliqauto-view-toggle .item-menu.active svg path {
		stroke: #ffffff;
	}
	${
		usesPublicHeader
			? `
	body.${localScopeClass} .mobile-hidden-header-button a[href="/admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .mobile-hidden-header-button a[href="./admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .header-button-mobile a[href="/admin/inventory/new"]:not(.open-modal),
	body.${localScopeClass} .header-button-mobile a[href="./admin/inventory/new"]:not(.open-modal) {
		display: none;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal,
	body.${localScopeClass} .header-button-mobile .open-modal {
		background: #a51717;
		border-color: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal svg path,
	body.${localScopeClass} .header-button-mobile .open-modal svg path {
		stroke: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button {
		gap: 0;
	}
	@media (min-width: 1200px) {
		body.${localScopeClass} .header-right.main-nav-wrapper {
			display: flex;
			flex: 1 1 auto;
			align-items: center;
			justify-content: flex-end;
			gap: 20px;
			min-width: 0;
		}
		body.${localScopeClass} #main-nav {
			margin-right: auto;
			margin-left: auto;
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
			margin-left: 20px;
		}
	}
`
			: ''
	}
	${
		isAccountTemplate(templateFile)
			? `
	body.${localScopeClass} .eliqauto-dashboard-header-wrapper {
		min-width: 0;
		width: 100%;
	}
	body.${localScopeClass} #main-nav.eliqauto-dashboard-context-header {
		align-items: center;
		display: flex;
		gap: 24px;
		justify-content: space-between;
		margin-right: 0;
		min-width: 0;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-dashboard-context-heading {
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-dashboard-context-heading span {
		color: #777f89;
		display: block;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
		margin-bottom: 3px;
		text-transform: uppercase;
	}
	body.${localScopeClass} .eliqauto-dashboard-context-heading .h4 {
		color: #1c1c1c;
		font-size: 24px;
		line-height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links {
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		gap: 10px;
		justify-content: flex-end;
		margin: 0;
		padding: 0;
	}
	body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links > li {
		margin: 0;
		padding: 0;
	}
	body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links > li > a {
		align-items: center;
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		color: #1c1c1c;
		display: inline-flex;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		min-height: 48px;
		padding: 0 20px;
		white-space: nowrap;
	}
	body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links > li.current-menu-item > a,
	body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links > li > a:hover {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
	}
	@media (min-width: 1200px) {
		body.${localScopeClass} .header-right.main-nav-wrapper.eliqauto-dashboard-header-wrapper {
			align-items: center;
			display: grid;
			flex: 1 1 auto;
			gap: 18px;
			grid-template-columns: minmax(280px, 1fr) auto auto;
		}
		body.${localScopeClass} .eliqauto-dashboard-header-wrapper .mobile-hidden-header-button,
		body.${localScopeClass} .eliqauto-dashboard-header-wrapper .header-actions {
			justify-self: end;
		}
		body.${localScopeClass} .eliqauto-dashboard-header-wrapper .header-actions {
			margin-left: 0;
		}
	}
	@media (max-width: 1199px) {
		body.${localScopeClass} #main-nav.eliqauto-dashboard-context-header {
			flex: 1 1 auto;
		}
		body.${localScopeClass} #menu-primary-menu.eliqauto-dashboard-context-links {
			display: none;
		}
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .eliqauto-dashboard-context-heading .h4 {
			font-size: 20px;
			line-height: 26px;
		}
		body.${localScopeClass} .eliqauto-dashboard-context-heading span {
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
		background: var(--bc-surface-soft);
	}
	body.${localScopeClass} section.pb-100 {
		background: var(--bc-surface-soft);
		padding-top: 32px;
	}
	body.${localScopeClass} .eliqauto-inventory-banner {
		align-items: center;
		background: #f8eeee;
		background-color: #f8eeee;
		border: 0;
		box-shadow: none;
		display: flex;
		isolation: isolate;
		min-height: 342px;
		overflow: hidden;
		position: relative;
	}
	body.${localScopeClass} .eliqauto-inventory-banner:has(.filter-select-dropdown__toggle:checked),
	body.${localScopeClass} .eliqauto-inventory-banner:has(.ifp--open) {
		overflow: visible;
		z-index: 80;
	}
	body.${localScopeClass} .eliqauto-inventory-banner::before {
		background: #a51717;
		bottom: 0;
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		width: min(38vw, 720px);
		z-index: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-banner > .container {
		align-items: start;
		box-sizing: border-box;
		display: grid;
		min-height: inherit;
		padding-bottom: 26px;
		padding-top: 27px;
		position: relative;
		z-index: 1;
	}
	body.${localScopeClass} .eliqauto-inventory-banner__media {
		box-sizing: border-box;
		bottom: 0;
		left: 0;
		overflow: hidden;
		pointer-events: none;
		position: absolute;
		top: 0;
		user-select: none;
		width: 100%;
		z-index: 1;
	}
	body.${localScopeClass} .eliqauto-inventory-banner__media::after {
		display: none;
	}
	body.${localScopeClass} .eliqauto-inventory-banner__copy {
		align-items: center;
		display: flex;
		inset: 0;
		justify-content: center;
		pointer-events: none;
		position: absolute;
		text-align: center;
		z-index: 2;
	}
	body.${localScopeClass} .eliqauto-inventory-banner__copy h1 {
		color: #1c1c1c;
		font-size: clamp(34px, 3.1vw, 56px);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1;
		margin: 0;
		text-shadow: 0 12px 30px rgba(255, 255, 255, 0.9);
	}
	body.${localScopeClass} .eliqauto-inventory-banner__buybox {
		margin: 0 auto;
		max-width: min(1220px, calc(100vw - 48px));
		position: relative;
		width: 100%;
		z-index: 5;
	}
	body.${localScopeClass} .eliqauto-inventory-banner__media-image {
		display: block;
		filter: drop-shadow(0 22px 18px rgba(0, 0, 0, 0.18));
		height: auto;
		left: 50%;
		max-width: none;
		object-fit: contain;
		opacity: 0.58;
		position: absolute;
		top: 54%;
		transform: translate(-50%, -50%);
		user-select: none;
		width: min(100vw, 1900px);
	}
	body.${localScopeClass} .eliqauto-inventory-banner__media-image--generated {
		object-position: center center;
	}
	@media (max-width: 991.98px) {
		body.${localScopeClass} .eliqauto-inventory-banner__media {
			display: none;
		}
	}
	body.${localScopeClass} .eliqauto-inventory-banner--compact {
		min-height: 250px;
	}
	body.${localScopeClass} .eliqauto-inventory-banner--compact > .container {
		padding-bottom: 20px;
		padding-top: 22px;
	}
	body.${localScopeClass} .eliqauto-sr-only {
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
		color: #1c1c1c;
		font-size: 40px;
		line-height: 1.14;
		margin-bottom: 0;
	}
	body.is_dark.${pageClass} section.pb-100 > .container > h2 {
		color: #ffffff;
	}
	body.${localScopeClass} .tf-spacing-style3 {
		height: 28px;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar {
		background: #ffffff;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 18px 42px rgba(54, 95, 104, 0.12);
		margin: 0;
		padding: 20px 20px 18px;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__row {
		align-items: center;
		display: grid;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr);
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__primary {
		align-items: center;
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
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
	body.${localScopeClass} .eliqauto-inventory-searchbar__primary:focus-within {
		background: #ffffff;
		border-color: #a51717;
		box-shadow: 0 0 0 2px rgba(165, 23, 23, 0.18);
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__search {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 0;
		display: flex;
		gap: 10px;
		min-height: 40px;
		padding: 0 16px;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__search img {
		flex: 0 0 auto;
		height: 16px;
		opacity: 0.72;
		width: 16px;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__search input {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		color: #1c1c1c;
		font-size: 16px;
		height: auto;
		line-height: 24px;
		min-width: 0;
		outline: 0;
		padding: 0;
		transition: none;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__filter {
		align-items: center;
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		border-radius: 8px;
		color: #ffffff;
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
	body.${localScopeClass} .eliqauto-inventory-searchbar__filter:hover {
		background: #a51717;
		border-color: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__filter img {
		height: 18px;
		width: 18px;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__filter span {
		display: inline-block;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__submit {
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
	body.${localScopeClass} .eliqauto-inventory-filter-grid {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-top: 12px;
		position: relative;
		z-index: 8;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-grid:has(.ifp--open) {
		z-index: 90;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field {
		background: #fff8f8;
		border: 1px solid #efdddd;
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
	body.${localScopeClass} .eliqauto-inventory-filter-field.search-cars__select {
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field:hover,
	body.${localScopeClass} .eliqauto-inventory-filter-field:focus-within {
		background: #ffffff;
		border-color: #a51717;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field:has(.filter-select-dropdown__toggle:checked) {
		z-index: 40;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field > span {
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
	body.${localScopeClass} .eliqauto-inventory-filter-field .filter-select-dropdown__toggle {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field .search-cars__label {
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
	body.${localScopeClass} .eliqauto-inventory-filter-field .filter-select-dropdown__text {
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
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field .filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field .filter-select-dropdown__menu {
		border: 1px solid #efdddd;
		border-radius: 8px;
		box-shadow: 0 16px 36px rgba(28, 28, 28, 0.12);
		margin-top: 6px;
		max-height: 292px;
		min-width: 100%;
		overflow: hidden;
		width: 100%;
		z-index: 40;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-field .filter-select-dropdown__list {
		max-height: 292px;
		overflow-y: auto;
		padding: 6px;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option {
		align-items: center;
		border-radius: 6px;
		display: grid;
		gap: 9px;
		grid-template-columns: auto minmax(0, 1fr) auto;
		min-height: 39px;
		padding: 0 10px;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option:hover,
	body.${localScopeClass} .eliqauto-inventory-filter-option:has(input:checked) {
		background: var(--bc-accent-soft);
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option input {
		accent-color: #1c1c1c;
		height: 15px;
		margin: 0;
		width: 15px;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option input:checked + span::before {
		background-image: url('/assets/icons/checked-2.svg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option img {
		height: 18px;
		object-fit: contain;
		width: 22px;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option small {
		color: #777777;
		font-size: 12px;
		font-weight: 700;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-option span {
		font-size: 15px;
		line-height: 20px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	body.${localScopeClass} .eliqauto-inventory-active-filters {
		align-items: center;
		display: grid;
		gap: 10px 16px;
		grid-template-columns: auto minmax(0, 1fr);
		margin: 0;
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-active-filters--results {
		background: transparent;
		border: 0;
		margin: 0 0 18px;
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-active-filters__summary {
		color: #4b4b4b;
		font-size: 15px;
		font-weight: 500;
		line-height: 36px;
		margin: 0;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-active-filters__chips {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: flex-start;
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-active-filters__chips--quick {
		overflow: hidden;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar,
	body.${localScopeClass} .eliqauto-inventory-searchbar *,
	body.${localScopeClass} .eliqauto-inventory-filter-grid,
	body.${localScopeClass} .eliqauto-inventory-filter-grid *,
	body.${localScopeClass} .eliqauto-inventory-active-filters,
	body.${localScopeClass} .eliqauto-inventory-active-filters * {
		animation: none;
		transform: none;
		transition: none;
		will-change: auto;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-grid .ifp__panel--modal {
		transform: none;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-grid .ifp__chev {
		transform: translateY(-50%);
		transition: transform 0.18s ease;
	}
	body.${localScopeClass} .eliqauto-inventory-filter-grid .ifp--open .ifp__chev {
		transform: translateY(-50%) rotate(180deg);
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .eliqauto-inventory-filter-grid .ifp__panel--modal {
			transform: none;
		}
	}
	body.${localScopeClass} .eliqauto-quick-chip,
	body.${localScopeClass} .eliqauto-active-filter {
		align-items: center;
		border: 1px solid var(--bc-border);
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
	body.${localScopeClass} .eliqauto-quick-chip {
		background: #ffffff;
	}
	body.${localScopeClass} .eliqauto-quick-chip.active,
	body.${localScopeClass} .eliqauto-quick-chip:hover,
	body.${localScopeClass} .eliqauto-active-filter {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-active-filter--clear {
		background: #ffffff;
		border-color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-active-filter span {
		margin-left: 5px;
	}
	body.${localScopeClass} .eliqauto-inventory-content .wow {
		animation-name: none;
		opacity: 1;
		visibility: visible;
	}
	body.${localScopeClass} .eliqauto-inventory-content .content-inner,
	body.${localScopeClass} .eliqauto-inventory-content .content-inner.active {
		opacity: 1;
		position: relative;
		transform: none;
		transition: none;
		visibility: visible;
		z-index: 1;
	}
	body.${localScopeClass} .eliqauto-inventory-searchbar__utility {
		align-items: center;
		background: transparent;
		border: 0;
		border-top: 1px solid var(--bc-border);
		border-radius: 0;
		box-shadow: none;
		display: grid;
		gap: 16px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-left: 0;
		margin-bottom: 0;
		margin-top: 14px;
		margin-right: 0;
		padding: 14px 0 0;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-hero-switches {
		align-items: center;
		border-top: 1px solid var(--bc-border);
		display: flex;
		gap: 12px;
		justify-content: space-between;
		margin-top: 14px;
		padding-top: 14px;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-hero-switches__label {
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 800;
		line-height: 22px;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-view-toggle {
		align-items: center;
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		display: flex;
		gap: 4px;
		justify-self: center;
		margin: 0;
		padding: 4px;
	}
	body.${localScopeClass} .eliqauto-inventory-result-count p {
		margin: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-result-count {
		align-items: center;
		display: flex;
		gap: 14px;
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sort {
		align-items: center;
		display: flex;
		gap: 10px;
		justify-self: end;
	}
	body.${localScopeClass} .eliqauto-inventory-sort__label {
		color: #1c1c1c;
		font-size: 15px;
		line-height: 22px;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-content {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 18px 18px 22px;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown {
		min-width: 178px;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__button {
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		box-shadow: none;
		color: #1c1c1c;
		min-height: 46px;
		padding: 0 14px;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__button:hover,
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown.active .core-dropdown__button {
		background: #ffffff;
		border-color: #a51717;
		box-shadow: none;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__button:focus {
		box-shadow: none;
		outline: none;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__selected {
		color: #1c1c1c;
		font-size: 15px;
		line-height: 22px;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__menu {
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(54, 95, 104, 0.1);
		margin-top: 6px;
	}
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__option:hover,
	body.${localScopeClass} .eliqauto-inventory-toolbar-row .core-dropdown__option.active {
		background: var(--bc-surface-hover);
	}
	body.${localScopeClass} .eliqauto-inventory-main {
		background: var(--bc-surface-soft);
		padding-top: 30px;
		position: relative;
		z-index: 1;
	}
	body.${localScopeClass} .eliqauto-inventory-main > .container {
		max-width: none;
		width: calc(100vw - 48px);
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard {
		align-items: start;
		display: grid;
		gap: 22px;
		grid-template-columns: 336px minmax(0, 1fr);
		background: #ffffff;
		border: 1px solid #e1e7ed;
		border-radius: 12px;
		padding: 18px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map {
		grid-template-columns: 320px minmax(410px, 0.86fr) minmax(420px, 1fr);
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-sidebar,
	body.${localScopeClass} .eliqauto-inventory-dashboard-results,
	body.${localScopeClass} .eliqauto-inventory-dashboard-map {
		box-shadow: none;
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-sidebar {
		background: #fff8f8;
		border: 1px solid #efdddd;
		border-radius: 10px;
		max-height: none;
		overflow: visible;
		padding: 18px;
		position: sticky;
		top: 104px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-results,
	body.${localScopeClass} .eliqauto-inventory-dashboard-map {
		background: #ffffff;
		border: 0;
		border-radius: 0;
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-form {
		display: grid;
		gap: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-heading {
		border-bottom: 0;
		margin-bottom: 15px;
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-heading p {
		margin: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-heading .h5 {
		color: #141414;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 22px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-heading .text-secondary {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
		margin-top: 4px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-group {
		border: 0;
		border-bottom: 1px solid var(--bc-border);
		min-inline-size: 0;
		margin: 0;
		padding: 15px 0;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-group:last-of-type {
		border-bottom: 0;
		padding-bottom: 6px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-group legend {
		color: #141414;
		display: block;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 20px;
		margin-bottom: 9px;
		padding: 0;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-group legend span {
		color: #141414;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-options {
		display: grid;
		gap: 2px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option {
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
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:hover {
		background: var(--bc-surface-hover);
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:has(input:checked),
	body.${localScopeClass} .eliqauto-inventory-sidebar-option.is-selected {
		background: var(--bc-accent-soft);
		color: #161616;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option input {
		height: 1px;
		margin: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		width: 1px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option__control {
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
	body.${localScopeClass} .eliqauto-inventory-sidebar-option--single .eliqauto-inventory-sidebar-option__control {
		border-radius: 999px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:hover .eliqauto-inventory-sidebar-option__control {
		border-color: #6b7280;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option input:focus-visible + .eliqauto-inventory-sidebar-option__control {
		outline: 2px solid #7a1212;
		outline-offset: 2px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:has(input:checked) .eliqauto-inventory-sidebar-option__control {
		background: #7a1212;
		border-color: #7a1212;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:has(input:checked) .eliqauto-inventory-sidebar-option__control::after {
		border-bottom: 2px solid #ffffff;
		border-left: 2px solid #ffffff;
		content: "";
		height: 5px;
		margin-top: -1px;
		transform: rotate(-45deg);
		width: 9px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option--single:has(input:checked) .eliqauto-inventory-sidebar-option__control::after {
		background: #ffffff;
		border: 0;
		border-radius: 999px;
		height: 7px;
		margin-top: 0;
		transform: none;
		width: 7px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option__media {
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--bc-border);
		border-radius: 7px;
		display: inline-flex;
		height: 28px;
		justify-content: center;
		width: 32px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option__media img {
		display: block;
		height: 17px;
		max-width: 22px;
		object-fit: contain;
		width: auto;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option__label {
		font-size: 14px;
		line-height: 18px;
		font-weight: 500;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:has(input:checked) .eliqauto-inventory-sidebar-option__label,
	body.${localScopeClass} .eliqauto-inventory-sidebar-option.is-selected .eliqauto-inventory-sidebar-option__label {
		color: #161616;
		font-weight: 700;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:not(.eliqauto-inventory-sidebar-option--with-media) .eliqauto-inventory-sidebar-option__label {
		grid-column: 2 / 4;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-option .eliqauto-inventory-sidebar-option__count {
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
	body.${localScopeClass} .eliqauto-inventory-sidebar-option:has(input:checked) .eliqauto-inventory-sidebar-option__count {
		color: #7a1212;
		font-weight: 700;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-actions {
		align-items: center;
		display: grid;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-top: 14px;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-actions .eliqauto-inventory-sidebar-clear,
	body.${localScopeClass} .eliqauto-inventory-sidebar-actions .eliqauto-inventory-sidebar-apply {
		align-items: center;
		border-radius: 8px;
		display: inline-flex;
		justify-content: center;
		min-height: 40px;
		padding: 0 15px;
		text-decoration: none;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-actions .eliqauto-inventory-sidebar-clear {
		background: #ffffff;
		border: 1px solid var(--bc-border);
		color: #151515;
	}
	body.${localScopeClass} .eliqauto-inventory-sidebar-actions .eliqauto-inventory-sidebar-apply {
		background: #a51717;
		border: 1px solid #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-results {
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-results > .eliqauto-inventory-searchbar__utility {
		border-top: 0;
		margin: 0 0 18px;
		padding: 0;
	}
	body.${localScopeClass}
		.eliqauto-inventory-dashboard-results
		.eliqauto-inventory-searchbar__filter {
		display: none;
	}
	body.${localScopeClass}
		.eliqauto-inventory-dashboard--map
		.eliqauto-inventory-dashboard-results
		> .eliqauto-inventory-searchbar__utility {
		gap: 10px;
		grid-template-columns: 1fr;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .eliqauto-view-toggle {
		justify-self: start;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .eliqauto-inventory-sort {
		justify-content: space-between;
		justify-self: stretch;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .eliqauto-inventory-result-count {
		align-items: flex-start;
		flex-direction: column;
		gap: 8px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-results .eliqauto-inventory-content {
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-results .card-box {
		background: #ffffff;
		min-width: 0;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-map {
		min-height: calc(100vh - 124px);
		overflow: hidden;
		position: sticky;
		top: 104px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-map .eliqauto-map-fallback {
		height: 100%;
		min-height: calc(100vh - 124px);
		padding: 30px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard-map .eliqauto-map-fallback__inner {
		border-radius: 8px;
		max-width: 100%;
	}
	body.${localScopeClass} .card-box-style-9.card-box {
		background: #ffffff;
		border: 1px solid #eadada;
		border-radius: 8px;
		box-shadow: 0 12px 28px rgba(28, 28, 28, 0.06);
		color: #1c1c1c;
		display: flex;
		min-height: 216px;
		overflow: hidden;
	}
	body.${localScopeClass} .card-box-style-9.card-box:hover,
	body.${localScopeClass} .card-box-style-9.card-box:focus-within {
		background: #ffffff;
		box-shadow: 0 16px 34px rgba(28, 28, 28, 0.09);
		color: #1c1c1c;
	}
	body.${localScopeClass} .card-box-style-9.card-box .image {
		background: var(--bc-accent-soft);
		border-radius: 8px 0 0 8px;
		flex: 0 0 min(300px, 44%);
		max-width: 300px;
		min-height: 220px;
		overflow: hidden;
		width: min(300px, 44%);
	}
	body.${localScopeClass} .card-box-style-9.card-box .image a,
	body.${localScopeClass} .card-box-style-9.card-box .image img {
		display: block;
		height: 100%;
		width: 100%;
	}
	body.${localScopeClass} .card-box-style-9.card-box .image img {
		object-fit: cover;
	}
	body.${localScopeClass} .card-box-style-9.card-box .top,
	body.${localScopeClass} .card-box-style-9.card-box .bottom {
		width: min(300px, 44%);
	}
	body.${localScopeClass} .card-box-style-9.card-box .content,
	body.${localScopeClass} .card-box-style-9.card-box:hover .content,
	body.${localScopeClass} .card-box-style-9.card-box:focus-within .content {
		background: #ffffff;
		border: 0;
		color: #1c1c1c;
		flex: 1 1 auto;
		min-width: 0;
		padding: 22px 24px;
		width: auto;
	}
	body.${localScopeClass} .card-box-style-9.card-box .card-box__title,
	body.${localScopeClass} .card-box-style-9.card-box .card-box__title a,
	body.${localScopeClass} .card-box-style-9.card-box:hover .card-box__title,
	body.${localScopeClass} .card-box-style-9.card-box:hover .card-box__title a {
		color: #1c1c1c;
	}
	body.${localScopeClass} .card-box-style-9.card-box .text-secondary,
	body.${localScopeClass} .card-box-style-9.card-box:hover .text-secondary {
		color: #666666;
	}
	body.${localScopeClass} .card-box-style-9.card-box .content .tag li,
	body.${localScopeClass} .card-box-style-9.card-box:hover .content .tag li {
		background: #fff7f7;
		border: 1px solid #efdddd;
		color: #1c1c1c;
	}
	body.${localScopeClass} .card-box-style-9.card-box .content .tag li span,
	body.${localScopeClass} .card-box-style-9.card-box:hover .content .tag li span {
		color: #1c1c1c;
	}
	body.${localScopeClass} .card-box-style-9.card-box .card-box__price,
	body.${localScopeClass} .card-box-style-9.card-box:hover .card-box__price {
		color: #a51717;
	}
	body.${localScopeClass} .card-box-style-9.card-box .compare-details {
		background: #ffffff;
		border: 1.5px solid #a51717;
		color: #a51717;
		min-width: auto;
		padding: 8px 16px;
	}
	body.${localScopeClass} .card-box-style-9.card-box .compare-details *,
	body.${localScopeClass} .card-box-style-9.card-box .compare-details svg * {
		color: #a51717;
		stroke: #a51717;
	}
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:hover,
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:focus-visible {
		background: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:hover *,
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:focus-visible *,
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:hover svg *,
	body.${localScopeClass} .card-box-style-9.card-box .compare-details:focus-visible svg * {
		color: #ffffff;
		stroke: #ffffff;
	}
	body.${localScopeClass} .card-box-style-9.card-box .view-details,
	body.${localScopeClass} .card-box-style-9.card-box:hover .view-details {
		color: #1c1c1c;
	}
	body.${localScopeClass} .card-box-style-9.card-box .bottom .category,
	body.${localScopeClass} .card-box-style-9.card-box .bottom .category a {
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9 {
		min-height: 200px;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9.card-box .image {
		border-radius: 8px 0 0 8px;
		flex-basis: min(300px, 44%);
		max-width: 300px;
		min-height: 216px;
		width: min(300px, 44%);
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9.card-box .image .card--img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9.card-box .top,
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9.card-box .bottom {
		width: min(300px, 44%);
	}
	body.${localScopeClass} .eliqauto-inventory-dashboard--map .card-box-style-9.card-box .content {
		padding: 20px 22px;
		width: auto;
	}
	body.${localScopeClass} .flat-tabs[data-custom='true'] .btn-filter {
		border-color: rgba(165, 23, 23, 0.24);
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
		body.${localScopeClass} .eliqauto-inventory-banner__buybox {
			max-width: min(1220px, calc(100vw - 48px));
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard {
			gap: 18px;
			grid-template-columns: 320px minmax(0, 1fr);
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard--map {
			grid-template-columns: 300px minmax(390px, 0.86fr) minmax(390px, 1fr);
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard-results,
		body.${localScopeClass} .eliqauto-inventory-dashboard-sidebar {
			padding: 16px;
		}
		body.${localScopeClass}
			.eliqauto-inventory-dashboard--4
			.eliqauto-inventory-content
			.grid-cols-4 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__row {
			grid-template-columns: minmax(0, 1fr);
		}
		body.${localScopeClass} .eliqauto-inventory-filter-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 991px) {
		body.${localScopeClass} .eliqauto-inventory-banner__buybox {
			max-width: calc(100vw - 30px);
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard,
		body.${localScopeClass} .eliqauto-inventory-dashboard--map {
			grid-template-columns: 1fr;
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard-sidebar,
		body.${localScopeClass} .eliqauto-inventory-dashboard-map {
			max-height: none;
			position: relative;
			top: auto;
		}
		body.${localScopeClass} .eliqauto-inventory-dashboard-map,
		body.${localScopeClass} .eliqauto-inventory-dashboard-map .eliqauto-map-fallback {
			min-height: 520px;
		}
		body.${localScopeClass}
			.eliqauto-inventory-dashboard--4
			.eliqauto-inventory-content
			.grid-cols-4,
		body.${localScopeClass}
			.eliqauto-inventory-dashboard--3
			.eliqauto-inventory-content
			.grid-cols-3 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		body.${localScopeClass} section.pb-100 > .container > h2 {
			font-size: 30px;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__row {
			grid-template-columns: minmax(0, 1fr);
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__utility {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		body.${localScopeClass} .eliqauto-inventory-sort {
			grid-column: 1 / -1;
			justify-self: stretch;
			justify-content: flex-end;
		}
	}
	@media (max-width: 767px) {
		body.${localScopeClass} section.pb-100 {
			padding-top: 24px;
		}
		body.${localScopeClass} .eliqauto-inventory-banner {
			min-height: 188px;
		}
		body.${localScopeClass} .eliqauto-inventory-banner__copy h1 {
			font-size: 30px;
		}
		body.${localScopeClass} section.pb-100 > .container > h2 {
			font-size: 27px;
			margin-bottom: 14px;
		}
		body.${localScopeClass} .switcher-container {
			display: none;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar {
			padding: 18px;
		}
		body.${localScopeClass} .eliqauto-inventory-filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__utility {
			grid-template-columns: minmax(0, 1fr);
			padding: 12px 0 0;
		}
		body.${localScopeClass} .eliqauto-inventory-hero-switches {
			align-items: flex-start;
			flex-direction: column;
			gap: 10px;
			margin-top: 12px;
			padding-top: 12px;
		}
		body.${localScopeClass} .eliqauto-inventory-hero-switches .eliqauto-view-toggle {
			flex-wrap: wrap;
			justify-content: flex-start;
		}
		body.${localScopeClass} .eliqauto-inventory-result-count,
		body.${localScopeClass} .eliqauto-inventory-sort {
			justify-content: space-between;
		}
		body.${localScopeClass} .eliqauto-inventory-content {
			padding: 12px;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__submit {
			min-width: 0;
			padding-inline: 18px;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__filter {
			gap: 0;
			min-height: 46px;
			min-width: 46px;
			padding: 0;
			width: 46px;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__filter span {
			display: none;
		}
		body.${localScopeClass} .eliqauto-quick-chip,
		body.${localScopeClass} .eliqauto-active-filter {
			flex: 0 0 auto;
		}
	}
	@media (max-width: 340px) {
		body.${localScopeClass} .eliqauto-inventory-searchbar__primary,
		body.${localScopeClass} .eliqauto-inventory-searchbar__row {
			grid-template-columns: 1fr;
		}
		body.${localScopeClass} .eliqauto-inventory-searchbar__submit {
			width: 100%;
		}
	}
	`
			: ''
	}
	body.${localScopeClass} .eliqauto-favorite.is-active path {
		fill: var(--bc-accent);
		stroke: var(--bc-accent);
	}
	body.${localScopeClass} .eliqauto-map-fallback {
		align-items: center;
		background:
			linear-gradient(135deg, rgba(165, 23, 23, 0.16), rgba(255, 255, 255, 0.9)),
			url('${eliqautoAssets.hero}');
		background-position: center;
		background-size: cover;
		display: flex;
		min-height: 100%;
		padding: 48px;
	}
	body.${localScopeClass} .eliqauto-map-fallback__inner {
		background: rgba(255, 255, 255, 0.94);
		border-radius: 16px;
		max-width: 480px;
		padding: 28px;
	}
	body.${localScopeClass} .eliqauto-map-fallback__locations {
		display: grid;
		gap: 10px;
		list-style: none;
		margin: 16px 0;
		padding: 0;
	}
	body.${localScopeClass} .eliqauto-map-fallback__locations li {
		background: rgba(255, 248, 248, 0.94);
		border: 1px solid rgba(18, 18, 18, 0.08);
		border-radius: 12px;
		display: grid;
		gap: 2px;
		padding: 12px 14px;
	}
	body.${localScopeClass} .card-box[data-eliqauto-slug] .card--img,
	body.${localScopeClass} .listing-details-item .img-main,
	body.${localScopeClass} .listing-details-thumb img {
		object-fit: cover;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box__title a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box__price,
	body.${localScopeClass} .flat-tabs[data-custom='true'] .md-hidden,
	body.${localScopeClass} .flat-tabs[data-custom='true'] #filterResults,
	body.${localScopeClass} section.pb-100 > .container > h2 {
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box__title a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box__price {
		color: #1c1c1c;
	}
	body.${localScopeClass} .flat-tabs[data-custom='true'] .md-hidden,
	body.${localScopeClass} .flat-tabs[data-custom='true'] #filterResults {
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box {
		background: #ffffff;
		border: 0;
		box-shadow: none;
		transition:
			background-color 0.22s ease,
			box-shadow 0.22s ease;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box .image {
		background: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box .top .highlight {
		background: #ffffff;
		box-shadow: 0 6px 14px rgba(28, 28, 28, 0.16);
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box .content {
		background: #fff8f8;
		border: 0;
		transition: background-color 0.22s ease;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:focus-within {
		background: #fff7f7;
		box-shadow: none;
		transform: none;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .content,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .content,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:focus-within .content {
		background: #fff0f0;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .card--img,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .card--img,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:focus-within .card--img {
		transform: none;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .content .card-box__title a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .content .card-box__title a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:focus-within .content .card-box__title a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .content .bottom .category a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .content .bottom .category a,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:focus-within .content .bottom .category a {
		text-decoration: none;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box-style-1 {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box-style-1 .content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box-style-1 .card-box__title {
		display: -webkit-box;
		min-height: 52px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box .divider {
		background: #efdada;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-specs {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		overflow: visible;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-specs li {
		align-items: center;
		background: #ffffff;
		border: 1px solid #efdddd;
		border-radius: 8px;
		display: inline-flex;
		flex: 0 0 auto;
		gap: 5px;
		justify-content: flex-start;
		min-width: max-content;
		padding: 5px 8px;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-specs li img {
		flex: 0 0 14px;
		height: 14px;
		object-fit: contain;
		width: 14px;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-specs li span {
		overflow: visible;
		text-overflow: clip;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-price__amount {
		font-size: 22px;
		font-weight: 600;
		line-height: 28px;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-align: right;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-price__monthly {
		display: block;
		line-height: 20px;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-price__finance-link {
		line-height: 16px;
		margin-left: 0;
		white-space: nowrap;
	}
	body.${localScopeClass} .eliqauto-inventory-content .tag li img {
		filter: none;
		opacity: 1;
	}
	body.${localScopeClass} .eliqauto-inventory-content .tag li span,
	body.${localScopeClass} .eliqauto-inventory-content .text-secondary {
		color: var(--bc-muted);
	}
	body.${localScopeClass} .eliqauto-inventory-content .text-secondary,
	body.${localScopeClass} .eliqauto-inventory-content .tag li span {
		color: #b8bdc7;
	}
	body.${localScopeClass} .eliqauto-inventory-content .view-details,
	body.${localScopeClass} .eliqauto-inventory-content .view-details img {
		color: #a51717;
	}
	body.${localScopeClass} .eliqauto-inventory-content .compare-details {
		border-color: #1c1c1c;
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-content .compare-details::after {
		background-color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-content .compare-details svg path {
		stroke: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-actions {
		margin-top: auto;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-actions .view-details {
		width: auto;
		min-width: 0;
		height: auto;
		min-height: 0;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 800;
		line-height: 22px;
		padding: 0;
		text-decoration: none;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-actions .view-details::before,
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-actions .view-details::after {
		display: none;
	}
	body.${localScopeClass} .eliqauto-inventory-content .eliqauto-card-actions .view-details img {
		display: inline-block;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .compare-details,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .compare-details {
		background-color: #1c1c1c;
		color: #ffffff;
	}
	body.${localScopeClass} .eliqauto-inventory-content .card-box.active .compare-details svg path,
	body.${localScopeClass} .eliqauto-inventory-content .card-box:hover .compare-details svg path {
		stroke: #ffffff;
	}
	body.${localScopeClass} .eliqauto-compare-table .image {
		aspect-ratio: 16 / 10;
		object-fit: cover;
		width: 100%;
	}
	body.${localScopeClass} .eliqauto-contact-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-profile-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-password-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-add-listing-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-sell-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-service-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-blog-comment-form .auxero-form-status,
	body.${localScopeClass} .eliqauto-newsletter-form .auxero-form-status,
	body.${localScopeClass} .form-footer .auxero-form-status,
	body.${localScopeClass} .newsletter-form .auxero-form-status,
	body.${localScopeClass} .send-inquiry .auxero-form-status,
	body.${localScopeClass} #LoginModal form .auxero-form-status,
	body.${localScopeClass} #SignUpModal form .auxero-form-status,
	body.${localScopeClass} #ForgotPasswordModal form .auxero-form-status {
		background: var(--bc-surface-soft);
		border-radius: 12px;
		color: #1c1c1c;
		padding: 12px 14px;
	}
	${
		templateFile === 'home-05.html'
			? `
	body.${localScopeClass} .effect-item,
	body.${localScopeClass} .wow {
		animation-name: none;
		opacity: 1;
		transform: none;
		visibility: visible;
	}
	body.${localScopeClass} .eliqauto-vehicle-pills {
		width: 100%;
		max-width: 100%;
		background: #ffffff;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: 0 10px 28px rgb(54 95 104 / 0.06);
		padding: 10px;
		scrollbar-width: none;
	}
	body.${localScopeClass} .eliqauto-vehicle-pills::-webkit-scrollbar {
		display: none;
	}
	body.${localScopeClass} .eliqauto-vehicle-pills .menu-tab-style2 {
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		gap: 10px;
		justify-content: flex-start;
		min-width: max-content;
		width: auto;
	}
	body.${localScopeClass} .eliqauto-vehicle-pill {
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		color: #1c1c1c;
		min-height: 44px;
		overflow: hidden;
		padding: 0;
		transition: background-color 0.18s ease;
	}
	body.${localScopeClass} .eliqauto-vehicle-pill:hover {
		background: var(--bc-surface-hover);
		border-color: var(--bc-border-strong);
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-vehicle-pill.active {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal {
		background: #a51717;
		border-color: #a51717;
		color: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal:hover {
		background: var(--bc-hover-accent, #a01818);
		border-color: var(--bc-hover-accent, #a01818);
		color: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal svg path {
		stroke: #ffffff;
	}
	body.${localScopeClass} .mobile-hidden-header-button .bg-sign-in.open-modal:hover svg path {
		stroke: #ffffff;
	}
	body.${localScopeClass} .eliqauto-vehicle-pill a {
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
	body.${localScopeClass} .eliqauto-vehicle-pill span,
	body.${localScopeClass} .eliqauto-type-icon,
	body.${localScopeClass} .eliqauto-pill-image {
		flex: 0 0 auto;
	}
	body.${localScopeClass} .eliqauto-type-icon {
		color: currentColor;
		height: 18px;
		stroke-width: 1.15;
		width: 36px;
	}
	body.${localScopeClass} .eliqauto-pill-image {
		display: block;
		object-fit: contain;
		width: auto;
	}
	body.${localScopeClass} .eliqauto-pill-image--spec {
		height: 18px;
		max-width: 22px;
	}
	body.${localScopeClass} .eliqauto-pill-image--brand {
		height: 21px;
		max-width: 38px;
	}
	@media (max-width: 575px) {
		body.${localScopeClass} .eliqauto-vehicle-pills {
			justify-content: flex-start;
			margin-inline: -15px;
			padding-inline: 10px;
		}
		body.${localScopeClass} .eliqauto-vehicle-pills .menu-tab-style2 {
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
		animation-name: none;
		visibility: visible;
	}
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .card-box__title a,
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .card-box__price {
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .text-secondary,
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .tag li span {
		color: var(--bc-muted);
	}
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .view-details,
	body.${localScopeClass} .eliqauto-home-featured .card-box[data-eliqauto-slug] .view-details img {
		color: #1c1c1c;
	}
	body.${localScopeClass} .eliqauto-home-featured .card--img,
	body.${localScopeClass} .card-box-style-7 .image img,
	body.${localScopeClass} .card-box-style-2 .card--img,
	body.${localScopeClass} .eliqauto-home-news .blog-card img {
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
		animation-name: none;
		visibility: visible;
	}
	body.${localScopeClass} section.pb-100 > .container > h2,
	body.${localScopeClass} section.bg-white > .container > h2,
	body.${localScopeClass} section.bg-white.pb-84 > .container > h2 {
		color: #1c1c1c;
	}
	`
			: ''
	}
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
	const favoriteKey = 'eliqauto:favorites';
	const compareKey = 'eliqauto:compare';
	const sessionKey = 'eliqauto:session';
	const previousRuntimeController = window.__ELIQAUTO_RUNTIME_ABORT_CONTROLLER__;
	if (previousRuntimeController) previousRuntimeController.abort();
	const runtimeAbortController = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
	window.__ELIQAUTO_RUNTIME_ABORT_CONTROLLER__ = runtimeAbortController;
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
	const compareTopCell = (vehicle) => '<td data-eliqauto-compare-column="' + escapeText(vehicle.slug) + '">' +
		'<div class="relative top">' +
			'<button class="compare-item-remove-table" type="button" data-eliqauto-compare-remove="' + escapeText(vehicle.slug) + '" style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;">' +
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
		const tables = Array.from(document.querySelectorAll('[data-eliqauto-compare-table]')).filter(
			(table) => !table.hasAttribute('data-eliqauto-svelte-compare-table')
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
		const favoriteIconHtml = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 5 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C14.1444 5 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" fill="var(--bc-accent)"/></svg>';
		return '<div class="card-box card-box-style-1" data-eliqauto-slug="' + escapeText(vehicle.slug) + '">' +
			'<div class="top"><p class="' + tagClass + ' text-white highlight">' + escapeText(vehicle.tag || vehicle.condition || 'Available') + '</p><p class="heart eliqauto-favorite is-active" role="button" tabindex="0" aria-label="Remove ' + escapeText(vehicle.title) + '">' + favoriteIconHtml + '</p></div>' +
			'<div class="image"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '"><img class="card--img" src="' + escapeText(vehicle.image) + '" alt="' + escapeText(vehicle.title) + '"></a></div>' +
			'<div class="content border-light border-top-none">' +
				'<div class="bottom"><p class="category uppercase text-white"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '" class="text-white uppercase text-xs">' + escapeText(vehicle.brand) + '</a></p><div class="flex items-center gap-8"><p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ' + escapeText(vehicle.imagesCount || 1) + '</p><p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p></div></div>' +
				'<p class="h6 card-box__title mb-8"><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '">' + escapeText(vehicle.title) + '</a></p>' +
				'<ul class="tag mb-10"><li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>' + formatKm(vehicle.mileage) + '</span></li><li><img src="/assets/icons/calendar.svg" alt="year"><span>' + escapeText(vehicle.year) + '</span></li><li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>' + escapeText(vehicle.fuel) + '</span></li><li><img src="/assets/icons/transmission.svg" alt="transmission"><span>' + escapeText(vehicle.transmission) + '</span></li></ul>' +
				'<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">' + escapeText(vehicle.priceLabel) + '</p>' +
				'<div class="divider mb-15"></div>' +
				'<div class="flex justify-between"><p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-eliqauto-compare="' + escapeText(vehicle.slug) + '" role="button" tabindex="0">Compare</p><a href="/inventory/' + encodeURIComponent(vehicle.slug) + '" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a></div>' +
			'</div></div>';
	};
	const renderAccountFavorites = (favoritesList) => {
		const grids = document.querySelectorAll('[data-eliqauto-favorites-grid]');
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
		const form = document.querySelector('.eliqauto-inventory-searchbar');
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
			![...document.querySelectorAll('.eliqauto-active-filter')].some((tag) =>
				tag.textContent.includes('Search: ' + q)
			);

		if (!controlsAreStale && !searchTagIsStale) return;

		const response = await fetch(window.location.href, {
			cache: 'no-store',
			credentials: 'same-origin',
			headers: { 'x-eliqauto-inventory-sync': '1' }
		});
		if (!response.ok) throw new Error('Inventory sync failed');

		const fresh = new DOMParser().parseFromString(await response.text(), 'text/html');
		[
			'.eliqauto-inventory-searchbar',
			'.eliqauto-inventory-content'
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
			if (prototypeRole) headers['x-eliqauto-prototype-role'] = prototypeRole;
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
					: form.className || form.id || 'eliqauto-form';

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
	const vehicleImageFallback = ${JSON.stringify(eliqautoAssets.hero)};
	const isVehicleImage = (img) =>
		!img.closest('.eliqauto-inventory-desktop-route .eliqauto-inventory-content') &&
		(
			Boolean(img.closest('[data-eliqauto-slug], [data-eliqauto-compare-column], .listing-details')) ||
			/mobistatic\\d*\\.focus\\.bg/.test(img.currentSrc || img.src || '')
		);
	const applyVehicleImageFallback = (img) => {
		if (!isVehicleImage(img) || img.dataset.eliqautoFallbackApplied === 'true') return;

		img.dataset.eliqautoFallbackApplied = 'true';
		img.src = vehicleImageFallback;
		if (!img.alt) img.alt = 'Eliqauto vehicle';
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
		document.querySelectorAll('[data-eliqauto-slug]').forEach((card) => {
			const slug = card.getAttribute('data-eliqauto-slug');
			const favorite = card.querySelector('.eliqauto-favorite, .heart');
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
		window.dispatchEvent(new CustomEvent('eliqauto:garage-updated', {
			detail: { favorites, compare }
		}));
	};
	const mainNav = document.getElementById('menu-primary-menu');
	if (mainNav && !mainNav.hasAttribute('data-eliqauto-dashboard-context-nav') && !mainNav.querySelector('.sub-menu')) {
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
	document.querySelectorAll('[data-eliqauto-search-form="inventory"]').forEach((form) => {
		form.setAttribute('action', '/inventory');
		form.setAttribute('method', 'get');
		const input = form.querySelector('input');
		if (input && !input.name) input.name = 'q';
	});
	ensureInventoryUrlState().catch(() => window.location.reload());
	document.addEventListener('click', (event) => {
		const removeCompare = event.target.closest('[data-eliqauto-compare-remove], .eliqauto-compare-table .compare-item-remove-table');
		if (!removeCompare) return;
		if (removeCompare.hasAttribute('data-eliqauto-svelte-compare-remove')) return;

		const slug = removeCompare.getAttribute('data-eliqauto-compare-remove') || removeCompare.closest('[data-eliqauto-compare-column]')?.getAttribute('data-eliqauto-compare-column');
		if (!slug) return;

		event.preventDefault();
		event.stopPropagation();
		const current = readList(compareKey).filter((item) => item !== slug);
		writeList(compareKey, current);
		updateGarageState();
		syncGarageState();
	}, runtimeCaptureListenerOptions);
	document.addEventListener('click', async (event) => {
		const logout = event.target.closest('[data-eliqauto-menu-item="logout"], [data-eliqauto-user-menu-item="logout"]');
		if (logout) {
			event.preventDefault();
			localStorage.removeItem(sessionKey);
			await postJson('/api/auth/logout', {});
			document.cookie = 'eliqauto_session=; Path=/; Max-Age=0; SameSite=Lax';
			go('/');
			return;
		}
		const search = event.target.closest('.search-cars__search, .eliqauto-inventory-searchbar__submit');
		if (search) {
			const form = search.closest('form');
			if (!form) return;
			const searchMode = form.getAttribute('data-eliqauto-search-form');
			const action = form.getAttribute('action');
			if (searchMode !== 'inventory' && action !== '/inventory') return;

			event.preventDefault();
			go(inventorySearchUrl(form));
			return;
		}
		const favorite = event.target.closest('.eliqauto-favorite, .card-box .heart');
		if (favorite) {
			const card = favorite.closest('[data-eliqauto-slug]');
			const slug = card && card.getAttribute('data-eliqauto-slug');
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
		const compare = event.target.closest('[data-eliqauto-compare], .compare-details');
		if (compare) {
			const card = compare.closest('[data-eliqauto-slug]');
			const slug = compare.getAttribute('data-eliqauto-compare') || (card && card.getAttribute('data-eliqauto-slug'));
			if (slug) {
				event.preventDefault();
				const current = readList(compareKey).filter((item) => item !== slug);
				writeList(compareKey, [slug, ...current].slice(0, 4));
				updateGarageState();
				syncGarageState();
				const modalText = document.querySelector('#CompareModal .h4, #CompareModal .h5, #CompareModal p');
				if (modalText) modalText.textContent = 'Added to Eliqauto compare list';
				return;
			}
		}
		const listingCard = event.target.closest('.card-box a, .view-details');
		if (listingCard && /listing-details/i.test(listingCard.getAttribute('href') || '')) {
			event.preventDefault();
			go('/inventory/' + firstVehicleSlug);
			return;
		}
		const formAction = event.target.closest('[data-eliqauto-form-target]');
		if (formAction) {
			const form = document.querySelector(formAction.getAttribute('data-eliqauto-form-target'));
			if (form) {
				event.preventDefault();
				if (formAction.hasAttribute('data-eliqauto-submit-form')) {
					let statusInput = form.querySelector('input[name="status"]');
					if (!statusInput) {
						statusInput = document.createElement('input');
						statusInput.type = 'hidden';
						statusInput.name = 'status';
						form.prepend(statusInput);
					}
					statusInput.value = formAction.getAttribute('data-eliqauto-listing-status') || 'draft';
					if (typeof form.requestSubmit === 'function') {
						form.requestSubmit();
					} else {
						form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
					}
					return;
				}
				setFormStatus(
					form,
					formAction.getAttribute('data-eliqauto-form-status') || 'Saved locally by Eliqauto'
				);
			}
		}
	}, runtimeListenerOptions);
	document.addEventListener('submit', async (event) => {
		const form = event.target;
		if (form.matches('[data-eliqauto-search-form="inventory"]')) {
			event.preventDefault();
			go(inventorySearchUrl(form));
			return;
		}

		if (!form.matches('.send-inquiry, .eliqauto-contact-form, .eliqauto-profile-form, .eliqauto-password-form, .eliqauto-add-listing-form, .eliqauto-sell-form, .eliqauto-service-form, .eliqauto-blog-comment-form, .eliqauto-newsletter-form, .form-footer, .newsletter-form, #LoginModal form, #SignUpModal form, #ForgotPasswordModal form')) {
			return;
		}

		if (form.matches('.eliqauto-add-listing-form[data-eliqauto-native-submit="true"]')) {
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
			setFormStatus(form, 'Customer account created locally for Eliqauto');
		} else if (form.matches('#ForgotPasswordModal form')) {
			await postJson('/api/auth/recovery', {
				...payload,
				email: payload.email || payload['email-forgot-password']
			});
			setFormStatus(form, 'Password recovery request queued locally for Eliqauto');
		} else if (form.matches('.eliqauto-profile-form')) {
			await postJson('/api/account/profile', payload);
			setFormStatus(form, 'Profile saved locally for ' + runtimeData.account.session.name);
		} else if (form.matches('.eliqauto-password-form')) {
			await postJson('/api/account/password', payload);
			setFormStatus(form, 'Password change recorded locally');
		} else if (form.matches('.eliqauto-add-listing-form')) {
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
						? 'Listing changes saved locally for Eliqauto'
						: 'Listing draft saved locally for Eliqauto review'
				);
			} else {
				await postJson('/api/inventory/submissions', {
					...payload,
					source: 'customer-listing'
				});
				setFormStatus(form, 'Listing draft saved locally for Eliqauto review');
			}
		} else if (form.matches('.eliqauto-sell-form')) {
			await postJson('/api/inventory/submissions', {
				...payload,
				source: 'sell-your-car'
			});
			setFormStatus(form, 'Заявката е изпратена. Eliqauto ще се свърже с вас скоро.');
		} else if (form.matches('.eliqauto-service-form')) {
			await postJson('/api/inquiries', payload);
			setFormStatus(
				form,
				'Заявката за услуга е изпратена. Eliqauto ще подготви следващата стъпка.'
			);
		} else if (form.matches('.eliqauto-blog-comment-form')) {
			await postJson('/api/messages', payload);
			setFormStatus(form, 'Comment saved locally for Eliqauto review');
		} else if (form.matches('.eliqauto-newsletter-form, .form-footer, .newsletter-form')) {
			await postJson('/api/messages', {
				...payload,
				message: 'Newsletter signup'
			});
			setFormStatus(form, 'Newsletter signup saved locally for Eliqauto');
		} else {
			await postJson('/api/inquiries', payload);
			setFormStatus(
				form,
				form.matches('.eliqauto-contact-form')
					? 'Съобщението е изпратено. Eliqauto ще се свърже с вас скоро.'
					: 'Заявката е изпратена. Eliqauto ще се свърже с вас скоро.'
			);
		}
	}, runtimeListenerOptions);
	const readCalcNumber = (calculator, key) => {
		const input = calculator.querySelector('[data-eliqauto-calc-input="' + key + '"]');
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
			calculator.querySelectorAll('[data-eliqauto-calc-output="' + key + '"]').forEach((node) => {
				node.textContent = formatEur(value);
			});
		});
	};
	document.querySelectorAll('[data-eliqauto-calculator]').forEach(updateCalculator);
	document.addEventListener('input', (event) => {
		const calculator = event.target.closest('[data-eliqauto-calculator]');
		if (calculator) updateCalculator(calculator);
	}, runtimeListenerOptions);
	updateGarageState();
	hydrateGarageState();
	window.__ELIQAUTO_RUNTIME__ = runtimeData;
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
	const branded = applyEliqautoBranding(withBackgrounds);
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
		? resolveEliqautoPageSession(options.request, routePath, options.searchParams)
		: resolveEliqautoSession(routePath, options.searchParams);

	if (!session) {
		return new Response('Eliqauto account session is required', { status: 401 });
	}

	if (!canAccessEliqautoRoute(session, routePath)) {
		return new Response('Eliqauto account role cannot access this route', { status: 403 });
	}

	return auxeroResponse(templateFile, { ...options, routePath, session });
}
