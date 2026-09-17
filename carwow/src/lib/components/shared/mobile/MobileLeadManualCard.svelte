<script lang="ts">
	import MobileActionCardContent from './MobileActionCardContent.svelte';
	import { ArrowRight } from '@lucide/svelte';
	let {
		title,
		copy,
		image,
		label,
		action,
		photo = false,
		onOpen
	}: {
		title: string;
		copy: string;
		image: string;
		label: string;
		action: string;
		photo?: boolean;
		onOpen: () => void;
	} = $props();
</script>

<button
	class="lead-manual-card"
	class:lead-manual-card--photo={photo}
	type="button"
	onclick={onOpen}
	aria-label={label}
>
	{#if photo}
		<img src={image} alt="" width="960" height="640" />
		<span class="lead-manual-card__copy">
			<strong>{title}</strong>
			<span>{copy}</span>
			<span class="lead-manual-card__action"
				>{action} <ArrowRight size={16} aria-hidden="true" /></span
			>
		</span>
	{:else}
		<MobileActionCardContent {title} {copy} {image} {action} />
	{/if}
</button>

<style>
	.lead-manual-card {
		display: block;
		width: 100%;
		border: 0;
		border-radius: 14px;
		padding: 0;
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.lead-manual-card:active {
		opacity: 0.9;
	}
	.lead-manual-card--photo {
		position: relative;
		min-height: 190px;
		overflow: hidden;
		background: #efede9;
		text-align: left;
		color: var(--sa-ink);
	}
	.lead-manual-card--photo > img {
		position: absolute;
		inset: 0 auto 0 36px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		mask-image: linear-gradient(to right, transparent, #000 36px);
	}
	.lead-manual-card__copy {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 9px;
		width: 57%;
		padding: 18px 0 18px 16px;
	}
	.lead-manual-card__copy > strong {
		max-width: 140px;
		font-size: var(--sa-text-card-title);
		line-height: 1.1;
		letter-spacing: -0.5px;
	}
	.lead-manual-card__copy > span:not(.lead-manual-card__action) {
		max-width: 135px;
		font-size: var(--sa-text-caption);
		line-height: 1.35;
		color: #45505b;
	}
	.lead-manual-card__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 42px;
		margin-top: 5px;
		padding: 0 14px;
		border-radius: 999px;
		background: var(--sa-red);
		color: #fff;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
	}
	.lead-manual-card:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
</style>
