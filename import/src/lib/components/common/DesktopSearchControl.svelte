<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import Action from './Action.svelte';
	const generatedId = $props.id();
	let {
		id = generatedId,
		value = $bindable(''),
		label,
		placeholder = label,
		actionLabel,
		name = 'keyword',
		controls,
		href,
		expanded = false,
		onopen,
		class: className = ''
	}: {
		id?: string;
		value?: string;
		label: string;
		placeholder?: string;
		actionLabel: string;
		name?: string;
		controls?: string;
		href?: string;
		expanded?: boolean;
		onopen?: () => void;
		class?: string;
	} = $props();
</script>

<div class={['desktop-search-control', className]}>
	<div class="desktop-search-control__field">
		{#if onopen}
			<button
				{id}
				class="desktop-search-control__entry"
				class:placeholder={!value}
				type="button"
				aria-label={value ? label + ': ' + value : label}
				aria-haspopup="dialog"
				aria-expanded={expanded}
				aria-controls={controls}
				onclick={onopen}
			>
				<span>{value || placeholder}</span>
			</button>
		{:else}
			<label class="sr-only" for={id}>{label}</label>
			<input
				{id}
				class="desktop-search-control__entry"
				type="search"
				{name}
				bind:value
				{placeholder}
				aria-controls={controls}
				autocomplete="off"
			/>
		{/if}
	</div>
	<Action
		{href}
		type="submit"
		aria-label={actionLabel}
		title={actionLabel}
		class="desktop-search-control__action"
	>
		<span class="desktop-search-control__action-icon" aria-hidden="true"><Search size={20} /></span>
	</Action>
</div>

<style>
	.desktop-search-control {
		display: flex;
		align-items: stretch;
		gap: var(--bc-space-1);
		min-width: 0;
		min-height: var(--bc-control-height-hero);
		padding: var(--bc-space-1);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-desktop-control-radius, var(--bc-radius-pill));
		background: var(--bc-control);
		color: var(--bc-ink);
		transition: border-color var(--bc-motion-fast);
	}
	.desktop-search-control:hover {
		border-color: var(--bc-border-strong);
	}
	.desktop-search-control:focus-within {
		border-color: var(--bc-focus);
	}
	.desktop-search-control:has(input:focus-visible) {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	.desktop-search-control__entry {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding: 0 var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-desktop-control-radius, var(--bc-radius-pill));
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--bc-text-entry);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		text-align: start;
	}
	.placeholder,
	input::placeholder {
		color: var(--bc-copy);
		opacity: 1;
	}
	button.desktop-search-control__entry {
		--control-focus-offset: -2px;
		--control-focus-shadow: none;
	}
	input.desktop-search-control__entry {
		--control-focus-outline: none;
		--control-focus-shadow: none;
	}
	span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.desktop-search-control__field {
		display: contents;
	}
	.desktop-search-control__action-icon {
		display: flex;
	}
	.desktop-search-control :global(.desktop-search-control__action) {
		align-self: center;
		flex: none;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		padding: 0;
		border-radius: var(--bc-radius-pill);
	}
	@media (min-width: 768px) {
		.desktop-search-control {
			gap: 0;
			min-height: var(--bc-desktop-search-height);
			padding: 1px;
			border: 1px solid transparent;
			border-radius: var(--bc-radius-control);
			background: var(--bc-desktop-control-surface);
		}
		.desktop-search-control:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
		.desktop-search-control:focus-within {
			border-color: var(--bc-focus);
		}
		.desktop-search-control__field {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
		}
		.desktop-search-control__entry {
			align-self: stretch;
			padding-inline: var(--bc-space-4);
			font-size: var(--bc-text-search);
		}
		.desktop-search-control :global(.desktop-search-control__action) {
			min-height: var(--bc-control-height-standard);
			border: 0;
			background: transparent;
		}
		.desktop-search-control__action-icon {
			display: grid;
			place-items: center;
			width: var(--bc-control-height-compact);
			height: var(--bc-control-height-compact);
			border-radius: var(--bc-radius-pill);
			background: var(--desktop-search-action-background, var(--bc-accent));
			color: var(--bc-accent-contrast);
		}
		.desktop-search-control__action-icon :global(svg) {
			width: 18px;
			height: 18px;
		}
		.desktop-search-control :global(.desktop-search-control__action:hover) {
			--desktop-search-action-background: var(--bc-accent-hover);
			background: transparent;
		}
		.placeholder,
		input::placeholder {
			color: var(--bc-copy);
		}
	}
</style>
