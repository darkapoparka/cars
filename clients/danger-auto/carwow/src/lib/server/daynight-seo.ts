import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { daynightSite } from '$lib/data/daynight-site';
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
		title: `${vehicle.title} | ${daynightSite.name}`,
		description: `${vehicle.title}${facts.length ? ` - ${facts.join(', ')}` : ''}. Данни от обява на ${daynightSite.name} към ${vehicle.observedAt}; не са независимо проверени. Потвърдете наличността и цената с дилъра.`
	};
}

export { DEFAULT_DESCRIPTION };
