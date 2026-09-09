export type StaticNavHref =
	| '/'
	| '/about'
	| '/about/kris-car-plovdiv'
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
    "label": "Toyota Camry 2.5 Hybrid Comfort",
    "slug": "toyota-camry-2-5-hybrid-comfort-361582",
    "image": "/dealer/stock/11788863173361582-1.webp",
    "meta": "29 460 EUR · Хибрид"
  },
  {
    "label": "SEAT Ateca 4x4 2.0 TDI",
    "slug": "seat-ateca-4x4-2-0-tdi-448667",
    "image": "/dealer/stock/21788856265448667-1.webp",
    "meta": "21 960 EUR · Дизел"
  },
  {
    "label": "Volkswagen Tiguan Elegance 4x4",
    "slug": "volkswagen-tiguan-elegance-4x4-250424",
    "image": "/dealer/stock/21781080017250424-1.webp",
    "meta": "32 560 EUR · Дизел"
  },
  {
    "label": "Volkswagen Golf 1.5 eTSI",
    "slug": "volkswagen-golf-1-5-etsi-207389",
    "image": "/dealer/stock/11780494813207389-1.webp",
    "meta": "21 860 EUR · Хибрид"
  },
  {
    "label": "Volkswagen Arteon 2.0 TDI",
    "slug": "volkswagen-arteon-2-0-tdi-592650",
    "image": "/dealer/stock/11788352260592650-1.webp",
    "meta": "25 460 EUR · Дизел"
  },
  {
    "label": "Toyota Yaris 1.5 Hybrid",
    "slug": "toyota-yaris-1-5-hybrid-930244",
    "image": "/dealer/stock/11760713901930244-1.webp",
    "meta": "17 560 EUR · Хибрид"
  },
  {
    "label": "Toyota Corolla 1.6 Executive",
    "slug": "toyota-corolla-1-6-executive-736167",
    "image": "/dealer/stock/11762013228736167-1.webp",
    "meta": "19 760 EUR · Бензин"
  },
  {
    "label": "Škoda Superb 2.0 TDI",
    "slug": "skoda-superb-2-0-tdi-224639",
    "image": "/dealer/stock/11744304007224639-1.webp",
    "meta": "26 860 EUR · Дизел"
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
