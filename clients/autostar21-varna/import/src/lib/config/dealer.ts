import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0887700052",
  "primaryPhoneHref": "tel:+359887700052",
  "marketplacePhoneLabel": "0887700052",
  "marketplacePhoneHref": "tel:+359887700052",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://autostar21.mobile.bg/contacts",
  "viberHref": "viber://chat?number=%2B359887700052",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Ул. Тодор Радев Пенев 5Д, 9009, Варна, България",
  "appointmentNote": "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=AutoStar%2C%20%D0%A3%D0%BB.%20%D0%A2%D0%BE%D0%B4%D0%BE%D1%80%20%D0%A0%D0%B0%D0%B4%D0%B5%D0%B2%20%D0%9F%D0%B5%D0%BD%D0%B5%D0%B2%205%D0%94%2C%209009%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "AutoStar",
  "displayName": "AUTOSTAR",
  "bulgarianName": "AutoStar",
  "domain": "autostar21.mobile.bg",
  "tagline": "AutoStar · Варна",
  "legalNote": "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-04058c0f7e4dcdc5/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-04058c0f7e4dcdc5/logo-on-light.webp",
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
