import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeGarageSlugs, resolveGarageVehicles, MAX_COMPARE_VEHICLES } from './garage';
import { GarageState } from '$lib/state/garage.svelte';
import { daynightVehicles } from '$lib/data/daynight-vehicles';

afterEach(() => vi.unstubAllGlobals());

describe('published inventory garage resolution', () => {
	it('keeps new published slugs that are absent from the demo seed', () => {
		const fresh = {
			...daynightVehicles[0],
			slug: 'new-published-car',
			shortTitle: 'New catalogue vehicle'
		};
		expect(resolveGarageVehicles([fresh.slug], [fresh]).available).toEqual([fresh]);
	});
	it('reports withdrawn records without displaying stale details', () => {
		const resolved = resolveGarageVehicles(
			['withdrawn-car', daynightVehicles[0].slug],
			daynightVehicles
		);
		expect(resolved.unavailable).toEqual(['withdrawn-car']);
		expect(resolved.available).toEqual([daynightVehicles[0]]);
	});
	it('deduplicates and rejects invalid persisted identifiers', () => {
		expect(
			normalizeGarageSlugs(['new-car', 'new-car', '', null, 42, '../private', 'bad slug'])
		).toEqual(['new-car']);
		expect(normalizeGarageSlugs({})).toEqual([]);
	});
	it('hydrates without filtering through the bundled seed', () => {
		vi.stubGlobal('localStorage', {
			getItem: () => JSON.stringify(['live-1', 'live-2', 'live-3', 'live-4']),
			setItem: vi.fn()
		});
		const garage = new GarageState();
		garage.hydrateFromStorage();
		expect(garage.favorites).toEqual(['live-1', 'live-2', 'live-3', 'live-4']);
		expect(garage.compare).toHaveLength(MAX_COMPARE_VEHICLES);
		expect(garage.compare[0]).toBe('live-1');
	});
	it('tolerates corrupt or unavailable local storage', () => {
		vi.stubGlobal('localStorage', {
			getItem: () => '{broken',
			setItem: () => {
				throw new Error('quota');
			}
		});
		const garage = new GarageState();
		garage.hydrateFromStorage();
		expect(garage.favorites).toEqual([]);
		garage.toggleFavorite('new-live-car');
		expect(garage.favorites).toEqual(['new-live-car']);
	});
});
