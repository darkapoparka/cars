import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vehicleDetailFromVehicle } from '$lib/auxero/detail';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';
import { getVehicleDetailBySlug } from '$lib/server/vehicle-detail-state';

export const load: PageServerLoad = ({ params, request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const vehicle = getVehicleDetailBySlug(params.slug);

	if (!vehicle) {
		error(404, 'Vehicle not found');
	}

	const pageDocument = renderAuxeroPageDocument(
		'listing-details-3.html',
		{
			request,
			routePath: `inventory/${params.slug}`,
			searchParams: url.searchParams,
			slug: vehicle.slug
		},
		'Vehicle detail template could not be rendered'
	);

	const metaDescription =
		locale === 'bg'
			? `${vehicle.title} — ${vehicle.year}, ${vehicle.mileage}, ${vehicle.fuel}. Цена ${vehicle.priceLabel}. Провери история, оборудване и снимки в Day Night Auto.`
			: `${vehicle.title} — ${vehicle.year}, ${vehicle.mileage}, ${vehicle.fuel}. Price ${vehicle.priceLabel}. Check history, equipment and photos at Day Night Auto.`;

	return {
		auxeroFullPage: true,
		detail: vehicleDetailFromVehicle(vehicle, locale),
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/inventory', metaDescription)
	};
};
