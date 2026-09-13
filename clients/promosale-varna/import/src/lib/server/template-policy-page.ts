import { templatePolicies, type TemplatePolicyKey } from '$lib/data/template-policies';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from './auxero-page';
import { auxeroPublicShellData } from './auxero-public-shell';
export const loadTemplatePolicy = (
	key: TemplatePolicyKey,
	{ request, url }: { request: Request; url: URL }
) => {
	const pageDocument = renderAuxeroPageDocument(
		'blog-grid-style-1.html',
		{ request, routePath: key, searchParams: url.searchParams },
		'Policy page could not be rendered'
	);
	return {
		auxeroFullPage: true,
		policy: templatePolicies[key],
		pageDocument,
		...auxeroPublicShellData(pageDocument, resolveLocale(url.searchParams.get('lang')), '/' + key)
	};
};
