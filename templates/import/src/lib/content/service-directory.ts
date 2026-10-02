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
export const serviceArtwork: Record<AuxeroSupportService['id'], string> = {
	sourcing: '/assets/daynight/services/desktop/sourcing.webp',
	'listing-check': '/assets/daynight/services/desktop/listing-check.webp',
	selling: '/assets/daynight/services/desktop/selling.webp',
	registration: '/assets/daynight/services/desktop/registration.webp',
	viewing: '/assets/daynight/services/desktop/viewing.webp',
	comparison: '/assets/daynight/services/desktop/comparison.webp'
};
type DirectoryCopy = {
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
				summary: 'Подбор според твоя бюджет, изисквания и планове.',
				mobileContext: 'Избор на автомобил',
				mobileTitle: 'Подбрани коли',
				mobileSummary: 'Подбор по бюджет',
				href: '/inventory',
				action: 'Разгледай автомобилите',
				includes: ['Избор според бюджет и изисквания', 'История, оборудване и крайна цена']
			},
			'listing-check': {
				summary: 'История, състояние и разходи — преди да решиш.',
				mobileContext: 'Преди покупка',
				mobileSummary: 'VIN и история',
				href: '/import',
				action: 'Провери автомобил за внос',
				includes: ['Преглед на обява или VIN', 'Уточняване на история и разходи за внос']
			},
			selling: {
				summary: 'От оценката до правилния път за продажба.',
				mobileContext: 'Твоят автомобил',
				mobileTitle: 'Продажба на кола',
				mobileSummary: 'Оценка и продажба',
				href: '/sell-your-car',
				action: 'Разгледай възможностите',
				includes: [
					'Данни, състояние и снимки на автомобила',
					'Обсъждане на очакваната цена и продажбата'
				]
			},
			registration: {
				summary: 'Съдействие с документите, регистрацията и предаването.',
				mobileContext: 'След покупка',
				mobileTitle: 'Регистрация',
				mobileSummary: 'Документи за КАТ',
				href: '/contact?topic=registration#contact-details',
				action: 'Обсъди документите',
				includes: [
					'Уточняване на нужните документи за внос',
					'Подготовка за регистрация и предаване'
				]
			},
			viewing: {
				summary: 'Автомобил и консултант, подготвени за твоята среща.',
				mobileContext: 'На място',
				mobileSummary: 'Час за оглед',
				href: '/contact#contact-details',
				action: 'Виж контакти и адрес',
				includes: [
					'Уговаряне на удобен час за оглед',
					'Автомобил и документи, подготвени за срещата'
				]
			},
			comparison: {
				summary: 'Цена, пробег и оборудване. Ясен избор между моделите.',
				mobileContext: 'Преди решение',
				mobileSummary: 'Цена и оборудване',
				href: '/compare',
				action: 'Сравни автомобили',
				includes: ['Цена, пробег и оборудване на едно място', 'Избор между запазените кандидати']
			}
		}
	},
	en: {
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
				summary: 'A shortlist shaped around your budget and plans.',
				mobileContext: 'Find your car',
				mobileSummary: 'Selection by budget',
				href: '/inventory',
				action: 'Browse available cars',
				includes: [
					'A shortlist for your budget and requirements',
					'History, equipment and total price'
				]
			},
			'listing-check': {
				summary: 'History, condition and costs — before you decide.',
				mobileContext: 'Before buying',
				mobileSummary: 'VIN and history',
				href: '/import',
				action: 'Check a car for import',
				includes: ['Review a listing or VIN', 'Discuss the history and import costs']
			},
			selling: {
				summary: 'From the valuation to the right way to sell.',
				mobileContext: 'Your car',
				mobileSummary: 'Valuation and sale',
				href: '/sell-your-car',
				action: 'Explore selling options',
				includes: [
					'Vehicle details, condition and photographs',
					'Discuss your expected price and sale'
				]
			},
			registration: {
				summary: 'Help with the paperwork, registration and handover.',
				mobileContext: 'After buying',
				mobileTitle: 'Registration',
				mobileSummary: 'Registration docs',
				href: '/contact?topic=registration#contact-details',
				action: 'Discuss the paperwork',
				includes: [
					'Clarify the documents needed for import',
					'Preparation for registration and handover'
				]
			},
			viewing: {
				summary: 'Your car and consultant, ready for your appointment.',
				mobileContext: 'Visit us',
				mobileTitle: 'Book a viewing',
				mobileSummary: 'Viewing appointment',
				href: '/contact#contact-details',
				action: 'View contact details',
				includes: [
					'Arrange a convenient viewing time',
					'The car and documents prepared for your visit'
				]
			},
			comparison: {
				summary: 'Price, mileage and equipment. Make an informed choice.',
				mobileContext: 'Before you decide',
				mobileSummary: 'Price and equipment',
				href: '/compare',
				action: 'Compare cars',
				includes: [
					'Price, mileage and equipment in one place',
					'Choose between your saved candidates'
				]
			}
		}
	}
};
