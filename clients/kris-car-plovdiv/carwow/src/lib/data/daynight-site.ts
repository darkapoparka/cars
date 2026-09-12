import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив";

export const daynightSite = {
  "name": "Крис Кар",
  "shortName": "Крис Кар",
  "phone": "0885232858",
  "phoneLabel": "0885 232 858",
  "email": "",
  "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
  "locationShort": "Индустриална зона - Изток, Пловдив",
  "hoursLabel": "Пон–Пет 09:00–19:00 · Съб 09:30–19:00 · Нед 10:00–16:00",
  "mapEmbedSrc": "https://www.google.com/maps?q=42.1485358,24.8280636&z=16&output=embed",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=42.1485358%2C24.8280636",
  "mapLabel": "Крис Кар, Пловдив",
  "sourceInventory": "https://kris_car.mobile.bg/",
  "inventoryCount": 8,
  "logoLight": "/dealer/brand/logo-light.png",
  "logoDark": "/dealer/brand/logo-dark.png",
  "primaryCta": "Разгледайте обявите",
  "sellCarCta": "Въпрос за вашия автомобил",
  "accountCta": "Свържете се с автокъщата",
  "phoneCta": "Обадете се за оглед",
  "heroTitle": "Крис Кар",
  "heroSubtitle": "Демонстрационен каталог с 8 обяви към 09.09.2026 г. Наличността и условията се потвърждават с автокъщата.",
  "reviewCount": 0,
  "reviewCountLabel": "Няма публикувани отзиви в демото",
  "reviewLinkLabel": "Информация за отзивите",
  "previewMode": true
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
			{ label: 'За Крис Кар', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/kris-car-plovdiv' },
			{ label: 'Екип', href: '/team' },
			{ label: 'Отзиви', href: '/reviews' },
			{ label: 'Блог', href: '/blog' },
			{ label: 'Условия', href: '/terms' }
		]
	},
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Демонстрационна селекция', href: '/inventory' },
	{ label: 'Карта на автомобили', href: '/inventory/map' },
	{ label: 'Финансиране', href: '/financing' },
	{ label: 'Калкулатор', href: '/calculator' },
	{ label: 'Продай или замени', href: '/sell-your-car' },
	{ label: 'Заявка за оценка', href: '/sell-your-car/request' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
