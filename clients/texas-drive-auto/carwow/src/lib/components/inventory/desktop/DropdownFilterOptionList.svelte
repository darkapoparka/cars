<script lang="ts">
	import type { InventoryQuickFilterOption } from '$lib/types/inventory';

	let {
		fieldId,
		label,
		placeholder,
		optionQuery,
		visibleOptions,
		selectedValues,
		hasSelection,
		isMultiSelect,
		isSearchable,
		onQueryChange,
		onSelect,
		onClear,
		onDone
	}: {
		fieldId: string;
		label: string;
		placeholder: string;
		optionQuery: string;
		visibleOptions: InventoryQuickFilterOption[];
		selectedValues: string[];
		hasSelection: boolean;
		isMultiSelect: boolean;
		isSearchable: boolean;
		onQueryChange: (value: string) => void;
		onSelect: (value: string) => void;
		onClear: () => void;
		onDone: () => void;
	} = $props();

	const searchPlaceholder = $derived(`Search ${label.toLocaleLowerCase('en-US')}...`);

	function handleQueryInput(event: Event) {
		if (event.target instanceof HTMLInputElement) {
			onQueryChange(event.target.value);
		}
	}
</script>

{#if isSearchable}
	<div class="filter-select-dropdown__searchwrap">
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			focusable="false"
		>
			<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
			<path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<input
			class="filter-select-dropdown__search"
			type="search"
			data-daynight-quick-option-search
			placeholder={searchPlaceholder}
			aria-label={`Search ${label}`}
			autocomplete="off"
			value={optionQuery}
			oninput={handleQueryInput}
		/>
	</div>
{/if}

<div class="filter-select-dropdown__list">
	<label class="filter-checkbox">
		<input
			type={isMultiSelect ? 'checkbox' : 'radio'}
			name={fieldId}
			value=""
			data-daynight-quick-option
			data-daynight-clear-option="true"
			checked={!hasSelection}
			onchange={() => onSelect('')}
		/>
		<span>{placeholder}</span>
	</label>
	{#each visibleOptions as option (option.value)}
		<label class="filter-checkbox">
			<input
				type={isMultiSelect ? 'checkbox' : 'radio'}
				name={fieldId}
				value={option.value}
				data-daynight-quick-option
				data-daynight-option-brands={option.brands?.length ? option.brands.join('|') : undefined}
				checked={selectedValues.includes(option.value)}
				onchange={() => onSelect(option.value)}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
	{#if visibleOptions.length === 0}
		<p class="filter-select-dropdown__empty">No results match your search.</p>
	{/if}
</div>

{#if isMultiSelect}
	<div class="filter-select-dropdown__foot">
		<button
			type="button"
			class="filter-select-dropdown__menu-clear"
			data-daynight-quick-menu-clear
			onclick={onClear}
		>
			Clear
		</button>
		<button
			type="button"
			class="filter-select-dropdown__done"
			data-daynight-quick-done
			onclick={onDone}
		>
			Done
		</button>
	</div>
{/if}

<style>
	.filter-select-dropdown__searchwrap {
		padding: 0 0 10px;
		position: relative;
	}

	.filter-select-dropdown__searchwrap svg {
		color: #98a2b3;
		left: 12px;
		position: absolute;
		top: 13px;
	}

	.filter-select-dropdown__search {
		background: #fff !important;
		border: 1px solid #e2e8f0 !important;
		border-radius: 8px !important;
		box-sizing: border-box;
		box-shadow: none !important;
		color: #344054 !important;
		font-size: 16px !important;
		font-weight: 400 !important;
		height: 42px !important;
		line-height: 22px !important;
		outline: none;
		padding: 0 12px 0 38px !important;
		text-rendering: auto;
		width: 100% !important;
		-webkit-font-smoothing: auto;
	}

	.filter-select-dropdown__search:focus {
		border-color: #B00000 !important;
		box-shadow: none !important;
	}

	.filter-select-dropdown__list {
		align-content: start;
		box-sizing: border-box;
		display: grid;
		flex: 1 1 auto;
		gap: 0;
		grid-auto-rows: 40px;
		max-height: none;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0;
		scrollbar-width: thin;
	}

	.filter-select-dropdown__list .filter-checkbox {
		box-sizing: border-box;
		color: #101828;
		cursor: pointer;
		display: block;
		min-height: 40px;
		padding: 0;
		position: relative;
	}

	.filter-select-dropdown__list .filter-checkbox input {
		block-size: 1px !important;
		inline-size: 1px !important;
		inset: 50% auto auto 18px !important;
		margin: 0 !important;
		opacity: 0 !important;
		position: absolute !important;
	}

	.filter-select-dropdown__list .filter-checkbox span {
		align-items: center;
		background: #fff;
		border: 0;
		border-radius: 8px;
		box-sizing: border-box;
		color: #101828 !important;
		display: flex !important;
		font-size: 16px !important;
		font-weight: 400 !important;
		line-height: 22px !important;
		min-height: 40px;
		min-width: 0;
		overflow-wrap: normal;
		padding: 7px 12px 7px 40px !important;
		position: relative;
		text-rendering: auto;
		transition:
			background 120ms ease,
			color 120ms ease;
		white-space: normal;
		width: 100% !important;
		-webkit-font-smoothing: auto;
		word-break: normal;
	}

	.filter-select-dropdown__list .filter-checkbox:hover span,
	.filter-select-dropdown__list .filter-checkbox:focus-within span {
		background: #f5f8ff;
		color: #101828 !important;
	}

	.filter-select-dropdown__list .filter-checkbox span::before {
		background: #fff !important;
		background-image: none !important;
		border: 1.5px solid #c9d1df;
		border-radius: 5px;
		box-sizing: border-box;
		content: '' !important;
		height: 19px;
		left: 12px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 19px;
	}

	.filter-select-dropdown__list .filter-checkbox span::after {
		color: #fff;
		content: '✓';
		font-size: 12px;
		font-weight: 700;
		left: 16px;
		line-height: 1;
		opacity: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-52%);
	}

	.filter-select-dropdown__list .filter-checkbox input:checked + span {
		background: #eef4ff;
		box-shadow: none;
		color: #101828 !important;
		font-weight: 600 !important;
	}

	.filter-select-dropdown__list .filter-checkbox input:checked + span::before {
		background: #B00000 !important;
		border-color: #B00000;
		box-shadow: none;
	}

	.filter-select-dropdown__list .filter-checkbox input:checked + span::after {
		opacity: 1;
	}

	.filter-select-dropdown__list .filter-checkbox:hover input:checked + span,
	.filter-select-dropdown__list .filter-checkbox:focus-within input:checked + span {
		background: #e1ecff;
	}

	.filter-select-dropdown__list .filter-checkbox input:focus-visible + span::before {
		outline: 2px solid rgba(176, 0, 0, 0.62);
		outline-offset: 2px;
	}

	:global(.filter-select-dropdown--single)
		.filter-select-dropdown__list
		.filter-checkbox
		span::before {
		border-radius: 999px;
	}

	:global(.filter-select-dropdown--single)
		.filter-select-dropdown__list
		.filter-checkbox
		span::after {
		background: #fff;
		border-radius: 999px;
		content: '';
		height: 7px;
		left: 18px;
		top: 50%;
		transform: translateY(-50%);
		width: 7px;
	}

	.filter-select-dropdown__empty {
		color: #98a2b3;
		font-size: 16px;
		line-height: 1.35;
		margin: 0;
		padding: 14px 12px 18px;
	}

	.filter-select-dropdown__foot {
		align-items: center;
		border-top: 1px solid #e9edf4;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		padding: 10px 0 0;
	}

	.filter-select-dropdown__menu-clear,
	.filter-select-dropdown__done {
		appearance: none;
		border: 0;
		cursor: pointer;
		font: inherit;
	}

	.filter-select-dropdown__menu-clear {
		background: #f8fafc;
		border-radius: 8px;
		color: #394150;
		font-size: 16px;
		font-weight: 500;
		min-height: 36px;
		padding: 0 14px;
	}

	.filter-select-dropdown__done {
		background: #B00000;
		border-radius: 8px;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		min-height: 36px;
		padding: 0 16px;
	}

	.filter-select-dropdown__done:hover {
		background: #8A0000;
	}

	.filter-select-dropdown__menu-clear:focus-visible,
	.filter-select-dropdown__done:focus-visible {
		outline: 2px solid #B00000;
		outline-offset: 2px;
	}
</style>
