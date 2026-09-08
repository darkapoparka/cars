import type { PageServerLoad } from './$types';
import { importRequestFormData } from '$lib/auxero/services';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'import',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'services-center.html',
		renderOptions,
		'Import template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		form: importRequestFormData(url.searchParams.get('vehicle') ?? ''),
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/import')
	};
};
