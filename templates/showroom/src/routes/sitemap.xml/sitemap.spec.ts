import { describe, expect, it } from 'vitest';
import { posts } from '$lib/data/blog';
import { eliqautoBrand, eliqautoFetchedAt } from '$lib/data/eliqauto';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import { publicSitemapRoutes } from '$lib/auxero/sitemap';
import { GET } from './+server';

describe('Eliqauto sitemap', () => {
	it('publishes public Eliqauto routes and excludes blocked template commerce pages', async () => {
		const response = GET();
		const xml = await response.text();
		const baseUrl = `https://${eliqautoBrand.domain}`;

		expect(response.headers.get('content-type')).toContain('application/xml');
		expect(xml).toContain(`<lastmod>${eliqautoFetchedAt}</lastmod>`);
		for (const route of publicSitemapRoutes) {
			expect(xml).toContain(`<loc>${baseUrl}${route}</loc>`);
		}
		expect(xml).toContain(`<loc>${baseUrl}/inventory/${vehicles[0].slug}</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/agents/${agents[0].slug}</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/blog/${posts[0].slug}</loc>`);
		expect(xml).not.toContain(`${baseUrl}/account`);
		expect(xml).not.toContain(`${baseUrl}/admin`);
		expect(xml).not.toContain('/shop');
		expect(xml).not.toContain('/shopping-cart');
		expect(xml).not.toContain('/check-out');
		expect(xml).not.toContain('/coming-soon');
	});
});
