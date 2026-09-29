import { describe, expect, it, vi } from 'vitest';
vi.mock('$app/environment', () => ({ building: false }));
vi.mock('$app/paths', () => ({ base: '/variant-3' }));
vi.mock('$lib/server/repositories/public-inventory', () => ({
	getPublishedPublicInventory: vi.fn()
}));
import { localeHandle } from './server';
import { load } from '../../routes/locale-settings/+page.server';
import { buildSitemapLocations, renderSitemapXml } from '../server/sitemap';

describe('configured mount boundaries', () => {
	it.each([
		'/en/api/preferences',
		'/variant-2/api/preferences',
		'/variant-3/en/api/preferences',
		'/variant-3/api/preferences/extra'
	])('rejects preference aliases: %s', async (path) => {
		const url = new URL(path, 'https://cars.example');
		const request = new Request(url, {
			method: 'POST',
			headers: { origin: url.origin, 'content-type': 'application/json' },
			body: JSON.stringify({
				action: 'dismiss',
				locale: 'en',
				country: 'GB',
				returnTo: '/variant-3/en'
			})
		});
		const resolve = vi.fn();
		const response = await localeHandle({ event: { url, request, locals: {} }, resolve } as never);
		expect(response.status).toBe(403);
		expect(response.headers.getSetCookie()).toEqual([]);
		expect(resolve).not.toHaveBeenCalled();
	});
	it.each(['/api/preferences', '/variant-3/api/preferences'])(
		'accepts the standalone and mounted unlocalized endpoint: %s',
		async (path) => {
			const url = new URL(path, 'https://cars.example');
			const request = new Request(url, {
				method: 'POST',
				headers: { origin: url.origin, 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'dismiss',
					locale: 'en',
					country: 'GB',
					returnTo: '/variant-3/en'
				})
			});
			const response = await localeHandle({
				event: { url, request, locals: {} },
				resolve: vi.fn()
			} as never);
			expect(response.status).toBe(200);
			expect(response.headers.getSetCookie()).toHaveLength(1);
		}
	);
	it('keeps invalid return fallback inside the mount', async () => {
		const result = await load({
			url: new URL(
				'https://cars.example/variant-3/en/locale-settings?returnTo=https://evil.example'
			),
			locals: { localeState: { locale: 'en' } }
		} as never);
		expect(result).toEqual({ returnTo: '/variant-3/en' });
	});
	it('localizes static, listing and article sitemap entries after the explicit mount', () => {
		const locations = buildSitemapLocations(
			'https://cars.example',
			[{ slug: 'vehicle-123' }],
			'/variant-3',
			[{ slug: 'article-one' }]
		);
		for (const locale of ['en', 'bg']) {
			expect(locations).toContain(`https://cars.example/variant-3/${locale}/inventory/vehicle-123`);
			expect(locations).toContain(`https://cars.example/variant-3/${locale}/blog/article-one`);
		}
		expect(
			locations.every((url) => /^https:\/\/cars.example\/variant-3\/(en|bg)(\/|$)/.test(url))
		).toBe(true);
		expect(renderSitemapXml(['https://cars.example/en?q=a&b=<value>'])).toContain(
			'a&amp;b=&lt;value&gt;'
		);
	});
});
