import { describe, expect, it } from 'vitest';
import { vehicles } from './vehicles';
import { unavailableVehiclePhotos, unavailableVehicleImage } from './unavailable-media';
describe('truthful vehicle media', () => {
	it('keeps known missing photographs distinct from listing photos and illustrations', () => {
		const missing = vehicles.filter((vehicle) => unavailableVehiclePhotos.has(vehicle.slug));
		expect(missing).toHaveLength(unavailableVehiclePhotos.size);
		expect(
			missing.every(
				(vehicle) =>
					vehicle.mediaKind === 'unavailable' && vehicle.image === unavailableVehicleImage
			)
		).toBe(true);
	});
	it('has genuine listing images available for a populated featured row', () => {
		const featured = vehicles.filter((vehicle) => vehicle.mediaKind === 'listing').slice(0, 8);
		expect(featured.length).toBeGreaterThanOrEqual(4);
		expect(featured.every((vehicle) => !unavailableVehiclePhotos.has(vehicle.slug))).toBe(true);
	});
});
