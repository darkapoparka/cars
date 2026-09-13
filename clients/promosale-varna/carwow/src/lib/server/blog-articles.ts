import type { DayNightArticle } from '$lib/data/daynight-blog';
import { editorialGuides } from '$lib/data/editorial-guides';
import { error } from '@sveltejs/kit';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { getDealerBySlug } from '$lib/server/repositories/dealers';
import { getPublishedPostArticles } from '$lib/server/repositories/posts';

export async function loadPublishedBlogArticles(locals: App.Locals): Promise<DayNightArticle[]> {
	if (!locals.db) {
		return editorialGuides;
	}

	try {
		const dealer = await getDealerBySlug(locals.db, getDefaultDealerSlug());
		const articles = await getPublishedPostArticles(locals.db, dealer.id);
		return articles;
	} catch (cmsError) {
		console.error('Published blog content could not be loaded:', cmsError);
		error(503, 'Публикациите временно не са достъпни. Опитайте отново по-късно.');
	}
}
