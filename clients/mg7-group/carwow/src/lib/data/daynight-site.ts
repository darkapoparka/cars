import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = "Северна промишлена зона, ул. Атанас Буров 7, Бургас";

export const daynightSite = {
  "name": "MG7 Group",
  "shortName": "MG7 Group",
  "phone": "0876277777",
  "phoneLabel": "0876 277 777",
  "email": "",
  "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
  "locationShort": "Промишлена зона — Север, Бургас",
  "hoursLabel": "Работно време: потвърдете по телефона",
  "mapEmbedSrc": "https://www.google.com/maps?q=%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%88%D0%BB%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%91%D1%83%D1%80%D0%BE%D0%B2%207%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81&output=embed",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=MG7%20Group%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%88%D0%BB%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%91%D1%83%D1%80%D0%BE%D0%B2%207%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81",
  "mapLabel": "MG7 Group, Бургас",
  "sourceInventory": "https://mg7group.mobile.bg/",
  "inventoryCount": 10,
  "logoLight": "/dealer/logo-light.png",
  "logoDark": "/dealer/logo-dark.png",
  "primaryCta": "Разгледайте обявите",
  "sellCarCta": "Въпрос за автомобил",
  "accountCta": "Свържете се с автосалона",
  "phoneCta": "Обадете се за оглед",
  "heroTitle": "MG7 GROUP",
  "heroSubtitle": "Подбрани автомобилни обяви в Бургас. Детайли, сравнение и оглед по уговорка.",
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
			{ label: 'За MG7 Group', href: '/about' },
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
