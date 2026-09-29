<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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

<div class="mobile-inventory-quick" role="group" aria-label={i18n.t('copy.427bd0c4b0b6')}>
	<div class="mobile-inventory-pills">
		<button
			type="button"
			class={selectedBrands.length
				? 'mobile-inventory-make-chip is-active'
				: 'mobile-inventory-make-chip'}
			onclick={() => openFilterSheet('brand')}
		>
			<span class="mobile-inventory-pill-label">
				{selectedBrands.length ? brandSummary : i18n.t('copy.b7fccee005ae')}
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
				{selectedModels.length ? modelSummary : i18n.t('copy.37858c8efede')}
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
			<span class="mobile-inventory-pill-label"
				>{i18n.spec(priceLabel) || i18n.t('copy.be0e705ced81')}</span
			>
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
			<span class="mobile-inventory-pill-label"
				>{i18n.spec(fuel) || i18n.t('copy.b52d6c364219')}</span
			>
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
			<span class="mobile-inventory-pill-label"
				>{i18n.spec(mileageLabel) || i18n.t('copy.69cc064f0636')}</span
			>
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
				{selectedBodies.length ? bodySummary : i18n.t('copy.45e7e8a38730')}
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
				>{hasActiveFilters
					? i18n.t('pattern.89f2cee26a87', { v0: vehiclesCount })
					: i18n.t('pattern.33b47bc15b1b', { v0: vehiclesCount })}</span
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
