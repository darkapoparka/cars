export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = "Навара кар Варна";

export const DEFAULT_DESCRIPTION =
	"Навара кар предлага налични автомобили, огледи и съдействие при покупка във Варна.";

export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{
		path: '',
		title: `${DAY_SITE_TITLE} - автомобили от обяви и бърз контакт`,
		description: DEFAULT_DESCRIPTION,
		sitemap: true
	},
	{
		path: 'inventory',
		title: `Автомобили в наличност | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'inventory/map',
		title: `Карта на автомобилите | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'services',
		title: `Услуги | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'sell-your-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'sell-your-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'sell-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: false
	},
	{
		path: 'about',
		title: `За нас | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'about/daynight-auto-plovdiv',
		title: `Профил на автокъщата | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'contact',
		title: `Контакти | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'financing',
		title: `Финансиране | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'reviews',
		title: `Клиентски отзиви | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'calculator',
		title: `Калкулатор за финансиране | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: false
	},
	{
		path: 'compare',
		title: `Сравнение на автомобили | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: false
	},
	{
		path: 'team',
		title: `Екип | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'team/prodazhbi-daynight-auto',
		title: `Продажби | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'blog',
		title: `Блог | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `Как да купим употребяван автомобил | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: false
	},
	{
		path: 'faq',
		title: `Често задавани въпроси | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	},
	{
		path: 'terms',
		title: `Условия | ${DAY_SITE_TITLE}`,
		description: "Демонстрационен преглед на Навара кар, Варна. Обяви към 08.09.2026 г.; наличност и условия се потвърждават с продавача.",
		sitemap: true
	}
];

export const PUBLIC_SITEMAP_ROUTES = PUBLIC_STATIC_ROUTES.filter((route) => route.sitemap);

export function normalizePublicRoutePath(routePath: string) {
	return routePath.replace(/^\/+|\/+$/g, '');
}

export function getPublicStaticRoute(routePath: string) {
	const normalized = normalizePublicRoutePath(routePath);
	return PUBLIC_STATIC_ROUTES.find((route) => route.path === normalized);
}
