import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ locals, url }) => {
	const articles = await loadPublishedBlogArticles(locals);

	return {
		articles,
		filters: {
			q: url.searchParams.get('q')?.trim() ?? '',
			category: url.searchParams.get('category')?.trim() ?? '',
			tag: url.searchParams.get('tag')?.trim() ?? '',
			archive: url.searchParams.get('archive')?.trim() ?? ''
		},
		seo: routeSeo('blog')
	};
};
