import { createContext } from 'svelte';
import { replaceState } from '$app/navigation';
import { resolve } from '$app/paths';
import { SvelteURLSearchParams } from 'svelte/reactivity';
import {
	createInventoryFilterState,
	type InventoryFilterState
} from '$lib/state/inventory-filters.svelte';
import type { InventoryListVehicle, InventoryQuickFilterGroup } from '$lib/types/inventory';
import { sortInventory, type DesktopSortKey } from './desktop-inventory-sort';

type InventoryFilterPath = '/inventory' | `/inventory?${string}`;
type InventoryQuickFiltersSource =
	| InventoryQuickFilterGroup[]
	| (() => InventoryQuickFilterGroup[] | undefined)
	| undefined;

/**
 * Quick-select type pills (the `.daynight-inventory-type-pill` shelf). Shared
 * between the pills component and `hasRenderedTags` so a filter that has a pill
 * never ALSO renders an applied-filter tag (legacy `hasShortcutFor` rule).
 */
export type InventoryShortcut = {
	label: string;
	field?: 'brand' | 'fuel' | 'body' | 'price' | 'mileage' | 'availability';
	value?: string;
	clearsAll?: boolean;
};

export const inventoryShortcuts: InventoryShortcut[] = [
	{ label: 'Всички', clearsAll: true },
	{ label: 'Mercedes-Benz', field: 'brand', value: 'Mercedes-Benz' },
	{ label: 'BMW', field: 'brand', value: 'BMW' },
	{ label: 'Audi', field: 'brand', value: 'Audi' },
	{ label: 'Джип', field: 'body', value: 'Джип' },
	{ label: 'Седан', field: 'body', value: 'Седан' },
	{ label: 'Купе', field: 'body', value: 'Купе' },
	{ label: 'Ван', field: 'body', value: 'Ван' },
	{ label: 'Налични', field: 'availability', value: 'available' },
	{ label: 'Дизел', field: 'fuel', value: 'Дизел' },
	{ label: 'Бензин', field: 'fuel', value: 'Бензин' },
	{ label: 'До 50 000 EUR', field: 'price', value: 'under-50000' },
	{ label: 'До 100 000 км', field: 'mileage', value: 'under-100000' }
];

function hasShortcutFor(field: string, value: string): boolean {
	return inventoryShortcuts.some(
		(shortcut) => shortcut.field === field && shortcut.value === value
	);
}

/** Drop empties + duplicates, preserving order (no `Set` — keeps this .svelte.ts file clean). */
function dedupe(values: string[]): string[] {
	const out: string[] = [];
	for (const value of values) {
		if (value && !out.includes(value)) out.push(value);
	}
	return out;
}

/**
 * Desktop-inventory reactive controller. The single source of truth for the
 * `/inventory` grid + filter UI — replaces the deleted DOM-mutation runtime.
 *
 * Composes the shared {@link InventoryFilterState} (query/brand/model/body/fuel/
 * transmission/price/mileage/feature/condition) and layers the desktop-only sort
 * + URL sync + reactive result count on top. Provided via context so every
 * control (search, dropdowns, type-pills, sort, clear-all) reads/writes the same
 * instance without prop-threading. Instantiated PER page mount (never a module
 * singleton) so SSR never leaks one request's filters into another.
 */
export class DesktopInventoryFilters {
	readonly store: InventoryFilterState;
	sort = $state<DesktopSortKey>('best-match');
	/** Name of the quick-field whose inline popover is open (''=none). One at a time. */
	openField = $state('');

	constructor(
		getVehicles: () => InventoryListVehicle[],
		init?: URLSearchParams,
		quickFilters?: InventoryQuickFiltersSource
	) {
		this.store = createInventoryFilterState(getVehicles, init);
		// Map each Модел option → the brands that stock it, so the menu can scope to
		// the chosen Марка and stale model selections can be pruned when it changes.
		const quickFilterGroups = typeof quickFilters === 'function' ? quickFilters() : quickFilters;
		const modelGroup = quickFilterGroups?.find((group) => group.name === 'model');
		for (const option of modelGroup?.options ?? []) {
			if (option.value) this.optionBrandsByModel[option.value] = option.brands ?? [];
		}
	}

	/** Filtered + desktop-sorted list the grid renders (keyed `{#each}`). */
	sorted = $derived.by(() => sortInventory(this.store.filtered, this.sort));
	resultCount = $derived.by(() => this.store.resultCount);

	/** Any non-sort filter active — drives clear-all/applied-filters visibility. */
	hasActiveFilters = $derived.by(() =>
		Boolean(
			this.store.query ||
			this.store.brand.length ||
			this.store.model.length ||
			this.store.body.length ||
			this.store.feature.length ||
			this.store.fuel ||
			this.store.transmission ||
			this.store.price ||
			this.store.mileage ||
			this.store.condition ||
			this.store.availability
		)
	);

	/**
	 * Applied-filter chips for `#filterTags`. A filter value that has a matching
	 * type-pill (e.g. body=SUV, fuel=Електрически, price=under-10000) is NOT
	 * rendered as a chip — the pill already represents it (legacy behaviour). This
	 * is what makes `#filterResults`/`#btnClearAll` stay hidden for pill filters
	 * but appear for brand/feature multi-selects.
	 */
	appliedTags = $derived.by(() => {
		const s = this.store;
		const tags: Array<{ field: string; value: string; label: string }> = [];
		const pushSingle = (field: string, value: string, label: string) => {
			if (value && !hasShortcutFor(field, value)) tags.push({ field, value, label });
		};
		const pushMulti = (field: string, values: string[]) => {
			for (const value of values) {
				if (!hasShortcutFor(field, value)) tags.push({ field, value, label: value });
			}
		};
		pushMulti('brand', s.brand);
		pushMulti('model', s.model);
		pushMulti('feature', s.feature);
		// body is single-value in the UI but an array in the store.
		for (const value of s.body) pushSingle('body', value, value);
		pushSingle('fuel', s.fuel, s.fuel);
		pushSingle('transmission', s.transmission, s.transmission);
		pushSingle('price', s.price, s.price);
		pushSingle('mileage', s.mileage, s.mileage);
		pushSingle('availability', s.availability, s.availability === 'incoming' ? 'Очакван внос' : 'Налични');
		if (s.query) tags.push({ field: 'q', value: s.query, label: s.query });
		return tags;
	});

	hasRenderedTags = $derived.by(() => this.appliedTags.length > 0);

	/** Remove one applied-filter chip. */
	removeTag(field: string, value: string) {
		const s = this.store;
		if (field === 'q') s.query = '';
		else if (field === 'brand') s.brand = s.brand.filter((item) => item !== value);
		else if (field === 'model') s.model = s.model.filter((item) => item !== value);
		else if (field === 'feature') s.feature = s.feature.filter((item) => item !== value);
		else if (field === 'body') s.body = s.body.filter((item) => item !== value);
		else if (field === 'fuel') s.fuel = '';
		else if (field === 'transmission') s.transmission = '';
		else if (field === 'price') s.price = '';
		else if (field === 'mileage') s.mileage = '';
		else if (field === 'availability') s.availability = '';
		this.syncUrl();
	}

	clearAll() {
		const s = this.store;
		s.query = '';
		s.brand = [];
		s.model = [];
		s.body = [];
		s.feature = [];
		s.fuel = '';
		s.transmission = '';
		s.price = '';
		s.mileage = '';
		s.condition = '';
		s.availability = '';
	}

	/** Read a quick-field's current selection as an array (singles wrap to [v]). */
	getFieldValues(name: string): string[] {
		const s = this.store;
		if (name === 'brand') return s.brand;
		if (name === 'model') return s.model;
		if (name === 'body') return s.body;
		if (name === 'feature') return s.feature;
		if (name === 'fuel') return s.fuel ? [s.fuel] : [];
		if (name === 'transmission') return s.transmission ? [s.transmission] : [];
		if (name === 'price') return s.price ? [s.price] : [];
		if (name === 'mileage') return s.mileage ? [s.mileage] : [];
		if (name === 'availability') return s.availability ? [s.availability] : [];
		return [];
	}

	/** Write a quick-field's selection. Singles take the first value (or clear). */
	setFieldValues(name: string, values: string[]) {
		const s = this.store;
		const clean = dedupe(values);
		if (name === 'brand') {
			s.brand = clean;
			this.pruneModelsToBrands();
		} else if (name === 'model') s.model = clean;
		else if (name === 'body') s.body = clean;
		else if (name === 'feature') s.feature = clean;
		else if (name === 'fuel') s.fuel = clean[0] ?? '';
		else if (name === 'transmission') s.transmission = clean[0] ?? '';
		else if (name === 'price') s.price = clean[0] ?? '';
		else if (name === 'mileage') s.mileage = clean[0] ?? '';
		else if (name === 'availability') s.availability = clean[0] ?? '';
	}

	/**
	 * Drop any selected model that no longer belongs to the chosen brand(s) — same
	 * guard the legacy runtime ran when the Марка changed (`syncModelOptionsToBrands`).
	 * `optionBrandsByModel` is set once from the rendered option metadata.
	 */
	// Static metadata (set once in the constructor) — a plain record, never reactive.
	optionBrandsByModel: Record<string, string[]> = {};
	private pruneModelsToBrands() {
		const brands = this.store.brand;
		if (!brands.length || !this.store.model.length) return;
		this.store.model = this.store.model.filter((model) => {
			const owners = this.optionBrandsByModel[model];
			return !owners || owners.length === 0 || owners.some((brand) => brands.includes(brand));
		});
	}

	/** Whether a model option should be visible given the current brand selection. */
	isModelVisibleForBrands(modelValue: string, optionBrands: string[] | undefined): boolean {
		const brands = this.store.brand;
		return (
			!modelValue ||
			!optionBrands ||
			optionBrands.length === 0 ||
			brands.length === 0 ||
			optionBrands.some((brand) => brands.includes(brand))
		);
	}

	/** True when `value` is the current selection for a single-value field. */
	isShortcutActive(field: string | undefined, value: string): boolean {
		if (!field || !value) return false;
		const s = this.store;
		if (field === 'brand') return s.brand.includes(value);
		if (field === 'model') return s.model.includes(value);
		if (field === 'body') return s.body.includes(value);
		if (field === 'feature') return s.feature.includes(value);
		if (field === 'fuel') return s.fuel === value;
		if (field === 'transmission') return s.transmission === value;
		if (field === 'price') return s.price === value;
		if (field === 'mileage') return s.mileage === value;
		if (field === 'condition') return s.condition === value;
		if (field === 'availability') return s.availability === value;
		return false;
	}

	/** Toggle a single-value shortcut field (type-pills): set, or clear if already set. */
	toggleShortcut(field: string, value: string) {
		const s = this.store;
		const active = this.isShortcutActive(field, value);
		if (field === 'brand') s.brand = active ? [] : [value];
		else if (field === 'model') s.model = active ? [] : [value];
		else if (field === 'body') s.body = active ? [] : [value];
		else if (field === 'feature') s.feature = active ? [] : [value];
		else if (field === 'fuel') s.fuel = active ? '' : value;
		else if (field === 'transmission') s.transmission = active ? '' : value;
		else if (field === 'price') s.price = active ? '' : value;
		else if (field === 'mileage') s.mileage = active ? '' : value;
		else if (field === 'condition') s.condition = active ? '' : value;
		else if (field === 'availability') s.availability = active ? '' : value;
	}

	/**
	 * Mirror the active filters into the URL (replaceState, no nav). Brand/model/
	 * feature are appended per-value (`?brand=Audi&brand=BMW`), singles are set,
	 * `sort` is intentionally NOT serialized (mirrors the legacy runtime + mobile).
	 */
	syncUrl() {
		const params = new SvelteURLSearchParams();
		for (const brand of this.store.brand) params.append('brand', brand);
		for (const model of this.store.model) params.append('model', model);
		for (const body of this.store.body) params.append('body', body);
		for (const feature of this.store.feature) params.append('feature', feature);
		if (this.store.fuel) params.set('fuel', this.store.fuel);
		if (this.store.transmission) params.set('transmission', this.store.transmission);
		if (this.store.price) params.set('price', this.store.price);
		if (this.store.mileage) params.set('mileage', this.store.mileage);
		if (this.store.query) params.set('q', this.store.query);
		if (this.store.condition) params.set('condition', this.store.condition);
		if (this.store.availability) params.set('availability', this.store.availability);

		const query = params.toString();
		const nextPath: InventoryFilterPath = query ? `/inventory?${query}` : '/inventory';
		replaceState(resolve(nextPath), {});
	}
}

export const [getDesktopInventoryContext, setDesktopInventoryContext] =
	createContext<DesktopInventoryFilters>();

export function provideDesktopInventoryContext(
	getVehicles: () => InventoryListVehicle[],
	init?: URLSearchParams,
	quickFilters?: InventoryQuickFiltersSource
) {
	const filters = new DesktopInventoryFilters(getVehicles, init, quickFilters);
	setDesktopInventoryContext(filters);
	return filters;
}
