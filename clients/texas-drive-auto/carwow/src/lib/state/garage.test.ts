import { describe, expect, it } from 'vitest';
import { daynightVehicles } from '$lib/data/daynight-vehicles';
import { GarageState } from './garage.svelte';

describe('GarageState', () => {
	it('keeps favorites and compare selections bounded to the published catalogue', () => {
		const garage = new GarageState();
		const slugs = daynightVehicles.slice(0, 4).map((vehicle) => vehicle.slug);

		garage.toggleFavorite(slugs[0]);
		expect(garage.favorites).toEqual([slugs[0]]);
		garage.toggleFavorite(slugs[0]);
		expect(garage.favorites).toEqual([]);

		expect(garage.toggleCompare(slugs[0])).toBe(true);
		expect(garage.toggleCompare(slugs[1])).toBe(true);
		expect(garage.toggleCompare(slugs[2])).toBe(true);
		expect(garage.toggleCompare(slugs[3])).toBe(false);
		expect(garage.compare).toEqual(slugs.slice(0, 3));
		expect(garage.formMessage).toContain('up to 3 vehicles');

		garage.toggleCompare(slugs[1]);
		expect(garage.compare).toEqual([slugs[0], slugs[2]]);
	});
});
