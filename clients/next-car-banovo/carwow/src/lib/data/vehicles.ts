import { daynightSite } from './daynight-site';
import stock from './dealer-stock.json';

export type VehicleCondition = 'New' | 'Used' | 'Certified' | 'Unknown';

export type SortKey = 'template' | 'lowest' | 'highest' | 'newest' | 'mileage';

export interface Vehicle {
	slug: string;
	title: string;
	brand: string;
	model: string;
	bodyType: string;
	condition: VehicleCondition;
	price: number;
	monthly: number;
	year: number;
	mileage: number;
	fuel: string;
	displayFuel?: string;
	transmission: string;
	engine: string;
	exterior: string;
	interior: string;
	location: string;
	vin: string;
	stockNumber: string;
	tag?: string;
	tagTone?: 'lime' | 'violet' | 'dark';
	image: string;
	images: string[];
	gallery: string[];
	dealerSlug: string;
	agentSlug: string;
	rating: number;
	description: string;
	features: string[];
}

export interface InventoryFilters {
	query?: string;
	brand?: string;
	bodyType?: string;
	condition?: VehicleCondition | 'All';
	maxPrice?: number;
	minYear?: number;
	fuel?: string;
}

/** Compatibility surfaces use the dealer sample too; no source fixture vehicles. */
export const vehicles: Vehicle[] = stock.vehicles.map((vehicle) => ({
 slug: vehicle.slug, title: vehicle.title, brand: vehicle.make, model: vehicle.model,
 bodyType: vehicle.bodyLabel, condition: vehicle.condition === 'new' ? 'New' : vehicle.condition === 'unknown' ? 'Unknown' : 'Used', price: vehicle.priceEur, monthly: 0,
 year: vehicle.year, mileage: vehicle.mileageKm, fuel: vehicle.fuel, displayFuel: vehicle.fuel,
 transmission: vehicle.transmission, engine: vehicle.engineCc ? String(vehicle.engineCc) + ' см³' : 'Не е посочен',
 exterior: vehicle.color, interior: 'Не е посочен', location: daynightSite.location,
 vin: 'По запитване', stockNumber: vehicle.sourceId, tag: vehicle.availabilityLabel, tagTone: 'dark',
 image: vehicle.image, images: [...vehicle.gallery], gallery: [...vehicle.gallery],
 dealerSlug: stock.facts.slug, agentSlug: 'dealer-contact', rating: 0,
 description: vehicle.description, features: [...vehicle.equipment]
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

export function filterVehicles(source: Vehicle[], filters: InventoryFilters) {
	const query = filters.query?.trim().toLowerCase() ?? '';

	return source.filter((vehicle) => {
		const matchesQuery =
			!query ||
			[vehicle.title, vehicle.brand, vehicle.model, vehicle.bodyType, vehicle.location]
				.join(' ')
				.toLowerCase()
				.includes(query);
		const matchesBrand =
			!filters.brand || filters.brand === 'All' || vehicle.brand === filters.brand;
		const matchesType =
			!filters.bodyType || filters.bodyType === 'All' || vehicle.bodyType === filters.bodyType;
		const matchesCondition =
			!filters.condition || filters.condition === 'All' || vehicle.condition === filters.condition;
		const matchesPrice = !filters.maxPrice || vehicle.price <= filters.maxPrice;
		const matchesYear = !filters.minYear || vehicle.year >= filters.minYear;
		const matchesFuel = !filters.fuel || filters.fuel === 'All' || vehicle.fuel === filters.fuel;

		return (
			matchesQuery &&
			matchesBrand &&
			matchesType &&
			matchesCondition &&
			matchesPrice &&
			matchesYear &&
			matchesFuel
		);
	});
}

export function sortVehicles(source: Vehicle[], sort: SortKey) {
	const sorted = [...source];

	if (sort === 'template') return sorted;
	if (sort === 'highest') return sorted.sort((a, b) => b.price - a.price);
	if (sort === 'newest') return sorted.sort((a, b) => b.year - a.year);
	if (sort === 'mileage') return sorted.sort((a, b) => a.mileage - b.mileage);

	return sorted.sort((a, b) => a.price - b.price);
}
