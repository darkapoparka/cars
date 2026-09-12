import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = 'път E79, след отбивката за Блатино, Дупница';

export const daynightSite = {
	previewMode: true,
	name: 'SLAVI CARS',
	shortName: 'Slavi Cars',
	phone: '0895714484',
	phoneLabel: '0895 714 484',
	email: 'slavicars@abv.bg',
	location,
	locationShort: 'Дупница · път E79',
	hoursLabel: 'Огледи с предварителна уговорка',
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: "https://www.google.com/maps/search/?api=1&query=Slavi%20Cars%20%D0%94%D1%83%D0%BF%D0%BD%D0%B8%D1%86%D0%B0%20E79",
	mapLabel: 'Slavi Cars, Дупница, България',
	sourceInventory: 'https://slavicars.mobile.bg/',
	inventoryCount: 8,
	logoLight: '/dealer/brand/logo-dark.png',
	logoDark: '/dealer/brand/logo-light.png',
	primaryCta: 'Разгледай автомобилите',
	sellCarCta: 'Продай автомобил',
	accountCta: 'Свържи се с екипа',
	phoneCta: 'Обади се за оглед',
	heroTitle: 'SLAVI CARS',
	heroSubtitle: "Демо селекция от обяви на Slavi Cars към 09.09.2026 г. Наличността и условията се потвърждават с продавача. Не е жив каталог.",
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
			{ label: 'За Slavi Cars', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/slavi-cars' },
			{ label: 'Екип', href: '/team' },
			{ label: 'Отзиви', href: '/reviews' },
			{ label: 'Блог', href: '/blog' },
			{ label: 'Условия', href: '/terms' }
		]
	},
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Автомобили по обяви', href: '/inventory' },
	{ label: 'Карта на автомобили', href: '/inventory/map' },
	{ label: 'Финансиране', href: '/financing' },
	{ label: 'Калкулатор', href: '/calculator' },
	{ label: 'Продай или замени', href: '/sell-your-car' },
	{ label: 'Заявка за оценка', href: '/sell-your-car/request' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
