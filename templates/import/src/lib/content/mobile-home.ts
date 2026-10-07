import type { Locale } from '$lib/locale/core';

export const mobileHomeCopy = {
	bg: {
		videos: 'В',
		read: 'Прочети',
		allArticles: 'Виж всички статии',
		contactTitle: 'Да намерим твоя автомобил',
		contactBody: 'Сподели какво търсиш и обсъди следващата стъпка с екипа ни.',
		contactAction: 'Свържи се с нас'
	},
	en: {
		videos: 'On',
		read: 'Read',
		allArticles: 'View all articles',
		contactTitle: 'Let’s find your next car',
		contactBody: 'Tell us what you’re looking for and discuss the next step with our team.',
		contactAction: 'Talk to our team'
	}
} as const satisfies Record<Locale, Record<string, string>>;
