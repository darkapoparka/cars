<script lang="ts">
	import { page } from '$app/state';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	let { desktop, english = false }: { desktop: AuxeroInventoryDesktopData; english?: boolean } =
		$props();
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
	<form action={linkHref('/inventory')} class="inventory-display__sort">
		{#each [...page.url.searchParams].filter(([name]) => name !== 'sort') as [name, value], i (i)}<input
				type="hidden"
				{name}
				{value}
			/>{/each}
		<label
			><span class="sr-only">{desktop.sortLabel}</span><select
				name="sort"
				value={desktop.sortOptions.find((option) => option.active)?.value ??
					desktop.sortOptions[0]?.value}
				onchange={(event) => event.currentTarget.form?.requestSubmit()}
				>{#each desktop.sortOptions as option (option.value)}<option value={option.value}
						>{option.label}</option
					>{/each}</select
			></label
		>
		<noscript><button type="submit">{english ? 'Sort' : 'Подреди'}</button></noscript>
	</form>
	<div class="inventory-display__views">
		<details class="inventory-view" bind:this={viewMenu}>
			<summary><LayoutGrid size={18} aria-hidden="true" />{desktop.viewLabel}</summary>
			<nav aria-label={desktop.viewLabel}>
				{#each desktop.viewOptions as option (option.view)}<a
						href={linkHref(option.href)}
						aria-label={option.ariaLabel}
						aria-current={option.active ? 'true' : undefined}>{option.label}</a
					>{/each}
			</nav>
		</details>
		<Action
			href={desktop.layoutToggle.href}
			variant="quiet"
			size="compact"
			aria-label={desktop.layoutToggle.ariaLabel}
			aria-controls="inventory-results"
			class="inventory-toolbar__layout"
		>
			<PanelLeft size={18} aria-hidden="true" />{desktop.layoutToggle.label}
		</Action>
	</div>
</div>

<style>
	.inventory-display {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--bc-space-3);
	}
	.inventory-display__sort {
		margin: 0;
	}
	select,
	summary {
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-md);
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-3);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
	}
	.inventory-display__views {
		display: flex;
		align-items: center;
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
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
		min-width: 180px;
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
	.inventory-display__views :global(.inventory-toolbar__layout) {
		border-left: 1px solid var(--bc-border);
		border-radius: 0 var(--bc-radius-md) var(--bc-radius-md) 0;
		padding-inline: var(--bc-space-3);
		white-space: nowrap;
	}
</style>
