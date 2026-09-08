<script lang="ts">
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import DropdownFilterControl from './DropdownFilterControl.svelte';
	import InventoryTypePills from './InventoryTypePills.svelte';
	import SortDropdown from './SortDropdown.svelte';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';

	let { filters }: { filters: InventoryQuickFilterGroup[] } = $props();

	const inventory = getDesktopInventoryContext();
	const quickNames = ['brand', 'model', 'price', 'mileage', 'fuel'];
	const quickFilters = $derived(filters.filter((filter) => quickNames.includes(filter.name)));
	const advancedFilters = $derived(filters.filter((filter) => !quickNames.includes(filter.name)));
	const advancedSelectionCount = $derived(
		advancedFilters.reduce(
			(total, filter) => total + inventory.getFieldValues(filter.name).length,
			0
		)
	);

	let advancedOpen = $state(false);

	function toggleAdvanced() {
		inventory.openField = '';
		advancedOpen = !advancedOpen;
	}

	function closeAdvanced() {
		advancedOpen = false;
		inventory.openField = '';
	}

	function handleDocumentClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-daynight-results-quick-filters]')) return;
		advancedOpen = false;
		inventory.openField = '';
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeAdvanced();
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleDocumentKeydown} />
<svelte:window onresize={closeAdvanced} />

<section
	class="daynight-inventory-results-quick-filters daynight-inventory-filterbar daynight-inventory-results-filterbar"
	data-daynight-results-quick-filters
	aria-label="Бързи филтри"
>
	<div class="daynight-inventory-results-filterbar__fields">
		{#each quickFilters as filter (filter.name)}
			<DropdownFilterControl {filter} layoutMode="grid" filterUxMode="popover" />
		{/each}
		<button
			class:has-selection={advancedSelectionCount > 0}
			class="daynight-inventory-results-filterbar__advanced-toggle"
			type="button"
			aria-expanded={advancedOpen}
			aria-controls="daynight-inventory-advanced-filters"
			onclick={toggleAdvanced}
		>
			<SlidersHorizontal aria-hidden="true" size={17} strokeWidth={2.2} />
			<span>Още филтри</span>
			{#if advancedSelectionCount > 0}
				<span class="daynight-inventory-results-filterbar__count">{advancedSelectionCount}</span>
			{/if}
		</button>
		<div class="daynight-inventory-results-filterbar__sort">
			<SortDropdown buttonLabel="Сортиране" />
		</div>
	</div>

	<div class="daynight-inventory-results-filterbar__shortcuts">
		<InventoryTypePills />
	</div>

	{#if advancedOpen}
		<div
			id="daynight-inventory-advanced-filters"
			class="daynight-inventory-results-filterbar__advanced"
		>
			<div class="daynight-inventory-results-filterbar__advanced-head">
				<div>
					<strong>Допълнителни филтри</strong>
					<span>Скорости, каросерия и екстри</span>
				</div>
				<button type="button" aria-label="Затвори допълнителните филтри" onclick={closeAdvanced}>
					<X aria-hidden="true" size={18} strokeWidth={2.2} />
				</button>
			</div>
			<div class="daynight-inventory-results-filterbar__advanced-grid">
				{#each advancedFilters as filter (filter.name)}
					<DropdownFilterControl {filter} layoutMode="grid" filterUxMode="popover" />
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
	) {
		background: transparent !important;
		border: 0 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		display: grid !important;
		gap: 9px !important;
		grid-auto-flow: row !important;
		grid-template-columns: minmax(0, 1fr) !important;
		justify-items: stretch;
		margin: 0 !important;
		max-width: 100% !important;
		overflow: visible !important;
		padding: 0 !important;
		position: relative;
		width: 100% !important;
		z-index: 45;
	}

	.daynight-inventory-results-filterbar__fields {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		min-width: 0;
		width: 100%;
	}

	.daynight-inventory-results-filterbar__shortcuts {
		min-width: 0;
		width: 100%;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown
	) {
		background: #f8fafc !important;
		border-color: #d5dae1 !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		height: 44px !important;
		min-height: 44px !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown:hover:not(.is-selected)
	) {
		background: #fff !important;
		border-color: #bcc3cc !important;
		box-shadow: none !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.active
	) {
		background: #fff !important;
		border-color: #8b6811 !important;
		box-shadow: none !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.filter-select-dropdown__text
	) {
		color: #101828 !important;
		font-size: 14.5px !important;
		font-weight: 650 !important;
		padding-left: 14px !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected:hover
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected:focus-within
	) {
		background: #fff !important;
		border-color: #8b6811 !important;
		color: #101828 !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected.active
	) {
		box-shadow: none !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			.filter-select-dropdown__text
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			[data-daynight-quick-value]
	) {
		color: #101828 !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--grid
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			.filter-select-dropdown__clear
	) {
		color: #8b6811 !important;
	}

	.daynight-inventory-results-filterbar__advanced-toggle {
		align-items: center;
		background: #f8fafc;
		border: 1px solid #d5dae1;
		border-radius: 8px;
		box-shadow: none;
		color: #101828;
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		font-size: 14.5px;
		font-weight: 650;
		gap: 8px;
		height: 44px;
		justify-content: center;
		padding: 0 14px;
		white-space: nowrap;
	}

	.daynight-inventory-results-filterbar__advanced-toggle:hover {
		background: #fff;
		border-color: #bcc3cc;
		box-shadow: none;
	}

	.daynight-inventory-results-filterbar__advanced-toggle.has-selection {
		background: #fff;
		border-color: #8b6811;
		color: #101828;
	}

	.daynight-inventory-results-filterbar__advanced-toggle:focus-visible {
		outline: 2px solid #8b6811;
		outline-offset: 2px;
	}

	.daynight-inventory-results-filterbar__sort {
		min-width: 0;
		position: relative;
	}

	:global(
		.inventory-template-shell .daynight-inventory-results-filterbar__sort .daynight-sort-dropdown
	) {
		min-width: 0 !important;
		width: 100%;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-results-filterbar__sort
			.daynight-sort-dropdown.is-open
	) {
		z-index: 1301;
	}

	:global(
		.inventory-template-shell .daynight-inventory-results-filterbar__sort .core-dropdown__button
	) {
		background: #f8fafc !important;
		border: 1px solid #d5dae1 !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		height: 44px;
		min-height: 44px;
		min-width: 0;
		padding: 0 14px;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-results-filterbar__sort
			.core-dropdown__button:hover
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-results-filterbar__sort
			.core-dropdown__button:focus
	) {
		background: #fff !important;
		border-color: #bcc3cc !important;
		box-shadow: none !important;
	}

	:global(
		.inventory-template-shell .daynight-inventory-results-filterbar__sort .core-dropdown__selected
	) {
		color: #101828;
		font-size: 14.5px;
		font-weight: 650;
		line-height: 1;
	}

	:global(
		.inventory-template-shell .daynight-inventory-results-filterbar__sort .core-dropdown__icon
	) {
		height: 16px;
		width: 16px;
	}

	:global(
		.inventory-template-shell .daynight-inventory-results-filterbar__sort .core-dropdown__menu
	) {
		min-width: 220px;
	}

	.daynight-inventory-results-filterbar__count {
		align-items: center;
		background: #8b6811;
		border-radius: 999px;
		color: #fff;
		display: inline-flex;
		font-size: 11px;
		height: 20px;
		justify-content: center;
		min-width: 20px;
		padding: 0 5px;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pills
	) {
		display: flex !important;
		flex-wrap: nowrap !important;
		gap: 8px !important;
		justify-content: flex-start;
		min-height: 38px;
		width: 100% !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pill
	) {
		background: #fff !important;
		border-color: #d5dae1 !important;
		border-radius: 999px !important;
		box-shadow: none !important;
		color: #252b32 !important;
		font-size: 14px !important;
		font-weight: 600 !important;
		gap: 0 !important;
		height: 38px !important;
		min-height: 38px !important;
		padding: 0 16px !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pill
			svg
	) {
		display: none !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pill.is-active
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pill.is-selected
	) {
		background: #e11c2a !important;
		border-color: #e11c2a !important;
		color: #fff !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-results-filterbar
			.daynight-inventory-type-pill:hover:not(.is-active):not(.is-selected)
	) {
		background: #eef0f3 !important;
		border-color: #bcc3cc !important;
		box-shadow: none !important;
		color: #252b32 !important;
	}

	.daynight-inventory-results-filterbar__advanced {
		background: #fff;
		border: 1px solid #d7dee9;
		border-radius: 12px;
		box-shadow: 0 18px 48px rgba(16, 24, 40, 0.18);
		box-sizing: border-box;
		left: 0;
		padding: 14px;
		position: absolute;
		top: calc(100% + 8px);
		width: min(860px, calc(100vw - 96px));
		z-index: 1300;
	}

	.daynight-inventory-results-filterbar__advanced-head {
		align-items: flex-start;
		display: flex;
		gap: 16px;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.daynight-inventory-results-filterbar__advanced-head div {
		display: grid;
		gap: 2px;
	}

	.daynight-inventory-results-filterbar__advanced-head strong {
		color: #101828;
		font-size: 15px;
		line-height: 1.35;
	}

	.daynight-inventory-results-filterbar__advanced-head span {
		color: #667085;
		font-size: 12px;
		line-height: 1.4;
	}

	.daynight-inventory-results-filterbar__advanced-head button {
		align-items: center;
		background: #f2f4f7;
		border: 0;
		border-radius: 7px;
		color: #344054;
		cursor: pointer;
		display: inline-flex;
		height: 32px;
		justify-content: center;
		padding: 0;
		width: 32px;
	}

	.daynight-inventory-results-filterbar__advanced-grid {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 1350px) {
		:global(
			.inventory-template-shell
				.daynight-inventory-quick-form
				.daynight-inventory-results-filterbar
				.daynight-inventory-type-pills
		) {
			flex-wrap: wrap !important;
			gap: 4px !important;
		}

		:global(
			.inventory-template-shell
				.daynight-inventory-quick-form
				.daynight-inventory-results-filterbar
				.daynight-inventory-type-pill
		) {
			flex: 0 0 auto !important;
			font-size: 13px !important;
			padding: 0 6px !important;
		}
	}

	@media (max-width: 900px) {
		:global(
			.inventory-template-shell
				.daynight-inventory-quick-form
				.daynight-inventory-results-filterbar
				.daynight-inventory-type-pills
		) {
			flex-wrap: wrap !important;
			justify-content: flex-start;
		}
	}
</style>
