import type { PageServerLoad } from './$types';
import { contactFormData, contactPageInfo } from '$lib/auxero/contact';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'contact-us.html',
		{
			request,
			routePath: 'contact',
			searchParams: url.searchParams
		},
		'Contact template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		form: contactFormData,
		info: contactPageInfo,
		locale,
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/contact')
	};
};
