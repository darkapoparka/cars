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
	{ src: '/assets/process/request-neutral-v1.webp' },
	{ src: '/assets/process/inspection-neutral-v1.webp' },
	{ src: '/assets/process/decision-neutral-v1.webp' },
	{ src: '/assets/process/handover-neutral-v1.webp' }
] as const;
