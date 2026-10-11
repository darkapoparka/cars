import type { Locale } from '$lib/locale/core';

export const editorialCopy = {
	bg: {
		read: 'Прочети статията',
		guides: 'Полезно',
		allGuides: 'Всички статии',
		related: 'Още по темата',
		discuss: 'Обсъди своя автомобил'
	},
	en: {
		read: 'Read article',
		guides: 'Guides',
		allGuides: 'All guides',
		related: 'Related guides',
		discuss: 'Discuss your car'
	}
} as const satisfies Record<Locale, Record<string, string>>;
