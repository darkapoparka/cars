import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = "ул. Напредък 1, Индустриална зона — Север, Пловдив";

export const daynightSite = {
  "name": "icars",
  "shortName": "icars",
  "phone": "0885595555",
  "phoneLabel": "0885 595 555",
  "email": "",
  "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
  "locationShort": "Индустриална зона — Север, Пловдив",
  "hoursLabel": "Оглед с предварителна уговорка. Работно време: потвърдете по телефона.",
  "mapEmbedSrc": "https://www.google.com/maps?q=%D1%83%D0%BB.%20%D0%9D%D0%B0%D0%BF%D1%80%D0%B5%D0%B4%D1%8A%D0%BA%201%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2&output=embed",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=icars%20%D1%83%D0%BB.%20%D0%9D%D0%B0%D0%BF%D1%80%D0%B5%D0%B4%D1%8A%D0%BA%201%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2",
  "mapLabel": "icars, Пловдив",
  "sourceInventory": "https://icars.mobile.bg/",
  "inventoryCount": 10,
  "logoLight": "/dealer/logo-light.png",
  "logoDark": "/dealer/logo-dark.png",
  "primaryCta": "Разгледайте обявите",
  "sellCarCta": "Въпрос за автомобил",
  "accountCta": "Свържете се с автосалона",
  "phoneCta": "Обадете се за оглед",
  "heroTitle": "ICARS",
  "heroSubtitle": "Автомобилни обяви в Пловдив. Сравнете детайлите и уговорете оглед.",
  "reviewCount": 0,
  "reviewCountLabel": "Няма добавени отзиви",
  "reviewLinkLabel": "Информация за отзивите"
};

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
			{ label: 'За icars', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },
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
