import type { PageServerLoad } from './$types';
import { auxeroBlogListPage } from '$lib/auxero/blog-list';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';
import { listBlogPosts } from '$lib/server/blog-state';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const posts = listBlogPosts();
	const pageDocument = renderAuxeroPageDocument(
		'blog-grid-style-1.html',
		{
			request,
			routePath: 'blog',
			searchParams: url.searchParams
		},
		'Blog template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		blogPage: auxeroBlogListPage,
		pageDocument,
		posts,
		...auxeroPublicShellData(pageDocument, locale, '/blog')
	};
};
