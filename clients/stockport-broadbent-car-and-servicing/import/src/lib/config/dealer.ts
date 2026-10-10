import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "07398 540293",
  "primaryPhoneHref": "tel:+447398540293",
  "marketplacePhoneLabel": "07398 540293",
  "marketplacePhoneHref": "tel:+447398540293",
  "emailLabel": "transitsellers2020@gmail.com",
  "emailHref": "mailto:transitsellers2020@gmail.com",
  "viberHref": "viber://chat?number=%2B447398540293",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Oldmoor Road, Bredbury, Stockport SK6 2QE",
  "appointmentNote": "Contact the dealership before visiting.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=Broadbent%20Car%20and%20Servicing%2C%20Oldmoor%20Road%2C%20Bredbury%2C%20Stockport%20SK6%202QE&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "Broadbent Car and Servicing",
  "displayName": "BROADBENT CAR AND SERVICING",
  "bulgarianName": "Broadbent Car and Servicing",
  "domain": "showroom.ebaymotorspro.co.uk",
  "tagline": "Explore cars and vans in Stockport.",
  "legalNote": "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership. Independent design preview for discussion, not an official dealership website. Forms do not send messages or create reservations."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/logo.webp",
	logoLight: "/dealer-brand/logo.webp",
	hero: '/assets/daynight/hero/home-05-showroom-exterior.webp',
	homeHeroSlides: [],
	footerImage: '/assets/daynight/footer-premium-request-v2.webp',
	vehicleDealerBanner: contactVisitBanner,
	contactVisitBanner,
	contactPhoneBanner: '/assets/daynight/banners/contact-call-desktop-v3.webp',
	contactMessageBanner: '/assets/daynight/banners/contact-message-desktop-v3.webp',
	aboutProcessImage: '/assets/daynight/banners/about-process-desktop-v3.webp'
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
	accent: "#C21C2A",
	accentHover: '#34383d',
	accentContrast: '#ffffff'
} as const;

/** Dealer-owned defaults and approximate suggestions. Visitor preferences never change business facts. */
export const dealerLocaleSettings = {
	default: carsLocale.defaultLocale,
	supported: carsLocale.enabledLocales,
	currency: carsLocale.inventoryCurrency,
	country: carsLocale.dealerCountry,
	formatLocales: { en: "en-GB", bg: 'bg-BG' },
	suggestedLanguages: {"BG":"bg","GB":"en","US":"en"},
	preferenceMaxAge: 15552000,
	promptVersion: 'v1'
} as const satisfies SiteLocaleConfig;
