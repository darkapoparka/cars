import { getPostBySlug, posts, type BlogPost } from '$lib/data/blog';

export type BlogDetailState = {
	post: BlogPost;
	related: BlogPost[];
};

export const blogDetailFallbackSlug = posts[0]?.slug ?? 'vnos-ot-kanada-proverka';

export const listBlogPosts = () => posts;

export const getBlogPostBySlug = (slug: string) => getPostBySlug(slug);

export const getRelatedBlogPosts = (post: BlogPost, limit = 3) =>
	posts.filter((item) => item.slug !== post.slug).slice(0, limit);

const blogDetailStateFromPost = (post: BlogPost): BlogDetailState => ({
	post,
	related: getRelatedBlogPosts(post)
});

export const getBlogDetailBySlug = (slug: string) => {
	const post = getBlogPostBySlug(slug);

	return post ? blogDetailStateFromPost(post) : undefined;
};

export const getBlogDetailOrFallback = (slug?: string) => {
	const post = getBlogPostBySlug(slug ?? blogDetailFallbackSlug) ?? posts[0];

	return post ? blogDetailStateFromPost(post) : undefined;
};
