import type { PageServerLoad } from './$types';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

const DEFAULT_PRICE = 35000;

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'financing',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'services-center.html',
		renderOptions,
		'Financing template could not be rendered'
	);

	const priceParam = Number(url.searchParams.get('price'));
	const price =
		Number.isFinite(priceParam) && priceParam >= 1000 && priceParam <= 500000
			? Math.round(priceParam)
			: DEFAULT_PRICE;

	return {
		auxeroFullPage: true,
		financing: { price },
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/financing')
	};
};
