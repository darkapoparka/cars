<script lang="ts">
	import { page } from '$app/state';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	import InventoryFilter from './InventoryFilter.svelte';
	import InventoryCompactField from './InventoryCompactField.svelte';
	import Search from '@lucide/svelte/icons/search';
	import {
		inventoryFilterParam,
		parseInventoryQuery,
		serializeInventoryQuery
	} from '$lib/domain/inventory-query';
	import Action from '$lib/components/common/Action.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { linkHref } from '$lib/utils/links';
	let { desktop, english = false }: { desktop: AuxeroInventoryDesktopData; english?: boolean } =
		$props();
	let allOpen = $state(false);
	let draft = $state<Record<string, string[]>>({});
	let keyword = $state('');
	function openFilters() {
		draft = Object.fromEntries(
			desktop.filters.map((filter) => [filter.id, [...filter.selectedValues]])
		);
		keyword = page.url.searchParams.get('keyword') ?? '';
		allOpen = true;
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
	const formId = $props.id();
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
	const fieldNames = $derived(
		new Set(desktop.filters.map((filter) => inventoryFilterParam(filter.name)))
	);
	const passthrough = $derived(
		[
			...serializeInventoryQuery(parseInventoryQuery(page.url.searchParams), page.url.searchParams)
		].filter(([name]) => !fieldNames.has(name) && name !== 'keyword' && name !== 'page')
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
			onclick={openFilters}
			><SlidersHorizontal size={18} aria-hidden="true" />{english
				? 'All filters'
				: 'Всички филтри'}</Action
		>
		<div class="inventory-toolbar__filters">
			{#each quickFilters as filter (filter.id)}<InventoryFilter {filter} {english} />{/each}
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
<Modal
	bind:open={allOpen}
	title={english ? 'Find a car' : 'Търсене на автомобили'}
	wide
	class="inventory-filters-dialog"
>
	<form id={formId} action={linkHref('/inventory')} onsubmit={() => (allOpen = false)}>
		{#each passthrough as [name, value], i (i)}<input type="hidden" {name} {value} />{/each}
		<div class="inventory-all__search">
			<Search size={20} aria-hidden="true" />
			<label class="sr-only" for={formId + '-keyword'}
				>{english ? 'Make, model or keyword' : 'Марка, модел или ключова дума'}</label
			>
			<input
				id={formId + '-keyword'}
				type="search"
				name="keyword"
				bind:value={keyword}
				placeholder={english ? 'Make, model or keyword' : 'Марка, модел или ключова дума'}
			/>
		</div>
		<div class="inventory-all">
			{#each desktop.filters as filter (filter.id)}<InventoryCompactField
					{filter}
					{english}
					bind:selection={draft[filter.id]}
				/>{/each}
		</div>
	</form>
	{#snippet footer()}
		<div class="inventory-all__actions">
			<Action
				variant="secondary"
				onclick={() => {
					keyword = '';
					draft = Object.fromEntries(desktop.filters.map((filter) => [filter.id, []]));
				}}>{desktop.sidebar.actions.clearLabel}</Action
			>
			<Action type="submit" form={formId}>{english ? 'Show cars' : 'Покажи автомобили'}</Action>
		</div>
	{/snippet}
</Modal>

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
		overflow-x: auto;
		min-width: 0;
		padding-block: 3px;
		scrollbar-width: thin;
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
	.inventory-all {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5) var(--bc-space-4);
		padding-block: var(--bc-space-5);
	}
	:global(.site-dialog.inventory-filters-dialog) {
		width: min(var(--bc-container-page), calc(100vw - 2 * var(--bc-space-6)));
	}
	.inventory-all__search {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		padding: var(--bc-space-3) var(--bc-space-4);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: var(--bc-muted);
	}
	.inventory-all__search input {
		width: 100%;
		min-width: 0;
		border: 0;
		padding: var(--bc-space-1);
		background: transparent;
		color: var(--bc-ink);
		font: inherit;
	}
	.inventory-all__actions {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-3);
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
	@media (max-width: 1199px) {
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
	@media (max-width: 599px) {
		.inventory-all {
			grid-template-columns: 1fr;
		}
	}
	@media (min-width: 600px) and (max-width: 899px) {
		.inventory-all {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
