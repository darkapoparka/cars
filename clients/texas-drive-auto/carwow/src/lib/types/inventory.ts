import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

export type InventoryListVehicle = Pick<
	DayNightVehicle,
	| 'slug'
	| 'title'
	| 'shortTitle'
	| 'brand'
	| 'model'
	| 'year'
	| 'mileage'
	| 'mileageValue'
	| 'fuel'
	| 'transmission'
	| 'body'
	| 'color'
	| 'price'
	| 'priceEur'
	| 'monthly'
	| 'image'
	| 'gallery'
	| 'badges'
	| 'conditionLine'
	| 'features'
	| 'highlights'
>;

export type InventoryQuickFilterName =
	| 'brand'
	| 'model'
	| 'price'
	| 'mileage'
	| 'fuel'
	| 'transmission'
	| 'body'
	| 'feature';

export type InventoryQuickFilterOption = {
	value: string;
	label: string;
	/* Brands that actually stock this option — lets the runtime scope the
	   Модел menu to the selected Марка. */
	brands?: string[];
};

export type InventoryQuickFilterGroup = {
	name: InventoryQuickFilterName;
	label: string;
	placeholder: string;
	options: InventoryQuickFilterOption[];
};

export type InventoryGridDefinition = {
	name: 'two-column' | 'three-column' | 'four-column' | 'five-column';
	contentInnerClass: string;
	gridClass: string;
};

export type InventoryBudgetBucket = {
	label: string;
	value: string;
	count: number;
};

export type InventoryCountSummary = {
	total: number;
	activeSlugs: string[];
	brandCounts: Array<{ brand: string; count: number }>;
	bodyCounts: Array<{ body: string; count: number }>;
	budgetBuckets: InventoryBudgetBucket[];
	source: 'database' | 'static-fallback';
};
