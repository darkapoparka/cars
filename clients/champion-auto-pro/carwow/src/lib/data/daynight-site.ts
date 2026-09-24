import { contactLinks } from '$lib/utils/contact-links';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const phoneE164 = "+359885072555";
const city = "Варна";
const shortName = "Champion Auto Pro";
const district = "Варна";
const street = "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor";
const location = "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor";

/** Dealer-owned bilingual place copy. Client packages replace this bounded object. */
export const daynightDealerText = {
	en: {
		city: 'Варна',
	locationShort: "Варна",
		addressLine: 'Studentski Grad · 18 Atanas Manchev Street',
		address: '18 Atanas Manchev Street, Studentski Grad, Варна'
	},
	bg: {
		city,
		locationShort: `${district}, ${city}`,
		addressLine: `${district} · ${street}`,
		address: location
	}
} as const;

export const daynightSite = {
	name: 'CHAMPION AUTO PRO',
	shortName,
	city,
	region: city,
	countryCode: 'BG',
	locale: 'bg-BG',
	currency: 'EUR',
	phoneE164,
	...contactLinks(phoneE164),
	phone: '359885072555',
	phoneLabel: '0885 072 555',
	email: '',
	location,
	locationShort: `${district}, ${city}`,
	locationLandmark: "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor",
	hoursLabel: 'Огледи с предварителна уговорка',
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: `${shortName}, ${location}`,
	sourceInventory: 'https://daynight.mobile.bg/',
	logoLight: "/dealer-brand/logo-on-dark.webp",
	logoDark: "/dealer-brand/logo-on-light.webp",
	socialLinks: {"facebook":"","instagram":"","youtube":"","tiktok":""},
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: 'CHAMPION AUTO PRO',
	heroSubtitle: 'Варна - Премиум автомобили в Варна с подреден процес за оглед и запитване',
	reviewCount: daynightReviewCount,
	reviewCountLabel: daynightReviewCountLabel,
	reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
	{ label: 'Начало', href: '/' },
	{ label: 'Автомобили', href: '/inventory' },
	{ label: 'Продай', href: '/sell-your-car' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'За нас', href: '/about' },
	{ label: 'Блог', href: '/blog' },
	{ label: 'Контакти', href: '/contact' }
] as const;

export const publicNavGroups = [
	{ label: 'Начало', href: '/' },
	{
		label: 'Автомобили',
		href: '/inventory',
		children: [
			{ label: 'Всички автомобили', href: '/inventory' },
			{ label: 'Карта', href: '/inventory/map' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'Калкулатор', href: '/calculator' }
		]
	},
	{
		label: 'Продай',
		href: '/sell-your-car',
		children: [
			{ label: 'Продай или замени', href: '/sell-your-car' },
			{ label: 'Заявка за оценка', href: '/sell-your-car/request' }
		]
	},
	{
		label: 'Услуги',
		href: '/services',
		children: [
			{ label: 'Дилърски услуги', href: '/services' },
			{ label: 'Финансиране', href: '/financing' },
			{ label: 'ЧЗВ', href: '/faq' }
		]
	},
	{
		label: 'За нас',
		href: '/about',
		children: [
			{ label: 'За Champion Auto Pro', href: '/about' },
			{ label: 'Екип', href: '/team' },
			{ label: 'Отзиви', href: '/reviews' },
			{ label: 'Блог', href: '/blog' },
			{ label: 'Условия', href: '/terms' }
		]
	},
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Налични автомобили', href: '/inventory' },
	{ label: 'Карта на автомобили', href: '/inventory/map' },
	{ label: 'Финансиране', href: '/financing' },
	{ label: 'Калкулатор', href: '/calculator' },
	{ label: 'Продай или замени', href: '/sell-your-car' },
	{ label: 'Заявка за оценка', href: '/sell-your-car/request' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
