import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { importBrowseData } from './import-browse';

const stock = [
	{ ...vehicles[0], slug: 'bmw-x5', brand: 'BMW', model: 'X5', title: 'BMW X5', bodyType: 'SUV' },
	{
		...vehicles[0],
		slug: 'bmw-320',
		brand: 'BMW',
		model: '320',
		title: 'BMW 320',
		bodyType: 'Sedan'
	},
	{ ...vehicles[0], slug: 'audi-q5', brand: 'Audi', model: 'Q5', title: 'Audi Q5', bodyType: 'SUV' }
];

describe('mobile import discovery', () => {
	it('keeps purchase-market preferences separate from unverified stock origin', () => {
		const baseline = importBrowseData(stock, new URLSearchParams(), 'en');
		const germany = importBrowseData(stock, new URLSearchParams('origin=DE'), 'en');
		expect(germany.cards).toEqual(baseline.cards);
		expect(germany.count).toBe(3);
	});
	it('combines make, model and body type, ignoring make and model case', () => {
		const result = importBrowseData(
			stock,
			new URLSearchParams('make=bmw&bodyType=SUV&model=x5'),
			'en'
		);
		expect(result.cards.map((card) => card.slug)).toEqual(['bmw-x5']);
		expect(result.count).toBe(1);
	});
	it('offers models for the selected make and permits a request with no stock match', () => {
		const result = importBrowseData(stock, new URLSearchParams('make=BMW&model=unlisted'), 'en');
		expect(result.models).toEqual(['320', 'X5']);
		expect(result.cards).toEqual([]);
		expect(result.count).toBe(0);
	});
	it('returns only three preview cards while reporting all matches', () => {
		const result = importBrowseData(
			[...stock, { ...stock[0], slug: 'fourth' }],
			new URLSearchParams(),
			'bg'
		);
		expect(result.cards).toHaveLength(3);
		expect(result.count).toBe(4);
		expect(result.types.find((type) => type.value === 'Sedan')?.label).toBe('Седан');
	});
});
