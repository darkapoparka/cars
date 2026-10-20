import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0887 600 565",
  "primaryPhoneHref": "tel:+359887600565",
  "marketplacePhoneLabel": "0887 600 565",
  "marketplacePhoneHref": "tel:+359887600565",
  "emailLabel": "Онлайн запитване",
  "emailHref": "",
  "viberHref": "viber://chat?number=%2B359887600565",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "Варна, Победа, бул. „Христо Смирненски“, до Вятърна мелница",
  "appointmentNote": "Потвърдете работното време и огледа по телефона",
  "mapEmbedUrl": "https://maps.google.com/maps?q=%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D0%B0%2C%20%D0%B1%D1%83%D0%BB.%20%E2%80%9E%D0%A5%D1%80%D0%B8%D1%81%D1%82%D0%BE%20%D0%A1%D0%BC%D0%B8%D1%80%D0%BD%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%E2%80%9C%2C%20%D0%B4%D0%BE%20%D0%92%D1%8F%D1%82%D1%8A%D1%80%D0%BD%D0%B0%20%D0%BC%D0%B5%D0%BB%D0%BD%D0%B8%D1%86%D0%B0&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "Европа",
  "displayName": "ЕВРОПА",
  "bulgarianName": "Европа",
  "domain": "evropavarna.mobile.bg",
  "tagline": "Европа · Варна",
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
