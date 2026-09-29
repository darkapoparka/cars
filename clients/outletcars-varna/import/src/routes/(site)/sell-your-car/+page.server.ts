import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import {
	auxeroSellMobileSteps,
	auxeroSellSteps,
	sellCarFormDataWithPrefill,
	sellCarMobileCopy
} from '$lib/content/sell-your-car';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		form: localizedCopy(
			sellCarFormDataWithPrefill(url.searchParams.get('vin') ?? ''),
			locals.localeState.locale
		),
		vin: url.searchParams.get('vin') ?? '',
		mobileCopy: localizedCopy(sellCarMobileCopy, locals.localeState.locale),
		mobileSteps: localizedCopy(auxeroSellMobileSteps, locals.localeState.locale),
		steps: localizedCopy(auxeroSellSteps, locals.localeState.locale)
	};
};
