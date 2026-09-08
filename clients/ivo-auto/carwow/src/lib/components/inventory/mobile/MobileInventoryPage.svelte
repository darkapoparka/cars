<script lang="ts">
	import './mobileInventory.css';
	import { page as appPage } from '$app/state';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import { getDayNightVehicleAvailability } from '$lib/data/daynight-vehicles';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import CompareTray from '$lib/components/shared/CompareTray.svelte';
	import { enhanceDayNightImageFallbacks } from '$lib/utils/daynight-image-fallback';
	import { onMount, tick } from 'svelte';
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
		splitParam,
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
	let selectedBrands = $state<string[]>(initialSearchValues('brand'));
	let selectedModels = $state<string[]>(initialSearchValues('model'));
	let selectedBodies = $state<string[]>(initialSearchValues('body'));
	let fuel = $state(appPage.url.searchParams.get('fuel') ?? '');
	let transmission = $state(appPage.url.searchParams.get('transmission') ?? '');
	let price = $state(appPage.url.searchParams.get('price') ?? '');
	let mileage = $state(appPage.url.searchParams.get('mileage') ?? '');
	let availability = $state(appPage.url.searchParams.get('availability') ?? '');
	let sort = $state<SortKey>('price-asc');
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
			sort !== 'price-asc'
		)
	);
	const hasAdvancedFilters = $derived(
		Boolean(
			selectedBodies.length || fuel || mileage || transmission || price || sort !== 'price-asc'
		)
	);
	const filteredVehicles = $derived.by(() => {
		const needle = normalize(query);

		return vehicles.filter((vehicle) => {
			const haystack = normalize(
				[
					vehicle.title,
					vehicle.shortTitle,
					vehicle.brand,
					vehicle.model,
					vehicle.body,
					vehicle.fuel,
					vehicle.transmission,
					vehicle.year,
					vehicle.mileage,
					vehicle.color,
					vehicle.features.join(' '),
					vehicle.highlights.join(' ')
				].join(' ')
			);

			if (needle && !needle.split(/\s+/).every((term) => haystack.includes(term))) return false;
			if (selectedBrands.length && !selectedBrands.includes(vehicle.brand)) return false;
			if (selectedModels.length && !selectedModels.includes(vehicle.model)) return false;
			if (selectedBodies.length && !selectedBodies.includes(vehicle.body)) return false;
			if (fuel && vehicle.fuel !== fuel) return false;
			if (transmission && vehicle.transmission !== transmission) return false;
			if (!priceMatches(vehicle.price, price)) return false;
			if (!mileageMatches(vehicle.mileageValue, mileage)) return false;
			if (availability && getDayNightVehicleAvailability(vehicle) !== availability) return false;

			return true;
		});
	});
	const resultCountLabel = $derived(formatVehicleCount(filteredVehicles.length));
	const filterSheetActionLabel = $derived(
		filterSheetMode === 'all' || filterSheetMode === 'search'
			? `Покажи ${filteredVehicles.length}`
			: 'Към филтри'
	);
	const sortedVehicles = $derived(sortVehicles(filteredVehicles, sort));

	function initialSearchValues(name: 'brand' | 'model' | 'body') {
		const pluralName = name === 'body' ? 'bodies' : `${name}s`;
		return uniqueSorted([
			...appPage.url.searchParams.getAll(name),
			...splitParam(appPage.url.searchParams.get(pluralName))
		]);
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

	function priceMatches(value: number, filter: string) {
		if (!filter) return true;
		const option = priceOptions.find((item) => item.value === filter);
		if (!option) return true;
		if ('limit' in option && typeof option.limit === 'number')
			return value > 0 && value <= option.limit;
		if ('min' in option && typeof option.min === 'number') return value > option.min;
		return true;
	}

	function mileageMatches(value: number, filter: string) {
		if (!filter) return true;
		const option = mileageOptions.find((item) => item.value === filter);
		if (!option) return true;
		return value > 0 && value <= option.limit;
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
		return vehicles.filter((vehicle) => priceMatches(vehicle.price, filter)).length;
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
		sort = 'price-asc';
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
		<h1 class="sr-only">Автомобили на склад — Иво Ауто</h1>
		<MobileInventoryTop {mode} {query} onOpenSearch={() => openFilterSheet('search')} />

		<section class="mobile-inventory-results" aria-live="polite">
			<MobileInventoryQuickFilters
				vehiclesCount={vehicles.length}
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
			<MobileInventoryResults vehicles={sortedVehicles} onClearFilters={clearFilters} />
		</section>
	</main>

	<MobileBottomDock />
	<CompareTray />

	<MobileFullSheet bind:open={filtersOpen} labelledBy="mobile-filter-title">
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
			onClose={() => (filtersOpen = false)}
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
