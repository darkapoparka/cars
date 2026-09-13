import { describe, expect, it } from 'vitest';
import { HomeSearchState } from './home-search.svelte';
import type { HomeMobileData } from '$lib/types/home';

function catalog(): HomeMobileData {
	return {
		brands: ['BMW', 'Audi'],
		bodyTypes: ['SUV', 'Седан'],
		models: ['X5', 'A8'],
		modelOptions: [
			{ model: 'X5', brands: ['BMW'], count: 3 },
			{ model: 'A8', brands: ['Audi'], count: 2 }
		],
		featuredCars: [],
		bodyTiles: [],
		brandTiles: [],
		budgetTiles: [],
		total: 5
	};
}

describe('mobile home search draft', () => {
	it('starts without a filter and does not share drafts between mounted homes', () => {
		const first = new HomeSearchState(catalog);
		const second = new HomeSearchState(catalog);
		first.query = 'BMW';
		first.toggleBrand('BMW');
		expect(second.searchHref).toBe('/inventory');
		expect(second.selectedBrands).toEqual([]);
	});
	it('keeps model choices compatible when a brand is selected', () => {
		const state = new HomeSearchState(catalog);
		state.toggleModel('A8');
		state.toggleBrand('BMW');
		expect(state.selectedModels).toEqual([]);
		expect(state.allModelOptions.map((option) => option.model)).toEqual(['X5']);
	});
	it('retains draft values but resets facet navigation when a sheet closes', () => {
		const state = new HomeSearchState(catalog);
		state.query = 'Audi';
		state.toggleBrand('Audi');
		state.openFacet('model');
		state.facetQuery = 'A8';
		state.backToMain();
		expect(state.searchView).toBe('main');
		expect(state.facetQuery).toBe('');
		expect(state.query).toBe('Audi');
		expect(state.selectedBrands).toEqual(['Audi']);
	});
	it('encodes repeated multi-value parameters without treating user text as markup', () => {
		const state = new HomeSearchState(catalog);
		state.query = '  BMW & Audi  ';
		state.toggleBrand('BMW');
		state.toggleBrand('Audi');
		state.toggleBody('Седан');
		state.searchPrice = 'under-30000';
		const params = new URL(state.searchHref, 'https://example.test').searchParams;
		expect(params.get('q')).toBe('BMW & Audi');
		expect(params.getAll('brand')).toEqual(['BMW', 'Audi']);
		expect(params.get('body')).toBe('Седан');
		expect(params.get('price')).toBe('under-30000');
	});
	it('prioritizes selections without mutating the catalog or losing case-insensitive search', () => {
		const data = catalog();
		const state = new HomeSearchState(() => data);
		state.toggleBrand('Audi');
		expect(state.facetBrandList).toEqual(['Audi', 'BMW']);
		expect(data.brands).toEqual(['BMW', 'Audi']);
		state.facetQuery = ' aUd ';
		expect(state.facetBrandList).toEqual(['Audi']);
	});
	it('reads current route data rather than capturing the initial prop', () => {
		let data = catalog();
		const state = new HomeSearchState(() => data);
		data = { ...data, brands: ['Toyota'], modelOptions: [] };
		expect(state.facetBrandList).toEqual(['Toyota']);
		expect(state.modelChips).toEqual([]);
	});
});
