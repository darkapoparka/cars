import type { PageServerLoad } from './$types';
import {
	auxeroCalculatorBudgetLinks,
	auxeroCalculatorData,
	auxeroCalculatorFaqs
} from '$lib/auxero/calculator';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'calculator',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'calculator.html',
		renderOptions,
		'Calculator template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		budgetLinks: auxeroCalculatorBudgetLinks,
		calculator: auxeroCalculatorData,
		faqs: auxeroCalculatorFaqs,
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/calculator')
	};
};
