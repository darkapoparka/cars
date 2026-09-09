import { error } from '@sveltejs/kit';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, locals }) => {
	const articles = await loadPublishedBlogArticles(locals);
	const article = articles.find((candidate) => candidate.slug === params.slug);

	if (!article) {
		error(404, 'Blog article not found');
	}

	return {
		article,
		articles,
		seo: {
			title: `${article.title} | NOVA CARS`,
			description: article.description
		}
	};
};
