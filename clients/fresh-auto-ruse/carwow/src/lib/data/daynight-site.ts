import dealer from './dealer-records.json';
import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = dealer.address;

export const daynightSite = {
 name:dealer.name,shortName:dealer.shortName,phone:dealer.phoneDigits,phoneLabel:dealer.phone,email:dealer.email,location,locationShort:dealer.city,hoursLabel:dealer.hours,
 mapEmbedSrc:`https://www.google.com/maps?q=${encodeURIComponent(dealer.mapQuery)}&z=13&output=embed`,mapUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.mapQuery)}`,mapLabel:dealer.addressNote,sourceInventory:dealer.sourceUrl,inventoryCount:dealer.vehicles.length,
 logoLight:'/dealer/logo-light.png',logoDark:'/dealer/logo-dark.png',primaryCta:'Разгледай обявите',sellCarCta:'Въпрос за продажба',accountCta:'Контакт с търговеца',phoneCta:'Обади се за оглед',heroTitle:dealer.name,heroSubtitle:dealer.tagline,
 reviewCount:daynightReviewCount,reviewCountLabel:daynightReviewCountLabel,reviewLinkLabel:daynightReviewLinkLabel
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
			{ label: 'За Фреш Ауто', href: '/about' },
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
	{ label: 'Публикувани автомобили', href: '/inventory' },
	{ label: 'Карта на автомобили', href: '/inventory/map' },
	{ label: 'Финансиране', href: '/financing' },
	{ label: 'Калкулатор', href: '/calculator' },
	{ label: 'Продай или замени', href: '/sell-your-car' },
	{ label: 'Заявка за оценка', href: '/sell-your-car/request' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
