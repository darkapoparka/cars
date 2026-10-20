import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "+359877346262",
  "primaryPhoneHref": "tel:+359877346262",
  "marketplacePhoneLabel": "+359877346262",
  "marketplacePhoneHref": "tel:+359877346262",
  "emailLabel": "Онлайн запитване",
  "emailHref": "",
  "viberHref": "viber://chat?number=%2B359877346262",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
  "appointmentNote": "Работното време не е публикувано. Потвърдете по телефона преди посещение.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=K-G%20Team%20Auto%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%93%20%D0%AE%D0%B3%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%20%D0%A7%D0%B8%D0%B8%D1%80%D0%B8%D1%82%D0%B5&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "K-G Team Auto",
  "displayName": "K-G TEAM AUTO",
  "bulgarianName": "K-G Team Auto",
  "domain": "kg-team-auto.example.invalid",
  "tagline": "K-G Team Auto · Пловдив",
  "legalNote": "Датирани примерни обяви, не потвърдена наличност. Проверете цена, състояние и местоположение при продавача. Unapproved, unpublished prospect concept. No dealer agreement or media permission evidenced."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-781617de6df8596a/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-781617de6df8596a/logo-on-light.webp",
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
