import type { Locale } from '$lib/locale/core';

export const errorPageCopy = {
	bg: {
		missing: 'Страницата не е намерена',
		unavailable: 'Временно недостъпно',
		missingDescription:
			'Този адрес не е достъпен. Разгледай наличните автомобили или се върни в началото.',
		unavailableDescription: 'Моля, опитай отново след малко или се свържи с нас по телефон.',
		browse: 'Разгледай автомобили',
		home: 'Начало'
	},
	en: {
		missing: 'Page not found',
		unavailable: 'Temporarily unavailable',
		missingDescription:
			'This address is no longer available. Browse our available cars or return home.',
		unavailableDescription: 'Please try again shortly, or contact us by phone.',
		browse: 'Browse cars',
		home: 'Home'
	}
} satisfies Record<Locale, Record<string, string>>;
