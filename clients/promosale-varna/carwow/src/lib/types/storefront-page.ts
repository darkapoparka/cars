import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import type {
	InventoryGridDefinition,
	InventoryListVehicle,
	InventoryQuickFilterGroup
} from './inventory';

export type { InventoryGridDefinition, InventoryQuickFilterGroup } from './inventory';

export interface DetailFeatureItem {
	id: string;
	label: string;
}
export interface DetailFeatureTab {
	id: string;
	label: string;
	features: DetailFeatureItem[];
	active: boolean;
}

interface PageMetadata {
	title: string;
	description?: string;
}

/** Native page data only: no HTML fragments, template filenames, or executable scripts. */
export interface InventoryPageData extends PageMetadata {
	kind: 'inventory';
	gridDefinitions: InventoryGridDefinition[];
	quickFilters: InventoryQuickFilterGroup[];
	vehicles: InventoryListVehicle[];
}

export interface VehicleDetailPageData extends PageMetadata {
	kind: 'detail';
	slug: string;
	vehicle: DayNightVehicle;
	detailFeatureTabs: DetailFeatureTab[];
	detailSimilarVehicles: InventoryListVehicle[];
}

export interface MapInventoryPageData extends PageMetadata {
	kind: 'inventory-map';
	quickFilters: InventoryQuickFilterGroup[];
	vehicles: InventoryListVehicle[];
}
