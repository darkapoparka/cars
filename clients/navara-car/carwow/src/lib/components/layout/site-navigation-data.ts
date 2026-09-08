import { daynightVehicles } from "$lib/data/daynight-vehicles";
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

export const inventoryMegaMenuVehicleTiles: readonly MegaMenuVehicleTile[] = daynightVehicles.slice(0, 8).map(vehicle => ({ label: vehicle.title, slug: vehicle.slug, image: vehicle.image, meta: vehicle.priceEur + ' · ' + vehicle.fuel }));

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
