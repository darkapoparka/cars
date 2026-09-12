import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';

const location = 'гр. Плевен, Индустриална зона, срещу КАТ Плевен';

export const daynightSite = {
	name: 'КЪНЧЕВ',
	shortName: 'КЪНЧЕВ',
	phone: '0878932725',
	phoneLabel: '0878 932 725',
	email: '',
	location,
	locationShort: 'Индустриална зона, Плевен',
	hoursLabel: 'Свържете се предварително за оглед',
	mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
	mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
	mapLabel: 'КЪНЧЕВ, Плевен, България',
	sourceInventory: 'https://kunchev-auto.mobile.bg/',
	inventoryCount: 8,
	logoLight: '/brand/kunchev-logo.png',
	logoDark: '/brand/kunchev-logo.png',
	primaryCta: 'Виж автомобилите',
	sellCarCta: 'Свържи се',
	accountCta: 'Контакти',
	phoneCta: 'Обади се за оглед',
	heroTitle: 'КЪНЧЕВ',
	heroSubtitle: 'Плевен — автомобили с публикувани данни и директен контакт за наличност и оглед',
	reviewCount: daynightReviewCount,
	reviewCountLabel: daynightReviewCountLabel,
	reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
	{ label: 'Начало', href: '/' },
	{ label: 'Автомобили', href: '/inventory' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'За нас', href: '/about' },
	{ label: 'Контакти', href: '/contact' }
] as const;

export const publicNavGroups = [
	{ label: 'Начало', href: '/' },
	{ label: 'Автомобили', href: '/inventory', children: [
		{ label: 'Всички автомобили', href: '/inventory' },
		{ label: 'Карта', href: '/inventory/map' },
		{ label: 'Сравнение', href: '/compare' }
	] },
	{ label: 'Услуги', href: '/services', children: [
		{ label: 'Оглед и информация', href: '/services' },
		{ label: 'Лизинг по обява', href: '/financing' },
		{ label: 'ЧЗВ', href: '/faq' }
	] },
	{ label: 'За нас', href: '/about', children: [
		{ label: 'За КЪНЧЕВ', href: '/about' },
		{ label: 'Контакти', href: '/contact' },
		{ label: 'Условия', href: '/terms' }
	] },
	{ label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
	{ label: 'Автомобили', href: '/inventory' },
	{ label: 'Карта', href: '/inventory/map' },
	{ label: 'Сравнение', href: '/compare' },
	{ label: 'Услуги', href: '/services' },
	{ label: 'ЧЗВ', href: '/faq' },
	{ label: 'Контакти', href: '/contact' }
] as const;
