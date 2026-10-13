import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "052 59 80 10",
  "primaryPhoneHref": "tel:+35952598010",
  "marketplacePhoneLabel": "052 59 80 10",
  "marketplacePhoneHref": "tel:+35952598010",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://porschevarna.mobile.bg/contacts",
  "viberHref": "viber://chat?number=%2B35952598010",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "ул. Ян Хуниади 2, Варна, България",
  "appointmentNote": "Потвърдете работното време директно с автокъщата.",
  "mapEmbedUrl": "https://maps.google.com/maps?q=Porsche%20Varna%2C%20%D1%83%D0%BB.%20%D0%AF%D0%BD%20%D0%A5%D1%83%D0%BD%D0%B8%D0%B0%D0%B4%D0%B8%202%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "Porsche Varna",
  "displayName": "PORSCHE VARNA",
  "bulgarianName": "Porsche Varna",
  "domain": "porschevarna.mobile.bg",
  "tagline": "Porsche Varna · Варна",
  "legalNote": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-a51523c9c6d92684/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-a51523c9c6d92684/logo-on-light.webp",
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
