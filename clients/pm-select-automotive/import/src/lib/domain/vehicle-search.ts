import type { InventoryFilters, SortKey, Vehicle } from '$lib/types/vehicle';

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

const optionMatcher = (filter?: string) => {
	const values = splitFilterValues(filter);
	const all = isAllFilter(filter);
	return (value: string) => all || values.includes(normalizeFilterValue(value));
};

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

/** Prepare query values once per request; never cache mutable dealer inventory across requests. */
export function filterVehicles(source: readonly Vehicle[], filters: InventoryFilters) {
	const query = normalizeFilterValue(filters.query);
	const queryValues = splitFilterValues(filters.query);
	const keyword = normalizeFilterValue(filters.keyword);
	const location = normalizeFilterValue(filters.location);
	const sourceId = normalizeFilterValue(filters.sourceId);
	const featureValues = splitFilterValues(filters.feature);
	const matchesBrand = optionMatcher(filters.brand);
	const matchesType = optionMatcher(filters.bodyType);
	const matchesFuel = optionMatcher(filters.fuel);
	const matchesTransmission = optionMatcher(filters.transmission);
	const condition = isAllFilter(filters.condition) ? '' : normalizeFilterValue(filters.condition);
	const minPrice = hasNumberFilter(filters.minPrice) ? filters.minPrice : undefined;
	const maxPrice = hasNumberFilter(filters.maxPrice) ? filters.maxPrice : undefined;
	const minYear = hasNumberFilter(filters.minYear) ? filters.minYear : undefined;
	const maxYear = hasNumberFilter(filters.maxYear) ? filters.maxYear : undefined;
	const minMileage = hasNumberFilter(filters.minMileage) ? filters.minMileage : undefined;
	const maxMileage = hasNumberFilter(filters.maxMileage) ? filters.maxMileage : undefined;

	return source.filter((vehicle) => {
		// Reject cheap criteria before constructing text or scanning equipment.
		if (
			(minPrice !== undefined && !(vehicle.price >= minPrice)) ||
			(maxPrice !== undefined && !(vehicle.price <= maxPrice)) ||
			(minYear !== undefined && !(vehicle.year >= minYear)) ||
			(maxYear !== undefined && !(vehicle.year <= maxYear)) ||
			(minMileage !== undefined && !(vehicle.mileage >= minMileage)) ||
			(maxMileage !== undefined && !(vehicle.mileage <= maxMileage)) ||
			!matchesBrand(vehicle.brand) ||
			!matchesType(vehicle.bodyType) ||
			!matchesFuel(vehicle.fuel) ||
			!matchesTransmission(vehicle.transmission) ||
			(condition && normalizeFilterValue(vehicle.condition) !== condition) ||
			(location && !containsFilterValue(vehicle.location, location)) ||
			!matchesStatusFilter(vehicle, filters.status)
		)
			return false;
		if (
			sourceId &&
			![vehicle.slug, vehicle.vin, vehicle.stockNumber, vehicle.sourceUrl].some((value) =>
				containsFilterValue(value, sourceId)
			)
		)
			return false;

		// A vehicle's search text is normalized at most once, and only when needed.
		let searchText: string | undefined;
		const text = () => (searchText ??= normalizeFilterValue(vehicleSearchText(vehicle)));
		if (query && !queryValues.some((value) => text().includes(value))) return false;
		if (filters.keyword && !text().includes(keyword)) return false;
		return (
			!featureValues.length ||
			featureValues.some(
				(feature) =>
					vehicle.features.some((value) => containsFilterValue(value, feature)) ||
					text().includes(feature)
			)
		);
	});
}

export function sortVehicles(source: readonly Vehicle[], sort: SortKey) {
	const sorted = [...source];

	if (sort === 'template') return sorted;
	if (sort === 'highest') return sorted.sort((a, b) => b.price - a.price);
	if (sort === 'newest' || sort === 'year') return sorted.sort((a, b) => b.year - a.year);
	if (sort === 'mileage') return sorted.sort((a, b) => a.mileage - b.mileage);

	return sorted.sort((a, b) => a.price - b.price);
}
