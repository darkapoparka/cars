import { describe, expect, it } from 'vitest';
import { parseInventoryQuery, serializeInventoryQuery } from './inventory-query';
describe('inventory query contract', () => {
	it('preserves repeated and legacy parameters at the boundary', () => {
		const state = parseInventoryQuery(
			new URLSearchParams(
				'brand=BMW&brand=Audi,BMW&priceTo=40000&mileageFrom=1000&FuelType=Petrol&model=X3&bodystyle=SUV'
			)
		);
		expect(state.filters).toMatchObject({
			brand: 'BMW,Audi',
			maxPrice: 40000,
			minMileage: 1000,
			fuel: 'Petrol',
			query: 'X3',
			bodyType: 'SUV'
		});
	});
	it('round-trips normalized filters while preserving locale', () => {
		const original = new URLSearchParams(
			'brand=BMW&priceTo=40000&lang=bg&view=3&sort=lowest-price'
		);
		const state = parseInventoryQuery(original);
		const serialized = serializeInventoryQuery(state, original);
		expect(serialized.get('priceTo')).toBeNull();
		expect(serialized.get('maxPrice')).toBe('40000');
		expect(serialized.get('lang')).toBe('bg');
		expect(parseInventoryQuery(serialized).filters).toEqual(state.filters);
	});
	it('rejects non-finite and negative bounds and constrains density', () => {
		const state = parseInventoryQuery(
			new URLSearchParams('maxPrice=-4&minPrice=Infinity&layout=dashboard&view=5')
		);
		expect(state.filters.maxPrice).toBeUndefined();
		expect(state.filters.minPrice).toBeUndefined();
		expect(state.view).toBe('4');
	});
});
