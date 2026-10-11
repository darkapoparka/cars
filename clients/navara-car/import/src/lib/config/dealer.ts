import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0899 192 300",
  "primaryPhoneHref": "tel:+359899192300",
  "marketplacePhoneLabel": "0899 192 300",
  "marketplacePhoneHref": "tel:+359899192300",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://navara.mobile.bg/contacts",
  "viberHref": "viber://chat?number=%2B359899192300",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "бул. „Цар Освободител“, Кайсиева градина, Варна",
  "appointmentNote": "Посещения с предварителна уговорка.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=%D0%9D%D0%B0%D0%B2%D0%B0%D1%80%D0%B0%20%D0%BA%D0%B0%D1%80%2C%20%D0%B1%D1%83%D0%BB.%20%E2%80%9E%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%E2%80%9C%2C%20%D0%9A%D0%B0%D0%B9%D1%81%D0%B8%D0%B5%D0%B2%D0%B0%20%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "Навара кар",
  "displayName": "НАВАРА КАР",
  "bulgarianName": "Навара кар",
  "domain": "navara.mobile.bg",
  "tagline": "Навара кар · Варна",
  "legalNote": "Селекция от обяви към 08.09.2026 г., а не складова наличност в реално време. Потвърдете цената, наличността и данните с продавача. Демонстрационен сайт за преглед — не е официален канал на автокъщата."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/logo-on-dark-20260919.webp",
	logoLight: "/dealer-brand/logo-on-light-20260919.webp",
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
	accent: "#c40101",
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
