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
			{ href: '/team', label: 'Team' },
			{ href: '/reviews', label: 'Reviews' },
			{ href: '/blog', label: 'Guides' },
			{ href: '/contact', label: 'Contact' }
		]
	},
	{
		title: 'УСЛУГИ И ИНСТРУМЕНТИ',
		links: [
			{ href: '/inventory', label: 'Advertised samples' },
			{ href: '/financing', label: 'Buying options' },
			{ href: '/calculator', label: 'Budget calculator' },
			{ href: '/sell-your-car', label: 'Trade-in enquiry' },
			{ href: '/compare', label: 'Compare' },
			{ href: '/faq', label: 'FAQ' }
		]
	},
	{
		title: 'ЗАПИТВАНИЯ',
		links: [
			{ href: '/contact', label: 'Контакт за оглед' },
			{ href: '/sell-your-car/request', label: 'Заявка за оценка' },
			{ href: '/sell-your-car', label: 'Trade-in enquiry' },
			{ href: '/faq', label: 'FAQ' }
		]
	}
];

export const daynightFooterBottomLinks: DayNightFooterLink[] = [
	{ href: '/terms', label: 'Условия за ползване' }
];
