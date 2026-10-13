import { localizedCopy } from '$lib/content/localized';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBlogDetailBySlug } from '$lib/server/blog-state';
export const load: PageServerLoad = ({ url, params, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;

	const detail = getBlogDetailBySlug(params.slug);
	if (!detail) error(404, 'Article not found');
	return localizedCopy(detail, locals.localeState.locale);
};
