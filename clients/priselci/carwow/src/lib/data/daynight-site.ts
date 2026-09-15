import { contactLinks } from '$lib/utils/contact-links';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const phoneE164 = "+359886251705";
const city = "Варна";
const shortName = "Приселци";
const district = "Варна";
const street = "бул. „Цар Освободител“ 285";
const location = "бул. „Цар Освободител“ 285";

export const daynightSite = {
	name: "Автокъща Приселци",
	shortName,
	city,
	region: city,
	countryCode: "BG",
	locale: "bg-BG",
	currency: "EUR",
	phoneE164,
	...contactLinks(phoneE164),
	phone: "359886251705",
	phoneLabel: "0886 251 705",
	email: "",
	location,
	locationShort: "бул. „Цар Освободител“ 285",
	locationLandmark: "бул. „Цар Освободител“ 285",
	hoursLabel: "Работното време се уточнява по телефона.",
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: `${shortName}, ${location}`,
	sourceInventory: "https://priselci.mobile.bg/",
	logoLight: "/assets/priselci/wordmark.svg",
	logoDark: "/assets/priselci/wordmark-light.svg",
	socialLinks: {"facebook":"","instagram":"","youtube":"","tiktok":""},
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: "Автокъща Приселци",
	heroSubtitle: "Варна · Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
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
			{ label: "За Приселци", href: '/about' },
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
