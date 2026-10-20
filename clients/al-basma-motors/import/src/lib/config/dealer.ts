import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "+971 54 342 2222",
  "primaryPhoneHref": "tel:+971543422222",
  "marketplacePhoneLabel": "+971 54 342 2222",
  "marketplacePhoneHref": "tel:+971543422222",
  "emailLabel": "admin@albasmamotors.com",
  "emailHref": "mailto:admin@albasmamotors.com",
  "viberHref": "viber://chat?number=%2B971543422222",
  "facebookHref": "https://www.facebook.com/albasmamotors",
  "instagramHref": "https://www.instagram.com/albasmamotors",
  "tiktokHref": "",
  "reviewsHref": "https://www.facebook.com/albasmamotors",
  "youtubeHref": "",
  "addressLabel": "Showroom 61, Souq Al Haraj, Sharjah, UAE",
  "appointmentNote": "Contact the showroom before travelling",
  "mapEmbedUrl": "https://maps.google.com/maps?q=Showroom%2061%2C%20Souq%20Al%20Haraj%2C%20Sharjah%2C%20UAE&z=16&hl=en&output=embed"
} as const;

export const daynightBrand = {
  "name": "Al Basma Motors",
  "displayName": "AL BASMA MOTORS",
  "bulgarianName": "Al Basma Motors",
  "domain": "albasmamotors.com",
  "tagline": "Al Basma Motors · Sharjah",
  "legalNote": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered. Independent preview. Forms do not send messages and no reservation is created."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-e73f3eb48de7300c/logo-on-light.webp",
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
