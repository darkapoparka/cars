<script lang="ts">
	import { page } from '$app/state';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import { inventoryFilterParam } from '$lib/domain/inventory-query';
	import InventoryFilter from './InventoryFilter.svelte';
	import InventoryFiltersDialog from './InventoryFiltersDialog.svelte';
	import InventoryDisplayControls from './InventoryDisplayControls.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilter
	} from '$lib/server/inventory-options';
	let { desktop, english = false }: { desktop: AuxeroInventoryDesktopData; english?: boolean } =
		$props();
	let allOpen = $state(false);
	let activeFilter = $state<AuxeroInventoryFilter | null>(null);
	let dialog = $state<InventoryFiltersDialog>();
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
	<div class="site-container">
		<div class="inventory-toolbar__row">
			<div class="inventory-toolbar__filters">
				{#each quickFilters as filter (filter.id)}<InventoryFilter
						{filter}
						summary={appliedRangeSummary(filter)}
						expanded={allOpen && activeFilter?.id === filter.id}
						onopen={() => dialog?.openFilters(filter)}
					/>{/each}
			</div>
			<Action
				variant="strong"
				size="compact"
				class="inventory-toolbar__all"
				aria-haspopup="dialog"
				aria-expanded={allOpen}
				onclick={() => dialog?.openFilters()}
				><SlidersHorizontal size={18} aria-hidden="true" />{english
					? 'All filters'
					: 'Всички филтри'}</Action
			>
		</div>
		{#if desktop.activeFilters}<div class="inventory-toolbar__active">
				{#each desktop.activeFilters.chips as chip (chip.href)}<a
						href={linkHref(chip.href)}
						aria-label={(english ? 'Remove filter: ' : 'Премахни филтър: ') + chip.label}
						>{chip.label}<X size={14} aria-hidden="true" /></a
					>{/each}<a
					class="inventory-toolbar__clear"
					href={linkHref(desktop.activeFilters.clearHref)}>{desktop.activeFilters.clearLabel}</a
				>
			</div>{/if}
		<div class="inventory-toolbar__overview">
			<p role="status"><strong>{desktop.resultCount}</strong> {english ? 'cars' : 'автомобила'}</p>
			<InventoryDisplayControls {desktop} {english} />
		</div>
	</div>
</div>
<InventoryFiltersDialog bind:this={dialog} {desktop} {english} bind:allOpen bind:activeFilter />

<style>
	.inventory-toolbar {
		position: sticky;
		top: 0;
		z-index: 80;
		background: var(--bc-bg);
		padding-block: var(--bc-space-3);
		margin-bottom: var(--bc-space-2);
	}
	.inventory-toolbar__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--bc-space-4);
	}
	.inventory-toolbar__filters {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		min-width: 0;
		gap: var(--bc-space-2);
	}
	.inventory-toolbar__overview {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2) var(--bc-space-4);
		margin-top: var(--bc-space-2);
	}
	.inventory-toolbar__overview p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
	}
	.inventory-toolbar__overview strong {
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
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
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		text-decoration: none;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-1) var(--bc-space-2);
		border-radius: var(--bc-radius-sm);
		background: var(--bc-surface);
	}
	.inventory-toolbar__active .inventory-toolbar__clear {
		background: transparent;
		text-decoration: underline;
		text-underline-offset: var(--bc-space-1);
	}
	.inventory-toolbar__row :global(.inventory-toolbar__all) {
		min-height: var(--bc-control-height-primary);
		border-radius: var(--bc-radius-md);
		white-space: nowrap;
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.inventory-toolbar__filters {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
