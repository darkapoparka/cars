<script lang="ts">
	import { tick } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import Modal from '$lib/components/common/Modal.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { inventoryDesktopControlsCopy } from '$lib/content/inventory-desktop-controls';
	import { linkHref } from '$lib/utils/links';
	import type {
		AuxeroInventoryActiveFilter,
		AuxeroInventoryDesktopData
	} from '$lib/server/inventory-options';
	let {
		filters,
		english = false,
		onedit
	}: {
		filters: NonNullable<AuxeroInventoryDesktopData['activeFilters']>;
		english?: boolean;
		onedit: () => void;
	} = $props();
	const copy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	let open = $state(false);
	// Before hydration, native removal links remain horizontally scrollable.
	let visibleCount = $state(Infinity);
	const hiddenCount = $derived(Math.max(0, filters.chips.length - visibleCount));
	const disclosureLabel = $derived(
		visibleCount ? copy.moreFilters(hiddenCount) : copy.appliedFilterCount(filters.chips.length)
	);

	function fitChips(chips: AuxeroInventoryActiveFilter[]) {
		return (element: HTMLElement) => {
			const track = element.querySelector<HTMLElement>('[data-active-track]')!;
			const sizes = element.querySelector<HTMLElement>('[data-active-sizes]')!;
			const update = () => {
				const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
				const widths = [...sizes.querySelectorAll<HTMLElement>('[data-chip-size]')].map(
					(chip) => chip.getBoundingClientRect().width
				);
				const available = track.clientWidth;
				if (!available) {
					visibleCount = 0;
					open = false;
					return;
				}
				const total = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
				if (total <= available) {
					visibleCount = chips.length;
					return;
				}
				const moreWidth = sizes
					.querySelector<HTMLElement>('[data-more-size]')!
					.getBoundingClientRect().width;
				let used = 0;
				let count = 0;
				for (const width of widths) {
					const next = used + (count ? gap : 0) + width;
					if (next + gap + moreWidth > available) break;
					used = next;
					count++;
				}
				visibleCount = count;
			};
			const observer = new ResizeObserver(update);
			observer.observe(track);
			observer.observe(sizes);
			update();
			return () => observer.disconnect();
		};
	}
	async function editFilters() {
		open = false;
		await tick();
		onedit();
	}
</script>

<div
	class="inventory-active"
	role="group"
	aria-label={copy.appliedFilters}
	{@attach fitChips(filters.chips)}
>
	<a
		class="inventory-active__clear"
		href={linkHref(filters.clearHref)}
		aria-label={filters.clearLabel}
		title={filters.clearLabel}>{filters.clearLabel}</a
	>
	<div class="inventory-active__track" data-active-track>
		{#each filters.chips.slice(0, visibleCount) as chip (chip.href)}
			<a
				class="filter-chip"
				href={linkHref(chip.href)}
				aria-label={copy.removeFilter + chip.label}
				title={chip.label}><span>{chip.label}</span><X size={14} aria-hidden="true" /></a
			>
		{/each}
		{#if hiddenCount}
			<button
				type="button"
				class="filter-chip filter-chip--more"
				aria-label={copy.showAppliedFilters + ' (' + filters.chips.length + ')'}
				aria-haspopup="dialog"
				aria-expanded={open}
				onclick={() => (open = true)}>{disclosureLabel}</button
			>
		{/if}
	</div>
	<div class="inventory-active__measurement" aria-hidden="true">
		<div class="inventory-active__sizes" data-active-sizes>
			{#each filters.chips as chip (chip.href)}
				<span class="filter-chip" data-chip-size
					><span>{chip.label}</span><X size={14} aria-hidden="true" /></span
				>
			{/each}
			<span class="filter-chip filter-chip--more" data-more-size
				>{copy.moreFilters(filters.chips.length)}</span
			>
		</div>
	</div>
</div>

<Modal bind:open title={copy.appliedFilters} class="inventory-active-dialog">
	<div class="inventory-active-dialog__chips">
		{#each filters.chips as chip (chip.href)}
			<a
				class="filter-chip"
				href={linkHref(chip.href)}
				aria-label={copy.removeFilter + chip.label}
				onclick={() => (open = false)}
				><span>{chip.label}</span><X size={14} aria-hidden="true" /></a
			>
		{/each}
	</div>
	{#snippet footer()}
		<div class="inventory-active-dialog__actions">
			<Action href={filters.clearHref} variant="quiet" onclick={() => (open = false)}
				>{filters.clearLabel}</Action
			>
			<Action onclick={editFilters}>{copy.editFilters}</Action>
		</div>
	{/snippet}
</Modal>

<style>
	.inventory-active {
		position: relative;
		display: flex;
		flex: 1 1 auto;
		align-items: center;
		gap: var(--bc-space-2);
		min-width: 0;
	}
	.inventory-active__track {
		display: flex;
		flex: 1 1 auto;
		align-items: center;
		gap: var(--bc-space-2);
		min-width: 0;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
	}
	.filter-chip {
		display: inline-flex;
		flex: none;
		align-items: center;
		gap: var(--bc-space-1);
		min-height: 32px;
		max-width: 240px;
		padding: var(--bc-space-1) var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font: var(--bc-weight-body) var(--bc-text-meta)/var(--bc-leading-control) var(--bc-font-body);
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
	}
	.filter-chip > span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.filter-chip :global(svg) {
		flex: none;
	}
	.filter-chip--more {
		max-width: 100%;
		padding-inline: var(--bc-space-2);
		font-variant-numeric: tabular-nums;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.inventory-active__clear {
		display: inline-flex;
		flex: none;
		align-items: center;
		min-height: 32px;
		padding-inline: var(--bc-space-1);
		border-radius: var(--bc-radius-xs);
		color: var(--bc-copy);
		font: var(--bc-weight-body) var(--bc-text-meta)/var(--bc-leading-control) var(--bc-font-body);
		text-decoration: none;
		white-space: nowrap;
	}
	.filter-chip:hover {
		background: var(--bc-control-hover);
		color: var(--bc-ink);
	}
	.inventory-active__clear:hover {
		color: var(--bc-ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.filter-chip:focus-visible,
	.inventory-active__clear:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: -2px;
	}
	.inventory-active__measurement {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		visibility: hidden;
		pointer-events: none;
	}
	.inventory-active__sizes {
		display: flex;
		width: max-content;
	}
	.inventory-active-dialog__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.inventory-active-dialog__chips .filter-chip {
		max-width: 100%;
		white-space: normal;
	}
	.inventory-active-dialog__chips .filter-chip > span {
		overflow: visible;
		overflow-wrap: anywhere;
	}
	.inventory-active-dialog__actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}
</style>
