import { unavailableVehiclePhotos, unavailableVehicleImage } from './unavailable-media';
import { illustrativeMonthly } from '$lib/domain/finance';
import { site } from '$lib/config/site';
import { daynightVehicles } from './daynight';
import type { Vehicle, VehicleCondition } from '$lib/types/vehicle';

export type { InventoryFilters, SortKey, Vehicle, VehicleCondition } from '$lib/types/vehicle';

// Listing recency and customer ownership do not certify vehicle condition.
const conditionForStatus = (): VehicleCondition => 'Used';

const knownBrokenImageFallbacks: Record<string, string> = {};
const imageForVehicle = (vehicle: { id: string; image: string }) =>
	unavailableVehiclePhotos.has(vehicle.id)
		? unavailableVehicleImage
		: (knownBrokenImageFallbacks[vehicle.id] ?? vehicle.image);

const modelSeriesFromTitle = (title: string, brand: string) => {
	const normalizedTitle = title.trim();
	const normalizedBrand = brand.trim();
	const withoutBrand = normalizedTitle.toLowerCase().startsWith(`${normalizedBrand.toLowerCase()} `)
		? normalizedTitle.slice(normalizedBrand.length).trim()
		: normalizedTitle;
	const [series] = withoutBrand.split(/\s+/);

	return series || withoutBrand || normalizedTitle;
};

export const vehicles: Vehicle[] = daynightVehicles.map((vehicle, index) => ({
	slug: vehicle.id,
	title: vehicle.model,
	brand: vehicle.make,
	model: modelSeriesFromTitle(vehicle.model, vehicle.make),
	bodyType: vehicle.body,
	condition: conditionForStatus(),
	price: vehicle.priceEur,
	priceLabel: vehicle.price.replace(/\s*EUR\b/, ' €'),
	priceBgn: vehicle.priceBgn,
	monthly: illustrativeMonthly(vehicle.priceEur, site.finance),
	year: vehicle.year,
	mileage: vehicle.mileageKm,
	mileageKnown: vehicle.mileageKnown,
	mileageValue: vehicle.mileageValue,
	mileageUnit: vehicle.mileageUnit,
	fuel: vehicle.fuel,
	transmission: vehicle.transmission,
	engine: [vehicle.displacement, vehicle.power].filter(Boolean).join(' / '),
	exterior: vehicle.color,
	interior: 'On request',
	location: vehicle.location,
	vin: /^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicle.sourceId) ? vehicle.sourceId : '',
	stockNumber: vehicle.sourceId,
	tag: vehicle.status,
	tagTone: vehicle.isClientVehicle ? 'dark' : index % 3 === 0 ? 'lime' : 'violet',
	image: imageForVehicle(vehicle),
	images: [imageForVehicle(vehicle)],
	gallery: [imageForVehicle(vehicle)],
	mediaKind: unavailableVehiclePhotos.has(vehicle.id)
		? 'unavailable'
		: knownBrokenImageFallbacks[vehicle.id]
			? 'illustration'
			: 'listing',
	dealerSlug: "stockport-broadbent-car-and-servicing",
	agentSlug: "stockport-broadbent-car-and-servicing-sales",
	rating: 0,
	description: vehicle.description,
	features: vehicle.features.slice(0, 18),
	sourceUrl: vehicle.sourceUrl,
	isClientVehicle: vehicle.isClientVehicle
}));

export const bodyTypes = Array.from(new Set(vehicles.map((vehicle) => vehicle.bodyType)));
export const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand))).sort();
export const fuels = Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel))).sort();

export function getVehicleBySlug(slug: string) {
	return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getRelatedVehicles(vehicle: Vehicle, limit = 4) {
	const closeMatches = vehicles.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			(candidate.brand === vehicle.brand || candidate.bodyType === vehicle.bodyType)
	);
	const fallback = vehicles.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			!closeMatches.some((match) => match.slug === candidate.slug)
	);

	return [...closeMatches, ...fallback].slice(0, limit);
}

export { filterVehicles, sortVehicles } from '$lib/domain/vehicle-search';
