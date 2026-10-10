<script lang="ts">
	import { page } from '$app/state';
	import { inventoryDesktopControlsCopy } from '$lib/content/inventory-desktop-controls';
	import ArrowDownUp from '@lucide/svelte/icons/arrow-down-up';
	import Check from '@lucide/svelte/icons/check';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	let { desktop, english = false }: { desktop: AuxeroInventoryDesktopData; english?: boolean } =
		$props();
	const controlsCopy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	let sortMenu: HTMLDetailsElement;
	let viewMenu: HTMLDetailsElement;
	function dismissMenus(event: PointerEvent | FocusEvent) {
		if (!(event.target instanceof Node)) return;
		for (const menu of [sortMenu, viewMenu]) {
			if (menu?.open && !menu.contains(event.target)) menu.open = false;
		}
	}
	function handleMenuKey(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		const menu = [sortMenu, viewMenu].find((menu) => menu?.open);
		if (menu) {
			menu.open = false;
			menu.querySelector('summary')?.focus();
		}
	}
	function keepOneMenu(event: Event) {
		const opened = event.currentTarget as HTMLDetailsElement;
		if (!opened.open) return;
		for (const menu of [sortMenu, viewMenu]) {
			if (menu && menu !== opened) menu.open = false;
		}
	}
</script>

<svelte:document onpointerdown={dismissMenus} onfocusin={dismissMenus} onkeydown={handleMenuKey} />

<div class="inventory-display" role="group" aria-label={desktop.controlsLabel}>
	<details class="inventory-menu inventory-sort" bind:this={sortMenu} ontoggle={keepOneMenu}>
		<summary
			aria-label={controlsCopy.sortLabel + ': ' + desktop.selectedSort}
			title={desktop.selectedSort}
			><ArrowDownUp size={18} aria-hidden="true" />{controlsCopy.sortLabel}<ChevronDown
				size={16}
				aria-hidden="true"
			/></summary
		>
		<nav aria-label={controlsCopy.sortLabel}>
			<form
				action={linkHref('/inventory')}
				onsubmit={() => {
					sortMenu.open = false;
				}}
			>
				{#each [...page.url.searchParams].filter(([name]) => name !== 'sort') as [name, value], i (i)}<input
						type="hidden"
						{name}
						{value}
					/>{/each}
				{#each desktop.sortOptions as option (option.value)}<Action
						type="submit"
						name="sort"
						value={option.value}
						variant="quiet"
						size="compact"
						class="inventory-sort__option"
						aria-pressed={option.active}
						><span>{option.label}</span>{#if option.active}<Check
								size={18}
								aria-hidden="true"
							/>{/if}</Action
					>{/each}
			</form>
		</nav>
	</details>
	<details class="inventory-menu inventory-view" bind:this={viewMenu} ontoggle={keepOneMenu}>
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
					aria-current={option.active ? 'true' : undefined}
					onclick={() => (viewMenu.open = false)}>{option.label}</a
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
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: var(--bc-space-3);
	}
	summary {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		border: 1px solid transparent;
		border-radius: var(--bc-desktop-control-radius);
		min-height: var(--bc-control-height-primary);
		padding: 0 var(--bc-space-4);
		background: var(--bc-control);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		white-space: nowrap;
		list-style: none;
		cursor: pointer;
	}
	.inventory-menu {
		position: relative;
	}
	summary :global(svg) {
		flex-shrink: 0;
	}
	summary:hover,
	.inventory-menu[open] summary {
		background: var(--bc-control-hover);
		border-color: transparent;
	}
	.inventory-menu[open] summary :global(svg:last-child) {
		transform: rotate(180deg);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.inventory-menu nav {
		position: absolute;
		right: 0;
		top: calc(100% + var(--bc-space-2));
		z-index: 90;
		width: max-content;
		min-width: 240px;
		max-width: min(360px, calc(100vw - var(--bc-page-x) * 2));
		padding: var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-card);
		display: grid;
	}
	.inventory-menu form {
		margin: 0;
	}
	.inventory-menu a,
	.inventory-menu :global(.inventory-sort__option) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
		min-height: var(--bc-control-height-primary);
		padding: var(--bc-space-2) var(--bc-space-3);
		border-radius: var(--bc-radius-md);
		text-decoration: none;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
	}
	.inventory-menu :global(.inventory-sort__option) {
		width: 100%;
		border: 0;
		font-weight: var(--bc-weight-control);
	}
	.inventory-menu a:hover,
	.inventory-menu :global(.inventory-sort__option:hover) {
		background: var(--bc-surface-hover);
	}
	.inventory-menu a[aria-current='true'],
	.inventory-menu :global(.inventory-sort__option[aria-pressed='true']) {
		background: var(--bc-control-selected-surface);
		color: var(--bc-ink);
	}
	.inventory-menu a[aria-current='true']:hover,
	.inventory-menu :global(.inventory-sort__option[aria-pressed='true']:hover) {
		background: var(--bc-control-selected-hover);
	}
	summary:focus-visible,
	.inventory-menu a:focus-visible,
	.inventory-menu :global(.inventory-sort__option:focus-visible) {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
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
		white-space: normal;
	}
</style>
