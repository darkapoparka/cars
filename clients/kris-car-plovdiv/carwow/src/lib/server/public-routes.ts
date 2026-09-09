export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = "Крис Кар Пловдив";

export const DEFAULT_DESCRIPTION =
	"Крис Кар предлага налични автомобили, огледи и съдействие при покупка в Пловдив.";

export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{
		path: '',
		title: `${DAY_SITE_TITLE} - обяви за автомобили и бърз контакт`,
		description: DEFAULT_DESCRIPTION,
		sitemap: true
	},
	{
		path: 'inventory',
		title: `Автомобили в наличност | ${DAY_SITE_TITLE}`,
		description: "Разгледайте автомобилите в селекцията на Крис Кар с филтри по марка, цена, гориво и пробег.",
		sitemap: true
	},
	{
		path: 'inventory/map',
		title: `Карта на автомобилите | ${DAY_SITE_TITLE}`,
		description: "Вижте карта и списък с автомобилите в селекцията на Крис Кар.",
		sitemap: true
	},
	{
		path: 'services',
		title: `Услуги | ${DAY_SITE_TITLE}`,
		description: "Услуги на Крис Кар: финансиране, изкупуване, оценка и съдействие при покупка на автомобил.",
		sitemap: true
	},
	{
		path: 'sell-your-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Крис Кар.",
		sitemap: true
	},
	{
		path: 'sell-your-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Крис Кар.",
		sitemap: true
	},
	{
		path: 'sell-car',
		title: `Продай автомобила си | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за продажба, бартер или оценка към Крис Кар.",
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Заявка за изкупуване | ${DAY_SITE_TITLE}`,
		description: "Изпратете заявка за оценка и изкупуване към Крис Кар.",
		sitemap: false
	},
	{
		path: 'about',
		title: `За нас | ${DAY_SITE_TITLE}`,
		description: "Крис Кар - автокъща с подреден каталог, прозрачни сделки и съдействие при финансиране.",
		sitemap: true
	},
	{
		path: 'about/kris-car-plovdiv',
		title: `Профил на автокъщата | ${DAY_SITE_TITLE}`,
		description: "Научете повече за подхода на Крис Кар при покупка, продажба и финансиране на автомобили.",
		sitemap: true
	},
	{
		path: 'contact',
		title: `Контакти | ${DAY_SITE_TITLE}`,
		description: "Свържете се с Крис Кар - телефон, адрес и локация на автокъщата.",
		sitemap: true
	},
	{
		path: 'financing',
		title: `Финансиране | ${DAY_SITE_TITLE}`,
		description: "Възможности за автомобилно финансиране и съдействие при покупка чрез Крис Кар.",
		sitemap: true
	},
	{
		path: 'reviews',
		title: `Клиентски отзиви | ${DAY_SITE_TITLE}`,
		description: "Отзиви от клиенти за покупка, продажба и съдействие при автомобили от Крис Кар.",
		sitemap: true
	},
	{
		path: 'calculator',
		title: `Калкулатор за финансиране | ${DAY_SITE_TITLE}`,
		description: "Ориентировъчен калкулатор за автомобилно финансиране и месечна вноска от Крис Кар.",
		sitemap: false
	},
	{
		path: 'compare',
		title: `Сравнение на автомобили | ${DAY_SITE_TITLE}`,
		description: "Сравнете избрани автомобили от Крис Кар по цена, характеристики и оборудване.",
		sitemap: false
	},
	{
		path: 'team',
		title: `Екип | ${DAY_SITE_TITLE}`,
		description: "Запознайте се с екипа зад продажбите и клиентското обслужване на Крис Кар.",
		sitemap: true
	},
	{
		path: 'team/prodazhbi-daynight-auto',
		title: `Продажби | ${DAY_SITE_TITLE}`,
		description: "Контакт с търговския екип на Крис Кар за налични автомобили и оферти.",
		sitemap: true
	},
	{
		path: 'blog',
		title: `Блог | ${DAY_SITE_TITLE}`,
		description: "Практични съвети от Крис Кар за покупка, продажба, финансиране и поддръжка на автомобили.",
		sitemap: true
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `Как да купим употребяван автомобил | ${DAY_SITE_TITLE}`,
		description: "Кратък наръчник от Крис Кар за проверка, избор и покупка на употребяван автомобил.",
		sitemap: false
	},
	{
		path: 'faq',
		title: `Често задавани въпроси | ${DAY_SITE_TITLE}`,
		description: "Отговори на чести въпроси за покупка, продажба, финансиране и контакт с Крис Кар.",
		sitemap: true
	},
	{
		path: 'terms',
		title: `Условия | ${DAY_SITE_TITLE}`,
		description: "Условия за ползване и информация за публичния сайт на Крис Кар.",
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
