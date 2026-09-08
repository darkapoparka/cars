import type { InventoryListVehicle } from '$lib/types/inventory';

/**
 * The seven desktop sort modes. Mirrors the legacy DOM-runtime SortDropdown
 * exactly so the e2e `data-value` selectors and ordering behaviour are preserved.
 * `best-match` is the curated SOURCE order (no reorder) — it is the 1:1 baseline
 * order the grid renders with no sort applied.
 */
export type DesktopSortKey =
	| 'best-match'
	| 'lowest-price'
	| 'highest-price'
	| 'lowest-mileage'
	| 'highest-mileage'
	| 'newest-year'
	| 'oldest-year';

export type DesktopSortOption = {
	value: DesktopSortKey;
	label: string;
};

export const desktopSortOptions: DesktopSortOption[] = [
	{ value: 'best-match', label: 'Best match' },
	{ value: 'lowest-price', label: 'Lowest price' },
	{ value: 'highest-price', label: 'Highest price' },
	{ value: 'lowest-mileage', label: 'Lowest mileage' },
	{ value: 'highest-mileage', label: 'Highest mileage' },
	{ value: 'newest-year', label: 'Newest year' },
	{ value: 'oldest-year', label: 'Oldest year' }
];

const comparators: Record<
	Exclude<DesktopSortKey, 'best-match'>,
	(a: InventoryListVehicle, b: InventoryListVehicle) => number
> = {
	'lowest-price': (a, b) => a.price - b.price,
	'highest-price': (a, b) => b.price - a.price,
	'lowest-mileage': (a, b) => a.mileageValue - b.mileageValue,
	'highest-mileage': (a, b) => b.mileageValue - a.mileageValue,
	'newest-year': (a, b) => b.year - a.year,
	'oldest-year': (a, b) => a.year - b.year
};

/**
 * Pure, stable sort. `best-match` returns the list untouched (curated source
 * order); every other key sorts a COPY by the matching comparator. JS `Array.sort`
 * is stable, so ties keep source order — matching the legacy node reorder.
 */
export function sortInventory(
	vehicles: InventoryListVehicle[],
	sort: DesktopSortKey
): InventoryListVehicle[] {
	if (sort === 'best-match') return vehicles;
	return [...vehicles].sort(comparators[sort]);
}
