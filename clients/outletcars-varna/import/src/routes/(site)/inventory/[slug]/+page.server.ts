import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vehicleDetailFromVehicle } from '$lib/server/vehicle-detail';
import { getPublicVehicleBySlug, getRelatedPublicVehicles } from '$lib/server/public-vehicles';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';

export const load: PageServerLoad = ({ url, params, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;

	const vehicle = getPublicVehicleBySlug(params.slug);
	if (!vehicle) error(404, 'Vehicle not found');
	const locale = locals.localeState.locale;
	return {
		locale,
		price: vehicle.price,
		detail: vehicleDetailFromVehicle(vehicle, locale),
		related: inventoryCardsFromVehicles(getRelatedPublicVehicles(vehicle, 4), locale)
	};
};
