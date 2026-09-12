import type { PageServerLoad } from './$types';
import { contactFormData, contactPageInfo } from '$lib/auxero/contact';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

// Contact uses the same rendered Auxero document and public shell as the other public routes.
// Its owning component provides dedicated desktop and mobile content without mixing the
// route-scoped Tailwind layer into the unlayered legacy theme cascade.
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
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/contact')
	};
};
