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

/** Retained Cars cutouts for phone browsing; desktop keeps its original artwork. */
export const homeMobileTypeArtwork: Record<string, string> = {
	Electric: '/assets/images/card/card-27.webp',
	Sedan: '/assets/daynight/body-types/mobile/sedan.webp',
	SUV: '/assets/daynight/body-types/mobile/suv.webp',
	'Pickup Truck': '/assets/daynight/body-types/mobile/pickup.webp',
	Hatchback: '/assets/daynight/body-types/mobile/hatchback.webp',
	Crossover: '/assets/daynight/body-types/mobile/crossover.webp',
	Cabriolet: '/assets/daynight/body-types/mobile/cabriolet.webp'
};

export const homeHeroModes = {
	buy: { title: { bg: 'Купи автомобил', en: 'Buy a car' }, action: '/inventory' },
	finance: { title: { bg: 'Автомобил на лизинг', en: 'Finance a car' }, action: '/financing' },
	sell: { title: { bg: 'Продай автомобил', en: 'Sell your car' }, action: '/sell-your-car' },
	import: { title: { bg: 'Внеси автомобил', en: 'Import a car' }, action: '/import' }
} as const;

/** Density-sized decorative cutouts; alpha and optical sizing are baked into the assets. */
const modeArtwork = (
	mode: keyof typeof homeHeroModes,
	{ version = 'v2', width = 48 }: { version?: 'v2' | 'v3'; width?: number } = {}
) => ({
	src: `/assets/daynight/home-modes/${mode}-graphite-${version}-${width * 2}.webp`,
	width: width * 2,
	height: 96,
	sources: [1, 2, 3].map((density) => ({
		src: `/assets/daynight/home-modes/${mode}-graphite-${version}-${width * density}.webp`,
		density
	}))
});

export const homeModeArtwork = {
	buy: modeArtwork('buy', { version: 'v3', width: 64 }),
	finance: modeArtwork('finance', { version: 'v3' }),
	sell: modeArtwork('sell'),
	import: modeArtwork('import')
} as const;

export const homeDiscoveryCopy = {
	bg: {
		viewAll: 'Виж всички',
		browseMakes: 'Разгледай по марка',
		mobileMakes: 'Марки',
		browseTypes: 'Разгледай по тип',
		mobileTypes: 'Типове',
		all: 'Всички',
		onRequest: 'По заявка',
		oneCar: 'кола',
		manyCars: 'коли',
		reviews: 'Примерни отзиви',
		mobileReviews: 'Отзиви',
		customer: 'Клиент',
		guides: 'Полезно за автомобила',
		mobileGuides: 'Полезно',
		allGuides: editorialCopy.bg.allGuides
	},
	en: {
		viewAll: 'View all',
		browseMakes: 'Browse by make',
		mobileMakes: 'Brands',
		browseTypes: 'Browse by type',
		mobileTypes: 'By type',
		all: 'All',
		onRequest: 'On request',
		oneCar: 'car',
		manyCars: 'cars',
		reviews: 'Sample reviews',
		mobileReviews: 'Reviews',
		customer: 'Customer',
		guides: 'Guides and advice',
		mobileGuides: 'Guides',
		allGuides: editorialCopy.en.allGuides
	}
} as const satisfies Record<Locale, Record<string, string>>;

export const homeBrowseCountLabel = (locale: Locale, count: number, all = false) => {
	const copy = homeDiscoveryCopy[locale];
	return count === 0 && !all
		? copy.onRequest
		: `${count} ${count === 1 ? copy.oneCar : copy.manyCars}`;
};

/** Desktop entry labels; route/query and stock rules retain their current owners. */
export const desktopHomeCopy = {
	bg: {
		mileageUpTo: 'Пробег до',
		anyMileage: 'Без ограничение',
		make: 'Марка',
		chooseMake: 'Избери марка',
		model: 'Модел',
		chooseModel: 'Избери модел',
		searchMakes: 'Търси марка…',
		searchModels: 'Търси модел…',
		price: 'Цена',
		mileage: 'Пробег',
		chooseService: 'Избери услуга',
		buy: 'Купи',
		finance: 'Лизинг',
		sell: 'Продай',
		import: 'Внос',
		search: 'Марка, модел или ключова дума',
		searchPlaceholder: 'Марка, модел или ключова дума',
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
		searchMakes: 'Search makes…',
		searchModels: 'Search models…',
		price: 'Price',
		mileage: 'Mileage',
		chooseService: 'Choose a service',
		buy: 'Buy',
		finance: 'Finance',
		sell: 'Sell',
		import: 'Import',
		search: 'Make, model or keyword',
		searchPlaceholder: 'Make, model or keyword',
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
