import { describe, expect, it, vi } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { getInventoryState } from './inventory-state';
import { listPublicVehicles } from './public-vehicles';

vi.mock('./public-vehicles', () => ({ listPublicVehicles: vi.fn(() => []) }));

describe('request-local inventory state', () => {
	it('uses the supplied snapshot without reading the source again', () => {
		vi.mocked(listPublicVehicles).mockClear();
		const source = vehicles.slice(0, 4);
		const state = getInventoryState('listing-grid4-columns.html', {}, source);
		expect(state.selected).toEqual(source);
		expect(listPublicVehicles).not.toHaveBeenCalled();
	});
	it('retains the default call contract with one source read', () => {
		vi.mocked(listPublicVehicles).mockClear();
		getInventoryState('listing-grid4-columns.html');
		expect(listPublicVehicles).toHaveBeenCalledTimes(1);
	});
	it('does not leak a previous request snapshot into the next request', () => {
		const first = getInventoryState('listing-grid4-columns.html', {}, vehicles.slice(0, 2));
		const second = getInventoryState('listing-grid4-columns.html', {}, []);
		expect(first.selected).toHaveLength(2);
		expect(second.selected).toEqual([]);
	});
});
