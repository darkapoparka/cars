import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroBlogDetailFromState } from '$lib/auxero/blog-detail';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';
import { getBlogDetailBySlug } from '$lib/server/blog-state';

export const load: PageServerLoad = ({ params, request, url }) => {
	const detailState = getBlogDetailBySlug(params.slug);

	if (!detailState) {
		error(404, 'Blog post not found');
	}

	const content = auxeroBlogDetailFromState(detailState);
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'blog-details-1.html',
		{
			request,
			routePath: `blog/${params.slug}`,
			searchParams: url.searchParams
		},
		'Blog detail template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		content,
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/blog')
	};
};
