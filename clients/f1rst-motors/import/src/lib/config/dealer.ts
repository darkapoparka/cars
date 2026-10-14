import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "+971 4 320 1030",
  "primaryPhoneHref": "tel:+97143201030",
  "marketplacePhoneLabel": "+971 4 320 1030",
  "marketplacePhoneHref": "tel:+97143201030",
  "emailLabel": "info@f1rstmotors.com",
  "emailHref": "mailto:info@f1rstmotors.com",
  "viberHref": "viber://chat?number=%2B97143201030",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE",
  "appointmentNote": "Mon-Thu 10:00-21:00; Friday 14:00-21:00; Saturday 10:00-21:00; Sunday Closed",
  "mapEmbedUrl": "https://maps.google.com/maps?q=F1rst%20Motors%2C%20Danube%20Building%20-%20409%20Sheikh%20Zayed%20Rd%20-%20Al%20Quoz%20-%20Al%20Quoz%201%20-%20Dubai%2C%20UAE&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "F1rst Motors",
  "displayName": "F1RST MOTORS",
  "bulgarianName": "F1rst Motors",
  "domain": "f1rstmotors.com",
  "tagline": "F1rst Motors · Dubai",
  "legalNote": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages. F1rst Motors terms state that site logos/images/content require prior written consent. The committed branding and stock illustrations are internal proposal concepts, not copied official assets."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/logo-on-dark.webp",
	logoLight: "/dealer-brand/logo-on-light.webp",
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
