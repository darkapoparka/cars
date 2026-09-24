<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { assetHref } from '$lib/utils/assets';
	let {
		label,
		image,
		checked,
		onchange,
		mode = 'multiple',
		name,
		form
	}: {
		label: string;
		image?: string;
		checked: boolean;
		onchange: () => void;
		mode?: 'multiple' | 'single';
		name?: string;
		form?: string;
	} = $props();
</script>

<label class="filter-choice">
	<span class="filter-choice__check" class:filter-choice__check--radio={mode === 'single'}>
		<input type={mode === 'single' ? 'radio' : 'checkbox'} {name} {form} {checked} {onchange} />
		<Check size={14} strokeWidth={3} aria-hidden="true" />
	</span>
	{#if image}<img src={assetHref(image)} alt="" width="36" height="28" />{/if}
	<span>{label}</span>
</label>

<style>
	.filter-choice {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-primary);
		padding: var(--bc-space-2) var(--bc-space-3);
		border-radius: var(--bc-radius-md);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		cursor: pointer;
	}
	.filter-choice:hover,
	.filter-choice:has(:checked) {
		background: var(--bc-surface);
	}
	.filter-choice:has(:checked) {
		font-weight: var(--bc-weight-heading);
	}
	.filter-choice:has(:focus-visible) {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.filter-choice__check {
		position: relative;
		display: grid;
		place-items: center;
		width: var(--bc-space-5);
		height: var(--bc-space-5);
		flex-shrink: 0;
		border: 1px solid var(--bc-muted);
		border-radius: var(--bc-radius-sm);
		background: var(--bc-surface-raised);
		color: var(--bc-white);
	}
	.filter-choice__check--radio {
		border-radius: var(--bc-radius-pill);
	}
	.filter-choice__check :global(svg) {
		visibility: hidden;
		pointer-events: none;
	}
	.filter-choice__check:has(:checked) {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
	}
	.filter-choice__check:has(:checked) :global(svg) {
		visibility: visible;
	}
	.filter-choice__check input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		margin: 0;
		width: 100%;
		height: 100%;
	}
	img {
		object-fit: contain;
		flex-shrink: 0;
	}
</style>
