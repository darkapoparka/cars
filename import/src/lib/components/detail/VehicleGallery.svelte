<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { imageFallback } from '$lib/browser/image-fallback';
	import { onMount } from 'svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Expand from '@lucide/svelte/icons/expand';
	import Modal from '$lib/components/common/Modal.svelte';
	let {
		images,
		title,
		english = false
	}: { images: string[]; title: string; english?: boolean } = $props();
	let selected = $state(0);
	let open = $state(false);
	const gallery = $derived(
		images.length ? [...new Set(images)] : ['/assets/vehicle-placeholder.svg']
	);
	const current = $derived(gallery[Math.min(selected, gallery.length - 1)]);
	const change = (delta: number) =>
		(selected = (selected + delta + gallery.length) % gallery.length);
	onMount(() => {
		const listener = (event: KeyboardEvent) => {
			if (!open || /INPUT|TEXTAREA/.test((event.target as HTMLElement)?.tagName)) return;
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				change(-1);
			}
			if (event.key === 'ArrowRight') {
				event.preventDefault();
				change(1);
			}
		};
		window.addEventListener('keydown', listener);
		return () => window.removeEventListener('keydown', listener);
	});
</script>

<section class="gallery" aria-label={english ? 'Vehicle photographs' : 'Снимки на автомобила'}>
	<button
		type="button"
		class="gallery__hero"
		onclick={() => (open = true)}
		aria-label={english ? 'Open full-size photo' : 'Отвори снимката'}
	>
		<img
			src={assetHref(current)}
			alt={title}
			width="1200"
			height="800"
			fetchpriority="high"
			decoding="async"
			use:imageFallback
		/>
		<span class="gallery__expand"
			><Expand size={18} aria-hidden="true" /> {selected + 1} / {gallery.length}</span
		>
	</button>
	{#if gallery.length > 1}
		<div class="gallery__thumbnails">
			{#each gallery as image, index (image)}
				<button
					type="button"
					aria-label={(english ? 'Photo ' : 'Снимка ') + (index + 1)}
					aria-pressed={index === selected}
					onclick={() => (selected = index)}
				>
					<img
						src={assetHref(image)}
						alt=""
						width="180"
						height="120"
						loading="lazy"
						decoding="async"
						use:imageFallback
					/>
				</button>
			{/each}
		</div>
	{/if}
</section>
<Modal bind:open {title} wide class="vehicle-gallery-dialog">
	<div class="gallery__viewer">
		<img src={assetHref(current)} alt={title} width="1200" height="800" use:imageFallback />
		{#if gallery.length > 1}
			<div class="gallery__controls">
				<button
					type="button"
					onclick={() => change(-1)}
					aria-label={english ? 'Previous photo' : 'Предишна снимка'}
					><ChevronLeft aria-hidden="true" /></button
				>
				<span aria-live="polite">{selected + 1} / {gallery.length}</span>
				<button
					type="button"
					onclick={() => change(1)}
					aria-label={english ? 'Next photo' : 'Следваща снимка'}
					><ChevronRight aria-hidden="true" /></button
				>
			</div>
		{/if}
	</div>
</Modal>

<style>
	@media (min-width: 768px) {
		:global(.vehicle-gallery-dialog) {
			width: min(1120px, calc(100vw - 2 * var(--bc-space-6)));
		}
		.gallery__viewer {
			background: var(--bc-ink);
			padding: var(--bc-space-3);
			border-radius: var(--bc-radius-md);
			color: var(--bc-white);
		}
		.gallery__viewer .gallery__controls button {
			border-radius: var(--bc-radius-md);
			min-width: var(--bc-control-height-primary);
			height: var(--bc-control-height-primary);
		}
	}
	.gallery {
		display: grid;
		gap: var(--bc-space-3);
		min-width: 0;
	}
	.gallery__hero {
		position: relative;
		display: block;
		border: 0;
		padding: 0;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 1.5;
		background: var(--bc-card-media);
		border-radius: var(--bc-radius-panel);
	}
	.gallery__hero img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.gallery__expand {
		position: absolute;
		bottom: var(--bc-space-4);
		right: var(--bc-space-4);
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
		padding: var(--bc-space-2) var(--bc-space-3);
		border-radius: var(--bc-radius-control);
	}
	.gallery__thumbnails {
		display: flex;
		gap: var(--bc-space-2);
		overflow-x: auto;
		padding: var(--bc-space-1);
	}
	.gallery__thumbnails button {
		flex: 0 0 104px;
		border: 2px solid transparent;
		padding: 0;
		border-radius: var(--bc-radius-md);
		overflow: hidden;
		background: var(--bc-card-media);
	}
	.gallery__thumbnails button[aria-pressed='true'] {
		border-color: var(--bc-accent);
	}
	.gallery__thumbnails img {
		display: block;
		width: 100%;
		height: 70px;
		object-fit: cover;
	}
	.gallery__viewer img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 65dvh;
		object-fit: contain;
	}
	.gallery__controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: var(--bc-space-3);
	}
	.gallery__controls button {
		display: grid;
		place-items: center;
		min-width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface);
		color: var(--bc-ink);
	}
</style>
