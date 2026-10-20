import { describe, expect, it } from 'vitest';
import { filterVehicles, vehicles } from './vehicles';

const source = [
	{ ...vehicles[0], title: 'BMW X3 xDrive', model: 'X3', brand: 'BMW' },
	{ ...vehicles[0], title: 'BMW X5 xDrive', model: 'X5', brand: 'BMW' }
];
describe('keyword and model search', () => {
	it('requires both the selected model and a case-insensitive keyword', () => {
		expect(filterVehicles(source, { query: 'X3', keyword: 'XDRIVE' })).toEqual([source[0]]);
	});
	it('does not broaden a model selection when the keyword has no match', () => {
		expect(filterVehicles(source, { query: 'X3', keyword: 'nonexistent-keyword' })).toEqual([]);
	});
});
