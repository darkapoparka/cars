import dealer from '$lib/data/dealer-stock.json';

export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = `${dealer.shortName} · ${dealer.city}`;
export const DEFAULT_DESCRIPTION =
	`Демонстрационен каталог с избрани публични обяви на ${dealer.name}, записани към ${dealer.observedAt}. Потвърдете актуалния статус директно с продавача.`;

export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{ path: '', title: `${DAY_SITE_TITLE} - автомобилни обяви и контакт`, description: DEFAULT_DESCRIPTION, sitemap: true },
	{ path: 'inventory', title: `Автомобилни обяви | ${DAY_SITE_TITLE}`, description: `Разгледайте избрани обяви на ${dealer.name}. Показването им не е потвърждение за текуща наличност.`, sitemap: true },
	{ path: 'inventory/map', title: `Карта и адрес | ${DAY_SITE_TITLE}`, description: `Публикуван адрес на ${dealer.name}. Потвърдете местоположението на конкретния автомобил преди посещение.`, sitemap: true },
	{ path: 'services', title: `Информация и услуги | ${DAY_SITE_TITLE}`, description: `Информация за оглед, обяви и въпроси към ${dealer.name}. Непотвърдените услуги са обозначени като такива.`, sitemap: true },
	{ path: 'sell-your-car', title: `Вашият автомобил | ${DAY_SITE_TITLE}`, description: `Подгответе данни за Ваш автомобил и се свържете с ${dealer.name}, за да попитате какви варианти разглежда. Демото не изпраща заявка.`, sitemap: true },
	{ path: 'sell-your-car/request', title: `Данни за Ваш автомобил | ${DAY_SITE_TITLE}`, description: `Демонстрационна стъпка за подготовка на данни. Не е заявка за оценка, изкупуване или бартер.`, sitemap: true },
	{ path: 'sell-car', title: `Вашият автомобил | ${DAY_SITE_TITLE}`, description: `Съвместим маршрут към демонстрационната страница за Ваш автомобил.`, sitemap: false },
	{ path: 'sell-car/request', title: `Данни за Ваш автомобил | ${DAY_SITE_TITLE}`, description: `Съвместим демонстрационен маршрут.`, sitemap: false },
	{ path: 'about', title: `За автокъщата | ${DAY_SITE_TITLE}`, description: `Публикувани данни и демонстрационен профил на ${dealer.name}, ${dealer.city}.`, sitemap: true },
	{ path: 'about/showroom', title: `Профил на автокъщата | ${DAY_SITE_TITLE}`, description: `Профил на ${dealer.name} с публикувани контакти и връзка към оригиналния каталог.`, sitemap: true },
	{ path: 'about/daynight-auto-plovdiv', title: `Профил на автокъщата | ${DAY_SITE_TITLE}`, description: `Съвместим стар маршрут; използвайте актуалния профил на автокъщата.`, sitemap: false },
	{ path: 'contact', title: `Контакти | ${DAY_SITE_TITLE}`, description: `Публикуван телефон и адрес на ${dealer.name}. Потвърдете автомобила и часа преди посещение.`, sitemap: true },
	{ path: 'financing', title: `Лизинг / финансиране | ${DAY_SITE_TITLE}`, description: `Информация за въпроси относно лизинг или финансиране. Условията се потвърждават за конкретния автомобил; демото не е кредитна оферта.`, sitemap: true },
	{ path: 'reviews', title: `Демо отзиви | ${DAY_SITE_TITLE}`, description: `Примерно визуално съдържание за оформлението. Не представлява потвърдени клиентски мнения за ${dealer.name}.`, sitemap: false },
	{ path: 'calculator', title: `Ориентировъчен калкулатор | ${DAY_SITE_TITLE}`, description: `Демонстрационен калкулатор. Резултатът не е индивидуална финансова оферта.`, sitemap: false },
	{ path: 'compare', title: `Сравнение на автомобили | ${DAY_SITE_TITLE}`, description: `Сравнете показаните обяви по публикувани характеристики. Потвърдете данните в оригиналния източник.`, sitemap: false },
	{ path: 'team', title: `Демо екип | ${DAY_SITE_TITLE}`, description: `Примерна визуална секция за екип. Профилите не са потвърдени служители на ${dealer.name}.`, sitemap: false },
	{ path: 'team/prodazhbi-daynight-auto', title: `Демо профил | ${DAY_SITE_TITLE}`, description: `Съвместим демонстрационен маршрут; не представлява потвърден член на екипа.`, sitemap: false },
	{ path: 'blog', title: `Полезни материали | ${DAY_SITE_TITLE}`, description: `Авторски демонстрационни насоки за четене на обяви, оглед и проверка. Не са дилърски новини или професионален съвет.`, sitemap: true },
	{ path: 'blog/kak-da-kupim-upotrebyavan-avtomobil', title: `Проверка преди покупка | ${DAY_SITE_TITLE}`, description: `Практични общи насоки за проверка на употребяван автомобил.`, sitemap: false },
	{ path: 'faq', title: `Често задавани въпроси | ${DAY_SITE_TITLE}`, description: `Отговори за използването на демото, проверка на обявите и контакт с ${dealer.name}.`, sitemap: true },
	{ path: 'terms', title: `Условия | ${DAY_SITE_TITLE}`, description: `Условия и ограничения на демонстрационния сайт за ${dealer.name}.`, sitemap: true }
];

export const PUBLIC_SITEMAP_ROUTES = PUBLIC_STATIC_ROUTES.filter((route) => route.sitemap);
export function normalizePublicRoutePath(routePath: string) {
	return routePath.replace(/^\/+|\/+$/g, '');
}
export function getPublicStaticRoute(routePath: string) {
	const normalized = normalizePublicRoutePath(routePath);
	return PUBLIC_STATIC_ROUTES.find((route) => route.path === normalized);
}
