<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	let {
		filter,
		onopen,
		summary,
		expanded = false,
		embedded = false,
		inverse = false
	}: {
		filter: AuxeroInventoryFilter;
		onopen: () => void;
		expanded?: boolean;
		summary?: string;
		embedded?: boolean;
		inverse?: boolean;
	} = $props();
</script>

<button
	type="button"
	class="site-filter-trigger"
	class:site-filter-trigger--embedded={embedded}
	class:site-filter-trigger--inverse={inverse}
	data-active={Boolean(summary) || filter.selectedValues.length > 0}
	aria-haspopup="dialog"
	aria-expanded={expanded}
	aria-label={embedded || inverse
		? filter.label +
			(summary ? ': ' + summary : filter.selectedValues.length ? ': ' + filter.selectedSummary : '')
		: undefined}
	title={summary ?? (filter.selectedValues.length ? filter.selectedSummary : filter.label)}
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
			font-weight: var(--bc-weight-control);
			min-height: var(--bc-control-height-primary);
			min-width: 0;
			max-width: none;
			border-radius: var(--bc-radius-md);
			border-color: var(--bc-border-strong);
			background: var(--bc-surface-raised);
			padding-inline: var(--bc-space-3);
			gap: var(--bc-space-2);
		}
		.site-filter-trigger:hover,
		.site-filter-trigger[aria-expanded='true'] {
			border-color: var(--bc-ink);
			background: var(--bc-surface);
		}
		.site-filter-trigger[data-active='true'] {
			border-color: var(--bc-accent);
			background: var(--bc-accent-soft);
		}
		.site-filter-trigger :global(svg) {
			flex-shrink: 0;
			color: var(--bc-muted);
		}
		.site-filter-trigger--embedded {
			min-height: var(--bc-control-height-hero);
			border: 0;
			border-right: 1px solid var(--bc-border);
			border-radius: 0;
			background: transparent;
		}
		.site-filter-trigger--embedded[data-active='true'] {
			border-color: var(--bc-border);
			background: transparent;
		}
		.site-filter-trigger--inverse {
			border-color: var(--bc-glass-border);
			background: var(--bc-glass-surface);
			color: var(--bc-white);
			backdrop-filter: blur(12px);
		}
		.site-filter-trigger--inverse:hover,
		.site-filter-trigger--inverse[aria-expanded='true'],
		.site-filter-trigger--inverse[data-active='true'] {
			border-color: var(--bc-white);
			background: var(--bc-glass-hover);
			color: var(--bc-white);
		}
		.site-filter-trigger--inverse :global(svg) {
			color: inherit;
		}
	}
</style>
