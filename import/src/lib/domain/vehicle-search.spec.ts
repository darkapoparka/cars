import { describe, expect, it } from 'vitest';
import type { InventoryFilters, SortKey, Vehicle } from '$lib/types/vehicle';
import { filterVehicles, sortVehicles } from './vehicle-search';

const vehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
	slug: 'bmw-x3',
	title: 'BMW X3',
	brand: 'BMW',
	model: 'X3',
	bodyType: 'SUV',
	condition: 'Used',
	price: 30000,
	priceLabel: '30000 EUR',
	priceBgn: '',
	monthly: 500,
	year: 2020,
	mileage: 60000,
	fuel: 'Diesel',
	transmission: 'Automatic',
	engine: '',
	exterior: '',
	interior: '',
	location: 'Sofia',
	vin: 'WBATEST1234567890',
	stockNumber: 'stock-123',
	tag: 'Available',
	image: '/car.webp',
	images: [],
	gallery: [],
	dealerSlug: 'dealer',
	agentSlug: 'sales',
	rating: 0,
	description: 'New import',
	features: ['LED', 'Navigation'],
	sourceUrl: 'https://example.test/stock-123',
	isClientVehicle: false,
	...overrides
});
const source = [
	vehicle(),
	vehicle({
		slug: 'audi-a4',
		title: 'Audi A4',
		brand: 'Audi',
		model: 'A4',
		bodyType: 'Sedan',
		price: 20000,
		year: 2022,
		mileage: 40000,
		fuel: 'Petrol',
		features: ['Camera']
	})
];

describe('vehicle search', () => {
	it('combines fields with AND and multiple choices within a field with OR', () => {
		expect(
			filterVehicles(source, { brand: ' BMW, audi ', fuel: 'diesel', bodyType: 'suv' })
		).toEqual([source[0]]);
		expect(filterVehicles(source, { brand: 'BMW,Audi' })).toEqual(source);
	});
	it('keeps model choices separate from the keyword', () => {
		expect(filterVehicles(source, { query: 'X3,A4', keyword: 'audi' })).toEqual([source[1]]);
		expect(filterVehicles(source, { query: 'X3', keyword: 'audi' })).toEqual([]);
	});
	it('searches equipment, localized terms, year and stock identifiers', () => {
		expect(filterVehicles(source, { feature: 'camera,LED' })).toEqual(source);
		expect(filterVehicles(source, { feature: 'Sofia', keyword: '2020' })).toEqual([source[0]]);
		for (const sourceId of ['bmw-x3', 'WBATEST', 'stock-123', 'example.test']) {
			expect(filterVehicles([source[0]], { sourceId })).toEqual([source[0]]);
		}
	});
	it('applies inclusive numeric ranges without treating zero as absent', () => {
		expect(
			filterVehicles(source, {
				minPrice: 30000,
				maxPrice: 30000,
				minYear: 2020,
				maxYear: 2020,
				minMileage: 60000,
				maxMileage: 60000
			})
		).toEqual([source[0]]);
		expect(filterVehicles(source, { maxMileage: 0 })).toEqual([]);
		expect(filterVehicles(source, { minPrice: NaN, maxPrice: Infinity })).toEqual(source);
	});
	it('rejects non-numeric vehicle values only when the corresponding range is active', () => {
		const incomplete = [vehicle({ price: NaN, mileage: NaN, year: NaN })];
		expect(filterVehicles(incomplete, {})).toEqual(incomplete);
		for (const filters of [
			{ minPrice: 0 },
			{ maxPrice: 100000 },
			{ minYear: 2000 },
			{ maxYear: 2030 },
			{ minMileage: 0 },
			{ maxMileage: 100000 }
		]) {
			expect(filterVehicles(incomplete, filters)).toEqual([]);
		}
	});
	it('retains status aliases, location, condition and transmission behavior', () => {
		expect(
			filterVehicles(source, {
				status: 'in-stock',
				location: 'SOF',
				condition: 'Used',
				transmission: 'automatic'
			})
		).toEqual(source);
		expect(filterVehicles(source, { status: 'client' })).toEqual([]);
		expect(filterVehicles(source, { status: 'imported' })).toEqual(source);
		expect(
			filterVehicles([vehicle({ isClientVehicle: true })], { status: 'customer' })
		).toHaveLength(1);
	});
	it('does not mutate the input collection or its vehicles', () => {
		const frozen = Object.freeze(source.map((item) => Object.freeze({ ...item })));
		const before = JSON.stringify(frozen);
		filterVehicles(frozen, { keyword: 'BMW' });
		sortVehicles(frozen, 'lowest');
		expect(JSON.stringify(frozen)).toBe(before);
	});
	it('retains every existing sort and returns a separate array', () => {
		const expected: Record<SortKey, string[]> = {
			template: ['bmw-x3', 'audi-a4'],
			highest: ['bmw-x3', 'audi-a4'],
			lowest: ['audi-a4', 'bmw-x3'],
			newest: ['audi-a4', 'bmw-x3'],
			year: ['audi-a4', 'bmw-x3'],
			mileage: ['audi-a4', 'bmw-x3']
		};
		for (const sort of Object.keys(expected) as SortKey[]) {
			const sorted = sortVehicles(source, sort);
			expect(sorted.map((item) => item.slug)).toEqual(expected[sort]);
			expect(sorted).not.toBe(source);
		}
	});
	it('treats empty and All selection values as unfiltered', () => {
		const filters: InventoryFilters = {
			brand: 'All',
			bodyType: '',
			fuel: 'all',
			transmission: ' ALL ',
			condition: 'All',
			status: 'all'
		};
		expect(filterVehicles(source, filters)).toEqual(source);
	});
});
