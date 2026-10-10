import { vehicles, type Vehicle } from '$lib/data/vehicles';
import { getPublicVehicleBySlug, getRelatedPublicVehicles } from './public-vehicles';

export const vehicleDetailFallbackSlug = vehicles[0]?.slug ?? '21764342419542174';

export const getVehicleDetailBySlug = (slug: string) => getPublicVehicleBySlug(slug);

export const getVehicleDetailOrFallback = (slug?: string) =>
	getPublicVehicleBySlug(slug ?? vehicleDetailFallbackSlug) ?? vehicles[0];

export const getVehicleDetailRelated = (vehicle: Vehicle, limit = 4) =>
	getRelatedPublicVehicles(vehicle, limit);
