<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	let {
		mode = 'input',
		value = $bindable(''),
		label,
		placeholder = label,
		name = 'q',
		controls,
		expanded = false,
		onclick
	}: {
		mode?: 'input' | 'trigger';
		value?: string;
		label: string;
		placeholder?: string;
		name?: string;
		controls?: string;
		expanded?: boolean;
		onclick?: () => void;
	} = $props();
	const id = $props.id();
</script>

<div class="mobile-search-control">
	{#if mode === 'trigger'}
		<button
			type="button"
			class="mobile-search-control__label"
			aria-haspopup="dialog"
			aria-expanded={expanded}
			{onclick}
		>
			<span>{placeholder}</span>
		</button>
	{:else}
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
	{/if}
	<button
		type={mode === 'input' ? 'submit' : 'button'}
		class="mobile-search-control__action"
		aria-label={label}
		aria-haspopup={mode === 'trigger' ? 'dialog' : undefined}
		aria-expanded={mode === 'trigger' ? expanded : undefined}
		{onclick}
	>
		<Search size={20} strokeWidth={2.25} aria-hidden="true" />
	</button>
</div>

<style>
	.mobile-search-control {
		display: flex;
		min-width: 0;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		gap: 10px;
		padding: var(--bc-mobile-entry-inset) var(--bc-mobile-entry-inset) var(--bc-mobile-entry-inset)
			var(--bc-space-4);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		box-shadow: none;
	}
	.mobile-search-control__label,
	input {
		min-width: 0;
		flex: 1 1 auto;
		border: 0;
		background: transparent;
		color: var(--bc-ink);
		padding: 0;
		text-align: left;
		font: inherit;
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
	}
	.mobile-search-control__label {
		display: flex;
		align-items: center;
		align-self: stretch;
		cursor: pointer;
	}
	.mobile-search-control__label span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	input {
		width: 100%;
	}
	input::placeholder {
		color: var(--bc-ink);
		opacity: 1;
	}
	input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	.mobile-search-control:has(input:focus-visible) {
		outline: 3px solid var(--bc-accent-tint);
	}
	.mobile-search-control__action {
		display: flex;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--bc-control-height-standard);
		border: 4px solid transparent !important;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-dark-surface);
		background-clip: padding-box;
		box-shadow: none !important;
		color: var(--bc-white);
		cursor: pointer;
		padding: 0;
	}
	.mobile-search-control__action:focus-visible {
		background-color: var(--bc-dark-hover);
		outline: 0;
	}
	.mobile-search-control__action :global(svg),
	.mobile-search-control__action :global(path),
	.mobile-search-control__action :global(circle),
	.mobile-search-control__action :global(line) {
		flex: 0 0 auto;
		color: var(--bc-white);
		stroke: var(--bc-white) !important;
	}
</style>
