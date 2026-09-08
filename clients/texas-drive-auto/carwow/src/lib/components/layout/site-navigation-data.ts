export type StaticNavHref =
	| '/'
	| '/about'
	| '/about/daynight-auto-plovdiv'
	| '/blog'
	| '/calculator'
	| '/compare'
	| '/contact'
	| '/faq'
	| '/financing'
	| '/inventory'
	| '/inventory/map'
	| '/reviews'
	| '/sell-your-car'
	| '/sell-your-car/request'
	| '/services'
	| '/team'
	| '/terms';

export type InventoryFilterHref = `/inventory?${string}`;
export type BlogArticleHref = '/blog';
export type PublicNavHref = StaticNavHref | InventoryFilterHref | BlogArticleHref;

export type PublicNavLink = {
	readonly label: string;
	readonly href: PublicNavHref;
	readonly children?: readonly PublicNavLink[];
};

export type MegaMenuColumn = {
	readonly title: string;
	readonly links: readonly PublicNavLink[];
};

export type MegaMenuVehicleTile = {
	readonly label: string;
	readonly slug: string;
	readonly image: string;
	readonly meta: string;
};

export const blogBuyerGuideHref: BlogArticleHref = '/blog';

export const inventoryMegaMenuVehicleTiles = [
	{
		label: 'Chrysler 300C',
		slug: 'chrysler-300c-2018-gaz',
		image: '/assets/images/megamenu/chrysler-300c.webp',
		meta: '17 000 USD · LPG/Gasoline'
	},
	{
		label: 'BMW i7',
		slug: 'bmw-i7-2023-full-maxx',
		image: '/assets/images/megamenu/bmw-i7.webp',
		meta: '81 000 USD · Electric'
	},
	{
		label: 'BMW 520i',
		slug: 'bmw-520i-2006-avtomatik',
		image: '/assets/images/megamenu/bmw-520i.webp',
		meta: '4 500 USD · Gasoline'
	},
	{
		label: 'Mercedes E 350 D',
		slug: 'mercedes-benz-e-350-d-2015-64594',
		image: '/assets/images/megamenu/mercedes-e220d.webp',
		meta: '11 500 USD · Diesel'
	},
	{
		label: 'Audi Q8',
		slug: 'audi-q8-5-0tdi-2020-95331',
		image: '/assets/images/megamenu/audi-q8-side-normalized.webp',
		meta: '43 000 USD · Diesel'
	},
	{
		label: 'BMW X6',
		slug: 'bmw-x6-2017-84431',
		image: '/assets/images/megamenu/bmw-x6-side-normalized.webp',
		meta: '25 500 USD · Gasoline'
	},
	{
		label: 'Mercedes E 220 D',
		slug: 'mercedes-benz-e-220-d-2023-53599',
		image: '/assets/images/megamenu/mercedes-e220d-side-normalized.webp',
		meta: '31 000 USD · Diesel'
	},
	{
		label: 'VW Touran',
		slug: 'vw-touran-1-6d-2017-08568',
		image: '/assets/images/megamenu/vw-touran-side-normalized.webp',
		meta: '9 000 USD · Diesel'
	}
] satisfies readonly MegaMenuVehicleTile[];

export const inventoryMegaMenuLinkColumns = [
	{
		title: 'Availability',
		links: [
			{ label: 'All vehicles', href: '/inventory' },
			{ label: 'Vehicles on a map', href: '/inventory/map' },
			{ label: 'Compare', href: '/compare' },
			{ label: 'Calculator', href: '/calculator' }
		]
	},
	{
		title: 'By type',
		links: [
			{ label: 'Sedan', href: '/inventory?body=Sedan' },
			{ label: 'SUV', href: '/inventory?body=SUV' },
			{ label: 'Coupe', href: '/inventory?body=Coupe' },
			{ label: 'Wagon', href: '/inventory?body=Wagon' }
		]
	},
	{
		title: 'By fuel type',
		links: [
			{ label: 'Diesel', href: '/inventory?fuel=Diesel' },
			{ label: 'Gasoline', href: '/inventory?fuel=Gasoline' },
			{ label: 'LPG/Gasoline', href: '/inventory?fuel=LPG/Gasoline' },
			{ label: 'Electric', href: '/inventory?fuel=Electric' }
		]
	},
	{
		title: 'Help choosing a vehicle',
		links: [
			{ label: 'Buyer-arranged funding', href: '/financing' },
			{ label: 'Services', href: '/services' },
			{ label: 'Frequently asked questions', href: '/faq' },
			{ label: 'Buyer resources', href: '/blog' }
		]
	}
] satisfies readonly MegaMenuColumn[];
