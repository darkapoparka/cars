import type { InventoryCriteria } from '$lib/state/inventory-filters.svelte';
import type { SortKey } from '$lib/types/mobile-inventory';
import type { DesktopSortKey } from '$lib/components/inventory/desktop/desktop-inventory-sort';

const mobileSorts: Record<string, SortKey> = {
	'price-asc': 'price-asc',
	'lowest-price': 'price-asc',
	'price-desc': 'price-desc',
	'highest-price': 'price-desc',
	'year-desc': 'year-desc',
	'newest-year': 'year-desc',
	'mileage-asc': 'mileage-asc',
	'lowest-mileage': 'mileage-asc'
};
const desktopSorts: Record<string, DesktopSortKey> = {
	'best-match': 'best-match',
	'lowest-price': 'lowest-price',
	'highest-price': 'highest-price',
	'lowest-mileage': 'lowest-mileage',
	'highest-mileage': 'highest-mileage',
	'newest-year': 'newest-year',
	'oldest-year': 'oldest-year',
	'price-asc': 'lowest-price',
	'price-desc': 'highest-price',
	'year-desc': 'newest-year',
	'mileage-asc': 'lowest-mileage'
};
export function readMobileSort(value: string | null): SortKey {
	return mobileSorts[value ?? ''] ?? 'price-asc';
}
export function readDesktopSort(value: string | null): DesktopSortKey {
	return desktopSorts[value ?? ''] ?? 'best-match';
}

export function parseInventoryFilters(params: URLSearchParams): InventoryCriteria {
	const multi = (name: string, alias: string) => [
		...new Set(
			[...params.getAll(name), ...params.getAll(alias)]
				.flatMap((value) => value.split(','))
				.map((value) => value.trim())
				.filter(Boolean)
		)
	];
	const rawCondition = (params.get('condition') || params.get('type') || '')
		.trim()
		.toLocaleLowerCase('bg-BG');
	const condition = ['new', 'nov', 'novi', 'нов', 'нови', 'нов внос'].includes(rawCondition)
		? 'new'
		: ['used', 'upotrebyavani', 'употребявани', 'употребяван'].includes(rawCondition)
			? 'used'
			: '';
	return {
		query: params.get('q') ?? '',
		brand: multi('brand', 'brands'),
		model: multi('model', 'models'),
		body: multi('body', 'bodies'),
		feature: multi('feature', 'features'),
		fuel: params.get('fuel') ?? '',
		transmission: params.get('transmission') ?? '',
		price: params.get('price') ?? '',
		mileage: params.get('mileage') ?? '',
		condition: condition === 'new' || condition === 'used' ? condition : '',
		availability: params.get('availability') ?? ''
	};
}

/** Both layouts emit repeated multi-value parameters and preserve unrelated query context. */
export function serializeInventoryFilters(
	criteria: InventoryCriteria,
	sort: string,
	source = new URLSearchParams()
) {
	const params = new URLSearchParams(source);
	for (const key of [
		'q',
		'brand',
		'brands',
		'model',
		'models',
		'body',
		'bodies',
		'feature',
		'features',
		'fuel',
		'transmission',
		'price',
		'mileage',
		'condition',
		'type',
		'availability',
		'sort'
	])
		params.delete(key);
	for (const key of ['brand', 'model', 'body', 'feature'] as const)
		for (const value of criteria[key] ?? []) params.append(key, value);
	if (criteria.query) params.set('q', criteria.query);
	for (const key of [
		'fuel',
		'transmission',
		'price',
		'mileage',
		'condition',
		'availability'
	] as const)
		if (criteria[key]) params.set(key, criteria[key]);
	if (sort && sort !== 'best-match') params.set('sort', sort);
	return params;
}
