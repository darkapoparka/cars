import { daynightSite } from '$lib/data/daynight-site';

export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = `${daynightSite.name} · София`;
export const DEFAULT_DESCRIPTION = `${daynightSite.name}: демо каталог с датирани обяви за употребявани автомобили в Горубляне. Наличността, цената и огледът се потвърждават с дилъра.`;

// Preserve the master's public routes and lookup contract. Compatibility paths
// remain addressable, but do not assert the source dealer's identity or services.
export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{
		path: '',
		title: `${DAY_SITE_TITLE} — обяви и контакт`,
		description: DEFAULT_DESCRIPTION,
		sitemap: true
	},
	{
		path: 'inventory',
		title: `Обявени автомобили | ${DAY_SITE_TITLE}`,
		description: 'Датирана извадка от обявите на DANGER AUTO с филтри по марка, цена, гориво и пробег. Не е потвърдена текуща складова наличност.',
		sitemap: true
	},
	{
		path: 'inventory/map',
		title: `Карта и обяви | ${DAY_SITE_TITLE}`,
		description: 'Местоположение на автокъщата и датирани автомобилни обяви. Потвърдете къде се намира конкретният автомобил преди посещение.',
		sitemap: true
	},
	{
		path: 'services',
		title: `Информация и услуги | ${DAY_SITE_TITLE}`,
		description: 'Информация за контакт с DANGER AUTO и въпроси по конкретна обява. Допълнителните услуги и условия се уточняват директно с дилъра.',
		sitemap: true
	},
	{
		path: 'sell-your-car',
		title: `Въпроси за продажба или замяна | ${DAY_SITE_TITLE}`,
		description: 'Подгответе въпроси за евентуална продажба или замяна. Демото не е оферта за изкупуване и не потвърждава приемане на бартер.',
		sitemap: true
	},
	{
		path: 'sell-your-car/request',
		title: `Подготовка на информация | ${DAY_SITE_TITLE}`,
		description: 'Демонстрационна форма за подготовка на информация за автомобил. Няма свързана услуга за доставка на заявка или автоматична оценка.',
		sitemap: true
	},
	{
		path: 'sell-car',
		title: `Въпроси за продажба или замяна | ${DAY_SITE_TITLE}`,
		description: 'Подгответе въпроси за евентуална продажба или замяна. Демото не е оферта за изкупуване и не потвърждава приемане на бартер.',
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Подготовка на информация | ${DAY_SITE_TITLE}`,
		description: 'Демонстрационна форма за подготовка на информация за автомобил. Няма свързана услуга за доставка на заявка или автоматична оценка.',
		sitemap: false
	},
	{
		path: 'about',
		title: `За автокъщата | ${DAY_SITE_TITLE}`,
		description: 'DANGER AUTO в Горубляне, София: публикуван бизнес контакт и обяви от публичния дилърски профил. Демо проект, без потвърждение от дилъра.',
		sitemap: true
	},
	{
		path: 'about/daynight-auto-plovdiv',
		title: `Профил на автокъщата | ${DAY_SITE_TITLE}`,
		description: 'Публикуван контакт и местоположение на DANGER AUTO в София. Запазен адрес на страница от шаблона, без връзка със стария дилър.',
		sitemap: true
	},
	{
		path: 'contact',
		title: `Контакти | ${DAY_SITE_TITLE}`,
		description: `Публикувани телефони ${daynightSite.phoneLabel} и ${daynightSite.secondaryPhoneLabel}. ${daynightSite.location}. Уговорете оглед директно с дилъра.`,
		sitemap: true
	},
	{
		path: 'financing',
		title: `Банково финансиране | ${DAY_SITE_TITLE}`,
		description: 'Продавачът посочва финансиране чрез банка, не собствен лизинг. Условията и одобрението са на кредитора; демото не предлага кредит.',
		sitemap: true
	},
	{
		path: 'reviews',
		title: `Информация за отзивите | ${DAY_SITE_TITLE}`,
		description: 'Няма предоставени потвърдени клиентски отзиви за DANGER AUTO. В този демо проект не се публикуват измислени клиентски оценки.',
		sitemap: true
	},
	{
		path: 'calculator',
		title: `Примерен финансов калкулатор | ${DAY_SITE_TITLE}`,
		description: 'Ориентировъчна математическа сметка по въведени стойности. Не е оферта от дилъра или банка и не е одобрение за финансиране.',
		sitemap: false
	},
	{
		path: 'compare',
		title: `Сравнение на обяви | ${DAY_SITE_TITLE}`,
		description: 'Сравнете показаните обяви по публикувани цени и характеристики. Данните за състояние и оборудване са твърдения на продавача.',
		sitemap: false
	},
	{
		path: 'team',
		title: `Бизнес контакт | ${DAY_SITE_TITLE}`,
		description: 'Публикуваният контакт на DANGER AUTO, без измислени профили, имена или портрети на служители.',
		sitemap: true
	},
	{
		path: 'team/prodazhbi-daynight-auto',
		title: `Контакт с автокъщата | ${DAY_SITE_TITLE}`,
		description: 'Публикуван бизнес контакт на DANGER AUTO за въпроси по конкретна обява. Не е профил на отделен служител.',
		sitemap: false
	},
	{
		path: 'team/showroom-contact',
		title: `Контакт с автокъщата | ${DAY_SITE_TITLE}`,
		description: 'Публикуван бизнес контакт на DANGER AUTO за въпроси по конкретна обява. Не е профил на отделен служител.',
		sitemap: true
	},
	{
		path: 'blog',
		title: `Насоки за разглеждане | ${DAY_SITE_TITLE}`,
		description: 'Информационна секция на демо проекта. Показаното съдържание не е доказателство за авторство, услуги или одобрение от DANGER AUTO.',
		sitemap: true
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `Въпроси при избор на употребяван автомобил | ${DAY_SITE_TITLE}`,
		description: 'Общи въпроси за преглед на обява и документи. Демо съдържание, не техническа експертиза или обещание за състоянието на конкретен автомобил.',
		sitemap: false
	},
	{
		path: 'faq',
		title: `Често задавани въпроси | ${DAY_SITE_TITLE}`,
		description: 'Обявени цени, уговорка за оглед, банково финансиране и ограничения на демо формите. Не се правят онлайн резервации или доставки на заявки.',
		sitemap: true
	},
	{
		path: 'terms',
		title: `Информация за демо прегледа | ${DAY_SITE_TITLE}`,
		description: 'Информация за ограниченията на този непотвърден демо проект. Не представлява официални договорни условия на DANGER AUTO.',
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
