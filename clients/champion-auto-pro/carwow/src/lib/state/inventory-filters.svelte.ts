/**
 * Canonical inventory filtering logic.
 *
 * This is the shared source of truth for filtering + sorting the inventory list.
 * It preserves the behavior first implemented by the mobile inventory page so
 * desktop and mobile can consume the same matcher/sorter without importing from
 * component folders.
 */
import { normalize, sortVehicles } from '$lib/utils/inventory-filter-utils';
import type { SortKey } from '$lib/types/mobile-inventory';
import {
	getDayNightVehicleAvailability,
	getDayNightVehicleCondition
} from '$lib/data/daynight-vehicles';
import { normalizeCondition } from '$lib/utils/daynight-quick-filter-dom';
import type { InventoryListVehicle } from '$lib/types/inventory';

export type { SortKey } from '$lib/types/mobile-inventory';

// Re-export so consumers have one import site for the shared primitives.
export { normalize, sortVehicles } from '$lib/utils/inventory-filter-utils';

export type PriceOption = {
	value: string;
	label: string;
	limit?: number;
	min?: number;
};

export type MileageOption = {
	value: string;
	label: string;
	limit: number;
};

/** Price bands — EXACT 5, ported verbatim from MobileInventoryPage. */
export const priceOptions: PriceOption[] = [
	{ value: 'under-10000', label: 'До 10 000 EUR', limit: 10000 },
	{ value: 'under-20000', label: 'До 20 000 EUR', limit: 20000 },
	{ value: 'under-30000', label: 'До 30 000 EUR', limit: 30000 },
	{ value: 'under-50000', label: 'До 50 000 EUR', limit: 50000 },
	{ value: 'over-50000', label: 'Над 50 000 EUR', min: 50000 }
];

/** Mileage bands — EXACT 4, all `limit`, ported verbatim. */
export const mileageOptions: MileageOption[] = [
	{ value: 'under-50000', label: 'До 50 000 км', limit: 50000 },
	{ value: 'under-100000', label: 'До 100 000 км', limit: 100000 },
	{ value: 'under-150000', label: 'До 150 000 км', limit: 150000 },
	{ value: 'under-200000', label: 'До 200 000 км', limit: 200000 }
];

/**
 * Price band matcher. The `value > 0` guard is load-bearing:
 * price-on-request cars have price 0 and must be EXCLUDED from "under-X".
 */
export function priceMatches(value: number, filter: string): boolean {
	if (!filter) return true;
	const option = priceOptions.find((item) => item.value === filter);
	if (!option) return true; // unknown band = pass
	if ('limit' in option && typeof option.limit === 'number')
		return value > 0 && value <= option.limit;
	if ('min' in option && typeof option.min === 'number') return value > option.min; // min EXCLUSIVE
	return true;
}

/** Mileage band matcher. Mirrors price (the `value > 0` guard excludes unknown mileage). */
export function mileageMatches(value: number, filter: string): boolean {
	if (!filter) return true;
	if (filter === 'over-200000') return value > 200000;
	const option = mileageOptions.find((item) => item.value === filter);
	if (!option) return true;
	return value > 0 && value <= option.limit;
}

export type InventoryCriteria = {
	query: string;
	brand: string[];
	model: string[];
	body: string[];
	fuel: string;
	transmission: string;
	price: string;
	mileage: string;
	/**
	 * Desktop-only multi-select екстри (AND across selected). Optional so the
	 * mobile page and the existing unit-test criteria (which never set it) keep
	 * type-checking — `undefined`/`[]` is a no-op.
	 */
	feature?: string[];
	/**
	 * Desktop-only condition shortcut (new/used) hydrated from `?condition`/`?type`.
	 * Optional for the same reason as `feature`.
	 */
	condition?: string;
	/** Listing availability derived from the source status: available or incoming. */
	availability?: string;
};

/**
 * Pure single-vehicle matcher. Order mirrors `filteredVehicles` exactly.
 * Free-text query = MULTI-TERM AND over a 12-field haystack (not a contiguous
 * substring): every whitespace-separated term must appear somewhere.
 */
export function vehicleMatches(v: InventoryListVehicle, criteria: InventoryCriteria): boolean {
	const haystack = normalize(
		[
			v.title,
			v.shortTitle,
			v.brand,
			v.model,
			v.body,
			v.fuel,
			v.transmission,
			v.year,
			v.mileage,
			v.color,
			v.features.join(' '),
			v.highlights.join(' ')
		].join(' ')
	);

	const needle = normalize(criteria.query);
	if (needle && !needle.split(/\s+/).every((term) => haystack.includes(term))) return false;
	if (criteria.brand.length && !criteria.brand.includes(v.brand)) return false;
	if (criteria.model.length && !criteria.model.includes(v.model)) return false;
	if (criteria.body.length && !criteria.body.includes(v.body)) return false;
	if (criteria.fuel && v.fuel !== criteria.fuel) return false;
	if (criteria.transmission && v.transmission !== criteria.transmission) return false;
	if (!priceMatches(v.price, criteria.price)) return false;
	if (!mileageMatches(v.mileageValue, criteria.mileage)) return false;

	// Екстри = AND across every selected feature (exact membership, normalized),
	// mirroring the legacy DOM-runtime's `features.every(...)`.
	if (criteria.feature?.length) {
		const owned = v.features.map(normalize);
		if (!criteria.feature.map(normalize).every((feature) => owned.includes(feature))) {
			return false;
		}
	}
	if (criteria.condition && getDayNightVehicleCondition(v) !== criteria.condition) {
		return false;
	}
	if (
		criteria.availability &&
		getDayNightVehicleAvailability(v) !== criteria.availability
	) {
		return false;
	}

	return true;
}

/**
 * SSR-safe reactive inventory filter store.
 *
 * Consumes a getter `() => InventoryListVehicle[]` (not a captured array) so the
 * underlying dataset can be reactive at the call site. NEVER instantiate as a
 * module-level singleton (server state would leak between requests) — use
 * `createInventoryFilterState` per component instance.
 */
export class InventoryFilterState {
	#getVehicles: () => InventoryListVehicle[];

	query = $state('');
	brand = $state<string[]>([]);
	model = $state<string[]>([]);
	body = $state<string[]>([]);
	fuel = $state('');
	transmission = $state('');
	price = $state('');
	mileage = $state('');
	feature = $state<string[]>([]);
	condition = $state('');
	availability = $state('');
	sort = $state<SortKey>('price-asc');

	constructor(getVehicles: () => InventoryListVehicle[], init?: URLSearchParams) {
		this.#getVehicles = getVehicles;

		if (init) {
			this.query = init.get('q') ?? '';
			// Multi-value fields read EVERY occurrence (`?brand=Audi&brand=BMW`) and
			// also tolerate comma-joined values (`?brand=Audi,BMW`) — superset of the
			// mobile comma-only form, required by the desktop deep-link + e2e.
			this.brand = splitParams(init.getAll('brand'));
			this.model = splitParams(init.getAll('model'));
			this.body = splitParams(init.getAll('body'));
			this.feature = splitParams(init.getAll('feature'));
			this.fuel = init.get('fuel') ?? '';
			this.transmission = init.get('transmission') ?? '';
			this.price = init.get('price') ?? '';
			this.mileage = init.get('mileage') ?? '';
			this.condition = normalizeCondition(init.get('condition') || init.get('type'));
			this.availability = init.get('availability') ?? '';
			// `sort` is intentionally NOT hydrated from the URL (mirrors MobileInventoryPage).
		}
	}

	vehicles = $derived.by(() => this.#getVehicles());

	get criteria(): InventoryCriteria {
		return {
			query: this.query,
			brand: this.brand,
			model: this.model,
			body: this.body,
			fuel: this.fuel,
			transmission: this.transmission,
			price: this.price,
			mileage: this.mileage,
			feature: this.feature,
			condition: this.condition,
			availability: this.availability
		};
	}

	filtered = $derived(this.vehicles.filter((vehicle) => vehicleMatches(vehicle, this.criteria)));
	sorted = $derived(sortVehicles(this.filtered, this.sort));
	resultCount = $derived(this.filtered.length);
}

export function createInventoryFilterState(
	getVehicles: () => InventoryListVehicle[],
	init?: URLSearchParams
): InventoryFilterState {
	return new InventoryFilterState(getVehicles, init);
}

/** Comma-split + trim + drop-empties (mirrors MobileInventoryPage URL hydration). */
function splitParam(value: string | null): string[] {
	return (value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

/**
 * Repeated-param hydration: flatten every `?name=…` occurrence, comma-split each,
 * trim, dedupe, drop-empties. Handles both `?brand=A&brand=B` and `?brand=A,B`.
 */
function splitParams(values: string[]): string[] {
	return Array.from(new Set(values.flatMap(splitParam)));
}
