<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { page } from '$app/state';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	import {
		inventoryFilterParam,
		parseInventoryQuery,
		serializeInventoryQuery
	} from '$lib/domain/inventory-query';
	import { linkHref } from '$lib/utils/links';
	import Action from '$lib/components/common/Action.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import InventoryFilterGroup from './InventoryFilterGroup.svelte';
	let { filter, english = false }: { filter: AuxeroInventoryFilter; english?: boolean } = $props();
	let open = $state(false);
	let selection = $state<string[] | null>(null);
	const formId = $props.id();
	const canonicalName = $derived(inventoryFilterParam(filter.name));
	const keep = $derived(
		[
			...serializeInventoryQuery(parseInventoryQuery(page.url.searchParams), page.url.searchParams)
		].filter(([name]) => name !== canonicalName && !(filter.name === 'brand' && name === 'q'))
	);
	function begin() {
		selection = [...filter.selectedValues];
		open = true;
	}
</script>

<button
	type="button"
	class="site-filter-trigger"
	data-active={filter.selectedValues.length > 0}
	aria-haspopup="dialog"
	aria-expanded={open}
	onclick={begin}
>
	<span class="filter-trigger-label"
		>{filter.selectedValues.length ? filter.selectedSummary : filter.label}</span
	><ChevronDown size={18} aria-hidden="true" />
</button>
<Modal bind:open title={filter.label}>
	<form
		id={formId}
		class="site-filter-dialog"
		action={linkHref('/inventory')}
		onsubmit={() => (open = false)}
	>
		{#each keep as [name, value], i (i)}<input type="hidden" {name} {value} />{/each}
		<InventoryFilterGroup
			{filter}
			{english}
			bind:selection
			expandedInitially
			showTitle={false}
			framed={false}
		/>
	</form>
	{#snippet footer()}
		<div class="filter-actions">
			<Action variant="secondary" onclick={() => (selection = [])}
				>{english ? 'Clear' : 'Изчисти'}</Action
			>
			<Action type="submit" form={formId}>{english ? 'Apply' : 'Приложи'}</Action>
		</div>
	{/snippet}
</Modal>

<style>
	.site-filter-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		min-height: var(--bc-route-pill-height);
		max-width: 240px;
		padding: 0 var(--bc-space-4);
		border: 1px solid var(--bc-route-pill-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		white-space: nowrap;
	}
	.site-filter-trigger:hover {
		background: var(--bc-surface);
		border-color: var(--bc-ink);
	}
	.site-filter-trigger[data-active='true'] {
		border-color: var(--bc-accent);
		color: var(--bc-accent);
	}
	.filter-trigger-label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.filter-actions {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}
</style>
