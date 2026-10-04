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
	<Action
		{href}
		type="submit"
		aria-label={actionLabel}
		title={actionLabel}
		class="desktop-search-control__action"
	>
		<Search size={20} aria-hidden="true" />
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
	button:focus-visible {
		outline-offset: -2px !important;
		box-shadow: none !important;
	}
	input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
			padding-block: 0;
		}
		.desktop-search-control__entry {
			font-size: var(--bc-text-search);
		}
		.desktop-search-control :global(.desktop-search-control__action) {
			/* Inset the round surface while retaining the shared 44px click target. */
			padding: var(--bc-space-1);
			border: 0;
			border-radius: var(--bc-radius-pill);
			background-clip: content-box;
		}
		.placeholder,
		input::placeholder {
			color: var(--bc-subtle);
		}
	}
</style>
