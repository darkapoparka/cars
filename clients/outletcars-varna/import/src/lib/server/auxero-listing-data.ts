import { daynightBrand, daynightConsultants, daynightContact, daynightFetchedAt } from '$lib/data/daynight';
import type { Agent } from '$lib/data/agents';
import { listManagedAgents, type ManagedAgent } from './agents';
import {
	getAgentDetailOrFallback,
	getAgentInventoryState,
	listAgentDetails
} from './agent-detail-state';
import type { DayNightSession } from './auth';
import { getCompareVehicles } from './compare-state';
import { bodyTypes, brands, fuels, vehicles, type Vehicle } from '$lib/data/vehicles';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView,
	type InventoryState,
	type InventoryView
} from './inventory-state';
import { getVehicleDetailOrFallback, getVehicleDetailRelated } from './vehicle-detail-state';

export { getInventoryState, inventoryTemplateForView, resolveInventoryView };

export type AuxeroRenderOptions = {
	request?: Request;
	routePath?: string;
	searchParams?: URLSearchParams;
	session?: DayNightSession;
	slug?: string;
	view?: InventoryView | string;
};

const sortLabels: Record<string, string> = {
	'best-match': 'Best Match',
	'highest-price': 'Highest Price',
	'lowest-mileage': 'Lowest Mileage',
	'lowest-price': 'Lowest Price',
	newest: 'Newest Year',
	'newest-listed': 'Newest Listed'
};

const compareIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_13399_19575)">
		<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M6.875 10H13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M10 6.875V13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</g>
</svg>`;

const heartIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_13399_19510)">
		<path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
	</g>
</svg>`;

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const translatedFilterValueProtections = [
	['Automatic', 'Automati&#99;', 'Automati%63'],
	['Manual', 'Manu&#97;l', 'Manu%61l'],
	['On request', 'On r&#101;quest', 'On%20r%65quest'],
	['Petrol', 'Petr&#111;l', 'Petr%6fl'],
	['Diesel', 'Dies&#101;l', 'Dies%65l'],
	['Hybrid', 'Hybr&#105;d', 'Hybr%69d'],
	['Sedan', 'S&#101;dan', 'S%65dan'],
	['Cabriolet', 'Cabriol&#101;t', 'Cabriol%65t'],
	['Convertible', 'Convertibl&#101;', 'Convertibl%65'],
	['Coupe', 'Coup&#101;', 'Coup%65'],
	['Hatchback', 'Hatchbac&#107;', 'Hatchbac%6b'],
	['Crossover', 'Crossov&#101;r', 'Crossov%65r'],
	['Pickup', 'Pick&#117;p', 'Pick%75p'],
	['Wagon', 'Wag&#111;n', 'Wag%6fn']
] as const;

const escapeFilterValueAttribute = (value: string | number) =>
	translatedFilterValueProtections.reduce(
		(result, [raw, entity]) => result.replaceAll(raw, entity),
		escapeHtml(value)
	);

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const inventoryUrl = (state: InventoryState, overrides: Record<string, string | undefined>) => {
	const params = new URLSearchParams(state.searchParams);

	for (const [key, value] of Object.entries(overrides)) {
		if (!value || (key === 'view' && value === '4')) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const isDashboardLayout = (state: InventoryState) => {
	const layout = state.searchParams.get('layout')?.trim().toLowerCase();
	const mode = state.searchParams.get('mode')?.trim().toLowerCase();

	return layout === 'dashboard' || layout === 'sidebar' || mode === 'dashboard';
};

const modelOptions = Array.from(new Set(vehicles.map((vehicle) => vehicle.model).filter(Boolean)))
	.sort((a, b) => a.localeCompare(b, 'en'))
	.slice(0, 24);
const transmissionOptions = Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission)))
	.filter(Boolean)
	.sort();
const brandLogos: Record<string, string> = {
	Audi: '/assets/images/brand/brand-3.webp',
	BMW: '/assets/images/brand/brand-1.webp',
	Ford: '/assets/images/brand/brand-7.webp',
	Honda: '/assets/images/brand/brand-4.webp',
	Hyundai: '/assets/images/brand/brand-8.webp',
	Kia: '/assets/daynight/brands/kia-transparent.webp',
	Mazda: '/assets/images/brand/brand-10.webp',
	'Mercedes-Benz': '/assets/images/brand/brand-2.webp',
	Porsche: '/assets/daynight/brands/porsche.webp',
	Toyota: '/assets/images/brand/brand-5.webp',
	Volvo: '/assets/images/brand/brand-6.webp',
	Volkswagen: '/assets/daynight/brands/volkswagen.webp'
};
const brandCounts = new Map<string, number>();

for (const vehicle of vehicles) {
	brandCounts.set(vehicle.brand, (brandCounts.get(vehicle.brand) ?? 0) + 1);
}

const inventoryBrandPills = brands
	.map((brand) => ({
		count: brandCounts.get(brand) ?? 0,
		image: brandLogos[brand] ?? '/dealer/logo-on-light-v2.svg',
		label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand,
		value: brand
	}))
	.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'en'));
const bodyTypeCounts = new Map<string, number>();

for (const vehicle of vehicles) {
	bodyTypeCounts.set(vehicle.bodyType, (bodyTypeCounts.get(vehicle.bodyType) ?? 0) + 1);
}

const inventoryBodyTypePills = bodyTypes
	.map((bodyType) => ({
		count: bodyTypeCounts.get(bodyType) ?? 0,
		label: bodyType,
		value: bodyType
	}))
	.filter((bodyType) => bodyType.value !== 'Car' && bodyType.count > 0)
	.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'en'));
const fuelCounts = new Map<string, number>();

for (const vehicle of vehicles) {
	fuelCounts.set(vehicle.fuel, (fuelCounts.get(vehicle.fuel) ?? 0) + 1);
}

const fuelLabels: Record<string, string> = {
	'Plug-in хибрид': 'Plug-in Hybrid'
};
const fuelOrder = ['Petrol', 'Plug-in хибрид', 'EV'];
const inventoryFuelPills = fuels
	.map((fuel) => ({
		count: fuelCounts.get(fuel) ?? 0,
		label: fuelLabels[fuel] ?? fuel,
		value: fuel
	}))
	.filter((fuel) => fuel.count > 0 && fuel.value !== '340 к.с.')
	.sort((left, right) => {
		const leftIndex = fuelOrder.indexOf(left.value);
		const rightIndex = fuelOrder.indexOf(right.value);

		if (leftIndex !== -1 || rightIndex !== -1) {
			return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
		}

		return right.count - left.count || left.label.localeCompare(right.label, 'en');
	});

const popularFeatureOptions = [
	'Навигация',
	'Парктроник',
	'Подгряване на седалките',
	'Безключово палене',
	'Сервизна книжка',
	'Климатроник',
	'Система ISOFIX'
].filter((feature) => vehicles.some((vehicle) => vehicle.features.includes(feature)));

const priceFilterOptions = [
	{ label: 'Up to 30 000 EUR', value: '30000' },
	{ label: 'Up to 50 000 EUR', value: '50000' },
	{ label: 'Up to 70 000 EUR', value: '70000' },
	{ label: 'Up to 100 000 EUR', value: '100000' }
];

const mileageFilterOptions = [
	{ label: 'Up to 50 000 km', value: '50000' },
	{ label: 'Up to 80 000 km', value: '80000' },
	{ label: 'Up to 100 000 km', value: '100000' },
	{ label: 'Up to 150 000 km', value: '150000' }
];

const viewIcon = (view: InventoryView) => {
	if (view === '5') {
		return `<svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="10" cy="6" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="17" cy="6" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="24" cy="6" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="31" cy="6" r="2.25" fill="white" stroke="#9FA1A4"/>
			<circle cx="3" cy="14" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="10" cy="14" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="17" cy="14" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="24" cy="14" r="2.25" fill="white" stroke="#9FA1A4"/><circle cx="31" cy="14" r="2.25" fill="white" stroke="#9FA1A4"/>
		</svg>`;
	}

	if (view === '4') {
		return `<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="11" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="19" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="27" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/>
			<circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="11" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="19" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="27" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/>
		</svg>`;
	}

	if (view === 'map') {
		return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="5" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><rect x="9" y="3.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4"/>
			<circle cx="5" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><rect x="9" y="11.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4"/>
		</svg>`;
	}

	return `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="3" cy="6" r="2.5" stroke="#9FA1A4"/><circle cx="11" cy="6" r="2.5" stroke="#9FA1A4"/><circle cx="19" cy="6" r="2.5" stroke="#9FA1A4"/>
		<circle cx="3" cy="14" r="2.5" stroke="#9FA1A4"/><circle cx="11" cy="14" r="2.5" stroke="#9FA1A4"/><circle cx="19" cy="14" r="2.5" stroke="#9FA1A4"/>
	</svg>`;
};

const viewToggle = (state: InventoryState) =>
	(['3', '4', '5', 'map'] as const)
		.map((view) => {
			const labels: Record<InventoryView, string> = {
				'3': 'Comfortable 3 grid',
				'4': 'Dense 4 grid',
				'5': 'Compact 5 grid',
				map: 'Half map'
			};

			return `<a class="item-menu ${state.view === view ? 'active' : ''}" href="${inventoryUrl(
				state,
				{
					view
				}
			)}" data-daynight-view-toggle aria-label="${labels[view]}" title="${labels[view]}">${viewIcon(
				view
			)}</a>`;
		})
		.join('');

const sortDropdown = (state: InventoryState) => {
	const options = [
		['best-match', 'Best Match'],
		['lowest-price', 'Lowest Price'],
		['highest-price', 'Highest Price'],
		['lowest-mileage', 'Lowest Mileage'],
		['newest-year', 'Newest Year'],
		['newest-listed', 'Newest Listed']
	];

	return `<ul class="core-dropdown__list">
		${options
			.map(
				([value, label]) => `<li class="core-dropdown__item">
			<a href="${inventoryUrl(state, { sort: value })}" class="core-dropdown__option ${
				state.sortParam === value ? 'active' : ''
			}" data-sort="${value}" data-value="${value}">${label}</a>
		</li>`
			)
			.join('')}
	</ul>`;
};

const splitFilterValues = (value?: string | number | null) =>
	String(value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

const joinFilterValues = (values: string[]) =>
	Array.from(new Set(values.filter(Boolean))).join(',');

const hasFilterValue = (values: string[], value: string) =>
	values.some((item) => item.toLowerCase() === value.toLowerCase());

const modelOptionsForBrands = (brandFilter?: string) => {
	const selectedBrands = splitFilterValues(brandFilter);
	const source = selectedBrands.length
		? vehicles.filter((vehicle) => hasFilterValue(selectedBrands, vehicle.brand))
		: vehicles;

	return Array.from(new Set(source.map((vehicle) => vehicle.model).filter(Boolean)))
		.sort((a, b) => a.localeCompare(b, 'en'))
		.slice(0, 24);
};

const selectedSearchQuery = (state: InventoryState) =>
	state.searchParams.get('q') ??
	state.searchParams.get('query') ??
	state.searchParams.get('keyword') ??
	'';

const selectedModel = (state: InventoryState) => {
	const model = joinFilterValues(state.searchParams.getAll('model').flatMap(splitFilterValues));

	if (model) return model;

	const queryValues = splitFilterValues(state.filters.query);
	const availableModels = modelOptionsForBrands(state.filters.brand);

	if (!queryValues.length) return '';
	if (queryValues.some((value) => !hasFilterValue(availableModels, value))) return '';

	return joinFilterValues(queryValues);
};

const selectedNumber = (value?: number) => (value ? String(value) : '');

type InventoryFilterOption =
	| string
	| { count?: number; image?: string; label: string; value: string };

const optionParts = (option: InventoryFilterOption) => ({
	count: typeof option === 'string' ? undefined : option.count,
	image: typeof option === 'string' ? undefined : option.image,
	label: typeof option === 'string' ? option : option.label,
	value: typeof option === 'string' ? option : option.value
});

const selectedOptionLabels = (
	options: InventoryFilterOption[],
	selected?: string | number,
	placeholder = ''
) => {
	const selectedValues = splitFilterValues(selected);
	const labels = options
		.map(optionParts)
		.filter((option) => option.value && hasFilterValue(selectedValues, option.value))
		.map((option) => option.label);

	if (!labels.length) return placeholder;
	if (labels.length <= 2) return labels.join(' + ');

	return `${labels.length} selected`;
};

const optionLabelForValue = (options: InventoryFilterOption[], value: string | number) => {
	const selectedValue = String(value);

	return options
		.map(optionParts)
		.find((option) => option.value && option.value.toLowerCase() === selectedValue.toLowerCase())
		?.label;
};

const activeFilterDisplayLabel = (
	key: InventoryFilterKey,
	value: string | number,
	state: InventoryState
) => {
	const optionLabel =
		key === 'brand'
			? optionLabelForValue(inventoryBrandPills, value)
			: key === 'query'
				? optionLabelForValue(modelOptionsForBrands(state.filters.brand), value)
				: key === 'bodyType'
					? optionLabelForValue(inventoryBodyTypePills, value)
					: key === 'feature'
						? optionLabelForValue(popularFeatureOptions, value)
						: key === 'fuel'
							? optionLabelForValue(inventoryFuelPills, value)
							: key === 'transmission'
								? optionLabelForValue(transmissionOptions, value)
								: key === 'maxMileage'
									? optionLabelForValue(mileageFilterOptions, value)
									: key === 'maxPrice'
										? optionLabelForValue(priceFilterOptions, value)
										: undefined;

	if (optionLabel) return optionLabel;

	return typeof value === 'number' ? value.toLocaleString('fr-FR').replace(/\u202f/g, ' ') : value;
};

const filterDropdownOption = (
	name: string,
	option: InventoryFilterOption,
	selectedValues: string[],
	type: 'checkbox' | 'radio'
) => {
	const { count, image, label, value } = optionParts(option);
	const checked = value
		? hasFilterValue(selectedValues, value)
		: !selectedValues.length || hasFilterValue(selectedValues, value);

	return `<label class="filter-checkbox daynight-inventory-filter-option">
		${image ? `<img src="${escapeHtml(image)}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ''}
		<input type="${type}" name="${escapeHtml(name)}" value="${escapeFilterValueAttribute(value)}" ${
			checked ? 'checked' : ''
		} data-inventory-filter-input>
		<span>${escapeHtml(label)}</span>
		${typeof count === 'number' ? `<small>${count}</small>` : ''}
	</label>`;
};

const inventoryFilterDropdown = ({
	label,
	mode = 'multiple',
	name,
	options,
	placeholder,
	selected
}: {
	label: string;
	mode?: 'multiple' | 'single';
	name: string;
	options: InventoryFilterOption[];
	placeholder: string;
	selected?: string | number;
}) => {
	const id = `daynight-inventory-filter-${name.replace(/[^a-z0-9-]/gi, '-')}`;
	const selectedValues = splitFilterValues(selected);
	const summary = selectedOptionLabels(options, selected, placeholder);
	const inputType = mode === 'single' ? 'radio' : 'checkbox';
	const allLabel = placeholder;

	return `<div class="daynight-inventory-filter-field search-cars__select filter-select-dropdown bg-white" data-name="${escapeHtml(
		name
	)}" data-inventory-filter-field data-filter-mode="${mode}">
		<label for="${escapeHtml(id)}" class="search-cars__label">${escapeHtml(label)}</label>
		<input type="checkbox" id="${escapeHtml(id)}" class="filter-select-dropdown__toggle" aria-hidden="true">
		<label for="${escapeHtml(id)}" class="filter-select-dropdown__text">
			<span>${escapeHtml(summary)}</span>
		</label>
		<div class="filter-select-dropdown__menu">
			<div class="filter-select-dropdown__list">
				${filterDropdownOption(name, { label: allLabel, value: '' }, selectedValues, inputType)}
				${options.map((option) => filterDropdownOption(name, option, selectedValues, inputType)).join('')}
			</div>
		</div>
	</div>`;
};

const inventorySearchHiddenInputs = (state: InventoryState) =>
	[
		state.filters.condition
			? `<input type="hidden" name="condition" value="${escapeHtml(state.filters.condition)}">`
			: '',
		state.filters.location
			? `<input type="hidden" name="location" value="${escapeHtml(state.filters.location)}">`
			: '',
		state.filters.minMileage
			? `<input type="hidden" name="minMileage" value="${state.filters.minMileage}">`
			: '',
		state.filters.minPrice
			? `<input type="hidden" name="minPrice" value="${state.filters.minPrice}">`
			: '',
		state.filters.minYear
			? `<input type="hidden" name="minYear" value="${state.filters.minYear}">`
			: '',
		state.filters.maxYear
			? `<input type="hidden" name="maxYear" value="${state.filters.maxYear}">`
			: '',
		state.filters.sourceId
			? `<input type="hidden" name="sourceId" value="${escapeHtml(state.filters.sourceId)}">`
			: '',
		state.filters.status
			? `<input type="hidden" name="status" value="${escapeHtml(state.filters.status)}">`
			: '',
		state.view !== '4' ? `<input type="hidden" name="view" value="${state.view}">` : '',
		state.sortParam !== 'best-match'
			? `<input type="hidden" name="sort" value="${escapeHtml(state.sortParam)}">`
			: '',
		isDashboardLayout(state) ? '<input type="hidden" name="layout" value="dashboard">' : ''
	].join('');

const inventorySidebarHiddenInputs = (state: InventoryState) =>
	[
		selectedSearchQuery(state)
			? `<input type="hidden" name="q" value="${escapeHtml(selectedSearchQuery(state))}">`
			: '',
		inventorySearchHiddenInputs(state)
	].join('');

type InventoryFilterKey = keyof InventoryState['filters'];

const filterLabels: Record<InventoryFilterKey, string> = {
	bodyType: 'Body',
	brand: 'Brand',
	condition: 'Condition',
	feature: 'Feature',
	fuel: 'Fuel',
	location: 'Location',
	maxMileage: 'Max mileage',
	maxPrice: 'Max price',
	maxYear: 'Max year',
	minMileage: 'Min mileage',
	minPrice: 'Min price',
	minYear: 'Min year',
	query: 'Search',
	keyword: 'Keyword',
	sourceId: 'Stock',
	status: 'Status',
	transmission: 'Transmission'
};

const filterParamAliases: Record<InventoryFilterKey, string[]> = {
	bodyType: ['body', 'bodyType', 'bodystyle'],
	brand: ['brand'],
	condition: ['condition'],
	feature: ['feature', 'features', 'extra', 'equipment'],
	fuel: ['fuel', 'FuelType'],
	location: ['location', 'city', 'area'],
	maxMileage: ['maxMileage', 'mileageTo'],
	maxPrice: ['maxPrice', 'priceTo', 'price'],
	maxYear: ['maxYear', 'yearTo'],
	minMileage: ['minMileage', 'mileageFrom'],
	minPrice: ['minPrice', 'priceFrom'],
	minYear: ['minYear', 'yearFrom'],
	query: ['q', 'query', 'model'],
	keyword: ['keyword'],
	sourceId: ['sourceId', 'source', 'stockNumber', 'vin'],
	status: ['status'],
	transmission: ['transmission', 'Transmission', 'gearbox']
};

const inventoryUrlFromParams = (params: URLSearchParams) => {
	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const inventoryUrlWithoutFilter = (state: InventoryState, filter: InventoryFilterKey) => {
	const params = new URLSearchParams(state.searchParams);

	for (const alias of filterParamAliases[filter]) {
		params.delete(alias);
	}

	return inventoryUrlFromParams(params);
};

const inventoryUrlWithoutFilterValue = (
	state: InventoryState,
	filter: InventoryFilterKey,
	value: string
) => {
	const params = new URLSearchParams(state.searchParams);
	const aliases = filterParamAliases[filter];
	const values = aliases
		.flatMap((alias) => params.getAll(alias))
		.flatMap(splitFilterValues)
		.filter((item) => item.toLowerCase() !== value.toLowerCase());

	for (const alias of aliases) {
		params.delete(alias);
	}

	if (values.length) {
		params.set(aliases[0], joinFilterValues(values));
	}

	return inventoryUrlFromParams(params);
};

const inventoryClearFiltersUrl = (state: InventoryState) => {
	const params = new URLSearchParams();

	if (state.view !== '4') params.set('view', state.view);
	if (state.sortParam !== 'best-match') params.set('sort', state.sortParam);
	if (isDashboardLayout(state)) params.set('layout', 'dashboard');

	return inventoryUrlFromParams(params);
};

const multiValueFilterKeys = new Set<InventoryFilterKey>([
	'bodyType',
	'brand',
	'feature',
	'fuel',
	'query',
	'transmission'
]);

const inventoryActiveFilters = (state: InventoryState, modifierClass = '') => {
	const entries = Object.entries(state.filters) as Array<[InventoryFilterKey, string | number]>;
	const hasActiveFilters = entries.length > 0;

	if (!hasActiveFilters) return '';

	const className = ['daynight-inventory-active-filters', modifierClass].filter(Boolean).join(' ');
	const chipsClassName = 'daynight-inventory-active-filters__chips';

	const chips = entries
		.flatMap(([key, value]) => {
			const values =
				typeof value === 'string' && multiValueFilterKeys.has(key)
					? splitFilterValues(value)
					: [value];

			return values.map((item) => {
				const href =
					typeof item === 'string' && multiValueFilterKeys.has(key)
						? inventoryUrlWithoutFilterValue(state, key, item)
						: inventoryUrlWithoutFilter(state, key);

				return `<a class="daynight-active-filter" href="${href}" aria-label="Remove ${escapeHtml(
					filterLabels[key]
				)} filter">
				${escapeHtml(filterLabels[key])}: ${escapeHtml(activeFilterDisplayLabel(key, item, state))}
				<span aria-hidden="true">×</span>
			</a>`;
			});
		})
		.join('');

	return `<div class="${className}" aria-label="Active inventory filters">
		<p class="daynight-inventory-active-filters__summary">${state.selected.length} ${state.selected.length === 1 ? 'match' : 'matches'}</p>
		<div class="${chipsClassName}">
			${chips}
			<a class="daynight-active-filter daynight-active-filter--clear" href="${inventoryClearFiltersUrl(state)}">
				Clear filters
				<span aria-hidden="true">×</span>
			</a>
		</div>
	</div>`;
};

const inventoryShowingText = (state: InventoryState) => {
	const hasFilters = Object.keys(state.filters).length > 0;
	const selectedCount = state.selected.length;

	if (selectedCount === 0) return `Showing 0 of ${vehicles.length} OUTLETCARS.BG — Варна Listings`;

	if (hasFilters) {
		return `Showing 1 - ${selectedCount} of ${selectedCount} matching OUTLETCARS.BG — Варна Listings`;
	}

	return `Showing 1 - ${selectedCount} of ${selectedCount} OUTLETCARS.BG — Варна Listings`;
};

const inventoryLayoutToggle = (state: InventoryState) => {
	const dashboard = isDashboardLayout(state);
	const href = inventoryUrl(state, {
		layout: dashboard ? undefined : 'dashboard',
		mode: undefined
	});

	return `<a class="daynight-inventory-layout-toggle ${dashboard ? 'active' : ''}" href="${href}" data-daynight-layout-toggle aria-pressed="${dashboard}" title="${dashboard ? 'Use classic inventory view' : 'Use sidebar dashboard view'}">
		<span>${dashboard ? 'Classic' : 'Sidebar'}</span>
	</a>`;
};

const inventoryViewSwitches = (state: InventoryState) =>
	`<div class="daynight-inventory-hero-switches">
		<span class="daynight-inventory-hero-switches__label">View</span>
		<div class="listing-tabs menu-tab daynight-view-toggle">${viewToggle(state)}${inventoryLayoutToggle(
			state
		)}</div>
	</div>`;

const inventoryUtilityToolbar = (state: InventoryState) => {
	const showingText = inventoryShowingText(state);
	const selectedSort = sortLabels[state.sortParam] ?? 'Best Match';

	return `<div class="daynight-inventory-toolbar-row daynight-inventory-searchbar__utility">
		<div class="daynight-inventory-result-count">
			<button class="btn-filter daynight-inventory-searchbar__filter" id="filterSidebarToggle" type="button" aria-label="Open filters" aria-controls="filterSidebar">
				<img src="/assets/icons/filter.svg" alt="">
				<span>Filters</span>
			</button>
			<p class="md-hidden">${showingText}</p>
		</div>
		<div class="daynight-inventory-sort">
			<span class="daynight-inventory-sort__label">Sort Vehicles by</span>
			<div class="core-dropdown">
				<button type="button" class="core-dropdown__button">
					<span class="core-dropdown__selected">${selectedSort}</span>
					<img src="/assets/icons/chevron-down-black.svg" alt="">
				</button>
				<div class="core-dropdown__menu">${sortDropdown(state)}</div>
			</div>
		</div>
	</div>`;
};

const inventoryHeroSearchSurface = (state: InventoryState) => {
	const searchQuery = selectedSearchQuery(state);

	return `<form class="daynight-inventory-searchbar" action="/inventory" method="get" role="search" aria-label="Search OUTLETCARS.BG — Варна inventory" data-daynight-search-form="inventory">
		${inventorySearchHiddenInputs(state)}
		<div class="daynight-inventory-searchbar__row">
			<div class="daynight-inventory-searchbar__primary">
				<label class="daynight-inventory-searchbar__search">
					<img src="/assets/icons/search-icon.svg" alt="">
					<input type="text" name="q" value="${escapeHtml(searchQuery)}" placeholder="Search make, model, year, fuel, extras..." autocomplete="off">
				</label>
				<button class="daynight-inventory-searchbar__submit" type="submit">Search</button>
			</div>
		</div>
		${inventoryViewSwitches(state)}
	</form>`;
};

const inventorySearchSurface = (state: InventoryState) => {
	const searchQuery = selectedSearchQuery(state);

	return `<form class="daynight-inventory-searchbar" action="/inventory" method="get" role="search" aria-label="Search OUTLETCARS.BG — Варна inventory" data-daynight-search-form="inventory">
		${inventorySearchHiddenInputs(state)}
		<div class="daynight-inventory-searchbar__row">
			<div class="daynight-inventory-searchbar__primary">
				<label class="daynight-inventory-searchbar__search">
					<img src="/assets/icons/search-icon.svg" alt="">
					<input type="text" name="q" value="${escapeHtml(searchQuery)}" placeholder="Search make, model, year, fuel, extras..." autocomplete="off">
				</label>
				<button class="daynight-inventory-searchbar__submit" type="submit">Search</button>
			</div>
		</div>
		${inventoryViewSwitches(state)}
		<div class="daynight-inventory-filter-grid">
			${inventoryFilterDropdown({
				label: 'Make',
				name: 'brand',
				options: inventoryBrandPills,
				placeholder: 'Make',
				selected: state.filters.brand
			})}
			${inventoryFilterDropdown({
				label: 'Model',
				name: 'model',
				options: modelOptionsForBrands(state.filters.brand),
				placeholder: 'Model',
				selected: selectedModel(state)
			})}
			${inventoryFilterDropdown({
				label: 'Price',
				mode: 'single',
				name: 'priceTo',
				options: priceFilterOptions,
				placeholder: 'Price',
				selected: selectedNumber(state.filters.maxPrice)
			})}
			${inventoryFilterDropdown({
				label: 'Mileage',
				mode: 'single',
				name: 'mileageTo',
				options: mileageFilterOptions,
				placeholder: 'Mileage',
				selected: selectedNumber(state.filters.maxMileage)
			})}
			${inventoryFilterDropdown({
				label: 'Fuel',
				name: 'fuel',
				options: inventoryFuelPills,
				placeholder: 'Fuel',
				selected: state.filters.fuel
			})}
			${inventoryFilterDropdown({
				label: 'Transmission',
				name: 'transmission',
				options: transmissionOptions,
				placeholder: 'Gearbox',
				selected: state.filters.transmission
			})}
			${inventoryFilterDropdown({
				label: 'Body',
				name: 'bodyType',
				options: inventoryBodyTypePills,
				placeholder: 'Body',
				selected: state.filters.bodyType
			})}
			${inventoryFilterDropdown({
				label: 'Extras',
				name: 'feature',
				options: popularFeatureOptions,
				placeholder: 'Extras',
				selected: state.filters.feature
			})}
		</div>
		${inventoryUtilityToolbar(state)}
	</form>`;
};

const sidebarFilterGroup = ({
	label,
	mode = 'multiple',
	name,
	options,
	selected
}: {
	label: string;
	mode?: 'multiple' | 'single';
	name: string;
	options: InventoryFilterOption[];
	selected?: string | number;
}) => {
	const selectedValues = splitFilterValues(selected);
	const inputType = mode === 'single' ? 'radio' : 'checkbox';

	return `<fieldset class="daynight-inventory-sidebar-group">
		<legend>${escapeHtml(label)}</legend>
		<div class="daynight-inventory-sidebar-options">
			${filterDropdownOption(name, { label: `All ${label.toLowerCase()}`, value: '' }, selectedValues, inputType)}
			${options.map((option) => filterDropdownOption(name, option, selectedValues, inputType)).join('')}
		</div>
	</fieldset>`;
};

const inventorySidebarRail = (state: InventoryState) => {
	const clearHref = inventoryClearFiltersUrl(state);

	return `<aside class="daynight-inventory-dashboard-sidebar" aria-label="Inventory filters">
		<form class="daynight-filter-form daynight-inventory-sidebar-form" action="/inventory" method="get">
			${inventorySidebarHiddenInputs(state)}
			<div class="daynight-inventory-sidebar-heading">
				<p class="h5 mb-4">Filters</p>
				<p class="text-secondary">${state.selected.length} ${state.selected.length === 1 ? 'vehicle' : 'vehicles'} shown</p>
			</div>
			${sidebarFilterGroup({
				label: 'Make',
				name: 'brand',
				options: inventoryBrandPills,
				selected: state.filters.brand
			})}
			${sidebarFilterGroup({
				label: 'Model',
				name: 'model',
				options: modelOptionsForBrands(state.filters.brand).slice(0, 12),
				selected: selectedModel(state)
			})}
			${sidebarFilterGroup({
				label: 'Budget',
				mode: 'single',
				name: 'priceTo',
				options: priceFilterOptions,
				selected: selectedNumber(state.filters.maxPrice)
			})}
			${sidebarFilterGroup({
				label: 'Mileage',
				mode: 'single',
				name: 'mileageTo',
				options: mileageFilterOptions,
				selected: selectedNumber(state.filters.maxMileage)
			})}
			${sidebarFilterGroup({
				label: 'Body',
				name: 'bodyType',
				options: inventoryBodyTypePills,
				selected: state.filters.bodyType
			})}
			${sidebarFilterGroup({
				label: 'Fuel',
				name: 'fuel',
				options: inventoryFuelPills,
				selected: state.filters.fuel
			})}
			${sidebarFilterGroup({
				label: 'Gearbox',
				name: 'transmission',
				options: transmissionOptions,
				selected: state.filters.transmission
			})}
			${sidebarFilterGroup({
				label: 'Extras',
				name: 'feature',
				options: popularFeatureOptions,
				selected: state.filters.feature
			})}
			<div class="daynight-inventory-sidebar-actions">
				<a href="${clearHref}" class="daynight-active-filter daynight-active-filter--clear">Clear</a>
				<button class="btn btn-small btn-primary-3 font-weight-600" type="submit">Show ${state.selected.length}</button>
			</div>
		</form>
	</aside>`;
};

const inventoryBanner = (state: InventoryState) =>
	`<section class="daynight-inventory-banner" aria-label="OUTLETCARS.BG — Варна inventory showcase">
	<div class="container">
		<div class="daynight-inventory-banner__copy">
			<h1 id="daynight-inventory-title" class="daynight-sr-only">OUTLETCARS.BG — Варна Inventory</h1>
		</div>
		<div class="daynight-inventory-banner__cars" aria-hidden="true">
			<img class="daynight-inventory-banner__car daynight-inventory-banner__car--x5" src="/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp" alt="" loading="eager" decoding="async">
			<img class="daynight-inventory-banner__car daynight-inventory-banner__car--sq5" src="/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp" alt="" loading="eager" decoding="async">
		</div>
		<div class="daynight-inventory-banner__buybox">
			${isDashboardLayout(state) ? inventoryHeroSearchSurface(state) : inventorySearchSurface(state)}
		</div>
	</div>
</section>`;

const highlightClass = () => 'bg-primary-2';

const cardMeta = (vehicle: Vehicle, tagClass = 'tag style2 mb-10') => `<ul class="${tagClass}">
	<li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>${km(vehicle.mileage)}</span></li>
	<li><img src="/assets/icons/calendar.svg" alt="year"><span>${vehicle.year}</span></li>
	<li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
	<li><img src="/assets/icons/transmission.svg" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
</ul>`;

const compactCardMeta = (vehicle: Vehicle, tagClass = 'tag style2 mb-10 daynight-card-specs') =>
	`<ul class="${tagClass}">
	<li><img src="/assets/icons/calendar.svg" alt="year"><span>${vehicle.year}</span></li>
	<li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
	<li><img src="/assets/icons/transmission.svg" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
</ul>`;

const gridCard = (vehicle: Vehicle, index: number) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const monthly = `${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`;

	return `<div class="card-box card-box-style-1 daynight-no-image-zoom wow fadeIn" data-wow-delay="0.${(index % 4) + 1}s" data-daynight-slug="${escapeHtml(vehicle.slug)}">
		<div class="top">
			<p class="${highlightClass()} text-white highlight">${km(vehicle.mileage)}</p>
			<p class="heart daynight-favorite" role="button" tabindex="0" aria-label="Запази ${escapeHtml(vehicle.title)}">${heartIcon}</p>
		</div>
		<div class="image">
			<a href="${url}">
				<img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}">
			</a>
		</div>
		<div class="content border-light border-top-none">
			<div class="bottom">
				<p class="category uppercase text-white">
					<a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a>
				</p>
				<div class="flex items-center gap-8">
					<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
					<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
			${compactCardMeta(vehicle)}
			<p class="h6 card-box__price daynight-card-price mb-15">
				<span class="daynight-card-price__amount">${escapeHtml(vehicle.priceLabel)}</span>
				<span class="daynight-card-price__finance">
					<span class="daynight-card-price__monthly text-sm">${monthly}</span>
					<a href="${url}" class="daynight-card-price__finance-link text-underline text-muted text-xs">See Finance</a>
				</span>
			</p>
			<div class="divider mb-15"></div>
			<div class="daynight-card-actions flex justify-between">
				<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-daynight-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">
					${compareIcon}
					Compare
				</p>
				<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
			</div>
		</div>
	</div>`;
};

const listCard = (vehicle: Vehicle) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;

	return `<div class="card-box card-box-style-9 daynight-no-image-zoom" data-daynight-slug="${escapeHtml(vehicle.slug)}">
		<div class="top">
			<p class="${highlightClass()} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
			<p class="heart daynight-favorite" role="button" tabindex="0" aria-label="Запази ${escapeHtml(vehicle.title)}">${heartIcon}</p>
		</div>
		<div class="bottom">
			<p class="category uppercase text-white"><a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a></p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<div class="image"><a href="${url}"><img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}"></a></div>
		<div class="content">
			<p class="h6 card-box__title mb-4"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
			<p class="text-secondary clamp-1 clamp mb-8">${escapeHtml(vehicle.description || daynightContact.appointmentNote)}</p>
			${cardMeta(vehicle, 'tag style3 mb-14')}
			<p class="h6 card-box__price mb-10 flex justify-between gap-8 items-center">${escapeHtml(vehicle.priceLabel)}</p>
			<div class="flex gap-32">
				<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-daynight-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">${compareIcon} Compare</p>
				<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
			</div>
		</div>
	</div>`;
};

const findClosingDivIndex = (html: string, openDivIndex: number) => {
	const pattern = /<\/?div\b[^>]*>/gi;
	pattern.lastIndex = openDivIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

const replaceDivBlock = (html: string, start: number, replacement: string) => {
	if (start < 0) return html;

	const end = findClosingDivIndex(html, start);

	if (end < 0) return html;

	return `${html.slice(0, start)}${replacement}${html.slice(end)}`;
};

const replaceFirstDivAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const inventoryContent = (state: InventoryState) => {
	const gridClass =
		state.view === '5'
			? 'grid grid-cols-5 lg-grid-cols-3 md-grid-cols-2 sm-grid-cols-1 gap-20'
			: state.view === '4'
				? 'grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41'
				: state.view === 'map'
					? 'grid grid-cols-1 gap-20'
					: 'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
	const cards = state.selected
		.map((vehicle, index) => (state.view === 'map' ? listCard(vehicle) : gridCard(vehicle, index)))
		.join('\n');
	const empty = `<div class="card-box card-box-style-1 daynight-empty-state">
		<div class="content border-light">
			<p class="h6 card-box__title mb-8">No OUTLETCARS.BG — Варна vehicles match these filters</p>
			<p class="text-secondary mb-15">Clear filters or contact OUTLETCARS.BG — Варна for a Europe import request.</p>
			<a href="/inventory" class="view-details">Reset inventory <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="reset"></a>
		</div>
	</div>`;

	return `<div class="content-tab daynight-inventory-content">
		<div class="content-inner active">
			<div class="${gridClass}">
				${cards || empty}
			</div>
		</div>
	</div>`;
};

const replaceInventoryToolbar = (html: string) => {
	const tabsStart = html.indexOf('data-custom="true"');
	const rowStart = html.indexOf('<div class="row', tabsStart);
	let next = replaceDivBlock(html, rowStart, '\n');
	const filterSpacer = /\s*<div class="mb-8 col-md-12"><\/div>\s*/u;

	next = next.replace(filterSpacer, '\n');

	const filterMarker = next.indexOf('id="filterResults"', tabsStart);
	const filterStart = filterMarker >= 0 ? next.lastIndexOf('<div', filterMarker) : -1;

	return replaceDivBlock(next, filterStart, '');
};

const replaceInventorySearchSurface = (html: string) =>
	html.replace(
		/<div class="container">\s*<h2>Listing Grid(?: 3 Columns| 4 Columns| Half Map)<\/h2>\s*<\/div>/,
		''
	);

const replaceInventoryContent = (html: string, state: InventoryState) => {
	const tabsStart = html.indexOf('data-custom="true"');
	const contentStart = html.indexOf('<div class="content-tab', tabsStart);

	return replaceDivBlock(
		html,
		contentStart,
		`${inventoryActiveFilters(
			state,
			'daynight-inventory-active-filters--results'
		)}${inventoryContent(state)}`
	);
};

const inventoryDashboard = (
	state: InventoryState
) => `<div class="daynight-inventory-dashboard daynight-inventory-dashboard--${state.view}">
	${inventorySidebarRail(state)}
	<div class="daynight-inventory-dashboard-results">
		${inventoryUtilityToolbar(state)}
		${inventoryActiveFilters(state, 'daynight-inventory-active-filters--results')}
		${inventoryContent(state)}
	</div>
	${
		state.view === 'map'
			? `<div class="daynight-inventory-dashboard-map">${inventoryMapFallback(state)}</div>`
			: ''
	}
</div>`;

const inventoryMainSection = (
	state: InventoryState
) => `<section class="daynight-inventory-main pb-100" aria-label="OUTLETCARS.BG — Варна inventory results">
	<div class="container">
		${inventoryDashboard(state)}
	</div>
</section>`;

const replaceInventoryMainSection = (html: string, state: InventoryState) => {
	const replacement = `<!-- New Cars -->\n${inventoryMainSection(state)}\n<!-- New Cars -->`;

	return html.replace(/<!-- New Cars -->[\s\S]*?<!-- New Cars -->/, replacement);
};

const stripInventoryMapScripts = (html: string) =>
	html
		.replace(
			/\s*<script src="https:\/\/maps\.googleapis\.com\/maps\/api\/js[\s\S]*?<\/script>/g,
			''
		)
		.replace(/\s*<script src="\/assets\/js\/maps\.js"><\/script>/g, '')
		.replace(/\s*<script src="\/assets\/js\/marker\.js"><\/script>/g, '')
		.replace(/\s*<script src="\/assets\/js\/infobox\.min\.js"><\/script>/g, '');

const replaceInventoryBreadcrumb = (html: string, state: InventoryState) => {
	const banner = inventoryBanner(state);
	const withBreadcrumb = html.replace(
		/<!-- breadcrumb -->\s*<section class="background-light mb-32">[\s\S]*?<\/section>\s*<!-- breadcrumb -->/,
		banner
	);

	if (withBreadcrumb !== html) return withBreadcrumb;

	return html.replace(
		/(\s*<!-- New Cars -->\s*<section class="max-w-1920 mx-auto">)/,
		`\n${banner}$1`
	);
};

const optionCheckbox = (
	name: string,
	value: string,
	selected?: string
) => `<label class="filter-checkbox">
	<input type="checkbox" name="${escapeHtml(name)}" value="${escapeFilterValueAttribute(value)}" ${
		value === 'all'
			? !splitFilterValues(selected).length
				? 'checked'
				: ''
			: hasFilterValue(splitFilterValues(selected), value)
				? 'checked'
				: ''
	} data-inventory-filter-input>
	<span>${escapeHtml(value)}</span>
</label>`;

const filterRuntimeData = {
	bodyTypes,
	brands,
	fuels,
	models: modelOptions,
	transmissions: transmissionOptions
};

const demoVehicleTitleMap = [
	'Audi A6 Avant E-Tron',
	'2024 Hyundai Elantra',
	'Kia EV9 2024',
	'Chevrolet Camaro 2020',
	'Audi R8',
	'Genesis Electrified G80',
	'2020 Chevy Camaro ZL1',
	'2022 Ford Mustang® GTD',
	'Porsche 911 S/T',
	'2022 Ford GT White',
	'Bmw x7 Pure Excellence 2023',
	'BMW X6 Electric',
	'2017 BMV X1 xDrive 20d xline'
] as const;

const replaceDemoVehicleCopy = (html: string) =>
	demoVehicleTitleMap.reduce((next, title, index) => {
		const vehicle = vehicles[index % vehicles.length];

		return next.replaceAll(title, vehicle.title);
	}, html);

export const getAuxeroListingRuntimeData = () => ({
	contact: daynightContact,
	filters: filterRuntimeData,
	vehicles: vehicles.map((vehicle) => ({
		bodyType: vehicle.bodyType,
		brand: vehicle.brand,
		condition: vehicle.condition,
		engine: vehicle.engine,
		exterior: vehicle.exterior,
		fuel: vehicle.fuel,
		image: vehicle.image,
		imagesCount: vehicle.images.length || 1,
		interior: vehicle.interior,
		location: vehicle.location,
		mileage: vehicle.mileage,
		model: vehicle.model,
		price: vehicle.price,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		stockNumber: vehicle.stockNumber,
		tag: vehicle.tag,
		title: vehicle.title,
		transmission: vehicle.transmission,
		vin: vehicle.vin,
		year: vehicle.year
	}))
});

const compareRow = (
	icon: string,
	label: string,
	values: string[],
	alt = label.toLowerCase()
) => `<tr>
	<td>
		<div class="flex items-center gap-8">
			<img src="/assets/icons/${icon}" alt="${escapeHtml(alt)}">
			<span>${escapeHtml(label)}:</span>
		</div>
	</td>
	${values.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
</tr>`;

const compareTable = (
	selected: Vehicle[]
) => `<table class="card-details--table daynight-compare-table" data-daynight-compare-table>
	<tr>
		<td></td>
		${selected
			.map(
				(vehicle) => `<td data-daynight-compare-column="${escapeHtml(vehicle.slug)}">
			<div class="relative top">
				<button class="compare-item-remove-table" type="button" data-daynight-compare-remove="${escapeHtml(vehicle.slug)}" style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;">
					<img src="/assets/icons/close-modal.svg" alt="Remove" style="width: 24px; height: 24px;">
				</button>
				<a href="/inventory/${encodeURIComponent(vehicle.slug)}">
					<img class="mb-10 radius-16 image" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}">
				</a>
				<p class="h4 text-center"><a href="/inventory/${encodeURIComponent(vehicle.slug)}">${escapeHtml(vehicle.title)}</a></p>
			</div>
		</td>`
			)
			.join('')}
	</tr>
	${compareRow(
		'mileage.svg',
		'Mileage',
		selected.map((vehicle) => km(vehicle.mileage))
	)}
	${compareRow(
		'years.svg',
		'Years',
		selected.map((vehicle) => String(vehicle.year)),
		'year'
	)}
	${compareRow(
		'gaspump.svg',
		'Fuel',
		selected.map((vehicle) => vehicle.fuel)
	)}
	${compareRow(
		'color.svg',
		'Color',
		selected.map((vehicle) => vehicle.exterior || 'On request')
	)}
	${compareRow(
		'location.svg',
		'Location',
		selected.map((vehicle) => vehicle.location)
	)}
	${compareRow(
		'interior.svg',
		'Interior',
		selected.map((vehicle) => vehicle.interior || 'On request')
	)}
	${compareRow(
		'engine.svg',
		'Engine',
		selected.map((vehicle) => vehicle.engine || 'On request')
	)}
	${compareRow(
		'transmission.svg',
		'Transmission',
		selected.map((vehicle) => vehicle.transmission)
	)}
	${compareRow(
		'VIN.svg',
		'Source ID',
		selected.map((vehicle) => vehicle.vin)
	)}
	${compareRow(
		'QrCode.svg',
		'Stock Number',
		selected.map((vehicle) => vehicle.stockNumber)
	)}
	${compareRow(
		'Payment.png',
		'Price',
		selected.map((vehicle) => vehicle.priceLabel),
		'price'
	)}
</table>`;

export const applyCompareData = (html: string, options: AuxeroRenderOptions = {}) => {
	const selected = getCompareVehicles(options);
	const table = compareTable(selected);

	return replaceDemoVehicleCopy(
		html
			.replaceAll(
				'<h2>Compare Cars Side-by-Side</h2>',
				'<h1 class="h2">Сравни автомобили от OUTLETCARS.BG — Варна</h1>'
			)
			.replaceAll(
				'<h2 class="text-center mb-12 capitalize">Compare Cars Side-by-Side</h2>',
				'<h1 class="h2 text-center mb-12 capitalize">Сравни автомобили от OUTLETCARS.BG — Варна</h1>'
			)
			.replaceAll(
				'<h2 class="text-center mb-12 capitalize">Сравни автомобили от OUTLETCARS.BG — Варна</h2>',
				'<h1 class="h2 text-center mb-12 capitalize">Сравни автомобили от OUTLETCARS.BG — Варна</h1>'
			)
			.replaceAll('Compare Cars Side-by-Side', 'Сравни автомобили от OUTLETCARS.BG — Варна')
			.replaceAll(
				'Compare features, performance, and pricing to choose the perfect car.',
				'Сравни цена, пробег, източник и спецификации преди да запазиш оглед.'
			)
			.replace(/<table class="card-details--table">[\s\S]*?<\/table>/g, table)
	);
};

const socialLink = (href: string, icon: string, label: string) => `<li>
	<a href="${escapeHtml(href)}" target="_blank" aria-label="${escapeHtml(label)}" rel="noreferrer">
		<img src="/assets/icons/${icon}" alt="${escapeHtml(label)}">
	</a>
</li>`;

const agentSocials = () => `<ul class="sale-agent-social justify-center flex gap-12">
	${socialLink(daynightContact.facebookHref, 'input-facebook.svg', 'Facebook')}
	${socialLink(daynightContact.viberHref, 'ChatCircleDots.svg', 'Viber')}
	${socialLink(daynightContact.youtubeHref, 'input-youtube.svg', 'YouTube')}
	${socialLink(daynightContact.emailHref, 'input-telegram.svg', 'Email')}
</ul>`;

const isManagedAgent = (agent: Agent | ManagedAgent): agent is ManagedAgent =>
	'openInquiries' in agent;

const agentStatusText = (agent: ManagedAgent) =>
	`${agent.status === 'active' ? 'Active' : 'Paused'} · ${agent.openInquiries} open leads`;

const agentCard = (agent: Agent | ManagedAgent, index: number, adminMode = false) => {
	const url = `/agents/${encodeURIComponent(agent.slug)}`;
	const managementMeta =
		adminMode && isManagedAgent(agent)
			? `<p class="text-secondary text-sm mt-4" data-daynight-agent-status="${agent.status}">${escapeHtml(agentStatusText(agent))}</p>
				<p class="text-secondary text-sm mt-4" data-daynight-agent-note="${escapeHtml(agent.slug)}">${escapeHtml(agent.note)}</p>`
			: '';
	const assignedLeadsLabel =
		adminMode && isManagedAgent(agent)
			? `Assigned Leads (${agent.openInquiries})`
			: 'Assigned Leads';

	return `<div class="sale-agent-box ${index === 1 ? 'active' : ''}">
		<div class="card-top mb-20">
			<a class="w-full flex" href="${url}">
				<img class="w-full" src="${escapeHtml(agent.image)}" alt="${escapeHtml(agent.name)}">
			</a>
			${agentSocials()}
		</div>

		<div class="card-bottom flex items-center justify-between gap-16">
			<div class="content">
				<a class="h5 font-weight-600 sale-agent-title" href="${url}">${escapeHtml(agent.name)}</a>
				<p class="text-secondary text-sm">${escapeHtml(agent.title)}</p>
				${managementMeta}
			</div>

			<ul class="contact">
				<li>
					<a href="${daynightContact.primaryPhoneHref}" aria-label="Call ${escapeHtml(agent.name)}">
						<img src="/assets/icons/PhoneCall.svg" alt="phone">
					</a>
				</li>
				<li>
					<a href="${daynightContact.emailHref}" aria-label="Email ${escapeHtml(agent.name)}">
						<img src="/assets/icons/input-telegram.svg" alt="email">
					</a>
				</li>
			</ul>
		</div>
		${
			adminMode
				? `<div class="mt-16 flex flex-wrap gap-8">
			<a href="/admin/inquiries?role=admin" class="btn btn-small btn-primary-3 font-weight-600">${assignedLeadsLabel}</a>
			<a href="/admin/messages?role=admin" class="btn btn-small btn-line-style-2 font-weight-600">Messages</a>
		</div>`
				: ''
		}
	</div>`;
};

const agentGrid = (
	adminMode = false
) => `<div class="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16 daynight-agent-grid" data-daynight-agent-management="${adminMode}">
	${(adminMode ? listManagedAgents() : listAgentDetails()).map((agent, index) => agentCard(agent, index, adminMode)).join('\n')}
</div>`;

export const applyAgentsData = (html: string, options: AuxeroRenderOptions = {}) => {
	const adminMode = options.routePath?.replace(/^\/+/, '').startsWith('admin/agents') ?? false;
	const next = html
		.replaceAll('Find a Dealer', 'Намери консултант')
		.replace(
			'<h2>OUTLETCARS.BG — Варна Consultants</h2>',
			adminMode
				? '<h1 class="h2">Управление на консултанти</h1>'
				: '<h1 class="h2">Консултанти на OUTLETCARS.BG — Варна</h1>'
		);

	return replaceFirstDivAfter(
		next,
		adminMode
			? '<h1 class="h2">Управление на консултанти</h1>'
			: '<h1 class="h2">Консултанти на OUTLETCARS.BG — Варна</h1>',
		'<div class="grid grid-cols-4',
		agentGrid(adminMode)
	);
};

const agentFromOptions = (options: AuxeroRenderOptions = {}) => {
	const routeSlug = options.routePath
		?.replace(/^\/+|\/+$/g, '')
		.split('/')
		.pop();

	return getAgentDetailOrFallback(options.slug ?? routeSlug);
};

const agentInventoryGrid = (agent: Agent) => {
	const inventory = getAgentInventoryState(agent, 3);

	return `<div class="grid grid-cols-1 gap-20 mb-40 daynight-agent-inventory">
		${inventory.vehicles.map((vehicle) => listCard(vehicle)).join('\n')}
	</div>`;
};

const daynightMapEmbedSrc =
	'https://maps.google.com/maps?q=Plovdiv%20South%20Industrial%20Zone&t=&z=13&ie=UTF8&iwloc=&output=embed';

export const applyAgentDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const agent = agentFromOptions(options);
	const inventoryState = getAgentInventoryState(agent, 3);
	let next = html
		.replaceAll('Mike Hanley', escapeHtml(agent.name))
		.replaceAll('Verified Dealer', 'Verified OUTLETCARS.BG — Варна Consultant')
		.replace('/assets/images/pages/sale-agent-9.jpg', escapeHtml(agent.image))
		.replace(
			/<p class="text-secondary mb-4">\s*Darrell Steward[\s\S]*?<\/p>/,
			`<p class="text-secondary mb-4">${escapeHtml(agent.bio)}</p>`
		)
		.replace(
			/<p class="text-secondary mb-40">\s*His passion[\s\S]*?<\/p>/,
			`<p class="text-secondary mb-40">OUTLETCARS.BG — Варна keeps every conversation practical: source details, inspection context, import or registration steps, and viewing appointments are confirmed before the next commitment.</p>`
		)
		.replace(/Dealer Inventory \(3\)/g, `OUTLETCARS.BG — Варна Inventory (${inventoryState.count})`)
		.replace(
			/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g,
			`<iframe src="${daynightMapEmbedSrc}"`
		)
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(daynightContact.addressLabel)
		)
		.replaceAll('Get Directions', 'Plan Appointment')
		.replaceAll('1-555-678-8888', escapeHtml(daynightContact.primaryPhoneLabel))
		.replaceAll('1-555-678-9999', escapeHtml(daynightContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', daynightContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', daynightContact.marketplacePhoneHref)
		.replaceAll('Call To Dealer', 'Call OUTLETCARS.BG — Варна')
		.replaceAll('Chat via WhatsApp', 'Chat on Viber')
		.replaceAll('value="Tony Nguyen"', 'value=""')
		.replaceAll(`value="${daynightContact.emailLabel}"`, 'value=""')
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replaceAll('Send Inquiry about Vehicle', `Send Inquiry to ${agent.name}`)
		.replaceAll('This Vehicle&#39;s Availability 2', 'Import request')
		.replaceAll('This Vehicle&#39;s Availability 3', 'Documents and registration');

	next = next.replace(
		/<a href="\/agents\/daynight-sales" class="btn btn-medium btn-primary-3/g,
		`<a href="${daynightContact.primaryPhoneHref}" class="btn btn-medium btn-primary-3`
	);
	next = next.replace(
		/<a href="#" class="btn btn-medium btn-primary-4/g,
		`<a href="${daynightContact.viberHref}" class="btn btn-medium btn-primary-4`
	);
	next = replaceFirstDivAfter(
		next,
		'OUTLETCARS.BG — Варна Inventory',
		'<div class="grid grid-cols-1',
		agentInventoryGrid(agent)
	);

	return replaceDemoVehicleCopy(next);
};

const addClassToFirstFormAfter = (html: string, marker: string, className: string) => {
	const markerIndex = html.indexOf(marker);
	const formStart = html.indexOf('<form action="#">', markerIndex);

	if (formStart < 0) return html;

	return `${html.slice(0, formStart)}<form action="#" class="${className}">${html.slice(
		formStart + '<form action="#">'.length
	)}`;
};

export const applyContactData = (html: string) => {
	let next = html
		.replace(
			/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g,
			`<iframe src="${daynightMapEmbedSrc}"`
		)
		.replace(
			'<p class="h3 mb-12 capitalize">Reach Out to Us</p>',
			'<h1 class="h3 mb-12 capitalize">Свържете се с OUTLETCARS.BG — Варна</h1>'
		)
		.replaceAll('Reach Out to Us', 'Свържете се с OUTLETCARS.BG — Варна')
		.replaceAll(
			'We’re here to assist with any questions, concerns, or inquiries—contact us today!',
			'Пишете за наличен автомобил, подбор на автомобили, оглед, документи или продажба.'
		)
		.replaceAll('Address Business', 'Офис OUTLETCARS.BG — Варна')
		.replaceAll('Contact OUTLETCARS.BG — Варна', 'Контакт с OUTLETCARS.BG — Варна')
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(daynightContact.addressLabel)
		)
		.replaceAll('Week-Day: 8:00 - 18:00', 'Понеделник-петък: 9:00 - 18:00')
		.replaceAll('Sunday: Closed', 'Уикенд: с уговорка')
		.replaceAll('Working Time', 'Работно време')
		.replaceAll('Follow Us On social media:', 'Последвайте OUTLETCARS.BG — Варна:')
		.replaceAll(
			"We'd love to hear from you! If you have any questions",
			daynightContact.appointmentNote
		)
		.replaceAll('1-555-678-8888', escapeHtml(daynightContact.primaryPhoneLabel))
		.replaceAll('1-333-123-6666', escapeHtml(daynightContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', daynightContact.primaryPhoneHref)
		.replaceAll('tel:1-333-123-6666', daynightContact.marketplacePhoneHref)
		.replaceAll('value="Tony"', 'value=""')
		.replaceAll('placeholder="Enter your last name"', 'placeholder="Enter your last name"');

	const contactInfoStart = next.indexOf('Офис OUTLETCARS.BG — Варна');
	const contactInfoLabelStart = next.indexOf('Контакт с OUTLETCARS.BG — Варна', contactInfoStart);

	if (contactInfoLabelStart >= 0) {
		next = `${next.slice(0, contactInfoLabelStart)}Телефон OUTLETCARS.BG — Варна${next.slice(
			contactInfoLabelStart + 'Контакт с OUTLETCARS.BG — Варна'.length
		)}`;
	}

	const contactMapOverlay = `<div class="daynight-contact-map__overlay">
		<p class="daynight-contact-map__eyebrow">OUTLETCARS.BG — Варна Plovdiv</p>
		<h1>Огледи и консултации с уговорка</h1>
		<p>${escapeHtml(daynightContact.addressLabel)}</p>
		<div class="daynight-contact-map__actions">
			<a href="${daynightContact.primaryPhoneHref}" class="btn btn-white text-primary btn-large font-weight-600">${escapeHtml(daynightContact.primaryPhoneLabel)}</a>
			<a href="${daynightContact.viberHref}" class="btn btn-primary btn-large font-weight-600">Пиши във Viber</a>
		</div>
	</div>`;

	next = next
		.replace(
			'class="widget-gg-map flex radius-8 overflow-hidden"',
			'class="widget-gg-map daynight-contact-map flex radius-8 overflow-hidden"'
		)
		.replace(
			/(<div class="widget-gg-map daynight-contact-map[\s\S]*?<iframe[\s\S]*?<\/iframe>)(\s*<\/div>)/,
			`$1${contactMapOverlay}$2`
		);

	next = addClassToFirstFormAfter(next, 'contact-page-form', 'daynight-contact-form');

	return next;
};

const replaceFilterSidebar = (html: string, state: InventoryState) => {
	const formStart = html.indexOf('<form action="#">', html.indexOf('filter-sidebar__panel'));
	let next = html;

	if (formStart >= 0) {
		next = `${next.slice(0, formStart)}<form action="/inventory" method="get" class="daynight-filter-form">
			<input type="hidden" name="view" value="${state.view}">
			${isDashboardLayout(state) ? '<input type="hidden" name="layout" value="dashboard">' : ''}${next.slice(
				formStart + '<form action="#">'.length
			)}`;
	}

	const brandList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('brand', 'all')}
		${brands.map((brand) => optionCheckbox('brand', brand, state.filters.brand)).join('')}
	</div>`;
	const modelList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('model', 'all')}
		${filterRuntimeData.models.map((model) => optionCheckbox('model', model, state.filters.query)).join('')}
	</div>`;
	const bodyList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('bodystyle', 'all')}
		${bodyTypes.map((body) => optionCheckbox('bodystyle', body, state.filters.bodyType)).join('')}
	</div>`;
	const fuelList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('FuelType', 'all')}
		${fuels.map((fuel) => optionCheckbox('FuelType', fuel, state.filters.fuel)).join('')}
	</div>`;

	return next
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="brand">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${brandList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="model">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${modelList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="bodystyle">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${bodyList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="FuelType">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${fuelList}$2`
		);
};

type MapLocationGroup = {
	count: number;
	location: string;
	samples: Vehicle[];
};

const mapLocationGroups = (source: Vehicle[]) => {
	const groups = new Map<string, MapLocationGroup>();

	for (const vehicle of source) {
		const location = vehicle.location.trim() || daynightContact.addressLabel;
		const group = groups.get(location) ?? {
			count: 0,
			location,
			samples: []
		};

		group.count += 1;
		if (group.samples.length < 2) group.samples.push(vehicle);
		groups.set(location, group);
	}

	return Array.from(groups.values()).sort(
		(a, b) => b.count - a.count || a.location.localeCompare(b.location, 'bg')
	);
};

const matchingVehicleLabel = (count: number) =>
	`${count} ${count === 1 ? 'съвпадащ автомобил' : 'съвпадащи автомобила'}`;

const mapLocationList = (groups: MapLocationGroup[]) => {
	if (!groups.length) {
		return `<p class="text-secondary mb-16" data-daynight-map-empty="true">Няма автомобили по тези филтри. Изчисти филтрите или се свържи с OUTLETCARS.BG — Варна за входящи автомобили.</p>`;
	}

	return `<ul class="daynight-map-fallback__locations">
		${groups
			.map(
				(group) => `<li data-daynight-map-location="${escapeHtml(group.location)}">
					<span class="h7 font-weight-600">${escapeHtml(group.location)}</span>
					<span class="text-secondary">${group.count} ${group.count === 1 ? 'автомобил' : 'автомобила'}</span>
					<span class="text-secondary">${group.samples
						.map((vehicle) => escapeHtml(vehicle.title))
						.join(' / ')}</span>
				</li>`
			)
			.join('')}
	</ul>`;
};

const inventoryMapFallback = (state: InventoryState) => {
	const groups = mapLocationGroups(state.selected);

	return `<div id="map" class="daynight-map-fallback" data-map-zoom="16" data-map-scroll="true" data-daynight-map-selected="${state.selected.length}">
				<div class="daynight-map-fallback__inner">
					<p class="h4 mb-12">Зона за огледи OUTLETCARS.BG — Варна</p>
					<p class="text-secondary mb-8">${escapeHtml(daynightContact.addressLabel)}</p>
					<p class="text-secondary mb-12" data-daynight-map-summary="${escapeHtml(matchingVehicleLabel(state.selected.length))}">${escapeHtml(matchingVehicleLabel(state.selected.length))}, групирани по локация за оглед.</p>
					${mapLocationList(groups)}
					<p class="text-secondary mb-16">${escapeHtml(daynightContact.appointmentNote)}. Точната локация за оглед се потвърждава по телефона.</p>
					<a class="btn btn-medium btn-primary-3 font-weight-600" href="${daynightContact.primaryPhoneHref}">${escapeHtml(daynightContact.primaryPhoneLabel)}</a>
				</div>
			</div>`;
};

const replaceMap = (html: string, state: InventoryState) =>
	stripInventoryMapScripts(
		html.replace(
			/<div id="map" data-map-zoom="16" data-map-scroll="true"><\/div>/,
			inventoryMapFallback(state)
		)
	);

export const applyInventoryData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const state = getInventoryState(templateFile, options);
	let next = replaceInventoryBreadcrumb(html, state);

	if (isDashboardLayout(state)) {
		next = replaceInventoryMainSection(next, state);
		next = replaceFilterSidebar(next, state);
		next = stripInventoryMapScripts(next);
	} else {
		next = replaceInventorySearchSurface(next);
		next = replaceInventoryToolbar(next);
		next = replaceInventoryContent(next, state);
		next = replaceFilterSidebar(next, state);

		if (state.view === 'map') {
			next = replaceMap(next, state);
		}
	}

	return replaceDemoVehicleCopy(next)
		.replaceAll('Listing Grid 4 Columns', 'OUTLETCARS.BG — Варна Inventory')
		.replaceAll('Listing Grid 3 Columns', 'OUTLETCARS.BG — Варна Inventory')
		.replaceAll('Listing Grid Half Map', 'OUTLETCARS.BG — Варна Inventory Map')
		.replaceAll('$120', '0 EUR')
		.replaceAll('$750', '150 000 EUR');
};

const overviewItem = (icon: string, label: string, value: string) => `<li class="grid-cols-2 grid">
	<p class="flex items-center gap-8">
		<img class="w-28 h-28" src="/assets/icons/${icon}" alt="${escapeHtml(label)}">
		<span class="h7 text-secondary">${escapeHtml(label)}:</span>
	</p>
	<span class="h7 font-weight-500 pl-28">${escapeHtml(value)}</span>
</li>`;

const overviewList = (vehicle: Vehicle) => `<ul class="car-overview-list-style2">
	${overviewItem('icon-gauge.svg', 'Mileage', km(vehicle.mileage))}
	${overviewItem('calendar.svg', 'Year', String(vehicle.year))}
	${overviewItem('gaspump.svg', 'Fuel', vehicle.fuel)}
	${overviewItem('palette.svg', 'Color', vehicle.exterior)}
	${overviewItem('MapPin.svg', 'Location', vehicle.location)}
	${overviewItem('Seatbelt.svg', 'Interior', vehicle.interior)}
	${overviewItem('Frame.svg', 'Engine', vehicle.engine || 'On request')}
	${overviewItem('transmission-2.svg', 'Transmission', vehicle.transmission)}
	${overviewItem('Barcode.svg', 'Source ID', vehicle.vin)}
	${overviewItem('QrCode.svg', 'Stock Number', vehicle.stockNumber)}
</ul>`;

const featureTabs = (vehicle: Vehicle) => {
	const features = (
		vehicle.features.length
			? vehicle.features
			: ['Verified source listing', 'History review available', 'Viewing by appointment']
	).slice(0, 24);
	const chunks = [
		features.slice(0, 12),
		features.slice(12, 24),
		['Europe import review', 'Document trail review', 'Registration readiness discussion'],
		['Mechanical inspection can be arranged', vehicle.engine || 'Engine details on request'],
		[vehicle.fuel, vehicle.transmission, vehicle.bodyType].filter(Boolean),
		[
			daynightContact.appointmentNote,
			daynightFetchedAt
				? `Inventory refreshed ${daynightFetchedAt}`
				: 'Inventory refreshed from OUTLETCARS.BG — Варна source data'
		]
	];

	return `<div class="flat-tabs mb-40">
		<div class="overflow-x-auto mb-16">
			<ul class="menu-tab menu-tab-style4">
				<li class="active"><span class="text-secondary font-weight-600">Equipment</span></li>
				<li><span class="text-secondary font-weight-600">Comfort</span></li>
				<li><span class="text-secondary font-weight-600">History</span></li>
				<li><span class="text-secondary font-weight-600">Mechanical</span></li>
				<li><span class="text-secondary font-weight-600">Specs</span></li>
				<li><span class="text-secondary font-weight-600">Notes</span></li>
			</ul>
		</div>
		<div class="content-tab">
			${chunks
				.map(
					(chunk, index) => `<div class="content-inner ${index === 0 ? 'active' : ''}">
				<ul class="grid grid-cols-3 xl-grid-cols-2 md-grid-cols-1 gap-8 gap-x-30">
					${chunk
						.map(
							(feature) => `<li class="flex items-center gap-8">
						<img src="/assets/icons/check.svg" alt="check">
						${escapeHtml(feature)}
					</li>`
						)
						.join('')}
				</ul>
			</div>`
				)
				.join('')}
		</div>
	</div>`;
};

const replaceFirstBlockAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const relatedSlides = (vehicle: Vehicle) =>
	getVehicleDetailRelated(vehicle, 4)
		.map((related, index) => `<div class="swiper-slide">${gridCard(related, index)}</div>`)
		.join('\n');

const replaceRelatedVehicles = (html: string, vehicle: Vehicle) => {
	const sectionIndex = html.indexOf('You might also like');
	const wrapperStart = html.indexOf('<div class="swiper-wrapper">', sectionIndex);
	const replacement = `<div class="swiper-wrapper">
		${relatedSlides(vehicle)}
	</div>`;

	return replaceDivBlock(html, wrapperStart, replacement);
};

export const applyDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const vehicle = getVehicleDetailOrFallback(options.slug);
	const monthly = `${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`;
	const consultant =
		daynightConsultants.find((agent) => agent.slug === vehicle.agentSlug) ?? daynightConsultants[0] ?? { image: '/dealer/logo-on-light-v2.svg', name: daynightBrand.name, slug: 'showroom-contact', title: 'Контакт с автокъщата' };
	let next = html
		// Lead with the actual price, not the financing estimate: make the Cash tab
		// active by default so the headline shows the car price; Finance is one tab away.
		.replace(
			/<li>Cash<\/li>\s*<li class="active">Finance<\/li>/,
			'<li class="active">Cash</li>\n\t\t\t\t\t\t\t\t\t\t\t<li>Finance</li>'
		)
		.replace(
			/<div class="content-inner">(\s*<p class="h5 mb-4">Price:<\/p>\s*<p class="h4 mb-4">\$44\.900)/,
			'<div class="content-inner active">$1'
		)
		.replace(
			/<div class="content-inner active">(\s*<p class="h5 mb-4">Price:<\/p>\s*<p class="h4 mb-4">\$245\/mo)/,
			'<div class="content-inner">$1'
		)
		.replace(
			'<h2 class="capitalize">Audi A6 Avant e-tron</h2>',
			'<h1 class="h2 capitalize">Audi A6 Avant e-tron</h1>'
		)
		.replaceAll('Audi A6 Avant e-tron', escapeHtml(vehicle.title))
		.replaceAll('Audi A6 Avant E-Tron', escapeHtml(vehicle.title))
		.replace(
			/src="\/assets\/images\/inner-page\/slide-listing-details-\d+\.jpg"/g,
			`src="${escapeHtml(vehicle.image)}"`
		)
		.replace(/src="\/assets\/images\/card\/card-\d+\.jpg"/g, `src="${escapeHtml(vehicle.image)}"`)
		.replace(
			/The 2024 - 2025 Honda HR-V is offered[\s\S]*?RM 141,900\./,
			escapeHtml(
				vehicle.description ||
					`${vehicle.title} is available through OUTLETCARS.BG — Варна with source review and viewing by appointment.`
			)
		)
		.replaceAll('$44.900', escapeHtml(vehicle.priceLabel))
		.replaceAll('$245/mo', escapeHtml(monthly))
		.replaceAll('$46.300|', escapeHtml(vehicle.priceLabel))
		.replaceAll(
			'$1,560 due at signing · 72 mo · 7.89% APR',
			'Estimated over 72 months. Final terms confirmed by OUTLETCARS.BG — Варна.'
		)
		.replaceAll(
			'List price w/o taxes, fees, and accessories',
			'Listed vehicle price. Final taxes and registration costs confirmed before purchase.'
		)
		.replaceAll(
			'Finance payment w/o taxes, fees, and accessories',
			'Estimated payment before final taxes, registration, and transport costs.'
		)
		.replaceAll('Vehicle in the VAT system', escapeHtml(vehicle.priceBgn || 'On request'))
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(daynightContact.addressLabel)
		)
		.replaceAll('Tampa, FL', escapeHtml(vehicle.location))
		.replaceAll('Mike Hanley', escapeHtml(consultant.name))
		.replaceAll('/assets/images/avatar/contact-avatar.png', escapeHtml(consultant.image))
		.replaceAll(
			'/assets/images/avatar/coment-avatar-1.png',
			'/assets/images/avatar/coment-avatar-1.webp'
		)
		.replaceAll(
			'/assets/images/avatar/coment-avatar-2.png',
			'/assets/images/avatar/coment-avatar-2.webp'
		)
		.replaceAll('Verified Dealer', 'OUTLETCARS.BG — Варна Consultant')
		.replaceAll('1-555-678-8888', escapeHtml(daynightContact.primaryPhoneLabel))
		.replaceAll('1-555-678-9999', escapeHtml(daynightContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', daynightContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', daynightContact.marketplacePhoneHref)
		.replaceAll('Call To Dealer', 'Call OUTLETCARS.BG — Варна')
		.replaceAll('Chat via WhatsApp', 'Chat on Viber')
		.replaceAll('Tony Nguyen', '')
		.replaceAll('This Vehicle&#39;s Availability 2', 'Registration and documents')
		.replaceAll('This Vehicle&#39;s Availability 3', 'Viewing appointment');

	next = next
		.replaceAll('Financing Calculator', 'Калкулатор за финансиране')
		.replaceAll('Services Calculator', 'Калкулатор за финансиране')
		.replaceAll('Car Price', 'Цена на автомобила')
		.replaceAll('Interest Rate', 'Лихвен процент')
		.replaceAll('Loan Term (months)', 'Срок (месеци)')
		.replaceAll('60 months', '60 месеца')
		.replaceAll('30 months', '30 месеца')
		.replaceAll('10 months', '10 месеца')
		.replaceAll('Down Payment', 'Първоначална вноска')
		.replaceAll('Calculate', 'Изчисли')
		.replaceAll('Monthly Payment:', 'Месечна вноска:')
		.replaceAll('Total Interest Payment:', 'Обща лихва:')
		.replaceAll('Est. Total Loan:', 'Прибл. общо:')
		.replaceAll('$788.56/Month', '788.56 EUR/мес.')
		.replaceAll('$1413.60', '1413.60 EUR')
		.replaceAll('$47713.60', '47713.60 EUR')
		.replaceAll('Customer Reviews', 'Отзиви от клиенти')
		.replaceAll('(1,968 Ratings)', '(1 968 оценки)')
		.replaceAll('Write a review', 'Напиши отзив')
		.replaceAll('Randynox', 'Клиент от Варна')
		.replaceAll('Mista Nyroom', 'Купувач от Варна')
		.replaceAll('Heather Dick', 'Собственик от Варна')
		.replaceAll('August 13, 2025', '13 август 2025')
		.replaceAll('August 22, 2025', '22 август 2025')
		.replaceAll('August 18, 2025', '18 август 2025')
		.replaceAll(
			'Bought new in 2012, and it’s still running strong at over 180,000 miles. I’ve only had to replace the battery and brakes once. The ride is smooth, the interior still feels solid, and the fuel economy hasn’t dropped much.',
			'OUTLETCARS.BG — Варна ни помогна да изберем автомобил с ясна история и реален пробег. Огледът беше организиран спокойно, а документите бяха обяснени предварително.'
		)
		.replaceAll(
			'Picked this car up used about five years ago with 90k miles. It’s now at 160k and still starts every morning without hesitation. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives.',
			'Получихме сравнение между няколко автомобила и ясна крайна цена. Най-ценно беше, че екипът не натискаше сделката, а показа плюсовете и рисковете.'
		)
		.replaceAll(
			'Owned since 2010. Drove it through all kinds of weather, from hot summers to snowy roads, and it never let me down. A few minor repairs here and there — mostly wear and tear — but the engine just keeps going.',
			'Процесът по внос беше проследим от първия разговор до регистрацията. Получихме снимки, документи и реалистични срокове, което ни спести много нерви.'
		)
		.replaceAll('View more reviews (98)', 'Виж още отзиви (98)')
		.replaceAll('add a review', 'Добави отзив')
		.replaceAll('Your email address will not be published', 'Имейлът няма да бъде публикуван.')
		.replaceAll('Login to add a Review', 'Свържи се за отзив')
		.replaceAll('Send Inquiry about Vehicle', 'Запитване за автомобила')
		.replaceAll('<p class="mb-8">Name</p>', '<p class="mb-8">Име</p>')
		.replaceAll('<p class="mb-8">Email</p>', '<p class="mb-8">Имейл</p>')
		.replaceAll('<p class="mb-8">Phone</p>', '<p class="mb-8">Телефон</p>')
		.replaceAll('<p class="mb-8">Subject</p>', '<p class="mb-8">Тема</p>')
		.replaceAll('<p class="mb-6">Message</p>', '<p class="mb-6">Съобщение</p>')
		.replaceAll('placeholder="Phone (optional)"', 'placeholder="Телефон (по избор)"')
		.replaceAll('placeholder="Comment"', 'placeholder="Коментар"')
		.replaceAll('This Vehicle&#39;s Availability', 'Наличност на автомобила')
		.replaceAll('Registration and documents', 'Регистрация и документи')
		.replaceAll('Viewing appointment', 'Оглед по уговорка')
		.replaceAll('Send Inquiry', 'Изпрати запитване')
		.replaceAll(
			'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			'Искам да получа информация за цената и следващите стъпки за този автомобил.'
		)
		.replaceAll('By using this service, you accept our', 'С изпращането приемате')
		.replaceAll('Visitor Agreement.', 'условията за запитване.')
		.replace(
			'<input class="active" id="ServicesCalculatorCarPrice" name="ServicesCalculatorCarPrice" type="text"',
			'<input class="active" id="ServicesCalculatorCarPrice" name="ServicesCalculatorCarPrice" aria-label="Цена на автомобила" type="text"'
		)
		.replace(
			'<input id="ServicesCalculatorInterestRate" name="ServicesCalculatorInterestRate" type="text"',
			'<input id="ServicesCalculatorInterestRate" name="ServicesCalculatorInterestRate" aria-label="Лихвен процент" type="text"'
		)
		.replace(
			'<input id="ServicesCalculatorDownPayment" name="ServicesCalculatorDownPayment" type="text"',
			'<input id="ServicesCalculatorDownPayment" name="ServicesCalculatorDownPayment" aria-label="Първоначална вноска" type="text"'
		)
		.replace(
			/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]+"/,
			`<iframe src="${escapeHtml(daynightContact.mapEmbedUrl)}"`
		);

	next = next
		.replace(
			'<div class="listing-details">',
			`<div class="listing-details" data-daynight-slug="${escapeHtml(vehicle.slug)}" data-daynight-detail="true">`
		)
		.replace(
			'<a href="#" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" data-modal-id="#CardModal">',
			`<a href="/compare" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" data-modal-id="#CompareModal" data-daynight-compare="${escapeHtml(vehicle.slug)}" role="button" aria-label="Compare ${escapeHtml(vehicle.title)}">`
		)
		.replace(
			'<a href="#" class="btn-icon-circle hover-stroke-white">',
			`<a href="/account" class="btn-icon-circle hover-stroke-white daynight-favorite" role="button" aria-label="Запази ${escapeHtml(vehicle.title)}">`
		)
		.replace(
			'<a href="#" class="btn-icon-circle hover-fill-white">',
			`<a href="/contact" class="btn-icon-circle hover-fill-white" aria-label="Попитай за ${escapeHtml(vehicle.title)}" title="Попитай за автомобила">`
		)
		.replace(
			'<input class="active input-large" id="SendInquiryname" name="SendInquiryname" type="text"',
			'<input class="active input-large" id="SendInquiryname" name="SendInquiryname" aria-label="Име" type="text"'
		)
		.replace(
			'<input class="input-large" name="SendInquiryemail" id="SendInquiryemail" type="text"',
			'<input class="input-large" name="SendInquiryemail" id="SendInquiryemail" aria-label="Имейл" type="text"'
		)
		.replace(
			'<input placeholder="Телефон (по избор)" class="input-large" name="SendInquiryphone" id="SendInquiryphone" type="number"',
			'<input placeholder="Телефон (по избор)" class="input-large" name="SendInquiryphone" id="SendInquiryphone" aria-label="Телефон" type="number"'
		)
		.replace(
			'<textarea placeholder="Коментар" rows="3" tabindex="5" name="message" class="message" id="message"',
			'<textarea placeholder="Коментар" aria-label="Съобщение" rows="3" tabindex="5" name="message" class="message" id="message"'
		);

	next = next.replace(/<ul class="car-overview-list-style2">[\s\S]*?<\/ul>/, overviewList(vehicle));
	next = replaceFirstBlockAfter(
		next,
		'Get To Know this car',
		'<div class="flat-tabs mb-40">',
		featureTabs(vehicle)
	);
	next = replaceRelatedVehicles(next, vehicle);

	return replaceDemoVehicleCopy(next)
		.replace(
			'<input class="active" id="ServicesCalculatorCarPrice" name="ServicesCalculatorCarPrice" type="text"',
			'<input class="active" id="ServicesCalculatorCarPrice" name="ServicesCalculatorCarPrice" aria-label="Цена на автомобила" type="text"'
		)
		.replace(/href="listing-grid4-columns\.html"/g, 'href="/inventory?view=4"')
		.replace(/href="dealer-details\.html"/g, 'href="/agents/daynight-sales"')
		.replace(/href="clients-reviews\.html"/g, 'href="/reviews"')
		.replace(/href="#"/g, 'href="/contact"');
};
