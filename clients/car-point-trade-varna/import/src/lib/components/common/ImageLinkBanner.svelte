<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { assetHref } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	let {
		image,
		href,
		heading,
		children,
		external = false,
		channel,
		class: className = ''
	}: {
		image: string;
		href: string;
		heading: Snippet;
		children: Snippet;
		external?: boolean;
		channel?: string;
		class?: string;
	} = $props();
	const desktop = new MediaQuery('(min-width: 768px)', false);
</script>

<a
	class={`image-link-banner ${className}`}
	href={linkHref(href)}
	data-channel={channel}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
>
	{#if desktop.current}
		<img src={assetHref(image)} alt="" width="960" height="540" loading="lazy" decoding="async" />
	{/if}
	<div class="image-link-banner__heading">{@render heading()}</div>
	<div class="image-link-banner__footer">
		<span>{@render children()}</span>
		<ArrowUpRight size={18} aria-hidden="true" />
	</div>
</a>

<style>
	.image-link-banner {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: space-between;
		gap: var(--bc-space-6);
		min-width: 0;
		min-height: 220px;
		padding: var(--bc-space-5);
		overflow: hidden;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-ink);
		color: var(--bc-white);
		text-decoration: none;
	}
	img,
	.image-link-banner::before {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
	}
	img {
		z-index: -2;
		object-fit: cover;
		object-position: right center;
	}
	.image-link-banner::before {
		content: '';
		background:
			linear-gradient(90deg, rgb(0 0 0 / 0.7), rgb(0 0 0 / 0.1)),
			linear-gradient(180deg, rgb(0 0 0 / 0.15) 40%, rgb(0 0 0 / 0.9));
	}
	.image-link-banner__heading {
		min-width: 0;
	}
	.image-link-banner__footer {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--bc-space-3);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	.image-link-banner:hover,
	.image-link-banner:focus-visible {
		color: var(--bc-white);
	}
	.image-link-banner:hover .image-link-banner__footer > span,
	.image-link-banner:focus-visible .image-link-banner__footer > span {
		text-decoration: underline;
		text-underline-offset: var(--bc-space-1);
	}
</style>
