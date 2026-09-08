import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	constrainInventoryViewForLayout,
	defaultInventoryViewForLayout,
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryFilterPresentation,
	resolveInventoryView,
	viewForInventoryTemplate
} from './inventory-state';

describe('inventory-state', () => {
	it('resolves Auxero inventory views and source templates', () => {
		expect(defaultInventoryViewForLayout('dashboard')).toBe('3');
		expect(defaultInventoryViewForLayout('classic')).toBe('4');
		expect(resolveInventoryView(null)).toBe('4');
		expect(resolveInventoryView('3')).toBe('3');
		expect(resolveInventoryView('dense')).toBe('4');
		expect(resolveInventoryView('grid4')).toBe('4');
		expect(resolveInventoryView('compact')).toBe('5');
		expect(resolveInventoryView('grid5')).toBe('5');
		expect(resolveInventoryView('half-map')).toBe('map');
		expect(constrainInventoryViewForLayout('classic', '5')).toBe('5');
		expect(constrainInventoryViewForLayout('dashboard', '5')).toBe('3');
		expect(inventoryTemplateForView('3')).toBe('listing-grid3-columns.html');
		expect(inventoryTemplateForView('4')).toBe('listing-grid4-columns.html');
		expect(inventoryTemplateForView('5')).toBe('listing-grid4-columns.html');
		expect(inventoryTemplateForView('map')).toBe('listing-gridstyle-halfmap.html');
	});

	it('lets query params override the template-derived view', () => {
		const searchParams = new URLSearchParams('view=map');

		expect(viewForInventoryTemplate('listing-grid4-columns.html', { searchParams })).toBe('map');
		expect(viewForInventoryTemplate('listing-topmap.html')).toBe('map');
	});

	it('defaults the sidebar dashboard inventory to the comfortable grid', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams()
		});
		const compactState = getInventoryState('listing-grid4-columns.html', {
			searchParams: new URLSearchParams('view=5')
		});

		expect(state.layout).toBe('dashboard');
		expect(state.view).toBe('3');
		expect(compactState.layout).toBe('dashboard');
		expect(compactState.view).toBe('3');
	});

	it('defaults the classic inventory grid to the readable four-card view', () => {
		const state = getInventoryState('listing-grid4-columns.html', {
			searchParams: new URLSearchParams('layout=classic')
		});

		expect(state.layout).toBe('classic');
		expect(state.view).toBe('4');
	});

	it('resolves inventory filter presentation separately from layout mode aliases', () => {
		expect(resolveInventoryFilterPresentation(new URLSearchParams())).toBe('popover');
		expect(resolveInventoryFilterPresentation(new URLSearchParams('filters=modal'))).toBe('modal');
		expect(resolveInventoryFilterPresentation(new URLSearchParams('filterMode=dialog'))).toBe(
			'modal'
		);
		expect(resolveInventoryFilterPresentation(new URLSearchParams('mode=classic'))).toBe('popover');

		const state = getInventoryState('listing-grid4-columns.html', {
			searchParams: new URLSearchParams('filters=modal&layout=classic')
		});

		expect(state.filterPresentation).toBe('modal');
		expect(state.layout).toBe('classic');
	});

	it('normalizes inventory aliases and filters Eliqauto vehicles', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams('brand=BMW&FuelType=Petrol&bodyType=All')
		});

		expect(state.filters).toMatchObject({ brand: 'BMW', fuel: 'Petrol' });
		expect(state.filters.bodyType).toBeUndefined();
		expect(state.selected.length).toBeGreaterThan(0);
		expect(state.selected.every((vehicle) => vehicle.brand === 'BMW')).toBe(true);
		expect(state.selected.every((vehicle) => vehicle.fuel === 'Petrol')).toBe(true);
	});

	it('normalizes repeated brand params as a multi-brand OR filter', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams('brand=BMW&brand=Audi')
		});

		expect(state.filters.brand).toBe('BMW,Audi');
		expect(state.selected.length).toBeGreaterThan(0);
		expect(state.selected.every((vehicle) => ['BMW', 'Audi'].includes(vehicle.brand))).toBe(true);
	});

	it('normalizes categorical filters as multi-value OR groups', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams(
				'bodyType=SUV,Sedan&fuel=Petrol&fuel=EV&transmission=Automatic'
			)
		});

		expect(state.filters.bodyType).toBe('SUV,Sedan');
		expect(state.filters.fuel).toBe('Petrol,EV');
		expect(state.filters.transmission).toBe('Automatic');
		expect(state.selected.length).toBeGreaterThan(0);
		expect(state.selected.every((vehicle) => ['SUV', 'Sedan'].includes(vehicle.bodyType))).toBe(
			true
		);
		expect(state.selected.every((vehicle) => ['Petrol', 'EV'].includes(vehicle.fuel))).toBe(true);
		expect(state.selected.every((vehicle) => vehicle.transmission === 'Automatic')).toBe(true);
	});

	it('sorts selected vehicles from typed state rather than adapter markup', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams('sort=lowest-price')
		});

		const expectedLowest = [...vehicles].sort((left, right) => left.price - right.price)[0];

		expect(state.sort).toBe('lowest');
		expect(state.sortParam).toBe('lowest-price');
		expect(state.selected[0]?.slug).toBe(expectedLowest?.slug);
	});
});
