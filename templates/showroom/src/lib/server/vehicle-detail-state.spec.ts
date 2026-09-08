import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	getVehicleDetailBySlug,
	getVehicleDetailOrFallback,
	getVehicleDetailRelated,
	vehicleDetailFallbackSlug
} from './vehicle-detail-state';

describe('vehicle-detail-state', () => {
	it('resolves the requested vehicle detail slug', () => {
		const vehicle = getVehicleDetailBySlug('11779989521200947');

		expect(vehicle?.title).toBe('Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%');
	});

	it('keeps raw template fallback deterministic for compatibility routes', () => {
		expect(vehicleDetailFallbackSlug).toBe(vehicles[0]?.slug);
		expect(getVehicleDetailOrFallback('missing')?.slug).toBe(vehicles[0]?.slug);
		expect(getVehicleDetailOrFallback()?.slug).toBe(vehicles[0]?.slug);
	});

	it('returns related vehicles without repeating the current detail vehicle', () => {
		const vehicle = getVehicleDetailOrFallback('11779989521200947');
		const related = getVehicleDetailRelated(vehicle, 4);

		expect(related).toHaveLength(4);
		expect(related.every((item) => item.slug !== vehicle.slug)).toBe(true);
		expect(
			related.some((item) => item.brand === vehicle.brand || item.bodyType === vehicle.bodyType)
		).toBe(true);
	});
});
