import {
	daynightReviewCount,
	daynightReviewCountLabel,
	daynightReviewLinkLabel
} from './daynight-reviews';

const location = 'бул. Цар Освободител 176, Възраждане 1, Варна';

export const daynightSite = {
	name: 'EXCLUSIVE AUTO',
	previewMode: true as boolean,
	shortName: 'Exclusive Auto',
	phone: '+359895303009',
	phoneLabel: '0895 303 009',
	email: '',
	location,
	locationShort: 'Възраждане 1, Варна',
	hoursLabel: 'Потвърдете работното време и огледа по телефона',
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: 'Exclusive Auto, бул. Цар Освободител 176, Варна',
	sourceInventory: 'https://exclusiveauto.mobile.bg/',
	inventoryCount: 8,
	logoLight: '/brand/logo-light.png',
	logoDark: '/brand/logo-dark.png',
	primaryCta: 'Разгледай автомобилите',
	sellCarCta: 'Запитване за автомобил',
	accountCta: 'Свържи се с автокъщата',
	phoneCta: 'Обади се за оглед',
	heroTitle: 'EXCLUSIVE AUTO',
	heroSubtitle: 'Автомобили във Варна. Подбор от публикувани обяви към 09.09.2026 г.; потвърдете наличността и условията преди оглед.',
	reviewCount: daynightReviewCount,
	reviewCountLabel: daynightReviewCountLabel,
	reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
	{ label: 'Начало', href: '/' },
	{ label: 'Автомобили', href: '/inventory' },
	{ label: 'Запитване', href: '/sell-your-car' },
	{ label: 'Информация', href: '/services' },
	{ label: 'За нас', href: '/about' },
	{ label: 'Ръководства', href: '/blog' },
	{ label: 'Контакти', href: '/contact' }
] as const;

export const publicNavGroups = [
	{ label: 'Начало', href: '/' },
	{
		label: 'Автомобили', href: '/inventory',
		children: [
			{ label: 'Всички автомобили', href: '/inventory' },
			{ label: 'Карта', href: '/inventory/map' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'Примерен калкулатор', href: '/calculator' }
		]
	},
	{
		label: 'Запитване', href: '/sell-your-car',
		children: [
			{ label: 'Запитване за оценка или замяна', href: '/sell-your-car' },
			{ label: 'Подготви запитване', href: '/sell-your-car/request' }
		]
	},
	{
		label: 'Информация', href: '/services',
		children: [
			{ label: 'Оглед и условия', href: '/services' },
			{ label: 'Въпроси за финансиране', href: '/financing' },
			{ label: 'ЧЗВ', href: '/faq' }
		]
	},
	{
		label: 'За нас', href: '/about',
		children: [
			{ label: 'За Exclusive Auto', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },
			{ label: 'Контакт с автокъщата', href: '/team' },
			{ label: 'Информация за отзивите', href: '/reviews' },
			{ label: 'Ръководства', href: '/blog' },
			{ label: 'Условия на демото', href: '/terms' }
		]
	},
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Публикувани автомобили', href: '/inventory' },
	{ label: 'Карта на автомобили', href: '/inventory/map' },
	{ label: 'Въпроси за финансиране', href: '/financing' },
	{ label: 'Примерен калкулатор', href: '/calculator' },
	{ label: 'Запитване за оценка или замяна', href: '/sell-your-car' },
	{ label: 'Подготви запитване', href: '/sell-your-car/request' },
	{ label: 'Оглед и условия', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' }
] as const;
