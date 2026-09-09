import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { DEFAULT_DESCRIPTION, DAY_SITE_TITLE, getPublicStaticRoute } from './public-routes';

export type PageSeo = { title: string; description: string };

export function routeSeo(routePath: string): PageSeo {
	const route = getPublicStaticRoute(routePath ?? '');
	return route
		? { title: route.title, description: route.description }
		: { title: DAY_SITE_TITLE, description: DEFAULT_DESCRIPTION };
}

export function vehicleSeo(vehicle: DayNightVehicle): PageSeo {
	const facts = [vehicle.priceEur, vehicle.mileage, vehicle.fuel, vehicle.transmission]
		.map((value) => (value ?? '').toString().trim())
		.filter(Boolean);

	return {
		title: `${vehicle.title} | Day Night Auto`,
		description: `${vehicle.title}${facts.length ? ` - ${facts.join(', ')}` : ''}. Проверен автомобил от Day Night Auto с опция за финансиране.`
	};
}

export { DEFAULT_DESCRIPTION };
