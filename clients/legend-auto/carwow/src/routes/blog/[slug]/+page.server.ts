import { error } from '@sveltejs/kit';
import { daynightArticles } from '$lib/data/daynight-blog';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => daynightArticles.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = async ({ params, locals }) => {
	const publishedArticles = await loadPublishedBlogArticles(locals);
	const articles = publishedArticles ?? daynightArticles;
	const article = articles.find((candidate) => candidate.slug === params.slug);

	if (!article) {
		error(404, 'Blog article not found');
	}

	return {
		article,
		articles,
		seo: {
			title: `${article.title} | LEGEND AUTO`,
			description: article.description
		}
	};
};
