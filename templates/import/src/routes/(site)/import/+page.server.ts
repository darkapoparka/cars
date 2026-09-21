import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { importRequestFormData, importRequestSteps } from '$lib/content/services';
import { listPublicVehicles } from '$lib/server/public-vehicles';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { importCriteriaFromParams } from '$lib/data/import-criteria';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		form: importRequestFormData(url.searchParams.get('vehicle') ?? ''),
		steps: localizedCopy(importRequestSteps, locals.localeState.locale),
		criteria: importCriteriaFromParams(url.searchParams),
		serviceVehicles: inventoryCardsFromVehicles(
			listPublicVehicles().slice(0, 3),
			locals.localeState.locale
		)
	};
};
