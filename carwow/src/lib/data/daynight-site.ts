import { contactLinks } from '$lib/utils/contact-links';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const phoneE164 = "+359888802226";
const city = "Варна";
const shortName = "Перфект Ауто";
const district = "Варна";
const street = "бул. Цар Освободител 110, кв. Победа";
const location = "бул. Цар Освободител 110, кв. Победа";

export const daynightSite = {
	name: "Перфект Ауто",
	shortName,
	city,
	region: city,
	countryCode: "BG",
	locale: "bg-BG",
	currency: "EUR",
	phoneE164,
	...contactLinks(phoneE164),
	phone: "359888802226",
	phoneLabel: "0888 802 226",
	email: "",
	location,
	locationShort: "бул. Цар Освободител 110, кв. Победа",
	locationLandmark: "бул. Цар Освободител 110, кв. Победа",
	hoursLabel: "За работно време и оглед се обадете предварително.",
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: `${shortName}, ${location}`,
	sourceInventory: "https://perfektauto.mobile.bg/",
	logoLight: "/variant-3/assets/brand/logo-on-dark.webp",
	logoDark: "/variant-3/assets/brand/logo-on-accent.webp",
	socialLinks: {"facebook":"","instagram":"","youtube":"","tiktok":""},
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: "Перфект Ауто",
	heroSubtitle: "Варна · Представителни обяви към 10.09.2026 г. Потвърдете наличността и условията по телефона.",
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
			{ label: "За Перфект Ауто", href: '/about' },
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
