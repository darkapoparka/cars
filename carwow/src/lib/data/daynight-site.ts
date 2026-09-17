import { contactLinks } from '$lib/utils/contact-links';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const phoneE164 = "+359877346262";
const city = "Пловдив";
const shortName = "K-G Team Auto";
const district = "Пловдив";
const street = "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите";
const location = "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите";

export const daynightSite = {
	name: "K-G Team Auto",
	shortName,
	city,
	region: city,
	countryCode: "BG",
	locale: "bg-BG",
	currency: "EUR",
	phoneE164,
	...contactLinks(phoneE164),
	phone: "359877346262",
	phoneLabel: "+359877346262",
	email: "",
	location,
	locationShort: "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
	locationLandmark: "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
	hoursLabel: "Работното време не е публикувано. Потвърдете по телефона преди посещение.",
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: `${shortName}, ${location}`,
	sourceInventory: "",
	logoLight: "/variant-3/assets/brand/logo-on-dark.webp",
	logoDark: "/variant-3/assets/brand/logo-on-light.webp",
	socialLinks: {"facebook":"","instagram":"","youtube":"","tiktok":""},
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: "K-G Team Auto",
	heroSubtitle: "Пловдив · Датирани примерни обяви, не потвърдена наличност. Проверете цена, състояние и местоположение при продавача.",
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
			{ label: "За K-G Team Auto", href: '/about' },
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
