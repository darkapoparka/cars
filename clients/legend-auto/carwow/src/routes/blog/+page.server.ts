import { daynightArticles } from '$lib/data/daynight-blog';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const publishedArticles = await loadPublishedBlogArticles(locals);
	const articles = publishedArticles ?? daynightArticles;

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
