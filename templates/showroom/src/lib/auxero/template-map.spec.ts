import { describe, expect, it } from 'vitest';
import { productRouteSources, sourceForProductRoute } from './template-map';

describe('productRouteSources', () => {
	it('locks Home 05 as the homepage source', () => {
		expect(sourceForProductRoute('/')).toBe('home-05.html');
	});

	it('locks inventory and detail template sources', () => {
		expect(sourceForProductRoute('/inventory')).toBe('listing-grid4-columns.html');
		expect(sourceForProductRoute('/inventory?view=3')).toBe('listing-grid3-columns.html');
		expect(sourceForProductRoute('/inventory?view=4')).toBe('listing-grid4-columns.html');
		expect(sourceForProductRoute('/inventory?view=5')).toBe('listing-grid4-columns.html');
		expect(sourceForProductRoute('/inventory?view=map')).toBe('listing-gridstyle-halfmap.html');
		expect(sourceForProductRoute('/inventory/21779200396408437')).toBe('listing-details-3.html');
	});

	it('locks agent and dashboard family template sources', () => {
		expect(sourceForProductRoute('/agents')).toBe('sale-agents.html');
		expect(sourceForProductRoute('/agents/eliqauto-import')).toBe('sale-agents-details.html');
		expect(sourceForProductRoute('/account/messages')).toBe('dashboard.html');
		expect(sourceForProductRoute('/admin/agents')).toBe('sale-agents.html');
		expect(sourceForProductRoute('/admin/inventory/new')).toBe('dashboard.html');
	});

	it('does not expose blocked shop templates as product routes', () => {
		expect(productRouteSources.some((item) => item.source === 'shop.html')).toBe(false);
		expect(productRouteSources.some((item) => item.source === 'check-out.html')).toBe(false);
	});
});
