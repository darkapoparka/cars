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
		appearance = 'default',
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
		appearance?: 'default' | 'compact';
		name?: string;
		controls?: string;
		href?: string;
		expanded?: boolean;
		onopen?: () => void;
		class?: string;
	} = $props();
</script>

<div class={['desktop-search-control', className]} class:compact={appearance === 'compact'}>
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
				<span class="desktop-search-control__leading-icon" aria-hidden="true"
					><Search size={20} /></span
				>
				<span>{value || placeholder}</span>
			</button>
		{:else}
			<label class="desktop-search-control__leading-icon" for={id} aria-hidden="true"
				><Search size={20} /></label
			>
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
		<span class="desktop-search-control__action-label" aria-hidden="true">{actionLabel}</span>
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
	.desktop-search-control__action-label {
		display: none;
	}
	.desktop-search-control__field {
		display: contents;
	}
	.desktop-search-control__leading-icon {
		display: none;
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
			min-height: var(--bc-control-height-primary);
			gap: var(--bc-space-3);
			padding: 0;
			border: 0;
			background: transparent;
		}
		.desktop-search-control:has(input:focus-visible) {
			outline: none;
		}
		.desktop-search-control__field {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
			min-height: var(--bc-control-height-primary);
			border: 1px solid var(--bc-border-strong);
			border-radius: var(--bc-desktop-control-radius);
			background: var(--bc-surface-raised);
		}
		.desktop-search-control__field:hover {
			border-color: var(--bc-ink);
		}
		.desktop-search-control__field:focus-within {
			border-color: var(--bc-focus);
		}
		.desktop-search-control__field:has(input:focus-visible) {
			outline: 3px solid var(--bc-focus);
			outline-offset: 3px;
		}
		.desktop-search-control__leading-icon {
			display: flex;
			flex: none;
			color: var(--bc-muted);
		}
		label.desktop-search-control__leading-icon {
			margin-left: var(--bc-space-4);
		}
		.desktop-search-control__entry {
			align-self: stretch;
			gap: var(--bc-space-3);
			font-size: var(--bc-text-search);
		}
		button.desktop-search-control__entry {
			padding-inline: var(--bc-space-4);
		}
		.desktop-search-control :global(.desktop-search-control__action) {
			width: auto;
			min-height: var(--bc-control-height-primary);
			padding: 0 var(--bc-space-6);
			border: 0;
			border-radius: var(--bc-desktop-control-radius);
			background-clip: border-box;
			font-size: var(--bc-text-search);
		}
		.desktop-search-control__action-icon {
			display: none;
		}
		.desktop-search-control__action-label {
			display: inline;
		}
		.placeholder,
		input::placeholder {
			color: var(--bc-subtle);
		}
		.desktop-search-control.compact {
			gap: 0;
			min-height: var(--bc-control-height-primary);
			padding: 1px;
			border: 1px solid var(--bc-border-strong);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-surface-raised);
		}
		.desktop-search-control.compact:has(input:focus-visible) {
			outline: 3px solid var(--bc-focus);
			outline-offset: 3px;
		}
		.compact .desktop-search-control__field {
			min-height: 0;
			border: 0;
			background: transparent;
		}
		.compact .desktop-search-control__field:has(input:focus-visible) {
			outline: none;
		}
		.compact .desktop-search-control__entry {
			padding-inline: var(--bc-space-4);
			font-size: var(--bc-text-search);
		}
		.compact .desktop-search-control__leading-icon,
		.compact .desktop-search-control__action-label {
			display: none;
		}
		.compact .desktop-search-control__action-icon {
			display: flex;
		}
		.compact :global(.desktop-search-control__action) {
			width: var(--bc-control-height-standard);
			min-height: var(--bc-control-height-standard);
			height: var(--bc-control-height-standard);
			padding: 0;
			border: 0;
			border-radius: var(--bc-radius-pill);
			background: transparent;
			color: var(--bc-copy);
		}
		.compact :global(.desktop-search-control__action:hover) {
			background: var(--bc-surface-hover);
			color: var(--bc-ink);
		}
	}
</style>
