import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

export const daynightSite = {
	name: 'АСКО 96',
	shortName: 'АСКО 96',
	phone: '0899769696',
	phoneLabel: '0899 76 96 96',
	email: 'askogroup@abv.bg',
	location: 'гр. София, бул. „Ботевградско шосе“ 300',
	mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%90%D0%A1%D0%9A%D0%9E%2096%2C%20%D0%91%D0%BE%D1%82%D0%B5%D0%B2%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%20%D1%88%D0%BE%D1%81%D0%B5%20300%2C%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F",
	mapLabel: 'АСКО 96, София, България',
	sourceInventory: 'https://asko96.mobile.bg/',
	inventoryCount: 16,
	logoLight: '/assets/asko96/asko96-wordmark.png',
	logoDark: '/assets/asko96/asko96-wordmark.png',
	primaryCta: 'Виж наличните автомобили',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Вход / Профил',
	phoneCta: 'Обади се за оглед',
	heroTitle: 'АСКО 96',
	heroSubtitle: 'София - Премиум автомобили в София с подреден процес за оглед и запитване',
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
			{ label: 'За АСКО 96', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },
			{ label: 'Екип', href: '/team' },
			{ label: 'Услуги и информация', href: '/reviews' },
			{ label: 'Полезно', href: '/blog' },
			{
				label: 'Покупка без риск',
				href: '/blog/kak-da-kupim-upotrebyavan-avtomobil'
			},
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
