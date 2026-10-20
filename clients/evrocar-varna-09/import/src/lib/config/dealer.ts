import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0897 002 225",
  "primaryPhoneHref": "tel:+359897002225",
  "marketplacePhoneLabel": "0897 002 225",
  "marketplacePhoneHref": "tel:+359897002225",
  "emailLabel": "Онлайн запитване",
  "emailHref": "",
  "viberHref": "viber://chat?number=%2B359897002225",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Варна, Кайсиева градина, бул. „Цар Освободител“, след Метро, преди светофара за JUMBO",
  "appointmentNote": "Потвърдете работното време и точния вход по телефона",
  "mapEmbedUrl": "https://maps.google.com/maps?q=%D0%95%D0%92%D0%A0%D0%9E%D0%9A%D0%90%D0%A0%20%D0%92%D0%90%D0%A0%D0%9D%D0%90%2009%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%9A%D0%B0%D0%B9%D1%81%D0%B8%D0%B5%D0%B2%D0%B0%20%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%2C%20%D0%B1%D1%83%D0%BB.%20%E2%80%9E%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%E2%80%9C%2C%20%D1%81%D0%BB%D0%B5%D0%B4%20%D0%9C%D0%B5%D1%82%D1%80%D0%BE%2C%20%D0%BF%D1%80%D0%B5%D0%B4%D0%B8%20%D1%81%D0%B2%D0%B5%D1%82%D0%BE%D1%84%D0%B0%D1%80%D0%B0%20%D0%B7%D0%B0%20JUMBO&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "ЕВРОКАР ВАРНА 09",
  "displayName": "ЕВРОКАР ВАРНА 09",
  "bulgarianName": "ЕВРОКАР ВАРНА 09",
  "domain": "evrocarvarna09.mobile.bg",
  "tagline": "ЕВРОКАР ВАРНА 09 · Варна",
  "legalNote": "Демонстрационни автомобили от шаблона, а не наличност на автокъщата. Illustrative template vehicles, not this dealership’s stock. Независим демонстрационен преглед; формите не изпращат съобщения и не създават резервации. Independent demonstration: forms do not send enquiries or create reservations."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/registered-branding/onDark.png",
	logoLight: "/registered-branding/onLight.png",
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
	formatLocales: { en: "en-GB", bg: 'bg-BG' },
	suggestedLanguages: {"BG":"bg","GB":"en","US":"en"},
	preferenceMaxAge: 15552000,
	promptVersion: 'v1'
} as const satisfies SiteLocaleConfig;
