<script lang="ts">
	import type { InventoryQuickFilterOption } from '$lib/types/inventory';
	import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/body-scroll-lock';

	let {
		label,
		placeholder,
		optionQuery,
		visibleOptions,
		selectedValues,
		isMultiSelect,
		onQueryChange,
		onSelect,
		onClear,
		onClose
	}: {
		label: string;
		placeholder: string;
		optionQuery: string;
		visibleOptions: InventoryQuickFilterOption[];
		selectedValues: string[];
		isMultiSelect: boolean;
		onQueryChange: (value: string) => void;
		onSelect: (value: string) => void;
		onClear: () => void;
		onClose: () => void;
	} = $props();

	const searchPlaceholder = $derived(`Search ${label.toLocaleLowerCase('en-US')}...`);

	function handleQueryInput(event: Event) {
		if (event.target instanceof HTMLInputElement) {
			onQueryChange(event.target.value);
		}
	}

	function isSelected(value: string) {
		return selectedValues.includes(value);
	}

	function lockScroll() {
		lockBodyScroll();
		return () => unlockBodyScroll();
	}

	// Fixed modals must escape transformed filterbar ancestors so the backdrop
	// covers the viewport and stacks above the page.
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return () => {
			if (node.parentNode) node.remove();
		};
	}
</script>

<div
	class="daynight-hero-search-modal daynight-inventory-field-modal"
	{@attach portal}
	{@attach lockScroll}
>
	<button
		type="button"
		class="daynight-hero-search-modal__backdrop"
		aria-label="Close"
		onclick={onClose}
	></button>
	<div class="daynight-hero-search-modal__sheet" role="dialog" aria-modal="true" aria-label={label}>
		<div class="daynight-hero-search-modal__head">
			<h3 class="daynight-hero-search-modal__title">{label}</h3>
			<button
				type="button"
				class="daynight-hero-search-modal__close"
				aria-label="Close"
				onclick={onClose}>✕</button
			>
		</div>
		{#if isMultiSelect}
			<div class="daynight-hero-search-modal__searchwrap">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
					<path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
				<input
					type="text"
					class="daynight-hero-search-modal__search"
					placeholder={searchPlaceholder}
					aria-label={`Search ${label}`}
					autocomplete="off"
					value={optionQuery}
					oninput={handleQueryInput}
				/>
			</div>
		{/if}
		<div class="daynight-hero-search-modal__list" role="listbox">
			<button
				type="button"
				role="option"
				aria-selected={selectedValues.length === 0}
				class={[
					'daynight-hero-search-modal__row daynight-hero-search-modal__row--reset',
					{ 'is-selected': selectedValues.length === 0 }
				]}
				onclick={() => onSelect('')}
			>
				<span>{placeholder}</span>
				<span class="daynight-hero-search-modal__tick" aria-hidden="true">✓</span>
			</button>
			{#each visibleOptions as option (option.value)}
				<button
					type="button"
					role="option"
					aria-selected={isSelected(option.value)}
					class={['daynight-hero-search-modal__row', { 'is-selected': isSelected(option.value) }]}
					onclick={() => onSelect(option.value)}
				>
					<span>{option.label}</span>
					<span class="daynight-hero-search-modal__tick" aria-hidden="true">✓</span>
				</button>
			{/each}
			{#if visibleOptions.length === 0}
				<p class="daynight-hero-search-modal__empty">No results match your search.</p>
			{/if}
		</div>
		{#if isMultiSelect}
			<div class="daynight-hero-search-modal__actions">
				<button type="button" class="daynight-hero-search-modal__clear" onclick={onClear}>
					Clear
				</button>
				<button type="button" class="daynight-hero-search-modal__done" onclick={onClose}>
					Done
				</button>
			</div>
		{/if}
	</div>
</div>
