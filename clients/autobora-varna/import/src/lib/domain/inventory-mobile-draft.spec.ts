import { describe, expect, it } from 'vitest';
import {
	inventoryMobileDraftFromQuery,
	mergeInventoryModelOptions,
	serializeInventoryMobileDraft
} from './inventory-mobile-draft';
import { parseInventoryQuery } from './inventory-query';

describe('mobile inventory draft', () => {
	it('restores exact URL bounds rather than rounding to available presets', () => {
		const draft = inventoryMobileDraftFromQuery(
			new URLSearchParams(
				'priceFrom=12345&priceTo=45678&mileageTo=87654&minYear=2017&yearTo=2023&brand=BMW&brand=Audi&model=X3&model=A4'
			)
		);
		expect(draft).toMatchObject({
			price: '12345-45678',
			mileage: '-87654',
			year: '2017-2023',
			brand: 'BMW,Audi',
			model: 'X3,A4'
		});
	});
	it('retains keyword, custom limits, repeated context and display state when sorting', () => {
		const original = new URLSearchParams(
			'keyword=xDrive&maxPrice=45678&maxMileage=87654&lang=en&campaign=one&campaign=two&view=3&layout=dashboard&page=3'
		);
		const draft = inventoryMobileDraftFromQuery(original);
		draft.sort = 'lowest-price';
		const params = serializeInventoryMobileDraft(draft, original);
		expect(params.get('keyword')).toBe('xDrive');
		expect(params.get('maxPrice')).toBe('45678');
		expect(params.get('maxMileage')).toBe('87654');
		expect(params.get('sort')).toBe('lowest-price');
		expect(params.getAll('campaign')).toEqual(['one', 'two']);
		expect(params.get('lang')).toBe('en');
		expect(params.get('view')).toBe('3');
		expect(params.get('layout')).toBe('dashboard');
		expect(params.has('page')).toBe(false);
	});
	it('clears dependent model aliases without clearing independent criteria', () => {
		const original = new URLSearchParams(
			'brand=BMW&model=X3&query=X5&keyword=camera&location=Sofia&status=available'
		);
		const draft = inventoryMobileDraftFromQuery(original);
		draft.brand = 'Audi';
		draft.model = '';
		const params = serializeInventoryMobileDraft(draft, original);
		expect(parseInventoryQuery(params).filters).toEqual({
			brand: 'Audi',
			keyword: 'camera',
			location: 'Sofia',
			status: 'available'
		});
		expect(params.has('model')).toBe(false);
		expect(params.has('query')).toBe(false);
	});
	it('removes explicitly cleared ranges without reviving legacy aliases', () => {
		const original = new URLSearchParams(
			'priceTo=45000&mileageTo=100000&yearFrom=2015&keyword=BMW'
		);
		const draft = inventoryMobileDraftFromQuery(original);
		draft.price = draft.mileage = draft.year = '';
		expect(parseInventoryQuery(serializeInventoryMobileDraft(draft, original)).filters).toEqual({
			keyword: 'BMW'
		});
	});
	it('round trips multiple selections and ignores malformed range numbers', () => {
		const original = new URLSearchParams(
			'fuel=Diesel&FuelType=Petrol&feature=LED&feature=Camera&body=SUV&transmission=Automatic'
		);
		const draft = inventoryMobileDraftFromQuery(original);
		expect(parseInventoryQuery(serializeInventoryMobileDraft(draft, original)).filters).toEqual(
			parseInventoryQuery(original).filters
		);
		draft.price = 'oops-Infinity';
		expect(
			parseInventoryQuery(serializeInventoryMobileDraft(draft, original)).filters.maxPrice
		).toBeUndefined();
	});
});

describe('mobile model options', () => {
	const options = {
		BMW: [
			{ value: 'shared', label: 'Shared model', count: 2, countLabel: '2 cars' },
			{ value: 'x5', label: 'X5', count: 5, countLabel: '5 cars' }
		],
		Audi: [
			{ value: 'shared', label: 'Shared model', count: 3, countLabel: '3 cars' },
			{ value: 'a4', label: 'A4', count: 1, countLabel: '1 car' }
		],
		Mercedes: [{ value: 'gla', label: 'GLA', count: 8, countLabel: '8 cars' }]
	};
	it('combines only selected makes using numeric counts, including shared model names', () => {
		const merged = mergeInventoryModelOptions(['BMW', 'Audi'], options);
		expect(merged.map(({ value, count }) => ({ value, count }))).toEqual([
			{ value: 'shared', count: 5 },
			{ value: 'x5', count: 5 },
			{ value: 'a4', count: 1 }
		]);
		expect(options.BMW[0].count).toBe(2);
	});
	it('does not double-count a repeated make and ignores unknown makes', () => {
		expect(mergeInventoryModelOptions(['Audi', 'Audi', 'missing'], options)).toHaveLength(2);
		expect(mergeInventoryModelOptions(['Audi', 'Audi'], options)[0].count).toBe(3);
	});
});
