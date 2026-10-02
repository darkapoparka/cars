import type { Locale } from '$lib/locale/core';

type DesktopPageCopy = {
	inventoryCaption: string;
	servicesCaption: string;
	aboutCaption: string;
	aboutCars: string;
	aboutContact: string;
	contactEnquiry: string;
};

export const desktopCopy: Record<Locale, DesktopPageCopy> = {
	bg: {
		inventoryCaption: 'Сравни цена, пробег и оборудване. Избери автомобил за оглед.',
		servicesCaption: 'Подбор, проверка и съдействие за твоя автомобил.',
		aboutCaption: 'Подбор и внос на автомобили от Европа с проверка преди покупката.',
		aboutCars: 'Разгледай коли',
		aboutContact: 'Свържи се с нас',
		contactEnquiry: 'Изпрати запитване'
	},
	en: {
		inventoryCaption: 'Compare price, mileage and equipment. Find a car to view.',
		servicesCaption: 'Sourcing, checks and support for your next car.',
		aboutCaption: 'Sourcing and importing European cars, with checks before you buy.',
		aboutCars: 'Browse our cars',
		aboutContact: 'Contact us',
		contactEnquiry: 'Send an enquiry'
	}
};
