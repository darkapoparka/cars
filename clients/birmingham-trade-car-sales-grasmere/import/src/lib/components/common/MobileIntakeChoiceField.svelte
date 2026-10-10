<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { assetHref } from '$lib/utils/assets';

	let {
		id,
		label,
		value = '',
		placeholder,
		flag,
		disabled = false,
		invalid = false,
		describedBy,
		onopen
	}: {
		id: string;
		label: string;
		value?: string;
		placeholder: string;
		flag?: string;
		disabled?: boolean;
		invalid?: boolean;
		describedBy?: string;
		onopen: () => void;
	} = $props();
</script>

<div class="mobile-intake-field" data-intake-field>
	<span class="mobile-intake-field__label">{label}</span>
	<button
		{id}
		type="button"
		aria-label={`${label}: ${value || placeholder}`}
		data-invalid={invalid || undefined}
		aria-describedby={describedBy}
		{disabled}
		onclick={onopen}
	>
		{#if flag}<img src={assetHref(flag)} alt="" width="20" height="14" />{/if}
		<span class:mobile-intake-field__placeholder={!value}>{value || placeholder}</span>
		<ChevronDown size={18} strokeWidth={2.1} aria-hidden="true" />
	</button>
</div>

<style>
	.mobile-intake-field {
		display: grid;
		min-width: 0;
		gap: 5px;
	}
	.mobile-intake-field__label {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
	}
	button {
		display: flex;
		width: 100%;
		min-width: 0;
		min-height: var(--bc-control-height-chip);
		align-items: center;
		gap: 10px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-control);
		text-align: left;
		padding: 0 11px;
		cursor: pointer;
	}
	button > span {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	button > img,
	button :global(svg) {
		flex: 0 0 auto;
	}
	button > img {
		border-radius: 2px;
		object-fit: cover;
	}
	.mobile-intake-field__placeholder,
	button:disabled {
		color: var(--bc-muted);
	}
	button:disabled {
		cursor: default;
	}
	button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	button[data-invalid='true'] {
		box-shadow: inset 0 0 0 2px var(--bc-danger);
	}
</style>
