<script lang="ts">
	import { page } from '$app/state';
	import { inventoryDesktopControlsCopy } from '$lib/content/inventory-desktop-controls';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import { inventoryFilterParam } from '$lib/domain/inventory-query';
	import InventoryFilter from './InventoryFilter.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilter
	} from '$lib/server/inventory-options';
	let {
		desktop,
		english = false,
		allOpen,
		activeFilter,
		onopen
	}: {
		desktop: AuxeroInventoryDesktopData;
		english?: boolean;
		allOpen: boolean;
		activeFilter: AuxeroInventoryFilter | null;
		onopen: (filter?: AuxeroInventoryFilter) => void;
	} = $props();
	const controlsCopy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	function appliedRangeSummary(filter: AuxeroInventoryFilter) {
		if (!filter.numericInput) return undefined;
		const min = page.url.searchParams.get(filter.name === 'priceTo' ? 'minPrice' : 'minMileage');
		const max = filter.selectedValues[0];
		const format = (value: string) => Number(value).toLocaleString(english ? 'en' : 'bg');
		const unit = filter.name === 'priceTo' ? '€' : filter.numericInput.unit;
		if (min && max) return `${format(min)} – ${format(max)} ${unit}`;
		if (min) return `${english ? 'From' : 'От'} ${format(min)} ${unit}`;
		if (max) return `≤${format(max)} ${unit}`;
		return undefined;
	}
	const quickFilters = $derived(
		['brand', 'q', 'maxPrice', 'maxMileage', 'fuel']
			.map((name) => desktop.filters.find((filter) => inventoryFilterParam(filter.name) === name))
			.filter((filter) => filter !== undefined)
	);
</script>

<div class="inventory-toolbar">
	<div class="inventory-toolbar__row" style:--inventory-quick-filter-count={quickFilters.length}>
		{#each quickFilters as filter (filter.id)}<div class="inventory-toolbar__field">
				<InventoryFilter
					{filter}
					summary={appliedRangeSummary(filter)}
					expanded={allOpen && activeFilter?.id === filter.id}
					onopen={() => onopen(filter)}
				/>
			</div>{/each}
		<Action
			variant="secondary"
			size="compact"
			class="inventory-toolbar__all"
			aria-label={controlsCopy.allFilters}
			title={controlsCopy.allFilters}
			aria-haspopup="dialog"
			aria-expanded={allOpen}
			onclick={() => onopen()}
			><SlidersHorizontal size={20} aria-hidden="true" /><span class="inventory-toolbar__all-label"
				>{controlsCopy.allFilters}</span
			></Action
		>
	</div>
	{#if desktop.activeFilters}<div class="inventory-toolbar__active">
			{#each desktop.activeFilters.chips as chip (chip.href)}<a
					href={linkHref(chip.href)}
					aria-label={controlsCopy.removeFilter + chip.label}
					>{chip.label}<X size={14} aria-hidden="true" /></a
				>{/each}<a class="inventory-toolbar__clear" href={linkHref(desktop.activeFilters.clearHref)}
				>{desktop.activeFilters.clearLabel}</a
			>
		</div>{/if}
</div>

<style>
	.inventory-toolbar {
		width: 100%;
		min-width: 0;
	}
	.inventory-toolbar__row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		gap: var(--bc-space-2);
	}
	.inventory-toolbar__active {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
		padding-top: var(--bc-space-4);
	}
	.inventory-toolbar__active a {
		display: inline-flex;
		align-items: center;
		gap: var(--bc-space-2);
		color: var(--bc-ink);
		font-size: var(--bc-text-label);
		text-decoration: none;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-1) var(--bc-space-2);
		border-radius: var(--bc-radius-sm);
		border: 1px solid var(--bc-border);
		background: var(--bc-control);
	}
	.inventory-toolbar__active .inventory-toolbar__clear {
		background: transparent;
		border-color: transparent;
		color: var(--desktop-discovery-copy, var(--bc-ink));
		text-decoration: underline;
		text-underline-offset: var(--bc-space-1);
	}
	.inventory-toolbar__row :global(.inventory-toolbar__all) {
		flex: none;
		min-height: var(--bc-control-height-primary);
		padding-inline: var(--bc-space-3);
		border-radius: var(--bc-radius-pill);
		white-space: nowrap;
	}
	@media (min-width: 768px) {
		.inventory-toolbar__row {
			display: grid;
			grid-template-columns: repeat(var(--inventory-quick-filter-count), minmax(0, 1fr)) max-content;
			gap: var(--bc-space-3);
		}
		.inventory-toolbar__field {
			min-width: 0;
		}
		.inventory-toolbar__field :global(.site-filter-trigger) {
			width: 100%;
			padding-inline: var(--bc-space-2);
			gap: var(--bc-space-1);
		}
		.inventory-toolbar__active {
			padding-top: var(--bc-space-3);
		}
		.inventory-toolbar__active a {
			min-height: var(--bc-space-8);
			padding-inline: var(--bc-space-3);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-surface-raised);
			border-color: transparent;
			font-size: var(--bc-text-meta);
		}
		.inventory-toolbar__active a:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
		.inventory-toolbar__row :global(.inventory-toolbar__all) {
			min-height: var(--bc-control-height-standard);
			padding-inline: var(--bc-space-4);
			justify-content: center;
			gap: var(--bc-space-2);
			font-size: var(--bc-text-body);
			border: 1px solid transparent;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
		}
		.inventory-toolbar__all-label {
			display: inline;
		}
		.inventory-toolbar__row :global(.inventory-toolbar__all:hover) {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.inventory-toolbar__row {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 767px) {
		.inventory-toolbar__row {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			row-gap: var(--bc-space-3);
		}
	}
</style>
