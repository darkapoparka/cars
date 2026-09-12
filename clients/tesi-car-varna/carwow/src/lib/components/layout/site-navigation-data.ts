export type StaticNavHref =
	| '/'
	| '/about'
	| '/about/tesi-car-varna'
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
		meta: '17 000 EUR · Газ/Бензин'
	},
	{
		label: 'BMW i7',
		slug: 'bmw-i7-2023-full-maxx',
		image: '/assets/images/megamenu/bmw-i7.webp',
		meta: '81 000 EUR · Електрически'
	},
	{
		label: 'BMW 520i',
		slug: 'bmw-520i-2006-avtomatik',
		image: '/assets/images/megamenu/bmw-520i.webp',
		meta: '4 500 EUR · Бензин'
	},
	{
		label: 'Mercedes E 350 D',
		slug: 'mercedes-benz-e-350-d-2015-64594',
		image: '/assets/images/megamenu/mercedes-e220d.webp',
		meta: '11 500 EUR · Дизел'
	},
	{
		label: 'Audi Q8',
		slug: 'audi-q8-5-0tdi-2020-95331',
		image: '/assets/images/megamenu/audi-q8-side-normalized.webp',
		meta: '43 000 EUR · Дизел'
	},
	{
		label: 'BMW X6',
		slug: 'bmw-x6-2017-84431',
		image: '/assets/images/megamenu/bmw-x6-side-normalized.webp',
		meta: '25 500 EUR · Бензин'
	},
	{
		label: 'Mercedes E 220 D',
		slug: 'mercedes-benz-e-220-d-2023-53599',
		image: '/assets/images/megamenu/mercedes-e220d-side-normalized.webp',
		meta: '31 000 EUR · Дизел'
	},
	{
		label: 'VW Touran',
		slug: 'vw-touran-1-6d-2017-08568',
		image: '/assets/images/megamenu/vw-touran-side-normalized.webp',
		meta: '9 000 EUR · Дизел'
	}
] satisfies readonly MegaMenuVehicleTile[];

export const inventoryMegaMenuLinkColumns = [
	{
		title: 'Наличност',
		links: [
			{ label: 'Всички автомобили', href: '/inventory' },
			{ label: 'Автомобили на карта', href: '/inventory/map' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'Калкулатор', href: '/calculator' }
		]
	},
	{
		title: 'По тип',
		links: [
			{ label: 'Седан', href: '/inventory?body=Седан' },
			{ label: 'Джип', href: '/inventory?body=SUV' },
			{ label: 'Купе', href: '/inventory?body=Купе' },
			{ label: 'Комби', href: '/inventory?body=Комби' }
		]
	},
	{
		title: 'По гориво',
		links: [
			{ label: 'Дизел', href: '/inventory?fuel=Дизел' },
			{ label: 'Бензин', href: '/inventory?fuel=Бензин' },
			{ label: 'Газ/Бензин', href: '/inventory?fuel=Газ/Бензин' },
			{ label: 'Електрически', href: '/inventory?fuel=Електрически' }
		]
	},
	{
		title: 'Помощ при избор',
		links: [
			{ label: 'Финансиране', href: '/financing' },
			{ label: 'Услуги', href: '/services' },
			{ label: 'Често задавани въпроси', href: '/faq' },
			{ label: 'Полезно за купувачи', href: '/blog' }
		]
	}
] satisfies readonly MegaMenuColumn[];
