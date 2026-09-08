export type PublicStaticRoute = {
	path: string;
	title: string;
	description: string;
	sitemap: boolean;
};

export const DAY_SITE_TITLE = "Texas Drive Auto";

export const DEFAULT_DESCRIPTION =
	"Browse Texas Drive Auto’s vehicle listings and ask about availability, viewings, and purchasing in Dallas.";

export const PUBLIC_STATIC_ROUTES: PublicStaticRoute[] = [
	{
		path: '',
		title: `${DAY_SITE_TITLE} - vehicle listings and contact information`,
		description: DEFAULT_DESCRIPTION,
		sitemap: true
	},
	{
		path: 'inventory',
		title: `Available Vehicles | ${DAY_SITE_TITLE}`,
		description: "Browse Texas Drive Auto’s vehicle listings with filters for make, price, fuel, and mileage.",
		sitemap: true
	},
	{
		path: 'inventory/map',
		title: `Vehicle Map | ${DAY_SITE_TITLE}`,
		description: "View a map and list of Texas Drive Auto’s vehicle listings.",
		sitemap: true
	},
	{
		path: 'services',
		title: `Services | ${DAY_SITE_TITLE}`,
		description: "Ask Texas Drive Auto about vehicle purchases, appraisals, and buying assistance. Service availability is unconfirmed. No dealer financing or payment plans are offered.",
		sitemap: true
	},
	{
		path: 'sell-your-car',
		title: `Sell Your Vehicle | ${DAY_SITE_TITLE}`,
		description: "Prepare an inquiry for Texas Drive Auto about whether vehicle purchases, trade-ins, or appraisals are available.",
		sitemap: true
	},
	{
		path: 'sell-your-car/request',
		title: `Vehicle Purchase Inquiry | ${DAY_SITE_TITLE}`,
		description: "Prepare an inquiry for Texas Drive Auto about appraisal and vehicle purchase availability.",
		sitemap: true
	},
	{
		path: 'sell-car',
		title: `Sell Your Vehicle | ${DAY_SITE_TITLE}`,
		description: "Prepare an inquiry for Texas Drive Auto about whether vehicle purchases, trade-ins, or appraisals are available.",
		sitemap: false
	},
	{
		path: 'sell-car/request',
		title: `Vehicle Purchase Inquiry | ${DAY_SITE_TITLE}`,
		description: "Prepare an inquiry for Texas Drive Auto about appraisal and vehicle purchase availability.",
		sitemap: false
	},
	{
		path: 'about',
		title: `About Us | ${DAY_SITE_TITLE}`,
		description: "Texas Drive Auto - browse vehicle listings and ask about purchase details. No dealer financing or payment plans are offered.",
		sitemap: true
	},
	{
		path: 'about/daynight-auto-plovdiv',
		title: `Dealership Profile | ${DAY_SITE_TITLE}`,
		description: "Learn about Texas Drive Auto and ask about buying or selling a vehicle. Any funding must be arranged independently by the buyer.",
		sitemap: true
	},
	{
		path: 'contact',
		title: `Contact | ${DAY_SITE_TITLE}`,
		description: "Contact Texas Drive Auto - dealership phone, address, and location.",
		sitemap: true
	},
	{
		path: 'financing',
		title: `Buyer-Arranged Funding | ${DAY_SITE_TITLE}`,
		description: "Texas Drive Auto offers no dealer financing or payment plans. Buyers must arrange any funding independently.",
		sitemap: true
	},
	{
		path: 'reviews',
		title: `Customer Reviews | ${DAY_SITE_TITLE}`,
		description: "Customer reviews for Texas Drive Auto are unavailable in this preview.",
		sitemap: true
	},
	{
		path: 'calculator',
		title: `Buyer-Arranged Funding Calculator | ${DAY_SITE_TITLE}`,
		description: "Estimate payments for separate, buyer-arranged funding. Texas Drive Auto offers no dealer financing or payment plans.",
		sitemap: false
	},
	{
		path: 'compare',
		title: `Compare Vehicles | ${DAY_SITE_TITLE}`,
		description: "Compare selected Texas Drive Auto vehicles by price, specifications, and features.",
		sitemap: false
	},
	{
		path: 'team',
		title: `Team | ${DAY_SITE_TITLE}`,
		description: "Staff information is unavailable in this Texas Drive Auto preview.",
		sitemap: true
	},
	{
		path: 'team/prodazhbi-daynight-auto',
		title: `Sales | ${DAY_SITE_TITLE}`,
		description: "Contact Texas Drive Auto with questions about vehicle availability and pricing.",
		sitemap: true
	},
	{
		path: 'blog',
		title: `Blog | ${DAY_SITE_TITLE}`,
		description: "Texas Drive Auto tips on buying, selling, buyer-arranged funding, and vehicle maintenance.",
		sitemap: true
	},
	{
		path: 'blog/kak-da-kupim-upotrebyavan-avtomobil',
		title: `How to Buy a Used Car | ${DAY_SITE_TITLE}`,
		description: "A short Texas Drive Auto guide to inspecting, choosing, and buying a used car.",
		sitemap: false
	},
	{
		path: 'faq',
		title: `Frequently Asked Questions | ${DAY_SITE_TITLE}`,
		description: "Answers to common questions about buying, selling, buyer-arranged funding, and contacting Texas Drive Auto.",
		sitemap: true
	},
	{
		path: 'terms',
		title: `Terms | ${DAY_SITE_TITLE}`,
		description: "Terms of use and information about the Texas Drive Auto public website.",
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
