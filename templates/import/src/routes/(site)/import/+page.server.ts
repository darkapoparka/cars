import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { importRequestFormData, importRequestSteps } from '$lib/content/services';
import { listPublicVehicles } from '$lib/server/public-vehicles';
import { importCriteriaFromParams } from '$lib/data/import-criteria';
import { importBrowseData } from '$lib/server/import-browse';
import { importEntryFromParams } from '$lib/domain/import-entry';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	const stock = listPublicVehicles();
	const browse = importBrowseData(stock, url.searchParams, locals.localeState.locale);
	return {
		form: importRequestFormData(url.searchParams.get('vehicle') ?? ''),
		steps: localizedCopy(importRequestSteps, locals.localeState.locale),
		criteria: importCriteriaFromParams(url.searchParams),
		desktopEntry: importEntryFromParams(url.searchParams),
		browse,
		serviceVehicles: browse.cards
	};
};
