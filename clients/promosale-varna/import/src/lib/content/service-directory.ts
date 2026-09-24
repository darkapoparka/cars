import type { Locale } from '$lib/locale/core';
import type { AuxeroSupportService } from './services';

type ServiceDetail = { href: string; action: string; includes: string[] };
type DirectoryCopy = {
	description: string;
	search: string;
	title: string;
	count: string;
	empty: string;
	clear: string;
	quickLabel: string;
	quickFilters: { label: string; query: string }[];
	details: Record<AuxeroSupportService['id'], ServiceDetail>;
};

export const serviceDirectoryCopy: Record<Locale, DirectoryCopy> = {
	bg: {
		description:
			'От избора и проверката до документите и предаването. Намери помощ за следващата стъпка.',
		search: 'Търси услуга',
		title: 'Как можем да помогнем',
		count: 'услуги',
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
				href: '/inventory',
				action: 'Разгледай автомобилите',
				includes: ['Избор според бюджет и изисквания', 'История, оборудване и крайна цена']
			},
			'listing-check': {
				href: '/import',
				action: 'Провери автомобил за внос',
				includes: ['Преглед на обява или VIN', 'Уточняване на история и разходи за внос']
			},
			selling: {
				href: '/sell-your-car',
				action: 'Разгледай възможностите',
				includes: [
					'Данни, състояние и снимки на автомобила',
					'Обсъждане на очакваната цена и продажбата'
				]
			},
			registration: {
				href: '/contact?topic=registration#contact-details',
				action: 'Обсъди документите',
				includes: [
					'Уточняване на нужните документи за внос',
					'Подготовка за регистрация и предаване'
				]
			},
			viewing: {
				href: '/contact#contact-details',
				action: 'Виж контакти и адрес',
				includes: [
					'Уговаряне на удобен час за оглед',
					'Автомобил и документи, подготвени за срещата'
				]
			},
			comparison: {
				href: '/compare',
				action: 'Сравни автомобили',
				includes: ['Цена, пробег и оборудване на едно място', 'Избор между запазените кандидати']
			}
		}
	},
	en: {
		description:
			'From choosing and checking a car to paperwork and handover. Find help for your next step.',
		search: 'Search services',
		title: 'How we can help',
		count: 'services',
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
				href: '/inventory',
				action: 'Browse available cars',
				includes: [
					'A shortlist for your budget and requirements',
					'History, equipment and total price'
				]
			},
			'listing-check': {
				href: '/import',
				action: 'Check a car for import',
				includes: ['Review a listing or VIN', 'Discuss the history and import costs']
			},
			selling: {
				href: '/sell-your-car',
				action: 'Explore selling options',
				includes: [
					'Vehicle details, condition and photographs',
					'Discuss your expected price and sale'
				]
			},
			registration: {
				href: '/contact?topic=registration#contact-details',
				action: 'Discuss the paperwork',
				includes: [
					'Clarify the documents needed for import',
					'Preparation for registration and handover'
				]
			},
			viewing: {
				href: '/contact#contact-details',
				action: 'View contact details',
				includes: [
					'Arrange a convenient viewing time',
					'The car and documents prepared for your visit'
				]
			},
			comparison: {
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
