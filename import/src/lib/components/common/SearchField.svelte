<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import type { Snippet } from 'svelte';
	let {
		value = $bindable(''),
		label,
		placeholder = label,
		name = 'q',
		controls,
		children
	}: {
		value?: string;
		label: string;
		placeholder?: string;
		name?: string;
		controls?: string;
		children?: Snippet;
	} = $props();
	const id = $props.id();
</script>

<div class="search-field" class:search-field--action={Boolean(children)}>
	<Search size={22} aria-hidden="true" />
	<label class="sr-only" for={id}>{label}</label>
	<input
		{id}
		type="search"
		{name}
		bind:value
		{placeholder}
		aria-controls={controls}
		autocomplete="off"
	/>
	{@render children?.()}
</div>

<style>
	.search-field {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-hero);
		padding: var(--bc-space-3) var(--bc-space-5);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
	}
	.search-field:focus-within {
		outline: 3px solid var(--bc-accent-tint);
		border-color: var(--bc-accent);
	}
	.search-field--action {
		padding: var(--bc-space-1) var(--bc-space-1) var(--bc-space-1) var(--bc-space-4);
	}
	.search-field :global(svg),
	.search-field :global(.site-action) {
		flex: none;
	}
	input {
		width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--bc-text-entry);
		line-height: var(--bc-leading-control);
	}
	input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	input::placeholder {
		color: var(--bc-copy);
		opacity: 1;
	}
	@media (max-width: 767.98px) {
		.search-field {
			min-height: var(--bc-control-height-primary);
			padding: 0 var(--bc-space-4);
			border: 0;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-mobile-search-surface, var(--bc-white));
		}
		.search-field--action {
			padding: var(--bc-mobile-control-inset) var(--bc-mobile-control-inset)
				var(--bc-mobile-control-inset) var(--bc-space-4);
		}
		.search-field > :global(svg) {
			width: var(--bc-control-icon-size-primary);
			height: var(--bc-control-icon-size-primary);
		}
	}
	@media (min-width: 768px) {
		.search-field {
			border-color: transparent;
			background: var(--bc-control);
		}
		.search-field:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
		.search-field:focus-within {
			border-color: var(--bc-focus);
		}
	}
</style>
