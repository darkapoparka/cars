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
		title: 'TEXAS DRIVE AUTO',
		links: [
			{ href: '/about', label: 'About Texas Drive Auto' },
			{ href: '/about/daynight-auto-plovdiv', label: 'Dealership profile' },
			{ href: '/team', label: 'Contact options' },
			{ href: '/reviews', label: 'Reviews' },
			{ href: '/blog', label: 'Blog' },
			{ href: '/contact', label: 'Contact' }
		]
	},
	{
		title: 'SERVICES AND TOOLS',
		links: [
			{ href: '/inventory', label: 'Vehicle inventory' },
			{ href: '/financing', label: 'Buyer-arranged funding' },
			{ href: '/calculator', label: 'Calculator' },
			{ href: '/sell-your-car', label: 'Ask about selling or trading' },
			{ href: '/compare', label: 'Compare' },
			{ href: '/faq', label: 'FAQ' }
		]
	},
	{
		title: 'INQUIRIES',
		links: [
			{ href: '/contact', label: 'Contact for a viewing' },
			{ href: '/sell-your-car/request', label: 'Request an appraisal' },
			{ href: '/sell-your-car', label: 'Ask about selling or trading' },
			{ href: '/faq', label: 'FAQ' }
		]
	}
];

export const daynightFooterBottomLinks: DayNightFooterLink[] = [
	{ href: '/terms', label: 'Terms of use' }
];
