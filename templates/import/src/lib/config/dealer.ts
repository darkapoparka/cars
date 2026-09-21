import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
	primaryPhoneLabel: '0877 733 110',
	primaryPhoneHref: 'tel:0877733110',
	marketplacePhoneLabel: '0877 733 110',
	marketplacePhoneHref: 'tel:0877733110',
	emailLabel: 'Онлайн запитване',
	emailHref: 'https://daynight.mobile.bg/contacts',
	viberHref: 'viber://chat?number=%2B359877733110',
	facebookHref: 'https://www.facebook.com/deninoshtautogroup/?locale=bg_BG',
	instagramHref: 'https://www.instagram.com/kristiankirilov13/',
	tiktokHref: 'https://www.tiktok.com/@kristiankirilov13',
	reviewsHref: 'https://www.facebook.com/deninoshtautogroup/?locale=bg_BG',
	youtubeHref: '',
	addressLabel: 'гр. София, Студентски град, ул. Атанас Манчев 18',
	appointmentNote: 'Огледи с предварителна уговорка',
	mapEmbedUrl:
		'https://maps.google.com/maps?q=%D0%B3%D1%80.%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F%2C%20%D0%A1%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%81%D0%BA%D0%B8%20%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%9C%D0%B0%D0%BD%D1%87%D0%B5%D0%B2%2018&t=&z=13&ie=UTF8&iwloc=&output=embed'
} as const;

export const daynightBrand = {
	name: 'Day Night Auto Group',
	displayName: 'DAY NIGHT AUTO GROUP',
	bulgarianName: 'Ден и Нощ Ауто Груп',
	domain: 'day-night-auto-group.demo',
	tagline: 'Премиум автомобили в София с подреден процес за оглед и запитване',
	legalNote:
		'Proposal build reflects public contact channels for Day Night Auto Group; verify final assets and inventory before outreach.'
} as const;

export const daynightAssets = {
	logoDark: '/assets/daynight/brand/daynight-logo-generated.png',
	logoLight: '/assets/daynight/brand/daynight-logo-generated.png',
	hero: '/assets/daynight/hero/home-05-showroom-exterior.webp',
	homeHeroSlides: [],
	footerImage: '/assets/daynight/footer-premium-request-v2.webp'
} as const;

export const mainNavigation = [
	{ label: 'Начало', href: '/', matchPrefixes: ['/'] },
	{ label: 'Автомобили', href: '/inventory', matchPrefixes: ['/inventory'] },
	{
		label: 'Услуги',
		href: '/services',
		matchPrefixes: [
			'/services',
			'/import',
			'/financing',
			'/calculator',
			'/sell-your-car',
			'/compare'
		]
	},
	{
		label: 'За нас',
		href: '/about',
		matchPrefixes: ['/about', '/agents', '/reviews', '/faqs', '/blog']
	},
	{ label: 'Контакти', href: '/contact', matchPrefixes: ['/contact'] }
] as const;

export const isPrimaryNavActive = (pathname: string, item: (typeof mainNavigation)[number]) =>
	item.matchPrefixes.some(
		(prefix) => pathname === prefix || (prefix !== '/' && pathname.startsWith(prefix))
	);

export const dealerTheme = {
	accent: '#b9161c',
	accentHover: '#8f1016',
	accentContrast: '#ffffff'
} as const;

/** Dealer-owned defaults and approximate suggestions. Visitor preferences never change business facts. */
export const dealerLocaleSettings = {
	default: 'bg',
	supported: ['bg', 'en'],
	currency: 'EUR',
	country: 'BG',
	formatLocales: { en: 'en-GB', bg: 'bg-BG' },
	suggestedLanguages: { BG: 'bg', GB: 'en', US: 'en' },
	preferenceMaxAge: 15552000,
	promptVersion: 'v1'
} as const satisfies SiteLocaleConfig;
