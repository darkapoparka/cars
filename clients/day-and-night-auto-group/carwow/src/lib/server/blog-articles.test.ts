import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadPublishedBlogArticles } from './blog-articles';
import { editorialGuides } from '$lib/data/editorial-guides';
import { getDealerBySlug } from './repositories/dealers';
import { getPublishedPostArticles } from './repositories/posts';

vi.mock('./app-config', () => ({ getDefaultDealerSlug: () => 'test-dealer' }));
vi.mock('./repositories/dealers', () => ({ getDealerBySlug: vi.fn() }));
vi.mock('./repositories/posts', () => ({ getPublishedPostArticles: vi.fn() }));

describe('public blog source', () => {
	beforeEach(() => vi.resetAllMocks());

	it('serves the authored local guides in the standalone template', async () => {
		expect(await loadPublishedBlogArticles({} as App.Locals)).toBe(editorialGuides);
		expect(getPublishedPostArticles).not.toHaveBeenCalled();
	});

	it('preserves an empty published collection', async () => {
		vi.mocked(getDealerBySlug).mockResolvedValue({ id: 'dealer' } as never);
		vi.mocked(getPublishedPostArticles).mockResolvedValue([]);
		expect(await loadPublishedBlogArticles({ db: {} } as App.Locals)).toEqual([]);
	});

	it('returns the published collection without injecting seed articles', async () => {
		vi.mocked(getDealerBySlug).mockResolvedValue({ id: 'dealer' } as never);
		const published = [{ slug: 'approved-article', title: 'Approved article' }] as never;
		vi.mocked(getPublishedPostArticles).mockResolvedValue(published);
		expect(await loadPublishedBlogArticles({ db: {} } as App.Locals)).toBe(published);
		expect(getPublishedPostArticles).toHaveBeenCalledWith({}, 'dealer');
	});

	it('reports CMS failure instead of substituting sample posts', async () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		try {
			vi.mocked(getDealerBySlug).mockRejectedValue(new Error('CMS unavailable'));
			await expect(loadPublishedBlogArticles({ db: {} } as App.Locals)).rejects.toMatchObject({
				status: 503
			});
		} finally {
			log.mockRestore();
		}
	});
});
