import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "+971 54 555 5204",
  "primaryPhoneHref": "tel:+971545555204",
  "marketplacePhoneLabel": "+971 54 555 5204",
  "marketplacePhoneHref": "tel:+971545555204",
  "emailLabel": "Online enquiry",
  "emailHref": "https://www.dubicars.com/dealers/sharjah-al-hamoor-al-thahabi-used-cars-1414",
  "viberHref": "viber://chat?number=%2B971545555204",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Souk Al Haraj, showroom 353, Sharjah",
  "appointmentNote": "Please confirm opening hours and arrange your visit with the dealership.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=Al+Hamoor+Al+Thahabi+Souk+Al+Haraj+353+Sharjah&output=embed"
} as const;

export const daynightBrand = {
  "name": "Al Hamoor Al Thahabi Used Cars",
  "displayName": "AL HAMOOR AL THAHABI USED CARS",
  "bulgarianName": "Al Hamoor Al Thahabi Used Cars",
  "domain": "www.dubicars.com",
  "tagline": "Used cars in Sharjah. Clear details. A direct conversation.",
  "legalNote": "Dated listing samples; confirm price and availability directly with the dealership. Independent design preview. Dated listing samples, not a live stock feed. Confirm availability, price, vehicle condition and location directly. No dealership approval or form delivery is implied."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-f36b0deff0d57ac0/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-f36b0deff0d57ac0/logo-on-light.webp",
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
	accent: '#17191c',
	accentHover: '#34383d',
	accentContrast: '#ffffff'
} as const;

/** Dealer-owned defaults and approximate suggestions. Visitor preferences never change business facts. */
export const dealerLocaleSettings = {
	default: carsLocale.defaultLocale,
	supported: carsLocale.enabledLocales,
	currency: carsLocale.inventoryCurrency,
	country: carsLocale.dealerCountry,
	formatLocales: { en: "en-AE", bg: 'bg-BG' },
	suggestedLanguages: {"BG":"bg","GB":"en","US":"en","AE":"en"},
	preferenceMaxAge: 15552000,
	promptVersion: 'v1'
} as const satisfies SiteLocaleConfig;
