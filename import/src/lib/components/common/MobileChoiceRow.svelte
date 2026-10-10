<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { assetHref } from '$lib/utils/assets';

	let {
		label,
		selected = false,
		multiple = false,
		count,
		image,
		imageKind = 'logo',
		onselect
	}: {
		label: string;
		selected?: boolean;
		multiple?: boolean;
		count?: number;
		image?: string;
		imageKind?: 'logo' | 'flag';
		onselect: () => void;
	} = $props();
</script>

<button type="button" class="mobile-choice-row" aria-pressed={selected} onclick={onselect}>
	{#if image}
		<img
			class="mobile-choice-row__image"
			class:flag={imageKind === 'flag'}
			src={assetHref(image)}
			alt=""
			width={imageKind === 'flag' ? 24 : 28}
			height={imageKind === 'flag' ? 18 : 28}
		/>
	{/if}
	<span class="mobile-choice-row__content">
		<span class="mobile-choice-row__label">{label}</span>
		{#if count !== undefined}<small class="mobile-choice-row__count">({count})</small>{/if}
	</span>
	<span class="mobile-choice-row__mark" class:multiple class:selected aria-hidden="true">
		{#if selected}<Check size={18} strokeWidth={2.2} />{/if}
	</span>
</button>

<style>
	.mobile-choice-row {
		position: relative;
		display: flex;
		width: 100%;
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-3);
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: var(--bc-space-2) var(--bc-space-3);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-control)/var(--bc-leading-control)
			var(--bc-font-body);
		text-align: left;
		cursor: pointer;
		appearance: none;
	}
	.mobile-choice-row__content {
		display: inline-flex;
		min-width: 0;
		flex: 1;
		align-items: baseline;
		gap: var(--bc-space-2);
	}
	.mobile-choice-row__label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mobile-choice-row__count {
		flex: 0 0 auto;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		font-variant-numeric: tabular-nums;
	}
	.mobile-choice-row__image {
		width: 28px;
		height: 28px;
		flex: 0 0 auto;
		object-fit: contain;
	}
	.mobile-choice-row__image.flag {
		width: 24px;
		height: 18px;
		border-radius: var(--bc-radius-xs);
		object-fit: cover;
	}
	.mobile-choice-row__mark {
		display: grid;
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		place-items: center;
		margin-left: auto;
	}
	.mobile-choice-row:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: -2px;
	}
	@media (min-width: 768px) {
		.mobile-choice-row[aria-pressed='true'] {
			font-weight: var(--bc-weight-emphasis);
		}
	}
	@media (max-width: 767.98px) {
		.mobile-choice-row {
			min-height: var(--bc-mobile-choice-row-height);
			padding: var(--bc-space-3);
		}
		.mobile-choice-row__mark {
			width: var(--bc-mobile-choice-mark-size);
			height: var(--bc-mobile-choice-mark-size);
			box-sizing: border-box;
			border: 1.5px solid var(--bc-border-strong);
			border-radius: 50%;
		}
		.mobile-choice-row__mark :global(svg) {
			display: none;
		}
		.mobile-choice-row__mark.selected {
			border-color: var(--bc-accent);
			background: var(--bc-accent);
			box-shadow: inset 0 0 0 4px var(--bc-white);
		}
		.mobile-choice-row__mark.multiple.selected {
			color: var(--bc-white);
			box-shadow: none;
		}
		.mobile-choice-row__mark.multiple.selected :global(svg) {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
</style>
