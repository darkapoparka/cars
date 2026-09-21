<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { Snippet } from 'svelte';
	let {
		title,
		description,
		image,
		align = 'start',
		children
	}: {
		title: string;
		description?: string;
		image?: string;
		align?: 'start' | 'center';
		children?: Snippet;
	} = $props();
</script>

<section
	class="site-intro"
	class:site-intro--image={Boolean(image)}
	class:site-intro--center={align === 'center'}
>
	{#if image}<img
			src={assetHref(image)}
			alt=""
			width="1920"
			height="640"
			fetchpriority="high"
		/>{/if}
	<div class="site-container site-intro__content">
		<h1>{title}</h1>
		{#if description}<p>{description}</p>{/if}{#if children}<div class="site-intro__actions">
				{@render children()}
			</div>{/if}
	</div>
</section>

<style>
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
</style>
