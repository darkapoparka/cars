import { describe, expect, it } from 'vitest';
import {
	inventoryDraftFromQuery,
	serializeInventoryDraft,
	updateInventoryDraft
} from './inventory-draft';
import { parseInventoryQuery } from './inventory-query';

describe('inventory form draft', () => {
	it('retains repeated model, brand and feature selections', () => {
		const original = new URLSearchParams(
			'brand=BMW&brand=Audi&model=X3&model=A4&extra=LED&equipment=Camera'
		);
		const draft = inventoryDraftFromQuery(original);
		expect(draft.brand).toBe('BMW,Audi');
		expect(draft.q).toBe('X3,A4');
		expect(draft.feature).toBe('LED,Camera');
		expect(parseInventoryQuery(serializeInventoryDraft(draft, original)).filters).toEqual(
			parseInventoryQuery(original).filters
		);
	});
	it('preserves repeated context, locale and display preferences while resetting pagination', () => {
		const original = new URLSearchParams(
			'brand=BMW&context=one&context=two&lang=en&sort=lowest-price&view=3&layout=dashboard&page=4&preview=1'
		);
		const params = serializeInventoryDraft(inventoryDraftFromQuery(original), original);
		expect(params.getAll('context')).toEqual(['one', 'two']);
		expect(params.get('lang')).toBe('en');
		expect(params.get('sort')).toBe('lowest-price');
		expect(params.get('view')).toBe('3');
		expect(params.get('layout')).toBe('dashboard');
		expect(params.has('page')).toBe(false);
		expect(params.has('preview')).toBe(false);
		expect(original.get('page')).toBe('4');
	});
	it('canonicalizes the existing mobile control names', () => {
		const params = serializeInventoryDraft(
			{
				brand: 'BMW,Audi',
				model: 'X3,A4',
				priceTo: '40000',
				mileageTo: '80000',
				bodyType: 'SUV',
				lang: 'bg'
			},
			new URLSearchParams()
		);
		expect(parseInventoryQuery(params).filters).toMatchObject({
			brand: 'BMW,Audi',
			query: 'X3,A4',
			maxPrice: 40000,
			maxMileage: 80000,
			bodyType: 'SUV'
		});
		expect(params.has('priceTo')).toBe(false);
	});
	it('does not resurrect filters from the original URL after clearing', () => {
		const original = new URLSearchParams(
			'brand=BMW&model=X3&FuelType=Diesel&feature=LED&lang=en&context=a&context=b'
		);
		const params = serializeInventoryDraft(
			{ sort: 'highest-price', view: '4', lang: 'en' },
			original
		);
		expect(parseInventoryQuery(params).filters).toEqual({});
		expect(params.getAll('context')).toEqual(['a', 'b']);
		expect(params.get('lang')).toBe('en');
	});
	it('invalidates all dependent model aliases on make changes without losing keywords', () => {
		const original = {
			brand: 'BMW',
			q: 'X3',
			query: 'X5',
			model: 'X1',
			keyword: 'camera',
			page: '3'
		};
		const next = updateInventoryDraft(original, 'brand', 'Audi');
		expect(next).toEqual({ brand: 'Audi', keyword: 'camera' });
		expect(original.model).toBe('X1');
	});
	it('updates model and query controls without retaining obsolete aliases', () => {
		expect(
			updateInventoryDraft({ q: 'old', query: 'old', keyword: 'diesel' }, 'model', 'X3')
		).toEqual({ model: 'X3', keyword: 'diesel' });
		expect(updateInventoryDraft({ model: 'X3', query: 'old' }, 'q', 'A4')).toEqual({ q: 'A4' });
	});
});
