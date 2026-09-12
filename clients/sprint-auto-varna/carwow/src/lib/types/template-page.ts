import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import type {
	InventoryGridDefinition,
	InventoryListVehicle,
	InventoryQuickFilterGroup
} from './inventory';

export type TemplateChrome = {
	title: string;
	description?: string;
	bodyClasses: string[];
	headStyles: string;
	scriptSrcs: string[];
	headerHtml: string;
	footerHtml: string;
	trailingHtml: string;
};

export type RenderedTemplatePage = TemplateChrome & {
	mainHtml: string;
	templateFile: string;
	routePath: string;
};

export type { InventoryGridDefinition, InventoryQuickFilterGroup } from './inventory';

export type DetailFeatureItem = {
	id: string;
	label: string;
};

export type DetailFeatureTab = {
	id: string;
	label: string;
	features: DetailFeatureItem[];
	active: boolean;
};

// Native storefront page payloads. The loaders build these purely from Car data
// + per-route SEO (title/description come from routeSeo/vehicleSeo). `scriptSrcs`
// is always [] (the storefront ships no template scripts) — kept so the
// StorefrontPageHead prop contract is unchanged.
export type InventoryTemplatePage = {
	kind: 'inventory';
	title: string;
	description?: string;
	scriptSrcs: string[];
	gridDefinitions: InventoryGridDefinition[];
	quickFilters: InventoryQuickFilterGroup[];
	vehicles: InventoryListVehicle[];
};

export type DetailTemplatePage = {
	kind: 'detail';
	slug: string;
	vehicle: DayNightVehicle;
	title: string;
	description?: string;
	scriptSrcs: string[];
	detailFeatureTabs: DetailFeatureTab[];
	detailSimilarVehicles: InventoryListVehicle[];
};

export type RawTemplatePageData = TemplateChrome & {
	kind: 'raw';
	mainHtml: string;
	templateFile: string;
	routePath: string;
	filterSidebarHtml?: string;
	dashboardContentInnerHtml?: string;
	vehicles?: InventoryListVehicle[];
};

export type MapInventoryTemplatePage = {
	kind: 'inventory-map';
	title: string;
	description?: string;
	scriptSrcs: string[];
	quickFilters: InventoryQuickFilterGroup[];
	vehicles: InventoryListVehicle[];
};

export type InventorySlugTemplatePage = DetailTemplatePage | RawTemplatePageData;
