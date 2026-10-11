<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { Snippet } from 'svelte';
	import HeroCars from './HeroCars.svelte';
	import MobilePageHero from './MobilePageHero.svelte';
	let {
		title,
		description,
		image,
		desktopImage,
		mobileTitle,
		mobileDescription,
		mobileActions,
		mobileAlign = 'start',
		vehicleArtwork = false,
		compact = false,
		artworkPanelWidth,
		titleId,
		class: className = '',
		desktopDescription,
		desktopActions,
		desktopSecondaryActions,
		children
	}: {
		title: string;
		description?: string;
		image?: string;
		desktopImage?: string;
		mobileTitle?: string;
		mobileDescription?: string;
		mobileActions?: Snippet;
		mobileAlign?: 'start' | 'center';
		vehicleArtwork?: boolean;
		compact?: boolean;
		artworkPanelWidth?: string;
		titleId?: string;
		class?: string;
		desktopDescription?: string;
		desktopActions?: Snippet<[string | undefined]>;
		desktopSecondaryActions?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<MobilePageHero
	title={mobileTitle ?? title}
	description={mobileDescription}
	{image}
	actions={mobileActions}
	align={mobileAlign}
/>
<section
	class={['site-intro', 'site-desktop-only', className]}
	class:site-intro--image={Boolean(image) || vehicleArtwork}
	class:site-intro--cars={vehicleArtwork}
	class:site-intro--compact={compact}
	style:--hero-panel-width={vehicleArtwork
		? 'var(--bc-desktop-discovery-width)'
		: artworkPanelWidth}
>
	{#if vehicleArtwork}<HeroCars />{/if}
	{#if image && !vehicleArtwork}<picture>
			<source media="(min-width: 768px)" srcset={assetHref(desktopImage ?? image)} />
			<img
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
				alt=""
				width="1920"
				height="640"
				fetchpriority="high"
			/></picture
		>{/if}
	<div class="site-container site-intro__content">
		<h1 id={titleId}>{title}</h1>
		{#if (desktopDescription ?? description) && (!vehicleArtwork || !desktopActions)}<p>
				{desktopDescription ?? description}
			</p>{/if}
		{#if desktopActions}<div class="site-intro__desktop-actions">
				{@render desktopActions(vehicleArtwork ? (desktopDescription ?? description) : undefined)}
			</div>{/if}
		{#if desktopSecondaryActions}<div class="site-intro__desktop-secondary">
				{@render desktopSecondaryActions()}
			</div>{/if}
		{#if children}<div class="site-intro__actions">
				{@render children()}
			</div>{/if}
	</div>
</section>

<style>
	.site-intro__desktop-actions,
	.site-intro__desktop-secondary {
		display: none;
	}
	.site-intro picture {
		display: contents;
	}
	.site-intro {
		position: relative;
		isolation: isolate;
		background: var(--bc-surface);
		padding-block: var(--bc-section-sm);
	}
	.site-intro--image {
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
	}
	.site-intro img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.site-intro--image::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(90deg, rgb(9 10 11 / 0.9), rgb(9 10 11 / 0.2));
	}
	h1 {
		max-width: 26ch;
		margin: 0;
		font: var(--bc-weight-heading) clamp(2rem, 3.5vw, 3.25rem)/1.12 var(--bc-font-heading);
	}
	p {
		max-width: 62ch;
		margin: var(--bc-space-3) 0 0;
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	.site-intro__actions {
		margin-top: var(--bc-space-5);
	}
	@media (min-width: 768px) {
		.site-intro {
			--action-glass-surface: var(--bc-desktop-hero-quiet-surface);
			--action-glass-hover: var(--bc-desktop-hero-quiet-hover);
			--action-glass-border: var(--bc-desktop-hero-quiet-border);
			--action-glass-ink: var(--bc-desktop-hero-ink);
			--action-glass-hover-border: var(--bc-desktop-hero-copy);
			background: var(--bc-desktop-hero-surface);
			color: var(--bc-desktop-hero-ink);
			width: min(calc(100% - var(--bc-page-x) * 2), var(--bc-container-page));
			margin-inline: auto;
			border-radius: var(--bc-desktop-card-radius);
			overflow: hidden;
			padding-block: var(--bc-desktop-hero-padding-start) var(--bc-desktop-hero-padding-end);
			text-align: center;
		}
		.site-intro__content {
			display: grid;
			gap: var(--bc-desktop-hero-gap);
			width: calc(100% - var(--bc-space-6) * 2);
		}
		.site-intro--image::after {
			background: linear-gradient(180deg, rgb(9 10 11 / 0.62), rgb(9 10 11 / 0.72));
		}
		.site-intro--cars::after {
			display: none;
		}
		.site-intro--cars {
			container-type: inline-size;
		}
		.site-intro--image:not(.site-intro--cars) {
			--bc-desktop-hero-copy: var(--bc-white);
			color: var(--bc-white);
		}
		h1 {
			max-width: var(--bc-desktop-hero-title-width);
			margin-inline: auto;
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-hero-title);
			font-weight: var(--bc-desktop-title-weight);
			line-height: var(--bc-leading-h1);
			text-wrap: balance;
		}
		.site-intro--image {
			min-height: var(--bc-desktop-page-hero-height);
		}
		.site-intro--compact {
			min-height: var(--bc-desktop-intake-hero-height);
		}
		p {
			max-width: 76ch;
			margin: 0 auto;
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body-lg);
			color: var(--bc-desktop-hero-copy);
		}
		.site-intro__desktop-actions {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			gap: var(--bc-space-3);
			min-height: var(--bc-control-height-hero);
		}
		.site-intro__desktop-secondary {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: var(--bc-control-height-primary);
		}
		.site-intro__actions {
			margin-top: 0;
		}
	}
</style>
