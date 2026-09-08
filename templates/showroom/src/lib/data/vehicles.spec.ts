import { describe, expect, it } from 'vitest';
import {
	filterVehicles,
	getRelatedVehicles,
	getVehicleBySlug,
	sortVehicles,
	vehicles
} from './vehicles';

describe('vehicle data helpers', () => {
	it('finds the first real Eliqauto listing by source id', () => {
		expect(getVehicleBySlug('21764342419542174')?.title).toBe('BMW X5 40i M Sport Shadow Line');
	});

	it('uses a stable local image for known broken feed photos', () => {
		expect(getVehicleBySlug('21764342419542174')?.image).toBe('/assets/images/card/card-48.jpg');
		expect(getVehicleBySlug('21778068579001193')?.image).toBe('/assets/images/card/card-55.jpg');
	});

	it('uses a local fallback for the BMW X5 Black Vermilion blocked hotlink', () => {
		const vehicle = getVehicleBySlug('21779118142363481');

		expect(vehicle?.title).toBe('BMW X5 40i Black Vermilion');
		expect(vehicle?.image).toBe('/assets/images/card/card-48.jpg');
		expect(vehicle?.images).toEqual(['/assets/images/card/card-48.jpg']);
		expect(vehicle?.gallery[0]).toBe('/assets/images/card/card-48.jpg');
	});

	it('uses a local fallback for the Mercedes GLS blocked hotlink', () => {
		const vehicle = getVehicleBySlug('11777282776427940');

		expect(vehicle?.title).toBe('Mercedes-Benz GLS 450 4M AMG Package');
		expect(vehicle?.image).toBe('/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp');
		expect(vehicle?.images).toEqual(['/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp']);
		expect(vehicle?.gallery[0]).toBe('/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp');
	});

	it('keeps model facets focused on series names instead of trim text', () => {
		expect(getVehicleBySlug('21764342419542174')?.model).toBe('X5');
		expect(getVehicleBySlug('11778678187411931')?.title).toBe('BMW 740 Завиващ заден мост');
		expect(getVehicleBySlug('11778678187411931')?.model).toBe('740');
		expect(getVehicleBySlug('11763643904637405')?.model).toBe('A7');
	});

	it('filters by search, source id, location, status, gearbox, price, year, mileage, and facets', () => {
		const vehicle = getVehicleBySlug('21764342419542174');
		expect(vehicle).toBeDefined();

		const result = filterVehicles(vehicles, {
			bodyType: vehicle!.bodyType,
			brand: vehicle!.brand,
			condition: vehicle!.condition,
			fuel: vehicle!.fuel,
			location: vehicle!.location,
			maxMileage: vehicle!.mileage + 1,
			maxPrice: vehicle!.price + 1,
			maxYear: vehicle!.year,
			minMileage: Math.max(0, vehicle!.mileage - 1),
			minPrice: vehicle!.price - 1,
			minYear: vehicle!.year,
			query: vehicle!.stockNumber,
			sourceId: vehicle!.stockNumber,
			status: 'new',
			transmission: vehicle!.transmission
		});

		expect(result.map((vehicle) => vehicle.slug)).toEqual(['21764342419542174']);
	});

	it('matches available and client vehicle status filters', () => {
		const available = filterVehicles(vehicles, { status: 'available' });
		const clientVehicles = filterVehicles(vehicles, { status: 'client-vehicle' });

		expect(available.length).toBeGreaterThan(0);
		expect(available.every((vehicle) => vehicle.tag === 'Available')).toBe(true);
		expect(clientVehicles.length).toBeGreaterThan(0);
		expect(clientVehicles.every((vehicle) => vehicle.isClientVehicle)).toBe(true);
	});

	it('keeps keyword search focused on listing identity fields', () => {
		const result = filterVehicles(vehicles, { query: 'Audi' });

		expect(result).toHaveLength(9);
		expect(result.every((vehicle) => vehicle.brand === 'Audi')).toBe(true);
	});

	it('treats comma-separated brands and model searches as OR filters', () => {
		const brandResult = filterVehicles(vehicles, { brand: 'BMW,Audi' });
		const modelResult = filterVehicles(vehicles, { query: 'X5,Q8' });

		expect(brandResult.length).toBeGreaterThan(0);
		expect(brandResult.every((vehicle) => ['BMW', 'Audi'].includes(vehicle.brand))).toBe(true);
		expect(modelResult.length).toBeGreaterThan(0);
		expect(
			modelResult.every((vehicle) =>
				`${vehicle.title} ${vehicle.model}`.toLowerCase().match(/x5|q8/)
			)
		).toBe(true);
	});

	it('sorts vehicles by lowest price', () => {
		const sorted = sortVehicles(vehicles, 'lowest');
		expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
	});

	it('returns related vehicles without including the source vehicle', () => {
		const vehicle = getVehicleBySlug('21764342419542174');
		expect(vehicle).toBeDefined();
		const related = getRelatedVehicles(vehicle!, 4);

		expect(related).toHaveLength(4);
		expect(related.every((item) => item.slug !== vehicle!.slug)).toBe(true);
	});
});
