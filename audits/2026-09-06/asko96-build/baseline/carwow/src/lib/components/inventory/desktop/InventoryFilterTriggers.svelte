<script lang="ts">
	import '$lib/styles/desktop-discovery.css';
	import { onMount } from 'svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';
	let {
		filters,
		sidebar = false,
		onOpen
	}: {
		filters: InventoryQuickFilterGroup[];
		sidebar?: boolean;
		onOpen: (name?: string) => void;
	} = $props();
	const inventory = getDesktopInventoryContext();
	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});
	const visible = $derived(
		filters.filter(
			(field) => sidebar || ['brand', 'model', 'price', 'mileage', 'fuel'].includes(field.name)
		)
	);
</script>

<div class="inventory-filter-triggers" class:inventory-filter-triggers--sidebar={sidebar}>
	{#if sidebar}<h2>Филтри</h2>{/if}
	{#each visible as field (field.name)}
		{@const selected = inventory.getFieldValues(field.name)}
		<button
			type="button"
			disabled={!hydrated}
			class:has-selection={selected.length > 0}
			aria-haspopup="dialog"
			onclick={() => onOpen(field.name)}
		>
			<span
				>{selected.length === 1
					? (field.options.find((option) => option.value === selected[0])?.label ?? field.label)
					: selected.length
						? `${field.label} (${selected.length})`
						: field.label}</span
			><ChevronDown size={16} />
		</button>
	{/each}
	<button
		type="button"
		disabled={!hydrated}
		class="all-filters"
		aria-haspopup="dialog"
		onclick={() => onOpen()}
		><SlidersHorizontal size={18} /><span>{sidebar ? 'Всички филтри' : 'Още филтри'}</span></button
	>
</div>

<style>
	.inventory-filter-triggers {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 10px;
		background: #fff;
		border-radius: 12px;
		padding: 12px;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 46px;
		min-width: 0;
		padding: 0 14px;
		border: 1px solid #d7dee7;
		border-radius: 8px;
		color: #161a1d;
		background: #f7f8fa;
		font: 500 15px/1.3 var(--sa-font);
		cursor: pointer;
	}
	button span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	button span,
	button :global(svg),
	button :global(svg *) {
		color: inherit !important;
	}
	button :global(svg) {
		flex-shrink: 0;
	}
	button:hover {
		background: #f0f1f2;
		border-color: #aeb4ba;
	}
	button.has-selection {
		border-color: var(--sa-red);
		background: #fff7f8;
	}
	button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
	.all-filters {
		justify-content: center;
		background: #fff;
		border-color: #aeb4ba;
	}
	.inventory-filter-triggers--sidebar {
		grid-template-columns: minmax(0, 1fr);
		padding: 20px;
		border: 1px solid #e1e4e7;
		align-self: start;
	}
	h2 {
		font: 700 22px/1.2 var(--sa-font);
		margin: 0 0 8px;
	}
</style>
