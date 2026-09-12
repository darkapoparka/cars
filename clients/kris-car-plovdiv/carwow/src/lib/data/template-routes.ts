const prettyRouteToFile: Record<string, string> = {
	about: 'about-us.html',
	'about/kris-car-plovdiv': 'dealer-details.html',
	contact: 'contact-us.html',
	financing: 'financing.html',
	'sell-car': 'sell-your-car.html',
	'sell-car/request': 'sell-your-car.html',
	'sell-your-car': 'sell-your-car.html',
	'sell-your-car/request': 'sell-your-car.html',
	services: 'services-center.html',
	reviews: 'clients-reviews.html',
	team: 'sale-agents.html',
	'team/prodazhbi-daynight-auto': 'sale-agents-details.html',
	calculator: 'calculator.html',
	compare: 'compare.html',
	faq: 'faqs.html',
	blog: 'blog-standard.html',
	'blog/kak-da-kupim-upotrebyavan-avtomobil': 'blog-details-2.html',
	terms: 'terms.html',
	'404': '404.html'
};

export const primaryTemplatePageToFile = {
	inventory: 'listing-grid4-columns.html',
	detail: 'listing-details-3.html'
} as const;

export type PrimaryTemplatePage = keyof typeof primaryTemplatePageToFile;

export const routeTemplateFiles = new Set([
	...Object.values(prettyRouteToFile),
	primaryTemplatePageToFile.inventory,
	primaryTemplatePageToFile.detail,
	'listing-gridstyle-halfmap.html'
]);

// Keep add-listings-2 renderable while legacy content tests still cover the
// sell-your-car/request template adaptation. It is not a routed public page.
export const renderableTemplateFiles = new Set([...routeTemplateFiles, 'add-listings-2.html']);

export const dashboardTemplateFiles = new Set(['add-listings-2.html']);

const templateBodyClassesByFile: Record<string, string[]> = {
	'listing-grid4-columns.html': ['inner-page'],
	'listing-gridstyle-halfmap.html': ['inner-page', 'halfmap'],
	'listing-details-3.html': ['inner-page'],
	'about-us.html': ['inner-page'],
	'dealer-details.html': ['inner-page'],
	'contact-us.html': ['inner-page'],
	'financing.html': ['inner-page'],
	'sell-your-car.html': ['inner-page'],
	'add-listings-2.html': ['dashboard', 'overflow-hidden'],
	'services-center.html': ['inner-page'],
	'clients-reviews.html': ['inner-page'],
	'sale-agents.html': ['inner-page'],
	'sale-agents-details.html': ['inner-page'],
	'calculator.html': ['inner-page'],
	'compare.html': ['inner-page'],
	'faqs.html': ['inner-page'],
	'blog-standard.html': ['inner-page'],
	'blog-grid-style-1.html': ['inner-page'],
	'blog-details-1.html': ['inner-page'],
	'blog-details-2.html': ['inner-page'],
	'terms.html': ['inner-page'],
	'404.html': ['inner-page']
};

const nativeBodyClasslessRoutePaths = new Set([
	'about',
	'about/kris-car-plovdiv',
	'blog',
	'blog/kak-da-kupim-upotrebyavan-avtomobil',
	'calculator',
	'compare',
	'contact',
	'faq',
	'financing',
	'inventory',
	'inventory/map',
	'reviews',
	'sell-your-car',
	'sell-your-car/request',
	'services',
	'team',
	'team/prodazhbi-daynight-auto',
	'terms'
]);

export function daynightTemplateBodyClass(templateFile: string) {
	return `daynight-template-${templateFile.replace(/[^a-z0-9]/gi, '-')}`;
}

export function getTemplateBodyClasses(templateFile: string) {
	const templateClasses = templateBodyClassesByFile[templateFile] ?? [];
	const sharedHeaderClasses = dashboardTemplateFiles.has(templateFile)
		? []
		: ['daynight-page-home-header'];

	return Array.from(
		new Set([
			...templateClasses,
			...sharedHeaderClasses,
			daynightTemplateBodyClass(templateFile),
			'is_light'
		])
	);
}

export function normalizeTemplateRoutePath(routePath: string) {
	return routePath.replace(/^\/+|\/+$/g, '');
}

export function resolveTemplateFile(routePath: string) {
	const normalizedPath = normalizeTemplateRoutePath(routePath);

	if (!normalizedPath) {
		return undefined;
	}

	if (normalizedPath === 'inventory/map') {
		return 'listing-gridstyle-halfmap.html';
	}

	if (normalizedPath === 'inventory' || normalizedPath.startsWith('inventory/')) {
		return normalizedPath === 'inventory'
			? primaryTemplatePageToFile.inventory
			: primaryTemplatePageToFile.detail;
	}

	if (normalizedPath.startsWith('blog/')) {
		return 'blog-details-2.html';
	}

	if (normalizedPath.startsWith('team/')) {
		return 'sale-agents-details.html';
	}

	return prettyRouteToFile[normalizedPath];
}

export function isTemplateRoutePath(pathname: string) {
	return Boolean(resolveTemplateFile(pathname));
}

// /inventory/[slug] detail pages render their own native chrome (DetailPageShell)
// and ship zero legacy CSS, so — like nativeBodyClasslessRoutePaths — they must be
// body-class-less. This is the dynamic-slug analogue for detail pages. The grid
// ('inventory') and half-map ('inventory/map') are now native too, but they are
// exact paths handled by nativeBodyClasslessRoutePaths above, so this excludes
// 'inventory/map' to leave it to that set.
function isNativeDetailRoutePath(normalizedPath: string) {
	return normalizedPath.startsWith('inventory/') && normalizedPath !== 'inventory/map';
}

export function getTemplateRouteBodyClasses(pathname: string) {
	const normalizedPath = normalizeTemplateRoutePath(pathname);

	if (
		nativeBodyClasslessRoutePaths.has(normalizedPath) ||
		isNativeDetailRoutePath(normalizedPath)
	) {
		return [];
	}

	const templateFile = resolveTemplateFile(pathname);

	return templateFile ? getTemplateBodyClasses(templateFile) : [];
}

export function getHomeRouteBodyClasses(pathname: string) {
	const normalizedPath = normalizeTemplateRoutePath(pathname);

	// '' is the home; 'home1' / 'home1-box' are CEO A/B copies of the home — all
	// use the home's own chrome, so the global (unstyled-on-mobile) template
	// header/footer must stay hidden for them.
	const homeRoutes = new Set(['', 'home1', 'home1-box']);
	return homeRoutes.has(normalizedPath)
		? ['counter-scroll', 'daynight-home-page', 'daynight-page-home-header', 'is_light']
		: [];
}

export function getRouteBodyClasses(pathname: string) {
	return Array.from(
		new Set([...getHomeRouteBodyClasses(pathname), ...getTemplateRouteBodyClasses(pathname)])
	);
}

export function routeManagesOwnChrome(pathname: string) {
	return getHomeRouteBodyClasses(pathname).length > 0 || isTemplateRoutePath(pathname);
}
