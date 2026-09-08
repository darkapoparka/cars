import type { PageServerLoad } from './$types';
import { auxeroAboutContent } from '$lib/auxero/about';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'about-us.html',
		{
			request,
			routePath: 'about',
			searchParams: url.searchParams
		},
		'About template could not be rendered'
	);

	return {
		about: auxeroAboutContent,
		auxeroFullPage: true,
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/about')
	};
};
