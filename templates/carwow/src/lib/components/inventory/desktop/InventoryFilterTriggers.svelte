<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import '$lib/styles/desktop-discovery.css';
	import { onMount } from 'svelte';
	import Plus from '@lucide/svelte/icons/plus';
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
	function openFromTrigger(event: MouseEvent, name?: string) {
		if (event.currentTarget instanceof HTMLElement)
			event.currentTarget.focus({ preventScroll: true });
		onOpen(name);
	}
</script>

<div class="inventory-filter-triggers" class:inventory-filter-triggers--sidebar={sidebar}>
	{#if sidebar}<h2>{i18n.t('copy.182fd6b7e7e5')}</h2>{/if}
	{#each visible as field (field.name)}
		{@const selected = inventory.getFieldValues(field.name)}
		<button
			type="button"
			disabled={!hydrated}
			class:has-selection={selected.length > 0}
			aria-haspopup="dialog"
			onclick={(event) => openFromTrigger(event, field.name)}
		>
			<span
				>{selected.length === 1
					? i18n.spec(
							field.options.find((option) => option.value === selected[0])?.label ?? field.label
						)
					: selected.length
						? i18n.text(field.label) + ' (' + selected.length + ')'
						: i18n.text(field.label)}</span
			><Plus size={16} aria-hidden="true" />
		</button>
	{/each}
	<button
		type="button"
		disabled={!hydrated}
		class="all-filters"
		aria-haspopup="dialog"
		onclick={(event) => openFromTrigger(event)}
		><SlidersHorizontal size={18} /><span
			>{sidebar ? i18n.t('copy.dadecddc582b') : i18n.t('copy.1d58508bde13')}</span
		></button
	>
</div>

<style>
	.inventory-filter-triggers {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 12px;
		background: var(--discovery-panel);
		border-radius: 12px;
		padding: 12px;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 52px;
		min-width: 0;
		padding: 0 14px;
		border: 1px solid var(--discovery-filter-border);
		border-radius: 8px;
		color: var(--discovery-filter-foreground);
		background: #fff;
		font: var(--sa-button-font-weight) var(--sa-text-base) / var(--sa-button-line-height)
			var(--sa-font);
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
		background: var(--discovery-filter-hover);
		border-color: var(--discovery-filter-hover);
	}
	button.has-selection {
		color: #fff;
		border-color: var(--discovery-action);
		background: var(--discovery-action);
	}
	button.has-selection:hover {
		background: var(--discovery-action-hover);
		border-color: var(--discovery-action-hover);
	}
	button:focus-visible {
		outline: 2px solid var(--discovery-action);
		outline-offset: 3px;
	}
	.all-filters {
		justify-content: center;
	}
	.inventory-filter-triggers--sidebar {
		grid-template-columns: minmax(0, 1fr);
		padding: 20px;
		border: 1px solid #e1e4e7;
		align-self: start;
	}
	h2 {
		font: var(--sa-weight-strong) var(--sa-text-card-title)/1.2 var(--sa-font);
		margin: 0 0 8px;
	}
</style>
