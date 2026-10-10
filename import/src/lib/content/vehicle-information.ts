import type { Locale } from '$lib/locale/core';

type VehicleInformationCopy = {
	description: string;
	similar: string;
	inquiry: string;
	summary: string;
	factsTitle: string;
	detailsTitle: string;
	expand: (count: number) => string;
	expandLabel: (count: number) => string;
	collapse: string;
	collapseLabel: string;
};

export const vehicleInformationCopy: Record<Locale, VehicleInformationCopy> = {
	bg: {
		description: 'Описание',
		similar: 'Подобни автомобили',
		inquiry: 'Запитване за автомобила',
		summary: 'Цена, финансиране и оглед',
		factsTitle: 'Основни данни',
		detailsTitle: 'Детайли',
		expand: (count) => `Виж всички (${count})`,
		expandLabel: (count) => `Виж всички ${count} екстри`,
		collapse: 'По-малко',
		collapseLabel: 'Покажи по-малко'
	},
	en: {
		description: 'Description',
		similar: 'Similar cars',
		inquiry: 'Enquire about this car',
		summary: 'Price, financing and viewing',
		factsTitle: 'Vehicle details',
		detailsTitle: 'Details',
		expand: (count) => `View all (${count})`,
		expandLabel: (count) => `View all ${count} features`,
		collapse: 'Show fewer',
		collapseLabel: 'Show fewer'
	}
};

type VehiclePurchaseCopy = {
	label: string;
	paymentOptions: string;
	cash: string;
	financing: string;
	price: string;
	monthly: string;
	monthlyUnit: string;
	calculatePayment: string;
	term: string;
	months: string;
	deposit: string;
	interest: string;
	adjust: string;
	disclosure: string;
};

export const vehiclePurchaseCopy: Record<Locale, VehiclePurchaseCopy> = {
	bg: {
		label: 'Цена и оглед',
		paymentOptions: 'Начин на плащане',
		cash: 'В брой',
		financing: 'Финансиране',
		price: 'Цена на автомобила',
		monthly: 'Ориентировъчна месечна вноска',
		monthlyUnit: '/мес.',
		calculatePayment: 'Изчисли вноска',
		term: 'Срок',
		months: 'месеца',
		deposit: 'Първоначална вноска',
		interest: 'Годишна лихва',
		adjust: 'Промени изчислението',
		disclosure: 'Примерно изчисление, не кредитна оферта. Без такси и застраховки.'
	},
	en: {
		label: 'Price and viewing',
		paymentOptions: 'Payment options',
		cash: 'Cash price',
		financing: 'Financing',
		price: 'Vehicle price',
		monthly: 'Illustrative monthly payment',
		monthlyUnit: '/mo.',
		calculatePayment: 'Calculate payment',
		term: 'Term',
		months: 'months',
		deposit: 'Down payment',
		interest: 'Annual interest',
		adjust: 'Adjust the calculation',
		disclosure: 'Illustrative calculation, not a credit offer. Fees and insurance are not included.'
	}
};
