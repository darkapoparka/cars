import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0895 996 559",
  "primaryPhoneHref": "tel:+359895996559",
  "marketplacePhoneLabel": "0895 996 559",
  "marketplacePhoneHref": "tel:+359895996559",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://excellent.cars.bg/",
  "viberHref": "viber://chat?number=%2B359895996559",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
  "appointmentNote": "Понеделник – петък: 08:30–19:00; Събота: 09:00–18:00; Неделя: почивен ден",
  "mapEmbedUrl": "https://maps.google.com/maps?q=Excellent%20Cars%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%20%D0%A5%D1%83%D0%BD%D0%B8%D1%8F%D0%B4%D0%B8%20%D0%B8%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0&output=embed"
} as const;

export const daynightBrand = {
  "name": "Excellent Cars",
  "displayName": "EXCELLENT CARS",
  "bulgarianName": "Excellent Cars",
  "domain": "excellent.cars.bg",
  "tagline": "Excellent Cars · Варна",
  "legalNote": "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-23abd64e1e990a72/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-23abd64e1e990a72/logo-on-light.webp",
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
