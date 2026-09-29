<script lang="ts">
	import { page } from '$app/state';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import InventoryFilter from './InventoryFilter.svelte';
	import InventoryFiltersDialog from './InventoryFiltersDialog.svelte';
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
	let viewMenu: HTMLDetailsElement;
	function dismissViewMenu(event: PointerEvent | FocusEvent) {
		if (event.target instanceof Node && !viewMenu?.contains(event.target)) {
			if (viewMenu) viewMenu.open = false;
		}
	}
	function handleViewKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && viewMenu?.open) {
			viewMenu.open = false;
			viewMenu.querySelector('summary')?.focus();
		}
	}
	const quickFilters = $derived(
		[
			['brand'],
			['q', 'model'],
			['maxPrice', 'priceTo'],
			['minYear', 'yearFrom', 'mileageTo', 'maxMileage'],
			['fuel'],
			['body', 'bodyType']
		]
			.map((names) => desktop.filters.find((filter) => names.includes(filter.name)))
			.filter((filter) => filter !== undefined)
	);
</script>

<svelte:document
	onpointerdown={dismissViewMenu}
	onfocusin={dismissViewMenu}
	onkeydown={handleViewKey}
/>

<div class="inventory-toolbar">
	<div class="inventory-toolbar__row site-container">
		<Action
			variant="strong"
			class="inventory-toolbar__all"
			aria-haspopup="dialog"
			aria-expanded={allOpen}
			onclick={() => dialog?.openFilters()}
			><SlidersHorizontal size={18} aria-hidden="true" />{english
				? 'All filters'
				: 'Всички филтри'}</Action
		>
		<div class="inventory-toolbar__filters">
			{#each quickFilters as filter (filter.id)}<InventoryFilter
					{filter}
					summary={appliedRangeSummary(filter)}
					expanded={allOpen && activeFilter?.id === filter.id}
					onopen={() => dialog?.openFilters(filter)}
				/>{/each}
		</div>
		<form action={linkHref('/inventory')} class="inventory-toolbar__sort">
			{#each [...page.url.searchParams].filter(([name]) => name !== 'sort') as [name, value], i (i)}<input
					type="hidden"
					{name}
					{value}
				/>{/each}
			<label
				><span class="sr-only">{desktop.sortLabel}</span><select
					name="sort"
					value={desktop.sortOptions.find((option) => option.active)?.value ??
						desktop.sortOptions[0]?.value}
					onchange={(event) => event.currentTarget.form?.requestSubmit()}
					>{#each desktop.sortOptions as option (option.value)}<option value={option.value}
							>{option.label}</option
						>{/each}</select
				></label
			>
			<noscript><button type="submit">{english ? 'Sort' : 'Подреди'}</button></noscript>
		</form>
		<details class="inventory-view" bind:this={viewMenu}>
			<summary><LayoutGrid size={18} aria-hidden="true" />{desktop.viewLabel}</summary>
			<nav aria-label={desktop.viewLabel}>
				{#each desktop.viewOptions as option (option.view)}<a
						href={linkHref(option.href)}
						aria-current={option.active ? 'true' : undefined}>{option.label}</a
					>{/each}
			</nav>
		</details>
	</div>
	{#if desktop.activeFilters}<div class="site-container inventory-toolbar__active">
			{#each desktop.activeFilters.chips as chip (chip.href)}<a href={linkHref(chip.href)}
					>{chip.label}<X size={14} aria-hidden="true" /></a
				>{/each}<a href={linkHref(desktop.activeFilters.clearHref)}
				>{desktop.activeFilters.clearLabel}</a
			>
		</div>{/if}
</div>
<InventoryFiltersDialog bind:this={dialog} {desktop} {english} bind:allOpen bind:activeFilter />

<style>
	.inventory-toolbar {
		background: var(--bc-surface-raised);
		border-bottom: 1px solid var(--bc-border);
		padding-block: var(--bc-space-3);
	}
	.inventory-toolbar__row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto;
		align-items: center;
		gap: var(--bc-space-3);
	}
	.inventory-toolbar__filters {
		display: flex;
		flex-wrap: wrap;
		min-width: 0;
		gap: var(--bc-space-2);
	}
	.inventory-toolbar__sort {
		margin: 0;
	}
	select,
	summary {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		min-height: var(--bc-route-pill-height);
		padding: 0 var(--bc-space-3);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
	}
	.inventory-view {
		position: relative;
	}
	summary {
		display: flex;
		align-items: center;
	}
	.inventory-view nav {
		position: absolute;
		right: 0;
		top: calc(100% + 8px);
		z-index: 10;
		min-width: 160px;
		padding: var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-panel);
		display: grid;
	}
	.inventory-view a {
		padding: var(--bc-space-2);
		text-decoration: none;
		color: var(--bc-ink);
	}
	.inventory-view a:hover {
		background: var(--bc-surface);
	}
	.inventory-toolbar__active {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
		padding-top: var(--bc-space-3);
	}
	.inventory-toolbar__active a {
		display: inline-flex;
		align-items: center;
		gap: var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		text-decoration: none;
		padding: var(--bc-space-1) var(--bc-space-2);
		border-radius: var(--bc-radius-sm);
		background: var(--bc-surface);
	}
	.inventory-toolbar {
		position: sticky;
		top: 0;
		z-index: 80;
		box-shadow: var(--bc-shadow-subtle);
	}
	.inventory-toolbar__row :global(.inventory-toolbar__all) {
		min-height: var(--bc-route-pill-height);
		border-radius: var(--bc-radius-pill);
		white-space: nowrap;
	}
	.inventory-toolbar__filters :global(.site-filter-trigger) {
		flex: 0 0 auto;
	}
	summary {
		gap: var(--bc-space-2);
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.inventory-view nav {
		border-radius: var(--bc-radius-panel);
	}
	@media (max-width: 1399px) {
		.inventory-toolbar__row {
			grid-template-columns: 1fr auto auto;
		}
		.inventory-toolbar__filters {
			grid-row: 2;
			grid-column: 1/-1;
		}
		.inventory-toolbar__row :global(.inventory-toolbar__all) {
			justify-self: start;
		}
	}
	@media (min-width: 768px) {
		select,
		summary,
		.inventory-toolbar__row :global(.inventory-toolbar__all) {
			min-height: var(--bc-control-height-primary);
			font-size: var(--bc-text-control);
		}
		.inventory-toolbar__active a {
			min-height: var(--bc-control-height-compact);
			padding-inline: var(--bc-space-3);
		}
		.inventory-view a[aria-current='true'] {
			background: var(--bc-bg-strong);
			border-radius: var(--bc-radius-md);
			font-weight: var(--bc-weight-heading);
		}
	}
</style>
