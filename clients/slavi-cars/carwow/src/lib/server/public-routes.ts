export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = "Slavi Cars Дупница";

export const DEFAULT_DESCRIPTION =
	"Slavi Cars предлага автомобили по обяви, огледи и съдействие при покупка в Дупница.";

export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{
		path: '',
		title: `${DAY_SITE_TITLE} - подбрани обяви и бърз контакт`,
		description: DEFAULT_DESCRIPTION,
		sitemap: false
	},
	{
		path: 'inventory',
		title: `Селекция от обяви | ${DAY_SITE_TITLE}`,
		description: "Разгледайте автомобилите от селекцията на Slavi Cars с филтри по марка, цена, гориво и пробег.",
		sitemap: false
	},
	{
		path: 'inventory/map',
		title: `Карта на автомобилите | ${DAY_SITE_TITLE}`,
		description: "Вижте карта и списък с автомобилите от селекцията на Slavi Cars.",
		sitemap: false
	},
	{
		path: 'services',
		title: `Услуги | ${DAY_SITE_TITLE}`,
		description: "Информация за оглед, обяви и въпроси по индивидуалните условия на Slavi Cars. Непотвърдени услуги не се заявяват чрез демото.",
		sitemap: false
	},
	{
		path: 'sell-your-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Slavi Cars.",
		sitemap: false
	},
	{
		path: 'sell-your-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Slavi Cars.",
		sitemap: false
	},
	{
		path: 'sell-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Slavi Cars.",
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Slavi Cars.",
		sitemap: false
	},
	{
		path: 'about',
		title: `За нас | ${DAY_SITE_TITLE}`,
		description: "Slavi Cars - автокъща с подреден каталог, индивидуални условия и съдействие при финансиране.",
		sitemap: false
	},
	{
		path: 'about/slavi-cars',
		title: `Профил на автокъщата | ${DAY_SITE_TITLE}`,
		description: "Научете повече за подхода на Slavi Cars при покупка, продажба и финансиране на автомобили.",
		sitemap: false
	},
	{
		path: 'contact',
		title: `Контакти | ${DAY_SITE_TITLE}`,
		description: "Свържете се с Slavi Cars - телефон, адрес и локация на автокъщата.",
		sitemap: false
	},
	{
		path: 'financing',
		title: `Финансиране | ${DAY_SITE_TITLE}`,
		description: "Възможности за автомобилно финансиране и съдействие при покупка чрез Slavi Cars.",
		sitemap: false
	},
	{
		path: 'reviews',
		title: `Клиентски отзиви | ${DAY_SITE_TITLE}`,
		description: "Потвърдени клиентски отзиви не са предоставени за този демонстрационен проект.",
		sitemap: false
	},
	{
		path: 'calculator',
		title: `Калкулатор за финансиране | ${DAY_SITE_TITLE}`,
		description: "Ориентировъчен калкулатор за автомобилно финансиране и месечна вноска от Slavi Cars.",
		sitemap: false
	},
	{
		path: 'compare',
		title: `Сравнение на автомобили | ${DAY_SITE_TITLE}`,
		description: "Сравнете избрани автомобили от Slavi Cars по цена, характеристики и оборудване.",
		sitemap: false
	},
	{
		path: 'team',
		title: `Екип | ${DAY_SITE_TITLE}`,
		description: "Четири теми за разговор на общия публикуван телефон на Slavi Cars.",
		sitemap: false
	},
	{
		path: 'team/prodazhbi-showroom',
		title: `Продажби | ${DAY_SITE_TITLE}`,
		description: "Контакт с търговския екип на Slavi Cars за автомобили по обяви и оферти.",
		sitemap: false
	},
	{
		path: 'blog',
		title: `Блог | ${DAY_SITE_TITLE}`,
		description: "Практични съвети от Slavi Cars за покупка, продажба, финансиране и поддръжка на автомобили.",
		sitemap: false
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `Как да купим употребяван автомобил | ${DAY_SITE_TITLE}`,
		description: "Кратък наръчник от Slavi Cars за проверка, избор и покупка на употребяван автомобил.",
		sitemap: false
	},
	{
		path: 'faq',
		title: `Често задавани въпроси | ${DAY_SITE_TITLE}`,
		description: "Отговори на чести въпроси за покупка, продажба, финансиране и контакт с Slavi Cars.",
		sitemap: false
	},
	{
		path: 'terms',
		title: `Условия | ${DAY_SITE_TITLE}`,
		description: "Условия за ползване и информация за публичния сайт на Slavi Cars.",
		sitemap: false
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
