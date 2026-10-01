import type { Locale } from '$lib/locale/core';

type InventoryDesktopControlsCopy = {
	searchPlaceholder: string;
	allFilters: string;
	removeFilter: string;
	vehicleNoun: (count: number) => string;
	sortLabel: string;
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
		showFilterPanel: 'Покажи панел с филтри',
		hideFilterPanel: 'Скрий панела с филтри'
	},
	en: {
		searchPlaceholder: 'Keyword, features...',
		allFilters: 'All filters',
		removeFilter: 'Remove filter: ',
		vehicleNoun: (count) => (count === 1 ? 'car' : 'cars'),
		sortLabel: 'Sort by',
		showFilterPanel: 'Show filter panel',
		hideFilterPanel: 'Hide filter panel'
	}
};
