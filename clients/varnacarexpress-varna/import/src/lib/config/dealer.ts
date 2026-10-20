import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0899155902",
  "primaryPhoneHref": "tel:+359899155902",
  "marketplacePhoneLabel": "0899155902",
  "marketplacePhoneHref": "tel:+359899155902",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://varnacarexpress.mobile.bg/contacts",
  "viberHref": "viber://chat?number=%2B359899155902",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "бул.'Цар Освободител' 200м. след Дом на Камиона посока Аксаково., Варна, България",
  "appointmentNote": "Понеделник 09:00 - 17:30 ч. Вторник 00:00 - 00:00 ч. Сряда 00:00 - 00:00 ч. Четвъртък 00:00 - 00:00 ч. Петък 00:00 - 00:00 ч. Събота 00:00 - 00:00 ч. Неделя Почивен ден",
  "mapEmbedUrl": "https://maps.google.com/maps?q=%D0%92%D0%B0%D1%80%D0%BD%D0%B0%20%D0%9A%D0%B0%D1%80%20%D0%95%D0%BA%D1%81%D0%BF%D1%80%D0%B5%D1%81%2C%20%D0%B1%D1%83%D0%BB.'%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB'%20200%D0%BC.%20%D1%81%D0%BB%D0%B5%D0%B4%20%D0%94%D0%BE%D0%BC%20%D0%BD%D0%B0%20%D0%9A%D0%B0%D0%BC%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%BF%D0%BE%D1%81%D0%BE%D0%BA%D0%B0%20%D0%90%D0%BA%D1%81%D0%B0%D0%BA%D0%BE%D0%B2%D0%BE.%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "Варна Кар Експрес",
  "displayName": "ВАРНА КАР ЕКСПРЕС",
  "bulgarianName": "Варна Кар Експрес",
  "domain": "varnacarexpress.mobile.bg",
  "tagline": "Варна Кар Експрес · Варна",
  "legalNote": "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-59471b9f217ceccd/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-59471b9f217ceccd/logo-on-light.webp",
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
