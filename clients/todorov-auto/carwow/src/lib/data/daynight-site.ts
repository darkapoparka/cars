import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = "Изгрев, ул. Транспортна, 5-ти километър, Бургас";

export const daynightSite = {
  "name": "Автосалон Тодоров",
  "shortName": "Тодоров",
  "phone": "0888417282",
  "phoneLabel": "0888 417 282",
  "email": "",
  "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
  "locationShort": "Изгрев, Бургас",
  "hoursLabel": "Пон.–Пет. 09:00–18:00 · Съб. 10:00–16:30 · Нед. почивен ден",
  "mapEmbedSrc": "https://www.google.com/maps?q=%D0%98%D0%B7%D0%B3%D1%80%D0%B5%D0%B2%2C%20%D1%83%D0%BB.%20%D0%A2%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BD%D0%B0%2C%205-%D1%82%D0%B8%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%BC%D0%B5%D1%82%D1%8A%D1%80%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81&output=embed",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD%20%D0%A2%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%20%D0%98%D0%B7%D0%B3%D1%80%D0%B5%D0%B2%2C%20%D1%83%D0%BB.%20%D0%A2%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BD%D0%B0%2C%205-%D1%82%D0%B8%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%BC%D0%B5%D1%82%D1%8A%D1%80%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81",
  "mapLabel": "Автосалон Тодоров, Бургас",
  "sourceInventory": "https://todorovauto.mobile.bg/",
  "inventoryCount": 10,
  "logoLight": "/dealer/logo-light.png",
  "logoDark": "/dealer/logo-dark.png",
  "primaryCta": "Разгледайте обявите",
  "sellCarCta": "Въпрос за автомобил",
  "accountCta": "Свържете се с автосалона",
  "phoneCta": "Обадете се за оглед",
  "heroTitle": "АВТОСАЛОН ТОДОРОВ",
  "heroSubtitle": "Автомобили в Бургас. Изберете, сравнете и уговорете оглед.",
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
			{ label: 'За Автосалон Тодоров', href: '/about' },
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
