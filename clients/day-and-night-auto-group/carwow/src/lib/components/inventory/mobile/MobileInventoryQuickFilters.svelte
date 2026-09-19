<script lang="ts">
	import { Car, ChevronDown, Fuel, Gauge } from '@lucide/svelte';
	import type { FilterSheetMode } from '$lib/types/mobile-inventory';

	let {
		vehiclesCount,
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
		openFilterSheet,
		clearFilters
	}: {
		vehiclesCount: number;
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
		openFilterSheet: (mode: FilterSheetMode) => void;
		clearFilters: () => void;
	} = $props();
</script>

<div class="mobile-inventory-quick" role="group" aria-label="Бързи филтри">
	<div class="mobile-inventory-pills">
		<button
			type="button"
			class={selectedBrands.length
				? 'mobile-inventory-make-chip is-active'
				: 'mobile-inventory-make-chip'}
			onclick={() => openFilterSheet('brand')}
		>
			<span class="mobile-inventory-pill-label">
				{selectedBrands.length ? brandSummary : 'Марка'}
			</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
		<button
			type="button"
			class={selectedModels.length
				? 'mobile-inventory-model-chip is-active'
				: 'mobile-inventory-model-chip'}
			onclick={() => openFilterSheet('model')}
		>
			<span class="mobile-inventory-pill-label">
				{selectedModels.length ? modelSummary : 'Модел'}
			</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
		<button
			type="button"
			class="mobile-inventory-price-chip"
			class:is-active={Boolean(priceLabel)}
			onclick={() => openFilterSheet('price')}
		>
			<span class="mobile-inventory-pill-label">{priceLabel || 'Цена'}</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
		<button
			type="button"
			class={fuel ? 'mobile-inventory-fuel-chip is-active' : 'mobile-inventory-fuel-chip'}
			onclick={() => openFilterSheet('fuel')}
		>
			<Fuel size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">{fuel || 'Гориво'}</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
		<button
			type="button"
			class={mileage ? 'mobile-inventory-mileage-chip is-active' : 'mobile-inventory-mileage-chip'}
			onclick={() => openFilterSheet('mileage')}
		>
			<Gauge size={16} strokeWidth={2.25} />
			<span class="mobile-inventory-pill-label">{mileageLabel || 'Пробег'}</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
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
				{selectedBodies.length ? bodySummary : 'Каросерия'}
			</span>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
		<button type="button" class={!hasActiveFilters ? 'is-active' : ''} onclick={clearFilters}>
			<Car size={17} strokeWidth={2.2} />
			<span class="mobile-inventory-pill-label"
				>{hasActiveFilters ? `Изчисти (${vehiclesCount})` : `Всички ${vehiclesCount}`}</span
			>
			<ChevronDown
				class="mobile-inventory-pill-chevron"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</button>
	</div>
</div>
