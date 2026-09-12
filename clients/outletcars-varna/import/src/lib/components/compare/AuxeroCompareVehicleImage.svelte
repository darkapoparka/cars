<script lang="ts">
	import { daynightAssets } from '$lib/data/daynight';
	import { onMount } from 'svelte';

	let { src, title }: { src: string; title: string } = $props();

	let imageElement = $state<HTMLImageElement>();

	const applyFallback = (image: HTMLImageElement | undefined) => {
		if (!image || image.src.endsWith(daynightAssets.hero)) {
			return;
		}

		image.src = daynightAssets.hero;
	};

	onMount(() => {
		const image = imageElement;
		const handleError = () => {
			applyFallback(image);
		};

		image?.addEventListener('error', handleError);
		if (image?.complete && image.naturalWidth === 0) {
			applyFallback(image);
		}

		return () => {
			image?.removeEventListener('error', handleError);
		};
	});
</script>

<img bind:this={imageElement} class="radius-16 image mb-10" {src} alt={title} />
