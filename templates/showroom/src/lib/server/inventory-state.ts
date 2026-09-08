import {
	filterVehicles,
	sortVehicles,
	type InventoryFilters,
	type SortKey,
	type Vehicle
} from '$lib/data/vehicles';
import { listPublicVehicles } from './public-vehicles';

export type InventoryView = '3' | '4' | '5' | 'map';
export type InventoryLayout = 'classic' | 'dashboard';
export type InventoryFilterPresentation = 'popover' | 'modal';

export type InventoryStateOptions = {
	searchParams?: URLSearchParams;
	view?: InventoryView | string;
};

export type InventoryState = {
	filterPresentation: InventoryFilterPresentation;
	filters: InventoryFilters;
	layout: InventoryLayout;
	searchParams: URLSearchParams;
	selected: Vehicle[];
	sort: SortKey;
	sortParam: string;
	view: InventoryView;
};

const sortParamToKey: Record<string, SortKey> = {
	'best-match': 'template',
	default: 'template',
	'highest-price': 'highest',
	'highest-year': 'year',
	'lowest-mileage': 'mileage',
	'lowest-price': 'lowest',
	mileage: 'mileage',
	newest: 'newest',
	'newest-listed': 'template',
	'newest-year': 'newest',
	'oldest-listed': 'template',
	year: 'year'
};

const getParam = (params: URLSearchParams, ...keys: string[]) => {
	for (const key of keys) {
		const value = params.get(key)?.trim();

		if (value) return value;
	}

	return undefined;
};

const getParamList = (params: URLSearchParams, ...keys: string[]) => {
	const values = keys.flatMap((key) =>
		params
			.getAll(key)
			.flatMap((value) => value.split(','))
			.map((value) => value.trim())
			.filter(Boolean)
	);

	return values.length ? Array.from(new Set(values)).join(',') : undefined;
};

const getNumberParam = (params: URLSearchParams, ...keys: string[]) => {
	const value = getParam(params, ...keys);
	const parsed = value ? Number(value.replace(/[^\d.-]/g, '')) : Number.NaN;

	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const normalizeFilters = (filters: InventoryFilters) =>
	Object.fromEntries(
		Object.entries(filters).filter(([, value]) => {
			if (typeof value === 'number') return Number.isFinite(value);
			if (!value) return false;

			return String(value).trim().toLowerCase() !== 'all';
		})
	) as InventoryFilters;

export const resolveInventoryView = (value?: string | InventoryView | null): InventoryView => {
	if (value === '3' || value === 'grid3' || value === 'comfortable') return '3';
	if (value === '4' || value === 'dense' || value === 'grid4') return '4';
	if (value === '5' || value === 'compact' || value === 'grid5') return '5';
	if (value === 'map' || value === 'half-map' || value === 'halfmap') return 'map';

	return '4';
};

export const resolveInventoryLayout = (searchParams: URLSearchParams): InventoryLayout => {
	const layout = searchParams.get('layout')?.trim().toLowerCase();
	const mode = searchParams.get('mode')?.trim().toLowerCase();

	if (layout === 'classic' || layout === 'grid' || mode === 'classic') return 'classic';

	return 'dashboard';
};

export const resolveInventoryFilterPresentation = (
	searchParams: URLSearchParams
): InventoryFilterPresentation => {
	const value =
		searchParams.get('filters')?.trim().toLowerCase() ??
		searchParams.get('filterMode')?.trim().toLowerCase();

	return value === 'modal' || value === 'dialog' ? 'modal' : 'popover';
};

const defaultInventoryViewByLayout: Record<InventoryLayout, InventoryView> = {
	classic: '4',
	dashboard: '3'
};

export const defaultInventoryViewForLayout = (layout: InventoryLayout): InventoryView =>
	defaultInventoryViewByLayout[layout];

export const constrainInventoryViewForLayout = (
	layout: InventoryLayout,
	view: InventoryView
): InventoryView =>
	layout === 'dashboard' && view === '5' ? defaultInventoryViewForLayout(layout) : view;

export const inventoryTemplateForView = (view: InventoryView) => {
	if (view === '4') return 'listing-grid4-columns.html';
	if (view === '5') return 'listing-grid4-columns.html';
	if (view === 'map') return 'listing-gridstyle-halfmap.html';

	return 'listing-grid3-columns.html';
};

export const viewForInventoryTemplate = (
	templateFile: string,
	options: InventoryStateOptions = {}
) => {
	if (options.view) return resolveInventoryView(options.view);
	if (options.searchParams?.get('view'))
		return resolveInventoryView(options.searchParams.get('view'));
	if (templateFile === 'listing-grid4-columns.html') return '4';
	if (templateFile === 'listing-gridstyle-halfmap.html' || templateFile === 'listing-topmap.html') {
		return 'map';
	}

	return '3';
};

export const getInventoryState = (
	templateFile: string,
	options: InventoryStateOptions = {}
): InventoryState => {
	const searchParams = new URLSearchParams(options.searchParams);
	const sortParam = getParam(searchParams, 'sort') ?? 'best-match';
	const sort = sortParamToKey[sortParam] ?? 'template';
	const filters: InventoryFilters = {
		bodyType: getParamList(searchParams, 'body', 'bodyType', 'bodystyle'),
		brand: getParamList(searchParams, 'brand'),
		condition: getParam(searchParams, 'condition') as InventoryFilters['condition'],
		fuel: getParamList(searchParams, 'fuel', 'FuelType'),
		location: getParam(searchParams, 'location', 'city', 'area'),
		maxMileage: getNumberParam(searchParams, 'maxMileage', 'mileageTo'),
		maxPrice: getNumberParam(searchParams, 'maxPrice', 'priceTo', 'price'),
		maxYear: getNumberParam(searchParams, 'maxYear', 'yearTo'),
		feature: getParamList(searchParams, 'feature', 'features', 'extra', 'equipment'),
		minMileage: getNumberParam(searchParams, 'minMileage', 'mileageFrom'),
		minPrice: getNumberParam(searchParams, 'minPrice', 'priceFrom'),
		minYear: getNumberParam(searchParams, 'minYear', 'yearFrom'),
		query: getParamList(searchParams, 'q', 'query', 'keyword', 'model'),
		sourceId: getParam(searchParams, 'sourceId', 'source', 'stockNumber', 'vin'),
		status: getParam(searchParams, 'status'),
		transmission: getParamList(searchParams, 'transmission', 'Transmission', 'gearbox')
	};
	const normalizedFilters = normalizeFilters(filters);
	const filtered = filterVehicles(listPublicVehicles(), normalizedFilters);
	const layout = resolveInventoryLayout(searchParams);
	const filterPresentation = resolveInventoryFilterPresentation(searchParams);
	const hasExplicitView = Boolean(options.view || searchParams.get('view'));
	const requestedView = hasExplicitView
		? viewForInventoryTemplate(templateFile, options)
		: defaultInventoryViewForLayout(layout);
	const view = constrainInventoryViewForLayout(layout, requestedView);

	return {
		filterPresentation,
		filters: normalizedFilters,
		layout,
		searchParams,
		selected: sortVehicles(filtered, sort),
		sort,
		sortParam,
		view
	};
};
