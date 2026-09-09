<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		src: string;
		title: string;
		id?: string;
		class?: string;
		iframeClass?: string;
		iframeStyle?: string;
		width?: string;
		height?: string;
		rootMargin?: string;
		loadOnViewport?: boolean;
		loadOnInteraction?: boolean;
		dataMapZoom?: string;
		dataMapScroll?: string;
		children?: Snippet;
	}

	let {
		src,
		title,
		id,
		class: className = '',
		iframeClass = '',
		iframeStyle = 'border:0;width: 100%;',
		width = '100%',
		height = '320px',
		rootMargin = '0px',
		loadOnViewport = true,
		loadOnInteraction = true,
		dataMapZoom,
		dataMapScroll,
		children
	}: Props = $props();

	let host: HTMLDivElement | undefined = $state();
	let shouldLoad = $state(false);

	const hostClass = $derived(['lazy-map-embed', className].filter(Boolean).join(' '));
	const cssHeight = $derived(/^\d+$/.test(height) ? `${height}px` : height);

	function load() {
		shouldLoad = true;
	}

	function handleInteraction() {
		if (loadOnInteraction) {
			load();
		}
	}

	function interactionLoader(): Attachment<HTMLDivElement> {
		return (node) => {
			if (!loadOnInteraction) return;

			node.addEventListener('pointerenter', handleInteraction);
			node.addEventListener('focusin', handleInteraction);

			return () => {
				node.removeEventListener('pointerenter', handleInteraction);
				node.removeEventListener('focusin', handleInteraction);
			};
		};
	}

	$effect(() => {
		if (shouldLoad || !loadOnViewport || !host) return;

		if (!('IntersectionObserver' in window)) {
			load();
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				load();
				observer.disconnect();
			},
			{ rootMargin }
		);

		observer.observe(host);

		return () => observer.disconnect();
	});
</script>

<div
	{id}
	bind:this={host}
	class={hostClass}
	{@attach interactionLoader()}
	style:--lazy-map-height={cssHeight}
	data-map-zoom={dataMapZoom}
	data-map-scroll={dataMapScroll}
>
	{#if shouldLoad}
		<iframe
			class={iframeClass}
			{title}
			{src}
			{width}
			{height}
			style={iframeStyle}
			allowfullscreen
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	{/if}
	<noscript>
		<iframe
			class={iframeClass}
			{title}
			{src}
			{width}
			{height}
			style={iframeStyle}
			allowfullscreen
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	</noscript>
	{@render children?.()}
</div>

<style>
	.lazy-map-embed {
		min-height: var(--lazy-map-height, 320px);
		position: relative;
	}

	.lazy-map-embed iframe {
		display: block;
		min-height: var(--lazy-map-height, 320px);
		width: 100%;
	}
</style>
