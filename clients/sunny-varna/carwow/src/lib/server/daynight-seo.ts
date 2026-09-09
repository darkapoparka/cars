import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { dealer } from '$lib/data/dealer';
import { DEFAULT_DESCRIPTION, DAY_SITE_TITLE, getPublicStaticRoute } from './public-routes';

export type PageSeo = { title: string; description: string };

export function routeSeo(routePath: string): PageSeo {
	const route = getPublicStaticRoute(routePath ?? '');
	return route
		? { title: route.title, description: route.description }
		: { title: DAY_SITE_TITLE, description: DEFAULT_DESCRIPTION };
}

export function vehicleSeo(vehicle: DayNightVehicle): PageSeo {
	const price = typeof vehicle.priceEur === 'number' && Number.isFinite(vehicle.priceEur) && vehicle.priceEur > 0
		? new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'EUR' }).format(vehicle.priceEur)
		: 'Цена при запитване';
	const facts = [price, vehicle.mileage, vehicle.fuel, vehicle.transmission]
		.map((value) => (value ?? '').toString().trim())
		.filter(Boolean);

	return {
		title: `${vehicle.title} | ${DAY_SITE_TITLE}`,
		description: `${vehicle.title}${facts.length ? ` — ${facts.join(', ')}` : ''}. Обява в демонстрационната извадка на ${dealer.name}; данните са по обява, а наличността и условията се потвърждават от продавача.`
	};
}

export { DEFAULT_DESCRIPTION };
