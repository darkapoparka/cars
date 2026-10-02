import type { Locale } from '$lib/locale/core';

type VehicleInformationCopy = {
	factsTitle: string;
	detailsTitle: string;
	expand: (count: number) => string;
	expandLabel: (count: number) => string;
	collapse: string;
	collapseLabel: string;
};

export const vehicleInformationCopy: Record<Locale, VehicleInformationCopy> = {
	bg: {
		factsTitle: 'Основни данни',
		detailsTitle: 'Детайли',
		expand: (count) => `Виж всички (${count})`,
		expandLabel: (count) => `Виж всички ${count} екстри`,
		collapse: 'По-малко',
		collapseLabel: 'Покажи по-малко'
	},
	en: {
		factsTitle: 'Vehicle details',
		detailsTitle: 'Details',
		expand: (count) => `View all (${count})`,
		expandLabel: (count) => `View all ${count} features`,
		collapse: 'Show fewer',
		collapseLabel: 'Show fewer'
	}
};
