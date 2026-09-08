<script lang="ts">
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import DropdownFilterControl from './DropdownFilterControl.svelte';
	import InventoryQuickFilterModalStyles from './InventoryQuickFilterModalStyles.svelte';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';

	let {
		filters,
		layoutMode = 'grid',
		filterUxMode = 'popover',
		onSidebarChange
	}: {
		filters: InventoryQuickFilterGroup[];
		layoutMode?: 'grid' | 'sidebar';
		filterUxMode?: 'popover' | 'modal';
		onSidebarChange?: () => void;
	} = $props();

	const inventory = getDesktopInventoryContext();

	// One shared outside-click/Escape closer for the whole filterbar — only ONE
	// inline popover is ever open (tracked by `inventory.openField`). A per-field
	// handler would race when switching directly between two open dropdowns.
	function handleDocumentClick(event: MouseEvent) {
		if (!inventory.openField) return;
		const target = event.target;
		// The per-field modal is portaled to <body> (outside the dropdown), so it
		// must also be excluded or selecting an option would close it.
		if (
			target instanceof Element &&
			!target.closest('[data-daynight-quick-dropdown]') &&
			!target.closest('.daynight-hero-search-modal')
		) {
			inventory.openField = '';
		}
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && inventory.openField) inventory.openField = '';
	}

	function openSidebar() {
		inventory.openField = '';
		onSidebarChange?.();
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleDocumentKeydown} />
<svelte:window onresize={() => (inventory.openField = '')} />

<div
	class="daynight-inventory-filter-group daynight-inventory-filterbar daynight-inventory-filterbar--{filterUxMode}"
>
	<button
		class="daynight-inventory-filter-toggle daynight-inventory-quick-sidebar"
		type="button"
		data-daynight-open-sidebar
		aria-label="Филтри"
		onclick={openSidebar}
	>
		<img src="/assets/icons/filter.svg" alt="" aria-hidden="true" />
		<span class="daynight-inventory-quick-sidebar__label">Филтри</span>
	</button>
	{#each filters as filter (filter.name)}
		<DropdownFilterControl {filter} {layoutMode} {filterUxMode} />
	{/each}
</div>

<!-- Shared per-field modal styles (.daynight-hero-search-modal); needed when
     filterUxMode === 'modal'. Rendered once for the whole filterbar. -->
<InventoryQuickFilterModalStyles />

<style>
	:global(.inventory-template-shell) .daynight-inventory-filterbar {
		display: grid !important;
		gap: 8px;
		grid-template-columns:
			minmax(128px, 0.9fr) minmax(132px, 1.08fr) minmax(132px, 1.08fr)
			minmax(112px, 0.9fr) minmax(112px, 0.9fr) minmax(120px, 0.95fr)
			minmax(124px, 1fr) minmax(112px, 0.9fr) minmax(124px, 1fr);
		justify-content: stretch;
		overflow: visible;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar) {
		background: var(--sa-red) !important;
		border: 1px solid var(--sa-red) !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		color: #fff !important;
		display: inline-flex;
		align-items: center;
		font-size: var(--sa-text-inventory-control);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-inventory-control);
		gap: 8px;
		height: 56px !important;
		min-height: 56px;
		justify-content: center;
		min-width: 0;
		padding: 0 16px !important;
		width: 100%;
	}

	:global(
		.inventory-template-shell
			[data-daynight-filter-ux='modal']
			.daynight-inventory-filterbar
			.daynight-inventory-quick-sidebar
	) {
		border-radius: 10px !important;
		gap: 9px;
		justify-content: center;
		min-width: 0;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar__label
	) {
		color: inherit;
		line-height: var(--sa-leading-inventory-control);
		white-space: nowrap;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar:hover
	) {
		background: var(--sa-red-strong) !important;
		border-color: var(--sa-red-strong) !important;
		box-shadow: none !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-quick-sidebar:focus-visible
	) {
		background: var(--sa-red-strong) !important;
		border-color: #fff !important;
		box-shadow: none !important;
		outline: 2px solid var(--sa-red) !important;
		outline-offset: 2px;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar img
	) {
		filter: brightness(0) invert(1) !important;
		height: 18px;
		width: 18px;
	}

	@media (max-width: 1240px) {
		:global(.inventory-template-shell) .daynight-inventory-filterbar {
			grid-template-columns: 52px repeat(4, minmax(0, 1fr));
			overflow: visible;
			padding-bottom: 0;
		}

		:global(
			.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar__label
		) {
			display: none;
		}

		:global(
			.inventory-template-shell
				[data-daynight-filter-ux='modal']
				.daynight-inventory-filterbar
				.daynight-inventory-quick-sidebar__label
		) {
			display: inline;
		}

		:global(
			.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar
		) {
			grid-row: 1 / span 2;
			height: auto;
			min-height: 100%;
		}

		:global(
			.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-filter-field
		) {
			min-width: 0;
		}
	}

	@media (max-width: 991px) {
		:global(.inventory-template-shell) .daynight-inventory-filterbar {
			grid-template-columns: 52px repeat(2, minmax(0, 1fr));
		}

		:global(
			.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-sidebar
		) {
			grid-row: 1;
			min-height: 56px;
		}
	}
</style>
