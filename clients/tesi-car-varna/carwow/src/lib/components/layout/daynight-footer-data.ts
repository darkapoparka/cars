export type DayNightFooterRoute =
	| '/'
	| '/about'
	| '/about/tesi-car-varna'
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
		title: 'ТЕСИ КАР',
		links: [
			{ href: '/about', label: 'За Теси Кар' },
			{ href: '/about/tesi-car-varna', label: 'Профил на автокъщата' },
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
