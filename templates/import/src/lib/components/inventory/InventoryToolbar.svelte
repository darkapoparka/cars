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
		if (!min) return undefined;
		const format = (value: string) => Number(value).toLocaleString(english ? 'en' : 'bg');
		return `${filter.selectedValues[0] ? format(min) + ' – ' + format(filter.selectedValues[0]) : (english ? 'From ' : 'От ') + format(min)} ${filter.numericInput.unit}`;
	}
	const quickFilters = $derived(
		['brand', 'q', 'maxPrice', 'maxMileage', 'fuel', 'body']
			.map((name) => desktop.filters.find((filter) => inventoryFilterParam(filter.name) === name))
			.filter((filter) => filter !== undefined)
	);
</script>

<div class="inventory-toolbar">
	<div class="inventory-toolbar__row">
		{#each quickFilters as filter (filter.id)}<InventoryFilter
				{filter}
				summary={appliedRangeSummary(filter)}
				expanded={allOpen && activeFilter?.id === filter.id}
				onopen={() => onopen(filter)}
			/>{/each}
		<Action
			variant="strong"
			size="compact"
			class="inventory-toolbar__all"
			aria-haspopup="dialog"
			aria-expanded={allOpen}
			onclick={() => onopen()}
			><SlidersHorizontal size={18} aria-hidden="true" />{controlsCopy.allFilters}</Action
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
		text-decoration: underline;
		text-underline-offset: var(--bc-space-1);
	}
	.inventory-toolbar__row :global(.inventory-toolbar__all) {
		flex: none;
		min-height: var(--bc-control-height-primary);
		padding-inline: var(--bc-space-3);
		border-radius: var(--bc-radius-pill);
		white-space: nowrap;
		margin-inline-start: auto;
	}
	@media (min-width: 901px) {
		.inventory-toolbar__row {
			flex-wrap: nowrap;
		}
	}
	@media (max-width: 900px) {
		.inventory-toolbar__row {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			row-gap: var(--bc-space-3);
		}
		.inventory-toolbar__row :global(.inventory-toolbar__all) {
			grid-column: span 2;
			justify-self: end;
			margin-inline-start: 0;
		}
	}
</style>
