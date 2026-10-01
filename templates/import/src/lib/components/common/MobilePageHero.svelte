<script lang="ts">
	import type { Snippet } from 'svelte';
	import { assetHref } from '$lib/utils/assets';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	let {
		title,
		description,
		image,
		titleId,
		headingLevel = 1,
		actions
	}: {
		title: string;
		description?: string;
		image?: string;
		titleId?: string;
		headingLevel?: 1 | 2;
		actions?: Snippet;
	} = $props();
</script>

<section
	class="mobile-page-hero"
	class:mobile-page-hero--image={Boolean(image)}
	data-mobile-page-hero
>
	{#if image}<picture
			><source media="(max-width: 767.98px)" srcset={assetHref(image)} /><img
				class="mobile-page-hero__image"
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
				alt=""
				width="1200"
				height="600"
				fetchpriority="high"
			/></picture
		>{/if}
	<MobileAppbar surface="dark" />
	<div class="mobile-page-hero__copy">
		<svelte:element this={headingLevel === 1 ? 'h1' : 'h2'} id={titleId}>{title}</svelte:element>
		{#if description}<p>{description}</p>{/if}
		{#if actions}<div class="mobile-page-hero__actions">{@render actions()}</div>{/if}
	</div>
</section>

<style>
	.mobile-page-hero {
		display: none;
	}
	@media (max-width: 767.98px) {
		.mobile-page-hero {
			display: block;
			position: relative;
			isolation: isolate;
			background: var(--bc-mobile-dark);
			color: var(--bc-white);
		}
		.mobile-page-hero__image {
			position: absolute;
			inset: 0;
			z-index: -2;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.mobile-page-hero--image::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background: linear-gradient(180deg, rgb(9 10 11 / 0.84), rgb(9 10 11 / 0.76));
		}
		.mobile-page-hero :global(.bc-mobile-appbar--dark) {
			background: transparent;
		}
		.mobile-page-hero__copy {
			display: grid;
			gap: var(--bc-space-2);
			padding: var(--bc-space-3) var(--bc-mobile-gutter) calc(var(--bc-space-6) + var(--bc-space-4));
		}
		.mobile-page-hero__copy > :global(h1),
		.mobile-page-hero__copy > :global(h2) {
			margin: 0;
			color: var(--bc-white);
			font: var(--bc-weight-heading) var(--bc-mobile-page-title)/var(--bc-mobile-page-title-leading)
				var(--bc-font-heading);
			letter-spacing: 0;
			overflow-wrap: anywhere;
		}
		p {
			margin: 0;
			color: var(--bc-dark-muted);
			font: var(--bc-weight-body) var(--bc-mobile-body)/var(--bc-mobile-body-leading)
				var(--bc-font-body);
		}
		.mobile-page-hero__actions {
			min-width: 0;
			margin-top: var(--bc-space-2);
		}
		.mobile-page-hero::after {
			content: '';
			position: absolute;
			inset: auto 0 0;
			height: var(--bc-space-6);
			border-radius: var(--bc-radius-section) var(--bc-radius-section) 0 0;
			background: var(--bc-bg-strong);
			pointer-events: none;
		}
	}
</style>
