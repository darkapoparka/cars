<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { Car, Fuel, Search, X } from '@lucide/svelte';
	import MobileFilterOptions from './MobileFilterOptions.svelte';
	import type { CountOption, FilterSheetMode, SortKey } from '$lib/types/mobile-inventory';

	type BrandLogoPath = `/assets/images/brand/${string}`;
	type LabelOption = { value: string; label: string };
	type SortOption = { value: SortKey; label: string };

	let {
		filterSheetMode,
		filterSheetEyebrow,
		resultCountLabel,
		filterSheetClearLabel,
		filterSheetActionLabel,
		query,
		selectorQuery,
		brandSummary,
		modelSummary,
		fuelSummary,
		mileageLabel,
		bodySummary,
		sortOverviewLabel,
		priceLabel,
		transmission,
		selectedBrands,
		selectedModels,
		selectedBodies,
		fuel,
		mileage,
		price,
		sort,
		searchBrandSuggestions,
		searchPriceSuggestions,
		searchFuelSuggestions,
		filteredBrandOptions,
		filteredModelOptions,
		fuelOptions,
		mileageOptions,
		bodyOptions,
		priceOptions,
		transmissions,
		sortOptions,
		vehiclesCount,
		brandLogoPath,
		brandInitials,
		activeOptionClass,
		modelOptionLabel,
		showAllBrandsCount,
		showAllModelsCount,
		mileageOptionCount,
		priceOptionCount,
		transmissionOptionCount,
		onClose,
		openFilterSheet,
		clearCurrentSheet,
		completeFilterSheet,
		onQueryChange,
		onSelectorQueryChange,
		toggleBrand,
		setFuel,
		setPrice,
		clearBrandsAndReturn,
		clearModelsAndReturn,
		clearFuelAndReturn,
		clearMileageAndReturn,
		clearBodiesAndReturn,
		clearPriceAndReturn,
		clearTransmissionAndReturn,
		selectBrandAndReturn,
		selectModelAndReturn,
		selectFuelAndReturn,
		selectMileageAndReturn,
		selectBodyAndReturn,
		selectPriceAndReturn,
		selectTransmissionAndReturn,
		selectSortAndReturn
	}: {
		filterSheetMode: FilterSheetMode;
		filterSheetEyebrow: string;
		resultCountLabel: string;
		filterSheetClearLabel: string;
		filterSheetActionLabel: string;
		query: string;
		selectorQuery: string;
		brandSummary: string;
		modelSummary: string;
		fuelSummary: string;
		mileageLabel: string;
		bodySummary: string;
		sortOverviewLabel: string;
		priceLabel: string;
		transmission: string;
		selectedBrands: string[];
		selectedModels: string[];
		selectedBodies: string[];
		fuel: string;
		mileage: string;
		price: string;
		sort: SortKey;
		searchBrandSuggestions: CountOption[];
		searchPriceSuggestions: LabelOption[];
		searchFuelSuggestions: CountOption[];
		filteredBrandOptions: CountOption[];
		filteredModelOptions: CountOption[];
		fuelOptions: CountOption[];
		mileageOptions: LabelOption[];
		bodyOptions: CountOption[];
		priceOptions: LabelOption[];
		transmissions: string[];
		sortOptions: SortOption[];
		vehiclesCount: number;
		brandLogoPath: (value: string) => BrandLogoPath | undefined;
		brandInitials: (value: string) => string;
		activeOptionClass: (active: boolean) => string;
		modelOptionLabel: (value: string) => string;
		showAllBrandsCount: () => number;
		showAllModelsCount: () => number;
		mileageOptionCount: (filter: string) => number;
		priceOptionCount: (filter: string) => number;
		transmissionOptionCount: (value: string) => number;
		onClose: () => void;
		openFilterSheet: (mode: FilterSheetMode) => void | Promise<void>;
		clearCurrentSheet: () => void;
		completeFilterSheet: () => void | Promise<void>;
		onQueryChange: (value: string) => void;
		onSelectorQueryChange: (value: string) => void;
		toggleBrand: (value: string) => void;
		setFuel: (value: string) => void;
		setPrice: (value: string) => void;
		clearBrandsAndReturn: () => void | Promise<void>;
		clearModelsAndReturn: () => void | Promise<void>;
		clearFuelAndReturn: () => void | Promise<void>;
		clearMileageAndReturn: () => void | Promise<void>;
		clearBodiesAndReturn: () => void | Promise<void>;
		clearPriceAndReturn: () => void | Promise<void>;
		clearTransmissionAndReturn: () => void | Promise<void>;
		selectBrandAndReturn: (value: string) => void | Promise<void>;
		selectModelAndReturn: (value: string) => void | Promise<void>;
		selectFuelAndReturn: (value: string) => void | Promise<void>;
		selectMileageAndReturn: (value: string) => void | Promise<void>;
		selectBodyAndReturn: (value: string) => void | Promise<void>;
		selectPriceAndReturn: (value: string) => void | Promise<void>;
		selectTransmissionAndReturn: (value: string) => void | Promise<void>;
		selectSortAndReturn: (value: SortKey) => void | Promise<void>;
	} = $props();

	function inputValue(event: Event) {
		return (event.currentTarget as HTMLInputElement).value;
	}
</script>

{#snippet brandMark(value: string, size = 18)}
	{@const logo = brandLogoPath(value)}
	{#if logo}
		<img
			class="mobile-inventory-brand-logo"
			src={i18n.asset(resolve(logo))}
			alt=""
			width={size}
			height={size}
			aria-hidden="true"
		/>
	{:else}
		<Car {size} strokeWidth={2.2} />
	{/if}
{/snippet}

<div class="mobile-filter-sheet" data-mode={filterSheetMode}>
	<header>
		<div>
			<span>{i18n.text(filterSheetEyebrow)} {i18n.t('copy.ca6f0cbf0592')}</span>
			<strong id="mobile-filter-title">{resultCountLabel}</strong>
		</div>
		<button
			type="button"
			aria-label={i18n.t('copy.1ef1a425356f')}
			data-mobile-drawer-initial-focus
			onclick={onClose}
		>
			<X size={19} strokeWidth={2.5} />
		</button>
	</header>

	<div
		class={filterSheetMode === 'all'
			? 'mobile-filter-sheet__fields'
			: 'mobile-filter-sheet__fields is-single'}
	>
		{#if filterSheetMode === 'all'}
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('brand')}
			>
				{#if brandSummary}
					<span>{i18n.t('copy.b7fccee005ae')}</span>
					<strong>{brandSummary}</strong>
				{:else}
					<strong>{i18n.t('copy.b7fccee005ae')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('model')}
			>
				{#if modelSummary}
					<span>{i18n.t('copy.37858c8efede')}</span>
					<strong>{modelSummary}</strong>
				{:else}
					<strong>{i18n.t('copy.37858c8efede')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('fuel')}
			>
				{#if fuelSummary}
					<span>{i18n.t('copy.b52d6c364219')}</span>
					<strong>{i18n.spec(fuelSummary)}</strong>
				{:else}
					<strong>{i18n.t('copy.b52d6c364219')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('mileage')}
			>
				{#if mileageLabel}
					<span>{i18n.t('copy.69cc064f0636')}</span>
					<strong>{i18n.spec(mileageLabel)}</strong>
				{:else}
					<strong>{i18n.t('copy.69cc064f0636')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('body')}
			>
				{#if bodySummary}
					<span>{i18n.t('copy.45e7e8a38730')}</span>
					<strong>{bodySummary}</strong>
				{:else}
					<strong>{i18n.t('copy.45e7e8a38730')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('sort')}
			>
				{#if sortOverviewLabel}
					<span>{i18n.t('copy.365e7bf87b30')}</span>
					<strong>{i18n.text(sortOverviewLabel)}</strong>
				{:else}
					<strong>{i18n.t('copy.365e7bf87b30')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('price')}
			>
				{#if priceLabel}
					<span>{i18n.t('copy.be0e705ced81')}</span>
					<strong>{i18n.spec(priceLabel)}</strong>
				{:else}
					<strong>{i18n.t('copy.be0e705ced81')}</strong>
				{/if}
			</button>
			<button
				class="mobile-filter-sheet__summary-field"
				type="button"
				onclick={() => openFilterSheet('transmission')}
			>
				{#if transmission}
					<span>{i18n.t('copy.4172507e5ff2')}</span>
					<strong>{i18n.spec(transmission)}</strong>
				{:else}
					<strong>{i18n.t('copy.4172507e5ff2')}</strong>
				{/if}
			</button>
		{:else if filterSheetMode === 'search'}
			<div class="mobile-filter-search mobile-filter-search--query">
				<Search size={18} strokeWidth={2.35} aria-hidden="true" />
				<input
					{@attach i18n.validation}
					id="mobile-inventory-query"
					type="search"
					value={query}
					aria-label={i18n.t('copy.bfc95eff30e5')}
					autocomplete="off"
					placeholder={i18n.t('copy.248027f805a8')}
					oninput={(event) => onQueryChange(inputValue(event))}
				/>
				{#if query}
					<button
						type="button"
						aria-label={i18n.t('copy.b0e15a8398c0')}
						onclick={() => onQueryChange('')}
					>
						<X size={17} strokeWidth={2.4} />
					</button>
				{/if}
			</div>
			<div class="mobile-search-options" aria-label={i18n.t('copy.1e49801e3aca')}>
				<section class="mobile-search-options__group" aria-labelledby="mobile-search-brands">
					<div class="mobile-search-options__heading">
						<span id="mobile-search-brands">{i18n.t('copy.914c5f5c34b5')}</span>
						{#if selectedBrands.length}
							<small>{brandSummary}</small>
						{/if}
					</div>
					<div class="mobile-search-options__chips">
						{#each searchBrandSuggestions as option (option.value)}
							{@const isSelected = selectedBrands.includes(option.value)}
							<button
								type="button"
								class={isSelected ? 'is-active' : ''}
								aria-pressed={isSelected}
								onclick={() => toggleBrand(option.value)}
							>
								{@render brandMark(option.value, 17)}
								<span>{i18n.spec(option.value)}</span>
								<small>{option.count}</small>
							</button>
						{/each}
					</div>
				</section>

				<section class="mobile-search-options__group" aria-labelledby="mobile-search-price">
					<div class="mobile-search-options__heading">
						<span id="mobile-search-price">{i18n.t('copy.84e960d40ad5')}</span>
						{#if priceLabel}
							<small>{i18n.spec(priceLabel)}</small>
						{/if}
					</div>
					<div class="mobile-search-options__chips">
						{#each searchPriceSuggestions as option (option.value)}
							{@const isSelected = price === option.value}
							<button
								type="button"
								class={isSelected ? 'is-active' : ''}
								aria-pressed={isSelected}
								onclick={() => setPrice(isSelected ? '' : option.value)}
							>
								<span>{i18n.spec(option.label)}</span>
								<small>{priceOptionCount(option.value)}</small>
							</button>
						{/each}
					</div>
				</section>

				<section class="mobile-search-options__group" aria-labelledby="mobile-search-fuel">
					<div class="mobile-search-options__heading">
						<span id="mobile-search-fuel">{i18n.t('copy.b52d6c364219')}</span>
						{#if fuel}
							<small>{i18n.spec(fuel)}</small>
						{/if}
					</div>
					<div class="mobile-search-options__chips">
						{#each searchFuelSuggestions as option (option.value)}
							{@const isSelected = fuel === option.value}
							<button
								type="button"
								class={isSelected ? 'is-active' : ''}
								aria-pressed={isSelected}
								onclick={() => setFuel(isSelected ? '' : option.value)}
							>
								<Fuel size={16} strokeWidth={2.2} aria-hidden="true" />
								<span>{i18n.spec(option.value)}</span>
								<small>{option.count}</small>
							</button>
						{/each}
					</div>
				</section>
			</div>
		{:else if filterSheetMode === 'brand'}
			<div class="mobile-filter-search">
				<Search size={18} strokeWidth={2.35} aria-hidden="true" />
				<input
					{@attach i18n.validation}
					type="search"
					value={selectorQuery}
					placeholder={i18n.t('copy.549f3ada8761')}
					autocomplete="off"
					aria-label={i18n.t('copy.549f3ada8761')}
					oninput={(event) => onSelectorQueryChange(inputValue(event))}
				/>
				{#if selectorQuery}
					<button
						type="button"
						aria-label={i18n.t('copy.b0e15a8398c0')}
						onclick={() => onSelectorQueryChange('')}
					>
						<X size={16} strokeWidth={2.5} />
					</button>
				{/if}
			</div>
			<div class="mobile-filter-options" aria-label={i18n.t('copy.83755da980c3')}>
				<button
					type="button"
					class={!selectedBrands.length ? 'is-active' : ''}
					onclick={clearBrandsAndReturn}
				>
					<span>{i18n.t('copy.0adfd4e68815')}</span>
					<small>{showAllBrandsCount()}</small>
				</button>
				{#each filteredBrandOptions as option (option.value)}
					{@const isSelected = selectedBrands.includes(option.value)}
					{@const logo = brandLogoPath(option.value)}
					<button
						type="button"
						class={activeOptionClass(isSelected)}
						aria-pressed={isSelected}
						onclick={() => selectBrandAndReturn(option.value)}
					>
						<span class="mobile-filter-options__brand">
							<span class="mobile-filter-options__brand-mark" aria-hidden="true">
								{#if logo}
									<img src={i18n.asset(resolve(logo))} alt="" loading="lazy" />
								{:else}
									<span>{brandInitials(option.value)}</span>
								{/if}
							</span>
							<span>{i18n.spec(option.value)}</span>
						</span>
						{#if isSelected}
							<span class="mobile-filter-options__selected-mark" aria-hidden="true"></span>
						{:else}
							<small>{option.count}</small>
						{/if}
					</button>
				{/each}
				{#if !filteredBrandOptions.length}
					<p class="mobile-filter-options__empty">{i18n.t('copy.150b5d69b380')}</p>
				{/if}
			</div>
		{:else if filterSheetMode === 'model'}
			<div class="mobile-filter-search">
				<Search size={18} strokeWidth={2.35} aria-hidden="true" />
				<input
					{@attach i18n.validation}
					type="search"
					value={selectorQuery}
					placeholder={i18n.t('copy.78fbb7843147')}
					autocomplete="off"
					aria-label={i18n.t('copy.78fbb7843147')}
					oninput={(event) => onSelectorQueryChange(inputValue(event))}
				/>
				{#if selectorQuery}
					<button
						type="button"
						aria-label={i18n.t('copy.b0e15a8398c0')}
						onclick={() => onSelectorQueryChange('')}
					>
						<X size={16} strokeWidth={2.5} />
					</button>
				{/if}
			</div>
			<div class="mobile-filter-options" aria-label={i18n.t('copy.78a19a5d2b59')}>
				<button
					type="button"
					class={!selectedModels.length ? 'is-active' : ''}
					onclick={clearModelsAndReturn}
				>
					<span>{i18n.t('copy.6e6e565abe87')}</span>
					<small>{showAllModelsCount()}</small>
				</button>
				{#each filteredModelOptions as option (option.value)}
					{@const isSelected = selectedModels.includes(option.value)}
					<button
						type="button"
						class={activeOptionClass(isSelected)}
						aria-pressed={isSelected}
						onclick={() => selectModelAndReturn(option.value)}
					>
						<span>{modelOptionLabel(option.value)}</span>
						{#if isSelected}
							<span class="mobile-filter-options__selected-mark" aria-hidden="true"></span>
						{:else}
							<small>{option.count}</small>
						{/if}
					</button>
				{/each}
				{#if !filteredModelOptions.length}
					<p class="mobile-filter-options__empty">{i18n.t('copy.04f070f200b8')}</p>
				{/if}
			</div>
		{:else if filterSheetMode === 'fuel'}
			<MobileFilterOptions
				ariaLabel={i18n.t('copy.b52d6c364219')}
				allLabel={i18n.t('copy.fe2da9280eb0')}
				allCount={vehiclesCount}
				allActive={!fuel}
				options={fuelOptions}
				isSelected={(value) => fuel === value}
				onClear={clearFuelAndReturn}
				onSelect={selectFuelAndReturn}
			/>
		{:else if filterSheetMode === 'mileage'}
			<MobileFilterOptions
				ariaLabel={i18n.t('copy.69cc064f0636')}
				allLabel={i18n.t('copy.2ced06b31e8b')}
				allCount={vehiclesCount}
				allActive={!mileage}
				options={mileageOptions}
				isSelected={(value) => mileage === value}
				optionCount={(option) => mileageOptionCount(option.value)}
				onClear={clearMileageAndReturn}
				onSelect={selectMileageAndReturn}
			/>
		{:else if filterSheetMode === 'body'}
			<MobileFilterOptions
				ariaLabel={i18n.t('copy.45e7e8a38730')}
				allLabel={i18n.t('copy.e551fe4e16ed')}
				allCount={vehiclesCount}
				allActive={!selectedBodies.length}
				options={bodyOptions}
				isSelected={(value) => selectedBodies.includes(value)}
				optionClass={activeOptionClass}
				onClear={clearBodiesAndReturn}
				onSelect={selectBodyAndReturn}
			/>
		{:else if filterSheetMode === 'price'}
			<MobileFilterOptions
				ariaLabel={i18n.t('copy.be0e705ced81')}
				allLabel={i18n.t('copy.6d9c63297fb6')}
				allCount={priceOptionCount('')}
				allActive={!price}
				options={priceOptions}
				isSelected={(value) => price === value}
				optionCount={(option) => priceOptionCount(option.value)}
				onClear={clearPriceAndReturn}
				onSelect={selectPriceAndReturn}
			/>
		{:else if filterSheetMode === 'transmission'}
			<MobileFilterOptions
				ariaLabel={i18n.t('copy.4172507e5ff2')}
				allLabel={i18n.t('copy.524e70cdee14')}
				allCount={vehiclesCount}
				allActive={!transmission}
				options={transmissions.map((item) => ({ value: item }))}
				isSelected={(value) => transmission === value}
				optionCount={(option) => transmissionOptionCount(option.value)}
				onClear={clearTransmissionAndReturn}
				onSelect={selectTransmissionAndReturn}
			/>
		{:else if filterSheetMode === 'sort'}
			<div class="mobile-filter-options" aria-label={i18n.t('copy.365e7bf87b30')}>
				{#each sortOptions as option (option.value)}
					<button
						type="button"
						class={sort === option.value ? 'is-active' : ''}
						onclick={() => selectSortAndReturn(option.value)}
					>
						<span>{i18n.spec(option.label)}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mobile-filter-sheet__actions">
		<button type="button" onclick={clearCurrentSheet}>{i18n.text(filterSheetClearLabel)}</button>
		<button class="is-primary" type="button" onclick={completeFilterSheet}>
			{i18n.text(filterSheetActionLabel)}
		</button>
	</div>
</div>
