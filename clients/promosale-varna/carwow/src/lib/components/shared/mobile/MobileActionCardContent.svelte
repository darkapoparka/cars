<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	let {
		title,
		copy,
		image,
		action,
		tone = 'light',
		artwork = 'photo'
	}: {
		title: string;
		copy?: string;
		image: string;
		action: string;
		tone?: 'light' | 'dark' | 'red';
		artwork?: 'photo' | 'cutout' | 'portrait';
	} = $props();
</script>

<span
	class:action-card--dark={tone !== 'light'}
	class:action-card--red={tone === 'red'}
	class:action-card--cutout={artwork !== 'photo'}
	class:action-card--portrait={artwork === 'portrait'}
	class:action-card--compact={!copy}
	class="action-card"
>
	<span class="action-card__copy">
		<strong>{title}</strong>
		{#if copy}<small>{copy}</small>{/if}
		<span class="action-card__action"
			>{action}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" /></span
		>
	</span>
	<img class="action-card__image" src={image} alt="" loading="lazy" decoding="async" />
</span>

<style>
	.action-card {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		min-height: 144px;
		overflow: hidden;
		border-radius: 14px;
		background: #f0f2f4;
		color: var(--sa-ink);
		text-align: left;
	}
	.action-card--dark {
		background: var(--action-card-background, #111315);
		color: #fff;
	}
	.action-card--red {
		background: var(--sa-red);
	}
	.action-card__copy {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		padding: 16px 12px 12px 16px;
	}
	strong {
		color: inherit !important;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.16;
		text-wrap: balance;
	}
	small {
		color: #4f5966;
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-regular);
		line-height: var(--sa-mobile-leading-body);
	}
	.action-card--dark small {
		color: #d5d8dc;
	}
	.action-card--red small {
		color: #fff;
	}
	.action-card__action {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 36px;
		margin-top: auto;
		color: var(--sa-red) !important;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
		line-height: 1.2;
	}
	.action-card--dark .action-card__action {
		color: #fff !important;
	}
	.action-card--dark strong {
		color: #fff !important;
	}
	.action-card__action :global(svg),
	.action-card__action :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	.action-card__action :global(svg) {
		flex: 0 0 auto;
	}
	.action-card__image {
		width: 100%;
		height: 100%;
		min-height: 144px;
		object-fit: var(--action-card-image-fit, cover);
		object-position: var(--action-card-image-position, 72% center);
	}
	@media (max-width: 359px) {
		.action-card {
			grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		}
		.action-card__copy {
			padding: 14px 10px 10px 14px;
		}
	}
	.action-card--cutout {
		position: relative;
		display: block;
		padding: 16px;
	}
	.action-card--cutout .action-card__copy {
		position: relative;
		z-index: 1;
		padding: 0;
	}
	.action-card--cutout strong {
		text-wrap: initial;
	}
	.action-card--cutout small {
		max-width: 70%;
	}
	.action-card--cutout .action-card__action {
		margin-top: 6px;
		white-space: nowrap;
	}
	.action-card--cutout .action-card__image {
		position: absolute;
		right: -12px;
		bottom: -4px;
		width: 70%;
		height: 132px;
		max-width: none;
		min-height: 0;
		object-fit: cover;
		object-position: right center;
		pointer-events: none;
	}
	.action-card--cutout.action-card--compact {
		min-height: 144px;
	}
	.action-card--compact .action-card__action {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-regular);
	}
	.action-card--portrait .action-card__image {
		right: 0;
		bottom: 0;
		width: 48%;
		height: 104px;
		object-fit: contain;
		object-position: right bottom;
	}
</style>
