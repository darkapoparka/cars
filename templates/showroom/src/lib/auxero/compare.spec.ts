import { describe, expect, it } from 'vitest';
import {
	compareBrandOptions,
	compareRowGroups,
	compareRowsFromVehicles,
	compareRowValuesForSlots,
	filterCompareDrawerVehicles,
	type AuxeroCompareVehicle
} from './compare';

const vehicles: AuxeroCompareVehicle[] = [
	{
		brand: 'BMW',
		engine: '3000 куб.см / 340 к.с.',
		exterior: 'Черен',
		fuel: 'Бензин',
		image: '/bmw-x5.webp',
		interior: 'On request',
		location: 'София',
		mileageLabel: '140 000 km',
		model: 'X5',
		priceLabel: '36 500 EUR',
		slug: 'bmw-x5',
		stockNumber: 'bmw-x5',
		title: 'BMW X5 40i M Sport',
		transmission: 'Automatic',
		vin: 'bmw-x5',
		year: 2019
	},
	{
		brand: 'Audi',
		engine: '3000 куб.см / 354 к.с.',
		exterior: 'Сив',
		fuel: 'Бензин',
		image: '/audi-sq5.webp',
		interior: 'On request',
		location: 'София',
		mileageLabel: '106 000 km',
		model: 'SQ5',
		priceLabel: '33 000 EUR',
		slug: 'audi-sq5',
		stockNumber: 'audi-sq5',
		title: 'Audi SQ5 30T Black Optic',
		transmission: 'Automatic',
		vin: 'audi-sq5',
		year: 2021
	}
];

describe('compare auxero helpers', () => {
	it('groups compare rows for the mobile pair and matrix views', () => {
		const rows = compareRowsFromVehicles(vehicles, 'bg');
		const groups = compareRowGroups(rows, 'bg');

		expect(groups.map((group) => [group.title, group.open, group.rows.length])).toEqual([
			['Основни', true, 4],
			['Техника', false, 4],
			['Произход', false, 3]
		]);
		expect(compareRowGroups(rows, 'en', false)[0]).toMatchObject({
			open: false,
			title: 'Core'
		});
	});

	it('builds drawer brand options and keeps selected vehicles first', () => {
		expect(compareBrandOptions(vehicles, 'bg')).toEqual([
			{ brand: 'Audi', count: 1 },
			{ brand: 'BMW', count: 1 }
		]);

		expect(
			filterCompareDrawerVehicles({
				brand: '',
				locale: 'bg',
				query: '',
				selectedSlugs: ['bmw-x5'],
				vehicles
			}).map((vehicle) => vehicle.slug)
		).toEqual(['bmw-x5', 'audi-sq5']);

		expect(
			filterCompareDrawerVehicles({
				brand: 'Audi',
				locale: 'bg',
				query: '2021',
				selectedSlugs: [],
				vehicles
			}).map((vehicle) => vehicle.slug)
		).toEqual(['audi-sq5']);
	});

	it('maps row values onto mobile compare slots without shifting empty slots', () => {
		const priceRow = compareRowsFromVehicles(vehicles, 'bg').at(-1);
		const audiOnlyPriceRow = compareRowsFromVehicles([vehicles[1]], 'bg').at(-1);

		expect(priceRow).toBeDefined();
		expect(compareRowValuesForSlots(priceRow!, ['bmw-x5', null], 'Избери автомобил')).toEqual([
			'36 500 EUR',
			'Избери автомобил'
		]);
		expect(audiOnlyPriceRow).toBeDefined();
		expect(
			compareRowValuesForSlots(audiOnlyPriceRow!, [null, 'audi-sq5'], 'Choose vehicle')
		).toEqual(['Choose vehicle', '33 000 EUR']);
	});
});
