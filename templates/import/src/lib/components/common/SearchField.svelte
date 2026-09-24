<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	let {
		value = $bindable(''),
		label,
		name = 'q',
		controls
	}: {
		value?: string;
		label: string;
		name?: string;
		controls?: string;
	} = $props();
</script>

<label class="search-field">
	<Search size={22} aria-hidden="true" />
	<span class="sr-only">{label}</span>
	<input
		type="search"
		{name}
		bind:value
		placeholder={label}
		aria-controls={controls}
		autocomplete="off"
	/>
</label>

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
