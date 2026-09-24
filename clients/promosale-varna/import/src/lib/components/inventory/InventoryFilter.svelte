<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	let {
		filter,
		onopen,
		summary,
		expanded = false
	}: {
		filter: AuxeroInventoryFilter;
		onopen: () => void;
		expanded?: boolean;
		summary?: string;
	} = $props();
</script>

<button
	type="button"
	class="site-filter-trigger"
	data-active={Boolean(summary) || filter.selectedValues.length > 0}
	aria-haspopup="dialog"
	aria-expanded={expanded}
	onclick={onopen}
>
	<span class="filter-trigger-label"
		>{summary ?? (filter.selectedValues.length ? filter.selectedSummary : filter.label)}</span
	><ChevronDown size={18} aria-hidden="true" />
</button>

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
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-heading);
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
	@media (min-width: 768px) {
		.site-filter-trigger {
			min-height: var(--bc-control-height-primary);
			padding-inline: var(--bc-space-3);
			gap: var(--bc-space-2);
		}
	}
</style>
