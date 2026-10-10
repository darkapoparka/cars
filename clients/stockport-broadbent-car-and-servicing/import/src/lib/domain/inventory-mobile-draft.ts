import { parseInventoryQuery, serializeInventoryQuery } from './inventory-query';

export type InventoryMobileDraft = {
	body: string;
	brand: string;
	feature: string;
	fuel: string;
	mileage: string;
	model: string;
	price: string;
	sort: string;
	transmission: string;
	year: string;
};
const rangeValue = (min?: number, max?: number) =>
	min === undefined && max === undefined ? '' : String(min ?? '') + '-' + String(max ?? '');
const rangeBounds = (value: string) => {
	const number = (part: string | undefined) => {
		const parsed = part?.trim() ? Number(part) : NaN;
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
	};
	const [min, max] = value.split('-');
	return { min: number(min), max: number(max) };
};

/** The URL, not the set of available presets, owns the applied values. */
export function inventoryMobileDraftFromQuery(params: URLSearchParams): InventoryMobileDraft {
	const { filters, sortParam } = parseInventoryQuery(params);
	return {
		body: filters.bodyType ?? '',
		brand: filters.brand ?? '',
		feature: filters.feature ?? '',
		fuel: filters.fuel ?? '',
		model: filters.query ?? '',
		transmission: filters.transmission ?? '',
		mileage: rangeValue(filters.minMileage, filters.maxMileage),
		price: rangeValue(filters.minPrice, filters.maxPrice),
		year: rangeValue(filters.minYear, filters.maxYear),
		sort: sortParam
	};
}

/** Replace only controls owned by the sheet; retain keywords and repeated URL context. */
export function serializeInventoryMobileDraft(
	draft: InventoryMobileDraft,
	original: URLSearchParams
) {
	const state = parseInventoryQuery(original);
	const price = rangeBounds(draft.price);
	const mileage = rangeBounds(draft.mileage);
	const year = rangeBounds(draft.year);
	const params = serializeInventoryQuery(
		{
			...state,
			sortParam: draft.sort || 'best-match',
			filters: {
				...state.filters,
				bodyType: draft.body || undefined,
				brand: draft.brand || undefined,
				feature: draft.feature || undefined,
				fuel: draft.fuel || undefined,
				query: draft.model || undefined,
				transmission: draft.transmission || undefined,
				minPrice: price.min,
				maxPrice: price.max,
				minMileage: mileage.min,
				maxMileage: mileage.max,
				minYear: year.min,
				maxYear: year.max
			}
		},
		original
	);
	params.delete('page');
	params.delete('preview');
	return params;
}
