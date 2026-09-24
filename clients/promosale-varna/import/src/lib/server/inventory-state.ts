import { filterVehicles, sortVehicles } from '$lib/data/vehicles';
import { listPublicVehicles } from './public-vehicles';
import {
	parseInventoryState,
	type InventoryStateOptions,
	type InventoryState
} from '$lib/domain/inventory-query';
export * from '$lib/domain/inventory-query';

export const getInventoryState = (
	templateFile: string,
	options: InventoryStateOptions = {}
): InventoryState => {
	const state = parseInventoryState(templateFile, options);
	return {
		...state,
		selected: sortVehicles(filterVehicles(listPublicVehicles(), state.filters), state.sort)
	};
};
