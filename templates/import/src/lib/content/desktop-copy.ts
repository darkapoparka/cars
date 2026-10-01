import type { Locale } from '$lib/locale/core';

type DesktopPageCopy = {
	inventoryCaption: string;
	servicesCaption: string;
	aboutCaption: string;
};

export const desktopCopy: Record<Locale, DesktopPageCopy> = {
	bg: {
		inventoryCaption: 'Сравни цена, пробег и оборудване. Избери автомобил за оглед.',
		servicesCaption: 'Подбор, проверка и съдействие за твоя автомобил.',
		aboutCaption: 'Автомобили от Европа, ясни стъпки и оглед с уговорка.'
	},
	en: {
		inventoryCaption: 'Compare price, mileage and equipment. Find a car to view.',
		servicesCaption: 'Sourcing, checks and support for your next car.',
		aboutCaption: 'European cars, clear next steps and viewings by appointment.'
	}
};
