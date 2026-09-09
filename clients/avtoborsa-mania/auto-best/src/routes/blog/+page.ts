import { blogPosts, filterBlogPosts, parseBlogFilters } from '$data/editorial';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  const filters = parseBlogFilters(url.searchParams);
  return {
    filters,
    posts: filterBlogPosts(blogPosts, filters)
  };
};
