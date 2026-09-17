import type { InventoryListVehicle } from '$lib/types/inventory';

export type SortKey = 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';
export type Mode = 'inventory' | 'map';
export type FilterSheetMode =
	| 'all'
	| 'search'
	| 'brand'
	| 'model'
	| 'sort'
	| 'fuel'
	| 'mileage'
	| 'body'
	| 'price'
	| 'transmission';

export type CountOption = {
	value: string;
	count: number;
};

export type MobileInventoryVehicle = InventoryListVehicle;
