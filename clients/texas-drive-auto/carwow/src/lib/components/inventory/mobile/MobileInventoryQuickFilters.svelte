<script lang="ts">
	import { ArrowUpDown, Car, Fuel, Gauge, SlidersHorizontal } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { FilterSheetMode, SortKey } from '$lib/types/mobile-inventory';

	type BrandLogoPath = `/assets/images/brand/${string}`;

	let {
		vehiclesCount,
		resultCount,
		hasAdvancedFilters,
		sort,
		sortChipLabel,
		selectedBrands,
		brandSummary,
		selectedModels,
		modelSummary,
		fuel,
		mileage,
		mileageLabel,
		selectedBodies,
		bodySummary,
		hasActiveFilters,
		priceLabel,
		brandLogoPath,
		openFilterSheet,
		clearFilters,
		clearPrice
	}: {
		vehiclesCount: number;
		resultCount: number;
		hasAdvancedFilters: boolean;
		sort: SortKey;
		sortChipLabel: string;
		selectedBrands: string[];
		brandSummary: string;
		selectedModels: string[];
		modelSummary: string;
		fuel: string;
		mileage: string;
		mileageLabel: string;
		selectedBodies: string[];
		bodySummary: string;
		hasActiveFilters: boolean;
		priceLabel: string;
		brandLogoPath: (value: string) => BrandLogoPath | undefined;
		openFilterSheet: (mode: FilterSheetMode) => void;
		clearFilters: () => void;
		clearPrice: () => void;
	} = $props();
</script>

<div class="mobile-inventory-quick" aria-label="Quick filters">
	<p class="mobile-inventory-count" role="status">
		{resultCount}
		{resultCount === 1 ? 'result' : 'results'}
	</p>
	<div class="mobile-inventory-pills">
		<button
			type="button"
			class={hasAdvancedFilters
				? 'mobile-inventory-filter-chip is-active'
				: 'mobile-inventory-filter-chip'}
			onclick={() => openFilterSheet('all')}
		>
			<SlidersHorizontal size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">Filters</span>
		</button>
		<button
			type="button"
			class={sort !== 'price-asc'
				? 'mobile-inventory-sort-chip is-active'
				: 'mobile-inventory-sort-chip'}
			onclick={() => openFilterSheet('sort')}
		>
			<ArrowUpDown size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">{sortChipLabel}</span>
		</button>
		<button
			type="button"
			class={selectedBrands.length
				? 'mobile-inventory-make-chip is-active'
				: 'mobile-inventory-make-chip'}
			onclick={() => openFilterSheet('brand')}
		>
			{#if selectedBrands.length}
				{@const logo = brandLogoPath(selectedBrands[0])}
				{#if logo}
					<img
						class="mobile-inventory-brand-logo"
						src={resolve(logo)}
						alt=""
						width="17"
						height="17"
						aria-hidden="true"
					/>
				{:else}
					<Car size={17} strokeWidth={2.2} />
				{/if}
			{:else}
				<Car size={17} strokeWidth={2.2} />
			{/if}
			<span class="mobile-inventory-pill-label">
				{selectedBrands.length ? brandSummary : 'Make'}
			</span>
		</button>
		<button
			type="button"
			class={selectedModels.length
				? 'mobile-inventory-model-chip is-active'
				: 'mobile-inventory-model-chip'}
			onclick={() => openFilterSheet('model')}
		>
			<Car size={17} strokeWidth={2.2} />
			<span class="mobile-inventory-pill-label">
				{selectedModels.length ? modelSummary : 'Model'}
			</span>
		</button>
		<button
			type="button"
			class={fuel ? 'mobile-inventory-fuel-chip is-active' : 'mobile-inventory-fuel-chip'}
			onclick={() => openFilterSheet('fuel')}
		>
			<Fuel size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">{fuel || 'Fuel'}</span>
		</button>
		<button
			type="button"
			class={mileage ? 'mobile-inventory-mileage-chip is-active' : 'mobile-inventory-mileage-chip'}
			onclick={() => openFilterSheet('mileage')}
		>
			<Gauge size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">{mileageLabel || 'Mileage'}</span>
		</button>
		<button
			type="button"
			class={selectedBodies.length
				? 'mobile-inventory-body-chip is-active'
				: 'mobile-inventory-body-chip'}
			onclick={() => openFilterSheet('body')}
		>
			<Car size={17} strokeWidth={2.2} />
			<span class="mobile-inventory-pill-label">
				{selectedBodies.length ? bodySummary : 'Body style'}
			</span>
		</button>
		<button type="button" class={!hasActiveFilters ? 'is-active' : ''} onclick={clearFilters}>
			<Car size={17} strokeWidth={2.2} />
			<span class="mobile-inventory-pill-label"
				>{hasActiveFilters ? `Clear (${vehiclesCount})` : `All ${vehiclesCount}`}</span
			>
		</button>
		{#if priceLabel}
			<button type="button" class="is-active" onclick={clearPrice}>
				<span class="mobile-inventory-pill-label">{priceLabel}</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.mobile-inventory-count {
		margin: 0 0 8px;
		color: var(--sa-muted);
		font-size: 13px;
	}
</style>
