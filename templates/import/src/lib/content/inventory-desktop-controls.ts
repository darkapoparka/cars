import type { Locale } from '$lib/locale/core';
import { homeModeArtwork } from './home-discovery';

type InventoryDesktopControlsCopy = {
	searchPlaceholder: string;
	typeLabel: string;
	typeNavigation: string;
	allTypes: string;
	allFilters: string;
	removeFilter: string;
	vehicleNoun: (count: number) => string;
	sortLabel: string;
	showFilterPanel: string;
	hideFilterPanel: string;
};

export const inventoryDesktopControlsCopy: Record<Locale, InventoryDesktopControlsCopy> = {
	bg: {
		searchPlaceholder: 'Търси автомобил…',
		typeLabel: 'Тип',
		typeNavigation: 'Тип автомобил',
		allTypes: 'Всички',
		allFilters: 'Всички филтри',
		removeFilter: 'Премахни филтър: ',
		vehicleNoun: (count) => (count === 1 ? 'автомобил' : 'автомобила'),
		sortLabel: 'Подреди по',
		showFilterPanel: 'Покажи панел с филтри',
		hideFilterPanel: 'Скрий панела с филтри'
	},
	en: {
		searchPlaceholder: 'Search cars…',
		typeLabel: 'Type',
		typeNavigation: 'Vehicle type',
		allTypes: 'All cars',
		allFilters: 'All filters',
		removeFilter: 'Remove filter: ',
		vehicleNoun: (count) => (count === 1 ? 'car' : 'cars'),
		sortLabel: 'Sort by',
		showFilterPanel: 'Show filter panel',
		hideFilterPanel: 'Hide filter panel'
	}
};

const categoryArtwork = (name: string) => ({
	src: `/assets/daynight/inventory-types/${name}-1x.webp`,
	width: 64,
	height: 48,
	sources: [1, 2, 3].map((density) => ({
		src: `/assets/daynight/inventory-types/${name}-${density}x.webp`,
		density
	}))
});

/** Desktop category shortcuts reuse Home's choice row and canonical body filter. */
export const inventoryCategories = [
	{ value: '', label: { bg: 'Коли', en: 'Cars' }, artwork: homeModeArtwork.buy },
	{ value: 'SUV', label: { bg: 'SUV', en: 'SUVs' }, artwork: categoryArtwork('suv') },
	{ value: 'Motorcycle', label: { bg: 'Мотори', en: 'Bikes' }, artwork: categoryArtwork('bikes') },
	{ value: 'Van', label: { bg: 'Бусове', en: 'Vans' }, artwork: categoryArtwork('vans') }
] as const;

type InventoryDialogCopy = {
	filters: string;
	clearSelection: string;
	search: string;
	keyword: string;
	searchTitle: string;
	searchPlaceholder: string;
	clearSearch: string;
	matchingCars: string;
	matchingCount: (count: number) => string;
	from: string;
	upTo: string;
	showCars: string;
	emptySelection: string;
	previewUnavailable: string;
	noMatches: string;
	adjustSearch: string;
	clearFilters: string;
	searching: string;
	clear: string;
};

/** Native search and filter-dialog labels; inventory options retain their data owner. */
export const inventoryDialogCopy: Record<Locale, InventoryDialogCopy> = {
	bg: {
		filters: 'Филтри',
		clearSelection: 'Изчисти избора',
		search: 'Търсене',
		keyword: 'Марка, модел или ключова дума',
		searchTitle: 'Търсене на автомобили',
		searchPlaceholder: 'Търси марка, модел или ключова дума',
		clearSearch: 'Изчисти търсенето',
		matchingCars: 'Намерени автомобили',
		matchingCount: (count) => `${count} намерени автомобила`,
		from: 'От',
		upTo: 'До',
		showCars: 'Покажи автомобили',
		emptySelection: 'Няма автомобили. Променете или изчистете филтрите.',
		previewUnavailable: 'Прегледът не се зареди. Отвори каталога, за да видиш резултатите.',
		noMatches: 'Няма намерени автомобили',
		adjustSearch: 'Промени търсенето или премахни филтър.',
		clearFilters: 'Изчисти филтрите',
		searching: 'Търсене…',
		clear: 'Изчисти'
	},
	en: {
		filters: 'Filters',
		clearSelection: 'Clear selection',
		search: 'Search',
		keyword: 'Make, model or keyword',
		searchTitle: 'Find a car',
		searchPlaceholder: 'Search make, model or keyword',
		clearSearch: 'Clear search text',
		matchingCars: 'Matching cars',
		matchingCount: (count) => `${count} matching cars`,
		from: 'From',
		upTo: 'Up to',
		showCars: 'Show cars',
		emptySelection: 'No cars match. Adjust or clear your filters.',
		previewUnavailable: 'The preview is unavailable. Open the catalogue to see the results.',
		noMatches: 'No matching cars',
		adjustSearch: 'Change the search or remove a filter.',
		clearFilters: 'Clear filters',
		searching: 'Searching…',
		clear: 'Clear'
	}
};
