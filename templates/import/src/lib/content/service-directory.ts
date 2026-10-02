import type { Locale } from '$lib/locale/core';
import { desktopCopy } from './desktop-copy';
import type { AuxeroSupportService } from './services';

export type ServiceDetail = {
	href: string;
	action: string;
	summary: string;
	mobileContext: string;
	mobileTitle?: string;
	mobileSummary: string;
	includes: string[];
};
export const serviceArtwork: Record<
	AuxeroSupportService['id'],
	{ src: string; position?: string }
> = {
	sourcing: { src: '/assets/daynight/services/desktop/sourcing-reference-v4.webp' },
	'listing-check': { src: '/assets/daynight/services/desktop/inspection-reference-v4.webp' },
	selling: { src: '/assets/daynight/services/desktop/selling-reference-v4.webp' },
	registration: { src: '/assets/daynight/services/desktop/documents-reference-v4.webp' },
	viewing: {
		src: '/assets/daynight/services/desktop/viewing-reference-v4.webp',
		position: 'center bottom'
	},
	comparison: { src: '/assets/daynight/services/desktop/comparison-reference-v4.webp' }
};
type DirectoryCopy = {
	pageTitle: string;
	titleDesktop: string;
	searchAction: string;
	learnMore: string;
	description: string;
	search: string;
	title: string;
	count: string;
	countSingular: string;
	empty: string;
	clear: string;
	quickLabel: string;
	quickFilters: { label: string; query: string }[];
	details: Record<AuxeroSupportService['id'], ServiceDetail>;
};

export const serviceDirectoryCopy: Record<Locale, DirectoryCopy> = {
	bg: {
		pageTitle: 'Услуги',
		titleDesktop: 'Услуги за твоя автомобил',
		searchAction: 'Търси',
		learnMore: 'Виж повече',
		description: desktopCopy.bg.servicesCaption,
		search: 'Търси услуга',
		title: 'Как можем да помогнем',
		count: 'услуги',
		countSingular: 'услуга',
		empty: 'Няма намерени услуги. Опитай с „внос“, „документи“ или „продажба“.',
		clear: 'Изчисти търсенето',
		quickLabel: 'Бърз избор на услуга',
		quickFilters: [
			{ label: 'Всички', query: '' },
			{ label: 'Проверка / VIN', query: 'VIN' },
			{ label: 'Продажба', query: 'продажба' },
			{ label: 'Документи', query: 'документи' },
			{ label: 'Оглед', query: 'оглед' }
		],
		details: {
			sourcing: {
				summary: 'Автомобил според твоя бюджет.',
				mobileContext: 'Избор на автомобил',
				mobileTitle: 'Подбрани коли',
				mobileSummary: 'Подбор по бюджет',
				href: '/inventory',
				action: 'Разгледай',
				includes: ['Избор според бюджет и изисквания', 'История, оборудване и крайна цена']
			},
			'listing-check': {
				summary: 'История и разходи преди покупка.',
				mobileContext: 'Преди покупка',
				mobileSummary: 'VIN и история',
				href: '/import',
				action: 'Провери VIN',
				includes: ['Преглед на обява или VIN', 'Уточняване на история и разходи за внос']
			},
			selling: {
				summary: 'Оценка и подготовка за продажба.',
				mobileContext: 'Твоят автомобил',
				mobileTitle: 'Продажба на кола',
				mobileSummary: 'Оценка и продажба',
				href: '/sell-your-car',
				action: 'Заяви продажба',
				includes: [
					'Данни, състояние и снимки на автомобила',
					'Обсъждане на очакваната цена и продажбата'
				]
			},
			registration: {
				summary: 'Документи, регистрация и предаване.',
				mobileContext: 'След покупка',
				mobileTitle: 'Регистрация',
				mobileSummary: 'Документи за КАТ',
				href: '/contact?topic=registration#contact-details',
				action: 'Запитване',
				includes: [
					'Уточняване на нужните документи за внос',
					'Подготовка за регистрация и предаване'
				]
			},
			viewing: {
				summary: 'Удобен час за подготвен оглед.',
				mobileContext: 'На място',
				mobileSummary: 'Час за оглед',
				href: '/contact#contact-details',
				action: 'Уговори оглед',
				includes: [
					'Уговаряне на удобен час за оглед',
					'Автомобил и документи, подготвени за срещата'
				]
			},
			comparison: {
				summary: 'Цена, пробег и оборудване.',
				mobileContext: 'Преди решение',
				mobileSummary: 'Цена и оборудване',
				href: '/compare',
				action: 'Сравни',
				includes: ['Цена, пробег и оборудване на едно място', 'Избор между запазените кандидати']
			}
		}
	},
	en: {
		pageTitle: 'Services',
		titleDesktop: 'Services for your car',
		searchAction: 'Search',
		learnMore: 'Learn more',
		description: desktopCopy.en.servicesCaption,
		search: 'Search services',
		title: 'How we can help',
		count: 'services',
		countSingular: 'service',
		empty: 'No matching services. Try “import”, “documents” or “selling”.',
		clear: 'Clear search',
		quickLabel: 'Quick service filters',
		quickFilters: [
			{ label: 'All', query: '' },
			{ label: 'Check / VIN', query: 'VIN' },
			{ label: 'Selling', query: 'selling' },
			{ label: 'Documents', query: 'documents' },
			{ label: 'Viewing', query: 'viewing' }
		],
		details: {
			sourcing: {
				summary: 'A car that fits your budget.',
				mobileContext: 'Find your car',
				mobileSummary: 'Selection by budget',
				href: '/inventory',
				action: 'Browse cars',
				includes: [
					'A shortlist for your budget and requirements',
					'History, equipment and total price'
				]
			},
			'listing-check': {
				summary: 'History and costs before buying.',
				mobileContext: 'Before buying',
				mobileSummary: 'VIN and history',
				href: '/import',
				action: 'Check a VIN',
				includes: ['Review a listing or VIN', 'Discuss the history and import costs']
			},
			selling: {
				summary: 'Valuation and preparation for sale.',
				mobileContext: 'Your car',
				mobileSummary: 'Valuation and sale',
				href: '/sell-your-car',
				action: 'Sell your car',
				includes: [
					'Vehicle details, condition and photographs',
					'Discuss your expected price and sale'
				]
			},
			registration: {
				summary: 'Paperwork, registration and handover.',
				mobileContext: 'After buying',
				mobileTitle: 'Registration',
				mobileSummary: 'Registration docs',
				href: '/contact?topic=registration#contact-details',
				action: 'Enquire',
				includes: [
					'Clarify the documents needed for import',
					'Preparation for registration and handover'
				]
			},
			viewing: {
				summary: 'A prepared car at a time that suits you.',
				mobileContext: 'Visit us',
				mobileTitle: 'Book a viewing',
				mobileSummary: 'Viewing appointment',
				href: '/contact#contact-details',
				action: 'Arrange a viewing',
				includes: [
					'Arrange a convenient viewing time',
					'The car and documents prepared for your visit'
				]
			},
			comparison: {
				summary: 'Price, mileage and equipment.',
				mobileContext: 'Before you decide',
				mobileSummary: 'Price and equipment',
				href: '/compare',
				action: 'Compare',
				includes: [
					'Price, mileage and equipment in one place',
					'Choose between your saved candidates'
				]
			}
		}
	}
};
