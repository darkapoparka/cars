import { describe, expect, it } from 'vitest';
import { posts } from '$lib/data/blog';
import {
	blogDetailFallbackSlug,
	getBlogDetailBySlug,
	getBlogDetailOrFallback,
	getRelatedBlogPosts,
	listBlogPosts
} from './blog-state';

describe('blog-state', () => {
	it('lists proposal blog posts in data order', () => {
		expect(listBlogPosts().map((post) => post.slug)).toEqual(posts.map((post) => post.slug));
		expect(listBlogPosts()).toHaveLength(3);
	});

	it('resolves the requested blog detail slug', () => {
		const detail = getBlogDetailBySlug('vnos-ot-kanada-proverka');

		expect(detail?.post.category).toBe('Внос и лизинг');
		expect(detail?.post.content[0]).toContain('Преди да препоръча автомобил');
	});

	it('keeps raw template fallback deterministic for compatibility routes', () => {
		expect(blogDetailFallbackSlug).toBe(posts[0]?.slug);
		expect(getBlogDetailOrFallback('missing')?.post.slug).toBe(posts[0]?.slug);
		expect(getBlogDetailOrFallback()?.post.slug).toBe(posts[0]?.slug);
	});

	it('returns related posts without repeating the current article', () => {
		const detail = getBlogDetailOrFallback('vnos-ot-kanada-proverka');
		const related = getRelatedBlogPosts(detail!.post);

		expect(related).toHaveLength(2);
		expect(related.every((post) => post.slug !== detail!.post.slug)).toBe(true);
		expect(detail?.related.map((post) => post.slug)).toEqual(related.map((post) => post.slug));
	});
});
