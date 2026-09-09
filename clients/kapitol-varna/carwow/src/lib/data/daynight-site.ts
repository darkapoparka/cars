import dealer from './dealer-stock.json';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = `${dealer.address}, ${dealer.city}`;

export const daynightSite = {
  name: dealer.name, shortName: dealer.shortName, phone: dealer.phoneE164, phoneLabel: dealer.phone, secondaryPhone: dealer.secondaryPhone, email: dealer.email,
  location, locationShort: dealer.city, hoursLabel: dealer.hours,
  mapEmbedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=15&hl=bg&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, mapLabel: location,
  sourceInventory: dealer.profile, inventoryCount: dealer.inventory.length,
  logoLight: '/dealer/logo-light.svg', logoDark: '/dealer/logo-dark.svg',
  primaryCta: 'Разгледай автомобилите', sellCarCta: 'Запитване за автомобил', accountCta: 'Свържи се с продавача', phoneCta: 'Попитай за оглед',
  heroTitle: dealer.name, heroSubtitle: `Автомобилни обяви от ${dealer.name}, ${dealer.city}. Потвърдете наличността преди посещение.`,
  reviewCount: daynightReviewCount, reviewCountLabel: daynightReviewCountLabel, reviewLinkLabel: daynightReviewLinkLabel
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
			{ label: 'За Капитол', href: '/about' },
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
