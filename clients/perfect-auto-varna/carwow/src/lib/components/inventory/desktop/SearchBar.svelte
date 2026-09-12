<script lang="ts">
	import { onMount } from 'svelte';
	import Search from '@lucide/svelte/icons/search';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';

	let {
		layoutMode = 'grid',
		searchId = 'daynight-inventory-search',
		onOpen
	}: { layoutMode?: 'grid' | 'sidebar'; searchId?: string; onOpen?: () => void } = $props();
	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});

	const filters = getDesktopInventoryContext();

	const searchPlaceholder = $derived(
		layoutMode === 'sidebar'
			? 'Търси по марка, модел, година...'
			: 'Търси по марка, модел, година, гориво, екстри...'
	);

	// Typing filters live (the store derives the grid reactively); submit/Enter only
	// closes any open popover and pushes the URL. The outer `.daynight-inventory-quick-form`
	// is itself a <form>, so this control must NOT nest another form.
	function submit() {
		if (onOpen) {
			onOpen();
			return;
		}
		filters.openField = '';
		filters.syncUrl();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			submit();
		}
	}
</script>

<div class="daynight-inventory-searchbar">
	<div class="daynight-inventory-search">
		<label class="daynight-inventory-searchbar__label" for={searchId}>Търсене</label>
		{#if onOpen}
			<button
				id={searchId}
				type="button"
				class="daynight-inventory-search__input daynight-inventory-search__trigger"
				class:has-query={!!filters.store.query}
				aria-label={filters.store.query
					? `Търсене: ${filters.store.query}`
					: 'Търсене на автомобили'}
				aria-haspopup="dialog"
				disabled={!hydrated}
				onclick={onOpen}>{filters.store.query || searchPlaceholder}</button
			>
		{:else}
			<input
				id={searchId}
				class="daynight-inventory-search__input"
				type="search"
				name="q"
				data-daynight-inventory-search-input
				autocomplete="off"
				placeholder={searchPlaceholder}
				bind:value={filters.store.query}
				onkeydown={handleKeydown}
			/>
		{/if}
		<button
			class="daynight-inventory-searchbar__submit"
			type="button"
			aria-label="Търси автомобили"
			title="Търси автомобили"
			aria-haspopup={onOpen ? 'dialog' : undefined}
			disabled={onOpen && !hydrated}
			data-daynight-inventory-search-action
			onclick={submit}
		>
			<Search size={20} strokeWidth={2} aria-hidden="true" />
			{#if !onOpen}<span>Търси</span>{/if}
		</button>
	</div>
</div>

<style>
	.daynight-inventory-search__trigger {
		text-align: left;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.daynight-inventory-search__trigger:not(.has-query) {
		color: #62676e !important;
	}
	.daynight-inventory-searchbar {
		display: grid;
		overflow: visible;
	}

	.daynight-inventory-search {
		position: relative;
	}

	.daynight-inventory-searchbar__label {
		display: block;
	}

	.daynight-inventory-search__input {
		background: #fff;
	}

	.daynight-inventory-searchbar__submit {
		align-items: center;
		border: 0;
		cursor: pointer;
		display: inline-flex;
		gap: 8px;
		justify-content: center;
	}

	:global(
		.inventory-template-shell [data-daynight-inventory-layout] .daynight-inventory-search__input
	) {
		box-sizing: border-box !important;
		box-shadow: none !important;
		display: block !important;
		min-width: 0 !important;
		width: 100% !important;
	}

	:global(
		.inventory-template-shell
			[data-daynight-inventory-layout]
			.daynight-inventory-search__input::placeholder
	) {
		color: #8a94a0 !important;
		font: inherit !important;
		font-size: inherit !important;
		font-weight: 500 !important;
		line-height: inherit !important;
		opacity: 1;
	}

	:global(.inventory-template-shell .daynight-inventory-search:focus-within) {
		border-color: #b00000 !important;
		overflow: visible;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-search
			.daynight-inventory-search__input:focus-visible
	) {
		outline: 0 !important;
	}

	:global(
		.inventory-template-shell
			[data-daynight-inventory-layout]
			.daynight-inventory-search:focus-within
			.daynight-inventory-search__input
	) {
		background: #fff !important;
		border-color: transparent !important;
		box-shadow: none !important;
		outline: 0 !important;
		outline-offset: 0;
	}

	:global(
		.inventory-template-shell
			[data-daynight-inventory-layout]
			.daynight-inventory-search__input:focus
	) {
		background: #fff !important;
		border-color: transparent !important;
		box-shadow: none !important;
		outline: 0 !important;
		outline-offset: 0;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-search
			.daynight-inventory-searchbar__submit:focus-visible
	) {
		outline: 2px solid #b00000 !important;
		outline-offset: 2px;
	}
</style>
