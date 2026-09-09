<script lang="ts">
	import SortDropdown from './SortDropdown.svelte';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import PanelLeft from '@lucide/svelte/icons/panel-left';

	let {
		layoutMode,
		listView,
		onViewChange,
		onSidebarChange
	}: {
		layoutMode: 'grid' | 'sidebar';
		listView: boolean;
		onViewChange: (list: boolean) => void;
		onSidebarChange: () => void;
	} = $props();

	const filters = getDesktopInventoryContext();
	const count = $derived(filters.resultCount);
	const hasTags = $derived(filters.hasRenderedTags);

	function clearAll() {
		filters.openField = '';
		filters.clearAll();
		filters.syncUrl();
	}
</script>

<div class="daynight-inventory-listing-controls">
	<div class="daynight-inventory-results-toolbar">
		<div class="daynight-inventory-results-count-cell">
			<p class="daynight-inventory-result-count">
				<span id="filterMatchesCount">{count}</span> автомобила
			</p>
		</div>
		<div class="inventory-toolbar-actions">
			<div class="daynight-inventory-sort-control">
				<SortDropdown />
			</div>
			<div class="inventory-view-buttons" aria-label="Изглед на автомобилите">
				<button
					type="button"
					aria-label="Решетка"
					aria-pressed={!listView}
					onclick={() => onViewChange(false)}><LayoutGrid size={18} /></button
				>
				<button
					type="button"
					aria-label="Списък"
					aria-pressed={listView}
					onclick={() => onViewChange(true)}><List size={19} /></button
				>
				<button
					type="button"
					aria-label="Филтри в лява колона"
					aria-pressed={layoutMode === 'sidebar'}
					onclick={onSidebarChange}><PanelLeft size={18} /></button
				>
			</div>
		</div>
	</div>
</div>
<div
	class={[
		'daynight-inventory-applied-filters',
		'daynight-inventory-results-active-filters',
		hasTags && 'is-active',
		hasTags && 'has-active-tags',
		hasTags && 'has-rendered-tags'
	]}
	id="filterResults"
	data-daynight-has-tags={hasTags ? 'true' : undefined}
	aria-live="polite"
	aria-label={hasTags
		? `Активни филтри: ${filters.appliedTags.map((tag) => tag.label).join(', ')}`
		: 'Активни филтри'}
	hidden={!hasTags}
	style:display={hasTags ? '' : 'none'}
>
	<div id="filterTags" class="daynight-inventory-applied-filters__tags">
		{#each filters.appliedTags as tag (tag.field + '|' + tag.value)}
			<button
				class="select-item"
				type="button"
				data-daynight-clear-field={tag.field}
				data-daynight-clear-value={tag.value}
				aria-label={`Премахни филтър ${tag.label}`}
				title={tag.label}
				onclick={() => filters.removeTag(tag.field, tag.value)}
			>
				<span class="select-item__label">{tag.label}</span>
				<img src="/assets/icons/X.svg" alt="" aria-hidden="true" class="filter-icon" />
			</button>
		{/each}
	</div>
	<button
		class="btn-clear-items"
		id="btnClearAll"
		hidden={!hasTags}
		style:display={hasTags ? '' : 'none'}
		onclick={clearAll}
	>
		Изчисти
		<img src="/assets/icons/X-White.svg" alt="" aria-hidden="true" />
	</button>
</div>

<style>
	:global(.inventory-refined .daynight-inventory-listing-controls) {
		background: transparent !important;
		border: 0 !important;
		min-height: 44px !important;
		margin: 0 0 12px !important;
		padding: 0 !important;
	}
	:global(.inventory-refined .daynight-inventory-results-toolbar) {
		display: flex !important;
		align-items: center !important;
		justify-content: space-between !important;
		gap: 20px;
		margin: 0 !important;
		padding: 0 !important;
		min-height: 44px;
	}
	:global(.inventory-refined .daynight-inventory-result-count) {
		font: 500 17px/1.4 var(--sa-font) !important;
		color: #454d55 !important;
		margin: 0 !important;
	}
	:global(.inventory-refined .daynight-inventory-result-count span) {
		font-weight: 750 !important;
		color: #161a1d;
	}
	.inventory-toolbar-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.inventory-view-buttons {
		display: flex;
		gap: 2px;
		border: 1px solid #dce0e4;
		border-radius: 9px;
		padding: 3px;
		background: #fff;
	}
	.inventory-view-buttons button {
		width: 38px;
		height: 36px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #646b73;
		cursor: pointer;
	}
	.inventory-view-buttons button[aria-pressed='true'] {
		color: #fff;
		background: #171b1e;
	}
	.inventory-view-buttons button:focus-visible {
		outline: 2px solid #d50028;
		outline-offset: 2px;
	}
</style>
