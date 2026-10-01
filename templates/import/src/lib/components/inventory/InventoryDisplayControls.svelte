<script lang="ts">
	import { page } from '$app/state';
	import {
		inventoryDesktopControlsCopy,
		inventorySortButtonOrder
	} from '$lib/content/inventory-desktop-controls';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	let { desktop, english = false }: { desktop: AuxeroInventoryDesktopData; english?: boolean } =
		$props();
	const controlsCopy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	const sortButtons = $derived(
		inventorySortButtonOrder
			.map((value) => desktop.sortOptions.find((option) => option.value === value))
			.filter((option) => option !== undefined)
	);
	let viewMenu: HTMLDetailsElement;
	function dismissViewMenu(event: PointerEvent | FocusEvent) {
		if (event.target instanceof Node && !viewMenu?.contains(event.target) && viewMenu) {
			viewMenu.open = false;
		}
	}
	function handleViewKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && viewMenu?.open) {
			viewMenu.open = false;
			viewMenu.querySelector('summary')?.focus();
		}
	}
</script>

<svelte:document
	onpointerdown={dismissViewMenu}
	onfocusin={dismissViewMenu}
	onkeydown={handleViewKey}
/>

<div class="inventory-display" role="group" aria-label={desktop.controlsLabel}>
	<form
		action={linkHref('/inventory')}
		class="inventory-display__sort"
		aria-label={controlsCopy.sortLabel}
	>
		{#each [...page.url.searchParams].filter(([name]) => name !== 'sort') as [name, value], i (i)}<input
				type="hidden"
				{name}
				{value}
			/>{/each}
		<span class="inventory-sort-label">{controlsCopy.sortLabel}</span>
		<div class="inventory-sort-buttons">
			{#each sortButtons as option (option.value)}<Action
					type="submit"
					name="sort"
					value={option.value}
					variant="quiet"
					size="compact"
					class="inventory-sort-button"
					aria-label={option.label}
					title={option.label}
					aria-pressed={option.active}
					>{controlsCopy.sortButtons[option.value] ?? option.label}</Action
				>{/each}
		</div>
	</form>
	<details class="inventory-view" bind:this={viewMenu}>
		<summary
			><LayoutGrid size={18} aria-hidden="true" />{desktop.viewLabel}<ChevronDown
				size={16}
				aria-hidden="true"
			/></summary
		>
		<nav aria-label={desktop.viewLabel}>
			{#each desktop.viewOptions as option (option.view)}<a
					href={linkHref(option.href)}
					aria-label={option.ariaLabel}
					aria-current={option.active ? 'true' : undefined}>{option.label}</a
				>{/each}
			<div class="inventory-view__layout">
				<Action
					href={desktop.layoutToggle.href}
					variant="quiet"
					size="compact"
					aria-label={desktop.layoutToggle.ariaLabel}
					aria-controls="inventory-results"
					class="inventory-toolbar__layout"
					onclick={() => (viewMenu.open = false)}
				>
					<PanelLeft size={18} aria-hidden="true" />{desktop.layout === 'dashboard'
						? controlsCopy.hideFilterPanel
						: controlsCopy.showFilterPanel}
				</Action>
			</div>
		</nav>
	</details>
</div>

<style>
	.inventory-display {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--bc-space-4);
	}
	.inventory-display__sort {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--bc-space-2);
		margin: 0;
		min-width: 0;
	}
	.inventory-sort-label {
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		white-space: nowrap;
	}
	.inventory-sort-buttons {
		display: flex;
		gap: var(--bc-space-1);
	}
	.inventory-sort-buttons :global(.inventory-sort-button) {
		min-height: var(--bc-control-height-standard);
		padding-inline: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
		font-size: var(--bc-text-label);
		white-space: nowrap;
	}
	.inventory-sort-buttons :global(.inventory-sort-button:hover) {
		border-color: var(--bc-ink);
		background: var(--bc-surface);
	}
	.inventory-sort-buttons :global(.inventory-sort-button[aria-pressed='true']) {
		border-color: var(--bc-accent);
		background: var(--bc-accent-soft);
		color: var(--bc-accent);
	}
	summary {
		border: 0;
		border-radius: var(--bc-radius-sm);
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-2);
		background: transparent;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
	}
	.inventory-view {
		position: relative;
	}
	summary {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		border: 0;
		background: transparent;
		list-style: none;
		cursor: pointer;
	}
	summary:hover,
	.inventory-view[open] summary {
		background: var(--bc-surface);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.inventory-view nav {
		position: absolute;
		right: 0;
		top: calc(100% + var(--bc-space-2));
		z-index: 90;
		min-width: max-content;
		padding: var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-panel);
		display: grid;
	}
	.inventory-view a {
		display: flex;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border-radius: var(--bc-radius-md);
		text-decoration: none;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
	}
	.inventory-view a:hover,
	.inventory-view a[aria-current='true'] {
		background: var(--bc-surface-hover);
	}
	.inventory-view__layout {
		margin-top: var(--bc-space-2);
		padding-top: var(--bc-space-2);
		border-top: 1px solid var(--bc-border);
	}
	.inventory-view__layout :global(.inventory-toolbar__layout) {
		justify-content: flex-start;
		width: 100%;
		font-weight: var(--bc-weight-control);
		border-radius: var(--bc-radius-md);
		padding-inline: var(--bc-space-3);
		white-space: nowrap;
	}
	@media (max-width: 1199px) {
		.inventory-sort-label {
			display: none;
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.inventory-display__sort {
			justify-content: stretch;
		}
		.inventory-sort-buttons {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			width: 100%;
		}
	}
</style>
