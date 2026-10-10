import { filterVehicles, sortVehicles } from '$lib/domain/vehicle-search';
import type { Vehicle } from '$lib/types/vehicle';
import { listPublicVehicles } from './public-vehicles';
import {
	parseInventoryState,
	type InventoryStateOptions,
	type InventoryState
} from '$lib/domain/inventory-query';
export * from '$lib/domain/inventory-query';

export const getInventoryState = (
	templateFile: string,
	options: InventoryStateOptions = {},
	source: readonly Vehicle[] = listPublicVehicles()
): InventoryState => {
	const state = parseInventoryState(templateFile, options);
	return {
		...state,
		selected: sortVehicles(filterVehicles(source, state.filters), state.sort)
	};
};
