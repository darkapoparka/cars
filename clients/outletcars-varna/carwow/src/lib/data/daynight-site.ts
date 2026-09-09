import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = "бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България";

export const daynightSite = {
	name: "OUTLETCARS.BG — Варна",
	shortName: "OUTLETCARS.BG",
	phone: "+359898921010",
	phoneLabel: "0898 921 010",
	email: "",
	location,
	locationShort: "бул. Янош Хуняди 518, срещу КАТ Варна, Варна",
	hoursLabel: "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%D0%BE%D1%88%20%D0%A5%D1%83%D0%BD%D1%8F%D0%B4%D0%B8%20518%2C%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D0%9A%D0%90%D0%A2%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
	mapLabel: "OUTLETCARS.BG — Варна, Варна",
	sourceInventory: "https://outletcarsvarna.mobile.bg/",
	inventoryCount: 8,
	logoLight: "/dealer/logo.png",
	logoDark: "/dealer/logo.png",
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: "OUTLETCARS.BG — Варна",
	heroSubtitle: "Автомобили въвъв Варна. Разгледайте предложенията и уговорете оглед.",
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
			{ label: 'За OUTLETCARS.BG — Варна', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/dealer' },
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
