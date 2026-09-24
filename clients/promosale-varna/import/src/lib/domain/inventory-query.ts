import type { InventoryFilters, SortKey, Vehicle } from '$lib/data/vehicles';

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
	if (layout === 'dashboard' || mode === 'dashboard') return 'dashboard';

	return 'classic';
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
	classic: '5',
	dashboard: '4'
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

export const parseInventoryState = (
	templateFile: string,
	options: InventoryStateOptions = {}
): Omit<InventoryState, 'selected'> => {
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
		query: getParamList(searchParams, 'q', 'query', 'model'),
		keyword: getParam(searchParams, 'keyword'),
		sourceId: getParam(searchParams, 'sourceId', 'source', 'stockNumber', 'vin'),
		status: getParam(searchParams, 'status'),
		transmission: getParamList(searchParams, 'transmission', 'Transmission', 'gearbox')
	};
	const normalizedFilters = normalizeFilters(filters);
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
		sort,
		sortParam,
		view
	};
};

export const parseInventoryQuery = (searchParams: URLSearchParams) =>
	parseInventoryState('listing-grid4-columns.html', { searchParams });

const filterKeys: Record<keyof InventoryFilters, string> = {
	bodyType: 'body',
	brand: 'brand',
	condition: 'condition',
	fuel: 'fuel',
	location: 'location',
	maxMileage: 'maxMileage',
	maxPrice: 'maxPrice',
	maxYear: 'maxYear',
	feature: 'feature',
	minMileage: 'minMileage',
	minPrice: 'minPrice',
	minYear: 'minYear',
	query: 'q',
	keyword: 'keyword',
	sourceId: 'sourceId',
	status: 'status',
	transmission: 'transmission'
};
export const inventoryAliases = [
	'bodyType',
	'bodystyle',
	'FuelType',
	'city',
	'area',
	'mileageTo',
	'priceTo',
	'price',
	'yearTo',
	'features',
	'extra',
	'equipment',
	'mileageFrom',
	'priceFrom',
	'yearFrom',
	'query',
	'model',
	'source',
	'stockNumber',
	'vin',
	'Transmission',
	'gearbox'
] as const;

export function serializeInventoryQuery(
	state: Pick<InventoryState, 'filters' | 'sortParam' | 'view' | 'layout' | 'filterPresentation'>,
	original = new URLSearchParams()
) {
	const params = new URLSearchParams(original);
	for (const key of [...Object.values(filterKeys), ...inventoryAliases, 'filterMode', 'mode'])
		params.delete(key);
	for (const [key, value] of Object.entries(state.filters))
		if (value !== undefined && value !== '')
			params.set(filterKeys[key as keyof InventoryFilters], String(value));
	params.set('sort', state.sortParam);
	params.set('view', state.view);
	if (state.layout !== 'classic') params.set('layout', state.layout);
	else params.delete('layout');
	if (state.filterPresentation === 'modal') params.set('filters', 'modal');
	else params.delete('filters');
	params.sort();
	return params;
}

/** Form controls share canonical URL names with quick filters and the all-filters dialog. */
export const inventoryFilterParam = (name: string): string =>
	(
		({ model: 'q', priceTo: 'maxPrice', mileageTo: 'maxMileage', bodyType: 'body' }) as Record<
			string,
			string
		>
	)[name] ?? name;
