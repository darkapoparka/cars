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
	const facts = [vehicle.priceLabel, vehicle.mileage, vehicle.fuel, vehicle.transmission]
		.map((value) => (value ?? '').toString().trim())
		.filter(Boolean);

	return {
		title: `${vehicle.title} | Texas Drive Auto`,
		description: `${vehicle.title}${facts.length ? ` - ${facts.join(', ')}` : ''}. Ask Texas Drive Auto about vehicle condition. No dealer financing or payment plans; buyer-arranged funding is separate.`
	};
}

export { DEFAULT_DESCRIPTION };
