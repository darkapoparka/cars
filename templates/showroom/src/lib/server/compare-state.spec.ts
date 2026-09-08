import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { getCompareVehicles, compareIdsFromSearchParams } from './compare-state';

describe('compare-state', () => {
	it('reads compare ids from public query aliases', () => {
		expect(compareIdsFromSearchParams(new URLSearchParams('ids=a,b,,c'))).toEqual(['a', 'b', 'c']);
		expect(compareIdsFromSearchParams(new URLSearchParams('compare=x,y'))).toEqual(['x', 'y']);
	});

	it('selects valid query vehicles in requested order and caps at four', () => {
		const selected = vehicles.slice(1, 6);
		const searchParams = new URLSearchParams(
			`ids=${['missing', ...selected.map((vehicle) => vehicle.slug)].join(',')}`
		);

		expect(
			getCompareVehicles({ routePath: 'compare', searchParams }).map((vehicle) => vehicle.slug)
		).toEqual(selected.slice(0, 4).map((vehicle) => vehicle.slug));
	});

	it('falls back to template-default vehicles when query ids are invalid', () => {
		const selected = getCompareVehicles({
			routePath: 'compare',
			searchParams: new URLSearchParams('ids=missing')
		});

		expect(selected.map((vehicle) => vehicle.slug)).toEqual(
			vehicles.slice(0, 4).map((vehicle) => vehicle.slug)
		);
	});

	it('uses account garage compare ids for the account compare route', () => {
		const session = {
			email: 'compare-state-customer@eliqauto.local',
			name: 'Compare State Customer',
			role: 'customer' as const
		};
		const selected = getCompareVehicles({ routePath: 'account/compare', session });

		expect(selected.map((vehicle) => vehicle.slug)).toEqual(
			vehicles.slice(0, 2).map((vehicle) => vehicle.slug)
		);
	});
});
