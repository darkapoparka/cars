import { describe, expect, it } from 'vitest';
import {
	emptyImportCriteria,
	importCriteriaFromParams,
	importCriteriaUrl
} from './import-criteria';

describe('import criteria URLs', () => {
	it('round trips country and vehicle criteria without losing the listing or locale', () => {
		const url = new URL('https://example.test/import?vehicle=WBA12345&lang=bg');
		const criteria = {
			origin: 'DE',
			make: 'BMW',
			model: 'X5',
			minYear: '2020',
			maxPrice: '45000',
			fuel: 'Дизел',
			transmission: 'Автомат'
		};
		const next = new URL(importCriteriaUrl(url, criteria), url);
		expect(importCriteriaFromParams(next.searchParams)).toEqual(criteria);
		expect(next.searchParams.get('vehicle')).toBe('WBA12345');
		expect(next.searchParams.get('lang')).toBe('bg');
	});
	it('rejects unsupported countries and malformed numeric or option values', () => {
		expect(
			importCriteriaFromParams(
				new URLSearchParams('origin=ZZ&minYear=3000&maxPrice=-1&fuel=unknown&transmission=unknown')
			)
		).toEqual(emptyImportCriteria);
	});
	it('clears all criteria while retaining unrelated URL state', () => {
		const url = new URL(
			'https://example.test/import?origin=DE&make=BMW&maxPrice=50000&vehicle=listing#request'
		);
		expect(importCriteriaUrl(url, emptyImportCriteria)).toBe('/import?vehicle=listing#request');
	});
});
