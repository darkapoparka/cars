export type ProductRouteSource = {
	route: string;
	source: string;
	notes: string;
};

export const productRouteSources: ProductRouteSource[] = [
	{ route: '/', source: 'home-05.html', notes: 'Primary Day Night Auto homepage' },
	{ route: '/inventory', source: 'listing-grid4-columns.html', notes: 'Default inventory grid' },
	{
		route: '/inventory?view=3',
		source: 'listing-grid3-columns.html',
		notes: 'Comfortable grid variant'
	},
	{
		route: '/inventory?view=4',
		source: 'listing-grid4-columns.html',
		notes: 'Dense grid variant'
	},
	{
		route: '/inventory?view=5',
		source: 'listing-grid4-columns.html',
		notes: 'Compact grid density variant'
	},
	{
		route: '/inventory?view=map',
		source: 'listing-gridstyle-halfmap.html',
		notes: 'Map/list variant'
	},
	{ route: '/inventory/[slug]', source: 'listing-details-3.html', notes: 'Vehicle detail page' },
	{ route: '/compare', source: 'compare.html', notes: 'Buyer comparison' },
	{ route: '/agents', source: 'sale-agents.html', notes: 'Consultant list' },
	{ route: '/agents/[slug]', source: 'sale-agents-details.html', notes: 'Consultant profile' },
	{ route: '/admin/agents', source: 'sale-agents.html', notes: 'Admin agent management grid' },
	{ route: '/sell-your-car', source: 'sell-your-car.html', notes: 'Sell-car intake' },
	{ route: '/import', source: 'services-center.html', notes: 'Import link intake' },
	{ route: '/services', source: 'services-center.html', notes: 'Services overview' },
	{ route: '/contact', source: 'contact-us.html', notes: 'Contact page' },
	{ route: '/account/*', source: 'dashboard.html', notes: 'Account dashboard family' },
	{ route: '/admin/*', source: 'dashboard.html', notes: 'Admin dashboard family' }
];

export function sourceForProductRoute(route: string) {
	const exact = productRouteSources.find((item) => item.route === route);
	if (exact) return exact.source;

	const pathname = route.split('?')[0];

	if (/^\/inventory\/[^/]+$/.test(pathname)) return 'listing-details-3.html';
	if (/^\/agents\/[^/]+$/.test(pathname)) return 'sale-agents-details.html';
	if (pathname === '/account' || pathname.startsWith('/account/')) return 'dashboard.html';
	if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'dashboard.html';

	return productRouteSources.find((item) => item.route === pathname)?.source;
}
