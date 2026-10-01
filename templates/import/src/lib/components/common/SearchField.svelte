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
</style>
