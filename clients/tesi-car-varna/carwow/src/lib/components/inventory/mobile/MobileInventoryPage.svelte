<script lang="ts">
	import './mobileInventory.css';
	import { page as appPage } from '$app/state';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		parseInventoryFilters,
		readMobileSort,
		serializeInventoryFilters
	} from '$lib/utils/inventory-url';
	import { vehicleMatches, mileageMatches } from '$lib/state/inventory-filters.svelte';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import CompareTray from '$lib/components/shared/CompareTray.svelte';
	import { enhanceDayNightImageFallbacks } from '$lib/utils/daynight-image-fallback';
	import { onMount, tick } from 'svelte';

	afterNavigate(() => {
		restoreAppliedFilters(new URL(window.location.href).searchParams);
		if (typeof appPage.state.inventoryScrollY === 'number') {
			window.scrollTo({ top: appPage.state.inventoryScrollY, behavior: 'instant' });
		}
	});
	import MobileFilterSheet from './MobileFilterSheet.svelte';
	import MobileInventoryQuickFilters from './MobileInventoryQuickFilters.svelte';
	import MobileInventoryResults from './MobileInventoryResults.svelte';
	import MobileInventoryTop from './MobileInventoryTop.svelte';
	import {
		brandLogos,
		mileageOptions,
		priceOptions,
		searchPriceSuggestions,
		sortChipLabels,
		sortOptions
	} from './mobile-inventory-filter-data';
	import {
		countOptions,
		formatVehicleCount,
		normalize,
		selectionSummary,
		sortVehicles,
		toggleValue,
		uniqueSorted
	} from '$lib/utils/inventory-filter-utils';
	import type { FilterSheetMode, Mode, SortKey } from '$lib/types/mobile-inventory';

	let {
		vehicles,
		mode = 'inventory'
	}: {
		vehicles: InventoryListVehicle[];
		mode?: Mode;
	} = $props();

	onMount(() => enhanceDayNightImageFallbacks());

	let query = $state(appPage.url.searchParams.get('q') ?? '');
	let selectedBrands = $state<string[]>(parseInventoryFilters(appPage.url.searchParams).brand);
	let selectedModels = $state<string[]>(parseInventoryFilters(appPage.url.searchParams).model);
	let selectedBodies = $state<string[]>(parseInventoryFilters(appPage.url.searchParams).body);
	let fuel = $state(appPage.url.searchParams.get('fuel') ?? '');
	let transmission = $state(appPage.url.searchParams.get('transmission') ?? '');
	let price = $state(appPage.url.searchParams.get('price') ?? '');
	let mileage = $state(appPage.url.searchParams.get('mileage') ?? '');
	let availability = $state(appPage.url.searchParams.get('availability') ?? '');
	let sort = $state<SortKey>(readMobileSort(appPage.url.searchParams.get('sort')));
	let feature = $state<string[]>(parseInventoryFilters(appPage.url.searchParams).feature ?? []);
	let condition = $state(parseInventoryFilters(appPage.url.searchParams).condition ?? '');
	let filtersOpen = $state(false);
	let filterSheetMode = $state<FilterSheetMode>('all');
	let selectorQuery = $state('');

	const brandOptions = $derived(countOptions(vehicles.map((vehicle) => vehicle.brand)));
	const modelOptions = $derived(
		countOptions(
			vehicles
				.filter((vehicle) => !selectedBrands.length || selectedBrands.includes(vehicle.brand))
				.map((vehicle) => vehicle.model)
		)
	);
	const bodyOptions = $derived(countOptions(vehicles.map((vehicle) => vehicle.body)));
	const fuelOptions = $derived(countOptions(vehicles.map((vehicle) => vehicle.fuel)));
	const searchBrandSuggestions = $derived.by(() =>
		[...brandOptions]
			.sort(
				(left, right) => right.count - left.count || left.value.localeCompare(right.value, 'bg')
			)
			.slice(0, 8)
	);
	const searchFuelSuggestions = $derived.by(() =>
		[...fuelOptions]
			.sort(
				(left, right) => right.count - left.count || left.value.localeCompare(right.value, 'bg')
			)
			.slice(0, 5)
	);
	const filteredBrandOptions = $derived.by(() => {
		const needle = normalize(selectorQuery);
		const options = needle
			? brandOptions.filter((option) => normalize(option.value).includes(needle))
			: brandOptions;

		return prioritizeSelected(options, selectedBrands);
	});
	const filteredModelOptions = $derived.by(() => {
		const needle = normalize(selectorQuery);
		const options = needle
			? modelOptions.filter((option) => normalize(option.value).includes(needle))
			: modelOptions;

		return prioritizeSelected(options, selectedModels);
	});
	const transmissions = $derived(uniqueSorted(vehicles.map((vehicle) => vehicle.transmission)));

	const sortChipLabel = $derived(sortChipLabels[sort]);
	const priceLabel = $derived(priceOptions.find((option) => option.value === price)?.label ?? '');
	const mileageLabel = $derived(
		mileageOptions.find((option) => option.value === mileage)?.label ?? ''
	);
	const brandSummary = $derived(selectionSummary(selectedBrands.map(brandShortName), 'марки'));
	const modelSummary = $derived(selectionSummary(selectedModels, 'модела'));
	const bodySummary = $derived(selectionSummary(selectedBodies, 'каросерии'));
	const fuelSummary = $derived(fuel);
	const sortOverviewLabel = $derived(
		sort === 'price-asc' ? '' : (sortOptions.find((option) => option.value === sort)?.label ?? '')
	);
	const filterSheetEyebrow = $derived.by(() => {
		if (filterSheetMode === 'search') return 'Търсене';
		if (filterSheetMode === 'brand') return 'Марка';
		if (filterSheetMode === 'model') return 'Модел';
		if (filterSheetMode === 'sort') return 'Подредба';
		if (filterSheetMode === 'fuel') return 'Гориво';
		if (filterSheetMode === 'mileage') return 'Пробег';
		if (filterSheetMode === 'body') return 'Каросерия';
		if (filterSheetMode === 'price') return 'Цена';
		if (filterSheetMode === 'transmission') return 'Скорости';
		return 'Филтри';
	});
	const filterSheetClearLabel = $derived.by(() => {
		if (filterSheetMode === 'search') return 'Изчисти търсене';
		if (filterSheetMode === 'brand') return 'Изчисти марка';
		if (filterSheetMode === 'model') return 'Изчисти модел';
		if (filterSheetMode === 'sort') return 'Стандартна';
		if (filterSheetMode === 'fuel') return 'Изчисти гориво';
		if (filterSheetMode === 'mileage') return 'Изчисти пробег';
		if (filterSheetMode === 'body') return 'Изчисти каросерия';
		if (filterSheetMode === 'price') return 'Изчисти цена';
		if (filterSheetMode === 'transmission') return 'Изчисти скорости';
		return 'Изчисти';
	});
	const hasActiveFilters = $derived(
		Boolean(
			query ||
			selectedBrands.length ||
			selectedModels.length ||
			selectedBodies.length ||
			fuel ||
			transmission ||
			price ||
			mileage ||
			availability ||
			feature.length ||
			condition ||
			sort !== 'price-asc'
		)
	);
	const hasAdvancedFilters = $derived(
		Boolean(
			selectedBodies.length || fuel || mileage || transmission || price || sort !== 'price-asc'
		)
	);
	const criteria = $derived({
		query,
		brand: selectedBrands,
		model: selectedModels,
		body: selectedBodies,
		fuel,
		transmission,
		price,
		mileage,
		availability,
		feature,
		condition
	});
	const filteredVehicles = $derived(
		vehicles.filter((vehicle) => vehicleMatches(vehicle, criteria))
	);
	const resultCountLabel = $derived(formatVehicleCount(filteredVehicles.length));
	const filterSheetActionLabel = $derived(
		filterSheetMode === 'all' || filterSheetMode === 'search'
			? `Покажи ${filteredVehicles.length}`
			: 'Към филтри'
	);
	const sortedVehicles = $derived(sortVehicles(filteredVehicles, sort));

	function restoreAppliedFilters(params: URLSearchParams) {
		const parsed = parseInventoryFilters(params);
		query = parsed.query;
		selectedBrands = parsed.brand;
		selectedModels = parsed.model;
		selectedBodies = parsed.body;
		fuel = parsed.fuel;
		transmission = parsed.transmission;
		price = parsed.price;
		mileage = parsed.mileage;
		availability = parsed.availability ?? '';
		feature = parsed.feature ?? [];
		condition = parsed.condition ?? '';
		sort = readMobileSort(params.get('sort'));
	}
	function syncUrl() {
		const params = serializeInventoryFilters(criteria, sort, new URL(window.location.href).searchParams);
		replaceState(
			resolve(
				`${mode === 'map' ? '/inventory/map' : '/inventory'}${params.size ? `?${params}` : ''}`
			),
			appPage.state
		);
	}
	function cancelFilterSheet() {
		filtersOpen = false;
		restoreAppliedFilters(new URL(window.location.href).searchParams);
	}

	function prioritizeSelected(
		options: { value: string; count: number }[],
		selectedValues: string[]
	) {
		const selected = new Set(selectedValues);
		return [...options].sort((left, right) => {
			const leftSelected = selected.has(left.value);
			const rightSelected = selected.has(right.value);
			if (leftSelected !== rightSelected) return leftSelected ? -1 : 1;
			return left.value.localeCompare(right.value, 'bg');
		});
	}

	function brandLogoPath(value: string) {
		return brandLogos[value];
	}

	function brandInitials(value: string) {
		return value
			.split(/[\s-]+/)
			.filter(Boolean)
			.map((word) => word[0])
			.join('')
			.slice(0, 2)
			.toLocaleUpperCase('bg-BG');
	}

	const brandShortNames: Record<string, string> = {
		'Mercedes-Benz': 'Mercedes'
	};

	function brandShortName(value: string) {
		return brandShortNames[value] ?? value;
	}

	function pruneModelsForBrands(brandsToKeep: string[]) {
		if (!brandsToKeep.length || !selectedModels.length) return;

		const validModels = new Set(
			vehicles
				.filter((vehicle) => brandsToKeep.includes(vehicle.brand))
				.map((vehicle) => vehicle.model)
		);
		selectedModels = selectedModels.filter((item) => validModels.has(item));
	}

	function toggleBrand(nextBrand: string) {
		selectedBrands = toggleValue(selectedBrands, nextBrand);
		pruneModelsForBrands(selectedBrands);
	}

	function toggleModel(nextModel: string) {
		selectedModels = toggleValue(selectedModels, nextModel);
	}

	function toggleBody(nextBody: string) {
		selectedBodies = toggleValue(selectedBodies, nextBody);
	}

	function clearBrands() {
		selectedBrands = [];
	}

	function clearModels() {
		selectedModels = [];
	}

	function clearBodies() {
		selectedBodies = [];
	}

	function clearFuel() {
		fuel = '';
	}

	function clearMileage() {
		mileage = '';
	}

	function clearPrice() {
		price = '';
		if (!filtersOpen) syncUrl();
	}

	function clearTransmission() {
		transmission = '';
	}

	function modelOptionCount(value: string) {
		const source = selectedBrands.length
			? vehicles.filter((vehicle) => selectedBrands.includes(vehicle.brand))
			: vehicles;
		if (!value) return source.length;
		return source.filter((vehicle) => vehicle.model === value).length;
	}

	function modelOptionLabel(value: string) {
		if (selectedBrands.length || !value) return value;

		const matchingBrands = uniqueSorted(
			vehicles.filter((vehicle) => vehicle.model === value).map((vehicle) => vehicle.brand)
		);
		if (matchingBrands.length === 1) return `${matchingBrands[0]} ${value}`;
		return value;
	}

	function activeOptionClass(active: boolean) {
		return active ? 'is-active is-multi' : 'is-multi';
	}

	function showAllModelsCount() {
		return modelOptionCount('');
	}

	function showAllBrandsCount() {
		return vehicles.length;
	}

	function mileageOptionCount(filter: string) {
		return vehicles.filter((vehicle) => mileageMatches(vehicle.mileageValue, filter)).length;
	}

	function priceOptionCount(filter: string) {
		return vehicles.filter((vehicle) => vehicleMatches(vehicle, { ...criteria, price: filter }))
			.length;
	}

	function transmissionOptionCount(value: string) {
		return vehicles.filter((vehicle) => vehicle.transmission === value).length;
	}

	function clearFilters() {
		query = '';
		selectedBrands = [];
		selectedModels = [];
		selectedBodies = [];
		fuel = '';
		transmission = '';
		price = '';
		mileage = '';
		availability = '';
		feature = [];
		condition = '';
		sort = 'price-asc';
		if (!filtersOpen) syncUrl();
	}

	function focusFilterSheet() {
		document
			.querySelector<HTMLElement>(
				'.mobile-fullsheet .mobile-filter-sheet [data-mobile-drawer-initial-focus]'
			)
			?.focus({ preventScroll: true });
	}

	async function openFilterSheet(mode: FilterSheetMode) {
		filterSheetMode = mode;
		selectorQuery = '';
		filtersOpen = true;
		await tick();
		focusFilterSheet();
		window.setTimeout(focusFilterSheet, 120);
	}

	async function returnToFilterOverview() {
		filterSheetMode = 'all';
		selectorQuery = '';
		await tick();
		focusFilterSheet();
		window.setTimeout(focusFilterSheet, 120);
	}

	async function completeFilterSheet() {
		if (filterSheetMode === 'all' || filterSheetMode === 'search') {
			syncUrl();
			filtersOpen = false;
			return;
		}

		await returnToFilterOverview();
	}

	async function clearBrandsAndReturn() {
		clearBrands();
		await returnToFilterOverview();
	}

	async function clearModelsAndReturn() {
		clearModels();
		await returnToFilterOverview();
	}

	async function clearBodiesAndReturn() {
		clearBodies();
		await returnToFilterOverview();
	}

	async function clearFuelAndReturn() {
		clearFuel();
		await returnToFilterOverview();
	}

	async function clearMileageAndReturn() {
		clearMileage();
		await returnToFilterOverview();
	}

	async function clearPriceAndReturn() {
		clearPrice();
		await returnToFilterOverview();
	}

	async function clearTransmissionAndReturn() {
		clearTransmission();
		await returnToFilterOverview();
	}

	async function selectBrandAndReturn(value: string) {
		toggleBrand(value);
		await returnToFilterOverview();
	}

	async function selectModelAndReturn(value: string) {
		toggleModel(value);
		await returnToFilterOverview();
	}

	async function selectBodyAndReturn(value: string) {
		toggleBody(value);
		await returnToFilterOverview();
	}

	async function selectFuelAndReturn(value: string) {
		fuel = value;
		await returnToFilterOverview();
	}

	async function selectMileageAndReturn(value: string) {
		mileage = value;
		await returnToFilterOverview();
	}

	async function selectPriceAndReturn(value: string) {
		price = value;
		await returnToFilterOverview();
	}

	async function selectTransmissionAndReturn(value: string) {
		transmission = value;
		await returnToFilterOverview();
	}

	async function selectSortAndReturn(value: SortKey) {
		sort = value;
		await returnToFilterOverview();
	}

	function clearCurrentSheet() {
		if (filterSheetMode === 'search') {
			query = '';
			return;
		}

		if (filterSheetMode === 'brand') {
			clearBrands();
			return;
		}

		if (filterSheetMode === 'model') {
			clearModels();
			return;
		}

		if (filterSheetMode === 'sort') {
			sort = 'price-asc';
			return;
		}

		if (filterSheetMode === 'fuel') {
			clearFuel();
			return;
		}

		if (filterSheetMode === 'mileage') {
			clearMileage();
			return;
		}

		if (filterSheetMode === 'body') {
			clearBodies();
			return;
		}

		if (filterSheetMode === 'price') {
			clearPrice();
			return;
		}

		if (filterSheetMode === 'transmission') {
			clearTransmission();
			return;
		}

		clearFilters();
	}
</script>

<div class="mobile-inventory" aria-label="Мобилна страница автомобили">
	<main id="main-content" tabindex="-1">
		<h1 class="sr-only">Автомобили на склад — Ден и Нощ Ауто Груп</h1>
		<MobileInventoryTop {mode} {query} onOpenSearch={() => openFilterSheet('search')} />

		<section class="mobile-inventory-results" aria-live="polite">
			<MobileInventoryQuickFilters
				vehiclesCount={vehicles.length}
				resultCount={filteredVehicles.length}
				{hasAdvancedFilters}
				{sort}
				{sortChipLabel}
				{selectedBrands}
				{brandSummary}
				{selectedModels}
				{modelSummary}
				{fuel}
				{mileage}
				{mileageLabel}
				{selectedBodies}
				{bodySummary}
				{hasActiveFilters}
				{priceLabel}
				{brandLogoPath}
				openFilterSheet={(nextMode) => openFilterSheet(nextMode)}
				{clearFilters}
				{clearPrice}
			/>
			<p class="sr-only" role="status">{resultCountLabel}</p>
			<MobileInventoryResults vehicles={sortedVehicles} onClearFilters={clearFilters} />
		</section>
	</main>

	<MobileBottomDock />
	<CompareTray />

	<MobileFullSheet
		bind:open={filtersOpen}
		labelledBy="mobile-filter-title"
		onClose={cancelFilterSheet}
	>
		<MobileFilterSheet
			{filterSheetMode}
			{filterSheetEyebrow}
			{resultCountLabel}
			{filterSheetClearLabel}
			{filterSheetActionLabel}
			{query}
			{selectorQuery}
			{brandSummary}
			{modelSummary}
			{fuelSummary}
			{mileageLabel}
			{bodySummary}
			{sortOverviewLabel}
			{priceLabel}
			{transmission}
			{selectedBrands}
			{selectedModels}
			{selectedBodies}
			{fuel}
			{mileage}
			{price}
			{sort}
			{searchBrandSuggestions}
			{searchPriceSuggestions}
			{searchFuelSuggestions}
			{filteredBrandOptions}
			{filteredModelOptions}
			{fuelOptions}
			{mileageOptions}
			{bodyOptions}
			{priceOptions}
			{transmissions}
			{sortOptions}
			vehiclesCount={vehicles.length}
			{brandLogoPath}
			{brandInitials}
			{activeOptionClass}
			{modelOptionLabel}
			{showAllBrandsCount}
			{showAllModelsCount}
			{mileageOptionCount}
			{priceOptionCount}
			{transmissionOptionCount}
			onClose={cancelFilterSheet}
			openFilterSheet={(nextMode) => openFilterSheet(nextMode)}
			{clearCurrentSheet}
			{completeFilterSheet}
			onQueryChange={(value) => (query = value)}
			onSelectorQueryChange={(value) => (selectorQuery = value)}
			{toggleBrand}
			setFuel={(value) => (fuel = value)}
			setPrice={(value) => (price = value)}
			{clearBrandsAndReturn}
			{clearModelsAndReturn}
			{clearFuelAndReturn}
			{clearMileageAndReturn}
			{clearBodiesAndReturn}
			{clearPriceAndReturn}
			{clearTransmissionAndReturn}
			{selectBrandAndReturn}
			{selectModelAndReturn}
			{selectFuelAndReturn}
			{selectMileageAndReturn}
			{selectBodyAndReturn}
			{selectPriceAndReturn}
			{selectTransmissionAndReturn}
			{selectSortAndReturn}
		/>
	</MobileFullSheet>
</div>
