import type { PageServerLoad } from './$types';
import { getPublicVehicleBySlug } from '$lib/server/public-vehicles';
export const load: PageServerLoad = ({ url }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;

	const vehicle = url.searchParams.get('vehicle');
	const selected = vehicle ? getPublicVehicleBySlug(vehicle) : undefined;
	const price = Number(url.searchParams.get('price'));
	return {
		initialPrice:
			selected?.price ??
			(Number.isFinite(price) && price >= 1000 && price <= 10000000 ? price : 35000),
		vehicleTitle: selected?.title,
		vehicleSlug: selected?.slug
	};
};
