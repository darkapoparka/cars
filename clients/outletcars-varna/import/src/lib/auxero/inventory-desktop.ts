import { daynightContact } from '$lib/data/daynight';
import { bodyTypes, brands, fuels, vehicles, type Vehicle } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
import {
	constrainInventoryViewForLayout,
	defaultInventoryViewForLayout,
	resolveInventoryView,
	type InventoryFilterPresentation,
	type InventoryLayout,
	type InventoryState
} from '$lib/server/inventory-state';

export type AuxeroInventoryFilterOption = {
	count?: number;
	image?: string;
	label: string;
	value: string;
};

export type AuxeroInventoryFilter = {
	allLabel: string;
	id: string;
	label: string;
	mode: 'multiple' | 'single';
	name: string;
	options: AuxeroInventoryFilterOption[];
	placeholder: string;
	selectedSummary: string;
	selectedValues: string[];
};

export type AuxeroInventoryHiddenInput = {
	name: string;
	value: string;
};

export type AuxeroInventorySortOption = {
	active: boolean;
	href: string;
	label: string;
	value: string;
};

export type AuxeroInventoryViewOption = {
	active: boolean;
	ariaLabel: string;
	href: string;
	label: string;
	title: string;
	view: '3' | '4' | '5' | 'map';
};

export type AuxeroInventoryLayoutToggle = {
	active: boolean;
	ariaLabel: string;
	href: string;
	label: string;
	title: string;
};

export type AuxeroInventoryLayoutOption = {
	active: boolean;
	ariaLabel: string;
	href: string;
	label: string;
	layout: 'classic' | 'dashboard';
	title: string;
};

export type AuxeroInventoryFilterPresentationOption = {
	active: boolean;
	ariaLabel: string;
	href: string;
	label: string;
	presentation: InventoryFilterPresentation;
	title: string;
};

export type AuxeroInventoryActiveFilter = {
	href: string;
	label: string;
};

export type AuxeroInventoryMapLocation = {
	countLabel: string;
	location: string;
	samples: string;
};

export type AuxeroInventoryDesktopData = {
	activeFilters: {
		chips: AuxeroInventoryActiveFilter[];
		clearHref: string;
		clearLabel: string;
		summary: string;
	} | null;
	ariaLabel: string;
	controlsLabel: string;
	filterButtonLabel: string;
	filterPresentation: InventoryFilterPresentation;
	filterPresentationLabel: string;
	filterPresentationOptions: AuxeroInventoryFilterPresentationOption[];
	filters: AuxeroInventoryFilter[];
	hiddenInputs: AuxeroInventoryHiddenInput[];
	layout: 'classic' | 'dashboard';
	layoutLabel: string;
	layoutOptions: AuxeroInventoryLayoutOption[];
	layoutToggle: AuxeroInventoryLayoutToggle;
	map: {
		address: string;
		appointmentNote: string;
		ctaHref: string;
		ctaLabel: string;
		locations: AuxeroInventoryMapLocation[];
		summary: string;
		title: string;
	} | null;
	searchLabel: string;
	searchPlaceholder: string;
	searchSubmit: string;
	searchValue: string;
	resultCount: number;
	selectedSort: string;
	showingText: string;
	sidebar: {
		actions: {
			clearHref: string;
			clearLabel: string;
			showLabel: string;
		};
		countLabel: string;
		filters: AuxeroInventoryFilter[];
		title: string;
	};
	sortLabel: string;
	sortOptions: AuxeroInventorySortOption[];
	subtitle: string;
	title: string;
	view: '3' | '4' | '5' | 'map';
	viewLabel: string;
	viewOptions: AuxeroInventoryViewOption[];
};

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
	{ label: { bg: 'До 30 000 EUR', en: 'Up to 30 000 EUR' }, value: '30000' },
	{ label: { bg: 'До 50 000 EUR', en: 'Up to 50 000 EUR' }, value: '50000' },
	{ label: { bg: 'До 70 000 EUR', en: 'Up to 70 000 EUR' }, value: '70000' },
	{ label: { bg: 'До 100 000 EUR', en: 'Up to 100 000 EUR' }, value: '100000' }
] as const;

const mileageFilterOptions = [
	{ label: { bg: 'До 50 000 км', en: 'Up to 50 000 km' }, value: '50000' },
	{ label: { bg: 'До 80 000 км', en: 'Up to 80 000 km' }, value: '80000' },
	{ label: { bg: 'До 100 000 км', en: 'Up to 100 000 km' }, value: '100000' },
	{ label: { bg: 'До 150 000 км', en: 'Up to 150 000 km' }, value: '150000' }
] as const;

const text = (locale: Locale) =>
	locale === 'bg'
		? {
				address: daynightContact.addressLabel,
				allBodyTypes: 'Всички купета',
				allBrands: 'Всички марки',
				allExtras: 'Всички екстри',
				allFuel: 'Всички горива',
				allGearboxes: 'Всички скорости',
				allMileage: 'Всеки пробег',
				allModels: 'Всички модели',
				allPrices: 'Всички цени',
				body: 'Купе',
				brand: 'Марка',
				clearFilters: 'Изчисти филтрите',
				controlsLabel: 'Контроли за изглед и филтри',
				emptyMap:
					'Няма автомобили по тези филтри. Изчисти филтрите или се свържи с OUTLETCARS.BG — Варна за входящи автомобили.',
				extras: 'Екстри',
				filterButton: 'Филтри',
				filterPresentation: 'Тип филтри',
				filterPresentationTitles: {
					modal: 'Отваря филтрите като централен modal',
					popover: 'Отваря филтрите като компактни popover менюта'
				},
				layout: 'Режим',
				layoutTitles: {
					classic: 'Grid изглед с филтър бутони над резултатите',
					dashboard: 'Sidebar изглед с постоянни филтри'
				},
				filterLabels: {
					bodyType: 'Купе',
					brand: 'Марка',
					condition: 'Състояние',
					feature: 'Екстра',
					fuel: 'Гориво',
					location: 'Локация',
					maxMileage: 'Макс. пробег',
					maxPrice: 'Макс. цена',
					maxYear: 'До година',
					minMileage: 'Мин. пробег',
					minPrice: 'Мин. цена',
					minYear: 'От година',
					query: 'Търсене',
					keyword: 'Ключова дума',
					sourceId: 'Номер',
					status: 'Статус',
					transmission: 'Скорости'
				},
				inventorySubtitle:
					'Разгледай наличните автомобили с ясни спецификации, цена и възможност за оглед.',
				inventoryTitle: 'Налични автомобили',
				fuel: 'Гориво',
				gearbox: 'Скорости',
				mapTitle: 'Зона за огледи OUTLETCARS.BG — Варна',
				matchingVehicleLabel: (count: number) =>
					`${count} ${count === 1 ? 'съвпадащ автомобил' : 'съвпадащи автомобила'}`,
				mileage: 'Пробег',
				model: 'Модел',
				price: 'Цена',
				searchAria: 'Търси в OUTLETCARS.BG — Варна',
				searchPlaceholder: 'Търси по марка, модел, година, гориво, екстри...',
				searchSubmit: 'Търси',
				selected: (count: number) => `${count} избрани`,
				showCount: (count: number) => `Покажи ${count}`,
				showing: (count: number, hasFilters: boolean) =>
					count === 0
						? `Показани 0 от ${vehicles.length} обяви`
						: hasFilters
							? `Показани 1 – ${count} от ${count} съвпадащи обяви`
							: `Показани 1 – ${count} от ${count} обяви`,
				sort: 'Подреди по',
				sortOptions: {
					'best-match': 'Най-подходящи',
					'highest-price': 'Най-висока цена',
					'lowest-mileage': 'Най-малък пробег',
					'lowest-price': 'Най-ниска цена',
					'newest-listed': 'Най-нови обяви',
					'newest-year': 'Най-нова година'
				},
				title: 'Филтри',
				vehiclesShown: (count: number) =>
					count === 1 ? '1 наличен автомобил' : `${count} налични автомобила`,
				view: 'Изглед'
			}
		: {
				address: daynightContact.addressLabel,
				allBodyTypes: 'All body types',
				allBrands: 'All makes',
				allExtras: 'All extras',
				allFuel: 'All fuel',
				allGearboxes: 'All gearboxes',
				allMileage: 'Any mileage',
				allModels: 'All models',
				allPrices: 'All prices',
				body: 'Body',
				brand: 'Make',
				clearFilters: 'Clear filters',
				controlsLabel: 'View and filter controls',
				emptyMap:
					'No cars match these filters. Clear filters or contact OUTLETCARS.BG — Варна for incoming vehicles.',
				extras: 'Extras',
				filterButton: 'Filters',
				filterPresentation: 'Filter style',
				filterPresentationTitles: {
					modal: 'Open filters as a centered modal',
					popover: 'Open filters as compact popover menus'
				},
				layout: 'Layout',
				layoutTitles: {
					classic: 'Grid view with filter buttons above results',
					dashboard: 'Sidebar view with persistent filters'
				},
				filterLabels: {
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
				},
				inventorySubtitle:
					'Browse available vehicles with clear specifications, pricing, and viewing support.',
				inventoryTitle: 'Available vehicles',
				fuel: 'Fuel',
				gearbox: 'Gearbox',
				mapTitle: 'OUTLETCARS.BG — Варна viewing area',
				matchingVehicleLabel: (count: number) =>
					`${count} ${count === 1 ? 'matching vehicle' : 'matching vehicles'}`,
				mileage: 'Mileage',
				model: 'Model',
				price: 'Price',
				searchAria: 'Search OUTLETCARS.BG — Варна inventory',
				searchPlaceholder: 'Search make, model, year, fuel, extras...',
				searchSubmit: 'Search',
				selected: (count: number) => `${count} selected`,
				showCount: (count: number) => `Show ${count}`,
				showing: (count: number, hasFilters: boolean) =>
					count === 0
						? `Showing 0 of ${vehicles.length} OUTLETCARS.BG — Варна Listings`
						: hasFilters
							? `Showing 1 - ${count} of ${count} matching OUTLETCARS.BG — Варна Listings`
							: `Showing 1 - ${count} of ${count} OUTLETCARS.BG — Варна Listings`,
				sort: 'Sort Vehicles by',
				sortOptions: {
					'best-match': 'Best Match',
					'highest-price': 'Highest Price',
					'lowest-mileage': 'Lowest Mileage',
					'lowest-price': 'Lowest Price',
					'newest-listed': 'Newest Listed',
					'newest-year': 'Newest Year'
				},
				title: 'Filters',
				vehiclesShown: (count: number) => `${count} ${count === 1 ? 'vehicle' : 'vehicles'} shown`,
				view: 'View'
			};

type InventoryFilterKey = keyof InventoryState['filters'];

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

const multiValueFilterKeys = new Set<InventoryFilterKey>([
	'bodyType',
	'brand',
	'feature',
	'fuel',
	'query',
	'transmission'
]);

const splitFilterValues = (value?: string | number | null) =>
	String(value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

const joinFilterValues = (values: string[]) =>
	Array.from(new Set(values.filter(Boolean))).join(',');

const hasFilterValue = (values: string[], value: string) =>
	values.some((item) => item.toLowerCase() === value.toLowerCase());

const countBy = (values: string[]) =>
	values.reduce((counts, value) => {
		counts.set(value, (counts.get(value) ?? 0) + 1);

		return counts;
	}, new Map<string, number>());

const inventoryUrl = (state: InventoryState, overrides: Record<string, string | undefined>) => {
	const params = new URLSearchParams(state.searchParams);
	const hasLayoutOverride = Object.hasOwn(overrides, 'layout') || Object.hasOwn(overrides, 'mode');
	const targetLayout: InventoryLayout = hasLayoutOverride
		? overrides.layout === 'classic'
			? 'classic'
			: 'dashboard'
		: state.layout;
	const defaultView = defaultInventoryViewForLayout(targetLayout);

	for (const [key, value] of Object.entries(overrides)) {
		if (
			!value ||
			(key === 'view' && value === defaultView) ||
			(key === 'sort' && value === 'best-match')
		) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const requestedView = params.get('view')
		? resolveInventoryView(params.get('view'))
		: defaultInventoryViewForLayout(targetLayout);
	if (requestedView === defaultView) {
		params.delete('view');
	}
	if (constrainInventoryViewForLayout(targetLayout, requestedView) !== requestedView) {
		params.delete('view');
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
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
	const defaultView = defaultInventoryViewForLayout(state.layout);

	if (state.filterPresentation === 'modal') params.set('filters', 'modal');
	if (state.layout === 'classic') params.set('layout', 'classic');
	if (state.view !== defaultView) params.set('view', state.view);
	if (state.sortParam !== 'best-match') params.set('sort', state.sortParam);

	return inventoryUrlFromParams(params);
};

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

const optionLabelForValue = (options: AuxeroInventoryFilterOption[], value: string | number) => {
	const selectedValue = String(value);

	return options.find(
		(option) => option.value && option.value.toLowerCase() === selectedValue.toLowerCase()
	)?.label;
};

const selectedOptionLabels = (
	options: AuxeroInventoryFilterOption[],
	selected?: string | number,
	placeholder = '',
	locale: Locale = 'en'
) => {
	const selectedValues = splitFilterValues(selected);
	const labels = options
		.filter((option) => option.value && hasFilterValue(selectedValues, option.value))
		.map((option) => option.label);

	if (!labels.length) return placeholder;
	if (labels.length <= 2) return labels.join(' + ');

	return text(locale).selected(labels.length);
};

const activeFilterDisplayLabel = (
	key: InventoryFilterKey,
	value: string | number,
	state: InventoryState,
	locale: Locale,
	filterOptions: Record<string, AuxeroInventoryFilterOption[]>
) => {
	const optionLabel =
		key === 'brand'
			? optionLabelForValue(filterOptions.brand, value)
			: key === 'query'
				? optionLabelForValue(filterOptions.model, value)
				: key === 'bodyType'
					? optionLabelForValue(filterOptions.bodyType, value)
					: key === 'feature'
						? optionLabelForValue(filterOptions.feature, value)
						: key === 'fuel'
							? optionLabelForValue(filterOptions.fuel, value)
							: key === 'transmission'
								? optionLabelForValue(filterOptions.transmission, value)
								: key === 'maxMileage'
									? optionLabelForValue(filterOptions.mileageTo, value)
									: key === 'maxPrice'
										? optionLabelForValue(filterOptions.priceTo, value)
										: undefined;

	if (optionLabel) return optionLabel;

	if (key === 'query' && typeof value === 'string') return value;

	return typeof value === 'number'
		? value.toLocaleString(locale === 'bg' ? 'bg-BG' : 'fr-FR').replace(/\u202f/g, ' ')
		: value;
};

const makeFilter = ({
	label,
	locale,
	mode = 'multiple',
	name,
	options,
	placeholder,
	selected
}: {
	label: string;
	locale: Locale;
	mode?: 'multiple' | 'single';
	name: string;
	options: AuxeroInventoryFilterOption[];
	placeholder: string;
	selected?: string | number;
}): AuxeroInventoryFilter => ({
	allLabel:
		locale === 'bg' ? `Всички ${label.toLocaleLowerCase('bg-BG')}` : `All ${label.toLowerCase()}`,
	id: `daynight-inventory-filter-${name.replace(/[^a-z0-9-]/gi, '-')}`,
	label,
	mode,
	name,
	options,
	placeholder,
	selectedSummary: selectedOptionLabels(options, selected, placeholder, locale),
	selectedValues: splitFilterValues(selected)
});

const hiddenInputs = (state: InventoryState): AuxeroInventoryHiddenInput[] => {
	const defaultView = defaultInventoryViewForLayout(state.layout);

	return [
		state.filters.condition ? { name: 'condition', value: state.filters.condition } : undefined,
		state.filters.location ? { name: 'location', value: state.filters.location } : undefined,
		state.filters.minMileage
			? { name: 'minMileage', value: String(state.filters.minMileage) }
			: undefined,
		state.filters.minPrice
			? { name: 'minPrice', value: String(state.filters.minPrice) }
			: undefined,
		state.filters.minYear ? { name: 'minYear', value: String(state.filters.minYear) } : undefined,
		state.filters.maxYear ? { name: 'maxYear', value: String(state.filters.maxYear) } : undefined,
		state.filters.sourceId ? { name: 'sourceId', value: state.filters.sourceId } : undefined,
		state.filters.status ? { name: 'status', value: state.filters.status } : undefined,
		state.layout === 'classic' ? { name: 'layout', value: 'classic' } : undefined,
		state.filterPresentation === 'modal' ? { name: 'filters', value: 'modal' } : undefined,
		state.view !== defaultView ? { name: 'view', value: state.view } : undefined,
		state.sortParam !== 'best-match' ? { name: 'sort', value: state.sortParam } : undefined
	].filter((input): input is AuxeroInventoryHiddenInput => Boolean(input));
};

const brandOptions = (): AuxeroInventoryFilterOption[] => {
	const counts = countBy(vehicles.map((vehicle) => vehicle.brand));

	return brands
		.map((brand) => ({
			count: counts.get(brand) ?? 0,
			image: brandLogos[brand] ?? '/dealer/logo.png',
			label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand,
			value: brand
		}))
		.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'en'));
};

const bodyOptions = (locale: Locale): AuxeroInventoryFilterOption[] => {
	const counts = countBy(vehicles.map((vehicle) => vehicle.bodyType));

	return bodyTypes
		.map((bodyType) => ({
			count: counts.get(bodyType) ?? 0,
			label: translateVehicleTerm(locale, 'bodyTypes', bodyType),
			value: bodyType
		}))
		.filter((bodyType) => bodyType.value !== 'Car' && bodyType.count > 0)
		.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
};

const fuelOptions = (locale: Locale): AuxeroInventoryFilterOption[] => {
	const counts = countBy(vehicles.map((vehicle) => vehicle.fuel));
	const order = ['Petrol', 'Plug-in хибрид', 'EV'];

	return fuels
		.map((fuel) => ({
			count: counts.get(fuel) ?? 0,
			label: translateVehicleTerm(locale, 'fuels', fuel),
			value: fuel
		}))
		.filter((fuel) => fuel.count > 0 && fuel.value !== '340 к.с.')
		.sort((left, right) => {
			const leftIndex = order.indexOf(left.value);
			const rightIndex = order.indexOf(right.value);

			if (leftIndex !== -1 || rightIndex !== -1) {
				return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
			}

			return right.count - left.count || left.label.localeCompare(right.label);
		});
};

const transmissionOptions = (locale: Locale): AuxeroInventoryFilterOption[] =>
	Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission)))
		.filter(Boolean)
		.sort()
		.map((transmission) => ({
			label: translateVehicleTerm(locale, 'transmissions', transmission),
			value: transmission
		}));

const featureOptions = (): AuxeroInventoryFilterOption[] =>
	popularFeatureOptions.map((feature) => ({
		label: feature,
		value: feature
	}));

const priceOptions = (locale: Locale): AuxeroInventoryFilterOption[] =>
	priceFilterOptions.map((option) => ({
		label: option.label[locale],
		value: option.value
	}));

const mileageOptions = (locale: Locale): AuxeroInventoryFilterOption[] =>
	mileageFilterOptions.map((option) => ({
		label: option.label[locale],
		value: option.value
	}));

const buildFilters = (state: InventoryState, locale: Locale) => {
	const labels = text(locale);
	const options = {
		bodyType: bodyOptions(locale),
		brand: brandOptions(),
		feature: featureOptions(),
		fuel: fuelOptions(locale),
		mileageTo: mileageOptions(locale),
		model: modelOptionsForBrands(state.filters.brand)
			.map((model) => {
				const selectedBrands = splitFilterValues(state.filters.brand);
				const modelBrands = Array.from(
					new Set(
						vehicles
							.filter(
								(vehicle) =>
									vehicle.model === model &&
									(!selectedBrands.length || hasFilterValue(selectedBrands, vehicle.brand))
							)
							.map((vehicle) => vehicle.brand)
					)
				);
				return {
					label: selectedBrands.length === 1 ? model : `${modelBrands.join(' / ')} ${model}`,
					value: model
				};
			})
			.sort((a, b) => a.label.localeCompare(b.label)),
		priceTo: priceOptions(locale),
		transmission: transmissionOptions(locale)
	};
	const filters = [
		makeFilter({
			label: labels.brand,
			locale,
			name: 'brand',
			options: options.brand,
			placeholder: labels.brand,
			selected: state.filters.brand
		}),
		makeFilter({
			label: labels.model,
			locale,
			name: 'model',
			options: options.model,
			placeholder: labels.model,
			selected: selectedModel(state)
		}),
		makeFilter({
			label: labels.price,
			locale,
			mode: 'single',
			name: 'priceTo',
			options: options.priceTo,
			placeholder: labels.price,
			selected: selectedNumber(state.filters.maxPrice)
		}),
		makeFilter({
			label: labels.mileage,
			locale,
			mode: 'single',
			name: 'mileageTo',
			options: options.mileageTo,
			placeholder: labels.mileage,
			selected: selectedNumber(state.filters.maxMileage)
		}),
		makeFilter({
			label: labels.fuel,
			locale,
			name: 'fuel',
			options: options.fuel,
			placeholder: labels.fuel,
			selected: state.filters.fuel
		}),
		makeFilter({
			label: labels.gearbox,
			locale,
			name: 'transmission',
			options: options.transmission,
			placeholder: labels.gearbox,
			selected: state.filters.transmission
		}),
		makeFilter({
			label: labels.body,
			locale,
			name: 'bodyType',
			options: options.bodyType,
			placeholder: labels.body,
			selected: state.filters.bodyType
		}),
		makeFilter({
			label: labels.extras,
			locale,
			name: 'feature',
			options: options.feature,
			placeholder: labels.extras,
			selected: state.filters.feature
		})
	];

	const sidebarAllLabels: Record<string, string> = {
		bodyType: labels.allBodyTypes,
		brand: labels.allBrands,
		feature: labels.allExtras,
		fuel: labels.allFuel,
		mileageTo: labels.allMileage,
		model: labels.allModels,
		priceTo: labels.allPrices,
		transmission: labels.allGearboxes
	};

	return {
		filters: filters.map((filter) => ({
			...filter,
			allLabel: sidebarAllLabels[filter.name] ?? filter.allLabel
		})),
		options
	};
};

const sortOptions = (state: InventoryState, locale: Locale) => {
	const labels = text(locale).sortOptions;

	return Object.entries(labels).map(([value, label]) => ({
		active: state.sortParam === value,
		href: inventoryUrl(state, { sort: value }),
		label,
		value
	}));
};

const viewOptions = (state: InventoryState, locale: Locale): AuxeroInventoryViewOption[] =>
	(state.layout === 'dashboard'
		? (['3', '4', 'map'] as const)
		: (['3', '4', '5', 'map'] as const)
	).map((view) => {
		const labels: Record<AuxeroInventoryViewOption['view'], string> =
			locale === 'bg'
				? {
						'3': 'Удобна мрежа',
						'4': 'Компактна мрежа',
						'5': 'Плътна мрежа',
						map: 'Карта и списък'
					}
				: {
						'3': 'Comfortable grid',
						'4': 'Compact grid',
						'5': 'Dense grid',
						map: 'Map and list'
					};

		return {
			active: state.view === view,
			ariaLabel: labels[view],
			href: inventoryUrl(state, { view }),
			label: labels[view],
			title: labels[view],
			view
		};
	});

const layoutToggle = (state: InventoryState, locale: Locale): AuxeroInventoryLayoutToggle => {
	const active = state.layout === 'dashboard';
	const labels =
		locale === 'bg'
			? {
					classic: 'Мрежа',
					dashboard: 'Панел',
					toClassic: 'Покажи мрежа без постоянен панел с филтри',
					toDashboard: 'Покажи постоянен панел с филтри'
				}
			: {
					classic: 'Grid',
					dashboard: 'Sidebar',
					toClassic: 'Show the grid without a persistent filter panel',
					toDashboard: 'Show a persistent filter panel'
				};

	return {
		active,
		ariaLabel: active ? labels.toClassic : labels.toDashboard,
		href: inventoryUrl(state, {
			layout: active ? 'classic' : 'dashboard',
			mode: undefined
		}),
		label: active ? labels.classic : labels.dashboard,
		title: active ? labels.toClassic : labels.toDashboard
	};
};

const layoutOptions = (state: InventoryState, locale: Locale): AuxeroInventoryLayoutOption[] => {
	const labels = text(locale).layoutTitles;

	return (['dashboard', 'classic'] as const).map((layout) => ({
		active: state.layout === layout,
		ariaLabel: labels[layout],
		href: inventoryUrl(state, {
			layout: layout === 'classic' ? 'classic' : 'dashboard',
			mode: undefined
		}),
		label:
			locale === 'bg'
				? layout === 'dashboard'
					? 'Панел'
					: 'Мрежа'
				: layout === 'dashboard'
					? 'Sidebar'
					: 'Grid',
		layout,
		title: labels[layout]
	}));
};

const filterPresentationOptions = (
	state: InventoryState,
	locale: Locale
): AuxeroInventoryFilterPresentationOption[] => {
	const labels = text(locale).filterPresentationTitles;

	return (['popover', 'modal'] as const).map((presentation) => ({
		active: state.filterPresentation === presentation,
		ariaLabel: labels[presentation],
		href: inventoryUrl(state, {
			filterMode: undefined,
			filters: presentation === 'modal' ? 'modal' : undefined
		}),
		label:
			locale === 'bg'
				? presentation === 'modal'
					? 'Разширени'
					: 'Компактни'
				: presentation === 'modal'
					? 'Modal'
					: 'Popover',
		presentation,
		title: labels[presentation]
	}));
};

const activeFilters = (
	state: InventoryState,
	locale: Locale,
	filterOptions: Record<string, AuxeroInventoryFilterOption[]>
): AuxeroInventoryDesktopData['activeFilters'] => {
	const entries = Object.entries(state.filters) as Array<[InventoryFilterKey, string | number]>;

	if (!entries.length) return null;

	const labels = text(locale);
	const chips = entries.flatMap(([key, value]) => {
		const values =
			typeof value === 'string' && multiValueFilterKeys.has(key)
				? splitFilterValues(value)
				: [value];

		return values.map((item) => {
			const href =
				typeof item === 'string' && multiValueFilterKeys.has(key)
					? inventoryUrlWithoutFilterValue(state, key, item)
					: inventoryUrlWithoutFilter(state, key);
			const valueLabel = activeFilterDisplayLabel(key, item, state, locale, filterOptions);

			return {
				href,
				label: `${labels.filterLabels[key]}: ${valueLabel}`
			};
		});
	});

	return {
		chips,
		clearHref: inventoryClearFiltersUrl(state),
		clearLabel: labels.clearFilters,
		summary:
			locale === 'bg'
				? `${state.selected.length} ${state.selected.length === 1 ? 'съвпадение' : 'съвпадения'}`
				: `${state.selected.length} ${state.selected.length === 1 ? 'match' : 'matches'}`
	};
};

const mapLocationGroups = (source: Vehicle[]) => {
	const groups = new Map<string, { count: number; location: string; samples: Vehicle[] }>();

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
		(left, right) => right.count - left.count || left.location.localeCompare(right.location, 'bg')
	);
};

const mapData = (
	state: InventoryState,
	locale: Locale
): AuxeroInventoryDesktopData['map'] | null => {
	if (state.view !== 'map') return null;

	const labels = text(locale);
	const summary = labels.matchingVehicleLabel(state.selected.length);

	return {
		address: labels.address,
		appointmentNote:
			locale === 'bg'
				? `${daynightContact.appointmentNote}. Точната локация за оглед се потвърждава по телефона.`
				: `${daynightContact.appointmentNote}. The exact viewing location is confirmed by phone.`,
		ctaHref: daynightContact.primaryPhoneHref,
		ctaLabel: daynightContact.primaryPhoneLabel,
		locations: mapLocationGroups(state.selected).map((group) => ({
			countLabel:
				locale === 'bg'
					? `${group.count} ${group.count === 1 ? 'автомобил' : 'автомобила'}`
					: `${group.count} ${group.count === 1 ? 'vehicle' : 'vehicles'}`,
			location: group.location,
			samples: group.samples.map((vehicle) => vehicle.title).join(' / ')
		})),
		summary:
			locale === 'bg'
				? `${summary}, групирани по локация за оглед.`
				: `${summary}, grouped by viewing location.`,
		title: labels.mapTitle
	};
};

export const inventoryDesktopDataFromState = (
	state: InventoryState,
	locale: Locale
): AuxeroInventoryDesktopData => {
	const labels = text(locale);
	const { filters, options } = buildFilters(state, locale);
	const sorts = sortOptions(state, locale);

	return {
		activeFilters: activeFilters(state, locale, options),
		ariaLabel:
			locale === 'bg' ? 'Налични автомобили от OUTLETCARS.BG — Варна' : 'OUTLETCARS.BG — Варна inventory',
		controlsLabel: labels.controlsLabel,
		filterButtonLabel: labels.filterButton,
		filterPresentation: state.filterPresentation,
		filterPresentationLabel: labels.filterPresentation,
		filterPresentationOptions: filterPresentationOptions(state, locale),
		filters,
		hiddenInputs: hiddenInputs(state),
		layout: state.layout,
		layoutLabel: labels.layout,
		layoutOptions: layoutOptions(state, locale),
		layoutToggle: layoutToggle(state, locale),
		map: mapData(state, locale),
		searchLabel: labels.searchAria,
		searchPlaceholder: labels.searchPlaceholder,
		searchSubmit: labels.searchSubmit,
		searchValue: selectedSearchQuery(state),
		resultCount: state.selected.length,
		selectedSort: sorts.find((option) => option.active)?.label ?? labels.sortOptions['best-match'],
		showingText: labels.showing(state.selected.length, Object.keys(state.filters).length > 0),
		sidebar: {
			actions: {
				clearHref: inventoryClearFiltersUrl(state),
				clearLabel: locale === 'bg' ? 'Изчисти' : 'Clear',
				showLabel: labels.showCount(state.selected.length)
			},
			countLabel: labels.vehiclesShown(state.selected.length),
			filters,
			title: labels.title
		},
		sortLabel: labels.sort,
		sortOptions: sorts,
		subtitle: labels.inventorySubtitle,
		title: labels.inventoryTitle,
		view: state.view,
		viewLabel: labels.view,
		viewOptions: viewOptions(state, locale)
	};
};
