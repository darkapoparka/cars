import { dealer } from '$lib/data/dealer';

export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = `${dealer.name} · ${dealer.city}`;
export const DEFAULT_DESCRIPTION = `${dealer.name} — демонстрационен каталог с публикувани обяви. ${dealer.stockNotice}`;

// Keep the master's route and alias contract; only dealer-facing metadata changes.
export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{ path: '', title: `${DAY_SITE_TITLE} — обяви и контакти`, description: DEFAULT_DESCRIPTION, sitemap: true },
	{ path: 'inventory', title: `Обяви за автомобили | ${DAY_SITE_TITLE}`, description: `Разгледайте извадката от обяви на ${dealer.name} с филтри по марка, цена, гориво и пробег. Потвърдете наличността с продавача.`, sitemap: true },
	{ path: 'inventory/map', title: `Адрес и карта | ${DAY_SITE_TITLE}`, description: `Публикуван адрес на ${dealer.name}: ${dealer.address}. Потвърдете точния вход и часа за посещение.`, sitemap: true },
	{ path: 'services', title: `Информация за покупка | ${DAY_SITE_TITLE}`, description: `Въпроси за оглед, документи и условия към ${dealer.name}. Посочените теми не са потвърждение за предлагани услуги.`, sitemap: true },
	{ path: 'sell-your-car', title: `Вашият автомобил | ${DAY_SITE_TITLE}`, description: `Подгответе въпроси за своя автомобил към ${dealer.name}. Не се обещават изкупуване, оценка или бартер.`, sitemap: true },
	{ path: 'sell-your-car/request', title: `Подготовка на запитване | ${DAY_SITE_TITLE}`, description: `Подгответе данни за разговор с ${dealer.name}. Демонстрацията не изпраща външно съобщение и не потвърждава заявка.`, sitemap: true },
	{ path: 'sell-car', title: `Вашият автомобил | ${DAY_SITE_TITLE}`, description: `Подгответе въпроси към ${dealer.name} за своя автомобил, без обещание за изкупуване или замяна.`, sitemap: false },
	{ path: 'sell-car/request', title: `Подготовка на запитване | ${DAY_SITE_TITLE}`, description: `Данни за разговор с ${dealer.name}. Не е изпратено съобщение или потвърдена заявка.`, sitemap: false },
	{ path: 'about', title: `За нас | ${DAY_SITE_TITLE}`, description: `Публикуван профил и контакти на ${dealer.name} във ${dealer.city}. Извадка от обяви, не независимо проверен инвентар.`, sitemap: true },
	{ path: 'about/daynight-auto-plovdiv', title: `Профил на автокъщата | ${DAY_SITE_TITLE}`, description: `Публикувани данни за ${dealer.name}, адрес и контакт за въпроси по обявите.`, sitemap: true },
	{ path: 'contact', title: `Контакти | ${DAY_SITE_TITLE}`, description: `${dealer.name} — публикуван телефон ${dealer.phone} и адрес ${dealer.address}. Потвърдете наличността преди посещение.`, sitemap: true },
	{ path: 'financing', title: `Начини на плащане | ${DAY_SITE_TITLE}`, description: `Попитайте ${dealer.name} за възможни начини на плащане и писмени условия. Няма потвърдена кредитна оферта или обещание за одобрение в демонстрацията.`, sitemap: true },
	{ path: 'reviews', title: `Информация за отзивите | ${DAY_SITE_TITLE}`, description: `В демонстрацията за ${dealer.name} не са представени непотвърдени отзиви като реални клиентски препоръки.`, sitemap: true },
	{ path: 'calculator', title: `Калкулатор — пример | ${DAY_SITE_TITLE}`, description: `Илюстративни изчисления в демонстрацията за ${dealer.name}, не кредитна оферта, финансов съвет или потвърдени условия.`, sitemap: false },
	{ path: 'compare', title: `Сравнение на обяви | ${DAY_SITE_TITLE}`, description: `Сравнете избрани записи от извадката на ${dealer.name} по обявени характеристики. Данните и наличността подлежат на потвърждение.`, sitemap: false },
	{ path: 'team', title: `Теми за разговор | ${DAY_SITE_TITLE}`, description: `Тематични контакти на общия публикуван телефон на ${dealer.name}, не индивидуални профили на потвърдени служители.`, sitemap: true },
	{ path: 'team/prodazhbi-daynight-auto', title: `Контакт за автомобил | ${DAY_SITE_TITLE}`, description: `Общият публикуван телефон на ${dealer.name} за въпроси по конкретна обява.`, sitemap: true },
	{ path: 'blog', title: `Полезна информация | ${DAY_SITE_TITLE}`, description: `Информационни теми в демонстрацията за ${dealer.name}, не официални публикации или становища на автокъщата.`, sitemap: true },
	{ path: 'blog/kak-da-kupim-upotrebyavan-avtomobil', title: `Подготовка за покупка на автомобил | ${DAY_SITE_TITLE}`, description: `Въпроси за оглед и документи в демонстрацията за ${dealer.name}. Уточнете конкретните факти за автомобила с продавача.`, sitemap: false },
	{ path: 'faq', title: `Въпроси и отговори | ${DAY_SITE_TITLE}`, description: `Информация за демонстрационния каталог на ${dealer.name} и въпроси за наличност, оглед и условия.`, sitemap: true },
	{ path: 'terms', title: `За демонстрацията | ${DAY_SITE_TITLE}`, description: `Обхват и ограничения на демонстрационния преглед за ${dealer.name}. Не е официален договор, правен документ или приети условия на автокъщата.`, sitemap: true }
];

export const PUBLIC_SITEMAP_ROUTES = PUBLIC_STATIC_ROUTES.filter((route) => route.sitemap);

export function normalizePublicRoutePath(routePath: string) {
	return routePath.replace(/^\/+|\/+$/g, '');
}

export function getPublicStaticRoute(routePath: string) {
	const normalized = normalizePublicRoutePath(routePath);
	return PUBLIC_STATIC_ROUTES.find((route) => route.path === normalized);
}
