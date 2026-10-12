import type { Locale } from '$lib/locale/core';

export const vehicleCardCopy = {
	bg: {
		save: 'Запази ',
		compare: 'Сравни ',
		specifications: 'Характеристики',
		financing: 'Ориентировъчно финансиране: ',
		details: 'Виж детайли'
	},
	en: {
		save: 'Save ',
		compare: 'Compare ',
		specifications: 'Specifications',
		financing: 'Illustrative financing: ',
		details: 'View details'
	}
} as const satisfies Record<Locale, Record<string, string>>;
