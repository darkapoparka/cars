import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { listBlogPosts } from '$lib/server/blog-state';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		posts: localizedCopy(listBlogPosts(), locals.localeState.locale)
	};
};
