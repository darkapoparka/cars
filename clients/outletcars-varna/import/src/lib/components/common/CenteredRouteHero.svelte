<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowRight } from '@lucide/svelte';
	import RouteHeroCopy from './RouteHeroCopy.svelte';
	import RouteHeroMedia from './RouteHeroMedia.svelte';

	let {
		children,
		supportText,
		supportHref,
		supportLabel,
		image,
		leftImage,
		rightImage,
		portraitSide,
		labelledby,
		title,
		mobileTitle = title,
		mobileDescription,
		mobileTone = 'night'
	}: {
		children?: Snippet;
		supportText?: string;
		supportHref?: string;
		supportLabel?: string;
		image: string;
		leftImage?: string;
		rightImage?: string;
		portraitSide?: 'left' | 'right';
		labelledby: string;
		title: string;
		mobileTitle?: string;
		mobileDescription?: string;
		mobileTone?: 'night' | 'sun';
	} = $props();
</script>

<section
	class="daynight-centered-route-hero"
	data-mobile-tone={mobileTone}
	aria-labelledby={labelledby}
>
	<RouteHeroMedia {image} {leftImage} {rightImage} {portraitSide} />
	<div class="daynight-centered-route-hero__content">
		<RouteHeroCopy {labelledby} {title} {mobileTitle} {mobileDescription} />
		<div class="daynight-centered-route-hero__action">
			{#if children}{@render children()}{/if}
		</div>
		{#if supportText}
			<div class="route-hero-support">
				<p>{supportText}</p>
				{#if supportHref && supportLabel}
					<a href={supportHref}>{supportLabel}<ArrowRight size={16} aria-hidden="true" /></a>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.daynight-centered-route-hero {
		--daynight-route-hero-heading: #fff;
		--daynight-route-hero-focus: #fff;
		position: relative;
		isolation: isolate;
		min-height: 220px;
		background: var(--bc-accent);
		color: #fff;
	}
	.daynight-centered-route-hero:has(:global(.ifp--open)) {
		z-index: 80;
	}
	.daynight-centered-route-hero__content {
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		width: min(680px, calc(100% - 48px));
		margin-inline: auto;
		padding-block: 24px;
	}
	.daynight-centered-route-hero__action {
		display: flex;
		min-height: 56px;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 16px;
	}
	.daynight-centered-route-hero__action :global(.daynight-route-hero-cta) {
		display: inline-flex;
		min-height: 56px;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 0 24px;
		border: 1px solid #fff;
		border-radius: 10px;
		background: #fff;
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 650;
		line-height: 24px;
		white-space: nowrap;
		text-decoration: none;
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}
	.daynight-centered-route-hero__action :global(.daynight-route-hero-cta--secondary) {
		border-color: rgb(255 255 255 / 0.65);
		background: transparent;
		color: #fff;
	}
	.daynight-centered-route-hero :global(.route-hero-search-submit) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		height: 44px;
		min-width: 120px;
		padding: 0 24px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #fff;
		font: inherit;
		font-size: 16px;
		font-weight: 650;
		line-height: 24px;
		white-space: nowrap;
		cursor: pointer;
	}
	.daynight-centered-route-hero :global(.route-hero-search-submit:hover) {
		background: #303030;
	}
	.daynight-centered-route-hero :global(.route-hero-search-submit:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.route-hero-support {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		min-height: 40px;
		margin-top: 12px;
	}
	.route-hero-support p {
		margin: 0;
		color: #fff;
		font-size: 16px;
		line-height: 24px;
		text-align: center;
	}
	.route-hero-support a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-shrink: 0;
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid rgb(255 255 255 / 0.7);
		border-radius: 10px;
		background: rgb(255 255 255 / 0.08);
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		text-decoration: none;
	}
	.route-hero-support a:hover {
		background: #fff;
		color: var(--bc-ink);
	}
	.route-hero-support a:focus-visible,
	.daynight-centered-route-hero :global(.daynight-route-hero-cta:focus-visible) {
		outline: 2px solid #fff;
		outline-offset: 4px;
	}
	.daynight-centered-route-hero :global(.daynight-route-hero-cta:hover) {
		background: #fff;
		color: var(--bc-accent);
	}

	@media (max-width: 767px) {
		.daynight-centered-route-hero {
			min-height: 292px;
			background: #090a0b;
		}
		.daynight-centered-route-hero[data-mobile-tone='sun'] {
			--daynight-route-hero-heading: var(--bc-ink);
			background: var(--bc-sun);
			color: var(--bc-ink);
		}
		.daynight-centered-route-hero__content {
			width: calc(100% - 32px);
			padding-block: 36px;
		}
		.daynight-centered-route-hero__action {
			min-height: 46px;
			margin-top: 22px;
		}
		.daynight-centered-route-hero__action :global(.daynight-route-hero-cta) {
			min-height: 50px;
			padding-inline: 20px;
			border-color: var(--bc-accent);
			background: var(--bc-accent);
			color: #fff;
			font-size: 15px;
		}
		.daynight-centered-route-hero__action :global(.daynight-route-hero-cta--secondary),
		.daynight-centered-route-hero__action :global(.daynight-route-hero-cta svg),
		.route-hero-support {
			display: none;
		}
	}
</style>
