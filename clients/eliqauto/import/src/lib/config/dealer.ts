import { carsLocale } from './cars-locale';
import type { SiteLocaleConfig } from './locale-contract';
/** Approved sample identity. Dealer copies customize this file, content and assets, not components. */
export const daynightContact = {
  "primaryPhoneLabel": "0896 781 662",
  "primaryPhoneHref": "tel:+359896781662",
  "marketplacePhoneLabel": "0896 781 662",
  "marketplacePhoneHref": "tel:+359896781662",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://eliqauto.mobile.bg/",
  "viberHref": "viber://chat?number=%2B359896781662",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw",
  "addressLabel": "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
  "appointmentNote": "Пон.–пет. 09:30–19:00 · Съб.–нед. 09:30–17:00 · Потвърдете огледа по телефона",
  "mapEmbedUrl": "https://maps.google.com/maps?q=ELIQ%20AUTO%2C%20%D1%83%D0%BB.%20%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B0%2C%20%D0%BD%D0%B0%20%D0%B3%D1%8A%D1%80%D0%B1%D0%B0%20%D0%BD%D0%B0%20%D0%93%D1%80%D0%BE%D0%B1%D0%B8%D1%89%D0%B5%D0%BD%20%D0%BF%D0%B0%D1%80%D0%BA%2C%20%D0%9F%D0%B0%D0%B7%D0%B0%D1%80%D0%B4%D0%B6%D0%B8%D0%BA&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "ELIQ AUTO",
  "displayName": "ELIQ AUTO",
  "bulgarianName": "ELIQ AUTO",
  "domain": "eliqauto.mobile.bg",
  "tagline": "ELIQ AUTO · Пазарджик",
  "legalNote": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

const contactVisitBanner = '/assets/daynight/banners/contact-visit-desktop-v3.webp';

export const daynightAssets = {
	// Dealer copies replace these paths once; shared headers, footers and banners reuse them.
	// The suffix names the background: logoDark is for dark surfaces, logoLight for light ones.
	logoDark: "/dealer-brand/v2-b9c4f7939487513f/logo-on-dark.webp",
	logoLight: "/dealer-brand/v2-b9c4f7939487513f/logo-on-light.webp",
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
