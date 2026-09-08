import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { vehicles } from '$lib/data/vehicles';
import { resolveLocale } from '$lib/i18n/messages';
import { getCompareVehicles } from '$lib/server/compare-state';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'compare',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'compare.html',
		renderOptions,
		'Compare template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		allVehicles: compareVehiclesFromVehicles(vehicles, locale),
		locale,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions), locale),
		...auxeroPublicShellData(pageDocument, locale, '/compare')
	};
};
