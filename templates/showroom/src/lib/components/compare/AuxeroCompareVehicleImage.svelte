<script lang="ts">
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import { onMount } from 'svelte';

	let { src, title }: { src: string; title: string } = $props();

	let imageElement = $state<HTMLImageElement>();

	const applyFallback = (image: HTMLImageElement | undefined) => {
		if (!image || image.src.endsWith(eliqautoAssets.hero)) {
			return;
		}

		image.src = eliqautoAssets.hero;
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
