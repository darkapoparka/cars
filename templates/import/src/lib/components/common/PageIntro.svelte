<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { Snippet } from 'svelte';
	let {
		title,
		description,
		image,
		desktopImage,
		align = 'start',
		desktopDescription,
		desktopActions,
		desktopSecondaryActions,
		children
	}: {
		title: string;
		description?: string;
		image?: string;
		desktopImage?: string;
		align?: 'start' | 'center';
		desktopDescription?: string;
		desktopActions?: Snippet;
		desktopSecondaryActions?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<section
	class="site-intro"
	class:site-intro--image={Boolean(image)}
	class:site-intro--center={align === 'center'}
	class:site-intro--interactive={Boolean(desktopActions)}
>
	{#if image}<picture>
			{#if desktopImage}<source media="(min-width: 768px)" srcset={assetHref(desktopImage)} />{/if}
			<img src={assetHref(image)} alt="" width="1920" height="640" fetchpriority="high" /></picture
		>{/if}
	<div class="site-container site-intro__content">
		<h1>{title}</h1>
		{#if description}<p>{description}</p>{:else if desktopDescription}<p
				class="site-intro__desktop-description"
			>
				{desktopDescription}
			</p>{/if}
		{#if desktopActions}<div class="site-intro__desktop-actions">
				{@render desktopActions()}
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
	.site-intro__desktop-description,
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
	.site-intro--center {
		text-align: center;
	}
	.site-intro--center h1,
	.site-intro--center p {
		margin-inline: auto;
	}
	.site-intro--center h1 {
		max-width: 32ch;
	}
	.site-intro--center.site-intro--image::after {
		background: linear-gradient(180deg, rgb(9 10 11 / 0.62), rgb(9 10 11 / 0.72));
	}
	@media (min-width: 768px) {
		.site-intro--image {
			display: flex;
			align-items: center;
			min-height: var(--bc-desktop-page-hero-height);
			padding-block: var(--bc-space-8);
		}
		.site-intro--interactive .site-intro__content {
			display: grid;
			gap: var(--bc-space-5);
		}
		.site-intro--interactive p {
			min-height: 2lh;
			margin-block: 0;
		}
		.site-intro__desktop-description {
			display: block;
		}
		.site-intro__desktop-actions {
			display: flex;
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
		.site-intro--center .site-intro__desktop-actions {
			justify-content: center;
		}
	}
</style>
