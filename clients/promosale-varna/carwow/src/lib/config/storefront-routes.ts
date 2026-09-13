/** Routes with native, route-owned storefront chrome. No HTML-template lookup is involved. */
const homeRoutes = new Set(['', 'home1', 'home1-box']);
const nativeRoutes = new Set([
	'about',
	'about/daynight-auto-plovdiv',
	'blog',
	'calculator',
	'compare',
	'contact',
	'faq',
	'favorites',
	'financing',
	'inventory',
	'reviews',
	'sell-car',
	'sell-car/request',
	'sell-your-car',
	'sell-your-car/request',
	'services',
	'team',
	'terms',
	'404'
]);
const nativeFamilies = ['inventory/', 'blog/', 'team/'];
const homeBodyClasses = [
	'counter-scroll',
	'daynight-home-page',
	'daynight-page-home-header',
	'is_light'
];

export function normalizeRoutePath(pathname: string): string {
	return pathname.replace(/^\/+|\/+$/g, '');
}

export function routeManagesOwnChrome(pathname: string): boolean {
	const path = normalizeRoutePath(pathname);
	return (
		homeRoutes.has(path) ||
		nativeRoutes.has(path) ||
		nativeFamilies.some((prefix) => path.startsWith(prefix))
	);
}

/** The home reset is still a deliberate CSS contract. Other native routes are classless. */
export function getRouteBodyClasses(pathname: string): string[] {
	return homeRoutes.has(normalizeRoutePath(pathname)) ? [...homeBodyClasses] : [];
}
