import type { Locale } from '$lib/locale/core';

type AboutPageCopy = {
	pageTitle: string;
	title: string;
	mobileCaption: string;
	mobileCars: string;
	mobileContact: string;
	processTitle: string;
	teamTitle: string;
	teamContact: string;
	visitLabel: string;
};

export const aboutPageCopy: Record<Locale, AboutPageCopy> = {
	bg: {
		pageTitle: 'За нас',
		title: 'За нас',
		mobileCaption: 'Подбор, внос и проверка на автомобили.',
		mobileCars: 'Коли',
		mobileContact: 'Контакти',
		processTitle: 'Как работим',
		teamTitle: 'Екипът',
		teamContact: 'Свържи се',
		visitLabel: 'Посети'
	},
	en: {
		pageTitle: 'About',
		title: 'About us',
		mobileCaption: 'Car sourcing, import and checks before you buy.',
		mobileCars: 'Cars',
		mobileContact: 'Contact',
		processTitle: 'How we work',
		teamTitle: 'The team',
		teamContact: 'Contact',
		visitLabel: 'Visit'
	}
};

export const aboutProcessArtwork = [
	{ src: '/assets/daynight/banners/about-request-v1.webp' },
	{ src: '/assets/daynight/services/desktop/inspection-reference-v4.webp' },
	{ src: '/assets/daynight/services/desktop/comparison-reference-v4.webp' },
	{ src: '/assets/daynight/services/desktop/selling-reference-v4.webp' }
] as const;
