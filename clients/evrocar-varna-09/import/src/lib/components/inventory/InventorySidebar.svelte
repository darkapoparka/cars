<script lang="ts">
	import { page } from '$app/state';
	import {
		inventoryFilterParam,
		parseInventoryQuery,
		serializeInventoryQuery
	} from '$lib/domain/inventory-query';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	import { linkHref } from '$lib/utils/links';
	import InventoryFilterGroup from './InventoryFilterGroup.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	let { desktop, english }: { desktop: AuxeroInventoryDesktopData; english: boolean } = $props();
	const passthrough = $derived.by(() => {
		const params = serializeInventoryQuery(
			parseInventoryQuery(page.url.searchParams),
			page.url.searchParams
		);
		for (const filter of desktop.sidebar.filters) params.delete(inventoryFilterParam(filter.name));
		return [...params];
	});
</script>

<aside class="inventory-sidebar" aria-label={desktop.sidebar.title}>
	{#key page.url.search}
		<form action={linkHref('/inventory')} method="GET">
			{#each passthrough as [name, value], index (index)}<input
					type="hidden"
					{name}
					{value}
				/>{/each}
			<header>
				<h2>{desktop.sidebar.title}</h2>
				<Action href={desktop.sidebar.actions.clearHref} variant="quiet" size="compact"
					>{desktop.sidebar.actions.clearLabel}</Action
				>
			</header>
			{#each desktop.sidebar.filters as filter, index (filter.id)}
				<details open={index === 0 || filter.selectedValues.length > 0}>
					<summary>
						<span class="inventory-sidebar__label"
							>{filter.label}
							{#if filter.selectedValues.length}<small>{filter.selectedSummary}</small>{/if}
						</span>
						<ChevronDown size={18} aria-hidden="true" />
					</summary>
					<InventoryFilterGroup {filter} {english} framed={false} showTitle={false} />
				</details>
			{/each}
			<Action type="submit" size="primary">{english ? 'Apply filters' : 'Приложи филтрите'}</Action>
		</form>
	{/key}
</aside>

<style>
	.inventory-sidebar {
		align-self: start;
		padding: var(--bc-space-5);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-desktop-card-radius);
		background: var(--bc-card-bg);
		box-shadow: var(--bc-editorial-shadow);
	}
	form {
		display: grid;
		gap: var(--bc-space-4);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-desktop-card-heading)/var(--bc-leading-h4)
			var(--bc-font-body);
	}
	details {
		border-top: 1px solid var(--bc-border);
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-primary);
		padding-block: var(--bc-space-3);
		font-size: var(--bc-text-label);
		list-style: none;
		cursor: pointer;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.inventory-sidebar__label {
		min-width: 0;
		display: grid;
		gap: var(--bc-space-1);
	}
	summary small {
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		overflow-wrap: anywhere;
	}
	summary :global(svg) {
		flex-shrink: 0;
		color: var(--bc-copy);
	}
	details[open] summary :global(svg) {
		transform: rotate(180deg);
	}
	summary:hover {
		color: var(--bc-accent);
	}
	summary:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
		border-radius: var(--bc-radius-md);
	}
</style>
