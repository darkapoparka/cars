import { describe, expect, it } from 'vitest';
import {
	getRouteBodyClasses,
	normalizeRoutePath,
	routeManagesOwnChrome
} from './storefront-routes';

describe('native storefront route policy', () => {
	it.each(['/', '/home1', '/home1-box'])('preserves the home CSS contract at %s', (path) => {
		expect(getRouteBodyClasses(path)).toEqual([
			'counter-scroll',
			'daynight-home-page',
			'daynight-page-home-header',
			'is_light'
		]);
		expect(routeManagesOwnChrome(path)).toBe(true);
	});
	it.each([
		'/inventory',
		'/inventory/map',
		'/inventory/a-car',
		'/blog/a-new-article',
		'/team/a-new-person',
		'/contact',
		'/about',
		'/favorites',
		'/sell-your-car/request'
	])('does not attach template CSS to %s', (path) => {
		expect(getRouteBodyClasses(path)).toEqual([]);
		expect(routeManagesOwnChrome(path)).toBe(true);
	});
	it.each([
		'/administrator',
		'/blogger',
		'/inventory-old',
		'/unknown',
		'/admin/login',
		'/presentation/home2'
	])('does not accidentally match %s', (path) => {
		expect(routeManagesOwnChrome(path)).toBe(false);
	});
	it('normalizes edge slashes without changing route segments', () => {
		expect(normalizeRoutePath('//inventory/map//')).toBe('inventory/map');
	});
	it('does not share mutable class arrays between requests', () => {
		const first = getRouteBodyClasses('/');
		first.push('foreign');
		expect(getRouteBodyClasses('/')).not.toContain('foreign');
	});
});
