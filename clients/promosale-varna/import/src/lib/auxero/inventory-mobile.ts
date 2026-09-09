import { bodyTypes, brands, fuels, vehicles, type InventoryFilters } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
import type { InventoryState } from '$lib/server/inventory-state';
import { formatMileage, formatPrice } from '$lib/utils/format';

export type InventoryMobilePill = {
	active: boolean;
	href: string;
	image?: string;
	kind?: 'body' | 'brand' | 'total';
	label: string;
};

export type InventoryMobileOption = {
	active: boolean;
	countLabel?: string;
	href: string;
	image?: string;
	label: string;
	value: string;
};

export type InventoryMobileData = {
	activeFilters: InventoryMobilePill[];
	applyLabel: string;
	bodyLabel: string;
	bodyRailLabel: string;
	bodyOptions: InventoryMobileOption[];
	brandOptions: InventoryMobileOption[];
	brandLabel: string;
	brandSearchPlaceholder: string;
	brandValue: string;
	clearHref: string;
	clearLabel: string;
	closeLabel: string;
	countLabel: string;
	doneLabel: string;
	drawerTitle: string;
	showResultsLabel: string;
	extrasLabel: string;
	featureOptions: InventoryMobileOption[];
	featureValue: string;
	filterLabel: string;
	fuelLabel: string;
	fuelOptions: InventoryMobileOption[];
	fuelValue: string;
	hiddenInputs: Array<{ name: string; value: string }>;
	mileageLabel: string;
	mileageOptions: InventoryMobileOption[];
	mileageValue: string;
	modelLabel: string;
	modelOptions: InventoryMobileOption[];
	modelOptionsByBrand: Record<string, InventoryMobileOption[]>;
	modelSearchPlaceholder: string;
	modelValue: string;
	noMatchesLabel: string;
	priceLabel: string;
	priceOptions: InventoryMobileOption[];
	priceValue: string;
	quickPills: InventoryMobilePill[];
	searchDrawerTitle: string;
	searchDisplayValue: string;
	searchLabel: string;
	searchPlaceholder: string;
	searchValue: string;
	sortLabel: string;
	sortOptions: InventoryMobileOption[];
	sortValue: string;
	transmissionLabel: string;
	transmissionOptions: InventoryMobileOption[];
	transmissionValue: string;
	totalPill: InventoryMobilePill;
	yearLabel: string;
	yearOptions: InventoryMobileOption[];
	yearValue: string;
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

const featuredExtras = [
	'4x4',
	'Панорамен люк',
	'LED фарове',
	'Apple CarPlay / Android Auto',
	'360 camera / Задна камера',
	'Head up display',
	'Подгряване на седалките',
	'Безключово палене'
] as const;

const featureLabels: Record<string, Partial<Record<Locale, string>>> = {
	'360 camera / Задна камера': { bg: '360 камера', en: '360 camera' },
	'Apple CarPlay / Android Auto': { bg: 'CarPlay / Android Auto', en: 'CarPlay / Android Auto' },
	'Безключово палене': { bg: 'Безключово', en: 'Keyless start' },
	'Панорамен люк': { bg: 'Панорама', en: 'Panorama' },
	'Подгряване на седалките': { bg: 'Подгрев', en: 'Heated seats' },
	'LED фарове': { bg: 'LED фарове', en: 'LED headlights' },
	'Head up display': { bg: 'Head-up', en: 'Head-up' },
	'4x4': { bg: '4x4', en: '4x4' }
};

const labels = (locale: Locale) =>
	locale === 'bg'
		? {
				all: 'Всички',
				allBodyTypes: 'Всички типове',
				allBrands: 'Всички марки',
				allExtras: 'Всички екстри',
				allMileage: 'Всеки пробег',
				allPrices: 'Всички цени',
				allTransmissions: 'Всички скорости',
				allYears: 'Всички години',
				allWithCount: (count: number) => `Всички ${count}`,
				apply: 'Приложи',
				showResults: (count: number) => `Виж ${count} автомобила`,
				body: 'Тип купе',
				bodyShort: 'Тип',
				brand: 'Марка',
				brandSearchPlaceholder: 'Търси марка',
				clear: 'Изчисти',
				close: 'Затвори',
				done: 'Готово',
				drawerTitle: 'Филтри',
				extras: 'Екстри',
				filters: 'Филтри',
				fuel: 'Гориво',
				mileage: 'Пробег',
				model: 'Модел',
				modelSearchPlaceholder: 'Търси модел',
				noMatches: 'Няма съвпадения',
				price: 'Цена',
				search: 'Търси',
				searchDrawerTitle: 'Намери автомобил',
				searchPlaceholder: 'Търси автомобили',
				sort: 'Сортирай',
				sortOptions: {
					'best-match': 'Най-подходящи',
					'highest-price': 'Най-висока цена',
					'lowest-mileage': 'Най-нисък пробег',
					'lowest-price': 'Най-ниска цена',
					'newest-listed': 'Най-нови обяви',
					'newest-year': 'Най-нова година'
				},
				transmission: 'Скорости',
				year: 'Година'
			}
		: {
				all: 'All',
				allBodyTypes: 'All body types',
				allBrands: 'All brands',
				allExtras: 'All extras',
				allMileage: 'Any mileage',
				allPrices: 'All prices',
				allTransmissions: 'All transmissions',
				allYears: 'All years',
				allWithCount: (count: number) => `All ${count}`,
				apply: 'Apply',
				showResults: (count: number) => `Show ${count} cars`,
				body: 'Body type',
				bodyShort: 'Type',
				brand: 'Brand',
				brandSearchPlaceholder: 'Search make',
				clear: 'Clear',
				close: 'Close',
				done: 'Done',
				drawerTitle: 'Filters',
				extras: 'Extras',
				filters: 'Filters',
				fuel: 'Fuel',
				mileage: 'Mileage',
				model: 'Model',
				modelSearchPlaceholder: 'Search model',
				noMatches: 'No matches',
				price: 'Price',
				search: 'Search',
				searchDrawerTitle: 'Find a car',
				searchPlaceholder: 'Search cars',
				sort: 'Sort',
				sortOptions: {
					'best-match': 'Best Match',
					'highest-price': 'Highest Price',
					'lowest-mileage': 'Lowest Mileage',
					'lowest-price': 'Lowest Price',
					'newest-listed': 'Newest Listed',
					'newest-year': 'Newest Year'
				},
				transmission: 'Transmission',
				year: 'Year'
			};

const countBy = (values: string[]) =>
	values.reduce((counts, value) => {
		counts.set(value, (counts.get(value) ?? 0) + 1);

		return counts;
	}, new Map<string, number>());

const rangeValue = (min?: number, max?: number) => `${min ?? ''}-${max ?? ''}`;

const parseRangeValue = (value: string) => {
	const [min, max] = value.split('-');

	return {
		max: max ? Number(max) : undefined,
		min: min ? Number(min) : undefined
	};
};

const matchesRange = (value: number, range: string) => {
	const { max, min } = parseRangeValue(range);

	return (!min || value >= min) && (!max || value <= max);
};

const activeRangeValue = (min?: number, max?: number) => (min || max ? rangeValue(min, max) : '');

const splitFilterValues = (value?: string | null) =>
	String(value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

const uniqueFilterValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const joinFilterValues = (values: string[]) => uniqueFilterValues(values).join(',');

const hasFilterValue = (values: string[], value: string) =>
	values.some((item) => item.toLowerCase() === value.toLowerCase());

const toggleFilterValue = (current: string | undefined, value: string) => {
	if (!value) return '';

	const values = splitFilterValues(current);
	const nextValues = hasFilterValue(values, value)
		? values.filter((item) => item.toLowerCase() !== value.toLowerCase())
		: [...values, value];

	return joinFilterValues(nextValues);
};

const optionForRange = ({
	activeValue,
	count,
	href,
	label,
	value
}: {
	activeValue: string;
	count: number;
	href: string;
	label: string;
	value: string;
}): InventoryMobileOption => ({
	active: activeValue === value,
	countLabel: String(count),
	href,
	label,
	value
});

const inventoryUrl = (state: InventoryState, overrides: Record<string, string | null>) => {
	const params = new URLSearchParams(state.searchParams);

	for (const [key, value] of Object.entries(overrides)) {
		if (!value || (key === 'view' && value === '4') || (key === 'sort' && value === 'best-match')) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const quickUrl = (
	state: InventoryState,
	overrides: { bodyType?: string | null; brand?: string | null; fuel?: string | null } = {}
) => {
	const params = new URLSearchParams();
	const brand = Object.hasOwn(overrides, 'brand')
		? overrides.brand === null
			? ''
			: toggleFilterValue(state.filters.brand, overrides.brand ?? '')
		: state.filters.brand;
	const bodyType = Object.hasOwn(overrides, 'bodyType')
		? overrides.bodyType === null
			? ''
			: toggleFilterValue(state.filters.bodyType, overrides.bodyType ?? '')
		: state.filters.bodyType;
	const fuel = Object.hasOwn(overrides, 'fuel')
		? overrides.fuel === null
			? ''
			: toggleFilterValue(state.filters.fuel, overrides.fuel ?? '')
		: state.filters.fuel;

	if (state.sortParam !== 'best-match') params.set('sort', state.sortParam);
	if (state.filters.query) params.set('q', state.filters.query);
	if (state.filters.keyword) params.set('keyword', state.filters.keyword);
	if (brand) params.set('brand', brand);
	if (bodyType) params.set('bodyType', bodyType);
	if (fuel) params.set('fuel', fuel);

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const without = (state: InventoryState, keys: string[]) => {
	const params = new URLSearchParams(state.searchParams);

	for (const key of keys) params.delete(key);

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const withoutFilterValue = (state: InventoryState, keys: string | string[], value: string) => {
	const params = new URLSearchParams(state.searchParams);
	const keyList = Array.isArray(keys) ? keys : [keys];
	const primaryKey = keyList[0];
	const values = keyList
		.flatMap((key) => splitFilterValues(params.get(key)))
		.filter((item) => item.toLowerCase() !== value.toLowerCase());

	for (const key of keyList) params.delete(key);

	if (values.length) {
		params.set(primaryKey, joinFilterValues(values));
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const hiddenInputs = (filters: InventoryFilters, sortParam: string) =>
	[
		filters.brand ? { name: 'brand', value: filters.brand } : undefined,
		filters.bodyType ? { name: 'bodyType', value: filters.bodyType } : undefined,
		filters.feature ? { name: 'feature', value: filters.feature } : undefined,
		filters.fuel ? { name: 'fuel', value: filters.fuel } : undefined,
		filters.maxMileage ? { name: 'maxMileage', value: String(filters.maxMileage) } : undefined,
		filters.maxPrice ? { name: 'maxPrice', value: String(filters.maxPrice) } : undefined,
		filters.maxYear ? { name: 'maxYear', value: String(filters.maxYear) } : undefined,
		filters.minMileage ? { name: 'minMileage', value: String(filters.minMileage) } : undefined,
		filters.minPrice ? { name: 'minPrice', value: String(filters.minPrice) } : undefined,
		filters.minYear ? { name: 'minYear', value: String(filters.minYear) } : undefined,
		filters.transmission ? { name: 'transmission', value: filters.transmission } : undefined,
		sortParam !== 'best-match' ? { name: 'sort', value: sortParam } : undefined
	].filter((input): input is { name: string; value: string } => Boolean(input));

export const inventoryMobileDataFromState = (
	state: InventoryState,
	locale: Locale = 'en'
): InventoryMobileData => {
	const text = labels(locale);
	const brandCounts = countBy(vehicles.map((vehicle) => vehicle.brand));
	const bodyCounts = countBy(vehicles.map((vehicle) => vehicle.bodyType));
	const fuelCounts = countBy(vehicles.map((vehicle) => vehicle.fuel));
	const transmissionCounts = countBy(vehicles.map((vehicle) => vehicle.transmission));
	const featureCounts = countBy(vehicles.flatMap((vehicle) => vehicle.features));
	const selectedBrands = splitFilterValues(state.filters.brand);
	const selectedBodies = splitFilterValues(state.filters.bodyType);
	const selectedFeatures = splitFilterValues(state.filters.feature);
	const selectedFuels = splitFilterValues(state.filters.fuel);
	const selectedQueries = splitFilterValues(state.filters.query);
	const selectedTransmissions = splitFilterValues(state.filters.transmission);
	const selectedMileageRange = activeRangeValue(state.filters.minMileage, state.filters.maxMileage);
	const selectedPriceRange = activeRangeValue(state.filters.minPrice, state.filters.maxPrice);
	const selectedYearRange = activeRangeValue(state.filters.minYear, state.filters.maxYear);
	const brandValueLabel =
		selectedBrands.length > 2
			? `${selectedBrands.length} ${locale === 'bg' ? 'марки' : 'makes'}`
			: selectedBrands.join(' + ') || text.all;
	const modelValueLabel =
		selectedQueries.length > 1
			? `${selectedQueries.length} ${locale === 'bg' ? 'модела' : 'models'}`
			: selectedQueries[0] || text.all;
	const multiValueLabel = (
		values: string[],
		options: Array<{ label: string; value: string }>,
		allLabel = text.all
	) => {
		const labels = values
			.map((value) => options.find((option) => option.value === value)?.label ?? value)
			.filter(Boolean);

		if (!labels.length) return allLabel;
		if (labels.length <= 2) return labels.join(' + ');

		return `${labels.length} ${locale === 'bg' ? 'избрани' : 'selected'}`;
	};
	const searchDisplayValue =
		selectedQueries.length > 1 ? modelValueLabel : (state.filters.query ?? '');
	const buildModelOptions = (brandFilter = '') => {
		const modelBrandValues = splitFilterValues(brandFilter);
		const selectedBrandMatches =
			modelBrandValues.length > 0
				? modelBrandValues.every((brand) => hasFilterValue(selectedBrands, brand))
				: selectedBrands.length === 0;
		const modelVehicles = modelBrandValues.length
			? vehicles.filter((vehicle) => hasFilterValue(modelBrandValues, vehicle.brand))
			: vehicles;
		const modelCounts = countBy(modelVehicles.map((vehicle) => vehicle.model).filter(Boolean));

		return Array.from(modelCounts.entries())
			.map(([model, count]) => ({
				active: selectedBrandMatches && hasFilterValue(selectedQueries, model),
				countLabel: String(count),
				href: inventoryUrl(state, {
					brand: brandFilter || null,
					q: selectedBrandMatches ? toggleFilterValue(state.filters.query, model) : model
				}),
				label: model,
				value: model
			}))
			.sort((left, right) => {
				const countDelta = Number(right.countLabel) - Number(left.countLabel);

				return countDelta || left.label.localeCompare(right.label);
			});
	};
	const totalPill = {
		active:
			!selectedBrands.length &&
			!selectedBodies.length &&
			!selectedFuels.length &&
			!selectedQueries.length,
		href: quickUrl(state, { bodyType: null, brand: null, fuel: null }),
		kind: 'total' as const,
		label: text.allWithCount(state.selected.length)
	};
	const brandOptions: InventoryMobileOption[] = [
		{
			active: !selectedBrands.length,
			countLabel: String(vehicles.length),
			href: quickUrl(state, { brand: null }),
			label: text.allBrands,
			value: ''
		},
		...brands
			.map((brand) => ({
				active: hasFilterValue(selectedBrands, brand),
				count: brandCounts.get(brand) ?? 0,
				countLabel: String(brandCounts.get(brand) ?? 0),
				href: quickUrl(state, { brand }),
				image: brandLogos[brand],
				label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand,
				value: brand
			}))
			.filter((option) => option.count > 0)
			.sort((left, right) => right.count - left.count)
	];
	const brandPills = brands
		.map((brand) => ({
			active: hasFilterValue(selectedBrands, brand),
			count: brandCounts.get(brand) ?? 0,
			href: quickUrl(state, { brand }),
			image: brandLogos[brand],
			kind: 'brand' as const,
			label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand
		}))
		.filter((pill) => pill.count > 0)
		.sort((left, right) => right.count - left.count)
		.slice(0, 5);
	const bodyPills = bodyTypes
		.map((bodyType) => ({
			active: hasFilterValue(selectedBodies, bodyType),
			count: bodyCounts.get(bodyType) ?? 0,
			href: quickUrl(state, {
				bodyType
			}),
			kind: 'body' as const,
			label: translateVehicleTerm(locale, 'bodyTypes', bodyType)
		}))
		.filter((pill) => pill.count > 0 && pill.label !== 'Автомобил' && pill.label !== 'Car')
		.sort((left, right) => right.count - left.count)
		.slice(0, 4);
	const bodyOptions: InventoryMobileOption[] = [
		{
			active: !selectedBodies.length,
			countLabel: String(vehicles.length),
			href: quickUrl(state, { bodyType: null }),
			label: text.allBodyTypes,
			value: ''
		},
		...bodyTypes
			.map((bodyType) => ({
				active: hasFilterValue(selectedBodies, bodyType),
				count: bodyCounts.get(bodyType) ?? 0,
				countLabel: String(bodyCounts.get(bodyType) ?? 0),
				href: quickUrl(state, {
					bodyType
				}),
				label: translateVehicleTerm(locale, 'bodyTypes', bodyType),
				value: bodyType
			}))
			.filter(
				(option) => option.count > 0 && option.label !== 'Автомобил' && option.label !== 'Car'
			)
			.sort((left, right) => right.count - left.count)
	];
	const modelOptions = buildModelOptions(state.filters.brand ?? '');
	const modelOptionsByBrand = {
		'': buildModelOptions(''),
		...Object.fromEntries(brands.map((brand) => [brand, buildModelOptions(brand)]))
	};
	const fuelOptions = fuels
		.map((fuel) => ({
			active: hasFilterValue(selectedFuels, fuel),
			count: fuelCounts.get(fuel) ?? 0,
			countLabel: String(fuelCounts.get(fuel) ?? 0),
			href: quickUrl(state, {
				fuel
			}),
			label: translateVehicleTerm(locale, 'fuels', fuel),
			value: fuel
		}))
		.filter((option) => option.count > 0 && option.label !== '340 к.с.')
		.slice(0, 8);
	const transmissionOptions: InventoryMobileOption[] = [
		{
			active: !selectedTransmissions.length,
			countLabel: String(vehicles.length),
			href: inventoryUrl(state, { Transmission: null, gearbox: null, transmission: null }),
			label: text.allTransmissions,
			value: ''
		},
		...Array.from(transmissionCounts.entries())
			.map(([transmission, count]) => ({
				active: hasFilterValue(selectedTransmissions, transmission),
				count,
				countLabel: String(count),
				href: inventoryUrl(state, {
					Transmission: null,
					gearbox: null,
					transmission: toggleFilterValue(state.filters.transmission, transmission)
				}),
				label: translateVehicleTerm(locale, 'transmissions', transmission),
				value: transmission
			}))
			.filter((option) => option.count > 0)
			.sort((left, right) => right.count - left.count)
	];
	const priceRanges = [
		{
			label: `${locale === 'bg' ? 'До' : 'Up to'} ${formatPrice(30000)}`,
			value: rangeValue(undefined, 30000)
		},
		{ label: `${formatPrice(30000)} - ${formatPrice(50000)}`, value: rangeValue(30000, 50000) },
		{ label: `${formatPrice(50000)} - ${formatPrice(80000)}`, value: rangeValue(50000, 80000) },
		{
			label: `${locale === 'bg' ? 'Над' : 'Over'} ${formatPrice(80000)}`,
			value: rangeValue(80000, undefined)
		}
	];
	const priceOptions: InventoryMobileOption[] = [
		{
			active: !selectedPriceRange,
			countLabel: String(vehicles.length),
			href: inventoryUrl(state, {
				maxPrice: null,
				minPrice: null,
				price: null,
				priceFrom: null,
				priceTo: null
			}),
			label: text.allPrices,
			value: ''
		},
		...priceRanges.map((range) => {
			const { max, min } = parseRangeValue(range.value);

			return optionForRange({
				activeValue: selectedPriceRange,
				count: vehicles.filter((vehicle) => matchesRange(vehicle.price, range.value)).length,
				href: inventoryUrl(state, {
					maxPrice: max ? String(max) : null,
					minPrice: min ? String(min) : null,
					price: null,
					priceFrom: null,
					priceTo: null
				}),
				label: range.label,
				value: range.value
			});
		})
	];
	const mileageRanges = [
		{
			label: `${locale === 'bg' ? 'До' : 'Up to'} ${formatMileage(80000)}`,
			value: rangeValue(undefined, 80000)
		},
		{
			label: `${locale === 'bg' ? 'До' : 'Up to'} ${formatMileage(120000)}`,
			value: rangeValue(undefined, 120000)
		},
		{
			label: `${locale === 'bg' ? 'До' : 'Up to'} ${formatMileage(160000)}`,
			value: rangeValue(undefined, 160000)
		},
		{
			label: `${locale === 'bg' ? 'Над' : 'Over'} ${formatMileage(160000)}`,
			value: rangeValue(160000, undefined)
		}
	];
	const mileageOptions: InventoryMobileOption[] = [
		{
			active: !selectedMileageRange,
			countLabel: String(vehicles.length),
			href: inventoryUrl(state, {
				maxMileage: null,
				mileageFrom: null,
				mileageTo: null,
				minMileage: null
			}),
			label: text.allMileage,
			value: ''
		},
		...mileageRanges.map((range) => {
			const { max, min } = parseRangeValue(range.value);

			return optionForRange({
				activeValue: selectedMileageRange,
				count: vehicles.filter((vehicle) => matchesRange(vehicle.mileage, range.value)).length,
				href: inventoryUrl(state, {
					maxMileage: max ? String(max) : null,
					mileageFrom: null,
					mileageTo: null,
					minMileage: min ? String(min) : null
				}),
				label: range.label,
				value: range.value
			});
		})
	];
	const yearRanges = [
		{ label: `${locale === 'bg' ? 'От' : 'From'} 2023`, value: rangeValue(2023, undefined) },
		{ label: `${locale === 'bg' ? 'От' : 'From'} 2021`, value: rangeValue(2021, undefined) },
		{ label: `${locale === 'bg' ? 'От' : 'From'} 2019`, value: rangeValue(2019, undefined) }
	];
	const yearOptions: InventoryMobileOption[] = [
		{
			active: !selectedYearRange,
			countLabel: String(vehicles.length),
			href: inventoryUrl(state, { maxYear: null, minYear: null, yearFrom: null, yearTo: null }),
			label: text.allYears,
			value: ''
		},
		...yearRanges.map((range) => {
			const { max, min } = parseRangeValue(range.value);

			return optionForRange({
				activeValue: selectedYearRange,
				count: vehicles.filter((vehicle) => matchesRange(vehicle.year, range.value)).length,
				href: inventoryUrl(state, {
					maxYear: max ? String(max) : null,
					minYear: min ? String(min) : null,
					yearFrom: null,
					yearTo: null
				}),
				label: range.label,
				value: range.value
			});
		})
	];
	const featureOptions: InventoryMobileOption[] = [
		{
			active: !selectedFeatures.length,
			countLabel: String(vehicles.length),
			href: inventoryUrl(state, {
				equipment: null,
				extra: null,
				feature: null,
				features: null
			}),
			label: text.allExtras,
			value: ''
		},
		...featuredExtras
			.map((feature) => ({
				active: hasFilterValue(selectedFeatures, feature),
				count: featureCounts.get(feature) ?? 0,
				countLabel: String(featureCounts.get(feature) ?? 0),
				href: inventoryUrl(state, {
					equipment: null,
					extra: null,
					feature: toggleFilterValue(state.filters.feature, feature),
					features: null
				}),
				label: featureLabels[feature]?.[locale] ?? feature,
				value: feature
			}))
			.filter((option) => option.count > 0)
	];
	const activeFilters: InventoryMobilePill[] = [];

	for (const brand of selectedBrands) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, 'brand', brand),
			label: brand
		});
	}

	for (const bodyType of selectedBodies) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['body', 'bodyType', 'bodystyle'], bodyType),
			label: translateVehicleTerm(locale, 'bodyTypes', bodyType)
		});
	}

	for (const fuel of selectedFuels) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['fuel', 'FuelType'], fuel),
			label: translateVehicleTerm(locale, 'fuels', fuel)
		});
	}

	if (state.filters.maxMileage || state.filters.minMileage) {
		activeFilters.push({
			active: true,
			href: without(state, ['maxMileage', 'mileageFrom', 'mileageTo', 'minMileage']),
			label: mileageOptions.find((option) => option.active)?.label ?? text.mileage
		});
	}

	if (state.filters.maxPrice || state.filters.minPrice) {
		activeFilters.push({
			active: true,
			href: without(state, ['maxPrice', 'minPrice', 'price', 'priceFrom', 'priceTo']),
			label: priceOptions.find((option) => option.active)?.label ?? text.price
		});
	}

	if (state.filters.minYear || state.filters.maxYear) {
		activeFilters.push({
			active: true,
			href: without(state, ['maxYear', 'minYear', 'yearFrom', 'yearTo']),
			label: yearOptions.find((option) => option.active)?.label ?? text.year
		});
	}

	for (const transmission of selectedTransmissions) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['Transmission', 'gearbox', 'transmission'], transmission),
			label: translateVehicleTerm(locale, 'transmissions', transmission)
		});
	}

	for (const feature of selectedFeatures) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['equipment', 'extra', 'feature', 'features'], feature),
			label: featureOptions.find((option) => option.value === feature)?.label ?? feature
		});
	}

	if (state.filters.keyword) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['keyword'], state.filters.keyword),
			label: state.filters.keyword
		});
	}
	for (const query of selectedQueries) {
		activeFilters.push({
			active: true,
			href: withoutFilterValue(state, ['q', 'query', 'model'], query),
			label: query
		});
	}

	const sortOptions = Object.entries(text.sortOptions).map(([value, label]) => ({
		active: state.sortParam === value,
		href: inventoryUrl(state, { sort: value }),
		label,
		value
	}));

	return {
		activeFilters,
		applyLabel: text.apply,
		bodyLabel: text.body,
		bodyRailLabel: text.bodyShort,
		bodyOptions,
		brandOptions,
		brandLabel: text.brand,
		brandSearchPlaceholder: text.brandSearchPlaceholder,
		brandValue: brandValueLabel,
		clearHref: '/inventory',
		clearLabel: text.clear,
		closeLabel: text.close,
		countLabel: text.allWithCount(state.selected.length),
		doneLabel: text.done,
		showResultsLabel: text.showResults(state.selected.length),
		drawerTitle: text.drawerTitle,
		extrasLabel: text.extras,
		featureOptions,
		featureValue: multiValueLabel(selectedFeatures, featureOptions),
		filterLabel: text.filters,
		fuelLabel: text.fuel,
		fuelOptions,
		fuelValue: multiValueLabel(selectedFuels, fuelOptions),
		hiddenInputs: hiddenInputs(state.filters, state.sortParam),
		mileageLabel: text.mileage,
		mileageOptions,
		mileageValue: mileageOptions.find((option) => option.active && option.value)?.label ?? text.all,
		modelLabel: text.model,
		modelOptions,
		modelOptionsByBrand,
		modelSearchPlaceholder: text.modelSearchPlaceholder,
		modelValue: modelValueLabel,
		noMatchesLabel: text.noMatches,
		priceLabel: text.price,
		priceOptions,
		priceValue: priceOptions.find((option) => option.active && option.value)?.label ?? text.all,
		quickPills: [totalPill, ...brandPills, ...bodyPills],
		searchDrawerTitle: text.searchDrawerTitle,
		searchDisplayValue,
		searchLabel: text.search,
		searchPlaceholder: text.searchPlaceholder,
		searchValue: state.filters.query ?? '',
		sortLabel: text.sort,
		sortOptions,
		sortValue: sortOptions.find((option) => option.active)?.label ?? text.sortOptions['best-match'],
		totalPill,
		transmissionLabel: text.transmission,
		transmissionOptions,
		transmissionValue: multiValueLabel(selectedTransmissions, transmissionOptions),
		yearLabel: text.year,
		yearOptions,
		yearValue: yearOptions.find((option) => option.active && option.value)?.label ?? text.all
	};
};
