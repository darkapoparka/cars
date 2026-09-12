import { daynightVehicles } from './daynight';
import type { InventoryFilters, SortKey, Vehicle, VehicleCondition } from '$lib/types/vehicle';

export type { InventoryFilters, SortKey, Vehicle, VehicleCondition } from '$lib/types/vehicle';

const detailGalleryFallback = [
	'/assets/images/inner-page/slide-listing-details-5.jpg',
	'/assets/images/inner-page/slide-listing-details-6.jpg',
	'/assets/images/inner-page/slide-listing-details-7.jpg',
	'/assets/images/inner-page/slide-listing-details-8.jpg',
	'/assets/images/inner-page/slide-listing-details-9.jpg',
	'/assets/images/inner-page/slide-listing-details-10.jpg',
	'/assets/images/inner-page/slide-listing-details-11.jpg'
];

const conditionForStatus = (status: string, isClientVehicle: boolean): VehicleCondition => {
	if (isClientVehicle) return 'Certified';
	if (status === 'New listing') return 'New';

	return 'Used';
};

const knownBrokenImageFallbacks: Record<string, string> = {
	// The source photo returns 404. This existing A7 cutout is an illustrative template asset;
	// dealer personalization must replace sample media with verified stock photographs.
	'11774283016080050': '/assets/daynight/megamenu/inventory-audi-a7-cutout.webp',
	'21764342419542174': '/assets/images/card/card-48.jpg',
	'21778067767337633': '/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp',
	'21778068579001193': '/assets/images/card/card-55.jpg',
	'21779200396408437': '/assets/images/card/card-38.jpg',
	'21779118142363481': '/assets/images/card/card-48.jpg',
	'21779117876725419': '/assets/images/card/card-3.jpg',
	'11777282776427940': '/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp',
	'21750419064369634': '/assets/images/card/card-48.jpg',
	'11766312659396823': '/assets/images/card/card-6.jpg',
	'11768743659815066': '/assets/images/card/card-5.jpg',
	'11775058343987884': '/assets/images/card/card-5.jpg',
	'21741178468686255': '/assets/images/card/card-48.jpg'
};
const imageForVehicle = (vehicle: { id: string; image: string }) =>
	knownBrokenImageFallbacks[vehicle.id] ?? vehicle.image;

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
	condition: conditionForStatus(vehicle.status, vehicle.isClientVehicle),
	price: vehicle.priceEur,
	priceLabel: vehicle.price,
	priceBgn: vehicle.priceBgn,
	monthly: Math.round(vehicle.priceEur / 72),
	year: vehicle.year,
	mileage: vehicle.mileageKm,
	fuel: vehicle.fuel,
	transmission: vehicle.transmission,
	engine: [vehicle.displacement, vehicle.power].filter(Boolean).join(' / '),
	exterior: vehicle.color,
	interior: 'On request',
	location: vehicle.location,
	vin: vehicle.sourceId,
	stockNumber: vehicle.sourceId,
	tag: vehicle.status,
	tagTone: vehicle.isClientVehicle ? 'dark' : index % 3 === 0 ? 'lime' : 'violet',
	image: imageForVehicle(vehicle),
	images: [imageForVehicle(vehicle)],
	gallery: [imageForVehicle(vehicle), ...detailGalleryFallback],
	dealerSlug: 'daynight-plovdiv',
	agentSlug:
		index % 3 === 0
			? 'daynight-sales'
			: index % 3 === 1
				? 'daynight-import'
				: 'daynight-inspection',
	rating: 4.9,
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

const normalizeFilterValue = (value?: string | number) =>
	String(value ?? '')
		.trim()
		.toLowerCase();

const isAllFilter = (value?: string) => {
	const normalized = normalizeFilterValue(value);

	return !normalized || normalized === 'all';
};

const hasNumberFilter = (value?: number): value is number =>
	typeof value === 'number' && Number.isFinite(value);

const containsFilterValue = (value: string | number | undefined, query: string) =>
	normalizeFilterValue(value).includes(query);

const splitFilterValues = (filter?: string) =>
	normalizeFilterValue(filter)
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);

const matchesOption = (value: string, filter?: string) =>
	isAllFilter(filter) || splitFilterValues(filter).includes(normalizeFilterValue(value));

const vehicleSearchText = (vehicle: Vehicle) =>
	[
		vehicle.title,
		vehicle.brand,
		vehicle.model,
		vehicle.year,
		vehicle.bodyType,
		vehicle.location,
		vehicle.stockNumber,
		vehicle.vin,
		vehicle.fuel,
		vehicle.displayFuel,
		vehicle.transmission,
		vehicle.condition,
		vehicle.tag
	]
		.filter(Boolean)
		.join(' ');

const matchesStatusFilter = (vehicle: Vehicle, status?: string) => {
	const filter = normalizeFilterValue(status);

	if (!filter || filter === 'all') return true;
	if (['client', 'client vehicle', 'client-vehicle', 'customer', 'submitted'].includes(filter)) {
		return vehicle.isClientVehicle;
	}
	if (['new', 'new listing', 'new-listing', 'nova', 'нова обява'].includes(filter)) {
		return vehicle.tag === 'New listing' || vehicle.condition === 'New';
	}
	if (['available', 'stock', 'in stock', 'in-stock'].includes(filter)) {
		return vehicle.tag === 'Available' && !vehicle.isClientVehicle;
	}
	if (['imported', 'import', 'on request', 'on-request'].includes(filter)) {
		return [vehicle.tag, vehicle.description, ...vehicle.features].some((value) => {
			const normalized = normalizeFilterValue(value);

			return (
				normalized.includes('import') ||
				normalized.includes('new import') ||
				normalized.includes('нов внос') ||
				normalized.includes('on request')
			);
		});
	}

	return [vehicle.tag, vehicle.condition].some((value) =>
		normalizeFilterValue(value).includes(filter)
	);
};

export function filterVehicles(source: Vehicle[], filters: InventoryFilters) {
	const query = normalizeFilterValue(filters.query);
	const queryValues = splitFilterValues(filters.query);
	const location = normalizeFilterValue(filters.location);
	const sourceId = normalizeFilterValue(filters.sourceId);
	const minPrice = filters.minPrice;
	const maxPrice = filters.maxPrice;
	const minYear = filters.minYear;
	const maxYear = filters.maxYear;
	const minMileage = filters.minMileage;
	const maxMileage = filters.maxMileage;
	const featureValues = splitFilterValues(filters.feature);

	return source.filter((vehicle) => {
		const matchesQuery =
			!query ||
			queryValues.some((queryValue) => containsFilterValue(vehicleSearchText(vehicle), queryValue));
		const matchesFeature =
			!featureValues.length ||
			featureValues.some(
				(feature) =>
					vehicle.features.some((value) => containsFilterValue(value, feature)) ||
					containsFilterValue(vehicleSearchText(vehicle), feature)
			);
		const matchesSourceId =
			!sourceId ||
			[vehicle.slug, vehicle.vin, vehicle.stockNumber, vehicle.sourceUrl].some((value) =>
				containsFilterValue(value, sourceId)
			);
		const matchesBrand = matchesOption(vehicle.brand, filters.brand);
		const matchesType = matchesOption(vehicle.bodyType, filters.bodyType);
		const matchesCondition =
			isAllFilter(filters.condition) ||
			normalizeFilterValue(vehicle.condition) === normalizeFilterValue(filters.condition);
		const matchesFuel = matchesOption(vehicle.fuel, filters.fuel);
		const matchesTransmission = matchesOption(vehicle.transmission, filters.transmission);
		const matchesLocation = !location || containsFilterValue(vehicle.location, location);
		const matchesStatus = matchesStatusFilter(vehicle, filters.status);
		const matchesPrice =
			(!hasNumberFilter(minPrice) || vehicle.price >= minPrice) &&
			(!hasNumberFilter(maxPrice) || vehicle.price <= maxPrice);
		const matchesYear =
			(!hasNumberFilter(minYear) || vehicle.year >= minYear) &&
			(!hasNumberFilter(maxYear) || vehicle.year <= maxYear);
		const matchesMileage =
			(!hasNumberFilter(minMileage) || vehicle.mileage >= minMileage) &&
			(!hasNumberFilter(maxMileage) || vehicle.mileage <= maxMileage);

		return (
			matchesQuery &&
			(!filters.keyword ||
				containsFilterValue(vehicleSearchText(vehicle), normalizeFilterValue(filters.keyword))) &&
			matchesFeature &&
			matchesSourceId &&
			matchesBrand &&
			matchesType &&
			matchesCondition &&
			matchesFuel &&
			matchesTransmission &&
			matchesLocation &&
			matchesStatus &&
			matchesPrice &&
			matchesYear &&
			matchesMileage
		);
	});
}

export function sortVehicles(source: Vehicle[], sort: SortKey) {
	const sorted = [...source];

	if (sort === 'template') return sorted;
	if (sort === 'highest') return sorted.sort((a, b) => b.price - a.price);
	if (sort === 'newest' || sort === 'year') return sorted.sort((a, b) => b.year - a.year);
	if (sort === 'mileage') return sorted.sort((a, b) => a.mileage - b.mileage);

	return sorted.sort((a, b) => a.price - b.price);
}
