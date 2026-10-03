<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { assetHref, emptyImage } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	let {
		href,
		label,
		context,
		artwork,
		desktopOnly = false
	}: {
		href: string;
		label: string;
		context?: string;
		artwork?: { src: string; width: number; height: number };
		desktopOnly?: boolean;
	} = $props();
</script>

<a
	class="home-browse-card"
	class:home-browse-card--desktop-only={desktopOnly}
	href={linkHref(href)}
	aria-label={context ? `${label}: ${context}` : label}
>
	{#if artwork}
		<picture class="home-browse-card__artwork" aria-hidden="true">
			<source media="(min-width: 768px)" srcset={assetHref(artwork.src)} />
			<img
				src={emptyImage}
				alt=""
				width={artwork.width}
				height={artwork.height}
				loading="lazy"
				decoding="async"
			/>
		</picture>
	{/if}
	<ArrowRight size={32} aria-hidden="true" /><strong>{label}</strong>
</a>

<style>
	.home-browse-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-4);
		min-width: 0;
		padding: var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		text-decoration: none;
		scroll-snap-align: start;
		font-size: var(--bc-text-body-lg);
	}
	.home-browse-card:hover {
		border-color: var(--bc-border-strong);
	}
	.home-browse-card:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: -3px;
	}
	.home-browse-card__artwork {
		display: none;
	}
	@media (max-width: 767.98px) {
		.home-browse-card--desktop-only {
			display: none;
		}
	}
	@media (min-width: 768px) {
		.home-browse-card__artwork {
			display: block;
			width: 100%;
		}
		.home-browse-card__artwork img {
			display: block;
			width: 100%;
			height: auto;
		}
		.home-browse-card {
			gap: var(--bc-space-5);
			min-height: 160px;
			box-shadow: var(--bc-shadow-subtle);
			transition:
				background-color var(--bc-motion-fast),
				border-color var(--bc-motion-fast);
		}
		.home-browse-card strong {
			font: var(--bc-weight-control) var(--bc-text-h5)/var(--bc-leading-h5) var(--bc-font-body);
			text-align: center;
		}
		.home-browse-card :global(svg) {
			width: var(--bc-control-height-primary);
			height: var(--bc-control-height-primary);
			padding: var(--bc-space-3);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
			color: var(--bc-accent);
		}
		.home-browse-card:hover {
			background: var(--bc-surface-hover);
		}
	}
	@media (min-width: 768px) and (prefers-reduced-motion: reduce) {
		.home-browse-card {
			transition: none;
		}
	}
</style>
