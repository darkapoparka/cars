import dealer from './dealer-stock.json';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = `${dealer.address}, ${dealer.city}`;

export const daynightSite = {
	name: dealer.name,
	shortName: dealer.shortName,
	phone: dealer.phoneE164,
	phoneLabel: dealer.phone,
	secondaryPhone: dealer.secondaryPhone,
	email: dealer.email,
	location,
	locationShort: dealer.city,
	hoursLabel: dealer.hours,
	mapEmbedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=15&hl=bg&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: location,
	sourceInventory: dealer.profile,
	inventoryCount: dealer.inventory.length,
	logoLight: '/dealer/logo-light.svg',
	logoDark: '/dealer/logo-dark.svg',
	primaryCta: 'Разгледай обявите',
	sellCarCta: 'Обсъдете Ваш автомобил',
	accountCta: 'Свържи се с продавача',
	phoneCta: 'Попитай за оглед',
	heroTitle: dealer.name,
	heroSubtitle: `Автомобилни обяви от ${dealer.name}, ${dealer.city}. Потвърдете статуса и местоположението преди посещение.`,
	reviewCount: daynightReviewCount,
	reviewCountLabel: daynightReviewCountLabel,
	reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
	{ label: 'Начало', href: '/' },
	{ label: 'Автомобили', href: '/inventory' },
	{ label: 'Вашият автомобил', href: '/sell-your-car' },
	{ label: 'Информация', href: '/services' },
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
			{ label: 'Всички обяви', href: '/inventory' },
			{ label: 'Карта', href: '/inventory/map' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'Калкулатор', href: '/calculator' }
		]
	},
	{
		label: 'Вашият автомобил',
		href: '/sell-your-car',
		children: [
			{ label: 'Обсъдете автомобил', href: '/sell-your-car' },
			{ label: 'Подгответе данни', href: '/sell-your-car/request' }
		]
	},
	{
		label: 'Информация',
		href: '/services',
		children: [
			{ label: 'Услуги и условия', href: '/services' },
			{ label: 'Лизинг / финансиране', href: '/financing' },
			{ label: 'ЧЗВ', href: '/faq' }
		]
	},
	{
		label: 'За нас',
		href: '/about',
		children: [
			{ label: `За ${dealer.shortName}`, href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/showroom' },
			{ label: 'Демо екип', href: '/team' },
			{ label: 'Демо отзиви', href: '/reviews' },
			{ label: 'Блог', href: '/blog' },
			{ label: 'Условия', href: '/terms' }
		]
	},
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Автомобилни обяви', href: '/inventory' },
	{ label: 'Карта', href: '/inventory/map' },
	{ label: 'Лизинг / финансиране', href: '/financing' },
	{ label: 'Калкулатор', href: '/calculator' },
	{ label: 'Обсъдете Ваш автомобил', href: '/sell-your-car' },
	{ label: 'Подгответе данни', href: '/sell-your-car/request' },
	{ label: 'Информация', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
