import type { Locale } from '$lib/locale/core';
import { editorialCopy } from './editorial';

/** Decorative browse artwork; listing photography retains its inventory owner. */
export const homeBrowseArtwork = {
	inventory: {
		src: '/assets/daynight/body-types/all-cars-front.webp',
		width: 720,
		height: 264
	}
} as const;

export const homeHeroModes = {
	buy: { title: { bg: 'Купи автомобил', en: 'Buy a car' }, action: '/inventory' },
	finance: { title: { bg: 'Автомобил на лизинг', en: 'Finance a car' }, action: '/financing' },
	sell: { title: { bg: 'Продай автомобил', en: 'Sell your car' }, action: '/sell-your-car' },
	import: { title: { bg: 'Внеси автомобил', en: 'Import a car' }, action: '/import' }
} as const;

export const homeDiscoveryCopy = {
	bg: {
		viewAll: 'Виж всички',
		browseMakes: 'Разгледай по марка',
		mobileMakes: 'Марки',
		browseTypes: 'Разгледай по тип',
		mobileTypes: 'Типове',
		all: 'Всички',
		reviews: 'Клиентски отзиви',
		customer: 'Клиент',
		guides: 'Полезно за автомобила',
		allGuides: editorialCopy.bg.allGuides
	},
	en: {
		viewAll: 'View all',
		browseMakes: 'Browse by make',
		mobileMakes: 'Browse by make',
		browseTypes: 'Browse by type',
		mobileTypes: 'Browse by type',
		all: 'All',
		reviews: 'Customer reviews',
		customer: 'Customer',
		guides: 'Guides and advice',
		allGuides: editorialCopy.en.allGuides
	}
} as const satisfies Record<Locale, Record<string, string>>;

/** Desktop entry labels; route/query and stock rules retain their current owners. */
export const desktopHomeCopy = {
	bg: {
		mileageUpTo: 'Пробег до',
		anyMileage: 'Без ограничение',
		make: 'Марка',
		chooseMake: 'Избери марка',
		model: 'Модел',
		chooseModel: 'Избери модел',
		price: 'Цена',
		mileage: 'Пробег',
		chooseService: 'Избери услуга',
		buy: 'Купи',
		finance: 'Лизинг',
		sell: 'Продай',
		import: 'Внос',
		search: 'Марка, модел или ключова дума',
		searchAction: 'Търси',
		browseAll: 'Разгледай всички автомобили',
		financeDescription: 'Изчисли месечна вноска за следващия си автомобил.',
		calculatePayment: 'Изчисли вноска',
		chooseCar: 'Избери автомобил',
		continue: 'Продължи',
		withoutListing: 'Нямам линк — търся автомобил',
		manualCar: 'Въведи марка и модел вместо VIN'
	},
	en: {
		mileageUpTo: 'Mileage up to',
		anyMileage: 'Any mileage',
		make: 'Make',
		chooseMake: 'Choose make',
		model: 'Model',
		chooseModel: 'Choose model',
		price: 'Price',
		mileage: 'Mileage',
		chooseService: 'Choose a service',
		buy: 'Buy',
		finance: 'Finance',
		sell: 'Sell',
		import: 'Import',
		search: 'Make, model or keyword',
		searchAction: 'Search',
		browseAll: 'Browse all cars',
		financeDescription: 'Calculate a monthly payment for your next car.',
		calculatePayment: 'Calculate payment',
		chooseCar: 'Choose a car',
		continue: 'Continue',
		withoutListing: 'Find a car without a listing',
		manualCar: 'Enter make and model instead'
	}
} as const satisfies Record<Locale, Record<string, string>>;
