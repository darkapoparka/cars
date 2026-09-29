<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import InventoryFilterChoice from './InventoryFilterChoice.svelte';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	let {
		filter,
		english = false,
		selection = $bindable<string[]>([])
	}: { filter: AuxeroInventoryFilter; english?: boolean; selection?: string[] } = $props();
	const id = $props.id();
	let query = $state('');
	let input = $state<HTMLInputElement>();
	let root = $state<HTMLDivElement>();
	let options = $state<HTMLDivElement>();
	$effect(() => {
		// A new search starts at its first match, even after browsing the end of the list.
		void query;
		if (options) options.scrollTop = 0;
	});
	const searchable = $derived(
		['brand', 'model'].includes(filter.name) || filter.options.length > 8
	);
	const searchLabel = $derived(
		filter.name === 'brand'
			? english
				? 'Search makes'
				: 'Търси марка'
			: filter.name === 'model'
				? english
					? 'Search models'
					: 'Търси модел'
				: (english ? 'Search in ' : 'Търси в ') + filter.label
	);
	const matching = $derived(
		filter.options.filter((option) =>
			option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
		)
	);
	export function focusSearch() {
		(input ?? root?.querySelector<HTMLInputElement>('input'))?.focus({ preventScroll: true });
	}
	function toggle(value: string) {
		selection =
			filter.mode === 'single'
				? [value]
				: selection.includes(value)
					? selection.filter((item) => item !== value)
					: [...selection, value];
	}
</script>

<div class="desktop-picker" bind:this={root}>
	{#if searchable}<div class="filter-fields">
			<label class="filter-control"
				><Search size={20} aria-hidden="true" /><span class="sr-only">{searchLabel}</span><input
					bind:this={input}
					type="search"
					bind:value={query}
					placeholder={searchLabel}
					autocomplete="off"
					onkeydown={(event) => {
						if (event.key === 'Enter') event.preventDefault();
					}}
				/></label
			>
		</div>{/if}
	<div class="desktop-picker__options filter-options" bind:this={options}>
		{#each matching as option (option.value)}<InventoryFilterChoice
				label={option.label}
				image={option.image}
				mode={filter.mode}
				name={id + '-choice'}
				form={id + '-options'}
				checked={selection.includes(option.value)}
				onchange={() => toggle(option.value)}
			/>{:else}<p role="status">{english ? 'No matches' : 'Няма съвпадения'}</p>{/each}
	</div>
</div>

<style>
	.desktop-picker {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}
	.desktop-picker__options {
		flex: 1;
	}
</style>
