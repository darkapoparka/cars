import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "+971 55 187 5094",
  "primaryPhoneHref": "tel:+971551875094",
  "marketplacePhoneLabel": "+971 55 187 5094",
  "marketplacePhoneHref": "tel:+971551875094",
  "emailLabel": "sales@tdp.ae",
  "emailHref": "mailto:sales@tdp.ae",
  "viberHref": "viber://chat?number=%2B971551875094",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Plot No. 364-0442, Al Quoz Industrial Area 1, Dubai, UAE",
  "appointmentNote": "Contact the dealership before visiting.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=The%20Dealers%20Point%2C%20Plot%20No.%20364-0442%2C%20Al%20Quoz%20Industrial%20Area%201%2C%20Dubai%2C%20UAE&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "The Dealers Point",
  "displayName": "THE DEALERS POINT",
  "bulgarianName": "The Dealers Point",
  "domain": "www.tdp.ae",
  "tagline": "The Dealers Point · Dubai",
  "legalNote": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-2e9ab7c9bd6ca568/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-2e9ab7c9bd6ca568/logo-on-light.webp",
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
