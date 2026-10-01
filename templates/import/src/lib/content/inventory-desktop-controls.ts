import type { Locale } from '$lib/locale/core';

export const inventorySortButtonOrder = [
	'best-match',
	'lowest-price',
	'highest-price',
	'lowest-mileage',
	'newest-listed',
	'newest-year'
] as const;

type InventoryDesktopControlsCopy = {
	searchPlaceholder: string;
	allFilters: string;
	removeFilter: string;
	vehicleNoun: (count: number) => string;
	sortLabel: string;
	sortButtons: Record<string, string>;
	showFilterPanel: string;
	hideFilterPanel: string;
};

export const inventoryDesktopControlsCopy: Record<Locale, InventoryDesktopControlsCopy> = {
	bg: {
		searchPlaceholder: 'Ключова дума, екстри...',
		allFilters: 'Всички филтри',
		removeFilter: 'Премахни филтър: ',
		vehicleNoun: (count) => (count === 1 ? 'автомобил' : 'автомобила'),
		sortLabel: 'Подреди по',
		sortButtons: {
			'best-match': 'Най-подходящи',
			'lowest-price': 'Цена ↑',
			'highest-price': 'Цена ↓',
			'lowest-mileage': 'Пробег ↑',
			'newest-listed': 'Нови обяви',
			'newest-year': 'Година ↓'
		},
		showFilterPanel: 'Покажи панел с филтри',
		hideFilterPanel: 'Скрий панела с филтри'
	},
	en: {
		searchPlaceholder: 'Keyword, features...',
		allFilters: 'All filters',
		removeFilter: 'Remove filter: ',
		vehicleNoun: (count) => (count === 1 ? 'car' : 'cars'),
		sortLabel: 'Sort by',
		sortButtons: {
			'best-match': 'Recommended',
			'lowest-price': 'Price ↑',
			'highest-price': 'Price ↓',
			'lowest-mileage': 'Mileage ↑',
			'newest-listed': 'Latest',
			'newest-year': 'Year ↓'
		},
		showFilterPanel: 'Show filter panel',
		hideFilterPanel: 'Hide filter panel'
	}
};
