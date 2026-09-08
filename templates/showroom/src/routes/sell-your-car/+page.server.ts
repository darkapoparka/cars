import type { PageServerLoad } from './$types';
import {
	auxeroSellMobileSteps,
	auxeroSellSteps,
	sellCarFormDataWithPrefill,
	sellCarMobileCopy,
	sellYourCarHero
} from '$lib/auxero/sell-your-car';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'sell-your-car',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'sell-your-car.html',
		renderOptions,
		'Sell your car template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		form: sellCarFormDataWithPrefill(url.searchParams.get('vin') ?? ''),
		hero: sellYourCarHero,
		mobileCopy: sellCarMobileCopy,
		mobileSteps: auxeroSellMobileSteps,
		pageDocument,
		steps: auxeroSellSteps,
		...auxeroPublicShellData(pageDocument, locale, '/sell-your-car')
	};
};
