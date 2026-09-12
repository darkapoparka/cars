<script lang="ts">
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import { getQuickDisplayLabel } from '$lib/utils/daynight-quick-filter-dom';
	import DropdownFilterModal from './DropdownFilterModal.svelte';
	import DropdownFilterOptionList from './DropdownFilterOptionList.svelte';

	let {
		filter,
		layoutMode = 'grid',
		filterUxMode = 'popover'
	}: {
		filter: InventoryQuickFilterGroup;
		layoutMode?: 'grid' | 'sidebar';
		filterUxMode?: 'popover' | 'modal';
	} = $props();

	const filters = getDesktopInventoryContext();

	const fieldId = $derived(`daynight-quick-${filter.name}`);
	const menuId = $derived(`${fieldId}-menu`);
	const placeholder = $derived(filter.placeholder);
	const closedPlaceholder = $derived(layoutMode === 'grid' ? filter.label : filter.placeholder);
	const isMultiSelect = $derived(['brand', 'model', 'feature'].includes(filter.name));
	const isSearchable = $derived(isMultiSelect || filter.options.length > 9);

	let optionQuery = $state('');
	const isOpen = $derived(filters.openField === filter.name);

	const selectedValues = $derived(filters.getFieldValues(filter.name));
	const hasSelection = $derived(selectedValues.length > 0);

	function labelFor(value: string) {
		return filter.options.find((option) => option.value === value)?.label ?? value;
	}

	// Closed-state summary — mirrors the legacy `quickSelectionSummary` so the
	// e2e label assertions (`Audi + BMW`, `2 екстри`, `N модела`) keep matching.
	const visibleLabel = $derived.by(() => {
		if (!selectedValues.length) return closedPlaceholder;
		const display = selectedValues.map((value) =>
			getQuickDisplayLabel(filter.name, value, labelFor(value))
		);
		if (display.length === 1) return display[0];
		if (filter.name === 'feature') return `${display.length} екстри`;
		if (filter.name === 'model') return `${display.length} модела`;
		if (display.length === 2) return `${display[0]} + ${display[1]}`;
		return `${display[0]} + още ${display.length - 1}`;
	});

	const fullLabel = $derived(
		selectedValues.length ? selectedValues.map(labelFor).join(', ') : placeholder
	);

	// Searchable menus filter their visible options by the in-menu query; the Модел
	// menu additionally hides options outside the chosen brand(s).
	const visibleOptions = $derived.by(() => {
		const needle = optionQuery.trim().toLocaleLowerCase('bg-BG');
		return filter.options.filter((option) => {
			if (
				filter.name === 'model' &&
				!filters.isModelVisibleForBrands(option.value, option.brands)
			) {
				return false;
			}
			if (!needle) return true;
			return option.label.toLocaleLowerCase('bg-BG').includes(needle);
		});
	});

	function toggleOpen() {
		optionQuery = '';
		filters.openField = isOpen ? '' : filter.name;
	}

	function toggleOption(value: string) {
		if (!value) {
			filters.setFieldValues(filter.name, []);
			filters.syncUrl();
			return;
		}
		if (isMultiSelect) {
			// Keep selections in OPTION order (alphabetical), NOT click order — the
			// legacy runtime read `:checked` in DOM order, and the e2e asserts
			// `getAll('brand') === ['Audi','BMW']` + label "Audi + BMW".
			const selectedSet = selectedValues.includes(value)
				? selectedValues.filter((item) => item !== value)
				: [...selectedValues, value];
			const next = filter.options
				.map((option) => option.value)
				.filter((optionValue) => selectedSet.includes(optionValue));
			filters.setFieldValues(filter.name, next);
		} else {
			filters.setFieldValues(filter.name, [value]);
			filters.openField = '';
		}
		filters.syncUrl();
	}

	function clearField() {
		filters.setFieldValues(filter.name, []);
		filters.openField = '';
		filters.syncUrl();
	}

	// "Прозорец" mode opens a per-field modal instead of the inline popover.
	const useModal = $derived(filterUxMode === 'modal');

	function closeField() {
		filters.openField = '';
	}

	function updateOptionQuery(value: string) {
		optionQuery = value;
	}
</script>

<div
	class="daynight-inventory-filter-field daynight-inventory-quick-field daynight-inventory-quick-field--{filter.name}"
>
	<div
		class={[
			'daynight-inventory-filter-dropdown filter-select-dropdown',
			{
				'filter-select-dropdown--multi': isMultiSelect,
				'filter-select-dropdown--single': !isMultiSelect,
				'filter-select-dropdown--searchable': isSearchable,
				active: isOpen && !useModal,
				'is-selected': hasSelection
			}
		]}
		data-name={filter.label}
		data-placeholder={closedPlaceholder}
		data-daynight-quick-dropdown
		data-daynight-multi-select={isMultiSelect ? 'true' : undefined}
	>
		<label for={fieldId} class="daynight-inventory-filter-dropdown__label">{filter.label}</label>
		<button
			type="button"
			class="filter-select-dropdown__text"
			id={fieldId}
			aria-expanded={isOpen}
			aria-controls={menuId}
			aria-label={`${filter.label}: ${fullLabel}`}
			title={fullLabel}
			onclick={toggleOpen}
		>
			<span data-daynight-quick-value>{visibleLabel}</span>
		</button>
		<button
			type="button"
			class="filter-select-dropdown__clear"
			data-daynight-quick-clear
			disabled={!hasSelection}
			tabindex={hasSelection ? 0 : -1}
			aria-label={`Изчисти ${filter.label}`}
			title={`Изчисти ${filter.label}`}
			onclick={clearField}
		>
			<span aria-hidden="true">x</span>
		</button>
		<div
			class="filter-select-dropdown__menu"
			id={menuId}
			role={isMultiSelect ? 'group' : 'radiogroup'}
			aria-label={filter.label}
			aria-hidden={!isOpen}
		>
			<DropdownFilterOptionList
				{fieldId}
				label={filter.label}
				{placeholder}
				{optionQuery}
				{visibleOptions}
				{selectedValues}
				{hasSelection}
				{isMultiSelect}
				{isSearchable}
				onQueryChange={updateOptionQuery}
				onSelect={toggleOption}
				onClear={clearField}
				onDone={() => (filters.openField = '')}
			/>
		</div>
		{#if useModal && isOpen}
			<DropdownFilterModal
				label={filter.label}
				{placeholder}
				{optionQuery}
				{visibleOptions}
				{selectedValues}
				{isMultiSelect}
				onQueryChange={(value) => (optionQuery = value)}
				onSelect={toggleOption}
				onClear={clearField}
				onClose={closeField}
			/>
		{/if}
	</div>
</div>

<style>
	.daynight-inventory-filter-dropdown {
		background-image: none !important;
		cursor: pointer;
		position: relative;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar) {
		overflow: visible;
	}

	:global(
		.inventory-template-shell [data-daynight-inventory-layout='grid'] .daynight-inventory-filterbar
	) {
		background: transparent !important;
		border: 0 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		gap: 8px !important;
		padding: 0 !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-quick-field) {
		min-width: 0;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-filter-dropdown
	) {
		align-items: center !important;
		background: #edf3fa !important;
		border: 1px solid #cbd8e8 !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		box-sizing: border-box !important;
		color: #1f2937 !important;
		display: flex !important;
		height: 56px !important;
		min-height: 56px !important;
		overflow: visible !important;
		padding: 0 !important;
		position: relative !important;
		transition:
			background 160ms ease,
			border-color 160ms ease;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--sidebar
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown
	) {
		background: #f7f8fa !important;
		border-color: #d5dbe4 !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		height: 50px !important;
		min-height: 50px !important;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-filter-dropdown:hover
	) {
		background: #e6eef8 !important;
		border-color: #b8c8db !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--sidebar
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown:hover:not(.is-selected)
	) {
		background: #f0f2f5 !important;
		border-color: #c0c7d2 !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown:focus-within
	) {
		border-color: #B00000 !important;
		outline: 0 !important;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .daynight-inventory-filter-dropdown.active
	) {
		background: #f8fbff !important;
		border-color: #B00000 !important;
		box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.14) !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--sidebar
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.active
	) {
		background: #fff !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown
			.daynight-inventory-filter-dropdown__label
	) {
		block-size: 1px !important;
		clip: rect(0 0 0 0) !important;
		clip-path: inset(50%) !important;
		inline-size: 1px !important;
		margin: -1px !important;
		overflow: hidden !important;
		position: absolute !important;
		white-space: nowrap !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown__text) {
		align-items: center !important;
		background: transparent !important;
		border: 0 !important;
		box-sizing: border-box;
		color: #1f2937 !important;
		cursor: pointer;
		display: flex !important;
		font: inherit;
		font-size: var(--sa-text-inventory-control) !important;
		font-weight: 600 !important;
		height: 100% !important;
		inset: 0 !important;
		line-height: var(--sa-leading-inventory-control) !important;
		min-width: 0 !important;
		padding: 0 34px 0 14px !important;
		position: absolute !important;
		text-align: left;
		width: 100%;
		z-index: 2;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-viewport--sidebar
			.daynight-inventory-filterbar
			.filter-select-dropdown__text
	) {
		font-size: 15px !important;
		padding-inline: 14px 40px !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar [data-daynight-quick-value]) {
		color: inherit !important;
		display: block !important;
		font: inherit !important;
		line-height: var(--sa-leading-inventory-control) !important;
		min-width: 0 !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		white-space: nowrap !important;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown__text::after
	) {
		border-bottom: 2px solid currentColor;
		border-right: 2px solid currentColor;
		content: '';
		height: 7px !important;
		position: absolute;
		right: 14px !important;
		top: 50% !important;
		transform: translateY(-50%) rotate(45deg) !important;
		transition: transform 160ms ease;
		width: 7px !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown.active) {
		position: relative;
		z-index: 1200 !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.filter-select-dropdown.active
			> .filter-select-dropdown__text::after
	) {
		transform: translateY(-35%) rotate(225deg) !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
	) {
		background: #B00000 !important;
		border-color: #B00000 !important;
		color: #fff !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected:hover
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected:focus-within
	) {
		background: #8A0000 !important;
		border-color: #8A0000 !important;
		color: #fff !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			.filter-select-dropdown__text
	) {
		color: #fff !important;
		padding-right: 46px !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			[data-daynight-quick-value]
	) {
		color: #fff !important;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			> .filter-select-dropdown__text::after
	) {
		display: none !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown__clear) {
		align-items: center;
		background: #f3f6fb;
		border: 1px solid #d5deea;
		border-radius: 999px;
		color: #475467;
		cursor: pointer;
		display: none;
		font-size: 13px;
		font-weight: 600;
		height: 28px;
		justify-content: center;
		line-height: 1;
		position: absolute;
		right: 8px;
		text-transform: none;
		top: 50%;
		transform: translateY(-50%);
		width: 28px;
		z-index: 5;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			.filter-select-dropdown__clear
	) {
		background: rgba(255, 255, 255, 0.94);
		border-color: rgba(255, 255, 255, 0.76);
		color: #B00000;
		display: inline-flex;
	}

	:global(
		.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown__clear:hover
	) {
		background: #eef4ff;
		border-color: #c8dcff;
		color: #B00000;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.daynight-inventory-filter-dropdown.is-selected
			.filter-select-dropdown__clear:hover
	) {
		background: #fff;
		border-color: #fff;
		color: #8A0000;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.filter-select-dropdown__clear:focus-visible
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.filter-select-dropdown__text:focus-visible
	) {
		outline: 2px solid #B00000 !important;
		outline-offset: 2px;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-filterbar
			.filter-select-dropdown.active
			> .filter-select-dropdown__menu
	) {
		opacity: 1 !important;
		pointer-events: auto;
		transform: translateY(0) !important;
		transition:
			opacity 110ms ease-out,
			transform 110ms ease-out !important;
		visibility: visible !important;
	}

	:global(.inventory-template-shell .daynight-inventory-filterbar .filter-select-dropdown__menu) {
		background: #fff !important;
		border: 1px solid #d7e3f8 !important;
		border-radius: 10px !important;
		box-sizing: border-box;
		box-shadow:
			0 0 0 1px rgba(176, 0, 0, 0.08),
			0 14px 28px rgba(16, 24, 40, 0.14) !important;
		display: flex !important;
		flex-direction: column;
		left: 0;
		max-height: min(360px, calc(100vh - 260px));
		max-width: calc(100vw - 64px);
		min-width: 100%;
		opacity: 0 !important;
		overflow: hidden;
		padding: 6px;
		pointer-events: none;
		/* Absolute overlay — app.css used to supply this; without it the closed menu
		   reserves layout space and the open popover dumps in-flow instead of floating. */
		position: absolute !important;
		right: auto;
		top: calc(100% + 6px);
		transform: translateY(-4px) !important;
		transition: none !important;
		visibility: hidden !important;
		width: min(264px, calc(100vw - 64px));
		z-index: 1000 !important;
	}

	.daynight-inventory-quick-field--brand .filter-select-dropdown__menu,
	.daynight-inventory-quick-field--model .filter-select-dropdown__menu {
		width: min(340px, calc(100vw - 64px));
	}

	.daynight-inventory-quick-field--mileage .filter-select-dropdown__menu,
	.daynight-inventory-quick-field--body .filter-select-dropdown__menu,
	.daynight-inventory-quick-field--feature .filter-select-dropdown__menu {
		left: auto;
		right: 0;
	}

	.daynight-inventory-quick-field--feature .filter-select-dropdown__menu {
		width: min(440px, calc(100vw - 64px));
	}
</style>
