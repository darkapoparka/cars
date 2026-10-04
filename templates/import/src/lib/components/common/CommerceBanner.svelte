<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		title,
		body = '',
		action,
		href,
		image,
		logo,
		compact = false,
		onclick
	}: {
		title: string;
		body?: string;
		action: string;
		href: string;
		image: string;
		logo?: string;
		compact?: boolean;
		onclick?: (event: MouseEvent) => void;
	} = $props();
</script>

<a class="commerce-banner" class:commerce-banner--compact={compact} {href} {onclick}>
	<img
		class="commerce-banner__image"
		src={assetHref(`${image}.webp`)}
		srcset={`${assetHref(`${image}-small.webp`)} 360w, ${assetHref(`${image}.webp`)} 720w, ${assetHref(`${image}-large.webp`)} 1080w`}
		sizes={compact
			? 'min(100vw - 32px, 480px)'
			: '(max-width: 767px) calc(100vw - 28px), (max-width: 1179px) calc(100vw - 64px), 560px'}
		alt=""
		width="720"
		height="405"
		loading="lazy"
		decoding="async"
	/>
	<div class="commerce-banner__copy">
		{#if logo}
			<img
				class="commerce-banner__logo"
				src={assetHref(logo)}
				alt=""
				aria-hidden="true"
				width="112"
				height="32"
				loading="lazy"
				decoding="async"
			/>
		{/if}
		<h3>{title}</h3>
		{#if body}<p>{body}</p>{/if}
		<span class="commerce-banner__action">{action}<ArrowRight size={18} aria-hidden="true" /></span>
	</div>
</a>

<style>
	.commerce-banner {
		position: relative;
		isolation: isolate;
		display: grid;
		aspect-ratio: 16 / 9;
		min-height: 260px;
		padding: 28px;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background: #101113;
		color: var(--bc-white);
		text-decoration: none;
	}
	.commerce-banner__image {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: right center;
	}
	.commerce-banner__logo {
		display: none;
	}
	.commerce-banner__copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		min-width: 0;
	}
	h3 {
		max-width: 100%;
		margin: 0;
		color: inherit;
		font: var(--bc-weight-heading) 32px/1.15 var(--bc-font-body);
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	p {
		max-width: 46%;
		margin: 0;
		color: rgb(255 255 255 / 0.85);
		font-size: 16px;
		line-height: 1.45;
	}
	.commerce-banner__action {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		margin-top: auto;
		padding: 10px 16px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: var(--bc-weight-control);
		line-height: 20px;
	}
	.commerce-banner:hover,
	.commerce-banner:focus-visible {
		color: var(--bc-white);
	}
	.commerce-banner:hover .commerce-banner__action {
		background: var(--bc-surface);
	}
	.commerce-banner--compact {
		/* A ratio-sized grid item can outgrow the menu's reserved row height. */
		aspect-ratio: auto;
		width: 100%;
		min-width: 0;
		min-height: 144px;
		padding: 16px;
	}
	.commerce-banner--compact h3 {
		font-size: 22px;
	}
	@media (min-width: 768px) {
		.commerce-banner__logo {
			display: block;
			width: 112px;
			height: 32px;
			flex: none;
			object-fit: contain;
			object-position: left center;
		}
		.commerce-banner:not(.commerce-banner--compact) {
			aspect-ratio: auto;
			min-height: 260px;
			padding: var(--bc-space-6);
		}
		h3 {
			font-size: var(--bc-text-h3);
		}
		p {
			font-size: var(--bc-text-body-lg);
		}
		.commerce-banner__action {
			font-size: var(--bc-text-control);
			min-height: var(--bc-control-height-primary);
		}
	}
	@media (max-width: 767px) {
		.commerce-banner {
			min-height: 0;
			padding: 16px;
		}
		h3 {
			font-size: clamp(20px, 5.8vw, 24px);
		}
		p {
			display: none;
		}
		.commerce-banner--compact {
			min-height: 144px;
		}
	}
</style>
