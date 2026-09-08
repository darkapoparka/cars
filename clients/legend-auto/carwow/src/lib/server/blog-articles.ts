import type { DayNightArticle } from '$lib/data/daynight-blog';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { getDealerBySlug } from '$lib/server/repositories/dealers';
import { getPublishedPostArticles } from '$lib/server/repositories/posts';

export async function loadPublishedBlogArticles(
	locals: App.Locals
): Promise<DayNightArticle[] | undefined> {
	if (!locals.db) {
		return undefined;
	}

	try {
		const dealer = await getDealerBySlug(locals.db, getDefaultDealerSlug());
		const articles = await getPublishedPostArticles(locals.db, dealer.id);
		return articles.length ? articles : undefined;
	} catch (cmsError) {
		console.warn('Falling back to seeded blog content:', cmsError);
		return undefined;
	}
}
