import { describe, expect, it } from 'vitest';
import {
	parseInventoryFilters,
	readDesktopSort,
	readMobileSort,
	serializeInventoryFilters
} from './inventory-url';

describe('shared inventory URL contract', () => {
	it('hydrates repeated, comma-separated and old plural links', () => {
		expect(
			parseInventoryFilters(
				new URLSearchParams('brand=BMW,Audi&brand=BMW&brands=VW&models=A8&body=Седан')
			).brand
		).toEqual(['BMW', 'Audi', 'VW']);
	});
	it('round-trips criteria, sort, and unrelated context without stale aliases', () => {
		const source = new URLSearchParams(
			'brands=BMW&feature=Кожа&type=used&availability=incoming&ref=home'
		);
		const criteria = parseInventoryFilters(source);
		const params = serializeInventoryFilters(criteria, 'price-desc', source);
		expect(parseInventoryFilters(params)).toEqual(criteria);
		expect(params.get('sort')).toBe('price-desc');
		expect(params.get('ref')).toBe('home');
		expect(params.has('brands')).toBe(false);
	});
	it('maps shared sort aliases while preserving layout defaults and desktop extra modes', () => {
		expect(readMobileSort('highest-price')).toBe('price-desc');
		expect(readDesktopSort('year-desc')).toBe('newest-year');
		expect(readDesktopSort('highest-mileage')).toBe('highest-mileage');
		expect(readMobileSort(null)).toBe('price-asc');
		expect(readDesktopSort(null)).toBe('best-match');
	});
	it('clears filters and removes their aliases', () => {
		const params = serializeInventoryFilters(
			parseInventoryFilters(new URLSearchParams()),
			'best-match',
			new URLSearchParams('brands=BMW&q=car&sort=highest-price')
		);
		expect(params.toString()).toBe('');
	});
});
