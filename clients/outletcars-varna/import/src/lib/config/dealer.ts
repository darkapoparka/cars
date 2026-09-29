import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0898 921 010",
  "primaryPhoneHref": "tel:+359898921010",
  "marketplacePhoneLabel": "0898 921 010",
  "marketplacePhoneHref": "tel:+359898921010",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://outletcarsvarna.mobile.bg/contacts",
  "viberHref": "viber://chat?number=%2B359898921010",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България",
  "appointmentNote": "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
  "mapEmbedUrl": "https://maps.google.com/maps?q=OUTLETCARS.BG%20%E2%80%94%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%D0%BE%D1%88%20%D0%A5%D1%83%D0%BD%D1%8F%D0%B4%D0%B8%20518%2C%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D0%9A%D0%90%D0%A2%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "OUTLETCARS.BG — Варна",
  "displayName": "OUTLETCARS.BG — ВАРНА",
  "bulgarianName": "OUTLETCARS.BG — Варна",
  "domain": "outletcarsvarna.mobile.bg",
  "tagline": "OUTLETCARS.BG — Варна · Варна",
  "legalNote": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

export const daynightAssets = {
	logoDark: "/dealer-brand/logo-on-dark.webp",
	logoLight: "/dealer-brand/logo-on-light.webp",
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
	accent: "#c40101",
	accentHover: '#8f1016',
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
