import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = '10511 Olympic Drive, Dallas, TX 75220';
export const daynightSite = {
name:'Texas Drive Auto',shortName:'Texas Drive Auto',phone:'+12149723233',phoneLabel:'(214) 972-3233',email:'',location,locationShort:'Dallas, TX',hoursLabel:'Monday–Saturday 10 AM–6 PM; Sunday closed',mapEmbedSrc:'https://www.google.com/maps?q='+encodeURIComponent(location)+'&z=16&output=embed',mapUrl:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(location),mapLabel:'Texas Drive Auto, Dallas, Texas',sourceInventory:'https://www.texasdriveauto.com/cars-for-sale',inventoryCount:8,logoLight:'/brand/logo-on-dark.png',logoDark:'/brand/logo-on-light.png',primaryCta:'Browse listing samples',sellCarCta:'Purchase questions',accountCta:'Contact the dealer',phoneCta:'Call before visiting',heroTitle:'TEXAS DRIVE AUTO',heroSubtitle:'Dated used-vehicle listing samples in Dallas. Advertised USD prices and original miles; confirm availability directly.',reviewCount:daynightReviewCount,reviewCountLabel:daynightReviewCountLabel,reviewLinkLabel:daynightReviewLinkLabel,dealerFinance:false,currency:'USD',mileageUnit:'mi',stockAsOf:'2026-09-08',preview:true
} as const;

export const publicNavItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Vehicles', href: '/inventory' },
	{ label: 'Sell', href: '/sell-your-car' },
	{ label: 'Services', href: '/services' },
	{ label: 'About us', href: '/about' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Contact', href: '/contact' }
] as const;

export const publicNavGroups = [
	{ label: 'Home', href: '/' },
	{
		label: 'Vehicles',
		href: '/inventory',
		children: [
			{ label: 'All vehicles', href: '/inventory' },
			{ label: 'Map', href: '/inventory/map' },
			{ label: 'Compare', href: '/compare' },
			{ label: 'Calculator', href: '/calculator' }
		]
	},
	{
		label: 'Sell',
		href: '/sell-your-car',
		children: [
			{ label: 'Ask about selling or trading', href: '/sell-your-car' },
			{ label: 'Request an appraisal', href: '/sell-your-car/request' }
		]
	},
	{
		label: 'Services',
		href: '/services',
		children: [
			{ label: 'Dealership services', href: '/services' },
			{ label: 'Buyer-arranged funding', href: '/financing' },
			{ label: 'FAQ', href: '/faq' }
		]
	},
	{
		label: 'About us',
		href: '/about',
		children: [
			{ label: 'About Texas Drive Auto', href: '/about' },
			{ label: 'Dealership profile', href: '/about/daynight-auto-plovdiv' },
			{ label: 'Contact options', href: '/team' },
			{ label: 'Reviews', href: '/reviews' },
			{ label: 'Blog', href: '/blog' },
			{ label: 'Terms', href: '/terms' }
		]
	},
	{ label: 'Contact', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Vehicle inventory', href: '/inventory' },
	{ label: 'Vehicle map', href: '/inventory/map' },
	{ label: 'Buyer-arranged funding', href: '/financing' },
	{ label: 'Calculator', href: '/calculator' },
	{ label: 'Ask about selling or trading', href: '/sell-your-car' },
	{ label: 'Request an appraisal', href: '/sell-your-car/request' },
	{ label: 'Services', href: '/services' },
	{ label: 'FAQ', href: '/faq' }
] as const;
