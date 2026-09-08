export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = "Приселци Варна";

export const DEFAULT_DESCRIPTION =
	"Приселци предлага налични автомобили, огледи и съдействие при покупка в Варна.";

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
		description: "Разгледайте наличните автомобили на Приселци с филтри по марка, цена, гориво и пробег.",
		sitemap: true
	},
	{
		path: 'inventory/map',
		title: `Карта на автомобилите | ${DAY_SITE_TITLE}`,
		description: "Вижте карта и списък с наличните автомобили на Приселци.",
		sitemap: true
	},
	{
		path: 'services',
		title: `Услуги | ${DAY_SITE_TITLE}`,
		description: "Услуги на Приселци: финансиране, изкупуване, оценка и съдействие при покупка на автомобил.",
		sitemap: true
	},
	{
		path: 'sell-your-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Приселци.",
		sitemap: true
	},
	{
		path: 'sell-your-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Приселци.",
		sitemap: true
	},
	{
		path: 'sell-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Приселци.",
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Приселци.",
		sitemap: false
	},
	{
		path: 'about',
		title: `За нас | ${DAY_SITE_TITLE}`,
		description: "Приселци - автокъща с подреден каталог, прозрачни сделки и съдействие при финансиране.",
		sitemap: true
	},
	{
		path: 'about/daynight-auto-plovdiv',
		title: `Профил на автокъщата | ${DAY_SITE_TITLE}`,
		description: "Научете повече за подхода на Приселци при покупка, продажба и финансиране на автомобили.",
		sitemap: true
	},
	{
		path: 'contact',
		title: `Контакти | ${DAY_SITE_TITLE}`,
		description: "Свържете се с Приселци - телефон, адрес и локация на автокъщата.",
		sitemap: true
	},
	{
		path: 'financing',
		title: `Финансиране | ${DAY_SITE_TITLE}`,
		description: "Възможности за автомобилно финансиране и съдействие при покупка чрез Приселци.",
		sitemap: true
	},
	{
		path: 'reviews',
		title: `Клиентски отзиви | ${DAY_SITE_TITLE}`,
		description: "Отзиви от клиенти за покупка, продажба и съдействие при автомобили от Приселци.",
		sitemap: true
	},
	{
		path: 'calculator',
		title: `Калкулатор за финансиране | ${DAY_SITE_TITLE}`,
		description: "Ориентировъчен калкулатор за автомобилно финансиране и месечна вноска от Приселци.",
		sitemap: false
	},
	{
		path: 'compare',
		title: `Сравнение на автомобили | ${DAY_SITE_TITLE}`,
		description: "Сравнете избрани автомобили от Приселци по цена, характеристики и оборудване.",
		sitemap: false
	},
	{
		path: 'team',
		title: `Екип | ${DAY_SITE_TITLE}`,
		description: "Запознайте се с екипа зад продажбите и клиентското обслужване на Приселци.",
		sitemap: true
	},
	{
		path: 'team/prodazhbi-daynight-auto',
		title: `Продажби | ${DAY_SITE_TITLE}`,
		description: "Контакт с търговския екип на Приселци за налични автомобили и оферти.",
		sitemap: true
	},
	{
		path: 'blog',
		title: `Блог | ${DAY_SITE_TITLE}`,
		description: "Практични съвети от Приселци за покупка, продажба, финансиране и поддръжка на автомобили.",
		sitemap: true
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `Как да купим употребяван автомобил | ${DAY_SITE_TITLE}`,
		description: "Кратък наръчник от Приселци за проверка, избор и покупка на употребяван автомобил.",
		sitemap: true
	},
	{
		path: 'faq',
		title: `Често задавани въпроси | ${DAY_SITE_TITLE}`,
		description: "Отговори на чести въпроси за покупка, продажба, финансиране и контакт с Приселци.",
		sitemap: true
	},
	{
		path: 'terms',
		title: `Условия | ${DAY_SITE_TITLE}`,
		description: "Условия за ползване и информация за публичния сайт на Приселци.",
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
