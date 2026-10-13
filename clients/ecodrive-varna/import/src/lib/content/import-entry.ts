import type { Locale } from '$lib/locale/core';

export const importEntryCopy = {
	bg: {
		vehicle: 'Линк към обява или VIN',
		vehiclePlaceholder: 'Линк към обява или 17-символен VIN',
		make: 'Марка',
		makePlaceholder: 'Марка, напр. BMW',
		model: 'Модел',
		modelPlaceholder: 'Модел, напр. X5',
		type: 'Тип',
		anyType: 'Всички типове',
		country: 'Пазар за покупка',
		continue: 'Продължи',
		withoutListing: 'Нямам линк',
		withListing: 'Имам линк',
		invalidListing: 'Въведи валиден линк към обява или 17-символен VIN.',
		missingCriteria: 'Избери държава или въведи марка и модел.'
	},
	en: {
		vehicle: 'Listing link or VIN',
		vehiclePlaceholder: 'Listing link or a 17-character VIN',
		make: 'Make',
		makePlaceholder: 'Make, e.g. BMW',
		model: 'Model',
		modelPlaceholder: 'Model, e.g. X5',
		type: 'Type',
		anyType: 'Any type',
		country: 'Purchase market',
		continue: 'Continue',
		withoutListing: 'No listing link',
		withListing: 'I have a link',
		invalidListing: 'Enter a valid listing link or 17-character VIN.',
		missingCriteria: 'Choose a country or enter a make and model.'
	}
} as const satisfies Record<Locale, Record<string, string>>;
