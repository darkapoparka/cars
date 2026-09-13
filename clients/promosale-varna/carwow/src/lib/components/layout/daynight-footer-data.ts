export type DayNightFooterRoute =
	| '/'
	| '/about'
	| '/about/daynight-auto-plovdiv'
	| '/team'
	| '/reviews'
	| '/blog'
	| '/contact'
	| `/contact?${string}`
	| '/inventory'
	| '/financing'
	| '/calculator'
	| '/sell-your-car'
	| '/sell-your-car/request'
	| '/compare'
	| '/faq'
	| '/terms';

export type DayNightFooterLink = {
	href: DayNightFooterRoute;
	label: string;
	title?: string;
};

export type DayNightFooterLinkGroup = {
	title: string;
	links: DayNightFooterLink[];
};

export const daynightFooterLinkGroups: DayNightFooterLinkGroup[] = [
	{
		title: 'DAY NIGHT AUTO GROUP',
		links: [
			{ href: '/about', label: 'За Day Night Auto' },
			{ href: '/about/daynight-auto-plovdiv', label: 'Профил на автокъщата' },
			{ href: '/team', label: 'Екип' },
			{ href: '/reviews', label: 'Отзиви' },
			{ href: '/blog', label: 'Блог' },
			{ href: '/contact', label: 'Контакти' }
		]
	},
	{
		title: 'УСЛУГИ И ИНСТРУМЕНТИ',
		links: [
			{ href: '/inventory', label: 'Налични автомобили' },
			{ href: '/financing', label: 'Финансиране' },
			{ href: '/calculator', label: 'Калкулатор' },
			{ href: '/sell-your-car', label: 'Продай или замени' },
			{ href: '/compare', label: 'Сравнение' },
			{ href: '/faq', label: 'ЧЗВ' }
		]
	},
	{
		title: 'ЗАПИТВАНИЯ',
		links: [
			{ href: '/contact', label: 'Контакт за оглед' },
			{ href: '/sell-your-car/request', label: 'Заявка за оценка' },
			{ href: '/sell-your-car', label: 'Продай или замени' },
			{ href: '/faq', label: 'ЧЗВ' }
		]
	}
];

export const daynightFooterBottomLinks: DayNightFooterLink[] = [
	{ href: '/terms', label: 'Условия за ползване' }
];

// Shared navigation for the desktop columns and mobile accordions.
export const daynightDealerFooterGroups = [
	{
		title: 'Бързи връзки',
		links: [
			{ href: '/about', label: 'За нас' },
			{ href: '/team', label: 'Нашият екип' },
			{ href: '/services', label: 'Услуги' },
			{ href: '/faq', label: 'Често задавани въпроси' },
			{ href: '/blog', label: 'Блог' },
			{ href: '/contact', label: 'Контакти' }
		]
	},
	{
		title: 'Покупка и продажба',
		links: [
			{ href: '/inventory', label: 'Намери автомобил' },
			{ href: '/sell-your-car', label: 'Продай или замени' },
			{ href: '/financing', label: 'Лизинг и финансиране' },
			{ href: '/inventory/map', label: 'Карта на автомобилите' },
			{ href: '/calculator', label: 'Калкулатор за финансиране' },
			{ href: '/reviews', label: 'Отзиви от клиенти' }
		]
	}
] as const;
