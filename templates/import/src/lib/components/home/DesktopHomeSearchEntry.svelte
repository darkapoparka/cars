<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import Action from '$lib/components/common/Action.svelte';

	let {
		id,
		value,
		placeholder,
		actionLabel,
		href,
		open,
		onopen
	}: {
		id: string;
		value: string;
		placeholder: string;
		actionLabel: string;
		href: string;
		open: boolean;
		onopen: () => void;
	} = $props();
</script>

<div class="home-hero__search">
	<button
		{id}
		class="home-search-entry"
		type="button"
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={onopen}
	>
		<span>{value || placeholder}</span>
	</button>
	<Action {href} aria-label={actionLabel} title={actionLabel} class="home-search-action">
		<Search size={22} aria-hidden="true" />
	</Action>
</div>

<style>
	.home-hero__search {
		display: flex;
		align-items: stretch;
		gap: var(--bc-space-1);
		min-width: 0;
		min-height: var(--bc-control-height-hero);
		padding: var(--bc-space-1);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		transition: border-color var(--bc-motion-fast);
	}
	.home-hero__search:hover {
		border-color: var(--bc-border-strong);
	}
	.home-hero__search:focus-within {
		border-color: var(--bc-focus);
	}
	.home-search-entry {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding: 0 var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--bc-text-search-trigger);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-search);
		text-align: left;
	}
	.home-search-entry:focus-visible {
		outline-offset: -2px !important;
		box-shadow: none !important;
	}
	.home-search-entry span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.home-hero__search :global(.home-search-action) {
		align-self: center;
		flex: none;
		width: var(--bc-control-height-standard);
		padding: 0;
		border-radius: var(--bc-radius-md);
	}
</style>
